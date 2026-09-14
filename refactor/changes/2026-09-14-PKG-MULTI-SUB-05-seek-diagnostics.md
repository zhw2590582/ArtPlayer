# PKG-MULTI-SUB-05 checkpoint: source-seek diagnostics (not complete)

Task11 is committed as318de37e8 and its commit audit passed. This checkpoint
continues the reopened old-core source-seek issue without changing production
code, declarations, dependencies or built artifacts.

## Added evidence

The optional diagnostics capture native events, public seek/fullscreen events,
monotonic times, native position/duration/seeking, active cues and switch Promise
settlement. Full mode forwards the original native currentTime/playbackRate
accessors and records writes/stacks; events mode leaves those properties intact.
Both modes are opt-in. Diagnostic side observers handle rejection while the
original returned Promise still rejects for the test consumer.

Initial WebKit serial3 and repeated9 cases pass their caption assertions. The
repeated traces show all six old-core switches resolve while seeking=true;
restoration seeked is delivered30..50ms later. The three candidate switches wait
for restoration. No playback-rate assignment was observed in these source steps.
The successful later user writes occurred after the prior native seeked event.

The actual-main events-only matrix passes105 assertions, including explicitly
labelled historical overlap/offset defect observations. It again shows early
old-core settlement, including WebKit native seeked43/46ms later. This is not
proof the previously missed seeks were repaired: observation may affect timing,
and no failing native write trace was captured in those runs.

The subsequent actual-main matrix with diagnostics disabled has62 passes and one
failure on old5.3.0/WebKit. At failure, media time is0.0015139, the1..3-second cue
is intact, active cues are empty, and the player is still alive. The candidate
and other old-core cases pass in that run. This reproduces the same near-zero
position category previously seen on old5.4.0; it does not implicate ASS conversion
or prove the precise internal native overwrite sequence.

## Separate restoration-event control

`source-restoration.js` installs a native metadata listener before switchUrl.
After the core's metadata handler, it waits for native seeked if seeking is active,
and also waits for the original switch Promise. It cleans both listeners on
completion or failure. There are no fixed delays, seek retries or source rewrites.
It is enabled only with ARTPLAYER_SOURCE_RESTORE_EVENT=1; the default failing
property-based path and existing immediate-call ordering probe remain available.

With diagnostics disabled, the event control passes27 cases: three repetitions
of three core inputs across three desktop engines using actual main artifacts.
This supports independently verifying captions after native restoration. It is
not proof of a production fix, or sufficient evidence to close the original
immediate-seek failure. Do not make the normal path green by relabelling this
control as the original public API behavior.

Reports, input/artifact hashes, selected modes, timings and remaining failures are
in [the checkpoint evidence](../baselines/multiple-subtitles-seek-diagnostics.json).
The browser README documents flags. Explicit test/helper lint, CI50 and plan/risk
checks pass. No source or package build was needed for these test-only additions.

## Remaining work

MULTI-SUB-SWITCH-01 stays open and task05 stays doing. The next diagnostic step is
to capture the failed default path's restoration completion versus subsequent
native seek without assuming that property polling equals event completion.
Keep candidate public switch guarantees separate from immutable old-host defects;
do not patch the shared media clock from the subtitle plugin. Broader historical
profile/device acceptance and task06 distribution gates remain incomplete.
