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

[Run Code](/Configuration.container)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.url)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.type)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.customType)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.flv',
    type: 'flv',
    customType: {
        flv: function(video, url, art) {
            // video: The video element
            // url: The video url
            // art: The Artplayer instance
        },
    },
});
```

## whitelist

-   Type: `Array`
-   Default: `[]`

The current player uses the simplest native components on mobile devices, but you can filter this feature through whitelist. `whitelist` accept `String`, `function`, and `regular` expressions, contrast information comes from `window.navigator.userAgent`

By default, non-whitelisted devices only set video native properties and third-party dependencies.

[Open with mobile](https://artplayer.org/mobile.html)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.poster)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.title)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.volume)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.muted)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.autoplay)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.autoSize)

```js
// Zoom browser window
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.loop)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    loop: true,
});
```

## playbackRate

-   Type: `Boolean`
-   Default: `false`

Whether to show playback rate controller in the contextmenu and setting panel

[Run Code](/Configuration.playbackRate)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    playbackRate: true,
});
```

## aspectRatio

-   Type: `Boolean`
-   Default: `false`

Whether to show aspect ratio controller in the contextmenu and setting panel

[Run Code](/Configuration.aspectRatio)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.screenshot)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.setting)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.pip)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.fullscreen)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.fullscreenWeb)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.mutex)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.hotkey)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.lang)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    lang: 'en',
});
```

## icons

-   Type: `Object`
-   Default: `{}`

Replace the default icon

[Run Code](/Configuration.icons)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    icons: {
        loading: '',
        state: '',
        play: '',
        pause: '',
        volume: '',
        volumeClose: '',
        subtitle: '',
        screenshot: '',
        setting: '',
        fullscreen: '',
        fullscreenWeb: '',
        pip: '',
        prev: '',
        next: '',
    },
});
```

## theme

-   Type: `String`
-   Default: `#f00`

Default theme color

[Run Code](/Configuration.theme)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    theme: '#ffad00',
});
```

## subtitleOffset

-   Type: `Boolean`
-   Default: `false`

Subtitle time offset plugin

[Run Code](/Configuration.subtitleOffset)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    subtitle: {
        url: url + '/subtitle/one-more-time-one-more-chance.srt',
    },
    setting: true,
    subtitleOffset: true,
});
```

## miniProgressBar

-   Type: `Boolean`
-   Default: `false`

Mini progress bar plugin

[Run Code](/Configuration.miniProgressBar)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    miniProgressBar: true,
});
```

## localVideo

-   Type: `Boolean`
-   Default: `false`

Local video preview plugin. By default, a configuration is added in the settings panel.

[Run Code](/Configuration.localVideo)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    localVideo: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: 'OPEN VIDEO',
            mounted: $preview => {
                art.plugins.localVideo.attach($preview);
            },
        },
    ],
});
```

## localSubtitle

-   Type: `Boolean`
-   Default: `false`

Local subtitle preview plugin. By default, a configuration is added in the settings panel.

[Run Code](/Configuration.localSubtitle)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    localSubtitle: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: 'OPEN SUBTITLE',
            mounted: $preview => {
                art.plugins.localSubtitle.attach($preview);
            },
        },
    ],
});
```

## autoPip

-   Type: `Boolean`
-   Default: `false`

Auto pip mode plugin, when the video is playing and not triggering in the window view

In chrome, you must use gestures on the page to use this feature, otherwise you will get an error.

More info: [picture-in-picture](https://developers.google.com/web/updates/2017/09/picture-in-picture)

[Run Code](/Configuration.autoPip)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    autoPip: true,
});
```

## networkMonitor

-   Type: `Boolean`
-   Default: `false`

A network monitor is used to monitor the blocking of the video.

[Run Code](/Configuration.networkMonitor)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    networkMonitor: true,
});

// Is the ratio of the time the video is blocked to the time the video has been played.
// For example, when the ratio is equal to 0.3, it means that every 10 seconds of sampling time, it is blocked for three seconds.

let notice = false;
art.on('networkMonitor', ratio => {
    if (ratio >= 0.5 && !notice) {
        notice = true;
        console.log('Current network condition is not good');
    }
});

