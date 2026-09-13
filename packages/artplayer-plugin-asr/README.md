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

## Media access and separate audio

Cross-origin media needs both `moreVideoAttr: { crossOrigin: 'anonymous' }` on
ArtPlayer and an appropriate `Access-Control-Allow-Origin` response from the media
server. Set the attribute before loading the source. Without CORS access, the
default Web Audio route becomes silent even when the video timeline advances;
Chromium supplies zero PCM and Firefox may supply no chunks. A same-origin URL
that redirects to an unapproved origin has the same restriction. ASR does not
change request credentials or bypass browser media security.

ASR captures `art.video`. When used with `artplayer-plugin-audio-track`, the
independent `audio` element is not mixed into recognition. Muting the main video
silences its default ASR input even if a consumer separately unmutes that audio
element. Both plugins keep their existing volume and playback APIs.

## Maintenance

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current audio flow, public behavior,
known migration gaps and test commands.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-asr/index.js&example=asr)

For local verification without a recognition service, run
`yarn dev artplayer-plugin-asr --no-open` in the repository and open the
[local capture demo](http://localhost:8082/?libs=./uncompiled/artplayer-plugin-asr/index.js&example=asr.local).
It displays PCM/WAV statistics and clearly labelled simulated subtitles, using
the site's sample video. Stop ASR leaves playback running; pause/play resumes
capture. The existing `asr` example remains the external-service example.

## License

MIT © Harvey Zhao
