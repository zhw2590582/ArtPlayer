# MOD-PLUGIN-01: TypeScript plugin scaffold

## Scope and compatibility

The original generator at `07d5bfef2e815e8038362bb836b9c496c7ef9862` overwrites an
existing dotted demo file, and its README uses the hyphenated name instead of that
actual file name. The frozen implementation is executed in a fixture to reproduce
both defects. The old command and valid name/global/example mapping remain; invalid
names with empty segments and extra arguments now fail before writing. No existing
package, public declaration, built distribution, or real example was regenerated.

`MOD-PLUGIN-01` is a child dependency of MOD-02. It finishes the generator/template
part independently; development/build/shared-config migration remains with MOD-02.

## Implementation and maintenance

The checked JS command shim delegates to strict TS CLI, pure rendering and filesystem
publication modules. Rendering validates placeholders, name and output collisions.
Publication stages complete files, exclusively reserves a new package and hard-links
without replacing existing destinations. Caught failures roll back owned unchanged
files and empty directories, preserving edits and concurrent output with recovery
paths. Existing symlink/junction destinations are rejected. This is per-file atomic
publication, not all-files/crash atomicity or adversarial filesystem protection.

The new template includes TS source, a once-per-document stylesheet import with an
SSR guard, explicit shared option/result declarations, distinct CJS/ESM declaration
entries, main/module/legacy formats, direct/default CommonJS calls, package-consumer
tests and a maintenance README. The demo links to the actual dotted example.
The factory remains synchronous. New package version starts at 1.0.0; the existing
packages' independent next-major targets are unchanged.

The module map, failure recovery boundaries and reproducible commands live in
[scripts/plugin/README.md](../../scripts/plugin/README.md). New dependencies: none.
Generated manifests declare the ArtPlayer host as a peer; generation does not install
or update the root lock, inventories or release scope. Root `test:scaffold`,
`typecheck:scaffold`, lint coverage, Node tests and CI typecheck now cover this tool.

## Verification and actual limits

- Node 24.21.0, Yarn Classic 1.22.22, Windows. Strict toolchain check passed.
- `yarn typecheck:scaffold`: strict TS modules plus JS shim passed.
- `yarn test:scaffold`: 11 passed, zero skipped. Tests cover the frozen defects,
  malformed template/name input, existing/competing outputs, mid-write rollback,
  retention of externally edited files, redirected directories and CLI invocation
  from another directory. A generated fixture is linted with zero warnings, built
  through the real three-format production CLI, then consumed through actual
  ESM/CJS/legacy package exports. Strict source, TS 5.9.3 NodeNext import/require and
  TS 4.3.5 classic consumers pass positive and negative cases. Repeated stylesheet
  loading and no-DOM import are checked with linkedom/VM, not real media playback.
- `yarn lint`: passed with the one pre-existing unused directive warning in
  `docs/assets/ts/artplayer.d.ts`.
- `yarn test:ci`: 50 passed. This proves local workflow-policy regressions, not a
  remote GitHub run.
- `yarn test:baseline`: 522 passed, zero skipped; frozen package/runtime/type and
  refactor workflow regression checks remain intact.
- Initial integration failure was the nested Node test runner's inherited context,
  which suppressed the child reporter. The runner now removes NODE_TEST_CONTEXT;
  child test completion is asserted. Generated-output lint then found manifest
  array ordering and the old template Less indentation; both templates corrected.
  Initial logs are retained separately from the successful run.

Evidence and source/log hashes: [scaffold-validation.json](../baselines/scaffold-validation.json).
Fixtures are ignored and removed through checked paths; no 23rd real workspace was
created. No frozen reinstall was needed because dependencies and yarn.lock are
unchanged. No browser playback, device, full release or publication claims arise
from this tooling task. Future generated plugin features need their own tests.

## Rollback and next work

Revert this task's dedicated commit to restore the previous generator, templates and
script integration; that also restores its known overwrite defect. Existing package
artifacts require no rollback. MOD-02 will migrate the remaining build/development
responsibilities while preserving command behavior. Local commit only; no push/npm.
