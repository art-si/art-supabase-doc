# 社区发布文案

本页提供可复用的项目简介。发布前核对仓库链接、线上地址、功能状态与截图是否可公开；简介和 Topics 见[仓库简介文案](/reference/repositories)。

## 推荐标题

- 技术社区：亿企工场：Vue 3 + Supabase 的多租户权限与模块化业务平台
- 产品社区：从供应链到制造、仓储和运输，十个业务应用如何协同

## 头条版

亿企工场以 Vue 3、TypeScript、Element Plus 和 Supabase 搭建统一平台。主仓负责认证、租户范围、动态菜单、按钮与字段权限、审批、共享组件和 AI 治理；SCM、MDM、MES、WMS、TMS、VMS、PMIS、FMS、HR、SMIS 十个 Web 业务应用分别维护自己的页面与领域规则。TMS 司机端以独立的 H5/微信小程序参与运单履约。

已接入的跨域流程包括 SCM 采购收料到 WMS 收料入库、SCM 发货通知到 WMS 销售出库，以及 MES 工单到 WMS 领料与完工入库。库存变更以 WMS 受控过账和流水为准；TMS 与 WMS 的承运交接回执仍需独立契约。PMIS 提供点检、巡检、保养和维修任务，MES 保留自己的生产执行事实。

平台通过 Supabase Auth、PostgreSQL RLS、RPC、Storage 和 Edge Functions 组织服务端边界。普通用户只访问本人租户与授权业务范围；启用的普通用户可以使用只读 AI，并在具有对应业务 `Add` 权限时通过 AI 创建本租户主数据。其他 AI 修改、配置、发布与工作流状态变化需要平台超级授权和审计。

主仓：<https://gitee.com/wangyanghub/art-supabase-pro>

在线体验：<https://869123771.github.io/art-supabase-pro/>

官方文档：<https://869123771.github.io/art-supabase-doc/>

## OSChina 版

亿企工场把统一平台与十个 Web 业务应用拆分为独立仓库，由主仓通过 Git submodule 锁定版本。平台负责身份、租户、菜单、权限、审批、共享运行时和 AI 治理；SCM、MDM、MES、WMS、TMS、VMS、PMIS、FMS、HR、SMIS 维护各自的业务页面、API 和领域规则。

目前 SCM 采购收料与销售发货通知可进入 WMS 的对应入出库流程，MES 工单可衔接 WMS 领料与完工入库。预约、波次拣选和 TMS 承运交接回执仍需继续建设。文档明确区分已接入页面、已贯通流程和后续范围，并说明数据库租户隔离、精确权限与 AI 受控写入的服务端边界。

源码与操作说明分别见[主仓](https://gitee.com/wangyanghub/art-supabase-pro)和[官方文档](https://869123771.github.io/art-supabase-doc/)。

## GitHub Release / Discussion 版

### Yiqi Workshop documentation and module update

The platform now documents ten Web business applications: SCM, MDM, MES, WMS, TMS, VMS, PMIS, FMS, HR, and SMIS. The current MES and WMS guides cover their implemented work order and inventory workflows, while the SCM and PMIS guides describe their own business boundaries. The driver app remains an independently deployed H5 and WeChat Mini Program.

The documentation also records the tenant and permission contract, the direct database change workflow, deployment checks, and the current product screenshots. Feature status is stated separately from future integration work.

Source: <https://github.com/869123771/art-supabase-pro>

Documentation: <https://869123771.github.io/art-supabase-doc/>

## 配图顺序

1. 当前工作台及今日运营概览。
2. SCM 与 WMS 单据流，或 MES 工单与 WMS 领料。
3. AI 智能填单或实时在途监控。
4. PMIS 设备任务、HR 花名册或 SMIS 应急演练。
5. TMS 司机移动工作台。

使用经过脱敏的真实产品截图；发布前检查图中租户、客户、财务、账号和个人信息。
