# MediaBunny proxy maintenance

The public entry is `src/index.js`: an optional-options factory returns the existing
ArtPlayer proxy callback and an HTMLCanvasElement. Public declarations remain in
`types/artplayer-proxy-mediabunny.d.ts`. The input migration does not change those
declarations, the factory signature, canvas forwarding, or package entrypoints.

## Current module map

| Module | Responsibility |
| --- | --- |
| `input.ts` | String/Blob/ReadableStream normalization, SDK Source/SourceRef pass-through, HLS detection and Input construction |
| `media.ts` | Internal SDK-backed media and track-mode types; not public consumer types |
| `tracks.ts` | Primary video and pairable audio selection, metadata/computed/live duration |
| `hls-state.ts` | HLS track snapshots, bitrate/name/language values and actual selected track identity |
| `preflight.ts` | Optional HEAD Range check, historical warning/error policy, cancellation and stale-result guard |
| `load-session.ts` | Ownership of the pending/active SDK Input, HEAD AbortController, deferred load events and deadline |
| `MediaBunnyEngine.js` | Current coordinator; connects session cancellation to load, source replacement, errors and destroy |
| `VideoEngine.js` / `AudioEngine.js` | Current native decoding, rendering, seeking, Web Audio clock and scheduling |
| `VideoShim.ts` / `EventTarget.ts` | Video-like descriptors, synchronous/Promise forwarding and owned event lifecycle |
| `shim-values.ts` | Existing volume coercion and synthetic TimeRanges values |
| `shim-frames.ts` | Synthetic frame callbacks, per-instance RAF ownership and terminal cleanup |
| `engine-types.ts` / `MediaBunnyEngine.d.ts` | Explicit temporary coordinator boundary while its JavaScript implementation is migrated in MB-04 |
| `m3u8.js` | Current ArtPlayer control/setting integration |

The eleven TypeScript modules use strict checking with `skipLibCheck: false` and no
ambient Node types. The adjacent coordinator declaration is a transitional boundary,
not proof that the JavaScript coordinator has been checked. Replace it with the actual
strict implementation before completing MB-04. Remaining JavaScript is explicitly
scheduled in PKG-MB-04/05/06/07/08.
Do not describe the whole package as migrated yet.

The shim keeps its existing own-property order and direct prototype surface because
the entry copies those descriptors onto the canvas. Resource bookkeeping lives in a
WeakMap rather than adding accidental canvas properties. Frame callback IDs include
zero; destruction cancels pending callbacks and closes scheduling. The callback metadata
remains synthetic (`presentedFrames: 0`), not a claim of decoded frame accuracy.

EventTarget retains duplicate listeners, first-match removal, live-array `forEach`
mutation semantics, detail identity and listener exceptions during normal dispatch.
Its terminal state stops callbacks later in a dispatch when a listener destroys the
shim. Shim teardown closes events in `finally`, even if engine cleanup throws, and
subsequent teardown is inert. Engine playback/readiness race fixes remain in progress.

## Input and cancellation flow

Each `engine.load` invalidates the previous generation and cancels its session.
The new session owns an Input immediately after construction, before asynchronous
track selection. `engine.input` and `engine.media` become visible only after selection.
The session continues to own the Input during playback; these fields are aliases,
not separate disposal owners. Repeated cancellation/disposal is harmless.

Source replacement, timeout and destroy release that Input through SDK `Input.dispose()`.
MediaBunny controls its media fetch cancellation; do not pass a signal in UrlSource's
`requestInit` (the SDK explicitly excludes it). The separate HEAD check uses its own
AbortController. Without that constructor, stale HEAD results/errors are still ignored,
although the network request cannot be physically aborted by this adapter.

Cancellation settles the old load Promise without waiting for a stalled read. Its late
fulfillment/rejection remains observed but cannot update the current load. Active errors
retain `code: 4` and the SDK message; active timeout retains `Load timeout` and networkState 3.
Successful completion clears its deadline. Normal deferred waiting/loadstart ordering
remains; cancellation clears both callbacks. Destroy makes future loads inert.

Range behavior remains opt-in: no/`none` accept-ranges emits an error with a
`RangeNotSupported` detail and returns false, without setting the engine error property.
Network failure warns and continues; HLS strings and non-string sources skip HEAD.
HLS matching preserves the old case-insensitive `.m3u8` suffix/query/hash rule.
One explicit InputOptions assertion leaves unsupported values to SDK validation, preserving
the old error owner rather than silently converting arbitrary inputs.

## Types and dependencies

The locked runtime SDK remains MediaBunny 1.56.1. Its pinned WebCodecs declaration
0.1.13 duplicates types now present in TypeScript 5.9.3's DOM library. The root Yarn
resolution selects `@types/dom-webcodecs@0.1.19` for both dependency paths; the SDK
itself is unchanged. This is a build-time declaration correction, not a browser polyfill.
The package typecheck adds ESNext.Disposable for SDK declarations while keeping the
ES2020 target; production source does not use `using` or require Symbol.dispose.
Public consumer declarations do not import these SDK types; preserve that boundary
until the separate consumer-compatibility task verifies any proposed change.

## Validation and remaining work

```sh
yarn test:mediabunny
node node_modules/typescript/bin/tsc -p packages/artplayer-proxy-mediabunny/tsconfig.json
yarn build artplayer-proxy-mediabunny
yarn test:browser test/browser/mediabunny-inputs.spec.js test/browser/mediabunny.spec.js test/browser/mediabunny-load.spec.js
yarn test:browser test/browser/mediabunny-shim.spec.js
```

Node tests use actual SDK parsing and controlled lifecycle interleavings. Browser tests
include native decoding and separate pending ReadableStream cancellation with real timers.
`ARTPLAYER_MB_BASELINE=1` runs candidate load assertions against the immutable old main
to reproduce failures. `ARTPLAYER_MB_ARTIFACT` selects a built UMD main/legacy bundle;
`ARTPLAYER_MB_BROWSER_CANDIDATE=1` restricts browser runs to that candidate. Browser
reports record the implementation hash; archive the report and results before rerunning.

The source of historical truth is `refactor/baselines/mb-release.json` and its Git/npm
inputs, not a rebuilt dist. Package-specific evidence and remaining tasks are in
`refactor/mb-validation.md`. The full refactor plan is at the repository root.

PKG-MB-04 still owns duplicate/trackless readiness, reentrant event sequences and
pending play/seek coordination. PKG-MB-05/06 own late frame and audio callbacks,
including operations already inside decoders at cancellation; releasing Input alone
does not prove those resources are fully handled. PKG-MB-07 owns HLS UI/selection
races. PKG-MB-09 owns long-run AV sync, full core/proxy/plugin combinations and device
validation. PKG-MB-10 owns the demo, installed package and MPL/source notice gate.
Windows WebKit without WebCodecs/Web Audio is recorded as a capability failure,
not successful playback or a claim about all Safari installations.
