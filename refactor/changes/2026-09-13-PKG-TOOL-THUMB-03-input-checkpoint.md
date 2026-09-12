# PKG-TOOL-THUMB-03 input and sheet checkpoint

Started from 1cb7779192cf552c0dfabcbb6de4f26b39e33045. Task 03 remains **doing**:
this checkpoint changes production input ownership and separates sheet/export
logic; extraction jobs and source/Blob cancellation still need implementation.

## Source changes and compatibility

`src/input.js` owns generated inputs, wrapper positioning and registered callbacks
in a private WeakMap. Setup validates before mutating committed options/DOM,
reuses an existing owned wrapper input, installs replacement listeners and then
cleans up the previous target. Caller-provided file inputs are retained. Failed
registration removes partial new listeners; failed construction rolls back owned
input/video resources. The historical instance ondrop method is now actually
registered for drop events. This repairs the undefined static callback defect.

Destroy is idempotent and attempts all input/video/current-URL/event cleanup even
when a cleanup step throws. It preserves the first cleanup failure. Mutating the
public option field does not erase the input ownership record. After destruction,
setup/inputChange/ondrop/loadVideo cannot allocate new input/source resources.
Wrapper position is restored only when it still matches the tool's relative write.

`src/sheet.js` contains midpoint coordinates, footer/canvas creation and download
anchor handling. Historical calculations, attribution, creat* spellings and
filename behavior stay unchanged. Download removes its temporary anchor even if
click fails. The public class delegates existing methods rather than adding new
public entry points. Constructor fields/order, direct class exports, defaults,
event timing and chaining remain covered. Runtime source is still JS pending 04;
emitter provenance and public declarations are not claimed complete.

The package now has an actual ARCHITECTURE.md map, maintenance commands, ownership
rules and explicit continuation boundaries. Normal package builds regenerate
main/legacy/ESM plus docs copies. No hand editing of generated artifacts occurs.

## Evidence

`test/thumbnail-input.test.js` adds 14 candidate regressions. The unchanged tests
on frozen workspace main produce **2 passes/12 failures**. Source and both built
UMD variants pass all 14. These include real defect contrasts and compatibility
checks, not only assertions that new helper functions exist.

Browser candidate coverage is added alongside frozen implementations. A separate
native DOM test selects files through generated inputs, replaces/reuses wrappers,
dispatches events to old detached inputs, verifies listener removal, restores
styles and verifies cleanup when a destroy listener throws. It runs without
requiring Blob media decoding and therefore also executes on Windows WebKit.

Each source/main/legacy run contains 54 rows: 32 actual tool scenarios in
Chromium/Firefox across old and candidate versions, 3 candidate input/DOM scenarios
across all engines, 16 Windows WebKit Blob-unavailable controls and 3 native media
comparison tests. The 16 controls are not successful extraction. Old defect rows
remain unchanged; candidate drop and repeated-destroy expectations reflect fixes.
The candidate late-Blob and replacement-URL scenarios still reproduce outstanding
03 defects, explicitly preventing a claim of complete lifecycle repair.

Final logs, per-case measurements, artifact hashes and CI results are recorded in
`refactor/baselines/thumbnail-input-checkpoint.json`. The current coverage policy
only measures core/chapter; no thumbnail coverage percentage is claimed here.
No hosted CI, physical Safari acceptance, npm publish or version bump occurred.

## Remaining work and rollback

Finish 03 with owned metadata waiting, extraction jobs, native error handling,
source/thumbnail URL lifetime and cancellation/late-callback protection. The
current pending extraction behavior is intentionally not declared fixed. Test
failure-path reentrancy during constructor/setup cleanup as part of that ownership
pass. Preserve the frozen default delay/height conflict until a concrete policy
is documented. Task 04 owns strict TS, emitter attribution and missing types;
05/06 retain full media/core integration, Safari/WebKit and distribution gates.
All thumbnail risks remain open. Revert this checkpoint and run the normal package
build to roll back the input/sheet change. The task completion count does not change.
