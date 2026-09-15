# Auto-thumbnail maintenance

This package registers an asynchronous ArtPlayer plugin and generates progressive
JPEG thumbnail sheets using a separate media element. Its public result remains
`{ name: 'artplayerPluginAutoThumbnail' }`; the registration Promise does not wait
for video processing.

## Modules and ownership

- `src/index.ts` owns ArtPlayer subscriptions and the public factory. Options are
  read at each `video:loadedmetadata` event, including subsequent changes to the
  original options object. `restart` cancels the old decoder immediately. `destroy`
  closes the session and removes subscriptions. Partial registration is rolled back.
  Before accessing host subscriptions, a truthy public `isDestroy` makes a delayed
  registrar resolve with its unchanged name result and no resources. The internal
  host flag is optional, preserving structural hosts without that property. Core
  plugin-manager rejection policy is unchanged; this protects direct retained
  registrars such as callbacks delivered after an asynchronous module load.
- `src/options.ts` preserves truthy defaults and computes the ten-column layout.
  Coercible numeric JS inputs and fractional frame counts retain their previous
  behavior; raw option values are forwarded to the thumbnail configuration.
  Invalid/nonfinite dimensions fail before canvas allocation. Canvas dimensions
  are checked against integer/IDL bounds, not a universal memory budget.
- `src/session.ts` owns one active extraction job and the generated object URLs.
  Guards prevent obsolete callbacks from publishing or scheduling another frame.
  Cleanup runs all registered actions even if one fails. Installing a replacement
  before cleaning up its predecessor makes synchronous host reentry observable.
- `src/extraction.ts` owns the private video and canvas, metadata/seek/error
  handlers, and the frame/encode sequence. Each valid draw is encoded before the
  next seek. The final decoder is paused, cleared and reset; the final sheet URL
  remains owned by the session until another usable sheet replaces it or destroy.
  Metadata loading has a separate 30-second deadline, started before assigning
  the URL and canceled when metadata arrives or the job ends. A queued deadline
  becomes inert after that phase; it cannot cancel frame reading or encoding.
  A stalled load reports through the existing warning callback and disposes its
  decoder without replacing the previous usable sheet. Timer-registration reentry
  cannot restart loading after destruction. This does not time out registration,
  change the public result, retry the URL, or impose a total extraction deadline.
  The private canvas is also job-owned: cancellation, failure and normal completion
  reset both dimensions to zero, even if an encoding callback still retains it.
  Width and height resets are independent cleanup actions, so one throwing setter
  cannot prevent the other reset or decoder cleanup. Allocation checks job identity
  after each dimension write; synchronous destruction cannot reallocate the sheet.
  Previously encoded JPEG Blobs/URLs retain their independent bytes. This controls
  canvas dimensions, not the browser's precise GPU/encoder reclamation time.
- `src/encoding.ts` owns one pending JPEG operation, its30-second deadline and
  once-only completion. It clears that deadline before publishing or starting the
  next sample, and ignores callbacks from an earlier operation. One job cleanup
  handles all encodes rather than adding a cleanup closure for every frame.
  Timeout disposes the job and retains the last usable preview; the browser's
  toBlob work itself cannot be canceled. Late Blob delivery cannot publish after
  timeout, replacement or destruction. Synchronous callbacks and timer-registration
  reentry also keep timer ownership intact.
- `src/video.ts` creates and owns the hidden media element. It is attached to the
  document root because detached media loses drawable pixels on Windows WebKit.
  `visibility:hidden` preserves its rendered box; `display:none` and a 1px box do
  not. Metadata locks the box to intrinsic dimensions, overriding ordinary global
  video sizing rules. It is silent, excluded from focus/accessibility, and never
  played by this implementation. Cleanup also removes the element if insertion,
  cancellation, pause or decoder reset fails.
