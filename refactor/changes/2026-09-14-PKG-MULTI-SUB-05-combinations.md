# PKG-MULTI-SUB-05: core combinations checkpoint

Baseline: 675b095b27e50832c4468096502e936422ea689a. Task05 remains doing.
This checkpoint adds executable integration evidence, not a completed package or
release acceptance. Source implementation, public types and generated bundles do
not change. No dependencies, versions, lockfile, push or publication changes.

## Inputs and tests

`multiple-subtitles-cores.json` freezes real npm core5.1.2 metadata, SHA-512 archive
integrity, SHA-256 archive/member inventory and manifest. It corresponds to the
plugin1.0.0 historical gitHead association. Core5.1.7 is already frozen for VAST;
5.3.0 is an adjacent stable comparison only. The actual registry request for5.3.1
returns404, matching the earlier investigation; it is not silently substituted.
Existing published5.4.0 and candidate core source complete the five-core set.
These associations are not a declared minimum support range.

The browser server verifies5.1.2 bytes before serving them. The new combination
suite uses actual1.0.0/1.1.0/1.2.0 main bytes and the candidate source bundle.
It verifies video playback/seeks, native VTT/SRT timing, track selection, offsets,
web/native fullscreen, source change, multiple players and plugin-owned Blob URLs.
The fixture uses native track.cues rather than the later subtitle.cues getter.
Removal assertions use destroy(); destroy(false) intentionally retains HTML.
Both mistakes were exposed and corrected in the initial test run; neither was a
production defect. The original failed reports remain in the evidence manifest.

## Actual findings and limits

- Core5.1.2/5.1.7 only display activeCue, the first native active cue. Plugin1.0.0
  combines languages into one cue and displays both. Plugin1.1.0/1.2.0/candidate
  retain separately timed cues and display only the first language. All three
  engines reproduce this exact distinction. Native tracks contain both languages;
  selecting the second language alone still works. The24 boundary observations
  include18 defect observations, not24 successful compatibility acceptances.
  MULTI-SUB-MERGE-01 remains open for a compatible old-host solution.
- Firefox155 at paused time1.5 still reports cues with start2/end4 as active after
  subtitleOffset=1. HTML retains both captions. This occurs on5.3.0,5.4.0 and the
  candidate, twice. The second run records native cues, active list, time, pause
  state and rendered text. The candidate failure remains a real failing assertion,
  not an expected-failure annotation, skip or timeout increase.
- Windows WebKit26.6 on5.3.0 once lost the selected caption after source change;
  the diagnostic rerun passed. This is an unresolved intermittent observation,
  not proof of a fixed issue or a reproducible production root cause.
- The full three-engine run:57 cases,53 passing assertions,4 failures,0 skips.
  It includes the24 explicitly labelled boundary observations above. The targeted
  diagnostic rerun:9 cases,6 pass,3 Firefox failures,0 skips. Earlier Chromium
  runs had7 failures from fixture assumptions, then2 real overlap failures after
  those assumptions were corrected. Current test adds final-state attachments;
  the full run predates that diagnostic-only hook and formatting cleanup.

Detailed input hashes, browser versions, reports, failure messages and selected
native-state observations are stored in
[multiple-subtitles-combinations-validation.json](../baselines/multiple-subtitles-combinations-validation.json).
Local reports/traces are archived under refactor/.cache; their original attachment
paths can be resolved relative to each named archive. The JSON retains small
observations in Git so findings do not rely solely on those local archives.

## Next actions and maintenance

Fix the paused-offset candidate defect with an independent implementation task,
first reducing it to a native-text-track probe and a controlled regression. Keep
old release defects explicit. Resolve the old-core overlap behavior without
changing legal public calls; investigate the intermittent old-WebKit switch loss.
Then complete remaining ASS/encoding, overlap/offset transitions, lifecycle,
core/device and distribution evidence. Do not mark05 done on this checkpoint.

Run `yarn test:browser test/browser/multiple-subtitles-combinations.spec.js` to
rerun the matrix. Its currently failing offset assertions intentionally prevent a
green compatibility claim until corrected. The test supports the existing
ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT override for actual bundle verification;
this checkpoint used source builds. No package rebuild is required for test/server
changes. Revert this task05 checkpoint to remove the added tests and frozen core
route; do not revert the independent task08 implementation commit with it.
