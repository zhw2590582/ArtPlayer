# Tests and fixture ownership

`site-loading.test.js` freezes the old mobile loader's failure/race reproduction
and checks shared loader ownership, retries/cancellation, query encoding and
language rules. Actual local pages and Monaco are covered by site-loading.spec.js.

Editor tooling lives in `scripts/editor-declarations/`; see its README.
`test/editor-types.test.js` checks standalone globals and module consumers with
current/old compilers, Chapter/VAST regressions, generated files and library-list
failures. Package baseline tests continue to exercise the old MJS import paths.

Use the pinned Node/Yarn toolchain from `../refactor/toolchain-setup.md`.

`yarn build:test` generates deterministic documentation readiness smoke and its
source manifest. `yarn check:docs-smoke` is read-only, and
`yarn typecheck:docs-tools` checks the TS modules and legacy JS command shim.
`refactor/scripts/docs-smoke.test.mjs` covers the historical malformed-parser loop,
all 233 current source snippets, stable generation and CLI drift/error handling.
`test/browser/docs-smoke.spec.js` uses actual core/media in three engines for
readiness, failures, frame cleanup, storage restoration and repeated execution.
See `scripts/docs-smoke/README.md` for the explicit limits of readiness smoke.

`yarn test:vue-consumer` checks the actual Vue example with packed core/Danmuku/
Document PiP in an outside-workspace install. It also installs its pinned Vue
compiler there, checks all declaration paths for isolation, and runs development
and production builds in three engines. `test/vue/` contains strict SFC/type
fixtures and a separate plain-JS consumer. Reports under
`refactor/.cache/vue-consumer-*` cover updates, remount, KeepAlive, captured errors,
native media and real Worker cleanup. `--before` substitutes the recorded old
wrapper and must preserve the same lifecycle behavior; it is not expected to fail.

`yarn test:react-consumer` installs packed core/Danmuku/Document PiP outside the
workspace and checks the actual React example's strict TSX, development and
production builds, and native lifecycle/playback in three engines. Its fixture
is in `test/react/`; unique reports and frozen consumer locks are retained under
`refactor/.cache/react-consumer-*`. The `--before` control intentionally fails at
the recorded old wrapper's callback-exception leak. See the example README for
the compatibility contract and the capabilities covered by other package tasks.

`yarn test:auto-thumbnail-types` checks the preserved npm 1.1.0 declaration,
accurate `/runtime` Promise types, exact rejected consumer lines, and generated
editor globals. It also runs in `test:auto-thumbnail` and `test:baseline`.
`yarn test:auto-thumbnail-types-package` packs the candidate and installs it and
the actual npm 1.1.0 archive outside the workspace with a packed core. It verifies
frozen reinstalls, byte identity, conditional declaration resolution, old/current
compiler consumers, no-interop CommonJS, and installed factory registration.
It also installs actual 1.0.1 to verify old `.default` calls and confirms 1.0.0's
missing main/legacy artifacts. Candidate direct/default calls share a callable;
runtime types describe the alias without changing the historical root declaration.
This does not decode video or close all older type-shape, native pixel, or device
acceptance gaps. Candidate entry types use the same runtime files.

`yarn probe:auto-thumbnail-rendering` is an optional diagnosis command, separate
from passing test suites. It runs four intrinsic-size rendering modes and three
readiness strategies in Windows WebKit, plus Chromium/Firefox controls. It records
raw draw pixels, seek/event ordering, frame counters and exact code/media hashes
in a new cache directory. Completion of the command does not imply correct pixels:
the current WebKit first-frame discrepancy remains an open release/refactor risk.

`yarn test:danmuku-mask` runs candidate run cancellation/resource ownership plus
frozen historical defects and public contracts. Candidate tests also run in
`test:unit`; their controlled SDK, RAF and canvas hosts do not prove native model
inference, GPU disposal or browser mask geometry. See the Mask architecture map.
`yarn test:danmuku-mask-types-package` installs both published versions and the
candidate tarball outside the workspace for old/current compiler compatibility,
negative cases and CJS/legacy registration without model startup. The ordinary
baseline suite also checks public declaration identity and editor generation.

`yarn test:mediabunny` runs historical lifecycle observations, candidate load cancellation,
and real SDK input parsing/track contracts; all are in `test:unit`. Candidate failures
can be reproduced against the frozen main with `ARTPLAYER_MB_BASELINE=1`. This does not
replace native playback or installed consumers. See `refactor/mb-validation.md` and the
proxy package's `ARCHITECTURE.md` for browser and artifact selection.

`yarn test:ads` runs source, verified npm 1.0.6 and the frozen unpublished 2.1.0
Ads bundle against controlled clock/host contracts. It is included in `test:unit`.
The helper uses the real option validator but does not simulate media decoding or layout.
Historical defect assertions apply only to frozen implementations. See
[Ads validation](../refactor/ads-validation.md) for artifact overrides and browser scope.
`ads-lifecycle.test.js` adds candidate-only resource, reentry, early-method and Promise
regressions. Async observations drain one event-loop turn, including VM Promise assimilation,
rather than assuming a fixed number of microtasks. The published defect observations stay intact.

| Command             | Scope                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `yarn test:unit`    | Playback and DASH regressions, public contracts against released/current code, and JS/TS fixture loading |
| `yarn test:node`    | Unit contracts plus toolchain and documentation build failure propagation                                |
| `yarn test:ci`      | Actual CI summary exit codes, workflow regression guards and repository impact analysis                  |
| `yarn test`         | Node checks and the committed baseline/tooling tests in refactor/scripts                                 |
| `yarn ci:check`     | Toolchain, plan, read-only lint, types, then yarn test                                                   |
| `yarn test:imports` | Existing distribution import smoke examples; run after building                                          |

