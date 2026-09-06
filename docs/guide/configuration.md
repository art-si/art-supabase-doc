# 环境配置

项目使用 Vite 环境变量。`VITE_*` 会被编译进浏览器代码，只能保存公开配置；所有私密凭证必须放在 Supabase Edge Functions Secrets、部署平台的服务端密钥区或其他受控服务端环境中。

## 推荐文件分工

| 文件                  | 用途                                    | 是否提交               |
| --------------------- | --------------------------------------- | ---------------------- |
| `.env`                | 所有环境共享的非敏感默认值              | 视团队策略             |
| `.env.development`    | 本地开发                                | 只提交无敏感信息的模板 |
| `.env.production`     | 生产构建开关与公共路径                  | 只提交无敏感信息的模板 |
| 部署平台变量          | 生产 URL、publishable key、地图公开配置 | 由平台管理             |
| Edge Function Secrets | AI、邮件、外部服务等私密凭证            | 永不进入 Git           |

## API Provider

`VITE_API_PROVIDER` 支持：

- `supabase`：默认模式，前端使用项目统一 Supabase Provider。
- `java`：保留的 Java 后端适配模式，需要同时配置 API 地址与相应服务。

Supabase 模式缺少 `VITE_SUPABASE_URL` 或 `VITE_SUPABASE_KEY` 时，应用会在启动阶段明确失败，避免带着错误配置继续运行。

## 应用身份与公共路径

`VITE_APP_CODE` 可取 `platform`、`fms`、`hr`、`smis`、`tms`、`vms`、`mdm`、`wms`、`mes`。主平台通常使用 `platform`；独立业务壳使用自己的应用代码，并从平台权限契约获得对应菜单。

| 应用     | 默认端口 | 默认部署路径          |
| -------- | -------: | --------------------- |
| Platform |     3006 | `/art-supabase-pro/`  |
| FMS      |     3012 | `/art-supabase-fms/`  |
| HR       |     3013 | `/art-supabase-hr/`   |
| SMIS     |     3014 | `/art-supabase-smis/` |
| VMS      |     3015 | `/art-supabase-vms/`  |
| TMS      |     3016 | `/art-supabase-tms/`  |
| MDM      |     3017 | `/art-supabase-mdm/`  |
| WMS      |     3018 | `/art-supabase-wms/`  |
| MES      |     3019 | `/art-supabase-mes/`  |

部署到域名根目录时设置 `VITE_BASE_URL=/`；部署到 Pages 子路径时，值必须以 `/` 开始和结束。

## 构建选项

- `VITE_OUT_DIR`：产物目录。
- `VITE_BUILD_COMPRESS`、`VITE_USE_GZIP`：压缩相关开关。
- `VITE_BUILD_ANALYZE`：生成构建体积分析。
- `VITE_DROP_CONSOLE`：生产构建是否移除控制台输出。
- `VITE_DEVTOOLS`：是否启用 Vue 开发工具。
- `VITE_FILE_VIEWER`、`VITE_FILE_VIEWER_ASSETS`：文件预览能力与静态资源位置。

完整清单见[环境变量参考](/reference/environment)。

## 配置验收

构建前至少确认：

- 生产项目 URL、publishable key 与部署环境一致。
- 浏览器产物中不存在 secret key、`service_role` 或 AI Provider 密钥。
- `VITE_BASE_URL` 与反向代理路径一致。
- 地图 Key 已限制允许域名。
- 生产环境关闭不需要的开发工具与分析产物。
