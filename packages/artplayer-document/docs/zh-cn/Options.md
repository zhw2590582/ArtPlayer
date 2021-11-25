---
title: 基础参数
sidebar_position: 2
slug: /zh-cn/options
---

## container

-   类型: `String、Element`
-   默认: `#artplayer`
-   必填: `是`

播放器所挂载的 `dom` 容器，其必须是具有尺寸的，否则播放器无法显示

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

您可能需要初始化容器元素的大小，如:

```css
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

## url

-   类型: `String`
-   默认: `''`
-   必填: `是`

视频源地址，默认支持三种视频文件格式：`.mp4`、`.ogg`、`.webm`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## poster

-   类型: `String`
-   默认: `''`

视频的海报，只会出现在播放器初始化且未播放的状态下

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});
```

## title

-   类型: `String`
-   默认: `''`

视频标题，目前会出现在视频截图和迷你模式下

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: '【新海诚动画】『秒速5センチメートル』',
    screenshot: true,
});
```

## theme

-   类型: `String`
-   默认: `#f00`

播放器主题颜色，目前只作用于进度条上

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    theme: '#ffad00',
});
```

## volume

-   类型: `Number`
-   默认: `0.7`

播放器的默认音量

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::tip 提示

播放器会缓存最后一次音量的大小，下次初始化时（如刷新页面）播放器会读取该缓存值

:::

## isLive

-   类型: `Boolean`
-   默认: `false`

使用直播模式，会隐藏进度条和播放时间

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    isLive: true,
});
```

## muted

-   类型: `Boolean`
-   默认: `false`

是否默认静音

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});
```

## autoplay

-   类型: `Boolean`
-   默认: `false`

是否自动播放

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
    muted: true,
});
```

:::tip 提示

假如希望默认进入页面就能自动播放视频，`muted` 必需为 `true`，更多信息请阅读 [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

:::

## autoSize

-   类型: `Boolean`
-   默认: `false`

播放器的尺寸默认会填充整个 `container` 容器尺寸，所以经常出现黑边，该值能自动调整播放器尺寸以隐藏黑边

<div className="run-code">▶ Run Code</div>

```js
// 缩放浏览器窗口查看效果
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});
```

## autoMini

-   类型: `Boolean`
-   默认: `false`

当播放器滚动到浏览器视口以外时，自动进入迷你播放模式

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoMini: true,
});
```

## loop

-   类型: `Boolean`
-   默认: `false`

是否循环播放

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    loop: true,
});
```

## flip

-   类型: `Boolean`
-   默认: `false`

是否显示视频翻转功能，目前只出现在 `设置面板` 里，所以需要同时设置 `setting` 为 `true`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    flip: true,
    setting: true,
});
```

## rotate

-   类型: `Boolean`
-   默认: `false`

是否显示视频旋转功能，目前只出现在 `设置面板` 里，所以需要同时设置 `setting` 为 `true`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    rotate: true,
    setting: true,
    autoSize: true,
});
```

## playbackRate

-   类型: `Boolean`
-   默认: `false`

是否显示视频播放速度功能，会出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playbackRate: true,
    setting: true,
});
```

## aspectRatio

-   类型: `Boolean`
-   默认: `false`

是否显示视频长宽比功能，会出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    aspectRatio: true,
    setting: true,
});
```

## screenshot

-   类型: `Boolean`
-   默认: `false`

是否在底部控制栏里显示视频截图功能

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
    // 可选
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
});
```

:::tip 提示

由于浏览器安全机制，假如视频源地址和网站是跨域的，可能会出现截图失败

:::

## setting

-   类型: `Boolean`
-   默认: `false`

是否在底部控制栏里显示设置面板的开关按钮

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});
```

## hotkey

-   类型: `Boolean`
-   默认: `true`

是否使用快捷键

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    hotkey: true,
});
```

| 热键    | 描述          |
| ------- | ------------- |
| `↑`     | 增加音量      |
| `↓`     | 降低音量      |
| `←`     | 快进5秒       |
| `→`     | 快退5秒       |
| `space` | 切换播放/暂停 |


:::tip 提示

只在播放器获得焦点后（如点击了播放器后），该快捷键才会生效

:::

## pip

-   类型: `Boolean`
-   默认: `false`

是否在底部控制栏里显示画中画的开关按钮

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});
```

## mutex

-   类型: `Boolean`
-   默认: `true`

假如页面里同时存在多个播放器，是否只能让一个播放器存在声音

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    mutex: true,
});
```

## fullscreen

-   类型: `Boolean`
-   默认: `false`

是否在底部控制栏里显示播放器窗口全屏按钮

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
});
```

## fullscreenWeb

-   类型: `Boolean`
-   默认: `false`

