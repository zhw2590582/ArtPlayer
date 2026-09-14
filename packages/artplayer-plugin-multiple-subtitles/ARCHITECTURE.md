# Multiple subtitles maintenance

The public factory is `artplayerPluginMultipleSubtitles({ subtitles })`. Registration is
asynchronous and resolves to `{ name: 'multipleSubtitles', tracks, reset }`. `tracks(names)`
selects names in caller order, `tracks()` clears, and `reset()` restores the original order.
Both methods return undefined. Root and legacy declarations retain the historical synchronous
`LegacyResult` for existing extraction and replacement-function consumers. The additive
`artplayer-plugin-multiple-subtitles/runtime` entry describes the actual `Promise<Result>`
and selection methods. It shares the root implementation, not another plugin instance.
The factory has a writable `.default` self alias for historical CommonJS access. Only
`RuntimeFactory` requires that property; adding it to the historical root function type
would invalidate replacement functions. Root option and registration result remain exact
to npm 1.2.0; the runtime entry requires an option object but allows omitted `subtitles`.

## Current module boundaries

- `src/index.ts` composes registration, named selection and the unchanged public result.
- `src/request.ts` owns each fetch through byte decoding and delegates SRT/ASS conversion
  to the existing core utils. Failure aborts the request; registration failure closes siblings.
- `src/merge.ts` parses metadata and serializes selected cues without mutating parsed trees.
  It depends only on the vendor parser, not the player or browser resource APIs.
- `src/text.ts` supplies the vendor's existing entity-table option with both exact
  semicolon-terminated references and historical lenient aliases. It also protects
  literal cue text through the later onVttLoad unescape and HTML caption parsing.
  No vendor implementation patch is needed; parser.js and its provenance remain intact.
- `src/lifetime.ts` owns the destroy listener, request cancellation and resource callbacks.
  Its cancellation Promise also settles pending operations without AbortController support.
- `src/render.ts` owns generated Blob URLs and synchronous/async host installation outcomes.
  Reentrant selections and stale host rejections cannot release the latest selected resource.
- `src/caption.ts` owns one caption listener and unwraps internal timestamp markers.
  Hosts with `activeCue` but no `activeCues` use the old `subtitleUpdate` event;
  other hosts keep `subtitleAfterUpdate`. Capability detection never invokes cue getters.
- `src/legacy-caption.ts` displays every native active cue on those older hosts, in
  native order, when more than one is active. It preserves cue objects/times and the
  host's update method and scalar event payload. Single/empty intervals remain core
  rendered. Later `option.subtitle.escape` changes retain escaped line rendering.
  It owns no timer or media resource; the caption listener is removed by the lifetime.
  Old event subscribers still run in registration order: listeners registered before
  the plugin see the core's first-cue DOM; later listeners see the adapted full view.
  Custom DOM replacements should therefore run after plugin registration.
- `src/types.ts` describes selected tracks and narrow host/resource boundaries and reuses public
  runtime option/result types. The private host/resource types are not a published API.
- `src/parser.d.ts` describes the vendored parse result and discriminated cue nodes. Parsed
  timestamp values must remain numeric in both parsed and serialized trees.
- `src/parser.js` is vendored WebVTT parser/serializer code with a CC0 dedication. It is not
  owned plugin code to mechanically migrate to TypeScript. Keep it distinct from task 04.
  The pinned upstream reference and full adaptation check are in
  `../../refactor/baselines/multiple-subtitles-vendor/` and
  `../../refactor/scripts/multiple-subtitles-vendor.mjs`.
- `types/artplayer-plugin-multiple-subtitles.d.ts` owns public data types and the latest
  published function signature. Root/legacy exports use a types-first mapping to this file,
  preserving the old NodeNext ESM namespace. Runtime `.d.mts` supplies a callable default;
  runtime `.d.cts` and classic `.d.ts` use export-assignment with merged namespace type
  aliases. Classic subpath resolution uses typesVersions. Root and runtime share JS files.
- `scripts/build-ts.js` generates the editor's global factory and named type namespace from
  this declaration through the semantic generator. Never edit the generated editor file.
- `../../docs/assets/example/multiple.subtitles.js` demonstrates the real plugin name,
  `tracks/reset`, name order and `.art-subtitle-chinese/.art-subtitle-japanese` CSS hooks.

