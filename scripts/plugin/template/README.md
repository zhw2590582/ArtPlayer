# artplayer-plugin-{{name}}

{{name}} plugin for ArtPlayer

## Demo

[Local demo](http://localhost:8082/?libs=./uncompiled/artplayer-plugin-{{name}}/index.js&example={{example}})

Run `yarn dev artplayer-plugin-{{name}}` from the repository root first.
The generated example is `docs/assets/example/{{example}}.js`.

## Usage

```js
import {{export}} from 'artplayer-plugin-{{name}}'

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [{{export}}({})],
})
```

The factory also supports direct CommonJS `require`, its `.default` alias,
the `/legacy` entry, and the browser global `{{export}}`.
This scaffold only registers a name; implement and test the intended behavior.

## Maintenance

| File | Responsibility |
| --- | --- |
| `src/index.ts` | Synchronous plugin factory and registration result |
| `src/stylesheet.ts` | One stylesheet per document on module evaluation; safe to import without a DOM |
| `src/style.less` | Plugin styles; retain the package selector when adding UI |
| `src/assets.d.ts` | Build-time inline stylesheet declaration |
| `types/api.d.ts` | Owned option/result types shared by source and public entrypoints |
| `types/artplayer-plugin-{{name}}.d.ts` | CommonJS and older TypeScript entry |
| `types/artplayer-plugin-{{name}}.d.mts` | Native ESM declaration entry |
| `test/plugin.test.mjs` | Built ESM/CommonJS/legacy synchronous factory and alias contracts |

Replace the empty `Option` contract with explicit fields when implementing behavior.
Keep the return value synchronous unless the plugin explicitly requires an async contract.
Keep source and both declaration entrypoints consistent; test real consumers when changing them.
The stylesheet has document lifetime and is shared by instances. Resources added by the
plugin (listeners, timers, requests, DOM, workers) need per-instance ownership and cleanup
on `art.on('destroy', ...)`; guard late callbacks and source changes. Add behavior-specific
normal, error, concurrency and cleanup tests, plus real browser checks for media/UI work.

Use the repository Node version from `.node-version` and Yarn Classic 1.22.22:

```sh
yarn workspace artplayer-plugin-{{name}} typecheck
yarn build artplayer-plugin-{{name}}
yarn workspace artplayer-plugin-{{name}} test
```

Build before testing; the tests consume the actual distribution files. ESM and modern
UMD target es2020, legacy UMD targets es2015. The generator uses the existing toolchain;
it does not install dependencies, publish, or update the root lockfile. Register this
workspace/demo in the refactor inventories and validation mappings before CI, and update
only the root `yarn.lock`. The declared ArtPlayer peer does not itself prove compatibility:
test the core versions and devices required by the implemented features.

## License

MIT © Harvey Zhao
