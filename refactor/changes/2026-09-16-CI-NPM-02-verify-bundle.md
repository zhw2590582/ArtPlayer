# CI-NPM-02: verify downloaded candidate contents

The previous bundle preparation step copied exact registered tarballs, but had
no consumer-side validator for a downloaded copy. CI-NPM-02 is an independent
local prerequisite of CI-03, alongside CI-NPM-01. The original workflow and
remote-validation requirements remain; no unfinished dependency was removed.

`scripts/release/verify.ts` now requires independently supplied source commit,
manifest digest, package batch and tag. It validates the manifest digest before
reading its claims, computes the repository release ledger, and rejects blocked
or stale candidate evidence. The downloaded preflight must exactly equal the
fresh report. Downloaded tarballs must equal registered candidate bytes and
match their SHA-512 integrity. Metadata is compared with the shared manifest
description generated from the fresh report, including versions, source/input
fingerprints, registry, tag and toolchain. All files are checked again after a
second ledger read to detect changes during verification.

The file roster must contain exactly the manifest, preflight and selected
tarballs. Nested paths, symlinks/junctions, redirected directories/parents,
non-files, missing files and additional files are rejected. Verification only
reads files and retains failed downloads for diagnosis. The CLI enforces the
canonical Node/Yarn and clean source guard on each ledger read. Its test seam
cannot be supplied through a CLI argument. No dependencies were added.

Preparation and verification share batch validation and manifest construction
in `bundle.ts`. This preserves the existing bundle format, including the
publication-authority limitation, while avoiding two separately maintained
definitions. `yarn release:verify-bundle` exposes the operation; the existing
release test command now includes its tests, and `test:baseline` automatically
includes the new file. The release TypeScript project already covers the new
module. Maintenance instructions are in `scripts/release/README.md`.

The tests use real local tarballs with explicitly synthetic ready reports. They
cover successful read-only validation and rejection of independent-digest
changes, 17 self-consistent manifest modifications, stale/current blockers,
changed preflight, changed registered/downloaded bytes, missing/extra files,
redirected paths, invalid independent inputs and mutation during the second
inspection. The original preparation and cleanup tests remain in the same run.
These tests do not establish that any real ArtPlayer package is publishable.

Actual command results and the current-repository rejection are recorded in
[the validation record](../baselines/npm-bundle-verification.json).
On canonical Node 24.21.0/Yarn 1.22.22 the final release tests passed 36/36
(zero failures/skips, 2,158.2169 ms); strict release TypeScript and targeted lint
passed. A direct call with the default inspector read the actual repository
ledger and correctly rejected blocked preflight. That call used a synthetic
empty manifest/digest and bypassed only the CLI's clean-worktree wrapper to test
the component during implementation; it did not inject a replacement ledger or
accept a real candidate. CLI tests separately verify required arguments, unknown
flags and the Yarn boundary, while the existing tests cover the clean Git guard.

This is local implementation only. CI-03 must still establish trusted remote
repository/workflow/run/attempt/artifact identity and pass independent expected
values into the verifier, check registry occupancy, and implement publication
and partial-failure recovery. CI-04 must exercise the real remote workflow.
Different environments or missing restored evidence may fail exact preflight
comparison; that failure requires diagnosis, never forged reports or replacement
builds. A verification result is not authorization or a durable guarantee for
files changed afterward. No push, deployment, npm publication or formal review
round was performed.
