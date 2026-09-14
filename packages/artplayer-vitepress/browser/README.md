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

Generated outputs are `docs/assets/js/bootstrap.js`, `common.js`, `loader.js`,
`mobile.js` and this workspace's `docs/public/main.js`. Do not hand-edit them.
`docs/index.html` loads the console bridge and loader before the typed bootstrap. Mobile
bundles the same loader module locally; it does not depend on the desktop bridge.
`common.js` is now generated from `editor.ts`. Desktop responsibilities are:

- `bootstrap.ts` and `editor-preferences.ts`: core/AMD/editor boot order, denied
  storage defaults and the exact prod/ts/code/log preference keys.
- `editor.ts` and `editor-host.ts`: DOM bindings, page lifetime and the explicit
  player/AMD/console boundary. Monaco globals come from the HTML bootstrap.
- `editor-monaco.ts`: model/declaration ownership, AMD language readiness and TS emit.
- `editor-session.ts`: latest-run ordering, source priority and classic-script execution.
- `editor-files.ts`: serialized JS/CSS imports, FileReader errors/cancellation and nodes.
- `editor-libraries.ts`: generated declaration URLs, authored through build:ts.

Root `monaco-editor@0.30.1` is a development type dependency matching the existing
browser vendor version. It is imported only as types, never bundled to replace
the browser assets. It does not complete the separate vendor provenance review.

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

Successful preference changes keep their old true/false strings and reload behavior;
code/log visibility and URL pushState/Ctrl/Cmd-S remain. Denied storage defaults to
false, while failed writes report an error and restore the checkbox. Run is unavailable
until initialization finishes. Actual JS/TS AMD modules are awaited before example
dependencies can mask define; the old arbitrary one-second delay is removed.

TypeScript mode now compiles an immutable temporary model before Run. Syntax failures
keep the current player; semantic diagnostics are visible but are not a runtime gate.
This is a classic-script editor, not a module bundler or npm import resolver. JavaScript
uses a fresh non-strict function scope: globals work and top-level var stays local to
that Run. Access to the old private common.js closure was not a supported interface.
Late compilation cannot replace a newer Run; temporary models are disposed on settlement
and page disposal. Monaco worker RPCs have no invented cancellation API.

Imports preserve sequential JS/CSS insertion and the last lowercased `[name]` label.
Unsupported extensions are ignored; local labels are not persistable dependency URLs.
File errors now reject, cancellation removes handlers, and batches are serialized.
On non-persisted pagehide the editor cleans listeners, models, declaration libraries,
FileReaders, imported nodes and players. Executed script globals cannot be undone by
removing script nodes. Persisted pagehide keeps state; synthetic lifecycle tests do
not certify physical-device BFCache behavior.

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
yarn test:site-editor
node --test test/site-loading.test.js
yarn test:browser test/browser/site-loading.spec.js --workers=1
```

Root build:docs regenerates site assets first. ci:check checks their types and drift;
root lint includes the TS sources; common.js is checked by generated asset comparison. Direct workspace VitePress
commands still require regenerating these assets after source edits. The full
VitePress build/i18n tools are in scripts/site-build and offline LLM/draft translation
tools are in scripts/documentation. Full site/search and release acceptance remain separate.
Tests use real local pages, Monaco and controlled media, with unrelated remote
analytics/ads fulfilled inertly in test routes. They do not validate those services.
Keep browser verification serial with expensive compiler baselines when local
resource contention is observed; record infrastructure failures, never hide them
by increasing timeouts or silently retrying.
