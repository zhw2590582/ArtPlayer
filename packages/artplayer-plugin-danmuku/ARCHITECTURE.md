# Danmuku maintenance map

The compatibility reference is the actual npm 5.3.0 package. Its archive,
historical declarations, earlier exports and failure evidence are indexed in
`refactor/baselines/danmuku-release.json` and
`refactor/baselines/danmuku-contract.md` relative to the repository root. Do not infer runtime contracts from the old declaration file.

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| `src/index.ts` | Plugin factory, facade getters, bound methods, setting and heatmap composition |
| `src/danmuku.ts` | Internal instance, method return identity, configuration/load commits, event and lifecycle wiring |
| `src/config.ts` | Fresh defaults, validation schema, configuration comparison and normalization |
| `src/input.ts` | Input forms, replacement ownership, independent append operations, cancellation and synchronous callback reentry |
| `src/bilibili-parser.ts` | Pure legacy-compatible XML fields, mode mapping and entity decoding |
| `src/bilibili.ts` | Fetch and response text, one parser Worker per request, fallback, settlement and Blob URL cleanup |
| `src/scheduler.ts` | One RAF or asynchronous frame, cancellation generations, preparation ownership and failure recovery |
| `src/renderer.ts` | Owned node allocation, preparation, geometry snapshots, placement, pause/resume styling and disposal |
| `src/queue.ts` | Ordered state pools, eligibility and state transitions |
| `src/worker-client.ts` | Track Worker lifecycle, a shared response dispatcher, unique request IDs and pending requests |
| `src/worker.ts` | Track placement Worker; a separate protocol from the XML parser Worker |
| `src/setting.ts` | Settings coordinator, configuration controls, mount and fullscreen layout |
| `src/setting-template.ts` | Existing template HTML and static icon values |
| `src/setting-slider.ts` | Slider index, pointer and rotation behavior |
| `src/setting-send.ts` | Pending send, original error outlet and lock countdown |
| `src/setting-lifecycle.ts` | Exact subscription/proxy disposal, cancellation and conditional host-property restoration |
| `src/setting-style.ts` | Shared document style and one pending DOMContentLoaded installation |
| `src/heatmap.ts` | Owned control, progress stops, subscriptions and per-instance gradient |
| `src/heatmap-sampling.ts` | Sorted-time bin counts with historical numeric boundaries |
| `src/heatmap-geometry.ts` | Legacy point normalization, caller-visible point writes and SVG curve calculation |

All 20 owned runtime modules use TypeScript. Their responsibilities remain
separate from public declaration compatibility and from release acceptance.
The following files contain types only:

| Module | Responsibility |
| --- | --- |
| `src/types.ts` | Reexports public runtime data types and defines the internal Artplayer host adapter |
| `src/worker-types.ts` | Placement requests, replies, visible rows and virtual boundary rows |
| `src/parser-types.ts` | XML parser results and its independent Worker protocol |
| `src/setting-types.ts` | Settings template slots and slider integration contracts |
| `src/worker-assets.d.ts` | Inline placement Worker module declaration |
| `types/runtime-shared.d.ts` | Single source for accurate option, callback, input, queue, facade, owner and event payload types |

`src/types.ts` imports/reexports `types/runtime-shared.d.ts` with type-only
syntax. Keep shared option/data definitions there; do not create a second copy
in production source. Host, DOM and Worker adapter types remain internal. The
factory composes Danmuku, Setting and heatmap. Danmuku owns queue/state pools and
coordinates input, renderer and scheduler. Scheduler/renderer refer back to the
owner with type-only imports; these references add no runtime module cycle.
The XML parser and heatmap sampling/geometry remain independently testable.

## Declaration entrypoints and type boundaries

The root and `/legacy` declarations retain the exact actual npm 5.3.0 type
source, including historical inaccuracies and extraction behavior. Edit neither
to make runtime implementation checks pass. The additive `/runtime` entrypoint
selects the existing ESM or CommonJS factory with accurate declarations. Its
`runtime.d.mts` entry exposes ESM type exports; `runtime.d.cts` and the
`typesVersions` fallback `runtime.d.ts` expose the callable CommonJS factory
and its type namespace. CommonJS returns the function itself; importing it does
not add a `factory.default` property.

