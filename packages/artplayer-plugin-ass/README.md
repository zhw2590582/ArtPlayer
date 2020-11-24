# artplayer-plugin-ass

Ass plugin for ArtPlayer, use [weizhenye/ASS](https://github.com/weizhenye/ASS) as a dependency

## Demo

[Checkout the demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-ass.js&example=ass) from Github Pages

## Install

Install with `npm`

```bash
$ npm install artplayer-plugin-ass
```

Or install with `yarn`

```bash
$ yarn add artplayer-plugin-ass
```

```js
import artplayerPluginAss from 'artplayer-plugin-ass';
```

Or umd builds are also available

```html
<script src="artplayer-plugin-ass.js"></script>
```

Will expose the global variable to `window.artplayerPluginAss`.

## Usage

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [artplayerPluginAss('path/to/subtitle.ass')],
});
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
