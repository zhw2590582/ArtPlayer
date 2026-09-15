# DASH Control implementation

The factory remains `artplayerPluginDashControl(option = {})(art)`. Its result has
`name` and synchronous `update(): void`. Installation does not require `art.dash`
yet; `ready`, `restart`, or explicit `update()` reads and validates that instance.
The caller creates, attaches, replaces, and destroys the SDK. This plugin never
destroys it, changes its source, or adds a runtime dependency on dash.js.

## Module map

Automatic SDK refresh captures an open, plugin-owned quality or audio settings
panel before updating both menus. The menu module restores its new selector only
if settings remain visible, navigation was reset to the root, and the replacement
still belongs to this plugin. Restoration runs after both updates because updating
the sibling menu also resets the core settings view. It uses existing optional
`find`, `active`, `option`, `show` and `render` capabilities; no core API change or
new event subscription is required. The entry checks SDK identity, destruction
and the exact update revision before restoration and during its final lookup.
Nested explicit updates invalidate the earlier restore. Closed, foreign, removed
or unsupported panels are not reopened. Explicit public `update()` retains the
historical navigation behavior. Browser tests drive real SDK selection changes
while each submenu is open and then select another option through normal clicks.

| File                                       | Responsibility                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `src/index.ts`                             | Deferred installation, media identity, update revisions, event subscription and cleanup |
| `src/sdk.ts`                               | 4.x qualityIndex vs 5.x representation ID access and manual/Auto selection              |
| `src/sdk-events.ts`                        | Owned SDK subscriptions, coalesced refresh, teardown and asynchronous errors             |
| `src/cleanup.ts`                           | Ordered cleanup, revision guards and first thrown value preservation                    |
| `src/seek-buffer.ts`                       | Exact SDK 4.5.2 empty-seek metric recovery and stale/reentrant measurement guards        |
| `src/types.ts`                             | Narrow internal SDK, host, model and cleanup types                                        |
| `src/mapping.ts`                           | Names, current item matching, duplicate labels and selector ordering                    |
| `src/menu.ts`                              | Control/setting ownership, selection callbacks and owned settings navigation             |
| `src/audio.svg`, `src/quality.svg`         | Existing setting icons                                                                  |
| `types/artplayer-plugin-dash-control.d.ts` | Public options, generic SDK inputs and callable result               |

Dependencies flow from the entry into mapping/menu, and from mapping into the SDK
adapter. Mapping has no DOM dependency. Menu receives a model and validity callback;
it does not choose SDK versions. The event observer receives active/refresh/reset
callbacks and owns no DOM or ArtPlayer object. All eight owned modules are checked with strict
TypeScript, noUncheckedIndexedAccess, and skipLibCheck=false; there are no remaining
owned JavaScript modules in this package.

## Selection and lifetime

An update validates the captured media element and starts a new revision. A callback
from an older update, replaced SDK, or destroyed player returns its previous label
without mutating the SDK or UI. This includes references retained by consumers.
Every caller formatter and SDK operation is followed by a validity check before
subsequent effects. A nested update wins over its older caller.

Manual quality first disables video ABR, then uses the stored SDK selection key.
Auto only enables video ABR. Audio passes the original track object to the SDK.
Successful selection retains the existing notice, controls.check, setting.check
order and synchronous label return. SDK/getName exceptions remain synchronous with
their original identity. Other ABR settings are not overwritten.

Duplicate labels still occupy one row. When a duplicate is current, that row keeps
the selected item's key/object so its highlight and subsequent click agree. Numeric
zero is a valid representation ID; a representation named `auto` is still manual
because the synthetic Auto row is distinguished by its value. Audio prefers object
identity, then a unique match on the current track's available id/index/lang fields.
Ambiguous matches remain unselected instead of selecting an arbitrary track.

