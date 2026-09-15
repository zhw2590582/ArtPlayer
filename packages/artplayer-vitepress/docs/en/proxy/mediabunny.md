# Mediabunny video proxy

[简体中文](../../proxy/mediabunny.md)

Read media through Mediabunny and expose a video-like surface backed by Canvas and an audio pipeline, including HLS quality/audio selection. Install through ArtPlayer's proxy option. This describes the unreleased branch; it does not supply missing decoders or every HTMLVideoElement capability.

## Install and example

```sh
yarn add artplayer artplayer-proxy-mediabunny
```

ESM uses `import mediabunny from 'artplayer-proxy-mediabunny'`. Scripts load `dist/artplayer-proxy-mediabunny.js`, exposing `artplayerProxyMediabunny`. This is the [original HLS example](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-mediabunny/index.js&example=mediabunny); its remote stream is not an offline fixture:

<div className="run-code" data-libs="./uncompiled/artplayer-proxy-mediabunny/index.js">▶ Run Code</div>

```js
// npm i artplayer-proxy-mediabunny
// import artplayerProxyMediabunny from 'artplayer-proxy-mediabunny';

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  autoSize: true,
  setting: true,
  loop: true,
  flip: true,
  playbackRate: true,
  fullscreen: true,
  fullscreenWeb: true,
  miniProgressBar: true,
  autoPlayback: true,
  autoOrientation: true,
  proxy: artplayerProxyMediabunny({
    m3u8: {
      quality: {
        control: true,
        setting: true,
        getName: level => level.height ? `${level.height}P` : level.name,
        title: 'Quality',
        auto: 'Auto',
      },
      audio: {
        control: true,
        setting: true,
        getName: track => track.name || track.language,
        title: 'Audio',
        auto: 'Auto',
      },
    },
  }),
})
```

The optional-options factory synchronously initializes an actual HTMLCanvasElement and installs art.mediabunny. Native Canvas members win collisions: DOM event/attribute methods do not become shim methods. Use ArtPlayer video:* events or the explicit shim for media operations.

## Inputs and options

| Option | Default or behavior |
| --- | --- |
| `source` | Initial source; a truthy value precedes art.option.url, but later host assignments can replace it |
| `loadTimeout` | 0, no deadline; a finite positive value limits loading in milliseconds |
| `timeupdateInterval` | 250ms renderer update interval, not an exact clock guarantee |
| `avSyncTolerance` | 0.12 seconds, used in the late-frame threshold when dropping is enabled |
| `dropLateFrames` | false; enable to skip sufficiently late pictures |
| `poster` | Empty by default; captured by the video engine at initialization |
| `preflightRange` | false; optional HEAD check for ordinary URLs |
| `volume` / `muted` | Initial shim values0.7 / false; later player settings may override them |
| `autoplay` / `loop` | Compatibility readback values defaulting false, not standalone autoplay/loop execution |
| `crossOrigin` | Compatibility readback defaulting empty; does not configure SDK fetch credentials/CORS |
| `m3u8` | Optional quality/audio menus, below |

Use ArtPlayer's own autoplay/loop configuration for player behavior, subject to browser playback policy. Shim autoplay/loop/crossOrigin setters remain inert. Changing shim.poster updates its option readback, not necessarily the poster already captured by the video engine.

The source declaration accepts URL strings, Blobs and byte ReadableStreams. Runtime also passes SDK Source/SourceRef values to SDK validation. Case-insensitive `.m3u8` suffixes, optionally followed by query/hash, select HLS_FORMATS; other sources use ALL_FORMATS. A URL without that suffix does not enable this proxy's HLS menu state merely from response content. Random access/reloading a stream depends on its source capabilities.

When enabled, preflight sends HEAD only for non-HLS strings. Missing accept-ranges or a value of none emits error with a RangeNotSupported Event detail and stops that preflight path, without setting shim.error. Network failures warn and continue; HLS/non-string sources skip HEAD. This is not a complete Range GET or codec-support check. Media responses must still be readable with suitable CORS.

## HLS menus and selection

Both m3u8.quality and m3u8.audio accept control, setting, title, auto and getName. No menu appears unless control or setting is enabled; setting also needs the player's settings panel.

| Setting | Default |
| --- | --- |
| `quality.title` / `audio.title` | Quality / Audio |
| Either `auto` | Auto |
| `quality.getName(level)` | level.name, otherwise height plus P |
| `audio.getName(track)` | First available name, lang or language |

Levels provide id, index, name, height and bitrate; audio entries provide id, index, name, lang, language and bitrate. Full state also includes SDK track objects. Name can be null; return a displayable string from getName.

Quality needs video levels; audio needs at least two pairable tracks. Quality sorts by descending height. Equal labels are merged, favoring the selected item. Highlight/button text follows the actual current track, so auto mode may still display its chosen track rather than Auto.

```js
const shim = art.mediabunny;
const state = await shim.getM3u8State();
if (state?.levels.length) {
  await shim.switchM3u8Quality(state.levels[0].id);
}
await shim.switchM3u8Audio('auto');
```

Pass a numeric state id or literal 'auto', not an index, label or numeric string. Auto selects the SDK primary track; the proxy does not thereby measure bandwidth and continuously adapt bitrate. Quality changes retain pairable audio when possible, otherwise choose primary pairable audio; audio selection also maintains video pairing. Unknown IDs retain the current track. Methods are no-ops without an active HLS source.

