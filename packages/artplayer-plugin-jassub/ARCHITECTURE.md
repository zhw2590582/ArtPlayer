# JASSUB maintenance

`src/index.ts` preserves the lazy factory and delegates registration to
`src/registration.ts`. The registration module constructs the actual vendor object
with `{ video: art.video, ...option }`, styles only a vendor-created canvas parent,
binds host cleanup and synchronously returns `{ name: 'artplayerPluginJassub', instance }`.
Options remain live until registration; a supplied video wins. This small split keeps
the public factory separate from ownership/error handling, without a general lifecycle
framework or new runtime dependency.

Caller-supplied canvas nodes remain caller-owned. The adapter does not invent a parent
or delete those nodes; vendor-created containers still get z-index 20. Host cleanup
dynamically calls the exposed instance's current destroy method, ignores already
destroyed instances and blocks synchronous reentry. A thrown disposal error is preserved
and the guard resets for a later attempt. The local vendor patch also makes direct
destroy idempotent; the adapter does not replace public instance methods.

If styling or host subscription throws after construction, registration independently
attempts off with the exact callback and instance cleanup, then rethrows the original
error. Secondary rollback errors do not replace it. An invalid/custom host whose off
throws may retain an inert callback; failed vendor cleanup is not magically repaired.
The vendor constructor rolls back its partially created DOM/listeners/Worker and
rethrows the original construction error. Asynchronous Worker errors keep their
existing event channel; callers can explicitly destroy after a loading failure.

The local vendor lifecycle patch gives each video generation ownership of its main
and color-space frame callbacks. setVideo cancels the previous callbacks, unobserves
the old element, clears old demand/dimensions and moves its own container to a new
parent when needed. Already queued callbacks check generation before reading frames
or scheduling another callback. Color probes close VideoFrame even if reading fails.
Destroy invalidates the generation, disconnects the observer, removes the actual owned
container and terminates the Worker once. Caller-owned canvas/video elements remain.
Capability/init messages and pending sendMessage calls cannot post after destruction.

Each query owns a timer and two Worker listeners. Success, timeout and Worker error
settle once after cleanup; callbacks receive the original error (including a plain
native Event for CSP failures). Destroy cleans every request before notifying any
callback with an Error and undefined data. A throwing callback does not prevent other
request cleanup or Worker termination; the first exception is rethrown afterward.
Queries should be issued after ready; this patch does not invent a Worker request-ID
protocol or change the historical matching of simultaneous same-target responses.

`src/jassub.es.js` owns rendering, media listeners, canvas state, capability checks and worker
messages. Keep this third-party file separate from the adapter's TypeScript migration.
PKG-JASSUB-10 adds `refactor/baselines/jassub-render-patch.json` to the patch chain.
An asynchronous main-thread render owns the entire received ImageBitmap batch.
A finally block closes every bitmap even when resizing, clearing or drawing fails;
the original native rendering exception still escapes. Normal drawing releases the
batch before debug reporting. Synchronous ImageData buffers are not ImageBitmaps
and are not closed. This does not alter Worker messages, async/offscreen defaults,
or resolve the separate Firefox offscreen stall. `jassub-offscreen.test.js` covers
failure positions and the synchronous path; `jassub-render-failure.spec.js` uses
an actual Worker/WASM bitmap, native copies and an intentionally closed bitmap
to verify native draw failure, batch release and a subsequent visible subtitle.
`worker/` contains worker/WASM files; the actual 1.0.0/1.1.0 npm packages do not ship those
files. The local demo explicitly hosts its resources under `docs/assets/jassub/` and selects
fonts in `docs/assets/example/jassub.js`. Do not move or rename those URLs as an internal cleanup.

`types/artplayer-plugin-jassub.d.ts` preserves the actual npm 1.0.0/1.1.0 declarations,
including three required resource URLs, Promise-returning resize/setVideo/destroy and
the historical force-first resize signature. Both option and instance retain their existing
extension indexes. Do not correct this root file by narrowing fields or adding overloads:
complete factory assignment and Parameters/ReturnType are compatibility boundaries.

`types/runtime-api.d.ts` separately describes the actual optional options, synchronous
registration and methods, width/height/top/left/force resize, EventTarget events and
Worker query/mutation data. `types/runtime.d.ts`, `.d.cts` and `.d.mts` expose it through
the optional `/runtime` entry; it resolves to the same main/ESM JavaScript as the root.
There is no second implementation and no new factory.default property. Root/legacy
types remain unchanged; exact typesVersions mappings support old Node module resolution.
See [type migration notes](types/README.md) before changing either surface.

