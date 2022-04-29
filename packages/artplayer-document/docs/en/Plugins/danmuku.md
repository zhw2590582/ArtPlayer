---
title: Danmuku plugin
sidebar_position: 1
---

## Demo

👉 [View full demo](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)

## Install

### Install by `npm`:

```bash
$ npm install artplayer-plugin-danmuku
```

### Install by `yarn`:

```bash
$ yarn add artplayer-plugin-danmuku
```

```js
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
```

### Install by `script`:

```html
<script src="path/to/artplayer-plugin-danmuku.js"></script>
```

Then you can access the plugin function via `window.artplayerPluginDanmuku`

## Use

### Use the damuku array

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
            // Damuku array
            danmuku: [
                {
                    text: '111', // Danmu text
                    time: 1, // Video time
                    color: '#fff', // Danmu color
                    border: false, // Danmu border
                    mode: 0, // Danmu mode: 0-scroll or 1-static
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
            speed: 5, // Animation time
            opacity: 1, // Opacity
            color: '#fff', // Font color
            size: 25, // Font size
            maxlength: 50, // The maximum number of words in the danmu
            margin: [10, 20], // Margin top and margin bottom
            synchronousPlayback: false, // Synchronous playback speed
        }),
    ],
});
```

### Use the XML

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            // Damuku xml，like the Bilibili danmuku format
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});
```

### Use asynchronous calls

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku.js">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            // Use promise to return asynchronous
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

## Interface

### hide/show

-   Type: `Function`

Hidden or show the danmuku by methods `hide` and `show`

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
            html: 'Hide',
            click: function () {
                art.plugins.artplayerPluginDanmuku.hide();
            },
        },
        {
            position: 'right',
            html: 'Show',
            click: function () {
                art.plugins.artplayerPluginDanmuku.show();
            },
        },
    ],
});
```

### isHide

-   Type: `Boolean`

By attribute `ishide` judgment the current danmuku is hidden or displayed

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
            html: 'Hide',
            click: function (_, event) {
                if (art.plugins.artplayerPluginDanmuku.isHide) {
                    art.plugins.artplayerPluginDanmuku.show();
                    event.target.innerText = 'Hide';
                } else {
                    art.plugins.artplayerPluginDanmuku.hide();
                    event.target.innerText = 'Show';
                }
            },
        },
    ],
});
```

### emit

-   Type: `Function`

Send a real-time danmu by method `emit`

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
            html: 'Send',
            click: function () {
                var text = prompt('Input the danmu text', 'danmu text');
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

-   Type: `Function`

Changing the danmu configuration in real time through method `config`, support attributes: `speed`, `maxlength`, `margin`, `opacity`, `fontSize`, `synchronousPlayback`

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
            html: 'Size：<input type="range" min="12" max="50" step="1" value="25">',
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
