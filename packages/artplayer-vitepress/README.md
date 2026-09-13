# ArtPlayer documentation site

This workspace builds the static API documentation served at `/document/`.
The separate repository `docs/index.html` is the online player/editor; it is
not a VitePress page. Keep both URL surfaces compatible.

## Sources and generated files

| Source | Responsibility | Output or consumer |
| --- | --- | --- |
| `docs/index.md`, `docs/start`, `docs/component`, `docs/advanced` | Chinese API documentation | `/document/` |
| `docs/en` | English counterparts | `/document/en/` |
| `docs/plugin/danmuku.md` | Dedicated Chinese Danmuku guide | `/document/plugin/danmuku.html` |
| `docs/.vitepress/config.js` | Navigation, base URL, output path, page head | Repository `docs/document/` |
| `docs/vite.config.ts` | Search plugin configuration | VitePress/Vite integration; real search acceptance remains pending |
| `docs/public/main.js` | Run Code links and first-visit language redirect | Copied into the built site |
| `docs/public/style.css` | Documentation presentation | Copied into the built site |

Edit Markdown and public sources here. Do not edit the generated repository
`docs/document/`. The current inventory contains 27 Markdown pages: 14 Chinese
and 13 English. Danmuku has no English counterpart yet. Other plugins currently
use their package README, architecture notes and linked editor examples;
navigation links alone are not complete API documentation.

## Related tooling

Run commands from the repository root with its pinned Node version and Yarn
Classic 1.22.22. Maintain the root lockfile only.

```sh
yarn workspace artplayer-vitepress dev
yarn build:docs
yarn workspace artplayer-vitepress preview
node refactor/scripts/site-inventory.mjs --check
```

`build:docs` currently delegates through `npm run build` to this workspace's
VitePress script. This does not install dependencies or create another lockfile;
the command orchestration will be modernized in SITE-03.

The repository generators have different ownership:

- `scripts/build-types.mjs`: core public declaration sources to existing `types/`.
- `scripts/build-ts.js`: standalone editor declarations and the editor library list.
- `scripts/build-test.js`: extracts Chinese Run Code blocks into `docs/test/test.js`.
  It is currently a smoke generator with a fixed 100 ms completion delay, not
  proof of asynchronous playback or plugin success. SITE-02 owns its replacement.
- `scripts/build-i18n.js`: core language source bundles and copies to `docs/compiled/i18n/`.
- `scripts/build-docs.js`: this VitePress build.
- `scripts/build-llm.js` and `scripts/trans-docs.js`: explicit remote DeepSeek
  operations, with a required key. They are not part of `ci:build` or `build:all`.
  Do not invoke them just to inspect or regenerate local documentation.

## Browser boundaries and ownership

The editor's `prod` choice is stored in localStorage and changes the core script
only. The `libs` query still selects plugin scripts independently. `example`
takes precedence over `code`. Editor Run dispatches the example cleanup event,
destroys existing players, then evaluates the code. Preserve these contracts
when moving its JS to TypeScript; use an isolated origin for automated tests.

The mobile page preserves the query during redirect but has its own loader and
uses the development core. The ESM, i18n, iframe and generated smoke pages each
have separate dependencies. See the repository
[site inventory](../../refactor/site-inventory.md) for the full entrypoint map,
source fingerprints, asset provenance and assigned follow-up work.

`main.js` installs one document click listener under `window['run-code-init']`;
its lifetime is the page. Run Code opens the separate editor. The development
hostname check is currently exactly `localhost`; `127.0.0.1` follows the remote
link path. The language redirect writes `lang-init` and can navigate to the
English root on a first non-Chinese visit. SITE-03/SITE-05 must test these paths
before modifying routing or VitePress client lifecycle behavior.

## Delivery and remaining acceptance

`scripts/projects.js` excludes this workspace from the 21 library builds.
VitePress emits the static site, and the Pages workflow deploys the validated
repository `docs/` artifact. The manifest currently has neither library
entrypoints nor `private: true`; that absence is not npm publication intent.
REL-01 must explicitly classify its release handling. Its independent planned
major still advances from 1.1.0 to 2.0.0 under the agreed version policy.

SITE-02/03 own generators and browser source organization; SITE-04 owns bilingual
API completeness; SITE-05 owns build, links and real search; SITE-07 owns vendor
provenance and distribution notices; EX-03 owns complete demo execution. Three
release review rounds and remote CI/Pages evidence remain separate requirements.
