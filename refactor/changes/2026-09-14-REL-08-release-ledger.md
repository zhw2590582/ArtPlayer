# REL-08: candidate-bound package release ledger

The previous plan described batch release gates but had no executable per-package
binding between current source, candidate archives and reviewed evidence. Added
release-ledger.json for22 packages, a pure decision model, a filesystem/CLI adapter
and a maintained procedure in release-ledger.md. This completes the ledger task,
not package verification, version preparation, remote workflow activation or release.

## Scope and ownership

The JSON registry owns target versions, explicit historical distribution mappings,
capability requirements, rollback basis and future candidate/evidence bindings. It
does not duplicate task/risk status: the adapter reads tasks.json, risks.json,
third-party.json and the existing dependency/impact model. Open package-specific
risks propagate through dependencies; a generic review owner alone does not widen
a concrete HLS finding to unrelated packages. Truly global risks stay global.

Source fingerprints include own/dependent packages and shared scripts, tests,
toolchain, contracts and frozen release/SDK inputs. Text CRLF is normalized with
explicit algorithm labels and separate raw-byte hashes; binary fonts/WASM/media,
candidate SRI and evidence attachments use exact bytes. A per-report input table
avoids duplicating hashes across22 package rows. Unrelated package source changes
can leave another batch unchanged; shared engineering/test/provenance changes are
conservatively revalidated. Unknown dynamic imports widen the dependency scope.

Actual tarball name/version, source commit existence, SRI and archive members are
checked. Site manifests additionally require an exact build tree inventory and
matching bytes. Evidence envelopes bind package/version/gate, candidate integrity,
input fingerprint, actual environment, command, reviewer, successful check IDs and
hashed underlying reports. Device requirements reject missing device identity,
mock/emulation and skipped results. Remote CI requires a remote run reference;
license coverage includes relevant vendor/SDK and direct runtime dependency IDs.

This is mechanical bookkeeping, not a verifier of the truth of prose. Candidate
build origin, complete scenario coverage, report interpretation and device/vendor
evidence still require the three independent reviews. A source fingerprint must
be captured in the actual build/validation snapshot, not copied onto an old package.
No historical done task or old report is automatically accepted for a new candidate.

## Distribution and compatibility

All22 independent next-major targets are recorded without changing manifests. The
iframe row explicitly maps its frozen artplayer-plugin-iframe predecessor; the
recovered Thumbnail tool remains blocked for missing complete historical archive.
VitePress stays a site/URL/build gate, without inferred new npm publication.
Rollback links the historical basis and requires an actual rehearsal report.

No core/plugin public API, runtime, declaration, dependency or lockfile changed.
Four Yarn scripts expose structural check, immutable report output, strict
preflight and tests. ci:check includes the structural check; test:baseline already
discovers the new test. Strict preflight runs the existing pinned toolchain check.
Normal check exit0 explicitly permits incomplete package evidence; only strict
mode is a release gate. publicationAuthorized stays false even in the synthetic
evidence-complete test. CI-03 already depends on REL-08 and will integrate strict
preflight into the later publication workflow.

## Validation

See [recorded validation](../baselines/release-ledger-validation.json).

- 30 regression cases pass. They reject stale source/test/SDK/lock inputs, wrong
  version/package/gate, old tarball reports, tampered reports/attachments, missing
  license/capability/review evidence, simulated devices and local-as-remote CI.
  Real temporary archives/site files exercise SRI, manifest, complete output
  inventory and byte checks; these are synthetic tooling fixtures, not product
  package/browser/device acceptance.
- Package source isolation, dependency propagation, unknown import fallback,
 22-package coverage and text/binary hashing are tested. Site cannot silently be
  changed to npm scope or lose mandatory review gates.
- CI script suite50 passes; targeted lint passes after ordinary formatting fixes.
  Strict Node24.21.0/Yarn1.22.22 toolchain check passes with unchanged dependencies.
- Current all-package report has22 blocked packages and zero candidate bindings.
  The explicit HLS strict preflight exits1 for the expected missing gates; this is
  correct rejection, not a failed tooling implementation. Generated reports use
  separate cache directories and previous evidence remains intact.

## Rollback and next work

Revert this task commit to remove the new scripts, registry, tests and ci:check
step. No package rebuild is necessary. Continue outstanding runtime/device/source
tasks; REL-01/09 prepare final versions, REL-02 generates real candidates, REL-04
executes rollback and CI-03/04 plus the reviews supply candidate-bound evidence.
Do not fill pass envelopes from plans or rename existing historical report fields
to manufacture a ready state.
