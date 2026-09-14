# Library build and development tooling

Use Node from `.node-version` and Yarn Classic 1.22.22. The historical JS/MJS
entrypoints remain checked compatibility shims; implementation lives in strict TS.
No runtime/build dependency or bundler was replaced by this migration.

| Module | Responsibility |
| --- | --- |
| `projects.ts` | Deterministic workspace discovery, CLI selection, non-TTY failure, one JS/TS entry |
| `names.ts` | Historical camelCase/PascalCase library global names |
| `config.ts` | Vite configuration and resource/worker/output targets; typed with installed Vite declarations |
| `banner.ts` | Version/license/notices, UMD AMD/global identity, inline-worker banner removal |
| `production.ts` | Sequential package/format builds, checked dist cleanup, docs copy and optional analysis |
| `analysis.ts` | Per-build module and artifact size/hash reports outside dist |
| `development.ts` | Servor demo startup, initial IIFE build, source watcher, first-success browser opening |
| `rebuild.ts` | One active build Promise, coalesced pending changes and later retry after rejection |
| `vendor.d.ts` | Only the consumed prompts 2.4.2 / Servor 4.0.2 APIs; verified against installed sources |

`build.js` and `dev.js` own command execution/error reporting. `utils.js`,
`projects.js`, `rebuild.js` and `build-analysis.mjs` keep their previous named
exports. Importing implementation modules does not start a server/build or read
the current workspace; the explicit run functions do that work. TypeScript
annotation removal uses the canonical Node version; Node 20 consumer validation
concerns the built libraries, not executing these repository TS tools.

## Stable commands and build behavior

```sh
yarn build artplayer artplayer-plugin-chapter
yarn build all --analyze
yarn dev artplayer --no-open
yarn build --help
yarn dev --help
yarn typecheck:library
yarn test:library
```

No-argument TTY selection uses the same prompts UI. Missing names in non-TTY mode,
unknown/inherited project names and ambiguous JS/TS entries fail before cleaning
dist or starting the server. Build format order remains modern UMD `.js` es2020,
legacy UMD `.legacy.js` es2015, then ESM `.mjs` es2020. Main/legacy use the same
Terser options; ESM remains unminified. Notice text, worker handling, AMD globals,
default exports, copied docs paths and `--analyze` output remain intact. A missing
or non-string manifest version now fails before that package's dist cleanup.
Multi-package builds are sequential, not an all-packages transaction.

Vite types constrain configuration but do not replace source typechecking. Avoid
casts that hide incompatible plugin/output types. `config.ts` deliberately sets
`publicDir: false` so core declaration sources cannot leak into distribution files.
Keep unknown UMD wrappers as explicit failures when upgrading Vite/Terser.

Performance artifact verification fingerprints the JS entry shims and all code/JSON
under `scripts/library/`, including additions/removals. Do not reduce that coverage
to `config.ts` alone: banners, name mapping, project discovery or analysis may also
affect artifacts. Markdown maintenance changes are not build inputs.

## Development lifetime and remaining server work

CLI defaults remain port 8082 and docs/index.html, with output at
docs/uncompiled/<package>/index.js. The output directory is created before Servor
enumerates directories for its Linux file watchers. The internal `runDevelop`
function accepts a port only for isolated callers/tests; the CLI does not add a
new flag. Do not stop an unrelated server occupying 8082 to run a test.

Build errors are reported while keeping the source watcher alive. Changes during
a build schedule one subsequent build rather than concurrent writes. Browser
opening happens once after the first successful build; `--no-open` suppresses it.
Only the package src tree is watched; external dependencies/configuration changes
still require restart. Tests use real automatic reload rather than racing it with
a second manual navigation.

Servor still owns its HTTP server, docs watchers, reload sockets/timers and SIGINT
handler until process exit; its API exposes no close handle. MOD-DEV-01 tracks
replacing/adapting that lifetime and fixing its reproduced occupied-port exit code
zero. `node refactor/scripts/servor-port-probe.mjs` reproduces that upstream defect
in an isolated child without touching 8082. It is not a candidate-success test.
This migration does not claim those server limitations are resolved.

## Evidence and regression ownership

- `refactor/scripts/build.test.mjs`: CLI validation, serialization/error recovery,
  real TS/JS/Less/SVG/inline-worker builds, CJS/global/AMD/ESM and analysis identity.
- `test/library-build.test.js`: public files never copied into library dist.
- `test/performance-report.test.js`: changed/new/removed TS build inputs cannot
  reuse stale installed performance artifacts.
- `test/plugin-scaffold.test.js`: newly generated plugins use these real tools.
- `test/browser/library-development.spec.js`: real dev server in Chromium, Firefox
  and WebKit, worker messaging, automatic reload, source edits and error recovery.
  Uses fixture ports and disposes its own child; it does not test media playback.
- `node refactor/scripts/library-build-comparison.mjs`: copy current package sources
  into a retained fixture, build all libraries with frozen pre-migration scripts
  and current scripts at the same paths, compare all artifact hashes. This is an
  explicit whole-build validation, not part of every quick unit test.

Remote Linux/macOS/Windows CI remains a separate release gate. The local browser
evidence for MOD-02 is Windows; source inspection of Linux watcher registration
does not substitute for a remote Linux run. Lerna and root installation hooks were
not changed. The scaffold's separate guide remains in `scripts/plugin/README.md`.
