# 文档内容核对跟踪（SITE-04）

这是计划内的文档补全与语义核对，不是用户保留的 REVIEW-01/02/03。任务状态仅由
tasks.json 维护。SITE-01 的 963 条核心声明成员包含继承、重载和 runtime 形状，
标题候选不代表语义覆盖；本表不会把新增插件页面算作完成核心成员核对。

## 已核对的包

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Chapter | [入口](../packages/artplayer-plugin-chapter/src/index.ts)、[区间处理](../packages/artplayer-plugin-chapter/src/chapters.ts)、progress.ts、stylesheet.ts、公开 types、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/chapter.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/chapter.md)：工厂可选参数；Chapters.start/end/title；Option.chapters；Result.name/update；命名类型与 legacy；初始化、原数组修改、同步错误及销毁 | 一次 metadata 初始化；切源需新数据；update 对象必填；没有额外 runtime/destroy 入口；WebKit 停顿和真机缺口未关闭 |
| Ambilight | [入口](../packages/artplayer-plugin-ambilight/src/index.ts)、scheduler.ts、sampler.ts、view.ts、根/runtime/legacy 声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/ambilight.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/ambilight.md)：Option.blur/opacity/frequency/zIndex/duration；Result.name/start/stop；Callable/Factory/RuntimeFactory；默认导出、默认自引用及历史类型形状 | zIndex 参数忽略、实际层级9；stop保留颜色；仅播放时采样；ready后安装需手动start；无update/destroy；像素可读性、CORS与代理能力分别说明 |
| Document PiP | [入口](../packages/artplayer-plugin-document-pip/src/index.ts)、window-session.ts、projection.ts、根/legacy 声明与 exports、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/document-pip.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/document-pip.md)：四个配置默认值；name/isSupported/isActive/open/close/toggle；document-pip 事件；Option/Result/AsyncResult/Factory/RuntimeFactory | 旧 void/可写类型与实际 Promise/只读 getter 分开；没有 runtime 子路径；用户激活、降级视频 PiP 不计会话、取消/迟到窗口/销毁、样式复制与真实设备限制 |
| ASR | [入口](../packages/artplayer-plugin-asr/src/index.ts)、capture.ts、subtitles.ts、encoding.ts、根/runtime 声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/asr.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/asr.md)：六个配置；PCM/WAV；name/append/hide/stop；根与 runtime 命名类型、回调和模块入口 | 模拟示例不是识别；第一声道、串行回调/积压上限/陈旧结果；HTML 不自动转义；stop 可重启且保留直接播放图；捕获流/CORS/独立音轨/静音边界，不声称真机已验证 |

上述说明与当前实现逐项对照，示例取自原 docs/assets/example 文件。Chapter 的空
视图、非法值和破坏性数组更新不能描述成不可变操作；Ambilight 的采样调度不能
描述成播放控制或保证帧率。两包原有实现地图已经描述这些行为，因此没有为了加
站点导航而改动包内实现、声明或分发文件。

Auto Thumbnail 和 Multiple Subtitles 的本次核对：

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Auto Thumbnail | [入口](../packages/artplayer-plugin-auto-thumbnail/src/index.ts)、options.ts、extraction.ts、session.ts、video.ts、根/runtime 声明、README/ARCHITECTURE；核心 thumbnailsMix/layout | [中文](../packages/artplayer-vitepress/docs/plugin/auto-thumbnail.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/auto-thumbnail.md)：url/width/number/scale/忽略height；name；异步注册；Option/Result/Factory/RuntimeFactory | truthy默认值、十列与时间公式、渐进JPEG、原对象延后读取、独立解码/CORS、分阶段超时/清理、无完成API；Windows WebKit首帧未解决。维护说明的版本句改为区分初始迁移和当前major准备 |
| Multiple Subtitles | [入口](../packages/artplayer-plugin-multiple-subtitles/src/index.ts)、request.ts、merge.ts、render.ts、lifetime.ts、根/runtime 声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/multiple-subtitles.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/multiple-subtitles.md)：五个TrackOption字段、subtitles、multipleSubtitles.name/tracks/reset、全部根及runtime命名类型 | 并发下载/延后元数据、未调用onParser、未知名称同步错误、空选择/原序reset、共享escape和URL归属、整cue显示、取消结算；注册不等待宿主加载，无自动菜单/重下载，根按npm1.2形状 |

