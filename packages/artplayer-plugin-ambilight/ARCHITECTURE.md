# Ambilight maintenance

Read the frozen published contracts in `refactor/baselines/ambilight-contract.md`
before changing the public factory or distribution. Source is strict TypeScript;
`types/artplayer-plugin-ambilight.d.ts` owns the public options and result contract.
The runtime derives its option type from that declaration; do not duplicate it.

| Module | Responsibility |
| --- | --- |
| `src/index.ts` | Factory, ready/destroy subscriptions, construction rollback, terminal ownership |
| `src/view.ts` | Nine-cell grid, historical placement/styles, atomic color rendering, owned DOM removal |
| `src/sampler.ts` | Native video dimensions, nine region-to-pixel samples, failed canvas replacement |
| `src/scheduler.ts` | Frequency gate, native RAF ownership, generation checks for reentrant stop/start |

The registration function reads options. `ready` calls `start`; stop cancels the
pending frame but retains the grid and its colors. A paused player retains one
frame loop without sampling. Core destruction closes the public methods, detaches
subscriptions, cancels the frame (including ID zero), releases canvas storage and
removes the grid. Attaching to an already destroyed host is inert.

Cleanup attempts every resource even if another release throws. Construction
preserves the primary error. Synchronous callbacks from custom host utilities can
destroy the host during setup or sampling: check the terminal state after each
external boundary. A frame generation prevents cancelled callbacks and reentrant
stop/start from publishing obsolete colors or creating duplicate loops.

The nine colors are collected before rendering. Missing contexts and invalid
dimensions do not throw. A draw/read exception discards that sample, zeros the old
canvas and replaces it on the next eligible sample. The replacement is necessary:
Firefox's real canvas retained SecurityError after a width reset, while a fresh
canvas could read the recovered same-origin video. Retries remain frequency-gated;
with a permanently cross-origin source this allocates at most one replacement per
eligible sample. No bypass of canvas origin restrictions is attempted.

Sampling uses the actual drawable pixels: native video's videoWidth/videoHeight,
or a canvas proxy's width/height buffer. A proxy can forward the underlying media's
dimensions while rendering a differently sized canvas, so never use its forwarded
videoWidth/videoHeight to crop the output. The internal sampling source union and
nodeName guard also avoid relying on same-window instanceof checks. Zero output
dimensions skip sampling until the canvas has a valid buffer again.

Compatibility constraints: keep numeric style arguments, nine row-major samples,
blur/opacity/frequency/duration defaults, synchronous start/stop returns, option
reading at registration, and the old frequency comparison (including NaN and
Infinity behavior). The historical zIndex option remains ignored (style is 9).
Do not conflate old declaration differences with newly authorized API changes.

Validation: `yarn test:ambilight`, package strict typecheck, normal package build,
and `yarn test:browser test/browser/ambilight-lifecycle.spec.js`. Historical tests
in `test/ambilight.test.js` and `test/browser/ambilight.spec.js` intentionally retain
the old failures. Candidate tests must remain separate. The browser suite runs real
video/canvas with a lexical native RAF observer across published cores 5.1.7/5.4.0
and candidate core in Chromium/Firefox/WebKit. Proxy/device and complete packed
browser/demo acceptance remain tasks 05-06; see `refactor/ambilight-validation.md`.

Root and `/legacy` public types preserve the exact published 1.1.0 required-option
factory and result. Do not add an optional overload or a required `default`
property: preserving `Parameters` alone does not preserve reverse assignment of
ordinary replacement factories. The JavaScript factory still has its historical
self-referencing `default` property and accepts omitted options.

`RuntimeFactory` and `/runtime` describe those optional calls and the self alias.
The subpath maps to the same production files as root, with `runtime.d.mts` for
native ESM and `runtime.d.cts` for CommonJS. `runtime.d.ts` provides Node10's
export-assignment shape through `typesVersions`. Root and `/legacy` use a
types-first mapping to the original default-export declaration, retaining 1.1.0's
NodeNext ESM namespace shape. The editor global is generated from the root
declaration by `yarn build:ts`; it likewise requires an options argument.

This follows the approved `refactor/type-compatibility-policy.md` and ADR-025.
The earlier 1.0.0 export-assignment and required-field conflicts have migration
examples in README. No source, emitted JavaScript, defaults, or old JS entrypoint
changes are part of this type repair.

Run `node --test refactor/scripts/ambilight-types.test.mjs` for public/editor/format
contracts and `yarn test:ambilight-types-package` for offline tarball installations
outside the workspace. The latter verifies two actual published plugin archives and
candidate against the same packed candidate core, five compiler modes plus two
candidate modes with interop disabled, and fifteen negative uses at their exact
statement lines. Published 1.1.0 has four NodeNext ESM diagnostics for the frozen
direct-call fixture; candidate preserves those codes and its valid namespace
consumer. Earlier 1.0.0 raw `import = require` root calls are separately checked:
they compile against 1.0.0 and retain the 1.1.0/candidate non-callable diagnostic.
Candidate `/runtime` raw require and native ESM calls compile successfully.
Published 1.0.0 required all option fields; 1.1.0 already made them optional.

`test/ambilight-proxy.test.js` and `test/browser/ambilight-proxy.spec.js` protect
resized output geometry. Browser tests play real video with the actual workspace
proxy and paint a uniform nine-color palette through its public post-processing
callback; getImageData is native. Actual core 5.1.7 has no proxy option and uses
VIDEO, so its case checks that capability boundary and native playback. Only 5.4.0
and candidate cases validate the canvas proxy combination. These tests do not
establish that the unrefactored proxy's own async draw loop is terminally safe.
