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
unchanged. Emitter is now typed as described below; Component remains a later task. Imports from the
barrel must not silently add runtime fields to `Artplayer.utils`.

## Typed Emitter

`src/utils/emitter.ts` keeps the original on/once/emit/off class and a lazy ordinary
object registry. `declare e` emits no instance field; a fresh emitter still has no
own keys. There are no additional prototype methods or mandatory constructor options.

The generic event map associates event names with payload tuples, including readonly
tuples, symbols and optional arguments. An open Record default preserves arbitrary
JS event channels; internal typed consumers can use a closed map or intersect their
known events with an open map. Receiver inference is checked on registration and
erased inside each stored registration, where the original callback and ctx remain paired.
Current JS player consumers remain incremental; public declaration expansion is CORE-07.

Dispatch takes a shallow registration-array snapshot. Normal listeners removed during
dispatch still run if already captured, additions wait for a later dispatch, and a
throw stops that dispatch and propagates unchanged. Off accepts either a once wrapper
or its original callback; duplicate registrations of a callback are removed together.
The once wrapper unsubscribes before invoking user code and now records consumption,
so a nested dispatch cannot execute a captured copy twice. This fixes a demonstrated
old defect without changing ordinary snapshot behavior. Event names such as __proto__
and toString use own properties rather than inherited Object.prototype values.

Shared contracts in test/contracts/emitter.js run against published, workspace and
installed versions. Candidate corrections have separate published-defect observations
in test/public-behavior.test.js and test/browser/emitter.spec.js. The source type fixture
checks event name/payload correlation, receiver types, custom channels and chain typing.
Emitter owns registrations only; instance teardown must remove the relevant callbacks,
not clear unrelated subscribers before destroy dispatch. Internal resource scopes are described below.

## Internal resource ownership

`src/lifecycle/scope.ts` owns synchronous cleanup registrations. `resources.ts` supplies
DOM listener, timeout, animation frame, request-controller and Blob URL adapters;
it depends only on the scope type and native browser APIs. Neither file is exported
from Artplayer or Artplayer.utils. `instance.ts` connects this boundary to construction
and destruction through WeakMaps, adding no fields to public instances. The entry
and most UI modules remain JS; their full TS migrations still have separate tasks.

Create one ResourceScope for an owner and child() for a replaceable operation.
Call operation.dispose() on completion or replacement; it detaches from its parent,
while sibling operations stay live. Disposing an instance closes all remaining
children. add(cleanup) returns an idempotent release function. Registrations are removed
before invoking cleanup; disposal closes the scope first and unwinds in reverse order.
Late registrations are released immediately. Failures do not interrupt other cleanup:
dispose throws one ResourceCleanupError containing the original errors after unwinding.
Explicit release throws its own error immediately and is still consumed. Owners must
handle these errors at their lifecycle boundary without replacing a primary operation error.

Cleanup returns undefined, deliberately rejecting async callbacks in strict TS. An
asynchronous media/SDK shutdown needs a separately awaited owner protocol; do not cast
its Promise to a synchronous disposer. Emitter subscriptions use a per-owner callback
and add(() => { emitter.off(name, callback) }); do not remove unrelated subscriptions.

DOM adapters preserve function receivers and object handleEvent receivers, snapshot
capture, and release once/aborted subscriptions. They are internal registrations with
their own wrappers, not a replacement for the public Events.proxy identity contract.
Timer/RAF callbacks detach before invoking work and guard queued callbacks after
cancellation. They allocate nothing when closed. Request controllers are optional on
engines lacking AbortController: consumers still need closed/generation checks and
must own rejected fetch Promises. Release a completed request's operation scope to
avoid retaining its controller. objectURL only accepts a Blob it creates a URL for;
it never adopts a caller URL. A closed scope immediately revokes the newly created URL.
wait(scope, delay) resolves true when its timer finishes and false when disposed;
it does not reject on cancellation or leave a pending Promise. Consumers must check
both the result and scope.closed immediately after awaiting, since destruction can
occur between timer completion and their microtask continuation.

