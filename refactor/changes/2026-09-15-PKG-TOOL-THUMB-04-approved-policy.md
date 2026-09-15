# PKG-TOOL-THUMB-04 approved Thumbnail policy and migration completion

The user approved published 3.5.31 behavior as the default, with the unpublished
workspace behavior explicitly selected through `compatibility: 'workspace-4.4'`.
This completes the source/type migration task, including its earlier TypeScript,
declaration, installed-entry and emitter checkpoints. It does not complete 05/06,
physical-device evidence, formal reviews or publication readiness.

## Implementation

`src/policy.ts` selects and validates the policy. The public constructor restores
`DEFAULTS.delay: 300` and published key order. Published mode validates/clamps
height and delay to 10-1000, retains configured height and the selected input
value, delays the video event and each frame, and waits twice the delay before
done. Workspace mode keeps aspect-ratio height, synchronous video notification,
no fixed extraction delays and input reset. The class DEFAULTS always represents
the published policy; this boundary was explicitly approved.

Source and extraction continue owning their resources separately. Source changes,
native errors and destroy cancel pending notification, frame and completion
timers. Frame readiness and seek completion are required in addition to the
published delay. Cancellation settles the Promise without late update/done or
new URLs. NaN retains the old asynchronous timer boundary rather than being
mistaken for the workspace no-timer mode. Existing public spellings, descriptors,
custom fields, event payloads, synchronous validation and return values remain.

The authored declarations add optional compatibility/delay and exported
Compatibility/DefaultOptions types. SheetOptions still accepts old literals
without a delay field. Source and public constructors remain mutually assignable.
The generated local Monaco declarations are regenerated; its real worker compiles
the new mode/default types and executes constructor/event/cleanup code.

README, architecture and type ownership guides describe both policies. No new
dependency, lockfile or version change is needed. `test:thumbnail` and `test:unit`
now include the new policy regression suite. Bundles and docs copies were built
through the repository build script; source remains authoritative.

## Verification

Node 24.21.0, Yarn Classic 1.22.22, Windows. Evidence:
[thumbnail-policy-validation.json](../baselines/thumbnail-policy-validation.json).

- The initial new policy tests failed 6/7 against the previous implementation.
  Final `yarn test:thumbnail`: 136 passed, no failure/skip/cancellation, 14.968 s.
  This includes frozen historical tests and current/old TypeScript consumers.
- Strict source tsc and scoped source/type/test/script lint pass. Five public
  compiler/resolution modes reject all 12 invalid calls. Native CommonJS/no-interop
  fixtures and both-direction source/declaration assignment pass.
- Main/legacy/ESM build succeeds. Final external Yarn pack/install evidence is
  `.cache/thumbnail-package-types-IH4Ouy`: offline frozen reinstall, installed-file
  hashes, native require/import and 12 compiler cases pass. Five cases characterize
  the frozen workspace missing-entry defect; seven exercise candidate consumers.
  Installed legacy runtime/policy/lifecycle subset: 63/63, 2.770 s; the final
  legacy bytes are identical to that tested snapshot. The final packed files are
  checked against the working tree in the evidence recorder.
- Three-engine source browser run: 90 passed, 0 failed/skipped/flaky, 66.423 s.
  Installed main browser run: 30 passed, 0 failed/skipped/flaky, 33.414 s.
  Chromium 153.0.8010.12 and Firefox 155.0 verify actual file selection, configured
  versus aspect height, PNG pixels, repeated extraction, URL release, held native
  encoding cancellation and latest-source-only updates. Published video/frame/done
  delays have lower-bound assertions; owned-timer tests verify exact scheduling.
- Windows WebKit 26.6 cannot decode the tested native Blob URLs (error 4), while
  HTTP controls load. There are 23 annotated capability-control source cases and
  10 installed cases. These are not successful extraction or physical Safari
  evidence. Other passing historical tests also include exact old-defect controls.

The first broad runtime attempt exposed fixtures that assumed no fixed delays;
those now explicitly select workspace mode. A waiting worker was stopped and its
unfinished run is not counted as passing. An initial strict error on optional
delay was fixed through numeric normalization after runtime validation.

The first browser run had 89 passes and one Chromium failure: selecting an
identical file while published mode retains input.value did not trigger change,
so starting a second job correctly rejected it. The replacement test now clears
selection before choosing the file again. Both modes retain the original strict
AbortError/latest-source assertions. Final reports and the initial trace are
archived separately; no retry, weaker assertion or production input reset hides
that failure.

## Status and continuation

PKG-TOOL-THUMB-04 is done; THUMB-COMPAT-01 is resolved for the approved default
policy and migration boundary. No complete original npm archive or historical
declaration has been recovered, and 05/06 retain integration/distribution work.
Next implementation work includes the recorded installed Danmuku CPU-gap failure
and remaining package/release preparation. Finish implementation and required
tests, then await user direction for reviews; do not push or publish.

Rollback requires reverting this task's source, declarations, generated outputs,
tests and documentation together. Returning to the prior workspace default would
also reverse the approved compatibility decision and must not be done silently.
