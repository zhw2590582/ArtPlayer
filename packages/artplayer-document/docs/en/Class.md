---
title: 静态属性
sidebar_position: 5
slug: /class
---

:::tip 提示

静态属性存在于构造函数 `Artplayer` 上，和播放器实例没有直接关联

:::

## instances

-   类型: `Array`

一个保存了所有播放器实例的数组，当单个页面同时存在多个播放器时，可以通过这个属性进行管理多个实例

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(Artplayer.instances.length)
})
```

## version

-   类型: `String`

当前播放器版本号

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.version)
```

## env

-   类型: `String`

当前播放器环境变量

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.env)
```

## utils

-   类型: `Object`

播放器的常用工具集

<div className="run-code">▶ Run Code</div>

```js
console.info(Object.keys(Artplayer.utils))
```

## config

-   类型: `Object`

存放了播放器的原生属性和方法

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.config)
```

## scheme

-   类型: `Object`

播放器参数的校验方案

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.scheme)
```

## validator

-   类型: `Function`

播放器参数的校验器

## option

-   类型: `Object`

播放器默认参数

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.option)
```

## html

-   类型: `String`

播放器默认 `Html` 字符串，通常用于 `SSR` 的提前渲染，更多信息请访问 [配合SSR使用](/document/zh-cn/Questions/ssr)

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.html)
```

## kindOf

-   类型: `Function`

JS类型识别函数

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.kindOf('0'))
console.info(Artplayer.kindOf(0))
console.info(Artplayer.kindOf({}))
console.info(Artplayer.kindOf([]))
```