是否在底部控制栏里显示播放器网页全屏按钮

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});
```

## subtitleOffset

-   类型: `Boolean`
-   默认: `false`

内置插件：字幕时间偏移插件，偏移的时间范围在 `[-5s, 5s]`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    setting: true,
    subtitleOffset: true,
});
```

## miniProgressBar

-   类型: `Boolean`
-   默认: `false`

内置插件：迷你进度条插件，只在播放器失去焦点后且正在播放时出现

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```

## localVideo

-   类型: `Boolean`
-   默认: `false`

内置插件：本地视频插件，需要使用`art.plugins.localVideo.attach`方法挂载打开视频按钮

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    localVideo: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: '打开视频',
            mounted: ($preview) => {
                art.plugins.localVideo.attach($preview);
            },
        },
    ],
});
```

## localSubtitle

-   类型: `Boolean`
-   默认: `false`

内置插件：本地字幕插件，需要使用`art.plugins.localSubtitle.attach`方法挂载打开字幕按钮

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    localSubtitle: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: '打开字幕',
            mounted: ($preview) => {
                art.plugins.localSubtitle.attach($preview);
            },
        },
    ],
});
```

## networkMonitor

-   类型: `Boolean`
-   默认: `false`

内置插件：播放卡顿监听插件

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    networkMonitor: true,
});

// 例如，当比率等于0.5时，它意味着每10秒的采样时间里有5秒的时间是卡顿的
let notice = false;
art.on('networkMonitor', (ratio) => {
    if (ratio >= 0.5 && !notice) {
        notice = true;
        console.log('当前播放状态欠佳');
    }
});

// 修改采样时间，单位是毫秒，默认为10秒。
art.plugins.networkMonitor.sample(30000);
```

## useSSR

-   类型: `Boolean`
-   默认: `false`

是否使用 `SSR` 挂载模式，假如你希望在播放器挂载前，就提前渲染好播放器所需的`HTML`时有用

你可以通过`Artplayer.html`访问到播放器所需的`HTML`

<div className="run-code">▶ Run Code</div>

```js
var $container = document.querySelector('.artplayer-app');
$container.innerHTML = Artplayer.html;

var art = new Artplayer({
    container: $container,
    url: '/assets/sample/video.mp4',
    useSSR: true,
});
```

:::tip 提示

SSR 是 Server Side Render 简称，页面上的内容是通过服务端渲染生成的，浏览器直接显示服务端返回的 HTML 就可以了。

:::

## layers

-   类型: `Array`
-   默认: `[]`

初始化自定义的业务图层，更多信息请访问 [自定义组件的使用](/document/zh-cn/Questions/component)

<div className="run-code">▶ Run Code</div>

```js
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
        },
    ],
});
```

## contextmenu

-   类型: `Array`
-   默认: `[]`

初始化自定义的右键菜单，更多信息请访问 [自定义组件的使用](/document/zh-cn/Questions/component)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            html: '自定义菜单',
            click: function () {
                console.info('你点击了自定义菜单');
                art.contextmenu.show = false;
            },
        },
    ],
});
```

## controls

-   类型: `Array`
-   默认: `[]`

初始化自定义的底部控制栏，更多信息请访问 [自定义组件的使用](/document/zh-cn/Questions/component)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            index: 10,
            html: '自定义按钮',
            tooltip: '自定义按钮的提示',
            click: function () {
                console.log('你点击了自定义按钮');
            },
        },
    ],
});
```

## quality

-   类型: `Array`
-   默认: `[]`

是否在底部控制栏里显示画质选择列表

| 属性      | 类型      | 描述     |
| --------- | --------- | -------- |
| `default` | `Boolean` | 默认画质 |
| `name`    | `String`  | 画质名字 |
| `url`     | `String`  | 画质地址 |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    quality: [
        {
            default: true,
            name: 'SD 480P',
            url: '/assets/sample/video.mp4',
        },
        {
            name: 'HD 720P',
            url: '/assets/sample/video.mp4',
        },
    ],
});
```

## highlight

-   类型: `Array`
-   默认: `[]`

在进度条上显示高亮信息点

| 属性   | 类型     | 描述               |
| ------ | -------- | ------------------ |
| `time` | `Number` | 高亮时间（单位秒） |
| `text` | `String` | 高亮文本           |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    highlight: [
        {
            time: 60,
            text: 'One more chance',
        },
        {
            time: 120,
            text: '谁でもいいはずなのに',
        },
        {
            time: 180,
            text: '夏の想い出がまわる',
        },
        {
            time: 240,
            text: 'こんなとこにあるはずもないのに',
        },
        {
            time: 300,
            text: '－－终わり－－',
        },
    ],
});
```

## plugins

## whitelist

## switcher

## thumbnails

## subtitle

## moreVideoAttr

## icons

## customType

## lang