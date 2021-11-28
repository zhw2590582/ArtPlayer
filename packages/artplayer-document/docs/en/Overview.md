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
              idth:400px;
              height:300px
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

Create component: `Artplayer.vue`

```js
import Artplayer from 'artplayer';

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
        getInstance: Function,
    },
    mounted() {
        this.instance = new Artplayer({
            ...this.option,
            container: this.$refs.artRef,
        });

        this.$nextTick(() => {
            this.$emit('getInstance', this.instance);
        });
    },
    beforeDestroy() {
        if (this.instance && this.instance.destroy) {
            this.instance.destroy();
        }
    },
    render(h) {
        return h('div', {
            ref: 'artRef',
        });
    },
};
```

Import the `Artplayer.vue` component

```jsx
<template>
  <Artplayer @get-instance="getInstance" :option="option" :style="style" />
</template>

<script>
import Artplayer from "./Artplayer.vue";

export default {
  data() {
    return {
      option: {
        url: "https://artplayer.org/assets/sample/video.mp4",
      },
      style: {
        width: "600px",
        height: "400px",
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

Create component: `Artplayer.jsx`

```jsx
import React from 'react';
import Artplayer from 'artplayer';

export default class ArtplayerReact extends React.Component {
    constructor(props) {
        super(props);
        this.instance = null;
        this.artRef = React.createRef();
    }

    componentDidMount() {
        const { option, getInstance } = this.props;
        this.instance = new Artplayer({
            ...option,
            container: this.artRef.current,
        });

        if (getInstance && typeof getInstance === 'function') {
            getInstance(this.instance);
        }
    }

    componentWillUnmount() {
        if (this.instance && this.instance.destroy) {
            this.instance.destroy();
        }
    }

    render() {
        const { option, getInstance, ...rest } = this.props;
        return React.createElement('div', {
            ref: this.artRef,
            ...rest,
        });
    }
}
```

Import the `Artplayer.jsx` component

```jsx
import Artplayer from "./Artplayer.jsx";

function App() {
  return (
    <Artplayer
      option={{
        url: "https://artplayer.org/assets/sample/video.mp4",
      }}
      style={{
        width: "600px",
        height: "400px",
      }}
      getInstance={ins => console.log(ins)}
    />
  );
}
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
