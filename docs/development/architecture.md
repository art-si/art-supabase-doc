# 总体架构

## 库位编号与期初采购入库

库位的“生成货架”弹窗直接配置货架编码、层数、列数和段间分隔符，并即时预览 `A1-01-01` 等编码。分隔符支持 `-`、`_` 或留空；层号与列号固定补齐两位。安全 RPC 从所属仓库推导租户，原子生成全部格位；重复生成仅补充缺失格位，已有容量保持不变。同一货架扩层扩列沿用原分隔符。数据库通过 `code_separator`、格式约束和位置唯一索引保存并验证生成约定，不设独立编码规则菜单。

旧系统编号场景 `master.warehouse_bin`、租户规则、关联计数、自动取号触发器及租户初始化条目已移除。已有库位编码和业务引用保持不变；历史或手工编码的 `code_separator` 为 NULL，允许调整容量或缩减层列，新增格位使用新货架，避免混用编码。按位置生成的货架及格位标识不可单独改写；手工库位继续显式填写编码。

库位单条、批量删除及编辑货架缩减层列均先经共享 `MasterDataDeleteGuard` 列出业务引用，再确认删除。引用明细展示来源单据号或库存标识、业务状态及已授权的导航入口。安全 RPC 对所选记录、租户范围和删除权限进行完整校验，任何缺失、无权或并发引用均回滚整批删除；页面在并发引用拒绝后重新加载引用明细。

期初采购入库的空行采购员、仓管员和仓库在保存时取表头值，行内明确填写的值优先。数据库检查员工、仓库和单据归属同一租户。期初采购入库允许仓位为空并完成审核入账；这类批次通过 `initial_purchase_line_id` 与来源行建立租户复合外键，且来源不可修改。填写了库位的期初行以及其他入库业务继续执行原有库位、库区和容量校验。业务类型的 `stock_movement` 可为 SQL NULL，不隐式默认入库。

2026-10-07 以回滚事务验证期初采购表头默认值、行值优先、空仓位保存提交审核，以及平台全部租户、平台指定租户、普通用户本租户和伪造跨租户请求的隔离。浏览器在 1440px 与 1280px 验证期初采购明细保存失败重试及员工姓名显示。

2026-10-08 执行库位编码切换前验证了可恢复备份，并在应用前后运行 `supabase/tests/warehouse_bin_position_code_test.sql` 回滚测试，覆盖编码顺序、三种分隔方式、重复生成、扩层保号、引用阻止缩层、并发版本检查、编码冲突回滚、权限和四种租户范围。应用事务断言全部 144 个现有库位编号未变、6 条旧规则及旧场景和触发器已移除；租户初始化不再恢复旧规则。安全 advisors 与变更前相比无新增问题，验证事务未保留合成业务记录。

同日验证通过 413 项单元测试、MDM 模块类型检查、变更文件 ESLint/Stylelint，以及 UI、复用、权限和项目快照审计。1440px 与 1280px 的 20 项生成货架、批量删除和缩层删除专项场景均通过，并检查了预览、错误重试和引用拦截截图；1440px 的完整库位交互通过。主仓类型检查仍在其他模块报告 StoreGeneric 等既有类型问题；1280px 完整页面回归受测试服务中断和页面加载超时影响，未作为通过项记录。

项目采用“多个业务源码仓 + 单一平台宿主 + 单一 Supabase 安全基座”的架构。主仓固定子模块提交，构建时直接装载业务页面；业务代码仍在各自仓库单独版本化。

## 运行结构

```text
浏览器
  │
  ├─ Platform：认证、布局、菜单、租户、权限、公共组件、Store
  │    ├─ @fms/*  财务
  │    ├─ @hr/*   人力
  │    ├─ @mdm/*  主数据与生产基础
  │    ├─ @mes/*  制造执行
  │    ├─ @pmis/* 设备管理
  │    ├─ @scm/*  供应链
  │    ├─ @smis/* 安全生产
  │    ├─ @tms/*  运输
  │    ├─ @vms/*  车辆
  │    └─ @wms/*  仓储
  │
  └─ 统一 API 门面 src/api/**
       │
       ├─ Supabase Auth / Data API / Storage / Realtime
       ├─ PostgreSQL RLS、RPC、函数、触发器
       └─ Edge Functions 与外部 AI/通知服务
```

## 仓库职责

