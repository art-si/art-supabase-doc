# 故障排查

先记录时间、环境、用户/角色、租户、页面、操作、请求 ID 和可复现步骤。不要在工单中复制 Token、密钥、完整个人信息或未脱敏业务数据。

## 启动与构建

### 缺少 Supabase 环境变量

确认 `VITE_API_PROVIDER=supabase` 时同时存在 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_KEY`，变量文件名称匹配当前 mode，并在修改后重启 Vite。

### 子模块页面找不到

```powershell
git submodule status
git submodule update --init --recursive
pnpm modules:install
```

状态前缀 `-` 表示未初始化，`+` 表示工作区提交与主仓 gitlink 不一致。再检查别名、菜单 component 和子仓真实视图路径。

### 构建内存或体积失败

先运行 `pnpm build:analyze` 和 `pnpm bundle:check`，确认是否把文件预览器、Monaco、图表或业务模块错误地打入首屏。不要直接放宽预算掩盖回归。

## 登录与权限

### 401 / 会话失效

检查项目 URL 与 Key 是否配套、系统时间、Token 过期和用户状态。查看 Supabase Auth 日志，不在浏览器日志打印 Token。

### 登录后没有菜单

依次检查用户启用状态、租户、角色、应用、父菜单、页面菜单、隐藏/启用状态和 component 路径。数据库动态菜单缺失不能通过添加静态路由修复。

### 页面有按钮但操作 403

这是“界面权限与服务端权限不一致”的典型表现。核对精确按钮代码、角色授权、API 参数、记录租户、记录状态和数据库函数/RLS。

## 数据与 Supabase

### SELECT 正常，UPDATE 返回 0 行

RLS UPDATE 还需要 SELECT policy，并应同时设置 `USING` 与 `WITH CHECK`。确认记录属于当前租户且用户拥有精确写权限。

### 新表通过客户端访问不到

检查项目 Data API exposed schemas、schema/table GRANT、RLS 是否启用和 policy。GRANT 与 RLS 是两层控制。

### Storage 替换失败

upsert 需要 `INSERT`、`SELECT` 和 `UPDATE` 三类策略。再检查 bucket、对象路径、租户和文件归属。

### Supabase MCP 不可用

项目预期 MCP URL 指向 `ckbftoopuyophiebamwy`。如果 `execute_sql`、`search_docs`、`get_advisors` 不可见：

```powershell
curl.exe -so NUL -w "%{http_code}" https://mcp.supabase.com/mcp
```

返回 401 表示远端可达，通常需要完成 OAuth 或重载会话；同时检查根目录 `.mcp.json` 项目 ref。

## 业务问题

### 审批完成但业务状态未变化

查看审批监控、Outbox/回调状态、重试次数和 Edge Function/Postgres 日志。不要直接改业务状态绕过回调；先定位契约、权限或数据冲突，再重试或审计化补偿。

### AI 能力失败

检查功能是否启用、租户覆盖、模型配置、Provider Secret、配额、超时、输入大小和运行日志。普通用户不应看到原始 Provider 错误；运维人员通过受控日志按 request ID 定位。

### 地图空白

检查 `VITE_AMAP_KEY`、安全 JS Code、允许域名、HTTPS 混合内容、浏览器控制台和定位数据。先确认底图能否加载，再排查车辆位置。

## 文档站

### 子路径下截图或链接 404

确认构建时 `DOCS_BASE` 与实际部署路径一致；Gitee/GitHub Pages 仓库站点通常使用 `/art-supabase-doc/`，自定义域名根目录使用 `/`。修改后重新构建，不手改产物路径。
