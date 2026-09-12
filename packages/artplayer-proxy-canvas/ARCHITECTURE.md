# Canvas proxy maintenance

Public entry: `src/index.ts`; public declarations remain in
`types/artplayer-proxy-canvas.d.ts`. The factory accepts the optional drawing callback,
then synchronously returns an actual HTMLCanvasElement when registered with ArtPlayer.
The public namespace preserves the optional callback and exact Canvas return extraction.
MediaCanvas is an explicit type view, not a narrowed factory result. CommonJS and browser
factory.default are self aliases; .d.mts/.d.cts wrappers distinguish ESM and CommonJS
resolution, and typesVersions keeps the legacy path available to older TypeScript.
Historical JavaScript falsy callback arguments remain ignored at runtime; the typed public
callback remains optional and function-valued.

| Module | Ownership and responsibility |
| --- | --- |
| index.ts | Host event subscriptions, deferred media forwarding, initialization rollback and terminal disposal |
| adapter.ts | Preserve native canvas methods; forward only video properties absent from canvas; guard escaped media actions after disposal |
| media.ts | Connect the backing video before playback and release its source, stream reference and DOM node |
| geometry.ts | Finite intrinsic dimensions and aspect-fit canvas/padding calculations |
| renderer.ts | Decoded-frame eligibility, bitmap acquisition/close, callback and draw/error notification order |
| scheduler.ts | One outstanding draw, coalesced requests, generations and nullable RAF ownership |

Only the entry receives ArtPlayer. The renderer has no host/DOM ownership, the scheduler
has no media knowledge, and geometry is independent of scheduling. No package imports
private core implementation modules.

## State and event order

Canvas methods keep their receiver and win over same-named video methods. Media properties
remain live enumerable/configurable descriptors. Assigning src/srcObject or invoking load
invalidates pending frames; the returned canvas and callback arguments keep their identities.
The video is connected before play with absolute positioning, transparent opacity, no focus
or pointer interaction, and intrinsic CSS sizing. Do not change it to a 1px square: tested
WebKit then reports 1x1 media dimensions and loses the source geometry.

Media forwarding remains deferred until core initialization has installed its event registry.
Native events are forwarded as `video:<type>` with the original Event. Native removal is
owned before calling the extensible art.proxy registrar, so partial registration can roll back.
Host subscriptions are also owned before art.on, including reentrant destruction during setup.

play starts one draw chain; duplicate play does not start another. resize coalesces a new
draw and invalidates an in-flight result. pause/source replacement invalidates pending work
and cancels the current RAF, including ID zero. Paused seek requests one fresh frame.
After bitmap acquisition, stale results are closed without drawing. Acquired bitmaps are
closed in finally even if drawImage throws, and before invoking the public callback. An
active callback failure emits the original error; a callback destroying the host cannot emit
a subsequent draw event or restart work. Observer failures cannot strand the scheduler busy.

readyState alone does not prove a drawable frame. Seeking or insufficient data suspends
drawing. The recorded Chromium first-frame case rejects bitmap acquisition with
InvalidStateError at currentTime 0 and zero video frames even at readyState 4; that exact
acquisition condition is deferred until another request. A zero frame counter is not a
general capability check: tested WebKit draws successfully with that counter at zero.
Errors from user callbacks or drawImage are not classified as bitmap acquisition failures.

destroy invalidates generations, clears the deferred timer, removes all host/native
subscriptions, pauses and unloads backing video, releases srcObject without stopping
consumer-owned tracks, removes the internal video and clears canvas buffers. Cleanup
attempts every resource even when one disposer throws. Captured play/load methods and
forwarded setters become inert. Native Canvas methods still operate on the same element.

## Verification and remaining work

`yarn test:canvas` runs frozen historical and candidate lifecycle tests. Candidate tests can
be run against the frozen workspace with ARTPLAYER_CANVAS_BASELINE=1. Historical inputs
come from verified archives/Git via `refactor/scripts/canvas-contract.mjs`, not current dist.

`test/browser/canvas-lifecycle.spec.js` tests actual candidate source, native pixels and
dimensions, paused seek, source replacement, callback destruction and escaped methods on
actual npm core 5.4.0 and the candidate core in three engines. `ambilight-proxy.spec.js`
uses the candidate source loader after module splitting; its palette test proves sampling
geometry and is separate from native media pixel acceptance. npm core 5.1.7 has no proxy
option and is only a native-player capability control.

`yarn test:canvas-types-package` installs real archived and candidate packages outside the
workspace, verifies installed bytes and checks old/current compiler modes. The public
namespace also generates the local editor declaration through the semantic generator.
Broader installed artifact contents/deep paths and 8082 demos remain 06.
Real Safari/mobile/device scope remains 05; Windows Playwright WebKit is not a device claim.
See `refactor/canvas-validation.md` and the task evidence for actual outcomes and limitations.
