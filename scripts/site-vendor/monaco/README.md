# Monaco vendor maintenance

The site keeps Monaco 0.30.1 at its existing `assets/js/vs` paths. Its 99 files
match the official archive, with the recorded CSS line-ending difference. Do not
edit these assets directly or upgrade Monaco as part of a license correction.

## TypeScript worker

`typescript.ts` describes the six browser adaptations from the fixed upstream
`monaco-typescript/scripts/importTypescript.js`, source-map removal and RequireJS's
removal of the top-level strict directive. Each adaptation must occur once; strings
containing emitted strict directives are preserved. The adapted 4.4.4 service is
an exact 9,698,327-character segment in the archived development worker.

`reproduce-typescript.ts` verifies four archive SHA-512/SHA-256 fingerprints,
three fixed Git files, source/member identities, and original notice bytes. It
then executes only the pinned Terser 5.9.0 compiler with source-map 0.7.3 and the
recorded options. The full minified result and fixed header must equal the shipped
worker exactly. It does not execute TypeScript services, run npm install scripts,
or rewrite runtime assets. Historical compilers are isolated below the ignored
`refactor/.cache/monaco-review` directory, without changing root dependencies.

```sh
yarn verify:monaco-typescript-source --fetch
yarn verify:monaco-typescript-source
yarn build:site-notices
yarn check:site-notices
node --test test/monaco-provenance.test.js test/site-notices.test.js
yarn typecheck:docs-tools
```

Use the first command to populate and reverify the network cache; the second is
offline. Provenance and pinned build recipes are in
`refactor/baselines/monaco-typescript-provenance.json`. The normal site build only
copies verified notice files; it does not rerun the historical compiler.

Monaco's original ThirdPartyNotices names TypeScript 2.7.2; retain it verbatim.
The supplement identifies the actual 4.4.4 worker and delivers its LICENSE,
CopyrightNotice and ThirdPartyNoticeText. The last file includes upstream third-party
terms, not just Apache 2.0. Preserve raw bytes, including encoding and line endings.
The new attribution explains upstream modifications and the stale version label.

## CSS, HTML and JSON workers

`languages.ts` names anonymous AMD modules syntactically, accounts for exact map
trailers and package aliases, and checks every source fragment and intervening byte.
It rejects missing modules, renamed dependencies, uncovered helper code, overlaps
and duplicate definitions. The npm sources are whole UMD files, including their
helpers and comments; module bodies alone are insufficient evidence.

`archives.ts` verifies archives and fixed Git files and extracts only historical
compiler inputs into the isolated cache. `reproduce-languages.ts` uses the fixed
upstream lock and recipes to match 91 npm modules from seven packages, eight root
aliases, the shared Monaco localization shim and three worker adapters. The complete
CSS/HTML/JSON development files contain 48/38/33 module instances respectively.
All bytes except whitespace are assigned to a verified source fragment. Terser
5.9.0 with the original options and header reproduces all three shipped workers.

The shim is Monaco's own `src/fillers/vscode-nls.ts`, identical in the three packages;
it is not the installed `vscode-nls` npm implementation. Compile the shim and worker
adapters with TypeScript 4.4.4 and its ES5/DOM/collection/promise/iterable libraries.
The compiler program intentionally omits import resolution; exact emission is
verified, but this is not a full upstream build or semantic typecheck. Standalone
`transpileModule` changes an async helper's Promise argument and does not reproduce
these adapters. No service runtime or install script executes during source checks.

```sh
yarn verify:monaco-language-sources --fetch
yarn verify:monaco-language-sources
node --test test/monaco-provenance.test.js
yarn typecheck:docs-tools
yarn test:browser test/browser/editor-languages.spec.js --workers=1
```

The source record is `refactor/baselines/monaco-languages-provenance.json`; its 13
fixed Git references include the shared upstream lock plus all three bundle recipes,
compiler configs, shims and adapters. The browser suite creates real workers with
Monaco's public `createWebWorker`, using the archived mode-manager options, and
disposes both workers and models. Monaco 0.30.1 has no public CSS/HTML/JSON worker
getter equivalent to `getTypeScriptWorker`. Tests exercise valid/invalid CSS and
JSON, HTML tag completion, document symbols, and HTML/JSON formatting on three engines.

