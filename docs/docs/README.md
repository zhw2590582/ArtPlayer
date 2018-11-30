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

Video source url, Three video file formats are supported: `mp4`, `ogg`, `webm`

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
    url: url + '/video/one-more-time-one-more-chance-480p.flv',
    type: 'flv',
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

## whitelist

-   Type: `Array`
-   Default: `[]`

The current player uses the simplest native components on mobile devices, but you can filter this feature through whitelist. `whitelist` accept `String`, `function`, and `regular` expressions, contrast information comes from `window.navigator.userAgent`

By default, non-whitelisted devices only set video native properties and third-party dependencies.

[Open with mobile](https://artplayer.org/lab/mobile.html)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    whitelist: ['iPhone OS 11'],
    // whitelist: [(ua)=>{ return /iPhone OS 11/gi.test(ua); }],
    // whitelist: [/iPhone OS 11/gi]
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

Video title, will be shown in `screenshot` file name and `pip` mode

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

Whether to show screenshot controller in the bottom, If the video resource exists cross-domain, the screenshot may fail. Unless serves this url with the correct `Access-Control-Allow-Origin`, and Set the video's `crossOrigin` property to `anonymous`

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    screenshot: true,

    // Optional
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
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

Default theme color

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

| propertie | type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `url`     | `String` | Subtitle url, support vtt and srt format |
| `style`   | `Object` | Subtitle style                           |

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

| propertie | type     | Description          |
| --------- | -------- | -------------------- |
| `url`     | `String` | Thumbnails image url |
| `number`  | `Number` | Thumbnails number    |
| `width`   | `Number` | Thumbnails width     |
| `height`  | `Number` | Thumbnails height    |
| `column`  | `Number` | Thumbnails column    |

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

| propertie | type      | Description                                                                    |
| --------- | --------- | ------------------------------------------------------------------------------ |
| `default` | `Boolean` | Whether the default quality, if not specified, the first quality will be taken |
| `name`    | `String`  | Quality name to show                                                           |
| `url`     | `String`  | Video url                                                                      |

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

| propertie | type     | Description      |
| --------- | -------- | ---------------- |
| `time`    | `Number` | highlight second |
| `text`    | `String` | highlight text   |

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

| propertie | type                | Description                                   |
| --------- | ------------------- | --------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable                            |
| `name`    | `String`            | The unique name , used for the class name     |
| `index`   | `Number`            | The unique index, used for the priority level |
| `html`    | `String`、`Element` | The dom element                               |
| `style`   | `Object`            | The style object                              |
| `click`   | `Function`          | Click event                                   |
| `mounted` | `Function`          | Callback after mounted                        |

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

| propertie | type                | Description                                   |
| --------- | ------------------- | --------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable                            |
| `name`    | `String`            | The unique name , used for the class name     |
| `index`   | `Number`            | The unique index, used for the priority level |
| `html`    | `String`、`Element` | The dom element                               |
| `style`   | `Object`            | The style object                              |
| `click`   | `Function`          | Click event                                   |
| `mounted` | `Function`          | Callback after mounted                        |

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

| propertie  | type                | Description                                                       |
| ---------- | ------------------- | ----------------------------------------------------------------- |
| `disable`  | `Boolean`           | Whether to disable                                                |
| `name`     | `String`            | The unique name , used for the class name                         |
| `index`    | `Number`            | The unique index, used for the priority level                     |
| `html`     | `String`、`Element` | The dom element                                                   |
| `style`    | `Object`            | The style object                                                  |
| `click`    | `Function`          | Click event                                                       |
| `mounted`  | `Function`          | Callback after mounted                                            |
| `position` | `String`            | The position where the controller appears: `top`, `left`, `right` |

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

| propertie | type       | Description                                      |
| --------- | ---------- | ------------------------------------------------ |
| `isFocus` | `Boolean`  | Return to focus state                            |
| `destroy` | `Function` | Destroy instance, will not remove dom by default |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log('isFocus', art.isFocus);
console.log('isPlaying', art.isPlaying);

setTimeout(function() {
    // keep dom
    art.destroy();

    // remove dom
    // art.destroy(true);
}, 1000);
```

## player

Player core function

| propertie              | type       | Description                                                                                       |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `aspectRatioState`     | `String`   | Return the current value of aspect ratio                                                          |
| `aspectRatio`          | `Function` | Set aspect ratio, Currently only accepts three values：`default`, `4:3`, `16:9`                   |
| `aspectRatioRemove`    | `Function` | Remove aspect ratio                                                                               |
| `aspectRatioReset`     | `Function` | Recalculate the aspect ratio                                                                      |
| `autoSizeState`        | `Boolean`  | Return the current state of auto size                                                             |
| `autoSize`             | `Function` | Set auto size                                                                                     |
| `autoSizeRemove`       | `Function` | Remove the auto size                                                                              |
| `currentTime`          | `Number`   | `Getter` and `Setter` of the current time                                                         |
| `duration`             | `Number`   | `Getter` of the duration                                                                          |
| `flipState`            | `String`   | Return the current state of flip                                                                  |
| `flip`                 | `Function` | Set flip, Currently only accepts three values：`normal`, `horizontal`, `vertical`                 |
| `flipRemove`           | `Function` | Remove the flip                                                                                   |
| `fullscreenState`      | `Boolean`  | Return the current state of fullscreen                                                            |
| `fullscreenEnabled`    | `Function` | Enable fullscreen                                                                                 |
| `fullscreenExit`       | `Function` | Exit fullscreen                                                                                   |
| `fullscreenToggle`     | `Function` | Toggle fullscreen                                                                                 |
| `fullscreenWebState`   | `Boolean`  | Return the current state of web fullscreen                                                        |
| `fullscreenWebEnabled` | `Function` | Enable web fullscreen                                                                             |
| `fullscreenWebExit`    | `Function` | Exit web fullscreen                                                                               |
| `fullscreenWebToggle`  | `Function` | Toggle web fullscreen                                                                             |
| `loaded`               | `Number`   | Return the proportion of the load                                                                 |
| `pause`                | `Function` | Pause playback                                                                                    |
| `pipState`             | `Boolean`  | Return the current state of pip                                                                   |
| `pipEnabled`           | `Function` | Enable pip                                                                                        |
| `pipExit`              | `Function` | Exit pip                                                                                          |
| `pipToggle`            | `Function` | Toggle pip                                                                                        |
| `playbackRateState`    | `String`   | Return the current state of playback rate                                                         |
| `playbackRate`         | `Function` | Set playbackRate, Currently only accepts three values：`0.5`, `0.75`, `1.0`, `1.25`, `1.5`, `2.0` |
| `playbackRateRemove`   | `Function` | Remove the playback rate                                                                          |
| `playbackRateReset`    | `Function` | Recalculate the playback rate                                                                     |
| `played`               | `Number`   | Return the proportion of the played                                                               |
| `playing`              | `Boolean`  | Return to playing state                                                                           |
| `screenshot`           | `Function` | Download a screenshot of current time                                                             |
| `seek`                 | `Function` | Set the current time                                                                              |
| `switchQuality`        | `Function` | Switch quality                                                                                    |
| `toggle`               | `Function` | Toggle play and pause                                                                             |
| `volume`               | `Number`   | `Getter` and `Setter` of the current volume                                                       |
| `muted`                | `Boolean`  | `Getter` and `Setter` of the muted                                                                |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('firstCanplay', () => {
    art.player.seek(5);
    art.player.screenshot();
});
```

## storage

The player will automatically add a `localStorage` object named `artplayer_settings`, Now the player will only set and read the `volume` value.

| propertie | type       | Description     |
| --------- | ---------- | --------------- |
| `get`     | `Function` | Get the storage |
| `set`     | `Function` | Set the storage |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.storage.set('your-key', 'your-value');
console.log(art.storage.get('your-key'));
```

## i18n

The current support i18n has: `en`, `zh-cn`, `zh-tw`

| propertie | type       | Description                     |
| --------- | ---------- | ------------------------------- |
| `get`     | `Function` | Get the a i18n value            |
| `update`  | `Function` | Pass in a parameter for merging |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    lang: 'jp',
});

console.log(art.i18n.get('Play'));
art.i18n.update({
    'zh-cn': {
        Language: '简体',
    },
    'zh-tw': {
        Language: '繁體',
    },
    jp: {
        Language: '日文',
    },
});
console.log(art.i18n.get('Language'));
```

## notice

-   Type: `Object`

| propertie | type       | Description    |
| --------- | ---------- | -------------- |
| `show`    | `Function` | Show a message |
| `hide`    | `Function` | Hide message   |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

// auto hide
art.notice.show('some message');

// not auto hide
art.notice.show('some message', false);
```

## events

Agent for managing native events

-   Type: `Object`

| propertie | type       | Description                                                                          |
| --------- | ---------- | ------------------------------------------------------------------------------------ |
| `proxy`   | `Function` | A proxy for `addEventListener` and `removeEventListener` to manage event destruction |
| `hover`   | `Function` | Hover simplified proxy                                                               |
| `loadImg` | `Function` | Determine whether to finish the picture                                              |
| `destroy` | `Function` | Destroy all events                                                                   |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

var target = document.querySelector('body');
art.events.proxy(target, 'click', function(e) {
    console.log('body click');
});
```

## layers

Layer manager, and every layer has `show` and `hide` funciton

-   Type: `Object`

| propertie | type       | Description             |
| --------- | ---------- | ----------------------- |
| `add`     | `Function` | Dynamically add a layer |
| `show`    | `Function` | Show all layers         |
| `hide`    | `Function` | Hide all layers         |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.layers.add({
    html: `<img style="width: 100px" src="${url}/image/your-name.png">`,
    style: {
        name: 'yourLayer',
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9',
    },
});

art.layers.yourLayer.hide();
```

## controls

Controls manager, and every control has `show` and `hide` funciton

-   Type: `Object`

| propertie | type       | Description               |
| --------- | ---------- | ------------------------- |
| `add`     | `Function` | Dynamically add a control |
| `show`    | `Function` | Show all controls         |
| `hide`    | `Function` | Hide all controls         |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.controls.add(function yourController(art) {
    return {
        name: 'yourController',
        position: 'right',
        index: 10,
        html: 'yourController',
        click: function() {
            console.log('yourController');
        },
    };
});

art.controls.yourController.hide();
```

## contextmenu

Contextmenu manager, and every contextmenu has `show` and `hide` funciton

-   Type: `Object`

| propertie | type       | Description                   |
| --------- | ---------- | ----------------------------- |
| `add`     | `Function` | Dynamically add a contextmenu |
| `show`    | `Function` | Show all contextmenu          |
| `hide`    | `Function` | Hide all contextmenu          |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.contextmenu.add({
    html: 'Your Contextmenu',
    name: 'yourContextmenu',
});

art.contextmenu.yourContextmenu.hide();
```

## subtitle

-   Type: `Object`

| propertie | type       | Description     |
| --------- | ---------- | --------------- |
| `switch`  | `Function` | Switch subtitle |
| `show`    | `Function` | Show subtitle   |
| `hide`    | `Function` | Hide subtitle   |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    subtitle: {
        url: url + '/subtitle/one-more-time-one-more-chance.srt',
    },
});

this.art.on('firstCanplay', () => {
    art.subtitle.switch(url + '/subtitle/one-more-time-one-more-chance.vtt');
});
```

## loading

-   Type: `Object`

| propertie | type       | Description  |
| --------- | ---------- | ------------ |
| `show`    | `Function` | Show loading |
| `hide`    | `Function` | Hide loading |

## mask

-   Type: `Object`

| propertie | type       | Description |
| --------- | ---------- | ----------- |
| `show`    | `Function` | Show mask   |
| `hide`    | `Function` | Hide mask   |

## setting

Setting manager, and every setting has `show` and `hide` funciton

-   Type: `Object`

| propertie | type       | Description               |
| --------- | ---------- | ------------------------- |
| `add`     | `Function` | Dynamically add a setting |
| `show`    | `Function` | Show setting              |
| `hide`    | `Function` | Hide setting              |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.setting.add({
    html: 'Your Setting',
    name: 'yourSetting',
});

art.setting.yourSetting.hide();
```

## plugins

Plugins manager

-   Type: `Object`

| propertie | type       | Description              |
| --------- | ---------- | ------------------------ |
| `add`     | `Function` | Dynamically add a plugin |

[Run Code](/)

```js
var url = 'https://blog.zhw-island.com/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.plugins.add(function myPlugin(art) {
    return {
        // This exposes plugin properties or methods for others to use. Like:
        something: 'something',
        doSomething: function() {
            console.log('Do something here...');
        },
    };
});

art.plugins.myPlugin.doSomething();
```

# Class static properties

All properties are read only

| propertie             | type     | Description               |
| --------------------- | -------- | ------------------------- |
| `Artplayer.version`   | `String` | Version Information       |
| `Artplayer.env`       | `String` | Environmental variable    |
| `Artplayer.config`    | `Object` | Configuration information |
| `Artplayer.utils`     | `Object` | Utils function            |
| `Artplayer.DEFAULTS`  | `Object` | Default option            |
| `Artplayer.instances` | `Array`  | Instance collection       |

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
