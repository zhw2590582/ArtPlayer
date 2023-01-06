# 安装使用

## 安装

::: code-group

```bash [npm]
npm install artplayer
```

```bash [yarn]
yarn add artplayer
```

```bash [pnpm]
pnpm add artplayer
```

```html [script]
<script src="path/to/artplayer.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer/dist/artplayer.js
```

:::

## 使用

::: code-group

```js [index.js]
import Artplayer from 'artplayer';

const art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
});
```

```html [index.html]
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
    </body>
</html>
```

::: 

::: warning 提示

播放器的尺寸依赖于容器 `container` 的尺寸，所以你的容器 `container` 必须是有尺寸的

:::

::: tip 以下链接可以看到更多的使用例子

https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template

:::

## `Vue.js` 或 `Nuxt.js`

::: code-group

```vue [Artplayer.vue]
<template>
  <div ref="artRef"></div>
</template>

<script>
import Artplayer from "artplayer";

export default {
  data() {
    return {
      instance: null,
    };
  },
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.instance = new Artplayer({
      ...this.option,
      container: this.$refs.artRef,
    });

    this.$nextTick(() => {
      this.$emit("get-instance", this.instance);
    });
  },
  beforeUnmount() {
    if (this.instance && this.instance.destroy) {
      this.instance.destroy(false);
    }
  },
};
</script>
```

```vue [app.vue]
<template>
  <Artplayer @get-instance="getInstance" :option="option" :style="style" />
</template>

<script>
import Artplayer from "./Artplayer.vue";

export default {
  data() {
    return {
      option: {
        url: "path/to/video.mp4",
      },
      style: {
        width: "600px",
        height: "400px",
        margin: "60px auto 0",
      },
    };
  },
  components: {
    Artplayer,
  },
  methods: {
    getInstance(art) {
      console.log(art);
    },
  },
};
</script>
```

:::

## `React.js` 或 `Next.js`

::: code-group

```jsx [Artplayer.jsx]
import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';

export default function Player({ option, getInstance, ...rest }) {
    const artRef = useRef();

    useEffect(() => {
        const art = new Artplayer({
            ...option,
            container: artRef.current,
        });

        if (getInstance && typeof getInstance === 'function') {
            getInstance(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, []);

    return <div ref={artRef} {...rest}></div>;
}
```

```jsx [app.jsx]
import React from 'react';
import Artplayer from './ArtPlayer.jsx';

function App() {
    return (
        <div>
            <Artplayer
                option={{
                    url: 'https://artplayer.org/assets/sample/video.mp4',
                }}
                style={{
                    width: '600px',
                    height: '400px',
                    margin: '60px auto 0',
                }}
                getInstance={(art) => console.log(art)}
            />
        </div>
    );
}

export default App;
```

:::

## 语法提示

有时你的 `js` 文件会丢失 `TypeScript` 的语法提示，这时候你可以手动导入类型 

```js
/**
 * @typedef { import("artplayer/types/artplayer") } Artplayer
 */

/**
 * @type {Artplayer} - 一个 Artplayer 实例
 */
const art = {};
```

```js
/**
 * @typedef { import("artplayer/types/artplayer") } Artplayer
 */

/**
 * @param {Artplayer}  art - 一个 Artplayer 实例
 */
function getInstance(art) {
  //
}
```