## Mode registration bundles

`reproduce-modes.ts` covers cssMode, htmlMode, jsonMode and tsMode. The fixed record
has six archives, 23 Git files, 14 Monaco sources, six npm source modules and two
package aliases. All 26 module instances and intervening helper bytes match the
development bundles; their four complete minified outputs match existing assets.
`jsonc-parser` and `vscode-languageserver-types` notice bindings include these mode
assets as well as workers. No runtime or notice text is rewritten.

`compiler.ts` shares pinned TypeScript emission with the worker reproducer.
JSON tokenization needs the original jsonc-parser 3.0.0 main.d.ts to inline const
enums. The compiler host resolves only explicitly supplied declarations, avoiding
accidental resolution against current root dependencies. Module names may contain
a dot (`lib.index`); traversal segments remain rejected. TypeScript mode compilation
uses the fixed strict config. Exact emission is not a complete upstream typecheck.

```sh
yarn verify:monaco-mode-sources --fetch
yarn verify:monaco-mode-sources
yarn verify:monaco-language-sources
yarn test:browser test/browser/editor-modes.spec.js --workers=1
```

`editor-modes.spec.js` uses a real editor, automatic mode loading/provider registration
and model switching. CSS/JSON/TypeScript errors appear and clear after correction;
the editor's document-format action formats JSON/HTML while preserving content.
All four mode URLs must return 200; disposed models must lose their diagnostics.
This complements direct worker methods and the typed player test.

## Basic-language sources and tokenizer regression

`reproduce-basic.ts` verifies all 76 shipped basic-language bundles against 76
original TypeScript sources, including the shared TypeScript grammar in JavaScript.
The fixed Monaco commit's repository archive is SHA-256/size checked; every selected
member additionally has a Git blob ID and SHA-256. Only named members are read.
Historical compilers stay in the ignored cache; no install scripts or new root
dependencies are used. HTML/PHP need an explicit RequireJS separator after trailing
comments. Complete fragment coverage and complete minified bytes are both required.

`basic-fixtures.ts` evaluates the fixed test definitions with a recording runner,
preserving generated Clojure cases and SCSS preprocessing. Imports are restricted
to the runner and the verified Clojure grammar; this VM is not a security sandbox.
The 2,511 cases are frozen for ordinary offline browser CI; full reproduction
regenerates and compares them with TypeScript 4.4.4. The upstream runner, recipe,
config, LICENSE and third-party notices are retained alongside the provenance.

```sh
yarn verify:monaco-basic-sources --fetch
yarn verify:monaco-basic-sources
yarn test:browser test/browser/editor-basic-languages.spec.js --workers=1
```

The browser test uses Monaco's real AMD loader, language registration and tokenizer.
It retains every upstream case unchanged, and adds 12 explicit cases: INI has no
upstream test; CSP/ECL have empty suites; pgsql/redshift upstream tests actually
target SQL. All 76 grammar URLs must load successfully. Token offsets/types and
multiline state are compared, not just module loading. This is editor tokenization
evidence, not playback, physical-device evidence or a complete embedded-origin review.

## Language-service notice bindings

`monaco-language-notices.json` binds seven verified package versions to their nine
complete original LICENSE/third-party notice files. Two exact source-comment slices
preserve the HTML service's CSS/HTML beautifier MIT notices, 2007-2018 author years
and formatter authors. The package's older 2007-2017 text remains verbatim. A local
attribution explains this difference and the JSON service's original glob-to-regexp
BSD conditions; neither component is relabeled as solely Microsoft's MIT code.
The separate `beautify.js` source is Microsoft's no-op JS formatting adapter.

`notices.ts` binds the nine component entries (seven packages plus two embedded
origins) to their exact worker paths and delivered notices. The normal site build
checks these associations before any output write. Full reproduction additionally
matches all 12 notice inputs against their archived files or exact header byte
ranges. Preserve raw bytes and the `-text` Git attributes for frozen/output notices.
`site-vendor.spec.js` checks all 81 site notice files over HTTP plus the supplement's
12 relative links, alongside mobile player playback and console cleanup.

This does not close all Monaco embedded-source review. Core embedded libraries,
language definitions and remaining upstream data/origin details stay
under VENDOR-06. Revalidate editor-types and site-vendor tests when changing
declarations or delivered notices. Whole-site, physical-device and remote release
gates remain separate.

