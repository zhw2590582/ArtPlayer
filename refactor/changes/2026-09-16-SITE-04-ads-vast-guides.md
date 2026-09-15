# SITE-04 checkpoint: Ads and VAST bilingual guides

Four new pages replace external-only sidebar destinations with local guides.
Original ads.js and vast.js examples remain unchanged in visible Run Code blocks.
New generated routes record pre-change HEAD
2305f9d7c7254741fb8b67e72e2753ee51ce6e85. Pages explicitly describe the unreleased
branch rather than claiming the online example or unpinned package is the candidate.

Ads covers all seven options and four translations, shallow replacement, video
precedence, countdown-only play/pause, unrestricted programmatic skip, first-play
initialization, early calls, live event options, media failures and cleanup. Its
approved duration inference correction remains distinct from numeric runtime
validation and ignored historical source/type inputs.

VAST covers the approved published/workspace mode split, every callback field,
request configuration overrides, async registration/callback behavior, SDK events,
resource snapshots/getters and the difference between releasable sessions and
terminal core destruction. The root's preserved npm types and accurate runtime
types are explained separately. External SDK availability is not conflated with
local Ads playback. Full member/source mapping is in
[the content tracker](../site-content-review.md).

## Verification

- Node24.21.0, Yarn1.22.22, TypeScript5.9.3. Four exact TS snippets pass strict
  NodeNext with skipLibCheck:false and types:[], including VAST SDK declarations.
- Each new generated page validates 35 distinct local file/fragment targets.
  All four runnable snippets match the original demo files exactly.
- Desktop Chromium153.0.8010.12, Firefox155.0 and Windows WebKit26.6 pass all
  12 cases without retries or uncaught page errors: HTTP load, sidebar target,
  visible Run Code, exact code/libs forwarding and language switch.
  Popup editor responses are isolated; no demo execution, external IMA playback,
  ad media rendering, native fullscreen or device acceptance is claimed.
- The Chromium Chinese VAST full-page screenshot was inspected for layout and
  visible controls; all 12 cases retain full-page screenshots.
- Existing site-loading/documentation-pipeline tests:17 pass,0 failures/skips,
  1294.8867ms. Config lint, build:llm/check:llm, build:docs, site inventory and
  original/additional demo path checks pass. VitePress build8.08s; Yarn9.57s.
- Current inventory:52 Markdown (26 per language),61 HTML,30 examples,963 core
  declaration members and204 assets. Core enumeration is not semantic acceptance.
- Current ledger still accepts all21 library build envelopes; no library source,
  declaration, distribution, dependency or architecture input changed. All release
  blockers remain independent, and the site candidate is still absent.

See [the evidence record](../baselines/site04-ads-vast-guides.json). Generated
HTML, browser assets and LLM outputs came from repository commands. SITE-04
remains doing; task totals remain224 done/22 doing/39 todo. Continue missing
JASSUB, Mask, Cast, proxy/tool guides and the remaining current-content checks,
including the core member mapping. SITE-05/EX-03 and physical/SDK acceptance are
not completed by this checkpoint. Formal reviews remain user-directed.

No push, remote dispatch, deployment or publication occurred. Revert this
checkpoint to restore prior guides, navigation and generated outputs without
changing runtime APIs or the approved compatibility decisions.

Full staged whitespace checking exits 2 on eight whitespace-only template lines
in the four new generated HTML files. Exact paths/lines and blank content were
inspected; excluding only those files passes. Generated HTML remains intact,
and the full check is not described as passing. See the validation record.
