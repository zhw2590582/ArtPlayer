# Audio Track

[中文](../../plugin/audio-track.md)

Play a separate audio file in sync with a video. The plugin creates an `HTMLAudioElement` and follows the main video's playback, pause, position, volume and playback rate. It requires no additional SDK and does not add an audio-selection menu.

This page describes the current refactor branch. Its lifecycle fixes and precise `/runtime` types are not yet published; an unpinned npm or CDN installation does not select this branch.

## Installation

```sh
yarn add artplayer artplayer-plugin-audio-track
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAudioTrack from 'artplayer-plugin-audio-track';
```

For script tags, load ArtPlayer before the plugin's `dist/artplayer-plugin-audio-track.js`. The global is `artplayerPluginAudioTrack`. Pin dependency versions and supply an audio URL the browser can access and decode.

## Complete example

This is the same code as the [online audio example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-audio-track/index.js&example=audio.track). The demo site supplies the media files and `.artplayer-app` container; replace both when integrating it into your application.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-audio-track/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-audio-track
// import artplayerPluginAudioTrack from 'artplayer-plugin-audio-track';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/sprite-fight.mp4',
    plugins: [
        artplayerPluginAudioTrack({
            url: '/assets/sample/sprite-fight.aac',
            offset: 0, 
            sync: 0.3, 
        }),
    ],
});
```

## Options and synchronization

`artplayerPluginAudioTrack(option)` returns a plugin factory. The options object is required.

| Field | Type and default | Behavior |
| --- | --- | --- |
| `url` | Required `string` | Separate audio URL. An empty string at construction leaves the source unloaded. |
| `offset` | `number`, default `0` | Target audio time is video time plus this value, in seconds. A positive offset reads further ahead in the audio file. |
| `sync` | `number`, default `0.3` | Adjust audio time only when its absolute difference from the target is strictly greater than this threshold, in seconds. |

For example, video time 10 with offset 0.25 targets audio time 10.25. This corrects media-time drift; it is not a sample-accurate audio clock. Use finite, reasonable offsets and a nonnegative threshold. Negative targets or targets beyond the audio duration depend on browser media behavior; the plugin adds no delayed start, looping or silence padding.

Playback, completed seeking and playback recovery synchronize the track. Ordinary playing timeupdate events also correct drift. Buffering, source emptying, native pause, starting a seek and reaching the video's end pause the separate audio. It resumes when the main video is playing and ready to recover; canplay alone does not start audio for a paused video.

## Result and updates

After installation, access the result at `art.plugins.artplayerPluginAudioTrack`:

| Member | Behavior |
| --- | --- |
| `name` | Always `artplayerPluginAudioTrack`. |
| `audio` | The actual `HTMLAudioElement`; source updates preserve its identity. |
| `update(option)` | Synchronously updates selected fields and returns `undefined`, not a loading Promise. |

```js
const track = art.plugins.artplayerPluginAudioTrack;
track.update({ offset: 0.25, sync: 0.1 });
track.update({ url: '/audio/another-language.m4a' });
```

Changing offset or sync does not immediately force a seek; the next synchronization event uses the new values. Only a different, nonempty URL replaces the source. Reusing the same URL does not reload it, and an empty URL is not a stop or clear command. Replacing a source while the main video is playing attempts playback; observe the exposed audio element for actual loading, decoding and errors.

`art.switchUrl()` changes only the main video. Your application must keep video and audio sources paired and select the new audio with `track.update()`. Use native media events when you need to wait for readiness; `await track.update(...)` does not wait for loading.

## Volume, playback failure and destruction

The plugin does not remove the video's original sound. Use a video source without its own audio track if the separate track should provide the only sound. Player volume, mute and playback rate also apply to the separate audio. Setting `art.muted = true` mutes both; it cannot selectively mute only the main video.

Browser playback policies still apply. While the instance is active, a rejected `audio.play()` is reported through `console.warn`; it does not become a rejection from update. Successful main-video playback does not prove that the separate audio is audible. Applications can observe native playing/error events on the audio element.

Destroying ArtPlayer removes plugin subscriptions, pauses audio, removes its src attribute and releases media loading. A retained result still points to the same element, but later update calls no longer reload or play it. Your application remains responsible for listeners it adds to audio. There is no separate plugin destroy method to call.

## TypeScript

The root and `/legacy` entries preserve the old `Result.update(Option)` declaration, including its required URL, to retain parameter extraction and function-assignment behavior. Runtime updates already support partial options. Use `/runtime` for accurate partial-update types over the same implementation:

```ts
import Artplayer from 'artplayer';
import audioTrack from 'artplayer-plugin-audio-track/runtime';

const installTrack = audioTrack({ url: '/audio/dialogue.m4a' });
const art = new Artplayer({
    container: '.artplayer-app',
    url: '/video/silent.mp4',
    plugins: [(player) => {
        const track = installTrack(player);
        track.update({ offset: 0.25 });
        return track;
    }],
});
```

Named types include `Option`, `UpdateOption`, the old `Result`, `RuntimeResult` and `RuntimeFactory`. The online editor's default global retains legacy inference too. To select precise update typing, explicitly use `artplayerPluginAudioTrack as artplayerPluginAudioTrack.RuntimeFactory`. This does not create a second plugin implementation.

Actual desktop tests cover audio/video playback, pause, seeking, updates and destruction. They do not establish support for every mobile device, proxy player, audio format or long-running synchronization combination. Check browser decoding capabilities and the project's validation records for the applicable scope.

Windows WebKit MP4/AAC starvation remains an open native-media validation issue: a stalled video does not reliably emit waiting in that reproduction. Passing source-switch ordering checks does not close that separate case.
