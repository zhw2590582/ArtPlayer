# SITE-04 checkpoint: settings and Markdown chunk boundaries

The bilingual setting guides now document the tree model, actual names/returns,
callbacks, deferred mounting, lazy nodes, ownership, update recovery and cleanup.
Root declaration inaccuracies remain compatible and are explained alongside the
accurate runtime types. The range-to-switch example previously retained range,
whose rendering precedence kept the slider visible. Both examples now remove
that old field before updating. Other runnable examples remain unchanged.

The existing documentation regression exposed a separate defect while processing
the new table: splitTranslation could insert a paragraph break between table rows
when chunks were joined, causing its own structural validator to reject the result.
The splitter now keeps tables, nested lists and blockquotes together. A structural
block above the requested limit fails explicitly; it does not silently exceed the
limit or weaken validation. Two regressions cover boundary placement and oversized
blocks. The documentation tooling README explains the behavior and maintenance.
No player runtime, public declaration, package API or dependency changed.

The [mapping](../core-content-review.json) adds 79 root/runtime setting records.
Total: 324 reviewed, 639 remaining out of 963. Counts include declaration aliases,
not independent features. Previous mapped source and guide hashes are unchanged.

## Verification

- Two strict TS examples pass NodeNext with skipLibCheck:false and types:[].
  All 18 runnable snippets parse; only the two corresponding update examples
  change. Local links/anchors resolve. Six three-engine page cases and 54 exact
  code forwards pass; popup targets are isolated rather than executing the editor.
- Chromium 153.0.8010.12, Firefox 155.0 and Windows WebKit 26.6 each pass 40 DOM
  assertions against core bytes matched to the recorded archive. Checks include
  model identity, delayed/canceled mounted callbacks, switch/range semantics,
  nested selection, stale results, update recovery/listeners, tree rejection,
  old example reproduction and corrected kind switching, removal and destruction.
- The exact corrected Chinese example separately reaches ready, runs its own
  three-second update, and displays a switch with no range input on all engines.
  No retry or page error. Readiness/DOM evidence is not full playback/device proof.
- Initial tests: 39 pass, one structure failure. After fixing the splitter and
  adding regressions: 42 pass, zero fail/skip, 1276.5411ms. The old function at
  bb2fec8dd reproduces the new-guide failure; the new function preserves structure
  in two chunks of 3655/2464 characters within the 4000-character limit.
- Node 24.21.0, Yarn 1.22.22, TypeScript 5.9.3. Final docs build 9.18s
  (Yarn 10.82s), LLM generation/check, strict docs-tools types (3.52s), root lint
  (12.32s), site inventory and demo-route checks pass. Screenshots inspected.

See [evidence](../baselines/site04-setting.json). Shared script/test changes make
all 21 existing library build input fingerprints stale. This is recorded, not
silently rebound to previous candidates; REL-02 must prepare/verify fresh ones.
The DOM probe checks unchanged core bytes, not a new release candidate acceptance.
SITE-04 remains doing, totals 224/22/39. Continue implementation and candidate
preparation; formal review rounds remain user-directed. No push or publication.
Revert this checkpoint to restore guides, generated outputs, mapping and tool fix.
