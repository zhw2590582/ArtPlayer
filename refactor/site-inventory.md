# 文档站、示例与生成链清单

2026-09-16 SITE-04后续：Ads/VAST双语指南和本地入口补齐，当前52 Markdown、61 HTML、
中英各26页；四页类型、每页35个链接及12组导航通过，外部IMA/广告播放独立验收。
见[本次记录](changes/2026-09-16-SITE-04-ads-vast-guides.md)。

2026-09-16 SITE-04后续：自动缩略图/多字幕双语内容和导航补齐，当前48 Markdown、
57 HTML、中英各24页，原样示例/类型/链接及12组导航通过。见
[本次记录](changes/2026-09-16-SITE-04-auto-multi-guides.md)，不计原生播放或全站完成。

2026-09-16 SITE-04后续：新增Document PiP/ASR双语指南和本地入口，当前44 Markdown、
53 HTML、中英各22页；四页类型/链接及12组浏览器导航通过，完整语义和播放验收
仍独立保留。见[本次记录](changes/2026-09-16-SITE-04-dpip-asr-guides.md)。

2026-09-16 SITE-04检查点：Chapter/Ambilight已补独立双语指南、原样示例与本地导航；
当前40 Markdown、49 HTML，中英各20页。八处空Run Code控件补上可见标签，导航
版本同步6.0.0并标注unreleased。逐包内容核对见[跟踪表](site-content-review.md)；
963条核心声明成员及其余生态内容仍需语义核对，不能按页面数量视为完成。

核心分发后续：13 个 core JavaScript 压缩产物已通过固定 esbuild 0.12.6 精确
复现，loader 与 css/nls loader 固定源码匹配；十种语言编辑/查找和核心 diff
worker 三引擎 33/33 通过。两个 source map 的 549 份不同准备源码已登记，
后续来源边界与完整编译限制见[记录](changes/2026-09-15-SITE-07-monaco-core-build.md)。

当前补充：Monaco 四种 mode 与 76 种基础语言的完整产物复现、三引擎语法验证
已完成。核心 Markdown 内嵌 DOMPurify 2.3.1 / marked 3.0.2 的固定来源和模块
适配已匹配；补齐四份说明后站点共交付 85 份 notice。核心其余源码与内嵌来源
仍开放，见[记录](changes/2026-09-15-SITE-07-monaco-core-origins.md)。下文较早的
未分发/未迁移描述保留为历史发现，不作为当前状态。

2026-09-15 Monaco 后续：CSS/HTML/JSON 完整 worker 已由固定源码和压缩配方复现，
七个依赖的九份原始许可、两个格式器署名和补充说明已实际交付。全站 81 份
notice 的 HTTP 字节、链接及三引擎功能检查通过，见
[记录](changes/2026-09-15-SITE-07-monaco-language-notices.md)。Monaco core/mode/
语言定义及其余来源细节仍开放，不能按本检查点认为整个站点已可发布。

console.js 的 102 个模块基线发现了卸载回调、多容器丢日志和 Error 消息丢失。
SITE-CONSOLE-01 已迁移自有 TS 入口和修复生命周期，100 个保留模块的来源与
47 份说明也已核对，见[当前维护入口](../scripts/site-vendor/console/README.md)。

2026-09-15后续：vConsole 3.15.0 已由固定源码/锁文件精确重建，补原始声明所引用的
MIT 正文和九个运行时组件的完整通知；VENDOR-07 关闭。三引擎真实播放/日志/销毁及
全部 HTTP 通知 3/3 通过。见[当前记录](changes/2026-09-15-SITE-07-vconsole-notices.md)。
下面的许可缺口描述属于先前检查点；其他站点来源/字体/媒体门槛继续保留。

