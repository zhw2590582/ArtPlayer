# Browser regression entry

`editor-core.spec.js` checks editing, keyboard undo/redo, find navigation and disposal
for all ten bundled locales. Names come from statically parsed frozen NLS inputs;
each localized bundle must load over HTTP. A separate case requires the real core
diff worker to compute and clear changes after input updates. On Windows the ten
locale cases and worker case pass in Chromium/Firefox/WebKit (33 cases total).

`editor-markdown.spec.js` runs the bundled DOMPurify/marked renderer, verifies
formatting, selected filtering and temporary-hook cleanup. `site-vendor.spec.js`
also checks all 85 notice files and the core-origin attribution links over HTTP.
These checks do not constitute exhaustive sanitizer or physical-device validation.

`editor-modes.spec.js` exercises Monaco's actual automatic mode/provider registration
through a real editor. It switches CSS/JSON/TypeScript/HTML models, checks diagnostic
arrival/removal and document formatting, verifies all four mode bundle responses,
and checks model disposal clears markers. It complements direct worker tests;
neither suite alone proves all editor UI, physical-device or player integration paths.

`editor-languages.spec.js` loads the frozen Monaco 0.30.1 CSS/HTML/JSON workers,
checks real Worker creation, positive/negative diagnostics, tag completion, document
symbols and formatting, and disposes models/workers. It uses `createWebWorker` with
the archived mode managers' options; this version does not expose public language
worker getters other than TypeScript. These checks complement `editor-types.spec.js`
and do not replace full editor UI or actual player playback tests.

`yarn test:vast-native` is the explicit external Google IMA suite; it is separate
from default `*.spec.js` PR checks. It uses local VAST/media inputs and real SDK
loading, playback, content restoration and destruction. See
[VAST validation](../../refactor/vast-validation.md) for reports and outstanding
network/device failures; the current matrix is not fully passing.

`canvas-dpip.spec.js` tests actual native windows with the Canvas video and subtitle
track, continued playback, paused cue seeking and close/native-close/destroy.
Chromium/Firefox native outcomes and WebKit API-unavailable outcomes must be
counted separately. The installed scope requires five verified packages, including
Document PiP; `dpipCandidate` cannot substitute a source build for a missing map.

`canvas-subtitles.spec.js` covers native track bootstrap/load/seek/replacement and
cleanup on old/new cores, including ordinary Canvas child operations. It is part
of both browser scopes. `ARTPLAYER_CANVAS_SUBTITLE_BASELINE=1.1.0` runs the exact
published proxy as a failing historical control; it cannot be combined with an
installed candidate map. This is a real media/track test, not a simulated cue list.

Chapter pointer geometry is shared by `chapter-hover.ts` and the combination
suite. It awaits locator actionability with `hover({ trial: true })` before
reading coordinates; `art.fullscreen` can become true while controls still move.
The motion regression enters native fullscreen and adds a controlled 600ms Web
Animation to reproduce stale coordinates. It checks the final hit target, chapter
text and opacity without changing production CSS or increasing assertion timeouts.
It also requires pointer x/y to lie within the final inner rectangle; WebKit's
initial hit-test alone reported a hit outside that recorded rectangle.
Use `ARTPLAYER_CHAPTER_HOVER_BASELINE=1` to rerun the old immediate-read path;
this diagnostic intentionally fails on affected engines and is not an acceptance
mode. Both files belong to source and installed scopes. For installed runs:

```sh
# Set ARTPLAYER_BROWSER_ARTIFACTS to a verified installation map first.
yarn test:browser:installed test/browser/chapter-combinations.spec.js test/browser/chapter-hover.spec.js --workers=2
```

See `refactor/baselines/chapter-hover-validation.json` for the original failure,
controlled red/green observations and actual execution limits.

CI uses `yarn test:browser:source` for the complete source suite and
`yarn test:browser:installed` for the reviewed installed-package subset. The source
launcher clears inherited ARTPLAYER_BROWSER_ARTIFACTS; the installed launcher and
config verify all required package hashes and build inputs. Reports live separately
under browser-source/ and browser-installed/. See
[scope maintenance](../../scripts/browser-validation/README.md) before adding an
installed test or interpreting `--list` output as execution evidence. Existing
`yarn test:browser` commands retain their ad hoc behavior and browser/ output.

