# VTT thumbnail maintenance

The factory remains `artplayerPluginVttThumbnail(option)`. Its registration function is
asynchronous and resolves to `{ name: 'artplayerPluginVttThumbnail' }`. Existing public
root/legacy declarations retain the historical synchronous result for existing type extraction
and replacement factories. The optional `/runtime` entry describes the real Promise without
consumer assertions. Both entries load the same binary and function. The seven internal TS
files are strict. Never infer synchronous runtime behavior from the compatibility declarations.

## Modules and ownership

- `src/index.ts` composes registration, captures the VTT URL before awaiting, reads style
  afterwards, and installs the `vtt-thumbnail` control with its existing CSS class/index.
- `src/lifetime.ts` owns one registration's destroy listener, event listeners and cleanup
  callbacks. Close is idempotent. Cleanup continues after a callback fails. An independent
  cancellation Promise settles pending work even if fetch does not honor AbortSignal.
- `src/request.ts` owns a native AbortController when available and reads the response body.
  Destroy cancels both phases; late rejections are observed. Failed HTTP responses reject
  before parsing. The controller cleanup is released when the request ends.
- `src/parseVtt.ts` parses thumbnail metadata and exports the pure `findThumbnail` lookup.
  It preserves timestamp flooring, first inclusive matches, decimal xywh strings and lexical
  URL joining. It handles cue IDs, NOTE/STYLE/REGION blocks, BOM/line endings and timing
  settings; invalid input raises TypeError with the original line before any UI is installed.
- `src/preview.ts` owns the mobile 500ms timer and creates the setBar callback. Timer
  generations reject old callbacks. Every style write checks lifetime state, including
  callbacks captured before destroy. Geometry, mobile/desktop edges and cue selection
  retain the latest published behavior.
- `src/getVttArray.ts` retains the old source helper signature as a fetch/parse wrapper.
  The player registration uses the owned request module instead. Distribution/deep-import
  review belongs to PKG-VTT-THUMB-06.

The registration owns only the control element passed to its mounted callback. Before
removing it, cleanup compares the live `art.controls['vtt-thumbnail']` alias with that exact
element. It must not remove a later replacement. Partial listener/control installation is
rolled back if initialization throws, preserving the original rejection.

## Runtime types

`types/artplayer-plugin-vtt-thumbnail.d.ts` owns Option and Result; `src/types.ts` reexports
them and defines rectangle/cue data, owned events, cleanup and
preview inputs. Request cancellation is typed as a void branch; actual registration is
Promise<Result>. The lifetime accepts only destroy/setBar and uses the core event tuples.
The preview receives only its required DOM/style/duration inputs.

Assertions are limited to the real Artplayer constructor boundary, validated regex groups
and loop indexes, the completed four-key rectangle, and native responses after the closed
check, plus the recursive `.default` factory alias created by Object.assign. The response
assertion is valid because native fetch returns Response and cancellation only
resolves void after closing; malformed custom responses still throw at runtime. Numeric
rectangle strings are explicitly converted for arithmetic while the zero style write stays
numeric. No any, unchecked JS or skipLibCheck exception is introduced.

The package tsconfig also checks test/types/vtt-thumbnail-runtime.ts. It tests the async
result, required options, CSS/URL types, event tuples, cancellation, readonly state and raw
rectangle strings, including expected errors. It separately proves the old public result
is synchronous in declarations. `test/types/vtt-thumbnail-public.ts` separately checks exact
legacy parameter/result/factory extraction, replacement factories and accurate async calls
through `/runtime`, including negative cases. The source factory explicitly returns Promise;
its final assertion only describes the self-reference that Object.assign creates.

Root and legacy select the original `.d.ts` shape in every export condition, preserving
latest npm 1.1.0's NodeNext ESM namespace and plain factory replacements. Do not add a
required self alias or silently make the root ESM namespace callable. Previously added
root `.d.mts`/`.d.cts` files remain packaged but are not selected by these entrypoints.
`/runtime` uses an ESM default and a CommonJS export assignment, supporting direct and
`.default` calls. Its Node10 `.d.ts` also uses export=, including raw require without
interop on TS 4.3/5.9. Each runtime declaration exports the same four named types.
Classic resolution uses typesVersions. The generated
editor global retains the legacy callable type; its RuntimeFactory namespace member is only
a type, not an additional runtime global. Do not hand-edit generated editor declarations.

The installed-consumer command packs both core and plugin, installs outside the workspace,
verifies member hashes, and repeats an offline frozen install. It tests five actual old npm
declarations in five modes on TS 4.3/5.9 and seven candidate modes: 32 default-import cells,
including one expected 1.1.0 raw NodeNext ESM declaration failure. Candidate root keeps
the old namespace shape and verifies its legal calls and whole-module replacements;
accurate direct ESM calls use /runtime. Negative cases are checked at their exact lines.
Another 36 direct/default CommonJS extraction/replacement forms reproduce the opposing 1.0.x
export-assignment and 1.1.0 default declaration shapes. Candidate preserves the latter.
Earlier type-only direct module extraction now follows the user's approved rule in
../../refactor/type-compatibility-policy.md: keep latest 1.1.0 types and document the
1.0.x export= migration without changing valid JavaScript behavior. Historical failures
remain in the installed reports; runtime failures never stand in for type evidence.

## Compatibility and intentional fixes

