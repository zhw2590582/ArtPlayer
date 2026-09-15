# Global Properties

The `global properties` here refer to the `top-level properties` mounted on the `constructor`. All property names are in uppercase. These are subject to change in the future and are rarely used.

## Scope and effective timing {#global-contract}

These fields belong to the constructor and are shared by instances from that Artplayer module. They are not per-instance options and assignments are not automatically validated. Configure them before constructing players when possible. Some consumers read them at initialization, others at event time; changing a field does not rebuild existing menus, listeners, or pending timers. Separate module copies have separate constructors and fields.

### Initialization and UI {#global-initialization}

| Field | Default and reading point |
| --- | --- |
| `STYLE` | Embedded CSS text. Import has already injected artplayer-style; assigning STYLE later does not update that node |
| `DEBUG` | false; constructor decides whether to install logging listeners. Setting false later does not remove them |
| `CONTEXTMENU` | true; checked when opening the desktop menu. Does not remove entries or prevent setting contextmenu.show manually |
| `PLAYBACK_RATE` / `ASPECT_RATIO` / `FLIP` | Default arrays are listed below. Read when constructing setting/context-menu entries; changing them does not refresh existing entries |
| `SETTING_ITEM_WIDTH` | 200px; read when constructing built-in submenu options. Explicit item widths can override it |
| `SETTING_ITEM_HEIGHT` | 35px; read when creating items/back rows and laying out panels. Existing node heights are not rewritten merely by assigning this field |
| `SETTING_WIDTH` | 250px; root width read during panel layout, still constrained by the container |
| `USE_RAF` | false; initialization selects the raf loop and progress listener branch. Not a live mode toggle; raf emits during playback and does not replace native media events |
| `LOG_VERSION` | true; read by the callback about 100ms after module import, not once per player construction |
| `REMOVE_SRC_WHEN_DESTROY` | true; read by each destroy call. false only skips removeAttribute('src')/load(); listeners, requests, UI, and plugin lifecycle still clean up. Preserving DOM uses the separate destroy(false) argument |

### Scheduling and interaction {#global-timing}

Time values below use milliseconds unless stated otherwise. Already queued work retains the delay used when scheduled.

| Field | Default and reading point |
| --- | --- |
| `NOTICE_TIME` | 2000; read when showing a notice, without rescheduling an existing one |
| `RESIZE_TIME` | 200; read when resize/orientation queues a new task, canceling the previous task. This is trailing debounce |
| `SCROLL_TIME` / `SCROLL_GAP` | 200 / 50px. The delay is captured when the event system initializes; the gap is read on accepted scroll events. Leading throttle emits a boolean view event; the raw event is window:scroll |
| `CONTROL_HIDE_TIME` | 3000; checked against last-show time in video:timeupdate, while playing and without active setting/input/control interaction. Not a standalone timer |
| `DBCLICK_TIME` | 300; click-count window read on each video click. The first single click is not delayed while awaiting another |
| `DBCLICK_FULLSCREEN` / `MOBILE_DBCLICK_PLAY` / `MOBILE_CLICK_PLAY` | true / true / false; read on each video click for desktop double-click fullscreen and mobile double/single-click playback. Mobile playback remains subject to the lock state |
| `FAST_FORWARD_TIME` / `FAST_FORWARD_VALUE` | 1000 / 3x; delay read when a long press is queued, rate when it activates. Requires the plugin to be enabled, playback active, and the player unlocked |
| `TOUCH_MOVE_RATIO` | 0.5; read during video gestures. Progress-bar dragging does not apply this video multiplier |
| `VOLUME_STEP` / `SEEK_STEP` | 0.1 / 5 seconds; read by shortcuts and accessible volume/progress slider actions |
| `FULLSCREEN_WEB_IN_BODY` | true; read when entering web fullscreen. Exit restores that session's saved placement |
| `AUTO_ORIENTATION_TIME` | 200; read when a required web-fullscreen rotation is queued. Does not force device rotation capability |
| `INFO_LOOP_TIME` | 1000; read each time the visible info panel queues its next update |

### Resume records and reconnection {#global-recovery}

| Field | Default and reading point |
| --- | --- |
| `AUTO_PLAYBACK_MAX` | 10; read when playing timeupdate writes a record. Historical logic removes one first-enumerated key only if the count already exceeds the threshold before writing; not a strict 10-entry cap or LRU |
| `AUTO_PLAYBACK_MIN` | 5 seconds; decides whether saved progress merits a resume prompt, rather than preventing storage below 5 seconds |
| `AUTO_PLAYBACK_TIMEOUT` | 3000; read on the first timeupdate after a resume prompt is created, when hiding is scheduled |
| `RECONNECT_TIME_MAX` / `RECONNECT_SLEEP_TIME` | 5 attempts / 1000; read when handling a media error to decide retry and queue its delay. Retries belong to the current source/lifecycle; these do not configure HLS/DASH SDK retry policies |


## DEBUG

Whether to enable `debug` mode, which can print all built-in video events. Default is off.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.DEBUG = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## STYLE

Returns the player style text.

<div className="run-code">▶ Run Code</div>

```js
console.log(Artplayer.STYLE);
```

## CONTEXTMENU

Whether to enable the context menu. Default is on.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.CONTEXTMENU = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## NOTICE_TIME

The display duration of notification messages, in milliseconds. Default is `2000`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.NOTICE_TIME = 5000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## SETTING_WIDTH

The default width of the settings panel, in pixels. Default is `250`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SETTING_WIDTH = 300;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
});
```

## SETTING_ITEM_WIDTH

The default width of a setting item in the settings panel, in pixels. Default is `200`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SETTING_ITEM_WIDTH = 300;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
});
```

