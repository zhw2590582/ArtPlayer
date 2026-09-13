# JASSUB maintenance

`src/index.js` is the ArtPlayer-owned adapter. It forwards `{ video: art.video, ...option }`
to the vendored constructor, sets the canvas parent's z-index to 20, registers a destroy
listener, and synchronously returns `{ name: 'artplayerPluginJassub', instance }`. The instance
is the actual vendor object. Options remain live until registration; a supplied video wins.

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

Provenance is incomplete. The wrapper matches upstream jassub 1.8.8 apart from formatting and
the ESLint header; worker JS and default font match that archive byte-for-byte. Local WASM
files validate but differ from its build. Other font metadata includes different source and
license clues; do not infer redistribution rights from family names or embedding flags.
Task PKG-JASSUB-01 and VENDOR-04/05 remain open. Full original acquisition history is unknown.

Use the pinned Node/Yarn toolchain:

```sh
yarn test:jassub
yarn build artplayer-plugin-jassub
```

The baseline runner verifies both actual published packages and frozen workspace inputs.
Set ARTPLAYER_JASSUB_CANDIDATE=1 for current source behavior; ARTPLAYER_JASSUB_ARTIFACT can point
at a main/legacy artifact. Tests use controlled DOM, Worker and SIMD detection, with actual
vendor JavaScript. They do not render ASS or execute worker WASM. Real browser, failures,
repeated destroy and resource cleanup remain later steps. See
`../../refactor/baselines/jassub-contract.md` for precise contract and provenance evidence.
