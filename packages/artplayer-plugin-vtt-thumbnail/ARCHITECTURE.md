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

Root and legacy use paired `.d.mts`/`.d.cts` default declarations. `/runtime` uses an ESM
default and a CommonJS export assignment, supporting direct and `.default` require calls.
Classic resolution uses `.d.ts` and typesVersions, including TypeScript 4.3. The generated
editor global retains the legacy callable type; its RuntimeFactory namespace member is only
a type, not an additional runtime global. Do not hand-edit generated editor declarations.

The installed-consumer command packs both core and plugin, installs outside the workspace,
verifies member hashes, and repeats an offline frozen install. It tests five actual old npm
declarations with classic default-import consumers on TS 4.3/5.9 and seven candidate modes.
Historical NodeNext and raw require type replacement forms still need investigation in 04;
these checks do not prove all historical compiler/module combinations.

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
registration Promise. Earlier `thumbnails` control names and remaining historical declaration
forms are separately frozen and remain compatibility work for tasks 04-06. The full package
refactor is not yet finished.

## Verification and future changes

Use Yarn 1.22.22 and the repository's pinned Node version:

```sh
yarn test:vtt-thumbnail
yarn test:vtt-thumbnail-types-package
yarn build:ts artplayer-plugin-vtt-thumbnail
yarn test:browser test/browser/vtt-thumbnail-lifecycle.spec.js
yarn build artplayer-plugin-vtt-thumbnail
```

The unit helper can load actual main/legacy files with ARTPLAYER_VTT_THUMBNAIL_ARTIFACT or
the frozen former implementation with ARTPLAYER_VTT_THUMBNAIL_BASELINE=1. Historical tests
are distinct from candidate expectations. Browser tests use real published/candidate cores,
native fetch/abort, mouse hover, sprite decoding and cleanup. Their scope is not full old
core/device coverage, installed tarballs, mobile Safari or the online editor.

Modify parsing in parseVtt, requests in request, layout/timers in preview, and ownership in
lifetime. Preserve the normal/failure lifecycle tests alongside any parser improvements.
Pure parser comparison can use ARTPLAYER_VTT_PARSER_BASELINE=1, which loads the exact
parser from the 524ddf78 resource checkpoint. Bundle-mode parser tests also run malformed
payloads and extended registration through the actual factory; pure parsing assertions
still target source and must not be described as tests of an installed tarball.
See ../../refactor/baselines/vtt-thumbnail-contract.md and the task 03 change record for
historical evidence and outstanding acceptance work.
