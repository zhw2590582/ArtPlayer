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

## `CDN`

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
        <script src="path/to/artplayer.js"></script>
        <script>
          const art = new Artplayer({
              container: '.artplayer-app',
              url: 'path/to/video.mp4',
          });
        </script>
    </body>
</html>
```

::: 

::: warning 提示

播放器的尺寸依赖于容器 `container` 的尺寸，所以你的容器 `container` 必须是有尺寸的

:::

::: tip 以下链接可以看到更多的使用例子

[/packages/artplayer-template](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-template)

:::

## `Vue.js`

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
  beforeDestroy() {
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
      console.info(art);
    },
  },
};
</script>
```

:::

::: warning Artplayer 非响应式：

在 `Vue.js` 里直接修改 `option` 是不会改变播放器的

:::

## `React.js`

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
                getInstance={(art) => console.info(art)}
            />
        </div>
    );
}

export default App;
```

:::

::: warning Artplayer 非响应式：

在 `React.js` 里直接修改 `option` 是不会改变播放器的

:::

## TypeScript

导入 `Artplayer` 时会自动导入的 `artplayer.d.ts`

### Vue.js

```vue{3}
<script setup>
import Artplayer from 'artplayer';
const art = ref<Artplayer>(null);
art.value = new Artplayer();
</script>
```

### React.js

```jsx{2}
import Artplayer from 'artplayer';
const art = useRef<Artplayer>(null);
art.current = new Artplayer();
```

### Option

你也可以使用选项的类型

```ts{3}
import Artplayer from 'artplayer';

const option: Artplayer['Option'] = {
    container: '.artplayer-app',
    url: './assets/sample/video.mp4',
};

option.volume = 0.5;

const art = new Artplayer(option);
```

::: tip 全部 TypeScript 定义

[packages/artplayer/types](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer/types)

:::

## JavaScript

有时你的 `js` 文件会丢失 `TypeScript` 的类型提示，这时候你可以手动导入类型 

变量：

```js{1-3}
/**
 * @type {import("artplayer")}
 */
let art = null;
```

参数：

```js{1-3}
/**
 * @param {import("artplayer")} art
 */
function getInstance(art) {
  //
}
```

属性：

```js{4-6}
export default {
  data() {
    return {
      /**
       * @type {import("artplayer")}
       */
      art: null,
    }
  }
}
```

选项：

```js{1-3}
/**
 * @type {import("artplayer/types/option").Option}
 */

const option = {
    container: '.artplayer-app',
    url: './assets/sample/video.mp4',
};

option.volume = 0.5;

const art8 = new Artplayer(option);
```

## 古老的浏览器

生产构建的 `artplayer.js` 只兼容最新一个主版本的 `Chrome`：`last 1 Chrome version`

对于古老的浏览器，可以使用 `artplayer.legacy.js` 文件，可以兼容到：`IE 11`

```js
import Artplayer from 'artplayer/dist/artplayer.legacy.js';
```

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.legacy.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer/dist/artplayer.legacy.js
```

:::

::: tip 假如你要兼容更古老的浏览器时，请修改以下配置然后自行构建：

构建配置：[scripts/build.js](https://github.com/zhw2590582/ArtPlayer/blob/master/scripts/build.js#L29)

参考文档：[browserslist](https://github.com/browserslist/browserslist#full-list)

:::