Only menus actually installed by this instance are removed on empty topology,
disabled surfaces, failed rendering, or destruction. Where registry lookup exists,
the saved callback identity protects an entry replaced by the caller. Cleanup takes
a snapshot so a synchronous restart cannot cause old cleanup to remove new menus.
Cleanup attempts all owned surfaces/subscriptions even if one removal fails.
Installation failure rolls back subscriptions, including one installed by a throwing
host. The primary error is preserved; secondary cleanup errors are reported.

Keep `dash-quality`/`dash-audio`, selector shape, right control placement/padding,
setting width/icons, defaults and unbound getName calls compatible. Do not use a
filtered representation array index or absoluteIndex as the SDK 5 selection key.

## SDK-driven refresh

After media identity validation, bind seven listeners only when both SDK `on` and
`off` exist. Quality requested/rendered, track rendered and stream updated/initialized
events coalesce into one Promise microtask. This keeps notice/check ordering within
a synchronous menu selection intact. Events emitted by a formatter during refresh
do not schedule recursive refreshes. Unchanged playback-time events only read the
Auto boolean; they do not call formatters or redraw menus. Pure configuration writes
with no subsequent SDK event still need explicit `update()`, especially while paused.
No polling timer or SDK method interception is installed.

Stream teardown invalidates queued work and clears menus without reading detached
media. Stream initialized/updated can restore menus on the same caller-owned SDK.
Replacing `art.dash` requires ready/restart or explicit update to bind the new SDK.
Release invalidates the record before calling the captured `off` method and attempts
every owned removal. Reentrant replacement wins; caller listeners remain installed.

An asynchronous SDK getter/formatter failure stops observation, clears owned menus,
and warns with the original error. Restore the offending formatter/SDK state and
call explicit `update()` to recover. Explicit update and synchronous menu errors keep
their original throwing behavior. Never convert the public update API to a Promise
or destroy an SDK to handle a plugin rendering failure.

## Types and compatibility

`cleanup.ts` is shared by menu removal, SDK unsubscription and entry teardown.
It records whether an action threw separately from the thrown value, so `undefined`,
`null`, `false`, zero (including negative zero), empty strings and `NaN` propagate
unchanged. Remaining owned cleanup actions still run; a newer update revision stops
stale menu cleanup before the next action. Later failures cannot replace the first.
This does not change the observer's asynchronous warning policy or make the caller's
SDK plugin-owned. A caller's throwing `beforeUnmount` can prevent that particular
core control from being removed; the plugin releases its sibling surfaces and
propagates the original error rather than bypassing the core callback contract.

`test/dash-cleanup-errors.test.js` covers both SDK method generations, all seven
values, secondary errors, complete unsubscription and repeated destruction. The
browser regression uses public control updates with fresh selector items: core
selector items acquire non-configurable DOM references and must not be reused as
new input objects. It exercises actual old/new core `beforeUnmount` callbacks.

`src/types.ts` describes the narrow SDK and registry surfaces, menu models, event
names, labels, and cleanup callbacks. SDK keys may be absent in malformed external
data; the internal types retain that possibility instead of asserting every value
exists. SDK methods are optional by generation. Non-null assertions in `sdk.ts`
preserve the selected method family's historical synchronous failure when a caller
provides an incomplete SDK. They do not validate the whole SDK at runtime.

The entry casts only the externally augmented ArtPlayer boundary to the narrow host.
The non-empty track check protects the fallback item. Quality sorting casts apply
before the synthetic Auto row is appended, and the manual selection key cast follows
the Auto branch check. These assertions do not generate runtime conversions or mask
the controlled error/identity tests. Changes to SDK capability detection belong in
`sdk.ts`, not in a global `any` or ambient module escape.

