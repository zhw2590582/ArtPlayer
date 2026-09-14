# Plugin scaffold maintenance

Run `yarn create:plugin some-name` from the repository. The historical
`node scripts/plugin/create.js some-name` path remains available and always targets
the repository containing that script, even if the current directory differs.
Use Node from `.node-version` and Yarn Classic 1.22.22. `--help` writes nothing.
Names must be lowercase words separated by single hyphens; malformed names and
extra arguments now fail before writing. Existing valid CLI names keep their
package/global/example naming convention (`some-name` / `artplayerPluginSomeName`
/ `some.name.js`). The README demo now uses the actual dotted example name.

## Ownership and write sequence

| Module | Responsibility |
| --- | --- |
| `create.js` | Checked JS compatibility shim; repository root, argv and failure exit status |
| `cli.ts` | Validate command shape, render then publish, print next steps |
| `render.ts` | Read text templates into a deterministic relative-path/content map; validate names, placeholders and output collisions |
| `publish.ts` | Preflight destinations, stage complete text, exclusively reserve the package name and link files, roll back owned writes on failure |
| `template/` | Generated package source, declarations, manifest, built-package tests and maintenance guide |

Templates ending in `.tpl` lose that suffix. `{{name}}`, `{{export}}` and
`{{example}}` are the only replacements, including in filenames. Templates are
UTF-8 text; links and unknown placeholders fail during rendering. Invalid TS
placeholder identifiers are intentionally stored as `.tpl`; lint the renderer
normally, and typecheck/build its rendered output through the integration test.

The writer refuses existing packages (including empty directories), examples and
redirected destination paths. An exclusive temporary directory inside `packages/`
holds the complete text before the final package is reserved. Hard links publish
each complete file without overwriting another writer. Filesystem support for
same-volume hard links is required; failure is reported and owned writes roll back.
Staging never contains a top-level package.json and is ignored by project discovery.

On a caught failure, only files still matching this operation's written contents
are removed, followed by empty directories created by this operation. Changed files
and nonempty directories remain, with recovery paths in the error and its cause.
The staged directory is removed only after checking its actual path and parent.
The injected link function is an internal test seam for write failure/collision
cases, not a CLI option. Publication is atomic per file, **not** a transaction over
all files or crash recovery: a killed process may leave a partial new package or
staging directory for manual inspection. This is not protection against an actor
actively replacing filesystem ancestors between checks.

## Generated package contract

The synchronous TS factory returns its registration name, with a self `.default`
alias for CommonJS users. The three existing build formats and `/legacy` entry
remain. CommonJS/older-TS `.d.ts` and ESM `.d.mts` share `types/api.d.ts`, also used
by the runtime source. The initial options type deliberately has no fields;
implement explicit owned fields and behavior tests when developing the plugin.
Styles are injected once per document at module evaluation, with a no-DOM import
guard. During document loading this now inserts the style immediately instead of
scheduling a DOMContentLoaded handler; imports after loading remain supported.
These are templates for new packages;
the command never rewrites an existing plugin's API or stylesheet behavior.

Generation does not install dependencies, change the root Yarn lock or inventories,
or publish. New packages start at 1.0.0; the existing 22 packages' separate major
upgrade policy remains unchanged. Before adding a new real workspace to CI, update
the explicit package/demo/type/contract coverage and release scope through its own
task, then update only the root lock. The scaffold's `artplayer: "*"` peer is a
declaration of the host dependency, not evidence for every historical version.

## Validation

```sh
yarn typecheck:scaffold
yarn test:scaffold
yarn lint
```

`test/plugin-scaffold.test.js` freezes the former generator at
`07d5bfef2e815e8038362bb836b9c496c7ef9862`, reproduces overwritten examples and
incorrect demo names, then checks validation, concurrent collision, rollback,
externally edited output retention and redirected directories. It runs the actual
old CLI path from a different directory and builds a generated fixture using
`scripts/build.js`. Built package tests exercise package export conditions, aliases
and synchronous results; strict source, NodeNext ESM/CJS and TS 4.3.5 consumers are
compiled. The DOM test checks duplicate stylesheet/import ownership with linkedom;
it is not browser playback evidence for a future plugin's features.

Fixtures live under the ignored `refactor/.cache/` and are removed through checked
paths. Tests do not add a 23rd workspace or alter real examples. Root `test:node`
includes this suite, and `ci:check` includes the strict scaffold typecheck. Remote
CI execution remains a separate release requirement.
