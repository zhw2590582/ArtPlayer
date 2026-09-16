# 实例事件

播放器的事件分为两种，一种视频的 `原生事件` (前缀 `video:`)，另外一种是 `自定义事件`

监听事件：

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:canplay', () => {
    console.info('video:canplay');
});
```

只监听一次事件：

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.once('video:canplay', () => {
    console.info('video:canplay');
});
```

手动触发事件：

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.emit('focus');
```

移除事件：

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

const onReady = () => {
    console.info('ready');
    art.off('ready', onReady);
}

art.on('ready', onReady);
```

:::warning 全部事件请参考以下地址：

[artplayer/types/events.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/events.d.ts)

:::

## 订阅与同步派发 {#emitter-contract}

播放器继承 `Artplayer.Emitter`。`on(name, callback, ctx?)`、`once`、`off`、`emit(name, ...args)` 都返回当前实例；它们不是 DOM addEventListener，也不是返回 Promise 的消息队列。

- on 按注册顺序保存监听器，重复注册同一函数会重复调用。ctx 原样作为普通函数的 this；未传时以 undefined 调用，不自动绑定播放器，箭头函数仍使用词法 this。
- emit 同步遍历派发开始时的监听器快照。过程中新增的监听器不参加这次派发；移除的普通监听器若已在快照里，仍会执行。回调参数按原引用传递，回调返回值被忽略。
- once 在调用用户回调前移除，并防止嵌套派发重复消费同一注册；即使回调抛错也已消费。off(name, callback) 移除该函数的全部普通/once注册，不按ctx区分；off(name) 移除该名称的全部监听器。
- 回调同步抛错会终止当次后续监听器并沿调用栈传播；async回调的Promise不被等待，调用者应处理异步失败。error只是普通事件名，不具备Node EventEmitter的特殊错误规则。
- e是延迟创建的监听器表，保存fn和ctx，属于可见的历史接口；新建独立Emitter时可能不存在。用on/off维护订阅，不直接修改这个内部表。数字名称与对应字符串共享对象key，Symbol是独立key；根播放器类型的旧名称重载更窄，准确入口/独立泛型Emitter可表达更多名称。

手动emit只发通知，不替代播放器方法；伪造内置事件还可能触发核心内部监听器。销毁会清理核心拥有的DOM/内部订阅，但不等于清空用户事件表；用户保留实例时仍应移除不再需要的订阅。与DOM事件资源管理器 `art.events` 的区别见高级属性指南。

## 原生事件转发 {#native-event-contract}

以下默认媒体事件以 `video:` 为前缀转发，参数是原始Event对象，浏览器/代理决定它们何时发生：

`abort`、`canplay`、`canplaythrough`、`durationchange`、`emptied`、`ended`、`error`、`loadeddata`、`loadedmetadata`、`loadstart`、`pause`、`play`、`playing`、`progress`、`ratechange`、`seeked`、`seeking`、`stalled`、`suspend`、`timeupdate`、`volumechange`、`waiting`。

`video:error` 的参数不是MediaError或Error实例；需要时读取 `art.video.error`。旧类型保留 `video:complete` 和 `video:encrypted`，但默认config.events没有这两个名称，核心不会自动转发。若适配器需要扩展，须自行建立转发或在实例构造前配置事件清单；类型中有名称不证明运行时会发出事件。

全局转发来自播放器当前绑定的document/window，每次携带原始Event：

| 前缀 | 默认名称 |
| --- | --- |
| `document:` | click、mouseup、keydown、touchend、touchcancel、touchmove、mousemove、pointerup、contextmenu、pointermove、visibilitychange、webkitfullscreenchange |
| `window:` | resize、scroll、orientationchange |

它们不是仅在播放器内触发；可通过events.bindGlobalEvents重绑定到所属窗口。销毁后停止原生转发。document:keydown等参数实际保留KeyboardEvent/MouseEvent的原生子类型；转发不保证某个浏览器会产生每一种事件。

## 自定义事件参数与阶段 {#custom-event-contract}

内置监听器与用户监听器共用同步派发机制；构造时先注册的内部监听器可在原生转发过程中先发出自定义事件。不能为所有代理/浏览器规定统一的跨事件总顺序。

### 媒体与生命周期

