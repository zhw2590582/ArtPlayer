# 消费者与真实环境矩阵

BASE-08；2026-09-10；来源提交 ed293231。矩阵建立完成，矩阵内未运行的检查仍待完成。版本与路径以 [发布冻结](baselines/releases.json)、[包初始快照](package-inventory.json)、[分发观察](baselines/distribution.json)、[demo 清单](baselines/demo-inventory.json) 和 [第三方清单](third-party.json) 为依据。

## 版本和分发维度

工作区版本不是发布证据。当前只冻结 core 5.4.0 和 chapter 1.1.0 的发布 tarball，核心工作区为 5.4.1；其余包的真实发布版本、旧核心支持窗口由各包 01 任务核实。历史最低浏览器/TS 版本尚未证明，不把本机版本设为用户最低版本。全部包仍按自身下一 major 准备，版本目标见 [版本策略](version-policy.md)。

| 检查 ID | 内容及执行方法 | 当前证据/状态 | 责任与发布影响 |
| --- | --- | --- | --- |
| ENV-FORMAT | 库的 root/legacy、CJS/ESM/UMD/AMD/global；核心 i18n、SSR import；隔离 tarball 消费 | core/chapter Node 24.21.0 的 18 项 runtime 检查通过，见 [消费者报告](baselines/consumers.json)；其他包未验证 | ENG-06/07、各包分发任务；入口缺失阻止对应库，公共构建变化要求全部受影响库复验 |
| ENV-TYPES | TS 5.9.3：Node10+CJS、NodeNext+CJS/ESM、Bundler+ESM，strict、不跳过声明检查 | core/chapter 16 场景中 8 成功、8 历史失败，见 [类型明细](baselines/consumer-coverage.md)；最低 TS 与其他包待核实 | ENG-04、CORE-07、各包类型任务；BASE-TYPE-01/02/03/04 不能按基线失败豁免候选 |
| ENV-COMBINATION | 旧核心+旧插件、新核心+旧插件、旧支持范围核心+新插件、新核心+新插件 | 前一组合仅 core/chapter 最小覆盖；其他组合未运行 | PILOT-01、CORE-22、各包集成任务；缺少受影响旧调用/旧核心支持证据阻止该批次 |
| ENV-SITE | VitePress 构建、docs HTML、编辑器加载/执行/声明、移动入口、React/Vue 消费 | 站点静态构建在 [Yarn 验证](baselines/yarn-validation.json) 通过；完整页面/编辑器/框架真实运行未验证 | SITE-01..06、EX-01..03；按站点 URL/资源验收，不创造未经历史核实的 npm 库 API |

Node10 是 TS 模块解析模式名，不代表支持 Node.js 10。现代 es2020 / legacy es2015 是构建语法目标；不保证 WebCodecs、WebAudio、PiP、Cast 或 SDK 在所有旧浏览器中存在。

## 运行环境和媒体维度

| 检查 ID | 环境、媒体和自动化方法 | 已执行范围/缺口 | 责任与解除方式 |
| --- | --- | --- | --- |
| ENV-DESKTOP | Windows 内置浏览器，报告 UA Chrome/152.0.0.0；真实 DOM、键盘、媒体事件和时间推进 | core/chapter 的 API/生命周期/DOM/SSR/性能已采集；见 [API](baselines/public-api.json)、[生命周期](baselines/lifecycle.json)、[DOM](baselines/dom.json)、[SSR](baselines/ssr.json)、[性能](baselines/performance.json)。历史问题另见 risks.json；不是所有功能通过 | ENG-05/08、CORE-18/22；将同夹具接入候选及 Playwright。Chrome 连接不可用可继续用内置浏览器，记录实际 UA |
| ENV-ENGINES | Playwright Chromium/Firefox/WebKit，Range/失败媒体服务，依据状态等待而非固定 sleep | 三引擎自动化尚未安装/运行；内置浏览器不能替代 Firefox/WebKit 结论 | ENG-05；取得各引擎的基础播放/清理报告。WebKit 自动化不代替 Apple 真机 |
| ENV-MEDIA | docs/assets/sample/video.mp4、video2.mp4；HTTP /assets/sample/；源路径和 SHA-256 已随 lifecycle 报告保存 | 已有 MP4 在本机实际解码/seek/切源；首个样本宽 640、时长约 90.046 秒。没有将扩展名推断为精确 codec/profile。WebM、HLS/DASH、无音轨、损坏/慢响应/中断的全矩阵未完成 | ENG-05、EX-03、相关包；固定授权样本、codec/profile/容器和哈希，补充拓扑/错误样本。现有素材完整来源仍属 BASE-MEDIA-01 |
| ENV-APPLE | macOS Safari、iPhone/iPad Safari；原生全屏、AirPlay、音频解锁、旋转/触控 | 设备/版本当前未知、未运行；桌面 UA 或触控模拟不是设备证据 | CORE-16/17/18/22、REL-03、相关包 05；在实际设备记录 OS/浏览器/媒体/操作与结果。缺口阻止受影响核心/插件发布，不阻止本地纯计算和 TS 迁移 |
| ENV-ANDROID | Android Chrome；触控、横竖屏、前后台、播放恢复 | 设备/版本当前未知、未运行 | CORE-16/17/18/22、REL-03、相关包集成；真实设备执行，报告不能只含 viewport 模拟 |
| ENV-SPECIAL | PiP/Document PiP、Cast 接收设备、IMA、模型 GPU/WASM、WebCodecs、AudioContext | 具体版本/资源见 third-party.json；源码路径观察，完整设备/服务运行未验证 | 按下表包责任执行，记录权限、用户手势、网络与能力检测、失败/退出/销毁；mock 只覆盖适配器逻辑 |

