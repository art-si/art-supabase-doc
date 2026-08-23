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
  tenant_id = app_private.current_tenant_id()
);
```

更新策略同时提供 `USING` 与 `WITH CHECK`，并记住 UPDATE 还需要 SELECT 策略：

```sql
create policy "tenant editors can update records"
on public.business_record
for update
to authenticated
using (
  tenant_id = app_private.current_tenant_id()
  and app_private.has_permission('Business:Edit')
)
with check (
  tenant_id = app_private.current_tenant_id()
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

## 迁移工作流

不要手写迁移文件时间戳。先查看 CLI 帮助，再创建迁移：

```powershell
supabase --help
supabase migration --help
supabase migration new add_business_feature
```

在开发分支/本地项目验证 SQL、RLS、函数和回滚路径。完成后运行 advisors、数据库测试和迁移列表检查。生产变更优先新增兼容契约，避免同一版本中先删旧字段再更新消费者。

## Realtime

Realtime 事件仅作为“数据可能已变化”的通知。收到事件后重新调用授权后的查询，不把事件 payload 当成已经通过字段权限和租户校验的业务记录。