| 事件 | 参数与实际阶段 |
| --- | --- |
| `ready` | 无参数；首个处理成功的video:canplay中设置isReady后发出一次，不等待异步插件、字幕或第三方SDK |
| `restart` | 本次提交的URL；已有URL且实例ready后，实际媒体地址发生变化的当前切源操作在canplay时发出。不保证相同URL赋值会发出 |
| `play` | 无参数；art.play等待媒体play成功后，在操作仍有效时发出。直接video.play不自动产生这个自定义事件；原生video:play仍可发出 |
| `pause` | 无参数；art.pause调用媒体pause并更新提示后同步发出，即使媒体原本已暂停。与video:pause不是同一事件 |
| `destroy` | 无参数；原生监听/资源和模板清理、实例登记移除及isDestroy置true后发出。不要假定回调中DOM仍挂载；destroy(false)另行控制保留DOM |
| `error` | 原始错误值、当前重试次数；重连等待后提交重试时发出，不是每次原生错误或所有异步失败的统一通道 |
| `seek` | 赋值后的currentTime、原始请求时间（可为数字或字符串）；不是原生seeked完成通知 |
| `muted` | 传给art.muted的布尔值；重复赋值仍可触发。直接改video.muted以原生video:volumechange观察 |
| `screenshot` | PNG data URI；截图方法得到图像并尝试触发下载后发出，不证明文件已保存。getDataURL/getBlobUrl本身不发此事件 |
| `airplay` | 无参数；可用的原生选择器调用后发出，不表示远端已连接或开始播放 |
| `raf` | 无参数；构造前USE_RAF启用时，播放中的帧循环发出，不是视频解码帧回调 |

### 界面与输入

| 事件 | 参数与实际阶段 |
| --- | --- |
| `info`、`layer`、`loading`、`mask`、`subtitle`、`contextmenu`、`control`、`setting` | show设置的布尔值；重复设置相同值也可触发，不是动画完成事件 |
| `focus` / `blur` | document click/contextmenu的原始事件，按路径是否包含播放器区分；不是DOM focus/blur事件，状态不变时也可发出 |
| `click` / `dblclick` | 视频节点点击事件；双击由DBCLICK_TIME窗口内计数得到，第一次click已立即发出，之后才执行播放/全屏动作 |
| `hover` | 是否进入、原始mouseenter/mouseleave事件 |
| `mousemove` | 播放器节点的MouseEvent，不是节流后的document坐标 |
| `hotkey` | KeyboardEvent；匹配的快捷键回调执行后发出，受焦点/输入过滤约束 |
| `keydown` | KeyboardEvent；桌面快捷键分发之后仍可发出，即使没有匹配键或播放器未聚焦；移动端不会自动安装这条快捷键分发。需要原始全局事件用document:keydown |
| `resize` | 无参数；窗口防抖、元数据/显示模式/主动布局等路径会发出，不只来自window:resize |
| `view` | 是否与视口相交；经滚动leading节流，不是元素完全可见或遮挡检测 |
| `lock` | 锁定布尔值；内置锁插件更新状态后发出，不是直接赋值isLock的观察器 |
| `setBar` | 类型、比例、可选原始鼠标/触摸事件。内置类型loaded/played/hover；程序刷新和键盘路径可能没有第三参数。它是进度UI更新协议，不是播放完成通知 |

### 尺寸、显示与字幕

| 事件 | 参数与实际阶段 |
| --- | --- |
| `aspectRatio` / `flip` | setter规范空值后的字符串；不保证它一定来自内置选择列表 |
| `autoHeight` / `autoSize` | 高度数值 / {width, height}；有效媒体尺寸下应用布局后发出，无法计算时不发 |
| `fullscreen` / `fullscreenWeb` / `mini` / `pip` | 状态布尔值；对应显示adapter观察或完成转换时发出。重复赋值是否发出依模式而异，不是请求成功的通用Promise替代品 |
| `fullscreenError` | 所属原生全屏错误事件/adapter提供的值；请求Promise拒绝也可能只进入提示，不能依赖它收集所有全屏失败 |
| `subtitleOffset` | 原始请求偏移；实际存储值会限制到[-10,10]，没有cue时不发 |
| `subtitleBeforeUpdate` / `subtitleAfterUpdate` | cue数组，不是单个cue；渲染前/后同步通知，没有活动cue时两者都不发 |
| `subtitleLoad` | 当前cue数组、字幕管理器当前选项（可能为null）；原生track加载完成，不是switch Promise的别名 |