| 仓库                | 责任                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------- |
| `art-supabase-pro`  | 公共运行壳、平台页面、认证、租户、菜单、权限、共享组件、公共 API、Supabase 公共客户端 |
| `art-supabase-fms`  | FMS 页面、业务 API、类型与财务规则                                                    |
| `art-supabase-hr`   | HR 页面、业务 API、类型与人力规则                                                     |
| `art-supabase-mdm`  | MDM 页面、治理目录、生产基础配置、业务 API 与类型                                     |
| `art-supabase-mes`  | MES 页面、业务 API、类型与制造执行规则                                                |
| `art-supabase-pmis` | PMIS 点检、巡检、保养和维修页面与业务 API                                             |
| `art-supabase-scm`  | SCM 报价、销售、采购单据与供应链业务 API                                              |
| `art-supabase-smis` | SMIS 页面、API、类型与领域 Edge Functions                                             |
| `art-supabase-tms`  | TMS 页面、API、类型、运输规则与领域 Edge Functions                                    |
| `art-supabase-vms`  | VMS 页面、API、类型、车辆规则与车辆健康 Edge Function                                 |
| `art-supabase-wms`  | WMS 页面、业务 API、类型与仓储执行规则                                                |
| `art-supabase-doc`  | 官网、使用手册、开发和运维文档                                                        |
| `art-supabase-site` | 独立产品官网及产品介绍                                                                |

## 动态菜单与页面装载

业务导航来自 Supabase `sys_menu`。数据库保存稳定路由前缀，例如 `/tms/...`、`/vms/...`；主仓组件加载器把它映射到对应子仓 `src/views`。业务页面不能为了显示侧栏而写进静态路由。文档仓和官网是独立静态站点，不装载为登录后的业务应用。

业务菜单的完整父子路由路径（移除 `:id` 等参数段）应与 `component` 逐段相同；加载器再解析该目录下的 `index.vue`，菜单配置本身不追加 `/index`。2026-10-04 的线上只读核验发现 WMS 38 个菜单、MDM 的 `MdmAccessoryProcessing` 共 39 处仍保留该后缀，对应本地入口均存在。此项尚未修改线上数据；须按数据库交付要求验证可恢复备份后，更新菜单配置并再次核对完整路径、页面加载与授权导航，不能把本地入口存在或加载器兼容视为规范已完成。

## API 边界

页面只调用 `src/api/**` 导出的函数，不直接导入 Provider、Supabase 客户端或传输实现。API 门面根据 `VITE_API_PROVIDER` 选择 Supabase 或 Java 实现，并负责把数据库/SDK 数据规范化为业务 DTO。

```text
View / Business Component
  → src/api 的稳定导出
  → provider / RPC / Edge Function
  → 数据库与外部服务
```

技术错误在 API 或 Supabase 工具边界转换为可操作中文信息；原始错误仅用于受控诊断，不直接 toast 给用户。

## 数据所有权

1. 每张业务表只有一个领域所有者。
2. 其他模块不得直接写该领域表，也不得导入该模块前端 API 实现。
3. 跨域读取使用用途明确、字段最小化、租户隔离的 RPC 或 Read Model。
4. Realtime 只发送“数据已变化”的失效信号，消费者重新调用授权后的读取契约。
5. 主数据名称通过关联查询展示；只有法律单据、交易行或审计快照等不可变事实才保存名称快照。

## 发布与回滚

数据库契约要向后兼容：先发布新增契约，再发布消费者。回滚先回滚消费者，确认不再调用后才移除契约。业务仓提交并推送后，主仓更新 gitlink，再执行主仓完整构建和回归。

## SCM、WMS 与审批配置（2026-10-03）

- SCM 重复的采购入库、采购退货、委外收货、委外入库菜单、按钮授权和页面入口已移除；专属目标单据查询接口及失效下推类型已清理。采购订单到 WMS 采购入库仍使用 `scm_order_target_document/line` 作为来源快照，保留数据与有效读写契约；服务端目标权限为 `WmsPurchaseInbound:Add`，不再引用已删除的 SCM 菜单权限。
- 单位显示由主仓 `unit-display` 与 `useUnitDisplayNames` 统一处理；按单据租户解析单位 ID、编码和历史名称，并将常见 KG、PC、item 显示为千克、件。列表、查看、编辑、参选和导出复用该规则；显示转换不修改保存的单位标识、主数据或换算系数。
- 销售合同和销售订单的审批业务契约登记到其准确菜单，条件字段使用服务端审批快照的 `documentNo/projectId/customerId/totalAmount`。流程业务导航读取当前用户已授权应用菜单，不再依赖系统菜单维护权限。
- 流程配置使用 `WorkflowDefinition:Add/Edit/Publish/Enable` 按钮授权，前端和数据库一致校验；既有流程菜单授权的管理员角色补齐按钮，游客、注册公用、司机等只读角色未扩权。普通账号始终使用认证租户，已有流程保持所属租户，已发布版本不可覆盖，编辑生成新草稿。
- 直接数据库变更已备份原函数、菜单与授权数据并完成事务回滚验证。授权管理员新建、修改、发布和启停通过，跨租户修改/发布及未授权配置阻断；平台全部和指定租户范围通过，验证流程未持久保存。安全检查没有报告本次修改函数的新增问题。

