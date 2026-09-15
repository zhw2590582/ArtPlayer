# PKG-AUDIO-BUFFER-01: observe source switching while the network is held

The buffering test awaited `switchUrl` before checking starvation and releasing
the withheld response. Switching can await `canplay` and resumed playback, so
this could stop the test from releasing the bytes needed to complete the switch.
Earlier installed WebKit traces stopped at this await. The initial current-source
rerun instead reached the existing native-starvation failure; these observations
are preserved separately.

`beginAudioSwitch` now starts the real switch without returning its Promise to
Playwright. It records pending/fulfilled/rejected status and timestamps. The test
can observe the actual HTTP gate while switching, then requires fulfillment after
release. Rejections cannot produce a passing result. Original trusted `waiting`,
nonzero time, stalled-audio behavior, recovery, synchronization and media-error
assertions remain. Phase, switch and media observations are attached before cleanup.

A new regression withholds every encoded frame while sending complete `ftyp` and
`moov` boxes from the existing MP4: 1,605 bytes derived from box sizes. It requires
a held request and pending switch, then releases the network and checks fulfillment
and resumed video/audio clocks. This tests orchestration, not ongoing playback
starvation. An initial one-byte fixture caused all four Firefox combinations to
reject with a native media error; that failed run is retained. The final fixture
sends complete format/metadata boxes instead of accepting those errors.

With the final fixture, reinstating the exact old await expression reproduced a
20-second Chromium timeout in `begin-switch`, with 1,605 bytes sent and the request
held. The corrected source was restored byte for byte. All 12 corrected cases
pass: published/current core crossed with published/current Audio Track in
Chromium 153.0.8010.12, Firefox 155.0 and Windows WebKit 26.6, without retry/skip.

The separate original starvation matrix remains 16 passed and 8 failed. All
failures are Windows WebKit at the trusted native-starvation assertion; two video
cases have pending switches and two have fulfilled switches. Completion and
starvation therefore remain separate observations. AUDIO-BUFFER-01 is not waived.
The final metadata correction changes only the new case; original starvation
inputs/assertions and the shared helper retain the tested bytes. These separate
runs must not be described as a fully green 36-case suite.

Canonical Node 24.21.0/Yarn 1.22.22 were used. Three real HTTP gate unit tests and
read-only spec lint pass. The [validation record](../baselines/audio-buffer-order-validation.json)
retains run summaries, input provenance, report hashes and phase/media/request
evidence. Candidate browser inputs are source builds, not installed npm tarballs.
No production API/code, media fixture, gate server, timeout, dependency or
distribution changed. This closes test ordering only; PKG-AUDIO-05/06 and native
buffering/device acceptance remain outstanding. No formal review, push,
deployment or publication was performed.
