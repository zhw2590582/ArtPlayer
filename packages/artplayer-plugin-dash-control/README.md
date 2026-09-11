# artplayer-plugin-dash-control

Dash control plugin for ArtPlayer

Accepts a caller-owned dash.js instance at `art.dash`. Quality selection adapts to the
dash.js 4.x quality methods or 5.x representation methods. Version 5 selection uses
representation IDs so bitrate filtering does not change the selected quality.

## TypeScript

The formatter receives the original SDK object. For dash.js 5.2.1 types:

```ts
import type { MediaInfo, Representation } from 'dashjs'
import dashControl from 'artplayer-plugin-dash-control'

dashControl<Representation, MediaInfo>({
  quality: { getName: level => `${level.height}p` },
  audio: { getName: track => track.lang || String(track.id) },
})
```

dash.js 4.5.2 uses `BitrateInfo` for quality instead of `Representation`. Audio
metadata `id`, `index`, and `lang` may be null; custom formatters must return strings.
The original object-based formatters and synchronous `update()` remain supported.
Actual 5.2.1 SDK types resolve with TypeScript 5.9.3 NodeNext/Bundler in our matrix;
Node10 resolution and TypeScript 4.3.5 have upstream SDK declaration limitations.
See the [tested type matrix](../../refactor/changes/2026-09-12-PKG-DASH-05-sdk-types.md).

## Demo

[https://artplayer.org](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/5.2.1/modern/umd/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-control/index.js&example=dash.control)

## License

MIT © Harvey Zhao

## Maintenance

See [ARCHITECTURE.md](ARCHITECTURE.md) for module ownership, compatibility rules,
test commands and the remaining real SDK playback validation scope.
