# Tests and fixture ownership

Use the pinned Node/Yarn toolchain from `../refactor/toolchain-setup.md`.

| Command             | Scope                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `yarn test:unit`    | Playback and DASH regressions, public contracts against released/current code, and JS/TS fixture loading |
| `yarn test:node`    | Unit contracts plus toolchain and documentation build failure propagation                                |
| `yarn test`         | Node checks and the committed baseline/tooling tests in refactor/scripts                                 |
| `yarn ci:check`     | Toolchain, plan, read-only lint, types, then yarn test                                                   |
| `yarn test:imports` | Existing distribution import smoke examples; run after building                                          |

`helpers/load.js` owns source and artifact selection. `loadModules` bundles named internal modules with esbuild and requires exactly one JS/TS source file. `loadPackage` uses the repository Vite configuration without writing distribution files; it requires a single self-contained JavaScript chunk. These loaders transpile but do not replace `yarn typecheck`.

`helpers/playback.js` creates the controlled media facade used by the original playback regressions. It models only the exercised methods and events. It is not HTMLMediaElement validation; actual playback remains in browser tests.

`contracts/emitter.js` owns public assertions, independent of module layout. `public-behavior.test.js` runs them against the integrity-checked published core and current bundled source. The combined chain/context contract corresponds to BASE-03 EVENT.chain and EVENT.context-arguments; other EVENT IDs retain their baseline names. Exceptions, callback identity, mutation during dispatch and once reentry must not be weakened during migration.

Set `ARTPLAYER_TEST_CORE` to a built `.js`, `.legacy.js` or `.mjs` core file to add a candidate to the same public-contract run, then execute `node --test test/public-behavior.test.js`. An invalid path/export fails the run. This is a narrow event contract check, not isolated package installation or complete API compatibility; ENG-07 owns tarball consumption.

When a production module moves, update its loader mapping and its maintenance documentation, preserving the behavioral assertions. New contracts belong in contracts/; test-specific controlled state belongs in helpers/. Do not modify frozen refactor/fixtures or baseline captures just to pass changed behavior. Record historical defects and candidate fixes separately.

# Real browser tests

See [browser/README.md](browser/README.md) for `yarn test:browser`, browser installation,
published/current combinations, media fixtures, candidate mapping and failure reports.
These tests are separate from the fast Node suite and run in the Browser playback smoke CI job.
