<h2 align="center">
    <a href="https://artplayer.org">ArtPlayer.js</a>
</h2>

<p align="center">
    :art: ArtPlayer.js is a modern and full featured HTML5 video player
</p>

<p align="center">
  <img src="https://img.shields.io/workflow/status/zhw2590582/artplayer/master" alt="Build Status">
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
</p>

<p align="center">
    <a href="https://artplayer.org">
        <img src="./images/screenshot.png" alt="screenshot">
    </a>
</p>

## Features

-   <b>Size</b> - `27kB` minified and gzipped
-   <b>Subtitle</b> - Support for `.VTT`, `.ASS` and `.SRT` formats
-   <b>Customizable</b> - `Right Click Menu`, `Business Layer`, `Video Controller` and `Settings Panel`
-   <b>Controller</b> - `Quality Switch`, `Subtitle Switch`, `Play Speed`, `Aspect Ratio`, `Video Flip`, `Fullscreen`, `Picture In Picture`, `Screenshot`, `Thumbnail`, `Adaptive Size`, `Highlight` and `Hotkey`...
-   <b>Built-in</b> - `Open Local Subtitles`, `Open Local Video`, `Mini Progress Bar`, `Network Detection` and `Subtitle Time Offset`
-   <b>Integration</b> - Easy to integration with other dependencies: `flv.js`, `hls.js`, `dash.js`, `shaka-player`, `webtorrent`...
-   <b>Code</b> - Vanilla `ES6` and `SASS`, Highly decoupled code, clear structure, easy to track bugs and add new features
-   <b>Document</b> - Detailed interface documentation and rich code demo
-   <b>API</b> - Rich interface and response events, easy to interface with business or custom plugin
-   <b>I18N</b> - support for internationalization of controls

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

Or umd builds are also available:

```html
<script src="path/to/artplayer.js"></script>
```

Or from jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
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

## Donations

We accept donations through these channels:

![pay](./images/pay.png)

-   [Patreon](https://www.patreon.com/artplayer)
-   [Paypal](https://www.paypal.me/harveyzack)

## QQ Group

![QQ Group](./images/qqgroup.png)

## License

MIT © Harvey Zack
