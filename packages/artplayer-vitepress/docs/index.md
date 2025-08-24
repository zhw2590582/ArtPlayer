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
  <div ref="$container" />
</template>

<script>
import Artplayer from 'artplayer'
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['getInstance'])

const art = shallowRef(null)
const $container = ref(null)

onMounted(() => {
  art.value = new Artplayer({
    ...props.option,
    container: $container.value,
  })
  emit('getInstance', art.value)
})

onBeforeUnmount(() => {
  art.value.destroy(false)
})
</script>
```

```vue [app.vue]
<template>
  <Artplayer :option="option" :style="style" @get-instance="getInstance" />
</template>

<script setup>
import { reactive } from 'vue'
import Artplayer from './Artplayer.vue'

const option = reactive({
  url: 'path/to/video.mp4',
})

const style = reactive({
  width: '600px',
  height: '400px',
  margin: '60px auto 0',
})

function getInstance(art) {
  console.log(art)
}
</script>
```

:::

::: warning Artplayer 非响应式：

在 `Vue.js` 里直接修改 `option` 是不会改变播放器的

:::

## `React.js`

::: code-group

```jsx [Artplayer.jsx]
import Artplayer from 'artplayer'
import { useEffect, useRef } from 'react'

export default function Player({ option, getInstance, ...rest }) {
  const $container = useRef()

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: $container.current,
    })

    if (typeof getInstance === 'function') {
      getInstance(art)
    }

    return () => art.destroy(false)
  }, [])

  return <div ref={$container} {...rest}></div>
}
```

```jsx [app.jsx]
import Artplayer from './Artplayer.jsx'

function App() {
  return (
    <div>
      <Artplayer
        option={{
          url: 'path/to/video.mp4',
        }}
        style={{
          width: '600px',
          height: '400px',
          margin: '60px auto 0',
        }}
        getInstance={art => console.log(art)}
      />
    </div>
  )
}

export default App
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
import Artplayer from 'artplayer/dist/artplayer.legacy.js'
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

## ECMAScript Module

::: tip ESM Demo:

[https://artplayer.org/esm.html](https://artplayer.org/esm.html)

:::

从 `5.2.6` 开始，`artplayer` 和所有插件还会提供一个 `ESM` 版本的 `mjs`，如：

- `artplayer/dist/artplayer.mjs`
- `artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.mjs`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>ArtPlayer ESM with Import Map</title>
    <style>
        #player {
            width: 640px;
            height: 360px;
            margin: 50px auto;
            border: 1px solid #ccc;
        }
    </style>
    <script type="importmap">
    {
        "imports": {
            "artplayer": "https://unpkg.com/artplayer/dist/artplayer.esm.js"
        }
    }
    </script>
</head>

<body>
    <div id="player"></div>
    <script type="module">
        import Artplayer from 'artplayer';

        const art = new Artplayer({
            container: '#player',
            url: '/assets/sample/video.mp4',
        });
    </script>
</body>

</html>
```

## 自定义 userAgent

目前对于是否移动设备的判断并不准确，有时候希望通过改变 `userAgent` 来调整播放器的UI, 所以在 `5.2.4` 开始新增了一个 `globalThis.CUSTOM_USER_AGENT` 全局变量。

```html
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
        <script>globalThis.CUSTOM_USER_AGENT = 'iphone'</script>
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

::: warning 提示

你需要在引入 `Artplayer` 依赖前来修改它才会生效

:::
