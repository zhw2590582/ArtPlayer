# PKG-TOOL-THUMB-02 extraction and lifecycle baseline

Started from 0338e0b8b1d9814ebe1628c7b55d08003ffa6347. No production runtime or
distribution changes. This task reproduces behavior before the resource/module
work in 03 and TS migration in 04. The old default-semantics conflict remains open.

## Repeatable controlled tests

`yarn test:thumbnail` runs the 26 frozen contract assertions and 36 extraction
assertions against recovered CDN 3.5.31 and frozen workspace main/legacy.
The new behavior file also runs in the normal unit/CI command.

Controlled timers and deferred Blob callbacks allow assertions without arbitrary
waiting: serial frames, interval clamps/density guards, progress/done ordering,
repeat generation, duplicate start/download, pending callback gating, null Blob,
late callback after destroy, replacement URLs, missing metadata, changed input,
seek setter failure, throwing done/update listeners. These are baseline tests,
not assertions that the defects are fixed. Future candidate regression tests
must assert corrected resource ownership separately while preserving old evidence.

The old and current implementations leak the first source URL on replacement,
retain changed-input listeners and generated wrapper inputs, permit late update
after destroy, and leave several callback-failure promises unsettled. Missing
metadata rejects with an unbound receiver in 3.5.31; workspace keeps polling even
after destruction. Seek-assignment failure rejects correctly in both; a throwing
done listener emits error twice in 3.5.31 and once in workspace. Normal progress
and PNG URL replacement remain ordered. These distinctions guide 03 fixes.

## Actual browser evidence and limitations

Run `yarn test:browser test/browser/thumbnail-tool.spec.js test/browser/thumbnail-native.spec.js`.
The final 39 rows have zero retries/skips: **24 actual tool scenarios** in
Chromium/Firefox, **12 Windows WebKit Blob-unavailable controls**, and **3 native
media comparison tests**. The 12 controls do not establish successful extraction.
Every control proves that the same file loads in native HTTP video but fails in
native Blob video with media error 4, then reproduces the tool's corresponding
failure and cleanup. If native Blob starts working, the full scenario runs.

Actual scenarios use native file selection, metadata/seek, real canvas.toBlob,
PNG decode and non-black opaque pixels. They verify ten updates, two complete
generations and normal final URL cleanup. DOM drop dispatch with a real File
reproduces the missing listener; calling the existing ondrop method does load.
Corrupt media raises a native error without a tool error event; replacement leaks
the first URL and a second destroy throws NotFoundError. A captured **native PNG
callback**, delivered after destroy, still emits update and creates an unreleased
URL. Only callback delivery is controlled; encoding and media are native.

Initial docs sample testing passed 24 Chromium/Firefox cases and failed all 12
WebKit cases. A second 24-second video-only MP4 probe still failed WebKit. The
independent native control then demonstrated HTTP success and Blob failure for
the original pattern, looped pattern and docs sample. An exploratory WebM HTTP
control did not settle within its 1.5-second observation and is not used to claim
codec support. All failed reports and trace directories remain archived. No
production media workaround or claimed physical Safari result was introduced.

`test/browser/media/thumbnail-pattern.mp4` is a 24-second stream-copy loop of the
existing generated 8-second pattern, needed for the tool's minimum ten samples
and maximum one-sample-per-second density. Reproduce with FFmpeg:

```sh
ffmpeg -stream_loop 2 -i test/browser/media/pattern.mp4 -t 24 -an -c:v copy -movflags +faststart test/browser/media/thumbnail-pattern.mp4
```

The local test server exposes this fixture; no dist or compiled docs files were
edited. Hashes, individual outcomes, measurements, browser versions and CI counts
are in `refactor/baselines/thumbnail-behavior-validation.json`. The ordinary
browser job discovers the new spec files automatically. No hosted CI run,
coverage improvement, successful WebKit Blob extraction or npm publication is claimed.

## Handoff and rollback

03 should own source URLs, generated inputs/listeners, metadata waiting and
extraction callbacks; settle pending work on cancellation/error and stop late
effects. Keep historical public methods/events and use a documented compatibility
policy for delay/height defaults. 04 covers emitter provenance and strict TS;
05 keeps actual Safari/WebKit Blob extraction and old/new core sheet integration
open; 06 owns complete installed-package/demo checks. Reverting this task's
dedicated commit removes only tests, fixture/server registration, scripts and
refactor evidence; it does not roll back production code.
