# PKG-MULTI-SUB-09: distinguish source seeking from caption loss

Baseline: efed847cdfcbe5110e88b31527c46e622bcc83ee. This task closes the
misattributed switching finding with independent native evidence and corrects
integration sequencing. No production code, public type, dependency, version,
lockfile or built artifact changes. PKG-MULTI-SUB-05 remains doing.

## Root cause evidence

The original WebKit failures retained a valid Translation cue at1..3 seconds,
but the actual media clock was approximately0.002 seconds, with no active cues.
The subtitle was correctly absent at that time; the intended seek to1.5 had not
landed. Those reports predate currentTime instrumentation.

`multiple-subtitles-switch.spec.js` compares no plugin, current plugin, and actual
npm plugin1.2.0 on cores5.3.0/5.4.0/candidate. Each case plays real local media,
enters/exits native fullscreen, then performs three source changes. It captures
native currentTime writes and media events, Promise settlement state, first seek
completion and a second seek only if the first missed after native seeking ended.
The property probe forwards to the original native getter/setter; it does not
intercept or replace source operations. Outcomes and full traces are stored in
[multiple-subtitles-switch-validation.json](../baselines/multiple-subtitles-switch-validation.json).

The first WebKit run confirms5 misses in18 old-core source changes, including
both no-plugin old-core controls. All9 candidate-core changes land correctly.
Old core promises sometimes resolve while video.seeking is still true, allowing
the caller's new seek to overlap native restoration. After the restoration has
ended, a fresh seek reaches the cue interval and both old/new plugins display it.
Candidate source/switch.ts already waits for native seeking to finish and uses
the position restoration logic covered by BASE-LIFE-44/CORE-19. No plugin-level
seek retry, clock rewrite, blanket source reload or global core patch is needed.

The actual-main three-engine trace run has no missed first seeks in81 changes,
but old WebKit hosts still settle during native seeking in6 of18 changes. This
variation is retained; it is an intermittent old-host race, not proof that the
initial misses were fixed by rerunning. All27 candidate-core changes in that run
have seeking=false at settlement and honor the first caller seek.

## Test sequencing and validation

The caption combination test now waits for video.seeking=false after switchUrl
before testing the separate user seek/caption behavior. The immediate old-call
path is retained in the independent ordering test above, including its misses.
This wait is a predicate on real native state, not a fixed delay or a silent
retry of the acceptance assertion. It does not claim old switchUrl promises have
been changed or all historical playback contracts are correct.

One later full run exposed an unrelated fixture sequence: it started exiting
fullscreen when the document property changed but before the public enter event
arrived, resulting in old-core notifications[false,false]. The normal enter/exit
scenario now waits for the entering event before requesting exit; the original
strict final[true,false] assertion remains. The failed trace is retained. No
production fullscreen correction is claimed by this test-sequencing adjustment.

- Initial source WebKit ordering probe:9 cases pass their observation/candidate
  assertions, including the5 old first-seek misses noted above.
- Actual core and plugin main artifacts, three engines:84 cases,83 passing
  assertions,1 fullscreen-sequencing failure. All27 ordering cases pass, and the
  run also includes explicitly labelled historical overlap/offset defects.
- After the entering-event predicate correction, the affected timed-combination
  matrix is rerun unchanged otherwise:9/9 pass across three cores and engines.
  Do not describe this as a fresh84-case all-green run.
- The two changed browser scripts pass lint;50 CI regression tests pass. Final
  plan/risk and risk-validator checks cover the completed task state.

MULTI-SUB-SWITCH-01 is resolved as a classified old-core seeking issue already
handled in the candidate core, with the original calls and failures preserved.
This does not resolve MULTI-SUB-MERGE-01 or complete device/distribution acceptance.
Use the actual loaded core/plugin hashes when comparing future runs; the fixture
supports both source builds and the existing explicit artifact map.

## Maintenance and rollback

Keep source readiness, actual seek landing and caption rendering distinct when
debugging media failures. Run the ordering probe with/without the plugin before
adding plugin retries for an underlying player clock problem. Keep candidate
first-seek assertions strict; old observations must never count as correct calls.
Both suites run under yarn test:browser. A normal core/plugin build was not needed
because production bytes are unchanged; the checked artifacts came from the prior
completed implementation commits. Revert this independent task09 commit to remove
the new probe and integration predicates. Local commit only, no push/publication.
