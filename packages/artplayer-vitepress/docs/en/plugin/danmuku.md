# Danmaku Library

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

## Danmaku Structure

Each danmaku is an object, and an array of multiple danmaku objects forms the danmaku library. Typically, only `text` is required to send a danmaku, while the rest are optional parameters.

```js
{
    text: '', // Danmaku text
    time: 10, // Danmaku timestamp, defaults to current player time
    mode: 0, // Danmaku mode: 0: scroll (default), 1: top, 2: bottom
    color: '#FFFFFF', // Danmaku color, defaults to white
    border: false, // Whether the danmaku has a border, defaults to false
    style: {}, // Custom danmaku styles, defaults to an empty object
}
```

## All Options

Only `danmuku` is a required parameter; all others are optional.

```js
{
    danmuku: [], // Danmaku data
    speed: 5, // Danmaku duration, range [1 ~ 10]
    margin: [10, '25%'], // Danmaku top and bottom margins, supports pixel values and percentages
    opacity: 1, // Danmaku opacity, range [0 ~ 1]
    color: '#FFFFFF', // Default danmaku color, can be overridden by individual danmaku items
    mode: 0, // Default danmaku mode: 0: scroll, 1: top, 2: bottom
    modes: [0, 1, 2], // Visible danmaku modes
    fontSize: 25, // Danmaku font size, supports pixel values and percentages
    antiOverlap: true, // Whether to prevent danmaku overlap
    synchronousPlayback: false, // Whether to synchronize playback speed
    mount: undefined, // Danmaku emitter mount point, defaults to the middle of the player control bar
    heatmap: false, // Whether to enable the heatmap
    width: 512, // When the player width is less than this value, the danmaku emitter is placed at the bottom of the player
    points: [], // Heatmap data
    filter: () => true, // Filter before danmaku loading, only supports boolean return values
    beforeEmit: () => true, // Filter before danmaku emission, supports Promise return
    beforeVisible: () => true, // Filter before danmaku display, supports Promise return
    visible: true, // Whether the danmaku layer is visible
    emitter: true, // Whether to enable the danmaku emitter
    maxLength: 200, // Maximum input length for the danmaku input box, range [1 ~ 1000]
    lockTime: 5, // Input box lock time, range [1 ~ 60]
    theme: 'dark', // Danmaku theme, supports 'dark' and 'light', only effective when custom mounted
    OPACITY: {}, // Opacity configuration
    FONT_SIZE: {}, // Font size configuration
    MARGIN: {}, // Display area configuration
    SPEED: {}, // Danmaku speed configuration
    COLOR: [], // Color list configuration
}
```

## Lifecycle

For user-input danmaku:

`beforeEmit -> filter -> beforeVisible -> artplayerPluginDanmuku:visible`

For server-side danmaku:

`filter -> beforeVisible -> artplayerPluginDanmuku:visible`

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
// Save to database
function saveDanmu(danmu) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    })
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',

            // This function is triggered when the user enters danmaku text in the input box and clicks the send button
            // You can perform validation on the danmaku or save it to the database
            // The danmaku is added to the queue only when true is returned
            async beforeEmit(danmu) {
               const isDirty = (/fuck/i).test(danmu.text);
               if (isDirty) return false;
               const state = await saveDanmu(danmu);
               return state;
            },

            // This is a filter for all danmaku, including those from the server and user input
            // You can perform validation on the danmaku
            // The danmaku is added to the queue only when true is returned
            filter(danmu) {
                return danmu.text.length <= 200;
            },

            // This function is triggered when the danmaku is about to be displayed
            // You can perform validation on the danmaku
            // The danmaku is sent to the player only when true is returned
            async beforeVisible(danmu) {
               return true;
            },
        }),
    ],
});

// The danmaku has appeared in the player, and you can access its DOM element
art.on('artplayerPluginDanmuku:visible', danmu => {
    danmu.$ref.innerHTML = 'ଘ(੭ˊᵕˋ)੭: ' + danmu.$ref.innerHTML;
})
```

## Using Danmaku Array

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: [
                {
                    text: 'Using array',
                    time: 1
                },
            ],
        }),
    ],
});

## Using Danmaku XML

The danmaku XML file follows the same format as Bilibili's danmaku system

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
});
```

