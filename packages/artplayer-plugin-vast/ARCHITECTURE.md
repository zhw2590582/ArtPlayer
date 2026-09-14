# VAST implementation and maintenance

The runtime and public types follow the accepted published-versus-workspace decisions.
Real IMA validation and full distribution acceptance remain separate release gates.

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
- `src/types.ts` imports shared fields from `types/runtime-api.d.ts` for the implementation
  context, request configuration and result, and adds only private utilities/callback typing.
- `types/artplayer-plugin-vast.d.ts` is the exact npm1.0.0 declaration compatibility surface.
  `types/runtime-api.d.ts` is the accurate SDK/context/Promise source; runtime.d.ts/.d.cts
  expose CJS types, while runtime.d.mts exposes native ESM types. All resolve to the same
  runtime artifacts. CJS declarations intentionally duplicate a small export facade;
  changes must keep runtime.d.ts and runtime.d.cts identical.

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
null. The accurate runtime declaration includes that terminal null result.

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
historical return declarations remain unchanged at the root; `/runtime` supplies the
accurate Promise, both mode-specific contexts and the second argument.
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
Accurate alias types are exposed only by `/runtime`; the root remains a pure historical
factory type. Installed root/legacy/runtime imports and strict SDK type dependency
resolution are checked by `yarn test:vast-types-package`. This does not replace task06's
complete browser/distribution acceptance.

For state or cleanup changes start in session, for callback timing in entry, and for
SDK request fields in sdk. Keep Node candidate assertions, historical observations,
browser counterparts and [test maintenance](../../refactor/vast-validation.md) aligned.
`yarn test:vast-types` verifies unchanged root bytes, historical type conflicts, negative
runtime consumers and editor generation in TS5.9.3/4.3.5. `yarn build:ts artplayer-plugin-vast`
regenerates the root-compatible editor global. Frozen workspace editor tests continue to
exercise the SDK declaration bundler; they are labelled historical. Public migration
is documented in [the accepted type decision](../../refactor/vast-type-decision.md).
`yarn test:vast-native` separately loads the real remote Google IMA SDK with local
VAST XML and video assets. It runs outside the default PR suite because SDK/network
availability is an explicit environment gate. No SDK boundary is substituted.
Reports include bundle/media hashes, XML, SDK/browser versions, event order, decoded
ad frames and resumed content state. See the validation record for actual results;
adding this command does not establish device or final distribution acceptance.
The native skip case requests a local HTTP VAST tag via `playUrl`, verifies its
response and clicks IMA's own enabled skip button after the skippable event. Its
countdown already has an accessible skip name; visibility alone is insufficient.
The local XML server permits only IMA origins on that fixture route. Native SDK
timeouts remain failures even when a late ad subsequently plays or skips correctly.
Physical device validation remains05 and full distribution06.

## Complete installed bundles

The shared `yarn test:package --browser` roster includes VAST. Its checked
archive retains the real npm 1.0.0 dist/type paths; the same-name contract also
verifies the frozen SDK archives. Generic package runtime/type fixtures still
cover core/chapter only. Use the separate VAST type consumers for VAST claims.

`vast-package.spec.js` uses `browserCandidate()` to select a normal source build
or the verified installed UMD, including the actual glomex implementation. It
holds/aborts native SDK script requests to verify concurrent load rejection,
fresh attempts and listener cleanup. A second case destroys the host before
fulfilling the script with an inert readiness sentinel, which intentionally has
no IMA player APIs: late construction or callbacks must not run. Main content
still decodes after SDK failure. These are loader/lifetime tests, not Google IMA
ad playback; `vast.spec.js` remains a separate controlled SDK boundary suite.

`yarn test:vast-native` defaults to the existing source build. With
`ARTPLAYER_BROWSER_ARTIFACTS` set, its config requires verified core, Chapter and
VAST installations, and all three native test files load the complete installed
bundle. They preserve real remote IMA, published plugin controls, timeouts and
zero retries. Input provenance is attached before SDK initialization, including
for tests that fail before ad playback. This optional integration run stays
outside normal PR checks. See the
[installed VAST record](../../refactor/changes/2026-09-15-CI-01-vast-installed.md)
for actual results and the remaining external SDK/device/distribution gates.