## Core Markdown origins

`core-origins.ts` keeps component/asset/license bindings separate from the full
source reproducer. The ordinary notice build rejects missing or swapped DOMPurify
and marked terms. `reproduce-core-origins.ts` verifies four npm archives and seven
fixed VS Code Git files. The original component registrations identify DOMPurify
2.3.1 and marked 3.0.2. Exact export/wrapper edits reproduce their Git sources;
named AMD forms match complete source-map entries and development-bundle spans.
The shipped editor matches the pinned Monaco archive and retains its core prefix
and map suffix. This is not a full reconstruction of the core compiler pipeline.

DOMPurify was missing from Monaco's supplied notice index. Its entire npm license
is now delivered, including both upstream license alternatives. VS Code's copy
differs by exactly one final newline; no body text is normalized or discarded.
marked's complete npm license and older VS Code license are both retained with an
explanation of the package versions and module adaptations. Four additional files
bring the site total to 85 notices plus the generated index.

```sh
yarn verify:monaco-core-origins --fetch
yarn verify:monaco-core-origins
yarn build:site-notices
yarn check:site-notices
yarn test:browser test/browser/editor-markdown.spec.js test/browser/site-vendor.spec.js --workers=1
```

The Markdown test loads the actual bundled parser/sanitizer and renderer. It checks
formatting, table cells, link targets, selected filtering behavior and removal of
temporary sanitizer hooks. The site test checks every delivered notice byte and
relative attribution link while exercising mobile playback/logging/disposal.
Neither is an exhaustive sanitizer audit. Loader, other core modules, localization,
and further embedded-origin details remain under SITE-07/VENDOR-06.

## Core minification, loader and locales

`reproduce-core-build.ts` verifies all 13 JavaScript outputs in monaco-editor-core
0.30.1: editor, worker, loader, English and nine translations. The fixed VS Code
recipe and lock identify esbuild 0.12.6. The selected executable is read from a
SHA-512/SHA-256-verified archive and run directly in an ignored cache, without
install scripts or root dependency changes. Windows/Linux x64 archives are pinned;
only Windows execution has been validated. Other hosts fail explicitly.

The historical build's node platform/esnext target/minify options reproduce every
complete output, including the exact extra newline and relative source-map comment.
Twelve files copy directly into the site; editor.main has the previously verified
entry rename and core prefix before appended language registrations. This command
does not claim to reconstruct those registrations or CSS. The loader's full source
and release header match fixed Git; css/nls loader sources match their map entries.

`core-build.ts` contains static NLS parsing, source-map inventory and map-comment
assembly. The NLS parser accepts the archived trailing commas but rejects computed
values, duplicate keys and extra statements without evaluating downloaded code.
Two archived maps contain 584 prepared-source entries, 549 different names, with
content hashes and byte lengths. They are prepared build inputs, not proof of a
complete original VS Code TypeScript compilation or license review.

```sh
yarn verify:monaco-core-build --fetch
yarn verify:monaco-core-build
yarn test:browser test/browser/editor-core.spec.js --workers=1
```

Ten locales each exercise actual keyboard edits, undo/redo, localized find UI,
next-match navigation and model disposal in all engines. The test waits for the
new selected range after changing the query, not a fixed delay or an old cursor
position. A separate diff-editor test requires a real worker, checks changed lines,
updates the input to equality, and disposes both models.

Remaining origin review can start from the map inventory: `dom.ts` references WinJS;
`strings.ts` names unicode-utils generators; `color.ts` references HSL formulas;
marked names a Stack Overflow snippet; `path.ts` identifies Node 14.16.0 while the
older supplied notice links a different commit. Reference comments alone do not
establish copied expression or a missing license; inspect actual boundaries and
original terms before deciding. Registration assembly is covered below; CSS remains
separate.

## Contribution registration assembly

`reproduce-contributions.ts` closes the appended-registration gap left by the
core minifier check. Six fixed npm archives and the fixed Monaco Git archive supply
TypeScript 4.4.4, RequireJS 2.3.6, Terser 5.9.0 and its nested source-map 0.7.3.
The top-level lock also contains source-map 0.6.1; it is not Terser's dependency.
Nothing is installed in the workspace and no historical install script runs.

