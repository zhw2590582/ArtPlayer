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

The other language services, localization shim, core embedded libraries and
language definitions remain under VENDOR-06 review. A match for this worker does
not close those components. Revalidate actual editor diagnostics/emission and
notice HTTP delivery after changes; use the committed editor-types and site-vendor
browser tests. Whole-site, physical-device and remote release gates remain separate.
