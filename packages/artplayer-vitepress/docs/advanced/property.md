# 实例属性

这里的 `实例属性` 是指挂载在 `实例` 的 `一级属性`，比较常用

## 实例身份与生命周期 {#instance-lifecycle}

Artplayer.instances 返回成功构造且仍在登记中的实例共享数组。构造器只在同步初始化结束后加入实例，因此构造插件执行时还不能在其中找到自己。它不是副本，也不代表所有实例已 ready。读取或复制即可，不应手动修改：登记、容器重复检查和互斥播放都依赖该数组；销毁只移除当前实例。

art.constructor 指向同一个 Artplayer 构造器，其 prototype 是实例原型。Artplayer.version 是包版本字符串，不是能力检测。历史根声明仍包含 Artplayer.env 和 Artplayer.build，但冻结的 npm 5.4.0 及当前 6.0.0 运行时都没有提供它们，读取返回 undefined；runtime 类型省略了它们。构建过程替换 NODE_ENV 不会创建这些公开字段。

art.id 是同一份已加载构造器内递增的数字，在配置校验前分配，失败构造可能留下间隔；分别加载的 bundle 有各自计数和实例表。它与播放记忆键 option.id 无关，不应用作跨页面持久唯一标识。

### 状态字段与内部服务 {#instance-state}

下列六个字段初始为 false，是普通可写字段，不是操作命令或能力保证。直接赋值不会执行对应功能或资源清理。

| 字段 | 核心含义 |
| --- | --- |
| isReady | 首次 canplay 后在 ready 事件前设为 true；reset、切源和正常销毁不把它重置为 false，因此不能证明当前 URL 已就绪 |
| isDestroy | 核心清理及实例移除后、destroy 事件前设为 true；内部关闭保护更早生效，清理执行中仍可能为 false |
| isFocus | 根据播放器 focusin/focusout 和文档内外 click/contextmenu 更新，不等同于 document.activeElement |
| isInput | 在上述路径记录目标是否为 INPUT，不代表所有可编辑目标；键盘过滤另行检查可编辑内容 |
| isLock | 移动端锁定辅助功能与 CSS 状态一起更新；直接赋值不会创建锁定 UI 或派发 lock |
| isRotate | 记录网页自动旋转的 CSS 变换；原生屏幕方向锁定不会让它成为通用设备方向标志 |

可选的 flv/m3u8/hls/ts/mpd/torrent 是外部适配器的集成位置，核心不初始化这些 SDK，也不会自动调用任意对象的 destroy 方法。按适配器的资源归属规则注册清理；runtime 将这些值描述为 unknown，需要使用者检查后再使用。

art.player 是安装实例属性描述符的对象，没有公开操作方法；播放 API 位于 art 本身。info/loading/mask 是已有组件服务，提供 show 和 toggle()。show setter 修改 CSS 状态并同步派发同名事件，重复相同赋值也会派发；它不是 Promise，不负责拉取媒体或决定缓冲状态，后续原生媒体回调可能再次改变其显示状态。

info 在桌面初始化，即使隐藏也按 INFO_LOOP_TIME 轮询 data-video 字段，数字显示两位小数并写入 textContent；runtime 的 init() 会重新建立归属的轮询/监听作用域，而不是额外叠加独立循环。loading 挂载配置的加载图标。mask 挂载状态/错误图标，状态按钮点击时请求 play，销毁时切换终止呈现；用户 destroy 监听器抛错不会跳过它的最终清理。这些服务不是 layers/controls 那样的自定义条目容器。

plugins.add 仍按插件指南的规则工作：同步结果立即注册，同 realm Promise 返回最终解析为管理器的 Promise，不会统一改造成异步 API。runtime 的 Plugins.add 类型接受准确和旧版工厂，不包装实际函数。插件返回对象即使有 destroy 方法，也不会仅因此被自动释放。

### Reset、销毁与失败 {#instance-cleanup}

reset() 只依次调用 video.removeAttribute('src') 和 video.load()，返回 undefined，保留 UI、实例登记、option.url、就绪标志和用户订阅；不撤销调用方 URL、不销毁 SDK，也不重建插件，原生媒体事件仍可能随后到达。需要协调切源时使用切源 API；reset 不是完整播放器重启或异步取消完成凭证。

destroy(removeHtml = true) 同步开始清理。REMOVE_SRC_WHEN_DESTROY 开启且媒体节点可用时先调用 reset，再释放归属作用域、处理模板、移除实例、设置 isDestroy、派发 destroy，并完成余下资源清理。返回不代表已经发出的浏览器异步请求全部完成。reset/destroy 都使用方法的 this，作为回调传递时应绑定实例。

true 会清空容器，但不删除调用方容器节点，也不恢复挂载前内容；false 保留生成 DOM 并添加 art-destroy，同时仍停止核心资源。重复/重入 destroy 不再执行，因此 destroy(false) 后再调用 destroy(true) 不会补删保留的 DOM。容器释放后可以创建新实例，不能把旧实例当作已复活，也不能假设销毁后的所有属性访问都统一无操作。

