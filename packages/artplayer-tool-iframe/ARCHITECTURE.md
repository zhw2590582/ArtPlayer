# Iframe maintenance map

`src/index.ts` owns the existing class, constructor validation, bound parent
message listener, child injection/execution protocol and public callbacks.
`src/requests.ts` owns request IDs, pending promises, injection polling and
settlement/cancellation. Its host interface uses only the iframe, registry and
two lifecycle flags; it does not depend on ArtPlayer or import the entry class.

The entry initializes the same seven enumerable, writable fields in the same
order. Internal request ownership lives in a module WeakMap, keeping instance
reflection unchanged. `promises` remains the same ordinary object, exposing the
historical `resove` spelling and `reject`. Do not rename `resove` or replace this
public object with a Map. The wire envelope remains `{ type, data, id }`, with
numeric IDs and wildcard target origin. Non-error responses with a matching ID
are still accepted; `message` receives `{ type, data }` with the instance as `this`.

## Request lifecycle

Every call owns its promise immediately. Before injection it polls every 200ms,
as before; injection does not flush the queue synchronously. On send it allocates
a numeric ID from the greater of the current timestamp and the previous ID + 1.
The counter is shared by instances in this module so two instances pointing at
one child do not settle each other's requests. It also avoids reuse after clock
rollback. Independently loaded copies of the library do not share this counter.

The request is recorded before native postMessage. Success, remote error, native
send failure or an explicit public callback settle once and remove ownership,
timer and registry entry. Native failures retain their original Error object,
including failures reached from polling. `destroy()` first marks the instance
destroyed, removes its listener, then immediately rejects both sent and waiting
requests with `The instance has been destroyed`. Saved listener/timer callbacks
become inert. Repeated destroy is harmless. There is no implicit request timeout.

These are deliberate defect corrections: callers holding a promise during
destroy must handle rejection; previously sent requests remained pending forever.
The public ID is a correlation number, and is no longer always equal to Date.now.
Public callback invocation now removes its completed registry entry immediately.
The own-property guard prevents inherited names such as `toString` being treated
as requests. These differences are recorded under PKG-IFRAME-03.

## Compatibility still under review

Child `commit` still extracts the function body and evaluates it with the old
`resolve(...)` convention. Simple commits post a response synchronously inside
the async handler; resolver commits await the result. Execution errors still
send an error packet and reject the handler. Expression arrow functions, closure
capture and CSP restrictions have not been replaced with a new RPC protocol.

This checkpoint does not fix navigation/reinjection, malformed message handling
or source/origin validation. The executable commit protocol is not a sandbox;
the current listener still accepts messages from unrelated windows. IFRAME-LIFE-01
and IFRAME-TRUST-01 remain open. Continue in PKG-IFRAME-03/05 before release.

Public declarations remain in `types/artplayer-tool-iframe.d.ts`; source typing
does not yet establish historical declaration/entry compatibility. PKG-IFRAME-04
must reconcile the old npm plugin name, namespace/default and extra helper
protocol separately. PKG-IFRAME-06 owns final distribution. No version bump or
publication is implied by this source migration.

## Verification

- `yarn test:iframe`: frozen historical contract/defect assertions and candidate
  lifecycle assertions. Historical failures are not candidate acceptance.
- `yarn typecheck`: strict source and existing consumers; full package declaration
  consumers are still a separate PKG-IFRAME-04 gate.
- `yarn build artplayer-tool-iframe`: normal main/legacy/ESM production output and
  generated docs copies. Never hand-edit those files.
- `yarn test:browser test/browser/iframe.spec.js`: real same/cross-origin windows
  in Chromium, Firefox and WebKit. This tool-only fixture creates no player.
- Set `ARTPLAYER_IFRAME_LIFECYCLE_ONLY=1` for candidate lifecycle browser rows;
  `ARTPLAYER_IFRAME_ARTIFACT` selects an actual built file. For an unchanged
  candidate test against the old workspace, set `ARTPLAYER_IFRAME_BASELINE=1`.
  Expected historical failures must be archived, not suppressed.

The existing local demo remains at
`http://localhost:8082/?libs=./uncompiled/artplayer-tool-iframe/index.js&example=iframe`.
Full demo/player integration, native devices and final release checks are later
gates; the controlled iframe fixture is not evidence that those have passed.
