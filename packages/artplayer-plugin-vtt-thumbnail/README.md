# artplayer-plugin-vtt-thumbnail

Vtt thumbnail plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail)

## TypeScript usage

The registration function is asynchronous. The optional runtime entry provides its accurate
Promise type and uses the same implementation as the default entry:

```ts
import Artplayer from 'artplayer'
import vttThumbnail from 'artplayer-plugin-vtt-thumbnail/runtime'

const art = new Artplayer({ container: '#player', url: '/video.mp4' })
const result = await vttThumbnail({ vtt: '/thumbnails/index.vtt' })(art)
console.log(result.name)
```

You can also pass `vttThumbnail({ vtt: '/thumbnails/index.vtt' })` in the player's `plugins`
array. Existing default and `/legacy` imports remain available. Their declarations preserve
the historical synchronous result type for compatibility, although registration has always
returned a Promise at runtime. Reading `result.name` requires awaiting registration; changing
to `/runtime` opts into that accurate type without changing runtime behavior. The option
object remains required, and its `vtt` and `style` fields remain optional.

See [ARCHITECTURE.md](ARCHITECTURE.md) for module ownership, testing commands and remaining
compatibility validation.

## License

MIT © Harvey Zhao
