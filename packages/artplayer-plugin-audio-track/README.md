# artplayer-plugin-audio-track

audio-track plugin for ArtPlayer

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-audio-track/index.js&example=audio.track)

The refactor branch includes complete [Chinese](../artplayer-vitepress/docs/plugin/audio-track.md)
and [English](../artplayer-vitepress/docs/en/plugin/audio-track.md) guides. They cover
time offsets, synchronous partial updates, shared mute/volume, source ownership
and the legacy/runtime type split. Their runnable example matches the demo above.

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

Installed declaration regression: run
`yarn test:package --include=artplayer-plugin-audio-track` from the repository root.
This builds and installs tarballs outside the repository, then checks root,
legacy and `/runtime` calls from `test/types/audio-track.ts` in five compiler
modes, including every invalid call. See
[consumer maintenance](../../scripts/consumers/README.md); media synchronization
and browser validation remain separate.

## License

MIT © Harvey Zhao