Ads 和 VAST 的本次核对：

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Ads | [入口](../packages/artplayer-plugin-ads/src/index.ts)、options.ts、countdown.ts、view.ts、session.ts、根/runtime声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/ads.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/ads.md)：七个配置及四项i18n、name/play/pause/skip、click/skip事件、十个公开类型 | video优先、可信HTML、浅合并、计时非视频时长、按钮限制不拦截直接skip、ready/首播/早调用/销毁、事件活配置、totalDuration推导修正和忽略source/type |
| VAST | [入口](../packages/artplayer-plugin-vast/src/index.ts)、sdk.ts、session.ts、view.ts、根/runtime声明、README/ARCHITECTURE与两项已批准决策 | [中文](../packages/artplayer-vitepress/docs/plugin/vast.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/vast.md)：回调/第二参数、全部context字段、init/playUrl/playRes、name/destroy、runtime命名类型及工作区别名 | npm默认回调前创建/数据快照，显式workspace惰性/getter/请求抑制/事件；config可覆盖主字段；注册等待回调非广告完成；session可重建/core终止；旧根类型与准确runtime分离，外部IMA仍单独验收 |

JASSUB、弹幕遮罩和 Chromecast 的本次核对：

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| JASSUB | [入口](../packages/artplayer-plugin-jassub/src/index.ts)、registration.ts、vendor实现、根/runtime声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/jassub.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/jassub.md)：全部RuntimeOption；实例方法与字段；AssEvent/AssStyle；13个runtime命名类型 | 同步注册非Worker ready；实际resize参数/void返回与旧声明分开；query回调/target关联/毫秒单位；资源部署、caller节点归属、晚到位图与销毁；离屏停顿和字体/真机缺口保留 |
| Danmuku Mask | [入口](../packages/artplayer-plugin-danmuku-mask/src/index.ts)、config.ts、controller.ts、output.ts、sdk.ts、根/legacy声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/danmuku-mask.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/danmuku-mask.md)：十项配置、name/start/stop、NodeNext类型提取、双插件示例 | truthy默认值、固定MediaPipe/general与忽略字段、start不保证首mask、stop等待关系、无人物保留mask、model失败与其他拒绝区别；无runtime/新事件；SDK私有GPU完成未证明 |
| Chromecast | [入口](../packages/artplayer-plugin-chromecast/src/index.ts)、controller.ts、media.ts、sdk.ts、根/runtime声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/chromecast.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/chromecast.md)：四项设置/四回调、name/getCastState/isCasting、八个命名类型与旧根兼容 | options必填/活读取、首次点击加载、共享SDK/首URL、30秒ready期限、原始与标准状态、请求取消、绝对媒体URL/MIME、销毁不结束共享会话；有会话不等于接收端播放，真机仍独立验收 |

