# 产品概览

亿企工场 是一个以 Vue 3、TypeScript、Element Plus 和 Supabase 为核心的企业级业务中台。它不是只有页面样式的后台模板，而是把认证、多租户、权限、审批、业务应用和 AI 治理组织成可以继续交付的工程。

## 适用场景

- 需要统一认证、组织、角色和菜单的多业务企业平台。
- 需要 MDM 主数据、MES 制造、WMS 仓储、TMS 运输、VMS 车辆、FMS 财务、HR 人力、SMIS 安全生产或司机移动协同能力的项目。
- 希望用 Supabase 快速获得 PostgreSQL、Auth、Storage、Realtime、RPC 和 Edge Functions 的团队。
- 希望 AI 能被普通员工安全使用，同时保留审计、权限和受控写入边界的组织。

## 系统由什么组成

| 层次          | 负责内容                                                                               |
| ------------- | -------------------------------------------------------------------------------------- |
| Platform 平台 | 登录、租户、组织、用户、角色、菜单、按钮权限、数据字典、附件、系统参数、审批和 AI 配置 |
| 业务应用      | MDM、MES、WMS、TMS、VMS、FMS、HR、SMIS，各自拥有页面、业务 API、类型和领域规则         |
| 移动执行      | 司机 H5 / 微信小程序，完成接单、打卡、装卸货、签收、收车、凭证和费用上报               |
| Supabase 后端 | Auth、PostgreSQL、RLS、Storage、Realtime、RPC、数据库函数与 Edge Functions             |
| 工程质量      | TypeScript、ESLint、Prettier、Stylelint、Node Test、Playwright、UI 审计和构建预算      |

## 核心原则

### 平台统一，领域自治

平台只维护一套登录、租户、菜单、权限、布局、公共组件和 Supabase 客户端。业务仓只维护自己的领域代码，主仓通过 Git submodule 固定每个业务应用的版本并统一构建。

### 前端可见不等于后端授权

菜单和按钮权限改善用户体验，数据库 RLS、RPC 校验和服务端权限才是最终安全边界。业务写入、配置、发布与流程状态变化必须同时经过界面和服务端校验。

### AI 默认可用，但能力分级

启用的普通用户可以使用租户范围内、业务数据安全的只读 AI 能力。修改业务数据、发布、配置和工作流状态变化属于受控能力，只允许平台超级管理员，并保留运行与反馈审计。

## 推荐阅读顺序

1. 部署人员阅读[快速开始](/guide/quick-start)与[生产部署](/operations/deployment)。
2. 管理员阅读[首次登录](/guide/first-login)和[组织、用户与权限](/manual/permissions)。
3. 业务人员按需进入[业务模块](/modules/mdm)，司机端使用与部署见[司机端](/modules/driver)。
4. 开发人员从[总体架构](/development/architecture)开始。

::: tip 文档边界
本文档按当前主仓、子仓和项目数据库配置整理。某个租户看不到的菜单通常是尚未授权，不代表功能不存在。
:::
