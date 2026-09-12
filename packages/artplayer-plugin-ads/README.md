# artplayer-plugin-ads

Ads plugin for ArtPlayer

Implementation, resource ownership and regression commands:
[maintenance guide](ARCHITECTURE.md).

## Usage and TypeScript

```ts
import Artplayer from 'artplayer'
import ads from 'artplayer-plugin-ads'

new Artplayer({
  container: '#player',
  url: '/content.mp4',
  plugins: [ads({ video: '/advertisement.mp4', url: '/details', playDuration: 5, totalDuration: 10 })],
})
```

Use `html` for HTML or an image element string. When both are present, `video` takes
precedence. `playDuration` controls when closing is allowed; `totalDuration` controls
the countdown. Durations are numeric seconds. Plugin `play()` and `pause()` control
only the countdown; `skip()` completes the advertisement once. All three return void.

For accurate options without historical declaration mistakes, import the same runtime
from `artplayer-plugin-ads/runtime`. Root and `/legacy` retain old input acceptance:
the old `totalDuration: string` declaration compiles but strings still fail runtime
validation; old workspace `source/type` fields are ignored. Use `video` or `html`.
An `i18n` object must supply `close`, `countdown`, `detail` and `canBeClosed` together.

CommonJS supports both `require('artplayer-plugin-ads')(options)` and
`require('artplayer-plugin-ads').default(options)`. ESM uses the default export.
## Migrating inferred option types

The maintainer approved correcting conflicting historical inference on 2026-09-12.
Existing option calls remain accepted, but `Parameters<typeof ads>[0].totalDuration`
now reads as `number | string | undefined`; historical workspace `source/type` are
optional. Code that assumed only one old declaration's field types may need adjustment.
This does not make string durations or source/type runtime aliases valid.

Prefer accurate options for new or migrated code:

```ts
import type { Option } from 'artplayer-plugin-ads'
import ads from 'artplayer-plugin-ads/runtime'

const option: Option = { video: '/advertisement.mp4', totalDuration: 10 }
const duration: number | undefined = option.totalDuration
const plugin = ads(option)
```

For a generic wrapper receiving historical input, narrow `totalDuration` before numeric
operations and check `source/type` before reading them as required fields. Do not use a
cast to hide string durations: the runtime validator rejects them. `LegacyOption` and
`WorkspaceOption` remain available for code explicitly representing those historical
declarations; `Option` describes the implemented configuration.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ads/index.js&example=ads)

## License

MIT © Harvey Zhao
