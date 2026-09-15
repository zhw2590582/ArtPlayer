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

`video:error` uses the same nonterminal stop path. Native source changes or decode
failures can emit an error without a pause event, so pause alone cannot cancel old
recognition. Error handling clears the queue/timer and invalidates pending results,
closes captured graphs, and keeps an existing direct connection available for later
playback. Existing subtitles retain their auto-hide deadline. Destroy also removes
this error listener; a later play can initialize or reconnect normally.

Pause detaches the recorder and cancels the interval. The direct media source
continues through its playback gain to the destination. A source switch reuses the
direct source and replaces the recorder; a captured-stream fallback is closed and
reacquired because captured tracks can end on source changes.

The direct playback gain stays at unity. Native media-element source output already
reflects the video's volume and mute; applying the same volume again would turn
50% volume into 25% output amplitude. Direct-path PCM also follows the main video's volume
and becomes silent when that element is muted. Native analyser tests cover the
linear output ratio, mute, stop and resume on Chromium/Firefox; they do not measure
physical speakers or establish Safari/device support.

Captured fallback does not own playback. Its source connects only to the recorder,
whose output connects through a zero-gain sink to the destination to keep processing
active. It must never reconnect raw captured audio to a speaker branch, including
after pause/restart. Captured PCM follows captureStream semantics and can remain
nonzero while the video is muted; that must not create audible ASR output. ASR stop
and destroy release only their contexts and captured tracks, leaving an external
owner's media graph intact.

Chromium naturally rejects a second element-source binding. The observed Firefox
build accepts it and can leave two native owners; that separate integration issue
remains under ASR-05 review. Firefox fallback tests explicitly force only the binding
rejection, while retaining native captureStream, tracks, Worklet and analyser nodes.
They do not establish automatic fallback selection on Firefox.

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

The optional `audioInput: { type: 'capture' }` snapshots a capture-only strategy at
factory creation. It skips direct binding entirely and reuses the silent capture
route, with no fallback to media ownership after capture failure. This supports
external owners on Firefox without pretending that default duplicate ownership
is detected automatically. Captured PCM ignores element mute/volume and does not
include processing done in another graph. The browser's CORS checks still apply.

A captured-source restart snapshots the epoch after stopping its previous graph.
When closing settles, a later pause/stop/restart/destroy must invalidate that
continuation. Otherwise a paused player could silently resume recognition. Keep
the delayed-close regressions when changing this state machine.

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

Root and `/legacy` declarations intentionally retain the historical factory,
void stop and void/Promise<void> callback. Their NodeNext ESM default import remains
the old namespace type: changing it into a callable default would break legal
namespace substitution. Historical direct-call errors are frozen separately from
legal namespace consumers. Do not silently rewrite these declarations to match
runtime behavior or require a self-default property on old replacement factories.

The additive `/runtime` entry references the same main/ESM implementation, with
`RuntimeOption`, `RuntimeResult` and `RuntimeFactory`: callback text/null/no result
and asynchronous stop are accurate. Its `.d.mts` default export and `.d.cts`/
`.d.ts` export assignment support ESM, raw CommonJS and old Node10 resolution.
Pure type namespaces make all four named runtime types available in every mode.
The root also exports those types for convenient annotations. No runtime code or
version changes are needed for this entry.

From the repository root:

- `yarn test:asr`: frozen public/audio observations, queue/encoding parity and
  candidate lifecycle regressions. Historical defects remain separate tests.
- `yarn test:browser test/browser/asr-audio.spec.js`: local AAC, actual Worklet,
  published/current core, pause/resume, source switch, stop/restart and destroy.
  Set `ARTPLAYER_ASR_ARTIFACT` to an actual main/legacy file to test that artifact.
- `yarn test:browser test/browser/asr-playback.spec.js`: frozen 2.1 output
  attenuation versus candidate linear volume, mute and stop/resume. A native
  unity analyser measures the gain-to-destination route with local audio.
- `yarn test:browser test/browser/asr-fallback.spec.js`: native capture/Worklet
  audio with an external media owner, silent ASR output even while muted, stop,
  fresh tracks after restart/source change and independent context cleanup.
  Explicit capture cases must have zero direct calls and no forced exception on
  Firefox; only default fallback coverage uses controlled rejection there.
- `yarn test:browser test/browser/asr-capture-cors.spec.js`: explicit capture
  respects native cross-origin restrictions without changing media properties or
  binding its playback route, then recovers on same-origin source change.