清理遇到异常仍继续，最后抛出第一个捕获值并记录额外异常；同步构造失败则恢复捕获的 DOM/属性并重新抛出原初始化错误。destroy 不清空所有用户事件订阅：保留实例也会保留这些回调，需自行移除。调用方创建的计时器、原生监听器和 SDK 资源需要自己的清理，核心管理器和作用域只释放登记给它们的资源。

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player' });
const instances: Artplayer[] = [...Artplayer.instances];
const identifier: number = art.id;
art.info.show = true;
art.loading.toggle();
const dispose = art.destroy.bind(art);
const retained: void = dispose(false);
void [instances, identifier, retained];
```


## 播放、进度与切源契约 {#playback-contract}

### 方法返回与媒体状态 {#playback-results}

play() 返回 Promise，等待当前媒体的 play() 结果；原生拒绝仍向调用者传播。成功后才显示播放提示、派发自定义 play，再根据 mutex 暂停其他实例。切源或销毁使原请求过期时，调用者仍收到媒体结果，但过期请求不再更新提示、派发 play 或暂停其他实例。自定义监听器等后续逻辑抛错也可能使 Promise 拒绝，不能把所有拒绝都解释成解码失败。

pause() 同步调用媒体 pause()，随后显示暂停提示、派发自定义 pause，并返回媒体方法的结果；通常原生返回 undefined，代理可能不同。toggle() 根据调用时的 playing 选择并直接返回 play() 或 pause() 的结果，不保证每次都是 Promise。根 Player.toggle 保留历史 void 声明；根入口导出的 PlaybackControls 是无运行时对象的类型视图，可用于原生媒体的准确返回类型。runtime 入口还按媒体泛型保留代理返回值。

这三个方法捕获所属实例，抽取后调用仍操作原实例。自定义 play/pause 事件与 video:play/video:pause 不同：原生事件由浏览器派发，时间顺序不能仅从方法调用推断。playing 优先使用代理提供的 boolean playing，否则要求 currentTime > 0、paused 为 false、ended 为 false 且 readyState > 2；它不是简单的 !paused，时间零或缓冲期间可能为 false。

### 时间、音量与缓冲数值 {#playback-values}

| 接口 | 实际行为 |
| --- | --- |
| currentTime | 读取媒体时间，假值回退 0；写入先 parseFloat，再限制到 0 与 art.duration 之间，NaN 输入不写入。runtime 接受 number/string，根声明保留 number |
| duration | 读取媒体时长，Infinity 和假值返回 0；直播的无限时长因此不作为可 seek 的有限终点 |
| seek | 只写属性；通过 currentTime 写入后显示进度提示并同步派发 seek(实际时间, 原始输入)，不是等待原生 seeked 的 Promise |
| forward / backward | 只写属性，分别把 currentTime + 秒数或 currentTime - 秒数转给 seek；请传数字，旧 JS 的加法与减法强制转换并不相同 |
| volume | 写入限制到 [0, 1]，提示使用媒体接受后的值；只有非零音量写入 storage 的 volume 键，零不会覆盖上次非零值，也不会自动更改 muted |
| muted | 写入媒体后同步派发 muted，重复赋相同值也会派发；传 boolean，原生字段的强制转换不改变事件携带的原始输入 |
| playbackRate | 真值且不同于当前值时写入媒体并提示；假值恢复为 1，相同值不再写入。浏览器不支持的速率仍可抛错，配置菜单不是浏览器能力保证 |
| loadedTime | 返回最后一个 buffered 区间的结束时间，无区间时为 0；不是所有区间长度之和，也不保证中间连续 |
| loaded | loadedTime 除以原始媒体 duration；没有裁剪或无效值修正 |
| played | currentTime 除以 art.duration；是当前位置比例，不是累计观看时长或原生 played 区间 |

loaded/played 在未就绪、零时长或特殊代理状态下可能是 NaN/Infinity，显示百分比前检查 Number.isFinite；不要据此推断可播放性。seek、forward、backward、switch 和 quality 没有 getter，读取都是 undefined；根声明保留历史读取类型，runtime 如实描述只写行为。currentTime 直接写入不会同步派发自定义 seek，原生媒体仍会自行派发事件。

attr(key, value) 直接读写构造时捕获的媒体对象属性，不是 HTML attribute API。省略 value 或显式 undefined 都是读取，写入返回 undefined；可使用 symbol，异常按底层属性行为传播。绕过 art 的属性门面直接修改媒体，不会执行门面自己的提示、存储或自定义事件。不要替换 template.$video 来实现切源：多数属性捕获原节点，duration 则读取当前模板，替换会造成两套状态。

### 地址赋值、完成与取消 {#source-transitions}

url 读取媒体 src，原生通常是浏览器解析后的绝对地址，代理也可能返回 null；option.url 保存调用方输入，二者不保证相等。type 读写 option.type，非空时优先于地址扩展名选择 customType；修改 type 本身不重新加载媒体。

直接赋 url 会替代当前切源操作。原生地址写入 src；customType 回调延后到下一轮执行，以实例作为 this，参数仍为 video、输入 URL、art。回调返回的 Promise 不作为媒体就绪信号，其拒绝会被归属的操作处理。只有实际 src 与旧值不同才更新 option.url；已 ready 且有旧地址时，当前源的 canplay 才触发 restart。自定义适配器仍需正确更新媒体并派发事件，核心无法替它判断外部 SDK 是否真正就绪。

switchUrl(url) 从 0 开始，switchQuality(url) 保存调用时的位置；两者先暂停，再赋值，等待媒体就绪/必要的 seek 完成，恢复速率和比例，并按当前播放意图尝试恢复播放。加载过程中显式 pause 可以取消恢复播放，新的公开 seek/currentTime 写入优先于自动位置恢复。返回值是 `Promise<void>`：通常完成表示当前切换流程已结束，但内部恢复 play 是尽力执行，拒绝不再使切源 Promise 失败。

后续切源、直接 url 赋值或 destroy 会结束旧操作，旧 Promise 正常 resolve，迟到回调不再恢复旧状态。与当前 art.url 严格相等的调用也是正常无操作；相对地址与解析后的绝对地址未必相等。空地址切换会完成并显示加载状态，不会由此清空旧 src，不能用它代替 reset。正常流程仍可因媒体错误、自定义适配器或状态恢复异常 reject；应处理拒绝。resolve 不能单独证明请求的地址已在播放，业务应结合当前源和媒体状态判断。

switch 是调用 switchUrl 的只写兼容入口，赋值表达式不会返回切源 Promise；需要捕获完成或错误时使用方法。直接 url setter 的失败会记录到控制台，赋值也没有可 await 的 Promise。URL/Blob URL 由提供者管理，核心切源及销毁不撤销调用方 URL。

### 画质列表与选择 {#quality-contract}

quality 接受含 html、url、可选 default 的数组；html 是字符串或 HTMLElement。设置会更新名为 quality 的右侧控件，标签取第一个 default 项，否则取第一项；这一步只设置 UI，不自动切换对应 URL，也不按当前源猜测高亮。数组及条目沿用控件的引用和 default 更新语义，不是不可变副本。

选择器点击会先更新 default 与标签，再调用 switchQuality；完成后只对仍有效的选择更新提示与返回标签。替换控件、较新选择或销毁会使旧的异步更新失效。空数组保留空的 quality 控件，不等同于 controls.remove('quality')。读取 art.quality 不返回列表，需要调用方保存配置。静态 URL 列表不是 HLS/DASH 的自适应轨道发现；这些 SDK 使用各自插件。

```ts
import Artplayer from 'artplayer/runtime';
import type LegacyArtplayer from 'artplayer';
import type { PlaybackControls } from 'artplayer';

