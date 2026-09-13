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

`src/jassub.es.d.ts` is a private bridge for the frozen vendor JS, not a public export.
It adds only the adapter's `_destroyed` read and `_canvasParent.style.zIndex` write to the
accurate instance. The minimal style contract permits the historical numeric 20, which
the native DOM setter converts to a string. The owned TS modules depend on RuntimeOption
and RuntimeResult, while JassubHost needs only video/on/off. The implementation fixture
checks actual Artplayer assignability. No broad any index, allowJs or ts-nocheck hides
owned code; the isolated third-party JS remains an explicit provenance/07 exception.

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
