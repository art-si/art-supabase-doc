# 前端开发约定

主项目使用 Vue 3、TypeScript、Vite、Pinia、Vue Router、Element Plus、SCSS 和一组 `Art*` 核心组件。新增功能应延续现有业务页面结构，而不是在页面内重新搭一套基础设施。

## 开始编码前

1. 阅读目标页面、同目录 `modules`、API 类型和最近完成的相邻模块。
2. 使用 `rg` 搜索现有组件、工具、依赖和相同模式。
3. 检查工作区状态并保护无关修改。
4. 确定成功、加载、空、错误/重试、无权限、长内容和窄屏状态。

## 组件优先级

| 场景               | 首选                                                              |
| ------------------ | ----------------------------------------------------------------- |
| 查询列表           | `ArtTableQuery`                                                   |
| 搜索区             | `ArtSearchBar`                                                    |
| 表格工具栏         | `ArtTableHeader`                                                  |
| 表格与分页         | `ArtTable` + `useTable<T>`                                        |
| 弹窗/抽屉          | `ArtDialog` / `ArtDrawer`                                         |
| 元数据表单         | `ArtForm`                                                         |
| 业务数据选择       | `ArtTableSingleSelect` / `ArtTableMultipleSelect` / tree variants |
| 详情展示           | `ArtDescriptions`                                                 |
| 工作区页头         | `BusinessWorkspaceHeader`                                         |
| 创建/编辑/详情页头 | `ArtPageHeader`                                                   |
| 业务分节           | `ArtSectionTitle`                                                 |

核心组件缺少通用能力时，先扩展核心组件并补文档，再让业务页面消费；不要在多个页面复制近似实现。

## 页面与 API 分层

- `src/views/**` 负责交互与展示。
- `src/api/**` 暴露稳定业务函数。
- Provider 负责 Supabase/Java 传输和响应转换。
- `src/utils`/hooks 只放真正跨域的共享策略。
- 页面禁止直接调用 `supabase.from(...)`、`request` 或 Provider。

## 列表与表单

列表记录、列配置、选择和 API 返回使用同一个泛型类型，不用 `any` 或双重断言掩盖类型错误。弹窗内部拥有表单、初始化、提交和重置，对父页面只暴露类型化 `handleOpen()`。

字典类枚举从用户 Store 的字典映射读取；表格使用列 `dict` 配置，其他位置使用 `ArtDictDisplay`。客户、供应商等远程业务对象使用 `ArtForm` 的 item-level API 或共享数据选择器。

## 权限

所有可执行业务动作必须：

1. 在 `sys_menu` 以 `type = 'button'` 注册精确权限代码。
2. 在页面显式绑定同一个代码。
3. 在 API/数据库边界再次校验。
4. 运行 `pnpm permissions:audit`。

搜索、重置、关闭、分页、Tab 切换等纯界面控制不需要业务按钮权限。

## 可访问性与视觉质量

- 使用原生 `button`、`a`、输入控件和标题语义。
- 图标按钮必须有可访问名称、焦点样式和必要的提示。
- 外链新窗口同时使用 `rel="noopener noreferrer"`。
- 不使用 `transition: all`，并尊重 reduced motion。
- 避免页面级横向滚动；为 flex/grid 子项设置合理的 `min-width: 0`。
- 浅色/深色、边框/阴影模式和窄屏下保持层级、对比和完整操作。
- 失败信息说明“发生了什么、下一步做什么”，不暴露 SDK、SQL 或堆栈。

## 类型与异步

边界数据先视为 `unknown` 并进行收窄。提交 loading 必须在 `finally` 恢复，防止重复提交和过期请求覆盖新状态。替换技术错误时保留 cause 或受控原始字段供诊断。
