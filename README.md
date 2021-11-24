# ArtPlayer.js

> :art: ArtPlayer.js is a modern and full featured HTML5 video player

![version](https://badgen.net/npm/v/artplayer)
![license](https://badgen.net/npm/license/artplayer)
![size](https://badgen.net/bundlephobia/minzip/artplayer)
[![npm Downloads](https://img.shields.io/npm/dt/artplayer.svg)](https://www.npmjs.com/package/artplayer)

![Screenshot](./images/screenshot.png)

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

## Homepage

[https://artplayer.org](https://artplayer.org)

## Mobile Demo

![mobile](./images/mobile.png)

## Document

[https://artplayer.org/document](https://artplayer.org/document)

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

## Contribution

Installation dependency:

```bash
$ npm install && npm run bootstrap
```

Run the developer mode and select the project you want to develop:

```bash
$ npm run dev
```

Open web server:

```bash
$ npm start
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