## 删除引用反馈（2026-09-30）

- 公用 `MasterDataDeleteGuard` 的首次检查使用延迟 200ms 的轻量进度提示，不提前打开“暂时无法删除”弹窗。查到引用后才显示分组明细；查询失败保留重试入口；无引用时交给业务页面确认删除。重新检查保留当前明细并显示按钮加载状态。
- BOM 和物料编码单条、批量删除在确认前预检。BOM 查询与现有删除 RPC 一致的加工清单引用；物料通过 `get_record_delete_dependency_details(text,text[],text)` 检查限制删除的入向外键。
- `useSupabase.responseHandle` 对 PostgreSQL `23503` 的入向引用错误（`is still referenced`）统一派发类型化事件，由平台宿主按需加载公用明细弹窗。插入时缺少引用对象的错误不触发删除弹窗。服务端自定义错误若没有外键及目标标识，仍须由业务页显式提供预检，不能猜测删除对象。
- 只读 RPC 使用 `SECURITY INVOKER`、调用者 RLS，以及父项和引用行的当前租户范围条件；仅允许已启用 RLS 的 public 表。匿名角色没有执行权限。仅输出记录标识、可读名称、摘要及状态，不返回原始整行；不提供自动清理业务记录的能力。权限隐藏的引用仍由删除端外键拦截，反馈说明其不可见或已变化。
- 全库只读扫描识别 1251 条 RESTRICT/NO ACTION 外键关系，物料对应 38 条；前端扫描覆盖 222 处命名删除函数的 `responseHandle` 调用。该扫描不是对所有业务自定义逻辑引用的覆盖声明，后续删除入口仍须遵守 `AGENTS.md` 的预检要求。
- BOM 允许组件为空，移除前端组件数量校验及 `app_private.mdm_bom_guard()` 中“至少一个组件才能提交审核”的限制。组件存在时的字段、数量、租户、权限和生命周期校验继续执行。
- 数据库直接执行前已备份原函数并进行事务回滚测试：空组件保存、提交审核通过；平台全部范围返回 256 条可见物料引用，指定范围返回 250 条，受测普通账号自身/伪造跨租户请求均为 0 条（该账号无可见引用权限），未发生越权。应用后核对空组件规则、调用者权限模式和匿名执行权限；安全检查未报告这两个函数的新增问题。测试未持久删除或改写业务记录。

## 工序分配统计与完整读取（2026-10-06）

工序绑定视图及导出不显示 BOM 分配数量，调用 `fetchProcessSteps` 时设置 `includeComponentAssignmentCounts: false`，避免每行额外一次 HEAD 查询。工艺序列关系通过 `fetchAllProcessRouteSteps` 复用共享完整分页工具，按 500 行读取，并以 `sort, code, id` 稳定排序；缺页或租户切换时阻止返回部分关系。显示分配数量的工序列表仍保留精确统计，不能将未查询的数量解释为已确认的零。

### 待应用的批量统计边界

2026-10-06 只读核验确认复合外键 `mdm_bom_item_process_route_step_fkey` 包含 `(tenant_id, process_route_step_id)`，两张表均启用 RLS。浏览器直连当前 Data API 的嵌入 `count()` 返回 `PGRST123`；不能直接将其替换进正式查询。旧 `count` 语法的匿名探针返回权限拒绝，不能证明真实身份下的统计行为，也不作为启用弃用语法的依据。

以下为待核验可恢复备份后评审、事务验证并应用的候选 SQL，尚未执行，也没有接入正式 API。它按批次返回所有可见目标工序（无分配返回 0），保留调用者 RLS、复合租户关联及平台全部/指定/普通用户范围。应用前须验证真实平台全部、指定、普通本租户、普通伪造范围四组身份及不可见工序；应用后再将必要统计从逐行 HEAD 替换为一次批量 RPC。前端应拒绝缺少父工序计数的结果，避免并发删除或权限变化时静默显示 0。

