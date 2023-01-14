# Iframe 控制

## 说明

通过该插件，你可以轻松在 `index.html` 里控制跨域 `iframe.html` 页面里的播放器，如在 `index.html` 里通过代码控制 `iframe.html` 播放器的功能，或者获取 `iframe.html` 播放器的值

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

## `CDN`

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-iframe/dist/artplayer-plugin-iframe.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-iframe/dist/artplayer-plugin-iframe.js
```

:::

## 使用

::: code-group

```html [index.html]
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
                // Iframe element
                iframe: document.querySelector('#iframe'),
                // Iframe url
                url: 'path/to/iframe.html',
            });

            // Send message to iframe
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

```html [iframe.html]
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
            // Inject scripts to receive messages from instances
            ArtplayerPluginIframe.inject();
        </script>
    </body>
</html>
```

:::

## `index.html` 接口

### `commit`

从 `index.html` 将消息推送到 `iframe.html`，该函数将在 `iframe.html` 内部运行，同时它也能用于异步获取 `iframe.html` 里的值

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

// Get the value from the iframe.html
(async function () {
    // Use the return keyword
    var currentTime = await iframe.commit(() => {
        return art.currentTime;
    });

    // or use the resolve method
    var currentTime2 = await iframe.commit((resolve) => {
        setTimeout(() => {
            resolve(art.currentTime);
        }, 1000);
    });
})();
```

### `message`

在 `index.html` 接收来自 `iframe.html` 的消息

```js
iframe.message((event) => {
    console.info(event);
});
```

### `destroy`

销毁后 `index.html` 无法与 `iframe.html` 通信

```js
iframe.destroy();
```

## `iframe.html` 接口

:::warning 提示

`iframe.html` 接口 只能运行在 `iframe.html` 里

:::

### `inject`

注入脚本，接收来自 `index.html` 的消息

```js
ArtplayerPluginIframe.inject();
```

### `postMessage`

将消息推送到 `index.html`

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

## 例子

最常遇到的问题是，播放器在 `iframe.html` 里进行网页全屏，但在 `index.html` 是不生效的，这时候只要监听 `iframe.html` 里的 `fullscreenWeb` 事件并通知到 `index.html` 即可

::: code-group

```html [index.html]

<!DOCTYPE html>
<html>
    <head>
        <title>ArtPlayer</title>
        <meta charset="UTF-8" />
    </head>
    <body>
        <iframe id="iframe"></iframe>
        <script src="path/to/artplayer-plugin-iframe.js"></script>
        <style>
            .fullscreenWeb {
                position: fixed;
                z-index: 9999;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
            }
        </style>
        <script>
            const iframe = new ArtplayerPluginIframe({
                iframe: document.querySelector('#iframe'),
                url: 'path/to/iframe.html',
            });

            iframe.message(({ type, data }) => {
                switch (type) {
                    case 'fullscreenWeb':
                        if (data) {
                            $iframe.classList.add('fullscreenWeb');
                        } else {
                            $iframe.classList.remove('fullscreenWeb');
                        }
                        break;
                    default:
                        break;
                }
            });

            iframe.commit(() => {
                var art = new Artplayer({
                    container: '.artplayer-app',
                    url: 'path/to/video.mp4',
                });

                art.on('fullscreenWeb', (state) => {
                    ArtplayerPluginIframe.postMessage({
                        type: 'fullscreenWeb',
                        data: state,
                    });
                });
            });
        </script>
    </body>
</html>

```

```html [iframe.html]

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
            ArtplayerPluginIframe.inject();
        </script>
    </body>
</html>

```

:::