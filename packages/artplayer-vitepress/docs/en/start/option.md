# Basic Options

## Construction and option ownership {#construction-contract}

`new Artplayer(option, readyCallback?)` is synchronous. It requires a browser and a DIV container, either directly or selected by a CSS selector. The default getter includes '#artplayer', but constructor input must supply container: the input value replaces that default before validation. One active instance owns each container. Without useSSR, mounting replaces its contents; with useSSR, insert the matching Artplayer.html first. This flag does not enable server-side construction or repair incomplete markup.

Each construction reads a fresh Artplayer.option, merges the input, validates it, then creates the subsystems. Validation failure happens before DOM mounting or proxy invocation. Initialization failures release owned resources and restore the captured container; a successful constructor return does not mean media, subtitles, asynchronous plugins, or external SDKs are ready.

The second argument is the ready callback, not an option named onReady. A normal function receives the player as both this and its argument. It is registered after constructor plugins and runs from the first successfully handled canplay; it does not await plugin Promises. An empty URL is valid and can be assigned later. The numeric art.id is separate from option.id, which is the optional playback-memory key.

### Merge and validation {#option-merge}

- Artplayer.option returns fresh nested defaults on every access; modifying one returned object does not set global defaults. lang reads the current navigator.language in lowercase; moreVideoAttr.preload uses the module's Safari detection. In non-browser inspection lang may be undefined, but construction still requires a browser.
- Merging creates a new top-level object and recursively merges objects present on both sides. Arrays use the existing concat/spread rule, so the array itself is new but its ordinary object items retain identity. Function and Element references are retained; this is not a complete deep clone. Components may later add metadata to shared item objects.
- Own enumerable extension fields survive without schema validation. Inherited fields are generally omitted, except container is read explicitly from the input again. Accessor properties can therefore run more than once. An explicit undefined can replace a required default and cause a validation error; omission and undefined are not interchangeable.
- Artplayer.scheme is a shared mutable schema. Artplayer.validator(value, scheme) validates an already supplied value, returns that same value on success, and throws at the first invalid known field. It neither merges defaults nor mounts a player. Artplayer.kindOf is the validator's type classifier, not a media-capability test. Runtime types also expose the validator's optional diagnostic path argument.
- art.option is the resolved live object, not a reactive configuration API. Some handlers read it later, while other settings are captured or build UI only during initialization. Change playback through the documented setters and UI through the component managers; assigning a new option field does not automatically rebuild everything.

### Initial media values and precedence {#option-precedence}

moreVideoAttr is copied through art.attr as media **properties**, not setAttribute calls. A value of undefined follows attr's getter behavior and does not write. The core then applies truthy muted, volume, poster, autoplay, playsInline and theme settings, CSS variables, and the URL. Do not depend on object-key order to override these later steps.

The historical volume initialization only assigns a truthy option.volume, clamped to [0,1]; volume:0 therefore skips that assignment. A numeric saved storage volume is applied afterward and overrides it. For explicit initial silence, use muted:true; set art.volume after construction when you need to override stored volume. False autoplay/muted/playsInline values do not undo properties already set through moreVideoAttr. Browser autoplay and inline-playback policies still apply.

A nonempty theme writes '--art-theme' into the resolved cssVar object before those styles are applied, taking precedence over a conflicting initial cssVar value. poster uses the player's background layer. loop is implemented by the ended handler seeking to zero and calling play; it is distinct from setting the native video.loop property through moreVideoAttr.

### UI, platform, and content options {#option-capabilities}

