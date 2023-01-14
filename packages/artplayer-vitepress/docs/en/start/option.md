# Option

## `container`

-   Type: `String, Element`
-   Default: `#artplayer`

The `DOM` container attached to the player

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    container: '.artplayer-app', 
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

You may need to initialize the size of container elements, such as:

```css{2-3}
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

:::warning Tip

Of all options, only `container` is required

:::

## `url`

-   Type: `String`
-   Default: `''`

Video source address

<div className="run-code">▶ Run Code</div>

```js{3}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

Sometimes the `url` address is not known so quickly. At this time, you can set the `url` asynchronously

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
});

setTimeout(() => {
    art.url = '/assets/sample/video.mp4';
}, 1000);
```

:::warning Tip

Three video file formats are supported by default: `.mp4`, `.ogg`, and `.webm`

If you need to play `.m3u8` or `.flv` or other formats, please refer to the `Libraries` on the left

:::


## `id`

-   Type: `String`
-   Default: `''`

The unique identifier of the player, currently only used for `autoplayback`

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

The constructor accepts a function as the second parameter, which is triggered when the player is initialized successfully and the video can be played, just like the `ready` event

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

Equivalent to:

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

:::warning Tip

The `this` in the callback function is the player instance, but if the callback function uses the arrow function, the `this` will not point to the player instance

:::

## `poster`

-   Type: `String`
-   Default: `''`

Video posters will only appear when the player is initialized and not played

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});
```

## `title`

-   Type: `String`
-   Default: `''`

Video title, which currently appears in `video screenshot` and `mini mode`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: 'your-video-title',
    screenshot: true,
});
```

## `theme`

-   Type: `String`
-   Default: `#f00`

The player theme color is currently used on the `progress bar` and `highlighted element`

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

Default volume of player

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::warning Tip

The player will cache the size of the last volume, and the player will read the cache value at the next initialization (such as refreshing the page)

:::

## `isLive`

-   Type: `Boolean`
-   Default: `false`

When using live mode, the progress bar and playback time will be hidden

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

Whether to mute by default

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

Whether to play automatically

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
    muted: true,
});
```

:::warning Tip

If you want to enter the page by default to automatically play the video, `muted` must be `true`. For more information, please read [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

:::

## `autoSize`

-   Type: `Boolean`
-   Default: `false`

The size of the player will fill the entire `container` size by default, so black edges often appear. This value can automatically adjust the size of the player to hide the black edges, similar to the `object-fit: contain` of `css`

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

When the player scrolls outside the viewport, it automatically enters the `mini mode`

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

Whether to play in a loop

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

Whether to display the video flip function currently only appears in the `Setting` and `Contextmenu`

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

Whether to display the video playback speed function will appear in the `Setting` and `Contextmenu`

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

Whether to display the video aspect ratio function will appear in the `Setting` and `Contextmenu`

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

Whether to display the `video screenshot` function in the bottom control bar

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});
```

:::warning Tip

Due to the browser security policy, if the video source address and website are cross-domain, the screenshot may fail

:::

## `setting`

-   Type: `Boolean`
-   Default: `false`

Whether to display the switch button of `Setting` in the bottom control bar

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

Whether to use shortcut keys

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    hotkey: true,
});
```

| Hotkeys | Sescribe          |
| ------- | ----------------- |
| `↑`     | Volume Up         |
| `↓`     | Volume Down       |
| `←`     | Fast forward      |
| `→`     | Fast rewind       |
| `space` | Toggle play/pause |

:::warning Tip

These shortcut keys will only take effect after the player gets the focus (such as clicking the player)

:::

## `pip`

-   Type: `Boolean`
-   Default: `false`

Whether to display the `picture in picture` switch button in the bottom control bar

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

If there are multiple players in the page at the same time, can only one player play

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

Whether to display the player `window full screen` button in the bottom control bar

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

Whether to display the player `full screen web page` button in the bottom control bar

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

Subtitle time offset, with the range of `[-5s, 5s]`, appears in the `Settings`

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

Mini progress bar, only appears when the player loses focus and is playing

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

Whether to use the `SSR` mount mode is useful if you want to render the `HTML` required by the player in advance before the player is mounted

You can access the `HTML` required by the player through `Artplayer.html`

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

Whether to use the `playsInline` mode on the mobile end

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

Initialize the customized `layers`

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

:::warning Please refer to the following address for `Component`:

[/start/component.html](/start/component.html)

:::

## `settings`

-   Type: `Array`
-   Default: `[]`

Initialize the customized `Setting`

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

:::warning Please refer to the following address for `Setting`

[/start/setting.html](/start/setting.html)

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

[/start/component.html](/start/component.html)-   Type:

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

[/start/component.html](/start/component.html)

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

## `whitelist`

-   Type: `Array`
-   Default: `[]`

因为不同的移动设备存在多种差异和限制，有时候你希望在某些移动设备上不使用本播放器，而是直接使用原生的功能时，可以通过该选项控制

白名单是一个数组类型，分别与 `window.navigator.userAgent` 进行匹配，只要其中一项匹配成功则启用播放器

支持 `字符串` 匹配,  `函数` 匹配,  `正则` 匹配

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    whitelist: [(ua) => /iPhone OS 11/gi.test(ua)],
    // whitelist: [/iPhone OS 11/gi],
    // whitelist: ['iPhone OS 11'],
});
```

:::warning 提示

假如该选项不填，则默认使用本播放器

:::

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

<div className="run-code">▶ Run Code</div>

```js{4-8}
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

:::warning 在线生成预览图

[artplayer-tool-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=thumbnail)

:::

## `subtitle`

-   Type: `Object`
-   Default: `{}`

设置视频的字幕，支持字幕格式：`vtt`, `srt`, `ass`

| 属性       | 类型     | 描述                               |
| ---------- | -------- | ---------------------------------- |
| `url`      | `String` | 字幕地址                           |
| `type`     | `String` | 字幕类型，可选 `vtt`, `srt`, `ass` |
| `style`    | `Object` | 字幕样式                           |
| `encoding` | `String` | 字幕编码，默认 `utf-8`             |

<div className="run-code">▶ Run Code</div>

```js{4-12}
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

默认显示语言，目前支持：`en`, `zh-cn`, `zh-tw`, `cs`, `pl`, `es`, `fa`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

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

:::warning i18n 写法参考

[artplayer/types/i18n.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/i18n.d.ts)

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
    container: '.artplayer-app',gb
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