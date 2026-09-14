# PKG-HLS-SDK-01: direct HTTP teardown diagnostic checkpoint

Status remains doing. Baseline fe5534ac2429ac67702ca9d4121b4ab8603cb278.
No production source, dependency, fixture, build output or acceptance assertion
was changed. This checkpoint advances attribution, not completion.

## Controls and results

All five runs use frozen Hls.js1.5.17, Windows Firefox155.0, local ordinary HTTP,
direct native video, no ArtPlayer/plugin, no route interception, no Worker
observer and no SDK logger. Native worker output is not substituted. Browser
process DEBUG logging is enabled and saved for every run. Existing trace capture
and media/SDK event recording remain enabled, so these are not uninstrumented runs.

| Run | Teardown | Worker | Extra pre-destroy snapshot | Pass | Fail |
| --- | --- | --- | --- | --- | --- |
| Original runner | reset first | yes | no | 9 | 1 |
| Original runner control | reset first | no | no | 10 | 0 |
| Phase/snapshot runner | reset first | yes | yes | 5 | 0 |
| Final phase runner | reset first | yes | no | 4 | 1 |
| Final phase runner | SDK first | yes | no | 3 | 2 |

35 diagnostic iterations total:31 pass,4 fail. These are finite controls, not
release-matrix passes or a claim about long-term failure probability. The no-worker
control cannot substitute for required worker acceptance. Snapshot success may
reflect changed timing; it is not evidence of a repair.

The three failures in the final phase runner occur during final-state collection,
after destroy and the immediate post-destroy state call returned. The first failure
predates phase recording and cannot be assigned the same precise stage. Original
errors, trace hashes and logs are retained separately from previous diagnostics.
Both reset-first and SDK-first reproduce failures. Do not change the public core
destroy order or callers' SDK configuration based on the previously passing
SDK-first samples. No grouped-playback timeout occurred in these direct controls;
the independent HLS-PLAYBACK-01 failure remains unclosed.

## Browser evidence limits

The installed Firefox1543 archive's TargetRegistry.js observes
`oop-frameloader-crashed`, emits the target crash event and disposes that target.
The logged stack reaches this observer. The source member hash and excerpt are
recorded with the actual binary archive hash, not inferred from another release.
This supports a browser out-of-process frame-loader crash notification; it is not
a native stack, minidump or proof of the responsible decoder/worker/SDK component.
The browser parent exits normally after explicit teardown. Its exit code0 does
not negate page crashes. The SWGL framebuffer startup warning occurs in both the
failing worker run and passing no-worker control, so it is not a root-cause claim.

## Maintained diagnostic changes

The runner now records host-side operation phases and the phase/time of crash
events. Errors during final state, tracing or context close remain failures even
after operation assertions passed. This introduces no page calls in default mode.
`--capture-before-destroy` optionally saves media, SDK and event state to Node
before destroying the page; it defaults off and is explicitly listed in reports.
That extra evaluate may affect timing, which is why its passing control is kept
separate. Existing7-second waits, retries, media, SDK and worker settings are intact.

Script lint and the frozen SDK/worker archive check pass. Package source and all
published build outputs remain unchanged, so no package rebuild is required.
See [evidence](../baselines/hls-http-teardown-validation.json) for exact runner,
SDK/media inputs, reports, traces and failure classification.

## Next evidence

HLS-CRASH-01 and HLS-PLAYBACK-01 remain open; task SDK-01 is not complete. Obtain
native Firefox content-process crash diagnostics or a minimized MSE reproduction
and independently investigate the grouped-stream stall. Continue other package
tasks while keeping this gate visible. Reverting this checkpoint removes diagnostic
phase/snapshot metadata only and restores no production behavior.