## SETTING_ITEM_HEIGHT

The default height of a setting item in the settings panel, in pixels. Default is `35`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SETTING_ITEM_HEIGHT = 40;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
});
```

## RESIZE_TIME

The debounce delay for the `resize` event, in milliseconds. Default is `200`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.RESIZE_TIME = 500;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('resize', () => {
    console.log('resize');
});
```

## SCROLL_TIME

The throttle time for the `scroll` event, in milliseconds. Default is `200`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SCROLL_TIME = 500;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('view', (visible) => {
    console.log('view', visible);
});
```

## SCROLL_GAP

The boundary tolerance distance for the `view` event, in pixels. Default is `50`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SCROLL_GAP = 100;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('view', (visible) => {
    console.log('view', visible);
});
```

## AUTO_PLAYBACK_MAX

The maximum record count for the auto-playback feature. Default is `10`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.AUTO_PLAYBACK_MAX = 20;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoPlayback: true,
});
```

## AUTO_PLAYBACK_MIN

The minimum saved progress for showing the auto-playback resume prompt, in seconds. Default is `5`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.AUTO_PLAYBACK_MIN = 10;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoPlayback: true,
});
```

## AUTO_PLAYBACK_TIMEOUT

The hide delay duration for the auto-playback feature, in milliseconds. Default is `3000`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.AUTO_PLAYBACK_TIMEOUT = 5000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoPlayback: true,
});
```

## RECONNECT_TIME_MAX

The maximum number of automatic reconnection attempts when a connection error occurs. Default is `5`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.RECONNECT_TIME_MAX = 10;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});
```

## RECONNECT_SLEEP_TIME

The delay time for automatic reconnection when a connection error occurs, in milliseconds. Default is `1000`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.RECONNECT_SLEEP_TIME = 3000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});

```

## CONTROL_HIDE_TIME

The auto-hide delay time for the bottom control bar, in milliseconds. Default is `3000`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.CONTROL_HIDE_TIME = 5000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## DBCLICK_TIME

The delay time for the double-click event, in milliseconds. Default is `300`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.DBCLICK_TIME = 500;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('dblclick', () => {
    console.log('dblclick');
});
```

## DBCLICK_FULLSCREEN

On desktop, whether double-click toggles fullscreen. Default is `true`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.DBCLICK_FULLSCREEN = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## MOBILE_DBCLICK_PLAY

On mobile, whether double-click toggles play/pause. Default is `true`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.MOBILE_DBCLICK_PLAY = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## MOBILE_CLICK_PLAY

On mobile, whether single-click toggles play/pause. Default is `false`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.MOBILE_CLICK_PLAY = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## AUTO_ORIENTATION_TIME

On mobile, the delay time for auto-rotation, in milliseconds. Default is `200`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.AUTO_ORIENTATION_TIME = 500;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoOrientation: true,
});
```

## INFO_LOOP_TIME

The refresh interval for the info panel, in milliseconds. Default is `1000`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.INFO_LOOP_TIME = 2000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.info.show = true;
```

## FAST_FORWARD_VALUE

On mobile, the speed multiplier for long-press fast-forward. Default is `3`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.FAST_FORWARD_VALUE = 5;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fastForward: true,
});
```

## FAST_FORWARD_TIME

On mobile, the delay time for long-press fast-forward, in milliseconds. Default is `1000`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.FAST_FORWARD_TIME = 2000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fastForward: true,
});
```

## TOUCH_MOVE_RATIO

On mobile, the speed multiplier for left/right swipe to seek. Default is `0.5`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.TOUCH_MOVE_RATIO = 1;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## VOLUME_STEP

The step size for volume adjustment via keyboard shortcuts. Default is `0.1`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.VOLUME_STEP = 0.2;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## SEEK_STEP

The step size for seeking via keyboard shortcuts, in seconds. Default is `5`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SEEK_STEP = 10;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## PLAYBACK_RATE

The built-in list of playback rates. Default is `[0.5, 0.75, 1, 1.25, 1.5, 2]`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.PLAYBACK_RATE = [0.5, 1, 2, 3, 4, 5];

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    playbackRate: true,
});

art.contextmenu.show = true;
art.setting.show = true;
```

## ASPECT_RATIO

The built-in list of video aspect ratios. Default is `['default', '4:3', '16:9']`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.ASPECT_RATIO = ['default', '1:1', '2:1', '4:3', '6:5'];

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    aspectRatio: true,
});

art.contextmenu.show = true;
art.setting.show = true;
```

## FLIP

The built-in list of video flip options. Default is `['normal', 'horizontal', 'vertical']`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.FLIP = ['normal', 'horizontal'];

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
});

art.contextmenu.show = true;
art.setting.show = true;

```

## FULLSCREEN_WEB_IN_BODY

Whether to mount the player under the `body` element during web fullscreen mode. Default is `true`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.FULLSCREEN_WEB_IN_BODY = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});
```

## LOG_VERSION

Sets whether to print the player version. Default is `true`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.LOG_VERSION = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## USE_RAF

Sets whether to use `requestAnimationFrame`. Default is `false`. Currently, it is primarily used for smooth progress bar effects.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.USE_RAF = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```

## REMOVE_SRC_WHEN_DESTROY

Whether to remove the video's `src` attribute and call `load()` to actively release media resources when destroying the player. Default is `true`.

Enabling this can reduce video resource usage in single-page applications or scenarios where players are frequently created/destroyed. Setting this to `false` skips this explicit media reset; the other destroy cleanup still runs.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.REMOVE_SRC_WHEN_DESTROY = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// Run destroy cleanup without explicitly resetting src
art.destroy();
```