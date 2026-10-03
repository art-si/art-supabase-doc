# Supabase 开发

Supabase 行为更新较快，开发前先查看[官方 Changelog](https://supabase.com/changelog)和对应产品文档。项目使用 Supabase Auth、PostgreSQL、Data API、Storage、Realtime、RPC 与 Edge Functions，数据库才是最终授权边界。

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