两个工具包的本次核对：

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Iframe | [入口](../packages/artplayer-tool-iframe/src/index.ts)、requests.ts、protocol.ts、connection.ts、navigation/child-session协议及ARCHITECTURE、公开声明、原始父子页面 | [中文](../packages/artplayer-vitepress/docs/tool/iframe.md) / [English](../packages/artplayer-vitepress/docs/en/tool/iframe.md)：构造两项、全部实例/静态方法与字段、12个命名类型、父子接入与完整原示例 | 函数体串行化/字面resolve/无闭包；200ms等待无默认timeout、忽略输入id、resove拼写、回调this、销毁拒绝但不移除iframe；窗口校验非origin白名单、旧peer导航限制；类型视图不验证数据，历史包/helper不是当前工具别名 |
| Thumbnail tool | [入口](../packages/artplayer-tool-thumbnail/src/index.ts)、policy/input/source/extraction/sheet/lifecycle/emitter/utils、公开声明与types说明、README/ARCHITECTURE、已批准默认决策 | [中文](../packages/artplayer-vitepress/docs/tool/thumbnail.md) / [English](../packages/artplayer-vitepress/docs/en/tool/thumbnail.md)：九项配置、全部类方法/状态、八个事件、10个公开类型、PNG布局/下载与默认模式表 | fileInput运行时必需、number/秒<=1、同步抛错与Promise拒绝、video不保证metadata、creat历史拼写、30px页脚、URL归属、输入/任务销毁及旧声明缺失。维护文档一处旧默认句同步修正，需要REL-02候选更新 |

两个代理包的本次核对：

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Canvas | [入口](../packages/artplayer-proxy-canvas/src/index.ts)、adapter/media/renderer/scheduler/geometry/subtitles、根/runtime声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/proxy/canvas.md) / [English](../packages/artplayer-vitepress/docs/en/proxy/canvas.md)：可选回调、Canvas返回/媒体转发、draw/error、尺寸/字幕/生命周期、六个类型 | Canvas原生成员优先、真实video回调、位图先释放再同步回调、无Promise回调等待、首帧特例、调用方stream tracks不停止；旧根/runtime分离，无额外公开控制对象或设备能力保证 |
| Mediabunny | [入口](../packages/artplayer-proxy-mediabunny/src/index.ts)、VideoShim/canvas-bridge/entry-lifecycle、input/preflight/tracks/hls-state/hls-selection/m3u8菜单、coordinator/playback/readiness、shim-values/frames、公开声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/proxy/mediabunny.md) / [English](../packages/artplayer-vitepress/docs/en/proxy/mediabunny.md)：13项顶层配置、两组五项菜单配置、shim全部公开成员、HLS字段、合成帧字段、11个公开类型 | 字符串后缀HLS检测、Range独立错误路径、配对/实际选中、Auto不保证ABR、兼容字段空setter、SDK fetch不由crossOrigin控制、合成TimeRanges/RVFC、全部不可解码code4与部分播放、过期操作/终止资源；设备/长期/真实SDK证据独立 |

原有五份生态指南的当前语义核对：

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Danmuku | [入口](../packages/artplayer-plugin-danmuku/src/index.ts)、danmuku/config/input/queue、scheduler/renderer、setting/setting-send/setting-slider/setting-template、heatmap/geometry/sampling、根/runtime-shared 声明 | [中文](../packages/artplayer-vitepress/docs/plugin/danmuku.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/danmuku.md)：全部配置、注册结果、Owner额外成员、18个runtime类型、11个事件与热力图选项 | 直接/加载文本不trim、原对象填默认值、浅拷贝、id不去重、filter truthy与beforeEmit严格true、追加/替换/取消、节点复用、内部返回对象非完整卸载；icons供外部复用不替换内置图标，show滑块字段未读取；#958坐标兼容及设备门槛保留 |
| HLS Control | [入口](../packages/artplayer-plugin-hls-control/src/index.ts)、mapping/menu/sdk-events、根与ESM/CJS声明、exports | [中文](../packages/artplayer-vitepress/docs/plugin/hls-control.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/hls-control.md)：两组配置、五个类型、name/update、泛型与末尾必填重载 | 外部SDK所有权、id/索引选择、标签去重、回调可选index、ready/restart与SDK刷新、无runtime/自引用；恢复可见Run Code，仍保留Firefox两个独立故障和MSE/真机边界 |
| DASH Control | [入口](../packages/artplayer-plugin-dash-control/src/index.ts)、sdk/mapping/menu/sdk-events/seek-buffer、根与ESM/CJS声明、exports | [中文](../packages/artplayer-vitepress/docs/plugin/dash-control.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/dash-control.md)：两组配置、五个类型、name/update、4/5 SDK方法族、同步返回与末尾必填重载 | 异步刷新中捕获同步getter/formatter异常，不支持Promise getter；菜单导航保留、ID零值、唯一轨道匹配、ABR设置、4.5.2指标定向恢复；恢复可见Run Code，SDK/设备验收独立 |
| Audio Track | [入口](../packages/artplayer-plugin-audio-track/src/index.ts)、track、根/runtime声明 | [中文](../packages/artplayer-vitepress/docs/plugin/audio-track.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/audio-track.md)：url/offset/sync、name/audio/update、五个命名类型 | 阈值严格大于、初始空URL、同URL/空更新不换源、更新offset不即时seek、元素身份与外部监听归属、主音频不自动静音、旧必填url与runtime局部更新；明确WebKit缓冲缺口与换源排序不是同一验收 |
| VTT Thumbnail | [入口](../packages/artplayer-plugin-vtt-thumbnail/src/index.ts)、request/parseVtt/preview/lifetime、根/runtime声明 | [中文](../packages/artplayer-vitepress/docs/plugin/vtt-thumbnail.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/vtt-thumbnail.md)：vtt/style、四个类型、异步注册、URL/裁剪/取整/首命中/端点与DOM挂钩 | 输入URL为相对图像基准、桌面精确端点隐藏/移动端无新绘制、取消仍返回名称、注册非图像解码、无update/独立destroy；root旧同步声明和runtime准确Promise分离 |