// Modify sampling time, the unit is milliseconds, default 10 seconds.
art.plugins.networkMonitor.sample(30000);
```

## subtitle

-   Type: `Object`
-   Default: `{}`

Custom subtitle

| propertie | type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `url`     | `String` | Subtitle url, support vtt and srt format |
| `style`   | `Object` | Subtitle style                           |

[Run Code](/Configuration.subtitle)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    subtitle: {
        url: url + '/subtitle/one-more-time-one-more-chance.srt',
        style: {
            color: '#03A9F4',
            'font-size': '30px',
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

[Run Code](/Configuration.thumbnails)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    thumbnails: {
        url: url + '/image/one-more-time-one-more-chance-thumbnails.png',
        number: 100,
        width: 160,
        height: 90,
        column: 10,
    },
});
```

## moreVideoAttr

-   Type: `Object`
-   Default: `{'controls': false,'preload': 'metadata'}`

More video Attributes, these properties will be written directly to the video element

[Run Code](/Configuration.moreVideoAttr)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.quality)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Configuration.highlight)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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
| `tooltip` | `String`            | Tooltip text                                  |

[Run Code](/Configuration.layers)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

Or you can add it dynamically after instantiation:

[Run Code](/Configuration.layers)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.layers.add({
    html: `<img style="width: 100px" src="${url}/image/your-name.png">`,
    style: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9',
    },
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
| `tooltip` | `String`            | Tooltip text                                  |

[Run Code](/Configuration.contextmenu)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    contextmenu: [
        {
            html: 'Custom menu',
            click: function(contextmenu) {
                console.info('You clicked on the custom menu');
                contextmenu.show = false;
            },
        },
    ],
});
```

Or you can add it dynamically after instantiation:

[Run Code](/Configuration.contextmenu)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.contextmenu.add({
    html: 'Custom menu',
    click: function(contextmenu) {
        console.info('You clicked on the custom menu');
        contextmenu.show = false;
    },
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
| `tooltip`  | `String`            | Tooltip text                                                      |

[Run Code](/Configuration.controls)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    controls: [
        {
            name: 'myController',
            position: 'right',
            index: 10,
            html: 'myController',
            tooltip: 'This is my controller',
            click: function() {
                console.log('myController');
            },
        },
    ],
});
```

Or you can add it dynamically after instantiation:

[Run Code](/Configuration.controls)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.controls.add({
    name: 'myController',
    position: 'right',
    index: 10,
    html: 'myController',
    tooltip: 'This is my controller',
    click: function() {
        console.log('myController');
    },
});
```

## plugins

-   Type: `Array`
-   Default: `[]`

Custom plugins, The type of plugin is a function

[Run Code](/Configuration.plugins)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    plugins: [
        function myPlugin(art) {
            // Do something you like here.
            // You can also return an object for external calls.
            console.info('myPlugin running...');
            return {
                // This exposes plugin properties or methods for others to use. Like:
                something: 'something',
                doSomething: function() {
                    console.info('Do something here...');
                },
            };
        },
    ],
});

// Call plugin from the outside
art.plugins.myPlugin.doSomething();
```

Or you can add it dynamically after instantiation:

[Run Code](/Configuration.plugins)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.plugins.add(function myPlugin(art) {
    // Do something you like here.
    // You can also return an object for external calls.
    console.info('myPlugin running...');
    return {
        // This exposes plugin properties or methods for others to use. Like:
        something: 'something',
        doSomething: function() {
            console.info('Do something here...');
        },
    };
});

// Call plugin from the outside
art.plugins.myPlugin.something === 'something';
art.plugins.myPlugin.doSomething();
```

# Instance properties

## Instance

| propertie | type       | Description                                      |
| --------- | ---------- | ------------------------------------------------ |
| `isFocus` | `Boolean`  | Return to focus state                            |
| `destroy` | `Function` | Destroy instance, will not remove dom by default |

[Run Code](/Properties.instance)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

console.log('isFocus', art.isFocus);
console.log('isPlaying', art.isPlaying);

setTimeout(function() {
    // remove dom
    art.destroy();

    // keep dom
    // art.destroy(false);
}, 1000);
```

## player

Player core function.

All player properties and methods can be accessed directly through the instance. For example, the following properties are all equal:

```js
art.currentTime === art.player.currentTime;
art.volume === art.player.volume;
art.seek === art.player.seek;
```

