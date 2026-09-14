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

Site-owned browser behavior now lives in `browser/`; its README maps the shared
loader, mobile entry and Run Code/language navigation. `docs/public/main.js` is a
generated input to VitePress. Run root `yarn build:site-assets` after changes, or
`yarn check:site-assets` for drift. The existing desktop common.js UI remains a
separate source pending SITE-03 migration; no player package APIs move here.

## Related tooling

Run commands from the repository root with its pinned Node version and Yarn
Classic 1.22.22. Maintain the root lockfile only.

```sh
yarn workspace artplayer-vitepress dev
yarn build:docs
yarn workspace artplayer-vitepress preview
node refactor/scripts/site-inventory.mjs --check
```

`build:docs` uses the current pinned Yarn executable to run this workspace's
VitePress script into a temporary directory. A successful build replaces the
generated site, with backups for caught replacement failures. See
[build maintenance](../../scripts/site-build/README.md) for module ownership,
failure recovery and the explicit limits of directory replacement.

The repository generators have different ownership:

- `scripts/build-types.mjs`: core public declaration sources to existing `types/`.
- `scripts/build-ts.js`: standalone editor declarations and the editor library list.
  Checked TS modules in `scripts/editor-declarations/` validate all selected
  declarations together with current and historical compilers before writing.
  Use `yarn check:editor-types` for drift checks; see that module's README.
- `scripts/build-test.js`: extracts Chinese Run Code blocks into `docs/test/test.js`.
  The TS implementation in `scripts/docs-smoke/` produces deterministic readiness
  smoke cases with owned frames, error observation and cleanup. It does not prove
  complete playback or plugin behavior. See its maintenance README and SITE-SMOKE-01.
- `scripts/build-i18n.js`: typed standalone language builds, staged before replacing
  distribution and `docs/compiled/i18n/` together; legacy globals and paths remain.
- `scripts/build-docs.js`: this VitePress build through pinned Yarn and staged output.
- `scripts/build-llm.js`: offline source-preserving `docs/llms.txt` and fingerprint
  manifest. `yarn check:llm` checks drift in CI; `ci:build` regenerates after types.
- `scripts/trans-docs.js`: local plan by default; explicit `--remote` creates a
  reviewable draft, `--validate <draft>` checks edited drafts, and `--apply <draft>`
  replaces selected English files with stale-input and rollback checks. Remote
  translation is never part of CI. See [tool maintenance](../../scripts/documentation/README.md)
  for the migration from destructive translation, module boundaries and limits.

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

Generated `main.js` installs one document click listener under
`window['run-code-init']`; its lifetime is the page. Run Code opens the separate
editor and recognizes localhost, 127.0.0.1 and IPv6 loopback. First-language
navigation preserves existing English counterparts and explicit later choices;
unavailable storage keeps the requested page. See `browser/README.md` for the
current rules and verified scope. Full VitePress lifecycle remains SITE-03/05.

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
