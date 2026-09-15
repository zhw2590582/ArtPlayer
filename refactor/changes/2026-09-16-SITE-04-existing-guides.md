# SITE-04 checkpoint: current semantics of five earlier plugin guides

Cross-check the Chinese and English Danmuku, HLS Control, DASH Control, Audio
Track and VTT Thumbnail guides against current source and public declarations.
The ten guides retain all26 existing runnable snippets. Eight non-Danmuku
snippets additionally match their original demo files exactly. No runtime,
declaration, package README or dependency changed. DASH's packaged ARCHITECTURE
clarifies the same synchronous-getter rule; its candidate requires a REL-02 refresh.

Corrections and additions:

- Restore visible Run Code text on both HLS and DASH language pages. Explain
  synchronous SDK getters/formatters within asynchronously scheduled DASH refresh,
  rather than implying Promise-returning SDK getters are supported. Record the
  optional ordinary factory call and required final overload used by Parameters.
- Correct Danmuku's English whitespace claim: direct and loaded comments preserve
  text; the input panel trims it. Explain input defaulting mutations, shallow
  queue copies, non-deduplicating ids, truthy filters, Owner versus registered
  result, pooled nodes, unused slider show and exported icons versus bundled UI.
- State VTT's exact progress endpoints and existing control/CSS hooks. Preserve
  Audio Track's open Windows WebKit native buffering boundary independently of
  passing source-switch order tests. Correct the English Proxies sidebar title.

The [semantic tracker](../site-content-review.md) now includes these five packages.
This leaves the core963 enumerated members for explicit semantic mapping. It does
not substitute guide checks for SDK, media, physical-device or final-demo evidence.

## Verification

All10 exact TypeScript snippets pass strict NodeNext with skipLibCheck:false and
types:[]. Each page's43–58 distinct local link/file/fragment targets resolve.
All30 page cases pass on Chromium153.0.8010.12, Firefox155.0 and Windows WebKit26.6,
with78 successful Run Code forwarding checks, no page errors and no retries within
the final run. Screenshots are retained; Chromium Chinese HLS layout was inspected.
Popup editor responses are isolated, so this is navigation rather than playback.

Detailed results, source hashes, browser versions and retained failures are in
[the evidence record](../baselines/site04-existing-guides.json). Node24.21.0,
Yarn1.22.22 and TypeScript5.9.3 were used. Inventory remains66 Markdown,75 HTML,
30 examples and204 assets; no new routes or task status transitions were added.

The first documentation test run detected stale generated LLM content because it
preceded build:llm. Regeneration followed by all17 tests passed in1209.7607ms.
Two guide probe attempts failed on their translation-link selectors: first an
absolute-href assumption, then a Danmuku-specific English-guide label. The final
probe resolves actual relative URLs and handles both existing labels. These are
recorded test-script failures, not player defects or silently retried assertions.

build:docs passed in8.96s (Yarn10.51s), as did build:llm/check:llm, configuration
lint, strict toolchain validation, inventory and historical demo path checks.
The20 unaffected library build envelopes remain valid; DASH's prior candidate is
stale after the packaged maintenance correction. All packages retain separate
release blockers. Generated output came from repository scripts only.

SITE-04 remains doing. Formal REVIEW-01/02/03 waits for user direction. No push,
remote workflow dispatch, deployment or publication occurred. Reverting this
checkpoint restores prior guide prose/navigation and generated assets.

The complete staged whitespace check passes without generated-file exclusions.
