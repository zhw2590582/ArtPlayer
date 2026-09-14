# PKG-AUTO-THUMB-03: first-seek diagnostic checkpoint

Baseline: `2f130c58f14b1f3ff847568ae9cf144a75f450fe`. The task and
AUTO-THUMB-PIXEL-01 remain open. This change adds diagnostic evidence, not a
production workaround or package acceptance.

Earlier rendering/readiness experiments could not distinguish the first
`currentTime = 0` seek from initial loadeddata presentation. The new
`yarn probe:auto-thumbnail-rendering --first-seek` mode compares six Windows
WebKit profiles: current code; first draw from loadeddata without a seek;
that same draw after one/two animation frames; two animation frames after seek;
and a completed forward seek to one second followed by a seek to zero.

Each code replacement must match exactly one known boundary. Native currentTime
getter/setter instrumentation delegates to HTMLMediaElement and records every
actual seek, including the warm-up seek and retries. It does not pretend that
all variants seek five times. The sample retains its unique purple first frame,
later red/black/blue/yellow cells and fixed SHA-256. Chromium/Firefox current-code
controls (baseline and forward/back seek) retain native frame callbacks. There is no new production timeout,
playback call, pixel substitution or test skip.

All six WebKit profiles completed five updates, but none obtained the required
purple first frame. Omitting the zero seek therefore does not establish correct
initial pixels. Animation-frame waits and warm forward/back seeking also cannot
be adopted as fixes on this evidence. Both engine controls obtained the purple
frame. This is a host/version-specific observation, not proof of a WebKit-wide
or physical Safari defect.

The first exploratory cached script did not record the warm-up seek at its
actual setter. Setter instrumentation then exposed an invalid warm-up comparison:
a late zero-time event completed the first draw before any backward seek. The
final probe waits for the one-second seek to complete before seeking zero, with
at most three retries of a mismatched warm seek. Without those retries WebKit
never completed the warm seek within the eight-second diagnostic window. The
final observed targets start `[1, 1, 0]` in WebKit and `[1, 0]` in both controls;
the probe checks that only warm retries precede zero. It was rerun;
only its final report is the authoritative first-seek comparison. Code and media
fingerprints, every actual seek and first-cell results are retained in
`../baselines/auto-thumbnail-first-seek.json`; raw event/draw reports remain in
the referenced cache. The ordinary rendering mode is also rerun because its
instrumentation shares this change. A successful process exit means diagnostic
capture completed, not that extraction passed pixel acceptance.

These in-memory variants are page-lifetime experiments; their RAF callbacks do
not constitute production cancellation handling. Package sources, declarations,
dist and default extraction remain unchanged. Existing native pixel assertions
are neither removed nor weakened. Do not reintroduce these failed variants as
untested suggestions. The next investigation needs a different decoded-frame
signal or supported-device evidence; independent plugin/core combination tasks
can proceed while this issue remains open.

Validation is scoped to the changed diagnostic: targeted lint, both actual
browser probe modes, plan/risk consistency and risk-register tests. Full package
and global tests are not rerun because no production or acceptance-test behavior
changes. Revert this checkpoint to remove the extra probe mode and its records.
Local checkpoint commit only; no task completion, push or publication.
