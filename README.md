<h2 align="center">
    <p><img src="./images/logo.png" width="100" alt="logo"></p>
    <a href="https://artplayer.org">ArtPlayer.js</a>
</h2>

<p align="center">
    :art: ArtPlayer.js is a modern and full featured HTML5 video player
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/artplayer">
    <img src="https://img.shields.io/bundlephobia/minzip/artplayer" alt="Size">
    <img src="https://img.shields.io/npm/dm/artplayer.svg?sanitize=true" alt="Downloads">
    <img src="https://img.shields.io/npm/v/artplayer.svg?sanitize=true" alt="Version">
    <img src="https://img.shields.io/npm/l/artplayer.svg?sanitize=true" alt="License">
    <img src="https://data.jsdelivr.com/v1/package/npm/artplayer/badge?style=rounded" alt="jsdelivr">
  </a>
</p>

<p align="center">
  <span>・</span>
  <a href="https://artplayer.org">Online Editor</a>
  <span>・</span>
  <a href="https://artplayer.org/document">API Document</a>
  <span>・</span>
  <a href="https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku">Danmuku</a>
  <span>・</span>
  <a href="./CHANGELOG.md">Changelog</a>
  <span>・</span>
  <a href="https://artplayer.org/llms.txt">🤖LLMs</a>
  <span>・</span>
</p>

<p align="center">
    <a href="https://artplayer.org">
        <img src="./images/screenshot.png" alt="screenshot" width="720">
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
import Artplayer from 'artplayer'
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
let art = new Artplayer({
  container: '.artplayer-app',
  url: 'path/to/video.mp4',
})
```

## Plugins

| Name | Describe | State |
| :--- | :--- | :--- |
| [artplayer-plugin-danmuku](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku) | Danmuku (bullet comment) system | <img src="https://img.shields.io/npm/dm/artplayer-plugin-danmuku.svg?sanitize=true"> |
| [artplayer-plugin-iframe](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-iframe/index.js&example=iframe) | Control player via iframe | <img src="https://img.shields.io/npm/dm/artplayer-plugin-iframe.svg?sanitize=true"> |
| [artplayer-plugin-hls-control](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js%0A./uncompiled/artplayer-plugin-hls-control/index.js&example=hls.control) | HLS quality control | <img src="https://img.shields.io/npm/dm/artplayer-plugin-hls-control.svg?sanitize=true"> |
| [artplayer-plugin-dash-control](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-control/index.js&example=dash.control) | DASH quality control | <img src="https://img.shields.io/npm/dm/artplayer-plugin-dash-control.svg?sanitize=true"> |
| [artplayer-plugin-vtt-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail) | VTT thumbnail preview | <img src="https://img.shields.io/npm/dm/artplayer-plugin-vtt-thumbnail.svg?sanitize=true"> |
| [artplayer-plugin-multiple-subtitles](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles) | Multiple subtitles support | <img src="https://img.shields.io/npm/dm/artplayer-plugin-multiple-subtitles.svg?sanitize=true"> |
| [artplayer-plugin-chromecast](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chromecast/index.js&example=chromecast) | Google Chromecast support | <img src="https://img.shields.io/npm/dm/artplayer-plugin-chromecast.svg?sanitize=true"> |
| [artplayer-plugin-vast](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast) | VAST/VPAID advertising | <img src="https://img.shields.io/npm/dm/artplayer-plugin-vast.svg?sanitize=true"> |
| [artplayer-plugin-chapter](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter) | Video chapters support | <img src="https://img.shields.io/npm/dm/artplayer-plugin-chapter.svg?sanitize=true"> |
| [artplayer-plugin-auto-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-auto-thumbnail/index.js&example=auto.thumbnail) | Auto-generated thumbnails | <img src="https://img.shields.io/npm/dm/artplayer-plugin-auto-thumbnail.svg?sanitize=true"> |
| [artplayer-plugin-ambilight](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight) | Ambilight effect | <img src="https://img.shields.io/npm/dm/artplayer-plugin-ambilight.svg?sanitize=true"> |
| [artplayer-plugin-document-pip](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-document-pip/index.js&example=document.pip) | Document Picture-in-Picture | <img src="https://img.shields.io/npm/dm/artplayer-plugin-document-pip.svg?sanitize=true"> |
| [artplayer-plugin-audio-track](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-audio-track/index.js&example=audio.track) | Independent audio track playback | <img src="https://img.shields.io/npm/dm/artplayer-plugin-audio-track.svg?sanitize=true"> |
| [artplayer-plugin-jassub](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-jassub/index.js&example=jassub) | ASS/SSA subtitle support | <img src="https://img.shields.io/npm/dm/artplayer-plugin-jassub.svg?sanitize=true"> |
| [artplayer-plugin-danmuku-mask](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js%0A./uncompiled/artplayer-plugin-danmuku-mask/index.js&example=danmuku.mask) | Danmuku masking (smart blocking) | <img src="https://img.shields.io/npm/dm/artplayer-plugin-danmuku-mask.svg?sanitize=true"> |
| [artplayer-plugin-asr](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-asr/index.js&example=asr) | Automatic Speech Recognition | <img src="https://img.shields.io/npm/dm/artplayer-plugin-asr.svg?sanitize=true"> |
| [artplayer-plugin-ads](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads) | Video advertising plugin | WIP |

## Libraries

| Name | Describe | State |
| :--- | :--- | :--- |
| [hls.js](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js&example=hls) | HLS client | <img src="https://img.shields.io/npm/dm/hls.js.svg?sanitize=true"> |
| [dash.js](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js&example=dash) | MPEG DASH player | <img src="https://img.shields.io/npm/dm/dashjs.svg?sanitize=true"> |
| [flv.js](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js&example=flv) | HTML5 FLV Player | <img src="https://img.shields.io/npm/dm/flv.js.svg?sanitize=true"> |
| [mpegts.js](https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/mpegts.js@1.7.3/dist/mpegts.min.js&example=mpegts) | MPEG-TS/FLV Player | <img src="https://img.shields.io/npm/dm/mpegts.js.svg?sanitize=true"> |
| [webtorrent.js](https://artplayer.org/?libs=https://cdn.jsdelivr.net/npm/webtorrent@1/webtorrent.min.js&example=webtorrent) | Streaming torrent client | <img src="https://img.shields.io/npm/dm/webtorrent.svg?sanitize=true"> |

## Proxys

| Name | Describe | State |
| :--- | :--- | :--- |
| [Canvas](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas) | Proxy video to canvas | <img src="https://img.shields.io/npm/dm/artplayer-proxy-canvas.svg?sanitize=true"> |
| [Mediabunny](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-mediabunny/index.js&example=mediabunny) | Mediabunny proxy | <img src="https://img.shields.io/npm/dm/artplayer-proxy-mediabunny.svg?sanitize=true"> |

## Changelog

[CHANGELOG.md](./CHANGELOG.md)

## Contributing

[CONTRIBUTING.md](./CONTRIBUTING.md)

## Donations

We accept donations through these channels:

![pay](./images/pay.png)

- [Patreon](https://www.patreon.com/artplayer)
- [Paypal](https://www.paypal.me/harveyzack)

## QQ Group

![QQ Group](./images/qqgroup.png)

## License

MIT © Harvey Zack