The argument object is required, while its fields are optional. The registrar
returns `RuntimeResult` synchronously. Command methods resolve/return `Owner`,
which is a different object; `emit` is asynchronous even though its initial
insertion work is synchronous. The facade retains its three live getters and
requires a valid target for `mount`. Public data includes mutable point tuples,
typed static icons, normalized filter inputs and queue entries for visibility
callbacks. Filters and visibility callbacks accept truthy results; sending
requires strict `true`. Their `this` is the current normalized option. Loader
functions retain their receiver-free call. `EventMap` supplies named payload
tuples explicitly; importing `/runtime` does not augment old core event types.
It contains types only, with no new event bus or runtime export.

Keep these narrow implementation assertions documented when editing them:

- Native style/dataset writes retain their historical numeric and null values.
  WebIDL performs the conversion; changing source assignments to satisfy DOM
  declarations could change controlled hosts or observable setters.
- Emit/stop state pools own allocated nodes. A frame with a non-null reference
  has its associated item, and release checks node identity. Non-null assertions
  depend on those invariants; they do not replace lifecycle validation.
- The legacy public core type describes `constructor` as `Function`. The
  factory's host adapter narrows it to the existing Artplayer static utilities
  and validator. It introduces no new core capability or minimum core version.
- An omitted internal `postMessage` keeps its old empty-message behavior;
  unsupported margin strings retain the raw historical fallback at the Worker
  boundary. Placement types describe valid scheduler requests, with explicit
  compatibility assertions for those exceptional paths. These internal message
  helpers are not additional methods promised by the public `Owner` interface.

The strict package config disables JavaScript input. Its `ES2021.String` type
library describes the existing XML `replaceAll` calls; it neither introduces a
new runtime dependency nor raises the existing browser requirement. Modern and
legacy build targets remain es2020 and es2015; syntax lowering does not polyfill
`replaceAll` or other browser APIs.

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

Run package commands from the repository root with the pinned Node version and
Yarn Classic 1.22.22:

| Command | What it checks or produces |
| --- | --- |
| `yarn test:danmuku` | Historical and candidate input, parser, Worker, scheduling, rendering, settings and heatmap regressions |
| `yarn test:danmuku-types` | Frozen root declarations, current/legacy compiler consumers, negative cases, implementation assignability and editor types |
| `yarn test:danmuku-types-package` | Packed isolated installs, real entrypoints and consumer module/compiler modes; creates local evidence, does not publish |
| `yarn typecheck` | Strict production sources and the repository consumer type matrix |
| `yarn build artplayer-plugin-danmuku` | Normal package outputs and copied docs artifacts, including the inline TS Worker |
| `yarn dev artplayer-plugin-danmuku` | Local demo rebuild for the package |

Edit `src/` for runtime changes, `types/runtime-shared.d.ts` for shared accurate
data contracts and the corresponding `runtime.d.*` entry for module shape.
Rebuild artifacts through the package script. The frozen root declaration and
historical test helpers are compatibility evidence, not generated repair targets.
Use `refactor/fixtures/implementation/danmuku.ts` when a source/declaration change must
prove assignability to the actual implementation.

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

Long-run native load behavior still requires PKG-DANMUKU-07; cross-plugin/core
combination coverage and final distribution acceptance remain PKG-DANMUKU-08/09.
Check task evidence and the risk register before changing completion or release
status. These commands and short native regressions do not establish npm release
readiness; final checks and release reviews remain separate gates.

## Rendering and UI resources

The scheduler owns whether work may proceed; the renderer owns the actual nodes.
Destroy removes those nodes even when the core retains its HTML. It does not
remove unrelated children. Replacement loading retains the historical whole-layer
clear and starts a fresh node pool. Keep cancellation identity checks in the
scheduler/renderer boundary when moving preparation logic.
Replacement also removes owned nodes moved outside the layer before releasing
their ownership records. Unrelated nodes outside the layer are left in place.

