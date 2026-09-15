# Danmuku

[中文说明](../../plugin/danmuku.md)

Display timed comments over the video, with an input panel, display settings and an optional heatmap.
This guide describes the current refactor branch. The `/runtime` entrypoint and refactor fixes have not yet been published to npm; unversioned CDN links still load the published release.

## Demo

[Open the full example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku).
Run Code examples below use the site's local plugin build and sample media. In your application, use your own container and media URLs.

## Installation

::: code-group

```sh [npm]
npm install artplayer artplayer-plugin-danmuku
```

```sh [yarn]
yarn add artplayer artplayer-plugin-danmuku
```

```sh [pnpm]
pnpm add artplayer artplayer-plugin-danmuku
```

```html [script]
<script src="path/to/artplayer.js"></script>
<script src="path/to/artplayer-plugin-danmuku.js"></script>
```

:::

JavaScript projects can import the default factory from `artplayer-plugin-danmuku`.
Script builds expose `artplayerPluginDanmuku`; pass its result to the player's `plugins` array.

## CDN

::: code-group

```text [jsDelivr]
https://cdn.jsdelivr.net/npm/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

```text [unpkg]
https://unpkg.com/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

:::

## Comment structure

Only `text` is required. Leading and trailing whitespace is removed; empty comments are ignored.

```js
({
    text: 'Hello!',
    time: 10, // Seconds; omitted time defaults to currentTime + 0.5
    mode: 0, // 0: scrolling, 1: top, 2: bottom; defaults to option.mode
    color: '#FFFFFF', // Defaults to option.color
    border: false,
    style: {}, // CSS properties for this comment
});
```

Explicit `time: 0` is preserved. Negative times are clamped to zero. Other than 0, 1 and 2, comment modes are ignored.

## All options

