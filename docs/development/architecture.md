# 总体架构

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
| `art-supabase-smis` | SMIS 页面、API、类型、迁移与领域 Edge Functions                                       |
| `art-supabase-tms`  | TMS 页面、API、类型、运输规则与领域 Edge Functions                                    |
| `art-supabase-vms`  | VMS 页面、API、类型、车辆规则与车辆健康 Edge Function                                 |
| `art-supabase-wms`  | WMS 页面、业务 API、类型与仓储执行规则                                                |
| `art-supabase-doc`  | 官网、使用手册、开发和运维文档                                                        |

## 动态菜单与页面装载

业务导航来自 Supabase `sys_menu`。数据库保存稳定路由前缀，例如 `/tms/...`、`/vms/...`；主仓组件加载器把它映射到对应子仓 `src/views`。业务页面不能为了显示侧栏而写进静态路由。

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
