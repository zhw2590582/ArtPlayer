<h2 align="center">
    <p><img src="./images/logo.png" width="100" alt="logo"></p>
    <a href="https://artplayer.org">ArtPlayer.js</a>
</h2>

<p align="center">
    :art: ArtPlayer.js is a modern and full featured HTML5 video player
</p>

<p align="center">
  <img src="https://img.shields.io/bundlephobia/minzip/artplayer" alt="Size">
  <img src="https://img.shields.io/npm/dm/artplayer.svg?sanitize=true" alt="Downloads">
  <img src="https://img.shields.io/npm/v/artplayer.svg?sanitize=true" alt="Version">
  <img src="https://img.shields.io/npm/l/artplayer.svg?sanitize=true" alt="License">
</p>

<p align="center">
  <span>・</span>
  <a href="https://artplayer.org">Online Editor</a>
  <span>・</span>
  <a href="https://artplayer.org/document">API Document</a>
  <span>・</span>
  <a href="https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku">弹幕演示</a>
  <span>・</span>
  <a href="./CHANGELOG_CN.md">更新记录</a>
  <span>・</span>
</p>

<p align="center">
    <a href="https://artplayer.org">
        <img src="./images/screenshot.png" alt="screenshot">
    </a>
</p>

## Home Page

[https://artplayer.org](https://artplayer.org)

## Mobile Demo

<img src="./images/qrcode.png" width="250">

## Features

[ArtPlayer.js](https://artplayer.org) is an easy-to-use and feature-rich HTML5 video player, and most of the player's functional controls support customization, which makes it easy to connect with your business logic. In addition, it directly supports `.vtt`, `.ass` and `.srt` subtitle formats. Integration with other dependencies such as `flv.js`, `hls.js`, `dash.js`, etc. is also very simple. The code is highly decoupled, the structure and logic are clear, and it is easy to track errors and add new features.

## Install

Install with `npm`:

```bash
$ npm install artplayer
```

Or install with `yarn`:

```bash
$ yarn add artplayer
```

```js
import Artplayer from 'artplayer';
```

Or umd build also available:

```html
<script src="path/to/artplayer.js"></script>
```

Or from CDN:

```html
<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/artplayer/dist/artplayer.js"></script>
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

## Plugins

-   [artplayer-plugin-danmuku](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)
-   [artplayer-plugin-danmuku-mask](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js%0A./uncompiled/artplayer-plugin-danmuku-mask/index.js&example=danmuku.mask) (WIP)
-   [artplayer-plugin-ads](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads) (WIP)
-   [artplayer-plugin-iframe](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-iframe/index.js&example=iframe)
-   [artplayer-plugin-hls-control](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js%0A./uncompiled/artplayer-plugin-hls-control/index.js&example=hls.control)
-   [artplayer-plugin-dash-quality](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-quality/index.js&example=dash.quality)
-   [artplayer-plugin-vtt-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail)
-   [artplayer-plugin-multiple-subtitles](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles)
-   [artplayer-plugin-libass](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-libass/index.js&example=libass)
-   [artplayer-plugin-chromecast](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chromecast/index.js&example=chromecast)
-   [artplayer-plugin-vast](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast) (WIP)
-   [artplayer-plugin-chapter](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter)
-   [artplayer-plugin-auto-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-auto-thumbnail/index.js&example=auto.thumbnail)

## Libraries

-   [hls.js](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js&example=hls)
-   [dash.js](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js&example=dash)
-   [flv.js](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js&example=flv)
-   [mpegts.js](https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/mpegts.js@1.7.3/dist/mpegts.min.js&example=mpegts)
-   [webtorrent.js](https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/webtorrent@1/webtorrent.min.js&example=webtorrent)

## Proxys

-   [Canvas](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas)
-   [WebAV](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-webav/index.js&example=webav) (WIP)

## Changelog

[CHANGELOG_CN.md](./CHANGELOG_CN.md)

## Contributing

[CONTRIBUTING.md](./CONTRIBUTING.md)

## Donations

We accept donations through these channels:

![pay](./images/pay.png)

-   [Patreon](https://www.patreon.com/artplayer)
-   [Paypal](https://www.paypal.me/harveyzack)

## QQ Group

![QQ Group](./images/qqgroup.png)

## License

MIT © Harvey Zack
