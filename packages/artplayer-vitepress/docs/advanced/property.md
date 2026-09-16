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

`art.switch` 和 `art.switchUrl` 的功能是一样的，只是 `art.switchUrl` 方法会返回 `Promise`，当 `resolve` 时表示新地址是可以播放，`reject` 时表示新地址加载错误

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
    art.state = 'mini';
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