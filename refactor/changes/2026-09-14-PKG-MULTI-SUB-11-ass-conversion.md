# PKG-MULTI-SUB-11: preserve ASS conversion on old core main

## Reproduction

Frozen npm core5.1.2 has different converter behavior across its own files.
For a plain Dialogue cue, main returns
`WEBVTT 1 00:00:01.250 --> 00:00:03.750 Plain`; the source and legacy file retain
the required header, identifier, timing and payload line breaks. The plugin's
VTT parser consequently sees no ASS cue from main. These are actual verified
tarball members, not simulated converters or version-number assumptions.

The new unit regression initially passes seven baseline/legacy assertions and
fails six main-converter samples. The initial raw-string text assertion also
compared an encoded ampersand with an equivalent literal ampersand; that fixture
failure is retained separately. Canonical HTML comparison fixes the test's text
representation comparison without weakening cue timing/count or semantic markup.
The actual browser regression with the previous plugin artifact fails because
only two of three VTT/SRT/ASS cues load on5.1.2.

## Implementation and compatibility

`src/ass-conversion.ts` is a private adapter called after request decoding. It
calls the existing host converter once. Valid output takes the normal path.
For output with the old collapsed header/timing shape, the adapter reconstructs
the old converter's supported Dialogue fields, timestamp formatting and text
cleanup, then compares the entire collapsed output. Only an exact match receives
the missing structural newlines. Custom output, comments, empty results and
nonmatching malformed conversions retain their original value; exceptions still
reject registration and release owned resources.

This small duplicate of the old supported Dialogue projection is intentional:
importing runtime code from the new core would make the plugin depend on that
core version. It is not a second general ASS parser. Keep its complete-output
comparison and frozen source/legacy parity tests when editing it. Do not extend
accepted ASS syntax or modify cue timing under this repair task.

The host's shared utility is never patched, called with a probe or replaced.
The factory, methods, event order, public types, declarations, global/ESM/CJS
entries, vendor bytes and package versions stay unchanged. No dependency or
lockfile changes are needed. The new test joins existing Yarn unit/package
commands; all three package formats and docs copies are normally rebuilt.

## Validation and limits

Exact inputs, hashes, archived reports and commands are in
[the validation index](../baselines/multiple-subtitles-ass-validation.json).

- Plugin suite315/315: the new15 tests include actual old main/legacy converters,
  source parity, independent timing, Unicode, inline markup, ASS line breaks,
  overlapping cues, long hours, comma text, custom/empty output and failure cleanup.
- The same targeted15-test file passes with actual main and legacy plugin input.
  Its frozen-host and private-adapter checks are identified separately from
  full-plugin registration/selection cases in the source.
- Source browser21/21 and actual-main browser21/21. The matrix spans
  core5.1.2/5.1.7/5.3.0/5.4.0/candidate in Chromium, Firefox and Windows WebKit.
  It checks UTF16 input, explicit type override, native cue times/text, multiline
  and semantic HTML, overlapping translation, selection/reset and clearing.
  The old-host regression now uses an actual third ASS track on both5.1 cores.
- Actual legacy browser21/21. Strict TypeScript,37 declarations with zero drift,
  root and changed-script lint, CI50 and plan/risk validation pass; root lint keeps
  the existing generated-doc warning. Detailed evidence is retained in the index.

Close only MULTI-SUB-ASS-01 after these checks. This is conversion into VTT, not
full ASS positioning/animation/rendering, physical-device evidence, remote CI or
package publication. The old WebKit source-seek failure reopened in task10 stays
open and is not rerun or waived by this targeted conversion matrix. Tasks05/06
and the wider refactor remain incomplete.

## Maintenance and rollback

The package architecture and test READMEs describe the adapter and replay commands.
Revert this task and rebuild the plugin to restore prior behavior; preserve the
frozen converter evidence so the known old-main failure cannot be mistaken for
successful ASS compatibility. No push or publication is included.
