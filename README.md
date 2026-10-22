<div align="center">
  <h1>亿企工场 Documentation</h1>
  <p><strong>亿企工场官方使用、开发、部署与运维文档</strong></p>
  <p>一套文档说明平台底座、十大 Web 业务应用、司机端、Supabase 安全与工程协作。</p>

  <p>
    <a href="https://gitee.com/art-si/art-supabase-doc">Gitee</a>
    ·
    <a href="https://github.com/art-si/art-supabase-doc">GitHub</a>
    ·
    <a href="https://art-si.github.io/art-supabase-doc/">在线文档</a>
    ·
    <a href="https://gitee.com/art-si/art-supabase-pro">主平台</a>
    ·
    <a href="./README.en.md">English</a>
  </p>
</div>

## 文档范围

| 分区     | 内容                                                            |
| -------- | --------------------------------------------------------------- |
| 快速开始 | 产品认识、环境配置、安装启动与首次登录                          |
| 平台手册 | 工作台、组织用户、权限、系统管理、数据中心、审批与 AI           |
| 业务应用 | SCM、MDM、MES、WMS、TMS、VMS、PMIS、FMS、HR、SMIS 与 TMS 司机端 |
| 二次开发 | 总体架构、前端约定、Supabase、模块协作与质量门禁                |
| 部署运维 | 生产部署、安全基线、升级维护与故障排查                          |
| 参考手册 | 命令、环境变量、目录结构与 Gitee/GitHub 仓库简介文案            |

## 本地开发

环境要求：Node.js `>= 22.0.0`、pnpm `>= 11.9.0`。

```powershell
pnpm install
pnpm docs:dev
```

开发站点默认运行在 `http://localhost:5173/art-supabase-doc/`。

```powershell
pnpm check
pnpm docs:build
pnpm docs:preview
```

生产文件位于 `docs/.vitepress/dist`。默认公共路径为 `/art-supabase-doc/`；部署到域名根目录时设置 `DOCS_BASE=/` 后重新构建。

## GitHub Pages 发布

推送 `master` 分支后，`.github/workflows/deploy.yml` 会构建 VitePress 并发布到 GitHub Pages。GitHub 仓库的 **Settings → Pages → Source** 必须选择 **GitHub Actions**。

如果 GitHub 仓库来自 Gitee 镜像，需要确认 `.github/workflows/deploy.yml` 同步完整；只同步 Markdown 而漏掉工作流时，不会生成可访问的 VitePress 站点。

## 内容结构

- `docs/guide`：产品认识、快速开始、环境配置和首次使用。
- `docs/manual`：平台、权限、数据中心、工作流和 AI 操作手册。
- `docs/modules`：十大 Web 业务应用与司机端业务说明。
- `docs/development`：架构、前端约定、Supabase、模块协作和质量门禁。
- `docs/operations`：部署、安全、升级维护和故障排查。
- `docs/reference`：命令、环境变量、目录和仓库元信息速查。

## 维护约定

1. 在对应目录编辑 Markdown，文件名保持小写英文和连字符。
2. 新页面同步加入 `docs/.vitepress/config.mts` 的侧栏。
3. 命令、路径、权限、状态和 Supabase 行为必须以当前代码与服务端规则为准。
4. 业务能力变化同时更新对应业务仓 README 与本说明，避免主仓、子仓和文档站漂移。
5. 提交前运行 `pnpm check`，确认格式检查和 VitePress 生产构建通过。

## 许可证

文档与主项目保持一致，采用 [MulanPSL-2.0](LICENSE) 许可证。
