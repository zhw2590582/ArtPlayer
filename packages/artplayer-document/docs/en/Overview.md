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

### Use in `Vue`

👉 [Click to open an online demo](https://codesandbox.io/s/artplayer-vue-demo-3lz7m?file=/src/App.vue)

```jsx
<template>
  <Artplayer @get-instance="getInstance" :option="option" :style="style" />
</template>

<script>
import Artplayer from "artplayer/examples/vue/Artplayer";

export default {
  data() {
    return {
      option: {
        url: "https://artplayer.org/assets/sample/video.mp4",
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

### Use in `React`

👉 [Click to open an online demo](https://codesandbox.io/s/artplayer-react-demo-n74859y9rl?file=/src/index.js)

```jsx
import React from "react";
import ReactDOM from "react-dom";
import Artplayer from "artplayer/examples/react/Artplayer";

function App() {
  return (
    <div>
      <Artplayer
        option={{
          url: "https://artplayer.org/assets/sample/video.mp4"
        }}
        style={{
          width: "600px",
          height: "400px",
          margin: "60px auto 0"
        }}
        getInstance={(art) => console.log(art)}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

:::caution Tip

Modifying `option` not dynamically modified ArtPlayer instances in `Vue` and `React`

:::

## Demo

:::tip Tip

In this document, by clicking the `Run Code` button before the code block, you can immediately enter the demo.

:::

----------------------------------------------

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```
