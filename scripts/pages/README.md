# Pages artifact preparation

`yarn prepare:pages` runs after `yarn ci:build`. It never changes `docs/`, a
distribution, a Git ref or remote settings. It creates a fresh
`refactor/.cache/pages/run-*/site` and prints that exact directory as the Pages
step output. `latest.json` points only to the last successfully validated build;
a failed preparation must stop the workflow, not reuse an earlier output.

- `contract.json` preserves the domain and selected historical HTML, language,
  editor, compiled, i18n and smoke routes. It is a route contract, not an exhaustive
  HTML/CSS/JavaScript link crawler or external-service verification.
- `artifact.ts` inventories ordinary files, rejects symbolic/hard links and path
  escapes, verifies the domain/required files, and compares all 63 main/legacy/ESM
  compiled entries against the corresponding 21 package distributions.
- `prepare.ts` copies the checked tree, then rebuilds all 21 historical
  `uncompiled/<package>/index.js` URLs with the same IIFE/development configuration
  as `yarn dev`. This avoids publishing checked-in dev output from an older source.
  Package source/build/lock inputs and every staged file are fingerprinted.
- `../prepare-pages.mjs` is the argument-free CLI and GitHub output adapter.

The output does not promise that the input `dist` was freshly built: the workflow
must run `ci:build` first. Local users follow the same sequence. Existing static
vendor assets are copied; provenance and full editor validation remain SITE/REL
gates. No package-manager or dependency change is required.

`yarn test:pages` covers missing/empty routes, changed CNAME, links/path escape,
stale/missing distribution output and deployment bypasses. `yarn test:pages:browser`
serves staged core/chapter demo and ESM entries to Chromium/Firefox/WebKit. A
controlled page and same-origin native HTTP/Range MP4 exercise playback, chapter
update, web fullscreen and destroy. It records exact script hashes and network
failures separately from JavaScript errors; media cancellation is not automatically
a script-load failure. This is not a full real-editor, SDK or physical-device test.

The deploy workflow remains manual, restricted to master with
`PAGES_DEPLOY_ENABLED=true`, and depends on every reusable CI job. Its sole deploy
step accepts the current run's official Pages artifact. No PR artifact download,
arbitrary artifact ID, lifecycle rebuild or Git push is introduced. The checks job
has read-only contents permissions; only deployment receives Pages/OIDC writes.

Failed staging builds keep their report once the output directory exists. Earlier
preflight failures stay in the CI log. Reports are uploaded even on failure; staged
files are uploaded for deployment only after preparation and browser checks pass.
See `refactor/pages-deployment.md` for remote state, activation and recovery.
