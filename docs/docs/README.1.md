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
    url: 'path/to/video.mp4',
});
```

# Configuration

## container

-   Type: `String、Element`
-   Default: `#artplayer`
-   Required: `true`

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

-   Type: `String`
-   Default: `''`
-   Required: `true`

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

## type

-   Type: `String`
-   Default: `''`

Specify the format for the `url`, use with `customType`

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.flv'
  type: 'flv'
});
```

## customType

-   Type: `Object`
-   Default: `{}`

Customize when loading third-party libraries

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
  container: '.artplayer-app',
  url: url + '/video/one-more-time-one-more-chance-480p.flv'
  type: 'flv',
  customType: {
    flv: function(video, url, art) {
      // video: The video element
      // url: The video url
      // art: The Artplayer instance
    }
  }
});
```

## poster

-   Type: `String`
-   Default: `''`

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

-   Type: `String`
-   Default: `''`

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

-   Type: `Number`
-   Default: `0.7`

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

## muted

-   Type: `Boolean`
-   Default: `false`

Whether to mute by default

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    muted: true,
});
```

## autoplay

-   Type: `Boolean`
-   Default: `false`

Whether to play automatically, sometimes it doesn't necessarily succeed

More info: [autoplay-policy-changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `false`

Whether to show pip controller in the bottom, it will give priority to the native picture-in-picture feature.

More info: [picture-in-picture](https://developers.google.com/web/updates/2017/09/picture-in-picture)

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `false`

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

-   Type: `Boolean`
-   Default: `true`

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

-   Type: `Boolean`
-   Default: `true`

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

| Key     | Description     |
| ------- | --------------- |
| `↑`     | Increase volume |
| `↓`     | Decrease volume |
| `←`     | Seek backward   |
| `→`     | Seek forward    |
| `space` | Toggle playback |

## lang

-   Type: `String`
-   Default: `navigator.language.toLowerCase()`

Default display language: en, zh-cn, zh-tw

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    lang: 'en',
});
```

## icons

-   Type: `Object`
-   Default: `{}`

Replace the default icon, The currently configurable icons are: `loading`、`playBig`

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    icons: {
        loading: 'Loading...',
        playBig: 'PLAY',
    },
});
```

## theme

-   Type: `String`
-   Default: `#f00`

Default display language: en, zh-cn, zh-tw

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    theme: '#ffad00',
});
```

## subtitle

-   Type: `Object`
-   Default: `{}`

Custom subtitle

### url

-   Type: `String`
-   Default: `''`

Subtitle url, support vtt and srt format

### style

-   Type: `Object`
-   Default: `{}`

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
            color: '#03A9F4',
        },
    },
});
```

## thumbnails

-   Type: `Object`
-   Default: `{}`

Custom thumbnails in the progress bar with lazy load

### style

-   Type: `String`
-   Default: `''`

Thumbnails image url

### number

-   Type: `Number`
-   Default: `60`

Thumbnails number

### width

-   Type: `Number`
-   Default: `160`

Thumbnails width

### height

-   Type: `Number`
-   Default: `90`

Thumbnails height

### column

-   Type: `Number`
-   Default: `10`

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
        height: 107,
    },
});
```

## moreVideoAttr

-   Type: `Object`
-   Default: `{'controls': false,'preload': 'auto'}`

More video Attributes, these properties will be written directly to the video element

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsinline: true,
    },
});
```

## quality

-   Type: `Array`
-   Default: `[]`

Custom quality, The type of quality is an object

### default

-   Type: `Boolean`
-   Default: `false`

Whether the default quality, if not specified, the first quality will be taken

### name

-   Type: `String`
-   Default: `''`

Quality name

### url

-   Type: `String`
-   Default: `''`

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
            url: url + '/video/one-more-time-one-more-chance-480p.mp4',
        },
        {
            name: 'HD 720P',
            url: url + '/video/one-more-time-one-more-chance-720p.mp4',
        },
    ],
});
```

## highlight

-   Type: `Array`
-   Default: `[]`

Custom highlight, The type of highlight is an object

### time

-   Type: `Number`
-   Default: `0`

highlight seconds

### text

-   Type: `String`
-   Default: `''`

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
            text: 'One more chance',
        },
        {
            time: 120,
            text: '谁でもいいはずなのに',
        },
        {
            time: 180,
            text: '夏の想い出がまわる',
        },
        {
            time: 240,
            text: 'こんなとこにあるはずもないのに',
        },
        {
            time: 300,
            text: '－－终わり－－',
        },
    ],
});
```

