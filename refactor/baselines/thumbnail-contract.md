# Thumbnail tool compatibility baseline

Task: PKG-TOOL-THUMB-01. This is a contract inventory, not completion of the
runtime migration or release acceptance. No production source or build output
changes in this task. Run `node --test refactor/scripts/thumbnail-contract.test.mjs`.

## Evidence and version boundaries

`thumbnail-release.json` freezes 11 HTTP observations, 12 baseline workspace Git
inputs and 8 historical Git inputs. The verifier checks bytes/hashes and core
associations without accessing the network. Registry observations are dated
snapshots, not permanent assertions about package availability.

The registry returned unpublished metadata, listing releases through 3.5.31 and
an unpublish timestamp of 2024-05-26T01:46:10.518Z. Version metadata and original
tarballs for 3.5.31 and 4.4.0 were unavailable. Cached jsDelivr 3.5.31 package.json
and main JS were recovered. The main JS is byte-identical to Git commit
af1a116a31b088efdd77afa81c4b6565d12bd162; its manifest matches that commit except
Git's stale gitHead field. This proves the recovered runtime identity, **not a
complete original npm archive or original registry integrity**. The associated
historical core is 3.5.31, while baseline workspace tool 4.4.0 is associated with
core 5.4.1 at 40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f.

| Surface | Recovered 3.5.31 | Baseline workspace 4.4.0 |
| --- | --- | --- |
| Main | Explicit dist/artplayer-tool-thumbnail.js | No main; require/default exports point to existing JS |
| ESM | No declared ESM entry | Declared .esm.js missing; actual .mjs exists |
| Types | No declaration entry | Declared types/artplayer-tool-thumbnail.d.ts missing |
| CSS | Declared dist/artplayer-tool-thumbnail.css; recovery returned 404 | No style entry |
| Emitter | Declared tiny-emitter ^2.1.0, bundled into recovered main | Local src/emitter.js; provenance review remains open |
| File event | Synchronous, before assigning video.src | Same |
| Video event | After delay (default 300 ms) | Synchronous after assigning video.src |
| Screenshot height | Configured height, clamped 10–1000 | Derived from source aspect ratio at start |
| Frame completion | Configured delay per frame; final delay * 2 | oncanplay per frame; no final delay |
| File input | Does not reset value | Resets event.target.value after load |
| Missing metadata | Timer calls unbound this.start | Timer preserves receiver but can poll indefinitely |

The missing historical CSS observation does not prove it never shipped. The
missing workspace entries are checked against the actual frozen Git tree.
The same constructor call cannot simultaneously preserve both versions' height
and event timing defaults. This difference predates the refactor. Tasks 02–04
must document a concrete compatibility decision before changing these defaults;
there is no user approval to silently reinterpret the recovered version.

## Public surface to preserve

CJS exports the constructor directly, with no self-default property. Script
global is `ArtplayerToolThumbnail`; workspace ESM has only the default export.
The constructor accepts an option object and requires a same-realm Element in
fileInput. A non-file-input element receives a transparent child file input.
Unknown option fields survive setup; number/width/column clamp without rounding.
DEFAULTS returns a fresh object and end is NaN.

Keep historical spellings `creatVideo`, `creatScreenshotDate`, `creatCanvas`.
Other methods: setup, inputChange, ondrop, loadVideo, start, download,
errorHandle, destroy; static ondragover. Initial own fields are processing,
option, video, duration, inputChange and ondrop in that order. file, videoUrl,
thumbnailUrl, density and emitter e appear during use. setup/download and
on/once/emit/off return this; loadVideo/destroy return undefined. start returns
a promise after synchronous preflight, which can emit error and throw.

Events: file(File), video(video element), canvas(canvas), update(blob URL,
progress), done(), download(filename), error(message), destroy(). Error listeners
run before synchronous errors escape. Emitter preserves context, listener
snapshots and removal of once listeners by their original callback.

Grid samples interval midpoints, lays rows by column and appends a 30 px footer
with the existing attribution and geometry. Download replaces the final filename
extension with .png; a filename without a dot currently becomes .png.

## Defects and remaining validation

Historical and workspace tests reproduce undefined static drop listener binding
(the callable method is on the instance), non-idempotent destroy, and odd
extensionless download names. Source review additionally finds unreleased old
video URLs on replacement, no pending extraction/timer cancellation, generated
input ownership gaps and asynchronous callback paths that can remain unsettled.
These are repair candidates, not requirements to perpetuate defects. Task 02
must reproduce asynchronous paths; 03 must pair fixes with regression evidence.

The 26 Node contract cases use controlled DOM/media objects. They establish
export shape, event timing, defaults, geometry and deterministic legacy behavior;
they do not prove native decoding, seek readiness, toBlob failure behavior or
real browser cleanup. Task 02 adds extraction/failure sequences; 05 validates
real media and generated sheets with old/new cores; 06 verifies installed
tarballs, old paths, CSS disposition and the actual docs editor on port 8082.

The tool demo is `docs/assets/example/tool.thumbnail.js`. Current
`docs/assets/example/thumbnail.js` is an external thumbnail plugin and must not
be substituted. The package README's example=thumbnail link needs correction
with final demo verification. Emitter source/license attribution needs evidence
before classifying it as fully self-authored or removing dependency notices.