SITE-07检查点已将Monaco LICENSE/ThirdPartyNotices和vConsole上游LICENSE原文加入
站点分发，并建立固定文件清单/指纹及只读检查。进一步检查发现vConsole上游文件
只有许可声明，缺其声称附带的MIT全文；不能把“已取得LICENSE”当成完整许可闭环。
Monaco真实TS worker三引擎通过；旧vConsole销毁错误已由SITE-VCONSOLE-01修复。
2026-09-15：Codicons字体精确匹配npm0.0.26，其历史许可、README和署名已随站点分发；
真实三引擎6/6包含编辑器、播放、销毁及HTTP原文/字体指纹。详见
[Codicons记录](changes/2026-09-15-SITE-07-codicons.md)。其余组件和字体媒体仍须复核。
原始SITE-01清单及下面的历史未分发描述保留，当前入口见scripts/site-vendor/README.md。

SITE-SMOKE-01 后续已将 build:test 拆为 TS 解析、生成和浏览器运行模块，新增
确定性 examples.json 和 readonly check，替换 100ms done 为实例 ready/错误/清理。
以下 SITE-01 的旧生成器问题属于历史发现；当前维护入口见
[docs-smoke README](../scripts/docs-smoke/README.md)。SITE-02 后续已将声明生成
迁到 `scripts/editor-declarations/`：全部 22 份加载声明整组验证，Chapter/VAST
不再走删除 import 的文本回退。见[模块说明](../scripts/editor-declarations/README.md)。
以下 SITE-01 对这些旧生成问题的描述是历史发现，站点/编辑器交互仍需后续验收。

SITE-LOAD-01 后续修复并抽取共享 loader、移动入口和 Run Code/语言导航，TS
来源及生成规则见[浏览器模块](../packages/artplayer-vitepress/browser/README.md)。
SITE-AI-DOCS-01/SITE-BUILD-01 已落实生成、翻译草稿和暂存构建；SITE-03 完成
桌面 UI 的 TS 模块拆分、实际 TS emit 与资源管理。完整内容/页面验收仍给 SITE-04/05。

SITE-01 在 `d62ab13a35c756ea567c426d4fbe00d893dd7e2b` 后核对当前源码。
可重跑清单见 [site-inventory.json](baselines/site-inventory.json)；它登记
初始 22 包、27 Markdown、30 示例、36 HTML、963 条声明成员和 204 个资产指纹。
SITE-DANMUKU-01 增加英文指南后，当前清单为 28 Markdown、37 HTML，其余数量不变。
成员统计包括继承接口、重载和 runtime 声明，不能当作 963 个不同公开 API。
标题匹配只是人工核对的候选位置；所有成员均明确交由 SITE-04 检查语义和中英文说明。

## 页面与内容责任

- 当前中文 14 页、英文 14 页；核心安装、选项、i18n、四类组件、六类高级说明有对应页面。
- Danmuku 已补齐双语独立页和导航（SITE-DANMUKU-01）；其余 15 插件使用包 README 和编辑器链接，仍缺独立双语指南。
- 2 proxy、2 tool 有包 README 和示例。包内维护文档不等于站点双语使用文档。
- 清单逐包列出 README、ARCHITECTURE、菜单引用和示例；SITE-04 负责补充双语入口及缺失说明，
  不要求为了统一形式机械复制 20 份 README。SITE-05 验证实际生成页面和链接。
- 本次补齐文档站自己的 [维护地图](../packages/artplayer-vitepress/README.md)。
  VitePress 导航仍显示 `5.3.x`，目标版本文案由 REL-09/SITE-04 同候选同步。

清单用 Markdown parser 读取真正的标题，用 TypeScript AST 枚举声明成员；
不会把代码块中的 `##` 当作标题，也不把同名标题自动判定为该接口已经有文档。
声明文件/符号/成员/行号和候选页面可追溯。接口语义、锚点可达性与运行正确性仍需人工和浏览器验证。

## 六类执行 HTML 与其它路径

