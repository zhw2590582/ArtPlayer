# Core implementation and migration map

ArtPlayer keeps its existing constructor, player mixins, plugins and DOM/CSS hooks.
The production entry is still `src/index.js`; this document marks actual migrated
boundaries rather than describing the entire core as TypeScript.

## Builtins and prompts (CORE-18)

`src/notice.ts` owns the notice timer and DOM visibility. Its minimal host, private
WeakMap generations and closure checks prevent expired or reentrant writes from
overwriting newer messages. Public art/timer fields and destroy/show methods remain.
False/empty assignment only hides the notice; the old pending expiry still clears
its text. Manual notice.destroy cancels the timer without hiding or permanently
disabling a live instance. The source getter is boolean; the legacy public message
read type remains tracked by BASE-TYPE-07 for compatible coordination in CORE-21.

`src/plugins/fastForward.ts` wires the unchanged plugin result and input events.
`src/input/long-press.ts` owns one press at a time in the current source scope,
including its timer and previous playback rate. Touch move/end/cancel, lock, pause,
source disposal and player destruction release the press. The native media element
still performs its own defaultPlaybackRate reset on load/source replacement.
Resource cleanup must not create a second press or overwrite a newer reentrant one.
The typed builtin factory cast is confined to the existing JS constructor boundary;
CORE-20 must revisit it when the full constructor host becomes typed.

Run `test/notice.test.js` and `test/fast-forward.test.js` through the Node runner;
their matching `test/types` fixtures check source inference and retained consumers.
The matching browser specs compare frozen releases with candidate builds using
actual video playback and controlled DOM touch events. They do not certify physical
touch devices.

`src/plugins/autoPlayback.ts` keeps the resume plugin's name/times/clear/delete
surface. `auto-playback/records.ts` writes the existing times member of storage
using option.id or option.url. Keep its historical strict `length > max` pruning
and single-oldest deletion; changing the retention policy is a separate behavior
decision. Playback recording remains instance-owned when the prompt layer is removed.
`auto-playback/prompt.ts` prepares the original DOM before recording is subscribed,
then installs ready/restart handlers. Each prompt owns its click listeners, one
first-timeupdate subscription and timer under its layer, and is also cancelled by
source disposal. Restart keeps only the latest resume target. Close only hides the
prompt; seek/play precede poster/prompt hiding unless reentry invalidates that work.
Extend `test/auto-playback.test.js`, its type fixture and browser spec for storage,
restart, source/layer lifecycle, or actual resume playback changes.

`src/plugins/lock.ts` preserves class -> isLock -> lock event ordering, including
notifications for repeated assignments. Its icon subscription belongs to the lock
layer; removing that layer does not disable a live plugin's state API. Destruction
does disable further writes through retained setters/clicks. `miniProgressBar.ts`
keeps its name-only result and control-driven class, with an instance-owned
subscription. Both stay in one file because their responsibilities remain small.
`test/builtin-layers.test.js` and its browser/type fixtures cover these contracts
and the mobile/desktop, live/VOD builtin installation matrix. User-agent fixtures
exercise the branch conditions, not physical mobile capability certification.

`src/info.ts` owns a single initialization generation without adding public fields;
`src/info/poll.ts` reads the current initialization's panel/media targets, converts
media values as the native textContent setter does, and owns its timer and close
listener. Reinitializing replaces that work; mobile construction still waits for an
explicit init. Polling continues while the panel is hidden to preserve old behavior.
`src/loading.ts` retains its simple icon insertion and Component facade.
`src/mask.ts` keeps its original destroy listener position so earlier/later consumer
observers see the same icon states. The internal lifecycle finalization scope runs
after destroy event dispatch (even on error) and performs any missing terminal
display/cleanup. Direct root-scope disposal releases finalizers after root resources.
Use this phase only for work whose original event order must remain observable;
ordinary timers/listeners still belong in the root or feature scope.
`test/prompt-components.test.js` and its browser/type fixtures cover these modules,
including getter/DOM reentry, conversion, listener order and throwing observers.

## Keyboard input (CORE-17)

hotkey.ts retains the art/keys own fields, init/add/remove prototype methods, plain
keys-object prototype, caller-visible callback arrays and chainable registration.
input/hotkey-types.ts describes its minimal generic host and callback receiver;
input/hotkey-defaults.ts creates stable default handlers so repeated init neither
multiplies callbacks nor prevents explicitly restoring removed defaults. Public init
still enables manual mobile keyboard handling; automatic construction stays desktop-only.

input/keyboard-focus.ts resolves the event document, falls back to the player's current
ownerDocument and follows open shadow focus/composed targets. Native input, textarea,
select, inherited/plaintext editing and IME composition suppress hotkeys while preserving
the generic keydown event. Existing modifier suppression remains. This fixes typing being
intercepted after bindGlobalEvents or inside shadow roots. The global binding itself is
owned by events/globalInit.ts, described below.

The instance scope removes the one keyboard subscription and callbacks check destruction
before continuing or emitting success. Ordinary synchronous errors still propagate with
their identity. Callback dispatch intentionally retains historical live-array mutation
and this=art semantics. Own-property registration makes prototype-named keys safe without
changing the public keys prototype. Direct editing of those arrays remains observable.

Run `node --test test/hotkey.test.js test/playback.test.js` and
`yarn test:browser test/browser/hotkey.spec.js`. Browser tests exercise native typing and
play/pause/seek/volume/Escape, iframe and shadow editors, controlled IME and mobile-UA
initialization, and callback destruction. Controlled composition/mobile UA is not physical
keyboard/IME/device certification. Input and scheduling share instance ownership;
the refactor progress record tracks final installed UMD/legacy acceptance.

## Native listeners and global targets (CORE-17)

events/index.ts keeps the compatibility facade with the original bound proxy/hover
methods and destroyEvents Set. events/listener-registry.ts owns native registration,
capture snapshots, array rollback, abort and explicit cleanup. Native callback identity
is preserved: direct removeEventListener with the original callback still works. Null
options keep their historical native defaults. Duplicate callbacks retain native
deduplication; disposal is not reference counted. Native once removes the listener itself,
while its bookkeeping remains until explicit disposal or owner cleanup. Abort removes
both the listener and its owned record. Failed removals warn and remain retryable;
a target that permanently refuses removal cannot be forcibly cleaned up.

