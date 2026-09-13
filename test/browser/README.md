# Browser regression entry

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

`danmuku-stability.spec.js` runs three native 14-second media cycles at 2 or 20
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

`jassub-native.spec.js` runs actual published JASSUB 1.1.0, its native Worker,
fixed local WASM/font and authored ASS cues with offscreenRender=false. It checks
real canvas pixels before/after seek, CSS web fullscreen and normal destruction.
Windows WebKit currently fails the default frame-clock path; the explicitly
selected ARTPLAYER_JASSUB_ON_DEMAND=false diagnostic passes on the candidate core.
This is a retained historical failure, not a waived browser gate. The server must
serve WASM as application/wasm for native streaming compilation. Archive failed
and successful runs independently. See the PKG-JASSUB-02 change record.

For candidate registration regressions, set ARTPLAYER_JASSUB_ARTIFACT to a built
main/legacy global file. Those runs also destroy the exposed instance before host
cleanup. ARTPLAYER_JASSUB_CUSTOM_CANVAS=true supplies a caller-owned canvas and
asserts it remains connected after destroy(false). The native report records the
artifact hash and both mode choices. This does not change the default published
baseline or establish ESM/offscreen/device acceptance.

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
