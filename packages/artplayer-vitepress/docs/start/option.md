# 基础选项

## `container`

-   Type: `String, Element`
-   Default: `#artplayer`

播放器挂载的 `DOM` 容器

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    container: '.artplayer-app', 
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

您可能需要初始化容器元素的大小，如:

```css{2-3}
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

或者使用 `aspect-ratio`：

```css{2}
.artplayer-app {
    aspect-ratio: 16/9;
}
```

:::warning 提示

全部选项里，只有 `container` 是必填的

:::

## `url`

-   Type: `String`
-   Default: `''`

视频源地址

<div className="run-code">▶ Run Code</div>

```js{3}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

有时候 `url` 地址没那么快知道，这时候你可以异步设置 `url`

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
});

setTimeout(() => {
    art.url = '/assets/sample/video.mp4';
}, 1000);
```

:::warning 提示

默认支持三种视频文件格式：`.mp4`, `.ogg`, `.webm`

如需要播放 `.m3u8` 或者 `.flv` 等其它格式，请参考左侧的 `第三方库`

:::


## `id`

-   Type: `String`
-   Default: `''`

播放器的唯一标识，目前只用于记忆播放 `autoplayback`

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    id: 'your-url-id',
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## `onReady`

-   Type: `Function`
-   Default: `undefined`

构造函数接受一个函数作为第二个参数，播放器初始化成功且视频可以播放时触发，和`ready`事件一样

<div className="run-code">▶ Run Code</div>

```js{7-9}
var art = new Artplayer(
    {
        container: '.artplayer-app',
        url: '/assets/sample/video.mp4',
        muted: true,
    },
    function onReady(art) {
        this.play()
    },
);
```

等同于:

```js{7-9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();
});
```

:::warning 提示

回调函数里的`this`就是播放器实例，但回调函数假如使用了箭头函数，`this`则不会指向播放器实例

:::

## `poster`

-   Type: `String`
-   Default: `''`

视频的海报，只会出现在播放器初始化且未播放的状态下

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});
```

## `theme`

-   Type: `String`
-   Default: `#f00`

播放器主题颜色，目前用于 `进度条` 和 `高亮元素` 上

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    theme: '#ffad00',
});
```

## `volume`

-   Type: `Number`
-   Default: `0.7`

播放器的默认音量

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::warning 提示

播放器会缓存最后一次音量的大小，下次初始化时（如刷新页面）播放器会读取该缓存值

:::

## `isLive`

-   Type: `Boolean`
-   Default: `false`

使用直播模式，会隐藏进度条和播放时间

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    isLive: true,
});
```

## `muted`

-   Type: `Boolean`
-   Default: `false`

是否默认静音

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});
```

## `autoplay`

-   Type: `Boolean`
-   Default: `false`

是否自动播放

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
    muted: true,
});
```

:::warning 提示

假如希望默认进入页面就能自动播放视频，`muted` 必需为 `true`，更多信息请阅读 [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

:::

## `autoSize`

-   Type: `Boolean`
-   Default: `false`

播放器的尺寸默认会填充整个 `container` 容器尺寸，所以经常出现黑边，该值能自动调整播放器尺寸以隐藏黑边，类似 `css` 的 `object-fit: cover;`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});
```

## `autoMini`

-   Type: `Boolean`
-   Default: `false`

当播放器滚动到浏览器视口以外时，自动进入 `迷你播放` 模式

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoMini: true,
});
```

## `loop`

-   Type: `Boolean`
-   Default: `false`

是否循环播放

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    loop: true,
});
```

## `flip`

-   Type: `Boolean`
-   Default: `false`

是否显示视频翻转功能，目前只出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    flip: true,
    setting: true,
});
```

## `playbackRate`

-   Type: `Boolean`
-   Default: `false`

是否显示视频播放速度功能，会出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playbackRate: true,
    setting: true,
});
```

## `aspectRatio`

-   Type: `Boolean`
-   Default: `false`

是否显示视频长宽比功能，会出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    aspectRatio: true,
    setting: true,
});
```

## `screenshot`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示 `视频截图` 功能

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});
```

:::warning 提示

由于浏览器安全机制，假如视频源地址和网站是跨域的，可能会出现截图失败

:::

## `setting`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示 `设置面板` 的开关按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});
```

## `hotkey`

-   Type: `Boolean`
-   Default: `true`

是否使用快捷键

<div className="run-code">▶ Run Code</div>

```js{4}
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
| `←`     | 视频快进      |
| `→`     | 视频快退      |
| `space` | 切换播放/暂停 |

:::warning 提示

只在播放器获得焦点后（如点击了播放器后），这些快捷键才会生效

:::

## `pip`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示 `画中画` 的开关按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});
```

## `mutex`

-   Type: `Boolean`
-   Default: `true`

假如页面里同时存在多个播放器，是否只能让一个播放器播放

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    mutex: true,
});
```

## `fullscreen`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示播放器 `窗口全屏` 按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
});
```

