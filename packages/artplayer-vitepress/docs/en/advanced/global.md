# Global Attributes

Here, `Global Attributes` refer to the `first-level properties` mounted on the `constructor`. Property names are all in uppercase, subject to change in the future and basically not needed.

## DEBUG

Whether to start `debug` mode, which can print out all built-in events of the video by default is turned off.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.DEBUG = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## STYLE

Returns the player style text

<div className="run-code">▶ Run Code</div>

```js
console.log(Artplayer.STYLE);
```

## CONTEXTMENU

Whether to enable the right-click context menu, enabled by default.

<div className="run-code">▶ Run Code</div>

```js
Artplayer.CONTEXTMENU = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```
## NOTICE_TIME

The display duration of the notification message, in milliseconds, defaults to `2000`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.NOTICE_TIME = 5000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## SETTING_WIDTH

The default width of the settings panel, in pixels, defaults to `250`

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

Set the default width of the settings items in the panel, in pixels, the default is `200`.

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

Set the default height of the settings items in the panel, in pixels, the default is `35`.

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

Throttle time for the `resize` event, in milliseconds, defaults to `200`

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

Throttle time for the `scroll` event, in milliseconds, defaults to `200`

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

The boundary tolerance distance for the `view` event, in pixels, default is `50`

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

The maximum number of records for the automatic playback feature, default is `10`

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

The minimum duration for the auto playback feature, in seconds, with a default of `5`.

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

The delay duration for hiding the auto playback feature, in milliseconds, with a default of `3000`.

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

The maximum number of automatic reconnection attempts when a connection error occurs, default is `5`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.RECONNECT_TIME_MAX = 10;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});
```

## RECONNECT_SLEEP_TIME

The delay time for the automatic reconnection attempt when a connection error occurs, in milliseconds, default is `1000`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.RECONNECT_SLEEP_TIME = 3000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});
```

## CONTROL_HIDE_TIME

...

Auto-hide delay time for the bottom control bar, measured in milliseconds, default is `3000`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.CONTROL_HIDE_TIME = 5000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## DBCLICK_TIME

Double-click event delay time, measured in milliseconds, default is `300`

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

On desktop, whether to switch to fullscreen on double click, default is `true`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.DBCLICK_FULLSCREEN = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## MOBILE_DBCLICK_PLAY

On mobile, whether to toggle play/pause on double click, default is `true`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.MOBILE_DBCLICK_PLAY = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## MOBILE_CLICK_PLAY

On mobile, whether to play/pause on single click, default is `false`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.MOBILE_CLICK_PLAY = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```
On mobile devices, whether a tap toggles play/pause, defaults to `false`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.MOBILE_CLICK_PLAY = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## AUTO_ORIENTATION_TIME

On mobile devices, the delay time for auto-rotation, in milliseconds, defaults to `200`

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
Info panel refresh time, unit in milliseconds, default is `1000`

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

On mobile, the multiplier rate of the speed when long-pressing for fast-forward, default is `3`

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

The time, in milliseconds, to fast-forward when double-tapped, default is `10`
On mobile, the delay time of the long-press acceleration, in milliseconds, default is `1000`

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

On mobile, the ratio of the speed of sliding left and right to seek, default is `0.5`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.TOUCH_MOVE_RATIO = 1;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## VOLUME_STEP

The step ratio of adjusting volume with shortcuts, default is `0.1`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.VOLUME_STEP = 0.2;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## SEEK_STEP

The increment by which the playback progress is adjusted via keyboard shortcuts, in seconds, the default is `5`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SEEK_STEP = 10;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## PLAYBACK_RATE

The list of built-in playback speeds, by default `[0.5, 0.75, 1, 1.25, 1.5, 2]`

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

Built-in list of video aspect ratios, default is `['default', '4:3', '16:9']`

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

Built-in list of video flips, defaults to `['normal', 'horizontal', 'vertical']`

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

When in web fullscreen, whether to mount the player under the `body` element, defaults to `false`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.FULLSCREEN_WEB_IN_BODY = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});
```
## LOG_VERSION

Setting whether to print the player version, the default is `true`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.LOG_VERSION = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## USE_RAF

Setting whether to use `requestAnimationFrame`, the default is `false`, currently mainly used for smooth progress bar effects

<div className="run-code">▶ Run Code</div>

```js
Artplayer.USE_RAF = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```