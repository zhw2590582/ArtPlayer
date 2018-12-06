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
<input class="file" type="file" />
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

// Dynamic configuration parameters, return the instance itself
thumbnail.setup({
    delay: 500,
    number: 100,
    width: 200,
    height: 10,
    column: 10,
});

// Start creating a preview, return the promise when the task completed
thumbnail.start();

// Start download preview, return the instance itself
thumbnail.download();

// Events
thumbnail.on('file', file => {
    console.log('The video file has been read successfully');
});

thumbnail.on('video', video => {
    console.log('Building a video player successfully');
    console.log('Now you can call the thumbnail.start()');
});

thumbnail.on('canvas', canvas => {
    console.log('Building a canvas successfully');
});

thumbnail.on('update', (url, percentage) => {
    console.log('Generating preview image, returning preview url and percentage');
});

thumbnail.on('done', () => {
    console.log('One task processing completed');
});

thumbnail.on('download', name => {
    console.log('Download the preview');
});
```

## Example

```html
<input class="file" type="file" />
```

```js
var thumbnail = new ArtplayerToolThumbnail({
    fileInput: document.querySelector('.file'),
});

thumbnail.on('video', () => {
    thumbnail
        .setup({
            delay: 500,
            number: 100,
            width: 200,
            height: 10,
            column: 10,
        })
        .start()
        .then(() => {
            thumbnail.download();
        });
});
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
