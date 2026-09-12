# Implementation and maintenance

The public factory still returns a synchronous plugin initializer. Its result has
`name`, readonly runtime getters `isSupported`/`isActive`, async `open`/`close`
returning `Promise<void>`, and synchronous `toggle` returning `undefined`.
The public `Result` preserves published void actions and writable flags for legacy
assignments. `AsyncResult` is an opt-in precise view for an unmodified runtime
result, and the implementation is checked against it. The default factory keeps
its exact published required-argument signature, including plain replacement
function assignments. RuntimeFactory explicitly describes omitted options and
self `.default` access. `.d.mts` and `.d.cts` wrappers map ESM/CJS consumers; old resolvers
use the base declaration and legacy typesVersions path. A self `.default` alias
supports the two historical runtime export shapes without adding named exports.

| File | Responsibility |
| --- | --- |
| `src/index.ts` | Factory option snapshot, capability snapshot, core bridge, terminal plugin cleanup |
| `src/window-session.ts` | One pending request/active window, revisions, cancelled requests, window listeners and transition ordering |
| `src/projection.ts` | Original parent/sibling/document, placeholder, root, atomic restoration and rollback |
| `src/styles.ts` | Module style installation and best-effort copying from the player's actual document |
| `src/control.ts` | Existing control name/position/index, click and tooltip subscriptions, partial setup cleanup |
| `src/resources.ts` | Attempt-all cleanup and cancellable 100ms transition delay |

The session receives narrow callbacks and does not import Artplayer. Projection
and style modules only handle DOM ownership. Control and entry modules are the
core integration boundary. No shared runtime dependency on the new core is added.

`open()` calls the browser request synchronously to retain user activation. While
that request is pending, another open coalesces and toggle cancels it. `close()`
settles cancelled callers immediately; when the browser eventually returns its
window, the stale continuation closes it without adopting any player nodes.
An active window owns its listeners, projection and delay. Successful activation
adds the existing class, rebinds core document events and emits `document-pip(true)`;
resize follows after 100ms only if that transition is still current. Normal close
restores the same node, closes the window, removes the class, rebinds, emits false
and delays resize. Destroy is terminal and suppresses new events/timers/UI effects.

Projection snapshots the original document, parent and sibling before moving the
player. Restoration inserts directly into a validated original anchor; it does
not detach first. If the placeholder has moved, the saved sibling is used instead.
If the original parent rejects insertion, a best-effort fallback keeps the node
in the original document body and reports a close failure. This cannot guarantee
recovery if the original document also rejects insertion. Application mutation of
the placeholder does not transfer ownership of the player to another parent.

All acquired resources are registered before operations that may throw. Cleanup
attempts remaining resources after an error. Reentrant destruction during native
adoption or insertion also cleans nodes returned after the initial disposal.
The public module style stays shared for the document's lifetime; deferred
installation rechecks its existing id and removes its own loading listener.

Existing defaults, optional runtime options, names, CSS ids/classes, tooltip,
index40 and best-effort stylesheet attributes are retained. A throwing video PiP
fallback setter still rejects `open()`; normal window errors retain the existing
notice/warning behavior. Fixes to pending requests, partial rollback and stale
effects are intentional corrections to reproduced defects, not new public APIs.

Run from the repository root with the pinned Yarn toolchain:

```sh
yarn test:dpip
yarn typecheck
yarn build artplayer-plugin-document-pip
yarn test:browser test/browser/dpip.spec.js test/browser/dpip-lifecycle.spec.js
yarn dev artplayer-plugin-document-pip --no-open
```

The development example is `http://localhost:8082/?libs=./uncompiled/artplayer-plugin-document-pip/index.js&example=document.pip`.
Historical tests use actual archives and frozen Git source. Candidate lifecycle
tests can run against the frozen source with `ARTPLAYER_DPIP_BASELINE=1`; the known
failures must remain visible. `ARTPLAYER_DPIP_ARTIFACT` selects an explicit built
file for browser verification and never silently falls back to source.

The iframe matrix uses real DOM with controlled window APIs. It does not prove
native Document PiP activation, window focus/keyboard, continuous playback or
device support. Native video/Canvas/Mediabunny combinations and the observed
WebKit dimension reports remain PKG-DPIP-05. Full archive/demo acceptance is
PKG-DPIP-06. Installed type consumers are verified by `yarn test:dpip-types-package`;
historical missing runtime/type entry errors are exact negative cases, not waived
candidate failures. See the repository `refactor/dpip-validation.md` for evidence.

The separate dpip-native.spec.js uses actual requestWindow, a Playwright popup,
trusted keyboard input and repeated window.close/restoration for native video,
Canvas and MediaBunny with old/new cores. Native close uses window.close because
Playwright Page.close hangs on the installed Firefox PiP target. The earlier
iframe tests remain controlled lifecycle evidence, not native-window evidence.
Core 5.4.0 still intercepts editable popup hotkeys, also reproduced with published
plugin 1.1.0; candidate core's event-document focus checks fix this independently.
Candidate web fullscreen stays in the current ownerDocument body and restores
its captured placement. This does not prove native fullscreen availability inside
PiP, background throttling or physical-device support; PKG-DPIP-05 stays open.
