# HLS Control

[中文说明](../../plugin/hls-control.md)

Add quality and audio-track menus to an Hls.js player. This plugin controls the Hls.js instance you provide at `art.hls`; it does not download, create or destroy the SDK.

This guide describes the current refactor branch. The automatic refresh and lifecycle fixes described here have not yet been published. An unversioned npm/CDN install still uses the published release.

## Installation

```sh
yarn add artplayer hls.js artplayer-plugin-hls-control
```

```js
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
```

For script tags, load ArtPlayer, Hls.js and the plugin's `dist/artplayer-plugin-hls-control.js` before running your setup. The plugin global is `artplayerPluginHlsControl`. Pin versions in your application and use media URLs that permit browser access.

## Complete example

The example uses the site's player container and the same source as the [online HLS example](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js%0A./uncompiled/artplayer-plugin-hls-control/index.js&example=hls.control). Replace the container and stream URL in your application.

<div className="run-code" data-libs="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js
./uncompiled/artplayer-plugin-hls-control/index.js"></div>

```js
// npm i hls.js
// npm i artplayer-plugin-hls-control

// import Hls from 'hls.js';
// import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';

const useHls = Hls.isSupported()
let hls

function destroyHls() {
  const previous = hls
  hls = undefined
  if (previous)
    previous.destroy()
}

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/index.m3u8',
  setting: true,
  plugins: useHls
    ? [
        artplayerPluginHlsControl({
          quality: {
            // Show quality choices in the controls
            control: true,
            // Show quality choices in settings
            setting: true,
            // Get the quality name from level
            getName: level => `${level.height}P`,
            // I18n
            title: 'Quality',
            auto: 'Auto',
          },
          audio: {
            // Show audios in control
            control: true,
            // Show audios in setting
            setting: true,
            // Get the audio name from track
            getName: track => track.name || track.lang || 'Audio',
            // I18n
            title: 'Audio',
            auto: 'Auto',
          },
        }),
      ]
    : [],
  customType: {
    m3u8: function playM3u8(video, url, art) {
      destroyHls()
      if (useHls) {
        hls = new Hls()
        art.hls = hls
        hls.loadSource(url)
        hls.attachMedia(video)
      }
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
      }
      else {
        art.notice.show = 'Unsupported playback format: m3u8'
      }
    },
  },
})

art.on('destroy', destroyHls)
```

Only install the control plugin when Hls.js is supported. If the browser instead plays HLS natively, the example assigns `video.src` without installing a plugin that requires `art.hls`. Native quality/audio selection is not supplied by this plugin. Keep `useHls` fixed for that player instance; recreate the player if the playback integration changes.

## Configuration

`artplayerPluginHlsControl(option?)` returns a synchronous plugin factory. Both `quality` and `audio` accept these fields:

| Field | Meaning and default |
| --- | --- |
| `control` | Show the bottom control; omitted means hidden. |
| `setting` | Show the settings entry; omitted means hidden. Enable the player's `setting: true` as well. |
| `title` | Menu title; quality defaults to `Quality`, audio to `Audio`. |
| `auto` | Fallback text, default `Auto`. Quality also uses it for its Auto option. Audio does not gain a synthetic Auto track. |
| `getName(item, index?)` | Return a string from the original SDK level or track. The current-label call omits `index`; list calls include it. |

Without a quality formatter, labels use `level.name` or `level.height + 'P'`. Audio labels use `track.name`, `track.lang`, then `track.language`. Empty titles/Auto text fall back to their defaults. Give formatters a string fallback when your source lacks metadata.

The formatter is a plain callback; it does not receive the player as `this`. Avoid using its optional index as a required field. Equal labels collapse into one displayed choice, so include bitrate or other distinguishing metadata when separate variants have the same height. Empty track lists remove their menus.

Choosing a quality writes `hls.currentLevel`; Auto writes `-1`. The selected label reflects automatic mode when `autoLevelEnabled` is true. Choosing audio writes `hls.audioTrack` with the SDK track ID. A menu selection is synchronous and does not mean the new stream has finished buffering or decoding.

## Refresh after external changes

The plugin updates on player `ready` and `restart`. When the SDK provides its event API, manifest, level, audio and destruction events also refresh or clear the menus. Current SDK state determines the selected choice.

After attaching a replacement instance to the same video and assigning `art.hls`, use the existing synchronous method when an immediate refresh is needed:

```js
art.plugins.artplayerPluginHlsControl.update();
```

`update()` returns `undefined`; it is not a Promise. Calling it without an attached Hls.js instance can throw. SDK-like integrations without supported event hooks must call it when their state changes. Reserve menu names `hls-quality` and `hls-audio` for this plugin.

## SDK ownership and source switching

Use the player's existing `switchUrl()` or `switchQuality()` for source changes and handle the returned Promise. The example's custom loader destroys the previous SDK before creating the next one, updates `art.hls`, and keeps one final cleanup listener per player. Each instance is destroyed once. Do not add a new player `destroy` listener on every load while also destroying replaced instances yourself.

The control plugin releases its own SDK subscriptions and makes retained menu callbacks inert after replacement or player destruction. It does not destroy the SDK, remove other consumers' SDK listeners, or implement Hls.js error recovery. Your application remains responsible for SDK fatal errors and playback policy.

## TypeScript

The default callback types include level height/name and audio id/name/language fields. Applications can specify their actual SDK metadata types through the existing generic factory. The example below uses only fields it needs and works without importing Hls.js declarations:

```ts
import hlsControl from 'artplayer-plugin-hls-control';

interface Level { height: number; bitrate: number }
interface Track { id: number; name: string; lang?: string }

const plugin = hlsControl<Level, Track>({
    quality: {
        control: true,
        getName: level => level.height + 'p / ' + level.bitrate,
    },
    audio: {
        setting: true,
        getName: track => track.name || track.lang || 'Audio',
    },
});
```

Public `Option`, `Config`, `QualityLevel`, `AudioTrack` and `Result` types are exported from the root entry. The root and legacy import paths remain available. The types do not pretend every ArtPlayer instance already owns an Hls.js engine; describe `art.hls` in your application's integration types.

## Validation scope

The refactor tests Hls.js 1.5.17 and 1.7.2 with local media and real workers; these are tested points, not a newly declared supported range. Firefox grouped-stream crashes and a separate switching stall remain under investigation. Windows Playwright WebKit lacks the MSE path used in those tests; it does not establish Safari/iOS native-HLS acceptance. Verify your actual streams and target devices before adopting the unpublished refactor.
