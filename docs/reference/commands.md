# 命令速查

## 主平台

| 命令                 | 说明                      |
| -------------------- | ------------------------- |
| `pnpm dev`           | 启动开发服务器，默认 3006 |
| `pnpm build`         | 生产构建                  |
| `pnpm serve`         | 本地提供已构建应用        |
| `pnpm build:analyze` | 生成体积分析              |
| `pnpm bundle:check`  | 检查体积预算              |

## 子模块

| 命令                   | 说明                       |
| ---------------------- | -------------------------- |
| `pnpm modules:pull`    | 初始化并拉取锁定提交       |
| `pnpm modules:update`  | 更新到远端配置分支最新提交 |
| `pnpm modules:install` | 安装全部子仓依赖           |
| `pnpm modules:build`   | 构建全部子仓               |
| `pnpm modules:setup`   | 拉取、安装、构建           |

常用 Git：

```powershell
git submodule status
git submodule update --init --recursive
git diff --submodule=log
```

## 质量

| 命令                           | 说明                     |
| ------------------------------ | ------------------------ |
| `pnpm ui:audit`                | 语义、组件和 UI 规则审计 |
| `pnpm reuse:audit`             | 跨仓公共代码复用审计     |
| `pnpm database:security:audit` | 数据库安全契约静态审计   |
| `pnpm permissions:audit`       | 业务按钮权限一致性       |
| `pnpm typecheck`               | Vue/TypeScript 类型检查  |
| `pnpm lint`                    | ESLint                   |
| `pnpm lint:stylelint`          | CSS/SCSS/Vue 样式检查    |
| `pnpm test:unit`               | 单元测试                 |
| `pnpm test:coverage`           | 带阈值的覆盖率测试       |
| `pnpm test:db`                 | 数据库安全策略断言       |
| `pnpm test:e2e`                | 全部 Playwright 测试     |
| `pnpm test:e2e:auth`           | 认证页桌面/移动检查      |
| `pnpm test:e2e:critical`       | 关键业务流程             |
| `pnpm test:e2e:core`           | 核心视觉回归             |
| `pnpm check:fast`              | UI、类型、Lint、单元测试 |
| `pnpm check`                   | 快速检查加 Stylelint     |
| `pnpm check:ci`                | 完整 CI 门禁             |
| `pnpm snapshot:ai`             | 更新 AI 项目快照         |
| `pnpm snapshot:check`          | 校验 AI 快照             |

## 文档站

在 `modules/art-supabase-doc` 内运行：

| 命令                | 说明               |
| ------------------- | ------------------ |
| `pnpm docs:dev`     | 启动文档开发服务器 |
| `pnpm docs:build`   | 构建并检查死链接   |
| `pnpm docs:preview` | 预览生产产物       |
| `pnpm format`       | 格式化文档和配置   |
| `pnpm check`        | 格式检查和生产构建 |

## Supabase CLI

CLI 更新较快，先用帮助发现命令：

```powershell
supabase --help
supabase db --help
supabase functions --help
```

本项目不生成逐版本迁移文件。数据库变更优先使用项目绑定的 Supabase MCP `execute_sql`；MCP 不可用时按[Supabase 开发](/development/supabase)使用经 CLI 帮助确认的后备命令。执行前后运行 advisors、断言和相关测试。
