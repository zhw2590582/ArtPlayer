# Basic Options

## `container`

-   Type: `String, Element`
-   Default: `#artplayer`

The `DOM` container where the player is mounted.

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    container: '.artplayer-app', 
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

You may need to initialize the size of the container element, for example:

```css{2-3}
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

Or use `aspect-ratio`:

```css{2}
.artplayer-app {
    aspect-ratio: 16/9;
}
```

:::warning Note

Among all options, only `container` is required.

:::

## `url`

-   Type: `String`
-   Default: `''`

The video source URL.

<div className="run-code">▶ Run Code</div>

```js{3}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

Sometimes the `url` is not known immediately; in such cases, you can set the `url` asynchronously.

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
});

setTimeout(() => {
    art.url = '/assets/sample/video.mp4';
}, 1000);
```

:::warning Note

By default, three video file formats are supported: `.mp4`, `.ogg`, `.webm`.

To play other formats like `.m3u8` or `.flv`, please refer to the `Third-party Libraries` section on the left.

:::

## `id`

-   Type: `String`
-   Default: `''`

The unique identifier for the player, currently only used for playback resumption `autoplayback`.

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

The constructor accepts a function as the second parameter, which is triggered when the player is successfully initialized and the video is ready to play, similar to the `ready` event.

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

:::warning Note

Inside the callback function, `this` refers to the player instance. However, if an arrow function is used for the callback, `this` will not point to the player instance.

:::

## `poster`

-   Type: `String`
-   Default: `''`

The video poster image, which only appears when the player is initialized and not yet playing.

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

The player's theme color, currently used for the `progress bar` and `highlighted elements`.

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

The default volume of the player.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::warning Note

The player caches the last volume level; upon next initialization (e.g., page refresh), the player will read this cached value.

:::

## `isLive`

-   Type: `Boolean`
-   Default: `false`

Enable live streaming mode, which hides the progress bar and playback time.

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

Whether to mute by default.

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

Whether to autoplay.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
    muted: true,
});
```

:::warning Note

If you want the video to autoplay immediately upon page load, `muted` must be set to `true`. For more information, please read [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes).

:::

## `autoSize`

-   Type: `Boolean`
-   Default: `false`

By default, the player's dimensions fill the entire `container` size, often resulting in black bars. This option automatically adjusts the player size to hide the black bars, similar to `object-fit: cover;` in CSS.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});

## `autoMini`

-   Type: `Boolean`
-   Default: `false`

Automatically enters `mini player` mode when the player scrolls out of the browser viewport.

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

Whether to enable video looping.

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

Whether to display the video flip functionality. Currently appears in the `Settings Panel` and `Context Menu`.

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

Whether to display the video playback rate functionality. Appears in the `Settings Panel` and `Context Menu`.

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

Whether to display the video aspect ratio functionality. Appears in the `Settings Panel` and `Context Menu`.

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

Whether to display the `Video Screenshot` functionality in the bottom control bar.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});
```

:::warning Note

Due to browser security mechanisms, screenshot capture may fail if the video source URL is cross-origin with the website.

:::

## `setting`

-   Type: `Boolean`
-   Default: `false`

Whether to display the toggle button for the `Settings Panel` in the bottom control bar.

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

Whether to enable hotkeys.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    hotkey: true,
});
```

| Hotkey  | Description          |
| ------- | -------------------- |
| `↑`     | Increase volume      |
| `↓`     | Decrease volume      |
| `←`     | Seek forward         |
| `→`     | Seek backward        |
| `space` | Toggle play/pause    |

:::warning Note

These hotkeys only take effect after the player gains focus (e.g., by clicking on the player).

:::

## `pip`

-   Type: `Boolean`
-   Default: `false`

Whether to display the `Picture-in-Picture` toggle button in the bottom control bar.

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

If multiple players exist simultaneously on the page, whether only one player is allowed to play at a time.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    mutex: true,
});
```

## `backdrop`

-   Type: `Boolean`
-   Default: `true`

Whether to enable the backdrop blur effect for the player UI. When enabled, overlays such as the settings panel, context menu, and volume bar will apply a `backdrop-filter` frosted glass effect for a more transparent appearance. However, this may cause performance or compatibility issues on some low-performance devices or older browsers.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    backdrop: false, // Disable frosted glass effect
});
```

## `fullscreen`

-   Type: `Boolean`
-   Default: `false`

Whether to display the player `Window Fullscreen` button in the bottom control bar.

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

Whether to display the player `Webpage Fullscreen` button in the bottom control bar.

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

Subtitle timing offset, range within `[-5s, 5s]`. Appears in the `Settings Panel`.

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

## `miniProgressBar`

-   Type: `Boolean`
-   Default: `false`

Mini progress bar that appears only when the player loses focus and is playing.

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

Whether to use SSR mount mode. Useful if you want to pre-render the player's required HTML before mounting.

You can access the player's required HTML via `Artplayer.html`.

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

Whether to use `playsInline` mode on mobile devices.

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

Initialize custom layers.

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

:::warning For `Component Configuration`, please refer to:

[/component/layers.html](/component/layers.html)

:::

## `settings`

-   Type: `Array`
-   Default: `[]`

Initialize custom settings panel.

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

:::warning For `Settings Panel`, please refer to:

[/component/setting.html](/component/setting.html)

:::

## `contextmenu`

-   Type: `Array`
-   Default: `[]`

Initialize custom context menu.

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

