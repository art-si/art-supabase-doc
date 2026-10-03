<script setup lang="ts">
import { withBase } from 'vitepress'

const journey = [
  { number: '01', title: '获取代码', text: '拉取主仓与固定版本的业务子模块。' },
  { number: '02', title: '连接 Supabase', text: '配置项目 URL、发布密钥与服务端能力。' },
  { number: '03', title: '建立权限', text: '创建租户、组织、用户、角色与按钮授权。' },
  {
    number: '04',
    title: '进入业务',
    text: '按需启用 SCM、MDM、MES、WMS、TMS、VMS、PMIS、FMS、HR 与 SMIS。',
  },
]

const audiences = [
  {
    title: '第一次部署',
    text: '从环境准备到生产发布，按清单完成可复现安装。',
    link: '/guide/quick-start',
    action: '开始安装',
  },
  {
    title: '业务与管理员',
    text: '了解菜单、租户、权限、审批以及日常业务操作。',
    link: '/manual/platform',
    action: '阅读手册',
  },
  {
    title: '开发与运维',
    text: '遵循模块边界、RLS、安全基线和质量门禁扩展系统。',
    link: '/development/architecture',
    action: '查看架构',
  },
]
</script>

<template>
  <section class="home-overview" aria-labelledby="delivery-title">
    <div class="home-overview__heading">
      <p>从代码到业务闭环</p>
      <h2 id="delivery-title">一条清晰的落地路径</h2>
      <span>文档围绕真实交付顺序组织，每一步都能继续深入到配置、操作或开发细节。</span>
    </div>

    <ol class="journey-rail">
      <li v-for="item in journey" :key="item.number">
        <span class="journey-rail__number">{{ item.number }}</span>
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </li>
    </ol>

    <div class="audience-grid">
      <article v-for="audience in audiences" :key="audience.title">
        <h3>{{ audience.title }}</h3>
        <p>{{ audience.text }}</p>
        <a :href="withBase(audience.link)">
          {{ audience.action }} <span aria-hidden="true">→</span>
        </a>
      </article>
    </div>

    <figure class="product-frame">
      <img
        :src="withBase('/screenshots/dashboard.png')"
        alt="亿企工场工作台，展示今日运营概览、实时运输与车辆风险提醒"
        width="1920"
        height="878"
        loading="lazy"
      />
      <figcaption>
        工作台汇总今日运营概览、调度入口、实时运输和车辆风险提醒；实际数据随租户与权限变化。
      </figcaption>
    </figure>
  </section>
</template>