本次保持全部既有可运行代码片段不变，并逐一验证当前页面的转发内容；不是将
早期播放报告重新标为当前发布验收。十份源码指南的TypeScript片段、链接和三浏览器
页面检查见本批证据。核心963条仍单独待核对。

## 接续范围

核心服务首批映射见 [core-content-review.json](core-content-review.json)：events10、
storage8、i18n49、hotkey7、notice7，共81条明确声明记录，含根/runtime别名与getter/
setter重复形状；不能当成81个独立功能。两份高级属性指南与实际源码、类型、
51项测试和三浏览器快捷键示例核对完成，见[本批证据](baselines/site04-core-services.json)。
模板与图标随后新增91条：模板62、图标29；累计172条明确声明记录，791条仍待核对。
见[本批证据](baselines/site04-template-icons.json)。四份指南、四份严格TS、12组页面、
18次转发、三浏览器各63项DOM断言及31项测试通过。前五组的相关指南段落与源码
指纹均复核未变后才更新整页哈希；本页未涉及的组件等章节不因此自动算通过。

公共组件随后新增73条：根/runtime组件、配置、选择项和三个实例管理器入口。
六份layers/controls/contextmenu指南补齐共享规则及各自差异；累计245条映射，718条
仍待核对。六份严格TS、18组页面、72次转发、三浏览器各38项实际DOM断言及35项
现有测试通过，见[证据](baselines/site04-components.json)。前七组源码/指南哈希不变。
设置面板、剩余播放/事件/工具等声明不会因此自动算通过。

设置面板随后新增79条：根/runtime设置项、元信息、管理器与实例入口；累计324条，
639条仍待核对。双语指南说明树身份、延迟挂载、回调写回和更新/销毁，并修正旧
range字段导致切换形态失败的示例。两份严格TS、六组页面、54次转发、三浏览器各
40项DOM断言及完整修正示例通过，见[证据](baselines/site04-setting.json)。测试发现
翻译分段会切开表格，已修复并新增回归，42项测试及全量lint通过。共享脚本/测试
变更使21库候选输入指纹过期，需REL-02重新验证；不重标旧候选证据。

插件注册随后新增7条：根/runtime注册管理器与实例入口；累计331条映射，632条
仍待核对。双语编写指南、两份严格TS、六组页面/18次转发、三浏览器各23项注册
断言和27项测试通过，见[证据](baselines/site04-plugin-registry.json)。之前各组
源码/指南哈希不变；21库候选build有效，字幕/内置插件具体行为尚未由此覆盖。