:::warning For `Component Configuration`, please refer to:

[/component/contextmenu.html](/component/contextmenu.html)

:::

## `controls`

-   Type: `Array`
-   Default: `[]`

Initialize custom bottom control bar.

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

:::warning For `Component Configuration`, please refer to:

[/component/controls.html](/component/controls.html)

:::

## `quality`

-   Type: `Array`
-   Default: `[]`

Whether to display the `Quality Selection` list in the bottom control bar.

| Property  | Type      | Description      |
| --------- | --------- | ---------------- |
| `default` | `Boolean` | Default quality  |
| `html`    | `String`  | Quality name     |
| `url`     | `String`  | Quality URL      |

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

Display `Highlight Information` on the progress bar.

| Property | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| `time`   | `Number` | Highlight time (in seconds)    |
| `text`   | `String` | Highlight text                 |

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

Initialize custom `plugins`.

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

Set `Preview Thumbnails` on the progress bar.

| Property | Type     | Description                |
| -------- | -------- | -------------------------- |
| `url`    | `String` | Thumbnail image URL        |
| `number` | `Number` | Number of thumbnails       |
| `column` | `Number` | Number of thumbnail columns|
| `width`  | `Number` | Thumbnail width            |
| `height` | `Number` | Thumbnail height           |
| `scale`  | `Number` | Thumbnail scale            |

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

:::warning Generate Thumbnails Online

[artplayer-tool-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=thumbnail)

:::

## `subtitle`

-   Type: `Object`
-   Default: `{}`

Set the video subtitle. Supported subtitle formats: `vtt`, `srt`, `ass`.

| Property    | Type       | Description                                      |
| ----------- | ---------- | ------------------------------------------------ |
| `name`      | `String`   | Subtitle name                                    |
| `url`       | `String`   | Subtitle URL                                     |
| `type`      | `String`   | Subtitle type, options: `vtt`, `srt`, `ass`      |
| `style`     | `Object`   | Subtitle style                                   |
| `encoding`  | `String`   | Subtitle encoding, default: `utf-8`              |
| `escape`    | `Boolean`  | Whether to escape `html` tags, default: `true`   |
| `onVttLoad` | `Function` | Function for modifying `vtt` text                |

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
-   Default: `{'controls': false, 'preload': 'metadata'}` (In Safari, it automatically adjusts to `preload: 'auto'` for better loading experience).

More video attributes. These attributes will be directly written into the video element.

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

## `icons`

-   Type: `Object`
-   Default: `{}`

Used to replace default icons, supports both `Html` strings and `HTMLElement`.

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

:::warning All Icon Definitions

[artplayer/types/icons.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/icons.d.ts)

:::

## `type`

-   Type: `String`
-   Default: `''`

Used to specify the video format. It needs to be used in conjunction with `customType`. By default, the video format is determined by the suffix of the video URL (e.g., `.m3u8`, `.mkv`, `.ts`). However, sometimes the video URL lacks the correct suffix, so explicit specification is necessary.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.m3u8',
    type: 'm3u8',
});
```

:::warning Suffix Recognition

The player can only parse suffixes like this: `/assets/sample/video.m3u8`

But cannot parse suffixes like this: `/assets/sample/video?type=m3u8`

Therefore, if you use `customType`, it is best to also specify the `type`.

:::

## `customType`

-   Type: `Object`
-   Default: `{}`

Matches based on the video's `type` and delegates video decoding to third-party programs. The handler function receives three parameters:

- `video`: The video `DOM` element
- `url`: The video URL
- `art`: The current instance

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

The default display language. Currently supported: `en`, `zh-cn`.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

:::warning More Language Settings

[/start/i18n.html](/start/i18n.html)

:::

## `i18n`

-   Type: `Object`
-   Default: `{}`

Custom `i18n` configuration. This configuration will be deeply merged with the built-in `i18n`.

Add your language:

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

Modify an existing language:

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

:::warning More Language Settings

[/start/i18n.html](/start/i18n.html)

:::

## `lock`

-   Type: `Boolean`
-   Default: `false`

Whether to display a `lock button` on mobile devices to hide the bottom `control bar`.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});
```

## `gesture`

-   Type: `Boolean`
-   Default: `true`

Whether to enable gesture events on the video element on mobile devices.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    gesture: false,
});
```

## `fastForward`

-   Type: `Boolean`
-   Default: `false`

Whether to add a long-press video fast-forward feature on mobile devices.

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

Whether to use the automatic `playback feature`.

<div className="run-code">▶ Run Code</div>

```js{4-5}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    id: 'your-url-id',
    autoPlayback: true,
});
```

:::warning Note

By default, the player uses the `url` as the `key` to cache the playback progress.

However, if the same video has different `url`s, you need to use the `id` to identify the unique `key` for the video.

:::

## `autoOrientation`

-   Type: `Boolean`
-   Default: `false`

Whether to rotate the player during fullscreen mode on mobile web, based on the video dimensions and viewport size.

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

Whether to display the `airplay` button. Currently, only some browsers support this feature.

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

Used to modify built-in CSS variables.

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

:::warning CSS Variable Reference

[artplayer/types/cssVar.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/cssVar.d.ts)

:::

## `proxy`

-   Type: `function`
-   Default: `undefined`

The function can return a third-party `HTMLCanvasElement` or `HTMLVideoElement`. For example, it can proxy an existing `video` DOM element.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    proxy: () => document.createElement('video')
});