# PKG-IFRAME-05 real player and docs integration

Started at 047e2df945fffe5699def60f2cf0497c00264117 with a clean worktree.
Task 04 completed type and installed-consumer validation. This task remains
responsible for actual player/media behavior, including old supported cores,
same/cross-origin documents, navigation and demo integration.

The real docs/assets/example/iframe.js and docs/iframe.html are integration inputs.
The original plugin release is associated with core 4.5.9; freeze its actual npm
archive rather than substituting the unrelated 4.5.5 or 5.1.7 fixtures. Current
published core is the already frozen 5.4.0; candidate is the actual current build.

Browser scope and any fixture adaptation must be recorded. A standalone player
harness using the docs inputs is not the complete Monaco editor or physical
device/BFCache acceptance. A normal history reload is not cached restoration.
The editor currently destroys parent Artplayer.instances before eval, but the
iframe tool lives outside that registry: repeated-run cleanup needs evidence.

No task completion, risk closure, version or release claim is made at this point.

## Player and editor checkpoint

The frozen 4.5.9 npm archive has 176 members. `iframe-core.test.mjs` checks the
historical release association, complete member inventory, manifest and every
member hash; the browser server independently verifies its selected entry.

The player matrix has 72 rows: three cores (4.5.9, frozen 5.4.0, candidate), two
origins, four old/new parent-child bridge pairs and three browser engines. It
loads the actual docs iframe HTML, example and stylesheet, adapting only the
child URL and test-only historical global-name aliases. Each row decodes and
plays actual video, seeks, changes rate, clicks fullscreenWeb controls, checks
parent geometry/messages, switches media, destroys the player and proves that
the tool can still execute a separate request. Helper/package aliases are not
implemented by this test adaptation.

The additional three editor rows use the actual docs index, local Monaco and Run
button. Only the iframe constructor is observed through a test subclass; the
external advertising script is stubbed in this test, with no production change.
The test runs the iframe example three times, rejects an outstanding request on
cleanup, switches to two parent players, then runs an empty example and checks
that both parent players were destroyed.

Real defects found and fixed:

- Loading Monaco's AMD loader before the UMD core produced `Artplayer is not
  defined` before editor initialization. The docs index now loads the core,
  Monaco loader and editor bootstrap in dependency order.
- Repeated Run left the previous iframe tool alive. The editor now emits the
  docs-only `artplayer:example:cleanup` event before evaluating another example;
  the iframe example listens once, destroys its tool and removes its frame.
  Initial setup handles expected cancellation when the example is cleaned up.
- The parent instance registry is mutable during destroy. Run now iterates a
  snapshot, and the two-player editor assertion checks complete cleanup.

All changes are in the docs integration and test infrastructure; the core/tool
runtime source and distribution bytes are unchanged. No public player API is
added or removed. Standalone consumers still own tool destruction.

## Failed probes and limits

Failed reports and complete trace/result directories are retained in `.cache`:
`iframe05-player-probe*`, `iframe05-player-source-before*`,
`iframe05-editor-before*`, `iframe05-editor-cleanup-before*`, and
`iframe05-editor-cleanup-probe*`.

The first player probe had an incorrect test URL; response status is now checked
before injecting bytes. The next probe exposed the existing serialized-body
regex's requirement for a recognizable `resolve(...)` call: compilation of an
inline object argument added newlines. The test now assigns the result to a local
variable and calls `resolve(result)`, preserving the historical protocol.

The initial full matrix passed 68/72. All four failures were old core 4.5.9 on
cross-origin WebKit, where traces showed successful playback but an invisible
control during click. Moving the pointer over the player, as an actual user
does, reveals the controls; no forced click, timeout increase or product API
change was used. The original failed traces remain available.

The first editor probe reproduced the AMD startup defect. After that fix, a
probe attempted Run while the full-screen iframe covered it; the test now exits
fullscreen through its real control first. The corrected probe then reproduced
the live old-tool cleanup defect. Subsequent editor checks cover real Run clicks.

This is a desktop integration checkpoint, not task completion. Actual BFCache
restoration, physical devices, externally interrupted navigation and final
8082/distribution acceptance remain open. Normal history reload does not count
as BFCache, and Windows WebKit does not count as physical Safari. Old unmarked
peers retain the limitations recorded in ADR-026. Final verification counts and
input/report hashes are in `baselines/iframe-integration-validation.json`.

## Verification

- Source, main and legacy each passed all 75 desktop browser rows, with no
  retries, skipped rows or flaky results: 225 passing cases in total.
- Historical archive verification passed for all 176 members.
- Browser test/server lint and docs JavaScript syntax checks passed.
- ESM, i18n and SSR imports: 3 passing tests.
- Full CI passed 1544 tests (1365 unit, 14 engineering, 165 historical/baseline)
  and strict checking of 330 production TypeScript files. The browser counts
  above are independent native-browser runs, not unit-test counts.
- Configured coverage passed with 0 gate violations across 224 runtime files
  and 26 documented/type-only exclusions. Lines: 61.04%, branches: 86.7%,
  functions: 66.75%. This does not claim full coverage of every package.
- The generated core editor declaration retains the pre-existing unused
  `ts/no-namespace` disable warning, also present in task 04's final CI log.
  There are no new lint errors; no generated declaration was hand-edited.

No dependencies, package versions, runtime build bytes, push or publication were
changed. Roll back the docs index, common Run handler and iframe example together
to restore the preceding integration; this also restores the documented defects.
Task status remains doing and all three iframe risks remain open.

Checkpoint subject: `fix(iframe): [PKG-IFRAME-05] checkpoint player and editor integration`.
