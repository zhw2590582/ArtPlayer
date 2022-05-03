---
title: 快速上手
sidebar_position: 1
slug: /zh-cn
---

## 安装

### 通过 `npm` 安装：

```bash
$ npm install artplayer
```

### 通过 `yarn` 安装：

```bash
$ yarn add artplayer
```

然后加载 `artplayer` 模块：

```js
// ES6
import Artplayer from 'artplayer';

// CommonJS
const Artplayer = require('artplayer');
```

### 通过 `script` 安装：

```html
<!-- locally -->
<script src="path/to/artplayer.js"></script>

<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/artplayer/dist/artplayer.js"></script>
```

然后你可以通过 `window.Artplayer` 访问到构造函数

## 使用

:::danger 提示

播放器的尺寸依赖于容器 `container` 的尺寸，所以你的容器 `container` 必须是有尺寸的

:::

### 在 `Html` 使用

```html
<!DOCTYPE html>
<html>
    <head>
        <title>ArtPlayer Demo</title>
        <meta charset="UTF-8" />
        <style>
          .artplayer-app {
              width: 400px;
              height: 300px;
          }
        </style>
    </head>
    <body>
        <div class="artplayer-app"></div>
        <script src="path/to/artplayer.js"></script>
        <script>
            var art = new Artplayer({
                container: '.artplayer-app',
                url: '/assets/sample/video.mp4',
            });
        </script>
    </body>
</html>
```

### 与 `Vue.js` 使用

[artplayer-template/vue.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/vue.js)

### 与 `React.js` 使用

[artplayer-template/react.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/react.js)

### 与 `Next.js` 使用

[artplayer-template/next.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/next.js)

### 与 `Nuxt.js` 使用

[artplayer-template/nuxt.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/nuxt.js)
