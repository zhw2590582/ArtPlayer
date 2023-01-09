# Iframe 控制

## 说明

通过该插件，你可以轻松在 `主页面` 里控制 `iframe` 页面里的播放器。如在 `主页面` 里通过代码控制 `iframe` 播放器的功能，或者获取 `iframe` 播放器的值等等

## 演示

👉 [查看完整演示](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-iframe/index.js&example=iframe)

## 安装

::: code-group

```bash [npm]
npm install artplayer-plugin-iframe
```

```bash [yarn]
yarn add artplayer-plugin-iframe
```

```bash [pnpm]
pnpm add artplayer-plugin-iframe
```

```html [script]
<script src="path/to/artplayer-plugin-iframe.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-iframe/dist/artplayer-plugin-iframe.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-iframe/dist/artplayer-plugin-iframe.js
```

:::

## index.html

```html showLineNumbers title="index.html"
<!DOCTYPE html>
<html>
    <head>
        <title>ArtPlayer</title>
        <meta charset="UTF-8" />
    </head>
    <body>
        <iframe id="iframe"></iframe>
        <script src="path/to/artplayer-plugin-iframe.js"></script>
        <script>
            const iframe = new ArtplayerPluginIframe({
                // iframe 元素
                iframe: document.querySelector('#iframe'),
                // iframe 地址
                url: 'path/to/iframe.html',
            });

            // 向 iframe 发送消息
            iframe.commit(() => {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: 'path/to/video.mp4',
                });
            });
        </script>
    </body>
</html>
```

## iframe.html

```html showLineNumbers title="iframe.html"
<!DOCTYPE html>
<html>
    <head>
        <title>ArtPlayer</title>
        <meta charset="UTF-8" />
        <style>
            html,
            body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body>
        <div class="artplayer-app" style="width: 100%; height: 100%;"></div>
        <script src="path/to/artplayer.js"></script>
        <script src="path/to/artplayer-plugin-iframe.js"></script>
        <script>
            // 注入脚本，接收来自实例的消息
            ArtplayerPluginIframe.inject();
        </script>
    </body>
</html>
```

## 实例接口

### `commit`

将消息推送到 iframe，该函数将在 iframe 内部运行

```js
iframe.commit(() => {
    var art = new Artplayer({
        container: '.artplayer-app',
        url: 'path/to/video.mp4',
    });
});

iframe.commit(() => {
    art.seek = 5;
});

// 获取来自 iframe 的值
(async function () {
    // 使用 return 关键词
    var currentTime = await iframe.commit(() => {
        return art.currentTime;
    });

    // 或者使用 resolve 方法
    var currentTime2 = await iframe.commit((resolve) => {
        setTimeout(() => {
            resolve(art.currentTime);
        }, 1000);
    });
})();
```

### `message`

接收来自 iframe 的消息

```js
iframe.message((event) => {
    console.info(event);
});
```

### `destroy`

销毁实例，销毁后无法与 iframe 通信

```js
iframe.destroy();
```

## Iframe 接口

:::warning 提示

`Iframe 接口` 只能运行在 `iframe` 里

:::

### `inject`

注入脚本，接收来自实例的消息

```js
ArtplayerPluginIframe.inject();
```

### `postMessage`

将消息推送到实例

```js
iframe.message((event) => {
    console.info(event);
});

iframe.commit(() => {
    ArtplayerPluginIframe.postMessage({
        type: 'currentTime',
        data: art.currentTime,
    });
});
```
