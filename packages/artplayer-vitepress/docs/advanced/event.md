# 实例事件

播放器的事件分为两种，一种视频的 `原生事件` (前缀 `video:`)，另外一种是 `自定义事件`

监听事件：

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:canplay', () => {
    console.log('video:canplay');
});
```

只监听一次事件：

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.once('video:canplay', () => {
    console.log('video:canplay');
});
```

手动触发事件：

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.emit('focus');
```

移除事件：

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

const onReady = () => {
    console.log('ready');
    art.off('ready', onReady);
}

art.on('ready', onReady);
```

:::warning 全部事件请参考以下地址：

[artplayer/types/events.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/events.d.ts)

:::

## `ready`

当播放器首次可以播放器时

## `restart`

当播放器切换地址后并可以播放时

## `pause`

当播放器暂停时

## `play`

当播放器播放时

## `hotkey`

当热键触发时

## `destroy`

当播放器销毁时

## `url`

当视频地址变化时

## `focus`

当播放器获得焦点时

## `blur`

当播放器失去焦点时

## `dblclick`

当播放器被双击时

## `click`

当播放器被单击时

## `error`

当播放器加载视频发生错误时

## `setBar`

当进度条更新时

## `hover`

当播放器被鼠标移出或者移入时

## `mousemove`

当播放器被鼠标经过时

## `resize`

当播放器尺寸变化时

## `view`

当播放器出现在视口时

## `aspectRatio`

当播放器长宽比变化时

## `autoHeight`

当播放器自动设置高度时

## `autoSize`

当播放器自动设置尺寸时

## `flip`

当播放器发生翻转时

## `fullscreen`

当播放器发生窗口全屏时

## `fullscreenWeb`

当播放器发生网页全屏时

## `loop`

当播放器发生区间循环播放时

## `mini`

当播放器进入迷你模式时

## `pip`

当播放器进入画中画时

## `screenshot`

当播放器发生截图时

## `seek`

当播放器发生时间跳转时

## `subtitleOffset`

当播放器发生字幕偏移时

## `subtitleUpdate`

当字幕更新时

## `subtitleLoad`

当字幕加载时

## `subtitleSwitch`

当字幕切换时

## `lock`

当播放器发生锁定时

## `video:canplay`

浏览器可以播放媒体文件了，但估计没有足够的数据来支撑播放到结束，不必停下来进一步缓冲内容

## `video:canplaythrough`

浏览器估计它可以在不停止内容缓冲的情况下播放媒体直到结束

## `video:complete`

OfflineAudioContext 渲染完成

## `video:durationchange`

duration 属性的值改变时触发

## `video:emptied`

媒体内容变为空；例如，当这个 media 已经加载完成（或者部分加载完成），则发送此事件，并调用 load() 方法重新加载它

## `video:ended`

视频停止播放，因为 media 已经到达结束点

## `video:error`

获取媒体数据时出错，或者资源类型不是受支持的媒体格式

## `video:loadeddata`

media 中的首帧已经完成加载

## `video:loadedmetadata`

已加载元数据

## `video:pause`

播放已暂停

## `video:play`

播放已开始

## `video:playing`

由于缺乏数据而暂停或延迟后，播放准备开始

## `video:progress`

在浏览器加载资源时周期性触发

## `video:ratechange`

播放速率发生变化

## `video:seeked`

跳帧（seek）操作完成

## `video:seeking`

跳帧（seek）操作开始

## `video:stalled`

用户代理（user agent）正在尝试获取媒体数据，但数据意外未出现

## `video:suspend`

媒体数据加载已暂停

## `video:timeupdate`

currentTime 属性指定的时间发生变化

## `video:volumechange`

音量发生变化

## `video:waiting`

由于暂时缺少数据，播放已停止

