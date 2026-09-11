# HLS control maintenance

The public entry remains `src/index.js`: `artplayerPluginHlsControl(option = {})` returns a
synchronous ArtPlayer plugin with `{ name: 'artplayerPluginHlsControl', update }`. `update()`
returns undefined. The consumer creates, attaches and destroys `art.hls`; this plugin does not
import Hls.js or own its media engine. Public declarations are still in `types/` pending the
separate TypeScript migration (PKG-HLS-04).

| Module | Responsibility |
| --- | --- |
| `src/index.js` | Core ready/restart/destroy hooks, current engine identity, refresh generation, selection event barrier |
| `src/mapping.js` | Quality/audio labels, duplicate groups, selected item and Auto policy; no ArtPlayer/DOM dependencies |
| `src/menu.js` | Existing controls/setting update/remove/check APIs, current callback ownership and stable menu reuse |
| `src/sdk-events.js` | Optional SDK event capabilities, six subscriptions, setup rollback and listener release |

The entry depends on these three modules; they do not import the entry or each other.
SVG icons remain local build inputs. There is no cross-instance cache, timer, worker or fetch.

## Refresh and selection

Registration does not require an Hls instance yet. The first ready/restart/manual update checks
`art.hls.media === art.template.$video` and binds SDK events. A plain compatible host without
`constructor.Events`, `on` and `off` retains manual/core-event updates. An engine replacement
releases only the plugin's own subscriptions. Core destroy detaches hooks and makes retained
updates/selectors inert; core remains responsible for DOM removal or preservation.

Supported SDK hooks are MANIFEST_PARSED, LEVELS_UPDATED, LEVEL_SWITCHED, AUDIO_TRACKS_UPDATED,
AUDIO_TRACK_SWITCHED and DESTROYING, using the SDK's actual exported event names. DESTROYING
retires that engine and removes owned menus; a subsequent callback cannot revive it.
If subscription setup throws, installed listeners are removed and a later update can retry.

Explicit update rebuilds selectors using current options. SDK events reuse current selectors
when engine, display surfaces, title, labels and values are unchanged, updating selection through
the normal core check APIs. An unavailable selection clears obsolete defaults/labels. Empty lists
or disabled display surfaces remove their respective entries, and later updates can restore them.

Selection writes the SDK property, then notice, then controls.check and setting.check, returning
the selected HTML. SDK events emitted synchronously during the write are deferred until this
operation finishes. A formatter or core callback that replaces the engine, destroys the player or
starts a newer refresh cannot commit the older refresh. Formatting/SDK write failures remain
synchronous; selection does not introduce a Promise. The SDK's own event exception handling still
applies to automatic event-driven formatting.

## Compatibility and intentional corrections

- Keep names `hls-quality`/`hls-audio`, right-side controls, existing SVGs, settings width 200,
  title/tooltip defaults, factory/global name and root/legacy distribution paths.
- Pass original SDK objects to getName: selected-label calls have one argument; list-label calls
  also receive the index. Do not bind a new `this` or claim the index is always present.
- Auto uses `autoLevelEnabled === true`; hosts without this capability fall back to currentLevel.
  Quality's Auto value remains -1. Audio does not acquire a new synthetic Auto option.
- Duplicate labels still collapse into one group. If a later duplicate is selected, its value
  represents that group so the real selection is not lost. Quality sorts by represented index;
  audio retains group order. Undefined labels remain distinct.
- Old SDK callbacks after replacement/destroy, lingering empty menus and an Auto label derived
  from the currently decoded automatic level were defects, not guarantees to preserve.

The plugin owns its two reserved menu names. Applications should use distinct names for unrelated
entries. Hls instances and third-party SDK listeners remain owned by their callers. No minimum
core/SDK version has been newly imposed; the tested historical core is 5.4.0 and SDK is 1.5.17.

## Validation and next changes

Use the repository's pinned Node and Yarn:

```sh
node --test test/hls-control.test.js
yarn test:browser hls-control.spec.js
yarn build artplayer-plugin-hls-control
yarn ci:check
```

ARTPLAYER_TEST_HLS accepts platform-delimited paths to built main/legacy/ESM files for additional
Node contracts. ARTPLAYER_HLS_ARTIFACT selects a built browser main/legacy file; invalid paths fail,
and test attachments record its bytes. These checks do not replace isolated tarball installation.
Use the local demo at `http://localhost:8082` with example `hls.control` during example work.

Windows Playwright WebKit lacks MSE; explicit capability/error cleanup runs there, while playback
cases are marked skipped. Safari/native HLS, SDK workers, grouped track changes, SDK version range,
updated example and isolated package verification remain PKG-HLS-05/06 work. See
[refactor validation](../../refactor/hls-validation.md). Keep these gaps visible in release reviews.