All tracks download concurrently and decode through TextDecoder. Explicit type wins over
the URL extension; SRT/ASS conversion delegates to existing core utils. `onParser` appears
in declarations but is not called. Parsing runs in metadata mode. Each track's top-level
cue node receives a name-based div in a copied cue; merging concatenates cue arrays by track
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

The vendor default entity table still has its historical semicolon bug, preserved
in the unmodified vendor file and its upstream parity tests. The plugin now supplies
exact amp/lt/gt/lrm/rlm/nbsp references through the existing constructor option.
Historical partial/bare-name handling remains via the old aliases; numeric and
unknown references are left to the parser. Entity decoding runs once, not repeatedly.

Literal text is escaped separately from semantic cue tags before the serializer's
outer escaping. The renderer's existing onVttLoad unescape removes only that outer
layer, leaving escaped literal tags/timestamps for native VTT and HTML display.
Wrappers are sibling text nodes around the prepared node; they are never assigned
to a b/i/c/v/ruby node's annotation field. This fixes malformed tag attributes and
visible undefined while preserving CSS hooks, actual markup and numeric timestamps.
Native/custom display, nested entities and selection/reset regressions belong to
PKG-MULTI-SUB-08; it does not complete all historical core/device combinations.

## Vendor boundary and validation

The comparison revision is w3c/webvtt.js `380cfcce34ba8b472d3a31474874eb72a0e5f460`.
This is not proof of the original acquisition commit. Its execution body matches local
code after replacing the IIFE/global exports with named ESM exports and normalizing format.
The plugin-side entity table is a configuration adapter, not a change to that body.
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
disagree on raw `import = require` extraction. The approved policy in
`../../refactor/type-compatibility-policy.md` and ADR-025 prioritizes latest npm 1.2.0.
Earlier consumers have the explicit runtime-entry migration in README; this is a declared
type migration, not proof that contradictory historical declarations all work unchanged.
Installed tests retain eight original NodeNext ESM direct-consumer diagnostics for both
1.2.0 and the candidate, while a namespace consumer remains valid. Frozen direct/default
CommonJS consumers preserve each old version's diagnostics as well. Candidate positives
check both factory-assignment directions and accurate asynchronous runtime methods in
seven compiler modes, including classic CommonJS without interop. Removing suppression
comments must reject all 16 invalid statements at their exact lines in every mode.
Tasks 05/06 still own complete core/device combinations and demo acceptance.
The task05 matrix in `test/browser/multiple-subtitles-combinations.spec.js` adds
core5.1.2/5.1.7/5.3.0/5.4.0/candidate and actual plugin1.0.0/1.1.0/1.2.0.
Read native `template.$track.track.cues` for old-core probes: older hosts do not
provide the later `subtitle.cues` getter. Core5.1.2/5.1.7 only render their first
active cue; the matrix explicitly records lost simultaneous languages for published
1.1.0/1.2.0, while1.0.0's index-merged cue displays both. Task10 adds the candidate
view adapter without adopting index merging or altering independent cue timings.
`multiple-subtitles-legacy.spec.js` checks asymmetric three-cue overlaps, HTML/CSS,
selection/reset and clearing on both old cores. ASS is additionally exercised on
5.1.7; published5.1.2's malformed ASS converter is separately tracked by task11.
This adapter does not repair an old browser host's stale native active-cue list.
CORE-SUBTITLE-OFFSET-01 corrects
paused offsets in the candidate core; published Firefox hosts retain their exact
historical defect observations. Task09 traced apparent WebKit5.3.0/5.4.0 caption
loss to native seeks ending near zero: the cue itself remained intact. A no-plugin
control reproduces the same old-host problem. Candidate core already waits for
source seeking to complete. The ordering probe retains immediate old calls, while
caption combinations wait for native seeking to settle before an independent seek.
See task09's change/validation record and the core offset change for precise scope.
The matrix is runnable with `yarn test:browser test/browser/multiple-subtitles-combinations.spec.js`;
do not replace these failures with skips or count boundary observations as acceptance.
See `../../refactor/baselines/multiple-subtitles-contract.md` for exact historical differences.