const art = new Artplayer({ container: '#player', url: '/assets/sample/video.mp4' });
function nativeCommands(player: LegacyArtplayer): PlaybackControls {
    return player;
}
async function togglePlayback(): Promise<void> {
    await art.toggle(); // May reject when the branch requests play.
}
async function changeSource(url: string): Promise<void> {
    await art.switchUrl(url);
    // Completion includes cancellation; inspect art.url and media state as needed.
}
const progress: number | null = Number.isFinite(art.played) ? art.played : null;
art.currentTime = '12.5';
const unreadable: undefined = art.seek;
void [nativeCommands, togglePlayback, changeSource, progress, unreadable];
```


## 显示、尺寸与图像契约 {#display-contract}

### 显示模式与浏览器能力 {#display-modes}

state 按 mini、pip、fullscreen、fullscreenWeb 的顺序返回第一个真值模式，否则为 standard。写入只关闭名称不同的活动模式，**不会开启指定模式**；进入迷你播放器请写 mini = true。standard 或未知名称会请求关闭全部活动模式，浏览器退出可能异步完成。它不是事务式切换，也不保证赋值后立即达到目标状态。

fullscreen 在首次 video:loadedmetadata 时才根据当时能力安装描述符，之前可能是 undefined；优先使用文档原生全屏，其次尝试 WebKit 视频全屏，否则读 false 并显示不支持提示。根声明保留 boolean，runtime 标为可选。原生请求需要符合浏览器的用户激活和权限策略，布尔赋值表达式不是可 await 的请求结果。原生事件确认状态后才派发 fullscreen；原生路径随后更新互斥状态、CSS与resize。错误可能显示通知并产生 fullscreenError；不要用属性存在或桌面WebKit测试推断手机支持。

fullscreenWeb 是页面内CSS模式，读取 art-fullscreen-web 类。开启时保存播放器节点原位置和行内样式，根据 FULLSCREEN_WEB_IN_BODY 决定是否搬到所属文档body，再调整尺寸和类；退出恢复首次保存的位置与样式。因此模式期间对同一行内样式的临时修改可能在退出时被恢复覆盖。同步派发 fullscreenWeb 后再派发 resize，重复赋值也可能派发；销毁负责归还节点与清理，不是原生浏览器全屏。

mini 是可拖动的页面浮层，不是操作系统PiP。核心把同一个媒体节点搬入浮层，退出恢复原父节点和相邻位置；重复进入复用浮层。位置使用storage的left/top并限制在视口内。隐藏取消拖动，销毁只移除核心创建的浮层，调用方提供的节点仍由调用方拥有。mini事件表示浮层状态，不证明媒体已经播放。

pip 优先选择标准原生PiP，读取时若本实例拥有PiP则返回媒体元素，否则为null；WebKit presentation模式读取boolean，不支持时为false。根类型保留boolean，runtime为Element/null/boolean。设置仍为boolean且不返回可观察Promise：保留用户点击调用栈，处理通知与pip事件，不要把赋值结果当作窗口。销毁/取消只退出自身拥有或迟到的请求，不退出别的播放器窗口。这个接口是视频PiP；整页窗口请看Document PiP插件。同步原生异常仍可抛出，异步拒绝由核心记录到通知。

airplay() 根据WebKit可用性事件和选择器方法请求目标选择器，正常返回undefined，调用后派发airplay不代表已连接接收设备；不可用时只提示。调用应在合适的用户操作中进行，方法异常仍可传播。Safari/iOS、接收设备、iframe权限、代理媒体支持都必须独立验证。

### 尺寸、比例与封面 {#display-sizing}

rect 每次读取播放器节点的getBoundingClientRect；bottom/top/left/right/width/height来自这个视口坐标矩形。x/y是left/top加页面滚动偏移，属于页面坐标，不是rect.x/rect.y的简单别名。结果不是视频解码分辨率，也不是固定快照；多个属性分别读取可能跨越布局变化。

autoSize() 用有效视频宽高在调用方容器内等比容纳播放器，修改播放器百分比宽高，派发autoSize({width, height})；autoHeight() 保持容器clientWidth，按视频比例写容器像素高度并派发autoHeight(height)。二者返回undefined且可抽取调用。未得到有限正尺寸或容器隐藏时不写入、不派发无效尺寸；显示或元数据就绪后可重新调用。它们不是安装一个持续自动观察器的命令。

aspectRatio 用比例文本计算媒体节点的宽高和margin，并保存data-aspect-ratio；default或假值会清除这三项行内布局和dataset。合法比例按当前播放器尺寸计算，畸形/非正比例不写无效几何，但仍保留输入dataset、提示和事件，所以getter不是有效性证明。flip使用data-flip；normal或假值清除，horizontal/vertical由内置CSS处理。其他字符串仍可保留并派发，不代表存在对应变换；设置比例/翻转不改变源视频像素。两者都是先提示后同步派发同名事件，重复值也可能派发。

poster 读写封面层的行内background-image，不是video.poster，也不会加载新媒体或自动重新显示封面。读取依赖浏览器序列化的双引号URL，解析失败返回空字符串；不会读取外部样式表中的背景值。

### 截图结果与资源归属 {#capture-contract}

getDataURL() 和 getBlobUrl() 在调用时同步把媒体当前帧绘入内部canvas，再返回Promise：前者解析为PNG data URL，后者异步编码后创建Blob URL。尺寸来自媒体videoWidth/videoHeight，截图是媒体帧，不包含播放器控件、CSS翻转/比例效果或DOM字幕。没有可解码画面、canvas不可用或跨域媒体污染canvas时可能失败；播放成功不等于允许读取像素，核心不会绕过CORS。

getBlobUrl返回的URL由调用方在不再使用时URL.revokeObjectURL，销毁播放器不会代为撤销，也不使已开始的编码结果无效。getDataURL无需撤销。编码失败会拒绝Promise；仍有效的实例/源会显示错误提示。不要在没有有效尺寸时把空图结果视为成功截图。

screenshot(name?) 等待getDataURL，再下载并派发screenshot(dataURL)，最终返回同一字符串。文件名为传入名称或artplayer_加格式化时间，**总会再追加.png**；传入chosen.png会得到chosen.png.png。下载是否落盘仍取决于浏览器。等待期间切源或销毁会抑制过期下载和事件，但Promise仍可返回已经捕获的帧。三个方法可抽取调用；应处理Promise拒绝。

### 雪碧图预览与字幕偏移 {#preview-offset-contract}

thumbnails getter返回实际option.thumbnails对象。setter仅在实例未关闭、url为真值且非直播时替换整个对象并重置图片加载；不是与旧配置合并，空url不能当作清除命令。控件存在且发生hover，或移动端带事件的played更新时才加载/呈现。替换配置、控件或销毁会释放内部缩放Blob URL，并阻止过期结果写入；失败记录警告，后续hover可以重试。

number是总格数、column是列数，使用从0开始的行列。单格宽度优先width乘scale，否则由已加载图片宽度除column；高度优先height乘scale，否则按视频比例计算。提供有效的正数网格和可用视频尺寸。进度严格在两端之间才更新预览，左右定位受进度条宽度约束。scale涉及canvas缩放，跨域图片能显示不保证能缩放；配置对象不产生图片，生成雪碧图使用相应工具或插件。

subtitleOffset 只有存在track及cue时才写入。存储的偏移限制为[-10, 10]，每次相对保留的原始cue时间重新计算，cue边界再限制到[0, duration]，不是累加偏移；暂停时也刷新字幕。提示和subtitleOffset事件携带原始输入值，getter返回实际限制后的偏移。切换track后的行为以新track为准；没有cue时不会预存一个未来偏移。reset的独立声明仍对应前文[生命周期](#instance-cleanup)，不能把它视为恢复这些显示设置的命令。

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player' });
const fullscreen: boolean | undefined = art.fullscreen;
const pip: Element | null | boolean = art.pip;
const viewportRect: DOMRect = art.rect;
const pagePosition = { x: art.x, y: art.y };
function showMini(): void { art.mini = true; }
function closeModes(): void { art.state = 'standard'; }
async function inspectFrame(): Promise<number> {
    const url = await art.getBlobUrl();
    try {
        return (await (await fetch(url)).blob()).size;
    } finally {
        URL.revokeObjectURL(url);
    }
}
void [fullscreen, pip, viewportRect, pagePosition, showMini, closeModes, inspectFrame];
```


