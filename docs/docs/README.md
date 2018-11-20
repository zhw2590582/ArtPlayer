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

- Type: `String、Element`
- Default: `#artplayer`
- Required: `true`

DOM container of the player

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  // container: document.querySelector('.artplayer-app'),
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});
```

You may need to initialize a size for the container element, like:

```css
.artplayer-app {
  width: 400px;
  height: 300px;
}
```

## url

- Type: `String`
- Default: ``
- Required: `true`

Video source url, Three video file formats are supported: mp4, ogg, webm

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',  
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  // url: url + '/video/one-more-time-one-more-chance-480p.ogg',
  // url: url + '/video/one-more-time-one-more-chance-480p.webm',
});
```

## poster

- Type: `String`
- Default: ``

Video poster image url

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  poster: url + '/image/one-more-time-one-more-chance-poster.jpg',
});
```

## title

- Type: `String`
- Default: ``

Video title, will be shown in screenshot file name and pip mode

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  title: '【新海诚动画】『秒速5センチメートル』',
});
```

## volume

- Type: `Number`
- Default: `0.7`

Default volume, player will cache the last volume, which may be overwritten

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  volume: 0.5,
});
```

## autoplay

- Type: `Boolean`
- Default: `false`

Whether to play automatically, sometimes it doesn't necessarily succeed

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  autoplay: true,
});
```

## autoSize

- Type: `Boolean`
- Default: `false`

Keep the original video aspect ratio and automatically zoom

[Run Code](/)

```js
// Zoom browser window
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  autoSize: true,
});
```

## loop

- Type: `Boolean`
- Default: `false`

Automatic loop playback

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  loop: true,
});
```

## playbackRate

- Type: `Boolean`
- Default: `false`

Whether to show playback rate controller in the contextmenu

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  playbackRate: true,
});
```

## aspectRatio

- Type: `Boolean`
- Default: `false`

Whether to show aspect ratio controller in the contextmenu

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  aspectRatio: true,
});
```

## screenshot

- Type: `Boolean`
- Default: `false`

Whether to show screenshot controller in the bottom

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  screenshot: true,
});
```

## setting

- Type: `Boolean`
- Default: `false`

Whether to show setting controller in the bottom

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  setting: true,
});
```

## pip

- Type: `Boolean`
- Default: `false`

Whether to show pip controller in the bottom

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  pip: true,
});
```

## fullscreen

- Type: `Boolean`
- Default: `false`

Whether to show window fullscreen controller in the bottom

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  fullscreen: true,
});
```

## fullscreenWeb

- Type: `Boolean`
- Default: `false`

Whether to show web page fullscreen controller in the bottom

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  fullscreenWeb: true,
});
```

## mutex

- Type: `Boolean`
- Default: `false`

Player mutually exclusive, only one player can play at a time

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  mutex: true,
});
```

## hotkey

- Type: `Boolean`
- Default: `true`

Whether to use hotkey

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  hotkey: true,
});
```

# API

> TODO...

# Event

> TODO...

# Issue

> TODO...