Public `Config`, `Option`, `QualityLevel`, `AudioTrack`, and `Result` are named types.
AudioTrack id/index/lang include null as declared by both actual SDK generations;
internal AudioFields aliases that public shape. Nullable default labels preserve
runtime behavior, while caller formatters must still return strings.
Default callbacks infer known SDK fields; explicit generic parameters or callback
annotations accept a caller's more detailed SDK interfaces. Original object-based
formatters remain valid. The optional overload supports omitted/undefined options;
the last required overload preserves historical `Parameters<typeof factory>[0]`.
Formatters still receive exactly one argument and return a string; update returns
void synchronously. No global augmentation claims every ArtPlayer has a DASH SDK.

The historical `.d.ts` path stays available. `.d.cts` exports a callable CommonJS
value with a type namespace; `.d.mts` bridges ESM default/named types. Runtime root
and legacy paths are unchanged. `typesVersions` supports old Node10 type resolution
for the legacy subpath. The online editor declaration is generated by `yarn build:ts`
and checked standalone against both TS 4.3.5 and 5.9.3, then consumed by real Monaco.

## Validation and next work

The bilingual `artplayer-vitepress/docs/{en/,}plugin/dash-control.md` guides contain
the exact `docs/assets/example/dash.control.js` setup. The example keeps one final
SDK cleanup listener, releases replaced instances once, skips SDK-dependent controls
when MediaSource is unsupported, and formats nullable language metadata safely.
`test/dash-example.test.js` exercises the actual source against these old failures.
`document-dash.spec.js` requires both guides to match that source, then runs it with
both frozen SDK generations and published/candidate core. WebKit's unsupported
branch is capability evidence only. The original SDK initialization settings and
plugin APIs are unchanged; full SDK/device/DRM acceptance remains separate.

When changing the example, update both guides, run the example and browser tests,
rebuild the LLM corpus/docs and refresh the site inventory. `document-site.spec.js`
checks guide navigation and the two-library Run Code parameters in both languages.

Run at the workspace root with pinned Node and Yarn:

```sh
yarn test:dash-control
yarn build artplayer-plugin-dash-control
yarn test:browser test/browser/dash-control.spec.js --trace on
yarn test:browser test/browser/dash-editor-types.spec.js --trace on
yarn build:ts
yarn test:dash-types-package
yarn ci:check
```

`ARTPLAYER_TEST_DASH` adds main/legacy/module files to both SDK generations of Node
contracts and lifecycle tests; use the operating system's path delimiter.
`ARTPLAYER_DASH_ARTIFACT` selects the browser plugin artifact. Archive browser report
and result/trace directory before running another suite because the output is shared.

Tests use frozen npm 1.1.0, a frozen pre-refactor 5.x implementation, and candidates.
`test/types/dash-source.ts` checks source/public factory compatibility;
`test/types/dash-control.ts` covers module modes and rejects invalid calls. The
legacy fixture is checked against the actual published declaration and candidate.
`test:dash-types-package` packs the current core and DASH with Yarn, installs the
tarballs offline outside the workspace, repeats a frozen install and checks all
public type modes without resolving any workspace source. It also verifies that
implementation files/config do not leak into the archive. This is type acceptance.
Verified installed files are retained under the report's `installed-artifacts/`
directory for subsequent runtime/browser checks; every retained file is checked
against its tarball hash before the temporary outside-workspace consumer is removed.
The full installed runtime and SDK release matrix still belongs to PKG-DASH-06/05.
`dash-control.spec.js` tests exercise real old/new core DOM, menu clicks, native MP4 and cleanup,
with controlled SDK methods. They do not load dash.js or test MPD/ABR decoding.
PKG-DASH-05 must verify pinned dash.js 4.5.2 and 5.2.1 with real adaptive media and
review SDK-driven refresh/source events and the existing demo lifecycle. Physical
devices and installed package acceptance remain separate release gates.
`dash-sdk.spec.js` now separately loads hash-pinned npm dash.js 4.5.2/5.2.1 and local
multi-quality/multi-audio DASH segments. It covers decoding, explicit update after
external selection, source topology replacement, retained callbacks and SDK ownership.
It also includes a native SDK control without an ArtPlayer instance. SDK 4.5.2
paused-seek stalls reproduce independently: its empty buffer-clear path preserves
stale buffer metrics and can prevent further scheduling. A diagnostic backport of
the SDK 5 buffer-level refresh confirms the cause. The candidate now adds the
bounded compatibility recovery described below; the original SDK and published
plugin controls retain their historical failures.
See the [diagnosis](../../refactor/changes/2026-09-12-PKG-DASH-05-seek-diagnosis.md).
The compatibility risk remains open. Unsupported MSE is
recorded as a playback capability gap, not acceptance. SDK event tests also cover
external selections without explicit update, same-SDK source replacement, asynchronous
formatter error/recovery, and actual setting clicks during SDK refresh.
`refactor/scripts/dash-sdk-types.test.mjs` compares actual SDK-only and plugin
consumers across ten compiler/module configurations, retaining upstream-only
Node10/old DOM diagnostics. The exact peer dependency closure is hash-pinned in
`refactor/baselines/dash-type-dependencies.json`; no type shim or paths mapping is used.
See [refactor validation](../../refactor/dash-validation.md) for baseline failures
and [task plan](../../refactor/plan.md) for remaining type and release work.

