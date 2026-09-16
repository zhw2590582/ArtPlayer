# i18n and documentation builds

Run commands from the repository root with `.node-version` and Yarn Classic
1.22.22. `scripts/build-i18n.js` and `scripts/build-docs.js` are checked JS CLI
adapters; the actual orchestration lives in these strict TypeScript modules.

```sh
yarn build:i18n
yarn build:docs
yarn test:site-build
yarn typecheck:docs-tools
yarn test:browser document-site.spec.js
```

`build:docs` generates site-owned browser assets first, then uses the exact Yarn
executable from the current Yarn invocation to run the existing workspace
`build` script with an explicit staged `--outDir`. Running `node build-docs.js`
without a Yarn environment now reports how to invoke the supported command;
it never falls back to npm or another package manager. The child version is
verified before creating staging output. No translation or model service runs.

| Module                                           | Responsibility                                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `i18n.ts`                                        | Sorted language entries, typed Vite configuration, exact output set, identical distribution/demo copies          |
| `docs.ts`                                        | Pinned Yarn child, child error/exit propagation, required site index                                             |
| `artifacts.ts`                                   | Fixed output directories, exclusive build ownership, snapshots, staging, replacement and caught-failure recovery |
| `packages/artplayer-vitepress/build/markdown.ts` | Wrap the installed VitePress code-group renderer with stable page/group/tab IDs                                  |

The stateless path validation and hashing helpers in `../documentation/files.ts`
are shared by documentation source tools and these build tools. No player runtime
depends on them. Vite configuration here preserves the language build's es2020,
esbuild minification, default export, UMD/ESM names and existing browser aliases.
It intentionally does not pull unrelated library worker/banner transforms into
the language-only builder. Language sources are unchanged; index, publish,
zh-cn and declaration files remain excluded from standalone builds. JS/TS entry
duplicates fail before any output replacement. The current 11 languages produce
22 files in each of `packages/artplayer/dist/i18n` and `docs/compiled/i18n`.

The docs workspace explicitly declares `type: module`, matching its existing
ESM config/theme files and new build module. VitePress 1.6.3 generates random
code-group input IDs by default, changing otherwise identical builds. The local
Markdown hook preserves its original HTML and active-tab handling, replacing
only generated group names and input/label IDs with page-relative hashes and
ordinals. IDs remain unique between groups; labels keep their associations.
Never patch installed VitePress or rewrite emitted chunks after hashing. When
upgrading VitePress, verify this renderer hook and actual tab switching again.

## Replacement and recovery

Builds acquire an exclusive per-kind lock in `refactor/.cache/site-build/`, then
create unique staged output directories. Existing output fingerprints are captured
before compilation. All compilation and validation finish before any destination
is renamed. Existing files edited during compilation cause a rejection. Complete
staged trees replace the owned targets; stale generated files disappear from both
i18n destinations, and other package output directories are untouched.

Replacement moves old directories to backups, then moves new directories into
place. A caught rename failure restores previous directories in reverse order.
If someone changes an installed output during replacement, recovery refuses to
overwrite that edit and retains the original backup. The error gives the retained
run path. Staging cleanup only removes a checked run directory under the cache.
The lock is released on settled success/failure. Symbolic links in artifact trees
are rejected, including roots that resolve outside the workspace.

This is **not an atomic multi-directory transaction for concurrent readers**:
there is a short rename gap, and the two i18n trees are installed sequentially.
Power loss or forced process termination can retain a lock and partial replacement.
Do not infer that a lock file means a process is alive, or automatically delete an
old lock. Verify process state, inspect output/backup trees and restore the intended
version before explicitly removing a stale lock. Cleanup errors may occur after
successful installation; inspect the actual outputs rather than assuming failure
means nothing changed. The tools do not promise hostile filesystem race isolation.

## Verification and remaining ownership

`test:site-build` uses real filesystem failures, fixed old-source reproduction,
the actual Vite compiler and all 11 dictionaries in UMD/global, CJS, AMD and ESM
forms, including historical `window['artplayer-i18n-*']` aliases. Syntax failure
must preserve both old outputs. A real Yarn fixture child verifies exit code 23,
success, staging and package-manager selection. Intentional compiler failure in
that test prints a red build message; the enclosing rejection assertion must pass.

The browser smoke loads generated Chinese/English deep pages and actual built
assets in three browser engines, then clicks Run Code. Its separate editor
destination is intercepted only to observe the URL; it does not revalidate all
editor actions or claim complete search/links/example coverage. It also checks
native radio selection and visible code blocks after clicking the built code-group
labels. SITE-03 still
owns desktop editor UI migration, SITE-04 semantic/bilingual documentation and
SITE-05 full site/search/link acceptance. No npm/Pages publication or remote CI
run follows from a successful local build.

## Generated documentation links

`yarn check:site-links` reads every generated HTML page under `docs/document/`
and the actual built `virtual_search-data.*.js` module. `links.ts` uses the pinned
root development dependency `htmlparser2@10.1.0` to collect href/src references,
IDs and legacy named anchors without executing page scripts. It resolves local
files, directory indexes, encoded fragments and references back to the site root.
Script contents and inert template contents are not treated as rendered links.
An HTML base element requires explicit checker support rather than silently
using the wrong base. Missing/ambiguous/malformed search data and missing HTML
output fail the command. A missing target or anchor also exits nonzero.

The checker runs in `ci:check` against committed output and after the documentation
build in `ci:build`. Its JSON lists external URLs without requesting them. External
availability, CSS/JavaScript-discovered URLs, interactive Run Code forwarding,
playback and online editor behavior need separate checks. `test/site-links.test.js`
exercises valid HTML/entities, missing assets and anchors, invalid URLs and broken
search modules; it is included in `test:site-build` and `test:node`.