## `play`

-   Type: `Function`

播放视频

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();
});
```

## `pause`

-   Type: `Function`

暂停视频

<div className="run-code">▶ Run Code</div>

```js{11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();

    setTimeout(() => {
        art.pause();
    }, 3000);
});
```

## `toggle`

-   Type: `Function`

切换视频的播放和暂停

<div className="run-code">▶ Run Code</div>

```js{11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.toggle();

    setTimeout(() => {
        art.toggle();
    }, 3000);
});
```

## `destroy`

-   Type: `Function`
-   Parameter: `Boolean`

销毁播放器，接受一个参数表示是否销毁后同时移除播放器的 `html`，默认为 `true`

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.destroy();
});
```

## `reset`

-   Type: `Function`

重置播放器的视频元素：会移除当前 `src` 并调用一次 `load()`，常用于在单页应用中手动释放媒体资源或重新初始化视频标签。

> 注意：全局配置 `Artplayer.REMOVE_SRC_WHEN_DESTROY` 也会在调用 `destroy()` 时自动执行类似逻辑。

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    // 仅重置 video，不移除界面
    art.reset();
});
```

## `seek`

-   Type: `Setter`
-   Parameter: `Number`

视频时间跳转，单位秒

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 5;
});
```

## `forward`

-   Type: `Setter`
-   Parameter: `Number`

