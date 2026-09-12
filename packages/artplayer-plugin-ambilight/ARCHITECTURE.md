# Ambilight maintenance

Read the frozen published contracts in `refactor/baselines/ambilight-contract.md`
before changing the public factory or distribution. Source is strict TypeScript;
the existing public declaration remains the input contract until task 04.

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
and candidate core in Chromium/Firefox/WebKit. Proxy/device, packed consumer and
public type acceptance remain tasks 04-06; see `refactor/ambilight-validation.md`.
