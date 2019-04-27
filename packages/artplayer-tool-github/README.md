# artplayer-plugin-danmu
Danmu plugin for ArtPlayer

## Demo

[Checkout the demo](https://artplayer.org/?libs=.%2Funcompiled%2Fartplayer-plugin-danmu.js&example=danmu) from Github Pages

## Install

Install with `npm`

```
$ npm install artplayer-plugin-danmu
```

Or install with `yarn`

```
$ yarn add artplayer-plugin-danmu
```

```js
import artplayerPluginBacklight from 'artplayer-plugin-danmu';
```

Or umd builds are also available

```html
<script src="artplayer-plugin-danmu.js"></script>
```

Will expose the global variable to `window.artplayerPluginDanmu`.

## Usage

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: 'path/to/video.mp4',
    plugins: [artplayerPluginDanmu({
        danmus: [], // Can be an array or return the promised function or danmuku xml url
        speed: 5, // Animation time
        opacity: 1, // Opacity
        color: '#fff', // Font color
        size: 25, // Font size
        maxlength: 50, // The maximum number of words in the danmu
        margin: [10, 20], // Margin top and margin bottom
    })],
});

// Send danmu
art.plugins.artplayerPluginDanmu.emit({
    text: '666', // Danmu text
    time: 5, // Video time
    color: '#fff', // Danmu color
    size: 25, // Danmu size
    border: '#fff' // Danmu border color
});

// Start danmu
art.plugins.artplayerPluginDanmu.start();

// Stop danmu
art.plugins.artplayerPluginDanmu.stop();

// Hide danmu
art.plugins.artplayerPluginDanmu.hide();

// Show danmu
art.plugins.artplayerPluginDanmu.show();

// Config danmu
art.plugins.artplayerPluginDanmu.config({
    // option
});
```

## License

MIT © [Harvey Zack](https://sleepy.im/)
