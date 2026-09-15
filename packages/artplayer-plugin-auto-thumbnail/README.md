# artplayer-plugin-auto-thumbnail

Auto thumbnail plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-auto-thumbnail/index.js&example=auto.thumbnail)

## License

MIT © Harvey Zhao

## TypeScript

The root and `/legacy` entries retain the declarations published in 1.1.0,
including the historical synchronous result type. The implementation actually
returns a Promise when registering the plugin. For accurate types, opt into
`/runtime`, which uses the same JavaScript implementation:

```ts
import Artplayer from 'artplayer'
import autoThumbnail from 'artplayer-plugin-auto-thumbnail/runtime'
import type { Option, Result } from 'artplayer-plugin-auto-thumbnail/runtime'

const option: Option = { width: 160, number: 100, scale: 1 }
const art = new Artplayer({
  container: '#player',
  url: '/video.mp4',
  plugins: [autoThumbnail(option)],
})
```

The registrar has type `(art: Artplayer) => Promise<Result>`. It resolves with
`{ name: 'artplayerPluginAutoThumbnail' }` after subscribing to player events,
before extraction completes. Generated sheets arrive progressively through the
player's thumbnails configuration. Awaiting registration does not wait for them.
If an application invokes a retained registrar after the player is destroyed,
it resolves with the same name without subscribing or allocating a decoder.
This does not override the core's own `plugins.add()` destruction checks.
The options object is required; use `{}` for defaults. `height` is accepted by
the runtime type for historical callers but remains ignored: the video aspect
ratio determines sheet height. Numeric strings retain their old JavaScript
coercion behavior but are not advertised as numeric TypeScript options.

The private decoder stops if metadata does not arrive within 30 seconds. Frame
readiness and each JPEG encoding operation also have their own 30-second limit.
Failures use the existing console warning and retain the last usable thumbnail
sheet; registration still resolves before processing. Restarting or destroying
the player cancels the active wait and releases the private decoder.

The runtime entry supports default ESM imports and CommonJS
`import autoThumbnail = require('artplayer-plugin-auto-thumbnail/runtime')`.
It exports the `Option`, `Result`, `Factory`, and `RuntimeFactory` types. `Factory`
describes a plain asynchronous registrar factory; `RuntimeFactory` also describes
the writable `.default` self alias. This alias preserves 1.0.1 JavaScript callers
using `require('artplayer-plugin-auto-thumbnail').default(...)`, while direct
1.1.0 calls continue to work. Both use the same function, including `/legacy` and
the script global. The result has no extraction-completion or destroy API.
Node10 resolution uses `typesVersions`; modern resolution uses separate ESM/CJS
declarations. The old root's NodeNext namespace behavior is preserved; `/runtime`
provides a direct default-import type without changing that old declaration.
The historical root factory type remains a plain function without a declared
`.default` property, preserving old type extraction and replacement functions;
use `/runtime` when type-checking the alias.

Versions 1.0.x used `export =` declarations and advertised `height` instead of
`number`; 1.1.0 had already changed these types. This refactor retains the actual
1.1.0 root declaration rather than introducing another conflicting root shape.
Consumers needing the older ignored `height` option can use `/runtime`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for module ownership, tests, and remaining
browser extraction limitations. This type entry does not resolve the documented
Windows WebKit first-frame issue.
