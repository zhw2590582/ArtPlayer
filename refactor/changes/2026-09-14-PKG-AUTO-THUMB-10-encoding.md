# PKG-AUTO-THUMB-10: bounded JPEG encoding ownership

Baseline: afb632d16fec59aaa871d7efb116e2817b81032f. Split this resource task from
unfinished task03 so that its delivery does not imply the native first-frame
problem is fixed. Task04 depends on this task as well as task03 and the separate
type/alias tasks.

## Previous behavior and intentional policy change

Frame readiness had a30-second deadline, cleared before canvas encoding began.
If the toBlob callback never arrived, no deadline remained and the current job
kept its decoder/canvas until restart, another metadata load or destruction.
The source boundary is verified; withholding callbacks in the controlled harness
reproduces that ownership state. This is not evidence that a real browser encoder
spontaneously hangs. Six initial tests fail against a bundle frozen before this
change because encoding has no registered timeout.

The new encoding wait has its own30-second deadline, starting immediately before
toBlob and independent of the frame wait. Timeout disposes the job and reports
through the existing warning path, preserving the last usable preview. A very
slow encoding that formerly completed after30 seconds may now be discarded.
This is an explicit bounded-resource policy change for the private async job,
not an unchanged-behavior claim or a new public API. Initial metadata/network
acquisition, total extraction duration and browser background scheduling remain
outside this per-encode limit.

## Implementation and compatibility

`src/encoding.ts` owns a single pending operation token, timer and Blob callback.
Its once-per-job cleanup avoids accumulating one closure per frame. Completion
invalidates the token and clears its timer before publication or the next seek.
Late/duplicate callbacks cannot affect a newer operation. Timer registration that
reenters destruction releases the newly returned handle and never starts encoding.
Synchronous native callback delivery is handled without retaining a timer. Timer
cleanup failure still reaches job-owned video and canvas cleanup.

`extraction.ts` now coordinates frame read, draw, encoding, publish and next sample;
it delegates callback identity and timeout ownership to the encoder. Existing
`session.ts` retains URL replacement/cleanup and error reporting. The browser's
underlying toBlob work is not cancellable: disposal zeros the private canvas and
releases the decoder, while late encoded bytes cannot publish. GPU/encoder memory
reclamation timing is not claimed.

Normal JPEG MIME, serial progressive publication, ten-column layout, options,
sample-time formula, factory/default alias, registration Promise and public type
entrypoints remain unchanged. Null Blob and synchronous encoding errors follow the
existing job failure path. No dependency or lockfile change; the new regression
file joins existing test:auto-thumbnail/test:unit scripts. The actual module map
and maintenance boundaries are updated in the package ARCHITECTURE.md.

## Validation

Full evidence and file fingerprints:
[auto-thumbnail-encoding-validation.json](../baselines/auto-thumbnail-encoding-validation.json).

- Frozen pre-change bundle: initial6 new tests fail on missing encoding deadline.
  The final9-case file is also rerun unchanged against that frozen bundle:8 fail
  and the synchronous-completion control passes; all9 pass on the candidate.
- Current package suite:174 pass, including9 encoding cases, historical
  contracts/failures, lifecycle/frame/canvas/exports and public-type regressions.
- Strict package TypeScript passes. Lint's initial new-test single-line if error
  is fixed; final lint retains only the existing generated docs type warning.
- Real package build regenerates UMD/legacy/ESM and docs copies. New encoding and
  existing export checks also run against the actual produced main artifact:
  11 Node checks and9 three-browser complete/alias/timeout cases pass.
- Windows browser suite:27 pass.21 lifecycle cases cover completion, alias,
  cancellation, frame cancellation and new encoding timeout;6 pixel cases retain
  their existing explicit callback-less first-frame limitation. They do not close
  AUTO-THUMB-PIXEL-01. The new timeout case performs native HTTP decode/seek/JPEG,
  deliberately holds its Blob callback and invokes the captured30-second timer.
  It proves real resource cleanup and ignored late delivery, not a measured native
  timeout. Natural complete cases still decode the resulting JPEG after cleanup.
-50 CI regressions plus final plan/risk validation; remote workflows and physical
  device acceptance are not claimed. Entire unrelated package suites are not
  repeated for this isolated encoder change.

Adding this new task as an unfinished dependency to already-doing task03 initially
failed the plan validator. It is instead attached to future task04, preserving
the plan's startup rule without changing any existing acceptance requirement.

## Delivery and remaining work

Complete and commit only task10 with its code, generated artifacts, tests, docs
and status. Task03 remains doing; native first-frame readiness, aggregate
resource limits and later package combinations/distribution acceptance remain
open. This change completes the bounded encoding responsibility only. Revert this
dedicated commit, including regenerated outputs, to restore the previous unbounded
encoding behavior. Local commit only; no push, version change or publication.