| Options | Actual scope |
| --- | --- |
| isLive | Selects live UI and disables the normal seek/time controls and several VOD helpers; it does not detect a stream protocol or install a decoder |
| flip, playbackRate, aspectRatio | Enable selector entries in desktop context menus and, with setting enabled, the settings panel. They are feature flags, not initial flip/rate/ratio values |
| setting, settings | Enable the settings UI and provide its entries; the registry still exists when the panel is disabled |
| screenshot, pip, fullscreen, fullscreenWeb, airplay | Request the corresponding controls. Screenshot UI is desktop-only; AirPlay also checks the native availability API. A button flag does not grant browser permissions or guarantee support |
| hotkey | Enables built-in desktop shortcuts; false does not remove the public manager or prevent manually registered shortcuts |
| gesture | Enables mobile video-surface seeking gestures for VOD. The progress-surface gesture binding is separate and remains when this flag is false |
| lock, fastForward, autoOrientation | Install mobile-only helpers; fastForward is also VOD-only. Changing the flags later does not install missing plugins |
| miniProgressBar, autoPlayback | Install VOD-only helpers. Playback memory uses id or the current URL and requires storage; it is not browser autoplay permission |
| autoMini, autoSize | React to viewport events / standard-mode resize paths. They do not guarantee initial visibility detection or continuous ResizeObserver behavior |
| mutex | After a successful art.play, pause other registered instances. Direct native video.play bypasses that custom-method step |
| backdrop, playsInline | Add the initial backdrop CSS class / write inline-playback properties. Actual CSS and media behavior remain browser-dependent |
| layers, controls, contextmenu | Initial component entries; keep their required html and, for controls, position. Constructor context menus are desktop-only. See the component guides for callback receivers and cleanup |
| quality | Initial selector items need string html and URL under the constructor schema. default marks the label/selection; it does not replace option.url or load that URL. Initial selector installation is deferred; later selection invokes switchQuality |
| highlight | time/text markers rendered on metadata readiness. Times are clamped to duration for positioning, text is stored as text, and this is not a chapter playback API |
| lang, i18n, icons | Initial language, dictionaries and icon overrides. Their dedicated managers and guides describe fallback, node ownership and later updates |

### Nested defaults and media adapters {#option-nested}

The actual thumbnails defaults are `{ url: '', number: 60, column: 10, width: 0, height: 0, scale: 1 }`. They describe a sprite, not a video URL or thumbnail generator. Width/height are multiplied by scale when supplied; otherwise width comes from image width/column and height from the video ratio. Cells are zero-based in row order. Loading is lazy on progress interaction. Later art.thumbnails assignment replaces the object without constructor default merging; provide the geometry you need. Empty/live assignments are ignored by that setter.

The actual subtitle defaults include empty url/type/name, an empty style object, escape:true, encoding:'utf-8', and an identity onVttLoad callback. Partial constructor input merges these defaults. See the subtitle manager guide for conversion, track readiness, per-call overrides and Blob URL ownership; a constructor return does not mean the track loaded.

type is an explicit customType lookup key; otherwise getExt derives the key from the URL. The core does not normalize a supplied type or install SDKs from extension names. A matching callback receives (video, url, art) with this===art after the owned initialization delay. Its Promise is observed for failure but does not define media readiness; the adapter must set up the media surface and native events and clean up its resources. Without a matching callback, the URL is assigned directly to video.src. Optional art.hls/art.flv fields in types do not instantiate those libraries.

proxy runs earlier, during template mounting, before art.template, video/query/proxy getters and most managers are usable. Return an actual HTMLVideoElement or HTMLCanvasElement; an arbitrary object or undefined is rejected at runtime despite the older proxy type permitting undefined. The node replaces the template video and its className becomes art-video. A canvas needs its media-like properties/methods/events supplied by the adapter; it is not made playable automatically.

### Constructor TypeScript views {#option-types}

The root Option retains its historical required URL/read shape; OptionInput permits an omitted URL and numeric component HTML. runtime exposes resolved options and accurate callback receivers: ProxyHost is deliberately limited, component callbacks can see later managers as optional, and PluginHost does not assume art.plugins was assigned during its own construction. These are type views of the same constructor, not separate runtime implementations. A permissive historical type does not bypass runtime schema checks; for example, constructor quality labels must still be strings.

```ts
import LegacyArtplayer from 'artplayer';
import type { OptionInput as LegacyInput } from 'artplayer';
import Artplayer from 'artplayer/runtime';
import type { OptionInput, ProxyHost } from 'artplayer/runtime';

const input: LegacyInput = { container: '#legacy', controls: [{ name: 'count', html: 42, position: 'left' }] };
new LegacyArtplayer(input);
const options: OptionInput = {
    container: '#player',
    proxy: function (art: ProxyHost) {
        const same: boolean = this === art;
        void same;
        return document.createElement('video');
    },
    plugins: [function (art) {
        const pending = art.plugins;
        void pending;
        return { name: 'example' };
    }],
};
new Artplayer(options, function (art) {
    const same: boolean = this === art;
    void same;
});
```


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

You may need to set the size of the container element, for example:

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

Sometimes the `url` is not known immediately. In such cases, you can set the `url` asynchronously.

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

The unique identifier for the player. Currently used only for playback memory `autoplayback`.

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

The constructor accepts a function as the second parameter. This function is triggered when the player is successfully initialized and the video is ready to play, similar to the `ready` event.

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