```sql
create or replace function public.mdm_process_step_assignment_counts(p_step_ids uuid[])
returns table (step_id uuid, assignment_count bigint)
language plpgsql
stable
security invoker
set search_path = ''
as $function$
begin
  if auth.uid() is null then
    raise exception '请登录后重新查询工序' using errcode = '42501';
  end if;
  if p_step_ids is null
     or cardinality(p_step_ids) not between 1 and 1000
     or array_position(p_step_ids, null) is not null then
    raise exception '请选择 1 至 1000 个工序后重新查询' using errcode = '22023';
  end if;
  return query
  select step.id, count(item.id)
  from public.mdm_process_route_step as step
  left join public.mdm_bom_item as item
    on item.tenant_id = step.tenant_id
   and item.process_route_step_id = step.id
  where step.id = any(p_step_ids)
    and app_private.tenant_in_current_read_scope(step.tenant_id)
  group by step.id;
end;
$function$;
revoke all on function public.mdm_process_step_assignment_counts(uuid[]) from public, anon;
grant execute on function public.mdm_process_step_assignment_counts(uuid[]) to authenticated;
```

## SMIS 事故人员公共选择与租户快照（2026-10-08）

事故快报和事故分析的人员多选直接复用 `ArtEmployeeSelect`，通过已有 `apiFn` 和 `displayFields` 配置事故专用读取以及性别、年龄列。公共组件保留选中源记录的完整字段；事故快报仍固化身份、组织和任职快照，并保留再次选择时已有的伤害信息。专用的 `accident-employee-multiple-select.vue` 已删除。

`smis_list_accident_employee_candidates_secure` 先按当前授权租户范围筛选员工，再以每行的 `tenant_id` 调用原有快照函数，修正平台跨租户读取时快照为空的问题。权限、状态、检索、分页和执行授权保持原有契约。替换前备份函数并在回滚事务中预演；应用后 `supabase/tests/smis_accident_employee_scope_test.sql` 验证平台全租户、指定租户、普通用户本租户、伪造租户请求，以及未授权和匿名拒绝。临时岗位、员工、角色及用户角色变更全部回滚；数据库安全策略回归覆盖 438 张受保护租户表，安全顾问提示数量与替换前一致。

## VMS 车辆全景批量摘要读取（2026-10-08）

车辆全景列表通过 `vms_get_vehicle_query_summary_records_secure(uuid[])` 按页批量获取保险、年检、保养和里程记录，正常页只发起一次摘要请求；详情复用同一读取契约。服务端先校验车辆查询菜单权限与当前租户范围，再调用原有四个安全读取 RPC，保留其字段脱敏、记录权限和每类最多 500 条的既有边界。批次上限为 200 辆，前端超过上限时分批请求。此改动减少浏览器往返次数，数据库内部仍按车辆调用四个安全读取函数。

新增函数在事务回滚中预演，并在正式应用后通过 `supabase/tests/vms_vehicle_query_summary_batch_test.sql` 核对源 RPC 返回一致性、平台全租户/指定租户、普通用户本租户及伪造租户请求；匿名角色无执行权限。回滚顺序为先回退 VMS 调用方，再删除新增函数。数据库顾问仅对该函数报告通用的“已认证用户可调用 SECURITY DEFINER”提示；该授权用于受控的业务读取，函数内显式校验菜单权限和租户范围。安全与性能顾问的其他存量提示未因本次改动处理。

## UI 审查基准与 Impeccable 接入（2026-10-09）

### 接入契约

`.agents/skills/professional-ui-quality/SKILL.md` 保持主规范；`.agents/skills/impeccable/SKILL.md` 是项目适配入口，吸收上游的 audit、critique、polish、harden、clarify 方法。上游来源为 `pbakaus/impeccable`，资源版本 4.5.1，项目适配版本 4.5.1-project.1，许可证及获取指纹记录在该目录的 `LICENSE` 和 `source.json`。自动 hooks 未安装，也未增加运行时依赖。

上游的审美禁令、认知负荷数量阈值、评分、初始化步骤和多代理工作流不替代本地规则。业务界面继续使用 Art/Element Plus、系统中文字体、密集数据表、语义状态色、主题令牌、明暗主题及 border/shadow 模式。权限、租户边界、普通用户 AI 能力和 `MasterDataDeleteGuard` 优先于视觉建议。审查指令仅报告；精修需在用户授权范围内实施。

