# 全局属性

这里的 `全局属性` 也是指挂载在 `构造函数` 的 `一级属性`，属性名字全部都是大写的形式，未来容易发生变动，基本上用不到

## 修改范围与生效时机 {#global-contract}

这些字段属于构造函数，供同一份 Artplayer 模块的实例共享；它们不是每个实例的 option，也不会自动校验赋值。建议在创建实例前配置。播放器有的地方在初始化时读取，有的地方在事件触发时读取；修改字段不会重建已有菜单、监听器或已经开始的定时器。不同版本/副本的构造函数不共享这些字段。

### 初始化与界面 {#global-initialization}

| 字段 | 默认值与读取时机 |
| --- | --- |
| `STYLE` | 构建内嵌的 CSS 字符串。导入时已注入 artplayer-style；之后修改 STYLE 本身不会更新该 style 节点 |
| `DEBUG` | false；构造时决定是否添加日志监听器。之后设为false不会移除已安装的日志 |
| `CONTEXTMENU` | true；桌面打开菜单时检查，不会删除菜单内容，也不拦截手动设置 contextmenu.show |
| `PLAYBACK_RATE` / `ASPECT_RATIO` / `FLIP` | 下方各节列出默认数组。构建设置项/右键项时读取；改数组不会更新已有条目 |
| `SETTING_ITEM_WIDTH` | 200px；创建内置子菜单配置时读取，显式条目宽度可覆盖 |
| `SETTING_ITEM_HEIGHT` | 35px；创建条目/返回行与面板布局时读取，已有节点高度不会仅因字段修改就重写 |
| `SETTING_WIDTH` | 250px；面板布局时读取根宽度，实际宽度仍受容器约束 |
| `USE_RAF` | false；初始化时决定是否安装 raf 循环及进度监听分支，不是可热切换的开关。raf 播放中发出，不代替原生媒体事件 |
| `LOG_VERSION` | true；模块导入约100ms后的回调读取；不是每个实例创建都打印 |
| `REMOVE_SRC_WHEN_DESTROY` | true；每次destroy读取。false只跳过removeAttribute('src')/load()，监听器、请求、UI和插件生命周期仍会清理；保留DOM是单独的destroy(false)参数 |

### 定时与交互 {#global-timing}

时间默认以毫秒为单位；已排队的任务保留排队时的延迟。

| 字段 | 默认值与读取时机 |
| --- | --- |
| `NOTICE_TIME` | 2000；显示通知时读取，不重新安排已有通知 |
| `RESIZE_TIME` | 200；每次resize/orientation通知重新排队时读取，连续通知取消前次任务，属于trailing防抖 |
| `SCROLL_TIME` / `SCROLL_GAP` | 200 / 50px；SCROLL_TIME在事件系统初始化时捕获，SCROLL_GAP在可处理的滚动事件中读取。leading节流产生view布尔事件；原始事件是window:scroll |
| `CONTROL_HIDE_TIME` | 3000；video:timeupdate中比较上次显示时间。仅满足正在播放、未操作设置/输入/控件等条件时隐藏，不是独立定时器 |
| `DBCLICK_TIME` | 300；每次视频点击统计时间窗口，不延迟第一次单击以等待第二击 |
| `DBCLICK_FULLSCREEN` / `MOBILE_DBCLICK_PLAY` / `MOBILE_CLICK_PLAY` | true / true / false；每次视频点击读取，分别控制桌面双击全屏、移动端双击/单击播放；移动端仍受锁定状态约束 |
| `FAST_FORWARD_TIME` / `FAST_FORWARD_VALUE` | 1000 / 3倍；长按开始排队时读取时间，触发时读取倍速；必须满足插件启用、播放中且未锁定等条件 |
| `TOUCH_MOVE_RATIO` | 0.5；视频手势处理时读取，进度条自身拖动不应用该视频倍率 |
| `VOLUME_STEP` / `SEEK_STEP` | 0.1 / 5秒；快捷键以及可访问的音量/进度滑块操作时读取 |
| `FULLSCREEN_WEB_IN_BODY` | true；进入网页全屏时读取，退出仍恢复当次保存的位置 |
| `AUTO_ORIENTATION_TIME` | 200；网页全屏需要旋转时排队读取，不是强制设备旋转能力 |
| `INFO_LOOP_TIME` | 1000；可见信息面板每次安排下一次更新时读取 |

### 恢复进度与重连 {#global-recovery}

| 字段 | 默认值与读取时机 |
| --- | --- |
| `AUTO_PLAYBACK_MAX` | 10；播放中的timeupdate写记录时读取。历史逻辑只在写入前数量大于阈值时删除一个最早枚举的键，不是严格最多10条，也不是LRU |
| `AUTO_PLAYBACK_MIN` | 5秒；决定已保存进度是否值得显示恢复提示，不是低于5秒就不保存 |
| `AUTO_PLAYBACK_TIMEOUT` | 3000；恢复提示建立后首次timeupdate安排隐藏时读取 |
| `RECONNECT_TIME_MAX` / `RECONNECT_SLEEP_TIME` | 5次 / 1000；媒体错误处理决定是否重试并安排等待时读取。重连范围受当前源和销毁生命周期管理，不是HLS/DASH SDK自身重试配置 |


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

`resize` 事件的防抖延迟，单位为毫秒，默认为 `200`

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

art.on('view', (visible) => {
    console.log('view', visible);
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

art.on('view', (visible) => {
    console.log('view', visible);
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

显示恢复播放提示所需的最小已保存进度，单位为秒，默认为 `5`；不限制低于该值的记录写入。

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

网页全屏时，是否把播放器挂在在 `body` 元素下，默认为 `true`

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

## REMOVE_SRC_WHEN_DESTROY

在销毁播放器时，是否同时移除视频的 `src` 属性并调用 `load()` 以主动释放媒体资源，默认为 `true`。

开启后可以在单页应用或频繁创建/销毁播放器的场景下，减少视频资源占用；设置为 `false` 只跳过显式媒体重置，其余销毁清理仍会执行。

<div className="run-code">▶ Run Code</div>

```js
Artplayer.REMOVE_SRC_WHEN_DESTROY = false;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// 正常销毁清理，但不显式重置 src
art.destroy();
```
