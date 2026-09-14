# artplayer-plugin-vast

VAST plugin for ArtPlayer

## Initialization compatibility

Existing npm calls keep creating the SDK player before the callback:

```js
artplayerPluginVast(({ imaPlayer, playUrl }) => {
  imaPlayer.addEventListener('AdStarted', onAdStarted)
  playButton.onclick = () => playUrl(adTagUrl)
})
```

Code using the unpublished workspace 1.2 lazy initialization must select it explicitly:

```js
artplayerPluginVast((context) => {
  context.playerOptions.autoResize = false
  playButton.onclick = () => context.playUrl(adTagUrl)
}, { compatibility: 'workspace-1.2' })
```

The callback may be asynchronous. Core destruction releases the ad session and prevents
later requests or recreation. Explicit plugin `destroy()` allows a new ad session while
the core is alive. See the architecture guide for mode-specific fields and defaults.
## TypeScript

The root and `/legacy` declarations preserve npm 1.0.0's historical factory shape,
including its required callback, `any` SDK fields and inaccurate synchronous result.
Registration has always been asynchronous: await it even when using the old declarations.

Use `/runtime` for accurate SDK types, Promise results, optional callbacks and the
compatibility option. This entry uses the same JavaScript implementation:

```ts
import vast from 'artplayer-plugin-vast/runtime'

vast(({ imaPlayer }) => {
  // The default mode allocates this player before the callback.
  imaPlayer.addEventListener('AdStarted', onAdStarted)
})

vast((context) => {
  context.playerOptions.autoResize = false
  context.init()?.addEventListener('AdStarted', onAdStarted)
}, { compatibility: 'workspace-1.2' })
```

Code using unpublished workspace types should move its imports to `/runtime` as well.
`ArtplayerPluginVastOption` describes the workspace callback; `ArtplayerPluginVastInstance`
describes the awaited result with `destroy()`. A workspace resource getter can be null,
and `init()` returns null after core destruction. Default data fields retain the last
allocation after release; retaining their values does not keep that allocation alive.

CommonJS TypeScript without interop can use
`import vast = require('artplayer-plugin-vast/runtime')`. Both `vast` and `vast.default`
are typed there. The old root declaration intentionally keeps its original factory
type without adding a required `.default` member, so plain replacement functions and
historical `Parameters`/`ReturnType` extraction remain compatible.

## Maintenance

Implementation modules, lifecycle ownership, test commands and pending compatibility
decisions are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast)

## License

MIT © Harvey Zhao