events/global-types.ts defines the minimal host, registry and source interfaces.
events/globalInit.ts stages document/window listeners, forwards only from the committed
binding, and retains the old binding if registration fails. A generation counter stops
an interrupted binding from overwriting a newer nested bind; owner destruction prevents
late activation. The original event object, forwarding names, void return and independent
document/window fallback rules remain. Manual Events.destroy still permits later reuse
while the player is alive. events/types.ts composes the typed initializer hosts without
adding runtime fields or changing initializer order.

Run `node --test test/listener-registry.test.js test/global-events.test.js` and
`yarn test:browser test/browser/listener-registry.spec.js test/browser/global-events.spec.js`.
Tests cover actual iframe targets and native once/abort/callback identity; injected
registration/removal failures exercise cleanup without asserting platform failure rates.

## Pointer interaction (CORE-17)

events/clickInit.ts retains synchronous click counting, the inclusive double-click
threshold, live constructor settings and existing desktop/mobile actions. It checks
instance closure after caller callbacks, preventing playback/fullscreen actions after
destruction. input/pointer-focus.ts owns click/contextmenu emitter subscriptions while
preserving isInput's historical INPUT-only meaning and composed-path focus checks.
input/pointer-types.ts keeps host and native registry requirements explicit.

events/hoverInit.ts and moveInit.ts retain original events and class-before-notification
ordering, with guards against stale callbacks. Emitter listeners still use their explicit
ctx argument; unlike hotkey callbacks, they do not acquire this=art automatically.
Public player methods remain non-configurable and are not replaced by these changes.

`test/pointer-events.test.js` verifies boundaries, nesting, callback failures, rejected
playback, destruction and owned focus cleanup. `test/browser/pointer-events.spec.js`
compares old/new events, controlled failure paths and actual trusted mouse input with
real media playback. Android UA coverage exercises branch logic, not a physical device.

## Touch gestures (CORE-17)

events/gestureInit.ts installs the mobile-only listeners; gesture=false still retains
progress touches and isLive skips gesture installation. input/gesture-controller.ts
owns the active touch, source snapshot and orientation, plus end/cancel/lock subscriptions.
input/gesture-direction.ts preserves the two-pixel threshold and diagonal boundaries;
gesture-types.ts describes the minimal host and drag state. Normal video gestures keep
TOUCH_MOVE_RATIO, progress gestures keep their full-width multiplier and rotated gestures
use the vertical axis. Invalid geometry or a cancelled/replaced session cannot resume
the previous drag. Callback errors retain identity; nested gestures supersede interrupted
work, and destruction prevents subsequent seek/bar/notice writes.

control/progress/position.ts now accepts a minimal position host and an optional lifetime
predicate between its bar notification and seek. Existing two-argument desktop callers
retain their default behavior. Global events add document:touchcancel with the original
Event payload; its public declaration is additive. Direct local cancellation also works
when document forwarding has been rebound. Source changes cancel through source identity
rather than depending on delayed media events.

`test/gesture.test.js` covers axes, absolute/relative ordering, reentry, invalid geometry,
source/rotation/lock/finger changes and cleanup. Browser gestures use controlled touch
payloads with actual media and DOM targets. They check requests before first play and
actual seeking after playback initializes the decoder; they do not certify physical
touch delivery, native scrolling arbitration or mobile OS cancellation behavior.

## Input scheduling and Events facade (CORE-17)

events/resizeInit.ts retains debounce coalescing, live RESIZE_TIME, normal auto-size,
aspect-ratio restoration and notice cleanup. It guards later writes after caller reentry
and listens to the owner's screen orientation by event capability rather than onchange
being non-null. events/viewInit.ts owns a leading-only throttle, captures SCROLL_TIME at
installation, reads SCROLL_GAP live and preserves synchronous nested dispatch. Its reset
timer and internal subscriptions are released at destruction. Public throttle/debounce
utilities retain their existing independent behavior.

events/viewport.ts uses the container's current ownerDocument/defaultView, preserving
existing edge and gap arithmetic after iframe adoption. events/updateInit.ts keeps RAF
opt-in, the initial playing emission and one pending owned frame; paused players do not
emit raf, and destruction inside a callback cannot schedule another frame. An explicit
destroy notification still cancels the pending frame while the owner is alive.

events/subscriptions.ts provides typed, guarded, owner-scoped emitter subscriptions;
scheduling-types.ts describes the event maps and minimal scheduling hosts. The TS Events
facade keeps its own destroyEvents/proxy/hover/bindGlobalEvents properties, prototype
methods, bound proxy/hover behavior and scalar/array disposer returns. It declares the
rebinding property without emitting an extra class field during construction.

`test/event-scheduling.test.js` verifies debounce/throttle/RAF ownership and reentry.
`test/browser/event-scheduling.spec.js` compares public facade shape, real animation
frames/playback, orientation event capability, timer cleanup and adopted iframe visibility.
Controlled orientation targets do not certify physical device orientation.

## Display modes (CORE-16, in progress)

player/autoSizeMix.ts, autoHeightMix.ts, aspectRatioMix.ts and flipMix.ts retain the
own-property facades, detached method binding, synchronous returns and normal events.
display/sizing.ts contains geometry only; sizing-types.ts describes the minimal hosts.
Zero/unready/non-finite media or container dimensions defer auto sizing without layout
writes or invalid height events; the next valid call measures and applies normally.
Aspect ratios retain split/Number coercion, datasets, notices and repeated events.
Malformed or unusable ratios do not partially overwrite existing video geometry.
Flip keeps custom strings and falsy normalization. Closing instances ignore these writes.
Run `node --test test/display-sizing.test.js` and
`yarn test:browser test/browser/display-sizing.spec.js` for geometry invariants, old/new
property contracts, hidden-container recovery, notices and destruction. Composition with
screen rotation is tested below; final installed-artifact acceptance remains a CORE-16 gate.

