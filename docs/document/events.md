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

| Event             | Description                   | Parameter             |
| ----------------- | ----------------------------- | --------------------- |
| `subtitle:update` | When the subtitles change     | Current subtitle text |
| `subtitle:switch` | When switching subtitles      | Current subtitle url  |
| `subtitle:load`   | When the subtitles loaded     | Current subtitle url  |
| `subtitle:err`    | When the subtitles load error | Error object          |
| `subtitle:toggle` | When displaying subtitles     | Whether to show       |

## Notice

| Event           | Description            | Parameter       |
| --------------- | ---------------------- | --------------- |
| `notice:toggle` | When displaying notice | Whether to show |

## Mask

| Event         | Description          | Parameter       |
| ------------- | -------------------- | --------------- |
| `mask:toggle` | When displaying mask | Whether to show |

## Loading

| Event            | Description             | Parameter       |
| ---------------- | ----------------------- | --------------- |
| `loading:toggle` | When displaying loading | Whether to show |

## Layer

| Event          | Description             | Parameter           |
| -------------- | ----------------------- | ------------------- |
| `layer:add`    | When adding a new layer | Layer configuration |
| `layer:toggle` | When displaying layer   | Whether to show     |

## Info

| Event         | Description          | Parameter       |
| ------------- | -------------------- | --------------- |
| `info:toggle` | When displaying info | Whether to show |

## Hotkey

| Event    | Description                  | Parameter           |
| -------- | ---------------------------- | ------------------- |
| `hotkey` | When the hotkey is triggered | Hotkey event object |

## Setting

| Event            | Description               | Parameter             |
| ---------------- | ------------------------- | --------------------- |
| `setting:add`    | When adding a new setting | Setting configuration |
| `setting:toggle` | When displaying setting   | Whether to show       |

## Contextmenu

| Event                | Description                   | Parameter                 |
| -------------------- | ----------------------------- | ------------------------- |
| `contextmenu:add`    | When adding a new contextmenu | Contextmenu configuration |
| `contextmenu:toggle` | When displaying contextmenu   | Whether to show           |

## Control

| Event            | Description               | Parameter             |
| ---------------- | ------------------------- | --------------------- |
| `control:add`    | When adding a new control | Control configuration |
| `control:toggle` | When displaying control   | Whether to show       |

## Plugins

| Event        | Description              | Parameter            |
| ------------ | ------------------------ | -------------------- |
| `plugin:add` | When adding a new plugin | Plugin configuration |
