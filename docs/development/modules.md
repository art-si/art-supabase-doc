# 业务模块协作

每个业务仓可以独立开发和构建，主平台通过 Git submodule 固定它的提交。公共运行时只在主仓维护，子仓不能复制认证、菜单、权限、布局、Store、核心组件或 Supabase 客户端。

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

## 独立运行

FMS/HR/SMIS/VMS/TMS 分别使用 3012–3016 开发端口，生产默认输出到各仓 `docs/` 并使用 `/art-supabase-<code>/` 公共路径。当前生产推荐仍由平台宿主统一聚合；跨域独立部署需要服务端一次性授权码 SSO，不能在 URL 中传 access token 或 refresh token。