Menu names are mediabunny-quality and mediabunny-audio. Metadata/restart refreshes them; loadstart/error/destruction clears them. A source without a capability removes its old UI. Stale menu callbacks and superseded choices cannot replace current state. Active asynchronous selection failures can reject.

## Shim members

| Member | Behavior |
| --- | --- |
| `canvas` | Native output element |
| `src` / `currentSrc` | Source value; truthy src assignments load, empty assignments do not unload |
| `play()` / `pause()` / `load()` | Promise playback, synchronous pause, reload current src; load has no completion Promise |
| `currentTime` | Seconds; assignment starts an asynchronous seek without an awaitable setter |
| `duration` | Seconds, possibly NaN when unknown or Infinity for live input |
| `volume` / `muted` | Volume is numerically coerced/clamped0–1 and unmutes; muted is boolean-coerced |
| `playbackRate` | Defaults1; accepts coerced positive non-NaN values and emits ratechange |
| `paused` / `playing` / `ended` / `seeking` | Coordinator states; playing does not prove a real frame is displayed |
| `readyState` / `networkState` / `error` | Compatibility state and `{code, message}` or null |
| `videoWidth` / `videoHeight` | Video-engine dimensions |
| `buffered` / `played` / `seekable` | Synthetic0-to-duration/current-time/duration ranges, not measured network buffering |
| `createTimeRanges(start, end)` | Same synthetic helper, length0 or1; does not implement native index-range exceptions |
| `canPlayType(type)` | Always maybe, without probing support |
| `getM3u8State()` | Promise of state, or null for non-HLS/obsolete state |
| `switchM3u8Quality(value)` / `switchM3u8Audio(value)` | Promise-based track selection |
| `addEventListener` / `removeEventListener` | Shim media events, not Canvas DOM listeners |
| `getBoundingClientRect()` | Delegate to Canvas |
| `setAttribute(name, value)` | Shim handles src/muted, uses inert autoplay/loop setters, otherwise delegates to Canvas |
| `destroy()` | Synchronous terminal shim/engine cleanup, idempotent |

Poster/autoplay/loop/crossOrigin follow the rules above. Controls=false, playsInline=true, preload='auto', defaultMuted=false and defaultPlaybackRate=1 have inert setters. Direct canvas.setAttribute is native Canvas behavior, unlike shim.setAttribute. Normally use art.destroy to also release host menus, alias and subscriptions.

HlsState contains levels, audios, currentLevel, currentAudio, videoMode and audioMode. Current entries may be null; modes are auto/manual. Audios are pairable with the selected video, so audio-only input does not guarantee menu entries. Narrow unknown track objects with the SDK types used by your application.

## Events, frame callbacks and cleanup

Shim events forward to ArtPlayer video:* as Event plus detail. Ordinary listeners retain duplicates, first-match removal, live-array iteration and exception propagation. This is not the complete native EventTarget API and does not accept native listener options.

Successful loading publishes loadedmetadata/durationchange/progress after participants prepare, then loadeddata/canplay/canplaythrough/progress. Waiting/loadstart remain deferred notifications. If neither selected track can decode, report code4 without success readiness; one usable track can support partial playback. Seek emits seeking/waiting, then seeked; track replacement also refreshes metadata/readiness. Each step checks for newer operations/destruction.

requestVideoFrameCallback(callback) returns a cancellable RAF ID for one synthetic notification, not a newly decoded-frame guarantee; it may run while paused. Callback now/captureTime/receiveTime use RAF time, expectedDisplayTime estimates now+16.6, and presentationTime/mediaTime are media seconds. Width/height come from the engine; presentedFrames, processingDuration and rtpTimestamp are always0. Do not use these values as decoder-throughput or network-latency measurements.

Source changes, cancellation and destruction invalidate old asynchronous work. Pause cancels pending playback and prevents old seeks from resuming it. Superseded operations may resolve normally; resolution does not prove their original intent ran. Active play/selection errors can reject. Src/load errors report through media events, normally code4; Range preflight is the separate path described above.

Destruction cancels input/preflight, frame callbacks, timers, audio nodes/context and decoder resources. Host cleanup also removes owned UI/subscriptions and deletes art.mediabunny only if it still belongs to this proxy. Late results cannot reactivate it. Cleanup is not a Promise of physical GPU/browser reclamation; long-duration and real-device acceptance remain separate.

## TypeScript

Root and `/legacy` preserve optional options and exact HTMLCanvasElement return inference. There is no `/runtime` subpath. Use explicit views for media capabilities:

```ts
import Artplayer from 'artplayer';
import mediabunny from 'artplayer-proxy-mediabunny';
import type { MediaBunnyPlayer } from 'artplayer-proxy-mediabunny';

const art: MediaBunnyPlayer = new Artplayer({
  container: '#player', url: '/movie.m3u8',
  proxy: mediabunny({ m3u8: { quality: { control: true } } }),
});
async function selectFirstLevel(): Promise<void> {
  const shim = art.mediabunny;
  if (!shim) return;
  const state = await shim.getM3u8State();
  if (state?.levels.length) await shim.switchM3u8Quality(state.levels[0].id);
}
```

Public types are Option, Result, HlsLevel, HlsAudio, HlsState, MediaBunnyCanvas, MediaBunnyPlayer, MediaBunnyShim, MediaListener, SyntheticFrameCallback and SyntheticFrameMetadata. The Canvas view preserves native collisions; the optional player alias is removed on host destruction. CommonJS runtime supports direct and historical .default calls while the factory type remains plain callable. The legacy build does not polyfill WebCodecs, Web Audio or other browser capabilities.
