# artplayer-plugin-chapter

chapter plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter)

## API

```js
import artplayerPluginChapter from 'artplayer-plugin-chapter'

const plugin = artplayerPluginChapter({
  chapters: [{ start: 0, end: Infinity, title: 'Introduction' }],
})
// Pass plugin to Artplayer's plugins array. Options may also be omitted.
```

The registered name is `artplayerPluginChapter`. After metadata loads, use
`art.plugins.artplayerPluginChapter.update({ chapters })` to replace the chapters, or
`update({})` to clear them. Update is synchronous and requires an options object.
Chapter times are seconds; ranges must not overlap. `Infinity` as an end value uses the current duration.

TypeScript users can import `Chapters`, `Option` and `Result` with `import type`.
Modern ESM/CommonJS and `/legacy` share the same API; old TypeScript resolution
keeps the original `.d.ts` entry and a legacy subpath fallback.

The existing implementation sorts and fills the supplied array in place and replaces its Infinity end
values. Pass a fresh array when you need to retain the original configuration. After switching media,
call update with chapters appropriate to the new duration; initialization listens to metadata once.

## Maintenance

The implementation starts in `src/index.ts`, styles in `src/style.less`, and public declarations
in `types/artplayer-plugin-chapter.d.ts`. Its migration contracts and known defects are recorded in
[the chapter contract](../../refactor/baselines/chapter-contract.md).
See [ARCHITECTURE.md](./ARCHITECTURE.md) for module boundaries, event ordering, cleanup ownership,
compatibility decisions and the tests to run when changing each responsibility.

Blank chapters and replacement updates clear the hover title. Non-finite time points are rejected
(an Infinity end is still supported); chapters wait for a positive finite media duration.
Destroy releases this plugin's listeners and DOM, including when the player keeps its HTML.
A retained plugin result ignores updates after destruction.

Run `yarn test:browser chapter.spec.js` for published/current plugin behavior on the published core.
Run `yarn typecheck` and `yarn test:baseline` for strict consumer checks, including optional factory
arguments and invalid data. `yarn build:ts` regenerates the online editor declarations.

## License

MIT © Harvey Zhao
