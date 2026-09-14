# artplayer-plugin-vtt-thumbnail

Vtt thumbnail plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail)

## TypeScript usage

The registration function is asynchronous. The optional runtime entry provides its accurate
Promise type and uses the same implementation as the default entry:

```ts
import Artplayer from 'artplayer'
import vttThumbnail from 'artplayer-plugin-vtt-thumbnail/runtime'

const art = new Artplayer({ container: '#player', url: '/video.mp4' })
const result = await vttThumbnail({ vtt: '/thumbnails/index.vtt' })(art)
console.log(result.name)
```

You can also pass `vttThumbnail({ vtt: '/thumbnails/index.vtt' })` in the player's `plugins`
array. Existing default and `/legacy` imports remain available. Their declarations preserve
the historical synchronous result type for compatibility, although registration has always
returned a Promise at runtime. Reading `result.name` requires awaiting registration; changing
to `/runtime` opts into that accurate type without changing runtime behavior. The option
object remains required, and its `vtt` and `style` fields remain optional.

The root factory keeps the latest published 1.1.0 type shape, with no required `.default`
property. Plain replacement functions remain assignable in both directions. `/runtime`
exports `Option`, `Result`, `Factory` and `RuntimeFactory` in all resolution modes; its
factory describes the actual writable `.default` self alias and asynchronous registration.

### Earlier declaration migration

The 1.0.x declarations used `export =`, while 1.1.0 uses `export default`. Following the
approved compatibility policy, the root retains 1.1.0. Older TypeScript code that directly
calls or extracts the type of `import vtt = require('artplayer-plugin-vtt-thumbnail')`
should use the accurate runtime entry:

```ts
import vtt = require('artplayer-plugin-vtt-thumbnail/runtime')

const register = vtt({ vtt: '/thumbnails/index.vtt' })
const result = await register(art)
console.log(result.name)
```

This export-assignment form supports Node10 resolution without `esModuleInterop`.
Default `/runtime` imports support interoperability and native NodeNext ESM. Root
NodeNext ESM intentionally preserves the old declaration namespace shape (the factory
is `root.default` after a default import); that historical declaration does not accurately
describe the actual ESM export. Use `/runtime` for accurate ESM calls. Valid historical
JavaScript default access, the direct factory, and legacy distribution entrypoints remain.

See [ARCHITECTURE.md](ARCHITECTURE.md) for module ownership, testing commands and remaining
compatibility validation.

The old 1.0.1 JavaScript bundle registers a control named `thumbnails`. It works
with the tested core 5.1.6, but conflicts with the built-in control reserved by
core 5.1.7 and later tested cores (5.4.0 and the refactor candidate). The current
plugin uses `vtt-thumbnail`; retain that name when integrating custom controls.
This documented historical combination failure predates the refactor. Native
desktop tests and emulated touch checks do not certify physical mobile devices.

## License

MIT © Harvey Zhao
