# 复用 docs HTML 与在线编辑器进行真实测试

2026-09-10 已核对下列页面及脚本源码，尚未实际运行页面。优先复用现有 HTML 和示例作为浏览器验收入口，保留旧 URL/参数和编辑器功能；另补可靠断言、状态隔离和报告，不把演示能打开当作兼容性通过。

## 入口与实际加载方式

| 本地路径 | 源码入口 | 已有行为 | 测试用途 |
| --- | --- | --- | --- |
| `/` | [index.html](../docs/index.html)、[common.js](../docs/assets/js/common.js) | Monaco 编辑器；`libs` 加载额外 JS/CSS，`example` 读取示例，`code` 接收代码；Run 重新执行 | 旧示例、插件组合、重复 Run、错误反馈、编辑器声明与用户交互 |
| `/esm.html` | [esm.html](../docs/esm.html) | import map 加载 compiled 中核心、danmuku、document-pip 与语言包 | 实际 ESM/资源加载及组合行为 |
| `/i18n.html` | [i18n.html](../docs/i18n.html) | compiled 全局脚本和多个语言包，示例选择 id | 全局名称、语言注册；需补操作用例验证语言切换 |
| `/mobile.html` | [mobile.html](../docs/mobile.html) | uncompiled 核心、mobile.js 与移动 viewport | 移动布局、触摸和全屏；实际媒体行为另用真机确认 |
| `/iframe.html` | [iframe.html](../docs/iframe.html)、[iframe 示例](../docs/assets/example/iframe.js) | uncompiled 核心与 iframe tool，子页面 inject；父示例创建 iframe 并通信 | 父子通信、全屏及卸载；只打开子页面不能完成集成验收 |
| `/test/` | [test/index.html](../docs/test/index.html)、[build-test.js](../scripts/build-test.js) | Mocha/Chai，compiled 核心及部分插件，生成的文档用例与外部播放依赖 | 文档 smoke 的现有入口，补充状态断言与自动化结果读取 |

开发入口继续采用仓库脚本：`yarn dev` 交互选择包，在 `http://localhost:8082` 验证。[dev.js](../scripts/dev.js) 当前只构建所选包到 `docs/uncompiled/<name>/index.js`，不能假设所有插件同时更新。正常构建产生分发文件，不手改 compiled/uncompiled/dist 或生成的 test.js。

chapter 试点可使用 `http://localhost:8082/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter`，测试前确认核心及插件已构建。这是已有路由的用法，不表示当前服务已启动或页面已通过。

## 测试前必须固定的状态

1. 编辑器核心由 `localStorage.prod` 决定：true 加载 compiled/artplayer.js，否则加载 uncompiled/artplayer/index.js；插件由 libs 决定。Prod 开关不保证插件一并变为生产构建，也不能单靠文件夹名证明是当前候选。
2. 每次记录核心、插件、语言包和外部 SDK 的实际 URL、版本及产物内容标识。旧/新组合必须有意指定，不能把陈旧构建或误混版本作为候选验收证据。
3. 独立用例使用隔离测试上下文或测试专属 origin，并明确 prod/ts/code/log 状态。不要清除用户日常 Chrome 的全部存储。单独设置连续 Run 用例，检查多实例全部销毁、监听器/DOM/资源清理及重复加载依赖的影响。
4. common.js 在移动设备判断成立时转到 mobile.html；报告记录最终 URL，移动页通过不能计作桌面 Monaco 编辑器通过。
5. 选中 TS 模式不等于严格类型检查通过；当前编辑器直接 eval 内容，不能假设可以运行任意 TS 语法。类型验收仍由固定版本 tsc 和真实消费者完成。
6. 优先使用许可明确的本地样本。外部 CDN、广告、流媒体和模型请求逐项登记；网络失败与播放器回归区分。受控测试可隔离无关外部请求并记录，实际 SDK 集成保留独立验收，不能一概屏蔽后声称完整通过。

## 从演示补成可靠回归

现有 build-test.js 从中文文档 Run Code 块提取示例，排除 en/plugin 等目录。生成器通常在执行代码后等待 100ms 调用 done，外层 try/catch 不足以证明异步播放成功；测试页加载了插件也不等于覆盖了全部插件文档。

保留该 smoke 用途，并逐场景补充可失败的语义断言：实际播放时间推进/暂停停止、seek 结果、媒体和播放器事件、字幕及清晰度状态、切源并发、销毁重建。异步等待使用明确事件/状态条件，捕获 error/unhandledrejection，明确清理和超时。生成器改源码后重新生成，不手补生成文件掩盖问题。

在线编辑器兼容用例继续通过实际 Run、键盘和控件交互验证；大量核心状态回归可以复用同一示例和样本在轻量测试页面运行，避免每项测试都依赖 Monaco 初始化。两类用例均保留，不能用轻量页面通过替代编辑器验收。

发布阶段将相同页面/示例接到候选 tarball 的提取内容，使用明确的测试目录或服务路由映射保留相对路径，并记录映射及完整性。此能力待 ENG-05/ENG-07 实现；当前没有可用的新开关或命令。不能只检查开发 bundle 就批准 npm 发布。

## 任务归属与验收

| 任务 | 负责交付 |
| --- | --- |
| BASE-04 | 记录上述页面、核心/插件加载路径、存储状态及核心/chapter 的真实行为基线 |
| ENG-05 | 复用页面/样本，建立隔离状态、受控媒体、错误采集、语义断言和浏览器报告；支持候选资源映射 |
| ENG-07 | 提供可追溯的候选 tarball 和隔离消费者内容，供页面验收复用 |
| SITE-01 | 核对编辑器、声明注入、示例和生成链的完整清单 |
| SITE-02 | 修正文档测试生成流程，区分 smoke 与行为测试，不伪造异步通过 |
| EX-03 | 全量验收旧页面/参数、编辑器 Run、ESM/i18n/mobile/iframe 和外部播放集成 |
| REVIEW-02/03 | 分别复查真实浏览器覆盖与待发布内容的一致性 |

页面行为和媒体验证按 [测试规范](testing.md) 留证，发布结论按 [多轮复盘](release-reviews.md) 核对。该清单不新增重复实施任务；真实状态以 tasks.json 为准。

## BASE-04 已落地的记录

[完整路径台账](baselines/demo-inventory.json) 已覆盖 29 个示例、36 个 HTML 和 22 包，包括生成文档、独立 upscaler 与站点验证页面。源脚本/菜单参数与 editor prod/ts/code/log 规则已有记录；这些官方入口尚未运行，运行时实际存储值和网络来源仍待 EX-03 采集。

独立发布包夹具的 DOM/CSS、Tab/热键、设置与网页全屏已在内置浏览器两次实测，见 [覆盖及问题](baselines/dom-coverage.md)。它没有运行 Monaco，不代表编辑器 Run 或官方 chapter demo 通过。thumbnail 无菜单示例依赖不在当前 workspace 的旧插件，已交 SITE-01/EX-03 核实。