| propertie             | type       | Description                                                                                       |
| --------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `aspectRatio`         | `String`   | Set aspect ratio, Currently only accepts three values：`default`, `4:3`, `16:9` and `false`       |
| `aspectRatioReset`    | `Boolean`  | Recalculate the aspect ratio                                                                      |
| `attachUrl`           | `Function` | Replace play address                                                                              |
| `autoSize`            | `Boolean`  | Set auto size                                                                                     |
| `currentTime`         | `Number`   | `Getter` and `Setter` of the current time                                                         |
| `duration`            | `Number`   | `Getter` of the duration                                                                          |
| `flip`                | `String`   | Set flip, Currently only accepts three values：`normal`, `horizontal`, `vertical` and `false`     |
| `fullscreen`          | `Boolean`  | Enable or disable fullscreen                                                                      |
| `fullscreenToggle`    | `Boolean`  | Toggle fullscreen                                                                                 |
| `fullscreenWeb`       | `Boolean`  | Enable or disable web fullscreen                                                                  |
| `fullscreenWebToggle` | `Boolean`  | Toggle web fullscreen                                                                             |
| `loaded`              | `Number`   | Return the proportion of the load                                                                 |
| `pause`               | `Boolean`  | Pause playback                                                                                    |
| `pip`                 | `Boolean`  | Enable or disable pip                                                                             |
| `pipToggle`           | `Boolean`  | Toggle pip                                                                                        |
| `playbackRate`        | `String`   | Set playbackRate, Currently only accepts three values：`0.5`, `0.75`, `1.0`, `1.25`, `1.5`, `2.0` |
| `playbackRateReset`   | `Boolean`  | Recalculate the playback rate                                                                     |
| `played`              | `Number`   | Return the proportion of the played                                                               |
| `playing`             | `Boolean`  | Return to playing state                                                                           |
| `play`                | `Boolean`  | Start playback                                                                                    |
| `screenshot`          | `Function` | Download a screenshot of current time                                                             |
| `seek`                | `Number`   | Set the current time                                                                              |
| `switchQuality`       | `Function` | Switch quality                                                                                    |
| `switchUrl`           | `Function` | Switch video url                                                                                  |
| `toggle`              | `Boolean`  | Toggle play and pause                                                                             |
| `volume`              | `Number`   | `Getter` and `Setter` of the current volume                                                       |
| `muted`               | `Boolean`  | `Getter` and `Setter` of the muted                                                                |
| `url`                 | `String`   | `Getter` of the video url                                                                         |

[Run Code](/Properties.player)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.on('ready', () => {
    art.player.seek = 5;
    art.player.screenshot();
});
```

## storage

The player will automatically add a `localStorage` object named `artplayer_settings`, Now the player will only set and read the `volume` value.

| propertie | type       | Description       |
| --------- | ---------- | ----------------- |
| `get`     | `Function` | Get a storage     |
| `set`     | `Function` | Set a storage     |
| `del`     | `Function` | Delete a storage  |
| `clean`   | `Function` | Clean all storage |

[Run Code](/Properties.storage)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

[Run Code](/Properties.i18n)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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

## hotkey

| propertie | type       | Description  |
| --------- | ---------- | ------------ |
| `add`     | `function` | Add a hotkey |

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

// Add a hotkey
art.hotkey.add(27, function(event) {
    console.log('You pressed esc button');
});
```

## whitelist

| propertie  | type      | Description           |
| ---------- | --------- | --------------------- |
| `ua`       | `string`  | The userAgent         |
| `isMobile` | `boolean` | Whether mobile access |

## notice

-   Type: `Object`

| propertie | type     | Description    |
| --------- | -------- | -------------- |
| `show`    | `setter` | Show a message |

[Run Code](/Properties.notice)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

// auto hide
art.notice.show = 'some message';
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

[Run Code](/Properties.events)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
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
| `show`    | `setter`   | Show or hide            |

[Run Code](/Properties.layers)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.layers.add({
    html: `<img style="width: 100px" src="${url}/image/your-name.png">`,
    style: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9',
    },
});
```

## controls

Controls manager, and every control has `show` setter

-   Type: `Object`

| propertie | type       | Description               |
| --------- | ---------- | ------------------------- |
| `add`     | `Function` | Dynamically add a control |
| `show`    | `setter`   | Show or hide              |

[Run Code](/Properties.controls)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.controls.add({
    name: 'myController',
    position: 'right',
    index: 10,
    html: 'myController',
    tooltip: 'This is my controller',
    click: function() {
        console.log('myController');
    },
});
```

## contextmenu

Contextmenu manager, and every contextmenu has `show` setter

-   Type: `Object`

| propertie | type       | Description                   |
| --------- | ---------- | ----------------------------- |
| `add`     | `Function` | Dynamically add a contextmenu |
| `show`    | `setter`   | Show or hide                  |

