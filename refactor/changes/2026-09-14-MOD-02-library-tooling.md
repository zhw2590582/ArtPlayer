# MOD-02: Typed library build and development tooling

## Scope, structure and compatibility

Preserve the historical build/dev commands, selectors, global names, resource
handling, banner/notices, distribution filenames and analysis output. JS/MJS
entrypoints remain as checked shims. The implementation moves to strict TS modules
for production/development, config, banner handling, names, project selection,
rebuild queue and analysis; responsibilities and dependencies are documented in
[scripts/library/README.md](../../scripts/library/README.md). The scaffold part was
already completed independently as MOD-PLUGIN-01.

Installed Vite declarations constrain plugin hooks and config mutation. Narrow
ambient declarations cover only the consumed prompts2.4.2/Servor4.0.2 APIs, inspected
in their installed source. No dependencies, lockfile, Lerna or installation hooks
changed. Tool execution uses canonical Node24.21.0; built package consumption retains
its separate Node/browser compatibility requirements.

Manifest parsing now starts from unknown and rejects a missing/non-string version
before cleaning that package's dist. Performance evidence fingerprints every TS/JS
and JSON module under scripts/library as well as the previous shims/lock; changes
and additions/removals must invalidate old installed-artifact measurements. Markdown
is not a build input. The tests cover the previously unnoticed migration hazard
where unchanged shims could hide a changed TS config.

Development keeps port8082 and --no-open. Tests use the explicit internal run function
with a fixture port, leaving the existing8082 process untouched. Output directories
are created before Servor enumerates Linux watch directories; actual Linux execution
remains part of remote CI, not inferred from the Windows run. Build errors keep the
source watcher alive; queued changes remain serial.

## Validation

- `library-build-comparison.mjs`: 21 libraries / 63 artifacts built from the same
  current sources and fixture paths with frozen scripts at
  `28c7abb2bb8dfb7c84acfc7c5ec05c5882623069`, then current scripts. Every SHA-256
  is identical. Full report and logs retained in .cache/library-comparison-gjDNPX.
  Existing real dist/docs artifacts were not rebuilt or manually edited.
- `yarn test:library`: 18 passed, including CLI invalid inputs, malformed version
  protection, TS/JS/Less/SVG/inline-worker builds, CJS/global/AMD/ESM, analysis output
  identity, private-public exclusion, performance evidence and generated plugins.
- `yarn typecheck:library` and `yarn typecheck:docs-tools`: strict checks passed;
  the old JS/MJS shims are checked too.
- `library-development.spec.js`: final 3 passed on Windows Chromium, Firefox and
  WebKit. Real server, worker postMessage result, TS edits, automatic page reload
  and syntax-error recovery were checked. No mocked dev server or playback claim.
- First browser run failed because --input-type=module leaked into Vite's Less
  worker and broke CommonJS require; using a normal .mjs fixture launcher fixes the
  test environment. A second run had Chromium navigation cancellation when manual
  reload raced the real automatic reload; tests now assert the automatic update
  itself. Those reports are retained separately; neither is called a production fix.
- `yarn lint`: passed with one existing docs/assets/ts/artplayer.d.ts warning.
  `yarn test:ci`: 50 passed. Remote workflow runs are not claimed.
- `yarn test:baseline`: 522 passed, zero skipped. Strict toolchain and final
  plan/risk checks also pass; dependencies and the root lock remain unchanged.

Source/log hashes, artifact comparison, browser results and final gate results are
recorded in [library-tooling-validation.json](../baselines/library-tooling-validation.json).

## Remaining server defect and next step

`servor-port-probe.mjs` binds its own random port, calls installed Servor4.0.2 in an
isolated child, and reproduces its error message followed by exit status0. This is
old upstream behavior, not a successful candidate check. DEV-SERVOR-PORT-01 remains
open; MOD-DEV-01 is added before the final tooling decision to fix failure status
and define HTTP/watch/reload/timeout shutdown ownership. Servor exposes no close
handle and currently owns these resources for process lifetime. No unrelated server
was terminated and no vendor patch or dependency replacement was hidden in this task.

MOD-02 completes the TS/structure and matching-output contract, not every dev-server
lifecycle issue, remote OS check or the entire refactor. Revert this dedicated task
commit to restore its old scripts and validation mapping together; do not revert
only the shims without their TS targets. Local commit only, no push or publication.