`helpers/load.js` owns source and artifact selection. `loadModules` bundles named internal modules with esbuild and requires exactly one JS/TS source file. `loadPackage` uses the repository Vite configuration without writing distribution files; it requires a single self-contained JavaScript chunk. These loaders transpile but do not replace `yarn typecheck`.

`helpers/playback.js` creates the controlled media facade used by the original playback regressions. It models only the exercised methods and events. It is not HTMLMediaElement validation; actual playback remains in browser tests.

`node --test test/hls-control.test.js` runs shared HLS control contracts against workspace source
and integrity-checked published main/legacy/ESM. It is included in `yarn test:unit`.
`helpers/hls-control.js` owns the controlled SDK/registry host; it does not simulate decoding or ABR.
Published-only tests preserve historical bug observations without requiring candidate code to keep them.
Real Hls.js 1.5.17 playback is in `test/browser/hls-control.spec.js`; see its environment limits in
`refactor/hls-validation.md`. Test SDK download is pinned and verified, not an installed runtime dependency.

`contracts/emitter.js` owns public assertions, independent of module layout. `public-behavior.test.js` runs them against the integrity-checked published core and current bundled source. The combined chain/context contract corresponds to BASE-03 EVENT.chain and EVENT.context-arguments; other EVENT IDs retain their baseline names. Exceptions, callback identity, mutation during dispatch and once reentry must not be weakened during migration.

Set `ARTPLAYER_TEST_CORE` to a built `.js`, `.legacy.js` or `.mjs` core file to add a candidate to the same public-contract run, then execute `node --test test/public-behavior.test.js`. An invalid path/export fails the run. This is a narrow event contract check, not isolated package installation or complete API compatibility; ENG-07 owns tarball consumption.

When a production module moves, update its loader mapping and its maintenance documentation, preserving the behavioral assertions. New contracts belong in contracts/; test-specific controlled state belongs in helpers/. Do not modify frozen refactor/fixtures or baseline captures just to pass changed behavior. Record historical defects and candidate fixes separately.

`ci-summary.test.js` exercises the real CLI with success, cancelled and malformed provider data,
plus missing groups and metadata/environment files. It is included in `test:node`.
`refactor/scripts/ci-workflow.test.mjs` parses the actual YAML and rejects broken matrix,
cache, install, report and summary requirements; it is included in `test:baseline`.
These local tests do not replace hosted runner or branch-protection evidence.
See [CI operations](../refactor/ci-setup.md) before changing a required job or its cache.

# Real browser tests

`test/utils.test.js` compares the published and current utilities, including exact formatting,
subtitle text, property/merge behavior, controlled timers and the full utility export surface.
It accepts the same `ARTPLAYER_TEST_CORE` option for all three artifact formats. The merge
prototype fix is a candidate assertion alongside a published-only defect observation.
`test/types/utils-source.ts` checks strict internal source inference without changing the
still-separate public declaration contract. Browser utility tests exercise actual downloads,
Blob URL contents and cleanup when a controlled click fails.

See [browser/README.md](browser/README.md) for `yarn test:browser`, browser installation,
published/current combinations, media fixtures, candidate mapping and failure reports.
These tests are separate from the fast Node suite and run in the Browser playback smoke CI job.

`test/audio-track.test.js` compares source and published Audio Track 1.1.0 in all three
formats with a controlled Audio object: timing intent, offsets, source updates, rejection,
volume/rate, independent instances and cleanup. Published-only tests retain defect evidence.
See [audio validation](../refactor/audio-validation.md) for actual media tests and limitations.

Document PiP: `yarn test:dpip` runs 48 historical window/DOM/lifecycle cases. Native DOM iframe checks use `yarn test:browser test/browser/dpip.spec.js`; controlled window APIs do not establish native Document PiP support. See [validation notes](../refactor/dpip-validation.md).

Danmuku: `yarn test:danmuku` covers historical behavior and current input, scheduling,
settings, rendering and heatmap boundaries. `ARTPLAYER_DANMUKU_ARTIFACT` selects a
built candidate for integration cases; direct internal tests remain source tests.
The candidate Worker helper executes the selected artifact's Blob or data URL bytes;
only source-mode controlled imports compile `worker.ts` separately. The frozen
published helper remains unchanged. `yarn test:danmuku-types` checks the unchanged
npm root, the optional accurate `/runtime` entry, implementation assignability and
semantic editor declarations. `yarn test:danmuku-types-package` packs and installs
the packages outside the workspace, verifies exact member bytes and frozen offline
reinstallation, and checks historical and current compiler consumers. These type
checks do not replace the native browser suite or final distribution acceptance.

## Documentation pipeline regressions

`node --test test/documentation-pipeline.test.js` covers the frozen old translator's
delete-before-request, broken fence repair and exhausted 429 behavior; the new
draft workflow checks failure, worker cancellation/join, reviewed apply, stale
inputs, path escape, rollback and concurrent edits. Existing source Markdown
round-trips and the offline source corpus are checked against actual inputs.
A loopback HTTP server verifies a stalled response body times out. Mock responses
test bounded retries and invalid data; no paid translation is performed and these
tests do not certify English prose quality. Included in `test:node`.
