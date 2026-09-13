# Danmuku maintenance map

The compatibility reference is the actual npm 5.3.0 package. Its archive,
historical declarations, earlier exports and failure evidence are indexed in
`refactor/baselines/danmuku-release.json` and `danmuku-contract.md` at the
repository root. Do not infer runtime contracts from the old declaration file.

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| `src/index.js` | Plugin factory, facade getters, bound methods, setting and heatmap composition |
| `src/danmuku.js` | Internal instance, public method return identity, queue commits and events; scheduling is still here pending PKG-DANMUKU-04 |
| `src/config.js` | Fresh defaults, validation schema, configuration comparison and normalization |
| `src/input.js` | Input forms, replacement ownership, independent append operations, cancellation and synchronous callback reentry |
| `src/bilibili-parser.js` | Pure legacy-compatible XML fields, mode mapping and entity decoding |
| `src/bilibili.js` | Fetch and response text, one parser Worker per request, fallback, settlement and Blob URL cleanup |
| `src/worker.js` | Track placement Worker; a separate protocol from the XML parser Worker |
| `src/setting.js` | Settings and emitter UI; lifecycle restructuring follows in PKG-DANMUKU-05 |
| `src/heatmap.js` | Heatmap rendering; restructuring follows in PKG-DANMUKU-05 |

The package is undergoing staged migration. PKG-DANMUKU-03 separates input and
configuration responsibilities in JavaScript; PKG-DANMUKU-06 converts all owned
modules and Worker messages to TypeScript and validates installed consumers.
This intermediate structure is not the final TypeScript or release acceptance.

## Contracts to retain

- The registrar returns its facade synchronously. `emit()` and `load()` return
  Promises resolving to the internal Danmuku instance, which differs from that
  facade. `config/hide/show/reset` return that same internal instance
  synchronously; `mount()` returns undefined. Keep the three live getters.
- `load()` and `load(undefined)` replace only after input succeeds.
  `load(target)` appends without updating `option.danmuku`. Independent appends
  may complete in either order and can append after a replacement.
- Arrays enter synchronously. Empty initial input emits
  `show -> config -> reset -> loaded` before registration returns. Nonempty input
  inserts the first item before the first await, then awaits each `emit()` in
  order. A later invalid item leaves earlier accepted items present.
- A new replacement supersedes an older replacement. Destroy cancels all input
  operations. Cancelled public loads resolve to the same internal instance;
  they do not emit late `loaded/error` events or write stale rows. The input
  Promise itself may be uncancellable; observe its eventual rejection locally.
- Invoke a loader function without an explicit receiver. Invoke the filter
  through the current option so its receiver remains that option. Check load
  ownership again after callbacks and reset events, including synchronous
  callbacks that start another replacement.
- Keep input normalization observable: accepted objects receive missing mode,
  style and color before filtering, and the queue receives a shallow copy.
  Explicit time zero is preserved; missing time defaults to current time + 0.5,
  and negative time is clamped to zero.
- Function and Promise configuration changes use identity. Structurally equal
  ordinary values retain the historical JSON comparison behavior. Validate and
  normalize a prospective option before replacing the current option; invalid
  updates cannot corrupt it. Configuration does not implicitly reload input.
- Keep XML entity order, unpadded hexadecimal colors, numeric conversions,
  extension fields and existing mode mapping. An empty XML document is a valid
  empty result. Fetch/text failures must reach the public load's single error
  outlet and reject it; automatic initial loading observes that rejection.

## Verification and remaining work

`yarn test:danmuku` runs frozen historical contracts/failures and candidate input
and parser regressions. The historical helper and archives must remain frozen;
candidate tests use `test/helpers/danmuku-candidate.js` and may select built
artifacts through `ARTPLAYER_DANMUKU_ARTIFACT`.

`test/browser/danmuku-input.spec.js` uses native video and Blob Workers against
published and candidate cores. Run its source, main and legacy variants after
the normal package build. Browser evidence distinguishes local XML/fault
fixtures from the real Bilibili service, and Windows WebKit from Safari devices.

The older native track-overlap observation remains open until scheduler and
rendering work is verified. A passing input test is not evidence that duplicate
RAF loops, visibility continuations, settings cleanup, heatmap sampling or
long-run load behavior have been fixed. See PKG-DANMUKU-04/05/07 and the risk
register before changing completion or release status.
