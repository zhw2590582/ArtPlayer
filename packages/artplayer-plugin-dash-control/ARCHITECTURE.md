# DASH Control implementation

The factory remains `artplayerPluginDashControl(option = {})(art)`. Its result has
`name` and synchronous `update(): void`. Installation does not require `art.dash`
yet; `ready`, `restart`, or explicit `update()` reads and validates that instance.
The caller creates, attaches, replaces, and destroys the SDK. This plugin never
destroys it, changes its source, or adds a runtime dependency on dash.js.

## Module map

| File                                       | Responsibility                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `src/index.ts`                             | Deferred installation, media identity, update revisions, event subscription and cleanup |
| `src/sdk.ts`                               | 4.x qualityIndex vs 5.x representation ID access and manual/Auto selection              |
| `src/mapping.ts`                           | Names, current item matching, duplicate labels and selector ordering                    |
| `src/menu.ts`                              | Existing control/setting registries, menu ownership and guarded selection callbacks     |
| `src/audio.svg`, `src/quality.svg`         | Existing setting icons                                                                  |
| `types/artplayer-plugin-dash-control.d.ts` | Public options, generic SDK inputs and callable result               |

Dependencies flow from the entry into mapping/menu, and from mapping into the SDK
adapter. Mapping has no DOM dependency. Menu receives a model and validity callback;
it does not choose SDK versions. All five owned modules are checked with strict
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

## Types and compatibility

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
implementation files/config do not leak into the archive. This is type acceptance;
the full installed runtime and SDK release matrix still belongs to PKG-DASH-06/05.
`dash-control.spec.js` tests exercise real old/new core DOM, menu clicks, native MP4 and cleanup,
with controlled SDK methods. They do not load dash.js or test MPD/ABR decoding.
PKG-DASH-05 must verify pinned dash.js 4.5.2 and 5.2.1 with real adaptive media and
review SDK-driven refresh/source events and the existing demo lifecycle. Physical
devices and installed package acceptance remain separate release gates.
`dash-sdk.spec.js` now separately loads hash-pinned npm dash.js 4.5.2/5.2.1 and local
multi-quality/multi-audio DASH segments. It covers decoding, explicit update after
external selection, source topology replacement, retained callbacks and SDK ownership.
It also includes a native SDK control without an ArtPlayer instance. Early SDK 4.5.2
paused-seek stalls remain open; later passes do not resolve them. Unsupported MSE is
recorded as a playback capability gap, not acceptance. This plugin currently refreshes
on ready/restart/explicit update, not automatically on external SDK events.
`refactor/scripts/dash-sdk-types.test.mjs` compares actual SDK-only and plugin
consumers across ten compiler/module configurations, retaining upstream-only
Node10/old DOM diagnostics. The exact peer dependency closure is hash-pinned in
`refactor/baselines/dash-type-dependencies.json`; no type shim or paths mapping is used.
See [refactor validation](../../refactor/dash-validation.md) for baseline failures
and [task plan](../../refactor/plan.md) for remaining type and release work.
