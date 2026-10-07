# HR 人力资源

HR 覆盖组织设计、岗位职务、人员档案、入转调离、合同资质、招聘、编制、考勤休假、薪酬福利、员工服务、绩效发展与人才运营。

![HR 员工花名册](/screenshots/hr-employee-roster.png)

## 人员主线

```text
编制与岗位
  → 招聘工作台
  → 员工入职
  → 花名册与档案
  → 转岗 / 调动 / 状态变化
  → 考勤、绩效、培训与自助
  → 离职与档案保留
```

## 员工花名册

花名册用于检索在职、待入职、离职等人员。员工详情与个人档案可能包含联系方式、证件、合同和组织信息，应通过字段权限和服务端投影限制不必要的访问。

## 岗位与编制

岗位描述职责和任职要求，编制用于控制组织的人数计划。招聘或入职前先确认目标组织、岗位和可用编制，避免人员进入后再补治理数据。

## 入转调离

入职、转正、调岗、调动、离职等变化应通过人事异动或生命周期流程记录生效时间、原值、新值、审批和证据。不要直接覆盖历史信息。

## 考勤与员工自助

考勤排班维护班次、出勤和异常；员工自助提供个人范围内的查询或申请。普通员工只能访问自己的必要数据，主管范围和 HR 全局范围要由服务端明确区分。

## 绩效与人才发展

绩效考核按周期建立目标、评价和结果；学习发展与技能矩阵维护课程、能力和成长记录；继任计划、人才盘点与内部流动用于连接岗位需求和人才供给。结果发布前核对参与范围、评分规则和可见性。

## 员工运营与风险

员工自助、服务交付、政策签收、员工关系、灵活用工、人员分析和用工风险共同组成运营工作台。涉及薪酬、合规或人员风险的记录必须按职责最小化展示，并保留处理过程而不是只覆盖最终结果。

## 跨模块协作

VMS、TMS、SMIS 等模块需要人员选项时，应读取 HR 提供的最小字段安全契约，不直接访问身份证、联系方式等敏感字段，也不写 HR 领域表。

## 常见问题

| 问题               | 检查                                            |
| ------------------ | ----------------------------------------------- |
| 新员工无法进入业务 | Auth 用户、平台用户、租户、组织、角色和在职状态 |
| 调岗后权限未变化   | 角色是否随岗位自动调整，用户会话是否刷新        |
| 其他模块找不到员工 | 在职状态、跨域 RPC、租户和最小字段契约          |
| 员工看到过多信息   | 字段权限、列表投影、详情 RPC 与 RLS             |

## UI 验证记录（2026-10-07）

当前源码包含 30 个页面入口、36 个对话框或抽屉文件。文件数量用于核对范围，不代表所有实体、权限和操作均已验收。以下证据来自真实 Chromium 渲染、隔离测试用户与模拟 RPC；不能替代真实数据库权限及完整业务流程验收。

| 页面范围（相对 `src/views`）                                                                                                                                | 已有专项浏览器证据                                                                                 | 仍需完成                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `talent/talent-inventory`                                                                                                                                   | 1280 / 2880 宽度，有数据及空筛选；表格保持卡片内，空态撑满工作区                                   | 真实数据、深色与焦点模式               |
| `talent/skill-matrix`                                                                                                                                       | 570 / 1280 / 2880 宽度，表格高度、卡片边界、空态和窄屏筛选布局                                     | 真实能力编辑及权限分支                 |
| `operations/workforce-risk`、`operations/people-analytics`                                                                                                  | 空态工作区；风险错误重试                                                                           | 数据图表、完整筛选与主题验收           |
| `talent/development`、`talent/performance`、`talent/succession`、`talent/internal-mobility`                                                                 | 部分实体引用加载、员工身份回显、业务选人；培训和绩效删除保护                                       | 所有实体新增、编辑、详情和流程操作     |
| `personnel/lifecycle`、`operations/attendance`、`operations/absence`、`operations/headcount`、`operations/compensation`                                     | 部分表单引用加载及选人检查                                                                         | 全部表单保存、历史引用、权限和列表状态 |
| `operations/benefits`、`personnel/compliance`、`operations/employee-relations`、`operations/employee-experience`、`operations/self-service`                 | 五类详情加载失败重试、缺失记录、旧请求隔离；调查答题状态；员工服务身份与停用服务回显；合规删除保护 | 全部实体增改、业务状态操作和真实权限   |
| `personnel/position`、`personnel/employee-roster`                                                                                                           | 删除引用检查、并发拒绝后重检、引用导航及入口权限                                                   | 真实页面 CRUD、档案内容和主题验收      |
| `recruitment/workbench`、`personnel/personnel-change`                                                                                                       | 部分共享表单租户归属、编号规则、关联选项与身份检查                                                 | 全部实体流程及真实页面验收             |
| `personnel/organization-position`、`personnel/organization-design`、`personnel/job-architecture`、`personnel/employee-detail`、`personnel/employee-profile` | 尚无本轮完整专项验收                                                                               | 页面及所有子表单逐项验收               |
| `operations/contingent-workforce`、`operations/compensation-review`、`operations/policy-acknowledgement`                                                    | 尚无本轮完整专项验收                                                                               | 页面及所有子表单逐项验收               |

### 可重复执行的证据

- 组织变革、政策签收、外部用工、调薪复核补充 570 / 1440 宽度检查：8 项通过。截图发现并修复前三者流程步骤重叠，以及调薪复核流程末尾无法滚动到达；新增步骤边界和最后一步可达断言。上述页面的表单和业务流程仍需逐项验收。
- 14 个 `tests/e2e/hr-*.spec.ts`（排除依赖真实登录与业务数据的 `hr-employee-roster.spec.ts`）集中运行：98 项通过。随后新增六种详情实体的 570px 浏览器检查：6 项通过，并检查底部截图。
- 五类详情抽屉均覆盖加载失败后原位重试、记录缺失、前一次请求晚返回不覆盖当前记录；补查福利参保、人生事件、员工资质、调查配置、匿名洞察和改善行动。
- 布局证据分别保存在 `hr-talent-inventory-layout.spec.ts`、`hr-skill-matrix-layout.spec.ts`、`hr-workforce-risk-layout.spec.ts`、`hr-people-analytics-layout.spec.ts`。
- 表单与状态证据保存在 `hr-talent-dialogs.spec.ts`、`hr-workspace-tenant.spec.ts`、`hr-experience-response.spec.ts`、`hr-experience-question-feedback.spec.ts`、`hr-detail-states.spec.ts`。
- 删除证据保存在 `hr-compliance-delete.spec.ts`、`hr-employee-delete.spec.ts`、`hr-performance-delete.spec.ts`、`hr-position-delete.spec.ts`、`hr-workspace-delete.spec.ts`。
- HR 模块 `pnpm check` 通过（边界审计、UI 审计、类型检查、ESLint、Stylelint、6 项单元测试）；调薪复核追加样式改动的 Stylelint 和四个页面格式检查通过。根项目类型检查仍被 `modules/art-supabase-mdm/src/views/business-type/index.vue:389` 的空值索引错误阻挡，不能报告根项目全部检查通过。

### 后续验收约束

逐页面核对成功、加载、空态、失败重试、权限限制、长内容、窄屏和主题状态；逐实体核对新增、编辑、详情、删除及受控流程。业务员工选择不得沿用账号绑定选择器的排除规则；关联历史记录停用后仍应显示可识别名称。租户选择必须同时在客户端与服务端验证，模拟 RPC 通过不构成服务端隔离证明。