plugins/autoOrientation.ts composes the mobile-only builtin, retaining its name/state
getter and mismatch rule. It rejects unready geometry and scopes the two ArtPlayer event
subscriptions. orientation-types.ts models the minimal host and optional platform lock.
The builtin registry currently bridges its generic JS host at this one assembly boundary;
the complete constructor host remains for CORE-21, without widening the implementation.

display/orientation-web.ts owns delayed rotation and its four inline style properties.
Each new fullscreen session cancels the previous timer. Repeated entry reapplies dimensions
without replacing the first snapshot. On ordinary exit fullscreenWeb has already restored
the full entry style, so rotation only clears its flags; destroy restores rotation properties
before fullscreenWeb performs its own final restoration. Resize may update control CSS
variables independently. The scope cancels timers and removes subscriptions on destruction.

display/orientation-native.ts owns lock requests, error notices and fullscreen rotation
classes. It calls lock synchronously, marks success only while current, and cancels on exit
or destroy. A weak per-platform-object token prevents cancelled or older instances from
unlocking a newer ArtPlayer request. Late cancelled success is released; obsolete failures
cannot overwrite current notices. Unlock is best effort, consistent with the prior API;
arbitrary application calls outside ArtPlayer cannot be tracked as owned locks.

Run `node --test test/display-orientation.test.js` and
`yarn test:browser test/browser/display-orientation.spec.js` for cancellation, retry, shared
screen ownership, repeated entry, styles, timers, real rotated playback and ratio/flip
composition. The browser fixture uses a mobile UA with desktop engines and controlled
orientation.lock; it does not establish physical screen rotation or safe-area device support.
The [Screen Orientation specification](https://www.w3.org/TR/screen-orientation/) permits
platform preconditions for lock and defines superseding requests; capability and device
acceptance must stay distinct from controlled request-state tests.

player/fullscreenWebMix.ts is the boolean property facade. display/web-fullscreen.ts
owns a single entry-session snapshot, reentry generations and destroy restoration;
display/placement.ts captures the original parent and next sibling. Repeated entry
preserves the first snapshot while keeping the existing true events. Exit restores
the captured position even if FULLSCREEN_WEB_IN_BODY changes while active. Destruction
restores the player before template.destroy, so removeHtml still owns the same tree.
Failed exit retains the snapshot for retry; reentrant event/DOM callbacks supersede
the earlier setter. Normal fullscreenWeb/resize ordering remains synchronous.

Destroy is terminal: if restoring the original position throws before reattachment,
detach the displaced player so template cleanup cannot leave an orphan in body. The
original error still propagates; if detachment also fails, the lifecycle collector
retains both failures. A node already returned to its owner is left for normal
removeHtml handling. This exceptional fallback can leave retained HTML detached.

Restore the exact style attribute before the exit event; downstream resize handlers
may update their own CSS variables. display-web.spec.js checks that distinction along
with original placement, repeated entry, failure, reentry and destruction. The native
fullscreen/PiP/mini/sizing/rotation paths have migrated source, while complete
acceptance remain CORE-16; this section does not certify physical mobile devices.

player/fullscreenMix.ts still installs the fullscreen descriptor once after metadata.
display/fullscreen-adapter.ts reuses the unchanged screenfull vendor method mapping;
display/native-fullscreen.ts owns instance state, native events, cancellation and notices.
The getter and exit operation concern this player's container/video, not any document
fullscreen element. Normal fullscreen events precede class changes and resize. Reentrant
setters invalidate stale work while same-state reentry still updates the interface.

display/fullscreen-request.ts invokes the native API on the caller stack, preserving
transient user activation. Native Promise results remain authoritative for their errors;
void prefixed APIs settle from change/error events. Void exit waits until neither the
instance player nor video owns fullscreen, even
when the request target was the player. Another element becoming fullscreen completes
the old exit without giving this instance ownership of that new element. Cancelled calls
settle promptly and lose their instance listeners. Descriptor callers can observe rejection identity;
ordinary assignments report a notice without creating an unhandled rejection.

Unabortable void entry has no Promise to observe after destruction. Only cancellation
of that path creates display/fullscreen-abandoned.ts's document-lifetime change guard.
It keeps weak element keys and native exit operations, never player instances/scopes;
unrelated targets are ignored and a new entry clears the old cancellation. This shared
guard intentionally outlives instances, unlike their ordinary change/error listeners.
Post-destroy native exit is best effort: browser denial cannot be undone synchronously.

Run `node --test test/display-native.test.js` for controlled async/reentry semantics.
For native gesture, recovery and subtitle checks:

```sh
yarn test:browser test/browser/display-native.spec.js test/browser/display-web.spec.js test/browser/subtitle-lifecycle.spec.js
```

Void cancellation in desktop browsers uses controlled native methods; it does not certify
old browser versions or iOS video-only fullscreen. Remaining failure boundaries and
final installed distribution acceptance remain in CORE-16.

display/video-fullscreen.ts owns the video-only WebKit fallback. It retains the
synchronous property setter and native thrown error, and listens to video begin/end,
presentation-mode changes and the existing document event bridge. The state helper in
display/video-fullscreen-state.ts distinguishes fullscreen from PiP when a presentation
mode exists, otherwise reads webkitDisplayingFullscreen or the video event fallback.
Repeated signals emit one transition; an exit failure retains actual state for retry.

Destroy releases all instance listeners and exits active video presentation. A pending
unabortable entry leaves only a static listener on that video with a weak cancellation
mark; this callback references no ArtPlayer/scope and exits late entry. New entry removes
the cancellation. Synchronous exit failure during destroy propagates through the normal
lifecycle cleanup collector; late cancellation cleanup is best effort. No document-wide
listener is installed for this video-only path.

Use `node --test test/display-video-fullscreen.test.js` and
`yarn test:browser test/browser/display-video-fullscreen.spec.js` for controlled fallback
checks, plus native/fullscreenWeb/subtitle tests for composition. The desktop fixture
forces the fallback and emulates native video events; it does not prove physical iOS
presentation or gesture behavior. Apple documents the distinct video events in
[Controlling Media with JavaScript](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html).

player/pipMix.ts chooses callable native, WebKit or unsupported capabilities and installs
the original property descriptor. display/native-pip.ts keeps the element/null getter,
void setter, native entry/leave events and failure notices. It never exits another
video's PiP; revisions suppress obsolete notices, cancellation rejects late entry, and
destroy disposes listeners before exiting owned presentation. Request invocation remains
synchronous for transient activation. Async rejection is handled internally because the
historical void setter cannot expose a Promise; native synchronous errors still throw.
An old queued leave event is ignored while this video still owns the current PiP session;
actual ownership loss continues to emit the existing false notification.

display/webkit-pip.ts keeps its boolean getter and initial inline setup. It observes both
presentation-mode and PiP events, deduplicates native signals, and retains repeated
synchronous setter notifications. Capability is checked at entry so later media readiness
can allow retry. Cancelled pending entry leaves only a static video-held callback and weak
mark, with no art/scope closure. Inline cleanup never exits a different fullscreen mode.
Destruction's synchronous WebKit failure follows the normal lifecycle error collector;
late cleanup is best effort. Platform UI remains the browser's responsibility.

The internal PipProperty reflects the branch-dependent getter. Historical public boolean
declarations remain unchanged pending BASE-TYPE-10 / CORE-21; this is an explicit legacy
declaration discrepancy, not a reason to convert native JS consumers to boolean.
Run `node --test test/display-pip.test.js` and
`yarn test:browser test/browser/display-pip.spec.js test/browser/display-pip-webkit.spec.js`.
The actual native test records capabilities and, when supported, a native window, media
progress, exit and fullscreenWeb/native-fullscreen transitions. WebKit event injection
is separate from physical Safari/iOS validation. See the
[PiP specification](https://w3c.github.io/picture-in-picture/) and
[Apple's presentation-mode API](https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls).

player/miniMix.ts keeps the boolean mini descriptor. display/mini.ts owns entry/exit
generations and video placement; mini-view.ts owns popup creation, controls, playback
subscriptions and node removal. mini-drag.ts owns document mouse subscriptions and drag
state; mini-layout.ts calculates finite saved/default coordinates and viewport bounds.
The first popup keeps video-first DOM order and its default display; reuse moves the video
last and uses flex as before. Repeated true/false events and storage keys left/top remain.

Capture the original video parent and next sibling once per mini session. Exit restores
that location, with the snapshot retained on failure for retry. Detach the snapshot before
restoring DOM so a reentrant entry can capture its own placement. Serialize entry during
view creation to avoid duplicate popups from custom icon getters. Failed creation disposes
its partial view; hide/destroy during construction never leaves visible stale UI.

Created popups and playback/drag listeners belong to the instance scope; hide keeps a
reusable hidden popup but cancels drag, and destroy removes owned nodes and restores the
video. A caller-provided template.$mini stays caller-owned and regains its prior display
on destroy. Drag uses client coordinates for fixed positioning, clamps its final position,
and writes numeric left/top. Normal defaults retain a 50px inset; non-finite/offscreen
storage resets, and CSS max-width/max-height keep the popup inside a smaller viewport.

Run `node --test test/display-mini.test.js` and
`yarn test:browser test/browser/display-mini.spec.js test/browser/display-pip.spec.js`.
Browser checks include video placement, playback buttons, actual drag, failure/reentry,
caller ownership, narrow screens and transitions from mini to web fullscreen/native PiP.
Final installed display-mode acceptance is still pending with CORE-16.

## Subtitles (CORE-15)

src/subtitle/index.ts keeps the Component prototype, bound update, public methods and
normal URL results. The request, parse, state, track and render modules now separate
transport cancellation, conversion, ownership, native DOM events and cue rendering.
The offset mixin remains the player property entry, with original cue bounds retained
on native cue objects. Validation evidence and remaining release gates live in refactor/.

request.ts races work against scope closure. Superseded requests settle undefined even
when the transport ignores AbortSignal; active failures reject. state.ts owns request
and track scopes and only generated object URLs. A caller-owned URL is never revoked.
Replacing a track for native fullscreen keeps the same owned subtitle resource.
parse.ts delegates SRT/ASS conversion to the public utility parsers, preserving callback
this and type/extension/encoding behavior. Unknown formats retain the caller URL.
render.ts retains the line/group markup and uses current global subtitle.escape; a
switch-specific escape override does not silently change the legacy rendering contract.
Before-update listeners may still edit cues; switching/destroying prevents obsolete DOM
writes. Disabled text tracks return empty cue arrays; native cue identity is preserved.

To change transport policy start with request.ts and index.ts; to change native track
ownership start with track.ts and state.ts. Run test/subtitle.test.js, the browser
subtitle-lifecycle and declarations specs, and strict source/consumer type checks.
Track generations prevent a reentrant replacement from losing its callbacks when an
older registration returns or throws. Failed insertion restores the previous node;
cleanup failures after commit retain the new resource and remain observable to callers.
Track load errors notify only while that node is current; all owned load/error/cuechange
callbacks are cleared on replacement or destroy. HTTP errors reject before conversion.
Constructor and URL-setter calls report through notice and consume their otherwise
unobservable rejected promises; explicit init/switch calls keep rejection semantics.
Public cue event inference remains tracked by BASE-TYPE-07 / CORE-21. Browser-engine
tests do not certify physical iOS/Safari fullscreen or every proxy implementation.

## Settings (CORE-14)

setting/index.ts remains the specialized manager: panel cache keys are option arrays,
add/update return the original item, remove returns undefined and missing find returns
null. A narrow constructor type view preserves the actual Component prototype chain
without imposing its incompatible string-keyed cache or registry return types.
It delegates tree work to setting/model.ts and measurement to setting/layout.ts.
The tree model preserves object/array identity and immutable hidden getter descriptors,
while rebinding a removed/moved node to its current parent. Automatic names skip explicit
names anywhere in the tree. Structural validation runs before installing bindings;
traverse retains preorder and callback-driven child insertion. Model ownership uses
an opaque owner state and root scope, with no direct player/manager reference. Closing
the owner clears its root and scope references so bindings do not retain the old owner.
It rejects an item that still belongs to another active tree before modifying either
tree. Removing the subtree or closing its owner permits original-object reuse, with
the same immutable getters and event array. Simultaneous sharing was already broken
in the published player (the second instance had no row); it now reports an explicit
ownership error instead of allowing the new player to steal the first player's row.

The layout module computes dimensions independently from DOM reads. Width is bounded
by player width and resolved bottom padding; height fits above actual control rows,
using the existing scrolling panel. Control coordinates account for CSS scaling.
The existing right-edge CSS fallback and mobile/rotation positioning branches remain.
render.ts now owns DOM/descriptor rendering, selection.ts owns callback generations,
and resources.ts owns item listeners, deferred mounts and recursive panel disposal.
The four builtin setting factories are TS and release their Emitter subscriptions.
events.ts owns root subscriptions and size/style observers. Control height changes
can animate the panel's bottom offset; transitionend recalculates its final height.
The MutationObserver fallback also consumes the existing resize event for container
changes. All these callbacks stop when the instance closes.

Failed additions unlink the attempted entry without releasing a duplicate's existing
listeners. Successfully formatted new entries also release partial render resources.
registration.ts prevents an obsolete failed add from removing a reentrant successful
add/update of the same object; removal and update supersede the pending registration.
Removal finishes row cleanup and root rendering even if event removal throws, then
reports collected errors. Nonextensible metadata and unwritable generated names are
checked before binding earlier entries. These checks do not roll back arbitrary
user getter/setter or Proxy side effects.

panels.ts gives each cached panel a root-owned scope. Rows are child scopes and the
back header is owned by its panel while retaining the parent's public event array.
Disposing the panel removes its cache entry, listeners, pending mounts and DOM.
New-panel rendering checkpoints item descriptors and the original position of raw
content nodes, without calling user getters. A failure restores those inputs, the
previous active panel and owned layout properties. Creation stops if a header hook
removes the parent or destroys the instance.

update.ts suspends the old subtree instead of disposing it before assignment. The
same public event array temporarily holds only replacement registrations; suspended
scopes retain their old registrations privately. activity.ts prevents suspended
callbacks and asynchronous writes. Success disposes the old resources; failure
resumes the original registrations and restores descriptors, real DOM nodes, range
array identity/live input values, switch state, tree bindings and owned layout.
The current input getter order is retained, but assignment stops after a reentrant
operation supersedes it. Pending operations are tracked across their descendants;
removing an ancestor cancels its child's update before releasing the subtree.

Renderers retain their captured operation/scope so a late getter failure cannot
dispose a newer row. Cleanup failures after a committed replacement are reported;
the successful new row is not rolled back to already-disposed resources. Arbitrary
user accessor/Proxy side effects remain outside the managed-state rollback boundary.

Cached-panel navigation now restores the previous panel/layout on failure. A newer
navigation, removal or destruction supersedes that restoration, even if the failing
outer call resumes afterward. It does not rebuild cached rows or their listeners.

Long labels and tooltips shrink with ellipsis while retaining their full DOM content.
Icons and native controls keep their width, including in a 320px player. Tests cover
trusted keyboard input/change ordering, pointer switch callbacks, touch selection,
and actual builtin autoOrientation transforms with a local video. Mobile UA/viewport
and touch emulation are not certification on physical mobile devices.

Public Setting return declaration discrepancies remain tracked by BASE-TYPE-07 for
the compatible public facade at CORE-21. The source manager has precise item/null/void
returns and does not change runtime behavior to match incorrect legacy declarations.

Tests: setting-model.test.js, setting-layout.test.js, setting-resources.test.js,
types/setting-model.ts, types/setting-manager.ts and
browser/setting.spec.js, browser/setting-update.spec.js and browser/setting-ownership.spec.js.
browser/setting-interaction.spec.js covers real input, long labels and mobile rotation.
Run the shared test scripts and the full installed UMD/legacy browser matrices after
changing these boundaries. The per-package and final release tasks own the complete
ecosystem/SDK matrix, remote CI and physical-device release review.

## Components and controls (CORE-13)

The public registries remain Component-based. utils/component.ts owns add/update/remove,
cache and dynamic name aliases; component/dom.ts owns insertion and known template
queries; component/types.ts defines the minimal generic host and callback shapes.
component/resources.ts owns each entry's child ResourceScope, DOM proxies and guarded
Emitter subscriptions. control/resources.ts specializes the shared subscriptions with
UIEvents; it does not create a second event bus. Builtins depend on these capabilities,
not the full player class. CORE-20 still has to integrate the constructor facade.

Control index.ts preserves routing and visibility behavior. builtins.ts preserves
installation order and option/platform conditions. selector.ts owns item binding,
selection rendering and asynchronous completion; progress.ts keeps the factory and
its historical helper exports while progress/position.ts, view.ts and interactions.ts
separate pointer math, rendering and drag ownership. The remaining simple controls
stay individual factories. layer.ts retains the generic registry; contextmenu/index.ts
owns positioning and root listeners, while its item factories own their own updates.

Preserve the observable registry rules: option factories are bare calls with art;
click/mounted/beforeUnmount use art as this; index 0 still follows the old index-or-id
rule; equal indexes insert before their predecessor. update mutates the cached option
before remove, so the newly supplied beforeUnmount runs on the old node. Component
add/update may return a div; Control add/update still return undefined. Source types
model that distinction; historical public declaration conflicts remain CORE-21 work.
A name of `__proto__` now creates a normal own DOM alias without replacing the registry
prototype. Other historical aliases and shadowing behavior are not broadly renamed.

Entry ownership starts before rendering. Failed mounting releases owned effects and
removes its DOM/cache/alias without masking the original exception or deleting a
successful reentrant replacement. beforeUnmount failure retains the entry for retry;
recursive removal of that same entry is ignored. Already detached DOM can be removed.
Builtin DOM/Emitter listeners, progress drag handlers and tip timers end on entry
removal/update or root destruction; closed handlers are inert even in an Emitter
snapshot. Whole-player destruction retains its existing cache/alias and user-hook
policy: it does not newly call every beforeUnmount. User mounted hook return values
remain ignored. Arbitrary user listeners and third-party SDK work still need explicit
user cleanup; internal scopes cannot infer their ownership.

Selector items keep their non-enumerable, non-configurable getter bindings. A WeakMap
allows the same items to bind to a replacement after the prior entry closes; sharing
items across simultaneously active controls remains invalid. Each click keeps original
item/node/Event/this arguments and synchronous default flags. Only the latest active
selection may write a delayed title; removal invalidates pending writes. Background
clicks are ignored and owned callback failures are warned with their original value.
component/selection.ts links a click's active state to the builtin quality callback,
so late source-switch completion cannot overwrite a newer or removed quality notice.
Direct callback invocations retain their Promise result and original rejection.
Deferred builtin quality installation reports errors without an unhandled Promise.
This does not cancel arbitrary user onSelect work or change switchQuality's public
settlement contract. Highlight text uses dataset assignment rather than interpolation
into HTML attributes; normal text and marker positions retain their behavior.

controls.less allows groups to wrap inside narrow players. Individual control height
continues to use --art-control-height; control/layout.ts observes total layout height
through offsetHeight and records --art-controls-height for subtitle/panel offsets.
ResizeObserver is preferred; the fallback combines core resize and MutationObserver.
Both observers and subscriptions are owned by the bottom controls scope. Without
ResizeObserver, unrelated parent CSS resizing is not independently detected until a
core resize or control mutation occurs. The 640/320/240px tests include real 16:9
heights and verify all buttons remain visible. This does not promise arbitrary custom
minimum widths will fit. Narrow setting-tree/panel behavior remains CORE-14 work.

Use test/component-resources.test.js for ownership, reentry and quality settlement,
test/types/components.ts for source contracts, and test/browser/components.spec.js
for published/candidate registries, real pointer/contextmenu controls, asynchronous
selectors, failures, actual layout and local-media progress. Run the full installed
UMD and legacy browser matrices after building, not only the source fixture suite.

## Template and public resources

`src/template.ts` owns container checks, reservation, proxy replacement and destruction.
`template/html.ts` holds the exact versioned markup; `template/nodes.ts` binds selectors
in historical assignment order. `template/types.ts` describes the minimal generic host
and nullable SSR queries. Container casts are justified by the existing non-null/div
checks before use; selector type parameters describe expected markup, not validation
of arbitrary user HTML. A canvas proxy is a canvas, not an asserted native video.
The generic proxy preserves the actual host as both callback this and its sole argument.

useSSR preserves existing node objects and listeners. Missing nodes are not synthesized.
Proxy replacement retains the original track reference even when it becomes detached,
overwrites the proxy className with art-video and keeps the returned object's identity.
Rollback remains in lifecycle/template-rollback.ts; destroy(false) marks art-destroy,
whereas destroy(true) clears the container. Server imports expose html and STYLE but
construction still fails with the original browser-only error.

`icons/defaults.ts` owns SVG inputs; `icons/index.ts` creates the per-instance registry.
Each read creates a fresh i.art-icon wrapper. Custom DOM nodes move into that wrapper;
they are not cloned. Public declarations historically say HTMLDivElement, while source
uses the actual HTMLElement shape. This mismatch remains tracked for CORE-21.

`i18n/index.ts` owns selected language, deep updates and key fallback. Standalone
language modules keep default exports and artplayer-i18n-* aliases through publish.ts.
Only own language/message keys participate in lookup; absent prototype names now return
the requested string. Explicit custom constructor/toString/`__proto__` messages remain
supported. Empty translations still fall back. build:i18n excludes built-in zh-cn and
helper modules, retaining exactly eleven UMD/ESM pairs and their historical globals.

`style/index.ts` exports Less output without performing DOM work. The main facade
keeps global assignment and injection timing; `style/inject.ts` implements the existing
setStyleText helper re-exported from utils/dom.js. Existing IDs update in place; new
styles defer attachment until DOMContentLoaded while loading. Shared core style survives
instance destruction. This migration does not redesign repeated pre-DOMContentLoaded
injection or validate untrusted SSR markup.

Vendored screenfull.js and hint.less remain separate from owned TS. Full notices ship
in THIRD_PARTY_NOTICES and each core bundle header; provenance and exact adaptations are
checked by refactor/scripts/core-vendor.mjs against pinned upstream text. Historical
screenfull acquisition tag is not recoverable from the repository: v6.0.2 is the fixed
comparison reference, not a claim that the local file is its unmodified release.

Run yarn test:unit, yarn typecheck and the installed-artifact browser suite when changing
these boundaries. template-resources tests cover real SSR reuse, proxies, icon identity,
language fallback, style ownership, fullscreen web and real native-fullscreen gestures
when supported by the engine. Capability evidence identifies unsupported environments. core-vendor tests cover copied
content and native/prefixed fullscreen adapters. Rebuild with yarn build artplayer and
yarn build:i18n; yarn test:package:release validates every language entry and browser alias.

## Plugin registration and ownership

`src/plugins/index.ts` orchestrates registration; types.ts defines generic factories,
minimal option hosts and internal sync/Promise return types. builtins.ts installs the
five existing builtins in their original order and reads each condition at its turn.
It keeps the mobile/live exclusions, including no fastForward for live media. The
constructor captures option once before builtin installation, then traverses the
same live user-plugin array. All five builtin implementations are now TypeScript;
their minimum-host factory casts remain confined to this constructor boundary until CORE-20.

registration.ts owns result naming and non-enumerable/non-writable/non-configurable
registry properties. Names still prefer result.name, then factory.name, then the
current completion-time id. Duplicate detection uses own properties; failed factory
calls still consume an id. No new name restrictions or thenable assimilation are
introduced. Native object-key coercion remains in its three historical positions;
the final coercion is resolved before defining so a reentrant destroy cannot publish
a property on a closing registry. Dynamic name/key assertions are local to this
legacy boundary and do not claim that arbitrary plugin returns are validated.

Lifecycle.isClosing covers both the reset phase and a disposed scope. Public add
after closure throws before incrementing id or executing the factory. Pending add
fulfillments still settle with the original registry, but discard late results;
factory rejection identity remains unchanged. A synchronous close during construction
stops subsequent factories. Constructor-owned Promise rejections are observed and
reported once with console.warn because no caller receives those promises. Public
add retains its rejecting Promise rather than hiding failures.

The manager does not call a result's destroy method: existing result methods are not
an agreed disposal protocol. Plugins own their subscriptions and external SDK/media
resources; arbitrary work created by a factory after an await still needs that
plugin's lifecycle guards. Preventing late registry writes does not certify every
plugin's cleanup. Names that shadow prototype methods and completion-time fallback
naming keep their historical semantics.

Public PluginFactory and Plugins are type-only contracts. Augment `artplayer/types`
for a common plugin-result/event interface across old TS, NodeNext CJS/ESM and Bundler;
augmenting the CJS root alias directly is not equivalent. The new subpath has only
a types condition and typesVersions fallback: runtime require/import must reject it.
Public add's legacy return signature remains tracked by BASE-TYPE-04/CORE-21; internal
registration types preserve known synchronous/Promise results and use a union for
unknown results. The Promise distinction retains instanceof semantics: foreign
Promises and ordinary thenables are stored synchronously, not assimilated.

Tests: plugins.test.js covers naming/coercion, sync/async/error identity, closed scopes,
reentry and constructor-owned rejection. plugins-source.ts checks internal returns;
plugins-public.ts checks the common augmentation path in every package consumer mode.
Browser plugins.spec.js compares old/new late registration, constructor close/reporting,
and builtin order/live exclusions under a mobile user agent. That UA test is not a
physical-device or builtin-feature acceptance test. Run the full installed-artifact
browser suite after modifying the manager or its lifecycle boundaries.

## Input and resolved configuration

`src/option/defaults.ts` creates fresh defaults on every Artplayer.option access,
including nested objects, arrays and the identity onVttLoad callback. It reads browser
language at the same getter call and retains the existing Safari preload decision.
The entry passes Artplayer.option to `option/resolve.ts`, which performs the existing
deep merge, restores input.container by reference and invokes the same option-validator
function. Allocation of the instance id still precedes validation; DOM mounting follows it.

`option/types.ts` reuses the public OptionInput as the typed input contract. ResolvedOption
requires top-level defaults and subtitle/thumbnail defaults, while explicitly allowing
proxy to remain undefined. ResolvedInput preserves extra typed application fields without
adding a global any index signature. The one assertion after validation connects the
existing dynamic merge to a successfully resolved typed input; this function is not an
unknown-to-safe-object guard. Arbitrary JS still passes through runtime validation,
and permissive nested map/extension data needs checks in its consuming module.

`src/scheme/index.ts` preserves the mutable runtime schema, shared ComponentOption
objects and callback validation messages. Its keys are checked against Option at compile
time. `types/option-validator.d.ts` at the repository root describes the installed 2.0.6
identity validator, callback paths and kindOf; it adds no runtime wrapper or dependency.
Root/core strict configs include that declaration and lint covers root declaration files.
The public Artplayer.validator and scheme references remain available as before.

Merge behavior includes unknown own keys, collection item references, two reads of an
enumerable input container getter, and restoration of an inherited container. Explicit
undefined can still fail the existing schema instead of being silently defaulted.
Runtime validation is unchanged; public input expansions are described below.

CORE-07 adds OptionInput for omitted URL and numeric component HTML. Historical Option
keeps its required URL/read types; the constructor accepts both via overloads. Source
fixtures now accept the expanded inputs, and declaration-legacy.ts protects old reads.
The additive declarations and remaining return conflicts are tracked in
[types/COMPATIBILITY.md](./types/COMPATIBILITY.md).
Other permissive validator cases are not blanket guarantees that later DOM/media code
can consume every accepted value. Preserve failure stages while migrating those consumers.

Run `yarn test:unit` for published/current defaults, merge and error comparisons, and
`yarn typecheck` for required resolved fields and retained callback/application types.
`options.spec.js` exercises actual candidate construction, invalid input timing and
real-media customType/ready callbacks in the three browser engines. Keep those cases
when changing defaults, schema or resolution; also rerun installed-package validation.

## Current TypeScript boundary: utilities

| Module                  | Responsibility and constraints                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/index.ts`    | Existing export barrel; no added runtime names or wrapper methods                                                                 |
| `src/utils/format.ts`   | Clamp, capitalization, clock formatting and HTML entity conversion; reusable private lookup maps                                  |
| `src/utils/property.ts` | Native defineProperty alias, own-property inspection and recursive merge; keys are written as own data properties                 |
| `src/utils/time.ts`     | Sleep, trailing debounce and leading throttle; infer argument tuple/receiver, preserve scheduling and synchronous return behavior |
| `src/utils/error.ts`    | ArtPlayerError, truthiness guard and internal rejection handling; public media promises are handled elsewhere                     |
| `src/utils/file.ts`     | Historical extension parsing and transient download anchor lifecycle                                                              |
| `src/utils/subtitle.ts` | Existing SRT/ASS-to-VTT text conversions and VTT Blob creation                                                                    |

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
old defect without changing ordinary snapshot behavior. Event names such as `__proto__`
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

### Media and host boundaries

`src/media/types.ts` separates native video from canvas media shims. MediaState is
the common playback state; PlaybackMethods preserves the actual play/pause return
types. CanvasMedia requires a canvas with media operations, permits nullable source
values used by MediaBunny, and does not claim the full HTMLVideoElement interface.
Text tracks, picture-in-picture, frame callbacks and WebKit extensions are optional
capabilities, including on NativeMedia where browser support can vary. Check them
before use. These are internal types, not new public exports or runtime wrappers.

`src/media/hosts.ts` describes the dependencies of individual consumers instead of
requiring the whole Artplayer class. PlayHost needs play, notice, events, mutex and
the instance registry; PauseHost only needs pause, notice and events. LayoutHost
only needs the player element's bounding rectangle. Notice's read and write types
differ because its getter is visibility state and its setter accepts a message.

playMix, pauseMix, playingMix, durationMix and rectMix now consume these contracts.
Their assertion signatures describe the properties installed with def; rectMix has
one local cast for the getter properties it installs. They do not assert a shim to
be native video. Play still awaits the media result before notice/event/mutex work;
pause remains synchronous and preserves the media return value. Existing getter
descriptors, boolean shim playing precedence, duration normalization and live layout
reads are unchanged. play/pause/playing capture the original media object; duration
reads template.$video on each access, as before.

The JS construction facade still assembles these hosts dynamically. Its complete
static integration belongs to CORE-20; capability consumers migrate in their own
CORE tasks. Do not assume these types already validate every third-party proxy.
Public art.video remains the original object and retains its existing declaration
for consumer compatibility. A public proxy typing extension requires separate
consumer checks; internal code must not use that old declaration to hide a canvas.

`test/media-hosts.test.js` covers structural media methods, receiver/return values,
event and mutex order, property descriptors and live getters. `test/types/media-hosts.ts`
checks minimal hosts, native/canvas assignability and missing capabilities. The
browser media-hosts suite combines published/candidate core with the existing
workspace canvas proxy artifact (explicit hash attachment), real playback/seek and
layout changes. It does not certify MediaBunny codecs or the proxy's full lifecycle.

Migrated sources compile with strict/noUncheckedIndexedAccess and browser-only
ambient types. The merge accumulator is a dynamic string-key boundary with one
documented cast to the pre-existing generic return contract. No file-wide any or
type-check suppression was added. The main public declarations remain a separate
compatibility surface; see [types/README.md](./types/README.md).

Public return discrepancies remain after CORE-07. It adds unescape/ArtPlayerError,
optional sleep and a symbol/PropertyKey def overload; old string def and debounce/throttle return declarations
remain for source compatibility. The old debounce context argument is ignored at runtime.
BASE-TYPE-05 remains open through CORE-21; use the actual source types internally.
Lifecycle-owned timer cancellation is part of CORE-04/17 and the existing BASE-PERF-01
finding, not a claim that a standalone debounce can know when its owner is destroyed.

## Verification and maintenance

### Media events and reconnect (CORE-11)

`player/eventInit.ts` preserves registration order while assembling
`media/events/{forward,readiness,playback,reconnect,listen,types}.ts`.
Forwarding keeps the configured names, original Event object and existing proxy.
Owned Emitter handlers detach on destruction; public subscriptions remain intact.
UI changes stop if a synchronous component callback closes the instance, so a
first-ready control callback cannot cause a ghost ready after destroy.

Source ownership is now layered:

```text
instance scope
  current source scope
    source operation scope (switch completion/failure)
    pending reconnect scope
```

The source scope survives a rejected switch, allowing the current resource to retry.
Playback guards capture both source and operation identity, including late play
after a failed switch has already removed its operation from the current map.
Changing URL releases the old source scope and all its pending work. Reconnect
coalesces duplicate errors into one pending attempt, preserves its first Event,
uses the existing delay/limit, and resets on canplay or an independent new source.
It still reads option.url when the retry starts; reentrant source replacement
invalidates that attempt. Attempt numbers are captured before source assignment
so synchronous proxy canplay cannot change the reported number. Recovery cancels
pending failure notices and clears art-error. Internal asynchronous observer errors
are reported through console.warn with the original thrown value.

`test/media-events.test.js` covers forwarding, sequence, cancellation, retry budget,
failed-switch recovery and reentry. Its browser counterpart uses real HTTP 503 and
local media, compares old/new stale retry and ghost-ready behavior, and checks the
mobile metadata branch with an Android UA (not a physical device). Proxy-owned SDK
events still need adapter-level source identity; native Event has no source token.

### Playback properties (CORE-10)

The toggle, currentTime, seek/forward/backward, volume/muted, playbackRate,
played, loaded/loadedTime and state mixins are TypeScript modules.
`media/playback.ts` defines their minimal timing, notice, storage and display-state
hosts; toggle infers the union of its actual play/pause result types.

Keep JS coercion and read/write differences explicit: currentTime uses parseFloat,
seek emits both the clamped result and original request, and forward/backward
retain native addition/subtraction behavior. Volume uses parseInt-style percentage
formatting and stores nonzero actual media volume. Falsy playbackRate resets to 1;
equal rates do not change the notice. Raw played/loaded ratios may be NaN or Infinity.
Do not replace those rules without a separate compatibility decision.

Most media getters capture the original video; duration reads the current template.
The state setter only disables other modes, never enables its named mode. Native
fullscreen/PiP implementation and event forwarding migrate in their own tasks.
Public command-property getter discrepancies are BASE-TYPE-08, not runtime APIs
to invent. The optional public PlaybackControls view accurately models toggle
without changing the player's historical method declarations.

`test/playback-properties.test.js` covers coercion, storage, descriptors, ranges,
state priority and captured references. Its browser counterpart compares actual
published/candidate media; type fixtures cover source inference and five installed
consumer modes. Existing play/source/canvas tests continue to guard playback.

### Source operations (CORE-09)

`player/urlMix.ts` and `player/switchMix.ts` preserve the public descriptors.
`source/types.ts` defines minimal structural media/host capabilities;
`source/operation.ts` owns a current generation and its resource scope;
`source/listen.ts` owns individual media subscriptions; `source/switch.ts`
coordinates assignment, readiness, state restoration and Promise settlement.

A new URL assignment supersedes the prior operation, including direct `art.url`
writes. Superseded/destroyed switches fulfill with undefined; actual source errors
reject with their original value. Fulfillment does not prove the source became
active. Same-string URL calls remain no-ops. Internal resume rejection stays
handled while public play retains rejection. Synchronous proxy events are buffered
until assignment finishes, and operation cleanup does not remove user listeners.

customType still receives the real media object and player. Its arbitrary external
SDK work cannot be cancelled generically: adapters must own that cleanup. The core
guards deferred invocation, ignores obsolete returned failures, and cancels its own
continuations. Direct assignment failures are reported with console.warn; switch
callers receive the original rejection. `playMix.ts` captures the current source:
its native result/rejection is preserved, while obsolete notice/event/mutex effects
are suppressed. CORE-10 migrates playback properties and CORE-11 owns reconnect
generations; object URL ownership remains CORE-19 work.

`test/source.test.js` checks cancellation, reentry, synchronous events and cleanup;
`test/browser/source.spec.js` compares published/candidate real-media switching and
destruction and verifies candidate customType and resume-failure behavior.

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
constructor, playback, setting, input and capability migrations are recorded
in refactor/tasks.json and should extend this map as they land.
