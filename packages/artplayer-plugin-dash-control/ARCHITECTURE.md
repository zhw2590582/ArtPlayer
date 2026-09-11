# DASH Control implementation

The factory remains `artplayerPluginDashControl(option = {})(art)`. Its result has
`name` and synchronous `update(): void`. Installation does not require `art.dash`
yet; `ready`, `restart`, or explicit `update()` reads and validates that instance.
The caller creates, attaches, replaces, and destroys the SDK. This plugin never
destroys it, changes its source, or adds a runtime dependency on dash.js.

## Module map

| File | Responsibility |
| --- | --- |
| `src/index.js` | Deferred installation, media identity, update revisions, event subscription and cleanup |
| `src/sdk.js` | 4.x qualityIndex vs 5.x representation ID access and manual/Auto selection |
| `src/mapping.js` | Names, current item matching, duplicate labels and selector ordering |
| `src/menu.js` | Existing control/setting registries, menu ownership and guarded selection callbacks |
| `src/audio.svg`, `src/quality.svg` | Existing setting icons |
| `types/artplayer-plugin-dash-control.d.ts` | Existing public declarations; precise TS migration follows in PKG-DASH-04 |

Dependencies flow from the entry into mapping/menu, and from mapping into the SDK
adapter. Mapping has no DOM dependency. Menu receives a model and validity callback;
it does not choose SDK versions. This is the structural step, still in JavaScript.

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

## Validation and next work

Run at the workspace root with pinned Node and Yarn:

```sh
yarn test:dash-control
yarn build artplayer-plugin-dash-control
yarn test:browser test/browser/dash-control.spec.js --trace on
yarn ci:check
```

`ARTPLAYER_TEST_DASH` adds main/legacy/module files to both SDK generations of Node
contracts and lifecycle tests; use the operating system's path delimiter.
`ARTPLAYER_DASH_ARTIFACT` selects the browser plugin artifact. Archive browser report
and result/trace directory before running another suite because the output is shared.

Tests use frozen npm 1.1.0, a frozen pre-refactor 5.x implementation, and candidates.
Browser tests exercise real old/new core DOM, menu clicks, native MP4 and cleanup,
with controlled SDK methods. They do not load dash.js or test MPD/ABR decoding.
PKG-DASH-05 must verify pinned dash.js 4.5.2 and 5.2.1 with real adaptive media and
review SDK-driven refresh/source events and the existing demo lifecycle. Physical
devices and installed package acceptance remain separate release gates.
See [refactor validation](../../refactor/dash-validation.md) for baseline failures
and [task plan](../../refactor/plan.md) for remaining type and release work.
