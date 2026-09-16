# REL-02 checkpoint: refresh candidates after site and integration work

Rebuilt and packed all 21 libraries from clean commit
`8aa99ef03f2ce6b240da7f4086602a91dd8e721b`. SITE-05 changed shared scripts, tests,
the root lockfile and tooling dependencies; Thumbnail-05 also added browser
inputs and updated the tool's packaged architecture guide. The old candidate
fingerprints were therefore stale. Site deployment remains a separate candidate.

## Execution and evidence

- Node 24.21.0 / Yarn Classic 1.22.22 strict toolchain check passes: 22 workspaces,
  41 pinned tools and 1473 dependency selectors. The root lock did not change.
- `yarn test:package --browser` builds 20 libraries in a new source snapshot,
  packs and installs the actual archives outside the workspace, and passes
  offline/frozen installation without changing the consumer lock. Run directory:
  `refactor/.cache/packages/run-kK0VCe`; command completed in 124.48 seconds.
- Core/Chapter consumers pass 36 runtime observations, five legacy declaration
  modes and eight precise-runtime declaration modes. Audio/HLS installed type
  fixtures pass five modes each, including rejected invalid uses. These checks
  do not stand in for every plugin's functional/browser acceptance.
- Thumbnail is rebuilt in all three formats (4.42 seconds), then its independent
  package runner passes seven candidate compiler modes and CJS/ESM/legacy import
  checks (11.85 seconds). Its five frozen-workspace cases retain expected missing
  declaration diagnostics. That fixture is not a recovered original npm archive.
  New directory: `refactor/.cache/thumbnail-package-types-9Vhpv4`.
- 1925 unique input files match before/after reports and current raw bytes;
  1043 copied snapshot files match normalized hashes. All 299 archive members
  match the new build and isolated installed copies. Target major versions and
  CHANGELOG presence are verified individually.
- Exactly one shipped member changes relative to the previous candidates:
  `artplayer-tool-thumbnail/package/ARCHITECTURE.md`, documenting the new core
  combinations and URL ownership. All runtime bundles and declaration members
  remain byte-identical. No dependency, manifest or production source is modified
  in this checkpoint.
- The final registration check accepts 21 build envelopes with zero stale build
  fingerprints. Each envelope binds the actual archive integrity, source commit,
  input fingerprint, retained build/install logs and preparation proof.

See [preparation](../baselines/site-inputs-candidate-refresh.json) and
[registration check](../baselines/site-inputs-candidate-refresh-check.json).
Old candidates, build envelopes and reports remain available; no older browser,
device, SDK, rollback or review result is relabeled as a new candidate test.
The ignored cache files referenced by these records must be retained.

## Boundaries and continuation

REL-02 remains doing. Counts remain 225 done /23 doing /37 todo. Only local
candidate preparation and existing isolated consumer checks were repeated.
Physical devices, unresolved native-media cases, missing historical distribution,
full per-candidate rollback and remote Actions remain their own gates. The site
candidate is still absent. This does not authorize or perform publication.

The user will direct REVIEW-01/02/03; none started. No push, deployment or remote
workflow was performed. Revert this checkpoint to restore the previous ledger
references; those references will still have pre-site-change fingerprints.