## layers

-   Type: `Array`
-   Default: `[]`

Custom layer, The type of layer is an object or function

### disable

-   Type: `Boolean`
-   Default: `false`

Whether to disable

### name

-   Type: `String`
-   Default: `layer${id}`

The unique name , used for the class name

### index

-   Type: `Number`
-   Default: `${id}`

The unique index, used for the priority level

### html

-   Type: `String`、`Element`
-   Default: `''`

The dom element

### style

-   Type: `Object`
-   Default: `{}`

The style object

### click

-   Type: `Function`
-   Default: `undefined`

Click event

### mounted

-   Type: `Function`
-   Default: `undefined`

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
                opacity: '.9',
            },
        },
    ],
});
```

## contextmenu

-   Type: `Array`
-   Default: `[]`

Custom contextmenu, The type of layer is an object or function

### disable

-   Type: `Boolean`
-   Default: `false`

Whether to disable

### name

-   Type: `String`
-   Default: `layer${id}`

The unique name , used for the class name

### index

-   Type: `Number`
-   Default: `${id}`

The unique index, used for the priority level

### html

-   Type: `String`、`Element`
-   Default: `''`

The dom element

### style

-   Type: `Object`
-   Default: `{}`

The style object

### click

-   Type: `Function`
-   Default: `undefined`

Click event

### mounted

-   Type: `Function`
-   Default: `undefined`

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
            },
        },
    ],
});
```

## controls

-   Type: `Array`
-   Default: `[]`

Custom controls, The type of controls is an object or function

### disable

-   Type: `Boolean`
-   Default: `false`

Whether to disable

### name

-   Type: `String`
-   Default: `layer${id}`

The unique name , used for the class name

### index

-   Type: `Number`
-   Default: `${id}`

The unique index, used for the priority level

### html

-   Type: `String`、`Element`
-   Default: `''`

The dom element

### style

-   Type: `Object`
-   Default: `{}`

The style object

### click

-   Type: `Function`
-   Default: `undefined`

Click event

### mounted

-   Type: `Function`
-   Default: `undefined`

Callback after mounted

### position

-   Type: `String`
-   Default: `undefined`

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
                },
            };
        },
    ],
});
```

## plugins

-   Type: `Array`
-   Default: `[]`

Custom plugins, The type of plugin is a function

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    plugins: [
        function myPlugin(art) {
            return {
                // This exposes plugin properties or methods for others to use. Like:
                something: 'something',
                doSomething: function() {
                    console.log('Do something here...');
                },
            };
        },
    ],
});

art.plugins.myPlugin.doSomething();
```

# Instance properties

## Instance

### isFocus

-   Type: `Boolean`
-   Default: `false`

Return to focus state

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.isFocus);
```

### isPlaying

-   Type: `Boolean`
-   Default: `false`

Return to play state

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.isPlaying);
```

### destroy

-   Type: `Function`

Destroy instance, will not remove dom by default

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

setTimeout(function() {
    art.destroy();
}, 1000);

// Remeve dom
// art.destroy(true);
```

## player

-   Type: `Object`

### aspectRatioState

-   Type: `String`
-   Default: `''`

Return the current value of aspect ratio

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.player.aspectRatioState);
```

### aspectRatio

-   Type: `Function`

Set aspect ratio, Currently only accepts three values：`default`, `4:3`, `16:9`

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.aspectRatio('4:3');
});
```

### aspectRatioRemove

-   Type: `Function`

Remove aspect ratio

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.aspectRatio('4:3');
    setTimeout(function() {
        art.player.aspectRatioRemove();
    }, 1000);
});
```

### aspectRatioReset

-   Type: `Function`

Recalculate the aspect ratio

### returnUrl

-   Type: `Function`

A special editable method for return new url, useful when modifying url

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

Object.defineProperty(art.player, 'returnUrl', {
    value: url => url + '?time=' + new Date().getTime(),
});
```

### autoSizeState

-   Type: `Boolean`
-   Default: `false`

Return the current state of auto size

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.player.autoSizeState);
```

