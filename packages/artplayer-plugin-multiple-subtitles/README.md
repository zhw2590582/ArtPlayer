# artplayer-plugin-multiple-subtitles

Multiple subtitles plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles)

## TypeScript

The root and `/legacy` type entries preserve historical parameter and return-type extraction.
Registration has always been asynchronous. For accurate Promise and selection-method types,
use the additive runtime entry, which loads the same implementation:

```ts
import multipleSubtitles from 'artplayer-plugin-multiple-subtitles/runtime'

const register = multipleSubtitles({
  subtitles: [{ url: '/subtitles/en.vtt', name: 'en' }],
})
// With an existing ArtPlayer instance:
const result = await register(art)
result.tracks(['en'])
result.reset()
```

The option object is required; `{}` means no tracks. `tracks()` clears the selection;
`reset()` restores all original tracks. Both methods return `void`. The existing `onParser`
field remains declared for compatibility but is not invoked by the implementation.
See [maintenance notes](ARCHITECTURE.md) for module responsibilities and validation commands.

## License

MIT © Harvey Zhao
