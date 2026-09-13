# Multiple subtitles maintenance

The public factory is `artplayerPluginMultipleSubtitles({ subtitles })`. Registration is
asynchronous and resolves to `{ name: 'multipleSubtitles', tracks, reset }`. `tracks(names)`
selects names in caller order, `tracks()` clears, and `reset()` restores the original order.
Both methods return undefined. Root and legacy declarations retain the historical synchronous
`LegacyResult` for existing extraction and replacement-function consumers. The additive
`artplayer-plugin-multiple-subtitles/runtime` entry describes the actual `Promise<Result>`
and selection methods. It shares the root implementation, not another plugin instance.
The factory has a writable `.default` self alias for historical CommonJS access.

## Current module boundaries

- `src/index.ts` composes registration, named selection and the unchanged public result.
- `src/request.ts` owns each fetch through byte decoding and delegates SRT/ASS conversion
  to the existing core utils. Failure aborts the request; registration failure closes siblings.
- `src/merge.ts` parses metadata and serializes selected cues without mutating parsed trees.
  It depends only on the vendor parser, not the player or browser resource APIs.
- `src/lifetime.ts` owns the destroy listener, request cancellation and resource callbacks.
  Its cancellation Promise also settles pending operations without AbortController support.
- `src/render.ts` owns generated Blob URLs and synchronous/async host installation outcomes.
  Reentrant selections and stale host rejections cannot release the latest selected resource.
- `src/caption.ts` owns a subtitleAfterUpdate listener. It unwraps internal timestamp markers
  in the custom HTML caption layer, preserving subsequent nodes and literal user text.
- `src/types.ts` describes selected tracks and narrow host/resource boundaries and reuses public
  runtime option/result types. The private host/resource types are not a published API.
- `src/parser.d.ts` describes the vendored parse result and discriminated cue nodes. Parsed
  timestamp values must remain numeric in both parsed and serialized trees.
- `src/parser.js` is vendored WebVTT parser/serializer code with a CC0 dedication. It is not
  owned plugin code to mechanically migrate to TypeScript. Keep it distinct from task 04.
  The pinned upstream reference and full adaptation check are in
  `../../refactor/baselines/multiple-subtitles-vendor/` and
  `../../refactor/scripts/multiple-subtitles-vendor.mjs`.
- `types/artplayer-plugin-multiple-subtitles.d.ts` owns public data types and the historical
  callable signature. Root/legacy `.d.mts` and `.d.cts` forward that signature; `runtime.d.*`
  forwards the precise asynchronous factory. Classic resolution uses typesVersions.
- `scripts/build-ts.js` generates the editor's global factory and named type namespace from
  this declaration through the semantic generator. Never edit the generated editor file.
- `../../docs/assets/example/multiple.subtitles.js` demonstrates the real plugin name,
  `tracks/reset`, name order and `.art-subtitle-chinese/.art-subtitle-japanese` CSS hooks.

All tracks download concurrently and decode through TextDecoder. Explicit type wins over
the URL extension; SRT/ASS conversion delegates to existing core utils. `onParser` appears
in declarations but is not called. Parsing runs in metadata mode. Each track's top-level
cue text receives a name-based div in a copied cue; merging concatenates cue arrays by track
order, whereas 1.0.0 merged by cue index and retained the first track's timestamps.

Each selection serializes VTT and allocates a text/vtt Blob before replacing the preceding
URL. It sets the live subtitle option's escape to false and calls subtitle.init with live
configuration plus URL/type/onVttLoad overrides. Allocation failure preserves the prior URL;
synchronous installation failure releases the new URL and restores the previous ownership.
Async host failure is observed and releases only the failed active installation, with a warning
while alive. The plugin cannot generically undo host side effects after asynchronous failure.
Registration does not await host media loading, and selection methods remain void.