`src/jassub.es.d.ts` is a private bridge for the locally patched vendor JS, not a public export.
It adds only the adapter's `_destroyed` read and `_canvasParent.style.zIndex` write to the
accurate instance. The minimal style contract permits the historical numeric 20, which
the native DOM setter converts to a string. The owned TS modules depend on RuntimeOption
and RuntimeResult, while JassubHost needs only video/on/off. The implementation fixture
checks actual Artplayer assignability. No broad any index, allowJs or ts-nocheck hides
owned code; the isolated third-party JS remains an explicit provenance exception.

The original wrapper matched upstream jassub 1.8.8 apart from formatting and the ESLint header;
PKG-JASSUB-07 records its local lifecycle/clock patch separately in
`../../refactor/baselines/jassub-vendor-patch.json` and the accompanying patch file.
Keep original and patched fingerprints distinct; do not call the changed wrapper an
unmodified upstream file. PKG-JASSUB-08 adds a separate follow-up patch in
`../../refactor/baselines/jassub-offscreen-patch.json`: initial offscreen ownership
is transferred synchronously when the Worker reports ready, before resolving the
loaded gate and dispatching the public ready event. Otherwise a queued resize can
ask the Worker to return main-thread images while the instance has no main-thread
context. Duplicate ready delivery must not transfer the same canvas twice. The
explicit main-thread/custom-canvas and unsupported-capability paths keep their
existing selection. Later hybrid detach/reattach remains separate. PKG-JASSUB-09
records `../../refactor/baselines/jassub-hybrid-patch.json`: when a hybrid render
arrives after reattachment to offscreen, release its bitmaps before any drawing,
color-space correction or busy-state mutation. The newly transferred canvas must
remain owned by the current mode. Reattachment is also terminal after destruction,
including public setTrack/setTrackByUrl calls. Valid current hybrid frames still
draw and release their bitmaps normally. A reattachment retires the old busy/demand
state and requests a forced draw from the newly owned offscreen canvas; dropping
the old bitmap alone would otherwise leave the renderer waiting forever for its
discarded completion. Subsequent frame callbacks update the new pending demand.
The
worker JS and default font match that archive byte-for-byte. Local WASM instead matches
the exact Pages nightly blobs associated with source 6b19a04ddfbad8f9bfd3237395788dd76218841b.
Its build workflow and seven submodule revisions are pinned in the separate
refactor/baselines/jassub-provenance.json supplement. All 11 demo font blobs also match
the historical Pages tree. Do not replace the binaries just to match the npm version.
The build has not been independently reproduced. Complete component/open-font notices
and six unclear font redistribution permissions remain VENDOR-04/05 gates in
PKG-JASSUB-06 / SITE-01. Source identity permits owned adapter work to proceed after 01;
it does not authorize redistribution or prove original acquisition history.

SITE-07 now ships complete notice references for Liberation Sans, Averia Sans Libre
Light, Lato Regular and CHAWP at `docs/licenses/jassub-fonts/`. All font bytes and
URLs are unchanged. CHAWP has exact author-byte identity; the other references
retain documented font-table differences. Averia Serif Simple has a different
`g` from the Serif Libre reference and is not treated as the same font. These
partial notice improvements leave VENDOR-05 and the other permission questions
open. See [font maintenance](../../scripts/site-vendor/fonts/README.md) for exact
sources, comparison reproduction and native font HTTP/loading checks; these do
not replace libass shaping/rendering acceptance.

Use the pinned Node/Yarn toolchain:

```sh
yarn test:jassub
yarn test:jassub-types
yarn test:jassub-types-package
yarn typecheck
yarn build:ts artplayer-plugin-jassub
node --test test/jassub-registration.test.js
node refactor/scripts/jassub-provenance.test.mjs --network
yarn build artplayer-plugin-jassub
```

