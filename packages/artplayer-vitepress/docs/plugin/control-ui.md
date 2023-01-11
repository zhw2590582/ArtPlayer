# 控制器皮肤

## 演示

👉 [查看完整演示](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-control/index.js&example=control)

## 安装

::: code-group

```bash [npm]
npm install artplayer-plugin-control
```

```bash [yarn]
yarn add artplayer-plugin-control
```

```bash [pnpm]
pnpm add artplayer-plugin-control
```

```html [script]
<script src="path/to/artplayer-plugin-control.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-control/dist/artplayer-plugin-control.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-control/dist/artplayer-plugin-control.js
```

:::

## 使用

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-control/index.js">
    ▶ Run Code
</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginControl(),
    ],
});
```

## `enable`

- Type: `Getter/Setter`
- Parameter: `Boolean`

是否启用新的控制器皮肤

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-control/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
    controls: [
        {
            position: 'right',
            html: '<button type="button">Switch UI</button>',
            click: function () {
                const { enable } = art.plugins.artplayerPluginControl;
                art.plugins.artplayerPluginControl.enable = !enable;
            },
        },
    ],
    plugins: [
        artplayerPluginControl(),
    ],
});
```