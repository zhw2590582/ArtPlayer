# JASSUB type compatibility

The root and `/legacy` declarations retain the complete npm 1.0.0 and 1.1.0 type
shape, including known mistakes. Existing TypeScript consumers do not need to
change imports as part of this migration. Both releases used the same declarations.
The generated online-editor global also preserves this historical surface.

For accurate types, explicitly opt into the additive entry:

```ts
import jassub from 'artplayer-plugin-jassub/runtime'

const register = jassub({
  workerUrl: '/assets/jassub-worker.js',
  wasmUrl: '/assets/jassub-worker.wasm',
  modernWasmUrl: '/assets/jassub-worker-modern.wasm',
  subUrl: '/subtitles.ass',
})
// Add register to the existing Artplayer plugins option.
// When called with an Artplayer, it synchronously returns { name, instance }.
```

`/runtime` uses the same JavaScript file as the root entry. It does not change
defaults, wrap instances, download resources differently or introduce a second
implementation. URLs are optional because the vendor has defaults; this does not
mean its default relative URLs will exist on your site. Continue hosting compatible
worker, WASM and font files and supplying the paths your deployment needs.

| Area | Historical root types | Accurate `/runtime` types and existing JavaScript |
| --- | --- | --- |
| Factory options | Required, with three required URLs | Optional options; optional resource URLs |
| Instance resize | force, width, height, top, left | width, height, top, left, force |
| resize/setVideo/destroy | Promise<void> | Synchronous; no-argument calls return void |
| sendMessage | Unchecked extension | Promise<void>, resolves after posting, not after Worker completion |
| Events/styles | Unchecked extension | Typed callbacks and partial mutation objects |
| ASS event Style | Unchecked extension | Numeric libass style index |
| ASS Start/Duration | Unchecked extension | Milliseconds; setCurrentTime uses seconds |
| Unknown fields/methods | Existing any indexes | Named supported fields; unknown members rejected |

Switching to `/runtime` intentionally changes type inference. For example,
`instance.resize(640, 360, 0, 0, true)` describes the actual call order.
`await instance.destroy()` remains legal JavaScript, but `.then()` on that result
never worked at runtime. Resource teardown completion is not represented by a Promise.
The callback error channel is `Error | ErrorEvent | null`; an error may omit the data.
The currently frozen vendor has a request timeout/error bug that throws before user
callbacks run. PKG-JASSUB-07 tracks the fix; typing that channel does not fix or guarantee
callback delivery. Query outputs do not contain the upstream npm declaration's `_index`.

The accurate instance extends EventTarget and preserves its normal listener APIs.
`destroy(error)` returns the original Error, or converts a nonempty string to Error;
an empty string is returned unchanged. Repeated direct destruction and construction/
video clock failures remain separate vendor lifecycle work, documented in ARCHITECTURE.md.

NodeNext ESM retains the root declaration's historical CommonJS namespace behavior.
If existing code uses the root namespace's `.default` to satisfy that declaration,
keep that form or opt into `/runtime`, whose conditional `.d.mts` is directly callable.
CommonJS accurate types use `import jassub = require('artplayer-plugin-jassub/runtime')`.
Do not invent `jassub.default`: the current JavaScript factory has no self alias.
Older TypeScript resolves `/legacy` and `/runtime` through exact typesVersions mappings.
Existing direct declaration paths are retained; no wildcard remaps unrelated paths.

Maintain `runtime-api.d.ts` against the frozen wrapper and worker behavior, not a new
upstream version. Keep CJS/ESM entry aliases synchronized. Run `yarn test:jassub-types`,
`yarn test:jassub-types-package`, `yarn test:jassub`, and `yarn typecheck` after changes.
The package runner installs actual historical archives and the candidate outside the
workspace, checks strict positive/negative consumers, and verifies artifact identity.
This is type/distribution evidence, not browser playback or final release acceptance.
