# PKG-TOOL-THUMB-03 owned extraction and source lifecycle

Started from 426c0c5d4209aa91be7414b810f1e8dca712c297, following the input/sheet
checkpoint. This completes the runtime responsibility split for 03; strict TS,
emitter provenance and public declarations remain in 04. Existing release/core
integration and Windows WebKit/Safari evidence gates remain in 05/06.

## Implementation and observable behavior

The public class delegates to input, sheet, source, extraction and lifecycle
modules. Private WeakMap state owns generations, listeners, jobs and generated
URLs without adding public instance fields. Input setup also guards reentrant
replacement/destruction. Construction failure marks the instance closed and
releases its partial media resources.

Source loading keeps synchronous file-before-src-before-video ordering. New
successful selections revoke superseded source URLs and cancel the old extraction.
Nested file callbacks and URL-creation hooks cannot overwrite newer selections.
Native metadata/error listeners belong to their source generation. Errors now
report through the tool and settle a waiting/running job; stale callbacks do not
affect the latest source.

Each extraction has one promise, owned metadata timer/listeners and per-frame
readiness cleanup. It preserves preflight throws, midpoint/grid/footer geometry,
normal progress/done order, undefined completion and the previous oncanplay owner.
A start before the first selected file retains its wait and adopts that first
selection. A replacement of an existing source cancels old work. Existing sheet
URLs remain available until replaced by a new frame or destruction.

Destruction/replacement rejects cancelled work with AbortError and does not emit
error for intentional cancellation. An internal rejection handler prevents ignored
cancelled jobs from becoming orphan rejections; the returned promise still rejects
for consumers. Native canvas encoding itself has no cancellation operation here:
the job settles immediately and its eventual callback is ignored. No new URL,
update/done event or next frame may be published by that callback.

Null Blob, seek/draw/toBlob failures and throwing update/error/done callbacks settle
the promise after cleanup. Duplicate readiness/Blob callbacks cannot double-publish
a frame. Completion releases ownership before done so a callback can start another
job. Reentrant listener/timer installation or URL creation is checked after host
calls, including handles registered only after destruction returned.

Destroy now pauses the native video, removes its src, calls load to reset media
state and removes the node. Cleanup continues after individual failures. Private
URLs are released even if callers changed public URL properties; historical cleanup
of current public URL values is retained. Closed start returns a rejecting promise;
closed download retains chaining and allocates no anchor.

Default height and video-event timing remain the workspace 4.4.0 behavior. This
does not resolve the pre-existing recovered 3.5.31 default differences documented
in thumbnail-contract.md. No silent default-mode or legacy-CSS decision is made.

## Verification

26 new lifecycle cases plus the previous 14 candidate input cases run on source,
main and legacy. Frozen workspace running the new lifecycle assertions has 2
passes and 24 failures. Normal extraction, cancellation/error paths, native media
errors, late/duplicate callbacks, nested loads/setup, first-selection waiting,
public URL mutation and decoder-reset failure handling are covered.

Each final browser run has 57 rows: 34 real tool scenarios in Chromium/Firefox,
3 candidate input/DOM cases across all engines, 17 Windows WebKit Blob-unavailable
controls and 3 independent native-media comparisons. Candidate cases now require
error notification, replaced-source URL cleanup and rejected/ignored late encoding;
historical cases still assert their old defects. A real file is replaced while a
native PNG callback is held; only the new source produces ten updates and one done.
Successful extraction also verifies retired video readyState=0 and no src attribute.
The 17 unavailable controls are not successful file extraction.

Earlier passing source/main probe reports remain archived; final media-reset
source/main/legacy results and hashes are in thumbnail-lifecycle-validation.json.
Normal builds regenerate UMD, legacy and ESM plus byte-identical docs copies. The
new lifecycle file is included in test:thumbnail and the normal unit/CI script.
The coverage policy still measures core/chapter only; no tool percentage is claimed.

## Completion and continuation

03 completes the runtime split and the reproduced ownership fixes. The package
ARCHITECTURE.md describes actual dependencies, resources, ordering, tests and
limits. 04 owns strict TS, the now-unused sleep/serial utility cleanup, emitter
attribution, installed public declarations and the explicit historical default
compatibility policy. 05 owns complete old/new-core sheet integration and actual
Safari/WebKit Blob extraction; 06 owns promised ESM/type paths, README demo and
candidate tarball validation. Risks stay open until those gates are met.

Rollback by reverting this dedicated completion commit and rebuilding the package;
the preceding input checkpoint and all frozen historical tests remain available.
No new dependencies, version bump, push, tag, hosted CI run or npm publication.
