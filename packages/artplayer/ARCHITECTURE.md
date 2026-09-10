# Core implementation and migration map

ArtPlayer keeps its existing constructor, player mixins, plugins and DOM/CSS hooks.
The production entry is still `src/index.js`; this document marks actual migrated
boundaries rather than describing the entire core as TypeScript.

## Current TypeScript boundary: utilities

| Module | Responsibility and constraints |
| --- | --- |
| `src/utils/index.ts` | Existing export barrel; no added runtime names or wrapper methods |
| `src/utils/format.ts` | Clamp, capitalization, clock formatting and HTML entity conversion; reusable private lookup maps |
| `src/utils/property.ts` | Native defineProperty alias, own-property inspection and recursive merge; keys are written as own data properties |
| `src/utils/time.ts` | Sleep, trailing debounce and leading throttle; infer argument tuple/receiver, preserve scheduling and synchronous return behavior |
| `src/utils/error.ts` | ArtPlayerError, truthiness guard and internal rejection handling; public media promises are handled elsewhere |
| `src/utils/file.ts` | Historical extension parsing and transient download anchor lifecycle |
| `src/utils/subtitle.ts` | Existing SRT/ASS-to-VTT text conversions and VTT Blob creation |

These modules do not import the player, UI components or each other except for the
barrel. Existing DOM and browser capability utilities remain JS and are re-exported
unchanged. Emitter and Component are separate migration tasks. Imports from the
barrel must not silently add runtime fields to `Artplayer.utils`.

## Observable utility behavior

- `def` is the native Object.defineProperty function. Property keys include symbols;
  descriptors, return identity and own-property behavior remain native.
- mergeDeep iterates own enumerable string keys. Existing nested objects are recursively
  merged, a previously unseen value retains its reference, and the historical
  `previous.concat(...incoming)` behavior flattens incoming nested arrays by one level.
  It returns a new outer object and does not mutate inputs. `__proto__` now becomes
  an own data key instead of invoking an inherited setter or replacing the result prototype.
- Debounce discards earlier pending calls and uses the final arguments/receiver.
  Throttle runs immediately, ignores calls in the wait window and does not schedule
  a trailing call. Its wait flag is set after invoking the callback: synchronous
  reentry and retry after a thrown callback retain historical behavior. Both wrappers
  return undefined. No new public cancel/flush methods were introduced.
- silencePromise handles only values with a callable catch and preserves other
  values. It is for internal event handlers; do not wrap public play/toggle promises
  to hide their rejections. The property-access assertion is local to that duck-typed
  boundary, and stack capture is guarded for engines that do not implement it.
- Subtitle conversion preserves the existing limited formats, whitespace and time
  normalization; it is not a complete ASS parser. The caller owns and must revoke
  vttToBlob's returned URL. Download owns its temporary anchor and removes it in
  finally, including click failure. It does not revoke caller-owned URLs.

## Types and remaining work

Migrated sources compile with strict/noUncheckedIndexedAccess and browser-only
ambient types. The merge accumulator is a dynamic string-key boundary with one
documented cast to the pre-existing generic return contract. No file-wide any or
type-check suppression was added. The main public declarations remain a separate
compatibility surface; see [types/README.md](./types/README.md).

Existing declaration discrepancies are still tracked for CORE-07: Utils lacks some
runtime exports, def is declared void, debounce/throttle declare the callback return
instead of void, and debounce's old optional context argument is ignored at runtime.
Sleep's declaration also requires a delay while runtime defaults to zero. These were
not silently tightened during source migration; use the actual source types internally.
Lifecycle-owned timer cancellation is part of CORE-04/17 and the existing BASE-PERF-01
finding, not a claim that a standalone debounce can know when its owner is destroyed.

## Verification and maintenance

Run `yarn test:unit` for shared published/workspace utility contracts and controlled
timers. `test/utils.test.js` also accepts `ARTPLAYER_TEST_CORE` to test an actual
UMD, legacy or ESM file. `test/types/utils-source.ts` checks source inference, receiver
types and invalid arguments. Test fixtures supply timers explicitly to isolated
published UMD contexts; production code is not patched for tests.

Run `yarn typecheck`, `yarn build artplayer`, then `yarn build:i18n` (core build clears
dist first). `yarn test:package:release` rebuilds and installs a candidate outside the
workspace. Set `ARTPLAYER_BROWSER_ARTIFACTS` to its mapping and run `yarn test:browser`
for real playback, chapter integration, downloads and Blob URLs. Preserve generated
core files in docs/compiled when committing a shippable core change.

For new utility behavior, extend the same old/new contract tests. Clearly separate
intentional defect corrections from preserved behavior. For timers or Blob URLs,
also identify the owner and verify cleanup in the consuming module. Remaining
constructor, playback, UI, Emitter, Component and capability migrations are recorded
in refactor/tasks.json and should extend this map as they land.
