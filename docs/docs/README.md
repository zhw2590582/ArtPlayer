# Getting started

## Install

Install with `npm`

```
$ npm install artplayer
```
Or install with `yarn`

```
$ yarn add artplayer
```

```js
import Artplayer from 'artplayer';
import 'artplayer/dist/artplayer.css';
```

Or umd builds are also available

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
  url: url + '/video/one-more-time-one-more-chance-480p.mp4'
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
  poster: url + '/image/one-more-time-one-more-chance-poster.jpg'
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
  title: '【新海诚动画】『秒速5センチメートル』'
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
  volume: 0.5
});
```

## muted

- Type: `Boolean`
- Default: `false`

Whether to mute by default

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  muted: true
});
```

## autoplay

- Type: `Boolean`
- Default: `false`

Whether to play automatically, sometimes it doesn't necessarily succeed

More info: [autoplay-policy-changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  autoplay: true
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
  autoSize: true
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
  loop: true
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
  playbackRate: true
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
  aspectRatio: true
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
  screenshot: true
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
  setting: true
});
```

## pip

- Type: `Boolean`
- Default: `false`

Whether to show pip controller in the bottom, it will give priority to the native picture-in-picture feature.

More info: [picture-in-picture](https://developers.google.com/web/updates/2017/09/picture-in-picture)

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  pip: true
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
  fullscreen: true
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
  fullscreenWeb: true
});
```

## mutex

- Type: `Boolean`
- Default: `true`

Player mutually exclusive, only one player can play at a time

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  mutex: true
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
  hotkey: true
});
```

| Key     | Description     |
| ------- | --------------- |
| `↑`     | Increase volume |
| `↓`     | Decrease volume |
| `←`     | Seek backward   |
| `→`     | Seek forward    |
| `space` | Toggle playback |

## lang

- Type: `String`
- Default: `navigator.language.toLowerCase()`

Default display language: en, zh-cn, zh-tw

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  lang: 'en'
});
```

## theme

- Type: `String`
- Default: `#f00`

Default display language: en, zh-cn, zh-tw

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  theme: '#ffad00'
});
```

## subtitle

- Type: `Object`
- Default: `{}`

Custom subtitle

### url

- Type: `String`
- Default: ``

Subtitle url, support vtt and srt format

### style

- Type: `Object`
- Default: `{}`

Subtitle style

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  subtitle: {
    url: url + '/subtitle/one-more-time-one-more-chance.srt',
    style: {
      color: '#03A9F4'
    }
  }
});
```

## thumbnails

- Type: `Object`
- Default: `{}`

Custom thumbnails in the progress bar with lazy load

### style

- Type: `String`
- Default: ``

Thumbnails image url

### number

- Type: `Number`
- Default: `60`

Thumbnails number

### width

- Type: `Number`
- Default: `160`

Thumbnails width

### height

- Type: `Number`
- Default: `90`

Thumbnails height

### column

- Type: `Number`
- Default: `10`

Thumbnails column

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  thumbnails: {
    url: url + '/image/one-more-time-one-more-chance-thumbnails.png',
    width: 190,
    height: 107
  }
});
```

## moreVideoAttr

- Type: `Object`
- Default: `{'controls': false,'preload': 'auto'}`

More video Attributes, these properties will be written directly to the video element

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  moreVideoAttr: {
    'webkit-playsinline': true,
    playsinline: true
  }
});
```

## quality

- Type: `Array`
- Default: `[]`

Custom quality, The type of quality is an object

### default

- Type: `Boolean`
- Default: `false`

Whether the default quality, if not specified, the first quality will be taken

### name

- Type: `String`
- Default: ``

Quality name

### url

- Type: `String`
- Default: ``

Quality url

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  quality: [
    {
      default: true,
      name: 'SD 480P',
      url: url + '/video/one-more-time-one-more-chance-480p.mp4'
    },
    {
      name: 'HD 720P',
      url: url + '/video/one-more-time-one-more-chance-720p.mp4'
    }
  ]
});
```

## highlight

- Type: `Array`
- Default: `[]`

Custom highlight, The type of highlight is an object

### time

- Type: `Number`
- Default: `0`

highlight seconds

### text

- Type: `String`
- Default: ``

highlight text

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  highlight: [
    {
      time: 60,
      text: 'One more chance'
    },
    {
      time: 120,
      text: '谁でもいいはずなのに'
    },
    {
      time: 180,
      text: '夏の想い出がまわる'
    },
    {
      time: 240,
      text: 'こんなとこにあるはずもないのに'
    },
    {
      time: 300,
      text: '－－终わり－－'
    }
  ]
});
```

## layers

- Type: `Array`
- Default: `[]`

Custom layer, The type of layer is an object or function

### disable

- Type: `Boolean`
- Default: `false`

Whether to disable

### name

- Type: `String`
- Default: `layer${id}`

The unique name , used for the class name

### index

- Type: `Number`
- Default: `${id}`

The unique index, used for the priority level

### html

- Type: `String`、`Element`
- Default: ``

The dom element

### style

- Type: `Object`
- Default: `{}`

The style object

### click

- Type: `Function`
- Default: `undefined`

Click event

### mounted

- Type: `Function`
- Default: `undefined`

Callback after mounted

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  layers: [
    {
      html: `<img style="width: 100px" src="${url}/image/your-name.png">`,
      style: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9'
      }
    }
  ]
});
```

## contextmenu

- Type: `Array`
- Default: `[]`

Custom contextmenu, The type of layer is an object or function

### disable

- Type: `Boolean`
- Default: `false`

Whether to disable

### name

- Type: `String`
- Default: `layer${id}`

The unique name , used for the class name

### index

- Type: `Number`
- Default: `${id}`

The unique index, used for the priority level

### html

- Type: `String`、`Element`
- Default: ``

The dom element

### style

- Type: `Object`
- Default: `{}`

The style object

### click

- Type: `Function`
- Default: `undefined`

Click event

### mounted

- Type: `Function`
- Default: `undefined`

Callback after mounted

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  contextmenu: [
    {
      html: '自定义菜单 - 天亮请关灯 Σ(っ °Д °;)っ',
      click: function() {
        document.querySelector('.video-wrap').classList.toggle('dark');
        this.hide();
      }
    }
  ]
});
```

## controls

- Type: `Array`
- Default: `[]`

Custom controls, The type of controls is an object or function

### disable

- Type: `Boolean`
- Default: `false`

Whether to disable

### name

- Type: `String`
- Default: `layer${id}`

The unique name , used for the class name

### index

- Type: `Number`
- Default: `${id}`

The unique index, used for the priority level

### html

- Type: `String`、`Element`
- Default: ``

The dom element

### style

- Type: `Object`
- Default: `{}`

The style object

### click

- Type: `Function`
- Default: `undefined`

Click event

### mounted

- Type: `Function`
- Default: `undefined`

Callback after mounted

### position

- Type: `String`
- Default: `undefined`

The position where the controller appears: top, left, right

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.mp4',
  controls: [
    function myController(art) {
      return {
        name: 'myController',
        position: 'right',
        index: 10,
        html: 'myController',
        click: function() {
          console.log('myController');
        }
      }
    }
  ]
});
```

# Instance properties

> TODO...

# Class static properties

> TODO...

# Event

> TODO...

# Issue

> TODO...
