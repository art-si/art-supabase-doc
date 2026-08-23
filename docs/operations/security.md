# 安全基线

安全目标是让认证、租户、权限、数据范围、字段范围和外部能力在服务端形成闭环。前端隐藏、菜单和按钮都不能替代数据库或 Edge Function 的授权。

## 身份与会话

- 使用 Supabase Auth 作为身份来源，敏感操作校验有效用户和会话。
- 不使用可编辑 `user_metadata` 做授权。
- 删除用户不等于立即撤销所有已签发 Token；敏感场景同时处理会话撤销和合理 JWT 有效期。
- 登录回跳只传同源页面地址，不在 URL、日志或菜单中传 access/refresh token。
- 跨域独立应用需要服务端一次性授权码 SSO。

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

## Storage 与文件

对象路径、附件记录和 Storage policy 同时校验租户与业务归属。上传限制类型、大小和数量；下载使用授权查询或短时签名 URL。用户上传内容不作为可信 HTML 执行。

## AI

- 所有启用的普通用户可以使用租户范围内、安全只读 AI。
- 业务修改、配置、发布、流程状态变化和受控写入要求平台超级管理员，UI 与服务端同时校验。
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
