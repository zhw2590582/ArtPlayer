# VAST implementation and maintenance

This is the PKG-VAST-03 implementation checkpoint. The published-versus-workspace
initialization conflict remains open; this checkpoint is not release acceptance.

## Module map

- `src/index.ts` owns the core destroy subscription before SDK loading begins,
  awaits SDK loading and the user callback, and preserves original rejection values.
- `src/sdk.ts` is the only runtime Glomex import boundary. It also constructs IMA
  requests, preserving own/inherited configuration fields and primary-field overrides.
- `src/session.ts` owns one current SDK/container pair, the four ad-event subscriptions,
  active-ad request suppression, initialization rollback and explicit recreation.
- `src/view.ts` creates the existing overlay styles and distinct per-module container
  IDs, including multiple instances initialized in the same millisecond.
- `src/types.ts` describes the implementation context and SDK boundary. Public legacy
  declarations in `types/` remain separate pending PKG-VAST-04 reconciliation.

Dependency direction is entry -> session -> SDK/view/types. The session passes the
original `art` through the callback for compatibility; only template elements are
used for SDK allocation. Constructor utility access is narrowed once at the entry.

## Lifetime and errors

The entry subscribes before awaiting the shared SDK loader. Core destruction makes
that attachment terminal, removes the subscription and releases the current session.
It does not cancel the shared IMA script load for other instances. A late completion
does not invoke the callback or allocate a player. SDK failures still reject with
their original value. Callback failure closes the attachment and releases resources;
secondary cleanup failures are logged without replacing the original error.

Explicit plugin `destroy()` releases the current ad session, resets active-ad state,
and permits a later `init`/`playUrl`/`playRes` while the core remains alive. Core destroy
and failed attachment are terminal: request methods are inert and `init()` returns
null. Public declaration accuracy for this invalid-lifetime case belongs to04.

Each session has an owner identity. Its callbacks verify that identity and core
liveness before changing visibility. Cleanup detaches the current owner and clears
references before invoking SDK code, removes each subscription, destroys the SDK and
removes the container even when another cleanup operation throws. A cleanup exception
is observable, but cannot leave the wrapper pointing at a half-destroyed player.

Initialization is guarded against reentrancy. Constructor/subscription failure rolls
back; destruction reentered during constructor completion releases the late player.
Config accessors can execute user code, so request dispatch verifies owner identity
again after request construction. Cleanup itself prevents reentrant recreation until
it finishes. SDK content pause/resume behavior is not duplicated in this wrapper.

## Compatibility and remaining work

The checkpoint retains the workspace callback order, lazy initialization, mutable
settings/options identities, default flags, void request methods, and asynchronous
outer attachment. The historical namespace export, `id`/`$container` aliases, eager
published initialization and contradictory public return types are not yet reconciled.
See [the explicit decision](../../refactor/vast-compatibility-decision.md).

The former timestamp-only overlay ID now has a monotonic suffix to avoid same-tick
collisions; the existing `art-vast-` prefix and CSS styles remain. IDs are internal
in the workspace context; published ID compatibility is tracked with the above decision.

`@alugha/ima@2.1.0` is a direct pinned dependency because Glomex declarations import its
types while Glomex lists it only as a development dependency. Runtime imports continue
to use Glomex1.21.2. No new direct remote loader or SDK major upgrade was introduced.

## Validation

Run `yarn test:vast`, `yarn typecheck`, `yarn build artplayer-plugin-vast`, and
`yarn test:browser vast.spec.js` using the repository pinned toolchain. The node and
browser wrapper tests substitute only the Glomex SDK boundary. They cover current and
frozen historical sources, real core5.1.7/5.4.1/candidate registration, real DOM and
main-video decoding; they do not certify Google IMA ads or final npm distribution.

For state or cleanup changes start in session, for callback timing in entry, and for
SDK request fields in sdk. Keep Node candidate assertions, historical observations,
browser counterparts and [test maintenance](../../refactor/vast-validation.md) aligned.
Actual IMA/media/device validation remains05, public types04, and full distribution06.
