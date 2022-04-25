---
title: Basic options
sidebar_position: 2
slug: /options
---

## container

-   Type: `String、Element`
-   Default: `#artplayer`
-   Required: `Yes`

The dom container mounted by the player must have a size, otherwise the player cannot display

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

You may need to initialize the size of the container element, such as:

```css
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

## url

-   Type: `String`
-   Default: `''`
-   Required: `Yes`

Video source address, default support three video file formats: `.mp4`、`.ogg`、`.webm`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## Ready Callback

-   Type: `Function`
-   Default: `undefined`

The constructor accepts a function as the second parameter, fired when the player is initialized and the video can be play, just like `ready` event

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
}, function() {
    this.play();
});
```

:::tip 提示

The `this` in the callback function is the player instance, but the callback function is used to use the arrow function, `this` is not to point to the player instance

:::

## poster

-   Type: `String`
-   Default: `''`

The poster of the video will only appear in a state in which the player is initialized and not played.

<div className="run-code">▶ Run Code</div>

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

Video headings, currently appear in video screenshots and mini mode

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: '【新海诚动画】『秒速5センチメートル』',
    screenshot: true,
});
```

## theme

-   Type: `String`
-   Default: `#f00`

Player theme color, currently only on the progress bar

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    theme: '#ffad00',
});
```

## volume

-   Type: `Number`
-   Default: `0.7`

Default volume of the player

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::tip Tip

The player caches the size of the last volume, when the next initialization (such as refreshing the page) player reads the cache value

:::

## isLive

-   Type: `Boolean`
-   Default: `false`

Use live mode, hide progress bar and play time

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    isLive: true,
});
```

## muted

-   Type: `Boolean`
-   Default: `false`

Whether the default mute

<div className="run-code">▶ Run Code</div>

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

Whether automatic play

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
    muted: true,
});
```

:::tip Tip

If you want the default to enter the page, you can automatically play the video, `muted` must be `true`, more information, please read [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

:::

## autoSize

-   Type: `Boolean`
-   Default: `false`

The size of the player will populate the entire `container` size, so there is often a black edge, the option can automatically adjust the player size to hide the black side.

<div className="run-code">▶ Run Code</div>

```js
// Zoom browser window View effect
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});
```

## autoMini

-   Type: `Boolean`
-   Default: `false`

When the player scrolls outside the browser viewport, automatically enter the mini play mode

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoMini: true,
});
```

## loop

-   Type: `Boolean`
-   Default: `false`

Whether loop playing

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    loop: true,
});
```

## flip

-   Type: `Boolean`
-   Default: `false`

Whether to display a video flip function, currently appear in the `setting panel`, so you need to set up `setting` is True

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    flip: true,
    setting: true,
});
```

## playbackRate

-   Type: `Boolean`
-   Default: `false`

Whether the video playback speed function is displayed, it will appear in the setting panel and contextmenu

<div className="run-code">▶ Run Code</div>

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

Whether to display video long aspect ratio, it will appear in the setting panel and contextmenu

<div className="run-code">▶ Run Code</div>

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

Whether to display video screenshots in the bottom control bar

<div className="run-code">▶ Run Code</div>

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

:::tip Tip

Because browser security mechanisms, if video source addresses and websites are cross-domain, screenshot failed

:::

## setting

-   Type: `Boolean`
-   Default: `false`

Whether to display the setting panel of the switch button in the bottom control bar

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});
```

## hotkey

-   Type: `Boolean`
-   Default: `true`

Whether to use shortcut keys

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    hotkey: true,
});
```

| Hotkey  | Describe                |
| ------- | ----------------------- |
| `↑`     | Increasing volume       |
| `↓`     | lower the volume        |
| `←`     | Fast forward 5 seconds  |
| `→`     | Fast backward 5 seconds |
| `space` | Switch play / pause     |

:::tip Tip

This hotkey will take effect only after the player gets the focus (if you click on the player).

:::

## pip

-   Type: `Boolean`
-   Default: `false`

Whether to display the PIP switch button in the bottom control bar

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});
```

## mutex

-   Type: `Boolean`
-   Default: `true`

If there are multiple players on the page at the same time, can only one player be allowed to play

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    mutex: true,
});
```

## fullscreen

-   Type: `Boolean`
-   Default: `false`

Whether to display the full screen button of the player window in the bottom control bar

<div className="run-code">▶ Run Code</div>

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

Whether to display the full screen button of the player webpage in the bottom control bar

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});
```

## subtitleOffset

-   Type: `Boolean`
-   Default: `false`

Subtitle time offset, in the range `[-5s, 5s]`

<div className="run-code">▶ Run Code</div>

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

Mini progress bar, only appears when the player loses focus and is playing

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```

