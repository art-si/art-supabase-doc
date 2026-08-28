# 社区发布文案

本页用于同步发布到头条、OSChina 和 GitHub。发布前确认仓库链接、在线地址和截图均可公开访问；平台简介与 Topics 见[仓库简介文案](/reference/repositories)。

## 推荐标题

- 通用：我把一套 Vue 3 + Supabase 企业业务系统拆成了 8 个可独立运行的开源仓库
- 技术社区：Art Supabase Pro：Vue 3 + Supabase 的多租户、权限、审批与模块化实践
- 产品社区：从运输开单到司机签收，一套开源企业业务平台如何连接 TMS、财务、人力与安全生产

## 头条版

我最近把持续开发的 Art Supabase Pro 做了一次完整整理，并将主平台、五个业务应用、司机端和官方文档分别维护为可独立运行的开源仓库。

它不是只有一个后台模板页面。平台以 Vue 3、TypeScript、Vite 和 Supabase 为基础，统一处理登录、多租户、菜单按钮权限、字段权限、审批工作流、文件预览和可治理 AI；业务层包含 TMS 智慧运输、VMS 车辆管理、FMS 财务管理、HR 人力资源与 SMIS 安全生产。

运输业务可以从客户、承运商、合同和智能开单开始，进入运单调度、在途监控、签收回单和运输结算。独立司机端支持 H5 与微信小程序，司机可完成接单、定位打卡、装卸货、发车、到达、签收、收车、费用和现场凭证上报。

我特别关注“能否真正用于企业业务”这件事：普通用户只能访问租户范围内的数据，跨租户控制和受控写入保留平台超级管理员边界；关键数据操作由 PostgreSQL RLS 和安全 RPC 兜底，不只依赖前端按钮隐藏。AI 能力也区分安全只读与受控写入，并保留历史、反馈和运行观测。

这次更新补齐了各仓中文与英文 README、真实运行截图、模块说明、部署运维文档和统一仓库简介，同时完成主平台、五个子应用、文档站、司机端 H5 与微信小程序的生产构建。

主仓：<https://gitee.com/wangyanghub/art-supabase-pro>

GitHub：<https://github.com/869123771/art-supabase-pro>

在线体验：<https://869123771.github.io/art-supabase-pro/>

官方文档：<https://869123771.github.io/art-supabase-doc/>

欢迎体验、提 Issue，也欢迎一起讨论多租户权限、Supabase RLS、企业审批、运输财务一体化和模块化前端的实践方式。

## OSChina 版

Art Supabase Pro 是一套基于 Vue 3、TypeScript、Vite、Element Plus、Supabase 与 PostgreSQL 的模块化企业业务平台。项目将平台底座和领域应用分离：主仓负责认证、租户上下文、动态菜单、按钮与字段权限、审批工作流、公共组件和 Supabase 客户端；TMS、VMS、FMS、HR、SMIS 分别维护自己的页面、API、类型和业务规则，司机端使用 uni-app 提供 H5 与微信小程序构建。

### 为什么拆成多个仓库

单体后台在功能增多后容易出现构建耦合、领域边界模糊和发布节奏互相影响的问题。当前结构让每个业务仓可以独立安装、检查、构建和部署，主仓再通过 Git submodule 固定经过验证的版本。这样既保留统一用户体验，也让运输、车辆、财务、人力和安全生产拥有清晰的代码所有权。

### 安全边界

- 前端菜单和按钮用于体验与操作入口控制。
- PostgreSQL RLS、SECURITY DEFINER RPC 的显式授权和租户上下文负责最终数据边界。
- 普通用户仅允许租户范围内、业务数据安全的只读 AI 操作。
- 跨租户修改、配置、发布、流程状态变化和受控 AI 写入要求平台超级管理员，并在 UI 与数据库边界同时校验。

### 当前业务范围

- TMS：主数据、合同、智能开单、订单与运单、调度、在途监控、签收回单和运输结算。
- VMS：一车一档、保险年检、维修事故、零部件、里程、提醒和车辆健康。
- FMS：应收应付、资金、结算、会计核算、票税资产、报表和智能财务分析。
- HR：组织岗位、员工生命周期、招聘、考勤薪酬、绩效人才和员工服务。
- SMIS：设备台账、资质培训、应急救援、反违章、劳保工器具和事故管理。
- 司机端：接单、定位打卡、运输节点、签收回单、收车和费用上报。

本次版本已经通过主仓 UI/权限/数据库安全审计、TypeScript、ESLint、Stylelint 和 139 项单测，并完成全部 Web 应用、VitePress 文档、司机端 H5 与微信小程序构建。

项目地址：<https://gitee.com/wangyanghub/art-supabase-pro>

GitHub 镜像：<https://github.com/869123771/art-supabase-pro>

文档：<https://869123771.github.io/art-supabase-doc/>

## GitHub Release / Discussion 版

### Art Supabase Pro ecosystem refresh

This release refreshes the complete Art Supabase Pro ecosystem:

- Reworked Chinese and English READMEs for the platform, TMS, VMS, FMS, HR, SMIS, driver app, and documentation site.
- Added current product screenshots for HR, SMIS, finance, transportation, vehicle lifecycle, and the mobile driver workspace.
- Documented repository positioning, Topics, module ownership, deployment, operations, and the driver lifecycle.
- Synchronized the linked Supabase migration history and strengthened permission and database-security audit compatibility for immutable remote history.
- Verified the platform with UI, permission, database-security, TypeScript, ESLint, Stylelint, and 139 unit-test checks.
- Built all five domain applications, the platform host, VitePress documentation, driver H5, and WeChat Mini Program targets.

Start here: <https://github.com/869123771/art-supabase-pro>

Documentation: <https://869123771.github.io/art-supabase-doc/>

## 配图顺序

1. 主平台运输运营工作台。
2. AI 智能填单或实时在途监控。
3. HR 员工花名册。
4. SMIS 应急演练计划。
5. TMS 司机移动工作台。

优先使用仓库内当前真实运行截图，不使用包含密钥、个人隐私、浏览器账号信息或本地开发工具界面的图片。