Pass an option object to the factory. At runtime, `{}` is valid and all fields have defaults.
The historical root declarations still require `danmuku`; existing TypeScript projects can keep providing it. See [TypeScript](#typescript) for accurate declarations.

```js
({
    danmuku: [], // Array, XML URL, Promise of an array, or function returning an array/Promise
    speed: 5, // Display duration in seconds, clamped to 1–10
    margin: [10, '25%'], // Top/bottom spacing: pixels or percentages
    opacity: 1, // Clamped to 0–1
    color: '#FFFFFF', // Default comment color
    mode: 0, // Default comment mode
    modes: [0, 1, 2], // Visible modes
    fontSize: 25, // Pixels or a percentage of player height
    antiOverlap: true,
    synchronousPlayback: false, // Follow video playbackRate when enabled
    mount: undefined, // Defaults to the center of the player controls
    heatmap: false, // Enable at construction: true or a heatmap options object
    width: 512, // Below this width, the default input panel moves below the player
    points: [], // Stored option; use the points event to draw custom data
    filter: () => true, // Synchronous; do not return a Promise
    beforeEmit: () => true, // Input-panel submissions only; may return a Promise
    beforeVisible: () => true, // Called before display; may return a Promise
    visible: true,
    emitter: true, // Show the input panel's sending UI
    maxLength: 200, // Input length, clamped to 1–1000
    lockTime: 5, // Seconds between input-panel submissions, clamped to 1–60
    theme: 'dark', // 'dark' or 'light' for an external mount
    OPACITY: {},
    FONT_SIZE: {},
    MARGIN: {},
    SPEED: {},
    COLOR: [],
});
```

`OPACITY`, `FONT_SIZE`, `MARGIN` and `SPEED` override slider definitions with `min`, `max` and `steps`.
Each step can contain `name`, `value`, `hide` and `show`; margin values are pairs such as `[10, '50%']`.
`COLOR` replaces the palette with an array of CSS color strings; an empty array uses the built-in palette.

## Array, XML and asynchronous input

XML input uses Bilibili's comment format. Fetching a cross-origin XML URL requires that server to allow browser access.
An input function runs without the option object as its receiver. It may return an array directly or asynchronously.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: [{ text: 'Hello from an array', time: 1 }],
            // Alternatives:
            // danmuku: '/assets/sample/danmuku.xml',
            // danmuku: Promise.resolve([{ text: 'From a Promise', time: 1 }]),
            // danmuku: async () => [{ text: 'From a function', time: 1 }],
        }),
    ],
});
```

## Lifecycle callbacks

Input-panel submissions run `beforeEmit → filter → beforeVisible → artplayerPluginDanmuku:visible`.
Loaded comments and direct `emit` calls run `filter → beforeVisible → artplayerPluginDanmuku:visible`.
This describes accepted comments; callbacks can reject them, and scheduling still requires playback and an available track.

| Callback | Input | Acceptance |
| --- | --- | --- |
| `beforeEmit` | Input-panel comment | Only strict `true`, or a Promise resolving to `true`, sends it |
| `filter` | Comment with time, mode, color and style filled in | A synchronous truthy result adds it to the queue |
| `beforeVisible` | Queue item | A truthy result, including an awaited result, permits display |

Normal functions receive the current option object as `this` for all three callbacks. Arrow functions retain their lexical `this`.
`emit()` does not call `beforeEmit`: perform application validation before calling it when needed.
`beforeEmit` failures are logged in the console and leave the input available for another attempt.

An asynchronous `beforeVisible` rejection emits `artplayerPluginDanmuku:error` once for that item in the current run; other items continue.
Pause/resume, reset or replacing the callback permits a retry if the item is still eligible by time.
Pausing, seeking, hiding, resetting or destroying cancels unfinished visibility preparation.

## Methods and state

The registered plugin is available synchronously as `art.plugins.artplayerPluginDanmuku`.

| Member | Behavior and return value |
| --- | --- |
| `emit(comment)` | Processes one comment for the queue; returns a Promise |
| `load()` | Reads `option.danmuku` and replaces the queue; returns a Promise |
| `load(input)` | Appends comments from the input; returns a Promise |
| `config(partialOption)` | Synchronously merges configuration |
| `hide()` / `show()` | Synchronously hides or shows the comment layer |
| `reset()` | Clears displayed comments and returns queue items to waiting; does not delete the queue |
| `mount(target)` | Moves the panel to an existing element or selector; returns `undefined` |
| `option` | Live current configuration; use `config()` for validated updates |
| `isHide` | Read-only live visibility state: `true` when hidden |
| `isStop` | Read-only live stopped state; distinct from visibility and not a media-readiness signal |

`emit/load` Promises resolve to the internal Danmuku owner. `config/hide/show/reset` return that same owner synchronously.
The owner is **different from the registered plugin facade**. Keep using the registered facade for subsequent commands.
Awaiting `emit()` means queue processing has finished, not that the comment has appeared.

### Loading and configuration

Changing `config({ danmuku: input })` does not load the new input. Follow it with `load()` to replace the queue.
Input-read failures leave the existing queue intact; failures while filtering individual rows do not guarantee an atomic rollback of the entire batch.
Independent append operations do not cancel one another. A newer replacement cancels an unfinished older replacement.
Destroy cancels pending loads. Cancelled Promises resolve to the owner without a late `loaded` or `error` event.

Fetch and response-text failures emit `artplayerPluginDanmuku:error` and reject the corresponding public `load()` Promise.
Handle rejection with `await`/`try...catch` or `.catch(...)`. Initial automatic loading observes rejection and logs a warning.
Invalid configuration leaves the current option intact. Use `mount(target)` to move the panel; changing `option.mount` through `config()` does not perform a mount.
Enable heatmap when constructing the plugin; `config({ heatmap: true })` does not create it later.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [artplayerPluginDanmuku({ danmuku: [], emitter: false })],
});

async function updateComments() {
    var plugin = art.plugins.artplayerPluginDanmuku;
    plugin.config({ danmuku: [{ text: 'Replacement', time: 1 }] });
    await plugin.load();
    await plugin.load([{ text: 'Appended', time: 2 }]);
    await plugin.emit({ text: 'Scheduled from the current time' });
    plugin.hide();
    console.info('Hidden:', plugin.isHide);
    plugin.show();
    plugin.reset();
}
updateComments().catch(console.error);
```

## External mount