Setting registers its destruction boundary before creating UI. Initialization
failure releases its own resources; the factory also rolls back the previously
created Danmuku and Worker, preserving the original error. Store exact art
subscriptions and proxy disposers. On old cores, use `events.remove` when the
disposer remains registered; calling only the returned function can leave a
registry entry. A disposal failure must not prevent other owned cleanup.

Pending `beforeEmit` is raced against destruction. Preserve its option receiver
and strict `true` acceptance. Ordinary send inserts synchronously, clears input
and starts the existing countdown; observing the emitted Promise must not delay
that UI behavior. Retain `console.error('Error emitting danmuku:', error)` as the
existing send-error outlet. Destruction prevents late input writes and timers.

Mount and fullscreen move the same Setting node. Destroy removes only that node.
Dataset and display writes restore the preceding owner/original value only while
the current value is still owned. Shared mounts must retain the surviving
instance, and subsequent user writes must survive. The injected stylesheet is
document-wide, stays available to other instances and retains import-time
installation. Pending DOMContentLoaded installation is shared and released once
it runs; it is not an instance leak.

Heatmap owns its control and listeners. Removal/replacement detaches them and
must not remove a newer same-name control. The gradient ID is instance-specific;
the first available `heatmap-solids` and local `heatmap-start`/`heatmap-stop` hooks
remain, including repeated bundle evaluation. Zero or invalid sampling
uses a positive default, and invalid dimensions/duration render no SVG. Preserve
fractional step progression and strict-left/inclusive-right time bins. The
original points event clones only the outer array and mutates inner y values;
preserve that observable behavior, including repeated updates.

Issue #958 is a separate density defect from the earlier zero-step/cleanup fixes.
Automatic queue sampling keeps the historical 128-unit Y domain until its
transformed peak exceeds 32 units. Above that threshold, use four times the peak
as the upper domain and constrain endpoints/Bezier controls to the bottom quarter
of the chart. Constraining the control polygon bounds the whole cubic; merely
clipping SVG overflow would retain the tall, flattened block. This is a visual
correction for sampled high density, not a change to queue counts or timing.
Small unfitted curves keep their exact old path, including small Bezier overshoot;
the 25px bound applies to fitted charts, not every possible custom option.

Copy own enumerable option fields once, as the historical Object.assign did;
do not reread getters or treat inherited axis fields as overrides. Finite explicit
Y axes and nonempty custom points bypass fitting and preserve old paths and
caller-visible writes. A resize/loaded event resamples the queue as before.
`test/danmuku-heatmap.test.js` retains historical paths and tests dense bins,
peak differences, control bounds and option property semantics.
`test/browser/danmuku-heatmap-density.spec.js` verifies 16000 uniform, clustered
and mixed rows using native SVG bounds, playback, progress and resizing against
both cores in Chromium/Firefox/WebKit. This is heatmap validation; it is not a
16000-visible-DOM-danmuku throughput or long-duration heap benchmark (task07).

`test/danmuku-setting.test.js` uses Linkedom and real published core utilities
for template parsing, selectors, events and lifecycle tests. Linkedom has no
layout; its measured rectangles are controlled inputs, not browser evidence.
`test/browser/danmuku-resources.spec.js` covers native external/shared mounts,
pending sends, timers, retained-core HTML, initialization rollback and independent
heatmaps. Run it with the scheduler/input specs for source and built artifacts.
Dedicated recovery/new-continuation cases establish a ready item as a test
precondition; obsolete gates and NaN use the actual media clock at 0.25 rate.
These lifecycle preconditions do not establish stress-load timestamp delivery.
The renderer resource cases also begin with an explicitly eligible row, then
require native Worker completion and visible DOM before testing replacement or
destruction. The separate pause/seek/rate case observes the original ready getter
without changing its result and records bounded native media-time/queue samples
to distinguish eligibility misses from placement failures.
