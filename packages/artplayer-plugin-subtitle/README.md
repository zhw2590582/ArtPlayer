# artplayer-plugin-subtitle

Subtitle plugin for ArtPlayer

## Install

Install with `npm`

```
$ npm install artplayer-plugin-subtitle
```

Or install with `yarn`

```
$ yarn add artplayer-plugin-subtitle
```

```js
import artplayerPluginSubtitle from 'artplayer-plugin-subtitle';
```

Or umd builds are also available

```html
<script src="path/to/artplayer-plugin-subtitle.js"></script>
```

Will expose the global variable to `window.artplayerPluginSubtitle`.

## Usage

```html
<div class="artplayer-app"></div>
```

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [
        artplayerPluginSubtitle({
            time: -1, // Subtitle delay time, ranging from -10 to 10
        }),
    ],
});
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
