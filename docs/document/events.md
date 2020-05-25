## Video native event

You can use all the native events of video directly: [MDN web docs - Media events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events).

But be careful to add the `video` prefix in front of the event:

[Run Code](/Events.video)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:canplay', function (event) {
    console.info(event);
});

art.on('video:volumechange', function (event) {
    console.info(event);
});
```

## Player custom event

[Run Code](/Events.custom)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function (args) {
    console.info('The player can play');
});
```

| Event              | Description                          | Parameter                  |
| ------------------ | ------------------------------------ | -------------------------- |
| `ready`            | When the video can be played         | `undefined`                |
| `play`             | When the video play                  | `undefined`                |
| `pause`            | When the video pause                 | `undefined`                |
| `seek`             | When the video seek                  | Video current time         |
| `volume`           | When the video volume change         | Video volume value         |
| `destroy`          | When the player is destroyed         | `undefined`                |
| `focus`            | When the player gets focus           | `undefined`                |
| `blur`             | When the player loses focus          | `undefined`                |
| `hover`            | When the mouse is moved into or out  | Whether moved into         |
| `resize`           | When the player resize               | Player size                |
| `mousemove`        | When the mouse moves over the player | `undefined`                |
| `aspectRatio`      | When aspect ratio change             | Aspect ratio               |
| `url`              | When the video url change            | Video url                  |
| `autoSize`         | When the player auto size change     | Player size                |
| `flip`             | When the player flip change          | Flip name                  |
| `fullscreen`       | When the full screen change          | Whether full screen        |
| `fullscreenWeb`    | When the web full screen change      | Whether web full screen    |
| `fullscreenRotate` | When the rotate full screen change   | Whether rotate full screen |
| `pip`              | When the picture in picture change   | Whether in pip             |
| `mini`              | When the mini player change           | Whether in mini player      |
| `playbackRate`     | When playback rate change            | Playback rate              |
| `screenshot`       | When a screenshot                    | Image data uri             |
| `switch`           | When switching video url             | Video url                  |
| `loop`             | When the interval loop change        | Interval arrary            |
| `subtitleUpdate`   | When the subtitles change            | Current subtitle text      |
| `subtitleSwitch`   | When switching subtitles             | Current subtitle url       |
| `subtitleLoad`     | When the subtitles loaded            | Current subtitle url       |
| `subtitle`         | When displaying subtitles            | Whether to show            |
| `notice`           | When displaying notice               | Whether to show            |
| `mask`             | When displaying mask                 | Whether to show            |
| `loading`          | When displaying loading              | Whether to show            |
| `layer`            | When displaying layer                | Whether to show            |
| `info`             | When displaying info                 | Whether to show            |
| `setting`          | When displaying setting              | Whether to show            |
| `contextmenu`      | When displaying contextmenu          | Contextmenu configuration  |
| `control`          | When displaying control              | Control configuration      |
| `hotkey`           | When the hotkey is triggered         | Hotkey event object        |
