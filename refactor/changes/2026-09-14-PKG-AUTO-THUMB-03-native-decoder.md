# PKG-AUTO-THUMB-03: isolate the native decoder boundary

Checkpoint from 772d79a67196ff61dc1e90499c275fee936cb942. Task03 and
AUTO-THUMB-PIXEL-01 remain open; no source fix, completion or publication is claimed.

## New evidence

The earlier first-seek experiments still imported the plugin. This checkpoint
adds `refactor/scripts/auto-thumbnail-native-probe.mjs` and the root command
`yarn probe:auto-thumbnail-native` to remove that dependency. It imports neither
ArtPlayer nor the thumbnail factory: only a native video, canvas, Playwright and
the already-verified local dev HTTP server. The original frozen MP4 remains
byte-identical. A separately generated H.264 variant with B frames disabled probes
whether frame reordering alone explains the observation; it is never substituted
for the original acceptance sample. FFmpeg decoding must show a purple first
pixel in both files before the browser run begins.

The final18 cases cover2 media files,3 browsers and3 native modes: hidden paused,
visible paused and hidden play-then-immediate-pause. Every case records31 draws,
native events, currentTime, readyState, paused/seeking flags and RGBA. Requested
16ms sample timers run slower in Windows WebKit; elapsed times are retained rather
than pretending the nominal half-second is exact. All6 WebKit26.6 cases miss the
purple first frame. Visible original video eventually yields red while time stays0;
other WebKit cases remain transparent. All12 Chromium153.0.8010.12/Firefox155.0
controls obtain purple. This proves the issue can occur without our plugin on
this Windows host; it does not prove the cause in all WebKit/Safari backends.

The initial12-case run omitted visible-paused; its report is retained separately.
The final capture adds visible control and bounds native play Promise waiting.
Results, media metadata, FFmpeg version/arguments, source and raw-report hashes
are in [auto-thumbnail-native-decoder.json](../baselines/auto-thumbnail-native-decoder.json).

Exploratory current-bundle variants also failed: zero/slow playback rate,
fastSeek(0), zero-rate play; first-seek offsets1us/1ms/16ms; layout before src,
two paints before src, layout after metadata and two paints after metadata.
The zero-rate play variant timed out, so it supplies no completed drawing result.
These cache-only experiments are not production cancellation implementations or
accepted fixes. Raw output and script/report hashes are retained for diagnosis.
One exploratory launch failed before browser execution because a data URL could
not resolve the bare Playwright import; executing a real cache .mjs fixed the
runner. No pixel assertion was relaxed to hide these outcomes.

## Source interpretation and next action

Current upstream [Windows Media Foundation implementation](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/graphics/win/MediaPlayerPrivateMediaFoundation.cpp)
starts a native session for seeking and resolves seek completion from the session
started handler, separately from frame painting. That source makes a timing/surface
boundary plausible; it is not the pinned binary's exact source revision and is
not proof of the underlying defect. Runtime captures above are the actual evidence.

Do not add an arbitrary wait, first-time offset or sample replacement to pass this
host's gate. The next useful pixel investigation requires another supported native
backend/device or an explicit decoded-frame path. No change to task03 acceptance,
the first-frame pixel check, public time formula or declared browser support is
authorized by this checkpoint. Other resource/typing/combination work may proceed
without calling this defect fixed.

## Reproduction, ownership and validation

Run under canonical Node24.21.0/Yarn1.22.22 with installed FFmpeg and FFprobe.
Optional FFMPEG/FFPROBE specify executable paths. No new npm dependency, lock or
package artifact change; the probe is explicit, not added to regular CI because
it needs the external encoder binaries. It owns its random-port server, browser
instances/pages and video/canvas cleanup, and retains only its generated diagnostic
directory. Existing8082 remains untouched. It creates no real workspace package.

The command's successful exit means capture completed, not pixel acceptance.
Targeted script lint and plan/risk checks validate only this changed diagnostic and
metadata. Production tests are not rerun because runtime/type/acceptance-test files
are unchanged. The package maintenance guide explains the new diagnostic boundary.
Commit as a task03 checkpoint; revert that commit to remove this diagnostic and
records together. Local only, no push or publication.