The record covers 102 Git members, including 88 TypeScript module inputs and the
original metadata, release recipe, five bundler recipes/configurations and license.
Modules are emitted with the original ES5/AMD/strict settings. Standalone fillers
use program emission: isolated transpilation would incorrectly wrap their existing
AMD calls in another module. RequireJS itself names and orders definitions and
removes standalone strict directives. Each run uses a fresh ignored directory so
missing modules cannot resolve from stale outputs. This proves output equivalence,
not a full upstream semantic TypeScript check.

`contributions.ts` parses the fixed metadata statically and verifies the five-group
order: TypeScript (3 modules), CSS (2), JSON (2), HTML (2), basic languages (79).
After Terser minification and version headers, the release recipe injects the core
API dependency into each filler, renames the original editor entry, appends groups
and an API-returning alias, and preserves the exact source-map trailer. Both full
development and minified editor files must match their npm archive bytes; the
minified file must also match the unchanged site asset. Core's nested anonymous UMD
definitions are allowed; the unique renamed entry must be used by an AMD call,
including the archived string-table lookup (index 719 in both core builds).

```sh
yarn verify:monaco-contributions --fetch
yarn verify:monaco-contributions
yarn test:browser test/browser/editor-modes.spec.js test/browser/editor-basic-languages.spec.js --workers=1
```

Unit counterexamples cover missing/reordered groups, computed/duplicate metadata,
foreign modules, missing/repeated/already-injected dependencies and false entry
strings. Browser regressions exercise real diagnostics/formatting and all pinned
tokenizer cases. This does not close original core TS compilation, CSS reproduction,
remaining embedded-origin review, or the broader SITE-07 release requirements.

## CSS sources and historical compression

`reproduce-css.ts` separately covers all 68 core stylesheets. The AMD string table
does not give their assembly order: `coreStyleOrder` follows actual registrations.
81 fixed VS Code Git members include styles, three inline images, the codicon font,
original transport/build recipes, package/lock and license. Original `transportCSS`
is extracted syntactically from the verified recipe and executed with reads limited
to verified inputs. It removes the font query, normalizes URL quotes and embeds the
images. Every prepared result equals the corresponding core ESM archive member;
the copied font also matches. This harness does not run the full VS Code build.

The original CSS plugin rewrites paths and joins 70 separators with CRLF. The npm
development CSS is LF-only. That publication normalization is explicit and counted;
its exact upstream pipeline stage has not been established. After the fixed release
header and this documented transformation, the whole 114,942-byte development file
matches. This is source/output equivalence with an observed newline adaptation,
not an assertion that the original publishing command was reproduced unchanged.

Historical cssnano 4.1.11 and PostCSS 7.0.35 reproduce the complete 72,052-byte
minified file. Each run creates a fresh ignored tool directory, writes the fixed
historical lock, installs with Yarn 1.22.22 `--frozen-lockfile --ignore-scripts`,
and checks that the lock remains identical. The recorded closure has 153 selectors
and 143 package versions, all with registry integrity. `--fetch` downloads/verifies
source archives and permits registry access; the default uses cached archives and
an offline frozen install. No project dependency or root lock changes are needed.

The private manifest explicitly selects historical Browserslist defaults to prevent
the parent project's `last 1 Chrome version` target leaking into the archived build.
That leakage changes `transparent` to `initial`. Ambient BROWSERSLIST/config/env
overrides are rejected. Do not update historical caniuse data to silence its age
warning: these inputs exist only to reproduce the pinned asset. VS Code's archive
also obeys `LICENSE.txt eol=crlf`; only that member is converted to LF for its Git
blob check, while its frozen license bytes stay intact.

The site's existing 72,057-byte CSS differs solely by five CRLF header newlines;
the verifier requires that exact transformation and leaves the asset unchanged.

```sh
yarn verify:monaco-css --fetch
yarn verify:monaco-css
yarn test:browser test/browser/editor-styles.spec.js --workers=1
```

Browser checks cover light/dark theme colors, layout and resize, find-widget bounds,
successful CSS/font requests, loaded codicon glyphs and model disposal in all three
engines. The pinned light theme is intentionally #fffffe. Full original core TS
compilation and further embedded-origin review remain separate open work.