Run `yarn test:unit` and `yarn typecheck` for scope failures, reentry, ownership,
controlled timers, queued RAF and type rejection cases. `resource-scope.spec.js` runs
an explicitly identified es2015 internal-source fixture in all three Playwright
engines with native DOM, RAF, timers, fetch abort and URL access. That internal fixture
is distinct from lifecycle.spec.js, which exercises the actual player candidate.
Fresh fetches test URL revocation; decoded image caches are not a reliable revocation
oracle. Keep adapter tests and owner integration tests separate and extend both when
moving an existing resource into this boundary.

## Construction and destruction

Construction validates options before creating a scope, then initializes the existing
subsystems in their historical order. Template reserves the container before mutating
it, so reentrant construction cannot claim the same container before instances.push.
`template-rollback.ts` captures original nodes, child order, text and attributes before
mounting. Success drops the rollback closure; failure restores the same original nodes,
including existing DOM listeners and SSR node identity. The two Element casts follow
nodeType checks. This is DOM rollback, not a rollback of arbitrary user callback side
effects, native media state, external nodes, storage or requests outside the scope.

Events registers cleanup before installing listeners, so a throw during new Events
is covered even before art.events is assigned. Constructor failure releases initialized
resources, removes any registry entry, marks isDestroy, emits destroy for plugin-owned
cleanup and restores the original container. The original constructor error is rethrown;
secondary cleanup failures are reported separately. A synchronously destroyed constructor
result is not added to Artplayer.instances. Async plugin result registration remains CORE-08.
Container ownership lasts through failed-constructor cleanup and rollback, preventing a
new mount inside its destroy callback from being overwritten by the old rollback. Normal
destroy releases the container before its event, allowing a replacement to mount there.

Normal destroy keeps the order reset -> owned resource/DOM listener cleanup -> template
removal or art-destroy -> registry removal -> isDestroy=true -> destroy event. An internal
guard closes reentry before reset without changing the public isDestroy value observed
inside reset. Repeated calls do nothing, including after destroy(false); they cannot erase
a replacement player's DOM or splice an unrelated instance at index -1. Resource, template
and destroy-event failures are attempted independently; the first thrown value propagates
unchanged after cleanup. Emitter's normal exception rule still stops later subscribers in
the same dispatch; core cleanup no longer depends only on those subscribers.

Current ownership covers Events, resize debounce, Info's loop, Notice's timer, update RAF,
setting mounted callbacks and wait continuations for customType/empty URL, quality setup
and reconnect. Events.proxy keeps original listener identities and destroyEvents shape;
after the instance closes it returns inert disposers. Notice refuses new work after closure.
The public standalone debounce/throttle/sleep utilities retain their original APIs.

Remaining per-module migration includes view throttling and optional built-in plugin timers
(CORE-17/18), progress/thumbnail work (CORE-19), subtitle requests/Blob URLs (CORE-15),
switch Promise settlement (CORE-09), and async plugin results (CORE-08). These are not
covered by the claim that BASE-LIFE-04/05 and the specific BASE-PERF-01 resize defect
are fixed. Extend resource ownership and its actual owner tests as those tasks land.

`test/instance-lifecycle.test.js` verifies ordering, reentry, thrown-value preservation
and the timer-to-microtask destruction race. `test/browser/lifecycle.spec.js` covers
published double-destroy behavior versus its correction, plugin/proxy/partial-Events
constructor failures, SSR rollback, normal resize and destroyed delayed work. Run the
complete installed-candidate browser suite alongside playback/chapter when changing this
boundary; source-only tests cannot establish packaging or real media compatibility.

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
constructor, playback, UI, Component and capability migrations are recorded
in refactor/tasks.json and should extend this map as they land.