- `src/frames.ts` owns one pending sample, its seek/data handlers, deadline and
  native presentation callback. When request/cancel frame callbacks are both
  available it waits for loaded data, then requires both seek completion and frame
  presentation before drawing. Callback identities are invalidated on retry and
  replacement; late/duplicate delivery cannot complete a newer sample. One job
  cleanup handles every frame without accumulating per-frame cleanup closures.
  It invalidates the pending sample before independently clearing each handler,
  deadline and frame callback. A throwing event-property setter cannot prevent
  the remaining releases. The first cleanup error reaches the existing warning
  path; even a handler that cannot be removed becomes inert after cancellation.
- `src/types.ts` defines internal configuration, sheet data, the minimal host and
  guarded extraction-job callbacks. `guard` retains argument/result types and the
  inactive undefined result. It shares the opt-in `runtime-api.d.ts` option type;
  the entry's Promise result is checked against that public result. No public
  declarations are generated from this file.

The original `types/artplayer-plugin-auto-thumbnail.d.ts` remains byte-equivalent
to npm 1.1.0 after newline normalization. `types/runtime-api.d.ts` owns the precise
option/result/factory contracts; `runtime.d.mts`, `runtime.d.cts`, and `runtime.d.ts`
adapt module resolution without adding a separate runtime implementation.
`src/index.ts` assigns a writable `.default` reference to the same factory,
preserving both 1.0.1 default calls and 1.1.0 direct calls.
`Factory` retains the plain asynchronous callable type; `RuntimeFactory` includes
the recursive alias. TypeScript infers the recursive property from the function
assignment; no type assertion is needed. The implementation fixture checks both
the plain Factory and the full RuntimeFactory against the actual exported value.
The root editor declaration is generated semantically by `yarn build:ts`; its
historical synchronous callable shape is retained, without mixing default and
export-assignment syntax. See README for the optional accurate import.

Only the entry module receives ArtPlayer. Extraction receives a guarded job and a
configuration snapshot. These internal modules do not add public player fields,
plugin methods, or a dependency on a particular core implementation.

## Compatibility and intentional fixes

The factory/global name, Promise registration, result name, default width 160,
count 100, scale 1, ten columns, aspect-ratio height, and time formula
`duration * index / number` are retained. An explicit URL takes precedence over
`art.option.url`; the fallback is read lazily only when no explicit URL is supplied.
Duration and sheet dimensions are captured at metadata time; later duration changes
do not move the remaining samples within the current sheet.
The old `height` option remains ignored at runtime.

A `seeked` callback is ignored while another seek is pending. Before drawing,
extraction checks that the media time is finite and within 50ms of the requested
sample; a mismatch retries that same target at most three times, then fails with
cleanup and retains any previous preview. This prevents observed stale seek
events from advancing the sheet, but does not prove frame presentation accuracy:
the current time can match even when the drawable first frame is stale.
Each pending data/seek/presentation wait has a 30-second deadline. Expiry cancels
its callback and decoder, reports through the existing warning path, and retains
the last usable preview. This is a per-sample readiness deadline, not a complete
network, background-tab or aggregate resource policy. PKG-AUTO-THUMB-10 adds a
separate30-second encoding deadline starting just before toBlob. This is an
intentional bound on formerly unbounded pending encoding; it does not shorten the
frame wait or change the public frame-time formula. Very slow encodes can now
warn and retain the last preview instead of retaining the decoder indefinitely.
Initial metadata/network acquisition has its own 30-second deadline, as described
above, and also ends on media errors or session cancellation. None of these
deadlines guarantees browser-level GPU/encoder reclamation or exact background-tab
wall-clock scheduling.

The previous empty first encode is removed. Encoding is serial, duplicate native
callbacks are consumed once, and source replacement/destruction invalidates old
metadata, seek and Blob callbacks. Failure does not revoke an earlier usable
preview. Only generated URLs are revoked; a foreign public thumbnail URL is not
owned by this package. A failed host setter releases the newly created URL.

Extraction failures are observed with `console.warn('ArtPlayer auto-thumbnail failed:', error)`
after cleanup. The already-resolved registration Promise cannot represent later
media failures. Native callbacks do not escape with an unhandled exception. A
registration failure still rejects its original Promise with the original error.

## Verification and remaining work

Use the root Yarn toolchain:

