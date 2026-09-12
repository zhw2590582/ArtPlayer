# artplayer-plugin-ambilight

ambilight plugin for ArtPlayer

`start()` and `stop()` are synchronous. The plugin starts on the player's `ready`
event; `stop()` retains its last colors. Destroying the player removes the plugin's
grid and frame loop, and previously retained methods then do nothing. Canvas read
failures are skipped and retried, allowing a later readable source to recover.

Internal modules and compatibility tests are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight)

## License

MIT © Harvey Zhao
