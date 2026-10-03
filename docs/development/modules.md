# 业务模块协作

每个 Web 业务仓可以独立开发和构建，主平台通过 Git submodule 固定它的提交。公共运行时只在主仓维护，子仓不能复制认证、菜单、权限、布局、Store、核心组件或 Supabase 客户端。司机端是独立的 uni-app 应用，不作为主仓子模块装载，通过 TMS 服务端契约参与同一条运单履约链路。

## 主仓命令

| 命令                   | 用途                          |
| ---------------------- | ----------------------------- |
| `pnpm modules:pull`    | 初始化并拉取 gitlink 锁定版本 |
| `pnpm modules:update`  | 更新到各子仓配置分支最新提交  |
| `pnpm modules:install` | 按各子仓 lockfile 安装依赖    |
| `pnpm modules:build`   | 依次构建全部子仓              |
| `pnpm modules:setup`   | 拉取、安装、构建一次完成      |

## 修改业务模块

1. 进入 `modules/art-supabase-<code>`。
2. 确认当前分支与工作区，修改该领域代码。
3. 在子仓运行格式、Lint、类型、测试和构建。
4. 在子仓提交并推送。
5. 返回主仓，确认 gitlink 指向新提交。
6. 运行主仓类型检查、权限审计、构建和相关 E2E。
7. 提交主仓的子模块指针更新。

```powershell
Set-Location modules/art-supabase-vms
pnpm check
pnpm build
git add .
git commit -m "feat: update vehicle workflow"
git push

Set-Location ../..
git add modules/art-supabase-vms
pnpm typecheck
pnpm build
```

## 新增子模块

远端仓必须至少有一个提交，然后在主仓执行：

```powershell
git submodule add -b master https://gitee.com/wangyanghub/example.git modules/example
```

检查 `.gitmodules`、gitlink 和克隆复现：

```powershell
git submodule status
git submodule update --init --recursive
```

## 跨模块数据

- 写入只由领域所有者提供。
- 读取使用用途明确的 RPC/Read Model。
- 只返回消费者需要的最小字段。
- RPC 校验用户、租户、业务权限和记录状态。
- 前端业务仓不直接引用另一个业务仓源码。

## 司机端协作

`supabase-mobile-tms-driver` 独立维护 H5 与微信小程序源码。它不复用 Web 主仓的组件、Store 或路由，而是复用同一套身份、租户和业务数据边界：

- 司机只能读取服务端判定为本人可见的任务、车辆与必要字段。
- 接单、取消、装卸货、发车、签收、完成和费用上报由 TMS/RPC/Edge Function 契约校验。
- Web 管理端与司机端共享业务记录，不分别维护两套状态机。
- 移动端发布不需要更新主仓 gitlink；接口或数据库契约变化必须同时验证两端。

## 独立运行

### 平台包与独立构建验证

模块 Vite 配置按显式 `ART_SUPABASE_PLATFORM_ROOT`、宿主主仓、相邻平台仓、安装的平台包依次定位运行时。在主仓目录内直接构建模块通常使用宿主源码，不能证明发布包完整。

平台 `package.json` 的 `files` 必须包含 `scripts/module-vite-config.mjs` 及其依赖的构建日志策略文件。修改平台公共 API 或共享组件后，需要检查实际打包清单，并强制模块指向解包后的平台运行时验证构建。模块目录内可这样核验已安装的平台包：

```powershell
$env:ART_SUPABASE_PLATFORM_ROOT = (Resolve-Path node_modules/art-supabase-pro).Path
pnpm build
Remove-Item Env:ART_SUPABASE_PLATFORM_ROOT
```

验证当前未提交的平台改动可使用主仓 `pnpm modules:build -- tms --workspace-platform`；它临时打包当前平台工作区供模块联调。宿主源码或包内源码构建复用本机依赖时，都不能代替全新目录内按锁文件安装、类型检查与构建的交付检查。

公共 API 重命名必须同时迁移模块调用方。独立发布时还需将模块锁定的平台版本与已发布的新 API 版本同步，不能假设旧平台归档包已包含工作区中的新导出。

FMS/HR/SMIS/VMS/TMS/MDM/WMS/MES/PMIS/SCM 分别使用 3012–3021 开发端口；端口与公共路径速查见[环境配置](/guide/configuration)。业务子仓生产默认输出到各仓 `docs/` 并使用 `/art-supabase-<code>/` 公共路径。司机端使用 `pnpm dev:h5` 或 `pnpm dev:mp-weixin` 独立运行。当前 Web 业务生产推荐仍由平台宿主统一聚合；跨域独立部署需要服务端一次性授权码 SSO，不能在 URL 中传 access token 或 refresh token。
