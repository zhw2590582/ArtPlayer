# Installed TypeScript consumers

`packages.ts` selects reviewed package fixtures from `test/types/`. It runs only
for packages actually packed and installed by `package-check.mjs`. Adding a
registry entry requires checking the complete fixture against its published type
contract; do not replace historical namespace or overload checks with import-only
smoke tests. Other packages retain their specialized `refactor/scripts/*package-types.mjs`
checks until deliberately integrated.

`types.ts` owns the compiler matrix, strict compiler options, realpath isolation,
and diagnostic accounting. TS 5.9.3 covers node10 CommonJS, NodeNext CommonJS and
ESM, and bundler ESM; TS 4.3.5 covers node10 CommonJS. The single compiler adapter
uses only the shared API and never sends newer resolution modes to TS 4.3.
Both compilers are existing pinned development dependencies; no runtime dependency
is introduced.

Fixtures must use package imports and put each `@ts-expect-error` immediately
before its single-line invalid statement. First compile with directives; then
neutralize directives without moving lines and require diagnostics at every
invalid statement and nowhere else. Missing declarations and widened `any` must
fail. Every parsed file must resolve inside the isolated installation or be a
standard library file from the selected compiler's exact library directory.
The temporary input is removed in `finally`; the caller owns installation cleanup.

Run `yarn test:package --browser` for the installed roster or
`yarn test:package --include=artplayer-plugin-audio-track,artplayer-plugin-hls-control`
for these two additions. `report.json` keeps `typeScope`/`runtimeScope` for the
existing core/chapter checks and separately records `additionalTypeScope` and
`pluginTypes` (compiler modes, installed declaration paths, negative lines/codes).
This type proof does not imply installed runtime or browser acceptance.

Maintain the module with `yarn typecheck:docs-tools`, `yarn lint`, and
`node --test test/installed-types.test.js` (also included in `yarn test:node`).
The tests compile a real isolated package and reject a missing declaration,
`any` widening, and a package link outside the consumer.
