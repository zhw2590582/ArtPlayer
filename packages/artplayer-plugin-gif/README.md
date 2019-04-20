# artplayer-plugin-gif

Gif plugin for ArtPlayer, use [gifshot](https://github.com/yahoo/gifshot) as a dependency

## Demo

[Checkout the demo](https://artplayer.org/gif/) from Github Pages

## Install

Install with `npm`

```
$ npm install artplayer-plugin-gif
```

Or install with `yarn`

```
$ yarn add artplayer-plugin-gif
```

```js
import artplayerPluginGif from 'artplayer-plugin-gif';
```

Or umd builds are also available

```html
<script src="artplayer-plugin-gif.js"></script>
```

Will expose the global variable to `window.artplayerPluginGif`.

## Usage

This will add a button called "GIF" in the bottom control bar.

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    controls: [
        {
            name: 'gif',
            position: 'right',
            html: '创建GIF',
            mounted: $gif => {
                art.plugins.artplayerPluginGif.attach($gif);
            },
        },
    ],
    plugins: [artplayerPluginGif],
});
```

Or can be called via api

```js
art.plugins.artplayerPluginGif.create(
    {
        // some configuration
        // https://github.com/yahoo/gifshot#options
    },
    function(imageUrl) {
        console.log(imageUrl);
    },
);
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
