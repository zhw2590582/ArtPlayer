# ArtPlayer
> ArtPlayer is a modern HTML5 video player

## Status
⚠️ This project is WIP and not ready for production use yet!

## Demo
[Checkout the demo](https://blog.zhw-island.com/ArtPlayer/)

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

Expose the global variable to `window.Artplayer`.

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

Note: You need to initialize a size for the container element.