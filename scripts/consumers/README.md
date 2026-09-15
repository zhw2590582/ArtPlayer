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

## Complete ecosystem gate

`yarn test:ecosystem-types` rebuilds public declarations, all package bundles and
core languages, then runs the four-package shared consumer plus all 17 specialized
package type commands sequentially. `ecosystem.ts` validates that this explicit
roster covers every library exactly once; the VitePress site retains its separate
site/editor checks. A new library or missing command fails instead of silently
reducing scope. Existing historical diagnostics, conditional exports and accurate
runtime entry fixtures remain owned by their specialized checkers.

Preparation failure stops before any installed validation, avoiding stale bundle
acceptance. A package failure records its actual exit code and continues through
the remaining packages, then fails the aggregate command. Each child writes stdout
and stderr to a dedicated file; after each child, the report records duration,
exit code or launch error, log fingerprint and package ownership. Results live in
`refactor/.cache/ecosystem-types/run-*/`. Specialized checkers keep their own detailed
reports and fingerprints under `refactor/.cache/*-package-types-*/`.

This command intentionally regenerates tracked distribution files using the
normal build commands. Review any real output drift before committing; formatting
normalization alone is not a runtime change. Do not run another source edit/build
concurrently. Checks run one at a time to avoid competing installs and excessive
compiler memory. The CI consumer job runs this gate after its existing runtime,
framework, history and performance checks on each OS, with the canonical Node
restored. CI retains the aggregate directory and detailed JSON/log artifacts on
failure. The existing job timeout remains in force.

The shared four-package check updates `refactor/.cache/packages/latest.json`.
That is why CI runs this gate after the existing runtime/browser consumers, which
already selected their own map. Before a later full installed browser run, prepare
its twenty-package map again with `yarn test:package --browser`; never pass the
four-package type preparation off as the complete browser artifact roster.

Successful completion means every selected checker met its documented type
contract, including exact expected historical failures. It does not approve the
pending Thumbnail runtime compatibility choice or replace media/device/SDK tests,
release reviews, or actual remote CI evidence.
