# ASR maintenance

The player captures first-channel audio and hands PCM/WAV to a caller-provided
recognizer. There is no network request, microphone permission or embedded model.

| File | Responsibility |
| --- | --- |
| src/index.ts | Snapshot options, register player events, return the compatible facade and install the stylesheet |
| src/types.ts | Internal options, result and browser capability types; public declarations remain in types/ |
| src/subtitles.ts | Punctuation/HTML rendering and the owned auto-hide timer |
| src/capture.ts | Initialization deduplication, active generation, FIFO consumption and one pending recognizer call |
| src/audio-graph.ts | AudioContext, element/stream source, Worklet loading, playback routing and recorder ownership |
| src/sample-queue.ts | Copied sample blocks with a linked queue and head offset; preserves partial blocks and tails |
| src/encoding.ts | Pure PCM16LE/WAV encoding, including historical clamping and the 44-byte mono WAV header |
| src/worklet.ts | Inline processor code; first-channel messages and the existing recorder-processor registration name |
| src/style.less | Existing art-layer-asr layout, art-asr-line content and player CSS variables |

Dependencies flow from the facade into subtitles/capture, then from capture into
the graph, queue and pure encoder. Audio modules do not receive the whole player.
The Worklet is loaded from a temporary Blob before binding the media element, so
a failed module load can close its context without taking over video playback.

## States and ownership

Play shares one pending initialization. Successful setup attaches one recorder
and starts one interval. Each tick takes exactly one complete block; an incomplete
block stays queued. Only one callback is pending within the active generation.
Rejections are logged and later ticks continue. Pause, source restart, stop and
destroy invalidate old recognizer completions and discard obsolete queued audio.
Each recorder also checks its own identity, rejecting messages from retired ports.

Pause detaches the recorder and cancels the interval. The direct media source
continues through its playback gain to the destination. A source switch reuses the
direct source and replaces the recorder; a captured-stream fallback is closed and
reacquired because captured tracks can end on source changes.

`stop()` returns `Promise<void>` and releases ASR work. An already displayed
subtitle retains its original auto-hide deadline; obsolete callbacks cannot add timers.
It retains playback subscriptions and allows explicit append or a later play.
For a directly bound video, the player keeps its original source/context and audio
route until `art.destroy()`. Closing that context at every stop caused Chromium
to lose audio on restart; a media element cannot simply bind a replacement source.
For a captured fallback, stop closes its disposable context and stops its tracks.
Before direct binding, failed/cancelled initialization closes its context and
revokes the Worklet URL. Destroy closes all contexts, disconnects nodes, stops
captured tracks, cancels subtitle timers and removes subscriptions.

This lifetime follows the [Web Audio close semantics](https://www.w3.org/TR/webaudio-1.0/#dom-audiocontext-close)
and [media-element source behavior](https://www.w3.org/TR/webaudio-1.0/#MediaElementAudioSourceNode).
Captured-stream source changes follow [Media Capture from DOM Elements](https://www.w3.org/TR/mediacapture-fromelement/#html-media-element-media-capture-extensions).

Queued audio is limited to the larger of 60 seconds or two configured chunks. A caller that
cannot keep up gets an explicit console error and capture pauses, leaving normal
playback routed. This avoids an unbounded backlog; it does not claim lossless
recognition under overload. A later play can restart capture. The caller owns
cancellation of its own network requests; obsolete completions cannot repaint.

## Compatibility and verification

The factory still snapshots options and registers synchronously, returning
`name`, `stop`, `hide`, `append`. There is no public start method. Append preserves
HTML, punctuation splitting, replacement, ignored non-string values and the
historical `length=0` behavior. The CJS function has a non-enumerable self `default`
alias for consumers of the 2.0 namespace, while preserving the callable 2.1 form.

Root public declarations have not yet migrated: they describe stop as void and
the callback as void/Promise<void>. PKG-ASR-04 owns exact asynchronous public types,
old assignment consumers, module forms and installed tarball acceptance. Internal
strict TypeScript does not prove that public type migration complete.

From the repository root:

- `yarn test:asr`: frozen public/audio observations, queue/encoding parity and
  candidate lifecycle regressions. Historical defects remain separate tests.
- `yarn test:browser test/browser/asr-audio.spec.js`: local AAC, actual Worklet,
  published/current core, pause/resume, source switch, stop/restart and destroy.
  Set `ARTPLAYER_ASR_ARTIFACT` to an actual main/legacy file to test that artifact.
- `yarn typecheck`: includes the package strict/noUncheckedIndexedAccess project.
- `yarn dev artplayer-plugin-asr` and `yarn build artplayer-plugin-asr`: normal
  repository development and three-format production builds.

Windows Playwright WebKit 26.6 lacks AudioContext and AudioWorkletNode. Its native
ASR cases remain explicit skips and do not establish Safari/device compatibility.
Real fallback track replacement, native volume/mute, CORS, unsupported media and
physical devices remain PKG-ASR-05 acceptance work. Do not use the demo's external
recognizer service as a prerequisite for local audio verification.
