# REL-02 checkpoint: refresh candidates after shared tooling changes

Rebuilt and packed all 21 libraries from clean commit
96962a69a4faaecd986387efadb54c5623a23f2c after the Markdown chunking fix and its
regression tests invalidated shared input fingerprints. The site candidate is
still separate and absent. Previous archives, build envelopes and reports remain.

The normal package runner prepared 20 libraries in a new build snapshot and
installed their actual tarballs outside the workspace. Thumbnail was separately
rebuilt and checked by its existing installed-package runner. No publication,
remote workflow, dependency or additional source change occurred.

## Evidence

- Strict toolchain check: Node 24.21.0, Yarn Classic 1.22.22, 22 workspaces,
  40 pinned tools and 1472 dependency selectors. No root lockfile change.
- 1918 unique library inputs match before/after reports and current raw bytes;
  1041 copied snapshot inputs also match their normalized source hashes.
- All 299 archive members match the fresh build and isolated installed copies.
  Compared with the previously registered candidates, no shipped member changes.
  Target major versions and CHANGELOG files were checked individually.
- The 20-package run passes 36 runtime observations for core/Chapter, five root
  declaration compiler modes and eight accurate-runtime compiler modes. Installed
  Audio/HLS fixtures pass their five compiler modes with negative-use checks.
  Runtime/type checks for core/Chapter do not stand in for every plugin's behavior.
- Thumbnail passes seven candidate compiler modes and root/legacy CJS/ESM import
  checks. Five frozen-workspace cases retain expected missing-declaration errors;
  that fixture is not the unavailable original npm archive or a rollback pass.
- Both consumer flows complete offline installation followed by a frozen install
  without changing their consumer locks. Package run:123.16s. Thumbnail production
  build:4.22s; installed consumer runner:13.87s.
- The registration check accepts all 21 new build envelopes, with zero stale
  build fingerprints. Other release gates remain blocked. Old browser reports
  were not reattached to the new candidate bindings, even with identical members.

See [preparation](../baselines/shared-tools-candidate-refresh.json) and
[registration check](../baselines/shared-tools-candidate-refresh-check.json).
The proof records each prior and replacement candidate/build reference, exact
file hashes, compiler observations and retained input/install logs. Ignored cache
artifacts must remain available for those references to validate.

REL-02 stays doing; totals224/22/39 remain unchanged. Continue remaining core
documentation/implementation checks and package-specific release blockers.
Formal REVIEW-01/02/03 remains user-directed. Revert this checkpoint to restore
the previous ledger references; their pre-tooling input fingerprints stay stale.