### autoSize

-   Type: `Function`

Return the current state of auto size

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.autoSize();
});
```

### autoSizeRemove

-   Type: `Function`

Remove the auto size

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.autoSize();
    setTimeout(function() {
        art.player.autoSizeRemove();
    }, 1000);
});
```

### currentTime

-   Type: `Number`

`Geter` and `Setter` of the current time

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    console.log(art.player.currentTime);
    art.player.currentTime = 5;
    console.log(art.player.currentTime);
});
```

### duration

-   Type: `Number`

`Geter` of the duration

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    console.log(art.player.duration);
});
```

### flipState

-   Type: `String`
-   Default: `''`

Return the current state of flip

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    console.log(art.player.flipState);
});
```

### flip

-   Type: `Function`

Set flip, Currently only accepts three values：`normal`, `horizontal`, `vertical`

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.flip('horizontal');
    console.log(art.player.flipState);
});
```

### flipRemove

-   Type: `Function`

Remove the flip

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.flip('horizontal');
    setTimeout(function() {
        art.player.flipRemove();
    }, 1000);
});
```

### fullscreenState

-   Type: `Boolean`
-   Default: `false`

Return the current state of fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.player.fullscreenState);
```

### fullscreenEnabled

-   Type: `Function`

Enable fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.fullscreenEnabled();
    console.log(art.player.fullscreenState);
});
```

### fullscreenExit

-   Type: `Function`

Exit fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.fullscreenEnabled();
    console.log(art.player.fullscreenState);
    setTimeout(function() {
        art.player.fullscreenExit();
        console.log(art.player.fullscreenState);
    }, 1000);
});
```

### fullscreenToggle

-   Type: `Function`

Toggle fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.fullscreenToggle();
});
```

### fullscreenWebState

-   Type: `Boolean`
-   Default: `false`

Return the current state of web fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.player.fullscreenWebState);
```

### fullscreenWebEnabled

-   Type: `Function`

Enable web fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.fullscreenWebEnabled();
    console.log(art.player.fullscreenWebState);
});
```

### fullscreenWebExit

-   Type: `Function`

Exit web fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.fullscreenWebEnabled();
    console.log(art.player.fullscreenWebState);
    setTimeout(function() {
        art.player.fullscreenWebExit();
        console.log(art.player.fullscreenWebState);
    }, 1000);
});
```

### fullscreenWebToggle

-   Type: `Function`

Toggle web fullscreen

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.fullscreenWebToggle();
});
```

### loaded

-   Type: `Number`

Return the proportion of the load

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('video:progress', () => {
    console.log(art.player.loaded);
});
```

### pause

-   Type: `Function`

Pause playback

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.pause();
});
```

### pipState

-   Type: `Boolean`
-   Default: `false`

Return the current state of pip

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.player.pipState);
```

### pipEnabled

-   Type: `Function`

Enable pip

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.pipEnabled();
    console.log(art.player.pipState);
});
```

### pipExit

-   Type: `Function`

Exit pip

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.pipEnabled();
    console.log(art.player.pipState);
    setTimeout(function() {
        art.player.pipExit();
        console.log(art.player.pipState);
    }, 1000);
});
```

### pipToggle

-   Type: `Function`

Toggle pip

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.pipToggle();
});
```

### playbackRateState

-   Type: `String`
-   Default: `''`

Return the current state of playback rate

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.player.playbackRateState);
```

### playbackRate

-   Type: `Function`

Set playbackRate, Currently only accepts three values：0.5, 0.75, 1.0, 1.25, 1.5, 2.0

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.playbackRate(1.5);
    console.log(art.player.playbackRateState);
});
```

### playbackRateRemove

-   Type: `Function`

Remove the playback rate

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.playbackRate(1.5);
    setTimeout(function() {
        art.player.playbackRateRemove();
    }, 1000);
});
```

### playbackRateReset

-   Type: `Function`

Recalculate the playback rate

### played

-   Type: `Number`

Return the proportion of the load

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('video:timeupdate', () => {
    console.log(art.player.played);
});
```

### screenshot

-   Type: `Function`

Download the screenshot

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.currentTime = 5;
    art.player.screenshot();
});
```

