# artplayer-plugin-asr

Audio capture and subtitle display plugin for ArtPlayer. Supplies PCM/WAV chunks
to a caller-provided recognition service.

`stop()` stops recognition and returns a Promise. It permits later playback to
restart capture; the player's direct Web Audio connection remains alive until
the player is destroyed so that stopping recognition does not silence playback.
Call `art.destroy()` when disposing the player.

## Maintenance

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current audio flow, public behavior,
known migration gaps and test commands.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-asr/index.js&example=asr)

## License

MIT © Harvey Zhao
