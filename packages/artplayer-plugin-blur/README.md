# artplayer-plugin-blur

Blur plugin for ArtPlayer

## Demo

[Checkout the demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-blur.js&example=blur) from Github Pages

## Install

Install with `npm`

```
$ npm install artplayer-plugin-blur
```

Or install with `yarn`

```
$ yarn add artplayer-plugin-blur
```

```js
import artplayerPluginBlur from 'artplayer-plugin-blur';
```

Or umd builds are also available

```html
<script src="artplayer-plugin-blur.js"></script>
```

Will expose the global variable to `window.artplayerPluginBlur`.

## Usage

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    layers: [
        {
            style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                margin: '-100px 0 0 -100px',
            },
            mounted($layer) {
                art.plugins.artplayerPluginBlur.attach($layer);
            },
        },
    ],
    plugins: [artplayerPluginBlur],
});
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