```sh
yarn test:auto-thumbnail
yarn test:auto-thumbnail-types
yarn test:auto-thumbnail-types-package
yarn exec tsc -p packages/artplayer-plugin-auto-thumbnail/tsconfig.json --noEmit
yarn test:browser test/browser/auto-thumbnail-lifecycle.spec.js
yarn test:browser test/browser/auto-thumbnail-pixels.spec.js
yarn build artplayer-plugin-auto-thumbnail
```

`test/auto-thumbnail-encoding.test.js` controls withheld/late callbacks and timer
delivery; it does not reproduce a spontaneous native encoder hang. The browser
lifecycle case performs actual JPEG encoding, deliberately withholds its callback,
then invokes the captured deadline to check real decoder/canvas cleanup. It does
not claim a measured30-second browser stall. Existing complete/restart/destroy
cases retain actual encoded Blob and image-decode checks.

`ARTPLAYER_AUTO_THUMBNAIL_BASELINE=1` selects the frozen workspace for candidate
regression tests. `ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT` selects an actual bundle.
`test/auto-thumbnail-exports.test.js` checks the factory identity, alias descriptor,
registration and extraction cleanup through the alias for CommonJS and globals.
The isolated package runner also installs actual 1.0.1 exports and confirms the
historical missing 1.0.0 main/legacy files without substituting source-only code.
Historical contract/failure tests remain separate and continue to reproduce old
defects; their passing status does not mean those defects should remain.

The public type entry originated in `PKG-AUTO-THUMB-08`; task09 restored the
historical factory alias. Task04 has verified the complete strict source and
installed public type/module surfaces using those changes and resource fixes
07/10/11/12. Task03 remains unfinished; task05 depends directly on both 03 and 04,
so type completion cannot waive its pixel gate. Native lifecycle validation does
not prove correct pixels. The attached renderer now has native
pixel checks for all five cells when native frame callbacks are available,
including the unique first frame, real black content, changing colors, spatial
detail and presentation timestamps. The callback-less fallback still only has
acceptance for cells 2-4 (zero-based); its cells 0-1 are diagnostic only. Initial
transparent/stale draws and Windows WebKit frame-time offsets remain unresolved
under `AUTO-THUMB-PIXEL-01`. Merely waiting for `seeked`, adding two animation frames,
or seeking away and back did not consistently repair the first frame. Do not
close this risk based on the later-cell assertions or replace it with a nonblack
test; legitimate black frames have opaque pixels. Frame timing, additional
reentry/cleanup boundaries and resource budgets still need the remaining task03 work.

`yarn probe:auto-thumbnail-rendering` captures an isolated diagnostic matrix from
the current built ESM and the frozen timeline media. It compares intrinsic-size
hidden/transparent/clipped/visible elements with current readiness, a readyState
gate, and waiting for the first loadeddata event. The captured Windows WebKit
profiles all miss the unique first frame; the Chromium/Firefox controls retain it.
Seek records distinguish an already-ready element from a delivered loadeddata
event. A zero getVideoPlaybackQuality().totalVideoFrames is also observed in the
correct Firefox control, so it is not a portable frame-readiness gate. The command
reports observations, not a passing acceptance suite, and never edits production
bundles. See refactor's rendering-readiness record before repeating these options.

`yarn probe:auto-thumbnail-rendering --first-seek` separately compares initial
loadeddata drawing without a seek, one/two animation-frame waits, delayed post-seek
drawing and a completed forward/back seek. Native setter instrumentation records
actual seek targets; the warm variant must reach one second before seeking zero.
These variants still fail the unique-first-frame check on the recorded Windows
WebKit host. They are diagnostic page-owned callbacks, not production fixes or
cancellation code. See refactor's first-seek checkpoint before repeating them.

`yarn probe:auto-thumbnail-native` removes ArtPlayer and this plugin entirely.
It serves the frozen timeline with the owned dev server, plus a diagnostic H.264
transcode with B frames disabled, and samples native video/canvas in hidden paused,
visible paused and hidden play-then-immediately-pause modes. It verifies both
files' first purple pixel with FFmpeg before browser capture. FFmpeg/FFprobe must
be installed (optional FFMPEG/FFPROBE executable paths); exact version, arguments,
media hashes, browser versions, events and all31 samples are recorded in an ignored
cache directory. It does not replace the acceptance fixture or add an npm dependency.

