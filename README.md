# ArtPlayer

[![Build Status](https://www.travis-ci.org/zhw2590582/ArtPlayer.svg?branch=master)](https://www.travis-ci.org/zhw2590582/ArtPlayer)
![version](https://badgen.net/npm/v/artplayer)
![license](https://badgen.net/npm/license/artplayer)
![size](https://badgen.net/bundlephobia/minzip/artplayer)
[![npm Downloads](https://img.shields.io/npm/dt/artplayer.svg)](https://www.npmjs.com/package/artplayer)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/354e9953b70a4791a5a46194d587c707)](https://www.codacy.com/app/zhw2590582/ArtPlayer?utm_source=github.com&utm_medium=referral&utm_content=zhw2590582/ArtPlayer&utm_campaign=Badge_Grade)
[![dependencies Status](https://david-dm.org/zhw2590582/artplayer/status.svg)](https://david-dm.org/zhw2590582/artplayer)

> :art: ArtPlayer.js is a modern and full featured HTML5 video player

![Screenshot](./images/screenshot.png)

## Features

-   Support `vtt` and `srt` subtitles
-   Support video quality switching
-   Support for custom `control`, `layer`, `contextmenu`, `setting`
-   Support `playback rate`, `aspect ratio`, `flip`, `window fullscreen` or `web fullscreen` adjustment
-   Support integration with other dependencies, like: `flv.js`, `hls.js`, `dash.js`, `shaka-player`, `webtorrent`
-   Support chrome native picture-in-picture mode, or custom picture-in-picture mode
-   Support `thumbnails` and `highlight` in the progress bar
-   Support to maintain the original video ratio, adaptive size
-   Support rich custom event monitoring, easy to expand
-   Support for internationalization of controls
-   Support for custom plugins
-   Support local video preview
-   Support subtitle time offset
-   Support `screenshot`
-   And more...

## Ecosystem

| Project                                                                                                               | Description                    | Demo                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [artplayer-plugin-danmuku](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-danmuku)     | Danmuku plugin for ArtPlayer   | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-danmuku.js&example=danmuku)                                                    |
| [artplayer-plugin-gif](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-gif)             | Gif plugin for ArtPlayer       | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-gif.js&example=gif)                                                            |
| [artplayer-plugin-backlight](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-backlight) | Backlight plugin for ArtPlayer | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-backlight.js&example=backlight)                                                |
| [artplayer-plugin-playlist](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-playlist)   | Playlist plugin for ArtPlayer  | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-playlist.js%0A.%2Funcompiled%2Fartplayer-plugin-playlist.css&example=playlist) |
| [artplayer-tool-thumbnail](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-tool-thumbnail)     | Thumbnail tool for ArtPlayer   | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-tool-thumbnail.js&example=thumbnail)                                                  |
| [artplayer-tool-github](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-tool-github)           | Github api tool for ArtPlayer  | [demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-tool-github.js%0A.%2Funcompiled%2Fartplayer-plugin-danmuku.js&example=github)         |  |
| [artplayer-react](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-react)                       | React Component for Artplayer  | [demo](https://codesandbox.io/s/n74859y9rl)                                                                                                         |
| [artplayer-vue](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-vue)                           | Vue Component for Artplayer    | [demo](https://codesandbox.io/s/6z76lm109n)                                                                                                         |

## Demo

[Checkout the demo](https://artplayer.org/) from Github Pages

## Document

[Checkout the Document](https://artplayer.org/document) from Github Pages

## Install

Install with `npm`

```bash
$ npm install artplayer
```

Or install with `yarn`

```bash
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

## Contribution

Installation dependency

```bash
$ npm install
$ npm run bootstrap
```

Run the developer mode and select the project you want to develop

```bash
$ npm run dev
```

Open web server

```bash
$ npm start
```

## Donations

We accept donations through these channels:

-   [Paypal](https://www.paypal.me/harveyzack)
-   [WeChat Pay](./images/wechatpay.jpg)
-   [Alipay](./images/alipay.jpg)

## QQ Group

![QQ Group](./images/qqgroup.png)

## License

MIT © [Harvey Zack](https://sleepy.im/)
