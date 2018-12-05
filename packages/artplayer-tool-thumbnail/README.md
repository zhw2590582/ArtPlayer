# artplayer-tool-thumbnail
thumbnail tool for ArtPlayer

## Demo

[Checkout the demo](https://artplayer.org/thumbnail/) from Github Pages

## Install

Install with `npm`

```
$ npm install artplayer-tool-thumbnail
```

Or install with `yarn`

```
$ yarn add artplayer-tool-thumbnail
```

```js
import ArtplayerToolThumbnail from 'artplayer-tool-thumbnail';
```

Or umd builds are also available

```html
<script src="artplayer-tool-thumbnail"></script>
```

Will expose the global variable to `window.ArtplayerToolThumbnail`.

## Usage

```html
<input class="file" type="file">
```

```js
var thumbnail = new ArtplayerToolThumbnail({
    fileInput: document.querySelector('.file'),
    delay: 300,
    number: 60,
    width: 160,
    height: 90,
    column: 10,
});

thumbnail.on('file', file => {
    console.log(file);
});

thumbnail.on('video', video => {
    console.log(video);
    thumbnail.start();
});

thumbnail.on('canvas', canvas => {
    console.log(canvas);
});

thumbnail.on('update', (percentage, url) => {
    console.log(percentage, url);
});

thumbnail.on('download', name => {
    console.log(name);
});

thumbnail.on('done', () => {
    console.log('done');
});
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
