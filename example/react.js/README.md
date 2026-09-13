# React consumer example

Run from the repository root with Node from .node-version and Yarn Classic
1.22.22. Install once with yarn install --frozen-lockfile; keep only the root
yarn.lock in version control.

```sh
yarn dev:react
yarn typecheck:react
yarn lint:react
yarn build:react
yarn test:react-consumer
```

build:react writes to refactor/.cache/react-example-dist. It uses built
workspace package entrypoints. Rebuild a changed library with `yarn build <package>` before testing its integration. The consumer test packs the current
core, Danmuku and Document PiP distributions, installs them outside the workspace,
verifies their bytes, typechecks and builds the copied example, and exercises it
in Chromium, Firefox and WebKit. No package aliases to source files are used.
Reports and the consumer lock are in unique refactor/.cache/react-consumer-* folders.

## Component contract and ownership

- src/Player.tsx owns one Artplayer instance per effect. Existing props remain
  option: `Partial<Option>`, optional getInstance(art), and native div attributes.
  Stable option/callback identities retain the instance. Changing either destroys
  the old instance before creating one.
- getInstance runs after construction, not media readiness. Subscribe to player
  events for readiness. React StrictMode may call it again during development
  setup/cleanup. Callback errors destroy the instance before propagating the
  original error to React, including when cleanup also throws.
- Cleanup uses destroy(false): React owns the outer div. Retained player references
  expose isDestroy; the callback does not receive a new null argument on unmount.
- src/player-options.ts retains this example's existing overrides: French language,
  French/Indonesian dictionaries, and new Danmuku/Document PiP factories per instance.
  These still override option.lang, i18n and plugins. Other options pass through.
  React supplies the container. The url assertion preserves the historical Partial
  input; the core validates it. Missing URLs are not promised to construct successfully.
- src/App.tsx supplies stable options and a callback. src/main.tsx mounts StrictMode;
  index.html loads the TSX entry. tsconfig.json checks the actual TSX and declarations
  with strict checks and skipLibCheck: false.
- Root development dependencies pin React/React DOM 19.1.1, their types
  19.1.10/19.1.7, Vite 7.3.6, React Vite plugin 5.0.0 and TS 5.9.3.
  These are example/test tooling, not Artplayer runtime dependencies.

## Test scope

Installed development and production builds cover StrictMode, stable/changed
props, sibling instances, optional callbacks, unmount/remount, callback exceptions,
native play/pause/seek, decoded canvas pixels, plugin registration and the App entry.
Video and XML responses are controlled fixtures; CDN availability is not asserted.
Window PiP interaction, full Danmuku scheduling, macOS/iOS Safari and device
capabilities remain in package/release acceptance tasks.

yarn test:react-consumer --before substitutes recorded pre-fix Player source
against the same installed candidate packages. It must fail at callback exception
cleanup. This is a wrapper-source regression control, not an old npm wrapper test:
this example is not a published wrapper package.

Maintenance details and frozen evidence belong to EX-01 in refactor/.