Create a separate mount element before constructing the plugin. The panel moves into the controls during player fullscreen or web fullscreen and returns to its configured mount on exit.
Use `theme: 'light'` on a light background. The live `mount(target)` method requires a valid target; omitting its argument does not select the default.
Destroy releases the plugin panel; the application owns any container it created.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var $danmu = document.createElement('div');
document.querySelector('.artplayer-app').after($danmu);
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
    plugins: [artplayerPluginDanmuku({
        danmuku: [{ text: 'External input panel', time: 1 }],
        mount: $danmu,
        theme: 'dark',
    })],
});
art.on('destroy', () => $danmu.remove());
// Move it later with art.plugins.artplayerPluginDanmuku.mount(otherElement).
```

## Heatmap

Set `heatmap: true` at construction to sample the queue automatically. A live stream does not draw a heatmap.
Dense automatic curves now fit in the bottom quarter of the chart instead of covering the video (issue #958).
Explicit finite `yMin` or `yMax` and custom points retain their coordinate mapping.

An object can set `xMin`, `xMax`, `yMin`, `yMax`, `scale`, `opacity`, `minHeight`, `sampling`, `smoothing` and `flattening`.
Defaults are `xMin: 0`, `xMax: chartWidth`, `yMin: 0`, `yMax: 128`, `scale: 0.25`, `opacity: 0.2`,
`minHeight: floor(chartHeight * 0.05)`, `sampling: max(1, floor(chartWidth / 100))`, `smoothing: 0.2`, `flattening: 0.2`.

Send `art.emit('artplayerPluginDanmuku:points', points)` to draw custom `[x, value]` pairs.
The default x-axis uses chart pixels, not seconds. Set `xMin/xMax` explicitly if supplying another coordinate range.
Rendering mutates the inner point arrays for historical compatibility: copy each pair if reusing the original data.
The stored `points` option does not draw custom data. A resize or successful load redraws the automatic curve, so resend custom data after those events when needed.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [artplayerPluginDanmuku({
        danmuku: [{ text: 'Heatmap example', time: 1 }],
        heatmap: true,
    })],
});
var points = [[0, 5], [0.25, 12], [0.5, 30], [0.75, 10], [1, 5]];
function drawPoints() {
    var width = art.controls.heatmap.offsetWidth;
    art.emit('artplayerPluginDanmuku:points', points.map(([ratio, value]) => [ratio * width, value]));
}
art.on('ready', drawPoints);
art.on('resize', drawPoints);
art.on('artplayerPluginDanmuku:loaded', drawPoints);
```

## Events

Subscribe with `art.on(name, callback)` and remove subscriptions with `art.off(name, callback)`.

| Event | Payload / meaning |
| --- | --- |
| `artplayerPluginDanmuku:visible` | Queue item; its `$ref` is the displayed element |
| `artplayerPluginDanmuku:loaded` | Current full queue after a successful load, including appends |
| `artplayerPluginDanmuku:error` | Original error from loading or scheduling; handle public Promise rejections separately |
| `artplayerPluginDanmuku:config` | Current configuration |
| `artplayerPluginDanmuku:start` | No payload; scheduling starts |
| `artplayerPluginDanmuku:stop` | No payload; scheduling stops |
| `artplayerPluginDanmuku:hide` | No payload; layer hidden |
| `artplayerPluginDanmuku:show` | No payload; layer shown |
| `artplayerPluginDanmuku:reset` | No payload; displayed items reset |
| `artplayerPluginDanmuku:destroy` | No payload; plugin destroyed |
| `artplayerPluginDanmuku:points` | Application-sent custom points for the heatmap |

Events are not replayed to later listeners. In particular, an initially empty array can finish loading during construction.
Subscribe before invoking a later `load()` if you need to observe its completion event.
Use `$ref.textContent` when adding text in a `visible` handler.

## TypeScript

The root and `/legacy` entrypoints keep the npm 5.3.0 declaration shapes for compatibility, including historical inaccuracies about return values.
The current branch adds `/runtime` for accurate types while loading the same runtime factory:

```ts
import Artplayer from 'artplayer';
import danmuku from 'artplayer-plugin-danmuku/runtime';
import type { RuntimeOption, Point, EventMap } from 'artplayer-plugin-danmuku/runtime';

const option: RuntimeOption = { danmuku: [], heatmap: true };
const points: Point[] = [[0, 5], [100, 10]];
const onError = (...[error]: EventMap['artplayerPluginDanmuku:error']) => console.error(error);
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [danmuku(option)] });
art.on('artplayerPluginDanmuku:error', onError);
```

The explicit `EventMap` describes payloads; it does not augment the core's historical event declarations automatically.
The factory also exposes the existing `icons` object for customization. Package `README.md` and `ARCHITECTURE.md` describe module ownership, maintenance commands and remaining device/combination validation.
