# REL-02 checkpoint: all-library installed types and complete validation inputs

`yarn test:ecosystem-types` completed on Node 24.21.0/Yarn 1.22.22 in 547.47
seconds. Its three preparation commands and 18 consumer commands all exited 0,
covering every one of the 21 libraries exactly once in the declared roster.
VitePress remains a separate site distribution. Each consumer uses actual
tarballs and isolated installation; the package-specific commands retain their
historical diagnostics and candidate negative-type checks.

The [validation record](../baselines/major-installed-types-validation.json)
links all command logs and detailed reports. It rereads each actual archive,
verifies its recorded digest and package manifest, and selects the exact target
major for each library. In particular, Thumbnail's frozen workspace fixture is
not mistaken for its 5.0.0 candidate. Consumer commands produce separate archives;
this is not a single immutable all-package release batch or full browser/device
acceptance. Successful type checks do not close the remaining native failures.

During preparation, a real scope probe showed that the candidate fingerprint
included release-ledger-model.mjs but omitted ads-package-types.mjs and releases.mjs.
Other validation helpers and frozen consumer fixtures had the same omission.
Changing such a checker could leave an earlier candidate/report combination
looking current even though the validation definition had changed.

The fingerprint now includes all tracked/discovered `refactor/scripts/` and
`refactor/fixtures/` inputs. Existing package dependency isolation and text EOL
normalization remain. Ordinary validation output, progress.md and ignored cache
files stay outside the fingerprint to avoid self-dependent reports. Documentation
in release-ledger.md states this boundary explicitly.

Four regressions failed before the fix. Three start with synthetic complete
candidate evidence, modify a validation module/helper or frozen consumer, and
require the old candidate and type report to become stale. The fourth verifies
new helper discovery while excluding generated reports. After the fix all 73
ledger, bundle and downloaded-bundle tests pass, as does targeted lint. These
synthetic ready reports do not authorize any real package publication.

The full installed-type run completed before this fingerprint correction. Its
source and report hashes are retained as observed; none has been silently rebound
to the new fingerprint. The next candidate build must capture the corrected
inputs and produce the package artifacts used for its subsequent checks.

REL-02 remains doing: candidate registration, the remaining actual combinations,
rollback files/rehearsals and other required evidence are incomplete. Formal
review rounds wait for the user's direction. No push, remote CI dispatch,
deployment or npm publication occurred.
