# 实例属性

这里的 `实例属性` 是指挂载在 `实例` 的 `一级属性`，比较常用

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