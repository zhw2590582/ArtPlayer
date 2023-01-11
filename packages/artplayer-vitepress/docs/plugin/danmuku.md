# 弹幕库

## 演示

👉 [查看完整演示](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)

## 安装

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

## 选项

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
    beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送
    // 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部，仅在当宽度小于最小值时生效
    mount: document.querySelector('.artplayer-danmuku'),
}
```

## 使用弹幕数组

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
            // 弹幕数组
            danmuku: [
                {
                    text: '111', // 弹幕文本
                    time: 1, // 发送时间，单位秒
                    color: '#fff', // 弹幕局部颜色
                    border: false, // 是否显示描边
                    mode: 0, // 弹幕模式: 0表示滚动, 1静止
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

## 使用弹幕 XML

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            // 弹幕 XML 文件，和 Bilibili 网站的弹幕格式一致
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});
```

## 使用异步调用

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            // 使用 Promise 异步返回
            danmuku: function () {
                return new Promise((resovle) => {
                    return resovle([
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

通过方法 `hide` 和 `show` 进行隐藏或者显示弹幕

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
            html: '隐藏弹幕',
            click: function () {
                art.plugins.artplayerPluginDanmuku.hide();
            },
        },
        {
            position: 'right',
            html: '显示弹幕',
            click: function () {
                art.plugins.artplayerPluginDanmuku.show();
            },
        },
    ],
});
```

## `isHide`

通过属性 `isHide` 判断当前弹幕是隐藏或者显示

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
            html: '隐藏弹幕',
            click: function (_, event) {
                if (art.plugins.artplayerPluginDanmuku.isHide) {
                    art.plugins.artplayerPluginDanmuku.show();
                    event.target.innerText = '隐藏弹幕';
                } else {
                    art.plugins.artplayerPluginDanmuku.hide();
                    event.target.innerText = '显示弹幕';
                }
            },
        },
    ],
});
```

## `emit`

通过方法 `emit` 发送一条实时弹幕

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
            html: '发送弹幕',
            click: function () {
                var text = prompt('请输入弹幕文本', '弹幕测试文本');
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

通过方法 `config` 实时改变弹幕配置，支持属性有：

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
            html: '弹幕大小：<input type="range" min="12" max="50" step="1" value="25">',
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

通过 load 方法可以重载弹幕源，或者切换新弹幕

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
            html: '重载弹幕',
            click: function () {
                art.plugins.artplayerPluginDanmuku.load();
            },
        },
        {
            position: 'right',
            html: '切换弹幕',
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

用于清空当前显示的弹幕

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

用于获取当前弹幕配置

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

## 事件

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
