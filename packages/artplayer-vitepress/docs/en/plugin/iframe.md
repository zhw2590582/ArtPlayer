# Iframe Control

## Description

With this plugin, you can easily control the player inside the cross-domain `iframe.html` page from within `index.html`. For example, you can control the functionalities of the `iframe.html` player from `index.html` or retrieve the values of the `iframe.html` player.

## Demonstration

👉 [View full demonstration](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-iframe/index.js&example=iframe)

## Installation

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

## Usage

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
## `index.html` Interface

### `commit`

Push messages from `index.html` to `iframe.html`. This function will run inside `iframe.html` and can also be used to asynchronously retrieve values from within `iframe.html`.

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

Receive messages from `iframe.html` in `index.html`

```js
iframe.message((event) => {
    console.info(event);
});
```

### `destroy`

After destruction, `index.html` can no longer communicate with `iframe.html`

```js
iframe.destroy();
```

## `iframe.html` Interface

:::warning Warning

The `iframe.html` interface can only run inside `iframe.html`

:::

### `inject`

Inject a script, receive messages from `index.html`

```js
ArtplayerPluginIframe.inject();
```

### `postMessage`

Push messages to `index.html`

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
            const $iframe = document.querySelector('#iframe');
            const iframe = new ArtplayerPluginIframe({
                iframe: $iframe,
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
