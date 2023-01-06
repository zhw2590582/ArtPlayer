## container

-   类型: `String、Element`
-   默认: `#artplayer`
-   必填: `是`

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

:::tip 提示

全部选项里，只有 `container` 是必填的

:::

## url

-   类型: `String`
-   默认: `''`

视频源地址，默认支持三种视频文件格式：`.mp4`、`.ogg`、`.webm`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

有时候 `url` 地址没那么快知道，这时候你可以异步设置 `url`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
});

setTimeout(() => {
    art.url = '/assets/sample/video.mp4';
}, 1000);
```

## id

-   类型: `String`
-   默认: `''`

播放器的唯一标识，目前主要用于视频的记忆播放

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    id: 'artplayer-01',
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## Ready Callback

-   类型: `Function`
-   默认: `undefined`

构造函数接受一个函数作为第二个参数，播放器初始化成功且视频可以播放时触发，和`ready`事件一样

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer(
    {
        container: '.artplayer-app',
        url: '/assets/sample/video.mp4',
        muted: true,
    },
    function () {
        this.play();
    },
);
```

:::tip 提示

回调函数里的`this`就是播放器实例，但回调函数假如使用了箭头函数，`this`则不会指向播放器实例

:::

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
| `←`     | 快进 5 秒     |
| `→`     | 快退 5 秒     |
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

假如页面里同时存在多个播放器，是否只能让一个播放器播放

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

字幕时间偏移，范围在 `[-5s, 5s]`

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

迷你进度条，只在播放器失去焦点后且正在播放时出现

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
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

## playsInline

-   类型: `Boolean`
-   默认: `true`

在移动端是否使用 playsInline 模式

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playsInline: true,
});
```

## layers

-   类型: `Array`
-   默认: `[]`

初始化自定义的业务图层

| 属性      | 类型                | 描述                       |
| --------- | ------------------- | -------------------------- |
| `disable` | `Boolean`           | 是否禁用组件               |
| `name`    | `String`            | 组件唯一名称，用于标记类名 |
| `index`   | `Number`            | 组件索引，用于显示的优先级 |
| `html`    | `String`、`Element` | 组件的 DOM 元素            |
| `style`   | `Object`            | 组件样式对象               |
| `click`   | `Function`          | 组件点击事件               |
| `mounted` | `Function`          | 组件挂载后触发             |
| `tooltip` | `String`            | 组件的提示文本             |

<div className="run-code">▶ Run Code</div>

```js
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            index: 1,
            name: 'potser',
            disable: false,
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
            click: function (...args) {
                console.info('你点击了组件');
                art.layers.show = false;
            },
            mounted: function (...args) {
                console.info('组件挂载完成');
            },
        },
    ],
});
```

## settings

-   类型: `Array`
-   默认: `[]`

初始化自定义的设置面板，更多信息请访问 [怎么添加设置面板](/document/zh-cn/Questions/How%20to%20add%20setting%20panel)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: '自定义设置01',
            selector: [
                {
                    html: '子菜单01',
                },
                {
                    html: '子菜单02',
                },
            ],
            onSelect: function (item) {
                console.log(item.html);
            },
        },
        {
            html: '自定义设置02',
            selector: [
                {
                    html: '子菜单01',
                },
                {
                    html: '子菜单02',
                },
            ],
            onSelect: function (item) {
                console.log(item.html);
            },
        },
    ],
});
```

## contextmenu

-   类型: `Array`
-   默认: `[]`

初始化自定义的右键菜单

| 属性      | 类型                | 描述                       |
| --------- | ------------------- | -------------------------- |
| `disable` | `Boolean`           | 是否禁用组件               |
| `name`    | `String`            | 组件唯一名称，用于标记类名 |
| `index`   | `Number`            | 组件索引，用于显示的优先级 |
| `html`    | `String`、`Element` | 组件的 DOM 元素            |
| `style`   | `Object`            | 组件样式对象               |
| `click`   | `Function`          | 组件点击事件               |
| `mounted` | `Function`          | 组件挂载后触发             |
| `tooltip` | `String`            | 组件的提示文本             |

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

art.on('ready', () => {
    art.contextmenu.show = true;
});
```

## controls

-   类型: `Array`
-   默认: `[]`

初始化自定义的底部控制栏

| 属性       | 类型                | 描述                       |
| ---------- | ------------------- | -------------------------- |
| `disable`  | `Boolean`           | 是否禁用组件               |
| `name`     | `String`            | 组件唯一名称，用于标记类名 |
| `index`    | `Number`            | 组件索引，用于显示的优先级 |
| `html`     | `String`、`Element` | 组件的 DOM 元素            |
| `style`    | `Object`            | 组件样式对象               |
| `click`    | `Function`          | 组件点击事件               |
| `mounted`  | `Function`          | 组件挂载后触发             |
| `tooltip`  | `String`            | 组件的提示文本             |
| `position` | `String`            | 位置在 `left` 或者 `right` |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            disable: false,
            name: 'button',
            index: 10,
            position: 'right',
            html: '自定义按钮',
            tooltip: '自定义按钮的提示1',
            style: {
                color: 'red',
            },
            click: function () {
                console.log('你点击了自定义按钮1');
            },
            mounted: function () {
                console.log('自定义按钮挂载完成1');
            },
        },
        {
            position: 'left',
            html: '自定义按钮2',
            tooltip: '自定义按钮的提示2',
            style: {
                color: 'green',
            },
            click: function () {
                console.log('你点击了自定义按钮2');
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
            html: 'SD 480P',
            url: '/assets/sample/video.mp4',
        },
        {
            html: 'HD 720P',
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

-   类型: `Array`
-   默认: `[]`

初始化自定义的插件

<div className="run-code">▶ Run Code</div>

```js
function myPlugin(art) {
    console.info('你可以在插件里访问到播放器的实例');
    return {
        name: 'myPlugin',
        something: '自定义导出的属性',
        doSomething: function () {
            console.info('自定义导出的方法');
        },
    };
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [myPlugin],
});

