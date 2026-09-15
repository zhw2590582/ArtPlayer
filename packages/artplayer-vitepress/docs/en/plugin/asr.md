# Audio Capture and Recognition Subtitles

[简体中文](../../plugin/asr.md)

Capture audio from the player's video, pass PCM/WAV chunks to your recognition callback, and display the returned subtitles. The plugin includes no recognition model or network service and does not access the microphone. This page describes the unreleased refactor branch; the new type entry and capture option are not claims about the live release.

## Installation and local example

```sh
yarn add artplayer artplayer-plugin-asr
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAsr from 'artplayer-plugin-asr';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-asr.js`. The global is `artplayerPluginAsr`. This preserves the original `asr.local` example: it captures the site's sample video and displays statistics. Subtitles are simulated, audio is not uploaded, and the example does not measure recognition accuracy. Integrate your own recognition service inside the callback.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-asr/index.js">▶ Run Code</div>

```js
/* global Artplayer, artplayerPluginAsr */
// Local audio capture demo. The subtitles below are simulated, not recognized speech.
// No audio is uploaded; only the sample media is loaded from this local site.
const statistics = document.createElement('div')
statistics.textContent = 'Local ASR demo: press play. No recognition service is used.'
let chunks = 0
let pcmBytes = 0
let wavBytes = 0

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/steve-jobs.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  layers: [{
    name: 'asr-local-statistics',
    html: statistics,
    style: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      right: '12px',
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.65)',
      color: '#fff',
      fontSize: '12px',
      whiteSpace: 'pre-line',
      pointerEvents: 'none',
    },
  }],
  controls: [{
    name: 'asr-local-stop',
    position: 'right',
    html: 'Stop ASR',
    tooltip: 'Stop capture; pause and play to restart',
    async click() {
      await art.plugins.artplayerPluginAsr.stop()
      if (!art.isDestroy)
        statistics.textContent = 'Local capture stopped. Pause and play to restart. Nothing was uploaded.'
    },
  }],
  plugins: [artplayerPluginAsr({
    length: 2,
    interval: 250,
    sampleRate: 16000,
    autoHideTimeout: 5000,
    onAudioChunk({ pcm, wav }) {
      if (art.isDestroy)
        return
      chunks++
      pcmBytes += pcm.byteLength
      wavBytes += wav.byteLength
      const sampleRate = new DataView(wav).getUint32(24, true)
      const samples = new DataView(pcm)
      let peak = 0
      for (let offset = 0; offset < pcm.byteLength; offset += 2)
        peak = Math.max(peak, Math.abs(samples.getInt16(offset, true)))
      const duration = (pcmBytes / 2 / sampleRate).toFixed(2)
      statistics.textContent = [
        'Local capture only - simulated subtitles, no speech recognition',
        `Chunks: ${chunks} | ${sampleRate} Hz mono PCM16 | ${duration} seconds captured`,
        `PCM: ${pcmBytes} bytes | WAV: ${wavBytes} bytes | Current peak: ${peak}`,
      ].join('\n')
      return `Simulated local subtitle: audio chunk ${chunks} received.`
    },
  })],
})
```

## Options and audio chunks

| Field | Default | Meaning |
| --- | --- | --- |
| `length` | `3` | Number of final nonempty punctuation-separated segments displayed from the current subtitle, not seconds of audio |
| `interval` | `100` | Consumption timer interval and target audio duration per chunk, in milliseconds |
| `sampleRate` | `16000` | Requested sample rate in Hz; requires environment support |
| `autoHideTimeout` | `10000` | Delay before hiding an accepted subtitle, in milliseconds |
| `onAudioChunk` | Function returning `null` | Receives `{ pcm, wav }`; a returned string displays subtitles; Promises are supported |
| `audioInput` | Unset | Direct Web Audio by default; `{ type: 'capture' }` explicitly selects a captured stream |