## useSSR

-   Type: `Boolean`
-   Default: `false`

Whether to use SSR mounting mode, it is useful if you want to render the HTML required by the player in advance before mounting the player

You can access the HTML required by the player through Artplayer.html

<div className="run-code">▶ Run Code</div>

```js
var $container = document.querySelector('.artplayer-app');
$container.innerHTML = Artplayer.html;

var art = new Artplayer({
    container: $container,
    url: '/assets/sample/video.mp4',
    useSSR: true,
});
```

:::tip Tip

SSR is the abbreviation of Server Side Render. The content on the page is generated by server side rendering, and the browser directly displays the HTML returned by the server side.

:::

## playsInline

-   Type: `Boolean`
-   Default: `true`

Whether use playsInline in mobile

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playsInline: true,
});
```

## layers

-   Type: `Array`
-   Default: `[]`

Initialize a custom layers

| Property  | Type                | Description                                                   |
| --------- | ------------------- | ------------------------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable the component                              |
| `name`    | `String`            | The unique name of the component, used to mark the class name |
| `index`   | `Number`            | Component index, priority for display                         |
| `html`    | `String`、`Element` | DOM element of the component                                  |
| `style`   | `Object`            | Component style object                                        |
| `click`   | `Function`          | Component click event                                         |
| `mounted` | `Function`          | Triggered after the component is mounted                      |
| `tooltip` | `String`            | Prompt text of the component                                  |

<div className="run-code">▶ Run Code</div>

```js
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            index: 1,
            name: 'potser',
            disable: false,
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
            click: function (...args) {
                console.info('You click on the component');
                art.layers.show = false;
            },
            mounted: function (...args) {
                console.info('Component mount completion');
            },
        },
    ],
});
```

## settings

-   Type: `Array`
-   Default: `[]`

Initialize custom setting panel, please visit [How to add setting panel](/document/en/Questions/How%20to%20add%20setting%20panel)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Custom setting 01',
            selector: [
                {
                    html: 'Submenu 01',
                },
                {
                    html: 'Submenu 02',
                },
            ],
            onSelect: function(item) {
                console.log(item.html);
            }
        },
        {
            html: 'Custom setting 02',
            selector: [
                {
                    html: 'Submenu 01',
                },
                {
                    html: 'Submenu 02',
                },
            ],
            onSelect: function(item) {
                console.log(item.html);
            }
        },
    ],
});
```

## contextmenu

-   Type: `Array`
-   Default: `[]`

Initialize custom contextmenu

| Property  | Type                | Description                                                   |
| --------- | ------------------- | ------------------------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable the component                              |
| `name`    | `String`            | The unique name of the component, used to mark the class name |
| `index`   | `Number`            | Component index, priority for display                         |
| `html`    | `String`、`Element` | DOM element of the component                                  |
| `style`   | `Object`            | Component style object                                        |
| `click`   | `Function`          | Component click event                                         |
| `mounted` | `Function`          | Triggered after the component is mounted                      |
| `tooltip` | `String`            | Prompt text of the component                                  |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            html: 'Custom menu',
            click: function () {
                console.info('You clicked the custom menu');
                art.contextmenu.show = false;
            },
        },
    ],
});

art.on('ready', () => {
    art.contextmenu.show = true;
});
```

## controls

-   Type: `Array`
-   Default: `[]`

Initialize the customized bottom control bar

| Property   | Type                | Description                                                   |
| ---------- | ------------------- | ------------------------------------------------------------- |
| `disable`  | `Boolean`           | Whether to disable the component                              |
| `name`     | `String`            | The unique name of the component, used to mark the class name |
| `index`    | `Number`            | Component index, priority for display                         |
| `html`     | `String`、`Element` | DOM element of the component                                  |
| `style`    | `Object`            | Component style object                                        |
| `click`    | `Function`          | Component click event                                         |
| `mounted`  | `Function`          | Triggered after the component is mounted                      |
| `tooltip`  | `String`            | Prompt text of the component                                  |
| `position` | `String`            | Location at `left` or `right`                                 |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            disable: false,
            name: 'button',
            index: 10,
            position: 'right',
            html: 'Custom button1',
            tooltip: 'Custom button1',
            style: {
                color: 'red',
            },
            click: function () {
                console.log('You clicked custom button 1');
            },
            mounted: function () {
                console.log('Custom button mounting is complete 1');
            },
        },
        {
            position: 'left',
            html: 'Custom button2',
            tooltip: 'Custom button2',
            style: {
                color: 'green',
            },
            click: function () {
                console.log('You clicked custom button 2');
            },
        },
    ],
});
```

