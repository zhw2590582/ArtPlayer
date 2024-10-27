# Basic Options

## `container`

- Type: `String, Element`
- Default: `#artplayer`

The `DOM` container where the player mounts

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    container: '.artplayer-app', 
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

You may need to initialize the size of the container element, like:

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

:::warning Tip

Among all options, only `container` is mandatory.

:::
## `url`

- Type: `String`
- Default: `''`

The video source address

<div className="run-code">▶ Run Code</div>

```js{3}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

Sometimes the `url` is not known so quickly, in which case you can set the `url` asynchronously.

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

The default support is for three video file formats: `.mp4`, `.ogg`, `.webm`.

If you need to play other formats such as `.m3u8` or `.flv`, please refer to the `Third-party Libraries` on the left side.

:::
## `id`

- Type: `String`
- Default: `''`

The unique identifier of the player, currently used only for remembering playback with `autoplayback`

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    id: 'your-url-id',
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## `onReady`

- Type: `Function`
- Default: `undefined`

The constructor accepts a function as the second argument, which is triggered when the player is successfully initialized and the video is ready to play, similar to the `ready` event

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

:::warning Warning

The `this` inside the callback function refers to the player instance, but if an arrow function is used for the callback, `this` will not point to the player instance.

:::

## `poster`

-   Type: `String`
-   Default: `''`

The poster of the video, which only appears when the player is initialized and before it starts playing.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});
```
## `theme`

- Type: `String`
- Default: `#f00`

Player theme color, currently used for `progress bar` and `highlight elements`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    theme: '#ffad00',
});
```

## `volume`

- Type: `Number`
- Default: `0.7`

The default volume of the player

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::warning Warning

The player will cache the size of the last volume. When the player is initialized next time (such as refreshing the page), it will read this cached value.

:::
## `isLive`

-   Type: `Boolean`
-   Default: `false`

Use live mode, which will hide the progress bar and playback time

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
- Default: `false`

Autoplay

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
    muted: true,
});
```

:::warning Warning

If you want the video to autoplay by default upon entering the page, `muted` must be set to `true`. For more information, please read [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

:::

## `autoSize`

- Type: `Boolean`
- Default: `false`

The size of the player will by default fill the entire `container`, which often results in black bars. This value can automatically adjust the player size to hide the black bars, similar to `css`'s `object-fit: cover;`

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

Automatically enter `mini mode` when the player scrolls out of the browser viewport

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

Whether to loop the video

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    loop: true,
});
```

## `flip`

- Type: `Boolean`
- Default: `false`

Whether to show the video flip feature, currently only available in `Settings Panel` and `Context Menu`

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

- Type: `Boolean`
- Default: `false`

Whether to show the playback speed feature of the video, it will appear in `Settings Panel` and `Context Menu`

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

Displays the video aspect ratio feature, it will appear in the `Settings Panel` and `Context Menu`

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

Whether to show the screenshot button, it will appear in the `toolbar` and `context menu`
Display `Screenshot` function in the bottom control bar

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});
```

:::warning Warning

Due to browser security mechanisms, if the video source address and the website are cross-origin, screenshot failure may occur

:::

## `setting`

- Type: `Boolean`
- Default: `false`

Display the toggle button for the `Settings Panel` in the bottom control bar

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});
```
## `hotkey`

- Type: `Boolean`
- Default: `true`

Whether to use hotkeys

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    hotkey: true,
});
```

| Hotkey  | Description        |
| ------- | ------------------ |
| `↑`     | Increase volume    |
| `↓`     | Decrease volume    |
| `←`     | Fast forward video |
| `→`     | Rewind video       |
| `space` | Toggle play/pause  |

:::warning Tip

These hotkeys will only work after the player gains focus (such as after clicking on the player).

:::

## `pip`

- Type: `Boolean`
- Default: `false`
Show the `Picture in Picture` switch button on the bottom control bar

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

If there are multiple players on the page, should only one player be allowed to play at a time

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
Display the `Window Fullscreen` button on the control bar at the bottom

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

Display the `Web Fullscreen` button on the control bar at the bottom

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

Subtitle time offset, the range is `[-5s, 5s]`, appearing in the `Settings panel`

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

Whether to use `SSR` (Server-Side Rendering) mount mode, useful if you want to pre-render the player's required `HTML` before the player mounts

You can access the player's required `HTML` through `Artplayer.html`

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

Whether to use `playsInline` mode on mobile devices

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

Initializes custom `layers`

<div className="run-code">▶ Run Code</div>