## Using Asynchronous Returns

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: function () {
                return new Promise((resovle) => {
                    return resovle([
                        {
                            text: 'Using Promise for asynchronous return',
                            time: 1
                        },
                    ]);
                });
            },
        }),
    ],
});
```

## `hide/show`

Use the `hide` and `show` methods to hide or display danmaku

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
            html: 'Hide Danmaku',
            click: function () {
                art.plugins.artplayerPluginDanmuku.hide();
            },
        },
        {
            position: 'right',
            html: 'Show Danmaku',
            click: function () {
                art.plugins.artplayerPluginDanmuku.show();
            },
        },
    ],
});
```

## `isHide`

Use the `isHide` property to determine if danmaku is currently hidden or displayed

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
            html: 'Hide Danmaku',
            click: function (_, event) {
                if (art.plugins.artplayerPluginDanmuku.isHide) {
                    art.plugins.artplayerPluginDanmuku.show();
                    event.target.innerText = 'Hide Danmaku';
                } else {
                    art.plugins.artplayerPluginDanmuku.hide();
                    event.target.innerText = 'Show Danmaku';
                }
            },
        },
    ],
});
```

## `emit`

Use the `emit` method to send a real-time danmaku

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
                var text = prompt('Please enter danmaku text', 'Danmaku test text');
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

Use the `config` method to dynamically change danmaku settings

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
            html: 'Danmaku Size：<input type="range" min="12" max="50" step="1" value="25">',
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

## `load`

The `load` method can be used to reload the current danmaku library, switch to a new danmaku library, or append a new danmaku library.

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
            emitter: false,
        }),
    ],
    controls: [
        {
            position: 'right',
            html: 'Reload',
            click: function () {
                // Reload the current danmaku library
                art.plugins.artplayerPluginDanmuku.load();
            },
        },
        {
            position: 'right',
            html: 'Switch',
            click: function () {
                // Switch to a new danmaku library
                art.plugins.artplayerPluginDanmuku.config({
                    danmuku: '/assets/sample/danmuku-v2.xml',
                });
                art.plugins.artplayerPluginDanmuku.load();
            },
        },
        {
            position: 'right',
            html: 'Append',
            click: function () {
                // Append a new danmaku library (parameter type is the same as option.danmuku)
                const target = '/assets/sample/danmuku.xml'
                art.plugins.artplayerPluginDanmuku.load(target);
            },
        },
    ],
});
```

## `reset`

Used to clear the currently displayed danmaku.

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
});

art.on('resize', () => {
    art.plugins.artplayerPluginDanmuku.reset();
});
```

## `mount`

When initializing the danmaku plugin, you can specify the mount position for the danmaku emitter. By default, it is mounted in the center of the control bar. You can also mount it outside the player.

When the player enters fullscreen mode, the emitter will automatically return to the center of the control bar. If the mounted location has a light background, it is recommended to set `theme` to `light` to ensure visibility.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var $danmu = document.querySelector('.artplayer-app');

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
    plugins: [
        artplayerPluginDanmuku({
			mount: $danmu,
            theme: 'dark',
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

// Can also be mounted manually
// art.plugins.artplayerPluginDanmuku.mount($danmu);
```

## `option`

Used to get the current danmaku configuration.

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
});

art.on('ready', () => {
    console.info(art.plugins.artplayerPluginDanmuku.option);
});
```

## Events

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
});

art.on('artplayerPluginDanmuku:visible', (danmu) => {
    console.info('Danmaku visible', danmu);
});

art.on('artplayerPluginDanmuku:loaded', (danmus) => {
    console.info('Danmaku loaded', danmus.length);
});

art.on('artplayerPluginDanmuku:error', (error) => {
    console.info('Load error', error);
});

art.on('artplayerPluginDanmuku:config', (option) => {
    console.info('Configuration changed', option);
});

art.on('artplayerPluginDanmuku:stop', () => {
    console.info('Danmaku stopped');
});

art.on('artplayerPluginDanmuku:start', () => {
    console.info('Danmaku started');
});

art.on('artplayerPluginDanmuku:hide', () => {
    console.info('Danmaku hidden');
});

art.on('artplayerPluginDanmuku:show', () => {
    console.info('Danmaku shown');
});

art.on('artplayerPluginDanmuku:reset', () => {
    console.info('Danmaku reset');
});

art.on('artplayerPluginDanmuku:destroy', () => {
    console.info('Danmaku destroyed');
});