art.on('ready', () => {
    console.info(art.plugins.myPlugin.something);
    console.info(art.plugins.myPlugin.doSomething());
});
```

## whitelist

-   类型: `Array`
-   默认: `[]`

因为不同的移动设备存在多种差异和限制，所以本播放器默认在移动设备上使用原生方法挂载视频，假如你想在移动设备上使用本播放器，需要手动开启白名单

白名单是一个数组类型，分别与 `window.navigator.userAgent` 进行匹配，只要其中一项匹配成功则启用播放器

支持`字符串`匹配、`函数`匹配、`正则`匹配

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    // whitelist: [(ua) => /iPhone OS 11/gi.test(ua)],
    // whitelist: [/iPhone OS 11/gi],
    // whitelist: ['iPhone OS 11'],
    whitelist: ['*'],
});
```

:::tip 提示

假如希望全部类型的移动设备都启用播放器，设置 `whitelist` 为通配符 `['*']` 即可

:::

## thumbnails

-   类型: `Object`
-   默认: `{}`

在进度条上设置预览图

| 属性     | 类型     | 描述       |
| -------- | -------- | ---------- |
| `url`    | `String` | 预览图地址 |
| `number` | `Number` | 预览图数量 |
| `column` | `Number` | 预览图列数 |
| `width`  | `Number` | 预览图宽度 |
| `height` | `Number` | 预览图高度 |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 100,
        column: 10,
    },
});
```

## subtitle

-   类型: `Object`
-   默认: `{}`

设置视频的字幕，支持字幕格式：`vtt`、`srt`、`ass`

| 属性       | 类型     | 描述                               |
| ---------- | -------- | ---------------------------------- |
| `url`      | `String` | 字幕地址                           |
| `type`     | `String` | 字幕类型，可选 `vtt`、`srt`、`ass` |
| `style`    | `Object` | 字幕样式                           |
| `encoding` | `String` | 字幕编码，默认 `utf-8`             |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        type: 'srt',
        encoding: 'utf-8',
        style: {
            color: '#03A9F4',
            'font-size': '30px',
        },
    },
});
```

## moreVideoAttr

-   类型: `Object`
-   默认: `{'controls': false,'preload': 'metadata'}`

更多视频属性，这些属性将直接写入视频元素里

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsInline: true,
    },
});
```

## icons

-   类型: `Object`
-   默认: `{}`

用于替换默认图标，支持 `Html` 字符串

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    icons: {
        loading: '<img src="/assets/img/ploading.gif">',
        state: '<img src="/assets/img/state.png">',
        play: '',
        pause: '',
        check: '',
        volume: '',
        volumeClose: '',
        screenshot: '',
        setting: '',
        pip: '',
        arrowLeft: '',
        arrowRight: '',
        playbackRate: '',
        aspectRatio: '',
        config: '',
        lock: '',
        flip: '',
        unlock: '',
        fullscreenOff: '',
        fullscreenOn: '',
        fullscreenWebOff: '',
        fullscreenWebOn: '',
        switchOn: '',
        switchOff: '',
        error: '',
        indicator: '',
    },
});
```

## type

-   类型: `String`
-   默认: `''`

用于指明视频的格式，需要配合 `customType` 一起使用，更多信息请访问 [第三方库](/document/zh-cn/libraries)

默认视频的格式就是视频地址的后缀（如 `.flv`、`.mkv`、`.ts`），但有时候视频地地址没有正确的后缀，所以需要特别指明

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.flv',
    type: 'flv',
});
```

## customType

-   类型: `Object`
-   默认: `{}`

通过视频的格式进行匹配，把视频解码权交给第三方程序进行处理，更多信息请访问 [第三方库](/document/zh-cn/libraries)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.flv',
    customType: {
        flv: function (video, url, art) {
            // video: 视频dom元素
            // url: 视频地址
            // art: 当前实例
        },
    },
});
```

## lang

-   类型: `String`
-   默认: `navigator.language.toLowerCase()`

默认显示语言，目前支持：`en`、`zh-cn`、`zh-tw`、`cs`、`pl`、`es`、`fa`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

## lock

-   类型: `Boolean`
-   默认: `false`

是否在移动端显示一个锁定按钮，用于隐藏底部控制栏

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});
```

## fastForward

-   类型: `Boolean`
-   默认: `false`

是否在移动端添加长按视频快进功能

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fastForward: true,
});
```

## autoPlayback

-   类型: `Boolean`
-   默认: `false`

是否使用自动回放功能

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoPlayback: true,
});
```

## autoOrientation

-   类型: `Boolean`
-   默认: `false`

是否在移动端的网页全屏时，根据视频尺寸和视口尺寸，旋转播放器

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoOrientation: true,
});
```

## airplay

-   Type: `Boolean`
-   Default: `false`

是否显示 airplay 按钮，当前只在 Safari 下可用

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    airplay: true,
});
```

## i18n

-   Type: `Object`
-   Default: `{}`

自定义 `i18n` 配置，该配置会和自带的 `i18n` 进行深度合并

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    i18n: {
        'zh-cn': {
            //
        },
        'zh-tw': {
            //
        },
    },
});
```

:::tip i18n 写法参考

[artplayer/types/i18n.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/i18n.d.ts)

:::


