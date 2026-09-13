# Documentation browser modules

These are site-owned TypeScript sources, not player package APIs. Use the pinned
Node 24.21.0 / Yarn 1.22.22 toolchain from the repository root.

| Module                                   | Ownership                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `loader.ts`                              | Raw URL parameters, serialized script/style loading, successful URL cache, AMD restoration and HTTP example-source checks |
| `editor-loader.ts`                       | One desktop loader exposed as the private site bridge `window.ArtplayerDocsLoader`                                        |
| `mobile.ts`                              | Mobile DEBUG setup, dependency completion, example/code/default priority and classic-script evaluation                    |
| `navigation.ts`                          | Run Code DOM delegation, URL encoding, loopback targets and first-language navigation                                     |
| `../../../scripts/build-site-assets.mjs` | Deterministic ES2020 bundles, available English routes and read-only drift check                                          |

Generated outputs are `docs/assets/js/loader.js`, `docs/assets/js/mobile.js` and
this workspace's `docs/public/main.js`. Do not hand-edit them. `docs/index.html`
loads the desktop bridge before the old core/Monaco/common bootstrap. Mobile
bundles the same loader module locally; it does not depend on the desktop bridge.
`docs/assets/js/common.js` remains the desktop UI source and owns Monaco, controls,
file import, editor state and instance cleanup. Its remaining TS/UI migration is
tracked under SITE-03; this task does not claim that whole file was migrated.

The loader serializes all batches in one page. Each dependency completes before
the next is inserted; successful absolute URLs are cached even if a later resource
fails. Failed URLs are removed and may be retried. Query strings remain part of
cache identity; unknown file extensions are ignored as before. CSS follows the
same input order but never changes AMD state. There is no new network timeout.

A script temporarily masks the own `window.define` descriptor and restores the
exact descriptor, or its absence, on success, error, append failure or cancellation.
An immutable incompatible descriptor is rejected before insertion. Third-party
code that irreversibly changes that descriptor can prevent restoration; the error
is reported rather than treating the dependency as loaded. The loader does not
roll back arbitrary global side effects of code that already executed.

`dispose()` rejects pending loads, removes their listeners/elements and rejects
future calls; loaded script/style nodes remain page-owned. Removing a classic
script does not guarantee that the browser cancels already-started evaluation.
Non-persisted pagehide disposes the loader. BFCache
pagehide leaves the page's loader usable on restoration. Physical-device/BFCache
acceptance remains a separate environment check, not inferred from the branch.
Desktop request generations prevent a late example fetch from overwriting a newer
Run. Existing `artplayer:example:cleanup`, instance destruction and controls remain.

Query parsing preserves raw values (including literal `+`) for one explicit decode;
the last duplicate wins and fragments are not part of query values. Example still
takes priority over code; mobile/index remain their original defaults. Example HTTP
errors are reported before evaluating response bodies. Mobile evaluates in a fresh
classic function scope, preserving ordinary `var` and non-strict example behavior.
This editor intentionally runs user-selected code and is not a security sandbox.

Run Code encodes both libraries and code once, supports clicks on nested children,
and safely ignores missing code siblings. localhost, 127.0.0.1 and IPv6 loopback
target their local HTTP port 8082; production retains the canonical editor URL.
First non-Chinese visits keep matching English deep links, query and fragment.
Pages without an English counterpart fall back to the English index. Already-English
visits record the existing lang-init key without a redundant reload; later explicit
Chinese selections remain. Blocked storage keeps the requested page, avoiding loops.
The available counterparts are derived from current English Markdown during build.

```sh
yarn build:site-assets
yarn check:site-assets
yarn typecheck:site-assets
yarn typecheck:docs-tools
node --test test/site-loading.test.js
yarn test:browser test/browser/site-loading.spec.js --workers=1
```

Root build:docs regenerates site assets first. ci:check checks their types and drift;
root lint includes the TS modules and legacy common.js. Direct workspace VitePress
commands still require regenerating these assets after source edits. The full
VitePress build/deploy, i18n and remote translation/LLM tooling remain SITE-03/05.
Tests use real local pages, Monaco and controlled media, with unrelated remote
analytics/ads fulfilled inertly in test routes. They do not validate those services.
Keep browser verification serial with expensive compiler baselines when local
resource contention is observed; record infrastructure failures, never hide them
by increasing timeouts or silently retrying.
