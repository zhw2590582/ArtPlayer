# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.3.0] - 2025-09-06

- Rename `.esm.js` to `.mjs`
- Remove the default `fill` color value of `svg`
- Optimize the `autoOrientation` logic
- Add `Artplayer.REMOVE_SRC_WHEN_DESTROY`
- Add `artplayer-plugin-document-pip` plugin
- Add `art.events.bindGlobalEvents` method for rebinding global methods
- Optimize `artplayer.d.ts`, now you can directly import `Option`

```ts
import type { Option } from 'artplayer'

const option: Option = {
  container: '.artplayer-app',
  url: './assets/sample/video.mp4',
}
```

- Simplify `i18n` import

```ts
import fr from 'artplayer/i18n/fr'
import id from 'artplayer/i18n/id'

const option = {
  container: '.artplayer-app',
  url: './assets/sample/video.mp4',
  i18n: { id, fr },
  lang: 'fr',
}
```

## [5.2.5] - 2025-08-01

- Add `ESM` version for all packages, such as `artplayer/dist/artplayer.esm.js`
- Recognize `globalThis.CUSTOM_USER_AGENT` global variable for customizing `navigator.userAgent`
- Fix missing `mount` parameter when initializing `artplayer-plugin-danmuku`

## [5.2.3] - 2025-04-20

- Add Vietnamese `vi`
- Clear the `video.src` property on destroy
- Add `onClick` option for `Setting`
- Fix style loading failure of danmuku and chapter plugins when the page has no head tag
- Add `gesture` option to enable or disable gesture events on mobile `video` element

## [5.2.2] - 2025-01-19

- Fix thumbnail crossover issue
- Fix style loading failure when the page has no head tag
- Add slider support in subtitle plugin settings panel for mobile dragging
- Fix positioning error of settings panel when rotating screen
- Fix classname switching error when fullscreen state changes

## [5.2.1] - 2024-10-26

- Refactor `Setting` component, fix state loss issue
- For `Setting` of type `range`, callback now returns an array of numbers instead of a single number
- Remove `isStringOrNumber` utility function
- Fix inconsistent state issue in `artplayer-plugin-hls-control`
- Deprecate `artplayer-plugin-dash-quality` plugin
- Add new `artplayer-plugin-dash-control` plugin
- Use `code` instead of deprecated `keyCode` for keyboard events
- Add `keydown` event to listen for `keydown` from `document`

## [5.2.0] - 2024-10-19

