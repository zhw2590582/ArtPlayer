# artplayer-proxy-mediabunny

mediabunny proxy for ArtPlayer, including `m3u8` playback through Mediabunny's HLS input support.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-mediabunny/index.js&example=mediabunny)

## License

MIT © Harvey Zhao

## TypeScript

The default factory still accepts optional options and returns an initializer whose
result is exactly `HTMLCanvasElement`. Existing factory replacements remain assignable.
Use the optional media view when accessing the proxy's media methods:

```ts
import type { MediaBunnyPlayer } from 'artplayer-proxy-mediabunny'
import Artplayer from 'artplayer'
import mediabunny from 'artplayer-proxy-mediabunny'

const art: MediaBunnyPlayer = new Artplayer({
  container: '#player',
  url: 'movie.mp4',
  proxy: mediabunny({ volume: 0.7 }),
})

art.on('ready', async () => {
  const shim = art.mediabunny
  if (!shim)
    return
  const state = await shim.getM3u8State()
  console.log(state?.currentLevel?.height)
})
```

`MediaBunnyShim`, `MediaBunnyCanvas`, HLS track/state and synthetic frame callback types
are also available as type-only exports. The player alias is optional and removed on
destruction. Native Canvas event/attribute methods take precedence over shim methods.
SDK track objects need explicit narrowing with your application's SDK types.

The `canPlayType()` response remains `maybe` for compatibility; it does not test codec
support. TimeRanges and frame callback metadata are synthetic. Actual playback requires
supported codecs and browser media APIs; a `legacy` bundle does not polyfill those APIs.
Decoder fallback and broader browser/device validation remain in progress.

ESM default imports and `/legacy` type resolution now support the tested TS 5.9 and
TS 4.3 modes. CommonJS supports both direct calls and the old `require(...).default`
runtime path. The default factory type keeps its historical callable signature.

## Maintenance

See [ARCHITECTURE.md](ARCHITECTURE.md) for current modules, resource ownership, compatibility boundaries and validation commands.
