# MediaBunny proxy 历史契约

来源：[发布与 Git 哈希](mb-release.json)、[实际产物表面及全部配置声明](mb-surface.json)。
PKG-MB-01 只冻结可观察接口、来源和依赖/资源范围；真实媒体时序、音画同步及长期释放由
PKG-MB-02/09 验证。以下标为源码观察的顺序，不等于浏览器已经通过。

## 发布范围与入口

| 来源 | 运行时主入口 | 类型 | 扩展能力 |
| --- | --- | --- | --- |
| npm 1.0.0 | CommonJS namespace.default；原生 ESM default | 可选 Option → 同步 initializer → HTMLCanvasElement | 不创建 art.mediabunny，没有三个 HLS 方法 |
| npm 1.2.0 | CommonJS 直接工厂；原生 ESM default | 保持可选参数、Canvas 返回；增加 m3u8 | 创建 art.mediabunny，提供 HLS 状态与选轨 |
| 冻结工作区 | 与 1.2.0 同代，单独冻结字节 | 当前声明单独冻结 | 不是对历史 tarball 的替代 |

两份实际 tarball 各6个文件：README、package.json、types 声明、main/legacy/ESM。
没有独立 worker、WASM、source map 或许可证/通知成员；不据此推断 SDK 永远不会使用
浏览器 worker 等能力。main/module/types/legacy、root/legacy exports 的原始值见 manifest。
所有入口存在。1.0.0 关联 Git 核心5.3.1-beta.1，1.2.0关联5.4.1；这是提交关联，
不是已测支持范围，也不是已验证的 npm 核心组合。

## 配置

完整25条顶层/嵌套配置路径与回调结构已记录在 mb-surface.json.options。

| 配置 | 默认或语义 | 边界 |
| --- | --- | --- |
| loadTimeout | 0；只接受有限数字作为超时 | 非正值不启动超时；成功后 timeout timer 的所有权待02/03验证 |
| timeupdateInterval | 250 ms，使用 ?? | VideoEngine 发 timeupdate 的间隔 |
| avSyncTolerance | 0.12 s，使用 ?? | 视频相对音频时钟容差 |
| dropLateFrames | false，使用 ?? | 不因优化静默改变默认丢帧策略 |
| poster | 空字符串 | 异步 Image 绘制；后续 poster setter 改 option，不代表已同步重设 VideoEngine |
| source | 无 | 真值时优先，否则取 art.option.url；公开类型 string / Blob / ReadableStream<Uint8Array> |
| preflightRange | false | 字符串非HLS源 HEAD；无 accept-ranges 或 none 发 RangeNotSupported error 后返回false；网络异常警告后继续 |
| volume | 0.7，使用 ?? | 初始值不钳制；setter转数值并钳制0..1，同时取消muted |
| muted | false，布尔转换 | setter布尔转换，发volumechange |
| autoplay / loop | false | getter读option；setter为空实现，不能声称真正实现自动播放或循环 |
| crossOrigin | 空字符串 | setter为空实现，不据此推断 fetch 的 CORS/凭据策略 |
| m3u8 | 无，1.2.0新增 | 真值才安装loadedmetadata/restart监听 |
| m3u8.quality / audio | 各含control、setting、title、auto、getName | control/setting默认不显示，title默认Quality/Audio，auto默认Auto |

工厂保留传入 option 对象的引用，没有克隆；同工厂初始化多个实例可共享该引用。
quality.getName接收id/index/name/height/bitrate；audio.getName接收id/index/name/lang/language/bitrate。
运行时状态还保留实际SDK track对象，当前公开配置回调声明未暴露track。

## Canvas 与 art.mediabunny

公开Result严格为HTMLCanvasElement；不能直接重标成HTMLVideoElement。1.2.0的
art.mediabunny指向VideoShim实例，destroy回调删除该字段并调用shim.destroy。

入口枚举 shim 实例自身和直接原型的全部属性，为 Canvas 中不存在的属性添加可配置、
可枚举的getter/setter；方法每次读取重新bind(shim)，因此`canvas.play !== canvas.play`。
已有Canvas属性/方法优先保留；枚举到的原生方法再绑定原Canvas，不将原生事件接口替换成shim。
其结果是`canvas.setAttribute('src', url)`不等于`canvas.src = url`，Canvas监听器也不会
自动收到shim发给ArtPlayer的媒体事件。浏览器中的完整属性集合仍要在02验证。

