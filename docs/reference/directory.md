# 目录结构

## 主仓

```text
art-supabase-pro/
├─ src/
│  ├─ api/                 # API 门面、Provider 和领域接口
│  ├─ assets/              # 主应用静态资源
│  ├─ components/
│  │  ├─ core/             # ArtTable、ArtForm、ArtDialog 等核心组件
│  │  └─ business/         # 跨业务复用组件
│  ├─ config/              # 应用身份、Provider 与系统设置
│  ├─ hooks/               # 组合式能力
│  ├─ plugins/             # Supabase 等插件实例
│  ├─ router/              # 动态菜单装载、守卫与框架静态路由
│  ├─ store/               # Pinia 用户、菜单、主题等状态
│  ├─ types/               # 全局与 API 类型
│  ├─ utils/               # 通用工具和 Supabase 错误/函数边界
│  └─ views/               # Platform 平台页面
├─ modules/
│  ├─ art-supabase-doc/    # 官方文档站
│  ├─ art-supabase-fms/    # 财务业务仓
│  ├─ art-supabase-hr/     # 人力业务仓
│  ├─ art-supabase-smis/   # 安全生产业务仓
│  ├─ art-supabase-tms/    # 运输业务仓
│  └─ art-supabase-vms/    # 车辆业务仓
├─ supabase/
│  ├─ functions/           # 公共 Edge Functions 与共享模块
│  ├─ migrations/          # 平台数据库迁移
│  └─ tests/               # 数据库测试
├─ scripts/                # 审计、构建、模块管理和快照脚本
├─ tests/
│  ├─ unit/                # 单元测试
│  └─ e2e/                 # Playwright 流程和视觉测试
├─ playwright/             # 测试认证状态与辅助资源
├─ screenshots/            # 产品真实截图
├─ .agents/skills/         # 项目开发与 UI 约定
└─ .mcp.json               # 项目 Supabase MCP 配置
```

司机端是与主仓并列的独立仓库，不放在 `modules/` 下：

```text
supabase-mobile-tms-driver/
├─ src/
│  ├─ pages/               # 登录、工作台、运单、车辆与我的
│  ├─ components/business/ # 移动端业务组件
│  ├─ api/                 # Supabase、运单、费用、车辆与档案契约
│  ├─ stores/              # 身份、司机档案、字典与运单状态
│  └─ static/              # 移动端静态资源
├─ supabase/               # 司机端相关函数、迁移或配置
├─ docs/                   # H5 生产构建产物
└─ package.json
```

## 业务子仓通用结构

```text
art-supabase-<domain>/
├─ src/
│  ├─ views/               # 领域页面；不重复嵌套领域名
│  ├─ api/                 # 领域 API 门面和 Provider
│  ├─ types/               # 领域类型
│  └─ integrations/        # 必要的稳定集成入口
├─ supabase/               # 领域迁移、函数或规则（按仓库需要）
├─ tests/unit/             # 领域规则测试
├─ docs/                   # 独立应用构建产物（子仓约定）
└─ package.json
```

## 文档仓

```text
art-supabase-doc/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts        # 导航、侧栏、搜索与站点配置
│  │  └─ theme/            # 首页组件与视觉主题
│  ├─ public/              # Logo 与脱敏产品截图
│  ├─ guide/               # 快速开始
│  ├─ manual/              # 平台使用手册
│  ├─ modules/             # 业务应用说明
│  ├─ development/         # 二次开发
│  ├─ operations/          # 部署运维
│  └─ reference/           # 速查资料
├─ deploy/                 # 部署配置样例
├─ package.json
└─ pnpm-lock.yaml
```

## 放置判断

- 只属于一个业务域：放对应子仓。
- 所有应用共享的认证、布局、权限、组件或工具：放主仓。
- 页面只负责 UI，传输逻辑放 API/Provider。
- 跨域读取契约放数据库/RPC 边界，消费者只依赖稳定 DTO。
- 司机端保持移动技术栈自治，通过稳定服务契约与 TMS 协作，不复制 Web 页面代码。
- 构建生成物由脚本生成，不手工编辑。
