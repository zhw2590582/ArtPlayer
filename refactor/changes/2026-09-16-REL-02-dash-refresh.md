# REL-02 checkpoint: refresh DASH after maintenance clarification

Starting from clean b029062acef15293b759b8bcc786d37f47fdbfdb, rebuild DASH2.0.0
and replace its candidate/build envelope after SITE-04 clarified synchronous SDK
getters during scheduled refresh in the packaged ARCHITECTURE.md.

- Node24.21.0 and Yarn1.22.22; production build1.62s. The existing isolated
  package type suite completes in8.96s: TS5.9.3 Node10/NodeNext CJS/NodeNext
  ESM/Bundler and TS4.3.5 Node10. All five accept current/legacy declarations
  and reject eight invalid uses each, with strict checks and skipLibCheck:false.
- Real offline install and frozen reinstall preserve the consumer lock. All10
  archive members match fresh package files and the retained installed copy.
  Only package/ARCHITECTURE.md differs from the prior candidate. Main, legacy,
  ESM bundles, public declarations and package metadata remain byte-identical.
- All1469 related raw inputs and the fingerprint are stable before/after
  preparation and at collection. Fresh registration verifies all21 library
  build envelopes; no library fingerprint remains stale. The site candidate
  is absent and release blockers remain.

See [preparation](../baselines/dash-candidate-refresh.json) and
[registration](../baselines/dash-candidate-refresh-check.json) for archive
identities, input hashes, consumer matrix and attachment hashes. Prior tarball,
envelope and browser evidence remain unchanged. Only build evidence is registered;
type consumption is not SDK execution or actual media playback. Future browser
validation must install this archive rather than relabel old evidence.

REL-02 stays doing; totals224 done/22 doing/39 todo. Continue core documentation
semantic mapping and remaining implementation gates. Formal REVIEW-01/02/03 waits
for user direction. No push, remote dispatch, deployment or publication occurred.
Reverting this ledger checkpoint alone restores a candidate stale against the
corrected documentation, not a publishable state.