| 分组 | 成员与行为 |
| --- | --- |
| 来源/时间 | src读写保存输入，真值触发engine.load；currentSrc同源；currentTime写入Number(t)或0并调用异步seek；duration只读 |
| 状态 | paused、playing、ended、seeking、readyState、networkState、error映射engine；playing由paused/ended计算 |
| 媒体范围 | buffered、played、seekable是合成范围；无有效duration或end<=0为空；非空start/end不校验下标，buffered不是实际下载进度 |
| 速度/音量 | playbackRate默认1，只拒绝NaN及<=0；volume setter钳制并取消静音；muted布尔转换；均转发engine并发对应事件 |
| 播放 | play返回engine的Promise；pause/load返回undefined；currentTime/src属性赋值不返回底层Promise |
| HLS（1.2.0） | getM3u8State返回Promise；switchM3u8Quality(id或'auto')、switchM3u8Audio(id或'auto')返回Promise |
| 尺寸 | videoWidth、videoHeight读取engine；Canvas width/height仍是原生成员 |
| 属性兼容 | poster可写修改option；autoplay/loop/crossOrigin只读option但setter不执行动作；controls=false、playsInline=true、preload='auto'、defaultMuted=false、defaultPlaybackRate=1，相应setter均无动作 |
| 能力/帧 | canPlayType无条件'maybe'，不是codec支持检测；requestVideoFrameCallback只是单次RAF，presentedFrames=0；cancelVideoFrameCallback调用cancelAnimationFrame |
| 辅助方法 | setupEventForwarding、createTimeRanges、getBoundingClientRect、setAttribute、destroy；后两种DOM同名方法在Canvas侧仍原生优先 |
| 意外可观察字段 | art、canvas、option、events、engine、_src、_volume、_muted、_playbackRate同样被转发；完整own/prototype清单见JSON。重构不得仅因以下划线开头就默认可以删除 |

readonly属性的Canvas转发setter存在，但底层shim无setter：实际1.0.0主产物静默忽略duration
写入，1.2.0/冻结工作区主产物抛TypeError。这是已发布代际差异，不能简单标为统一旧行为。

## 输入与 HLS（当前冻结源码观察）

input.js集中检测`.m3u8`后缀，支持查询/片段且大小写不敏感；不嗅探无后缀URL内容。
字符串/Blob/ReadableStream分别封装对应SDK Source，其余值原样传递，空值转null。
Input选择HLS_FORMATS或ALL_FORMATS。先取主视频，再取其可配对主音频；无视频才取主音频。
直播duration为Infinity；非直播优先metadata，null才computeDuration。SDK拒绝和无轨道路径待02测试。

HLS状态包含levels、audios、currentLevel、currentAudio、videoMode、audioMode；只有与当前视频
可配对的音频进入状态列表。手动质量/音频通过SDK id选择，'auto'重新选主轨道；若旧搭档不能配对，
补选可配对轨道并将搭档mode置auto。不能把mode名称当作已证明持续ABR自适应。

控件/设置名为mediabunny-quality、mediabunny-audio；按实际current id标记default，名称去重，
质量按高度降序；音轨少于2隐藏。缺HLS状态或配置不启用时通过controls.remove/setting.remove清理。
选中后await切轨，写notice，再await更新。并发更新/销毁后的晚回写留给07验证。

## 事件与异步边界（当前冻结源码观察）

| 触发 | 可观察事件和状态 |
| --- | --- |
| shim事件 | 自有EventTarget构造Event，写detail；按Artplayer.constructor.config.events逐项桥接video:名称；非DOM dispatchEvent |
| load开始 | pause旧播放、dispose旧Input；networkState=2、readyState=0；两个零延迟timer分别发waiting、loadstart，不能假设始终早于异步metadata |
| 元数据齐备 | readyState=1；loadedmetadata → durationchange → progress；无轨道/异步callback的次数待02复现 |
| 加载完成 | readyState=4、networkState=1；loadeddata → canplay → canplaythrough → progress |
| load失败/超时 | error={code:4,message}、networkState=3，发error；外层和performLoad内层都有捕获，不据此推断所有Input已释放 |
| play/pause | play await audio后启动video，发play → playing；pause同步audio.pause/video.stop后发pause；ended重播先seek(0) |
| seek | seeking=true；seeking → waiting，暂停并等待audio/video.seek；seeking=false后seeked，必要时恢复play |
| 选轨 | 保留currentTime及是否播放，pause，seeking → waiting；重新load/seek后发metadata/duration/progress/data/canplay/canplaythrough/seeked，再恢复play |
| 帧/音频调度 | VideoEngine还可发timeupdate、ended、pause、canplay、playing、waiting；AudioEngine也可发canplay、playing。一次性/重复事件不能只从主Engine判断 |
| destroy | pause、disposeInput、audio.destroy、video.destroy；loadSeq未在destroy递增，未统一收回全部timer/RAF；准确竞态与释放证据待02 |

## 依赖与许可范围

1.0.0声明mediabunny ^1.27.3，1.2.0/当前声明^1.43.1。当前Yarn锁和安装版本1.56.1，
其package.json为MPL-2.0，LICENSE为完整Mozilla Public License 2.0；冻结相应文件哈希。
SDK清单另含两个@types依赖，不能把类型依赖自动计为播放产物中的JS。

实际历史ESM内含AudioBufferSink/CanvasSink实现，三个历史格式均未发现MPL/Source Code Form
通知标记；两份归档均无LICENSE/NOTICE成员，README和包清单仅标MIT。这个事实不构成
完整法律判断，但候选发布必须补齐实际内嵌依赖的来源、许可/通知和可获得的对应源码说明。
历史归档没有构建依赖版本证明，关联Git无锁文件，因此内嵌SDK精确版本记为unknown；
不能拿当前安装1.56.1冒充历史构建版本。由MB-LICENSE-01和PKG-MB-10继续关闭。
