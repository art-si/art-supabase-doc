# 安全基线

安全目标是让认证、租户、权限、数据范围、字段范围和外部能力在服务端形成闭环。前端隐藏、菜单和按钮都不能替代数据库或 Edge Function 的授权。

## 身份与会话

- 使用 Supabase Auth 作为身份来源，敏感操作校验有效用户和会话。
- 不使用可编辑 `user_metadata` 做授权。
- 删除用户不等于立即撤销所有已签发 Token；敏感场景同时处理会话撤销和合理 JWT 有效期。
- 登录回跳只传同源页面地址，不在 URL、日志或菜单中传 access/refresh token。
- 跨域独立应用需要服务端一次性授权码 SSO。

## 2026-10-23 旧菜单接口失效身份守卫

旧 `get_menus_for_current_user()` 已和有效身份规则对齐：普通账号须处于启用状态、未软删除，角色须启用。原函数在有效的停用账号回滚夹具上仍返回菜单，新实现对停用账号、软删除账号及仅命中停用角色的账号均返回空结构。临时账号/角色及审计字段已回滚并核验恢复，没有停用预置角色。公开 RPC 原 EXECUTE 授权保留，新的批量授权与缓存树渲染实现仅 owner 可执行，全部使用固定空 search_path。

实际 authenticated 数据库角色下的四种请求身份场景及完整菜单字段/父子/顺序断言在正式提交后再次通过；这些 SQL 检查不替代完整 HTTP 登录验收。恢复备份与两阶段回滚演练记录见现有质量文档，未生成版本迁移文件。

## 密钥

| 密钥                      | 放置位置                | 是否可进浏览器 |
| ------------------------- | ----------------------- | -------------- |
| publishable / legacy anon | `VITE_SUPABASE_KEY`     | 可以           |
| secret / service_role     | 服务端 Secrets          | 绝不可以       |
| AI Provider Key           | Edge Function Secrets   | 绝不可以       |
| 地图浏览器 Key            | Vite 环境变量，限制域名 | 可以           |

定期扫描 Git 历史、构建产物和日志中的高风险密钥。发现泄露先吊销/轮换，再清理历史，不要只删除当前文件。

## 数据库

- 暴露 schema 中每张业务表启用 RLS。
- 策略包含租户/所有权谓词，而不是只有 `TO authenticated`。
- UPDATE 同时有 SELECT、`USING` 和 `WITH CHECK`。
- View 使用 `security_invoker = true`，或放在未暴露 schema 并撤销公开访问。
- `SECURITY DEFINER` 放私有 schema，固定 `search_path`，撤销 PUBLIC 执行并主动鉴权。
- 写操作同时校验精确按钮权限和业务状态。
- 运行 Supabase security/performance advisors。

## 2026-10-23 装卸作业上下文读取修复

已修复 `tms_get_waybill_cargo_operation_context` 平台超管分支忽略具体已选租户的 P1。公开读取函数使用 `app_private.tenant_in_current_read_scope`，平台全部租户仍可跨租户读取，具体选择约束到该租户，普通用户忽略伪造范围头。内部 raw 函数未授予 authenticated 执行权限；保留原业务授权与字段裁剪。

正式执行前，为该函数保存并校验对象范围恢复备份，从磁盘备份执行恢复演练，并在事务内完成四种身份测试后回滚确认原定义恢复。正式修改与提交后的独立请求均通过同样断言。定义 MD5 从 `cff7a993b3906c803cc0ecdf2f533b83` 变为 `45a55ff2215d35b3cd677da804e3ebbf`，owner、ACL、SECURITY DEFINER 与空 search_path 保持一致。本次只变更单个读取函数，没有改动业务行或写入状态规则；对象备份不等同于全项目数据备份。

回归脚本位于主仓 `tests/integration/tms-cargo-context-tenant-scope.sql`，使用实际 authenticated 数据库角色、既有账号和运单验证平台全部/指定租户、普通用户本租户和伪造范围头。SQL 模拟请求声明，不替代真实 HTTP 登录与会话验收。证据保留在现有质量文档、普通集成测试和 Git 忽略的恢复备份中，不生成版本迁移文件或恢复 `supabase/runbooks`。

修改后 security advisors 规则类别未新增；通用 SECURITY DEFINER 提示仍需逐个核对内部授权。匿名可执行的 `get_login_default_language()` 已查阅定义，固定空 search_path 并仅返回平台语言白名单 zh/en，保留登录前读取用途。WMS 调拨明细重复来源批次索引已连同九个完全被唯一索引覆盖的普通索引清理，已完成恢复、约束/RLS/ACL 及角色读取验证；未使用索引统计不能作为直接删除业务索引的依据。

## Storage 与文件

对象路径、附件记录和 Storage policy 同时校验租户与业务归属。上传限制类型、大小和数量；下载使用授权查询或短时签名 URL。用户上传内容不作为可信 HTML 执行。

## AI

- 所有启用的普通用户可以使用租户范围内、安全只读 AI；持有对应业务 `Add` 权限时，可通过 AI 创建本租户主数据。
- 其他业务修改、配置、发布、流程状态变化和受控写入要求平台超级管理员，UI 与服务端同时校验。
- AI 上下文经过数据、字段和敏感信息裁剪。
- Prompt 不包含密钥；Provider 原始错误不直接返回。
- 运行、反馈、生成物和审核作为服务器管理的审计数据保存，不能绕过业务写权限。

## 日志与隐私

日志记录请求 ID、能力、状态、耗时和必要诊断，不记录密码、Token、完整身份证、银行卡、Provider Key 或未脱敏业务正文。截图、E2E 录屏和 AI 反馈使用测试或脱敏数据。

## 发布前安全清单

1. 新表的 RLS、GRANT 和 Data API 暴露设置已检查。
2. 新按钮同时具有页面声明与服务端校验。
3. 新函数、View、Storage policy 和 Edge Function 已审计。
4. 浏览器产物中没有私密密钥。
5. 普通用户跨租户、越权路由和直接请求测试均被拒绝。
6. 关键日志、告警、回滚和密钥轮换路径可用。
