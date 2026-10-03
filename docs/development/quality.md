# 测试与质量门禁

质量检查从改动文件开始，再逐步扩大到类型、单元、数据库、构建和真实浏览器。已有失败与本次新增失败要分开报告。

## 日常门禁

```powershell
pnpm ui:audit
pnpm reuse:audit
pnpm permissions:audit
pnpm database:security:audit
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm lint:stylelint
```

聚合命令（`check:fast` 不含 Stylelint，`check` 包含上述全部日常门禁）：

```powershell
pnpm check:fast
pnpm check
```

主项目 `pnpm lint` 同时检查平台源码、平台脚本与测试、业务模块源码、模块脚本、模块独立测试目录及模块 Vite 配置。业务模块页面和组件执行与平台相同的 API 访问边界规则：通过公开 API 入口访问后端，不直接导入 Supabase client 或具体 provider。模块自行运行的检查仍应保留，用于独立交付。

全量类型检查使用 `pnpm typecheck`：该命令为覆盖全部业务模块的检查配置了 8GB Node 堆上限。直接运行 `vue-tsc` 会使用 Node 默认上限，可能因内存不足退出。内存不足、人工停止或仍在运行都不算检查通过；资源紧张时应顺序执行类型检查、浏览器验证和构建。

`pnpm lint:stylelint` 同时覆盖平台及业务模块的 CSS、SCSS 和 Vue 文件。主项目类型检查不能代替模块自己的类型检查；跨模块修改必须逐一运行受影响模块的 `typecheck`。

跨模块交付还需执行各受影响模块自己的 `check`。`pnpm modules:check` 可以统一执行，但会自动初始化模块并在依赖不完整时修复安装；仅核验现有工作区时，可在各模块目录直接运行 `pnpm check`。各模块的检查范围以自己的 `package.json` 为准，不能把缺少单元测试的模块描述为已通过单元测试。

## 专项检查

| 命令                           | 用途                                 |
| ------------------------------ | ------------------------------------ |
| `pnpm permissions:audit`       | 页面按钮、权限目录和服务端约束一致性 |
| `pnpm snapshot:check`          | AI 项目快照是否与代码一致            |
| `pnpm database:security:audit` | 数据库安全契约静态审计               |
| `pnpm reuse:audit`             | 跨仓公共代码复用审计                 |
| `pnpm test:db`                 | 数据库安全策略断言                   |
| `pnpm bundle:check`            | 构建体积预算                         |
| `pnpm build:analyze`           | 构建体积分析报告                     |
| `pnpm test:e2e:auth`           | 登录等公开页面桌面/移动可访问性      |
| `pnpm test:e2e:critical`       | 关键业务与 AI 配置继承流程           |
| `pnpm test:e2e:core`           | 核心页面桌面/移动视觉回归            |

## 完整 CI

```powershell
pnpm check:ci
```

它覆盖 UI、复用和权限审计、类型、ESLint、Stylelint、覆盖率、项目快照、生产构建、体积预算以及公开认证、关键业务和核心页面 E2E。数据库静态审计和 `test:db` 不在该聚合命令内，需要按改动范围单独执行。

数据库静态审计只能证明仓库中的安全契约满足规则，不能代替真实身份下的租户隔离与权限验证。数据库策略断言同样应结合运行身份、测试数据和实际覆盖范围报告结果。

`test:coverage` 使用 Node 的实验性覆盖率，统计单元测试实际加载且匹配 `src/**/*.ts`、`supabase/functions/_shared/*.ts` 和 `scripts/*.ts` 的文件。当前要求行覆盖率至少 85%、分支至少 70%、函数至少 80%。该报告不包含未被加载的源码，也不覆盖 Vue 模板、业务模块全部源码或浏览器交互；不能据此宣称整个项目具有相同覆盖率。报告结果时应同时说明统计文件数、覆盖范围和未完成的浏览器验证。

使用 `VITE_OUT_DIR` 指定构建目录时，体积检查必须指向同一次构建的输出，例如 `pnpm exec tsx scripts/check-bundle-budget.ts .artifacts/production-build`。浏览器验收也应使用该构建，避免用旧产物证明新改动有效。

项目结构或规范修改后先运行 `pnpm snapshot:ai`，再运行 `pnpm snapshot:check`。生成成功不代表校验通过；并行任务修改源码时，快照可能随即过期，需要在交付前对最终工作区重新生成和校验。检查结果应记录对应命令、退出状态和验证范围。

## 前端视觉验收

用户界面不能只看源码。至少验证：

- 成功、加载、空、失败/重试、无权限和禁用状态。
- 1440 桌面、1280 窄桌面，以及业务要求的移动宽度。
- 浅色/深色主题和受影响的边框/阴影模式。
- 长名称、大数值、中英混排、密集数据和 200% 缩放。
- 键盘焦点、弹窗焦点返回、控制台错误和水平溢出。

截图和报告使用脱敏测试数据，存入忽略的 `.artifacts`，不要提交租户、客户、财务、凭证或个人信息。

## CAD 文件预览验收

CAD 预览包含独立 Worker 和 WASM，构建成功或出现画布都不能证明模型解析成功。验收时应：

- 使用真实 STEP/STP 模型，确认预览中出现几何模型和非零网格数量。
- 核对 OCCT Worker、运行脚本和 WASM 从当前部署前缀成功加载；WASM 响应必须使用 `application/wasm`。
- 检查页面运行异常、资源失败和模型加载提示，并实际操作适配、旋转或线框等控制。
- 按实际样本报告覆盖范围；简单立方体通过不能代表复杂装配、IGES、BREP 或所有浏览器均通过。

## 改动完成定义

实现完成、旧实现清理、调用方迁移、精确权限落地、相关检查通过、浏览器验证完成，才算交付。只通过构建不代表业务和安全正确。
