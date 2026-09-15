# SITE-04 checkpoint: Document PiP and ASR bilingual guides

Four new guides document actual runtime, declarations and lifecycle behavior.
The Document PiP sidebar now opens a local guide; ASR gains a bilingual sidebar
entry. Original document.pip and asr.local demo code is preserved exactly in
visible Run Code blocks. New generated HTML paths identify the pre-change HEAD
31388126103a14834dc37051a5b3c6daaf9afb05; no publication is implied.

Document PiP covers all options, result members, events, native video fallback,
activation, cancellation and restoration. Its historical void/writable types
remain distinct from the actual async/readonly implementation. The precise
RuntimeFactory view is documented without inventing a /runtime subpath.

ASR covers all options, first-channel PCM16/WAV, callback ordering and overload,
subtitle replacement/HTML handling, nonterminal stop, graph ownership, CORS and
the existing /runtime types. It clearly labels simulated subtitles and requires
applications to supply recognition. It does not claim to mix an independent
Audio Track or cancel application network requests. Source/member mapping is in
[the content tracker](../site-content-review.md).

## Verification

- Node 24.21.0, Yarn 1.22.22, TypeScript 5.9.3. Four exact TS snippets pass
  strict NodeNext with skipLibCheck:false and types:[], without diagnostics.
- The two PiP pages each validate 30 distinct local links/fragments; each ASR
  page validates 31. All four embedded examples match their original source.
- Chromium 153.0.8010.12, Firefox 155.0 and Windows WebKit 26.6 pass 12 page
  navigation cases without retries or uncaught page errors. Checks cover HTTP,
  sidebar, visible Run Code, exact code/libs forwarding and language switches.
  The popup editor response is deliberately isolated: no editor execution,
  audio recognition, native PiP or media playback acceptance is claimed.
- Chromium Chinese PiP and English ASR full-page screenshots were visually
  inspected for layout and visible controls. No physical-device test was run.
- The existing site-loading and documentation-pipeline suites pass all 17 tests,
  no failures/skips, 1229.3862 ms. Config lint, build:llm/check:llm, build:docs,
  current site inventory and historical/additional demo path checks pass.
  VitePress reports a 7.57-second build; Yarn build:docs elapsed 9.17 seconds.
- Current inventory: 44 Markdown pages (22 per language), 53 HTML paths,
  30 examples, 963 core declaration members and 204 tracked assets. Core
  member enumeration still does not represent completed semantic coverage.
- Release-ledger report accepts all 21 existing library candidates/build gates
  with unchanged input fingerprints. All packages still have release blockers;
  the documentation site has no registered candidate.

Logs, screenshots, source hashes and scoped results are indexed in
[the validation record](../baselines/site04-dpip-asr-guides.json). Generated HTML,
browser assets and LLM outputs came from the repository build scripts. There are
no library runtime, declaration, distribution, dependency or lockfile changes.

SITE-04 remains doing; 224 done / 22 doing / 39 todo. Continue the remaining
core/ecosystem semantic mapping and guides. SITE-05/EX-03, device evidence and
release gates remain separate. No user-guided formal review, remote action or
publication was started. Revert this checkpoint to restore the prior guides,
navigation and generated outputs without changing library behavior.

The full staged whitespace check exits 2 on eight whitespace-only VitePress
template lines in the four new HTML files. Exact locations and blank content
were inspected; the check passes with only those four generated files excluded.
Generated HTML was not hand-edited and the full check is not reported as passing.
The initial evidence collector counted only ordinary npm rows (19); including
renamed/recovered npm distributions correctly validates all 21 library rows.
