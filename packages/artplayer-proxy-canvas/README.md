# artplayer-proxy-canvas

canvas proxy for ArtPlayer

## Usage

```js
import Artplayer from 'artplayer'
import canvas from 'artplayer-proxy-canvas'

const art = new Artplayer({
  container: '#player',
  url: 'video.mp4',
  proxy: canvas((context, video) => {
    // Post-process the frame with the native 2D context.
  }),
})
```

The callback is optional. Registration returns a native Canvas synchronously. Its own
methods and properties keep Canvas behavior; video-only enumerable properties are
forwarded to the backing video. Use ArtPlayer's `video:*` events for media notifications.
The callback receives the actual video, and a successful callback is followed by
`artplayerProxyCanvas:draw`. Drawing failures emit `artplayerProxyCanvas:error`.

ES modules use the default import. Both `require('artplayer-proxy-canvas')` and the
historical `require('artplayer-proxy-canvas').default` refer to the same factory. The
`artplayer-proxy-canvas/legacy` entry preserves the legacy browser build.

## TypeScript

The optional callback and exact `HTMLCanvasElement` return type retain published 1.1.0
inference. `Option`, `Result`, `Factory` and `MediaCanvas` are exported types. The last is
an explicit view for code using supported forwarded media members:

```ts
import type { MediaCanvas, Option } from 'artplayer-proxy-canvas'

const callback: Option = (context, video) => context.drawImage(video, 0, 0)
const media = art.template.$video as MediaCanvas
await media.play()
```

`MediaCanvas` keeps Canvas members when names overlap, including dimensions and DOM
listeners. It does not add unsupported browser APIs. Factory return inference remains
`HTMLCanvasElement`, so existing assignments and `ReturnType` consumers keep compiling.
Runtime falsy callback arguments retain historical behavior; declarations accept an
optional function, matching the published types. Implementation and test guidance is in
[ARCHITECTURE.md](ARCHITECTURE.md).

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas)

## License

MIT © Harvey Zhao
