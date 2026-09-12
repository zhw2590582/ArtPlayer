# artplayer-plugin-document-pip

Document PIP plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-document-pip/index.js&example=document.pip)

## TypeScript and module formats

```ts
import Artplayer from 'artplayer'
import type { AsyncResult } from 'artplayer-plugin-document-pip'
import documentPip from 'artplayer-plugin-document-pip'

const art = new Artplayer({
  container: '#player',
  url: 'video.mp4',
  plugins: [documentPip({ width: 480, height: 270 })],
})

// Use this view for an unmodified plugin result when precise Promise types are needed.
const pip = art.plugins.artplayerPluginDocumentPip as AsyncResult
await pip.open()
await pip.close()
```

At runtime, options may be omitted. Width and height default to 480 and 270, and
`fallbackToVideoPiP` defaults to true. `placeholder` sets the text left in the
original player container while its document window is active.

The default `Result` retains the published writable boolean fields and void
actions so old assignments and inferred initializer types still compile.
At runtime, `isSupported` and `isActive` are readonly getters, `open` and `close`
return `Promise<void>`, and `toggle` returns `undefined`. The opt-in `AsyncResult`
describes those runtime values; it should not be applied to a mock or a result
whose methods have been replaced. It does not change any runtime behavior.

The default factory declaration keeps the exact published required-argument
signature, including assignment of an old replacement function to `typeof
documentPip`. Automatically adding an optional overload or a required `.default`
property would break such assignments. `Option`, `Result`, `AsyncResult`, `Factory`
and `RuntimeFactory` are available as named types. Use the explicit runtime view
to type omitted options, self `.default` access and precise async results:

```ts
import type { RuntimeFactory } from 'artplayer-plugin-document-pip'
const runtimeFactory = documentPip as RuntimeFactory
runtimeFactory() // precise initializer for the unmodified runtime factory
```

ESM uses the default import. CommonJS supports both `require(package)(options)`
and the historical `require(package).default(options)` shape; `.default` is the
same factory. The `/legacy` entry and generated browser editor declarations have
matching types. These syntax targets do not add native Document PiP support to
browsers that lack the API.

The historical TypeScript `import plugin = require(package)` module view retains
`plugin.default(options)`. Direct CommonJS calls are available at runtime; use
`RuntimeFactory` for an explicitly typed direct-call view.

## Maintenance

Source is split into strict TypeScript modules for window ownership, DOM migration,
styles and controls. See [ARCHITECTURE.md](ARCHITECTURE.md) for lifecycle behavior,
compatibility boundaries, tests and remaining native browser validation.

## License

MIT © Harvey Zhao
