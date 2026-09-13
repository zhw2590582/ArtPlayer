# artplayer-plugin-multiple-subtitles

Multiple subtitles plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles)

## TypeScript

The root and `/legacy` type entries preserve the latest published 1.2.0 function shape:
a required `{ subtitles: TrackOption[] }` argument and a synchronous `{ name: 'multipleSubtitles' }`
registration result. This includes parameter extraction and replacement-factory assignment in
both directions; the root factory type has no required `.default` property.
Registration has always been asynchronous. For accurate Promise and selection-method types,
use the additive runtime entry, which loads the same implementation:

```ts
import multipleSubtitles from 'artplayer-plugin-multiple-subtitles/runtime'

const register = multipleSubtitles({
  subtitles: [{ url: '/subtitles/en.vtt', name: 'en' }],
})
// With an existing ArtPlayer instance:
const result = await register(art)
result.tracks(['en'])
result.reset()
```

The option object is required; `{}` means no tracks. `tracks()` clears the selection;
`reset()` restores all original tracks. Both methods return `void`. The existing `onParser`
field remains declared for compatibility but is not invoked by the implementation.

### Earlier declarations and module resolution

Versions 1.0.0 and 1.1.0 declared `export =`, whereas 1.2.0 declared a default export.
The root follows 1.2.0 under the approved [type compatibility policy](../../refactor/type-compatibility-policy.md).
For consumers migrating an earlier `import = require`, use the accurate runtime entry and
await registration:

```ts
import type Artplayer from 'artplayer'
import multipleSubtitles = require('artplayer-plugin-multiple-subtitles/runtime')

async function registerSubtitles(art: Artplayer) {
  const result = await multipleSubtitles({ subtitles: [] })(art)
  result.reset()
}
```

This `import = require` form works with classic Node resolution without `esModuleInterop`.
The runtime default import in the first example requires that flag in classic CommonJS;
NodeNext ESM and bundler resolution use its ESM declaration. Runtime types also expose the
existing writable `.default` self alias. JavaScript entrypoints and valid historical
`require('artplayer-plugin-multiple-subtitles').default(...)` calls remain supported.
The old 1.0.0/1.1.0 declaration allowed calling the raw `require` object, but its shipped
JavaScript did not; that mismatch is not a supported runtime contract.

NodeNext ESM intentionally retains the 1.2.0 root declaration's module namespace shape
(`import root from 'artplayer-plugin-multiple-subtitles'` exposes the declared factory as
`root.default`). It does not silently become a callable default type. Prefer the `/runtime`
default import for accurate native ESM calls; the same applies to `/legacy` declarations.
See [maintenance notes](ARCHITECTURE.md) for module responsibilities and validation commands.

## License

MIT © Harvey Zhao
