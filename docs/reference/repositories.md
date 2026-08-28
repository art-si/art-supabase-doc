# 仓库简介与 Topics

本页提供可直接复制到 Gitee“简介”和 GitHub About 的统一文案。中文简介保持业务定位清晰，自动同步到 GitHub 后无需改写；Homepage 建议填写对应在线站点。

## 推荐简介

| 仓库                         | 简介                                                                                                        | Homepage                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `art-supabase-pro`           | Vue 3 + Supabase 模块化企业业务平台，统一多租户、权限、审批、TMS、VMS、FMS、HR、SMIS、司机协同与可治理 AI。 | `https://869123771.github.io/art-supabase-pro/`  |
| `art-supabase-tms`           | Art Supabase Pro 智慧运输应用，覆盖主数据、智能开单、运单调度、在途监控、签收回单与司机协同。               | `https://869123771.github.io/art-supabase-tms/`  |
| `art-supabase-vms`           | Art Supabase Pro 车辆管理应用，覆盖一车一档、保险年检、维修事故、零部件、里程、提醒与车辆健康。             | `https://869123771.github.io/art-supabase-vms/`  |
| `art-supabase-fms`           | Art Supabase Pro 财务管理应用，覆盖运输结算、资金、会计核算、票税资产、报表与智能财务分析。                 | `https://869123771.github.io/art-supabase-fms/`  |
| `art-supabase-hr`            | Art Supabase Pro 人力资源应用，覆盖组织岗位、员工生命周期、招聘、考勤薪酬、绩效人才与员工服务。             | `https://869123771.github.io/art-supabase-hr/`   |
| `art-supabase-smis`          | Art Supabase Pro 安全生产应用，覆盖设备台账、资质培训、应急救援、反违章、劳保工器具与事故管理。             | `https://869123771.github.io/art-supabase-smis/` |
| `supabase-mobile-tms-driver` | Art Supabase TMS 司机端，支持 H5 与微信小程序的接单、定位打卡、装卸货、签收回单、收车和费用上报。           | 按实际 H5 部署地址填写                           |
| `art-supabase-doc`           | Art Supabase Pro 官方文档，覆盖平台、业务模块、司机端、Supabase 安全、开发、部署、运维与排障。              | `https://869123771.github.io/art-supabase-doc/`  |

## 推荐 Topics

平台主仓：

```text
vue3 typescript supabase postgresql multi-tenant rbac workflow tms vms fms hrms smis ai-copilot element-plus
```

业务子仓在公共 Topics 基础上保留自己的领域词：

| 仓库   | 建议追加                                                             |
| ------ | -------------------------------------------------------------------- |
| TMS    | `transportation logistics dispatch waybill fleet-tracking`           |
| VMS    | `vehicle-management fleet-maintenance vehicle-lifecycle`             |
| FMS    | `finance accounting treasury settlement invoicing`                   |
| HR     | `human-resources talent-management workforce`                        |
| SMIS   | `safety-management ehs emergency-response equipment-management`      |
| 司机端 | `uni-app wechat-mini-program mobile-h5 driver-app proof-of-delivery` |
| 文档站 | `vitepress documentation user-guide deployment-guide`                |

## 替换建议

1. Gitee 与 GitHub 使用同一条简介，避免双端长期漂移。
2. Homepage 只填写已经可以访问的地址；司机端未公开部署时可以留空。
3. README 标题、仓库简介和 Topics 使用同一组产品名：Art Supabase Pro / TMS / VMS / FMS / HR / SMIS。
4. 功能尚未进入当前分支时不要提前写入简介；具体能力以各仓 README 和官方文档为准。
