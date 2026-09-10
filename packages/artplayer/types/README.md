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
