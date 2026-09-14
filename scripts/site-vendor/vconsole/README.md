# vConsole lifecycle patch

The public `docs/assets/js/vconsole.min.js` URL remains vConsole 3.15.0 with a
local lifecycle correction. `upstream.js` is the exact npm distribution bundle:
SHA-256 `671f47427e1e3048919147c765e9fb71e4ea40d79a8c2829089f499d3e9b9bf4`.
The archive identity and upstream LICENSE are pinned in `../manifest.json`.
Reference source is Tencent/vConsole commit
`05d80398bae35e793774f74e3c052b4e530e293a` (tag v3.15.0):
`src/log/log.model.ts`, `src/core/core.ts`, and
`src/component/recycleScroller/recycleScroller.svelte`.

## Ownership and build

- `lifecycle.ts` owns queued log frames. Removing the last log plugin invalidates
  the ticket before cancellation, clears its queue/flag, and restores console
  even when cancellation throws. A late cancelled callback cannot consume a new
  queue on the reused singleton log model. Ordinary batches retain order and
  release their flag before flushing, including reentrant logging.
- The same helper schedules panel insertion against the original instance and
  plugin object. Removed or replaced plugins cannot populate a new same-ID tab.
- `build.ts` verifies the whole upstream SHA and six unique insertion points.
  It adds the private helper inside the existing UMD factory, replaces log
  scheduling/unbinding and panel insertion, and guards two virtual-scroller
  continuations after their timers. Svelte sets the bound items element to null
  on destroy; those continuations return before touching removed DOM.
- `../../build-vconsole.mjs` (`scripts/build-vconsole.mjs` from the root)
  is the CLI. TypeScript and esbuild are existing root dev dependencies. The
  helper is emitted as ES5; it uses an array rather than requiring WeakMap before
  the upstream bundle installs its own polyfills. The remaining vendor code,
  CSS and UMD branch selection are retained byte for byte.

Run `yarn build:vconsole` after editing the helper or reviewed patch hooks, then
update the candidate fingerprint in `../manifest.json` and
`refactor/third-party.json` with the validation evidence. Run
`yarn build:site-notices`. `yarn check:vconsole` is read-only and rejects output
drift; it does not update the frozen upstream or bless arbitrary vendor changes.
CI checks generation before notices and rebuilds the patch before notice output.
Never hand-edit the generated minified file.

## Validation and limits

`yarn test:vconsole` covers queue order, reentrancy, cancellation exceptions,
late callbacks, panel ownership, upstream drift and deterministic generation.
`yarn test:browser test/browser/vconsole-lifecycle.spec.js test/browser/site-vendor.spec.js --workers=1`
covers real browser globals, named AMD, CommonJS factory loading, visible logs,
immediate destroy/recreate, same-ID plugin replacement, pending scroller layout,
and the actual mobile page playing local media. Setting
`ARTPLAYER_VCONSOLE_BASELINE=1` serves the frozen original only in the lifecycle
test to reproduce failures; normal CI serves the candidate and expects no errors.
The scroller case holds zero-delay timers to force the late continuation while
using native rendering, ResizeObserver and RAF; this is explicit fault injection.

This patch does not claim complete upstream lifecycle coverage, device coverage,
or permission clearance. The upstream LICENSE is distributed verbatim, but its
missing MIT body and bundled dependency notices remain open in VENDOR-07/SITE-07.
Do not replace or upgrade the bundle to resolve these issues without separately
checking entrypoints, logging, CSS and the full dependency notices.