- `yarn test:browser test/browser/asr-cors.spec.js`: CORS-authorized media,
  opaque direct/redirected media, native zero-output or absent-chunk observations,
  and restoration after switching to a same-origin source. Default routing keeps
  the [Web Audio CORS restriction](https://www.w3.org/TR/webaudio-1.0/#MediaElementAudioSourceNode-security);
  this test does not claim that unsupported cross-origin playback is repaired.
- `yarn test:browser test/browser/asr-audio-track.spec.js`: separate audio-track
  ownership, pause/update/stop/destroy and main-video-only PCM. Both plugin orders
  are exercised in distinct cases. `ARTPLAYER_AUDIO_ARTIFACT` selects a real
  audio-track distribution alongside `ARTPLAYER_ASR_ARTIFACT`.
- `yarn typecheck`: includes the package strict/noUncheckedIndexedAccess project.
- `yarn test:asr-types-package`: packs and installs core/ASR outside the workspace,
  checks frozen 2.0/2.1 consumers and candidate declarations in strict compiler
  modes, verifies offline frozen reinstall and file hashes, exercises actual
  import/require exports, and rejects invalid uses. Historical declaration errors
  are explicit expectations and never counted as candidate success.
- `yarn test:asr-demo`: actual localhost:8082 docs/Monaco/Run flow in Chromium
  and Firefox, served script hashes, local PCM statistics, stop/play and destroy.
  Requires a free port 8082; owns only its temporary dev server. The exact AdSense
  request is isolated in this test; recognition requests must remain absent.
- `yarn dev artplayer-plugin-asr` and `yarn build artplayer-plugin-asr`: normal
  repository development and three-format production builds.

Windows Playwright WebKit 26.6 lacks AudioContext and AudioWorkletNode. Its native
ASR cases remain explicit skips and do not establish Safari/device compatibility.
Native direct/fallback routing, volume/mute, CORS and audio-track combinations
have scoped browser evidence. Other unsupported media,
Safari and physical devices remain PKG-ASR-05 acceptance work. CORS restrictions
and main-video-only capture are explicit integration boundaries, not a claim
that every media source can be recognized. Do not use the demo's external
recognizer service as a prerequisite for local audio verification.

## Shared installed browser validation

Eight browser files select verified installed ASR bytes through browser-candidate.js. The Audio Track combination independently verifies both installed plugins. Published ASR controls retain their frozen archives; attachments distinguish selected published, installed and source inputs. Tests cover native local PCM, direct/capture routing, CORS, video-only input recovery, volume/mute and ownership. Deliberately forced Firefox binding rejection remains labeled; no recognition service or physical speaker output is claimed.

Use `yarn test:package --browser`, then `yarn test:browser:installed`. The common
roster in scripts/browser-validation/scope.ts drives both preparation and required
inputs. Explicit artifact overrides are rejected when an installed map is present;
missing or stale inputs fail without source fallback. Source mode retains deliberate
artifact selection. See ../../refactor/changes/2026-09-15-CI-01-asr-cast-installed.md.

## Video-only input

`test/browser/asr-no-audio.spec.js` uses the generated H.264 video with no audio
track, verifies changing decoded pixels and the media clock, then changes the same
player to the local AAC tone. The default direct graph can yield silence or no
chunks for the video-only source and remains available for the later audio source.
Capture-only mode naturally fails `createMediaStreamSource` with no audio track;
the failed graph closes its context and stops its captured video track without
taking over or pausing native playback. A later playable source reacquires capture.
Both paths verify nonzero recovered PCM and final context/track cleanup.

The test observes real browser nodes/streams and does not inject a binding failure.
It does not prove speaker output, malformed-media recovery, Safari or device
support. Run `yarn test:browser asr-no-audio.spec.js --workers=1` for source mode;
the same file is included in the installed CI roster. WebAudio capability skips
remain visible and cannot be counted as audio processing passes.

`asr-media-error.spec.js` holds a caller recognition Promise after real nonzero PCM,
assigns non-media HTTP content through public `art.video.src`, waits for the native
MediaError, then completes that old Promise. It verifies that obsolete subtitles
are rejected and normal audio recognition resumes on a valid source. It does not
simulate a network outage or every decoder error. `test/asr-media-error.test.js`
also covers errors during Worklet loading and delayed capture closure. Both are
required when changing capture cancellation or error listener ownership.
