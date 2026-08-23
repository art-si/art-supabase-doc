import { defineConfig } from 'vitepress'

const publicBase = process.env.DOCS_BASE || '/art-supabase-doc/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Art Supabase Pro',
  titleTemplate: ':title · Art Supabase Pro 文档',
  description: 'Art Supabase Pro 官方使用手册、开发指南与部署文档',
  base: publicBase,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,
  sitemap: { hostname: 'https://wangyanghub.gitee.io/art-supabase-doc/' },
  head: [
    ['link', { rel: 'icon', href: `${publicBase}logo.webp` }],
    ['meta', { name: 'theme-color', content: '#5b5bd6' }],
    ['meta', { name: 'author', content: 'Art Supabase Pro' }],
  ],
  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  themeConfig: {
    logo: '/logo.webp',
    siteTitle: 'Art Supabase Pro',
    nav: [
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '使用手册', link: '/manual/platform' },
      { text: '业务模块', link: '/modules/tms' },
      { text: '开发指南', link: '/development/architecture' },
      { text: '部署运维', link: '/operations/deployment' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '认识项目',
          items: [
            { text: '产品概览', link: '/guide/overview' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '环境配置', link: '/guide/configuration' },
            { text: '首次登录', link: '/guide/first-login' },
          ],
        },
      ],
      '/manual/': [
        {
          text: '平台使用手册',
          items: [
            { text: '工作台与通用操作', link: '/manual/platform' },
            { text: '组织、用户与权限', link: '/manual/permissions' },
            { text: '系统管理', link: '/manual/system-management' },
            { text: '数据中心', link: '/manual/data-center' },
            { text: '审批工作流', link: '/manual/workflow' },
            { text: 'AI 能力', link: '/manual/ai' },
          ],
        },
      ],
      '/modules/': [
        {
          text: '业务应用',
          items: [
            { text: 'TMS 智慧运输', link: '/modules/tms' },
            { text: 'VMS 车辆管理', link: '/modules/vms' },
            { text: 'FMS 财务管理', link: '/modules/fms' },
            { text: 'HR 人力资源', link: '/modules/hr' },
            { text: 'SMIS 安全生产', link: '/modules/smis' },
          ],
        },
      ],
      '/development/': [
        {
          text: '二次开发',
          items: [
            { text: '总体架构', link: '/development/architecture' },
            { text: '前端开发约定', link: '/development/frontend' },
            { text: 'Supabase 开发', link: '/development/supabase' },
            { text: '业务模块协作', link: '/development/modules' },
            { text: '测试与质量门禁', link: '/development/quality' },
          ],
        },
      ],
      '/operations/': [
        {
          text: '部署与运维',
          items: [
            { text: '生产部署', link: '/operations/deployment' },
            { text: '安全基线', link: '/operations/security' },
            { text: '升级与维护', link: '/operations/maintenance' },
            { text: '故障排查', link: '/operations/troubleshooting' },
          ],
        },
      ],
      '/reference/': [
        {
          text: '参考手册',
          items: [
            { text: '命令速查', link: '/reference/commands' },
            { text: '环境变量', link: '/reference/environment' },
            { text: '目录结构', link: '/reference/directory' },
          ],
        },
      ],
    },
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新' },
    editLink: {
      pattern: 'https://gitee.com/wangyanghub/art-supabase-doc/edit/master/docs/:path',
      text: '在 Gitee 上编辑此页',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/869123771/art-supabase-pro' },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1.8a10.2 10.2 0 1 0 10.2 10.2V9.5H11.4a2.1 2.1 0 0 0-2.1 2.1v2.1h7.4a4.9 4.9 0 1 1-4.7-6.6h10A10.2 10.2 0 0 0 12 1.8Z"/></svg>',
        },
        link: 'https://gitee.com/wangyanghub/art-supabase-pro',
      },
    ],
    footer: {
      message: '基于 MulanPSL-2.0 发布',
      copyright: 'Copyright © 2025–present Art Supabase Pro',
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '文档目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