### seek

-   Type: `Function`

Set the current time

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.seek(5);
});
```

### switchQuality

-   Type: `Function`

Switch quality, and you can give it a name

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.switchQuality(url + '/video/one-more-time-one-more-chance-720p.mp4', '720P');
});
```

### toggle

-   Type: `Function`

Toggle play and pause

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.toggle();
});
```

### volume

-   Type: `Number`

Geter and Setter of the current volume

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    console.log(art.player.volume);
    art.player.volume = 5;
    console.log(art.player.volume);
});
```

### muted

-   Type: `Number`

Geter and Setter of the muted

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    console.log(art.player.muted);
    art.player.muted = true;
    console.log(art.player.muted);
});
```

## storage

-   Type: `Object`

### get

-   Type: `Function`

Get the storage

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.storage.get('volume'));
```

### set

-   Type: `Function`

Set the storage

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.storage.set('volume', 0.7);
```

## i18n

-   Type: `Object`

### get

-   Type: `Function`

Get the a i18n value

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log(art.i18n.get('Play'));
```

### update

-   Type: `Function`

Update the i18n

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.i18n.update({
    'zh-cn': {
        'More': '更多'
    }
});

console.log(art.i18n.get('More'));
```

## notice

-   Type: `Object`

> TODO...

## events

-   Type: `Object`

> TODO...

## layers

-   Type: `Object`

> TODO...

## controls

-   Type: `Object`

> TODO...

## contextmenu

-   Type: `Object`

> TODO...

## subtitle

-   Type: `Object`

> TODO...

## loading

-   Type: `Object`

> TODO...

## mask

-   Type: `Object`

> TODO...

## setting

-   Type: `Object`

> TODO...

## plugins

-   Type: `Object`

> TODO...

# Class static properties

All properties are read only

| propertie             | Description               |
| --------------------- | ------------------------- |
| `Artplayer.version`   | Version Information       |
| `Artplayer.env`       | Environmental variable    |
| `Artplayer.config`    | Configuration information |
| `Artplayer.utils`     | Utils function            |
| `Artplayer.DEFAULTS`  | Default option            |
| `Artplayer.instances` | Instance collection       |

# Event

> TODO...

# Third-party libraries

## flv.js

-   HomePage: [https://github.com/Bilibili/flv.js](https://github.com/Bilibili/flv.js)

[Run Code](/lib=https://cdn.bootcss.com/flv.js/1.4.2/flv.js)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.flv',
    customType: {
        flv: function(video, url) {
            const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: url,
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
        },
    },
});
```

## hls.js

-   HomePage: [https://github.com/video-dev/hls.js](https://github.com/video-dev/hls.js)

[Run Code](/lib=https://cdn.bootcss.com/hls.js/0.10.1/hls.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
    customType: {
        m3u8: function(video, url) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        },
    },
});
```

## dash.js

-   HomePage: [https://github.com/Dash-Industry-Forum/dash.js](https://github.com/Dash-Industry-Forum/dash.js)

[Run Code](/lib=https://cdn.bootcss.com/dashjs/2.9.2/dash.all.min.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
    customType: {
        mpd: function(video, url) {
            var player = dashjs.MediaPlayer().create();
            player.initialize(video, url, true);
        },
    },
});
```

## shaka-player

-   HomePage: [https://github.com/google/shaka-player](https://github.com/google/shaka-player)

[Run Code](/lib=https://cdn.bootcss.com/shaka-player/2.5.0-beta/shaka-player.compiled.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    customType: {
        mpd: function(video, url) {
            shaka.polyfill.installAll();
            var player = new shaka.Player(video);
            player.load(url);
        },
    },
});
```

## webtorrent

-   HomePage: [https://github.com/webtorrent/webtorrent](https://github.com/webtorrent/webtorrent)

[Run Code](/lib=https://cdn.bootcss.com/webtorrent/0.102.4/webtorrent.min.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url:
        'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4',
    type: 'torrent',
    customType: {
        torrent: function(video, url, art) {
            var client = new WebTorrent();
            art.loading.show();
            client.add(url, function(torrent) {
                var file = torrent.files[0];
                file.renderTo(video, {
                    autoplay: true,
                });
            });
        },
    },
});
```
