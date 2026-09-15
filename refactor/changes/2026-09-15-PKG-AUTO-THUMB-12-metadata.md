# PKG-AUTO-THUMB-12: bound the private decoder metadata wait

Implementation baseline: d3aa4bbfe4d9931249dce5e6a43afbe54b39800f.

## Defect and implementation

The private video could remain attached indefinitely if its request produced
neither loadedmetadata nor error. Frame and JPEG deadlines start later, so they
did not cover this phase. The seven final regression cases fail against the
prechange committed main artifact and pass against the changed implementation.
An earlier test draft omitted the required options object in one case; that draft
is not used as the final seven-case reproduction evidence.

`src/extraction.ts` now owns a 30-second metadata timer from immediately before
URL assignment until loadedmetadata or job disposal. Its callback becomes inert
when the phase ends, including if already queued before cancellation. The job's
existing disposal releases the handlers, resets and removes the decoder. Timer
registration that synchronously destroys the session cannot resume URL loading.
No extra module or dependency is needed: extraction already owns this phase.

This intentionally replaces an unbounded failed-load wait with the same warning
and cleanup policy used for frames and encoding. A slow load may now stop after
30 seconds. The last usable sheet remains available until replacement or destroy.
The public factory, Promise timing/result, options, ten-column sheet layout, frame
time formula, declarations, package entrypoints and dependency versions are
unchanged. Timers remain subject to browser/background scheduling; this is not a
guarantee of immediate network/GPU reclamation or an aggregate extraction timeout.

## Verification

The new unit cases cover no metadata, late metadata/timer callbacks, success,
native errors, destroy/restart, retained previous sheets and synchronous timer
registration reentry. They are part of `test:auto-thumbnail` and `test:unit`.
The existing native lifecycle file adds pending-metadata cases for timeout,
destroy and restart and remains in both source and installed CI collections.

The first browser harness used Playwright interception; Chromium/Firefox passed,
but three WebKit cases timed out waiting for `page.waitForRequest` before testing
cleanup. This is retained as failed harness evidence, not a plugin pass. The final
fixture uses a real server response that sends no metadata and confirms requests
through the server log. Its 10-second socket inactivity bound prevents failed
tests from leaving permanent connections. The test explicitly invokes the captured
30-second callback; it verifies native video cleanup, not 30 seconds of wall time.
Existing successful decoding/encoding tests continue to use real media events.

Commands and exact counts/artifact hashes are in the
[validation record](../baselines/auto-thumbnail-metadata-validation.json).
Source tests pass 189/189; rebuilt main and legacy each pass 82 targeted unit
cases and 36 browser cases across Chromium, Firefox and Windows WebKit. The latter
includes nine pending-metadata cases per artifact. Neither final browser run has
unhandled page errors. Failed-request observations (14 main, 16 legacy) remain in
the record, including deliberately canceled pending loads; these are not reports
of zero network failures. Package strict types, scoped lint and strict toolchain
checks pass. Existing WebKit pixel assertions still exclude the unresolved first
two cells when presentation callbacks are unavailable, as before this fix.
Normal `yarn build artplayer-plugin-auto-thumbnail` regenerates main, legacy and
ESM plus matching docs copies. There are no hand-edited bundles.

## Maintenance and remaining gates

The package README and ARCHITECTURE explain the independent metadata/frame/encode
deadlines and failure policy. The Windows WebKit first-frame pixel issue remains
open: existing pixel tests retain their documented fallback limitations. This
fix does not complete task03, the package combination matrix, remote CI, device
validation, or release reviews. No publishing, pushing or deployment is included.

Revert this task's dedicated commit to restore source/tests/docs and generated
artifacts together. Future changes to metadata loading should rerun the unit
suite and native lifecycle/pixel tests against rebuilt main and legacy outputs.
