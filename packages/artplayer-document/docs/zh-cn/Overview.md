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

### 与 `Vue` 使用

👉 [点击打开在线演示](https://codesandbox.io/s/artplayer-vue-demo-3lz7m?file=/src/App.vue)

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

### 与 `React` 使用

👉 [点击打开在线演示](https://codesandbox.io/s/artplayer-react-demo-n74859y9rl?file=/src/index.js)

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

:::caution 提示

在 `Vue` 和 `React` 里修改 `option` 不能动态修改 `Artplayer` 实例

:::

## 演示

:::tip 提示

本文档里，通过点击代码块前的 `Run Code` 按钮，可以马上进入演示

:::

----------------------------------------------

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```
