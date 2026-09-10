# Declaration entrypoints

`artplayer.d.ts` remains the shared API definition and old TypeScript entry. Its
relative declarations describe the existing player; they are not a claim that the
runtime has already migrated to TypeScript.

Conditional exports select `artplayer.d.mts` for ESM and `artplayer.d.cts` for CJS
and legacy. The CJS bridge uses `export =` for the real module.exports constructor
and carries existing named types in its namespace. The ESM bridge re-exports that
constructor and the same type identities. Do not copy the class into a second
declaration: instance, ready callback and plugin types must remain consistent.

Languages use language.d.mts / language.d.cts for modern resolution and
legacy/language.d.ts for old typesVersions resolution. The value shape comes from
I18n's existing dictionary value type (`I18n['en']`, also compatible with TS 4.3.5).
i18n.d.ts contains dictionary definitions without suppressed module augmentation.
The editor's global language module is generated separately as
docs/assets/ts/artplayer-i18n.d.ts so it cannot contaminate npm consumers.

Top-level types and historical .d.ts filenames remain available; runtime paths and
exports do not change. See TypeScript's declaration module format and conditional
resolution rules: https://www.typescriptlang.org/docs/handbook/modules/reference.html

When changing types, run `yarn typecheck`, `yarn test:baseline` and
`yarn test:package:release`. They cover default/named types, core/legacy constructors,
chapter/legacy factories, language data, invalid inputs, NodeNext/Bundler and old
TS 4.3.5 consumers. Run `yarn build:ts` to refresh editor declarations. Full editor
behavior and other core declaration/runtime mismatches have CORE-07/SITE tasks.

## Configuration migration boundary

Option retains its historical required URL and component read types. OptionInput is
an additive constructor input: URL is optional and numeric component HTML is accepted.
The constructor keeps its old overload and adds OptionInput; Component.add/update
similarly retain their old signatures and add ComponentInput. Internal ResolvedOption
uses the expanded input with defaults filled. It is not a new public runtime export.
This preserves assignments such as `const url: string = option.url` for existing
Option consumers while matching the verified JS input forms (BASE-TYPE-06).

Use OptionInput for newly typed configurations that omit URL or use numeric HTML.
test/types/options-source.ts and declaration-inputs.ts cover those forms positively;
declaration-legacy.ts preserves old reads and historically legal return assumptions.
Do not change runtime validation to match a narrower declaration. The additions,
retained conflicts and follow-up owners are detailed in [COMPATIBILITY.md](./COMPATIBILITY.md).
CORE-07 coordinates the differences; it does not close every conflicting old return
signature. CORE-21 remains responsible for the generated/public declaration strategy.

## Internal media migration

`PlaybackControls` is an optional accurate view of play/pause/toggle. Assign the
existing player directly (`const playback: PlaybackControls = art`); it preserves
object identity and reports toggle's Promise-or-void branches. It is exported from
the root and shared type entry in all five supported consumer modes. Historical
`art.toggle(): void` remains available; see COMPATIBILITY.md for the distinction.

CORE-06 uses src/media/types.ts and src/media/hosts.ts for native media, canvas
shims and minimal playback/layout dependencies. These types are not exported by
the package. Public art.video keeps its historical declaration and runtime identity;
do not cast an internal canvas to HTMLVideoElement merely to satisfy that public
declaration. Optional capability checks belong to their consumers. Full constructor
type integration is tracked by CORE-20; proxy package migration validates each real
adapter separately. Source type fixtures and real canvas integration live in
test/types/media-hosts.ts and test/browser/media-hosts.spec.js.

## Plugin and event augmentation

Use the type-only `artplayer/types` entry to augment the shared Plugins and Events
interfaces. This reaches the same definition through Node10, NodeNext CJS/ESM and
Bundler. Directly augmenting the root CJS namespace type alias is not equivalent.

```ts
import Artplayer from 'artplayer'

declare module 'artplayer/types' {
  interface Plugins {
    customPlugin?: { update: (value: number) => void }
  }
}

const art = new Artplayer({ container: '#player' })
art.plugins.customPlugin?.update(1)
```

Types do not register a plugin or prove that it is installed; retain a presence
guard unless the application owns and verifies installation. PluginFactory describes
the existing single art argument and this receiver. Public add keeps its historical
return signature; internal manager types model actual returns separately. The new
subpath has no runtime export; use it only for types/augmentation. plugins-public.ts
tests the same declarations in all installed consumer modes, and package runtime
checks reject both require and import of artplayer/types.
