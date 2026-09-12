# Thumbnail tool maintenance map

The runtime responsibilities were separated under PKG-TOOL-THUMB-03 and are now
strict TypeScript under PKG-TOOL-THUMB-04. Public declarations and isolated installed
entrypoints now have checks; the historical default-policy decision and final
integration/release gates remain open.

| File | Responsibility |
| --- | --- |
| src/index.ts | Public class, historical method names, construction and destruction entry |
| src/lifecycle.ts | Private state, source/input generations, cancellation and resource release |
| src/source.ts | File loading, native metadata/error listeners and source/thumbnail Blob URLs |
| src/extraction.ts | Owned metadata wait and serial frame job, callback/error completion and cancellation |
| src/input.ts | Option validation/clamps, file-input wrapper creation, listener registration/replacement and release |
| src/sheet.ts | Midpoint grid, canvas/footer geometry, temporary download anchor |
| src/emitter.ts | Typed local adaptation of tiny-emitter; preserves on/once/emit/off behavior |
| src/utils.ts | Pure clamp and filename helpers; unused sleep/serial helpers removed |
| src/types.ts | Internal option, frame, event tuple, job and lifecycle contracts; no runtime output |
| types/artplayer-tool-thumbnail.d.ts | Public class/namespace; d.cts/d.mts wrappers share its identity |

The entry delegates to input/source/extraction/sheet. Helpers import its type only;
the imports are erased and do not create a runtime dependency on the entry.
Input/source use lifecycle state, extraction uses lifecycle/source, and sheet uses
only filename calculation. types.ts contains no imports or executable state.
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
yarn typecheck
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
complete. Continue published declarations and installed consumers in 04; preserve
old tests and the default delay/height boundary. The [public type guide](types/README.md)
documents declaration ownership, module entries, events and installed consumers.
See [task plan](../../refactor/plan.md) and [risk ledger](../../refactor/risks.json).

## Type and provenance boundaries

All eight executable source modules and the shared type module are checked with
strict, noUncheckedIndexedAccess, noImplicitOverride, skipLibCheck=false and no
ambient Node/test globals. Public fields use declare so TypeScript does not add
early undefined properties or change constructor property order. File/URL/density
fields retain their absence until the corresponding operation publishes them.
Unknown option fields remain unknown. Custom string/number/symbol events infer
caller-defined callback tuples; built-in events have precise tuples. Their
heterogeneous registry erases tuple types at storage and applies a local assertion
when dispatching. Public and source constructors are checked in both directions.
Error payloads remain unknown because callbacks can throw arbitrary message
values. This does not change runtime error delivery.

Assertions are limited to existing runtime boundaries: a temporary empty option
object before setup validation; the input/wrapper conversion; event target and
dataTransfer/files supplied by native input/drop events; private records inserted
before lookup; nonempty/dense frame arrays; a successful 2D canvas context; and
the old property read of message on arbitrary thrown values. These assertions
preserve existing runtime validation/errors rather than adding new coercions.
The constructor and destroy rollback paths also intentionally tolerate fields
that have not yet been assigned. DOM listener casts connect known event names to
the matching bound callbacks. Keep new assertions equally local and documented.

The emitter structurally corresponds to tiny-emitter 2.1.0, which the recovered
3.5.31 manifest declared as ^2.1.0. The exact original copied revision is unknown.
The pinned [reference files](../../refactor/baselines/thumbnail-vendor/sources.json)
and [MIT notice](THIRD_PARTY_NOTICES) retain upstream attribution. The repository
build includes the complete notice in main, legacy and ESM bundle headers.
Current packed contents include the complete notice and no implementation source;
new release candidates must repeat the installed check. Do not replace this local
emitter with the core emitter as part of a type-only change: dispatch semantics
and historical prototype-key handling need their own behavior review.

`test/thumbnail-runtime.test.js` compares upstream, recovered/historical bundles
and the selected candidate for dispatch behavior, and checks candidate public
descriptors and validation. `test/thumbnail-vendor.test.js` verifies fixed source
bytes, complete notices and dist/docs equality. `test/types/thumbnail-runtime.ts`
checks source consumers with positive cases and six rejected invalid uses.