- Add `option.proxy` for proxying third-party `video` and `canvas`
- Add `artplayer-proxy-canvas` proxy, enabling video playback via `canvas`
- Add `option.thumbnails.scale` for preview image scaling
- Fix bug where changing `art.url` didn’t trigger `autoPlayback`: [#797](https://github.com/zhw2590582/ArtPlayer/issues/797)
- Add `art.subtitle.cues` property for retrieving all subtitle list
- Add `art.subtitle.activeCues` property for retrieving active subtitles
- Add `subtitleBeforeUpdate` event triggered before subtitle element rendering
- Change `subtitleUpdate` event to `subtitleAfterUpdate`, triggered after subtitle element rendering
- Optimize trigger timing and callback parameters of `subtitleLoad` event
- Remove `subtitleSwitch` event; use `subtitleLoad` instead
- Upgrade `artplayer-plugin-hls-quality` to `artplayer-plugin-hls-control`
- Add `artplayer-plugin-ambilight` plugin
- Fix `thumbnails` display bug

## [5.1.7] - 2024-08-15

- Add `Artplayer.STYLE` property to return player style text
- `art.screenshot('your-name')` now supports custom file names
- When `Artplayer.CONTEXTMENU` is `false`, default context menu is no longer hidden
- Add `art.thumbnails` property for dynamically setting `thumbnails`

## [5.1.6] - 2024-06-15

- Optimize `setBar` event
- Add `artplayerPluginChapter` plugin
- Add `art.plugins.artplayerPluginDanmuku.load(target)` parameter for appending danmuku library
- Add `width` option to danmuku plugin; when player width is smaller than this, danmuku sender is placed at the bottom
- Fix `artplayerPluginVttThumbnail` not displaying on mobile
- Fix danmuku plugin style and percentage font-size bug
- `thumbnails` are now visible on mobile too
- Restore `screen.orientation.lock` functionality

## [5.1.5] - 2024-06-01

- Refactor `artplayerPluginDanmuku` plugin
- Add `artplayerPluginChromecast` plugin
- Add `fullscreenError` event
- Optimize double-click event: [#728](https://github.com/zhw2590582/ArtPlayer/pull/728)
- Fix delayed display of `thumbnails`
- Add `art.plugins.lock.state = true/false` for manually controlling `lock` state
- Control bar no longer auto-hides when mouse is on it or when settings panel is open
- Remove `screen.orientation.lock` due to compatibility issues
- Fix `fullscreen` bug on mobile

## [5.1.1] - 2024-01-11

- Plugin functions now support both synchronous and asynchronous returns

## [5.1.0] - 2023-12-23

- Plugin functions now support async return
- Player will no longer be destroyed after reaching error limit for playback address
- Split language files, core no longer bundles multiple languages [Language Settings](https://artplayer.org/document/start/i18n.html)
- Updating components now supports updating only specified fields [pull/549](https://github.com/zhw2590582/ArtPlayer/pull/549)
- Add `muted` event triggered when mute state changes
- Add `Artplayer.LOG_VERSION` global config to control whether to print player version (default `true`)
- Add `Artplayer.USE_RAF` global config to control whether to use `requestAnimationFrame` (default `false`), currently for smooth progress bar effect
- Remove default styles `margin:0;padding:0;` to avoid conflicts with third-party libraries
- Subtitle line changed from `p` to `div` tag, with classname `art-subtitle-line`
- On mobile, tapping video toggles control bar display
- Remove `art.loop` interval playback feature (not commonly used)
- Subtitle track now has `label` attribute to display subtitle names on mobile
- Add utility functions `unescape`, `isBrowser`, `setStyleText`
- Add `artplayerPluginMultipleSubtitles` plugin for merged subtitle files: [demo](https://www.artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles)
- Modify mini progress bar display

## [5.0.9] - 2023-05-14

- Fix `art.autoOrientation` style bug
- Remove animation effect of player container

## [5.0.8] - 2023-05-13

- Fix conflict of `art.mini`
- Fix animation bug of `art.aspectRatio`

## [5.0.7] - 2023-05-13

- Switching via `switchUrl` or `switchQuality` preserves existing adjustments such as `aspectRatio`, `playbackRate`, `flip`, `autoSize`
- Remove the second `name` parameter from `switchUrl` and `switchQuality`
- Add `isIOS13` utility to fix inaccurate `isMobile` detection on iOS 13+
- `art.autoSize` and `art.autoHeight` are now methods: `art.autoSize()` and `art.autoHeight()`
- Add new property `art.quality` for dynamically updating quality list
- Fix incorrect `art.aspectRatio` property
- Add `art.switch` setter property, same as `art.switchUrl` method

## [5.0.6] - 2023-05-03

- Fix style bug of settings panel

## [5.0.5] - 2023-05-03

- Add `heatmap` option to danmuku plugin for enabling heatmap (default: off)
- Fix English subtitle line break style bug
- Fix settings panel style bug
- Remove unnecessary global properties
- Remove `title` option (not useful now)
- Remove `whitelist` option (not useful now)

## [5.0.4] - 2023-04-27

- Fix controller dropdown list style bug

## [5.0.3] - 2023-04-26

- Fix `event.pageY` value error in volume controller
- Update build config, `artplayer.legacy.js` now compatible with IE 11

## [5.0.2] - 2023-04-24

- Fix style compatibility issue of control bar position

## [5.0.1] - 2023-04-24

- Fix web fullscreen style bug
- Fix built-in settings text error

## [5.0.0] - 2023-04-23

- Rewrite volume controller
- Fix incorrect progress drag angle on mobile
- Rewrite `mini` mode, now video detaches from original container
- All components (layers, controller, contextmenu, settings panel) support dynamic deletion and updating
- Subtitle option adds `onVttLoad` for modifying vtt text before output
- Rewrite all styles, add many `css` variables
- Add `cssVar` option for initializing `css` variables
- Add `cssVar` method for getting/setting `css` variables
- `artplayer-plugin-hls-quality` adds `getResolution` function option for getting resolution text from level
- Add `artplayer-plugin-dash-quality` plugin for adding Dash quality list to player
- Fix `lock` and `loop` event issues
- Add Russian `ru` and Indonesian `id` languages
- Update `artplayer-plugin-control` for `artplayer@5.0.0`
- Update `artplayer-plugin-dash-quality` for `artplayer@5.0.0`
- Update `artplayer-plugin-hls-quality` for `artplayer@5.0.0`
- Update `artplayer-plugin-danmuku` for `artplayer@5.0.0`

## [4.6.2] - 2023-01-26

- Default `Artplayer.PROGRESS_HEIGHT` changed to `6`
- Add `artplayer-plugin-vtt-thumbnail` to generate video preview images from vtt subtitle files
- Add `Artplayer.FULLSCREEN_WEB_IN_BODY` for whether to mount player to `document.body` in web fullscreen (default `false`)
- Change subtitle offset adjustment to slider
- Subtitle option adds `escape` (default `true`) for HTML escaping

## [4.6.1] - 2023-01-11

- Write brand new docs
- Optimize `d.ts`
- Remove redundant events
- Optimize some styles
- Add `i18n` option

## [4.6.0] - 2022-12-31

- Optimize style effects of control bar icons
- Optimize style effects of settings panel
- Fix incorrect `art.fullscreen` state detection
- Add `artplayer-plugin-control` plugin to change control bar style

## [4.5.12] - 2022-11-20

- Fix `art.loop = []` display bug

## [4.5.11] - 2022-11-06

- Add `Artplayer.CONTEXTMENU` for controlling whether to show contextmenu (default `true`)
- Whitelist function default `true` on mobile, all devices use player UI

## [4.5.10] - 2022-11-05

- Fix subtitle not showing in Firefox: [#pull/415](https://github.com/zhw2590582/ArtPlayer/pull/415)
- Info popup supports clicking to select video property text

## [4.5.9] - 2022-11-05

- Add `art.type` property to get/set video type
- Add `art.video` property to get video element
- Add `artplayer-plugin-iframe` plugin to control player inside iframe
- Add `artplayer-plugin-hls-quality` plugin for adding Hls quality list
- Add `Artplayer.PLAYBACK_RATE` for default playback rates `[0.5, 0.75, 1, 1.25, 1.5, 2]`
- Add `Artplayer.ASPECT_RATIO` for default ratios `['default','4:3','16:9']`
- Add `Artplayer.FLIP` for default flip options `['normal','horizontal','vertical']`
- Add `Artplayer.PROGRESS_HEIGHT` (default: `4`)
- Add `legacy.js` version for older browsers (larger size)
- Remove `examples` dir, no longer provide Vue/React examples

## [4.5.8] - 2022-10-09

- Add Farsi language
- Add `Artplayer.DEBUG` (default `false`) for debug logs
- Add `art.setting.update()` for dynamic settings update
- Optimize `artplayer.d.ts`

## [4.5.7] - 2022-09-28

- Add `Artplayer.VOLUME_STEP` for controlling volume step (default `0.1`)
- Add `Artplayer.SEEK_STEP` for controlling seek step (default `5s`)
- Fix some svg icons not showing on mobile
- Fix desktop progress bar cannot click+drag simultaneously
- Fix mobile progress bar cannot click+drag
- Add `art.isRotate` property for detecting auto fullscreen rotation
- Settings panel `range` adds `onChange` option for real-time values

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Slider',
            tooltip: '5x',
            range: [5, 1, 10, 0.1],
            onChange: function (item) {
                return item.range + 'x';
            },
        },
    ],
});
```

## [4.5.6] - 2022-09-19

- Fix hls.js not working in Safari

## [4.5.5] - 2022-09-19

- Ad plugin adds `option.muted` for autoplay muted ads
- Danmuku plugin exposes `art.plugins.artplayerPluginDanmuku.reset()` to clear display
- Danmuku plugin exposes `art.plugins.artplayerPluginDanmuku.option` for current config
- Fix subtitle bug in iOS fullscreen
- Add Spanish `es`

## [4.5.4] - 2022-08-01

### Added

- Add `Artplayer.AUTO_PLAYBACK_MIN` for min playback memory value (default `5s`)
- Add `Artplayer.TOUCH_MOVE_RATIO` for mobile progress drag ratio (default `0.5`)
- `option.thumbnails` adds optional `width`/`height`
- Add `option.id` for unique playback memory identifier

## [4.5.3] - 2022-07-13

### Added

- `url` option allows empty string for async `art.url`

```js
const art = new Artplayer({
    url: '',
    container: '.artplayer-app',
});

setTimeout(() => {
    art.url = '/assets/sample/video.mp4';
}, 1000);
```

- `art.play()` always returns Promise; `play` event is async

```js
const art = new Artplayer({
    url: '/assets/sample/video.mp4',
    container: '.artplayer-app',
});

art.on('ready', async () => {
    try {
        await art.play();
        console.log('Play success');
    } catch (error) {
        console.log('Play failed', error.message);
    }
});
```

- Add `airplay` (only Safari)

```js
const art = new Artplayer({
    url: '/assets/sample/video.mp4',
    container: '.artplayer-app',
    airplay: true,
});
```

## [4.5.2] - 2022-06-22

- Optimize auto-playback to allow user choice

## [4.5.0] - 2022-06-21

- Remove built-in ads
- Add ad plugin

## [4.4.7] - 2022-06-13

- Support danmuku lib d.ts
- Update deps

## [4.4.6] - 2022-06-11

- Add danmuku lib d.ts
- Adjust subtitle font-size param
- Optimize regex parsing of xml danmuku

## [4.4.5] - 2022-06-02

- Fix theme color missing in mini mode

## [4.4.3] - 2022-05-26

- Fix custom mounted input residual on danmuku destroy
- Fix mini mode size calculation error

## [4.4.2] - 2022-05-20

- Remove UI init `video:loadedmetadata` event
- Danmuku exposes `load` for switching sources
- Add error icon after video load error limit
- Fix multiple init of setting panel bug

## [4.4.1] - 2022-05-17

- Add `art.isInput`, when true control bar won’t auto-hide (e.g. typing danmuku)
- Add `art.isLock`, when true on mobile prevents seek/play/pause
- Fix fixed width bug of danmuku input box
- Settings panel supports `range` and `onRange`
- Add `isAndroid` and `isIOS` utils
- Danmuku adds `lockTime`, `maxLength`, `minWidth`, `maxWidth`, `mount`, `beforeEmit`, `theme`

## [4.4.0] - 2022-05-15

- Settings panel supports `switch` and `onSwitch`
- Danmuku plugin adds settings panel and send
- Danmuku adds default mode and font-size
- Danmuku font-size supports percentage of player
- Fix flip icon missing
- Player with focus won’t auto-hide control bar
- Remove subtitle toggle button (manual config required)
