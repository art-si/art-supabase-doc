# Supabase 开发

Supabase 行为更新较快，开发前先查看[官方 Changelog](https://supabase.com/changelog)和对应产品文档。项目使用 Supabase Auth、PostgreSQL、Data API、Storage、Realtime、RPC 与 Edge Functions，数据库才是最终授权边界。

## 2026-10-23 风险巡查列表读取优化

风险巡查列表 RPC 含生成和逾期更新副作用，性能分析必须先检查写入范围并始终回滚；不能改为 STABLE 或删除生成动作。写入保留 `current_user_tenant_id()`，读取通过一次性 `current_read_tenant_id()` 解析并 NULL 安全过滤，风险/明细聚合在分页后执行，租户连接条件和分页前筛选关系保留。极端分页差值使用 bigint，同日期同任务号使用 id DESC 确定末级顺序。

已验证函数对象恢复、四类租户范围的真实生成/编号/逾期行为、筛选与状态总览、跨租户完整历史夹具及权限拒绝。五次配对中位数 2852.442 → 32.145 ms，提交后独立中位数 36.014 ms；测量的范围不产生任务。备份 `supabase/backups/20261023-smis-risk-list-function/`，两项 SQL 集成契约均在提交后通过，八张相关表的测试前后指纹不变。详细测量条件、恢复和边界证据见[质量记录](./quality.md)。

## 客户端密钥

浏览器使用 publishable key（`sb_publishable_...`）；旧项目可继续使用 legacy `anon` key。`service_role` 和 secret key 只允许服务端持有，绝不写入 `VITE_*`、前端源文件、日志或截图。

## RLS 基线

所有暴露 schema（默认包括 `public`）的业务表都启用 RLS，并按真实所有权/租户模型编写策略。只写 `TO authenticated` 只是认证，不是授权。

```sql
create policy "tenant members can read records"
on public.business_record
for select
to authenticated
using (
  app_private.tenant_in_current_read_scope(tenant_id)
);
```

更新策略同时提供 `USING` 与 `WITH CHECK`，并记住 UPDATE 还需要 SELECT 策略：

```sql
create policy "tenant editors can update records"
on public.business_record
for update
to authenticated
using (
  tenant_id = app_private.current_user_tenant_id()
  and app_private.has_permission('Business:Edit')
)
with check (
  tenant_id = app_private.current_user_tenant_id()
  and app_private.has_permission('Business:Edit')
);
```

不要使用用户可编辑的 `user_metadata` 做授权。授权声明放在受保护的 `app_metadata` 或数据库关系中，并考虑 JWT 声明刷新延迟。

## Data API 暴露

Supabase 正在改变新表自动暴露行为。创建表后要同时检查：

1. 项目的 Data API exposed schemas 设置。
2. `anon`/`authenticated` 是否有 schema/table grant。
3. 表是否启用 RLS 并有正确策略。

GRANT 决定角色能否访问对象，RLS 决定能访问哪些行，两者不是一回事。

## 2026-10-23 Data API 缓存加载故障恢复

项目 `ckbftoopuyophiebamwy` 的登录公共配置和语言接口曾返回 `503 / PGRST002`。PostgREST 日志确认元数据查询被 `57014` 查询超时取消，Auth 同期记录内部数据库连接失败、504 超时及伴随的刷新冲突。项目级 `ACTIVE_HEALTHY` 不代表 Data API 已可用，恢复必须同时核对分服务健康检查和真实公共接口。

本次先将角色配置备份到本机忽略目录 `.artifacts/supabase-incident-20261023/role-settings-before.json` 并核验 SHA-256，再在回滚事务中验证 `authenticator.statement_timeout = 60s` 后应用；`anon` 和 `authenticated` 仍分别保持 3 秒、8 秒。随后更新相关系统目录的 ANALYZE 统计并重载缓存；因服务仍不稳定，于北京时间 14:00 发起项目服务重启，数据库于 14:02:17 重新启动。14:07 的 Auth、REST 分服务健康检查均通过，14:08 的 Auth health、外观配置、网站配置与登录语言接口均返回 HTTP 200，语言结果为 `zh`，无数据库锁阻塞。配置回退值为 `authenticator.statement_timeout = 8s`，回退后须重载 PostgREST 配置和缓存。

本次没有修改业务数据、RLS、授权或前端登录逻辑。重启后资源采样显示约 406MB 物理内存、224MB shared_buffers 和已使用的 Swap；这些是后续容量评估线索，不能单凭该采样认定故障前的 CPU/IO 根因。未调整全局缓冲内存或付费实例规格。系统目录统计维护和单次缓存重建成功均不构成恢复证明，验收以持续可用的真实接口为准。

## 数据库函数

优先使用 `SECURITY INVOKER`。确实需要 `SECURITY DEFINER` 时：

- 放入未暴露的私有 schema。
- 固定安全 `search_path`。
- 函数体主动校验 `auth.uid()`、租户和按钮权限。
- 撤销 `PUBLIC` 默认执行权，再精确授权。
- 运行 Supabase security advisor。

不能用 `SECURITY DEFINER` 作为修复权限报错的捷径。

## Storage

文件路径包含租户或业务归属，并在 `storage.objects` 策略中校验。upsert/替换需要 `INSERT + SELECT + UPDATE`；删除单独授权。公开 URL 只用于真正公开资源，业务附件优先签名 URL。

## Edge Functions

Edge Function 负责 AI、通知、受控 SQL 等服务端能力。入口应校验 JWT、用户状态、租户、功能开关和精确权限；外部 Provider 密钥存入 Function Secrets。响应只返回业务需要字段，原始 Provider 错误进入受控日志。

## 数据库变更工作流

本项目不在仓库保存逐版本迁移 SQL。先验证可恢复备份，再在目标项目的 `BEGIN`／`ROLLBACK` 事务中检查 SQL、依赖关系、租户越界情况和回滚结果。审核后通过项目绑定的 Supabase MCP `execute_sql` 直接执行；MCP 不可用时才使用文档化的 CLI 后备方式。完成后立即运行数据库断言、security/performance advisors 和相关应用测试。`pnpm test:db` 需要有效的 Supabase CLI 登录；只有 MCP 登录时，可用项目 MCP 执行同一份只读测试 SQL。

带 `tenant_id` 的表若保留平台超级管理员的 `FOR ALL` 写入策略，其 SELECT 还必须有 `AS RESTRICTIVE` 的租户范围策略。宽松的功能权限策略不能覆盖“已选租户”范围；普通用户伪造租户请求仍须落在本人租户。2026-10-01 的策略盘点已为遗漏的 42 张表补齐限制性读取范围，保留 28 条原有读取授权；`supabase/tests/database_security_policy_test.sql` 固化了这一检查。AI 开单建档 RPC 允许具备 `AiFill` 与对应 `Add` 按钮权限的普通用户写入本人租户。TMS 货物与站点的直接写入按按钮权限控制；平台超级管理员在全部租户下新增站点，默认归入自己的平台租户，也可指定具体业务租户。站点类型由受控 RPC 和触发器维护，普通账号不可直接写类型表；具备 AI 填单与站点新增权限的普通用户可通过 AI 建站并自动生成类型关联。

截至 2026-10-02，TMS 合同新增与导入 RPC 仍固定写入登录人租户；客户端在“全部租户”下默认平台租户，并暂时阻断已选其他租户时的新增与导入，防止误写。承运商选项 RPC 对平台超级管理员还未按已选租户收窄。完成新鲜、可恢复的备份后，应同时修正合同目标租户解析、承运商选项范围和回滚事务回归检查，再移除客户端临时限制。

财务发票、收付款凭证 OCR 的代码已把图片、识别审计和复核绑定到同一目标租户：“全部租户”默认平台管理员本人租户，明确选租户则使用所选租户；普通用户伪造租户头不能越界。Edge Function 源码尚未部署。线上 `save_tms_invoice_secure` 对关联对账单仍用登录人租户校验，和底层按往来单位归属确定发票租户的行为不一致；取得新的可恢复备份后，需一起修正并验证跨租户发票登记与附件归属。

## Realtime

Realtime 事件仅作为“数据可能已变化”的通知。收到事件后重新调用授权后的查询，不把事件 payload 当成已经通过字段权限和租户校验的业务记录。

## 2026-10-23 等价索引清理

按项目 Supabase/Postgres 规范复核全库目录后，正式移除九张表上的十个普通冗余索引：一对完全相同的 WMS 部分索引清理一份，九个普通索引由同键列、排序、操作符类、collation、表达式、谓词与存储设置的有效唯一索引覆盖。未根据 idx_scan=0 批量删除索引；约束、replica identity、clustered 标记和依赖对象均经过检查。

| 表                               | 已移除普通索引                                       | 保留覆盖索引                                         |
| -------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| `sys_role_field_permission`      | `sys_role_field_permission_lookup_idx`               | `sys_role_field_permission_tenant_key`               |
| `mdm_process_route_sequence`     | `mdm_process_route_sequence_route_idx`               | `mdm_process_route_sequence_route_key`               |
| `sys_user`                       | `idx_sys_user_user_email`                            | `sys_user_user_email_key`                            |
| `sys_user_field_permission`      | `sys_user_field_permission_lookup_idx`               | `sys_user_field_permission_tenant_key`               |
| `tms_expense_reimbursement_item` | `idx_tms_expense_reimbursement_item_cost_id`         | `tms_expense_reimbursement_item_expense_unique`      |
| `wms_count_adjustment_line`      | `wms_count_adjustment_line_document_idx`             | `wms_count_adjustment_line_document_id_line_no_key`  |
| `wms_purchase_document_line`     | `wms_purchase_line_document_idx`                     | `wms_purchase_document_line_document_id_line_no_key` |
| `wms_transfer_business_line`     | `wms_transfer_business_line_document_id_line_no_idx` | `wms_transfer_business_line_document_id_line_no_key` |
| `wms_transfer_request_line`      | `wms_transfer_request_line_document_idx`             | `wms_transfer_request_line_document_id_line_no_key`  |
| `wms_transfer_business_line`     | `wms_transfer_business_line_source_batch_id_idx`     | `wms_transfer_business_line_source_batch_idx`        |

原始索引大小合计 **360,448 字节（352 KiB）**，减少十份索引维护工作；不把该数值当作已测得的业务耗时提升。对象定义、owner、设置、注释和保留索引，以及表约束/RLS/ACL 指纹，存入 Git 忽略的 `supabase/backups/20261023-redundant-index-objects/`。从磁盘重新读取校验定义后，在事务中删除、复测、重建十个索引并回滚，校验二十个原对象定义均恢复。这是对象范围恢复备份，不是全项目数据备份。

[PostgreSQL 17 的 DROP INDEX](https://www.postgresql.org/docs/17/sql-dropindex.html)说明普通删除会获取表级排他锁。本次使用有序 NOWAIT 锁、lock_timeout、statement_timeout 和 RESTRICT；正式事务只执行对象及目录断言后即提交，身份读取和计划再次在提交后复核。没有使用 CASCADE 或生成版本迁移文件。

### 验证契约

- 真正的 authenticated 数据库角色、模拟请求声明：平台全部/指定租户、普通用户本租户/伪造头四种场景在同一事务中读取的记录指纹完全一致；普通用户伪造头不改变结果。账号自己的 bootstrap 行在有效和无效选择下均可读。未授予客户端查询权限的字段授权表仍保持拒绝，未临时放宽表权限。
- 九张表的约束定义与索引归属、RLS 策略、owner 和 ACL 指纹前后一致；十个保留索引有效，原有唯一性和外键约束保留。提交后独立读取与既有装卸/字段权限四身份回归再次通过。
- 十类键前缀/排序查询均有保留索引执行路径。为了证明路径可用，诊断仅在当前事务关闭顺序扫描，不改变全局设置，不用这些小表和热缓存耗时计算加速倍数。早期“全键等值必须选指定索引”的断言被证实过强：权限查询选择了已有外键索引，该轮已回滚；后续检查真实等值查询与复合前缀能力。
- `tests/integration/redundant-index-coverage.sql` 在修改前报十个候选、修改后通过，只报告候选，不自动删除对象；`database-index-read-scope.sql` 验证读取与 bootstrap 契约。完整 HTTP/Auth 登录仍需单独验收。

performance advisors 的重复索引告警由一组降为零，独立目录回归也确认 public/app_private 中已无满足本次严格条件的可安全移除等价索引。其余提示仍包括 336 项外键索引、620 项未使用索引与 1236 项多 permissive policy；68 项无主键提示均在私有/备份 schema，不能据此直接给业务表补主键。规则说明见[重复索引](https://supabase.com/docs/guides/database/database-linter?lint=0009_duplicate_index)与[未使用索引](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)。提示计数会受统计和并行改动影响，不等同于本次删除数量。

### 后续按实测排序

pg_stat_statements 的 authenticated 历史均值提供了菜单单应用约 379.56 ms、菜单批量约 241.48 ms、风险检查任务约 1390.89 ms 的线索。这些是累计统计，不证明当前版本仍有同样耗时；后续以真实数据库角色重新测量当前函数和查询计划，再决定改造。不要因为外键告警数量多就创建全部索引。

实例报告 PostgreSQL 17.6。[Supabase 2026-09-25 补丁公告](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes)涉及 15.19/17.11 及扩展兼容检查，需要单独核实托管实例的补丁状态和升级安排；本轮未升级实例。只读预检未发现 ltree 索引、浮点 GiST 索引和需要非内置选择率估计器的自定义操作符；没有据此声称完成 pgcrypto 历史密文审计。

## 菜单授权与树渲染的当前边界

公开接口仍为 `get_menus_for_current_application(text)`、`get_menus_for_current_applications(text[])`、`get_menus_for_current_user()`。批量授权集中到 owner-only 的 `app_private.get_authorized_application_menus_flat(text[])`，树渲染集中到 `build_authorized_menu_tree(jsonb,uuid,text)`，旧的两个单应用内部转接已删除。授权缓存仅在单次请求中构造，键是授权 ID，布尔值表示有无授权子节点；false 的叶节点仍然是合法授权节点。父节点查询使用 `idx_sys_menu_parent_sort`，不反复复制整个 JSON 字典。

三项公开接口的权限与签名保留，内部帮助函数不授予客户端执行。旧全量接口补齐账号停用、软删除、角色停用检查并使用空 search_path。完整值、层级和排序验证，以及三个失效身份回滚夹具，见主仓 `tests/integration/menu-response-contract.sql` 和 `menu-inactive-identities.sql`。详细测量、恢复与验收限制见[质量记录](./quality.md)。
