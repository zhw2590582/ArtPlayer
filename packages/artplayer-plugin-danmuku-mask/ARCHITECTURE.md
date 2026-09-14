# Danmuku Mask maintenance map

The native combination suite includes both frozen/current Danmuku with three core
versions and a bounded 20 rows/s load after model readiness. Model output must
continue during that load. PKG-DANMUKU-MASK-LOAD-01 addresses Chromium/WebKit
delivery loss in the Danmuku scheduler; this does not replace or patch the Mask
model, SDK, backend, video dimensions or inference loop. The optional Chromium
`ARTPLAYER_MASK_PROFILE=1` capture records actual SDK image conversion cost.
Keep profiling separate from ordinary timing acceptance. See the original
failures in `refactor/changes/2026-09-14-PKG-DANMUKU-08-combined-load.md` and the
repair record in `refactor/changes/2026-09-14-PKG-DANMUKU-MASK-LOAD-01-scheduling.md`.

The compatibility baseline is the actual npm 1.1.0 package and the earlier
1.0.0 export shape. Sources and historical failure probes are recorded in
`refactor/baselines/danmuku-mask-contract.md`, `danmuku-mask-release.json` and
`danmuku-mask-failures-validation.json`, relative to the repository root.

## Modules and ownership

| Module | Responsibility |
| --- | --- |
| `src/index.ts` | Preserve synchronous registration, capture core template nodes before option getters, expose named start/stop closures |
| `src/config.ts` | Snapshot the original option defaults without changing OR/undefined semantics |
| `src/sdk.ts` | Existing TF backend selection, MediaPipe adapter configuration, mask calls and model disposal outlet |
| `src/controller.ts` | One active run, initialization/inference serialization, cancellation, RAF ownership, ready/destroy subscriptions |
| `src/output.ts` | Private canvas/context, unchanged binary mask colors and threshold conversion, guarded maskImage commit, canvas release |
| `src/types.ts` | Internal host, normalized options, exact legacy SDK arguments, canvas resources and nullable run state |
| `src/sdk-ambient.d.ts` | Declaration-only import of the SDK's official Long namespace dependency |

The owned modules use strict TypeScript. The entry depends on config/controller;
controller depends on SDK/output; output delegates mask operations to SDK. The
shared contracts contain only types and do not add runtime dependencies. The
internal host accepts the actual core declaration in
`refactor/fixtures/implementation/danmuku-mask.ts`; it needs only core template
nodes, destroy state and ready/destroy subscription methods. Public declarations
remain a separate compatibility surface and never import these source types.

Controller fields use `declare` to retain the existing own-property initialization
order. Its limited non-null assertions describe lifecycle invariants: tick runs
only after model/output initialization, disposal waits for busy frame work, and
the public start promise is assigned before the first initialization continuation.
The cancellation resolver is assigned by the synchronous Promise executor.
Output byte indexing relies on native ImageData's complete RGBA pixels. The
backend error's message assertion preserves the old property read, including
its behavior for non-Error rejections; it does not normalize thrown values.

The SDK config uses the official MediaPipe config intersected with the exact
legacy extra keys. `satisfies` checks those fields, and the subsequent assertion
prevents the SDK union's excess-property check from deleting compatibility data.
No SDK option interpretation changes. TF 4.22.0 `dist/hash_util.d.ts:2-3` references
`Long` without an import. The local declaration-only bridge loads its existing
official `@types/long` 4.0.2 UMD namespace. This package imports the TF declarations
directly; it therefore needs the bridge under the root's explicit `types: []`.
Keep `skipLibCheck: false`, do not rewrite Long or add a runtime import for it.
The package tsconfig and all source modules stay outside the packed artifact.

Public factory declarations retain the actual npm 1.0.0/1.1.0 shape. The exact
`typesVersions` legacy mapping fixes old Node-resolution consumers without
changing the root factory. See `types/README.md` for private types, namespace
limits and the semantic online-editor generator. Strict positive/negative
factory replacement and return-type cases run in the baseline suite; installed
consumers separately check packed contents and historical diagnostics.

