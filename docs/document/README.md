## Install

Install with `npm`

```bash
$ npm install artplayer
```

Install with `yarn`

```bash
$ yarn add artplayer
```

Then load through the module

```js
// ES6
import Artplayer from 'artplayer';

// CommonJS
const Artplayer = require('artplayer');
```

Or umd builds are also available

```html
<!-- locally -->
<script src="path/to/artplayer.js"></script>

<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/artplayer/dist/artplayer.js"></script>
```

?> Will expose the global variable to `window.Artplayer`.

## Usage

```html
<!DOCTYPE html>
<html>
    <head>
        <title>ArtPlayer</title>
        <meta charset="UTF-8" />
    </head>
    <body>
        <div class="artplayer-app" style="width:400px;height:300px"></div>
        <script src="path/to/artplayer.js"></script>
        <script>
            var art = new Artplayer({
                container: '.artplayer-app',
                url: '/assets/sample/video.mp4',
            });
        </script>
    </body>
</html>
```

!> The size of the player depends on the size of the `container`, so don’t forget to set the `height` and `width` of the `container`.

## Demo

[https://artplayer.org](https://artplayer.org)

?> Most of the code in this document is directly linked to the demo by click the `Run Code`.

[Run Code](/Configuration.container)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```
