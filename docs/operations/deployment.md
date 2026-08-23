# 生产部署

主应用与文档站都是静态前端，但主应用依赖 Supabase、Edge Functions、Storage、地图和外部 AI 等服务端能力。上线应把“数据库契约 → 服务端能力 → 前端 → 验证”作为一个发布单元。

## 主应用发布顺序

1. 冻结目标主仓提交和所有子模块 gitlink。
2. 在开发/预发布 Supabase 项目验证迁移、RLS、函数与 Edge Functions。
3. 先发布向后兼容的数据库新增契约和 Edge Functions。
4. 配置生产环境变量与 Function Secrets。
5. 运行 `pnpm check:ci` 或组织批准的等价门禁。
6. 执行 `pnpm build`，发布构建目录。
7. 用普通用户和管理员分别做登录、菜单、读写、审批和 AI 冒烟测试。
8. 观察 Auth、API、Postgres、Edge Function 日志和 AI 运行指标。

## 主应用环境

最小 Supabase 构建变量：

```ini
VITE_API_PROVIDER=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=sb_publishable_your-key
VITE_BASE_URL=/art-supabase-pro/
VITE_APP_CODE=platform
```

生产站点使用 HTTPS。SPA 服务器需要把未知前端路由回退到 `index.html`；带 Hash 的现有路由同样要正确提供静态入口。`assets` 使用长缓存，HTML 使用短缓存或协商缓存。

## Nginx 要点

仓库提供 `deploy/nginx.conf.example`。使用时替换域名和静态目录，并保证：

- HTTP 跳转 HTTPS。
- 根路径或子路径与 `VITE_BASE_URL` 一致。
- `try_files` 回退到应用入口。
- HTML 不做长期不可变缓存，带 hash 的 assets 可以长期缓存。
- 配置 CSP、`X-Content-Type-Options`、Referrer Policy 等响应头，并按地图/AI 外域调整 CSP。

## 文档官网部署

文档仓构建：

```powershell
Set-Location modules/art-supabase-doc
pnpm install --frozen-lockfile
pnpm docs:build
pnpm docs:preview
```

产物位于 `docs/.vitepress/dist`。默认公共路径为 `/art-supabase-doc/`，适合仓库 Pages 子路径。自定义域名根路径构建：

```powershell
$env:DOCS_BASE = "/"
pnpm docs:build
```

Gitee 社区版 Pages 已下线，因此文档仓保留在 Gitee 作为代码源，并推荐由已同步的 GitHub 仓库通过 Actions 发布到 GitHub Pages；也可以选择 Cloudflare Pages、Netlify、Vercel 或 Nginx。仓库已经提供 `.github/workflows/deploy.yml`，在 GitHub 仓库的 **Settings → Pages → Source** 选择 **GitHub Actions** 后，每次推送 `master` 会自动发布。

通用托管平台构建设置：

| 设置     | 值                               |
| -------- | -------------------------------- |
| 安装命令 | `pnpm install --frozen-lockfile` |
| 构建命令 | `pnpm docs:build`                |
| 输出目录 | `docs/.vitepress/dist`           |
| Node.js  | 20 或更高                        |

## 上线冒烟清单

- 首页、侧栏、全文搜索、深色模式和移动菜单可用。
- 所有内部链接和截图可加载，刷新深层页面不 404。
- 主应用登录、退出、会话刷新和 403/404 正常。
- 普通用户只看到已授权应用、页面、按钮和租户数据。
- 管理员控制面与普通业务权限边界正确。
- 一条关键业务链路和一个审批回调成功。
- AI 只读能力可用，受控写入和配置对普通用户不可用。

## 回滚

保留上一版静态产物、主仓提交、子模块指针、数据库迁移清单和 Edge Function 版本。回滚先恢复前端消费者；数据库只回滚已经证明可逆且不会丢数据的变更。破坏性 schema 删除应在多个版本后执行，而不是与消费者更新同时发生。