The baseline runner verifies both actual published packages and frozen workspace inputs.
Provenance tests are offline by default; explicit --network refreshes pinned source and
asset comparisons and fails on any request error, without substituting cached evidence.
Set ARTPLAYER_JASSUB_CANDIDATE=1 for current source behavior; ARTPLAYER_JASSUB_ARTIFACT can point
at a main/legacy artifact. Tests use controlled DOM, Worker and SIMD detection, with actual
vendor JavaScript. The runtime query test also executes complete Worker JS and real WASM
through controlled transport; it is not a browser Worker. Frozen failure tests
cover repeated teardown, cross-parent setVideo, custom canvas, Worker construction
failure, stale video frames and incorrect fallback ratechange payloads. They assert
the old failures, not candidate fixes. Candidate lifecycle and polyfill tests separately
verify the local patch. PKG-JASSUB-05 retains complete combination/device acceptance.

`yarn test:browser test/browser/jassub-native.spec.js --workers=1` loads the actual
published wrapper, Worker, WASM and default font with offscreenRender=false.
Without ARTPLAYER_JASSUB_ARTIFACT this remains a historical test: the published wrapper
still fails Windows WebKit when its quality counters stay zero. Set that variable to
the normal candidate build to test the fix. Native RVFC and increasing quality counters
retain their existing behavior. Only the polyfill's observed all-zero counters can use
finite changed media time with readyState >= 2 and no active seek; this approximate path
limits each continuous callback chain to 30 Hz and still reports zero presented frames.
Paused seek completion is supported; a static paused video does not keep firing.
Per-video maps and monotonic handles prevent equal-clock callback collisions.

The candidate's default onDemandRender path is tested through playback/seek/layout in
Chromium/Firefox/WebKit. jassub-lifecycle.spec.js additionally checks actual replacement
video pixels, numerical fallback playbackRate, repeated teardown, invalid-URL constructor
rollback and a genuine asynchronous CSP Worker error reaching a pending query. These
are distinct from full devices and sustained memory/GPU release, which remain
unverified. Set ARTPLAYER_JASSUB_OFFSCREEN=default to omit the option and exercise
the browser's actual default selection. The test copies the displayed canvas bitmap
to a separate readback canvas, so it supports both transferred and main-thread
canvases. PKG-JASSUB-08 records default-mode Chromium/Firefox rendering and WebKit's
capability fallback separately; this does not prove physical Safari/mobile behavior.
`jassub-hybrid.spec.js` changes actual ASS color-space metadata and holds one native
Worker ImageBitmap message across a public track switch. It verifies bitmap closure,
unchanged new canvas ownership and terminal track calls in a real hybrid-capable
path. Reports distinguish this controlled delivery timing from ordinary playback.
If native VideoFrame exposes no usable color-space matrix (observed on Windows
Firefox for this sample), the test verifies ordinary subtitle switching and cleanup
only; no hybrid coverage is claimed. Windows WebKit without canvas transfer is
likewise a capability fallback control. Further codec/device/hybrid combinations
and sustained resource release remain PKG-JASSUB-05.
See
`../../refactor/baselines/jassub-contract.md` for precise contract and provenance evidence.

## Installed browser inputs

`yarn test:package --browser` includes this package and its worker directory. Set
ARTPLAYER_BROWSER_ARTIFACTS to the generated map and run
`yarn test:browser:installed jassub --workers=2`. The installed matrix retains
the published native-render control and adds the installed candidate for all three
core versions. Lifecycle, hybrid and render-failure suites use the verified
installed candidate; without a map they build current source, unless an explicit
artifact is selected. The native-render suite retains its historical default in
source mode. The platform suite has no JASSUB wrapper/WASM and is a control only.
Its optional `ARTPLAYER_JASSUB_CONTROL_SINGLE_FLIGHT=true` bounds the native
Worker queue to one draw while retaining concurrent canvas readback. It measures
the synchronous createImageBitmap call separately from Promise settlement and
rejects readback stalls hidden by eventual pixels. Firefox has stalled with this
bound and on the script-free host; neither a smaller queue nor successful reruns
establishes a vendor fix. The native-call checkpoint in refactor records the
remaining rendering boundary without changing production rendering defaults.

The browser server maps the three worker/WASM URLs to installed package files,
checking archive digests and frozen resource baselines. The font remains a separate
local resource with its own fixed digest; it is not packaged by this plugin.
Worker source inventory joins src/public freshness checks. Actual HTTP response
and byte identities are exposed in the server manifest; a missing/mutated installed
worker cannot fall back to docs assets. These routes preserve the test URLs and
do not change package exports, distributed bytes, resource defaults or licensing.
Published WebKit rendering defects and physical/GPU/notice gates remain distinct
from candidate results; see the CI checkpoint for actual execution.
