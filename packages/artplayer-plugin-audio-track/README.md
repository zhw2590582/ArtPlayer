# artplayer-plugin-audio-track

audio-track plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-audio-track/index.js&example=audio.track)

## TypeScript

The default import and `/legacy` preserve existing TypeScript behavior, including the
historical required `url` in the `update` parameter type. JavaScript still supports updating
only selected fields. Use `/runtime` for precise partial-update types; it loads the same
implementation and adds no runtime dependency:

```ts
import Artplayer from 'artplayer'
import audioTrack from 'artplayer-plugin-audio-track/runtime'

const installTrack = audioTrack({ url: '/assets/sample/sprite-fight.aac' })
const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/sprite-fight.mp4',
  plugins: [(art) => {
    const track = installTrack(art)
    track.update({ offset: 0.25 })
    return track
  }],
})
```

Named types include `Option`, `UpdateOption`, `Result` (legacy), `RuntimeResult`, and
`RuntimeFactory`. `update` returns `void`; `audio` remains the same `HTMLAudioElement`.
For global scripts in the online editor, explicitly opt into the same precise typing with
`artplayerPluginAudioTrack as artplayerPluginAudioTrack.RuntimeFactory`.

The plugin follows the main video's playback, volume and rate, but does not automatically
mute the main video. Destroying ArtPlayer releases the plugin's audio and subscriptions;
retained plugin updates become inert. See [ARCHITECTURE.md](ARCHITECTURE.md) for module
ownership, compatibility decisions and regression commands.

## License

MIT © Harvey Zhao
