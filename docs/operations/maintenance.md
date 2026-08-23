# 升级与维护

项目同时依赖主仓、多个业务子仓、Supabase 服务和前端依赖。维护要保持提交、数据库契约、部署产物和文档版本可追溯。

## 更新业务子模块

```powershell
git status --short
pnpm modules:update
git submodule status
pnpm modules:build
pnpm typecheck
pnpm build
```

`modules:update` 会改变 gitlink，提交前逐个查看子模块新旧提交和变更内容。不要把未验证的远端最新提交直接发布。

## 更新依赖

1. 先阅读 Vue、Vite、Element Plus、Supabase、TypeScript 等官方 changelog。
2. 一类依赖一批升级，避免框架、UI 和数据库 SDK 同时大跨度变化。
3. 精确审查 lockfile，防止意外引入多个版本或脚本依赖。
4. 运行类型、单元、UI 审计、Stylelint、构建和关键 E2E。
5. Supabase SDK 或 CLI 升级同时检查 Auth、Data API、Storage 和 CLI 命令变化。

## 数据库维护

- 迁移只追加，不修改已经进入共享环境的历史文件。
- 发布前记录 migration list，发布后再次核对。
- 新增约束前先检查存量数据。
- 大表索引、字段回填和类型变化评估锁与执行时间。
- 删除契约前先确认所有主仓/子仓消费者已迁移。

## AI 项目快照

项目结构、组件约定或能力变化后运行：

```powershell
pnpm snapshot:ai
git diff -- supabase/functions/ai-project-planner/project-snapshot.generated.ts
```

生成文件只由脚本更新，不手工编辑。

## 文档维护

功能变更同时更新相关操作、权限、环境变量和排障页。文档站提交前运行：

```powershell
Set-Location modules/art-supabase-doc
pnpm format
pnpm check
```

## 定期巡检

| 周期     | 建议任务                                               |
| -------- | ------------------------------------------------------ |
| 每次发布 | 冒烟、日志、权限、RLS、迁移和回滚确认                  |
| 每周     | AI 失败与质量、审批回调、通知失败、Storage 异常        |
| 每月     | Supabase advisors、依赖与密钥扫描、慢查询和索引        |
| 每季度   | 权限复核、离职账号、租户隔离、灾备恢复演练、文档有效性 |