视频时间快进，单位秒

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.forward = 5;
});
```

## `backward`

-   Type: `Setter`
-   Parameter: `Number`

视频时间快退，单位秒

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 5;

    setTimeout(() => {
        art.backward = 2;
    }, 3000);
});
```

## `volume`

-   Type: `Setter/Getter`
-   Parameter: `Number`

设置和获取视频音量，范围在：`[0, 1]`

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.volume);
    art.volume = 0.5;
    console.info(art.volume);
});
```

## `url`

-   Type: `Setter/Getter`
-   Parameter: `String`

设置和获取视频地址

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.url = '/assets/sample/video.mp4?t=0';
});
```

## `switch`

-   Type: `Setter`
-   Parameter: `String`

设置视频地址，设置时和 `art.url` 类似，但会执行一些优化操作

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switch = '/assets/sample/video.mp4?t=0';
    }, 3000);
});
```

## `switchUrl`

-   Type: `Function`
-   Parameter: `String`

设置视频地址，设置时和 `art.url` 类似，但会执行一些优化操作

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switchUrl('/assets/sample/video.mp4?t=0');
    }, 3000);
});
```

:::warning 提示

`art.switch` 与 `art.switchUrl` 使用同一切换流程，但只有方法返回可观察的 Promise。正常完成、被替代、销毁、相同地址或空地址都可能 resolve；内部自动恢复播放失败也不等同于切源失败。请处理 reject，并结合当前源与媒体状态判断结果，详见[地址切换契约](#source-transitions)。

:::

## `switchQuality`

-   Type: `Function`
-   Parameter: `String`

设置视频画质地址，和 `art.switchUrl` 类似，但会带上之前的播放进度

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switchQuality('/assets/sample/video.mp4?t=0');
    }, 3000);
});
```

## `muted`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

设置和获取视频是否静音

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.muted);
    art.muted = true;
    console.info(art.muted);
});
```

## `currentTime`

-   Type: `Setter/Getter`
-   Parameter: `Number`

设置和获取视频当前时间，设置时间时和 `seek` 类似，但它不会触发额外的事件

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.currentTime);
    art.currentTime = 5;
    console.info(art.currentTime);
});
```

## `duration`

-   Type: `Getter`

获取视频时长

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.duration);
});
```

:::warning 提示

有的视频是没有时长的，例如直播中的视频或者没被解码完成的视频，这个时候获取的时长会是 `0`

:::

## `screenshot`

-   Type: `Function`

下载当前视频帧的截图, 可选参数为截图名字

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.screenshot('your-name');
});
```

## `getDataURL`

-   Type: `Function`

获取当前视频帧的截图的`base64`地址，返回的是一个 `Promise`

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', async () => {
    const url = await art.getDataURL();
	console.info(url)
});
```

## `getBlobUrl`

-   Type: `Function`

获取当前视频帧的截图的`blob`地址，返回的是一个 `Promise`

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', async () => {
    const url = await art.getBlobUrl();
    console.info(url);
});
```

## `fullscreen`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

设置和获取播放器窗口全屏

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'Fullscreen Switch',
            click: function () {
                art.fullscreen = !art.fullscreen;
            },
        },
    ],
});
```

:::warning 提示

由于浏览器安全机制，触发窗口全屏前，页面必须先存在交互（例如用户点击过页面）

:::

## `fullscreenWeb`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

设置和获取播放器网页全屏

<div className="run-code">▶ Run Code</div>

```js{8,11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});

art.on('ready', () => {
    art.fullscreenWeb = true;

    setTimeout(() => {
        art.fullscreenWeb = false;
    }, 3000);
});
```

## `pip`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

设置和获取播放器画中画模式

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'PIP',
            click: function () {
                art.pip = !art.pip;
            },
        },
    ],
});
```

:::warning 提示

由于浏览器安全机制，触发画中画前，页面必须先存在交互（例如用户点击过页面）

:::

## `poster`

-   Type: `Setter/Getter`
-   Parameter: `String`

设置和获取视频海报，只有在视频播放前才能看到海报效果

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});

art.on('ready', () => {
    console.info(art.poster);
    art.poster = '/assets/sample/poster.jpg?t=0';
    console.info(art.poster);
});
```

## `mini`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

设置和获取播放器迷你模式

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.mini = true;
});
```

## `playing`

-   Type: `Getter`
-   Parameter: `Boolean`

获取视频是否正在播放中

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    console.info(art.playing);
});
```

## `state`

-   Type: `Setter/Getter`
-   Parameter: `String`