Both `pcm` and `wav` are `ArrayBuffer` values. Audio comes from the first channel. PCM is signed 16-bit little-endian; WAV adds a 44-byte mono header. A chunk contains `Math.floor(sampleRate * interval / 1000)` samples, requiring at least one sample and a positive, finite interval. Audio availability, browser scheduling and recognition latency affect callback frequency; exact timing is not guaranteed.

At most one recognition callback is pending within the active capture generation. Partial chunks stay queued. Rejected callbacks log an error and allow later processing. A backlog exceeding the larger of about one minute of audio or two chunks pauses capture and logs an error to bound memory. Pause, source changes, stop and destroy invalidate old results. They do not cancel network requests already sent by your callback; manage those resources in your application.

## Subtitles and lifecycle

Access the result through `art.plugins.artplayerPluginAsr`; its `name` is always `artplayerPluginAsr`:

| Method | Behavior |
| --- | --- |
| `append(text)` | Returns `undefined` synchronously; displays the final `length` segments of this text and resets the hide timer, replacing earlier subtitles rather than accumulating history |
| `hide()` | Returns `undefined` synchronously; hides subtitles without stopping capture or clearing their text |
| `stop()` | Actually returns `Promise<void>`; stops the current capture and discards old results; a later play event can restart it |

Both `append` and returned strings preserve historical HTML rendering and are not automatically escaped. Supply trusted subtitles; escape or sanitize external recognition text in your application. `null`, `undefined` and other non-string callback results do not update subtitles. `stop()` does not immediately hide existing subtitles; their original auto-hide deadline remains active.

Play starts capture; pause stops recording and discards obsolete work. Source changes rebuild the applicable capture state, and media errors use a nonterminal stop. The default direct connection retains the video's audio output route until `art.destroy()`, allowing playback after stop. Destroy releases subscriptions, timers, recording resources and audio contexts. There is no separate public plugin `start()` or `destroy()`.

## Audio routing and cross-origin media

The default route reads `art.video`, not the independent Audio Track plugin's audio. The video's own volume and mute affect captured data. Cross-origin media requires `moreVideoAttr: { crossOrigin: 'anonymous' }` before loading and appropriate server CORS headers. Playable media is not necessarily readable by Web Audio: without access, the clock can advance while output is silent, samples are zero or no chunks arrive. Cross-origin redirects are also restricted.

If your application already owns a Web Audio graph, explicitly choose `audioInput: { type: 'capture' }`. It uses `captureStream/mozCaptureStream`, does not take over the existing output, and never falls back to a direct connection on failure. It releases only its own contexts and captured tracks. Pause retains this graph; stop or source changes release it, and later playback obtains a fresh stream. Unsupported capability or initialization failure is logged and resources are cleaned up.

Captured data can remain nonzero despite video volume or mute and does not include an external effects graph or independent audio mix. CORS still applies: capture may be rejected, or a track may exist without readable audio. Desktop results do not establish Safari, mobile, every proxy or physical speaker behavior.

## TypeScript entries

The root preserves historical `AsrPluginOption`, `AsrPluginInstance` and `AudioChunk` types: callbacks return `void | Promise<void>`, and stop returns void. To type returned recognition strings, await stop or select captured input, use `/runtime`, which points to the same implementation:

```ts
import asr from 'artplayer-plugin-asr/runtime';
import type { RuntimeResult } from 'artplayer-plugin-asr/runtime';

const installAsr = asr({
  audioInput: { type: 'capture' },
  onAudioChunk({ pcm, wav }) {
    console.log(pcm.byteLength, wav.byteLength);
    return null; // Replace with your recognizer; null displays no subtitle.
  },
});

async function stopAsr(plugin: RuntimeResult): Promise<void> {
  await plugin.stop();
}
```

Precise types are `RuntimeOption`, `RuntimeResult` and `RuntimeFactory`, with `AudioChunk` also exported. Some NodeNext ESM consumers retain the old root namespace shape; choose `/runtime` for a callable default import. CommonJS runtime supports the function itself and its `.default` self-alias; `/runtime` also supports TypeScript `import = require`.
