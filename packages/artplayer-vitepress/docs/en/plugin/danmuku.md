# Danmuku Library

## Demo

👉 [View Full Demo](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)

## Installation

::: code-group

```bash [npm]
npm install artplayer-plugin-danmuku
```

```bash [yarn]
yarn add artplayer-plugin-danmuku
```

```bash [pnpm]
pnpm add artplayer-plugin-danmuku
```

```html [script]
<script src="path/to/artplayer-plugin-danmuku.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

:::

## Option

```js
{
    danmuku: [], // 弹幕库，支持数组, xml 地址, Promise返回数组
    speed: 5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
    opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
    fontSize: 25, // 字体大小，支持数字和百分比
    color: '#FFFFFF', // 默认字体颜色
    mode: 0, // 默认模式，0-滚动，1-静止
    margin: [10, '25%'], // 弹幕上下边距，支持数字和百分比
    antiOverlap: true, // 是否防重叠
    useWorker: true, // 是否使用 web worker
    synchronousPlayback: false, // 是否同步到播放速度
    filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数，返回 true 则可以发送
    lockTime: 5, // 输入框锁定时间，单位秒，范围在[1 ~ 60]
    maxLength: 100, // 输入框最大可输入的字数，范围在[0 ~ 500]
    minWidth: 200, // 输入框最小宽度，范围在[0 ~ 500]，填 0 则为无限制
    maxWidth: 400, // 输入框最大宽度，范围在[0 ~ Infinity]，填 0 则为 100% 宽度
    theme: 'dark', // 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
    heatmap: true, // 是否开启弹幕热度图, 默认为 false
    beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送
    // 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部，仅在当宽度小于最小值时生效
    mount: document.querySelector('.artplayer-danmuku'),
}
```

## Using Danmuku Array

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    plugins: [
        artplayerPluginDanmuku({
            // Danmuku array
            danmuku: [
                {
                    text: '111', // Danmuku text
                    time: 1, // Send time, in seconds
                    color: '#fff', // Danmuku local color
                    border: false, // Whether to display outline
                    mode: 0, // Danmuku mode: 0 for scrolling, 1 for stationary
                },
                {
                    text: '222',
                    time: 2,
                    color: 'red',
                    border: true,
                    mode: 0,
                },
                {
                    text: '333',
                    time: 3,
                    color: 'green',
                    border: false,
                    mode: 1,
                },
            ],
        }),
    ],
});
```

## Using Danmuku XML

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            // Danmuku XML file, consistent with the danmuku format of the Bilibili website
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});
```

## Using Asynchronous Call

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            // Use Promise to return asynchronously
            danmuku: function () {
                return new Promise((resolve) => {
                    return resolve([
                        {
                            text: '111',
                            time: 1,
                        },
                        {
                            text: '222',
                            time: 2,
                        },
                        {
                            text: '333',
                            time: 3,
                        },
                    ]);
                });
            },
        }),
    ],
});
```

## `hide/show`

Hide or show the bullet comments with the methods `hide` and `show`.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: 'Hide Danmuku',
            click: function () {
                art.plugins.artplayerPluginDanmuku.hide();
            },
        },
        {
            position: 'right',
            html: 'Show Danmuku',
            click: function () {
                art.plugins.artplayerPluginDanmuku.show();
            },
        },
    ],
});
```
## `isHide`

Judge whether the current barrage is hidden or displayed with the `isHide` property.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: 'Hide Barrage',
            click: function (_, event) {
                if (art.plugins.artplayerPluginDanmuku.isHide) {
                    art.plugins.artplayerPluginDanmuku.show();
                    event.target.innerText = 'Hide Barrage';
                } else {
                    art.plugins.artplayerPluginDanmuku.hide();
                    event.target.innerText = 'Show Barrage';
                }
            },
        },
    ],
});
```

## `emit`

Send a real-time danmaku message through the `emit` method

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: 'Send Danmaku',
            click: function () {
                var text = prompt('Please enter the danmaku text', 'Danmaku test text');
                if (!text || !text.trim()) return;
                var color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                art.plugins.artplayerPluginDanmuku.emit({
                    text: text,
                    color: color,
                    border: true,
                });
            },
        },
    ],
});
```
## `config`

Change the barrage configuration in real-time with the `config` method, supported attributes include:

-   `danmuku`
-   `speed`
-   `opacity`
-   `fontSize`
-   `color`
-   `mode`
-   `margin`
-   `antiOverlap`
-   `synchronousPlayback`
-   `filter`
-   `lockTime`
-   `beforeEmit`

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: 'Danmaku size：<input type="range" min="12" max="50" step="1" value="25">',
            style: {
                display: 'flex',
                alignItems: 'center',
            },
            mounted: function ($setting) {
                const $range = $setting.querySelector('input[type=range]');
                $range.addEventListener('change', () => {
                    art.plugins.artplayerPluginDanmuku.config({
                        fontSize: Number($range.value),
                    });
                });
            },
        },
    ],
});
```
## `load`

The load method can be used to reload the danmu data source or switch to new danmu.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: 'Reload Danmu',
            click: function () {
                art.plugins.artplayerPluginDanmuku.load();
            },
        },
        {
            position: 'right',
            html: 'Switch Danmu',
            click: function () {
                art.plugins.artplayerPluginDanmuku.config({
                    danmuku: '/assets/sample/danmuku-v2.xml',
                });
                art.plugins.artplayerPluginDanmuku.load();
            },
        },
    ],
});
```
## `reset`

Used to clear the current displayed barrages

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('resize', () => {
    art.plugins.artplayerPluginDanmuku.reset();
});
```

## `option`

Used to get the current barrage configuration

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('ready', () => {
    console.info(art.plugins.artplayerPluginDanmuku.option);
});
```

## Event

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('artplayerPluginDanmuku:emit', (danmu) => {
    console.info('新增弹幕', danmu);
});

art.on('artplayerPluginDanmuku:loaded', (danmus) => {
    console.info('加载弹幕', danmus.length);
});

art.on('artplayerPluginDanmuku:error', (error) => {
    console.info('加载错误', error);
});

art.on('artplayerPluginDanmuku:config', (option) => {
    console.info('配置变化', option);
});

art.on('artplayerPluginDanmuku:stop', () => {
    console.info('弹幕停止');
});

art.on('artplayerPluginDanmuku:start', () => {
    console.info('弹幕开始');
});

art.on('artplayerPluginDanmuku:hide', () => {
    console.info('弹幕隐藏');
});

art.on('artplayerPluginDanmuku:show', () => {
    console.info('弹幕显示');
});

art.on('artplayerPluginDanmuku:destroy', () => {
    console.info('弹幕销毁');
});
```