The player's default volume.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::warning Note

The player caches the last volume setting. Upon the next initialization (e.g., page refresh), the player will read this cached value.

:::

## `isLive`

-   Type: `Boolean`
-   Default: `false`

Enable live streaming mode. This will hide the progress bar and playback time.

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

Whether to start muted by default.

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

By default, the player's dimensions fill the entire `container`, often resulting in black bars. This option automatically adjusts the player size to hide black bars, similar to `css`'s `object-fit: cover;`.

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

Automatically enters `Mini Player` mode when the player scrolls out of the browser viewport.

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

Whether to loop playback.

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

Whether to display the video flip function. Currently only appears in the `Settings Panel` and `Context Menu`.

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

Whether to display the video playback speed function. It will appear in the `Settings Panel` and `Context Menu`.

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

Whether to display the video aspect ratio function. It will appear in the `Settings Panel` and `Context Menu`.

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

Whether to display the `Screenshot` function in the bottom control bar.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});
```

:::warning Note

Due to browser security mechanisms, screenshotting may fail if the video source URL is cross-origin with the website.

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

Whether to use hotkeys.

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

These hotkeys only take effect after the player gains focus (e.g., after clicking on the player).

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

If multiple players exist on the page simultaneously, whether only one player is allowed to play at a time.

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

Whether to enable the backdrop blur effect for the player UI. When enabled, overlays such as the settings panel, context menu, and volume bar will apply a `backdrop-filter` frosted glass effect for a more transparent look. However, this may cause performance or compatibility issues on some low-performance devices or older browsers.

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

Whether to display the player `Web Fullscreen` button in the bottom control bar.

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

Subtitle time offset, ranging from `[-5s, 5s]`. Appears in the `Settings Panel`.

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

A mini progress bar that only appears when the player loses focus and is playing.

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

Whether to use SSR (Server-Side Rendering) mount mode. Useful if you want to pre-render the player's required HTML before the player is mounted.

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

Initialize custom settings panels.

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

Initialize custom context menus.

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

```

:::warning For `Component Configuration`, please refer to the following address:

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

| Property | Type     | Description                     |
| -------- | -------- | ------------------------------- |
| `time`   | `Number` | Highlight time (in seconds)     |
| `text`   | `String` | Highlight text                  |

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
-   Default: `{ url: '', number: 60, column: 10, width: 0, height: 0, scale: 1 }`

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
-   Default: `{ url: '', type: '', name: '', style: {}, escape: true, encoding: 'utf-8', onVttLoad: vtt => vtt }`

Set video subtitles. Supported subtitle formats: `vtt`, `srt`, `ass`.

| Property    | Type       | Description                                      |
| ----------- | ---------- | ------------------------------------------------ |
| `name`      | `String`   | Subtitle name                                    |
| `url`       | `String`   | Subtitle URL                                     |
| `type`      | `String`   | Subtitle type, options: `vtt`, `srt`, `ass`      |
| `style`     | `Object`   | Subtitle style                                   |
| `encoding`  | `String`   | Subtitle encoding, default `utf-8`               |
| `escape`    | `Boolean`  | Whether to escape `html` tags, default `true`    |
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
-   Default: `{'controls': false, 'preload': 'metadata'}` (In Safari, it will automatically adjust to `preload: 'auto'` for better loading experience.)

More video attributes. These attributes will be written directly into the video element.

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

Used to replace default icons. Supports `Html` strings and `HTMLElement`.

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

Used to specify the video format. It needs to be used together with `customType`. By default, the video format is determined by the suffix of the video URL (e.g., `.m3u8`, `.mkv`, `.ts`). However, sometimes the video URL may not have the correct suffix, so it needs to be explicitly specified.

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

Therefore, if you use `customType`, it's best to also specify the `type`.

:::

## `customType`

-   Type: `Object`
-   Default: `{}`

Matches based on the video's `type` and delegates video decoding to third-party programs for processing. The processing function can receive three parameters:

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

Because the player uses the `url` as the `key` to cache playback progress by default.

However, if the `url` for the same video is different, then you need to use `id` to identify the unique `key` for the video.

:::

## `autoOrientation`

-   Type: `Boolean`
-   Default: `false`

Whether to rotate the player in fullscreen mode on mobile web, based on the video dimensions and viewport dimensions.

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

Used to modify the built-in CSS variables.

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

:::warning Reference for `cssVar` Syntax

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
```