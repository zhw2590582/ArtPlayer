# 全局属性

这里的 `全局属性` 也是指挂载在 `构造函数` 的 `一级属性`，属性名字全部都是大写的形式，未来容易发生变动，基本上用不到

## DEBUG

是否开始 `debug` 模式，可以打印出视频全部的内置事件，默认关闭

<div className="run-code">▶ Run Code</div>

```js
Artplayer.DEBUG = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## STYLE

返回播放器样式文本

<div className="run-code">▶ Run Code</div>

```js
console.log(Artplayer.STYLE);
```

## CONTEXTMENU

是否开启右键菜单，默认开启

<div className="run-code">▶ Run Code</div>

```js
Artplayer.CONTEXTMENU = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## NOTICE_TIME

提示信息的显示时长，单位为毫秒，默认为 `2000`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.NOTICE_TIME = 5000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## SETTING_WIDTH

设置面板的默认宽度，单位为像素，默认为 `250`

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

设置面板的设置项的默认宽度，单位为像素，默认为 `200`

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

设置面板的设置项的默认高度，单位为像素，默认为 `35`

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

`resize` 事件的节流时间，单位为毫秒，默认为 `200`

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

`scroll` 事件的节流时间，单位为毫秒，默认为 `200`

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

`view` 事件的边界容差距离，单位为像素，默认为 `50`

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

自动回放功能的最大记录数，默认为 `10`

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

自动回放功能的最小记录时长，单位为秒，默认为 `5`

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

自动回放功能的隐藏延迟时长，单位为毫秒，默认为 `3000`

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

发生连接错误时，自动连接的最大次数，默认为 `5`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.RECONNECT_TIME_MAX = 10;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});
```

## RECONNECT_SLEEP_TIME

发生连接错误时，自动连接的延迟时间，单位为毫秒，默认为 `1000`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.RECONNECT_SLEEP_TIME = 3000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});
```

## CONTROL_HIDE_TIME

底部控制栏的自动隐藏的延迟时间，单位为毫秒，默认为 `3000`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.CONTROL_HIDE_TIME = 5000;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## DBCLICK_TIME

双击事件的延迟事件，单位为毫秒，默认为 `300`

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

在桌面端，是否双击切换全屏，默认为 `true`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.DBCLICK_FULLSCREEN = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## MOBILE_DBCLICK_PLAY

在移动端，是否双击切换播放暂停，默认为 `true`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.MOBILE_DBCLICK_PLAY = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## MOBILE_CLICK_PLAY

在移动端，是否单击切换播放暂停，默认为 `false`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.MOBILE_CLICK_PLAY = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## AUTO_ORIENTATION_TIME

在移动端，自动旋屏的延迟时间，单位为毫秒，默认为 `200`

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

信息面板的刷新时间，单位为毫秒，默认为 `1000`

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

在移动端，长按加速的速率倍数，默认为 `3`

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

在移动端，长按加速的延迟时间，单位为毫秒，默认为 `1000`

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

在移动端，左右滑动进度的速率倍数，默认为 `0.5`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.TOUCH_MOVE_RATIO = 1;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## VOLUME_STEP

快捷键调节音量的幅度比例，默认为 `0.1`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.VOLUME_STEP = 0.2;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## SEEK_STEP

快捷键调节播放进度的幅度，单位为秒，默认为 `5`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.SEEK_STEP = 10;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## PLAYBACK_RATE

内置播放速率的列表，默认为 `[0.5, 0.75, 1, 1.25, 1.5, 2]`

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

内置视频长宽比的列表，默认为 `['default', '4:3', '16:9']`

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

内置视频翻转的列表，默认为 `['normal', 'horizontal', 'vertical']`

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

网页全屏时，是否把播放器挂在在 `body` 元素下，默认为 `false`

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

设置是否打印播放器版本，默认为 `true`

<div className="run-code">▶ Run Code</div>

```js
Artplayer.LOG_VERSION = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## USE_RAF

设置是否使用 `requestAnimationFrame` ，默认为 `false`，目前主要用于进度条的平滑效果

<div className="run-code">▶ Run Code</div>

```js
Artplayer.USE_RAF = true;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```