获取或设置播放器当前状态，支持：`standard`（正常）、`mini`（迷你窗）、`pip`（画中画）、`fullscreen`（窗口全屏）、`fullscreenWeb`（网页全屏）。

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.state); // 默认 standard
    art.mini = true;
    console.info(art.state); // mini
    art.state = 'standard';
});
```

## `autoSize`

-   Type: `Function`

设置视频是否自适应尺寸

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.autoSize();
});
```

## `rect`

-   Type: `Getter`

获取播放器的尺寸和坐标信息

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(JSON.stringify(art.rect));
});
```

:::warning 提示

尺寸和坐标信息是通过 `getBoundingClientRect` 获取的

:::

## `bottom` / `top` / `left` / `right` / `x` / `y` / `width` / `height`

-   Type: `Getter`

这些属性是对 `rect` 的快捷访问：

- `bottom`, `top`, `left`, `right`, `x`, `y`：对应 `DOMRect` 的同名字段
- `width`, `height`：播放器当前可见宽高

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.width, art.height, art.left, art.top);
});
```

## `flip`

-   Type: `Setter/Getter`
-   Parameter: `String`

设置和获取播放器翻转，支持`normal`,  `horizontal`,  `vertical`

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.flip);
    art.flip = 'horizontal';
    console.info(art.flip);
});
```

## `playbackRate`

-   Type: `Setter/Getter`
-   Parameter: `Number`

设置和获取播放器播放速度

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.playbackRate);
    art.playbackRate = 2;
    console.info(art.playbackRate);
});
```

## `aspectRatio`

-   Type: `Setter/Getter`
-   Parameter: `String`

设置和获取播放器长宽比

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.aspectRatio);
    art.aspectRatio = '16:9';
    console.info(art.aspectRatio);
});
```

## `autoHeight`

-   Type: `Function`

当容器只有宽度，该属性可以自动计算出并设置视频的高度

<div className="run-code">▶ Run Code</div>

```js{7,11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.autoHeight();
});

art.on('resize', () => {
    art.autoHeight();
});
```

:::warning 提示

当你的容器只有宽度，但不知道具体高度时，这个属性很有用，它能自动计算出视频的高度，但你需要确定设置这个属性的时机

:::

## `attr`

-   Type: `Function`
-   Parameter: `String`

动态获取和设置 video 元素的属性

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.attr('playsInline'));
    art.attr('playsInline', true);
    console.info(art.attr('playsInline'));
});
```

## `type`

-   Type: `Setter/Getter`
-   Parameter: `String`

动态获取和设置视频类型

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.type);
    art.type = 'm3u8';
    console.info(art.type);
});
```

## `theme`

-   Type: `Setter/Getter`
-   Parameter: `String`

动态获取和设置播放器主题颜色

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.theme);
    art.theme = '#000';
    console.info(art.theme);
});
```

## `airplay`

-   Type: `Function`

开启隔空播放

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'AirPlay',
            click: function () {
                art.airplay();
            },
        },
    ],
});
```

## `loaded`

-   Type: `Getter`

视频缓存的比例，范围是 `[0, 1]`，常配合 `video:timeupdate` 事件使用

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:timeupdate', () => {
    console.info(art.loaded);
});
```

## `loadedTime`

-   Type: `Getter`

已缓存的媒体时长，单位为秒。通常与 `loaded` 一起使用，用于展示缓冲进度细节。

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:timeupdate', () => {
    console.info(art.loadedTime);
});
```

## `played`

-   Type: `Getter`

视频播放的比例，范围是 `[0, 1]`，常配合 `video:timeupdate` 事件使用

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:timeupdate', () => {
    console.info(art.played);
});
```

## `proxy`

-   Type: `Function`

`DOM` 事件的代理函数，实质上代理了 `addEventListener` 和 `removeEventListener`, 当使用 `proxy` 来处理事件，播放器销毁时也会自动销毁该事件

<div className="run-code">▶ Run Code</div>

```js{8-10}
var container = document.querySelector('.artplayer-app');

var art = new Artplayer({
	container: container,
	url: '/assets/sample/video.mp4',
});

art.proxy(container, 'click', event => {
	console.info(event);
});
```

:::warning 提示

假如你需要一些 `DOM` 事件只存在于播放器的生命周期上时，强烈建议使用该函数，以避免造成内存泄漏

:::

## `query`

-   Type: `Function`

`DOM` 的查询函数，类似 `document.querySelector`，但被查询的对象局限于当前播放器内，可以避免同类名的错误

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

console.info(art.query('.art-video'));
```

## `video`

-   Type: `Element`

快捷返回播放器的 `video` 元素

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

console.info(art.video);
```

### 原生与代理媒体能力 {#media-capabilities}

art.video 返回当前模板媒体节点，与 art.template.$video 相同，可能是经过适配的 canvas，而非 HTMLVideoElement。根入口保留历史 video 类型；runtime 导出 MediaSurface，即 NativeMedia | CanvasMedia。CanvasMedia 描述真正的 canvas 加上适配器提供的媒体状态、源地址、尺寸、缓冲区间、音量/倍速、load 和播放方法。普通 canvas 不满足此契约，类型本身也不会安装适配器。

PlaybackMethods 允许适配器自己的 play/pause 返回类型。直接调用 art.video.play/pause 操作媒体节点，得到原生或适配器返回值；Artplayer 方法还会处理通知、自定义事件、操作归属和互斥。MediaState 描述 currentTime/duration/paused/ended/readyState 以及可选布尔 playing；没有该提示时，核心按时间大于零、未暂停/结束和 readyState 大于二推导 playing。这些状态不能证明画面帧实际正在呈现。

