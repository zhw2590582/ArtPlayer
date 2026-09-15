# REL-02 checkpoint: register the 21 library build candidates

All 21 libraries now have actual target-major tarballs and build evidence in
`refactor/release-ledger.json`. They were prepared from committed source
`1b8188834768605f312a5ed14dab52d75b9c880c`, after the validation-input and Yarn
directory fixes. VitePress still has no site candidate. This checkpoint does
not complete REL-02 or authorize publication.

The 20-package `yarn test:package --browser` preparation passed in 103.26
seconds. It built in a separate snapshot and verified archive contents,
isolated installation and a frozen consumer lock. Its actual fixture scope
was core/Chapter (36 runtime checks, 5 legacy and 8 accurate type modes) plus
Audio/HLS installed type fixtures. Thumbnail 5.0.0 was built separately and
its historical/candidate 12-case installed type command passed in 12.32
seconds. The historical Thumbnail workspace fixture is not a recovered npm
archive and does not close the missing rollback distribution.

The candidate provenance collection checked 1,918 library input files against
the before/after reports and current raw bytes, 1,041 retained build snapshot
files against the normalized input hashes, and all 299 tarball members against
their recorded hashes and build files. The 20-package installed copies were
also compared with their archive members. No library fingerprint changed
during these builds. Each candidate records its exact path, version, SHA-512,
source commit and input fingerprint; the build envelopes retain the actual
reports, logs, frozen locks and archive hashes.

The actual installed browser map then passed 36 focused tests in 51,651.034 ms
with zero failures, skips or retries: 24 Danmuku native sampling/eligibility
cases and 12 Audio held-switch cases. Observed desktop engines on Windows were
Chromium 153.0.8010.12, Firefox 155.0 and WebKit 26.6. Their reports and input
map were archived before another run could overwrite them. This focused run
does not close native starvation, full package combinations or physical Safari
and mobile-device requirements.

See [candidate preparation](../baselines/major-candidate-preparation.json)
for exact inputs, candidates and browser evidence, and the `major-candidate-build/`
directory for each build envelope. A fresh ledger calculation accepted all
21 candidates and build envelopes with no stale fingerprints or candidate
errors. Strict preflight for core still exited 1 with 28 blockers, as expected:
registering build evidence does not bypass the remaining gates.

The local registration check is retained at
`refactor/.cache/release-ledger-eKfUln/report.json`; the strict core rejection is
at `refactor/.cache/release-ledger-EG5WGs/report.json` with its command log in
`refactor/.cache/rel02-registered-preflight.log`. These are observed checks of
this binding state, not promises that future input changes remain accepted.

Only the build gate is registered. Earlier package-specific type/runtime
reports remain scoped observations; they were not copied into gate envelopes
to imply complete validation of these exact tarballs. The remaining runtime,
types, combinations, browser, devices, licenses, rollback, remote CI and three
formal review gates stay explicit. Formal reviews wait for the user's direction.

To continue, use the registered archive paths and the 20-package browser map
in the preparation record. Preserve the ignored cache directories referenced
by the envelopes: losing or changing them invalidates the bindings. Source,
validation input or dependency changes require fresh candidate preparation;
do not patch fingerprints onto old reports. The existing old-version rollback
records remain unchanged. Reverting this checkpoint removes the local candidate
bindings and build envelopes without changing any package implementation.

No production source, public declaration, dependency or npm entry changed in
this registration checkpoint. No push, remote dispatch, deployment or npm
publication occurred. REL-02 remains doing; complete combinations and actual
candidate rollback still require work.
