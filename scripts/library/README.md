# Library build and development tooling

Use Node from `.node-version` and Yarn Classic 1.22.22. The historical JS/MJS
entrypoints remain checked compatibility shims; implementation lives in strict TS.
Vite still owns library bundling. The dev HTTP server is repository-owned; the
root dev dependency mrmime 2.0.1 supplies MIME names. Servor 4.0.2 remains only for
its browser-opening helper and the isolated historical failure probe.

| Module           | Responsibility                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `projects.ts`    | Deterministic workspace discovery, CLI selection, non-TTY failure, one JS/TS entry            |
| `names.ts`       | Historical camelCase/PascalCase library global names                                          |
| `config.ts`      | Vite configuration and resource/worker/output targets; typed with installed Vite declarations |
| `banner.ts`      | Version/license/notices, UMD AMD/global identity, inline-worker banner removal                |
| `production.ts`  | Sequential package/format builds, checked dist cleanup, docs copy and optional analysis       |
| `analysis.ts`    | Per-build module and artifact size/hash reports outside dist                                  |
| `development.ts` | Session startup/close/done, IIFE build queue, source watcher and first-success browser opening |
| `server.ts`      | HTTP binding, docs watcher, request/socket ownership and shutdown                              |
| `assets.ts`      | Root-contained files, directory indexes, HTML injection, gzip and media ranges                |
| `reload.ts`      | SSE clients, shared heartbeat and the browser reload script                                   |
| `rebuild.ts`     | One active build Promise, coalesced pending changes and later retry after rejection           |
| `vendor.d.ts`    | Only the consumed prompts 2.4.2 / Servor 4.0.2 openBrowser APIs                               |

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
yarn test:dev-server
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

## Development lifetime

CLI defaults remain port 8082 and docs/index.html, with output at
docs/uncompiled/<package>/index.js. Optional `ARTPLAYER_DEV_PORT` accepts an integer
0..65535; 0 atomically binds an available port for isolated callers/tests. Invalid
values or occupied ports exit nonzero; there is no silent port fallback. Do not
stop an unrelated server occupying 8082 to run a test.

Build errors are reported while keeping the source watcher alive. Changes during
a build schedule one subsequent build rather than concurrent writes. Browser
opening happens once after the first successful build; `--no-open` suppresses it.
Only the package src tree is watched; external dependencies/configuration changes
still require restart. Tests use real automatic reload rather than racing it with
a second manual navigation.

`startDevelopment` returns `{ url, close, done }`. The CLI owns SIGINT/SIGTERM
handlers and its AbortController; importing implementation modules installs none.
`close()` is idempotent: stop queuing builds, remove the abort handler and source
watcher, close HTTP/docs watching/SSE, then await the active build. A late build
cannot open a browser or reload a closed session. Aborting during asynchronous
startup waits for and closes a late-bound server. `done` rejects on fatal watcher
or server errors; ordinary compiler errors retain the session for correction.

`server.ts` owns every HTTP socket and active asset pipeline, the recursive docs
watcher and 75ms debounce timer. Its close destroys only its own sockets and waits
for request pipelines to settle. `reload.ts` has one 30s heartbeat while clients
exist; the last disconnection or shutdown removes it. The browser closes its SSE
connection on pagehide. Docs edits reload automatically; the selected output tree
is ignored by the docs watcher and reloads only after a successful queued build.

`assets.ts` leaves classic JS assets intact for Monaco, injects reload into HTML,
serves directory index.html and escaped listings, and falls back to root index.html
for missing extensionless routes. HTTP corrections include valid directory
redirects, fallback status200, body-free HEAD, explicit gzip;q=0, exact/suffix/open
media ranges and 416 for malformed/unsatisfiable ranges. Realpath containment
rejects outside symlinks/junctions. Stream pipelines dispose file/gzip resources on
disconnect. This local docs server is not a production hosting server.

`node refactor/scripts/servor-port-probe.mjs` preserves the old Servor occupied-port
exit0 reproduction. Candidate failure/cleanup checks live in test/dev-server.test.js.

## Evidence and regression ownership

- `refactor/scripts/build.test.mjs`: CLI validation, serialization/error recovery,
  real TS/JS/Less/SVG/inline-worker builds, CJS/global/AMD/ESM and analysis identity.
- `test/library-build.test.js`: public files never copied into library dist.
- `test/performance-report.test.js`: changed/new/removed TS build inputs cannot
  reuse stale installed performance artifacts.
- `test/plugin-scaffold.test.js`: newly generated plugins use these real tools.
- `test/browser/library-development.spec.js`: real dev server in Chromium, Firefox
  and WebKit, worker messaging, automatic reload, source edits and error recovery.
  The real JS CLI receives SIGTERM and must exit naturally with status0. A second
  case serves actual docs/Monaco, executes TypeScript and plays/seeks/decodes local
  MP4. Its recorded tracked core5.4.1 asset is not a newly built release candidate.
- `test/dev-server.test.js`: real occupied-port CLI failure, HTTP/HEAD/ranges,
  repeated same-port startup/shutdown with SSE, aborted download and startup/build
  cancellation; a controlled clock separately checks heartbeat disposal.
- `node refactor/scripts/library-build-comparison.mjs`: copy current package sources
  into a retained fixture, build all libraries with frozen pre-migration scripts
  and current scripts at the same paths, compare all artifact hashes. This is an
  explicit whole-build validation, not part of every quick unit test.

Remote Linux/macOS/Windows CI remains a separate release gate. The local browser
evidence for MOD-02 and MOD-DEV-01 is Windows; it does not substitute for remote
Linux/macOS runs or real device playback. Lerna and root installation hooks were
not changed. The scaffold's separate guide remains in `scripts/plugin/README.md`.
