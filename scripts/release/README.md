# Preparing exact npm candidate files

Run from the repository root with the pinned Node and Yarn:

```sh
yarn release:preflight --packages artplayer,artplayer-plugin-chapter
yarn release:bundle --packages artplayer,artplayer-plugin-chapter --tag next
yarn typecheck:release
yarn test:release-bundle
```

For a downloaded copy of an already prepared bundle, use:

```sh
yarn release:verify-bundle --directory refactor/.cache/downloaded-bundle --packages artplayer,artplayer-plugin-chapter --tag next --source-commit <expected-40-hex-commit> --manifest-sha256 <independent-64-hex-digest>
```

Get the expected commit, batch, tag and manifest digest from the trusted handoff,
not from the downloaded bundle itself. Passing a digest copied from an untrusted
manifest does not establish authenticity. The workflow that establishes this
handoff is still CI-03 work; this command only verifies local contents and gates.

`release:bundle` does not build, pack, install, contact npm or publish. It is a
handoff step for candidates already recorded in `refactor/release-ledger.json`.
Both commands currently refuse release acceptance because the repository still
has unfinished candidate, review, device and other required gates. Synthetic test
reports are not evidence that an ArtPlayer package is ready to publish.

## Responsibilities

- `../package-archive.mjs` checks actual tar entry types and paths for both
  package installation checks and candidate registration. It accepts Yarn's
  directory entries without a trailing slash while rejecting links, special
  files, duplicate members and paths outside `package/`. The legacy
  `package-check.mjs` export forwards to this helper for existing scripts.

- `../prepare-release.mjs` is the Node entry and failure exit-code boundary.
- `prepare.ts` parses the explicit package batch/tag, requires the canonical
  Node/Yarn, and checks clean Git state before both ledger reads. Ignored generated
  files may exist; staged, unstaged and untracked source changes are rejected.
- `bundle.ts` consumes the repository ledger, checks the batch, copies exact
  tarball bytes and writes a hash-bound manifest. Its injected inspector is an
  internal test seam; the CLI never trusts a supplied JSON report as approval.
- `bundle.ts` also owns the shared batch rules and manifest description, so
  preparation and verification agree on the same versioned handoff format.
- `verify.ts` compares every downloaded file with independent expectations and
  two fresh ledger reads. It checks registered candidate bytes and SHA-512,
  strict manifest metadata, preflight contents and the exact file roster, then
  rechecks the downloaded files before returning. It performs no writes.
- `../verify-release.mjs` is the verification CLI. It requires explicit arguments,
  canonical Node/Yarn and clean Git state on both fresh ledger reads. A downloaded
  JSON report cannot be injected as the inspector through the CLI.
- `../../refactor/scripts/release-ledger.mjs` remains the source of candidate,
  input fingerprint, review, risk, source/license, device, rollback and CI checks.
  Do not introduce another manually maintained green-status list here.

The narrow report interfaces describe the fields consumed by preparation. The
original report is preserved in full. The candidate assertion after batch
validation is the only non-null assertion; an absent or invalid candidate must
be rejected before any output directory is created.

## Output and failure behavior

An accepted run creates a fresh `refactor/.cache/npm-bundle-*/` directory with
the existing tarballs, `preflight.json` and `manifest.json`. No existing output is
overwritten. The manifest binds package names, versions, per-package source
commits, source fingerprints, SHA-256, SHA-512 integrity, batch source commit,
toolchain/lock information and the complete preflight report's hash.

The second ledger read must equal the first; candidates and copied files are
checked again. The manifest completion marker is written last. On failure, only
the verified temporary directory is removed. Redirected paths are rejected; if
cleanup also fails, both errors and the retained directory are reported. A
leftover directory without a manifest is not a successful handoff.

Allowed tags are explicitly `next`, `alpha`, `beta`, `rc` and `latest`; there is
no implicit default, and prereleases cannot use `latest`. Registry metadata is
fixed to the public npm registry. Site distributions cannot enter this npm bundle.
These are preparation-tool constraints, not changes to any player package API.

## Trust boundary and remaining workflow work

Every output retains `publicationAuthorized: false`. A manifest and its hashes
provide content binding, not authenticity or publishing permission. CI-03 still
needs trusted workflow/run artifact provenance, registry occupancy checks, exact
tarball publication without lifecycle rebuilding, permission/OIDC configuration,
partial-failure recovery and post-publication readback. Neither this script nor
its tests enables a GitHub workflow, creates a token, or authorizes publication.

The future publisher must validate downloaded contents and fresh release evidence;
it must not trust an artifact solely because it has this manifest shape. Do not
add a rebuild fallback to preparation or publishing when an artifact is missing.

CI-NPM-02 supplies that content-validation step. A successful verification still
returns `workflowProvenanceVerified: false`, `registryOccupancyVerified: false`
and `publicationAuthorized: false`. It neither contacts GitHub/npm nor executes
package lifecycle scripts. CI-03 must separately verify the repository/workflow,
run, attempt, source commit and artifact identity using trusted remote metadata,
and check registry occupancy immediately before an authorized publication.
The verifier does not preserve a publishable approval across later file changes;
the future publisher must revalidate and consume those same bytes at use time.

Restore the registered candidate files and required evidence to their ledger
locations before verification. The downloaded preflight must equal the newly
computed report, including toolchain and file hashes. A different environment,
missing ignored evidence, changed files or new blockers can therefore reject
an otherwise intact historical download. Keep and diagnose that rejection;
do not edit the downloaded report to make it pass or rebuild a replacement.
Extra files, directories, symlinks/junctions and redirected parent paths are
rejected. Failed verification leaves the downloaded evidence intact.

`release-bundle.test.mjs` uses small real tar archives with explicitly synthetic
ledger reports for byte-copy/failure tests, and temporary real Git repositories
for the clean-source guard. It covers stale inputs, changed outputs, missing
gates, site confusion, selection/tag errors, outside paths/junctions, partial
cleanup and original exception retention. These tests run in `test:baseline`;
strict TypeScript checking runs in `ci:check`, and the TS source is in root lint.
`release-verify.test.mjs` additionally tests downloaded copies, self-consistent
manifest/preflight forgeries, stale fresh gates, changed registered/downloaded
tarballs, missing/extra members, redirected paths and mid-verification changes.
Successful synthetic tests are not actual ArtPlayer candidate acceptance.
