# PKG-MULTI-SUB-08: entity text and semantic tag wrapping

Baseline: 4acf85ea696a99f05fce71089711bc4a4ca0d5b6. This independent correction
precedes task05's complete core/combination acceptance; it does not complete that
task or publication readiness.

## Old behavior and corrections

Nine historical implementations reproduce `&lt;`/`&gt;`/`&amp;` decoding with stray
semicolons. The vendor's default table contains bare keys, while its exact-match
branch looks for the semicolon-terminated key and falls through to partial-match
handling. `text.ts` supplies both forms for the six existing named entities using
the parser's already-supported constructor option. Bare/partial-name aliases,
numeric references and unknown-reference handling retain the existing parser path.
No upstream/vendor execution body or provenance snapshot is edited.

Correctly decoded text must remain literal after the existing onVttLoad unescape.
Text values therefore receive a separate escaping layer before the serializer
protects the complete VTT. Literal `<b>` and timestamp-shaped text remain visible
text; `&amp;lt;` displays `&lt;` rather than decoding repeatedly. Real b/i/c/v/ruby
cue nodes remain semantic nodes, and inline timestamps retain their numeric data.

Related tag coverage exposed a second historical bug: the old merge assigned an
HTML wrapper to a semantic node's annotation field, yielding output such as
`<b <div ...>undefined</div>>bold</b>`. Nine historical implementations now reproduce
that exact malformed structure separately. Merge wraps prepared nodes with sibling
opening/closing text nodes instead. CSS hooks remain `.art-subtitle-<name>`; markup
annotations are preserved and source trees are still immutable across selections.
Plain-text/timing output remains byte-matched outside these intentional fixes.

## Structure, compatibility and ownership

- `text.ts`: entity configuration and literal-text protection through the two
  existing serialization/HTML stages. It introduces no browser API or dependency.
- `merge.ts`: recursively prepare text/timestamp/object nodes and wrap top-level
  nodes without changing annotations. A simple loop avoids requiring Array.flatMap
  in older environments. Parsing/selection order and original cue times remain.
- Vendor parser/serializer, request/lifetime/render/caption code, public types,
  factory/default alias, tracks/reset, Promise behavior and distribution paths
  are unchanged. This is an authored adapter around a frozen vendor, not a vendor
  upgrade or an unexplained relaxation of its fingerprint check.

There are no new resources or lifetime responsibilities. Existing download, URL,
destroy/restart and host-error checks still apply. Corrected entity/tag output is
an intentional bug fix; malformed attributes and visible semicolons are not kept
as compatibility requirements. Tests formerly comparing those erroneous serialized
bytes move to explicit corrected text/markup expectations. Raw ampersands and
malformed angle text retain a separate actual-old-versus-current visible-output
comparison. No historical failure fixture is rewritten to pretend old releases
were correct.

## Verification

Source/log/artifact hashes and actual counts are in
[multiple-subtitles-entities-validation.json](../baselines/multiple-subtitles-entities-validation.json).

- The initial5 entity/rendering tests fail against the frozen pre-change bundle.
  The final expanded11-case file is rerun against both old and new artifacts.
- Full package suite294 passes, including11 focused cases, immutable tree and
  timestamps,9 historical entity failures,9 historical malformed-tag failures,
  actual release contracts/types and complete unchanged vendor parity/notices.
- Windows source browser suite42 passes: entity/markup native VTT and HTML display
  on published/candidate cores, plus existing playback, SRT, timestamps, selection,
  source replacement and cleanup. An early implementation used flatMap; the final
  equivalent loop has full Node coverage and actual built-browser verification.
- Production main/legacy artifacts each run the focused Node suite; actual main
  also runs entity display in all3 engines on both core variants. UMD/legacy/ESM
  and matching docs copies are regenerated using the normal build.
- Strict package TypeScript passes. Initial Unicode escape casing/list formatting
  lint errors are corrected; final root lint has only its one existing docs type
  warning. CI and final plan/risk checks are recorded separately.

This is desktop engine evidence, not physical Safari/mobile, all historical core
versions or a remote CI run. Complete core combinations remain task05, distribution
and demo acceptance task06. No lockfile, dependency, public declaration or version
change. The package architecture and test maintenance documentation explain the
adapter and corrected behavior. Revert the dedicated task08 commit, including
generated outputs, to restore the prior implementation. Local commit only; no
push or npm publication.
