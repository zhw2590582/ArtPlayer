# 重构风险与差异索引

由 risks.json 生成；运行 node refactor/scripts/risk-register.mjs --write 更新。状态 open 表示尚缺关闭证据，不等于每项都是已复现缺陷。处理方案、关闭条件与证据见 [机器台账](risks.json)，来源与范围见 [维护说明](risk-guide.md)。

| ID | 状态 / 证据等级 | 条目 | 后续任务 |
| --- | --- | --- | --- |
| BASE-LIFE-06 | resolved / 已复现 | Published switch leaves an unhandled rejection and an unsettled promise when resume fails | CORE-09 |
| BASE-LIFE-01 | resolved / 已复现 | Superseded switch resolves along with the latest source | CORE-09 |
| BASE-LIFE-02 | resolved / 已复现 | Switch remains unsettled during the bounded observation after destroy | CORE-09 |
| BASE-LIFE-03 | resolved / 已复现 | Async plugin registers its result after destroy | CORE-08 |
| BASE-LIFE-04 | resolved / 已复现 | Destroying an instance twice unregisters a different live instance | CORE-04 |
| BASE-LIFE-05 | resolved / 已复现 | Failed constructor leaves initialized markup/listeners until explicit probe cleanup | CORE-04 |
| BASE-DOM-01 | open / 已复现 | 控件 Tab 不可达 | CORE-23, CORE-17 |
| BASE-DOM-02 | open / 已复现 | 窄容器中控件裁切 | CORE-13, CORE-14 |
| BASE-DEMO-01 | open / 源码/产物事实 | 旧 thumbnail 插件示例不对应当前 workspace 包 | SITE-01, EX-03 |
| BASE-TYPE-01 | resolved / 已复现 | NodeNext ESM 默认导出与声明互操作失配 | ENG-04, CORE-07, PKG-CHAPTER-04 |
| BASE-TYPE-02 | resolved / 已复现 | chapter 可选运行时参数被声明为必填 | PKG-CHAPTER-02 |
| BASE-TYPE-03 | resolved / 已复现 | chapter legacy 缺旧模块解析的声明回退 | ENG-04, PKG-CHAPTER-04 |
| BASE-TYPE-04 | open / 已复现 | plugins.add / toggle 的旧声明返回值与运行时不同 | CORE-07, CORE-08, CORE-10, CORE-21 |
| BASE-DIST-01 | open / 源码/产物事实 | thumbnail tool 分发入口与类型文件缺失 | PKG-TOOL-THUMB-01, PKG-TOOL-THUMB-04 |
| BASE-PERF-01 | resolved / 已复现 | 销毁后的 resize 防抖重新创建 notice timer | CORE-17, CORE-04, CORE-18 |
| BASE-SOURCE-01 | open / 源码/产物事实 | 工作区 5.4.1 与采集时真实发布 5.4.0 不同 | BASE-08, REL-01 |
| BASE-SOURCE-02 | open / 源码/产物事实 | registry gitHead 与发布包版本对应不可靠 | ENG-07, REL-01 |
| BASE-SITE-01 | open / 源码/产物事实 | 文档站实际为静态站点但 manifest 未设 private | SITE-01, REL-01 |
| BASE-MEDIA-01 | open / 待取证 | 示例媒体和字体的完整来源/授权链待核实 | BASE-08, SITE-01, EX-03 |
| VENDOR-01 | resolved / 源码/产物事实 | screenfull 来源、版本与许可闭环 | CORE-12 |
| VENDOR-02 | resolved / 源码/产物事实 | hint.css 来源、版本与许可闭环 | CORE-12 |
| VENDOR-03 | open / 待取证 | webvtt-parser 来源、版本与许可闭环 | PKG-MULTI-SUB-01 |
| VENDOR-04 | open / 待取证 | jassub-code-and-workers 来源、版本与许可闭环 | PKG-JASSUB-01 |
| VENDOR-05 | open / 待取证 | jassub-font-assets 来源、版本与许可闭环 | PKG-JASSUB-01, SITE-01 |
| VENDOR-06 | open / 待取证 | monaco-static-assets 来源、版本与许可闭环 | SITE-01, SITE-05 |
| VENDOR-07 | open / 待取证 | vconsole 来源、版本与许可闭环 | SITE-01 |
| VENDOR-08 | open / 待取证 | console-bundle 来源、版本与许可闭环 | SITE-01 |
| SDK-01 | open / 待取证 | hls.js 实际集成验证范围 | PKG-HLS-01, EX-03 |
| SDK-02 | open / 待取证 | dash.js 实际集成验证范围 | PKG-DASH-01, EX-03 |
| SDK-03 | open / 待取证 | flv.js 实际集成验证范围 | EX-03 |
| SDK-04 | open / 待取证 | mpegts.js 实际集成验证范围 | EX-03 |
| SDK-05 | open / 待取证 | webtorrent 实际集成验证范围 | EX-03 |
| SDK-06 | open / 待取证 | google-cast 实际集成验证范围 | PKG-CAST-01, PKG-CAST-05 |
| SDK-07 | open / 待取证 | ima-via-glomex 实际集成验证范围 | PKG-VAST-01, PKG-VAST-05 |
| SDK-08 | open / 待取证 | mediapipe-tensorflow 实际集成验证范围 | PKG-MASK-01, PKG-MASK-05 |
| SDK-09 | open / 待取证 | jassub-worker-wasm-fonts 实际集成验证范围 | PKG-JASSUB-01, PKG-JASSUB-05 |
| SDK-10 | open / 待取证 | mediabunny 实际集成验证范围 | PKG-MB-01, PKG-MB-09 |
| SDK-11 | open / 待取证 | asr-caller-service 实际集成验证范围 | PKG-ASR-01, PKG-ASR-05, EX-03 |
| SDK-12 | open / 待取证 | option-validator 实际集成验证范围 | CORE-01, CORE-07 |
| BUILD-AMD-01 | resolved / 已复现 | AMD 全局导出补丁误将固定参数 t 当作全局对象 | ENG-06 |
| UTIL-MERGE-01 | resolved / 已复现 | mergeDeep lets a JSON __proto__ key replace the result prototype | CORE-01 |
| UTIL-DOWNLOAD-01 | resolved / 源码/产物事实 | Temporary download anchor remains if click throws | CORE-01 |
| BASE-TYPE-05 | open / 源码/产物事实 | Public Utils declarations omit exports and misstate timer/descriptor signatures | CORE-07, CORE-21 |
| EVENT-NAME-01 | resolved / 已复现 | Emitter event names collide with Object.prototype | CORE-02 |
| EVENT-ONCE-01 | resolved / 已复现 | Nested dispatch snapshots invoke the same once registration twice | CORE-02 |
| BASE-TYPE-06 | resolved / 已复现 | Public Option requires url and excludes numeric control HTML accepted by existing JS | CORE-07 |
| BASE-TYPE-07 | open / 已复现 | Setting returns, subtitle contextual payloads and notice getter conflict with historical declarations | CORE-07, CORE-14, CORE-15, CORE-18, CORE-21 |
| BASE-TYPE-08 | open / 已复现 | Write-only player commands have fictitious public getter declarations | CORE-21 |
| BASE-LIFE-07 | resolved / 已复现 | Queued reconnect survives source replacement and reloads the new resource | CORE-11 |
| BASE-LIFE-08 | resolved / 已复现 | Ready continues after a control callback destroys the instance | CORE-11 |
| BASE-I18N-01 | resolved / 已复现 | Missing prototype-named translations return inherited functions | CORE-12 |
| BASE-TYPE-09 | open / 源码/产物事实 | Template and icon declarations claim incompatible DOM and static shapes | CORE-21 |
