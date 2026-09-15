# SITE-04 checkpoint: core service semantics

The bilingual advanced-properties guide now documents EventRegistry, Storage,
I18n, Hotkey and Notice against the current source and root/runtime declarations.
Its hotkey example previously passed numeric32, while dispatch uses event.code;
both examples now add/remove the original callback under 'Space'. All other
existing runnable examples remain unchanged. No core runtime/declaration or
packaged documentation input changed.

The guide distinguishes DOM listener disposers from player event subscriptions,
global rebind from DOM movement, localStorage envelope keys from item keys,
per-instance fallback from persisted data, dictionary updates from UI redraw,
default shortcuts from custom callbacks, and notice visibility from assigned text.
The old root notice getter type is preserved; the runtime type example reads a
boolean. All41 historical language keys are listed under their shared semantics.

The [core mapping](../core-content-review.json) records81 explicit declaration
rows with sources, document anchors and hashes: events10, storage8, i18n49,
hotkey7 and notice7. This includes root/runtime aliases and separate getter/setter
records, not81 distinct features. The remaining882 inventory rows are unreviewed;
this is not whole-core semantic or release completion.

## Verification

- Both exact TypeScript examples pass strict NodeNext, skipLibCheck:false and
  types:[]. All36 Run Code snippets parse; only the two numeric hotkey arguments
  change. Generated pages resolve54/58 distinct local targets.
- Six page checks pass on Chromium153.0.8010.12, Firefox155.0 and Windows
  WebKit26.6: actual generated pages, visible button and exact updated-code
  forwarding. Popup responses are isolated, not editor execution.
- The exact Chinese hotkey example runs separately on all three engines using
  the real core UMD bytes verified against the registered candidate. Native Space
  triggers its callback once; its own five-second timer removes the callback,
  and another Space does not call it again. No retries or page errors. This proves
  keyboard/example behavior, not complete media playback or physical-device support.
- Existing service/documentation tests:51 pass,0 fail/skip,1271.8418ms. A direct
  source-module probe verifies all41 language values and partial merge, casing,
  fallback, explicit init and custom-key rules.
- Node24.21.0, Yarn1.22.22, TypeScript5.9.3. build:docs9.08s (Yarn10.67s),
  build:llm/check:llm, inventory and demo-route checks pass. All21 library build
  envelopes remain valid. No dependency or project script was added.

See [retained evidence](../baselines/site04-core-services.json). Chromium Chinese
hotkey screenshot was inspected; its corrected code and button are visible.
SITE-04 remains doing, totals224/22/39. Continue other core declaration groups.
Formal reviews remain user-directed. No push, deployment or publication occurred.
Revert this checkpoint to restore the guide, generated assets and mapping entry.
