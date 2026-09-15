# REL-02 checkpoint: accept actual Yarn candidate archives

The 20-package browser preparation on source commit
`e54fc998ea711f686143be73b82945cf3c719442` passed in 106.36 seconds.
It built in an isolated snapshot, packed and installed the target majors,
verified frozen consumer locks and installed members, and ran the core/Chapter
36 runtime checks, 5 legacy and 8 accurate type modes, plus Audio/HLS fixtures.
Thumbnail 5.0.0 was built separately and passed its 12 historical/candidate
compiler cases. This is not all-plugin runtime or type acceptance.

Using the actual 20-package installed map, the focused desktop Chromium,
Firefox and Windows WebKit run passed 36 tests with zero retries, failures or
skips: 24 Danmuku sampling/eligibility cases and 12 Audio held-switch cases.
The native starvation failures, other combinations and physical device gaps
remain open. Windows WebKit does not establish physical Safari behavior.

Candidate registration then exposed a real checker defect: Yarn writes its
root and nested directory entries as `package` and `package/dist`, without
trailing slashes. `checkedCandidate` incorrectly used the historical archive
inventory helper, which rejected the root as `Invalid archive path: package`.
No candidate was registered and no release gate was bypassed.

The type-aware tar listing logic already used by isolated installation is now
in `scripts/package-archive.mjs`. Both installation and candidate registration
use it; `scripts/package-check.mjs` retains its existing `packedFiles` export.
The helper accepts directory entries with or without trailing slashes and
rejects links, special files, duplicate members, wrong roots and traversal.
Historical archive inventory remains unchanged. No dependency, package API,
runtime implementation or npm entry changed.

A self-contained tar fixture reproduces Yarn's directory layout. It failed
before the fix, and checks both accepted directory forms plus hard links,
symlinks, FIFO entries, a regular-file root, duplicates and invalid paths after
the fix. The combined ledger/bundle/verifier/package tests passed 80/80 in
2774.1443 ms; targeted lint and strict release TypeScript checks passed.
The corrected checker also accepted all 21 actual prepared archives, checking
their recorded SHA-256, SHA-512, manifest names and target versions.

Detailed reports, logs, immutable archive bindings and the preserved browser
report are indexed in [the validation record](../baselines/major-candidate-archive-validation.json).
Before/after library input fingerprints were unchanged during preparation.
The browser server generated a Danmuku development bundle, changing only the
site input inventory. The archive-checker correction subsequently changed
shared validation inputs, so the earlier build/browser results are retained
as observed and are not rebound to the new fingerprint.

REL-02 remains doing. Commit this checker correction before rebuilding and
registering candidates with its exact committed validation inputs. Candidate
registration, complete combinations and candidate-specific rollback remain
unfinished. Reverting this checkpoint restores the incorrect Yarn rejection;
existing historical reports remain available. No formal review, remote write,
deployment or publication was performed.