| 可选能力 | 含义与检查 |
| --- | --- |
| textTracks、error | 类轨道列表/原生或适配器错误值，代理可能不提供；error 为 unknown，不保证是 Error 实例 |
| requestVideoFrameCallback、cancelVideoFrameCallback | 可选帧回调方法，需要分别检测并保留媒体 this；类型不承诺计时器回退 |
| requestPictureInPicture | 可选原生画中画请求，返回 Promise；存在该方法不代表没有用户激活、策略或媒体要求 |
| webkitEnterFullscreen、webkitExitFullscreen、webkitSupportsFullscreen | WebKit 媒体全屏方法及能力标志，使用前检测 |
| webkitSupportsPresentationMode、webkitSetPresentationMode、webkitPresentationMode | WebKit 呈现模式的能力、请求与观测状态；方法可用不保证请求成功 |
| webkitDisplayingFullscreen | 可选的媒体全屏观测状态，不是请求方法 |
| webkitShowPlaybackTargetPicker | 可选 AirPlay 选择器；核心还检查可用性事件，调用不代表已连接接收设备 |

直接使用可选原生方法时保留媒体 this 并处理 Promise 失败；常规播放器集成优先使用公开显示模式 API。能力检测或 Windows WebKit 运行不能替代真实 Safari/iOS/AirPlay 验收。下面的类型样例保持可选性，不发出显示模式请求：

```ts
import Artplayer from 'artplayer/runtime';
import type { MediaSurface, NativeMedia, CanvasMedia } from 'artplayer/runtime';

const art = new Artplayer({ container: '#player' });
const media: MediaSurface = art.video;
const error: unknown = media.error;
const tracks: ArrayLike<TextTrack> | undefined = media.textTracks;
const supportsFrames = typeof media.requestVideoFrameCallback === 'function'
    && typeof media.cancelVideoFrameCallback === 'function';
const surface: NativeMedia | CanvasMedia = media;
void [error, tracks, supportsFrames, surface];
```


## `cssVar`

-   Type: `Function`

动态获取或设置 `css` 变量

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.log(art.cssVar('--art-theme'));
    art.cssVar('--art-theme', 'green');
    console.log(art.cssVar('--art-theme'));
});
```

### 读取、写入与样式优先级 {#css-variable-contract}

art.cssVar(name) 从 art.template.$player 的 getComputedStyle 读取并返回**字符串**，透明度、缩放和层级也一样。返回的是计算后的自定义属性文本，不是解析后的数字，也不一定是规范化颜色。不存在的变量返回空字符串；art.theme 转发到 '--art-theme'。

第二参数沿用历史真值判断：真值调用 style.setProperty，返回 undefined；数字 0、空字符串、false、null、undefined 或 NaN 会改为读取当前值。写入零请用字符串 '0'。删除行内覆盖使用 art.template.$player.style.removeProperty(name)，cssVar(name, '') 不会删除。值直接交给 CSS，不按 CssVar 校验；非法 token 可能被保存，但使用它的 CSS 属性可能回退或失效。

写入只作用于本实例的行内样式及其后代，不影响其他实例；不会同步修改 art.option.cssVar 或 art.option.theme，不派发 theme 事件，也不会安装插件。构造时非空 option.theme 优先于初始 '--art-theme' 配置。外部样式按正常 CSS 层叠规则处理，应定位到真正的 .art-video-player：该节点自身的内置默认值可能覆盖仅从容器继承的值。行内覆盖通常优先于普通样式规则，!important 仍可能改变结果。

根入口 cssVar 签名保留历史数字/字面量类型，包括 '--art-fullscreen-web-index' 的 9999；实际运行时不限于该字面量。runtime 入口提供字符串读取及 string-or-void 写入类型，行为不变；构造 cssVar 配置仍有独立的历史类型形状。

### 内置默认值与使用位置 {#css-variable-defaults}

下表是基础样式值，尚未叠加构造配置、移动端/全屏类、用户 CSS 或行内样式。长度值按 CSS 要求提供单位。变量列在这里不代表所有浏览器都支持相关伪元素或功能。

| 变量 | 基础值 | 用途 |
| --- | --- | --- |
| `--art-theme` | `#f00` | 进度、选中项等主题色 |
| `--art-font-color` | `#fff` | 基础文字、链接与 SVG 填充 |
| `--art-background-color` | `#000` | 播放器背景 |
| `--art-text-shadow-color` | `rgba(0, 0, 0, 0.5)` | 基础文字阴影颜色 |
| `--art-transition-duration` | `0.2s` | 使用该变量的界面过渡时长，不包含所有动画 |
| `--art-padding` | `10px` | 底栏、菜单、信息等边距 |
| `--art-border-radius` | `3px` | 弹层、提示等圆角 |
| `--art-progress-height` | `6px` | 进度控件高度，内部轨道默认是它的一半 |
| `--art-progress-color` | `rgba(255, 255, 255, 0.25)` | 进度轨道背景 |
| `--art-progress-top-gap` | `10px` | 进度条上方交互区域的 padding |
| `--art-hover-color` | `rgba(255, 255, 255, 0.25)` | 进度悬停范围颜色 |
| `--art-loaded-color` | `rgba(255, 255, 255, 0.25)` | 已缓冲范围颜色 |
| `--art-state-size` | `80px` | 中间播放状态按钮尺寸 |
| `--art-state-opacity` | `0.8` | 显示时的状态按钮透明度 |
| `--art-bottom-height` | `100px` | 底部渐变背景高度，不是底栏布局总高度 |
| `--art-bottom-offset` | `20px` | 隐藏时底部控件的平移距离 |
| `--art-bottom-gap` | `5px` | 进度条下方与相关弹层间距 |
| `--art-highlight-width` | `8px` | 时间标记宽度 |
| `--art-highlight-color` | `rgba(255, 255, 255, 0.5)` | 时间标记颜色 |
| `--art-control-height` | `46px` | 单个控制条目的最小高度/宽度及布局回退值 |
| `--art-control-opacity` | `0.75` | 非悬停控制条目透明度 |
| `--art-control-icon-size` | `36px` | 控制条目图标宽高 |
| `--art-control-icon-scale` | `1.1` | 控制图标缩放，按下时还有额外比例 |
| `--art-volume-height` | `120px` | 音量面板高度 |
| `--art-volume-handle-size` | `14px` | 音量滑块手柄尺寸 |
| `--art-lock-size` | `36px` | 移动端锁定按钮尺寸 |
| `--art-indicator-scale` | `0` | 进度指示点基础缩放，悬停/按下规则另行覆盖 |
| `--art-indicator-size` | `16px` | 进度指示点宽高 |
| `--art-fullscreen-web-index` | `9999` | 网页全屏层级；不是原生全屏权限 |
| `--art-settings-icon-size` | `24px` | 设置项左侧图标尺寸 |
| `--art-settings-max-height` | `300px` | 设置面板 CSS 最大高度，JS 还会按可用空间约束 |
| `--art-selector-max-height` | `300px` | 控制条目选择器最大高度 |
| `--art-contextmenus-min-width` | `250px` | 右键菜单最小宽度 |
| `--art-subtitle-font-size` | `20px` | 字幕字号 |
| `--art-subtitle-gap` | `5px` | 字幕行间 gap |
| `--art-subtitle-bottom` | `15px` | 字幕基础底部距离，控件显示时叠加布局高度 |
| `--art-subtitle-border` | `#000` | 字幕 text-shadow 的描边颜色，不是边框宽度 |
| `--art-widget-background` | `rgba(0, 0, 0, 0.85)` | 菜单、设置、预览图等背景 |
| `--art-tip-background` | `rgba(0, 0, 0, 0.7)` | 进度提示、通知、锁按钮等背景 |
| `--art-scrollbar-size` | `4px` | WebKit 滚动条伪元素的宽高 |
| `--art-scrollbar-background` | `rgba(255, 255, 255, 0.25)` | WebKit 滚动条滑块颜色 |
| `--art-scrollbar-background-hover` | `rgba(255, 255, 255, 0.5)` | WebKit 滚动条滑块悬停颜色 |
| `--art-mini-progress-height` | `2px` | 历史保留值；当前核心样式没有读取它 |

