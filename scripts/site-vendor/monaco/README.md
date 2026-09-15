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
