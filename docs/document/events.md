```js
art.on('ready', function (args) {
    console.log('The player can play');
});
```

## Instance

| Event                 | Description                             | Parameter               |
| --------------------- | --------------------------------------- | ----------------------- |
| `ready`               | When the video can be played            | `undefined`             |
| `play`                | When the video play                     | `undefined`             |
| `pause`               | When the video pause                    | `undefined`             |
| `seek`                | When the video seek                     | Video current time      |
| `volume`              | When the video volume change            | Video volume value      |
| `destroy`             | When the instance is destroyed          | `undefined`             |
| `focus`               | When the player gets focus              | `undefined`             |
| `blur`                | When the player loses focus             | `undefined`             |
| `hoverenter`          | When the mouse is moved into the player | `undefined`             |
| `hoverleave`          | When the mouse is moved out the player  | `undefined`             |
| `resize`              | When the player resize                  | Player size             |
| `mousemove`           | When the mouse moves over the player    | `undefined`             |
| `aspectRatioChange`   | When aspect ratio change                | Aspect ratio            |
| `aspectRatioRemove`   | When aspect ratio remove                | `undefined`             |
| `aspectRatioReset`    | When aspect ratio reset                 | `undefined`             |
| `customType`          | After triggering CustomType             | Type name               |
| `urlChange`           | After the video url change              | Video url               |
| `autoSizeChange`      | When the player auto size change        | Player size             |
| `autoSizeRemove`      | When the player auto size remove        | `undefined`             |
| `flipChange`          | When the player flip change             | Flip name               |
| `flipRemove`          | When the player flip remove             | `undefined`             |
| `fullscreenChange`    | When the full screen status change      | Whether full screen     |
| `fullscreenWebChange` | When entering web full screen           | Whether web full screen |
| `pipChange`           | When entering picture in picture        | Whether in pip          |
| `minChange`           | When entering min player                | Whether in min player   |
| `playbackRateChange`  | When playback rate change               | Playback rate           |
| `playbackRateRemove`  | When playback rate remove               | `undefined`             |
| `playbackRateReset`   | When playback rate reset                | `undefined`             |
| `screenshot`          | When a screenshot occurs                | Image data uri          |
| `switch`              | When switching video url                | Video url               |
| `loopAdd`             | When an interval loop is added          | Interval arrary         |
| `loopRemove`          | When the interval loop is deleted       | `undefined`             |
| `loopStart`           | When entering the interval cycle        | Interval arrary         |

## Video (Native event)

You can use all the native events of video directly: [MDN web docs - Media events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events).

But be careful to add the `video` prefix in front of the event:

```js
art.on('video:canplay', function (event) {
    console.log(event);
});
```

## Subtitle

| Event            | Description                   | Parameter             |
| ---------------- | ----------------------------- | --------------------- |
| `subtitleUpdate` | When the subtitles change     | Current subtitle text |
| `subtitleSwitch` | When switching subtitles      | Current subtitle url  |
| `subtitleLoad`   | When the subtitles loaded     | Current subtitle url  |
| `subtitleErr`    | When the subtitles load error | Error object          |
| `subtitleToggle` | When displaying subtitles     | Whether to show       |

## Notice

| Event          | Description            | Parameter       |
| -------------- | ---------------------- | --------------- |
| `noticeToggle` | When displaying notice | Whether to show |

## Mask

| Event        | Description          | Parameter       |
| ------------ | -------------------- | --------------- |
| `maskToggle` | When displaying mask | Whether to show |

## Loading

| Event           | Description             | Parameter       |
| --------------- | ----------------------- | --------------- |
| `loadingToggle` | When displaying loading | Whether to show |

## Layer

| Event         | Description             | Parameter           |
| ------------- | ----------------------- | ------------------- |
| `layerAdd`    | When adding a new layer | Layer configuration |
| `layerToggle` | When displaying layer   | Whether to show     |

## Info

| Event        | Description          | Parameter       |
| ------------ | -------------------- | --------------- |
| `infoToggle` | When displaying info | Whether to show |

## Hotkey

| Event    | Description                  | Parameter           |
| -------- | ---------------------------- | ------------------- |
| `hotkey` | When the hotkey is triggered | Hotkey event object |

## Setting

| Event           | Description               | Parameter             |
| --------------- | ------------------------- | --------------------- |
| `settingAdd`    | When adding a new setting | Setting configuration |
| `settingToggle` | When displaying setting   | Whether to show       |

## Contextmenu

| Event               | Description                   | Parameter                 |
| ------------------- | ----------------------------- | ------------------------- |
| `contextmenuAdd`    | When adding a new contextmenu | Contextmenu configuration |
| `contextmenuToggle` | When displaying contextmenu   | Whether to show           |

## Control

| Event           | Description               | Parameter             |
| --------------- | ------------------------- | --------------------- |
| `controlAdd`    | When adding a new control | Control configuration |
| `controlToggle` | When displaying control   | Whether to show       |

## Plugins

| Event       | Description              | Parameter            |
| ----------- | ------------------------ | -------------------- |
| `pluginAdd` | When adding a new plugin | Plugin configuration |
