# DASH Control

[中文说明](../../plugin/dash-control.md)

Add video quality and audio-track menus to a dash.js player. You create and attach the SDK instance at `art.dash`; the plugin controls that instance and releases its own menus and listeners.

This guide describes the current refactor branch. Its SDK adaptation, automatic refresh and lifecycle fixes have not yet been published. An unversioned npm/CDN install still uses the published release.

## Installation

```sh
yarn add artplayer dashjs artplayer-plugin-dash-control
```

```js
import Artplayer from 'artplayer';
import dashjs from 'dashjs';
import artplayerPluginDashControl from 'artplayer-plugin-dash-control';
```

For script tags, load ArtPlayer, dash.js and `dist/artplayer-plugin-dash-control.js` before setup. The plugin global is `artplayerPluginDashControl`. Pin your dependency versions and use a browser-accessible MPD and segments.

## Complete example

The example matches the [online DASH example](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/5.2.1/modern/umd/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-control/index.js&example=dash.control). Replace the site's container and media URL in your application.

<div className="run-code" data-libs="https://cdnjs.cloudflare.com/ajax/libs/dashjs/5.2.1/modern/umd/dash.all.min.js
./uncompiled/artplayer-plugin-dash-control/index.js"></div>

```js
// npm i dashjs
// npm i artplayer-plugin-dash-control

// import dashjs from 'dashjs';
// import artplayerPluginDashControl from 'artplayer-plugin-dash-control';

const useDash = dashjs.supportsMediaSource()
let dash

function destroyDash() {
  const previous = dash
  dash = undefined
  if (previous)
    previous.destroy()
}

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd',
  setting: true,
  plugins: useDash
    ? [
        artplayerPluginDashControl({
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
            getName: track => track.lang?.toUpperCase() || String(track.id ?? 'Audio'),
            // I18n
            title: 'Audio',
            auto: 'Auto',
          },
        }),
      ]
    : [],
  customType: {
    mpd: function playMpd(video, url, art) {
      destroyDash()
      if (useDash) {
        dash = dashjs.MediaPlayer().create()
        art.dash = dash
        dash.initialize(video, url, art.option.autoplay)
      }
      else {
        art.notice.show = 'Unsupported playback format: mpd'
      }
    },
  },
})

art.on('destroy', destroyDash)
```

The example chooses its SDK capability path once per player. If dash.js cannot use MediaSource, it displays the existing unsupported-format notice without creating an SDK or installing its controls. This example does not provide a native DASH fallback.

## Configuration

`artplayerPluginDashControl(option?)` synchronously returns a plugin factory. Both `quality` and `audio` accept:

| Field | Meaning and default |
| --- | --- |
| `control` | Display a bottom control; omitted means hidden. |
| `setting` | Display a settings entry; omitted means hidden. Also enable the player's `setting: true`. |
| `title` | Menu title, default `Quality` or `Audio`. |
| `auto` | Fallback text, default `Auto`; quality also uses it for its automatic selection row. It does not create a synthetic audio track. |
| `getName(item)` | Return a string from the original SDK level or track. It receives one argument, with no player receiver or index. |

The default quality label is `level.height + 'p'`. Default audio labels use `track.lang` or `track.id`; metadata may be missing or null. A custom formatter should return a string fallback, as the complete example does. Empty title/Auto text uses the default.

Equal text labels collapse into one displayed choice. Include bitrate or other metadata when several variants have the same height and should remain separate choices. A selected duplicate keeps the actual selected SDK key or track object. Empty track lists remove their menus.

## Quality and audio selection

Manual quality selection disables video Auto switching, then selects the SDK quality. Auto enables video Auto switching without overwriting unrelated ABR settings. A synchronous menu selection does not mean buffering or decoding has completed.

The plugin detects the SDK's available method family:

| SDK interface | Quality list and selection |
| --- | --- |
| dash.js 4 style | `getBitrateInfoListFor('video')`, `getQualityFor('video')`, `setQualityFor('video', qualityIndex)` |
| dash.js 5 style | `getRepresentationsByType('video')`, `getCurrentRepresentationForType('video')`, `setRepresentationForTypeById('video', id)` |

For the representation interface, selection uses the representation ID, including numeric zero. Do not substitute the index of a filtered array. You do not need to configure a version switch in the plugin.

Audio selection calls `setCurrentTrack()` with the original SDK track object. It matches the current track by object identity or an unambiguous combination of available id/index/lang fields. There is no extra Auto audio row.

## Refresh after external changes

Player `ready`/`restart` and SDK quality, track and stream events refresh menus. SDK event refreshes are coalesced after the current synchronous selection. Unchanged playback-time events do not redraw menus; they can detect an external Auto-setting change.

When changing SDK configuration while paused without a subsequent SDK event, refresh explicitly:

```js
art.plugins.artplayerPluginDashControl.update();
```

`update()` is synchronous and returns `undefined`. It requires `art.dash` to be attached to the player's video and can throw if that contract is not met. Assigning a different `art.dash` alone does not subscribe to it immediately; call `update()` or use the normal ready/restart flow after attachment.

Automatic refresh preserves an open, plugin-owned quality or audio settings panel. Explicit `update()` keeps its existing rebuild behavior. Reserve `dash-quality` and `dash-audio` for the plugin's menu names.

If an asynchronous SDK getter or formatter fails, the plugin warns, stops that observation and clears its menus. Fix the formatter/SDK state and call `update()` to recover. Explicit update and synchronous selection errors keep their normal throwing behavior.

## SDK ownership and source switching

Use the existing player `switchUrl()` or `switchQuality()` and handle its Promise. The complete example destroys the replaced SDK, assigns the new instance before initialization, and keeps one final player cleanup listener. It does not accumulate a new destroy listener on every load or destroy replaced engines again at the end.

The plugin does not own your SDK: it never calls `dash.destroy()`, changes the manifest URL or removes listeners belonging to other consumers. Retained callbacks from old menus become inactive after replacement or player destruction. Your application remains responsible for DRM, SDK errors, autoplay decisions and any asynchronous SDK shutdown policy its integration requires.

## TypeScript

Default callback types include quality height/width/ID/bitrate and nullable audio id/index/lang. Use the generic factory for more specific metadata. This example declares only the fields it uses and does not require importing SDK declarations:

```ts
import dashControl from 'artplayer-plugin-dash-control';

interface Level { height: number; bitrateInKbit?: number }
interface Track { id?: string | number | null; lang?: string | null }

const plugin = dashControl<Level, Track>({
    quality: {
        control: true,
        getName: level => level.height + 'p',
    },
    audio: {
        setting: true,
        getName: track => track.lang?.toUpperCase() || String(track.id ?? 'Audio'),
    },
});
```

`Option`, `Config`, `QualityLevel`, `AudioTrack` and `Result` are exported from the root. Root and legacy paths remain available. If using actual SDK declarations, dash.js 4.5.2 exposes `BitrateInfo` for quality; 5.2.1 uses `Representation`. Its declarations have different compiler/module-resolution requirements, so test your actual SDK and TypeScript combination. Describe the externally attached `art.dash` in your application's integration types.

## Validation scope

The refactor tests fixed dash.js 4.5.2 and 5.2.1 with local adaptive media and old/new core combinations. Those are tested points, not a new blanket support range. The plugin includes a targeted 4.5.2 paused-seek recovery for stale empty-buffer metrics while preserving the caller's SDK settings and media time. Windows Playwright WebKit lacks the MSE path used by these tests; it is not Safari/device playback acceptance. Test your own MPDs, DRM and target devices before adopting the unpublished refactor.
