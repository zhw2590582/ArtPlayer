# Installation and Usage

## Installation

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

## Usage

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
::: warning Warning

The player's size depends on the size of the container `container`, so your container `container` must have a size.

:::

::: tip You can find more usage examples at the link below

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


::: warning Artplayer Not Responsive：

Modifying `option` directly in `Vue.js` will not change the player

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

::: warning Non-responsive Artplayer

In `React.js`, directly modifying the `option` will not change the player

:::

## TypeScript

Importing `Artplayer` will automatically import `artplayer.d.ts`

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

You can also use the option type

```ts{3}
import Artplayer from 'artplayer';

const option: Artplayer['Option'] = {
    container: '.artplayer-app',
    url: './assets/sample/video.mp4',
};

option.volume = 0.5;

const art = new Artplayer(option);
```

::: tip Complete TypeScript Definitions

[packages/artplayer/types](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer/types)

:::
## JavaScript

Sometimes your `js` file may lose the `TypeScript` type hints, in this case, you can manually import the types

Variables:

```js{1-3}
/**
 * @type {import("artplayer")}
 */
let art = null;
```

Parameters:

```js{1-3}
/**
 * @param {import("artplayer")} art
 */
function getInstance(art) {
  //
}
```

Properties:

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

Options:

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
## Ancient Browsers

The production build of `artplayer.js` is only compatible with the latest major version of `Chrome`: `last 1 Chrome version`

For ancient browsers, you can use the `artplayer.legacy.js` file, which is compatible up to: `IE 11`

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

::: tip If you need to support even older browsers, please modify the following configuration and then build it yourself:

Build configuration: [scripts/build.js](https://github.com/zhw2590582/ArtPlayer/blob/master/scripts/build.js#L29)

Refer to documentation: [browserslist](https://github.com/browserslist/browserslist#full-list)

:::

## ECMAScript Module

::: tip ESM Demo:

[https://artplayer.org/esm.html](https://artplayer.org/esm.html)

:::

Starting from `5.2.6`, `artplayer` and all plugins will also provide an `ESM` version of `mjs`, such as:

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
            "artplayer": "https://unpkg.com/artplayer/dist/artplayer.mjs"
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

## Custom userAgent

Currently, the determination of mobile devices is not accurate. Sometimes, you may want to adjust the player UI by changing the `userAgent`. Therefore, starting in version `5.2.4`, we added a new `globalThis.CUSTOM_USER_AGENT` global variable.

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

::: warning Warning

You need to modify it before import the `Artplayer` for it to take effect

:::
