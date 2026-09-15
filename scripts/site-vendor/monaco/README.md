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

This source checkpoint does not close embedded license review. Follow up with the
seven packages' original licenses/third-party notices, including HTML beautifiers
and data sources. Core embedded libraries, mode bundles and language definitions
also remain under VENDOR-06. Revalidate editor-types and site-vendor tests when
changing declarations or delivered notices. Whole-site, physical-device and remote
release gates remain separate.
