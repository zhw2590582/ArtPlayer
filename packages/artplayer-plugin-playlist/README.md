# artplayer-plugin-playlist

Playlist plugin for ArtPlayer

## Demo

[Checkout the demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-playlist.js&example=playlist) from Github Pages

## Install

Install with `npm`

```
$ npm install artplayer-plugin-playlist
```

Or install with `yarn`

```
$ yarn add artplayer-plugin-playlist
```

```js
import artplayerPluginPlaylist from 'artplayer-plugin-playlist';
```

Or umd builds are also available

```html
<script src="artplayer-plugin-playlist.js"></script>
```

Will expose the global variable to `window.artplayerPluginPlaylist`.

## Usage

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [artplayerPluginPlaylist],
});
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
