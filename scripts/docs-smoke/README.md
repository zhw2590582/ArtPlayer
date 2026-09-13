# Documentation readiness smoke

This generator keeps the existing `yarn build:test` / `node scripts/build-test.js`
entrypoint and `docs/test/test.js` URL. Use the pinned Node 24.21.0 runtime and
Yarn 1.22.22. Node runs the owned TypeScript modules using native type stripping;
the command shim remains JavaScript and is included in strict `checkJs` checking.
The root typecheck commands use `node node_modules/typescript/bin/tsc` explicitly:
Yarn's shared `tsc` binary can point at the installed 5.1.6 compatibility alias.
The main 5.9.3 compiler and older compatibility compilers retain distinct roles.

| File                    | Ownership                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `parser.ts`             | Markdown tokens, Run Code/fence adjacency, source locations and closing fences                             |
| `generator.ts`          | Deterministic file discovery, syntax compilation without execution, dependency list and browser bundle     |
| `runtime.ts`            | One sequential example frame, script loading, error/readiness observation, teardown and Mocha registration |
| `../build-test.js`      | Original CLI path, argument validation and write/read-only check                                           |
| `../tsconfig.docs.json` | Strict Node/DOM tools check, including the JavaScript shim                                                 |

```sh
yarn build:test
yarn check:docs-smoke
yarn typecheck:docs-tools
node --test refactor/scripts/docs-smoke.test.mjs
yarn test:browser test/browser/docs-smoke.spec.js
```

`docs/test/examples.json` records stable source file/line IDs, original code and
the ordered script list from `docs/test/index.html`. No timestamps enter generated
content. Generation validates every selected example before writing either output;
`--check` compares both files without modifying them. Parse/syntax errors fail the
command with a source location. This is not a transactional multi-file filesystem
write if the filesystem itself fails during output.

The scope stays Chinese JavaScript fences after Run Code markers, excluding
`en`, `plugin`, `public` and `.vitepress`. There are 233 current cases in 11 files.
CRLF is normalized to LF. New cases must be reviewed and the deliberate count
assertion updated. JS syntax compilation does not execute snippets or validate
their API semantics. TypeScript/editor declaration generation remains SITE-02.

The browser bundle registers cases with the existing Mocha BDD page. Each case:

1. Creates an iframe with its own ArtPlayer container and loads the page's runtime
   scripts in order, excluding Mocha, Chai and the generated test script itself.
2. Evaluates the snippet as a classic script in that frame, awaits its returned
   promise if any, and waits for the currently created players' `ready` events.
3. Observes thrown errors, unhandled rejections and media/player errors until that
   readiness boundary plus one task turn. A 4500 ms deadline produces failure,
   never success. Cases without players cover evaluation only.
4. Detaches observer listeners, destroys frame players, removes the iframe and
   restores local/session storage. Cleanup errors are failures and retain an
   earlier failure in the error list. Concurrent calls are rejected.

The iframe is an owned browsing context, **not a security sandbox**. It shares
the parent origin. Run the test page on an isolated test origin with no concurrent
same-origin work: storage restoration does not merge writes from other tabs.
Unchanged browser storage is restored after each case, while frame-owned timers
and globals disappear when the frame is removed. Arbitrary external resources
that a snippet deliberately hands to another window are outside this ownership.

Readiness is not playback, interaction or complete asynchronous feature acceptance.
Delayed actions scheduled after this boundary are not verified; examples involving
clicks, seek, SDKs, windows and full lifecycle behavior remain EX-03/package tests.
The automated harness tests use actual core/media and three selected unchanged
documentation snippets with controlled media. They do not certify all 233 examples
or the remote SDK endpoints in the full manual page.

Windows WebKit has the existing DPIP-MEDIA-01 dimension discrepancy: the same
320x180 media can report 640x360 layout dimensions. The harness retains exact raw
readings and only these documented pairs; it does not close intrinsic-size or
real Safari/device acceptance. See `refactor/site-inventory.md` for broader ownership.

Dependencies: root development-only `@types/node` 24.10.0 and
`@types/markdown-it` 14.1.2 provide strict tools typing. Runtime parsing uses the
existing MarkdownIt 14.1.0 and browser bundling uses the existing pinned esbuild.
No player package runtime dependency changes.