## quality

-   Type: `Array`
-   Default: `[]`

Whether to display the quality selection list in the bottom control bar

| Property  | Type      | Description     |
| --------- | --------- | --------------- |
| `default` | `Boolean` | Default quality |
| `html`    | `String`  | Quality name    |
| `url`     | `String`  | Quality address |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    quality: [
        {
            default: true,
            html: 'SD 480P',
            url: '/assets/sample/video.mp4',
        },
        {
            html: 'HD 720P',
            url: '/assets/sample/video.mp4',
        },
    ],
});
```

## highlight

-   Type: `Array`
-   Default: `[]`

Show highlighted information points on the progress bar

| Property | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| `time`   | `Number` | Highlight time (unit seconds) |
| `text`   | `String` | Highlight text                |

<div className="run-code">▶ Run Code</div>

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

## plugins

-   Type: `Array`
-   Default: `[]`

Initialization custom plugins

<div className="run-code">▶ Run Code</div>

```js
function myPlugin(art) {
    console.info('You can access an instance of a player in the plugin');
    return {
        name: 'myPlugin',
        something: 'Custom export properties',
        doSomething: function () {
            console.info('Custom export method');
        },
    };
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [myPlugin],
});

art.on('ready', () => {
    console.info(art.plugins.myPlugin.something);
    console.info(art.plugins.myPlugin.doSomething());
});
```

## whitelist

-   Type: `Array`
-   Default: `[]`

Because there are a variety of differences and restrictions in different mobile devices, this player is mount video by default on mobile devices. If you want to use this player on mobile devices, you need to manually open white list.

The whitelist is an array type, which matches the `window.navigator.userAgent`, as long as one of the match is successful, enable the player

Support `string` match, `function` match, `regular` match

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    // whitelist: [(ua) => /iPhone OS 11/gi.test(ua)],
    // whitelist: [/iPhone OS 11/gi],
    // whitelist: ['iPhone OS 11'],
    whitelist: ['*'],
});
```

:::tip Tip

If you want all types of mobile devices to enable players, set the whitelist to wildcard: `['*']`

:::

## thumbnails

-   Type: `Object`
-   Default: `{}`

Set a preview map on the progress bar

| Property | Type     | Description    |
| -------- | -------- | -------------- |
| `url`    | `String` | Preview url    |
| `number` | `Number` | Preview number |
| `column` | `Number` | Preview column |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 100,
        column: 10,
    },
});
```

## subtitle

-   Type: `Object`
-   Default: `{}`

Set the subtitles of the video, support subtitles format: `vtt`、`srt`、`ass`

| Property   | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `url`      | `String` | Subtitle url                       |
| `type`     | `String` | Subtitle type: `vtt`, `srt`, `ass` |
| `style`    | `Object` | Subtitle style                     |
| `encoding` | `String` | Subtitle encoding, default `utf-8` |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        type: 'srt',
        encoding: 'utf-8',
        style: {
            color: '#03A9F4',
            'font-size': '30px',
        },
    },
});
```

## moreVideoAttr

-   Type: `Object`
-   Default: `{'controls': false,'preload': 'metadata'}`

More video properties, these properties will be written directly into video elements

<div className="run-code">▶ Run Code</div>

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

## icons

-   Type: `Object`
-   Default: `{}`

Used to replace the default icon, support `HTML` string

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    icons: {
        loading: '<img src="/assets/img/ploading.gif">',
        state: '<img src="/assets/img/state.png">',
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
        indicator: '',
    },
});
```

## type

-   Type: `String`
-   Default: `''`

Used to specify the format of the video, you need to use the CustomType to use, please visit [Libraries](/document/libraries)

The default video format is the suffix of video addresses (such as .flv,.mkv, .ts), but sometimes video address does not have the correct suffix, so it is necessary to specify

<div className="run-code">▶ Run Code</div>

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

Match by the format of the video, hand over video decoding to third party programs, please visit [Libraries](/document/libraries)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.flv',
    customType: {
        flv: function (video, url, art) {
            // video: Video DOM element
            // url: Video url
            // art: Current instance
        },
    },
});
```

## lang

-   Type: `String`
-   Default: `navigator.language.toLowerCase()`

Default display language, currently support: `en`、`zh-cn`、`zh-tw`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

## lock

-   Type: `Boolean`
-   Default: `true`

Whether to display a lock button on the mobile side to hide the bottom control bar

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});
```

## autoPlayback

-   Type: `Boolean`
-   Default: `false`

Whether to use auto playback

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoPlayback: true,
});
```