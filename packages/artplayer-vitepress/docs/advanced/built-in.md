# 高级属性

这里的 `高级属性` 是指挂载在 `实例` 的 `二级属性`，比较少用

## whitelist

管理移动设备的白名单功能，当前只有一个属性 `state` 返回是否启用播放器功能

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    whitelist: [(ua) => /iPhone/gi.test(ua)],
});

console.log(art.whitelist.state);
```

:::warning 提示

在上面这个例子中，当使用 `iPhone` 访问播放器时，`art.whitelist.state` 会返回 `false`，即使用原生的播放器，而不是 `Artplayer` 播放器

:::


## template

管理播放器所有的 `DOM` 元素

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.log(art.template);
console.log(art.template.$video);
```

:::warning 提示

为了方便区别 `DOM` 元素和普通对象，播放器里的所有 `DOM` 元素都是以 `$` 开头命名的

这是所有 `DOM` 元素的定义：[artplayer/types/template.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/template.d.ts)

:::

## events

管理播放器所有的 `DOM` 事件

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.log(art.events);
```

:::warning 提示

假如你需要一些 `DOM` 事件只存在于播放器的生命周期上时，强烈建议使用这些函数，以避免造成内存泄漏

:::

## storage

## icons

## i18n

## notice

## player

## layers

## controls

## contextmenu

## subtitle

## info

## loading

## hotkey

## mask

## setting

## plugins

## mobile