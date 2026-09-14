# CORE-SUBTITLE-OFFSET-01: paused subtitle timing invalidation

Baseline: b5dee252d461f91389c282a47401c5f8fd9a4483. Independent core correction
discovered during PKG-MULTI-SUB-05; that package combination task remains doing.

## Reproduction and implementation

Firefox155 keeps cues in native activeCues after a paused offset changes their
start/end outside currentTime. At paused time1.5, cues moved from1..3 to2..4
still render. The old5.4.0 core and pre-change candidate both fail. A native
HTMLVideoElement/TextTrack probe with no Artplayer instance reproduces the stale
membership. Chromium153 and Windows WebKit26.6 have separate recorded observations.
The first script-created-track probe did not become active on WebKit; the final
probe uses a loaded HTML track matching the real integration, and records this
fixture correction. Its initial overly precise seek assertion was corrected to
require the actual1..2 interval; candidate offset tests separately compare each
synchronous read against the pre-edit time.

`subtitle/timing.ts` owns a small synchronous native invalidation step. After
changing cue bounds, the existing offset mixin passes the native track, optional
media capabilities and captured cue array. If paused and native membership/order
differs from cue intervals at currentTime, remove and re-add the original cue
objects in that order. Disabled tracks, playing media, missing capabilities and
already-correct native state do not enter this path. No polling, timer, observer,
new public option, UA sniffing, media seek or replacement cue is introduced.

The first attempted mode-toggle correction fixed membership but reversed tied
captions on a subsequent negative offset. That failing candidate report is retained;
the final reinsertion implementation preserves order through1,-1,0,-3,0 offsets.
Original cue bounds, identities, track mode and playback time remain. Update,
notice and the public subtitleOffset event keep their existing synchronous order
and values. Native cuechange/enter/exit notification can now reflect the corrected
active membership, which is an intentional consequence of fixing stale activity.
There is no new owned resource or disposal path.

## Verification and scope

Exact hashes, browser versions, logs, native state and artifact maps are recorded in
[subtitle-offset-validation.json](../baselines/subtitle-offset-validation.json).

- Five new controlled regressions join the existing subtitle suite: stale/missing
  members, order drift, cue identity, update/event ordering, correct overlap,
  disabled/playing/capability-limited hosts. The six-file core group passes58 tests.
- Strict core and root consumer TS checks pass. Public generated declarations remain
  unchanged:37 files checked,0 drift. Runtime helper types are internal only.
- Expanded source browser run153:150 passing assertions,3 failures. Two failures
  are old WebKit core5.3.0/5.4.0 source switching and remain task05 risks; the third
  was the diagnostic seek precision assumption explained above. Candidate offset,
  lifecycle and combination checks pass. The run includes explicitly labelled old
  defects and must not be presented as153 successful compatibility acceptances.
- Actual main build:15 passing cases comprise9 native probes,3 published behavior
  observations and3 candidate offset regressions. Actual legacy build:3 candidate
  offset cases pass. Candidate tests also cover disabled tracks and resumed play.
- Three core formats and docs copies are rebuilt. The normal core build clears the
  dist directory, so build:i18n regenerates all11 languages; those bytes remain
  unchanged. Actual import/SSR/i18n distribution checks pass5 tests. CI regression
  passes50 tests. Lint retains only its existing docs declaration warning.

Published Firefox defects remain explicit in the offset and combination suites;
only the candidate's assertion changes from failing to correct. The independent
old-host overlap and WebKit source-switch issues are not waived or resolved here.
No physical-device, full package, remote CI or publication acceptance is claimed.
No dependency, lockfile, public declaration, version or package entrypoint change.

## Maintenance and rollback

Change timestamp invalidation in timing.ts and property bounds/notice behavior in
player/subtitleOffsetMix.ts. Keep the native probe independent of player instances.
Run node --test test/subtitle.test.js, strict core/root tsc, and the subtitle-offset,
subtitle-lifecycle and multiple-subtitles-combinations browser suites. For actual
artifact testing use the existing ARTPLAYER_BROWSER_ARTIFACTS map and include both
core and chapter mappings, as required by the shared fixture server.

Revert the dedicated task commit, including build outputs, to remove this correction.
This is a local commit only, with no push or npm publication authorization.
