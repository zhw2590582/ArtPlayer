# REL-02 checkpoint: refresh Thumbnail after default-description correction

SITE-04 corrected a stale default-mode sentence in the tool's shipped
ARCHITECTURE.md. Starting from clean commit
484a8c903c98b1ef7bcb8b345002d920132cb4d8, rebuild Thumbnail5.0.0 through the
normal script and pack/install it through the existing consumer checks. Replace
only this package's ledger candidate and build envelope; retain previous evidence.

## Evidence

- Node24.21.0, Yarn1.22.22. `yarn build artplayer-tool-thumbnail` completed in
  1.58s. Main, legacy and ESM bytes remain identical to the prior candidate.
- `yarn test:thumbnail-types-package` completed in12.54s. All seven candidate
  profiles pass with strict types, actual installed entries and expected negative
  cases: TypeScript5.9.3 Node10/NodeNext CJS/NodeNext ESM/Bundler, TS4.3.5 Node10,
  plus modern/old CommonJS no-interop. Five reconstructed workspace profiles
  reproduce their exact missing-declaration errors; they are negative evidence,
  not working historical TypeScript support.
- Real offline/frozen installs preserve consumer locks and check every member
  against archive content. Native require/import and legacy imports verify direct
  constructors, no self-default alias and SSR-safe module import. No DOM extraction
  or player integration is claimed by those module checks.
- All1472 related raw inputs and the fingerprint remain stable before/after the
  build and at collection. All12 candidate members match fresh package files and
  the independently installed copy. Only package/ARCHITECTURE.md differs from the
  old candidate; runtime bundles, declarations and manifest remain unchanged.
- Fresh registration verification accepts all21 library build envelopes, with
  no stale library candidate fingerprints. All release blockers remain and the
  documentation-site candidate is still absent.

The [preparation record](../baselines/thumbnail-candidate-refresh.json) retains
both candidate identities and all attachment hashes. The
[registration check](../baselines/thumbnail-candidate-refresh-check.json) records
the accepted current ledger. Old tarballs/envelopes/reports are untouched.

Only build evidence is registered. The historical fixture comes from frozen Git,
not a complete recovered npm3.5.31 archive; that rollback gap remains. This
documentation-only change does not rerun pixels or close Windows WebKit Blob,
physical-device, runtime/combinations or review gates. Future browser runs must
prepare the current installed archive rather than relabel old evidence.

REL-02 stays doing; totals224 done/22 doing/39 todo. Continue remaining proxy
guides and core/current-content verification. Formal reviews remain user-directed.
No push, remote dispatch, deployment or publication occurred. Reverting this
ledger checkpoint alone restores an archive stale against the corrected package
documentation; it is not release acceptance.
