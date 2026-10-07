# artplayer-plugin-multiple-subtitles

Multiple subtitles plugin for ArtPlayer

## Security notice

This plugin renders subtitle file content as HTML (it wraps every cue in a
per-subtitle `<div class="art-subtitle-{name}">` and disables the player's
`subtitle.escape` default). Only feed it subtitles you trust: content from a
user-contributed or otherwise untrusted source would execute as HTML inside
your page.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles)

## License

MIT © Harvey Zhao
