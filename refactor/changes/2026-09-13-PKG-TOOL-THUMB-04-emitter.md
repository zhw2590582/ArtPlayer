# PKG-TOOL-THUMB-04 emitter behavior checkpoint

Starts from 3bff236145805ecae46ce60ff5c5710189560755. This closes reproduced event
registry defects independently of the pending 3.5.31/4.4.0 default-policy choice.
04 remains doing; no default options, extraction timing or public types change.

## Before and after

The inherited tiny-emitter structure treats Object.prototype members as event
arrays. emit/on/off can fail on names such as __proto__, constructor and toString;
inherited getters/setters can intercept a replaced public e registry. Nested emits
take separate snapshots, allowing one once wrapper to run in an inner dispatch
and then again when the outer snapshot resumes, even after the inner throw was
caught. Re-registering its original callback does not make that duplicate correct.

The candidate checks own keys and creates new entries with data descriptors,
retaining the registry object/prototype and ordinary descriptor flags. Each once
closure is consumed before removal/callback invocation. Normal listener order,
snapshot behavior, callback ctx, symbols/numbers, duplicate independent
registrations, original-function removal and synchronous exception identity remain.
The design matches the already-tested core approach, without adding a runtime
dependency on the core or erasing this tool's declaration-specific tuple boundary.

Six new Node cases pass 1/fail 5 on the frozen workspace. Candidate source and
artifacts repeat them together with the unchanged input/extraction/facade tests.
The new real-browser case verifies special names, nested once and native DOM
cleanup. Existing extraction, native media controls and Monaco cases are rerun
for source/main/legacy because the runtime bundle has changed. Windows WebKit
Blob failures remain explicit unavailable controls, not successful extraction.
Installed package checks repeat after the final package documentation/build.

The upstream attribution remains in every bundle and pack. The provenance ledger
records these intentional local fixes separately from the previous type-only
adaptation. THUMB-EVENT-01 tracks closure evidence; default-policy, historical CSS
and actual supported Safari/core integration gates are unaffected.

Revert this checkpoint to roll back only the emitter fixes and their records;
run the normal package build and installed checks again. Keep earlier lifecycle,
public declaration and distribution fixes. No push, tag or publication.
