# PKG-MULTI-SUB-10: old-core simultaneous caption rendering

## Problem and boundary

Actual core5.1.2/5.1.7 render only `subtitle.activeCue`, even when the native track
contains multiple active cues. Plugin1.0.0 combined tracks by array index;
1.1.0/1.2.0 and the prior candidate preserve independent timing and consequently
lose visible languages on these hosts. The corrected regression fails on both
old cores with the previous candidate main artifact, at the missing second caption.

The first regression also exposed a separate5.1.2 ASS conversion defect: its
published main bundle collapses required VTT line breaks into spaces, whereas its
tarball source preserves them. This yields two native cues rather than three.
Task11 owns that fix. The rendering regression now uses VTT/SRT on both cores and
additionally ASS on5.1.7; substituting the third track does not constitute ASS
acceptance on5.1.2. Original failed runs remain in the evidence index.

## Implementation and compatibility

`caption.ts` detects the old `activeCue` surface without the newer `activeCues`
surface, using property existence without invoking getters. It registers one old
`subtitleUpdate` listener instead of the modern `subtitleAfterUpdate` listener.
`legacy-caption.ts` renders all native active cue texts in their original order
when multiple cues are active. Single/empty intervals retain core rendering.
The existing timestamp cleanup runs after either core path.

No cue timing, native object, host method identity, source clock or event payload
is replaced. The old scalar event still contains only the first cue text. Existing
listeners keep their registration order; those before the plugin see the original
first-cue view, while later listeners see the combined view. Applications making
custom caption DOM replacements should register that listener after the plugin.
The plugin already owns this caption layer and sets escape=false; if the user
later enables escape, the adapter preserves literal text and old per-line classes.

The lifetime owns listener removal and rejects late callbacks after destroy.
The adapter has no timer, media request or new runtime dependency. Public types,
factory methods, export aliases, package versions and vendor code are unchanged.
The nearby serializer receives only the braces required by its existing lint rule.

## Verification

Exact hashes, archived reports and browser versions are in
[the validation index](../baselines/multiple-subtitles-legacy-validation.json).

- Six new Node regressions cover native order, repeated updates, scalar payloads,
  listener order, original method identity, single/empty intervals, escape/CRLF,
  timestamp cleanup, modern isolation and destroy/registration failure cleanup.
- The complete plugin suite passes300 tests, including the historical runtime and
  public type suites. The final listener-order assertions also pass against actual
  main and legacy artifacts, six cases each.
- Source browser matrix:105 cases,104 pass and one old5.4.0/WebKit source-seek
  failure. All six new old-host overlap cases pass. Historical missing languages
  and paused-offset observations remain labelled, not counted as correct behavior.
- Actual main matrix:63 cases,62 pass and the same old5.4.0/WebKit failure.
  Its six old-host overlap cases pass; native cue identities, independent time
  windows, semantic HTML/CSS, repeated updates, selection/reset and clearing hold.
- Actual legacy matrix passes12/12: six old-host cases and six modern entity cases.
- Strict package TypeScript, root lint and explicit changed-test lint pass; root
  lint retains one existing generated-doc warning. CI regression suite passes50.
  The normal build regenerates all three package formats and matching docs copies.

The broad matrix reopens MULTI-SUB-SWITCH-01: waiting for seeking=false did not
make every old-host subsequent seek reliable. The source failure retains its
1..3-second cue but media time is0.001494 with no active cues. Task05 owns renewed
diagnosis; this adapter does not run on that modern host. No retry, skip, timeout
increase or passing rerun is used to erase those failures. The complete package,
physical-device matrix, distribution gate and full refactor are not finished.

## Maintenance and rollback

Use the legacy browser spec for old-host display changes and combinations for
historical profile comparisons. Keep converter, native seek and caption display
failures separate. The package architecture and test READMEs map these entrypoints.
Revert this task's commit and rebuild the package to remove the adapter; retain
the failures and task11 in the working plan. No pushing or publishing is included.
