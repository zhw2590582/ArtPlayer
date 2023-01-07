# 实例事件

播放器的事件分为两种，一种视频的 `原生事件` (前缀 `video:`)，另外一种是 `自定义事件`

监听事件：

```js
art.on('video:canplay', () => {
    console.log('video:canplay');
});

art.on('ready', () => {
    console.log('ready');
});
```

只监听一次事件：

```js
art.once('video:canplay', () => {
    console.log('video:canplay');
});

art.once('ready', () => {
    console.log('ready');
});
```

手动触发事件：

```js
art.emit('video:canplay');

art.emit('ready');
```

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