Option/style remain live at their historical read points. The return stays a Promise;
destroy during loading now settles it with the normal name result, without installing UI.
Existing core plugin managers can complete their own destroyed-instance handling. This
does not introduce a public destroy method or a new registration result field.

Registration still downloads VTT once. A video restart does not reload it or reinterpret
later option.vtt changes. Empty cues remain valid and hide the preview. HTTP failures now
reject explicitly; before this fix, a 404 with a parseable body incorrectly displayed cues.
The historical failure tests retain the former outcome rather than claiming it was valid API.

This is a thumbnail metadata profile, not a complete subtitle renderer or WebVTT validator.
Caption style/region blocks and timing settings do not style the player's DOM. Preserve
legacy compact arrows, seconds-only timestamps, numeric overflow between minute/second
fields, zero-length cues, unsorted/overlapping cues and dense pairs. Lookup does not sort:
the first inclusive match in input order wins. Fractions still floor only after conversion.
Three-or-more-digit hours now use the entire field rather than silently truncating it.

Malformed headers/timing, reversed ranges and missing/duplicate/unknown rectangle keys
reject. Coordinates must be finite non-negative decimal strings, and width/height positive;
coordinate whitespace is trimmed before forming CSS. Broken input no longer creates
invalid CSS or partially mounted controls. Each cue has one image/rectangle payload line;
multiline subtitle text, timestamp-map offsets and full caption semantics are outside this
plugin. Empty or comment-only input remains a valid empty preview.

The exported callable has a writable self `.default` alias, restoring the usable 1.0.x
CommonJS default access while retaining direct calls. It does not add a name property to the
registration Promise. The old 1.0.1 plugin uses `thumbnails`, which works with the
recorded 5.1.6 core. Core 5.1.7 already reserves that name, and the actual 1.0.1
bundle rejects registration on 5.1.7, 5.4.0 and the candidate core. These reproduced
historical failures are not successful compatibility cells. Later plugins and
this candidate use `vtt-thumbnail`; do not silently replace the core's reserved
control or introduce an alias over it. This pairing remains part of task05/release
review. The approved declaration migration does not
complete the remaining package or device acceptance.

## Verification and future changes

Use Yarn 1.22.22 and the repository's pinned Node version:

```sh
yarn test:vtt-thumbnail
yarn test:vtt-thumbnail-types-package
yarn build:ts artplayer-plugin-vtt-thumbnail
yarn test:browser test/browser/vtt-thumbnail-lifecycle.spec.js
yarn test:browser test/browser/vtt-thumbnail-combinations.spec.js
yarn build artplayer-plugin-vtt-thumbnail
```

The unit helper can load actual main/legacy files with ARTPLAYER_VTT_THUMBNAIL_ARTIFACT or
the frozen former implementation with ARTPLAYER_VTT_THUMBNAIL_BASELINE=1. Historical tests
are distinct from candidate expectations. Browser tests use real published/candidate cores,
native fetch/abort, mouse hover, sprite decoding and cleanup. The task05 combination
checkpoint adds actual DOM screenshot pixels, Chapter coexistence, web/native
fullscreen and source switch against core 5.1.6, 5.1.7, 5.3.0, 5.4.0 and candidate.
The 5.3.0 archive is an adjacent stable comparison, not the unpublished 5.3.1
source-associated version. Historical 1.0.2/1.0.3/1.1.0 main bundles run with
candidate core; 1.0.1 runs with 5.1.6 and retains its later-core failure tests.
Compact-arrow input for 1.0.x compiled artifacts is labeled explicitly; ordinary
arrow parser failures remain in the existing historical contract tests.

Mobile integration uses an Android user agent and synthetic DOM touch payloads
through actual core handlers with real media seeking and the 500ms hide timer.
It is not trusted OS input, physical Android or Safari/iOS verification. Task05
remains open for required device evidence and historical-pair disposition;
installed main/legacy/ESM consumers and the actual local editor remain task06/EX-03.

Modify parsing in parseVtt, requests in request, layout/timers in preview, and ownership in
lifetime. Preserve the normal/failure lifecycle tests alongside any parser improvements.
Pure parser comparison can use ARTPLAYER_VTT_PARSER_BASELINE=1, which loads the exact
parser from the 524ddf78 resource checkpoint. Bundle-mode parser tests also run malformed
payloads and extended registration through the actual factory; pure parsing assertions
still target source and must not be described as tests of an installed tarball.
See ../../refactor/changes/2026-09-13-PKG-VTT-THUMB-04-module-forms.md,
../../refactor/baselines/vtt-thumbnail-contract.md and the task 03 change record for
historical evidence and outstanding acceptance work.

## Installed browser coverage

vttThumbnailCandidate uses browser-candidate.js for verified installed bytes. An installed map rejects ARTPLAYER_VTT_THUMBNAIL_BASELINE and ARTPLAYER_VTT_THUMBNAIL_ARTIFACT overrides. Frozen published control inputs and their cue-format differences remain explicit.

The shared `yarn test:browser:installed` roster includes this package after preparing
the checked tarballs with `yarn test:package --browser`; see the scope rules
in ../../scripts/browser-validation/README.md. Attachments identify candidate file,
archive and source hashes. Missing or stale maps fail without source fallback.
Without a map, source and deliberate artifact checks retain their existing behavior.
This is desktop main-entry coverage, not all module forms, physical devices or
release readiness. See ../../refactor/changes/2026-09-15-CI-01-subtitles-installed.md.
