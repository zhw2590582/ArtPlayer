# artplayer-plugin-dash-control

Dash control plugin for ArtPlayer

Accepts a caller-owned dash.js instance at `art.dash`. Quality selection adapts to the
dash.js 4.x quality methods or 5.x representation methods. Version 5 selection uses
representation IDs so bitrate filtering does not change the selected quality.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/5.2.1/modern/umd/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-control/index.js&example=dash.control)

## License

MIT © Harvey Zhao

## Maintenance

See [ARCHITECTURE.md](ARCHITECTURE.md) for module ownership, compatibility rules,
test commands and the remaining real SDK playback validation scope.
