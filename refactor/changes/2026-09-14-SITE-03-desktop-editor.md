# SITE-03: desktop editor and generation integration

Baseline: `a468cb2c39e626f7b4f737d0ca60334150deae2b` on
`codex/compatible-modernization`. This completes the remaining desktop portion
of SITE-03; SITE-LOAD-01, SITE-AI-DOCS-01 and SITE-BUILD-01 retain the evidence
for loaders/navigation, translation/LLM tools and i18n/VitePress builds.

## Implementation and ownership

The desktop editor now has strict TypeScript modules for HTML bootstrap, host
types, preferences, Monaco initialization/compilation, run sessions and file
imports. The entry binds existing controls and owns page listeners and cleanup.
The module map and maintenance commands live in
`packages/artplayer-vitepress/browser/README.md`.

`bootstrap.js` and `common.js` are generated from TS alongside the existing three
site assets. Declaration generation owns `browser/editor-libraries.ts`; the UI,
corpus and inventory consume that canonical list. Successful `build:ts` rebuilds
the assets. Read-only declaration and asset checks separately reject drift.
Generated code is checked against its source instead of being hand-linted/fixed.

Root development dependency `monaco-editor@0.30.1` supplies types matching the
existing browser vendor. Imports are type-only. Only one lock entry is added;
no vendor runtime upgrade or new consumer dependency is introduced. Frozen Yarn
installation used `--ignore-scripts`, and strict toolchain verification checks
Node 24.21.0, Yarn 1.22.22, 39 pinned tools and 1471 dependency selectors.
`test:site-editor` is also included in the normal Node test chain.

## Reproduced problems and behavior changes

- The frozen old editor evaluates TypeScript syntax as JavaScript. The candidate
  uses the actual Monaco TS worker to emit JS before destroying/running a player.
  Syntax failure leaves the current player intact. Semantic diagnostics remain
  visible but do not become a new mandatory execution gate.
- The frozen FileReader helper cannot settle read errors. Candidate handlers
  reject errors/aborts and remove listeners; imports run in file/batch order.
- The frozen inline bootstrap throws when storage is denied. Candidate defaults
  still boot the editor; failed preference writes revert the checkbox and report
  the failure rather than claiming persistence.
- Removing the old arbitrary one-second delay exposed a real WebKit AMD race:
  Monaco's late language script saw `define` suspended by the example loader.
  Initialization now awaits the actual language modules before enabling Run or
  starting example dependencies. A controlled delayed-module browser test holds
  this boundary explicitly.

## Compatibility and limits

Existing DOM classes, controls, `prod/ts/code/log` keys and string values, URL
encoding, example priority, Ctrl/Meta-S, classic JS execution, dependency caching,
Run cleanup and `window.art` remain. JS imports retain script semantics; classic
Run code has global access and function-local `var`. Accidental access to the old
editor's private eval closure is not a public API. Core/plugin runtime sources,
public declarations and distribution contents are outside this change.

Newer runs supersede delayed example/compile results. Non-persisted pagehide
aborts initialization/imports and releases owned models, imports, listeners and
players. Already executed user scripts cannot be undone, and in-flight Monaco
worker RPC has no cancellation promise. A synthetic pagehide verifies cleanup;
real BFCache eviction/restore and physical devices are not claimed.

## Verification and failure history

Exact results, browser versions and log fingerprints are in
`../baselines/site-editor-validation.json`. New Node tests retain frozen old
reproductions and cover run races, failure propagation, FileReader settlement,
storage and cancellation. The browser suite uses actual local Monaco and player
assets with controlled media; it covers emitted TS, repeat Run/Ctrl-S, imports,
preferences, failed declaration initialization and delayed AMD readiness.

The initial 36-case run had 33 passes and 3 failures. Two Firefox assertions
incorrectly inspected the display string of Error objects; they now inspect the
actual Error message. The third failure exposed the AMD race described above.
Initial and subsequent reports are retained separately. Final 42-case runs pass
on Chromium, Firefox and WebKit with no retry, skip or timeout widening.

Full baseline and CI regressions, strict browser/tool types, root lint and
read-only declaration/asset/LLM checks are recorded with their actual results.
The existing generated core-declaration lint warning is retained. Full site
search/link coverage, all examples, advertising SDK services, remote CI and npm
acceptance remain separate tasks; those are not inferred from editor tests.

## Handoff and rollback

Finish SITE-04/05/07 and EX-03 for documentation semantics, whole-site behavior,
vendor/assets provenance and all examples. Plugin compatibility and release
reviews remain open. Revert this task's commit as one unit (TS sources, generated
assets, declaration-list wiring, tests, dependency/lock and task records); do not
restore only generated common.js while retaining the new source list/HTML entry.
This task is committed locally only, without pushing or publishing.
