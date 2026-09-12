# Thumbnail tool maintenance map

The runtime responsibilities are separated under PKG-TOOL-THUMB-03. Strict TS and
published declaration work belongs to PKG-TOOL-THUMB-04. Runtime restructuring
does not imply complete migration or release readiness.

| File | Responsibility |
| --- | --- |
| src/index.js | Public class, historical method names, construction and destruction entry |
| src/lifecycle.js | Private state, source/input generations, cancellation and resource release |
| src/source.js | File loading, native metadata/error listeners and source/thumbnail Blob URLs |
| src/extraction.js | Owned metadata wait and serial frame job, callback/error completion and cancellation |
| src/input.js | Option validation/clamps, file-input wrapper creation, listener registration/replacement and release |
| src/sheet.js | Midpoint grid, canvas/footer geometry, temporary download anchor |
| src/emitter.js | Existing on/once/emit/off semantics; provenance review remains in 04 |
| src/utils.js | Existing clamp, filename, sleep and serial-promise helpers |

The entry delegates to input/source/extraction/sheet; none imports the entry.
Input/source use lifecycle state, extraction uses lifecycle/source, and sheet uses
only filename calculation. There is no dependency back from helpers to the class.
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
destruction. The emitter is not globally cleared. Destruction closes the instance
before cleanup, cancels its job and releases private URLs even if public URL fields
were overwritten. Current public URLs are also revoked, preserving historical
destroy behavior. The video is paused, its src removed, load resets its decoder
state, and its node is removed. Registration checks for reentrant closure/replacement.

## Extraction and event ordering

Loading emits file before assigning video.src, then video synchronously as in
workspace 4.4.0. A source generation prevents an older file callback or URL creation
hook from overwriting a nested newer load. Successful replacement revokes old
source URLs. Native errors report once for their source; stale listeners cannot
fail the latest job. Existing sheet URLs stay available until the next sheet frame
or destruction, matching the previous public behavior.

start creates one owned job. Metadata waits use native events plus the existing
one-second polling fallback. Waiting before the first file adopts that selection;
replacing an existing source cancels its old job. Duplicate starts are rejected.
Preflight stays synchronous when metadata is ready. Canvas precedes processing=true;
updates observe true, done observes false and may start another job without old
completion clearing the new state.

Frames wait for readiness/seek, accept readiness/Blob callbacks once and restore
oncanplay only while still owning it. Seek/draw/encoding failures, null Blob and
throwing callbacks settle the promise and detach job resources. Source replacement
or destruction rejects with AbortError without an error event. The public promise
still rejects for awaiting consumers; an internal handler owns ignored cancellation.
Late callbacks cannot create URLs, emit updates or schedule frames. There is no
arbitrary new metadata deadline; waiting can be cancelled by destroy/replacement.

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

`test/thumbnail-lifecycle.test.js` covers jobs, source cancellation, native errors,
callback failures, reentrancy and private resources. Browser tests hold real PNG
callbacks and replace a selected file during encoding; only the latest job may
complete. Continue strict TS and installed declarations in 04; preserve old tests
and the default delay/height boundary. The old sleep/serial helpers in utils.js are
no longer used by extraction and can be removed during that migration.
See [task plan](../../refactor/plan.md) and [risk ledger](../../refactor/risks.json).
