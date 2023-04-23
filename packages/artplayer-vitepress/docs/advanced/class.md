# 静态属性

这里的 `静态属性` 是指挂载在 `构造函数` 的 `一级属性`，非常少使用

## `instances`

返回全部播放器实例的数组，假如你想同时管理多个播放器的时候，可以用到该属性

<div className="run-code">▶ Run Code</div>

```js
console.info([...Artplayer.instances]);

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info([...Artplayer.instances]);
```

## `version`

返回播放器的版本信息

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.version);
```

## `env`

返回播放器的环境变量

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.env);
```

## `build`

返回播放器的打包时间

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.build);
```

## `config`

返回视频的默认配置

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.config);
```

## `utils`

返回播放器的工具函数集合

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.utils);
```

:::warning 全部工具函数请参考以下地址：

[artplayer/types/utils.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/utils.d.ts)

:::

## `scheme`

返回播放器选项的校验方案

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.scheme);
```

## `Emitter`

返回事件分发器的构造函数

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.Emitter);
```

## `validator`

返回选项的校验函数

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.validator);
```

## `kindOf`

返回类型检测的函数工具

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.kindOf);
```

## `html`

返回播放器所需的 `html` 字符串

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.html);
```

## `option`

返回播放器的默认选项

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.option);
```