## TypeScript事件视图 {#event-types}

根入口保留历史事件声明及自定义扩展：例如video:error旧写为Error，字幕更新旧写为单个VTTCue。根入口另有SubtitleUpdateEvents数组重载；需要稳定的准确上下文推导时使用 `artplayer/runtime`，其中原生媒体参数为Event、字幕为SubtitleCue数组、error/fullscreenError为unknown、seek第二参数允许字符串。未知自定义事件保留unknown数组，并不会校验运行时载荷。通用Emitter可以显式指定自己的事件tuple：

```ts
import Artplayer from 'artplayer/runtime';
import type { Events, SubtitleCue } from 'artplayer/runtime';

const bus = new Artplayer.Emitter<{ progress: [value: number] }>();
const context = { total: 0 };
bus.on('progress', function (value) { this.total += value; }, context);
bus.emit('progress', 2);

const art = new Artplayer({ container: '.artplayer-app', url: '/assets/sample/video.mp4' });
art.on('video:error', (event: Event) => console.info(event.type));
art.on('subtitleBeforeUpdate', (cues: SubtitleCue[]) => console.info(cues.length));
const seekArgs: Events['seek'] = [0, '0'];
void seekArgs;
```


## `ready`

当播放器首次可以播放器时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info('ready');
});
```

## `restart`

当播放器切换地址后并可以播放时触发

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.url = '/assets/sample/video.mp4'
});

art.on('restart', (url) => {
    console.info('restart', url);
});
```

## `pause`

当播放器暂停时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('pause', () => {
    console.info('pause');
});
```

## `play`

当播放器播放时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('play', () => {
    console.info('play');
});
```

## `hotkey`

当播放器热键被按下时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('hotkey', (event) => {
    console.info('hotkey', event);
});
```

## `destroy`

当播放器销毁时触发

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.destroy();
});

art.on('destroy', () => {
    console.info('destroy');
});
```

## `focus`

当播放器获得焦点时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('focus', (event) => {
    console.info('focus', event);
});
```

## `blur`

当播放器失去焦点时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('blur', (event) => {
    console.info('blur', event);
});
```

## `dblclick`

当播放器被双击时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('dblclick', (event) => {
    console.info('dblclick', event);
});
```

## `click`

当播放器被单击时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('click', (event) => {
    console.info('click', event);
});
```

## `error`

当播放器加载视频发生错误时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});

art.on('error', (error, reconnectTime) => {
    console.info(error, reconnectTime);
});
```

## `hover`

当播放器被鼠标移出或者移入时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('hover', (state, event) => {
    console.info('hover', state, event);
});
```

## `mousemove`

当播放器被鼠标经过时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('mousemove', (event) => {
    console.info('mousemove', event);
});
```

## `resize`

当播放器尺寸变化时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('resize', () => {
    console.info('resize');
});
```

## `view`

当播放器出现在视口时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('view', (state) => {
    console.info('view', state);
});
```

## `lock`

在移动端，当锁定的状态发生变化时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});

art.on('lock', (state) => {
    console.info('lock', state);
});
```

## `aspectRatio`

当播放器长宽比变化时触发

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    aspectRatio: true,
    setting: true,
});

art.on('aspectRatio', (aspectRatio) => {
    console.info('aspectRatio', aspectRatio);
});
```

## `autoHeight`

当播放器自动设置高度时触发

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.autoHeight();
});

art.on('autoHeight', (height) => {
    console.info('autoHeight', height);
});
```

## `autoSize`

当播放器自动设置尺寸时触发

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});

art.on('autoSize', () => {
    console.info('autoSize');
});
```

## `flip`

当播放器发生翻转时触发

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    flip: true,
    setting: true,
});

art.on('flip', (flip) => {
    console.info('flip', flip);
});
```

## `fullscreen`

当播放器发生窗口全屏时触发

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
});

art.on('fullscreen', (state) => {
    console.info('fullscreen', state);
});
```

## `fullscreenError`

当播放器发生窗口全屏错误时触发

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
	art.fullscreen = true;
});

art.on('fullscreenError', (event) => {
    console.info('fullscreenError', event);
});
```

