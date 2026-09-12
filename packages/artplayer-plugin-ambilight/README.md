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

Options can be omitted. `require('artplayer-plugin-ambilight')` and the historical
`require('artplayer-plugin-ambilight').default` refer to the same factory. The
`/legacy` entry remains available. The historical `zIndex` input is accepted but
ignored; the grid uses 9. Option fields stay optional as in version 1.1.0; code
extracting their types should account for `undefined`.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight)

## License

MIT © Harvey Zhao
