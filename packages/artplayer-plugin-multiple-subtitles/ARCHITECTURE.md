# Multiple subtitles maintenance

The public factory is `artplayerPluginMultipleSubtitles({ subtitles })`. Registration is
asynchronous and resolves to `{ name: 'multipleSubtitles', tracks, reset }`. `tracks(names)`
selects names in caller order, `tracks()` clears, and `reset()` restores the original order.
Both methods return undefined. Current declarations incorrectly omit the Promise and methods;
task PKG-MULTI-SUB-04 owns that compatibility work. Do not infer runtime behavior from them.

## Current module boundaries

- `src/index.js` currently combines download/decode, conversion, parsing, merging, Blob URL
  replacement and public registration. Task 03 will separate pure merge, requests and owned
  resources while preserving the factory and CSS hooks.
- `src/parser.js` is vendored WebVTT parser/serializer code with a CC0 dedication. It is not
  owned plugin code to mechanically migrate to TypeScript. Keep it distinct from task 04.
  The pinned upstream reference and full adaptation check are in
  `../../refactor/baselines/multiple-subtitles-vendor/` and
  `../../refactor/scripts/multiple-subtitles-vendor.mjs`.
- `types/artplayer-plugin-multiple-subtitles.d.ts` is the historical public declaration.
- `../../docs/assets/example/multiple.subtitles.js` demonstrates the real plugin name,
  `tracks/reset`, name order and `.art-subtitle-chinese/.art-subtitle-japanese` CSS hooks.

All tracks download concurrently and decode through TextDecoder. Explicit type wins over
the URL extension; SRT/ASS conversion delegates to existing core utils. `onParser` appears
in declarations but is not called. Parsing runs in metadata mode. Each track's top-level
cue text receives a name-based div once; current merging concatenates cue arrays by track
order, whereas 1.0.0 merged by cue index and retained the first track's timestamps.

Each selection serializes a new VTT, revokes the preceding URL, creates a text/vtt Blob,
sets the live subtitle option's escape to false and calls subtitle.init with the live
configuration plus URL/type/onVttLoad overrides. The latest URL and pending requests have
no destroy owner yet. These are explicit future fixes, not behavior to silently call safe.

The failure baseline now reproduces late fetch/body installation, retained and newly allocated
URLs after destroy, ignored HTTP failures, orphaned URLs after init failures, and revoking the
old URL before a new allocation can fail. Async init rejection is currently unobserved by the
plugin. Task 03 must handle these internal failures while retaining the void selection methods.
Keep the current parser's best-effort behavior separate from these resource fixes: invalid-header
diagnostics can coexist with usable cues, and metadata is intentionally read after download.

## Vendor boundary and validation

The comparison revision is w3c/webvtt.js `380cfcce34ba8b472d3a31474874eb72a0e5f460`.
This is not proof of the original acquisition commit. Its execution body matches local
code after replacing the IIFE/global exports with named ESM exports and normalizing format.
Older shipped sources keep the IIFE. Preserve the CC0 source header and complete
THIRD_PARTY_NOTICES; the normal build places notices in all standalone bundle headers.

Use the pinned Node and Yarn 1.22.22:

```sh
yarn test:multiple-subtitles
yarn test:browser test/browser/multiple-subtitles-history.spec.js
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
Tasks 05/06 still own complete core/device combinations and demo acceptance.
See `../../refactor/baselines/multiple-subtitles-contract.md` for exact historical differences.