## `fullscreenWeb`

当播放器发生网页全屏时触发

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});

art.on('fullscreenWeb', (state) => {
    console.info('fullscreenWeb', state);
});
```

## `mini`

当播放器进入迷你模式时触发

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.mini = true;
});

art.on('mini', (state) => {
    console.info('mini', state);
});
```

## `pip`

当播放器进入画中画时触发

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});

art.on('pip', (state) => {
    console.info('pip', state);
});
```

## `screenshot`

当播放器被截图时触发

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});

art.on('screenshot', (dataUri) => {
    console.info('screenshot', dataUri);
});
```

## `seek`

当播放器发生时间跳转时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('seek', (currentTime) => {
    console.info('seek', currentTime);
});
```

## `subtitleOffset`

当播放器发生字幕偏移时触发

<div className="run-code">▶ Run Code</div>

```js{11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitleOffset: true,
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    setting: true,
});

art.on('subtitleOffset', (offset) => {
    console.info('subtitleOffset', offset);
});
```

## `subtitleBeforeUpdate`

当字幕更新前触发

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('subtitleBeforeUpdate', (cues) => {
    console.info('subtitleBeforeUpdate', cues);
});
```

## `subtitleAfterUpdate`

当字幕更新后触发

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('subtitleAfterUpdate', (cues) => {
    console.info('subtitleAfterUpdate', cues);
});
```

## `subtitleLoad`

当字幕加载时触发

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('subtitleLoad', (option, cues) => {
    console.info('subtitleLoad', cues, option);
});
```

## `info`

当信息面板显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('info', (state) => {
    console.log(state);
});
```

## `layer`

当自定义层显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('layer', (state) => {
    console.log(state);
});
```

## `loading`

当加载器显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('loading', (state) => {
    console.log(state);
});
```

## `mask`

当遮罩层显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('mask', (state) => {
    console.log(state);
});
```

## `subtitle`

当字幕层显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('subtitle', (state) => {
    console.log(state);
});
```

## `contextmenu`

当右键菜单显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('contextmenu', (state) => {
    console.log(state);
});
```

## `control`

当控制器显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('control', (state) => {
    console.log(state);
});
```

## `setting`

当设置面板显示或隐藏时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.on('setting', (state) => {
    console.log(state);
});
```

## `muted`

当静音的状态变化时触发

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('muted', (state) => {
    console.log(state);
});
```

## `keydown`

监听来自 `document` 的 `keydown` 事件

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('keydown', (event) => {
    console.log(event.code);
});
```

## `video:canplay`

浏览器可以播放媒体文件了，但估计没有足够的数据来支撑播放到结束，不必停下来进一步缓冲内容

## `video:canplaythrough`

浏览器估计它可以在不停止内容缓冲的情况下播放媒体直到结束

## `video:complete`

历史类型保留的名称，默认视频事件清单不转发此事件。视频播放结束使用 `video:ended`。

## `video:durationchange`

duration 属性的值改变时触发

## `video:emptied`

媒体内容变为空；例如，当这个 media 已经加载完成（或者部分加载完成），则发送此事件，并调用 load() 方法重新加载它

## `video:ended`

视频停止播放，因为 media 已经到达结束点

## `video:error`

获取媒体数据时出错，或者资源类型不是受支持的媒体格式

## `video:loadeddata`

media 中的首帧已经完成加载

## `video:loadedmetadata`

已加载元数据

## `video:pause`

播放已暂停

## `video:play`

播放已开始

## `video:playing`

由于缺乏数据而暂停或延迟后，播放准备开始

## `video:progress`

在浏览器加载资源时周期性触发

## `video:ratechange`

播放速率发生变化

## `video:seeked`

跳帧（seek）操作完成

## `video:seeking`

跳帧（seek）操作开始

## `video:stalled`

用户代理（user agent）正在尝试获取媒体数据，但数据意外未出现

## `video:suspend`

媒体数据加载已暂停

## `video:timeupdate`

currentTime 属性指定的时间发生变化

## `video:volumechange`

音量发生变化

## `video:waiting`

由于暂时缺少数据，播放已停止

