# Installed package checks

Run `yarn test:ecosystem-types` for the complete library type roster: the shared
core/chapter/Audio/HLS consumer plus seventeen specialized package checks.
It rebuilds packages first, preserves each historical declaration contract, and
retains all package failures before returning a failing aggregate status. See
[orchestrator ownership and reports](../../scripts/consumers/README.md).
Type success does not approve unresolved runtime behavior or device gates.

`historicalDistributionFiles()` in `scripts/package-check.mjs` distinguishes a
same-name npm release from the Iframe package rename. Iframe verifies the real
plugin archive plus the frozen tool workspace, then requires all four original
tool dist/type paths. Missing verified workspace members fail packing; legacy
plugin/helper filenames remain a separate distribution gate. This does not
change the generic core/chapter runtime/type consumer scope. The shared browser
roster now also checks the installed Iframe tool in five browser test files.

For independent core/plugin rollback, run `yarn test:package` then
`yarn test:rollback`. The seven-step rehearsal restores frozen consumer locks,
checks complete installed file inventories and runtime entrypoints, and saves
verified installation copies. `yarn test:rollback:browser` validates a selected
step through `ARTPLAYER_BROWSER_ARTIFACTS`. See
[rollback maintenance](../../refactor/rollback-rehearsal.md) for report paths,
browser scope and the remaining package-specific release gates.

Run `yarn test:package` with the pinned Node and Yarn after a frozen install. The
default consumer scope is core and chapter. For the shared installed browser scope,
run `yarn test:package --browser`.
The additional packages have reviewed published contracts and use the same
source snapshot/build/pack/offline-install/frozen-reinstall pipeline. Installed
files are copied only after archive hash checks. The report explicitly separates
the core/chapter runtime/type scope from the additional browser package scope;
`--release` rejects additional packages until complete consumer coverage exists.
Other packages need a reviewed contract and their own consumers before inclusion.

Audio Track and HLS Control also run their complete `test/types/` fixtures against
the installed tarballs in five compiler modes, with every invalid call checked
again after removing error directives. `additionalTypeScope` and `pluginTypes`
record this separately from the original core/chapter checks. Other additional
packages still need their dedicated type consumers; no extra runtime scope is
implied. See [compiler module maintenance](../../scripts/consumers/README.md).

`scripts/package-check.mjs` copies source into an ignored build snapshot, rebuilds
all three formats and core languages using repository scripts, and runs Yarn pack.
It checks manifest targets, historical distribution files, archive members and
unexpected source/configuration files. It then installs the tarballs in a fresh
OS temporary directory outside the repository, using the root lock to resolve
runtime dependencies offline, and repeats installation with a frozen consumer lock.
Install hooks are disabled; packages with such hooks are rejected until covered.

Only the build snapshot links workspace build tools. The consumer has no workspace
package links, `NODE_PATH` is cleared, installed files must match archive hashes,
and compiler inputs may only resolve inside that consumer or the pinned compiler's
standard library. Temporary consumers are cleaned up after success or failure.

`runtime.cjs` tests CJS, ESM, UMD, AMD, legacy and language entrypoints, SSR import,
export restrictions and shared Emitter behavior. Public property descriptors and
default configuration are compared against the fixed published core/chapter.
This is a targeted compatibility check, not a complete behavioral API comparison.

Custom-UA SSR profiles run actual UMD/legacy bytes and direct ESM imports with no
window/document/navigator shim. The frozen baseline's iOS/Macintosh ReferenceErrors
are asserted only in explicit baseline mode; candidates must import successfully.
The checks retain callback-free server imports, no UMD timers, and the browser-only
constructor error. A negative fixture verifies the old package fails candidate mode.

Public, chapter-options, chapter-exports, language and legacy-plugin consumers run with
TS 5.9.3 (Node10, NodeNext CJS/ESM and Bundler) and TS 4.3.5 (Node10). NodeNext CJS also
checks import-equals/require and namespaced types. PKG-CHAPTER-04 resolved the initial
type failures; all five groups now require zero diagnostics. Exact known
diagnostics are referenced by `known-types.json` and `test/types/known-diagnostics.json`.
Unexpected errors and unexpectedly removed errors both require investigation.
Remove a known case when its owning task fixes it; keep frozen release evidence intact.
`yarn test:package:release` additionally rejects remaining known type and runtime blockers.
Passing this command alone is not authorization or sufficient evidence to publish.

`scripts/package-runtime.mjs` uses only Node built-ins and can reinstall the exact checked
tarballs under a different Node. First run `yarn test:package` on the canonical toolchain,
then use the selected executable with `scripts/package-runtime.mjs --expected-node 20.19.0`
or `--expected-node 22.12.0`; `yarn test:package:runtime` verifies canonical Node.
Each run checks HEAD, archive digests, the frozen offline install, installed bytes and
the actual child version. Reports and failure logs are `runtime-node-<version>.*` in
the same package output directory. Old reports without source/toolchain fields must
be rebuilt. CI restores canonical Node before running browser tools.

CORE-25 fixed candidate static defaults without navigator. The fixture preserves the
published ReferenceError while requiring candidate main/legacy/ESM defaults to succeed,
then uses an identical controlled language for comparison and restores the global.
The fixture now reports zero known runtime blockers; it is still only core/chapter
acceptance, not full release readiness. See [the fix](../../refactor/changes/2026-09-13-CORE-25-defaults-ssr.md)
and the earlier [Node evidence](../../refactor/changes/2026-09-13-CI-01-node-consumers.md).

The optional core `artplayer/runtime` entry has eight additional strict consumer
groups: TS 5.1.6 and 5.9.3 each check Node10 CommonJS, NodeNext CJS/ESM and Bundler.
These fixtures cover accurate returns and getter/setter types, construction-stage
callback hosts, both old and new module augmentations, old chapter factories and
the shared modern/legacy constructor. The old root remains isolated from modern
accessor syntax and retains its five original consumer groups. Runtime checks
verify the added entries reuse existing JS module and constructor identities;
`runtime/types` remains type-only. All generated core declarations are packaged,
while their authored `public/` source graph and internal implementation are excluded.

Reports, archives, installed artifact copies and build/install logs are under
`refactor/.cache/packages/run-*`; `latest.json` points to the last successful
compatibility run (a strict release rejection still leaves its report). For browser
validation set `ARTPLAYER_BROWSER_ARTIFACTS` to that run's `browser-artifacts.json`
and run `yarn test:browser`. The service then uses installed package bytes without
falling back to source. CI performs this sequence and uploads only reports and
artifacts, excluding the build snapshot's node_modules link.

`scripts/installed-artifacts.mjs` verifies selected packages against the installed
report and the current source/build inputs; performance retains its existing
two-package wrapper. Ambilight and Canvas browser helpers use this verifier when
an artifact map is supplied, including optional legacy maps pointing to checked
legacy members in the same installation. Missing packages, stale source, modified
bundles or contradictory frozen-workspace flags fail instead of rebuilding source.

`test/package-check.test.js` verifies missing targets, leaked configuration and
removed historical files, then deliberately removes an actual published default
export and required entry in an isolated consumer to prove runtime failures are
detected. It is part of `yarn test:node`.

The --browser option follows the shared installed browser roster automatically;
do not copy a manual package list into CI. Explicit --include remains supported
for a deliberate subset. --browser cannot combine with --include or --release.
