# Art Supabase Pro 文档站

这是 [Art Supabase Pro](https://gitee.com/wangyanghub/art-supabase-pro) 的官方文档仓库，基于 VitePress 构建，内容覆盖产品介绍、安装部署、业务操作、二次开发、Supabase 安全和运维排障。

## 本地开发

环境要求：Node.js 20 或更高版本、pnpm 9 或更高版本。

```powershell
pnpm install
pnpm docs:dev
```

开发站点默认运行在 `http://localhost:5173/art-supabase-doc/`。

## 构建与预览

```powershell
pnpm docs:build
pnpm docs:preview
```

生产文件位于 `docs/.vitepress/dist`。仓库默认使用 `/art-supabase-doc/` 作为公共路径；部署到域名根目录时设置 `DOCS_BASE=/` 后重新构建。

## GitHub Pages 发布

推送 `master` 分支后，`.github/workflows/deploy.yml` 会构建 VitePress 并将
`docs/.vitepress/dist` 发布到 GitHub Pages。GitHub 仓库的 **Settings → Pages → Source**
必须选择 **GitHub Actions**，不能选择从 `master` 分支直接发布；后者只会用 Jekyll
渲染仓库源码，无法得到完整的 VitePress 文档站。

如果 GitHub 仓库来自 Gitee 镜像，必须确认 `.github/workflows/deploy.yml` 已同步到
GitHub；仅同步文档源码而漏掉工作流时，GitHub Pages 不会执行 VitePress 构建。

## 内容结构

- `docs/guide`：产品认识、快速开始、环境配置和首次使用。
- `docs/manual`：平台、权限、数据中心、工作流和 AI 操作手册。
- `docs/modules`：TMS、VMS、FMS、HR、SMIS 业务说明。
- `docs/development`：架构、前端约定、Supabase、模块协作和质量门禁。
- `docs/operations`：部署、安全、升级维护和故障排查。
- `docs/reference`：命令、环境变量和目录速查。

## 维护文档

1. 在对应目录编辑 Markdown；文件名保持小写英文和连字符。
2. 新页面同步加入 `docs/.vitepress/config.mts` 的侧栏。
3. 命令、路径、权限或 Supabase 行为必须以当前代码和官方文档为准。
4. 提交前运行 `pnpm check`，确认格式和生产构建均通过。

## 许可证

文档与主项目保持一致，采用木兰宽松许可证第 2 版（MulanPSL-2.0）。
