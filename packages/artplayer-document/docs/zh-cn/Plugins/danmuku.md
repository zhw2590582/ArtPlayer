---
title: 弹幕库插件
sidebar_position: 1
---

## 演示

[查看完整演示](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-danmuku.js&example=danmuku)

## 安装

### 通过 `npm` 安装：

```bash
$ npm install artplayer-plugin-danmuku
```

### 通过 `yarn` 安装：

```bash
$ yarn add artplayer-plugin-danmuku
```

```js
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
```

### 通过 `script` 安装：

```html
<script src="path/to/artplayer-plugin-danmuku.js"></script>
```

然后你可以通过 `window.artplayerPluginDanmuku` 访问到插件函数

## 使用

### 使用弹幕数组

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    setting: true,
    playbackRate: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginDanmuku({
            // 弹幕数组
            danmuku: [
                {
                    text: '111', // 弹幕文本
                    time: 1, // 发送时间，单位秒
                    color: '#fff', // 弹幕局部颜色
                    border: false, // 是否显示描边
                    mode: 0, // 弹幕模式: 0表示滚动、1静止
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
            speed: 5, // 全局持续时间
            opacity: 1, // 全局透明度
            color: '#fff', // 全局字体颜色
            size: 25, // 全局字体大小
            maxlength: 50, // 全局最大长度
            margin: [10, 20], // 距离顶部和距离底部的高度值
            synchronousPlayback: false, // 是否同步到播放速度
        }),
    ],
});
```

### 使用弹幕 XML

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

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

### 使用异步调用

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

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

## 接口

### hide/show

-   类型: `Function`

通过方法 `hide` 和 `show` 进行隐藏或者显示弹幕

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

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

### isHide

-   类型: `Boolean`

通过属性 `isHide` 判断当前弹幕是隐藏或者显示

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

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

### emit

-   类型: `Function`

通过方法 `emit` 发送一条实时弹幕

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

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

### config

-   类型: `Function`

通过方法 `config` 实时改变弹幕配置，支持属性有：`speed`、`maxlength`、`margin`、`opacity`、`fontSize`、`synchronousPlayback`

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

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
