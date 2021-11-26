---
title: 实例属性
sidebar_position: 3
slug: /zh-cn/propertie
---

## play

-   类型: `Function`

播放视频

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();
})
```

## pause

-   类型: `Function`

暂停视频

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();

    setTimeout(() => {
        art.pause();
    }, 3000);
})
```

## toggle

-   类型: `Function`

切换视频的播放和暂停

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.toggle();

    setTimeout(() => {
        art.toggle();
    }, 3000);
})
```

## seek

-   类型: `Setter`
-   参数: `Number`

视频时间跳转，单位秒


<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 5;
})
```

## forward

-   类型: `Setter`
-   参数: `Number`

视频时间快进，单位秒

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.forward = 5;
})
```

## backward

-   类型: `Setter`
-   参数: `Number`

视频时间快退，单位秒

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 5;

    setTimeout(() => {
        art.backward = 2;
    }, 3000);
})
```

## volume

-   类型: `Setter/Getter`
-   参数: `Number`

设置和获取视频音量，范围在：`[0, 1]`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.volume);
    art.volume = 0.5;
    console.info(art.volume);
})
```

## url

-   类型: `Setter/Getter`
-   参数: `String`

设置和获取视频地址

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.url);
    art.url = '/assets/sample/video.mp4?t=0';
    console.info(art.url);
})
```

## muted

-   类型: `Setter/Getter`
-   参数: `Boolean`

设置和获取视频是否静音

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.muted);
    art.muted = true;
    console.info(art.muted);
})
```

## currentTime

-   类型: `Setter/Getter`
-   参数: `Number`

设置和获取视频当前时间，设置时间时和 `seek` 类似，但它不会触发额外的事件

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.currentTime);
    art.currentTime = 5;
    console.info(art.currentTime);
})
```

## duration

-   类型: `Getter`

获取视频时长

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.duration);
})
```

:::tip 提示

有的视频是没有时长的，例如直播中的视频或者没被解码完成的视频，这个时候获取的时长会是 `0`

:::