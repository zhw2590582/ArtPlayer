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
| `MediaBunnyEngine.ts` | Load/readiness coordinator, source identity, errors and terminal teardown |
| `playback.ts` | Playback intent and cancellable play/seek/replacement operations |
| `readiness.ts` | One metadata publication after both participants, guarded event sequences |
| `hls-selection.ts` | Source-bound track queries, pairing and active replacement errors |
| `VideoEngine.ts` | Video capability/setup, source and seek ownership, first frames and terminal cleanup |
| `video-frames.ts` | Shared pending iterator reads, idempotent iterator release and existing frame timing policy |
| `video-renderer.ts` | Owned RAF, stale frame rejection, clock-driven draw/stall/end events |
| `video-poster.ts` | Per-request image callbacks, source guards and handler cleanup |
| `AudioEngine.ts` | Audio load/play generation, clock anchors and decoder-error forwarding |
| `audio-clock.ts` | Existing media-clock and future/partially-late buffer scheduling formulas |
| `audio-context.ts` | Context/gain setup, sample-rate fallback, shared native resume and terminal close |
| `audio-nodes.ts` | Scheduled source nodes, rate, ended handlers and complete stop/disconnect |
| `audio-pump.ts` | SDK buffer iterator, bounded batches, backpressure and stale-result guards |
| `audio-task.ts` | Cancelable waits and owned batch/backpressure timers |
| `VideoShim.ts` / `EventTarget.ts` | Video-like descriptors, synchronous/Promise forwarding and owned event lifecycle |
| `shim-values.ts` | Existing volume coercion and synthetic TimeRanges values |
| `shim-frames.ts` | Synthetic frame callbacks, per-instance RAF ownership and terminal cleanup |
| `engine-types.ts` / `engine-ports.ts` | Internal shim, coordinator and decoder interfaces |
| `m3u8.js` | Current ArtPlayer control/setting integration |

The twenty-six production TypeScript modules use strict checking with `skipLibCheck: false`
and no ambient Node types. The coordinator and both decoder engines are checked
implementations; there are no remaining adjacent JavaScript declaration bridges.
The public factory and HLS integration remain JavaScript, scheduled in PKG-MB-07/08.
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
subsequent teardown is inert. Engine teardown attempts input, audio and video cleanup
even when an earlier release throws, then preserves the first failure.

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

## Playback and readiness ownership

Playback intent is separate from the temporary paused state during seek. Explicit pause
cancels pending play and prevents automatic resume; a newer seek settles the old operation
without allowing its completion or rejection to overwrite current state. Pending play waits
for the seek completion signal, resolved before optional resume to avoid a cycle.
A pending AudioContext resume is shared across play-pause-play; only the current operation
starts video and emits play/playing. Source change and destroy invalidate both operations.
Cancellation settles the public operation while observing the underlying late result;
video and audio ownership are detailed below. Native resume coalescing belongs to the
context owner: each new playback intent calls audio.play(), but shares the same pending
native resume. Sharing a canceled upper-level play Promise would incorrectly start video
before the latest audio intent is active.

Normal play, pause, seek/resume and HLS replacement event order is retained. Before each
event the coordinator rechecks ownership, since a listener may synchronously pause, seek,
load another source or destroy. Active play errors reject their Promise and restore paused
state; active seek errors additionally publish one media error. The synchronous currentTime
setter observes its otherwise unreturnable rejection; direct engine.seek still rejects.
Active replacement errors remain visible even after the media object changes. Stale HLS query
errors are ignored only when their captured source no longer owns the result.

Metadata publishes once after both audio/video participants report; repeated or obsolete
callbacks cannot ready the current source. A parsed container with neither track fails with
code 4 and message `Input has no audio or video tracks.` before decoder/AudioContext setup.
This corrects the old false-ready state; normal valid input event order is preserved.
Existing-track unsupported-codec handling remains a decoder capability task, not evidence
that every capability failure has been fixed.

## Video frame ownership

VideoEngine keeps source/load generation separate from seek iteration and renderer activity.
A new source calls cancelPending before track selection starts, so an old seek cannot draw
while the new source is still parsing. Seek during capability detection waits for that load
without canceling its metadata; only the latest seek may install or draw its frames.
Ordinary paused seek still displays its first target frame and queues the second.

