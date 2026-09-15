# SITE-04 checkpoint: JASSUB, Danmuku Mask and Chromecast guides

Six bilingual pages replace external-only or missing sidebar entries. All 16
plugins now have dedicated guides in both languages. Original demo JavaScript is
copied unchanged into visible Run Code blocks; Mask forwards both required plugin
libraries. New routes record pre-change HEAD
558e946ae538b6e0aac9754aed875ba521d6ca9d. This documents the unreleased branch,
not the capabilities of a package currently fetched from the registry.

JASSUB covers resource/rendering options, instance methods and fields, ASS data,
callback queries, actual resize argument order and return values, ownership and
the preserved root versus accurate runtime declarations. Mask covers all ten
options, fixed SDK/model selection, initialization and cancellation, previous-mask
retention, cleanup and NodeNext type-only extraction without inventing a runtime
default alias. Chromecast covers SDK loading, live options/callbacks, media MIME
and URL behavior, raw/normalized state, shared sessions and async runtime types.
Session presence is not described as receiver playback. The detailed source and
member mapping is in [the tracker](../site-content-review.md).

## Verification

- Node24.21.0, Yarn1.22.22 and TypeScript5.9.3. Six exact TS snippets pass strict
  NodeNext with skipLibCheck:false and types:[], including JASSUB runtime and Mask
  type extraction. All six runnable examples equal their original demo files.
- Each JASSUB/Mask page validates37 distinct local file/fragment targets; each
  Chromecast page validates38. Original/additional demo route checks pass.
- Desktop Chromium153.0.8010.12, Firefox155.0 and Windows WebKit26.6 validate all
  18 final guide cases without retries or page errors: HTTP load, sidebar, visible
  Run Code, exact code/libs forwarding and language switch. Popup responses are
  isolated; this does not execute the editor, SDK, segmentation or media playback.
- The initial run also passed18 cases. Its Mask screenshot exposed an excessively
  wide options table. Move the CDN link into prose and combine type/default
  columns. A separate final run retains new screenshots and verifies no horizontal
  table scrolling is required at the tested1100px viewport. Initial evidence is
  preserved; no mobile responsiveness or physical-device acceptance is inferred.
- Existing site-loading/documentation-pipeline tests:17 pass,0 failures/skips,
  1204.8237ms. Config lint, build:llm/check:llm, build:docs and inventory checks
  pass. Final VitePress build8.46s; Yarn10.12s. No new dependency or project script.
- Current inventory:58 Markdown (29 per language),67 HTML,30 examples,963 core
  members and204 assets. Enumeration is not complete semantic coverage.
- All21 library build envelopes remain accepted. Library source, declarations,
  distribution and dependency inputs were not changed; release blockers remain.

See [the evidence record](../baselines/site04-jassub-mask-cast-guides.json).
Generated HTML, browser assets and LLM outputs came from repository commands.
SITE-04 remains doing; totals remain224 done/22 doing/39 todo. Two proxy and two
tool guides, current earlier-guide checks and core semantic mapping remain.
SITE-05/EX-03, SDK/media/device gaps and user-directed formal reviews are separate.

No push, remote dispatch, deployment or publication occurred. Revert this
checkpoint to restore previous guides, navigation and generated outputs without
changing runtime APIs, root declarations or approved compatibility decisions.

Full staged whitespace checking exits2 on12 whitespace-only template lines in
the six new generated HTML files. Exact paths, lines and blank content were
inspected; excluding only these files passes. Generated HTML is preserved,
and the full check is not reported as passing. See the evidence record.
