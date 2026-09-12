# Thumbnail tool maintenance map

This package is being migrated under PKG-TOOL-THUMB-03. Input ownership and sheet
export are separated; extraction/source cancellation is still being implemented.
Strict TS and published declaration work belongs to PKG-TOOL-THUMB-04. Do not
infer complete migration or release readiness from this checkpoint.

| File | Responsibility |
| --- | --- |
| src/index.js | Public class, historical method names, file/video events, current extraction loop and destruction entry |
| src/input.js | Option validation/clamps, file-input wrapper creation, listener registration/replacement and release |
| src/sheet.js | Midpoint grid, canvas/footer geometry, temporary download anchor |
| src/emitter.js | Existing on/once/emit/off semantics; provenance review remains in 04 |
| src/utils.js | Existing clamp, filename, sleep and serial-promise helpers |

The entry delegates to input/sheet modules; neither module imports the entry.
Input records live in a private WeakMap, so callers replacing `option` cannot
lose ownership of generated inputs/listeners. Normal construction preserves the
existing instance-field order and bound inputChange/ondrop methods. DEFAULTS,
file/video event order, public method spelling and return values stay unchanged.

Input setup validates options before changing DOM or committed options. A wrapper
receives one owned input; repeated setup with that wrapper reuses it. Replacement
installs the new listeners before releasing the old input. A failed new listener
installation rolls back its partial listeners/DOM. Explicit caller-provided file
inputs are never removed. Generated inputs are removed and the wrapper's previous
position is restored only if its current position still matches the tool's write.
The existing bound ondrop method is now registered correctly.

Destroy is idempotent and attempts input, video, current URL and destroy-event
cleanup even when one step throws; the first cleanup error escapes afterward.
Setup/file-input/drop/load calls cannot recreate input/source resources after
destruction. The emitter is not globally cleared. This does **not yet** cancel
existing extraction timers or late Blob callbacks; pending work and replaced
source URLs remain tracked risks for the rest of 03.

Sheet extraction preserves fractional coordinates, historical `creat*` names,
the 30-pixel footer and the filename algorithm. The temporary download anchor is
removed even if click throws. Default aspect-derived height and synchronous video
events currently match workspace 4.4.0; recovered 3.5.31 differs. See the frozen
[contract](../../refactor/baselines/thumbnail-contract.md) before changing defaults.

## Validation and continuation

Use Yarn and the repository scripts:

```sh
yarn test:thumbnail
yarn build artplayer-tool-thumbnail
yarn test:browser test/browser/thumbnail-tool.spec.js test/browser/thumbnail-native.spec.js test/browser/thumbnail-input.spec.js
```

`test/thumbnail-input.test.js` contains candidate input/export regressions; set
ARTPLAYER_THUMBNAIL_BASELINE=1 to reproduce failures against frozen workspace
main. ARTPLAYER_THUMBNAIL_ARTIFACT selects an actual built artifact for Node and
browser candidate checks. `test/thumbnail.test.js` remains immutable-behavior
evidence against old implementations, including intentionally reproduced bugs.

Browser records distinguish actual extraction from native Blob-unavailable
controls. Windows WebKit can load tested MP4 files over HTTP but returns error 4
for native Blob URLs; this is not successful file extraction. Actual input/DOM
cleanup runs on all three engines, while extraction acceptance needs supported
Safari/WebKit evidence in 05. The independent tool example is
`docs/assets/example/tool.thumbnail.js`, not the external thumbnail plugin example.

Continue 03 by introducing owned metadata/extraction jobs and source/thumbnail
URL cleanup. Add candidate failure/cancellation regressions and preserve old
tests; do not change default delay/height policy silently. Then migrate the final
module boundaries to strict TS in 04 and verify installed declarations/old paths.
See [task plan](../../refactor/plan.md) and [risk ledger](../../refactor/risks.json).
