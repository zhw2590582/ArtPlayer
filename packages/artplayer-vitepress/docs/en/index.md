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

::: tip You can see more examples of use at the following link

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
::: warning Artplayer Not Responsive：

Modifying `option` directly in `Vue.js` will not change the player

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
::: warning Non-responsive Artplayer:

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

::: tip If you need to support even older browsers, please modify the following configuration and then build it yourself:

Build configuration: [scripts/build.js](https://github.com/zhw2590582/ArtPlayer/blob/master/scripts/build.js#L29)

Refer to documentation: [browserslist](https://github.com/browserslist/browserslist#full-list)

:::