`library-development.spec.js` starts the actual JS dev CLI and typed runner on an
atomically assigned fixture port. It checks generated TS/Less/SVG/inline-worker assets,
automatic reload on edits and recovery after a compiler error in all three
engines. It owns and stops only its child server, never the user's port 8082
session. SIGTERM must settle the child naturally with exit0. Its second case serves
actual docs/Monaco, executes TypeScript and plays/pauses/seeks a local MP4, checking
a decoded canvas frame. The attachment records browser/version, OS and actual
core/media hashes; the tracked core5.4.1 asset is not a new release candidate.
Analytics/ads are inert routes; real-device and remote OS checks remain separate.

`site-loading.spec.js` covers actual desktop/mobile loading, dependency order,
failure/retry/AMD restoration, example priority, repeated Run and stale responses,
plus Run Code and language routing. External analytics/ads are inert test routes;
no advertising service or native device acceptance is implied. Keep this browser
run serial with heavy compiler baselines after observing local setup contention.

`editor-declarations.spec.js` loads the repository Monaco with the 22 declarations
actually listed in `common.js`, checks positive/negative consumers and runs emitted
Chapter code through ready/destroy with controlled media. VAST coverage is types
only, not advertising SDK execution. The unreferenced legacy WebSR declaration
asset is preserved; this test follows the actual editor's library list.

`docs-smoke.spec.js` verifies the documentation runner in three engines with
actual core/media, controlled failures and three selected generated snippets.
It checks pending readiness beyond the former 100ms timer, returned/unhandled
rejections, ready/destroy errors, missing scripts, deadlines, frame/global/timer
cleanup and storage restoration. It does not execute all 233 documentation cases
or prove remote SDKs/features. DPIP-MEDIA-01's exact WebKit intrinsic/layout size
pairs remain explicit observations; this suite does not close that risk.

`yarn test:browser document-site.spec.js document-danmuku.spec.js --workers=1`
checks built bilingual navigation and Run Code URLs, then extracts every runnable
Danmuku snippet from both source guides. It loads the local Danmuku distribution
(whose SHA-256 is attached), candidate core and real documentation sample in owned
frames. This covers readiness and cleanup; it does not click every example control,
wait for every delayed callback, prove playback or replace PKG-DANMUKU-08.
Regenerate the site and its browser assets before navigation checks. Preserve both
`.run-code` and `[classname="run-code"]` selectors: SSR and Vue navigation can
produce different attribute forms, both supported by the site's handler.

`yarn test:browser test/browser/ads.spec.js` tests actual Ads 1.0.6 and candidate code
with published 4.5.5/5.4.1 and candidate cores using local image/video media. It covers actual
decoded pixels, countdown, skipping, content restoration, 404 and source replacement.
Published-only rejection cases inject an exact play failure; they do not certify device
autoplay policies. See [Ads validation](../../refactor/ads-validation.md).
Candidate lifecycle cases check early/duplicate skip, real media release after destroy and
observed internal play rejections. The server exposes the verified 4.5.5 bundle separately
and records its fingerprint; the fixture uses the shared template.$video surface.

Audio Track tests use the source and frozen 1.1.0 plugin on both cores. The local AAC fixture
has a pinned hash and generation command in media/audio-tone.json and uses the existing Range
server. The suite retains published cleanup/native-pause defects as explicit observations.
See [audio validation](../../refactor/audio-validation.md) for passed scope and device limitations.

Use the pinned Node and Yarn versions, then run:

```sh
yarn install --frozen-lockfile
yarn test:browser:install
yarn test:browser
yarn test:browser --project=chromium
yarn test:browser:report
```

The three projects run actual Chromium, Firefox and WebKit. They use isolated browser contexts,
no retries, a loopback server on 8084, and no existing dev server. Set `ARTPLAYER_BROWSER_PORT`
to use another free port. The server builds core and chapter from current JS/TS entries in memory;
it does not modify dist or docs outputs. Restart the test command after source changes.

`hls-control.spec.js` separately builds HLS control and verifies a pinned Hls.js 1.5.17 archive.
Its local playlists/segments are generated fixtures with checked hashes. Windows WebKit lacks MSE:
one explicit capability/error-cleanup test covers that limitation and its 14 playback cases are
skipped with a reason. Chromium/Firefox run the full four-combination HLS matrix. This is not
Safari playback approval; see [HLS validation](../../refactor/hls-validation.md) for evidence and open gates.

