# artplayer-plugin-playlist

Playlist plugin for ArtPlayer

## Demo

[Checkout the demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-playlist.js%0A.%2Funcompiled%2Fartplayer-plugin-playlist.css&example=playlist) from Github Pages

## Install

Install with `npm`

```bash
$ npm install artplayer-plugin-playlist
```

Or install with `yarn`

```bash
$ yarn add artplayer-plugin-playlist
```

```js
import artplayerPluginPlaylist from 'artplayer-plugin-playlist';
import 'artplayer-plugin-playlist/dist/artplayer-plugin-playlist.css';
```

Or umd builds are also available

```html
<link rel="stylesheet" href="path/to/artplayer-plugin-playlist.css" />
<script src="artplayer-plugin-playlist.js"></script>
```

Will expose the global variable to `window.artplayerPluginPlaylist`.

## Usage

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [
        artplayerPluginPlaylist([
            {
                title: 'video01',
                url: 'path/to/video01.mp4',
            },
            {
                title: 'video02',
                url: 'path/to/video02.mp4',
            },
        ]),
    ],
});

// Show Playlist
art.plugins.artplayerPluginPlaylist.show();

// Hide Playlist
art.plugins.artplayerPluginPlaylist.hide();

// Next Playlist item
art.plugins.artplayerPluginPlaylist.next();

// Prev Playlist item
art.plugins.artplayerPluginPlaylist.prev();
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