```js{5-23}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'poster',
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
:::warning `Component Configuration` Please refer to the following address:

[/component/layers.html](/component/layers.html)

:::

## `settings`

-   Type: `Array`
-   Default: `[]`

Initializes custom `settings panel`

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
:::warning `Settings Panel` Please refer to the following address

[/component/setting.html](/component/setting.html)

:::

## `contextmenu`

-   Type: `Array`
-   Default: `[]`

Initialize custom `context menu`

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
:::warning `Component Configuration` Please refer to the following address:

[/component/contextmenu.html](/component/contextmenu.html)-   Type:

:::

## `controls`

-   Type: `Array`
-   Default: `[]`

Initializes custom bottom `control bar`

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
:::warning `Component Configuration` Refer to the following address:

[/component/controls.html](/component/controls.html)

:::

## `quality`

-   Type: `Array`
-   Default: `[]`

Whether to show the `quality selection` list in the bottom control bar

| Property  | Type      | Description     |
| --------- | --------- | --------------- |
| `default` | `Boolean` | Default quality |
| `html`    | `String`  | Quality name    |
| `url`     | `String`  | Quality URL     |

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

- Type: `Array`
- Default: `[]`

Show `highlight information` on the progress bar

| Property | Type     | Description                 |
| -------- | -------- | --------------------------- |
| `time`   | `Number` | Highlight time (in seconds) |
| `text`   | `String` | Highlight text              |

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

Initialize custom `plugins`

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

Set `thumbnails` on the progress bar

| Property | Type     | Description           |
| -------- | -------- | --------------------- |
| `url`    | `String` | Thumbnail URL         |
| `number` | `Number` | Number of thumbnails  |
| `column` | `Number` | Columns of thumbnails |
| `width`  | `Number` | Thumbnail width       |
| `height` | `Number` | Thumbnail height      |
| `scale`  | `Number` | Thumbnail scale       |

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
:::warning Online thumbnail generation

[artplayer-tool-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=thumbnail)

:::

## `subtitle`

-   Type: `Object`
-   Default: `{}`

Set the video subtitles, supporting subtitle formats: `vtt`, `srt`, `ass`

| Property    | Type       | Description                                   |
| ----------- | ---------- | --------------------------------------------- |
| `name`      | `String`   | Subtitle name                                 |
| `url`       | `String`   | Subtitle URL                                  |
| `type`      | `String`   | Subtitle type, options: `vtt`, `srt`, `ass`   |
| `style`     | `Object`   | Subtitle style                                |
| `encoding`  | `String`   | Subtitle encoding, default `utf-8`            |
| `escape`    | `Boolean`  | Whether to escape `html` tags, default `true` |
| `onVttLoad` | `Function` | Function to modify `vtt` text                 |

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
-   Default: `{'controls': false, 'preload': 'metadata'}`

Additional video attributes, these attributes will be directly written into the video element

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

Used to replace default icons, supports `Html` strings and `HTMLElement`

<div className="run-code">▶ Run Code</div>

```js{4-7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    icons: {
        loading: '<img src="/assets/img/loading.gif">',
        state: '<img src="/assets/img/state.png">',
    },
});
```
:::warning Definition of all icons

[artplayer/types/icons.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/icons.d.ts)

:::

## `type`

-   Type: `String`
-   Default: `''`

Used to specify the format of the video, which is used in conjunction with `customType`. By default, the video format is the same as the file extension of the video URL (such as `.m3u8`, `.mkv`, `.ts`). However, sometimes the video URL does not have the correct file extension, so it needs to be specifically stated.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.m3u8',
    type: 'm3u8',
});
```

:::warning Recognition of file extensions

The player can only parse this type of file extension: `/assets/sample/video.m3u8`

But it cannot parse this type of file extension: `/assets/sample/video?type=m3u8`

Therefore, if you use `customType`, it is best to specify `type` as well

:::
## `customType`

-   Type: `Object`
-   Default: `{}`

Matches the video's `type` to delegate the video decoding to a third-party program for processing. The processing function can receive three parameters:

- `video`: Video `DOM` element
- `url`: Video address
- `art`: Current instance

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

Default display language, currently supports: `en`, `zh-cn`
<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

:::warning More language settings

[/start/i18n.html](/start/i18n.html)

:::

## `i18n`

-   Type: `Object`
-   Default: `{}`

Custom `i18n` configuration, which will be deeply merged with the built-in `i18n`

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
Modifying the existing language

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

:::warning More language settings

[/start/i18n.html](/start/i18n.html)

:::

## `lock`

-   Type: `Boolean`
-   Default: `false`

Whether to display a `lock button` on mobile to hide the bottom `control bar`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});
```

## `fastForward`

- Type: `Boolean`
- Default: `false`

Whether to add fast forward function by long pressing on the video on mobile devices

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fastForward: true,
});
```

## `autoPlayback`

- Type: `Boolean`
- Default: `false`

Whether to use the automatic playback feature

<div className="run-code">▶ Run Code</div>

```js{4-5}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    id: 'your-url-id',
    autoPlayback: true,
});
```
:::warning Warning

Because the player by default uses `url` as the `key` to cache the playback progress

But if the `url` of the same video is different, then you need to use `id` to identify the unique `key` of the video

:::

## `autoOrientation`

- Type: `Boolean`
- Default: `false`

Whether to rotate the player on mobile web pages in full screen according to the video size and the viewport dimensions

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoOrientation: true,
});
```

## `airplay`

- Type: `Boolean`
- Default: `false`

Whether to display the `airplay` button, currently only some browsers support this feature

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

Used to change built-in CSS variables

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

:::warning Reference for cssVar syntax

[artplayer/types/cssVar.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/cssVar.d.ts)

:::

## `proxy`

-   Type: `function`
-   Default: `undefined`

The function can return a third-party `HTMLCanvasElement` or `HTMLVideoElement`, for example, it can proxy an existing `video` DOM element

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    proxy: () => document.createElement('video')
});
```