字幕随后新增27条，累计358条映射、605条待核对。配置归属、Promise与track事件、
cue身份、渲染/转义、低层接口、取消和Blob归属已补双语指南；34项测试、两页六份
TS、六组页面/108次转发及三浏览器各22项字幕断言通过，见
[证据](baselines/site04-subtitle.json)。原有组源码不变，相关指南仅字幕章节变化；
原生全屏设备验收仍单独保留，21库build有效。

工具函数随后新增105条，累计463条映射、500条待核对。根/runtime各50个工具成员、
结构输入和静态入口的真实返回值、DOM语义、资源归属及调度说明已补齐。57项测试、
两份TS、六组页面/72次转发及三浏览器各41项工具断言通过，见
[证据](baselines/site04-utils.json)。静态指南其他章节与核心源码不变，21库build有效。
不据此证明下载完成、跨域图片、真机safe-area或媒体播放。

静态config及34个全局字段随后新增44条映射，累计507条、456条待核对。四份双语
指南说明读取时机并纠正滚动/resize/恢复提示/销毁等旧文案；117项测试、四份TS、
12组页面/18次转发与三浏览器各52项断言通过（其中34项默认值），见
[证据](baselines/site04-globals.json)。旧源码和静态指南config之外内容不变，21库
build有效；移动端/SDK/播放验收仍不由此覆盖。

事件指南随后新增120条映射，累计627条、336条待核对。覆盖Emitter、根重载与
静态入口、原生转发、各自定义事件及runtime准确参数，旧90个Run Code片段不变。
131项测试、两份TS、六组页面/24次转发和三浏览器各30项断言通过，见
[证据](baselines/site04-events.json)。旧8082进程导致的seek失败有原生video对照，
当前服务在8083通过；未修改运行时、放宽断言或覆盖失败报告。播放验证仅针对
本地MP4事件参数，不能替代codec、SDK、真机或全量demo验收。

构造配置指南随后新增93条映射，累计720条、243条待核对。补齐默认值、输入与
合并对象归属、媒体/存储/CSS覆盖顺序、平台开关和分阶段回调类型；历史行为与
106个既有示例不变。135项测试、两份TS、六组页面/24次转发及三浏览器各34项
构造断言通过，见[证据](baselines/site04-options.json)。使用当前服务的隔离端口，
不把桌面构造验证算作手机手势、SDK或完整媒体验收。

CSS变量与theme随后新增48条映射，累计768条、195条待核对。43个默认值与实际
消费者逐项对应，明确闲置mini-progress-height与内部测量controls-height的边界。
47项测试、两份TS、六组页面/12次转发与三浏览器各83项断言通过，其中51项为
默认值比对，见[证据](baselines/site04-css.json)。原94个示例、样式和运行时不变，
模拟移动端CSS类与网页全屏不代替真实移动设备或原生全屏验收。

- 核心：依据 site-inventory.json 的 963 条成员逐项或按明确的共享声明分组核对；
  必须记录对应文档及语义结论，不能仅按同名标题匹配标为通过。
- Danmuku、HLS、DASH、Audio、VTT 的当前声明/源码语义已补核对；既有媒体报告
  仍使用原候选和原环境，不用本轮页面验证覆盖SDK、解码或设备缺口。
- 16个插件、两个tool、两个proxy现均有独立双语指南；新增页面的参数和限制已对照
  当前源码。包内维护地图与用户指南用途不同，继续维护二者的一致性。
- SITE-05 和 EX-03 负责后续完整页面与实际 demo 验收；静态内容核对不等待真机，
  也不能据此关闭真机、外部 SDK、发布或复盘门槛。

生成文件继续由 build:docs/build:llm 写入；新 HTML 必须登记 demo-additions.json，
使用 introducedAfter 记录制作之前的真实提交，不能虚构尚不存在的引入提交 SHA。
源码、Run Code 片段、类型检查、生成页面、本地链接及实际浏览器证据随变更记录维护。
