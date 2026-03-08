# Global Properties

The `global properties` here refer to the `top-level properties` mounted on the `constructor`. All property names are in uppercase. These are subject to change in the future and are rarely used.

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

The throttle time for the `resize` event, in milliseconds. Default is `200`.

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

art.on('scroll', () => {
    console.log('scroll');
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

art.on('scroll', () => {
    console.log('scroll');
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

The minimum record duration for the auto-playback feature, in seconds. Default is `5`.

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

Enabling this can reduce video resource usage in single-page applications or scenarios where players are frequently created/destroyed. If you wish to preserve the state of the video element and only remove the UI, you can set this to `false`.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.REMOVE_SRC_WHEN_DESTROY = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// Only destroy the UI, do not actively clear the src
art.destroy();
```