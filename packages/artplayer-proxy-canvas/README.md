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

The root and `/legacy` declarations preserve the latest published 1.1.0 factory:
an optional callback, an exact `HTMLCanvasElement` result, and no required factory
properties. Ordinary replacement functions remain assignable in both directions.
`Factory` describes that historical shape. The additive `/runtime` entry uses the same
JavaScript implementation and describes its readonly `default` self alias with
`RuntimeFactory`. It also exports an explicit `MediaCanvas` view:

```ts
import type { MediaCanvas, Option } from 'artplayer-proxy-canvas/runtime'
import canvas from 'artplayer-proxy-canvas/runtime'

const callback: Option = (context, video) => context.drawImage(video, 0, 0)
canvas.default(callback)
const media = art.template.$video as MediaCanvas
await media.play()
```

`MediaCanvas` keeps Canvas members when names overlap, including dimensions and DOM
listeners. It does not add unsupported browser APIs. Factory return inference remains
`HTMLCanvasElement`, so existing assignments and `ReturnType` consumers keep compiling.
Runtime falsy callback arguments retain historical behavior; declarations accept an
optional function, matching the published types. Implementation and test guidance is in
[ARCHITECTURE.md](ARCHITECTURE.md).

The standard ArtPlayer `subtitle` option uses native subtitle tracks on the backing
video. HTML track elements passed to the active proxy's `appendChild` are attached
there so captions can load and follow playback; ordinary Canvas content keeps its
normal parent. The initial metadata track is replaced by the first actual subtitle.
This repairs the previously empty subtitle path without changing subtitle options.

### Older TypeScript consumers

The 1.0.0 declaration used `export =` and required a callback; 1.1.0 changed to
`export default` and made the callback optional. These conflicting type shapes cannot
both remain the root factory. Following the approved compatibility policy, the root
keeps 1.1.0. A 1.0.0 TypeScript `import canvas = require('artplayer-proxy-canvas')`
consumer that directly calls `canvas(...)` can select the accurate entry instead:

```ts
import canvas = require('artplayer-proxy-canvas/runtime')
canvas((context, video) => context.drawImage(video, 0, 0))
canvas.default()
```

This works with Node10 resolution even without `esModuleInterop`. Default imports from
`/runtime` work with interoperability enabled and with native NodeNext ESM. Under
NodeNext ESM, the root intentionally preserves 1.1.0's historical declaration namespace
shape (`root.default(...)` after a default import); that declaration shape does not
describe the actual ESM factory. Use a default import from `/runtime` for accurate ESM
typing. Existing JavaScript root/legacy calls and distribution paths keep working.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas)

## License

MIT © Harvey Zhao
