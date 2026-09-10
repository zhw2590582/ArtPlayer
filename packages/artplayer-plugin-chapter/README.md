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

The existing implementation sorts and fills the supplied array in place and replaces its Infinity end
values. Pass a fresh array when you need to retain the original configuration. After switching media,
call update with chapters appropriate to the new duration; initialization listens to metadata once.

## Maintenance

The implementation is currently in `src/index.js`, styles in `src/style.less`, and public declarations
in `types/artplayer-plugin-chapter.d.ts`. Its migration contracts and known defects are recorded in
[the chapter contract](../../refactor/baselines/chapter-contract.md).

Run `yarn test:browser chapter.spec.js` for published/current plugin behavior on the published core.
Run `yarn typecheck` and `yarn test:baseline` for strict consumer checks, including optional factory
arguments and invalid data. `yarn build:ts` regenerates the online editor declarations.

## License

MIT © Harvey Zhao