[Run Code](/Properties.contextmenu)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.contextmenu.add({
    html: 'Custom menu',
    click: function(contextmenu) {
        console.info('You clicked on the custom menu');
        contextmenu.show = false;
    },
});
```

## subtitle

-   Type: `Object`

| propertie | type       | Description      |
| --------- | ---------- | ---------------- |
| `init`    | `Function` | Init subtitle    |
| `show`    | `setter`   | Show or hide     |
| `switch`  | `Function` | Switch subtitle  |
| `url`     | `getter`   | get subtitle url |

[Run Code](/Properties.subtitle)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    subtitle: {
        url: url + '/subtitle/one-more-time-one-more-chance.srt',
    },
    controls: [
        {
            position: 'right',
            index: 10,
            html: 'subtitle 01',
            click: function() {
                art.subtitle.switch(url + '/subtitle/one-more-time-one-more-chance.srt', 'srt subtitle name');
            },
        },
        {
            position: 'right',
            index: 20,
            html: 'subtitle 02',
            click: function() {
                art.subtitle.switch(url + '/subtitle/one-more-time-one-more-chance.vtt', 'vtt subtitle name');
            },
        },
    ],
});
```

## loading

-   Type: `Object`

| propertie | type     | Description  |
| --------- | -------- | ------------ |
| `show`    | `setter` | Show or hide |

```js
// Show the loading
art.loading.show = true;

// Hide the loading
art.loading.show = false;
```

## mask

-   Type: `Object`

| propertie | type     | Description  |
| --------- | -------- | ------------ |
| `show`    | `setter` | Show or hide |

```js
// Show the mask
art.mask.show = true;

// Hide the mask
art.mask.show = false;
```

## setting

Setting manager, and every setting has `show` and `hide` funciton

-   Type: `Object`

| propertie | type       | Description               |
| --------- | ---------- | ------------------------- |
| `add`     | `Function` | Dynamically add a setting |
| `show`    | `setter`   | Show or hide              |

[Run Code](/Properties.setting)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    setting: true,
});

art.setting.add({
    html: 'Your Setting',
    name: 'yourSetting',
});

// Show the setting
art.setting.show = true;