## `fullscreenWeb`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示播放器 `网页全屏` 按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});
```

## `subtitleOffset`

-   Type: `Boolean`
-   Default: `false`

字幕时间偏移，范围在 `[-5s, 5s]`，出现在 `设置面板` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitleOffset: true,
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    setting: true,
});
```

## `miniProgressBar`

-   Type: `Boolean`
-   Default: `false`

迷你进度条，只在播放器失去焦点后且正在播放时出现

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```

## `useSSR`

-   Type: `Boolean`
-   Default: `false`

是否使用 `SSR` 挂载模式，假如你希望在播放器挂载前，就提前渲染好播放器所需的 `HTML` 时有用

你可以通过 `Artplayer.html` 访问到播放器所需的 `HTML`

<div className="run-code">▶ Run Code</div>

```js{7}
var $container = document.querySelector('.artplayer-app');
$container.innerHTML = Artplayer.html;

var art = new Artplayer({
    container: $container,
    url: '/assets/sample/video.mp4',
    useSSR: true,
});
```

## `playsInline`

-   Type: `Boolean`
-   Default: `true`

在移动端是否使用 `playsInline` 模式

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playsInline: true,
});
```

## `layers`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `层`

<div className="run-code">▶ Run Code</div>

```js{5-23}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'potser',
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
            click: function (...args) {
                console.info('click', args);
                art.layers.show = false;
            },
            mounted: function (...args) {
                console.info('mounted', args);
            },
        },
    ],
});
```

:::warning `组件配置` 请参考以下地址：

[/component/layers.html](/component/layers.html)

:::

## `settings`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `设置面板`

<div className="run-code">▶ Run Code</div>

```js{5-34}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'setting01',
            selector: [
                {
                    html: 'setting01-01',
                },
                {
                    html: 'setting01-02',
                },
            ],
            onSelect: function (...args) {
                console.info(args);
            },
        },
        {
            html: 'setting02',
            selector: [
                {
                    html: 'setting02-01',
                },
                {
                    html: 'setting02-02',
                },
            ],
            onSelect: function (...args) {
                console.info(args);
            },
        },
    ],
});
```

:::warning `设置面板` 请参考以下地址

[/component/setting.html](/component/setting.html)

:::

## `contextmenu`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `右键菜单`

<div className="run-code">▶ Run Code</div>

```js{4-12}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            html: 'your-menu',
            click: function (...args) {
                console.info('click', args);
                art.contextmenu.show = false;
            },
        },
    ],
});
```

:::warning `组件配置` 请参考以下地址：

[/component/contextmenu.html](/component/contextmenu.html)-   Type:

:::

## `controls`

-   Type: `Array`
-   Default: `[]`

初始化自定义的底部 `控制栏`

<div className="run-code">▶ Run Code</div>

```js{4-16}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'left',
            html: 'your-control',
            tooltip: 'Your Control',
            style: {
                color: 'green',
            },
            click: function (...args) {
                console.info('click', args);
            },
        },
    ],
});
```

:::warning `组件配置` 请参考以下地址：

[/component/controls.html](/component/controls.html)

:::

## `quality`

-   Type: `Array`
-   Default: `[]`

是否在底部控制栏里显示 `画质选择` 列表

| 属性      | 类型      | 描述     |
| --------- | --------- | -------- |
| `default` | `Boolean` | 默认画质 |
| `html`    | `String`  | 画质名字 |
| `url`     | `String`  | 画质地址 |

<div className="run-code">▶ Run Code</div>

```js{4-14}
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

## `highlight`

-   Type: `Array`
-   Default: `[]`

在进度条上显示 `高亮信息`

| 属性   | 类型     | 描述               |
| ------ | -------- | ------------------ |
| `time` | `Number` | 高亮时间（单位秒） |
| `text` | `String` | 高亮文本           |

<div className="run-code">▶ Run Code</div>

```js{4-25}
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

## `plugins`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `插件`

<div className="run-code">▶ Run Code</div>

```js{15}
function myPlugin(art) {
    console.info(art);
    return {
        name: 'myPlugin',
        something: 'something',
        doSomething: function () {
            console.info('doSomething');
        },
    };
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [myPlugin],
});
```

## `thumbnails`

-   Type: `Object`
-   Default: `{}`

在进度条上设置 `预览图`

| 属性     | 类型     | 描述       |
| -------- | -------- | ---------- |
| `url`    | `String` | 预览图地址 |
| `number` | `Number` | 预览图数量 |
| `column` | `Number` | 预览图列数 |
| `width`  | `Number` | 预览图宽度 |
| `height` | `Number` | 预览图高度 |
| `scale`  | `Number` | 预览图缩放 |

<div className="run-code">▶ Run Code</div>

```js{4-8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
    },
});
```

:::warning 在线生成预览图

[artplayer-tool-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=thumbnail)

:::

## `subtitle`

-   Type: `Object`
-   Default: `{}`

设置视频的字幕，支持字幕格式：`vtt`, `srt`, `ass`

