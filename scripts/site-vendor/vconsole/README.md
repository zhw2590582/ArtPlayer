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

This patch does not claim complete upstream lifecycle or device coverage. The
notice set now preserves the original LICENSE, supplies its missing MIT body in a
separate file, and includes the complete licenses of the verified bundled runtime
components. Do not upgrade the bundle without reviewing entrypoints, logging,
CSS and the new dependency notices.

## Historical bundle reconstruction and notices

`refactor/baselines/vconsole-notices-provenance.json` pins 81 original source/config
files from the commit above, the upstream lockfile, nine notice-bearing component
archives and the observed runtime resource paths. The original npm bundle was
reproduced byte for byte using Node 24.21.0 and the frozen upstream npm lockfile.
No upstream install scripts ran. This is an isolated historical reconstruction;
ArtPlayer remains on Yarn Classic with its root yarn.lock.

Prepare a checkout of the exact upstream commit inside `refactor/.cache/`, then
run `npm ci --ignore-scripts --no-audit --no-fund` there. The 81 source/config files
can also be fetched from fixed raw GitHub URLs using the recorded Git blob IDs
and SHA-256 values when the source archive host is unavailable. Return to the
ArtPlayer root and run:

```powershell
yarn verify:vconsole-source refactor/.cache/<upstream-checkout>
```

The helper checks every pinned input and dependency version before loading the
upstream build configuration. It builds only in the ignored checkout, requires
the exact npm bundle SHA-256, rejects hidden/truncated module statistics, and
compares all dependency resources and webpack bootstrap modules to the reviewed
notice set. It never copies the rebuilt bundle over ArtPlayer's patched asset.
Upstream size warnings and its old Browserslist dataset remain visible; do not
update the lockfile or dataset to silence them during historical reconstruction.

The eight runtime packages are @babel/runtime, copy-text-to-clipboard, core-js,
css-loader, mutation-observer, regenerator-runtime, style-loader and svelte.
Only actual resource paths count: less-loader's appearance in a loader chain does
not make it a runtime dependency. Webpack's four generated bootstrap modules also
have a license entry. Mutation-observer's two BSD notices are both retained.
Other packages' MIT licenses retain their own copyright holders.

The published vConsole header explicitly links the MIT license. The upstream
LICENSE omits its promised body, so ArtPlayer supplies `MIT-LICENSE` with that
body and the original Tencent copyright, without pretending it came verbatim
from the archive. `ATTRIBUTION.md` identifies this assembly, original sources and
the local lifecycle modifications. These files and all dependency licenses are
generated into `docs/licenses/vconsole/`; never edit the outputs by hand.