// Hide the setting
art.setting.show = false;
```

## plugins

Plugins manager

-   Type: `Object`

| propertie | type       | Description              |
| --------- | ---------- | ------------------------ |
| `add`     | `Function` | Dynamically add a plugin |

[Run Code](/Properties.plugins)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
});

art.plugins.add(function myPlugin(art) {
    // Do something you like here.
    // You can also return an object for external calls.
    console.info('myPlugin running...');
    return {
        // This exposes plugin properties or methods for others to use. Like:
        something: 'something',
        doSomething: function() {
            console.info('Do something here...');
        },
    };
});

// Call plugin from the outside
art.plugins.myPlugin.something === 'something';
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
| `Artplayer.option`    | `Object` | Default option            |
| `Artplayer.instances` | `Array`  | Instance collection       |
| `Artplayer.scheme`    | `Array`  | Option scheme             |
| `Artplayer.Emitter`   | `Array`  | Emitter constructor       |
| `Artplayer.validator` | `Array`  | Option validator          |
| `Artplayer.kindOf`    | `Array`  | Data type detection tool  |

# Event

```js
art.on('ready', function(args) {
    console.log('The player can play');
});
```

## Instance

| Event                  | Description                             | Parameter           |
| ---------------------- | --------------------------------------- | ------------------- |
| `ready`                | When the video can be played            | `undefined`         |
| `play`                 | When the video play                     | `undefined`         |
| `pause`                | When the video pause                    | `undefined`         |
| `seek`                 | When the video seek                     | Video current time  |
| `volume`               | When the video volume change            | Video volume value  |
| `destroy`              | When the instance is destroyed          | `undefined`         |
| `focus`                | When the player gets focus              | `undefined`         |
| `blur`                 | When the player loses focus             | `undefined`         |
| `hoverenter`           | When the mouse is moved into the player | `undefined`         |
| `hoverleave`           | When the mouse is moved out the player  | `undefined`         |
| `resize`               | When the player resize                  | Player size         |
| `mousemove`            | When the mouse moves over the player    | `undefined`         |
| `aspectRatioChange`    | When aspect ratio change                | Aspect ratio        |
| `aspectRatioRemove`    | When aspect ratio remove                | `undefined`         |
| `aspectRatioReset`     | When aspect ratio reset                 | `undefined`         |
| `beforeCustomType`     | Before triggering CustomType            | Type name           |
| `afterCustomType`      | After triggering CustomType             | Type name           |
| `beforeAttachUrl`      | Before the video url change             | Video url           |
| `afterAttachUrl`       | After the video url change              | Video url           |
| `autoSizeChange`       | When the player auto size change        | Player size         |
| `autoSizeRemove`       | When the player auto size remove        | `undefined`         |
| `flipChange`           | When the player flip change             | Flip name           |
| `flipRemove`           | When the player flip remove             | `undefined`         |
| `fullscreenChange`     | When the full screen status change      | Whether full screen |
| `fullscreenEnabled`    | When entering full screen               | `undefined`         |
| `fullscreenExit`       | When exiting full screen                | `undefined`         |
| `fullscreenWebEnabled` | When entering web full screen           | `undefined`         |
| `fullscreenWebExit`    | When exiting web full screen            | `undefined`         |
| `pipEnabled`           | When entering picture in picture        | `undefined`         |
| `pipExit`              | When exiting picture in picture         | `undefined`         |
| `playbackRateChange`   | When playback rate change               | Playback rate       |
| `playbackRateRemove`   | When playback rate remove               | `undefined`         |
| `playbackRateReset`    | When playback rate reset                | `undefined`         |
| `screenshot`           | When a screenshot occurs                | Image data uri      |
| `switch`               | When switching video url                | Video url           |

## Video (Native event)

You can use all the native events of video directly: [MDN web docs - Media events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events).

But be careful to add the `video` prefix in front of the event:

```js
art.on('video:canplay', function(event) {
    console.log(event);
});
```

## Subtitle

| Event             | Description                   | Parameter             |
| ----------------- | ----------------------------- | --------------------- |
| `subtitle:update` | When the subtitles change     | Current subtitle text |
| `subtitle:switch` | When switching subtitles      | Current subtitle url  |
| `subtitle:load`   | When the subtitles loaded     | Current subtitle url  |
| `subtitle:err`    | When the subtitles load error | Error object          |
| `subtitle:toggle` | When displaying subtitles     | Whether to show       |

## Notice

| Event           | Description            | Parameter       |
| --------------- | ---------------------- | --------------- |
| `notice:toggle` | When displaying notice | Whether to show |

## Mask

| Event         | Description          | Parameter       |
| ------------- | -------------------- | --------------- |
| `mask:toggle` | When displaying mask | Whether to show |

## Loading

| Event            | Description             | Parameter       |
| ---------------- | ----------------------- | --------------- |
| `loading:toggle` | When displaying loading | Whether to show |

## Layer

| Event          | Description             | Parameter           |
| -------------- | ----------------------- | ------------------- |
| `layer:add`    | When adding a new layer | Layer configuration |
| `layer:toggle` | When displaying layer   | Whether to show     |

## Info

| Event         | Description          | Parameter       |
| ------------- | -------------------- | --------------- |
| `info:toggle` | When displaying info | Whether to show |

## Hotkey

| Event    | Description                  | Parameter           |
| -------- | ---------------------------- | ------------------- |
| `hotkey` | When the hotkey is triggered | Hotkey event object |

## Setting

| Event            | Description               | Parameter             |
| ---------------- | ------------------------- | --------------------- |
| `setting:add`    | When adding a new setting | Setting configuration |
| `setting:toggle` | When displaying setting   | Whether to show       |

## Contextmenu

| Event                | Description                   | Parameter                 |
| -------------------- | ----------------------------- | ------------------------- |
| `contextmenu:add`    | When adding a new contextmenu | Contextmenu configuration |
| `contextmenu:toggle` | When displaying contextmenu   | Whether to show           |

## Control

| Event            | Description               | Parameter             |
| ---------------- | ------------------------- | --------------------- |
| `control:add`    | When adding a new control | Control configuration |
| `control:toggle` | When displaying control   | Whether to show       |

## Plugins

| Event        | Description              | Parameter            |
| ------------ | ------------------------ | -------------------- |
| `plugin:add` | When adding a new plugin | Plugin configuration |

# Third-party libraries

## flv.js

-   HomePage: [https://github.com/Bilibili/flv.js](https://github.com/Bilibili/flv.js)

[Run Code](/lib=https://cdn.bootcss.com/flv.js/1.4.2/flv.js)

```js
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
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
    autoplay: true,
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
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
    autoplay: true,
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
    autoplay: true,
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
    autoplay: true,
    url:
        'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4',
    type: 'torrent',
    customType: {
        torrent: function(video, url, art) {
            var client = new WebTorrent();
            art.loading.show = true;
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
