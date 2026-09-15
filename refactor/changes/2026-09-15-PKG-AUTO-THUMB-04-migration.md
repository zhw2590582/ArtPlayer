# PKG-AUTO-THUMB-04: complete source and public type migration acceptance

Checked source/artifact commit: 42ddead0cd7dbc254837262ae59a2016b2321413.

## Delivered implementation

All eight owned production modules are TypeScript. `index` owns registration and
subscriptions; `options` preserves historical option reads and arithmetic;
`session` owns job identity, cleanup and Blob URLs; `video` owns the private media
element; `extraction` orchestrates metadata and sheets; `frames` and `encoding`
own their respective pending operations; `types` defines their minimal internal
contracts. Only the entry receives the ArtPlayer host. There is no remaining
production JS exception or replacement of the public API by an internal type.

The implementation was delivered incrementally in the task03 TS checkpoint and
tasks07-12; this acceptance commit consolidates their actual scope, rather than
claiming to migrate them a second time. The package's strict configuration covers
all source files and the actual-core host assignment fixture. It inherits strict,
noUncheckedIndexedAccess, isolatedModules and skipLibCheck:false, with allowJs:false.

Task08 retained the npm1.1.0 root declaration and added the optional accurate
`/runtime` view. Task09 restored the writable recursive `.default` alias without
changing the old root type extraction. Root and legacy declaration bytes remain
equal to npm1.1.0 after newline normalization. The optional runtime API describes
the real registration Promise, required options object, ignored historical height,
and Factory/RuntimeFactory distinction. All entrypoints use the same existing
runtime artifacts. No public type or runtime change is made in this final audit.

## Current evidence

- Package strict compilation and source/declaration lint pass on Node24.21.0 and
  Yarn1.22.22. Eight source modules are included, with no allowJs or skipLibCheck
  escape. The implementation fixture assigns the real export to both runtime
  factory contracts and accepts the real core instance.
- `yarn test:auto-thumbnail-types-package` packs current core and plugin, installs
  outside the workspace, verifies installed bytes and frozen reinstall locks, and
  runs 10 compiler profiles: npm1.1.0 and candidate with TS5.9.3 Node10, NodeNext
  CJS/ESM, Bundler, and TS4.3.5 Node10. Positive consumers and exact negative-line
  diagnostics pass, including no-interop CommonJS runtime imports. Historical
  npm Node10 legacy resolution failures remain explicitly expected, not hidden.
- Actual installed npm1.0.1 default calls and 1.1.0 direct calls retain their
  historical identities. The old1.0.0 package's missing main/legacy is confirmed
  as a distribution defect, not counted as runnable compatibility. Candidate
  root/legacy/runtime module identities, Promise registration and cleanup pass.
- `yarn check:editor-types` verifies24 existing outputs with both compilers without
  rewriting declarations or assets. Packed manifests/files and all declaration
  hashes are captured in the [machine record](../baselines/auto-thumbnail-migration-validation.json).
- The prescribed whole-repository `yarn lint` scope passes. An additional direct
  lint of `refactor/scripts/plan.mjs` reports17 existing style/import diagnostics,
  identical on HEAD and the candidate; that file is outside the root lint range.
  No new diagnostic is introduced by the dependency assertion. Plan and risk
  validators pass. An in-memory negative dependency check confirms that removing
  the task03 prerequisite from task05 is rejected without editing workspace files.
- Unchanged-runtime evidence from task12 remains applicable:189 source tests,
  main/legacy82 each, and36 native browser cases per artifact. This audit compares
  current artifact hashes to that record instead of rerunning unchanged playback.
  The recorded Windows WebKit first-cell limitation remains in force.

## Dependency correction and retained requirements

The original linear dependency made type acceptance wait for task03's native
pixel investigation, although the type and source work was already implemented
and independently testable. Task04 now depends on the completed contract/type/
resource prerequisites. Task05 directly depends on BOTH task03 and task04, and
the plan validator enforces the task03 ancestor. Task03's status, acceptance,
pixel risk and device requirements are unchanged. Final integration, task06 and
release still require it; only independent source/type and version preparation
can advance. This is scheduling within the authorized plan, not a browser waiver.

Task04 is complete. Task03 and AUTO-THUMB-PIXEL-01 stay open; no whole-package,
remote CI, final installed-browser matrix, physical-device or npm readiness claim
is made. Package versions, dependencies, lockfile and distribution bytes are
unchanged. Maintenance commands and module ownership live in the package README
and ARCHITECTURE, rather than requiring future maintainers to reconstruct history.

Reverting this acceptance commit restores the prior dependency/status and docs.
Implementation remains in its original independently revertible commits; changing
those contents requires fresh relevant acceptance. No push, publish or deployment.
