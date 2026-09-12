# Tests and fixture ownership

Use the pinned Node/Yarn toolchain from `../refactor/toolchain-setup.md`.

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