### 模式覆盖与布局测量 {#css-variable-modes}

移动端类把 bottom-gap 改为 10px、control-height 改为 38px、control-icon-scale 改为 1、state-size 改为 60px、settings/selector-max-height 改为 180px、indicator-scale 和 control-opacity 改为 1。全屏样式把 progress-height 改为 8px、indicator-size 改为 20px、control-height 改为 60px、control-icon-scale 改为 1.3；网页全屏复用这些样式。类重叠时由选择器优先级和样式顺序决定，显式行内值也会覆盖这些模式默认值。这些是样式变化，不是设备或全屏能力检测。

控制栏布局观察器还会根据实际 offsetHeight 写入 '--art-controls-height'，字幕和面板定位使用该测量值，缺失时回退到 '--art-control-height'。它是内部测量结果，不属于这 43 个声明输入变量；手动写入可能被后续 resize 观察覆盖。修改 CSS 尺寸不会修改 SETTING_ITEM_HEIGHT 等布局常量，也不会配置播放器功能。

'--art-mini-progress-height' 为兼容保留声明和 2px 默认值，但当前核心没有读取它。迷你进度显示仍使用普通进度和控制栏的几何信息，只修改该闲置变量不会生效。


```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player' });
const opacity: string = art.cssVar('--art-control-opacity');
const result: string | void = art.cssVar('--art-control-opacity', '0');
art.cssVar('--art-fullscreen-web-index', '10001');
art.theme = 'green';
const theme: string = art.theme;
art.template.$player?.style.removeProperty('--art-control-opacity');
void [opacity, result, theme];
```

## `quality`

-   Type: `Setter`
-   Parameter: `Array`

动态设置画质列表

<div className="run-code">▶ Run Code</div>

```js{19-29}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
	quality: [
		{
			default: true,
			html: 'SD 480P',
			url: '/assets/sample/video.mp4',
		},
		{
			html: 'HD 720P',
			url: '/assets/sample/video.mp4',
		},
	],
});

art.on('ready', () => {
	setTimeout(() => {
		art.quality = [
			{
				default: true,
				html: '1080P',
				url: '/assets/sample/video.mp4',
			},
			{
				html: '4K',
				url: '/assets/sample/video.mp4',
			},
		];
	}, 3000);
})
```

## `thumbnails`

-   Type: `Setter/Getter`
-   Parameter: `Object`

动态设置缩略图

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.thumbnails = {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
    };
});
```

## `subtitleOffset`

-   Type: `Setter/Getter`
-   Parameter: `Number`

动态设置字幕偏移

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('ready', () => {
    art.subtitleOffset = 1;
});
```