# Installed package checks

Run `yarn test:package` with the pinned Node and Yarn after a frozen install. The
initial scope is core and chapter; extend `names` in `scripts/package-consumer.mjs`
and add package-specific consumers when migrating another package.

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

Public, chapter-options, chapter-exports, language and legacy-plugin consumers run with
TS 5.9.3 (Node10, NodeNext CJS/ESM and Bundler) and TS 4.3.5 (Node10). NodeNext CJS also
checks import-equals/require and namespaced types. PKG-CHAPTER-04 resolved the initial
type failures; all five groups now require zero diagnostics. Exact known
diagnostics are referenced by `known-types.json` and `test/types/known-diagnostics.json`.
Unexpected errors and unexpectedly removed errors both require investigation.
Remove a known case when its owning task fixes it; keep frozen release evidence intact.
`yarn test:package:release` additionally rejects any remaining known type errors.
Passing this command alone is not authorization or sufficient evidence to publish.

Reports, archives, installed artifact copies and build/install logs are under
`refactor/.cache/packages/run-*`; `latest.json` points to the last successful
compatibility run (a strict release rejection still leaves its report). For browser
validation set `ARTPLAYER_BROWSER_ARTIFACTS` to that run's `browser-artifacts.json`
and run `yarn test:browser`. The service then uses installed package bytes without
falling back to source. CI performs this sequence and uploads only reports and
artifacts, excluding the build snapshot's node_modules link.

`test/package-check.test.js` verifies missing targets, leaked configuration and
removed historical files, then deliberately removes an actual published default
export and required entry in an isolated consumer to prove runtime failures are
detected. It is part of `yarn test:node`.
