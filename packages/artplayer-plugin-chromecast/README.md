# artplayer-plugin-chromecast

Chromecast plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chromecast/index.js&example=chromecast)

## Usage

```js
import Artplayer from 'artplayer'
import artplayerPluginChromecast from 'artplayer-plugin-chromecast'

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://example.com/video.mp4',
  plugins: [artplayerPluginChromecast({
    onStateChange(state) {
      console.log(state)
    },
    onError(error) {
      console.error(error)
    },
  })],
})
```

Replace the example URL with media reachable by your receiver. SDK loading starts
when the Cast control is clicked. Use a supported Chrome sender on HTTPS and an
available Cast receiver; loading the demo or a local video alone does not verify
receiver playback. The optional `url`, `sdk`, `icon` and `mimeType` override the
media URL, SDK script URL, control HTML and inferred media type respectively.
Callbacks are `onStateChange`, `onCastAvailable`, `onCastStart` and `onError`.

## TypeScript compatibility

The root and `legacy` declarations preserve the latest published 1.1.0 type shape:
a required options object and a synchronous name-only registration type. JavaScript
registration is actually asynchronous. New TypeScript consumers can use the
additive `artplayer-plugin-chromecast/runtime` entry for precise callbacks and a
`Promise<RuntimeResult>`, without loading another implementation:

```ts
import artplayerPluginChromecast from 'artplayer-plugin-chromecast/runtime'
import type { RuntimeOption } from 'artplayer-plugin-chromecast/runtime'

const options: RuntimeOption = {
  onStateChange(state) {
    // disconnected | connecting | connected | disconnecting
    console.log(state, this.url)
  },
  onError(error) {
    // unknown: SDK and user callbacks can throw arbitrary values.
    console.error(error)
  },
}
const register = artplayerPluginChromecast(options)
// In an existing ArtPlayer setup, register(art) returns Promise<RuntimeResult>.
// Supply register once through the player's plugins option.
```

The resolved result contains `name`, `getCastState(): string | null` and
`isCasting(): boolean`. The raw state is initially null and differs from the
normalized callback state. A retained session does not prove successful playback.

Version 1.0.0 used `export =` declarations and a CommonJS `.default` factory;
1.1.0 changed to a default declaration and direct CommonJS factory. Those old type
shapes cannot both describe the same root. The candidate keeps 1.1.0's root type
and supports both historical JavaScript factory forms. For older `import = require`
TypeScript consumers, migrate to `import cast = require('artplayer-plugin-chromecast/runtime')`.
Native ESM consumers should use the runtime default import shown above. Root
NodeNext namespace typing retains 1.1.0's existing behavior; its direct ESM default
call was already a type error. The runtime entry fixes that use without changing
the old root's module replacement contracts.

Maintenance and validation details are in [ARCHITECTURE.md](ARCHITECTURE.md).

## License

MIT © Harvey Zhao