| 入口 | 当前加载行为 | 后续责任 |
| --- | --- | --- |
| `/` | `console.js` → 按 localStorage.prod 选核心 → Monaco AMD loader → common.js | SITE-03 / EX-03 |
| `/mobile.html` | vConsole、uncompiled 核心、独立 mobile.js loader | SITE-03 / EX-03 |
| `/esm.html` | import map 指向 compiled ESM，含 Danmuku、Document PiP、印尼语 | EX-03 |
| `/i18n.html` | script 载入 compiled 核心及语言，读取旧语言 global 别名 | SITE-03 / EX-03 |
| `/iframe.html` | uncompiled 核心和 iframe tool，调用 inject | PKG-IFRAME-05 / EX-03 |
| `/test/` | Mocha/Chai、compiled 包及远程 SDK、生成 test.js | SITE-02 / EX-03 |

另外 28 个 `docs/document/**/*.html` 是现存生成站点路径（包含 404）；Google
验证页保持原路径/内容；`/upscaler/` 是独立工具入口，不能按 VitePress 重建范围删除。
共 36 HTML，与 BASE-04 路径集合一致。现有生成 HTML 不证明来自当前源码的成功构建。

原 29 个示例路径全部保留；第 30 个 `asr.local.js` 来自提交
`2cede66933e92b253bab4b3b2502f0268b22b087`，无菜单链接，使用 ASR 插件的显式 libs URL。
它采集本地音频并显示模拟字幕，不是远程识别演示。原 BASE-04 保持原样；新增路径见
[demo-additions.json](baselines/demo-additions.json)。`demos.mjs --check` 将两者合并验证完整集合，
未知新增、遗漏旧路径、重复登记、错误路由或未知 owner 均不能通过。

## 查询参数、状态和编辑器声明

`prod` 是 localStorage 键/勾选项，不是已实现的查询参数；只选择核心产物，
不会重写 libs 中的插件路径。`libs` URI 解码后按换行分隔，依扩展名加载 JS/CSS，
当前 loader 串行加载并缓存成功 URL，失败允许重试，保留列表依赖顺序。
`example` 优先于 `code`；均不存在时桌面取 index.js，移动取 mobile.js。
桌面移动重定向保留 location.search。桌面 Run 先发送 `artplayer:example:cleanup`，
销毁已有实例后在独立经典函数作用域运行；重启将 libs/code 写入 URL。
TS 模式先通过实际 Monaco worker 发射 JavaScript，语法错误保留当前实例；
语义诊断可见但不作为 Run 的阻断条件，不等于发布级严格类型验收。

当前编辑器注入 22 个 d.ts（20 个生态包、核心、i18n），逐个 fetch 后 addExtraLib/createModel。
来源是核心 public 经 build:types/build:ts，以及各生态包 types 经 build:ts。
URL 列表生成在 browser/editor-libraries.ts，build:ts 同步生成 common.js。
仅存在性检查不证明请求成功或 Monaco 诊断有效，真实编辑器验收归 EX-03。
loadScript 暂时覆盖 window.define 后在成功/失败/取消时恢复。桌面先等待 Monaco
实际语言模块就绪，避免其 AMD 加载与外部脚本的临时 define 覆盖竞态。

## 生成流程和分发

| 命令/脚本 | 输入 → 输出 | 当前边界/责任 |
| --- | --- | --- |
| build:types | 核心 public → types | 已有严格生成检查，不手改输出 |
| build:ts | 核心及插件声明 → assets/ts、editor-libraries.ts、生成 UI | 两代编译器整组校验；保持原声明 URL 与选包命令 |
| build:test | 中文 Run Code → docs/test/test.js、examples.json | TS 解析生成；按真实 ready/error 清理，覆盖范围见 SITE-SMOKE-01 |
| build:i18n | 核心语言源 → dist/i18n、compiled/i18n | SITE-BUILD-01 暂存全套 UMD/ESM 后替换；保留内置语言/辅助排除 |
| build:docs | VitePress 源 → docs/document | SITE-BUILD-01 固定 Yarn 子进程、暂存构建、失败回退 |
| build:llm | 英文文档、实际编辑器声明、示例、声明 notices → docs/llms.txt + manifest | SITE-AI-DOCS-01 离线可复现；check:llm 只读检查 |
| trans-docs.js | 中文 Markdown → 草稿 → 经检查应用英文 Markdown | 默认只显示计划；显式 --remote 请求，--validate / --apply 分步处理 |

