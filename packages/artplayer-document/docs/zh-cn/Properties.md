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

设置和获取视频音量，范围在：`[0, 1]`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.volume = 0.5;
    console.log(art.volume);
})
```