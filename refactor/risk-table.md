# 重构风险与差异索引

由 risks.json 生成；运行 node refactor/scripts/risk-register.mjs --write 更新。状态 open 表示尚缺关闭证据，不等于每项都是已复现缺陷。处理方案、关闭条件与证据见 [机器台账](risks.json)，来源与范围见 [维护说明](risk-guide.md)。

| ID | 状态 / 证据等级 | 条目 | 后续任务 |
| --- | --- | --- | --- |
| ENG-PERF-01 | open / 源码/产物事实 | Candidate core bundles exceed the BASE-06 size review threshold in all three formats | CORE-22, MOD-03, REVIEW-01 |
| ENG-PERF-02 | open / 待取证 | Intermittent constructor and destruction timing signals require follow-up paired measurement | CORE-22, MOD-03, REVIEW-01 |
| BASE-LIFE-06 | resolved / 已复现 | Published switch leaves an unhandled rejection and an unsettled promise when resume fails | CORE-09 |
| BASE-LIFE-01 | resolved / 已复现 | Superseded switch resolves along with the latest source | CORE-09 |
| BASE-LIFE-02 | resolved / 已复现 | Switch remains unsettled during the bounded observation after destroy | CORE-09 |
| BASE-LIFE-03 | resolved / 已复现 | Async plugin registers its result after destroy | CORE-08 |
| BASE-LIFE-04 | resolved / 已复现 | Destroying an instance twice unregisters a different live instance | CORE-04 |
| BASE-LIFE-05 | resolved / 已复现 | Failed constructor leaves initialized markup/listeners until explicit probe cleanup | CORE-04 |
| BASE-DOM-01 | resolved / 已复现 | 控件 Tab 不可达 | CORE-23, CORE-17 |
| BASE-DOM-02 | resolved / 已复现 | 窄容器中控件裁切 | CORE-13, CORE-14 |
| BASE-DEMO-01 | open / 源码/产物事实 | 旧 thumbnail 插件示例不对应当前 workspace 包 | SITE-01, EX-03 |
| BASE-TYPE-01 | resolved / 已复现 | NodeNext ESM 默认导出与声明互操作失配 | ENG-04, CORE-07, PKG-CHAPTER-04 |
| BASE-TYPE-02 | resolved / 已复现 | chapter 可选运行时参数被声明为必填 | PKG-CHAPTER-02 |
| BASE-TYPE-03 | resolved / 已复现 | chapter legacy 缺旧模块解析的声明回退 | ENG-04, PKG-CHAPTER-04 |
| BASE-TYPE-04 | resolved / 已复现 | plugins.add / toggle 的旧声明返回值与运行时不同 | CORE-07, CORE-08, CORE-10, CORE-21 |
| BASE-DIST-01 | open / 已复现 | thumbnail tool 分发入口与类型文件缺失 | PKG-TOOL-THUMB-04, PKG-TOOL-THUMB-06 |
| BASE-PERF-01 | resolved / 已复现 | 销毁后的 resize 防抖重新创建 notice timer | CORE-17, CORE-04, CORE-18 |
| BASE-SOURCE-01 | open / 源码/产物事实 | 工作区 5.4.1 与采集时真实发布 5.4.0 不同 | BASE-08, REL-01 |
| BASE-SOURCE-02 | open / 源码/产物事实 | registry gitHead 与发布包版本对应不可靠 | ENG-07, REL-01 |
| BASE-SITE-01 | open / 源码/产物事实 | 文档站实际为静态站点但 manifest 未设 private | SITE-01, REL-01 |
| BASE-MEDIA-01 | open / 待取证 | 示例媒体和字体的完整来源/授权链待核实 | BASE-08, SITE-01, EX-03 |
| VENDOR-01 | resolved / 源码/产物事实 | screenfull 来源、版本与许可闭环 | CORE-12 |
| VENDOR-02 | resolved / 源码/产物事实 | hint.css 来源、版本与许可闭环 | CORE-12 |
| VENDOR-03 | resolved / 已复现 | webvtt-parser 来源、版本与许可闭环 | PKG-MULTI-SUB-01 |
| VENDOR-04 | open / 待取证 | jassub-code-and-workers 来源、版本与许可闭环 | PKG-JASSUB-01 |
| VENDOR-05 | open / 待取证 | jassub-font-assets 来源、版本与许可闭环 | PKG-JASSUB-01, SITE-01 |
| VENDOR-06 | open / 待取证 | monaco-static-assets 来源、版本与许可闭环 | SITE-01, SITE-05 |
| VENDOR-07 | open / 待取证 | vconsole 来源、版本与许可闭环 | SITE-01 |
| VENDOR-08 | open / 待取证 | console-bundle 来源、版本与许可闭环 | SITE-01 |
| SDK-01 | open / 源码/产物事实 | hls.js 实际集成验证范围 | PKG-HLS-05, EX-03 |
| SDK-02 | open / 待取证 | dash.js 实际集成验证范围 | PKG-DASH-01, EX-03, PKG-DASH-05 |
| SDK-03 | open / 待取证 | flv.js 实际集成验证范围 | EX-03 |
| SDK-04 | open / 待取证 | mpegts.js 实际集成验证范围 | EX-03 |
| SDK-05 | open / 待取证 | webtorrent 实际集成验证范围 | EX-03 |
| SDK-06 | open / 待取证 | google-cast 实际集成验证范围 | PKG-CAST-01, PKG-CAST-05 |
| SDK-07 | open / 待取证 | ima-via-glomex 实际集成验证范围 | PKG-VAST-01, PKG-VAST-05 |
| SDK-08 | open / 待取证 | mediapipe-tensorflow 实际集成验证范围 | PKG-MASK-01, PKG-MASK-05 |
| SDK-09 | open / 待取证 | jassub-worker-wasm-fonts 实际集成验证范围 | PKG-JASSUB-01, PKG-JASSUB-05 |
| SDK-10 | open / 待取证 | mediabunny 实际集成验证范围 | PKG-MB-01, PKG-MB-09 |
| SDK-11 | open / 待取证 | asr-caller-service 实际集成验证范围 | PKG-ASR-01, PKG-ASR-05, EX-03 |
| SDK-12 | resolved / 源码/产物事实 | option-validator 实际集成验证范围 | CORE-01, CORE-07, CORE-22 |
| BUILD-AMD-01 | resolved / 已复现 | AMD 全局导出补丁误将固定参数 t 当作全局对象 | ENG-06 |
| UTIL-MERGE-01 | resolved / 已复现 | mergeDeep lets a JSON __proto__ key replace the result prototype | CORE-01 |
| UTIL-DOWNLOAD-01 | resolved / 源码/产物事实 | Temporary download anchor remains if click throws | CORE-01 |
| BASE-TYPE-05 | resolved / 源码/产物事实 | Public Utils declarations omit exports and misstate timer/descriptor signatures | CORE-07, CORE-21 |
| EVENT-NAME-01 | resolved / 已复现 | Emitter event names collide with Object.prototype | CORE-02 |
| EVENT-ONCE-01 | resolved / 已复现 | Nested dispatch snapshots invoke the same once registration twice | CORE-02 |
| BASE-TYPE-06 | resolved / 已复现 | Public Option requires url and excludes numeric control HTML accepted by existing JS | CORE-07 |
| BASE-TYPE-07 | resolved / 已复现 | Setting returns, subtitle contextual payloads and notice getter conflict with historical declarations | CORE-07, CORE-14, CORE-15, CORE-18, CORE-21 |
| BASE-TYPE-08 | resolved / 已复现 | Write-only player commands have fictitious public getter declarations | CORE-21 |
| BASE-LIFE-07 | resolved / 已复现 | Queued reconnect survives source replacement and reloads the new resource | CORE-11 |
| BASE-LIFE-08 | resolved / 已复现 | Ready continues after a control callback destroys the instance | CORE-11 |
| BASE-I18N-01 | resolved / 已复现 | Missing prototype-named translations return inherited functions | CORE-12 |
| BASE-TYPE-09 | resolved / 源码/产物事实 | Template and icon declarations claim incompatible DOM and static shapes | CORE-21 |
| BASE-LIFE-09 | resolved / 已复现 | Removed builtin controls retain subscriptions and progress drag effects | CORE-13 |
| BASE-LIFE-10 | resolved / 已复现 | Component mounting and removal failures leave partial entries or recurse | CORE-13 |
| BASE-LIFE-11 | resolved / 已复现 | Selector failures are unhandled and obsolete completion overwrites current UI | CORE-13 |
| BASE-DOM-03 | resolved / 已复现 | Reusing selector items after update redefines nonconfigurable properties | CORE-13 |
| BASE-DOM-04 | resolved / 已复现 | A component named __proto__ changes its registry prototype | CORE-13 |
| BASE-DOM-05 | resolved / 已复现 | Highlight text interpolation permits unintended HTML attributes | CORE-13 |
| BASE-DOM-06 | resolved / 已复现 | Moved setting items retain parent and option bindings from the old tree | CORE-14 |
| BASE-DOM-07 | resolved / 已复现 | Generated setting names collide with explicit names in nested branches | CORE-14 |
| BASE-LIFE-12 | resolved / 已复现 | Removed or updated setting rows retain descendant panels and builtin subscriptions | CORE-14 |
| BASE-LIFE-13 | resolved / 已复现 | Obsolete setting callback completions overwrite current UI and failures are unhandled | CORE-14 |
| BASE-LIFE-14 | resolved / 已复现 | Removed or replaced setting items still run deferred mounted callbacks | CORE-14 |
| BASE-DOM-08 | resolved / 已复现 | Sharing a live setting object leaves a second published instance blank and can steal candidate bindings | CORE-14 |
| BASE-LIFE-15 | resolved / 已复现 | Subtitle requests overwrite newer state and mutate tracks after destroy | CORE-15 |
| BASE-LIFE-16 | resolved / 已复现 | Subtitle URLs revoke caller resources and leak the final generated resource | CORE-15 |
| BASE-DOM-09 | resolved / 已复现 | Web fullscreen loses style and placement across repeated entry or configuration changes | CORE-16 |
| BASE-LIFE-17 | resolved / 已复现 | Destroy in body web fullscreen leaves a connected orphan player | CORE-16 |
| BASE-DOM-10 | resolved / 已复现 | Native fullscreen state and exit affect unrelated player instances | CORE-16 |
| BASE-LIFE-18 | resolved / 已复现 | Native fullscreen retains destroyed listeners and leaks rejected request listeners | CORE-16 |
| BASE-DOM-11 | resolved / 已复现 | Video-only fullscreen ignores native video state and begin/end transitions | CORE-16 |
| BASE-LIFE-19 | resolved / 已复现 | Video-only fullscreen survives player destruction and late entry | CORE-16 |
| BASE-DOM-12 | resolved / 已复现 | PiP reports another video as active and WebKit ignores native presentation transitions | CORE-16 |
| BASE-LIFE-20 | resolved / 已复现 | PiP survives destruction or late entry and rejected assignments become unhandled | CORE-16 |
| BASE-TYPE-10 | resolved / 已复现 | PiP getter is declared boolean but native runtime returns an element or null | CORE-16, CORE-21 |
| BASE-DOM-13 | resolved / 已复现 | Mini exit loses the video's original parent and sibling position | CORE-16 |
| BASE-LIFE-21 | resolved / 已复现 | Mini leaves a connected popup after player destruction | CORE-16 |
| BASE-DOM-14 | resolved / 已复现 | Unready media sizing partially overwrites layout and emits NaN height | CORE-16 |
| BASE-DOM-15 | resolved / 已复现 | Auto orientation exit clears caller-owned inline dimensions and transforms | CORE-16 |
| BASE-LIFE-22 | resolved / 已复现 | Orientation lock success after fullscreen exit reactivates a cancelled player | CORE-16 |
| BASE-DOM-16 | resolved / 已复现 | Hotkeys intercept input in rebound documents and shadow roots | CORE-17 |
| BASE-DOM-17 | resolved / 已复现 | Prototype-named hotkeys fail registration through inherited keys properties | CORE-17 |
| BASE-LIFE-23 | resolved / 已复现 | Repeated Hotkey initialization accumulates keyboard subscriptions | CORE-17 |
| BASE-LIFE-24 | resolved / 已复现 | Mutable capture options and partial native registration failures leave listeners behind | CORE-17 |
| BASE-LIFE-25 | resolved / 已复现 | Failed global rebinding drops the old document and retains partial new listeners | CORE-17 |
| BASE-LIFE-26 | resolved / 已复现 | Click callbacks that destroy the player still trigger subsequent default playback actions | CORE-17 |
| BASE-LIFE-27 | resolved / 已复现 | Cancelled, locked or replaced touches continue a previous seek gesture | CORE-17 |
| BASE-LIFE-28 | resolved / 已复现 | Gesture callbacks continue seeking or updating progress after destruction | CORE-17 |
| BASE-LIFE-29 | resolved / 已复现 | Scroll throttle reset timers remain pending after player destruction | CORE-17 |
| BASE-LIFE-30 | resolved / 已复现 | Screen orientation changes are ignored when onchange is initially null | CORE-17 |
| BASE-DOM-18 | resolved / 已复现 | View visibility uses the original global viewport after container adoption into an iframe | CORE-17 |
| BASE-LIFE-31 | resolved / 已复现 | Notice reentrant writes can schedule after destruction or erase a newer message | CORE-18 |
| BASE-LIFE-32 | resolved / 已复现 | Fast-forward repeated starts and missing cancellation retain timers or accelerated playback | CORE-18 |
| BASE-LIFE-33 | resolved / 已复现 | Auto-playback restarts retain obsolete resume clicks, subscriptions and timers | CORE-18 |
| BASE-LIFE-34 | resolved / 已复现 | Lock icon and miniature progress subscriptions outlive their UI or player | CORE-18 |
| BASE-LIFE-35 | resolved / 已复现 | Info repeated initialization retains polling and close callbacks; destroyed reads continue writing | CORE-18 |
| BASE-LIFE-36 | resolved / 已复现 | Screenshot Blob callback failures escape and leave public promises pending | CORE-19 |
| BASE-LIFE-37 | resolved / 已复现 | Screenshot completion can download or emit after destruction or source replacement | CORE-19 |
| BASE-LIFE-38 | resolved / 已复现 | Screenshot toolbar leaves internal capture failures as unhandled rejections | CORE-19 |
| BASE-LIFE-39 | resolved / 已复现 | Thumbnail image completions can overwrite newer configuration or hover state and outlive controls | CORE-19 |
| BASE-LIFE-40 | resolved / 已复现 | Image load failures leave thumbnail loading frozen and canvas callback failures escape public loadImg promises | CORE-19 |
| BASE-LIFE-41 | resolved / 已复现 | Scaled thumbnail Blob URLs survive replacement, control removal and destruction | CORE-19 |
| BASE-DOM-19 | resolved / 已复现 | Thumbnail row boundaries and first-cell return do not match the generated zero-based sprite grid | CORE-19 |
| BASE-LIFE-42 | resolved / 已复现 | Progress callbacks and active drags can seek an obsolete source or removed control | CORE-19 |
| BASE-LIFE-43 | resolved / 已复现 | Replacing a media source revokes a caller-owned Blob URL still in use | CORE-19 |
| BASE-LIFE-44 | resolved / 已复现 | Native quality restoration can settle at a different position after its first seek | CORE-19 |
| BASE-ENV-01 | open / 已复现 | Windows WebKit native Blob video samples lack decoding support; Apple-device validation remains outstanding | REL-03, REVIEW-02 |
| BASE-ENV-02 | resolved / 已复现 | Custom iOS or Macintosh user agents dereference absent browser globals during SSR import | CORE-20 |
| BASE-LIFE-45 | resolved / 已复现 | Previous workspace safe-area measurement leaks its probe when native style access fails | CORE-20 |
| BASE-ENV-03 | resolved / 已复现 | Fallback event-path utilities dereference absent window in server environments | CORE-20 |
| BASE-LIFE-46 | resolved / 已复现 | Option initialization continues native, style and source writes after reentrant destruction | CORE-20 |
| BASE-LIFE-47 | resolved / 已复现 | AirPlay methods can call a picker or publish events and notices after destruction | CORE-20 |
| BASE-LIFE-48 | resolved / 已复现 | Proxy-time destruction cannot clean a template before its public assignment | CORE-20 |
| BASE-LIFE-49 | resolved / 已复现 | Constructor and Player initialization continue after a callback destroys the instance | CORE-20 |
| HLS-UI-01 | resolved / 已复现 | 空轨道和关闭配置仍残留 HLS 菜单 | PKG-HLS-03 |
| HLS-LIFE-01 | resolved / 已复现 | 过期 HLS 选择回调与销毁后 update 仍工作 | PKG-HLS-03 |
| HLS-AUTO-01 | resolved / 已复现 | 真实 ABR 播放的 Auto 标签在 update 后丢失 | PKG-HLS-03, PKG-HLS-05 |
| HLS-ENV-01 | open / 已复现 | Windows WebKit 缺失 MSE，HLS 播放矩阵尚缺 Safari 证据 | PKG-HLS-05, REL-09, REVIEW-02 |
| HLS-CRASH-01 | open / 已复现 | Firefox Hls 1.5.17 worker 销毁可在原生 video 与候选核心复现崩溃 | PKG-HLS-SDK-01, PKG-HLS-05, REVIEW-02 |
| HLS-PLAYBACK-01 | open / 已复现 | Firefox 旧核心与 Hls 1.7.2 切组后视频档位未完成切换 | PKG-HLS-SDK-01, PKG-HLS-05, REVIEW-02 |
| AUDIO-LIFE-01 | resolved / 已复现 | Audio Track 销毁后 update 与媒体/订阅缺少终止守卫 | PKG-AUDIO-02, PKG-AUDIO-03, PKG-AUDIO-05 |
| AUDIO-SYNC-01 | open / 已复现 | Audio Track 未同步原生暂停/结束，偏移边界与切源/缓冲仍待完整验证 | PKG-AUDIO-02, PKG-AUDIO-03, PKG-AUDIO-05 |
| AUDIO-TYPE-01 | accepted-with-scope / 源码/产物事实 | Audio Track update 部分配置与公开/编辑器声明不一致 | PKG-AUDIO-04 |
| AUDIO-DEMO-01 | open / 源码/产物事实 | Audio Track README 示例链接名称不匹配且缺维护说明 | PKG-AUDIO-06 |
| CORE-SOURCE-01 | resolved / 已复现 | 候选核心连续切源丢失原播放意图 | CORE-24 |
| AUDIO-RESUME-01 | resolved / 已复现 | WebKit 旧核心切源后候选音频保持暂停 | PKG-AUDIO-05 |
| AUDIO-BUFFER-01 | open / 已复现 | Windows WebKit 原生媒体无法在受限响应下推进至真实缓冲 | PKG-AUDIO-05 |
| CHAPTER-LAYOUT-01 | resolved / 已复现 | 长章节标题超出窄播放器进度条宽度 | PKG-CHAPTER-05 |
| CHAPTER-TIMING-01 | open / 已复现 | Windows WebKit 清晰度切换曾在等待窗口内未见 restart，稍后状态恢复 | PKG-CHAPTER-05 |
| DASH-SDK-01 | open / 已复现 | npm 发布版 4.x 与工作区仅 5.x 的 SDK 接口不兼容 | PKG-DASH-02, PKG-DASH-03, PKG-DASH-05 |
| DASH-LIFE-01 | resolved / 已复现 | DASH 空拓扑残留 UI，监听和旧选择回调缺乏关闭守卫 | PKG-DASH-02, PKG-DASH-03 |
| DASH-STATE-01 | resolved / 已复现 | DASH 当前项高亮使用真值 ID、音轨身份和标签去重，边界待核实 | PKG-DASH-02, PKG-DASH-03, PKG-DASH-05 |
| DASH-TYPE-01 | resolved / 源码/产物事实 | DASH 类型未表达默认工厂参数、SDK 回调对象和现代模块入口 | PKG-DASH-04 |
| DASH-DEMO-01 | open / 源码/产物事实 | DASH 示例仅新 SDK 且重复安装会累积销毁回调 | PKG-DASH-06 |
| DASH-SEEK-01 | open / 已复现 | dash.js 4.5.2 空裁剪漏更新缓冲量，稳定暂停 seek 后调度停滞 | PKG-DASH-05, REVIEW-02 |
| ADS-TYPE-01 | accepted-with-scope / 已复现 | Ads 声明丢失真实 html/video/url，旧 totalDuration 为 string，当前 source/type 未实现 | PKG-ADS-02, PKG-ADS-04 |
| ADS-DIST-01 | open / 已复现 | Ads npm 1.0.6 default namespace 与未发布 2.1.0 callable/exports 分发不同 | PKG-ADS-04, PKG-ADS-06, REL-01 |
| ADS-CORE-01 | resolved / 源码/产物事实 | Ads 旧发布关联核心 4.5.5，当前源码新增 >=5 门槛和 document 事件桥依赖 | PKG-ADS-02, PKG-ADS-03, PKG-ADS-05 |
| ADS-LIFE-01 | resolved / 已复现 | Ads 计时链、重复/过早调用、工厂复用与销毁缺乏资源边界 | PKG-ADS-02, PKG-ADS-03, PKG-ADS-05 |
| ADS-MEDIA-01 | open / 已复现 | Ads metadata 与 play 拒绝、隐藏页媒体状态和内容恢复仍缺真实验证 | PKG-ADS-02, PKG-ADS-03, PKG-ADS-05 |
| ADS-UI-01 | resolved / 已复现 | Ads 零等待跳过与初始状态不符，全屏图标/外部状态需核验 | PKG-ADS-02, PKG-ADS-03, PKG-ADS-05 |
| VAST-CONTEXT-01 | open / 已复现 | Published VAST callback aliases and eager Player differ from the unpublished lazy workspace | PKG-VAST-02, PKG-VAST-03, PKG-VAST-04 |
| VAST-TYPE-01 | open / 已复现 | VAST declares an async factory as synchronous and imports an unavailable SDK type dependency | PKG-VAST-04, PKG-VAST-06 |
| VAST-LIFE-01 | open / 已复现 | VAST SDK and container lack core destruction ownership and pending work cancellation | PKG-VAST-02, PKG-VAST-03, PKG-VAST-05 |
| VAST-DIST-01 | open / 已复现 | Published VAST CommonJS default namespace differs from the current callable distribution | PKG-VAST-04, PKG-VAST-06 |
| AMBILIGHT-LIFE-01 | open / 已复现 | Ambilight sampling and RAF/DOM ownership lack terminal/error handling | PKG-AMBILIGHT-02, PKG-AMBILIGHT-03, PKG-AMBILIGHT-05 |
| AMBILIGHT-TYPE-01 | resolved / 已复现 | Ambilight declarations disagree with optional factory argument and differ across published generations | PKG-AMBILIGHT-04, PKG-AMBILIGHT-06 |
| AMBILIGHT-DIST-01 | resolved / 已复现 | Ambilight 1.0.0 CommonJS default namespace differs from callable 1.1.0 | PKG-AMBILIGHT-04, PKG-AMBILIGHT-06 |
| AMBILIGHT-PROXY-01 | resolved / 已复现 | Canvas proxy output pixels differ from forwarded video dimensions | PKG-AMBILIGHT-PROXY-01, PKG-AMBILIGHT-05 |
| CANVAS-LIFE-01 | resolved / 已复现 | Canvas proxy pending draw, bitmap and delayed subscriptions lack terminal ownership | PKG-CANVAS-02, PKG-CANVAS-03, PKG-CANVAS-05 |
| CANVAS-TYPE-01 | resolved / 源码/产物事实 | Canvas proxy declarations change required callback across generations and omit forwarded media capabilities | PKG-CANVAS-04, PKG-CANVAS-06 |
| CANVAS-DIST-01 | resolved / 已复现 | Canvas proxy published CommonJS namespace differs from current callable export | PKG-CANVAS-04, PKG-CANVAS-06 |
| CANVAS-PIXEL-01 | resolved / 已复现 | Historical Canvas proxy produces transparent frames with detached native video in tested WebKit | PKG-CANVAS-03, PKG-CANVAS-05 |
| DPIP-PACK-01 | open / 已复现 | Published Document PiP 1.0.0 tarball omits every declared runtime entry | PKG-DPIP-06 |
| DPIP-DIST-01 | resolved / 已复现 | Document PiP namespace.default in 1.0.1/1.0.2 differs from callable 1.1.0 export | PKG-DPIP-04, PKG-DPIP-06 |
| DPIP-TYPE-01 | resolved / 已复现 | Document PiP requires options and declares void actions and writable flags that differ from runtime | PKG-DPIP-04 |
| DPIP-LIFE-01 | open / 已复现 | Document PiP has no separate ownership for pending window requests and delayed post-transition callbacks | PKG-DPIP-02, PKG-DPIP-03, PKG-DPIP-05 |
| DPIP-DOM-01 | open / 已复现 | Document PiP copies global-document styles and retains original parent without transactional rollback | PKG-DPIP-02, PKG-DPIP-03, PKG-DPIP-05 |
| DPIP-STYLE-01 | resolved / 已复现 | Document PiP 1.1.0 and frozen source duplicate style IDs when evaluated before DOMContentLoaded | PKG-DPIP-03 |
| DPIP-MEDIA-01 | open / 已复现 | WebKit reports styled width640 for width320 media in the controlled Document PiP iframe matrix | PKG-DPIP-05 |
| DPIP-RESOLVE-01 | resolved / 已复现 | Historical Document PiP exports hide declarations or infer an uncallable CommonJS namespace in modern resolution | PKG-DPIP-04, PKG-DPIP-06 |
| FACTORY-TYPE-01 | open / 已复现 | Canvas and Ambilight default self property narrows assignability of historical factory replacements | PKG-FACTORY-01 |
| MB-LICENSE-01 | open / 已复现 | Historical MediaBunny proxy bundles embed SDK code without MPL notice markers or separate license/source provenance | PKG-MB-10 |
| MB-LIFE-01 | open / 已复现 | MediaBunny load, track replacement, timeout, RAF and audio callbacks lack one shared terminal owner | PKG-MB-02, PKG-MB-03, PKG-MB-04, PKG-MB-05, PKG-MB-06, PKG-MB-07, PKG-MB-09 |
| MB-TYPE-01 | resolved / 已复现 | MediaBunny proxy declares only Canvas while exposing a shim and changes CommonJS export generation between releases | PKG-MB-08, PKG-MB-10 |
| MB-CAP-01 | open / 已复现 | Current Windows WebKit lacks WebCodecs and Web Audio constructors needed by historical MediaBunny proxies | PKG-MB-02, PKG-MB-09 |
| MB-READY-01 | resolved / 已复现 | MediaBunny historical readiness can repeat for trackless input and occur after capability errors | PKG-MB-04, PKG-MB-09 |
| DPIP-DISPLAY-01 | resolved / 已复现 | Web fullscreen body placement reclaims a player adopted into another document | CORE-22, PKG-DPIP-05 |
| IFRAME-LIFE-01 | open / 已复现 | Iframe timestamp IDs and unowned pending requests/timers lack terminal cleanup | PKG-IFRAME-02, PKG-IFRAME-03, PKG-IFRAME-05 |
| IFRAME-TRUST-01 | open / 已复现 | Iframe executable commit protocol accepts messages without source/origin validation | PKG-IFRAME-03, PKG-IFRAME-05 |
| IFRAME-DIST-01 | open / 已复现 | Iframe tool name is unavailable at registry observation and old archive includes distinct helper exports | PKG-IFRAME-04, PKG-IFRAME-06 |
| THUMB-COMPAT-01 | open / 已复现 | Thumbnail recovered 3.5.31 and workspace 4.4.0 have conflicting height and event timing defaults | PKG-TOOL-THUMB-04, PKG-TOOL-THUMB-05 |
| THUMB-LIFE-01 | open / 已复现 | Thumbnail drop binding and repeated destroy fail; pending work and replacement resource ownership need repair | PKG-TOOL-THUMB-02, PKG-TOOL-THUMB-03, PKG-TOOL-THUMB-05 |
| THUMB-PROVENANCE-01 | resolved / 源码/产物事实 | Thumbnail local emitter attribution and historical distribution completeness remain unverified | PKG-TOOL-THUMB-04, PKG-TOOL-THUMB-06 |
| THUMB-MEDIA-01 | open / 已复现 | Windows WebKit native Blob URLs cannot load tested MP4 media despite successful HTTP controls | PKG-TOOL-THUMB-05, PKG-TOOL-THUMB-06 |
| VENDOR-09 | resolved / 源码/产物事实 | Thumbnail tiny-emitter 改写来源与最终分发许可 | PKG-TOOL-THUMB-04, PKG-TOOL-THUMB-06 |
| THUMB-EVENT-01 | resolved / 已复现 | Thumbnail 原型事件名与嵌套 once 派发缺陷 | PKG-TOOL-THUMB-04 |
| AUTO-THUMB-TYPE-01 | open / 已复现 | Published declarations misdescribe async registration and switch height/number option fields across generations | PKG-AUTO-THUMB-04 |
| AUTO-THUMB-EXPORT-01 | open / 已复现 | Published 1.0.1 CommonJS default namespace differs from the direct function exported by 1.1.0 | PKG-AUTO-THUMB-04, PKG-AUTO-THUMB-06 |
| AUTO-THUMB-DIST-01 | open / 已复现 | Published 1.0.0 archive lacks declared main and legacy runtimes | PKG-AUTO-THUMB-06 |
| AUTO-THUMB-LIFE-01 | open / 已复现 | Extraction tasks, decoder handlers and final object URLs lack source-switch and destroy ownership | PKG-AUTO-THUMB-02, PKG-AUTO-THUMB-03, PKG-AUTO-THUMB-05 |
| AUTO-THUMB-ENCODE-01 | open / 已复现 | Unserialized encodes include blank output and lack media/canvas/input failure handling | PKG-AUTO-THUMB-02, PKG-AUTO-THUMB-03, PKG-AUTO-THUMB-05 |
| AUTO-THUMB-PIXEL-01 | open / 已复现 | Historical auto-thumbnail yields black sampled JPEG cells on Windows WebKit while played native video and static JPEG controls yield color | PKG-AUTO-THUMB-03, PKG-AUTO-THUMB-05 |
| VTT-THUMB-DIST-01 | open / 已复现 | Historical 1.0.0 main/legacy contain invalid regular expressions and cannot load | PKG-VTT-THUMB-06 |
| VTT-THUMB-PARSE-01 | resolved / 已复现 | Historical compiled arrows differ from shipped source; parsing floors bounds and assumes alternating lines | PKG-VTT-THUMB-02, PKG-VTT-THUMB-03 |
| VTT-THUMB-LIFE-01 | open / 已复现 | Fetch completion, setBar listeners and mobile timers have no destroy ownership | PKG-VTT-THUMB-02, PKG-VTT-THUMB-03, PKG-VTT-THUMB-05 |
| VTT-THUMB-TYPE-01 | open / 已复现 | Published declarations falsely describe async registration as a synchronous result | PKG-VTT-THUMB-04 |
| VTT-THUMB-EXPORT-01 | open / 已复现 | Older CommonJS default objects and thumbnails control names differ from latest direct export and vtt-thumbnail name | PKG-VTT-THUMB-04, PKG-VTT-THUMB-05, PKG-VTT-THUMB-06 |
| MULTI-SUB-TYPE-01 | open / 已复现 | Declarations omit async registration, tracks/reset and make the subtitles array required | PKG-MULTI-SUB-04 |
| MULTI-SUB-MERGE-01 | open / 已复现 | 1.0.0 merges cues by index while later versions concatenate independently timed track cues | PKG-MULTI-SUB-02, PKG-MULTI-SUB-03, PKG-MULTI-SUB-05 |
| MULTI-SUB-LIFE-01 | open / 源码/产物事实 | Pending downloads and final object URL have no destroy owner | PKG-MULTI-SUB-02, PKG-MULTI-SUB-03, PKG-MULTI-SUB-05 |
| MULTI-SUB-EXPORT-01 | open / 已复现 | Older CommonJS default objects conflict with export-assignment declarations; latest exports a direct factory | PKG-MULTI-SUB-04, PKG-MULTI-SUB-06 |
