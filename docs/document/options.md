## container

-   Type: `String、Element`
-   Default: `#artplayer`
-   Required: `true`

DOM container of the player

[Run Code](/Configuration.container)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## type

-   Type: `String`
-   Default: `''`

Specify the format for the `url`, use with `customType`

[Run Code](/Configuration.type)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.flv',
    type: 'flv',
});
```

## customType

-   Type: `Object`
-   Default: `{}`

Customize when loading third-party libraries

[Run Code](/Configuration.customType)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.flv',
    type: 'flv',
    customType: {
        flv: function (video, url, art) {
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

`*` is a special value indicating that all mobile devices have the Artplayer UI enabled

[Open with mobile](https://artplayer.org/mobile.html)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    whitelist: ['iPhone OS 11'],
    // whitelist: ['*'],
    // whitelist: [(ua) => /iPhone OS 11/gi.test(ua)],
    // whitelist: [/iPhone OS 11/gi]
});
```

## poster

-   Type: `String`
-   Default: `''`

Video poster image url

[Run Code](/Configuration.poster)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});
```

## title

-   Type: `String`
-   Default: `''`

Video title, will be shown in `screenshot` file name and `mini` mode

[Run Code](/Configuration.title)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: '【新海诚动画】『秒速5センチメートル』',
    screenshot: true,
});
```

## volume

-   Type: `Number`
-   Default: `0.7`

Default volume, player will cache the last volume, which may be overwritten

[Run Code](/Configuration.volume)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

## muted

-   Type: `Boolean`
-   Default: `false`

Whether to mute by default

[Run Code](/Configuration.muted)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});
```

## autoMin

-   Type: `Boolean`
-   Default: `false`

When the player scrolls out of the viewport, the mini player mode is automatically enabled

[Run Code](/Configuration.autoMin)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoMin: true,
});
```

## loop

-   Type: `Boolean`
-   Default: `false`

Automatic loop playback

[Run Code](/Configuration.loop)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    loop: true,
});
```

## playbackRate

-   Type: `Boolean`
-   Default: `false`

Whether to show playback rate controller in the contextmenu and setting panel

[Run Code](/Configuration.playbackRate)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playbackRate: true,
    setting: true,
});
```

## aspectRatio

-   Type: `Boolean`
-   Default: `false`

Whether to show aspect ratio controller in the contextmenu and setting panel

[Run Code](/Configuration.aspectRatio)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    aspectRatio: true,
    setting: true,
});
```

## screenshot

-   Type: `Boolean`
-   Default: `false`

Whether to show screenshot controller in the bottom, If the video resource exists cross-domain, the screenshot may fail. Unless serves this url with the correct `Access-Control-Allow-Origin`, and Set the video's `crossOrigin` property to `anonymous`

[Run Code](/Configuration.screenshot)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});
```

## fullscreen

-   Type: `Boolean`
-   Default: `false`

Whether to show window fullscreen controller in the bottom

[Run Code](/Configuration.fullscreen)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
});
```

## fullscreenWeb

-   Type: `Boolean`
-   Default: `false`

Whether to show web page fullscreen controller in the bottom

[Run Code](/Configuration.fullscreenWeb)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});
```

## mutex

-   Type: `Boolean`
-   Default: `true`

Player mutually exclusive, only one player can play at a time

[Run Code](/Configuration.mutex)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    mutex: true,
});
```

## light

-   Type: `Boolean`
-   Default: `false`

Whether to display the light mode in the context menu

[Run Code](/Configuration.light)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    light: true,
});
```

## backdrop

-   Type: `Boolean`
-   Default: `true`

Whether to use blurred background in the context menu and settings panel

[Run Code](/Configuration.backdrop)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    backdrop: true,
});
```

## hotkey

-   Type: `Boolean`
-   Default: `true`

Whether to use hotkey

[Run Code](/Configuration.hotkey)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

## icons

-   Type: `Object`
-   Default: `{}`

Replace the default icon

[Run Code](/Configuration.icons)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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
    },
});
```

## theme

-   Type: `String`
-   Default: `#f00`

Default theme color

[Run Code](/Configuration.theme)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    theme: '#ffad00',
});
```

## subtitleOffset

-   Type: `Boolean`
-   Default: `false`

Subtitle time offset plugin

[Run Code](/Configuration.subtitleOffset)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```

## localVideo

-   Type: `Boolean`
-   Default: `false`

Local video preview plugin. By default, a configuration is added in the settings panel.

[Run Code](/Configuration.localVideo)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    localVideo: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: 'OPEN VIDEO',
            mounted: ($preview) => {
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    localSubtitle: true,
    controls: [
        {
            name: 'preview',
            position: 'right',
            html: 'OPEN SUBTITLE',
            mounted: ($preview) => {
                art.plugins.localSubtitle.attach($preview);
            },
        },
    ],
});
```

## networkMonitor

-   Type: `Boolean`
-   Default: `false`

A network monitor is used to monitor the blocking of the video.

[Run Code](/Configuration.networkMonitor)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    networkMonitor: true,
});

// Is the ratio of the time the video is blocked to the time the video has been played.
// For example, when the ratio is equal to 0.3, it means that every 10 seconds of sampling time, it is blocked for three seconds.

let notice = false;
art.on('networkMonitor', (ratio) => {
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
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

| propertie | type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `url`     | `String` | Thumbnails image url                   |
| `number`  | `Number` | Total number of thumbnails             |
| `width`   | `Number` | The width of each thumbnail            |
| `height`  | `Number` | The height of each thumbnail           |
| `column`  | `Number` | Total number of columns for thumbnails |

[Run Code](/Configuration.thumbnails)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsInline: true,
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    quality: [
        {
            default: true,
            name: 'SD 480P',
            url: '/assets/sample/video.mp4',
        },
        {
            name: 'HD 720P',
            url: '/assets/sample/video.mp4',
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
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
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
var layer = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            html: `<img style="width: 100px" src="${layer}">`,
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
| `tooltip` | `String`            | Tooltip text                                  |

[Run Code](/Configuration.contextmenu)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            html: 'Custom menu',
            click: function (contextmenu) {
                console.info('You clicked on the custom menu');
                contextmenu.show = false;
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
| `tooltip`  | `String`            | Tooltip text                                                      |

[Run Code](/Configuration.controls)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'myController',
            position: 'right',
            index: 10,
            html: 'myController',
            tooltip: 'This is my controller',
            click: function () {
                console.log('myController');
            },
        },
    ],
});
```

## plugins

-   Type: `Array`
-   Default: `[]`

Custom plugins, The type of plugin is a function

[Run Code](/Configuration.plugins)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        function myPlugin(art) {
            // Do something you like here.
            // You can also return an object for external calls.
            console.info('myPlugin running...');
            return {
                // This exposes plugin properties or methods for others to use. Like:
                something: 'something',
                doSomething: function () {
                    console.info('Do something here...');
                },
            };
        },
    ],
});

// Call plugin from the outside
art.plugins.myPlugin.doSomething();
```
