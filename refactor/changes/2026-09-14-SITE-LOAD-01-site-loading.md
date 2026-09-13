# SITE-LOAD-01 文档示例加载与导航

起点 `76499e7a3e033c8350ff495ba8bfff4ca5c08d25`。从 SITE-03 分出浏览器加载
与导航，保留父任务的 i18n/文档/LLM/翻译流程，并明确桌面剩余 UI 的 TS 迁移。
没有修改核心/插件运行代码、公开类型、样式钩子、包入口、版本或锁文件。

## 实现与兼容边界

- `packages/artplayer-vitepress/browser/` 新增 TS loader、桌面桥接、移动入口和
  导航模块。README 解释生命周期、生成规则、已验证边界与剩余任务。原 mobile.js
  和 public/main.js 变为生成资产；新增桌面 loader.js 在 index.html 原引导链前
  加载。移动端内联同一模块，保持原页面和查询 URL。
- 固定旧提交复现：移动 loadScript 失败不恢复 define；两次同时加载各自保存
  临时 define 后，Promise.all 成功也可能留下 undefined。新 loader 按输入顺序
  串行所有批次，成功绝对 URL 缓存、失败移除并可重试；CSS 保持顺序但不改 AMD。
  在成功、失败、append 抛错和取消时恢复原 define 描述符或原本不存在的状态。
  不兼容的不可变属性在插入前失败，不静默绕过。
- dispose 拒绝等待项与未来调用并拆监听器/待加载元素。已加载元素仍归页面。
  移除 script 不保证浏览器取消已经开始的脚本求值；第三方不可逆全局副作用
  不承诺回滚。非 BFCache 的 pagehide 清理，persisted 页保留可恢复 loader。
  真实设备和 BFCache 行为没有计为通过。
- 桌面保留 Monaco、Run、导入、存储和现有 cleanup/destroy 顺序，替换重复 loader。
  初始化代次阻止晚到的旧示例覆盖新 Run。example 仍优先于 code；移动/桌面默认
  示例仍是 mobile/index；HTTP 错误不作为代码执行。查询保留原始 `+`、最后重复
  参数和一次显式解码。移动示例在普通非严格函数作用域运行，不变成 ES module。
- Run Code 编码 libs/code，支持子元素点击并处理缺失代码节点；localhost、
  127.0.0.1、IPv6 loopback 均用自身 host 的 HTTP 8082，非本地仍用旧官方编辑器。
  首次非中文访问保留现存英文对应页与 query/hash，缺对应页回英文首页；英文页
  不再自跳，lang-init 原 key/值保留，显式后续中文选择不被覆盖。存储不可用时
  保留请求页，防止循环。英文路径从实际 Markdown 清单生成，未虚构翻译页面。
- common.js 原有 32 项目标 lint 错误已处理：const/布局、声明实际外部 globals，
  eval 仅针对编辑器原 Run 作用域保留定向说明。该旧 UI 文件纳入根 lint；未把
  它计为完整 TS 迁移。libUris 改 const 后，其实际加载列表测试同时支持 let/const。

## 工程与验证

无新依赖，复用固定 esbuild 生成 ES2020 经典脚本。build:site-assets/check:site-assets
分别生成/只读核对三个资产，后者进入 CI；typecheck:site-assets 严格检查浏览器
模块，生成 CLI 在 docs-tools 下 checkJs。root build:docs 先生成资产，直接 workspace
VitePress 命令的编排仍属父任务；没有在本任务暗中请求翻译服务。

- 5 项新增 Node 回归验证旧问题、串行/去重/重试/取消、描述符边界、URL 与语言规则。
  最终连同编辑器、文档退出码、清单/示例回归共 13 项通过。完整 baseline 522
  通过（在最终 common.js 的 const/布局清理前；相关最终消费者已独立回归）。
- 首轮三浏览器 15 项通过。扩展运行 20 通过/1 失败，唯一失败是 Firefox 在
  page fixture 创建时超时 20000ms，尚未进入测试代码；当时完整基线并行运行。
  不能据此断言唯一根因是 CPU。保留 trace/report，等基线完成后串行运行，不
  改 timeout/retry/skip；最终 24 通过（21 新加载/导航 + 3 Monaco 回归），0 跳过。
- 浏览器实际访问 root/mobile 页面与本地 Monaco；移动播放推进、暂停、销毁；
  桌面依赖复用、example 优先、重复 Run 清理、旧响应隔离；原生脚本 404/重试
  和 AMD 恢复。取消测试控制 append 阶段，只证明回收/Promise，不证明取消已
  请求脚本的执行。Run Code 使用真实点击，语言重定向用受控 HTTPS 页面路由。
- 根 lint 0 error/1 既有生成声明 warning；目标 lint、两套工具/浏览器严格类型、
  资产只读一致性、严格 Node24.21.0/Yarn1.22.22 工具链、CI 50 项通过。
  具体日志/源与产物/浏览器版本指纹见验证 JSON。

外部分析/广告脚本在自动化路线中为空响应，没有修改生产广告配置。未验证
广告服务、所有 233 示例、真实设备、完整 VitePress 构建/生成 docs/document、
遠端 CI/Pages/npm；没有手动 Chrome/iab 会话、推送或发布。此次测试不是这些
范围的替代证据。SITE-03/04/05、EX-03 和包验收仍开放。

本任务单独提交并审计。回退提交可恢复原页面/脚本和根命令；会带回旧 define
失败与乱序问题，应优先针对回归修复。修改 TS 后重新 build:site-assets，不手改
生成资产；维护实际模块 README、任务、当前清单和独立变更记录。
