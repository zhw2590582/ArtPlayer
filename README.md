# ArtPlayer

[![Build Status](https://www.travis-ci.org/zhw2590582/ArtPlayer.svg?branch=master)](https://www.travis-ci.org/zhw2590582/ArtPlayer)
![version](https://badgen.net/npm/v/artplayer)
![license](https://badgen.net/npm/license/artplayer)
![size](https://badgen.net/bundlephobia/minzip/artplayer)

> ArtPlayer is a modern HTML5 video player

![Screenshot](./screenshot.png)

## Features

* Support `vtt` and `srt` subtitles
* Support video quality switching
* Support for custom `control`, `layer`, `contextmenu`, `setting`
* Support `playback rate`, `aspect ratio`, `flip`, `window fullscreen` or `web fullscreen` adjustment
* Support integration with other dependencies, like: `flv.js`, `hls.js`, `dash.js`, `shaka-player`, `webtorrent`
* Support chrome native picture-in-picture mode, or custom picture-in-picture mode
* Support `thumbnails` and `highlight` in the progress bar
* Support to maintain the original video ratio, adaptive size
* Support rich custom event monitoring, easy to expand
* Support for internationalization of controls
* Support for custom plugins
* Support `screenshot`
* And more...

## Demo

[Checkout the demo](https://artplayer.org/lab/) from Github Pages

## Document

[Checkout the Document](https://artplayer.org/docs) from Github Pages

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

## Changelog

[Checkout the changelog](https://github.com/zhw2590582/ArtPlayer/blob/master/changelog.md)

## Ecosystem

| Project                                                                                                          | Description                   |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [artplayer-plugin-danmu](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-danmu)    | Danmu plugin for ArtPlayer    |
| [artplayer-plugin-subtitle](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-subtitle) | Subtitle plugin for ArtPlayer |

## QQ Group

![QQ Group](./QQgroup.png)

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
