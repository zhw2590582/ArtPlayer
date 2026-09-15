# SITE-04 checkpoint: template and icon contracts

The two advanced-properties guides now explain cached template nodes, the original
container's query scope, proxy media/track references, optional mini-window nodes,
SSR markup reuse, template initialization/cleanup and whole-player destruction.
The two static-property guides clarify that Artplayer.html is a static base template.
Historical root declarations retain the nonexistent template.html instance member;
the guide directs consumers to the actual static entry without changing types.

All 27 default icon names share fresh I wrappers, nonenumerable readonly getters,
captured constructor options and HTMLElement movement rather than cloning. Root
HTMLDivElement declarations remain compatible; runtime types describe HTMLElement
and potentially missing custom keys. Trusted HTML and node ownership are explicit.
No production source, public declaration, dependency or project script changed.

The [mapping](../core-content-review.json) adds 62 template and 29 icon declaration
records. Total: 172 reviewed, 791 remaining out of 963. These include root/runtime
aliases and overloads, not independent feature counts. Each previous service group's
source hashes were verified unchanged, and its relevant guide section compared
with a1488f11b after LF normalization before refreshing the whole-document hash.
Unrelated declaration groups are not implicitly accepted.

## Verification

- Four guides preserve all existing Run Code snippets. Four TS fences pass strict
  NodeNext with skipLibCheck:false and types:[]. Local page links/fragments resolve.
- Chromium 153.0.8010.12, Firefox 155.0 and Windows WebKit 26.6 pass 12 page cases
  and 18 exact-code popup forwarding checks. Popup destinations are isolated;
  this does not execute the editor. Two Chromium screenshots were inspected.
- Each engine passes 63 real DOM assertions against core UMD bytes matched to the
  registered candidate: all 23 node bindings, query identity/scope/errors, media
  aliases, static HTML, all 27 icon getters, node movement, captured options,
  retained destroy(false) markup, complete SSR reuse and default destruction.
  No retry or page error. This is not media/codec/physical-device acceptance.
- Existing template, DOM, entry, mini-window and documentation tests: 31 pass,
  zero fail/skip, 1457.7521ms. The first run had 30 pass and one stale llms.txt
  failure because generation had not run; both logs are retained. After generation
  the same test selection passes. No assertion was removed or weakened.
- Node 24.21.0 / Yarn 1.22.22 / TypeScript 5.9.3. Final docs build 9.28s
  (Yarn 10.90s), LLM generation/check, site inventory and demo-route checks pass.
  Inventory remains 66 Markdown, 75 HTML, 30 examples and 204 assets.
- All 21 library build envelopes remain valid; release blockers are unchanged.

See [evidence](../baselines/site04-template-icons.json). SITE-04 remains doing,
224/22/39 unchanged. Continue remaining core groups; formal review rounds remain
user-directed. No push, deployment or publication. Revert this checkpoint to
restore the guides, generated pages and mapping changes together.
