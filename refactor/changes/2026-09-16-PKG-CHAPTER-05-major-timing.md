# PKG-CHAPTER-05 current-major restart timing

The registered core 6.0.0 and Chapter 2.0.0 candidates were checked with the
unchanged installed quality-switch matrix: four old/new combinations across
Chromium, Firefox and Windows WebKit, two workers, no retries. The run passed
11 cases and failed one in 39,777.596 ms. The failed case used candidate core
with published Chapter on WebKit 26.6. Both archives and the exact installed
map are recorded in [the evidence](../baselines/chapter-major-timing-validation.json).

This failure now has a directly correlated event/trace observation. Quality
selection was recorded at page time 2982 ms and the required restart at 3601
ms, a delay of 619 ms. The first poll returned an empty event list at 3567 ms.
The next browser evaluation, trace call `call@241`, took 9989.901 ms and returned
the correct restart list at page time 13643 ms. By then the existing 7000 ms
poll deadline had expired. Later state showed the requested URL, paused video,
position 3.0123779 seconds and no media error.

Thus this particular failure is not evidence that restart itself was emitted
late or missing. It demonstrates that observation through the browser crossed
the deadline while the event was already recorded. The trace does not identify
whether the underlying delay is media, rendering, OS scheduling or automation;
the prior native-video five-second gaps remain relevant but do not prove a
single common cause. No production workaround or altered wait policy is justified
by this result alone.

The full report, screenshot, trace and inline attachments were archived before
another browser run. The committed record keeps relevant per-case states and
the slow trace call; its report hash retains access to the full manifest and
other attachments without duplicating them in every case. Historical published
core WebKit position-reset assertions remain unchanged and are not counted as
new restoration fixes.

No source, test behavior, timeout, dependency or public API changed. The risk
CHAPTER-TIMING-01 stays open and PKG-CHAPTER-05 stays doing. Required real devices
and other combinations remain outstanding. Future diagnosis should target the
observed browser stall rather than adding an artificial restart delay or rerunning
until green. The registered build inputs remain valid because only evidence and
status documentation changed. No formal review or remote operation occurred.
