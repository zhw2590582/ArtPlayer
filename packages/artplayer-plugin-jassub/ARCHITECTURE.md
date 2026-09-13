# JASSUB maintenance

`src/index.js` preserves the lazy factory and delegates registration to
`src/registration.js`. The registration module constructs the actual vendor object
with `{ video: art.video, ...option }`, styles only a vendor-created canvas parent,
binds host cleanup and synchronously returns `{ name: 'artplayerPluginJassub', instance }`.
Options remain live until registration; a supplied video wins. This small split keeps
the public factory separate from ownership/error handling, without a general lifecycle
framework or new runtime dependency.

Caller-supplied canvas nodes remain caller-owned. The adapter does not invent a parent
or delete those nodes; vendor-created containers still get z-index 20. Host cleanup
dynamically calls the exposed instance's current destroy method, ignores already
destroyed instances and blocks synchronous reentry. A thrown disposal error is preserved
and the guard resets for a later attempt. Direct repeated vendor destroy is still a
separate PKG-JASSUB-07 problem; the adapter does not replace public instance methods.

If styling or host subscription throws after construction, registration independently
attempts off with the exact callback and instance cleanup, then rethrows the original
error. Secondary rollback errors do not replace it. An invalid/custom host whose off
throws may retain an inert callback; failed vendor cleanup is not magically repaired.
Failures inside the vendor constructor before it returns an instance remain 07 work.

`src/jassub.es.js` owns rendering, media listeners, canvas state, capability checks and worker
messages. Keep this third-party file separate from the adapter's TypeScript migration.
`worker/` contains worker/WASM files; the actual 1.0.0/1.1.0 npm packages do not ship those
files. The local demo explicitly hosts its resources under `docs/assets/jassub/` and selects
fonts in `docs/assets/example/jassub.js`. Do not move or rename those URLs as an internal cleanup.

`types/artplayer-plugin-jassub.d.ts` currently requires three resource URLs and describes
resize/setVideo/destroy as Promise-returning. Actual historical methods are synchronous, and
resize is width/height/top/left/force. Keep the existing declarations until the dedicated public
type compatibility work has assessed extraction, callbacks and replacement consumers.
Both option and instance expose extension indexes; they are existing compatibility boundaries.

The wrapper matches upstream jassub 1.8.8 apart from formatting and the ESLint header;
worker JS and default font match that archive byte-for-byte. Local WASM instead matches
the exact Pages nightly blobs associated with source 6b19a04ddfbad8f9bfd3237395788dd76218841b.
Its build workflow and seven submodule revisions are pinned in the separate
refactor/baselines/jassub-provenance.json supplement. All 11 demo font blobs also match
the historical Pages tree. Do not replace the binaries just to match the npm version.
The build has not been independently reproduced. Complete component/open-font notices
and six unclear font redistribution permissions remain VENDOR-04/05 gates in
PKG-JASSUB-06 / SITE-01. Source identity permits owned adapter work to proceed after 01;
it does not authorize redistribution or prove original acquisition history.

Use the pinned Node/Yarn toolchain:

```sh
yarn test:jassub
node --test test/jassub-registration.test.js
node refactor/scripts/jassub-provenance.test.mjs --network
yarn build artplayer-plugin-jassub
```

The baseline runner verifies both actual published packages and frozen workspace inputs.
Provenance tests are offline by default; explicit --network refreshes pinned source and
asset comparisons and fails on any request error, without substituting cached evidence.
Set ARTPLAYER_JASSUB_CANDIDATE=1 for current source behavior; ARTPLAYER_JASSUB_ARTIFACT can point
at a main/legacy artifact. Tests use controlled DOM, Worker and SIMD detection, with actual
vendor JavaScript. They do not render ASS or execute worker WASM. Real browser, failures,
repeated destroy and resource cleanup remain later steps. Frozen failure tests now
cover repeated teardown, cross-parent setVideo, custom canvas, Worker construction
failure, stale video frames and incorrect fallback ratechange payloads. They assert
the old failures, not candidate fixes. PKG-JASSUB-03 owns adapter cleanup; 07 owns
separately tracked vendor lifecycle/clock changes and 05 verifies native behavior.

`yarn test:browser test/browser/jassub-native.spec.js --workers=1` loads the actual
published wrapper, Worker, WASM and default font with offscreenRender=false.
Chromium/Firefox render and seek correctly; Windows WebKit's default frame-clock
path remains a recorded failure. The onDemandRender=false diagnostic does not
waive the default behavior gate. Native failure recovery, default offscreen mode,
full devices and sustained resource release remain unverified. See
`../../refactor/baselines/jassub-contract.md` for precise contract and provenance evidence.