build:test 的 malformed 分支在 continue 前不推进 regexp，存在同一坏块重复扫描的源码路径；
SITE-02 必须加入可终止的坏文档反例。未运行该路径或把它计作已修复。
build:all/ci:build 不调用远程翻译；SITE-AI-DOCS-01 将离线 build:llm 纳入
ci:build，将只读 check:llm 纳入 ci:check。远程草稿与英文质量复核仍单独执行。

`scripts/projects.js` 明确排除 VitePress 的库构建；配置 base=/document/，输出到仓库 docs/document。
Pages 工作流消费已验证的 docs artifact，部署与检查分离。manifest 未设 private，且没有
库入口；这不足以推断作者希望发布 npm。REL-01/CI-03 必须显式区分 21 库与 1 静态站点，
站点 1.1.0→2.0.0 的版本要求保留。本次没有改 private、版本、发布列表或执行远端部署。

## 第三方与媒体来源

冻结 registry/SHA-512 tarball 对照见 [site-provenance.json](baselines/site-provenance.json)。
抓取脚本只下载、校验和读取归档，不执行包脚本；原始包缓存保留，报告记录确切 URL 和哈希。

| 对象 | 本次取证 | 未完成部分 |
| --- | --- | --- |
| Monaco | npm 0.30.1 的 99 个对应文件：98 字节一致，editor.main.css 仅 5 处 CRLF/LF 差异；取得 LICENSE/ThirdPartyNotices | 站点 notices 装配、真实编辑器与 worker；SITE-07 / SITE-05 |
| vConsole | npm 3.15.0 dist 与本地逐字节一致，取得 LICENSE | 站点完整 notice 与移动使用验收；SITE-07 / EX-03 |
| console.js | Parcel bundle 含 react/react-dom/console-feed/styled-components，暴露 consoleLog；末尾指向不存在的 /index.js.map | 无冻结构建源/锁/完整组件版本；SITE-07 复原来源或可复现替换，不能直接认作自有 TS |
| JASSUB 字体 | 沿用既有 11 字体上游逐字节证据和内嵌元数据 | 6 字体授权依据、其它字体 notice 仍开放；PKG-JASSUB-06 / SITE-07 |
| 样本媒体 | 当前 sample 目录逐文件指纹；已有 URL/样本绑定可追溯 | 托管位置不证明授权，BASE-MEDIA-01 与 EX-03 保留 |

上游 notices 原文保留在 `baselines/site-vendor/` 作为取证材料，尚未复制到发布站点。
没有更新 VENDOR-05/06/07/08 为 closed，也没有下载媒体来替代缺失的使用依据。

旧 `thumbnail.js` 在 `a33df191a4216897d4fd4526927a822fd8b543a1` 从工具示例改成
`artplayerPluginThumbnail({width, number, scale})`。官方 registry 列出的 1.0.0–1.0.3
manifest 均指向 VTT 包入口；实际验证的 1.0.3 tarball 源码导出 artplayerPluginVttThumbnail，
读取 option.vtt，声明却使用 artplayerPluginThumbnail 名称。不能把 npm 包名当成此示例的
可用依赖，也不能直接别名到 auto-thumbnail。EX-03 要保留旧 URL 并给出明确修复/迁移解释；
BASE-DEMO-01 保持开放。本次没有改变示例运行行为。

## 重跑与限制

```sh
node refactor/scripts/site-inventory.mjs --check
node refactor/scripts/demos.mjs --check
node --test refactor/scripts/demos.test.mjs refactor/scripts/site-inventory.test.mjs
node refactor/scripts/site-provenance.mjs --network
```

清单变化先检查差异，再 `site-inventory.mjs --write`，不能把重生成当作消除内容问题。
本任务是入口/来源和生成链清点，没有执行完整文档构建、公开页面请求、播放器实播、搜索、
真机或远端 CI。SITE-02/03/04/05/07 与 EX-03 的验收继续独立推进。