Iterator detachment is synchronous. The old return Promise is observed without blocking a
new load on obsolete reads; repeated release calls return the same cleanup Promise. Late
completion cannot clear the current iterator or its fetching flag. Stop/start shares an
already pending next() for the same iterator instead of issuing concurrent reads. Pause
invalidates render work; it does not cancel a legitimate paused seek's target frame.

Each seek after the initial iterator creates a fresh CanvasSink with its own two-canvas pool.
Concurrent obsolete decoders can otherwise overwrite the pixels of a queued frame even when
the proxy discards their returned objects. Sink identity is internal and may change on seek;
public canvas identity stays stable. Tests intercept sink prototypes to follow new instances.
CanvasSink retains poolSize 2, contain fit and track transparency. Its implementation closes
VideoSample after drawing into the pooled canvas. The proxy releases iterators and references;
WrappedCanvas is not a VideoFrame and must not receive close(). Default dropLateFrames remains
false, with the same tolerance/rate formula when enabled. Start preserves the queued second
frame until it is consumed instead of replacing it through premature prefetch. There is no
added frame copy.

Each renderer owns one RAF, including ID zero. Stop/destroy and event-listener reentry make
queued callbacks inert; an instance that never scheduled a frame cannot cancel another
instance's frame. Normal timeupdate, stall recovery and ended ordering is preserved, while
reentrant pause/source/destroy/restart stops the obsolete event sequence. Poster image
callbacks have source and request identity and are detached on replacement, draw or destroy.

Background decoder failure stops rendering and reports one media error through the coordinator,
even if audio cleanup fails. Iterator cleanup failures are observed and warned; explicit
stopIterator still rejects. Missing 2D context fails at use with a descriptive error, rather
than becoming falsely ready. Capability handling for existing undecodable tracks remains
under MB-CAP-01/MB-READY-01; the current no-video fallback is preserved for that separate review.

## Audio clock and resource ownership

AudioEngine keeps source generation separate from pump IDs and cancellable play intent.
Pause invalidates a suspended resume even when the audio clock has not started; source
replacement invalidates audio before track parsing. Late resume, capability checks and
buffer reads cannot install a sink, schedule nodes or resurrect a destroyed instance.
Native AudioContext.resume is coalesced per context, while canceled callers settle early
and late rejections stay observed. A valid no-audio-track source retains the Web Audio
clock fallback; this is distinct from rejecting a container with neither track.

The clock retains the existing anchor/rate formula and squared gain with mute. Pause
captures media time; seek/rate changes cancel the old iterator and stop/disconnect its
scheduled nodes before rebuilding the queue at the new anchor. The renderer's ended
event freezes the audio clock and releases remaining nodes. Source load resets position.
Fully expired buffers do not allocate nodes; partially late buffers retain the old offset
calculation. Audio playbackRate changes still change pitch through native source playbackRate;
no new pitch-preservation or acoustic synchronization guarantee is introduced.

AudioPump owns 16-buffer batches, a zero-delay yield and the existing one-second/50ms
backpressure policy. Its timers include ID zero and are canceled with its task. Iterator
detachment is synchronous and return is observed once; obsolete cleanup cannot clear a
new iterator. Native AudioBuffers have no close() contract: the SDK closes its AudioSamples,
while the proxy releases buffer/node/iterator references. Every scheduled source is owned
before start, cleared on ended, stopped/disconnected on cancellation, and has its callback
removed. Cleanup attempts all nodes and context resources before throwing the first error;
background cleanup failures are observed, and do not replace an active decoder failure.

ContextOwner installs context/gain references only after successful setup. Setup failure
releases partial resources, destroy nulls references and observes the asynchronous close,
and repeated destroy is inert. Real-browser teardown assertions poll the native closed state.
Tests deliberately delay native resume completion or decoded buffer delivery, without
substituting fake audio decoding for native acceptance.

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
yarn test:browser test/browser/mediabunny-video.spec.js
yarn test:browser test/browser/mediabunny-audio.spec.js
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

PKG-MB-04 covers duplicate/trackless readiness, reentrant event sequences and
pending play/seek coordination. PKG-MB-05/06 cover late frame and audio callbacks,
including operations already inside decoders at cancellation. These bounded cases do not
replace long-run synchronization and combination validation. PKG-MB-07 owns HLS UI/selection
races. PKG-MB-09 owns long-run AV sync, full core/proxy/plugin combinations and device
validation. PKG-MB-10 owns the demo, installed package and MPL/source notice gate.
Windows WebKit without WebCodecs/Web Audio is recorded as a capability failure,
not successful playback or a claim about all Safari installations.