Destroy cancels pending requests, settles registration with an inert result, releases owned
URLs and removes its listener. Retained methods become no-ops; restart does not refetch tracks.
Do not restore the shared escape option on normal destroy: another consumer may now own it.
The historical failure suite deliberately retains the old outcomes; the candidate lifecycle
suite verifies their fixes. Preserve parser best-effort behavior independently: invalid-header
diagnostics can coexist with usable cues, and metadata is intentionally read after download.

Inline timestamp nodes keep their numeric values. The merge layer puts them in valid VTT
class spans (`c.artplayer-multiple-subtitles-timestamp`), including nested timestamps. Native
getCueAsHTML retains the processing instructions. ArtPlayer's HTML layer does not interpret
those tags, so caption.ts removes only the leading instruction within the generated marker
and unwraps its remaining children. HTML does not pair `<c.class>` with `</c>`; removing the
whole element would incorrectly discard following caption text. The original cue stays intact.
This keeps the existing whole-cue display behavior; it does not add karaoke highlighting.

The vendor entity decoder still leaves extra semicolons after standard named entities. Nine
historical implementations reproduce it; MULTI-SUB-ENTITY-01 remains open for task 05. Do not
silently alter vendor source or declare entity rendering correct because timestamp tests pass.

## Vendor boundary and validation

The comparison revision is w3c/webvtt.js `380cfcce34ba8b472d3a31474874eb72a0e5f460`.
This is not proof of the original acquisition commit. Its execution body matches local
code after replacing the IIFE/global exports with named ESM exports and normalizing format.
Older shipped sources keep the IIFE. Preserve the CC0 source header and complete
THIRD_PARTY_NOTICES; the normal build places notices in all standalone bundle headers.

Use the pinned Node and Yarn 1.22.22:

```sh
yarn test:multiple-subtitles
yarn test:multiple-subtitles-types-package
yarn build:ts artplayer-plugin-multiple-subtitles
yarn test:browser test/browser/multiple-subtitles-history.spec.js
yarn test:browser test/browser/multiple-subtitles-lifecycle.spec.js
yarn build artplayer-plugin-multiple-subtitles
```

Historical tests read verified npm bytes and frozen Git inputs. For current normal behavior,
set ARTPLAYER_MULTIPLE_SUBTITLES_CANDIDATE=1; optionally set
ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT to an actual main/legacy file, then run
`node --test test/multiple-subtitles.test.js`. These tests use controlled subtitle hosts;
they do not prove native rendering or the online editor. The separate historical browser suite
uses actual 1.2.0 main with published/candidate cores: SRT display and selection, pending native
fetch after destroy, and native Blob readability/late reset allocations. It covers Chromium,
Firefox and Windows WebKit; it is not all historical cores, ASS display or physical Safari.
The failure unit suite uses real current core converters and TextDecoder for SRT/ASS/encodings.
Candidate lifecycle and merge suites cover cancellation, failures, resource ownership,
reentrancy and immutable serialization. The candidate browser suite adds real video source
switching, HTTP rejection and Blob revocation. For main/legacy validation, set the artifact
environment variable above before running it; source builds are used when it is absent.
The package tsconfig checks only authored TS and declarations, with strict/noUncheckedIndexedAccess
and allowJs=false. TS 5.9.3/5.1.6 positive and negative fixtures cover internal runtime types.
Do not remove cancellation/index boundary assertions by changing historical optional inputs.
Public declaration tests check exact old extraction/replacement signatures, accurate runtime
types and negative uses with TS 5.9.3 and 4.3.5. The package test packs core and plugin, installs
outside the workspace and checks Node10/NodeNext/Bundler modes plus real CJS/ESM identities.
Historical 1.0.0/1.1.0 export-assignment declarations and 1.2.0 default-module declarations
disagree on raw `import = require` extraction. Task 04 retains that unresolved boundary;
default-import compatibility must not be presented as proof of every historical module form.
Tasks 05/06 still own complete core/device combinations and demo acceptance.
See `../../refactor/baselines/multiple-subtitles-contract.md` for exact historical differences.
