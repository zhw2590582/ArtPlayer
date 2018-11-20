# Getting started

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
<link rel="stylesheet" href="path/to/artplayer.css" />
<script src="path/to/artplayer.js"></script>
```

Will expose the global variable to `window.Artplayer`.

## Usage

```html
<div class="artplayer-app"></div>
```

```js
var art = new Artplayer({
  container: '.artplayer-app',
  url: 'path/to/video.mp4'
});
```

# Configuration

## container

- Type: `String、element`
- Default: `#artplayer`
- Required: `true`

DOM container of the player

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  // container: document.querySelector('.artplayer-app'),
  url: url + '/video/one-more-time-one-more-chance-480p.mp4'
});
```

You may need to initialize a size for the container element, like:

```css
.artplayer-app {
  width: 400px;
  height: 300px;
}
```

# API

> TODO...

# Event

> TODO...

# Issue

> TODO...