`AGENTS.md`、主 UI skill 和 `UI-GUIDELINES.md` 已同步上述优先级；旧指南中的业务页标题、卡片及删除流程描述已对齐现有共享组件和删除守卫。本次接入未修改业务页面、API 或数据库规则。工作区同时存在其他修改，以下结果描述检查时的工作区状态，不将其他任务的修改归因于本次接入。

### 全仓源码覆盖

源码清点覆盖主应用和全部 11 个含 `src` 的模块，共 2,137 个源码文件、1,259 个 Vue 文件。另检查文档站主题的 3 个文件（含 1 个 Vue），合计 1,260 个 Vue。此处的文件清点口径与 `ui:audit` 的 UI 文件口径不同。

| 源码根目录                      | 源码文件 | Vue 文件 | 检测器候选 |
| ------------------------------- | -------: | -------: | ---------: |
| `src`                           |      739 |      305 |         27 |
| `modules/art-supabase-fms/src`  |      148 |      108 |          9 |
| `modules/art-supabase-hr/src`   |      114 |       74 |          6 |
| `modules/art-supabase-mdm/src`  |      251 |      148 |          6 |
| `modules/art-supabase-mes/src`  |       87 |       63 |          0 |
| `modules/art-supabase-pmis/src` |       51 |       42 |          2 |
| `modules/art-supabase-scm/src`  |       55 |       32 |          0 |
| `modules/art-supabase-site/src` |        4 |        1 |          2 |
| `modules/art-supabase-smis/src` |      345 |      268 |         53 |
| `modules/art-supabase-tms/src`  |      158 |       89 |          5 |
| `modules/art-supabase-vms/src`  |      102 |       64 |          1 |
| `modules/art-supabase-wms/src`  |       83 |       65 |          0 |
| 文档站 `.vitepress/theme`       |        3 |        1 |          0 |

诊断引擎来自官方 npm 平台包 `@impeccable/cli-windows-x64@0.1.5`，可执行文件实际报告版本 4.0.0；与 skill 资源版本分别记录。引擎输出 111 项候选（104 warning、7 advisory），包含 91 项侧边标签强调边框、5 项圆角容器强调边框、5 项布局属性过渡、3 项渐变文字及 7 项网格背景提示。候选未经上下文确认不计为缺陷：选中项边框、风险提示色、图表语义渐变、业务表格密度及局部滚动均不能仅凭形式判错。

### 已确认的源码问题

以下为源码确认，尚未获得相应登录后页面的视觉证据。没有确认的 P0/P1 UI 问题，也不据此宣称全仓不存在此类问题。行号以本次审查时为准。

| 级别 | 位置与证据                                                                                                                                                                                                                                          | 影响与最小修正                                                                                                               | 验证要求                                                   |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| P2   | `src/views/dashboard/ai-operations/modules/ai-run-detail-drawer.vue:478` 的实际 hero 图标将主题色与固定 `#7259e7` 混合，并使用固定蓝色阴影；`src/views/system/ai-project-planner/modules/project-planner-overview.vue:241` 的实际图标混入 `#7c3aed` | 切换品牌主题后，局部强调仍保留固定紫/蓝色，偏离主题契约。优先复用主题或语义令牌，统一同类强调图标；并非已证明的对比度不达标  | 自定义主题色、明暗主题、两种容器模式下检查强调层级及可读性 |
| P3   | `src/views/workflow/definition/index.vue:620` 起保留旧 `__hero`、`__hero-copy`、`__hero-icon`、`__principles` 及对应响应式样式；模板已使用 `BusinessWorkspaceHeader`，旧选择器只出现在样式中                                                        | 未使用样式增加维护成本并干扰设计审查；这不是当前页面仍在显示旧渐变的证据。确认调用范围后删除旧选择器，保留共享标题           | 复核选择器引用，检查该页桌面/手机标题布局及筛选交互        |
| P3   | `src/views/dashboard/console/modules/dashboard-order-flow.vue:296` 的进度条使用 `transition: width 0.3s ease`                                                                                                                                       | 局部时长和曲线绕开项目 motion 令牌；布局属性过渡需按用途判断，尚无掉帧证据。先对齐现有 motion 令牌，再评估是否适合 transform | 检查数据更新和 reduced-motion；不要改变真实进度或布局语义  |

### 验证结果与覆盖边界

