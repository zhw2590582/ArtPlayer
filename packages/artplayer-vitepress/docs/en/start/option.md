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

Or use `aspect-ratio`：

```css{2}
.artplayer-app {
    aspect-ratio: 16/9;
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

Initialize the customized `Contextmenu`

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

:::warning Please refer to the following address for `Component`:

[/start/component.html](/start/component.html)

:::

## `controls`

-   Type: `Array`
-   Default: `[]`

Initialize the customized `Controls`

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

:::warning Please refer to the following address for `Setting`

[/start/setting.html](/start/setting.html)

:::

## `quality`

-   Type: `Array`
-   Default: `[]`

Whether to display the `Quality` list in the bottom control bar

| Property  | Type      | Describe        |
| --------- | --------- | --------------- |
| `default` | `Boolean` | Default quality |
| `html`    | `String`  | Quality name    |
| `url`     | `String`  | Quality name    |

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

Display `highlight` on the progress bar

| Property | Type     | Describe       |
| -------- | -------- | -------------- |
| `time`   | `Number` | Highlight time |
| `text`   | `String` | Highlight text |

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

Initialize customized `plugins`

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

Because different mobile devices have many differences and limitations, sometimes you want to use native functions directly instead of using this player on some mobile devices, you can use this option to control

The whitelist is an array type, which is matched with `window.navigator.userAgent` respectively. The player will be enabled as long as one of the matches is successful

Support `string` matching, `function` matching and `regular` matching

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    whitelist: [(ua) => /iPhone/gi.test(ua)],
    // whitelist: [/iPhone/gi],
    // whitelist: ['iPhone'],
});
```

:::warning Tip

If this option is not filled in, the player will be used by default

:::

## `thumbnails`

-   Type: `Object`
-   Default: `{}`

Set the thumbnails image on the progress bar

| Property | Type     | Describe         |
| -------- | -------- | ---------------- |
| `url`    | `String` | Thumbnail url    |
| `number` | `Number` | Thumbnail number |
| `column` | `Number` | Thumbnail column |
| `width`  | `Number` | Thumbnail width  |
| `height` | `Number` | Thumbnail height |

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

:::warning Generate preview thumbnails online

[artplayer-tool-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=thumbnail)

:::

## `subtitle`

-   Type: `Object`
-   Default: `{}`

Set the subtitle of the video and support the subtitle format: `vtt`, `srt`, `ass`

| Property   | Type      | Describe                                         |
| ---------- | --------- | ------------------------------------------------ |
| `url`      | `String`  | Subtitle url                                     |
| `type`     | `String`  | Subtitle type: `vtt`, `srt`, `ass`               |
| `style`    | `Object`  | Subtitle style                                   |
| `encoding` | `String`  | Subtitle code, Default: `utf-8`                  |
| `escape`   | `Boolean` | Whether to escape the `html` tag,Default: `true` |

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

More video attributes, which will be directly written into the video element

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

It is used to replace the default icon and supports `Html String` and `HTMLElement`

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

:::warning Definition of all icons

[artplayer/types/icons.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/icons.d.ts)

:::

## `type`

-   Type: `String`
-   Default: `''`

It is used to indicate the format of the video. It needs to be used together with the `customType`. The default format of the video is the suffix of the video address (such as `.m3u8`, `.mkv`, `.ts`). But sometimes the video address does not have the correct suffix, so it needs to be specially specified

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.m3u8',
    type: 'm3u8',
});
```

:::warning Identification of suffix

The player can only resolve this suffix: `/assets/sample/video.m3u8`

However, this suffix cannot be resolved: `/assets/sample/video?type=m3u8`

So if you use `customType`, it is better to specify `type` at the same time

:::

## `customType`

-   Type: `Object`
-   Default: `{}`

By matching the video's `type`, the video decoding right is handed over to a third-party program for processing. The processing function can receive three parameters

- `video` : Video `DOM` element
- `url` : Video url
- `art` : Player instance

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

The default display language currently supports: `en`, `zh-cn`, `zh-tw`, `cs`, `pl`, `es`, `fa`, `fr`

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

Customize the `i18n` configuration, which will be deeply merged with the built-in `i18n`

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

Modify existing language:

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

:::warning `i18n` definitions

[artplayer/types/i18n.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/i18n.d.ts)

:::

## `lock`

-   Type: `Boolean`
-   Default: `false`

Whether to display a `lock button` on the mobile end to hide the bottom control bar

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

Whether to add long-press video fast-forward function on the mobile terminal

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

Whether to use automatic playback function

<div className="run-code">▶ Run Code</div>

```js{4-5}
var art = new Artplayer({
    container: '.artplayer-app',gb
    url: '/assets/sample/video.mp4',
    id: 'your-url-id',
    autoPlayback: true,
});
```

:::warning Tip

Because the player uses `url` as `key` by default to cache the playback progress

But if your `url` of the same video is different, you need to use `id` to identify the unique `key` of the video

:::

## `autoOrientation`

-   Type: `Boolean`
-   Default: `false`

Whether to rotate the player according to the video size and viewport size when the mobile page is full screen

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

Whether to display the `airplay` button. Currently, only some browsers support this function

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    airplay: true,
});
```