## SDK 4.5.2 paused seek recovery

`seek-buffer.ts` creates a callback only for version 4.5.2 with the required SDK
capabilities. The existing observer owns its `playbackSeeking` listener and applies
the same SDK identity, teardown and destruction guards. Other SDK generations
retain the original subscription set. No timer or asynchronous retry is added.

The callback reads each active audio/video processor's range at the native media
time. It records a zero metric only while seeking, with a positive stale cached
level, no available forward buffer, no pruning in progress and no pending clear
ranges for that target. It rechecks the active SDK, stream, metrics object, media
identity and time before writing. A reentrancy guard and final active check prevent
late writes during metrics callbacks or destruction. Metric failures warn without
removing otherwise valid menus, and a later seek can try again.

The SDK scheduler reads `DashMetrics.getCurrentBufferLevel`, rather than the buffer
controller getter. Calling its existing `addBufferLevel` records an actual empty
range measurement; it does not replace SDK methods or settings, set media time,
dispatch DOM events, remove SourceBuffer data or reset the SDK. These are internal
SDK capabilities, so the exact-version guard is deliberate. Reading returns
seconds while metric storage uses milliseconds: only zero is written here.

`dash-seek-diagnostics.js` contains separate page-only counterfactuals. The GETTER
and METRICS diagnostic switches run after an original failure and leave that test
failed; they cannot be combined with each other, the synthetic-event diagnostic
or a patched SDK. The shared stable-pause browser flow tests both original native
controls and strict candidate recovery with new/old core versions. Node tests
cover invalid measurements, missing capabilities, SDK replacement, teardown,
reentrancy, identity changes and error recovery. Standalone old SDK/old-plugin
limitations, physical devices and full release acceptance remain separately tracked.

## Shared installed browser scope

dash-control.spec.js exercises native MP4 and real core DOM with controlled SDK methods. dash-sdk.spec.js loads the actual frozen dash.js 4.5.2/5.2.1 SDKs and MPD fixtures. Its SDK capability attachment does not claim a plugin was loaded; dash-plugin-inputs records the selected plugin only in integration cases. Installed mode rejects diagnostic SDK substitutions and synthetic recovery probes.

Use `yarn test:package --browser` and the shared scope rules in
../../scripts/browser-validation/README.md. Missing, stale or changed installation
inputs fail without source fallback. Attachments distinguish selected installed,
source and published inputs. Source mode retains existing explicit artifact use.
The generic Node/type consumer remains core/chapter-only. Module forms, physical
devices, editor demos and release readiness retain their separate package gates.
See ../../refactor/changes/2026-09-15-CI-01-adaptive-installed.md for actual results.
