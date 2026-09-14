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
Public TypeScript declarations for the second argument are still being reconciled in
PKG-VAST-04; these are JavaScript usage examples, not completed declaration acceptance.

## Maintenance

Implementation modules, lifecycle ownership, test commands and pending compatibility
decisions are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast)

## License

MIT © Harvey Zhao
