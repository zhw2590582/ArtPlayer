# Chapter implementation and maintenance

The default export remains the synchronous `artplayerPluginChapter(option?)`
factory. It registers `artplayerPluginChapter` with a synchronous `update(option)`
method; the update object is required. All implementation modules are TypeScript.

## Module map

| File | Responsibility |
| --- | --- |
| `src/index.ts` | Public factory, ArtPlayer integration, metadata initialization, update transaction and listener ownership |
| `src/chapters.ts` | DOM-free validation, sorting, Infinity replacement and gap insertion |
| `src/progress.ts` | Owned chapter/title elements, progress widths and hover title positioning |
| `src/stylesheet.ts` | Import-time global stylesheet installation, including deferred document readiness |
| `src/types.ts` | Internal aliases derived from the existing public declaration; no runtime imports |
| `src/style.less` | Existing CSS classes and theme variables |
| `types/artplayer-plugin-chapter.d.ts` | Consumer declaration and compatibility boundary |

Dependencies flow from the entry to normalization and rendering. Neither of those
modules receives an ArtPlayer instance. Rendering accepts a progress container and
normalized ranges; only the entry reads player duration or emits/subscribes to
player events. No new runtime dependency or new core API is required.

## Updates and compatibility

The first `video:loadedmetadata` initializes chapters from the factory option.
Each update clears the previous view/class/title before validating. A valid finite
timeline sorts the caller array in place, replaces `Infinity` ends, validates ranges,
then inserts empty-title gaps in that same array. Existing entry references are
preserved. Do not replace this with immutable normalization without assessing old
callers. Titles remain unmodified in caller objects and are trimmed for display.

The renderer creates the historical classes and data-start/end/duration/title
attributes. A successful update adds the historical player class, then emits
`setBar('loaded', art.loaded || 0)` synchronously. Progress events update the three
bars; a shared boundary belongs to the later chapter for hover title selection,
matching the old traversal order. Titles use textContent, never caller HTML.

`update({})` and non-array chapter input clear the view. Invalid types throw
TypeError and invalid time ranges throw Error with the existing messages. NaN and
non-finite starts/ends are now rejected; an Infinity end is still normalized first.
Without a positive finite duration the view stays empty and caller data is untouched.
Initialization remains once-only: after changing sources, callers explicitly update
with chapters for the new duration. No implicit source ownership or new events were added.

## Resource ownership

Each instance owns its progress container children and named setBar, metadata and
destroy callbacks. On destroy it removes only those callbacks (including a pending
once callback), removes its two owned DOM roots and player class, and releases the
render state. This cleanup also applies to `destroy(false)` while leaving the core's
retained player tree and other plugins alone. Retained plugin results become no-ops
after destruction; a late metadata callback cannot recreate UI or mutate input.

The stylesheet is document-owned, shared across instances and retained after destroy.
Deferred installation rechecks the ID when DOMContentLoaded fires, so two script
loads during document parsing cannot create duplicate style elements. Its readiness
listener is once-only. SSR import never reads document when it is unavailable.

## Tests and changes

From the repository root:

```sh
yarn test:unit
yarn typecheck
yarn test:browser
yarn test:package
yarn build artplayer-plugin-chapter
```

`test/chapter.test.js` covers normalization and invalid timelines. Browser chapter
tests run the historical and candidate plugin on published core 5.4.0, and cover
real hover/seek, source changes, empty titles, invalid updates, multiple instances,
early destruction and duplicate script loads. Browser playback tests also exercise
the current core. For installed artifacts, use the mapping described in
`test/package/README.md` at repository root. The runnable chapter demo uses
`yarn dev artplayer-plugin-chapter` and the normal localhost:8082 example URL.

For time semantics, start at chapters.ts and run normalization plus browser tests.
For UI, start at progress.ts/style.less and verify real mouse interaction. For event
or cleanup changes, start at index.ts and rerun early destroy/multiple-instance tests.
Any public declaration change also needs new/old compiler and tarball consumers.

The public declaration is intentionally retained during the structural migration;
PKG-CHAPTER-04 owns NodeNext ESM and legacy subpath declaration fixes. The frozen
published baseline is under refactor/baselines; never overwrite it with candidate
behavior. Physical device, full editor and final release checks remain separate tasks.
