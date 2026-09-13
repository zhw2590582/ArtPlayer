# artplayer-plugin-asr

Audio capture and subtitle display plugin for ArtPlayer. Supplies PCM/WAV chunks
to a caller-provided recognition service.

`stop()` stops recognition and returns a Promise. It permits later playback to
restart capture; the player's direct Web Audio connection remains alive until
the player is destroyed so that stopping recognition does not silence playback.
Call `art.destroy()` when disposing the player.

## TypeScript

Existing imports keep their historical types, including `stop(): void` and a
`void | Promise<void>` recognition callback. For accurate asynchronous types, use
the additive `/runtime` entry. It loads the same implementation as the root entry:

```ts
import Artplayer from 'artplayer'
import asr from 'artplayer-plugin-asr/runtime'
import type { RuntimeOption } from 'artplayer-plugin-asr/runtime'

const option: RuntimeOption = {
  onAudioChunk: async ({ pcm, wav }) => {
    // Send one of these buffers to your own recognition service.
    void [pcm, wav]
    return 'Recognized text.'
  },
}
const art = new Artplayer({ container: '#player', url: '/video.mp4' })
const recognition = asr(option)(art)
await recognition.stop()
```

The callback may return text, `null`, or no value, synchronously or asynchronously.
CommonJS TypeScript can use `import asr = require('artplayer-plugin-asr/runtime')`.
The root declaration retains its historical NodeNext ESM namespace shape; use
`/runtime` for a directly callable default import in that mode. This is an opt-in
type entry, and does not require changes to existing JavaScript consumers.

## Maintenance

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current audio flow, public behavior,
known migration gaps and test commands.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-asr/index.js&example=asr)

## License

MIT © Harvey Zhao
