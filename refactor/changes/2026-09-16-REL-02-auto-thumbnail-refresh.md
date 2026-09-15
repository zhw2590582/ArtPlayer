# REL-02 checkpoint: refresh Auto Thumbnail after shipped documentation correction

SITE-04 corrected a stale version statement in Auto Thumbnail's shipped
ARCHITECTURE.md. The old build evidence correctly became stale. From clean
commit 3317230f2ece7df65e75e02f093da4b72d5f77d3, the package was rebuilt through
the normal build script and packed/installed through its existing consumer
verification. This replaces only its ledger candidate and build evidence.

## Actual checks

- Node 24.21.0 and Yarn 1.22.22. `yarn build artplayer-plugin-auto-thumbnail`
  produced main, legacy and ESM in 1.69 seconds. Generated runtime files did not
  change relative to the committed versions.
- `yarn test:auto-thumbnail-types-package` passed 10 installed compiler profiles
  in 24.96 seconds: npm1.1.0 and candidate2.0.0, TypeScript5.9.3 with Node10,
  NodeNext CJS/ESM and Bundler, plus TypeScript4.3.5 with Node10. Positive types,
  historical extraction, exact invalid-statement lines and runtime entry types
  retain the suite's explicit expectations. Candidate classic/CJS no-interop
  imports also pass.
- Actual isolated installs and forced frozen installs preserve the consumer
  lock. Every installed member is checked against archive bytes by the existing
  script. Root/legacy/runtime module identities, Promise registration and cleanup
  are verified with an installed controlled host; there is no native extraction.
- The historical 1.0.1 export/Promise probe passes. The 1.0.0 missing main/legacy
  files and 1.1.0 classic legacy type errors remain exact negative observations,
  not claims that broken historical entries are runnable.
- All 1469 relevant raw inputs and their fingerprint remain unchanged before
  and after build/verification. Every one of the 12 new archive members matches
  the fresh package files. Only package/ARCHITECTURE.md differs from the prior
  candidate; public declarations and all three runtime bundles are identical.
- The consumer's separately packed core archive has the same complete member
  content as the registered core candidate. It is not claimed to be the same
  tarball byte stream, nor registered as a replacement core candidate.
- Fresh release-ledger verification accepts all 21 candidate build envelopes
  with no stale library fingerprint. All packages still have release blockers,
  and the site candidate remains absent.

The old tarball, build envelope and reports remain untouched. The new envelope
has a separate path, and [the preparation record](../baselines/auto-thumbnail-candidate-refresh.json)
preserves both old and new candidate identities. The
[registration check](../baselines/auto-thumbnail-candidate-refresh-check.json)
records the accepted current ledger and remaining scope.

Only the build gate is registered. These consumer profiles do not replace full
runtime, combinations, rollback, devices or release review. No pixel/browser
rerun was needed for a documentation-only archive change, and the unresolved
Windows WebKit first-frame issue remains open. The earlier shared browser map
still points to its older Auto Thumbnail installation; prepare current installed
artifacts before a future browser run instead of relabelling that old report.

REL-02 remains doing; task totals remain 224 done / 22 doing / 39 todo. Continue
the remaining documentation/implementation and candidate-specific acceptance.
Formal reviews remain user-directed. No push, remote dispatch, deployment or npm
publication was performed. Reverting this ledger checkpoint alone restores the
old candidate binding, which would be stale against the corrected documentation;
do not interpret that rollback as release acceptance.
