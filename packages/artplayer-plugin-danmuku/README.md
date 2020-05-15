# artplayer-plugin-danmuku

Danmuku plugin for ArtPlayer

## Demo

[Checkout the demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-danmuku.js&example=danmuku) from Github Pages

## Install

Install with `npm`

```bash
$ npm install artplayer-plugin-danmuku
```

Or install with `yarn`

```bash
$ yarn add artplayer-plugin-danmuku
```

```js
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
```

Or umd builds are also available

```html
<script src="artplayer-plugin-danmuku.js"></script>
```

Will expose the global variable to `window.artplayerPluginDanmuku`.

## Usage

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: [
                {
                    text: '666', // Danmu text
                    time: 5, // Video time
                    color: '#fff', // Danmu color
                    border: false, // Danmu border
                    mode: 0, // Danmu mode: 0-scroll or 1-static
                },
            ], // Can be an array or return the promised function or danmuku xml url
            speed: 5, // Animation time
            opacity: 1, // Opacity
            color: '#fff', // Font color
            size: 25, // Font size
            maxlength: 50, // The maximum number of words in the danmu
            margin: [10, 20], // Margin top and margin bottom
            synchronousPlayback: false, // Synchronous playback speed
        }),
    ],
});

// Send a new danmu
art.plugins.artplayerPluginDanmuku.emit({
    text: '666', // Danmu text
    time: 5, // Video time
    color: '#fff', // Danmu color
    size: 25, // Danmu size
    border: false, // Danmu border
    mode: 0, // Danmu mode: 0-scroll or 1-static
});

// Hide the danmu
art.plugins.artplayerPluginDanmuku.hide();

// Show the danmu
art.plugins.artplayerPluginDanmuku.show();

// Returns whether to hide the danmu
art.plugins.artplayerPluginDanmuku.isHide;

// Config danmu dynamically
art.plugins.artplayerPluginDanmuku.config({
    // option
});
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
