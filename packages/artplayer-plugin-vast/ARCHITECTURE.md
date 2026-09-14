# VAST implementation and maintenance

The runtime follows the accepted published-versus-workspace initialization decision.
Public declaration reconciliation and real IMA validation remain separate release gates.

## Module map

- `src/index.ts` owns the core destroy subscription before SDK loading begins,
  awaits SDK loading and the user callback, and preserves original rejection values.
  It snapshots the optional compatibility mode at factory creation and initializes
  the default session before the callback. Its writable `.default` self-reference retains historical CommonJS default calls
  alongside the current direct factory. It does not wrap registration or load IMA.
- `src/sdk.ts` is the only runtime Glomex import boundary. It also constructs IMA
  requests, preserving own/inherited configuration fields and primary-field overrides.
- `src/session.ts` owns one current SDK/container pair, initialization rollback and
  explicit recreation. Only workspace mode adds four ad-event subscriptions and
  active-ad request suppression; default mode delegates those behaviors to the SDK.
- `src/view.ts` creates each mode's historical overlay styles and distinct per-module container
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

Calling `artplayerPluginVast(callback)` preserves npm1.0.0 behavior: the SDK and
container exist before the callback, including when no callback was supplied.
`imaPlayer`, `id` and `$container` are writable/enumerable/configurable data fields.
SDK settings retain their own defaults. The wrapper forwards each explicit request
and leaves ad visibility to the SDK, without adding workspace event listeners.

Passing `{ compatibility: 'workspace-1.2' }` as the second argument retains unpublished
workspace behavior: no player/container until `init`, `playUrl` or `playRes`; callers
can mutate the original settings/options before initialization. Preloading and restore
custom playback state default to true. Four ad events control the black overlay and
active-ad suppression. Resource getters track the current session and become null
on release. The mode is captured once; an unknown value throws TypeError before loading.

Default data fields retain their last allocated values after destroy, as published
snapshots; `container` is a live getter and becomes null. Explicit recreation updates
the data fields to the new session. Public writes to these snapshots do not transfer
resource ownership. Never use a retained disposed SDK as an active session.

Both modes retain void request methods, async registration and SDK/callback rejection.
The old `require(...).default(...)` call and current callable export remain available;
this does not recreate the old namespace object's reflection shape. Contradictory
public return declarations and the new second-argument declaration remain task04.
See [the accepted decision](../../refactor/vast-compatibility-decision.md).

Overlay IDs use the historical `art-` default prefix or `art-vast-` workspace prefix,
with a monotonic suffix to fix same-millisecond collisions. Default styles do not add
workspace's black background or pointer-events rule. Container identity/ownership,
initial display:none and existing position/inset/size/z-index are preserved.

`@alugha/ima@2.1.0` is a direct pinned dependency because Glomex declarations import its
types while Glomex lists it only as a development dependency. Runtime imports continue
to use Glomex1.21.2. No new direct remote loader or SDK major upgrade was introduced.

## Validation

Run `yarn test:vast`, `node node_modules/typescript/bin/tsc -p
packages/artplayer-plugin-vast/tsconfig.json --noEmit`, `yarn build artplayer-plugin-vast`,
and `yarn test:browser:source test/browser/vast.spec.js --workers=2` using the pinned
toolchain. Do not use the historical `tsc` binary alias for source checking. The node and
browser wrapper tests substitute only the Glomex SDK boundary. They cover current and
frozen historical sources, real published core5.1.7/5.4.0 and candidate5.4.1 registration, real DOM and
main-video decoding; they do not certify Google IMA ads or final npm distribution.
Candidate default and explicit workspace cases execute identical compiled code with
different options; historical fixtures remain immutable. Compatibility tests compare
callback timing, data descriptors, defaults and request forwarding to actual npm source.

`test/vast-exports.test.js` exercises bundled CommonJS/global/AMD and native ESM
import, using an already destroyed host to verify registration without loading ads.
Set `ARTPLAYER_VAST_ARTIFACT` and `ARTPLAYER_VAST_ESM_ARTIFACT` to test actual build
files; otherwise it builds source via the repository helper. The live alias path
uses the controlled SDK in `test/vast.test.js` and the browser registration case.
Public alias declarations and complete installed entry validation remain04/06.

For state or cleanup changes start in session, for callback timing in entry, and for
SDK request fields in sdk. Keep Node candidate assertions, historical observations,
browser counterparts and [test maintenance](../../refactor/vast-validation.md) aligned.
Actual IMA/media/device validation remains05, public types04, and full distribution06.
