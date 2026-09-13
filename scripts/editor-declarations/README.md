# Editor declarations

Run `yarn build:ts` from the repository root using Node 24.21.0 and Yarn 1.22.22.
Existing declaration URLs and package selection arguments remain supported.
`yarn build:ts artplayer-plugin-chapter` selects that package plus shared core
and language declarations. `yarn check:editor-types` checks the complete output
without writing. Unknown/duplicate selections fail before generating or writing.

| Module                                              | Responsibility                                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `../build-ts.js`                                    | Existing CLI path, checked JavaScript shim                                                             |
| `generate.ts`                                       | Discovery, names, formatting, whole-set validation, writes/checks and editor libUris                   |
| `core.ts`                                           | Core public source bundling, constructor and named/generic aliases                                     |
| `plugin.ts`                                         | AST conversion of default exports, callable CommonJS namespaces, type aliases and Window augmentations |
| `syntax.ts`                                         | Public compiler syntax diagnostics and supported dependency definition kinds                           |
| `dependencies.ts`, `vast-sdk.ts`                    | Type-only VAST SDK dependency closure; no advertising scripts                                          |
| `validation.ts`                                     | Standalone virtual compiler host, relative imports and rejection of hidden external dependencies       |
| `../editor-types.mjs`, `../plugin-editor-types.mjs` | Existing tooling import paths forwarding to TypeScript                                                 |

`yarn typecheck:docs-tools` checks these modules and the original JS/MJS shims.
Orchestration depends on conversion and validation; conversion does not write.
Public package declarations remain the source of truth. Do not hand-edit
`docs/assets/ts/*.d.ts`.

All selected declarations are formatted in memory using layout-only ESLint fixes,
then checked together with TypeScript 5.9.3 and 4.3.5, without `skipLibCheck` or
ambient dependency discovery. This checks cross-package globals too. SDK methods
and type aliases retain upstream shapes; the generated SDK block has a narrowly
scoped lint exception for those two style rules. The two compiler packages have
nominally distinct AST types: the historical module is adapted at the boundary
and exercised as the real older compiler. Node native type stripping runs tools.

Legacy MJS helpers retain synchronous functions and diagnostic shapes; existing
package consumer tests still use them. Core retains its existing bundler and
private definitions namespace. Plugins preserve callable/default aliases and
exported type namespaces. Unsupported imports/re-exports and invalid syntax fail.

VAST's `Player` and `PlayerOptions` come from the installed, lockfile-pinned
`@glomex/vast-ima-player` 1.21.2 and `@alugha/ima` 2.1.0 declarations. A dedicated
type-only SDK entry avoids bundling a second copy of the linked workspace core.
SDK types stay in the plugin's module-private definitions namespace, not global
runtime values. The optional Window hook and required callback remain unchanged.
Adjacent generated `artplayer-plugin-vast.LICENSE.txt` preserves upstream notices.
This does not settle VAST's runtime default-behavior compatibility decision.

The editor loads 22 declarations: core, 20 ecosystem libraries and i18n. The
unreferenced legacy `artplayer-plugin-websr.d.ts` asset is not in the `common.js`
library list and is not owned or deleted here. Monaco tests follow the actual
list. AST updates require exactly one array-valued `libUris` declaration; missing
or ambiguous declarations fail. Package-only builds leave that list alone.

Generation validates all selected results before any writes, but does not provide
a multi-file filesystem transaction. `--check` normalizes CRLF for comparison,
writes nothing and rejects missing/stale output. No timestamps are generated.
Rebuild then check after changes to public types, SDK versions or formatting.

```sh
yarn typecheck:docs-tools
yarn build:ts
yarn check:editor-types
node --test test/editor-types.test.js
yarn test:baseline
yarn test:browser test/browser/editor-declarations.spec.js --workers=1
```

Browser coverage uses the actual repository Monaco assets, all loaded declarations,
positive/negative consumers and emitted Chapter code against controlled media.
VAST is type-checked only: no ad request or SDK/network/device acceptance. Full
editor UI, routes, example coverage and release reviews remain SITE-03/04/05,
EX-03 and release tasks. SITE-02 installs no new dependencies.
