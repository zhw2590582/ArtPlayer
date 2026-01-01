# artplayer-proxy-mediabunny

MediaBunny proxy for ArtPlayer - A high-performance video playback solution using WebCodecs and Canvas.

## Features

- 🚀 Hardware-accelerated video decoding via WebCodecs API
- 🎨 Canvas-based rendering for maximum flexibility
- 🎵 Web Audio API for audio playback
- 🔄 Precise audio-video synchronization
- 📦 Support for multiple media formats
- ⚡ Optimized for modern browsers

## Installation

```bash
npm install artplayer-proxy-mediabunny
```

## Usage

```js
import Artplayer from 'artplayer'
import artplayerProxyMediabunny from 'artplayer-proxy-mediabunny'

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'path/to/video.mp4',
  customType: {
    mediabunny: artplayerProxyMediabunny({
      // Options
      loadTimeout: 12000,
      timeupdateInterval: 250,
      avSyncTolerance: 0.12,
      dropLateFrames: false,
      poster: 'path/to/poster.jpg',
    }),
  },
  type: 'mediabunny',
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `loadTimeout` | `number` | `0` | Timeout for loading media (ms) |
| `timeupdateInterval` | `number` | `250` | Interval for timeupdate events (ms) |
| `avSyncTolerance` | `number` | `0.12` | Audio-video sync tolerance (seconds) |
| `dropLateFrames` | `boolean` | `false` | Drop late video frames |
| `poster` | `string` | `''` | Poster image URL |
| `source` | `string\|Blob\|ReadableStream` | - | Media source |
| `preflightRange` | `boolean` | `false` | Check range support before loading |
| `volume` | `number` | `0.7` | Initial volume (0-1) |
| `muted` | `boolean` | `false` | Initial muted state |

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-mediabunny/index.js&example=mediabunny)

## Browser Support

Requires browsers with WebCodecs API support:
- Chrome 94+
- Edge 94+
- Opera 80+

## License

MIT © Harvey Zack