The standalone `refactor/scripts/hls-sdk-diagnostic.mjs --controller-state` option
installs `helpers/hls-controller-state.js` only for a fixed-SDK diagnostic. It reads
the 1.5.17 buffer dictionary or 1.7.2 buffer array and the controllers' shared
fragment tracker, keeping cyclic loaded objects out of JSON. The 1.5 audio stream
controller is located by playlistType in networkControllers. Observations are also
copied asynchronously into a bounded Node queue, retaining received events after
a page crash; the last undelivered events may be lost. Default diagnostics
do not enable this observer. A missing or errored snapshot is incomplete evidence;
neither transient empty media ranges nor repeated success resolves HLS-PLAYBACK-01.

`playback.spec.js` tests published/current core with current chapter, real decoded frame colors,
media time advancing, pause, seek, source change to the existing docs video, destroy and real
HTTP failure. These are initial smoke contracts, not full chapter or lifecycle coverage.
`fixtures.js` captures browser version, actual scripts/media hashes, page errors, console errors,
failed requests and final state. Tests attach decoded pixels and server-side media requests too.
Windows WebKit media requests are not reliably visible to Playwright's page network events;
use the loopback request log to prove that media was fetched. Its `videoWidth` can reflect layout
size, so intrinsic-size compatibility is a separate test, not the playback-success predicate.
Chromium's `net::ERR_ABORTED` and Firefox's `NS_ERROR_PARSED_DATA_CACHED` may cancel media range
requests after buffering. The successful-playback tests allow only the exact engine-specific code,
same-origin media type and two URLs bearing the current test ID; raw failures remain in reports.
See [Mozilla's media-cache explanation](https://bugzilla.mozilla.org/show_bug.cgi?id=1347174#c4).

Reports, failure screenshots and traces are under `refactor/.cache/browser/`. They contain local
test URLs and paths. JSON and HTML are regenerated each run; archive them before another run
if evidence must be retained. A successful HTTP page fetch does not validate its editor UI.

## Files and routes

- `server.mjs`: current/published artifact provenance, docs serving, Range and controlled failures.
- `player.html`: lightweight page, real ArtPlayer constructor and user-gesture play/pause buttons.
- `fixtures.js`: per-test error and provenance attachment; contexts/storage are Playwright-owned.
- `playback.spec.js`: behavior assertions shared by browser and core version.
- `media/`: committed synthetic fixtures. CI needs no FFmpeg to use them.

`/test/manifest.json` identifies every mapped core/chapter artifact and synthetic media file by
SHA-256. `/published/<package>.js` verifies the frozen npm archive/member from BASE-01.
`/candidate/<package>.js` maps the current build. Existing docs `/compiled/<package>.js` and
`/uncompiled/<package>/index.js` are aliases for that candidate. Other compiled/uncompiled paths
fail explicitly; add a verified mapping before testing another package, rather than serving stale
build output. Other docs pages, examples and samples use their existing paths without source edits.

`/test/pattern.mp4` and `.webm` support GET/HEAD and single byte ranges (including suffix ranges).
Invalid ranges return 416. `/test/fail.mp4` always returns 503. Add a unique `?case=<test-id>` to
media URLs and inspect `/test/requests.json?case=<test-id>` for actual server requests. The log is
bounded and server-local; it is not a production endpoint or a substitute for decoded frames.

To test extracted candidate UMD files, set `ARTPLAYER_BROWSER_ARTIFACTS` to a JSON file:

```json
{
  "artplayer": "./extracted/artplayer/dist/artplayer.js",
  "artplayer-plugin-chapter": "./extracted/chapter/dist/artplayer-plugin-chapter.js"
}
```

Paths resolve relative to that JSON. Both keys are required; missing files abort startup. No source
fallback is allowed in this mode. ENG-07 owns tarball creation and broader consumer checks.
For manual docs interaction, run `node test/browser/server.mjs` and open the existing editor URL
on 8084 with chapter's libs/example parameters. EX-03 still owns the full Monaco Run/TS/storage
workflow, all examples and external SDKs. The lightweight page does not complete that task.

## Synthetic media provenance

Generated locally from FFmpeg's `testsrc2`, without external footage or audio, using
`ffmpeg version 2025-11-12-git-6cdd2cbe32-full_build-www.gyan.dev`:

```sh
ffmpeg -f lavfi -i testsrc2=size=320x180:rate=24 -t 8 -an -c:v libx264 -profile:v baseline -pix_fmt yuv420p -movflags +faststart test/browser/media/pattern.mp4
ffmpeg -f lavfi -i testsrc2=size=320x180:rate=24 -t 8 -an -c:v libvpx -b:v 160k test/browser/media/pattern.webm
```

MP4 SHA-256: `0ad1d7ad286aec6e0fa9e27fc1e487e7277df2e603e30040fb942365763d0233`.
WebM SHA-256: `9d3c2b3dec9581a599de2d6732992ef7846790e0d1368e6e131bd339b39e984f`.
MP4 is the initial playback contract; WebM is available for subsequent codec-specific cases.
Do not regenerate fixtures silently: update hashes and decoded-frame checks together.

The docs `assets/sample/video.mp4` remains an existing sample with its original provenance limits
tracked by BASE-MEDIA-01. The new synthetic fixtures do not resolve rights for existing media.
Browser binaries/codec support vary by OS; these projects do not replace Safari/iOS/Android
device checks. See the [official browser guidance](https://playwright.dev/docs/browsers).

## Withheld media diagnostics

`test/helpers/media-gate.js` binds a temporary HTTP server to loopback and withholds
the tail of the pinned media until the test calls release(). Its default response
keeps the full Content-Length and streams the prefix; the diagnostic completeRanges
mode sends a bounded 206 response and holds the later range. Both preserve exact
bytes and a strong ETag. Partial range semantics follow
[RFC 9110 section 15.3.7](https://www.rfc-editor.org/rfc/rfc9110.html#name-partial-content).
`node --test test/media-gate.test.js` verifies actual HTTP bytes, headers and release.

`audio-buffering.spec.js` requires trusted waiting after actual clock progression,
then release, resumed clocks and synchronization across old/new core/plugin pairs.
It currently has unresolved Windows WebKit failures; do not skip them or count
the native diagnostic below as equivalent acceptance. See refactor/audio-validation.md.

`media-gate-native.spec.js` removes all ArtPlayer instances and uses a native element
with preload=auto. It records whether playback and starvation were observed for
both response modes. A passing diagnostic only proves observation plus successful
playback after release; inspect its progressed/waiting flags before claiming buffering.
These capability observation timeouts do not relax the integration assertions.
Archive the report and results (including traces) before starting another browser suite.

For byte-prefix diagnostics, set `ARTPLAYER_MEDIA_GATE_VIDEO_LIMIT` and/or
`ARTPLAYER_MEDIA_GATE_AUDIO_LIMIT` to an integer byte count strictly between zero
and the corresponding file size. Unset them for the unchanged 96 KiB video / 32 KiB
audio defaults. These variables only affect the native diagnostic, never the audio
plugin integration test. `native-gate-before-release` retains the media state and
an immutable request snapshot before releasing the tail; `native-gate-capability`
also survives failures after that observation and records any successful recovery.
Check `progressed` and `waiting` independently. Larger prefixes can start Windows
WebKit playback without yielding a trusted waiting event; this does not prove the
integration buffering contract. See the audio prefix checkpoint in refactor.

Danmuku input, scheduler, resources and heatmap-density specs accept
`ARTPLAYER_DANMUKU_ARTIFACT` for a built main/legacy file; unset it to compile the
current JS/TS entry. Run each format sequentially and wait for the command's final
exit before copying reports or launching the next format. A visible last test line
does not prove reporter/trace teardown is finished. These runs share the server port
and output directory, so simultaneous invocations can corrupt failure evidence.
For a timeout, inspect the retained trace before changing the test or implementation;
browser startup and pre-plugin playback delays are different from plugin execution.
The density regression retains 16000 rows, real playback and SVG/pixel geometry at
two widths. A diagnostic pass does not waive the full matrix or long-load acceptance.

`danmuku-timing-diagnostic.spec.js` records independent native RAF/media progress
and the original eligibility getter under an 800ms CPU block or 600ms asynchronous
visibility callback. Its async case asserts that the candidate retains all three
rows and serial callbacks; the fixed published baseline retains its missing middle
row. CPU-block observations remain diagnostic, not no-loss acceptance. Both it and
`danmuku-lifetime.spec.js` accept the same artifact override. The latter verifies
the full visible lifetime after a controlled delay to an actual Worker request.

`danmuku-fullscreen.spec.js` covers old/current core and plugin combinations in
native document and CSS web fullscreen, with three fresh player lifetimes each.
It checks timestamp-delivered visible text, layout restoration, Worker/DOM cleanup
and instance-local event sequences. Frozen-core post-destroy listeners are an
explicit historical observation, never a waiver for the candidate. Native exit
must deliver its event before teardown; hidden measurement nodes are not visible
rows. `ARTPLAYER_DANMUKU_ARTIFACT` selects a real candidate main/legacy input.

`danmuku-stability.spec.js` covers old/current core and plugin combinations and
runs three native 14-second media cycles at 2 or 20
rows per second, appending through the public load(rows) contract. The candidate
must deliver and recycle every row once, preserve state membership and reuse
actual node identities. Its 90-second per-case deadline budgets the 42 seconds
of media plus setup/teardown; it is not a relaxation of other tests. Heap readings
remain observations. No media/RAF clock is replaced or ready state seeded here.
`danmuku-mask-boundary.spec.js` verifies the core-owned root and external CSS mask
across commands and destroy(false), with actual video and placement Worker. It
uses explicit ready rows for resource setup and a fixed SVG mask; it does not
load the Mask SDK/model or provide timestamp-delivery evidence.

`danmuku-mask-native.spec.js` loads the actual built Mask/SDK and fixed local
MediaPipe assets with native video. It verifies bitmap alpha, stop/restart/destroy,
then actual Danmuku delivery after model readiness, pause, seek and CSS web
fullscreen with candidate, published and actual 5.3.1-beta.1 cores. Set
`ARTPLAYER_MASK_ARTIFACT` to a main/legacy global artifact; ESM is not supported by
that override. Run formats sequentially and archive each completed report.
The startup time=6 row remains diagnostic because initial model work can coincide
with a missed narrow timestamp window. A passing post-ready combination is not
proof of startup losslessness, private GPU/WASM closure, OS fullscreen or devices.
See refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md for exact limits.

Its combination cases now include frozen/current Danmuku and a bounded 120-row
load while the actual model continues. `danmuku-combination-load.js` observes
real media/RAF and cleans up its test listeners; it does not seed eligible rows.
The candidate must deliver all 120 rows exactly once and recycle their references;
original failures and the PKG-DANMUKU-MASK-LOAD-01 repair remain separate evidence.
For a Chromium diagnostic only, set `ARTPLAYER_MASK_PROFILE=1` to attach the actual
CDP CPU profile around the load. This never stops inference or patches the SDK.
Ordinary format acceptance runs without profiling. Final load snapshots also
record pending/reserved row IDs to distinguish missed sampling from placement
backlog. Use `ARTPLAYER_DANMUKU_ARTIFACT` with `ARTPLAYER_MASK_ARTIFACT` to bind both
candidate plugins to the exact main/legacy files being tested.
`danmuku-dpip.spec.js` also includes two-window load cases and both plugin versions.
Frozen-plugin retained DOM, candidate cleanup and unsupported API outcomes remain
distinct; the old plugin's observed loss is not complete-delivery acceptance.

`jassub-native.spec.js` runs both published JASSUB 1.1.0 and current source by
default, each on three cores, with native Worker, fixed local WASM/font and
authored ASS cues with offscreenRender=false. It checks real canvas pixels
before/after seek, CSS web fullscreen and destruction. Source candidates use
direct instance destruction before host cleanup, just like explicit/installed
candidates. Selected-input attachments distinguish source-build from published
and installed artifacts; a missing source file path is not a historical identity.
Windows WebKit currently fails the published default frame-clock path; the explicitly
selected ARTPLAYER_JASSUB_ON_DEMAND=false diagnostic passes on the candidate core.
This is a retained historical failure, not a waived browser gate. The server must
serve WASM as application/wasm for native streaming compilation. Archive failed
and successful runs independently. See the PKG-JASSUB-02 change record.

For candidate registration regressions, set ARTPLAYER_JASSUB_ARTIFACT to a built
main/legacy global file. Those runs also destroy the exposed instance before host
cleanup. ARTPLAYER_JASSUB_CUSTOM_CANVAS=true supplies a caller-owned canvas and
asserts it remains connected after destroy(false). The native report records the
artifact hash and both mode choices. An explicit file selects that input alone;
normal source/installed runs retain the historical control alongside the candidate.
The original historical failure is not waived. These checks do not establish
ESM/offscreen/device acceptance.

`jassub-render-failure.spec.js` uses an actual Worker/WASM bitmap and native copies.
It intentionally closes one bitmap to provoke native Canvas InvalidStateError,
checks release of the entire batch, then pauses and waits for pending demand before
public resize(force) verifies a visible subtitle again. Select actual main/legacy
with ARTPLAYER_JASSUB_ARTIFACT. This main-thread fault injection does not reproduce
spontaneous Worker corruption or resolve the separate Firefox offscreen stall.

`slider-updates.spec.js` checks live progress ARIA, external attribute repair and
duplicate-event mutation counts. ARTPLAYER_SLIDER_BASELINE optionally supplies a
prechange core script for three alternating paired groups. The regular candidate
comes from the browser server, including ARTPLAYER_BROWSER_ARTIFACTS when supplied.
Five timings of 1000 synthetic paused updates follow a 300-update warmup; operation
counts and actual playback are measured separately. Keep raw samples and do not
interpret these diagnostics as full initialization/resource or playback-FPS gates.

`storage-performance.spec.js` compares published and candidate playback records
in three alternating groups with actual video and localStorage. It records five
100-event timing samples separately from Storage/JSON instrumentation, verifies
fresh nested read results and interleaved unrelated settings, and checks paused
updates. Saved media time must fall between native reads immediately around the
refresh; exact equality with a later read is invalid when the clock advances.
This is a synchronous public-get interleaving test, not a multi-process race test.

JASSUB Firefox diagnostics retain the canonical failing cases. Set
`ARTPLAYER_JASSUB_OFFSCREEN=default` to exercise native capability selection.
`ARTPLAYER_JASSUB_ASYNC_RENDER=false` explicitly selects synchronous rendering;
`ARTPLAYER_JASSUB_READBACK_FRAME=true` waits one animation frame before readback.
Neither diagnostic changes the default candidate or constitutes a runtime fix.
`playwright.jassub-diagnostic.config.js` requests Firefox software WebRender for
comparison only; it is not the canonical browser acceptance configuration.

`jassub-platform.spec.js` isolates native video and a minimal canvas Worker under
candidate/published cores and a script-free native host. All hosts resize to the
viewport. Default drawing uses fillRect; `ARTPLAYER_JASSUB_CONTROL_BITMAP=true`
selects actual createImageBitmap/drawImage/close and records worker stage times.
`ARTPLAYER_JASSUB_CONTROL_IDLE_READBACK=true` pauses submissions while waiting for
all draw acknowledgements before copying the display canvas. This is a deliberate
scheduling diagnostic, not unchanged production timing. Hosts without canvas
transfer use main-thread fillRect and do not verify the Worker/ImageBitmap path.
The report records these distinctions and never infers a JASSUB fix from a control
pass. Preserve each raw report/results directory before the next browser command.
See [the isolation record](../../refactor/changes/2026-09-14-PKG-JASSUB-09-firefox-diagnostics.md).

`ARTPLAYER_JASSUB_CONTROL_SINGLE_FLIGHT=true` submits at most one unacknowledged
draw, without pausing readback. It records skipped video callbacks and the maximum
outstanding count; this opt-in control also rejects individual canvas reads taking
7 seconds or more, even if expect.poll eventually receives the expected pixels.
Worker messages distinguish entry/return of createImageBitmap from Promise
settlement, and include IDs plus pending-task timer observations. Main-thread
samples separately time canvas copying and pixel reading. A native script-free
host has exhibited a roughly ten-second stall despite a green eventual-pixel
result; a single outstanding task does not eliminate the Firefox issue. These
timings identify API boundaries, not a native stack or the underlying cause.
See [the native-call record](../../refactor/changes/2026-09-15-PKG-JASSUB-09-native-call.md).
These JASSUB rendering/scheduling switches are deliberately rejected by the
standard installed-scope launcher and config. Use the ad hoc browser command
shown in the diagnostic records, with an explicitly selected input, to retain
the distinction between controlled experiments and unchanged installed tests.

`ARTPLAYER_JASSUB_SCREENSHOT=true` adds a separate observation path to the native
JASSUB spec. `jassub-display.js` decodes a clipped composited page PNG using the
pinned root-only pngjs development dependency; it never copies the transferred
canvas. This mode uses green ASS glyphs, distinct 0-30s and 40-110s cue windows,
and seeks to 50s. It checks the initial cue time, visible pixels, changed glyph
signature, playback advance, fullscreen geometry and a hidden/restored negative
control. Normal readback fixtures and timeouts stay unchanged. Reported subtitle
hashes identify the actual selected ASS, not the white baseline. Screenshots are
attached at named phases; errors from individual polling attempts are retained.
The fixture's automatic failure screenshot runs after cleanup and may show an
empty player; use the named pre-cleanup screenshots for visual claims.

Chapter quality combinations attach `chapter-restart-observations`: completed
read calls include host wall time/elapsed time and browser monotonic time/origin.
Public/native chapter events also carry browser timestamps. Preserve those clocks
when diagnosing a timeout: the historical failure includes a single ~10-second
evaluate returning an already-recorded restart, not seven seconds of fast empty
reads. These observations do not expand the timeout or waive the open timing and
physical-device acceptance in PKG-CHAPTER-05.

VTT combination tests verify actual preview screenshot pixels, Chapter coexistence,
native/web fullscreen, source switching and cleanup across five recorded core
inputs. The 5.1.6 server route verifies its frozen npm archive/member fingerprints.
Historical 1.0.1 has a distinct valid 5.1.6 pair and explicit later-core name-conflict
tests; expected historical failures are not compatibility passes. Later 1.0.x
compiled bundles receive their documented compact-arrow fixture, while ordinary
syntax failures remain in the historical parser tests. Mobile cases use an Android
UA and synthetic DOM touches through the real core handlers, not trusted hardware
input. Fullscreen mouse placement first waits for the progress control to be stable;
the earlier hidden-preview screenshot timeout remains in the checkpoint evidence.

`multiple-subtitles-legacy.spec.js` uses real 5.1.2/5.1.7 cores and the candidate
plugin to check three independently timed captions, VTT/SRT, semantic HTML/CSS,
the original update method and native cue identities, scalar event payloads,
repeated updates, selection/reset and empty intervals. It now uses ASS for the third
track on both hosts: task11 repairs the exact5.1.2 main converter defect inside
the plugin. Task10's historical VTT substitution was not ASS acceptance. Use
`ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT` for actual main/legacy package bytes.
The combination suite retains explicit published1.1/1.2 overlap-loss observations
while requiring candidate captions to contain both languages. A passing historical
observation is not a compatibility pass.

`multiple-subtitles-ass.spec.js` checks UTF16 decoding, explicit ASS type selection,
multiline text/HTML, overlapping translation, selection/reset and empty intervals
on5.1.2/5.1.7/5.3.0/5.4.0/candidate. The attachment records the unchanged original
host converter output alongside actual native cues and browser/artifact hashes.
It covers desktop video/track playback, not full ASS layout or physical devices.

The multiple-subtitles combination suite has opt-in source-seek diagnostics:

- `ARTPLAYER_SOURCE_SEEK_TRACE=events` records native and public events, clocks,
  duration, active cues and switch settlement without replacing media properties.
- `ARTPLAYER_SOURCE_SEEK_TRACE=1` additionally forwards native `currentTime` and
  `playbackRate` accessors while recording writes/stacks. The page owns these
  diagnostic listeners and descriptors; do not use this helper in production.
- `ARTPLAYER_SOURCE_RESTORE_EVENT=1` selects a separate control that installs a
  metadata listener before switching and, when restoration is seeking, waits for
  its native seeked event as well as the original switch Promise. This tests caption
  behavior after restoration; it does not repair the old public switch contract.

With no flags, the original Promise plus seeking-property path remains unchanged.
The immediate-call ordering probe also remains intact. Record the chosen flags
alongside artifacts: diagnostic overhead may change an intermittent race, and
passing the event control must not replace the original failure evidence. The
combination attachment includes the selected modes and optional native trace.

`site-console.spec.js` characterizes the site's original console bundle, its
React/ReactDOM/Parcel globals, returned component, object logs, Clear and hover
scroll behavior. Common contracts run against the current and frozen input.
Three explicitly historical cases reproduce pending-scroll, multiple-viewer hook
ownership and native Error-message defects. Passing those cases is not proof of
candidate fixes. SITE-CONSOLE-01 must add candidate remediation assertions and
main-editor integration checks; see `refactor/console-modernization.md`.

## Monaco basic-language regression

`yarn test:browser test/browser/editor-basic-languages.spec.js --workers=1` runs
all 2,511 frozen upstream tokenization cases and 12 explicitly authored gap cases.
The real docs AMD loader must serve all 76 language files. Expected token offsets,
types and multiline state are checked in each engine. Fixtures are regenerated by
`yarn verify:monaco-basic-sources`; see `scripts/site-vendor/monaco/README.md` for
the fixed archive, historical compiler and upstream coverage limitations.

## Optional Firefox native capture on Windows

`node refactor/scripts/hls-native-diagnostic.mjs --procdump <verified-procdump64.exe> -- <hls-sdk-diagnostic options>`
runs the existing diagnostic as its own child and monitors only verified Firefox descendants.
It requires Node from .node-version, PowerShell 7, and the exact signed ProcDump 12.01 binary.
This does not change regular browser tests. Nonzero monitor exits require review even if
playback passes; native attachment can affect timing and permission failures leave gaps.
All dumps stay in ignored local cache. `firefox-minidump.mjs` reads exception/module/thread
metadata but does not resolve a native stack. See
[the native evidence and commands](../../refactor/changes/2026-09-15-PKG-HLS-SDK-01-native-exception.md).

## HLS documentation examples

`document-hls.spec.js` extracts the single Run Code from each bilingual HLS guide
and requires exact parity with `docs/assets/example/hls.control.js`. It loads frozen
Hls.js 1.5.17/1.7.2 and the actual plugin distribution with published/candidate core.
The external example URL is routed to hash-checked local HLS media; playback, source
replacement and one destroy call per SDK are asserted. Windows WebKit exercises only
unsupported setup/notice/cleanup. Worker configuration stays enabled, but this suite
does not observe worker output or establish native-HLS playback. The separate
`document-site.spec.js` checks both guide links and Run Code library/source parameters.

## DASH documentation examples

`document-dash.spec.js` requires both guide snippets to match the actual
`docs/assets/example/dash.control.js`. That shared source runs once per frozen
dash.js 4.5.2/5.2.1, published/candidate core and browser combination. Local MPD
media is hash-checked; initial/replacement playback and one SDK destroy per instance
are asserted with the original SDK initialization settings. WebKit without MSE
checks only unsupported setup/notice/cleanup. `document-site.spec.js` also verifies
the two guide links and Run Code libraries/source; full SDK/device acceptance stays
separate. Unit nullable-language and repeated-cleanup cases run via test:unit.

## Audio Track documentation examples

`document-audio.spec.js` requires both guides' Run Code to match the unchanged
`docs/assets/example/audio.track.js`. It loads the actual local plugin distribution
with published/candidate cores, routes the demo media URLs to native Range-served
H264/AAC fixtures, and checks decoded video pixels plus independent audio time,
pause, offset seek, volume/rate, URL replacement, element identity and terminal
cleanup. Pixel readiness uses the existing polling deadline, not media time alone.
The first immediate-pixel WebKit failure remains in the refactor evidence.
This is native desktop media playback, not physical audibility or full devices.
`document-site.spec.js` also checks generated guide links and Run Code parameters.

## Standalone thumbnail sheets

The standalone tool's `thumbnail-core.spec.js` generates actual PNG sheets from
a selected local MP4 and displays them in core 3.5.31, 5.4.0 and the candidate.
It checks two generations, real hover, unobscured screenshot pixels and exact
Blob URL ownership. Historical grid defects are asserted separately from the
correct candidate layout. Tool main can be selected with
`ARTPLAYER_THUMBNAIL_ARTIFACT`. Windows WebKit's HTTP-success/Blob-error-4 branch
is explicitly a capability control, not successful extraction. Full evidence:
`refactor/baselines/thumbnail-core-validation.json`; run
`yarn test:browser:source thumbnail-core.spec.js --workers=1`.

## Auto-thumbnail delayed registration

Auto-thumbnail's `auto-thumbnail-registration.spec.js` separately checks direct
registrars delivered after real core destruction. It keeps the Promise/name
contract, records zero subscriptions and verifies a late metadata event cannot
allocate a hidden native video. It uses the source/artifact/installed resolver;
this boundary test does not replace successful decoding or first-frame tests.

## VTT Thumbnail documentation examples

yarn test:browser document-vtt.spec.js document-site.spec.js --workers=1 validates both generated guides and their Run Code destinations after yarn build:docs. The guide test requires the original demo verbatim, preserves the original demo video and substitutes local VTT/SVG resources, and inspects actual preview screenshot pixels with pngjs. It covers red/blue crops from real mouse hover, inclusive endpoint selection via public setBar with a MouseEvent, a gap, destroy and a late event on both cores. It loads local dist explicitly and records its hash; this does not replace the verified installed-artifact suite, physical touch tests or full playback acceptance.