The Windows18-case capture still misses the first purple frame in all6 WebKit
cases without any plugin code; Chromium/Firefox controls recover it. The visible
original video can remain at currentTime0 while canvas exposes the later red
frame. This narrows investigation to the native surface on that tested host, but
does not certify all Safari versions or excuse plugin pixel gates. Exploratory
rate0/slow-rate, fastSeek, tiny first-seek offsets and pre-load/metadata layout or
paint waits did not fix it either. The next useful pixel evidence is the same
native/candidate case on another supported backend/device or a decoded-frame
path with explicit timestamps, not another arbitrary wait. See the native-decoder
checkpoint in refactor; AUTO-THUMB-PIXEL-01 and task03 remain open.

The frozen eight-second timeline has one unique purple first frame followed by
red, black, blue and yellow sections. Its command and fingerprint are in
`refactor/baselines/auto-thumbnail-timeline-media.json`. Reproduce into a new
directory with `ARTPLAYER_FFMPEG` and `node scripts/generate-auto-thumbnail-fixture.mjs
<new-directory>`; never silently replace the committed fixture.

The current implementation has eight strict TypeScript modules, including the
frame reader and encoder split after task03's initial checkpoint. Numeric
annotations describe the nominal options; no runtime casts or
normalization were added, so historical coercible JS inputs retain the same
validation/arithmetic and raw values. Missing options retain the existing behavior.
Tasks08/09 supplied the compatible public declarations, implementation assignment
fixtures and historical CommonJS alias. Task04's migration acceptance is recorded
in `refactor/changes/2026-09-15-PKG-AUTO-THUMB-04-migration.md`; unresolved runtime
behavior remains with task03. Task05 requires both and verifies old/final cores and actual
devices; task06 covers installed package entries and the real demo/editor. The
initial migration left the version unchanged; release preparation now sets the
next major in package.json. Use
`refactor/baselines/auto-thumbnail-contract.md` and `auto-thumbnail-failures.md` as
the historical evidence map; do not regenerate those baselines from this source.

The internal type checkpoint and its core-host assignment fixture are recorded in
`refactor/changes/2026-09-13-PKG-AUTO-THUMB-03-internal-types.md`. A core host can
hold partial user thumbnail options; extraction publishes a complete sheet. Do not
require the host's existing getter to have every generated-sheet field.

## Shared installed browser scope

`test/auto-thumbnail-registration.test.js` covers destroyed hosts, unavailable
destroyed-host members and successful extraction with false/absent flags. The
`auto-thumbnail-registration.spec.js` browser regression installs a retained
registrar after actual published/candidate core destruction, records subscriptions,
and sends a late metadata event to prove no native video is allocated. It is in
both the source collection and the installed roster; configuration alone does
not prove a fresh installed run. Main/legacy regression evidence is tracked by
PKG-AUTO-THUMB-13. This fix does not resolve AUTO-THUMB-PIXEL-01.

autoThumbnailCandidate reads verified installed bytes through browser-candidate.js. Native video/JPEG lifecycle and pixel files retain their stub player host and exact presentation-callback/fallback limits. The historical file still loads its frozen old artifacts. Installed mode rejects frozen-workspace and explicit-artifact overrides. These are native extraction checks, not full core integration or first-frame acceptance on every engine.

Use `yarn test:package --browser` and the shared scope rules in
../../scripts/browser-validation/README.md. Missing, stale or changed installation
inputs fail without source fallback. Attachments distinguish selected installed,
source and published inputs. Source mode retains existing explicit artifact use.
The generic Node/type consumer remains core/chapter-only. Module forms, physical
devices, editor demos and release readiness retain their separate package gates.
See ../../refactor/changes/2026-09-15-CI-01-adaptive-installed.md for actual results.
