# 快速开始

本页用于把主项目在本地启动起来。生产环境还需要核对数据库契约、服务端密钥、域名和安全检查，请继续阅读[生产部署](/operations/deployment)。

## 环境要求

| 工具     | 要求                           | 检查命令                                 |
| -------- | ------------------------------ | ---------------------------------------- |
| Node.js  | `>= 20.19.0`                   | `node --version`                         |
| pnpm     | `>= 8.8.0`，推荐使用当前稳定版 | `pnpm --version`                         |
| Git      | 支持 submodule                 | `git --version`                          |
| Supabase | 一个可用项目                   | 在 Dashboard 查看 Project URL 与 API Key |

## 1. 获取完整代码

业务应用由 Git 子模块提供，首次克隆必须带上 `--recurse-submodules`：

```powershell
git clone --recurse-submodules https://gitee.com/wangyanghub/art-supabase-pro.git
Set-Location art-supabase-pro
```

如果已经克隆主仓：

```powershell
git submodule update --init --recursive
```

也可以使用项目脚本拉取主仓锁定的模块版本：

```powershell
pnpm modules:pull
```

## 2. 安装依赖

```powershell
pnpm install
```

需要同时准备所有独立业务应用时运行：

```powershell
pnpm modules:install
```

## 3. 配置 Supabase

在根目录创建或修改 `.env.development`：

```ini
VITE_API_PROVIDER=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=sb_publishable_your-key
VITE_BASE_URL=/
VITE_PORT=3006
```

`VITE_SUPABASE_KEY` 推荐使用 Supabase publishable key；旧项目的 `anon` key 仍可兼容。绝不能把 `service_role`、secret key 或 AI Provider 密钥写入 `VITE_*` 变量，因为它们会进入浏览器产物。

需要在途地图时追加：

```ini
VITE_AMAP_KEY=your-amap-browser-key
VITE_AMAP_SECURITY_JS_CODE=your-amap-security-code
```

## 4. 启动平台

```powershell
pnpm dev
```

默认打开 `http://localhost:3006`。出现登录页表示前端启动成功；能登录且菜单加载完成，才表示 Supabase、认证和权限链路都可用。

## 5. 验证安装

按顺序确认：

1. 登录页没有控制台配置错误。
2. 登录后能看到当前角色拥有的平台或业务应用菜单。
3. 进入数据字典或用户中心能正常读取数据。
4. 刷新页面后会话仍有效，退出后受保护页面不可访问。
5. 运行 `pnpm check:fast`，确认 UI 审计、类型、Lint 与单元测试通过。

## 常见启动问题

| 现象                   | 首先检查                                                             |
| ---------------------- | -------------------------------------------------------------------- |
| 提示缺少 Supabase 配置 | `.env.development` 是否包含 URL 和发布密钥，修改后是否重启开发服务器 |
| 登录后没有菜单         | 用户状态、租户状态、角色菜单授权、`sys_menu` 是否启用以及组件路径    |
| 业务页面无法解析       | 子模块是否初始化，gitlink 是否指向存在的提交                         |
| 请求返回 401           | 会话是否过期、项目 URL 和 Key 是否属于同一个 Supabase 项目           |
| 页面可见但操作失败     | 按钮权限和服务端权限是否同时授予，RLS 是否允许目标记录               |

下一步：完成[首次登录初始化](/guide/first-login)，或查看完整的[环境变量参考](/reference/environment)。
