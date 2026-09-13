# Vue consumer example

Run the example from the repository root with Node from .node-version and Yarn
Classic 1.22.22. Use yarn install --frozen-lockfile and only the root yarn.lock.

```sh
yarn dev:vue
yarn typecheck:vue
yarn lint:vue
yarn build:vue
yarn test:vue-consumer
```

The build output is refactor/.cache/vue-example-dist.
Rebuild changed library distributions with yarn build followed by the package name.

## Files and ownership

- src/Player.vue owns the player and container through shallow refs. It constructs
  once on mount, emits getInstance, then releases its reference before calling
  destroy(false) on owner unmount. Vue owns the outer div. Player state is private:
  the component ref exposes the normal Vue surface, not an art property.
- src/player-options.ts holds this example's existing configuration overrides:
  French language, French/Indonesian dictionaries and fresh Danmuku/Document PiP
  factories per mount. They still override option.lang, i18n and plugins. The
  container comes from Vue; other options pass through. The url assertion preserves
  the historical Partial input while the core performs runtime validation.
- src/App.vue demonstrates the existing event/prop syntax. Its reactive option
  object keeps narrow field inference and is checked against `Partial<Option>`.
- src/main.ts is the client entry referenced by index.html. tsconfig.json replaces
  jsconfig.json, preserves the @ alias and enables strict source/template checking.
- vite.config.js uses the standard Vue plugin. The unused optional devtools overlay
  was removed from this example's build dependencies; no player UI was changed.

## Compatibility and updates

The wrapper retains required option: `Partial<Option>` and the getInstance event.
The array-form event declaration remains intentionally unchanged: historical
listener type extraction is not narrowed. Annotate event handlers with Artplayer
as App.vue does. Missing URLs may typecheck through Partial but still fail the
core's runtime validation.

Changing an option object or its fields does not recreate or update the player.
Use the received instance's methods, such as switchUrl, for live updates. Change
the component key to reconstruct using the latest options. No deep option watcher
or new event/ref contract was introduced. CSS classes and styles still fall through
to the root div; other native attributes continue to work for JS consumers.
Strict template checking distinguishes declared props from arbitrary attributes.

Vue captures listener errors through its error handling. A mounted component
retains its instance after a captured listener error and destroys it on unmount.
KeepAlive deactivation retains the instance; owner unmount destroys it. The example
does not silently pause or destroy players when cached. Use player APIs if your
application needs that behavior.

## Reproducible checks

Root development dependencies pin Vue/compiler-sfc 3.5.28, Vue Vite plugin 6.0.1,
vue-tsc 3.3.11, TypeScript 5.9.3 and Vite 7.3.6. No player runtime dependency changes.
The isolated consumer installs actual packed core, Danmuku and Document PiP files,
frozen-reinstalls them, and verifies every package file. Its Vue compiler and all
resolved declarations also live in that isolated install; no source aliases or
workspace type fallbacks are permitted. A plain-JS SFC separately verifies the
legacy event, attribute and repeated-mount syntax.

Development/production browser runs cover native play/pause/seek and pixels,
instance API source updates, option/key behavior, refs, siblings, repeated mount,
listener errors, KeepAlive and real Worker termination. Video/XML responses use
controlled fixtures. Plugin registration does not certify window PiP interaction,
full Danmuku scheduling, CDN availability or physical macOS/iOS Safari.

yarn test:vue-consumer --before runs the original Player.vue from the recorded Git
baseline against the same candidate packages. Both old and new wrappers must pass;
this is a compatibility control, not an old published npm wrapper test. Evidence
is retained in unique refactor/.cache/vue-consumer-* folders. GitHub runs the test
and uploads these reports; local success does not imply verified remote jobs.
