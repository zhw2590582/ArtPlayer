# PKG-AUTO-THUMB-11: independent frame cleanup

Baseline: a8d19ce5ef8af8fe4c48424753742e8d78a77962. This task fixes one
resource boundary under the unfinished task03 implementation; task04 depends on
both. It does not close AUTO-THUMB-LIFE-01 or AUTO-THUMB-PIXEL-01.

## Defect and implementation

The frame reader invalidated its pending token, then cleared onloadeddata and
onseeked before entering cleanupAll. A throwing property setter skipped deadline
and native frame cancellation; outer job cleanup still removed the decoder and
canvas, leaving those handles registered. Controlled setters reproduce this in
both destroy and restart, while awaiting loaded data and when completing a frame.
These are deliberately injected exceptions, not evidence of spontaneous native
IDL setter failure in an ordinary browser.

frames.ts now submits both handler clears and both handle releases to the same
cleanupAll operation. It still invalidates identity first, preserves handle zero,
and propagates the first error through the existing job warning path. A handler
that cannot be removed remains inert after disposal. A failure while finishing
prevents drawing/publication, and replacement work can still produce a preview.
No new abstraction, dependency, lockfile, script or public declaration is needed.

API-04/05/06/09/11 retain event names, registration Promise, result, factory alias,
options, ten-column layout, sample times, progressive URLs and distribution paths.
Only the exceptional cleanup path changes; normal behavior has regression coverage.
The package architecture describes current eight-module ownership and remaining
acceptance work. This also corrects stale prose predating type/alias tasks08/09.

## Validation

See [fingerprints and native results](../baselines/auto-thumbnail-handler-validation.json).

- Final 27-case frame suite against the exact pre-change main: 19 pass, all eight
  new fault regressions fail. Current source, actual main and legacy: 27 pass each.
- Full package suite: 182 pass, including frozen contracts and type regressions.
- Strict package TypeScript passes; targeted read-only lint passes after fixing
  a missing test brace. Pinned Node24.21.0/Yarn1.22.22 toolchain passes; core public
  declarations remain 37 files with zero drift.
- Normal build regenerates main/legacy/ESM and the corresponding docs copies.
- Actual main and legacy each pass 21 native lifecycle cases across Windows
  Chromium, Firefox and WebKit, with zero retries or skips. Native HTTP decoding,
  seeking, JPEG, complete/restart/destroy, held frame/Blob delivery, encoding
  timeout and URL cleanup use a stub ArtPlayer host. The throwing-setter cases
  are controlled Node tests, not native browser fault-injection tests.
- No first-frame pixel rerun, physical-device acceptance, full old/new core
  combinations, remote CI or npm publication is claimed. Existing pixel evidence
  and failure remain unchanged; tasks03/04/05/06 remain unfinished.

## Rollback and next work

Revert this task's dedicated commit and rebuild the package to recover the
previous behavior; the new regression tests document the restored leak. Continue
task03 resource-boundary review and obtain a different native backend/device for
the outstanding first-frame issue rather than relaxing its assertions.
