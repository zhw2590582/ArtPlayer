# artplayer-plugin-ambilight

ambilight plugin for ArtPlayer

`start()` and `stop()` are synchronous. The plugin starts on the player's `ready`
event; `stop()` retains its last colors. Destroying the player removes the plugin's
grid and frame loop, and previously retained methods then do nothing. Canvas read
failures are skipped and retried, allowing a later readable source to recover.

Internal modules and compatibility tests are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## Usage and TypeScript

```ts
import type { Option } from 'artplayer-plugin-ambilight'
import artplayerPluginAmbilight from 'artplayer-plugin-ambilight'

const option: Option = { blur: '50px', opacity: 0.5, frequency: 10, duration: 0.3 }
// Add to ArtPlayer's plugins option:
const plugins = [artplayerPluginAmbilight(option)]
```

Root and `/legacy` types preserve the latest published 1.1.0 contract: the options
argument is required, its fields are optional, and an ordinary replacement factory
does not need a `default` property. Pass `{}` to use defaults with these types.
The historical `zIndex` input is accepted but ignored; the grid uses 9.

For accurate optional invocation and module interop, use `/runtime`:

```ts
import ambilight from 'artplayer-plugin-ambilight/runtime'

const plugins = [ambilight(), ambilight(undefined), ambilight.default({})]
```

It reuses the root implementation. Existing JavaScript calls with omitted options,
`require('artplayer-plugin-ambilight')` and
`require('artplayer-plugin-ambilight').default` still work. Start/stop remain
synchronous and `/legacy` keeps the historical build.

### Earlier TypeScript declarations

Version 1.0.0 used `export =` and required every option field; 1.1.0 changed to a
default export and optional fields. The root follows 1.1.0 rather than combining
incompatible factory signatures. Earlier TypeScript `import = require` callers
can switch only their module path:

```ts
import ambilight = require('artplayer-plugin-ambilight/runtime')

ambilight({ blur: '50px', opacity: 0.5, frequency: 10, zIndex: 9, duration: 0.3 })
```

Code reading an option field as a required value should supply a fallback, for
example `option.blur ?? '50px'`. This optional-field change already existed in
1.1.0. NodeNext ESM sees the historical root declaration as a CommonJS namespace;
that type shape is preserved, including its previous direct-call diagnostics.
Use `/runtime` for an accurate callable default import in native ESM. Node10
TypeScript default imports of `/runtime` require `esModuleInterop`; `import =
require` also works with interop disabled. The runtime does not add any dependency.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight)

## License

MIT © Harvey Zhao
