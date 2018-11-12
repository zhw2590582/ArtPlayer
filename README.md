# ArtPlayer
![version](https://badgen.net/npm/v/artplayer)
![license](https://badgen.net/npm/license/artplayer)
![size](https://badgen.net/bundlephobia/minzip/artplayer)

> ArtPlayer is a modern HTML5 video player

## Status
⚠️  This project is WIP and not ready for production use yet!

## Demo
[Checkout the demo](https://blog.zhw-island.com/ArtPlayer/)

## Introduction

## Install

```
$ npm install --save artplayer
```

```js
import Artplayer from 'artplayer';
import 'artplayer/dist/artplayer.css';
```

OR umd builds are also available

```html
<link rel="stylesheet" href="path/to/artplayer.css">
<script src="path/to/artplayer.js"></script>
```

Will expose the global variable to `window.Artplayer`.

## Usage

```html
<div class="artplayer-app"></div>
```

```js
var app = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
});
```

Note: You need to initialize a size for the container element, like:

```css
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

## Configuration

## API

## Issue

## Contributors

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
