---
title: Quick start
sidebar_position: 1
slug: /
---

## Install

### Install by `npm`:

```bash
$ npm install artplayer
```

### Install by `yarn`:

```bash
$ yarn add artplayer
```

Then load the `Artplayer` module:

```js
// ES6
import Artplayer from 'artplayer';

// CommonJS
const Artplayer = require('artplayer');
```

### Install by `script`:

```html
<!-- locally -->
<script src="path/to/artplayer.js"></script>

<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/artplayer/dist/artplayer.js"></script>
```

Then you can access the constructor via `window.ArtPlayer`


## Use

:::danger Tip

The size of the player depends on the size of the `container`, so your `container` must have a size.

:::

### Use in `Html`

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

### Use in `Vue.js`

[artplayer-template/vue.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/vue.js)

### Use in `React.js`

[artplayer-template/react.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/react.js)

### Use in `Next.js`

[artplayer-template/next.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/next.js)

### Use in `Nuxt.js`

[artplayer-template/nuxt.js](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template/nuxt.js)
