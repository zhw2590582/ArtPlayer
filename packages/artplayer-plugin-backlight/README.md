# artplayer-plugin-gif

Backlight plugin for ArtPlayer

## Demo

[Checkout the demo](https://artplayer.org/backlight/) from Github Pages

## Install

Install with `npm`

```
$ npm install artplayer-plugin-backlight
```

Or install with `yarn`

```
$ yarn add artplayer-plugin-backlight
```

```js
import artplayerPluginBacklight from 'artplayer-plugin-backlight';
```

Or umd builds are also available

```html
<script src="artplayer-plugin-backlight.js"></script>
```

Will expose the global variable to `window.artplayerPluginBacklight`.

## Usage

This will add a button called "GIF" in the bottom control bar.

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [artplayerPluginBacklight],
});
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
