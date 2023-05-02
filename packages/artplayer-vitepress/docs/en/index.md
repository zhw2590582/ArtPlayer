::: danger Important Note
The English document has not yet been completed, everything is subject to the Chinese document.
:::

# Install

## Install

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

## Use

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

::: warning Tip

The size of the player depends on the size of the `container`, so your `container` must have a size

:::

::: tip The following links can see more use examples

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

::: warning Tip

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

::: warning Tip

Modifying `option` directly in `React.js` will not change the player

:::

## TypeScript

The `artplayer.d.ts` that is automatically imported when importing `Artplayer`, but you can also import the type of options individually

```ts{2}
import Artplayer from 'artplayer';
import { type Option } from 'artplayer/types/option';

const option: Option = {
    container: '.artplayer-app',
    url: './assets/sample/video.mp4',
};

option.volume = 0.5;

const art = new Artplayer(option);
```

::: tip All TypeScript definitions

[packages/artplayer/types](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer/types)

:::


## JavaScript

Sometimes your `js` file will lose the type prompt of `TypeScript`. At this time, you can manually import the type

Variable:

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

Option:

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

## Old browsers

Production builds of `artplayer.js` are only compatible with the last major version of `Chrome`: `last 1 Chrome version`

For older browsers, use the `artplayer.legacy.js` file, compatible up to: `IE 11`

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

::: tip If you want to be compatible with older browsers, please modify the following configuration and build it yourself:

Build configuration: [/scripts/build.js](https://github.com/zhw2590582/ArtPlayer/blob/master/scripts/build.js#L29)

Reference documents: [browserslist](https://github.com/browserslist/browserslist#full-list)

:::