## 每包能力、样本与验收责任

下表版本全部是工作区初始版本；仅明确写“发布已冻结”的两包另有 tarball 证据。所有库均受 ENV-FORMAT/TYPES/COMBINATION 约束，浏览器基本路径受 ENV-DESKTOP/ENGINES 约束。包内 demo 的精确路径从 demo-inventory.json 读取，避免另存一份会漂移的 URL 清单。每行“待”均指尚未执行，不是 skip 或通过。

| 包 / 工作区版本 | 能力与固定样本/资源要求 | 当前状态、待补环境 | 负责验证任务 |
| --- | --- | --- | --- |
| artplayer / 5.4.1 | 原生媒体、字幕、切源、控件/设置、全屏/PiP、SSR；ENV-MEDIA + VTT/SRT | 发布 5.4.0 已冻结；桌面部分基线，移动/原生全屏/PiP/多引擎待测 | CORE-07/16/17/18/22/23、ENG-05 |
| artplayer-plugin-ads / 2.1.0 | 广告图片/视频、本片恢复、跳过、错误/销毁；本地短广告和主片 | 发布范围及所有浏览器场景待；无需借 IMA 结果代替自有广告逻辑 | PKG-ADS-01/02/05/06 |
| artplayer-plugin-ambilight / 1.1.0 | Canvas 采样、CORS、resize、后台/销毁；同源及受控跨源 MP4 | 待真实画布和资源测量 | PKG-AMBILIGHT-01/02/05/06 |
| artplayer-plugin-asr / 2.1.0 | PCM 音频输出/暂停/销毁；AudioContext + 调用方服务 | 待音频环境与调用方 WebSocket 验证；示例服务版本未知，不在 PR 调线上服务 | PKG-ASR-01/02/05/06、EX-03 |
| artplayer-plugin-audio-track / 1.1.0 | 音轨切换与同步；固定双音轨/单音轨/无音轨样本 | 待轨道来源和支持窗口确认、Safari/桌面实测 | PKG-AUDIO-01/02/05/06 |
| artplayer-plugin-auto-thumbnail / 1.1.0 | 帧提取/跳转、CORS、回收；本地 MP4+跨源失败 | 待 Canvas/seek/移动内存行为 | PKG-AUTO-THUMB-01/02/05/06 |
| artplayer-plugin-chapter / 1.1.0 | 区间、边界/重叠、hover/update、进度条组合；MP4+固定章节 | 发布 1.1.0 已冻结；最小注册/两段 DOM 已验，边界和新旧组合待 | PKG-CHAPTER-01/02/04/05/06、PILOT-01 |
| artplayer-plugin-chromecast / 1.1.0 | Cast SDK、发送/接收会话、取消/断线、本机恢复；接收端可访问媒体 | SDK 动态地址已记录；真实接收设备和 sender 版本未知、待运行 | PKG-CAST-01/02/05/06 |
| artplayer-plugin-danmuku / 5.3.0 | 弹幕布局/碰撞/时间/worker、seek/restart；固定弹幕时间表 | 待桌面/移动、长播放/压力及组合 | PKG-DANMUKU-01/02/05/06/07/08/09 |
| artplayer-plugin-danmuku-mask / 1.1.0 | MediaPipe/TensorFlow 模型、GPU/CPU/WASM、停止/销毁；人物短片 | Yarn 与 model URL 分开；默认 solutionPath 无固定版本，下载/推理/失败待 | PKG-MASK-01/02/05/06 |
| artplayer-plugin-dash-control / 1.1.0 | dash.js 实际表示/音轨、自动/手动高亮、切换拓扑；固定 MPD/segments | 本地选择逻辑 Node 测试已有；真实 dash.js/浏览器流待，示例版本见 SDK-02 | PKG-DASH-01/02/05/06、EX-03 |
| artplayer-plugin-document-pip / 1.1.0 | Document PiP、节点/样式迁移与退出恢复 | 支持浏览器/版本待确认，真实用户手势与 PiP 窗口待 | PKG-DPIP-01/02/05/06 |
| artplayer-plugin-hls-control / 1.1.0 | hls.js 清晰度/音轨自动手动切换；主/子列表与拓扑变化 | 实际 SDK/流未运行，示例版本见 SDK-01；Safari 原生 HLS 与 hls.js 路径分开 | PKG-HLS-01/02/05/06、EX-03 |
| artplayer-plugin-jassub / 1.1.0 | ASS、worker/WASM/font 加载、切源/销毁；短 ASS+明确来源字体 | 内嵌资源哈希已有；版本对应、跨源/worker 限制、实际渲染待 | PKG-JASSUB-01/02/05/06 |
| artplayer-plugin-multiple-subtitles / 1.2.0 | VTT 合并/排序/解析错误、URL 回收；双语言/空/坏 VTT | parser 来源头已观察；特有行为和浏览器字幕待 | PKG-MULTI-SUB-01/02/05/06 |
| artplayer-plugin-vast / 1.2.0 | Glomex/Google IMA、广告错误/恢复、重复初始化；供应商测试广告标签 | 依赖版本已记录；实际 IMA 网络/广告流程待，PR 用受控 adapter | PKG-VAST-01/02/05/06 |
| artplayer-plugin-vtt-thumbnail / 1.1.0 | WebVTT 时间和 sprite xywh、图片失败/跨源；本地 VTT+sprite | 发布/浏览器/边界待 | PKG-VTT-THUMB-01/02/05/06 |
| artplayer-proxy-canvas / 1.1.0 | video-like 属性/事件、Canvas 绘制、seek/销毁；MP4 | shim 与实际媒体顺序、跨源/移动待 | PKG-CANVAS-01/02/05/06 |
| artplayer-proxy-mediabunny / 1.2.0 | Mediabunny 1.56.1 当前解析；WebCodecs/AudioContext、HLS/轨道拓扑、AV 同步 | 库依赖不等于 codec 可用；准确 codec/profile、设备能力、长播放待 | PKG-MB-01/02/07/08/09/10 |
| artplayer-tool-iframe / 1.1.0 | 跨窗协议、ready/错误/销毁；同源与两个受控不同 origin 页面 | 消息/嵌套浏览器及沙箱权限待 | PKG-IFRAME-01/02/05/06 |
| artplayer-tool-thumbnail / 4.4.0 | 视频抽帧、下载图片/VTT、seek/错误/取消；本地 MP4 | BASE-DIST-01 的入口/声明问题待核实；Canvas/下载/移动待 | PKG-TOOL-THUMB-01/02/04/05/06 |
| artplayer-vitepress / 1.1.0 | ENV-SITE；Monaco/vConsole、示例 CDN/声明、构建静态资源 | 本地站点构建已验；编辑器实际执行/移动 HTML/旧链接待，npm 意图待核实 | SITE-01/02/03/04/05/06、EX-01/02/03 |

## 报告和发布判定

已有报告位置见上文及 baselines/；新验证将命令、源码 SHA/候选 tarball integrity、包/核心/SDK/浏览器/OS/设备版本、样本哈希与 codec、能力检测、通过/失败/缺环境、trace 位置和限制写入对应 changes/任务记录，CI 大型 trace/录像留 artifact。缺环境报告写清获得何种设备/服务后执行哪个场景，不能虚构负责人姓名或设备版本。

REL-08 按实际改变的依赖/能力选择本矩阵中的门槛。核心或共享构建变化可能影响所有旧插件，不能以某插件未改文件就豁免其组合测试。独立 chapter 试点不需要等待 Cast 接收器，但核心 Cast 相关行为改变后，缺 Cast 实测就阻止受影响核心批次。声明或分发失败阻止该包；codec 不支持要区分原本支持的能力回归和已证明的可选能力边界。

矩阵用于分配工作，不新增整批等待依赖。下一步直接实施 ENG-04 类型配置；多引擎、样本、真机与外部资源分别由既有工程和包任务补齐。修改候选源码、依赖或构建后，旧候选测试结论不再自动有效。三轮复盘和正式授权发布门槛保持不变。