| 检查                      | 结果                                   | 范围和解释                                                                                                                                                                                                                                                            |
| ------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm ui:audit`           | 复查通过                               | 主应用 655、模块 1,385 个受规则检查文件。初次 SCM 原始错误文案候选已在并行工作中修正，未作为未解决问题保留                                                                                                                                                            |
| `pnpm typecheck`          | 最终复查通过，退出码 0                 | 初次检查的 13 项 SCM 类型错误不再出现在最终结果中                                                                                                                                                                                                                     |
| `pnpm lint`               | 未通过，54 项 `prettier/prettier` 错误 | 位于非本次修改的 `modules/art-supabase-scm/scripts/audit-module-boundary.ts`、`modules/art-supabase-scm/vite.config.ts` 和 `src/components/core/forms/art-excel-export/index.vue`；属于工作区检查阻塞，不能据此通过全仓发布门禁                                       |
| `pnpm lint:stylelint`     | 超时，未完成                           | 全仓样式检查超过 35 分钟未返回诊断，已终止本次检查；不能将没有输出解释为通过                                                                                                                                                                                          |
| 登录与共享组件 Playwright | 52 项通过                              | 登录 24 项、共享标题/更多操作/语义颜色 28 项；登录首次两项导航超时，重试通过。另有测试按项目配置跳过。覆盖 1440 桌面及 390 手机、明暗主题、border/shadow、权限隐藏、键盘/触摸和无页面横向溢出                                                                         |
| 主规范 `visual-audit.mjs` | 8 个变体已截图并人工检查；脚本未全通过 | 使用脱敏语义颜色 fixture，1440×900、1280×800，明暗主题和两种容器模式；全部无横向溢出、无未命名交互、无页面脚本异常。首个变体出现一项资源 404，诊断定位为 fixture 自动请求的 `/favicon.ico`，其余 7 个变体无控制台错误。记录该验证噪声，不作为业务页面已通过的替代证据 |
| 登录后完整业务页面        | 未完成真实视觉覆盖                     | 已保存的登录会话访问角色页被重定向到登录页，未获得角色页 DOM；未将此情况判为角色页面缺陷。模块源码扫描不能替代受权限保护页面、抽屉、表单及所有空/错/加载状态的人工浏览                                                                                                |

评分维度保持主规范的八项及其权重，当前证据覆盖如下。具体业务页面的评分仍为未完成，不给出全项目数值分数或视觉验收通过结论。

| 主规范评分维度       | 权重 | 当前证据及限制                                                                |
| -------------------- | ---: | ----------------------------------------------------------------------------- |
| 任务清晰度与操作层级 |   15 | 共享标题和更多操作有源码及浏览器证据；业务任务逐路由复核未完成                |
| 视觉层级与精修质量   |   15 | 登录页、共享标题及语义色截图已检查；全部业务页面尚未截图                      |
| 项目设计系统一致性   |   15 | 全仓静态检查、主题候选核对及共享组件主题测试；已确认两处固定强调色问题        |
| 状态完整性           |   15 | 登录状态、共享操作的禁用/隐藏/触摸等已测试；业务空/错/加载和删除阻断未全覆盖  |
| 可访问性             |   15 | 公共操作键盘测试、颜色对比度及 fixture 交互命名检查；全路由辅助技术使用未验证 |
| 响应式与溢出韧性     |   10 | 1440/1280 桌面、390 手机共享组件证据；所有业务路由及缩放组合未验证            |
| 交互反馈与动效       |   10 | 更多操作、焦点模式及源码过渡候选检查；实际业务进度动效尚未浏览                |
| 内容与信任           |    5 | 错误文案规则和权限操作测试；业务事实与完整租户场景未在此次 UI 审查中验收      |

若实施后续修复，应先处理工作区检查阻塞，再处理主题令牌漂移，并按模块补齐登录后的代表性列表、详情、表单、删除阻断及权限状态。

接入文件的定向 Prettier 检查及 `git diff --check` 通过；AI 项目快照已重新生成，最终 `pnpm snapshot:check` 通过（`4a7b18b08a94`）。检查时启动的临时预览服务已关闭。

原始清点、检测候选、命令日志和脱敏截图保存在忽略目录 `.artifacts/impeccable/`，其中 `inventory.json`、`detector-source.json`、`candidates.md`、`typecheck-final.log`、`lint.log`、`shared-browser.log`、`auth-recheck.log` 和 `semantic-desktop/visual-audit.json` 分别记录各类证据。该目录不是持久交付或发布依赖。