Mask captures the core's video and `.art-danmuku` layer. The core template
provides that layer before plugins register; Danmuku does not create it.
Mask does not access the Danmuku queue, individual item nodes, Worker protocol,
facade/Owner methods or `artplayerPluginDanmuku:*` events. Danmuku07's fixed CSS
mask test establishes root-layer coexistence, not segmentation/model acceptance.
The existing demo registers Danmuku then Mask; that order alone is not a model
or template readiness guarantee.

## Start, cancellation and resource lifecycle

Registration returns `{ name, start, stop }` synchronously. The public named
`startSegmentation` closure returns `Promise<void>`; `stopSegmentation` returns
undefined. Extracted calls keep their captured controller. Concurrent/repeated
starts share the current initialization and do not add a second inference or
RAF chain. Successful start still does not wait for a completed first mask.

Each run owns its model, canvas/context, cancellation resolver and at most one
RAF or inference. A run may commit output only while it remains current, running
and attached to an undestroyed player. Check this after backend/model loading,
segmentPeople, toBinaryMask and drawMask. An old continuation must never update
the layer or reschedule its own loop after stop, destroy or replacement.

Stop marks the run inactive, resolves pending public start, cancels its exact
RAF (including id zero), and writes the historical `maskImage = 'none'`.
It leaves the other setup styles intact. Destroy additionally prevents restart
and detaches the exact ready/destroy callbacks. Registration rollback detaches
subscriptions without changing preexisting host styles. Ready observes startup
rejections locally; explicit start still rejects backend or canvas failures.

Stopping now releases the model and canvas instead of retaining them indefinitely.
A subsequent start initializes a new model. This is an intentional resource
correction; the extra restart initialization cost needs native validation.
An in-progress SDK operation cannot be aborted through the current SDK API.
Its late result is ignored, then its private canvas bitmap is reset to zero
dimensions and its accessible model is disposed. Once frame work has settled,
a pending SDK disposal must not keep the independent canvas bitmap allocated.
Restart waits for that outstanding work and
visible disposal result instead of overlapping two model runs. Repeated stop
calls share disposal and cannot bypass that wait.

If an SDK operation never settles, a restart can remain pending. Cancellation
still settles its public start when stopped again. The plugin cannot prove
termination of unabortable native/WASM work or recover resources hidden inside
a rejected SDK initialization. Do not claim otherwise from Promise cancellation.

`releaseSegmenter` calls the supported segmenter.dispose API and observes any
returned Promise. The installed body-segmentation 1.0.2 MediaPipe implementation
calls its underlying solution.close without returning that result. Consequently
awaiting dispose does not prove the native close or GPU release has completed.
Actual resource release, model requests, cross-instance TF state and devices
remain PKG-MASK-05 evidence requirements. Do not depend on private SDK fields to
make a disposal test appear stronger than its real API.

## Behavior and compatibility boundaries

- Keep registrar-time option snapshots and the historical OR defaults. Zero
  modelSelection/opacity/threshold/blur still take their defaults; explicit
  smoothSegmentation=false is retained. Template references are captured before
  getters in the option snapshot run.
- Keep runtime=mediapipe and modelType=general. The current adapter maps general
  to modelSelection=0 and ignores several additionally passed plugin options;
  connecting those options would be a behavior change, not a cleanup.
- tf.setBackend('webgl') fulfilled false does not mean CPU fallback. Only rejection
  tries CPU. TF backend selection does not prove MediaPipe's inference backend.
- Model creation failure still logs `Error initializing segmenter:` and resolves
  start, but no longer creates an idle endless RAF loop. Explicit start retries.
  CPU/backend failure still rejects explicit start; automatic ready logs the
  observed rejection through `Failed to start danmuku mask:`.
- No video/layer or no 2D context fails startup before retaining an accessible
  model or loop. Missing dimensions waits for readable frames. These are failure
  handling corrections; normal video inference/output is unchanged.
