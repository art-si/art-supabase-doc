# 测试与质量门禁

质量检查从改动文件开始，再逐步扩大到类型、单元、数据库、构建和真实浏览器。已有失败与本次新增失败要分开报告。

## 日常门禁

```powershell
pnpm ui:audit
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm lint:stylelint
```

等价聚合命令：

```powershell
pnpm check:fast
pnpm check
```

## 专项检查

| 命令                     | 用途                                 |
| ------------------------ | ------------------------------------ |
| `pnpm permissions:audit` | 页面按钮、权限目录和服务端约束一致性 |
| `pnpm snapshot:check`    | AI 项目快照是否与代码一致            |
| `pnpm test:db`           | 数据库工作流测试                     |
| `pnpm bundle:check`      | 构建体积预算                         |
| `pnpm build:analyze`     | 构建体积分析报告                     |
| `pnpm test:e2e:auth`     | 登录等公开页面桌面/移动可访问性      |
| `pnpm test:e2e:critical` | 关键业务与 AI 配置继承流程           |
| `pnpm test:e2e:core`     | 核心页面桌面/移动视觉回归            |

## 完整 CI

```powershell
pnpm check:ci
```

它覆盖 UI 审计、类型、ESLint、Stylelint、覆盖率、项目快照、生产构建、体积预算以及关键 E2E。

## 前端视觉验收

用户界面不能只看源码。至少验证：

- 成功、加载、空、失败/重试、无权限和禁用状态。
- 1440 桌面、1280 窄桌面，以及业务要求的移动宽度。
- 浅色/深色主题和受影响的边框/阴影模式。
- 长名称、大数值、中英混排、密集数据和 200% 缩放。
- 键盘焦点、弹窗焦点返回、控制台错误和水平溢出。

截图和报告使用脱敏测试数据，存入忽略的 `.artifacts`，不要提交租户、客户、财务、凭证或个人信息。

## 改动完成定义

实现完成、旧实现清理、调用方迁移、精确权限落地、相关检查通过、浏览器验证完成，才算交付。只通过构建不代表业务和安全正确。