| 属性        | 类型       | 描述                                |
| ----------- | ---------- | ----------------------------------- |
| `name`      | `String`   | 字幕名字                            |
| `url`       | `String`   | 字幕地址                            |
| `type`      | `String`   | 字幕类型，可选 `vtt`, `srt`, `ass`  |
| `style`     | `Object`   | 字幕样式                            |
| `encoding`  | `String`   | 字幕编码，默认 `utf-8`              |
| `escape`    | `Boolean`  | 是否转义 `html` 标签，默认为 `true` |
| `onVttLoad` | `Function` | 用于修改 `vtt` 文本的函数           |

<div className="run-code">▶ Run Code</div>

```js{4-12}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        type: 'srt',
        encoding: 'utf-8',
        escape: true,
        style: {
            color: '#03A9F4',
            'font-size': '30px',
        },
    },
});
```

## `moreVideoAttr`

-   Type: `Object`
-   Default: `{'controls': false,'preload': 'metadata'}`

更多视频属性，这些属性将直接写入视频元素里

<div className="run-code">▶ Run Code</div>

```js{4-7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsInline: true,
    },
});
```

## `icons`

-   Type: `Object`
-   Default: `{}`

用于替换默认图标，支持 `Html` 字符串和 `HTMLElement`

<div className="run-code">▶ Run Code</div>

```js{4-7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    icons: {
        loading: '<img src="/assets/img/ploading.gif">',
        state: '<img src="/assets/img/state.png">',
    },
});
```

:::warning 全部图标的定义

[artplayer/types/icons.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/icons.d.ts)

:::

## `type`

-   Type: `String`
-   Default: `''`

用于指明视频的格式，需要配合 `customType` 一起使用，默认视频的格式就是视频地址的后缀（如 `.m3u8`, `.mkv`, `.ts`），但有时候视频地地址没有正确的后缀，所以需要特别指明

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.m3u8',
    type: 'm3u8',
});
```

:::warning 后缀的识别

播放器只能解析这种后缀：`/assets/sample/video.m3u8`

但无法解析这种后缀：`/assets/sample/video?type=m3u8`

所以假如你使用了 `customType`，最好同时要指明 `type`

:::

## `customType`

-   Type: `Object`
-   Default: `{}`

通过视频的 `type` 进行匹配，把视频解码权交给第三方程序进行处理，处理的函数能接收三个参数

- `video` : 视频 `DOM` 元素
- `url` : 视频地址
- `art` : 当前实例

<div className="run-code">▶ Run Code</div>

```js{4-8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.m3u8',
    customType: {
        m3u8: function (video, url, art) {
            //
        },
    },
});
```

## `lang`

-   Type: `String`
-   Default: `navigator.language.toLowerCase()`

默认显示语言，目前支持：`en`, `zh-cn`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

:::warning 更多的语言设置

[/start/i18n.html](/start/i18n.html)

:::

## `i18n`

-   Type: `Object`
-   Default: `{}`

自定义 `i18n` 配置，该配置会和自带的 `i18n` 进行深度合并

新增你的语言:

<div className="run-code">▶ Run Code</div>

```js{4-9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'your-lang',
    i18n: {
        'your-lang': {
            Play: 'Your Play'
        },
    },
});
```

修改现有的语言

<div className="run-code">▶ Run Code</div>

```js{4-11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    i18n: {
        'zh-cn': {
            Play: 'Your Play'
        },
        'zh-tw': {
            Play: 'Your Play'
        },
    },
});
```

:::warning 更多的语言设置

[/start/i18n.html](/start/i18n.html)

:::

## `lock`

-   Type: `Boolean`
-   Default: `false`

是否在移动端显示一个 `锁定按钮` ，用于隐藏底部 `控制栏`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});
```

## `fastForward`

-   Type: `Boolean`
-   Default: `false`

是否在移动端添加长按视频快进功能

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fastForward: true,
});
```

## `autoPlayback`

-   Type: `Boolean`
-   Default: `false`

是否使用自动 `回放功能`

<div className="run-code">▶ Run Code</div>

```js{4-5}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    id: 'your-url-id',
    autoPlayback: true,
});
```

:::warning 提示

因为播放器默认使用 `url` 作为 `key` 来缓存播放进度的

但假如你的同一个视频的 `url` 是不同的话，那么你需要使用 `id` 来标识视频的唯一 `key`

:::

## `autoOrientation`

-   Type: `Boolean`
-   Default: `false`

是否在移动端的网页全屏时，根据视频尺寸和视口尺寸，旋转播放器

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoOrientation: true,
});
```

## `airplay`

-   Type: `Boolean`
-   Default: `false`

是否显示 `airplay` 按钮，当前只有部分浏览器支持该功能

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    airplay: true,
});
```

## `cssVar`

-   Type: `Object`
-   Default: `{}`

用于改变内置的css变量

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    cssVar: {
        //
    },
});
```

:::warning cssVar 写法参考

[artplayer/types/cssVar.d.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/cssVar.d.ts)

:::

## `proxy`

-   Type: `function`
-   Default: `undefined`

函数可以返回一个第三方的 `HTMLCanvasElement` 或者 `HTMLVideoElement`，例如可以代理一个已经存在的 `video` dom元素

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    proxy: () => document.createElement('video')
});
```