- Active inference/read failures retain `Error in segmentBody:` and retry on the
  next frame without silently clearing an earlier mask. Late failures after
  cancellation are observed without restarting work or overwriting user state.
- Preserve white foreground/black background binary colors, drawMask arguments,
  canvas PNG data URLs and strict RGB >250 transparency (250 stays opaque).
  The canvas remains private; it is never inserted into Danmuku's node pool.
- This task introduces no public events, type augmentation, SDK dependency
  updates, default CDN pinning or new model-selection semantics.

## Editing and validation

From the repository root with pinned Node and Yarn:

```sh
node node_modules/typescript/bin/tsc -p packages/artplayer-plugin-danmuku-mask/tsconfig.json
node --test test/danmuku-mask-lifecycle.test.js
yarn test:danmuku-mask
yarn test:danmuku-mask-types-package
yarn build:ts artplayer-plugin-danmuku-mask
node --test test/danmuku-mask-failures.test.js refactor/scripts/danmuku-mask-contract.test.mjs
node node_modules/eslint/bin/eslint.js packages/artplayer-plugin-danmuku-mask/src test/helpers/danmuku-mask-candidate.js test/danmuku-mask-lifecycle.test.js
yarn build artplayer-plugin-danmuku-mask
yarn dev artplayer-plugin-danmuku-mask
```

The candidate helper requires exactly one JS/TS source entry, bundles current
owned modules and substitutes the SDK
imports with controlled implementations. Its fake RAF/video/canvas test
cancellation and output ownership; they do not prove real model quality, canvas
pixels, CSS alignment, CORS, browser scheduling, GPU memory or WASM cleanup.
Historical probes remain frozen and assert old failures, not candidate success.

Future changes to controller scheduling must cover stop/destroy during backend,
model, inference, binary-mask and draw waits; repeated/concurrent starts; restart
behind disposal; synchronous SDK reentry; RAF zero; late rejection; and listener
rollback. Change the output module only with pixel-boundary and late-commit tests.
Two registrations in the same controlled SDK/RAF environment also verify that
stopping or destroying one leaves the other model, mask and scheduled frame owned
by its original player. Native shared TensorFlow backend state remains unverified.

`yarn test:browser test/browser/danmuku-mask-native.spec.js --workers=1` now covers
actual local model loading, bitmap alpha and owned canvas cleanup, new/old cores,
real Danmuku delivery after model readiness, pause/seek and CSS web fullscreen.
Both Mask and Danmuku compile from current source by default. Set
ARTPLAYER_MASK_ARTIFACT and ARTPLAYER_DANMUKU_ARTIFACT to explicit global builds
for artifact verification; attachments record both inputs and hashes. Missing
specified files are errors, not a source or dist fallback.
Archive each report before another browser run. The startup timestamp diagnostic
can still miss a row; do not interpret the post-ready assertions as losslessness.
Native acceptance still needs source changes, multiple players, failure recovery,
devices and internal GPU/WASM resources. The default unversioned solutionPath can
load assets independently of Yarn's SDK resolution. PKG-MASK-05/06 retain the
real combination and distribution/release gates after source/type migration.

## Installed package and local model validation

`yarn test:package --browser` prepares Mask and Danmuku. With its map in
ARTPLAYER_BROWSER_ARTIFACTS, `yarn test:browser:installed danmuku-mask-native`
uses verified installed wrappers and the same fixed local model. The SDK included
in the bundle and model assets loaded through solutionPath have distinct origins;
the model is not inside the Mask tarball. The server verifies model bytes before
serving and records their file/baseline hashes in its manifest. Only metadata
newline conversion is tolerated; executed scripts and binaries are exact.

Each combination records both wrapper identities; published Danmuku controls
remain present. Missing/tampered installed bundles cannot rebuild from source.
Installed mode rejects ARTPLAYER_MASK_PROFILE=1; explicit source profiling remains
available. Native model output, CSS masking, bounded post-ready load, GPU closure,
physical devices and redistribution evidence retain their separate gates. See
../../refactor/changes/2026-09-15-CI-01-danmuku-installed.md for actual results.
