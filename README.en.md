# Yiqi Workshop Documentation

The official VitePress documentation site for [Yiqi Workshop](https://gitee.com/art-si/art-supabase-pro), covering usage, development, deployment and operations.

[Gitee](https://gitee.com/art-si/art-supabase-doc) · [GitHub](https://github.com/art-si/art-supabase-doc) · [Live Documentation](https://art-si.github.io/art-supabase-doc/) · [简体中文](./README.md)

## Coverage

| Section               | Content                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Getting started       | Product overview, configuration, installation and first login                                             |
| Platform manual       | Workspaces, organizations, RBAC, system settings, data center, approvals and governed AI                  |
| Business applications | SCM, MDM, MES, WMS, TMS, VMS, PMIS, FMS, HR, SMIS and the TMS driver app                                  |
| Development           | Architecture, frontend conventions, Supabase security, shared runtime, module ownership and quality gates |
| Operations            | Production deployment, security baseline, upgrades, maintenance and troubleshooting                       |
| Reference             | Commands, environment variables, directories and repository descriptions                                  |

Recent documentation work covers purchasing and warehouse source documents, inventory traceability, transport payables and write-offs, vehicle health, shared code ownership, tenant scope, attachments, asynchronous request boundaries and configured forms. The quality guide records both verified results and outstanding work; historical entries do not imply that the current revision has passed every check.

The documentation content is written in Chinese. Start with the [overview](docs/guide/overview.md) and [quick start](docs/guide/quick-start.md); developers should also read [architecture](docs/development/architecture.md), [module collaboration](docs/development/modules.md) and [quality gates](docs/development/quality.md). The site provides local full-text search, light/dark themes, mobile navigation and build-time internal link checks.

## Development

Requires Node.js `>= 22.13.0` and pnpm `11.28.2`, as declared in `package.json`. This site runs independently of the platform login session and database credentials.

```powershell
pnpm install
pnpm docs:dev
```

Open `http://localhost:5173/art-supabase-doc/`.

```powershell
pnpm format:check
pnpm check
pnpm docs:preview
```

`pnpm check` runs formatting checks and the VitePress production build. Build directly with `pnpm docs:build`. Output is written to `docs/.vitepress/dist`; the default public path is `/art-supabase-doc/`. For a dedicated domain root, set both `DOCS_BASE=/` and `DOCS_SITE_URL=https://docs.example.com/` before rebuilding. The latter sets the sitemap and robots.txt URL and must be a full HTTP(S) URL without a query or fragment; its path must match the normalized `DOCS_BASE` (with trailing `/`) for any custom public path.

## Publishing

The checked-in `.github/workflows/deploy.yml` builds and deploys GitHub Pages on pushes to `master`, or by manual dispatch. Set **Settings → Pages → Source** to **GitHub Actions** and ensure the workflow is included when mirroring from Gitee. Other static hosts can serve `docs/.vitepress/dist`.

## Maintenance

Edit Markdown under `docs/guide`, `docs/manual`, `docs/modules`, `docs/development`, `docs/operations` or `docs/reference`. Add new pages to `docs/.vitepress/config.mts`. Keep commands, permissions and workflow descriptions aligned with current implementations; update relevant module READMEs together.

The host tracks this repository as `modules/art-supabase-doc`. Push documentation changes before updating the host's submodule pointer. Here `docs/` contains source Markdown, while business repositories use their own `docs/` directories for versioned application output.

## License

[MulanPSL-2.0](LICENSE)
