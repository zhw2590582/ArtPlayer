# Danmuku maintenance map

The compatibility reference is the actual npm 5.3.0 package. Its archive,
historical declarations, earlier exports and failure evidence are indexed in
`refactor/baselines/danmuku-release.json` and `danmuku-contract.md` at the
repository root. Do not infer runtime contracts from the old declaration file.

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| `src/index.js` | Plugin factory, facade getters, bound methods, setting and heatmap composition |
| `src/danmuku.js` | Internal instance, method return identity, configuration/load commits, event and lifecycle wiring |
| `src/config.js` | Fresh defaults, validation schema, configuration comparison and normalization |
| `src/input.js` | Input forms, replacement ownership, independent append operations, cancellation and synchronous callback reentry |
| `src/bilibili-parser.js` | Pure legacy-compatible XML fields, mode mapping and entity decoding |
| `src/bilibili.js` | Fetch and response text, one parser Worker per request, fallback, settlement and Blob URL cleanup |
| `src/scheduler.js` | One RAF or asynchronous frame, cancellation generations, preparation ownership and failure recovery; DOM preparation moves to a renderer in PKG-DANMUKU-05 |
| `src/queue.js` | Ordered state pools, eligibility and state transitions |
| `src/worker-client.js` | Track Worker lifecycle, a shared response dispatcher, unique request IDs and pending requests |
| `src/worker.js` | Track placement Worker; a separate protocol from the XML parser Worker |
| `src/setting.js` | Settings and emitter UI; lifecycle restructuring follows in PKG-DANMUKU-05 |
| `src/heatmap.js` | Heatmap rendering; restructuring follows in PKG-DANMUKU-05 |

The package is undergoing staged migration. PKG-DANMUKU-03 separates input and
configuration responsibilities in JavaScript; PKG-DANMUKU-04 separates scheduling
and track requests; PKG-DANMUKU-06 converts all owned
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
  Explicit time zero is preserved; missing time and `NaN` default to current
  time + 0.5. The historical validator accepts `NaN` as a number, so preserving
  zero must not accidentally remove that fallback. Positive infinity remains
  positive infinity; negative values, including negative infinity, clamp to zero.
- Function and Promise configuration changes use identity. Structurally equal
  ordinary values retain the historical JSON comparison behavior. Validate and
  normalize a prospective option before replacing the current option; invalid
  updates cannot corrupt it. Configuration does not implicitly reload input.
- Keep XML entity order, unpadded hexadecimal colors, numeric conversions,
  extension fields and existing mode mapping. An empty XML document is a valid
  empty result. Fetch/text failures must reach the public load's single error
  outlet and reject it; automatic initial loading observes that rejection.

## Scheduling ownership

Keep at most one pending RAF or asynchronous preparation frame. Native `play`
and `playing` both invoke the existing start path and retain its events, but
must not create competing loops. Ready items precede wait items; wait selection
retains the current-time +/- 0.1 second window and state-pool order. Keep the
existing track algorithm and geometry fields until separately reviewed.

Pause, reset, successful replacement input commit, hide, seeking, destroy and replacing the
`beforeVisible` callback invalidate unfinished preparation. Cancellation races
the user Promise so an unresolved callback cannot prevent later work. A frame
owns its allocated node; check that node identity before recycling it, and check
the generation after each await or callback. Existing emit/stop nodes survive
hide, seeking and callback changes; reset retains its explicit reset behavior.

Seek does not implicitly reset already displayed or paused comments. Date.now
still measures wall-clock lifetime, excluding paused time. With synchronous
playback enabled, new comments sample speed/playbackRate when allocated; active
comments retain their assigned remaining seconds. Do not change these timing
rules as incidental cleanup.

A rejected `beforeVisible` reports its original error once and excludes that
item from further attempts in the current run. Explicit start, reset, an
invalidation or replacement callback permits another attempt if the item is
still eligible. False results retain their ordinary next-frame evaluation.
Other items can continue after a rejection. Error-listener failures are observed
locally and logged instead of creating a detached rejected RAF Promise.

A track Worker fault rejects its pending requests with the original error,
disposes that Worker and reports one error, then halts internal scheduling.
It does not fabricate a public stop event. A later start/reset rebuilds the
Worker; repeated failure waits for another explicit recovery opportunity.
Cancelled internal requests resolve `{ id, result: undefined }` instead of
remaining pending forever. Normal responses preserve `{ id, result }`.

Recovery error listeners run synchronously and can call destroy, stop, reset,
hide or start again. After recovery, the outer start must recheck destruction,
stop and fault state, its cancellation generation and its start-attempt identity
before continuing paused rows, scheduling or emitting start. Generation checks
protect reset/hide and other invalidation; the attempt identity also protects a
nested start that succeeds without changing the generation. Do not let the outer
call revive stopped rows or add a second start event after a nested recovery.
Ordinary repeated starts still retain their historical events and internal
return identity. Recovery tests restore a working Worker factory before a
single nested action; they do not manufacture an infinite retry loop.

Install the shared handler before sending requests. IDs are unique across
requests and Worker replacement, including multiple requests in one millisecond.
Late, unknown and duplicate replies do not settle a different request.

## Verification and remaining work

`yarn test:danmuku` runs frozen historical contracts/failures and candidate input,
parser, scheduler and Worker regressions. The historical helper and archives must remain frozen;
candidate tests use `test/helpers/danmuku-candidate.js` and may select built
artifacts through `ARTPLAYER_DANMUKU_ARTIFACT`.
The input tests compare `NaN` and both infinities against frozen source and real
npm main/legacy artifacts. Preserve those historical assertions alongside the
explicit-zero correction when changing numeric normalization.

`test/browser/danmuku-input.spec.js` uses native video and Blob Workers against
published and candidate cores. Run its source, main and legacy variants after
the normal package build. Browser evidence distinguishes local XML/fault
fixtures from the real Bilibili service, and Windows WebKit from Safari devices.

`test/browser/danmuku-scheduler.spec.js` verifies native callback cancellation,
three modes, strict dense geometry, one request per prepared item, native
pause/seek/rate and visible-node reuse. Preserve both geometric and protocol
assertions; unique IDs alone do not prove non-overlapping tracks.

Settings cleanup, heatmap sampling and long-run load behavior still require
PKG-DANMUKU-05/07. Check task evidence and the risk register before changing
completion or release status; short native regressions are not package-wide
stability acceptance.
