# ASS Subtitles with JASSUB

[简体中文](../../plugin/jassub.md)

Render ASS subtitles on Canvas using the JASSUB Worker and WASM. The plugin returns the actual JASSUB instance with its methods/events rather than converting ASS to plain VTT. This describes the unreleased branch; Worker, WASM, fonts and actual playback require deployment-specific validation.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-jassub
```

```js
import Artplayer from 'artplayer';
import artplayerPluginJassub from 'artplayer-plugin-jassub';
```

For scripts, load ArtPlayer before `dist/artplayer-plugin-jassub.js`; the global is `artplayerPluginJassub`. This preserves the [original example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-jassub/index.js&example=jassub). Its Worker/WASM/font URLs are site assets, not paths automatically created in your application by installing the plugin.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-jassub/index.js">▶ Run Code</div>

```js
// https://github.com/ThaUnknown/jassub
// npm i artplayer-plugin-jassub
// import artplayerPluginJassub from 'artplayer-plugin-jassub';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/jassub/FGOBD.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginJassub({
            subUrl: '/assets/jassub/FGOBD.ass',
            workerUrl: '/assets/jassub/jassub-worker.js',
            wasmUrl: '/assets/jassub/jassub-worker.wasm',
            modernWasmUrl: '/assets/jassub/jassub-worker-modern.wasm',
            availableFonts: {
                'liberation sans': '/assets/jassub/default.woff2'
            },
            fonts: [
                '/assets/jassub/fonts/Averia Sans Libre Light.ttf',
                '/assets/jassub/fonts/Averia Serif Simple Light.ttf',
                '/assets/jassub/fonts/Gramond.ttf'
            ],
            timeOffset: -0.041
        }),
    ],
});
```

Host matching Worker, WASM and fonts with correct paths, access policies and font usage rights. Missing fonts affect layout. Default relative URLs do not establish that files are deployed.

## Resource and rendering options

Runtime options are optional and default to art.video. They are read at registration; an explicit video overrides the host video. These are current local implementation defaults, including differences from old upstream comments.

| Field | Actual default or meaning |
| --- | --- |
| `video` / `canvas` | Video defaults to art.video; caller canvas allows manual DOM handling; a usable rendering target is required |
| `workerUrl` | `'jassub-worker.js'` |
| `wasmUrl` | `'jassub-worker.wasm'` |
| `legacyWasmUrl` | `'jassub-worker.wasm.js'` |
| `modernWasmUrl` | Used when supplied and SIMD is detected; otherwise wasmUrl |
| `subUrl` / `subContent` | Subtitle URL or ASS text sent to the Worker |
| `fonts` | Empty array by default; entries can be URLs or Uint8Array |
| `availableFonts` | Defaults to `{ 'liberation sans': './default.woff2' }`; font-name-to-URL/bytes map |
| `fallbackFont` | `'liberation sans'` |
| `useLocalFonts` | Enabled only when queryLocalFonts exists; current code defaults to true when available, with explicit false supported; permissions still apply |
| `blendMode` | `'js'`, with `'wasm'` also accepted |
| `asyncRender` | Defaults true, subject to createImageBitmap availability |
| `offscreenRender` | Defaults true, requiring transferControlToOffscreen and no caller canvas |
| `onDemandRender` | Defaults true, subject to requestVideoFrameCallback availability |
| `targetFps` | Defaults 24; not a fixed update guarantee in on-demand mode |
| `timeOffset` | Defaults 0 seconds |
| `debug` | Defaults false |
| `prescaleFactor` / `prescaleHeightLimit` / `maxRenderHeight` | Defaults 1 / 1080 / 0; rendering size controls, with no maximum imposed by a zero maxRenderHeight |
| `dropAllAnimations` / `dropAllBlur` | Simplification options forwarded to the Worker; not set to true by the wrapper when omitted |
| `libassMemoryLimit` / `libassGlyphLimit` | Defaults 0; libass cache limits in MiB, not a total browser-memory cap |

Capabilities can change the chosen rendering path. Async/offscreen/backend options are not universal performance guarantees. Do not mix incompatible Worker and wrapper versions.

## Instance and methods

Registration synchronously returns `{ name: 'artplayerPluginJassub', instance }`, not a Worker-ready Promise. Access it at `art.plugins.artplayerPluginJassub.instance`. It is an EventTarget: query after ready, and observe its error event rather than assuming a same-named player event.

| Method | Behavior and units |
| --- | --- |
| `resize(width?, height?, top?, left?, force?)` | Synchronous void; force is last, with omitted dimensions derived from video |
| `setVideo(video)` | Rebind video, observation and the owned container position synchronously |
| `setTrackByUrl(url)` / `setTrack(content)` / `freeTrack()` | Set subtitle URL/text or release the track |
| `setIsPaused(boolean)` / `setRate(number)` | Manually update Worker playback state/rate |
| `setCurrentTime(isPaused?, currentTime?, rate?)` | currentTime uses seconds |
| `createEvent(event)` / `setEvent(event, index)` / `removeEvent(index)` | Mutate ASS events, accepting partial fields |
| `getEvents(callback)` | Callback-based event query, not a Promise |
| `createStyle(style)` / `setStyle(style, index)` / `removeStyle(index)` | Mutate styles, accepting partial fields |
| `getStyles(callback)` | Callback-based style query, not a Promise |
| `styleOverride(style)` / `disableStyleOverride()` | Enable/disable style override |
| `setDefaultFont(font)` / `addFont(font)` | Set the default font or add a URL/byte font |
| `runBenchmark()` | Request the Worker benchmark; not an end-to-end performance conclusion |
| `sendMessage(target, data?, transferable?)` | Promise resolves after posting, or without posting after destroy; not a Worker acknowledgement |
| `destroy()` | Synchronous, idempotent cleanup; no resource-reclamation Promise |

Except sendMessage, ordinary control methods above return void; queries supply callback data. The historical destroy(error) overload returns an original Error, converts a nonempty string to Error, or retains an empty string. Normal cleanup uses no-argument destroy.

AssEvent Start/Duration use milliseconds and Style is a numeric style index. Other fields are Name, MarginL/MarginR/MarginV, Effect, Text, ReadOrder and Layer. AssStyle includes Name/FontName/FontSize, PrimaryColour/SecondaryColour/OutlineColour/BackColour, Bold/Italic/Underline/StrikeOut, ScaleX/ScaleY/Spacing/Angle, BorderStyle/Outline/Shadow/Alignment, MarginL/MarginR/MarginV, Encoding, treat_fontname_as_pattern, Blur and Justify. Query results have no `_index`; the ASS text-format style name is not the runtime numeric Style.

Successful queries call `(null, array)`; failures supply an Error or native Event without data. Destroy fails pending queries after releasing their listeners/timers. The protocol matches by response target, without a new request ID; do not assume simultaneous same-target queries have independently correlated responses.

## Lifecycle and types

The plugin-owned `.JASSUB` container uses z-index20 and is removed on destruction; caller canvas/video nodes remain. Player destruction calls the instance's current destroy method; direct destruction is also idempotent. setVideo/destroy invalidate old frame callbacks and clean Worker/observer ownership. Late bitmaps must not restart rendering. Actual offscreen stalls, browser differences and physical devices retain separate acceptance requirements.

Root and `/legacy` retain historical JassubOption/JassubInstance: three required URLs, force-first resize, inaccurate Promise method returns and open extension indexes. Use `/runtime` for accurate types with the same implementation:

```ts
import type Artplayer from 'artplayer';
import jassub from 'artplayer-plugin-jassub/runtime';

function attachSubtitles(art: Artplayer) {
  const { instance } = jassub({
    workerUrl: '/assets/jassub/jassub-worker.js',
    wasmUrl: '/assets/jassub/jassub-worker.wasm',
    subUrl: '/subtitles.ass',
  })(art);
  instance.addEventListener('ready', () => {
    instance.getEvents((error, events) => {
      if (error) console.error(error);
      else console.log(events);
    });
  });
  return instance;
}
```

Runtime exports FontSource, RuntimeOption, AssEvent, AssStyle, AssEventInput, AssStyleInput, WorkerRequestError, EventsCallback, StylesCallback, RuntimeEventMap, RuntimeInstance, RuntimeResult and RuntimeFactory. Precise instance fields include timeOffset, debug, the three sizing settings, optional busy and historical public `_canvas/_ctx`; `_ctx` may be false/null. There is no runtime factory `.default` self-alias. The old root's NodeNext namespace does not create one. Runtime supports an accurate ESM default and CommonJS `import = require`.
