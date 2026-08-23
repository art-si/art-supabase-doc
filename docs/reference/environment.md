# 环境变量

所有 `VITE_*` 变量都会进入浏览器产物，只允许保存公开配置。

## 核心运行

| 变量                | 示例                      | 说明                                    |
| ------------------- | ------------------------- | --------------------------------------- |
| `VITE_API_PROVIDER` | `supabase`                | `supabase` 或 `java`                    |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Project URL                    |
| `VITE_SUPABASE_KEY` | `sb_publishable_...`      | 浏览器 publishable key；兼容旧 anon key |
| `VITE_APP_CODE`     | `platform`                | `platform/fms/hr/smis/tms/vms`          |
| `VITE_BASE_URL`     | `/art-supabase-pro/`      | 静态公共路径                            |
| `VITE_PORT`         | `3006`                    | 开发端口                                |
| `VITE_OUT_DIR`      | `docs`                    | 构建输出目录                            |

## Java Provider

| 变量                    | 说明                 |
| ----------------------- | -------------------- |
| `VITE_API_URL`          | Java API 基础地址    |
| `VITE_API_PROXY_URL`    | 开发代理目标         |
| `VITE_WITH_CREDENTIALS` | 跨域请求是否携带凭据 |
| `VITE_ACCESS_MODE`      | 后端适配所需访问模式 |
| `VITE_USE_MOCK`         | 是否启用 Mock        |

## 地图

| 变量                         | 说明                             |
| ---------------------------- | -------------------------------- |
| `VITE_AMAP_KEY`              | 高德地图浏览器 Key，限制允许域名 |
| `VITE_AMAP_SECURITY_JS_CODE` | 高德 JS API 安全密钥             |

## 构建与调试

| 变量                   | 说明               |
| ---------------------- | ------------------ |
| `VITE_VERSION`         | 应用版本展示/注入  |
| `VITE_DEVTOOLS`        | Vue 开发工具开关   |
| `VITE_OPEN_ROUTE_INFO` | 路由调试信息开关   |
| `VITE_DROP_CONSOLE`    | 生产移除控制台输出 |
| `VITE_BUILD_ANALYZE`   | 体积分析开关       |
| `VITE_BUILD_COMPRESS`  | 构建压缩方式       |
| `VITE_USE_GZIP`        | gzip 产物开关      |
| `VITE_USE_CDN`         | CDN 资源策略       |

## 文件与前端能力

| 变量                      | 说明                                     |
| ------------------------- | ---------------------------------------- |
| `VITE_FILE_VIEWER`        | 文件预览能力开关                         |
| `VITE_FILE_VIEWER_ASSETS` | 文件预览静态资源路径                     |
| `VITE_LOCK_ENCRYPT_KEY`   | 前端锁屏相关配置；不能代替服务端密钥管理 |

## 文档站

| 变量        | 默认值               | 说明                                   |
| ----------- | -------------------- | -------------------------------------- |
| `DOCS_BASE` | `/art-supabase-doc/` | VitePress 部署公共路径；根域部署用 `/` |

## 不得放入前端变量

- Supabase secret key 或 `service_role`。
- AI Provider API Key。
- 数据库密码、PAT、SMTP 密码。
- 私钥、Webhook 签名密钥或长期访问令牌。

这些值应进入 Edge Function Secrets、CI/部署平台服务端变量或专用密钥管理系统。
