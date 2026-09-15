# SITE-04 checkpoint: Canvas and Mediabunny guides

Four bilingual guides replace external-only proxy navigation destinations while
retaining the original Canvas and Mediabunny examples. New route provenance
records pre-change HEAD e2bd7c97424df216cbf1486bb6c60ccd70af5c2f. These pages
describe the unreleased branch, not a published capability guarantee.

Canvas documents real-video decoding, Canvas member priority, synchronous callback
ordering, native-event forwarding, geometry, subtitle track placement, bitmap and
stream ownership, and six public types with the approved old-root/runtime split.
Mediabunny documents all13 top-level options, both HLS menu configurations, track
pairing/state, all declared shim members, synthetic frame/range semantics and
11 public types. Inert setters, crossOrigin not configuring SDK fetch, Auto not
implying bandwidth adaptation, Range preflight's independent error path and
partial versus wholly undecodable input are stated explicitly. See the
[source/member tracker](../site-content-review.md).

## Verification

- Node24.21.0, Yarn1.22.22 and TypeScript5.9.3. Four exact TS snippets pass strict
  NodeNext, skipLibCheck:false and types:[]. Four Run Code blocks match original
  demo files exactly. Canvas pages validate42 distinct local file/fragment targets;
  Mediabunny pages validate43.
- All12 guide cases pass on Chromium153.0.8010.12, Firefox155.0 and Windows
  WebKit26.6 without retries/page errors: HTTP load, sidebar destination, visible
  Run Code, exact source/library forwarding and language switching. Popup editor
  responses are isolated; this is not video decoding, HLS playback, media event
  ordering or physical-device acceptance. Screenshots retained; Chromium Chinese
  Canvas inspected for layout and control visibility.
- Existing documentation/loading tests:17 pass,0 failures/skips,1302.5949ms.
  Config lint, inventory and demo route checks, build:llm/check:llm and build:docs
  pass. VitePress9.12s, Yarn10.66s. No dependency or project script added.
- Current inventory:66 Markdown (33 per language),75 HTML,30 examples,
  963 enumerated core declaration members and204 assets. All16 plugins, two tools
  and two proxies now have dedicated bilingual guides. This is not a claim of
  complete core semantic coverage or final demo acceptance.
- All21 library candidate build envelopes remain valid; package runtime, public
  declarations, packaged documentation and dependency inputs are unchanged.

See [the evidence record](../baselines/site04-proxies-guides.json). Generated
outputs came from repository scripts. SITE-04 stays doing, totals224/22/39.
Next cross-check earlier Danmuku/HLS/DASH/Audio/VTT guides and core member semantics.
User-directed formal reviews, SDK/media/device gates and publication stay separate.
No push, remote dispatch, deployment or publication occurred. Revert this checkpoint
to restore previous navigation and generated assets without changing package APIs.

Full staged whitespace checking exits2 for eight whitespace-only template lines
in the four new generated HTML files. Exact paths/lines and blank content were
inspected; excluding only those files passes. Generated HTML is preserved and
the full check is not reported as passing. See the evidence record.
