# 仓库简介与 Topics

本页提供可直接复制到 Gitee“简介”和 GitHub About 的统一文案。中文简介保持业务定位清晰，自动同步到 GitHub 后无需改写；Homepage 建议填写对应在线站点。

## 推荐简介

| 仓库                         | 简介                                                                                                | Homepage                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `art-supabase-pro`           | Vue 3 + Supabase 模块化企业业务平台，统一多租户、权限、审批、十大业务应用、司机协同与可治理 AI。    | `https://869123771.github.io/art-supabase-pro/`  |
| `art-supabase-mdm`           | 亿企工场 主数据治理应用，覆盖统一目录、来源追溯、资料质量、生产组织、工厂日历、工作中心与工艺路线。 | `https://869123771.github.io/art-supabase-mdm/`  |
| `art-supabase-mes`           | 亿企工场 制造执行应用，连接工单、排程、现场任务、报工审核与 WMS 领料和完工入库。                    | `https://869123771.github.io/art-supabase-mes/`  |
| `art-supabase-wms`           | 亿企工场 仓储管理应用，连接库存流水、收料、领料、出入库、退货、调拨、盘点与追溯。                   | `https://869123771.github.io/art-supabase-wms/`  |
| `art-supabase-scm`           | 亿企工场 供应链管理应用，连接报价、销售与采购单据，并与 WMS 收料和销售出库协作。                    | 独立站点未发布，暂不填写                         |
| `art-supabase-pmis`          | 亿企工场 设备管理应用，覆盖点检、巡检、预防性维护、保养、维修与分析。                               | 独立站点未发布，暂不填写                         |
| `art-supabase-tms`           | 亿企工场 智慧运输应用，覆盖主数据、智能开单、运单调度、在途监控、签收回单与司机协同。               | `https://869123771.github.io/art-supabase-tms/`  |
| `art-supabase-vms`           | 亿企工场 车辆管理应用，覆盖一车一档、保险年检、维修事故、零部件、里程、提醒与车辆健康。             | `https://869123771.github.io/art-supabase-vms/`  |
| `art-supabase-fms`           | 亿企工场 财务管理应用，覆盖运输结算、资金、会计核算、票税资产、报表与智能财务分析。                 | `https://869123771.github.io/art-supabase-fms/`  |
| `art-supabase-hr`            | 亿企工场 人力资源应用，覆盖组织岗位、员工生命周期、招聘、考勤薪酬、绩效人才与员工服务。             | `https://869123771.github.io/art-supabase-hr/`   |
| `art-supabase-smis`          | 亿企工场 安全生产应用，覆盖设备台账、资质培训、应急救援、反违章、劳保工器具与事故管理。             | `https://869123771.github.io/art-supabase-smis/` |
| `supabase-mobile-tms-driver` | 亿企工场 TMS 司机端，支持 H5 与微信小程序的接单、定位打卡、装卸货、签收回单、收车和费用上报。       | 按实际 H5 部署地址填写                           |
| `art-supabase-doc`           | 亿企工场官方文档，覆盖平台、业务模块、司机端、Supabase 安全、开发、部署、运维与排障。               | `https://869123771.github.io/art-supabase-doc/`  |
| `art-supabase-site`          | 亿企工场独立产品官网，展示平台、业务模块、产品截图与技术架构。                                      | `https://869123771.github.io/art-supabase-site/` |

## 推荐 Topics

平台主仓：

```text
vue3 typescript supabase postgresql multi-tenant rbac workflow scm mes wms tms pmis ai-copilot element-plus
```

业务子仓在公共 Topics 基础上保留自己的领域词：

| 仓库   | 建议追加                                                              |
| ------ | --------------------------------------------------------------------- |
| TMS    | `transportation logistics dispatch waybill fleet-tracking`            |
| VMS    | `vehicle-management fleet-maintenance vehicle-lifecycle`              |
| FMS    | `finance accounting treasury settlement invoicing`                    |
| HR     | `human-resources talent-management workforce`                         |
| SMIS   | `safety-management ehs emergency-response equipment-management`       |
| MDM    | `master-data-management data-governance data-quality manufacturing`   |
| MES    | `manufacturing-execution production-planning shop-floor traceability` |
| WMS    | `warehouse-management inventory inbound outbound stock-traceability`  |
| SCM    | `supply-chain procurement sales-order quotation fulfillment`          |
| PMIS   | `equipment-management inspection maintenance repair asset-operations` |
| 司机端 | `uni-app wechat-mini-program mobile-h5 driver-app proof-of-delivery`  |
| 文档站 | `vitepress documentation user-guide deployment-guide`                 |
| 官网   | `vue3 product-site enterprise-software`                               |

## 替换建议

1. Gitee 与 GitHub 使用同一条简介，避免双端长期漂移。
2. Homepage 只填写已经可以访问的地址；司机端未公开部署时可以留空。
3. README 标题、仓库简介和 Topics 使用同一组产品名：亿企工场 / SCM / MDM / MES / WMS / TMS / VMS / PMIS / FMS / HR / SMIS。
4. 功能尚未进入当前分支时不要提前写入简介；具体能力以各仓 README 和官方文档为准。
