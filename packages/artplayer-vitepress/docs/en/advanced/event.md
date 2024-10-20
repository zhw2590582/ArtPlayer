# Example Events

Player events are divided into two types, one is the video's `native events` (prefix `video:`), the other is `custom events`

Listening to events:

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:canplay', () => {
    console.info('video:canplay');
});
```

Listen to an event only once:

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.once('video:canplay', () => {
    console.info('video:canplay');
});
```

Manually trigger an event:

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.emit('focus');
```

Remove an event:

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

const onReady = () => {
    console.info('ready');
    art.off('ready', onReady);
}

art.on('ready', onReady);
```

:::warning For a full list of events, please refer to the following address:

[artplayer/types/events.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/events.d.ts)

:::
## `ready`

Triggered when the player is able to play for the first time

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info('ready');
});
```

## `restart`

Triggered when the player switches the address and is able to play

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.url = '/assets/sample/video.mp4'
});

art.on('restart', (url) => {
    console.info('restart', url);
});
```
## `pause`

Triggered when the player is paused

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('pause', () => {
    console.info('pause');
});
```

## `play`

Triggered when the player starts playing

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('play', () => {
    console.info('play');
});
```

## `hotkey`

Triggered when a hotkey on the player is pressed

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('hotkey', (event) => {
    console.info('hotkey', event);
});
```

## `destroy`

Triggered when the player is destroyed

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.destroy();
});

art.on('destroy', () => {
    console.info('destroy');
});
```

## `focus`

Triggered when the player gains focus

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('focus', (event) => {
    console.info('focus', event);
});
```

## `blur`

Triggered when the player loses focus

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('blur', (event) => {
    console.info('blur', event);
});
```

## `dblclick`

Triggered when the player is double-clicked

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('dblclick', (event) => {
    console.info('dblclick', event);
});
```
## `click`

Triggered when the player is clicked

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('click', (event) => {
    console.info('click', event);
});
```

## `error`

Triggered when an error occurs while the player is loading the video

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/404.mp4',
});

art.on('error', (error, reconnectTime) => {
    console.info(error, reconnectTime);
});
```
## `hover`

Triggered when the player is hovered or unhovered by the mouse

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('hover', (state, event) => {
    console.info('hover', state, event);
});
```

## `mousemove`

Triggered when the mouse moves over the player

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('mousemove', (event) => {
    console.info('mousemove', event);
});
```
## `resize`

Triggered when the player size changes

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('resize', () => {
    console.info('resize');
});
```

## `view`

Triggered when the player appears in the viewport

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('view', (state) => {
    console.info('view', state);
});
```

## `lock`

On mobile, triggered when the locked state changes

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});

art.on('lock', (state) => {
    console.info('lock', state);
});
```

## `aspectRatio`

Triggered when the aspect ratio of the player changes

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    aspectRatio: true,
    setting: true,
});

art.on('aspectRatio', (aspectRatio) => {
    console.info('aspectRatio', aspectRatio);
});
```

## `autoHeight`

Triggered when the player automatically sets the height

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.autoHeight();
});

art.on('autoHeight', (height) => {
    console.info('autoHeight', height);
});
```

## `autoSize`

Triggered when the player automatically sets the size

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});

art.on('autoSize', () => {
    console.info('autoSize');
});
```
## `flip`

Triggered when the player flips

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    flip: true,
    setting: true,
});

art.on('flip', (flip) => {
    console.info('flip', flip);
});
```

## `fullscreen`

Triggered when the player goes into full screen

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
});

art.on('fullscreen', (state) => {
    console.info('fullscreen', state);
});
```

## `fullscreenError`

Triggered when the player goes into full screen error

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
	art.fullscreen = true;
});

art.on('fullscreenError', (event) => {
    console.info('fullscreenError', event);
});
```

## `fullscreenWeb`

Triggered when the player enters web fullscreen

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});

art.on('fullscreenWeb', (state) => {
    console.info('fullscreenWeb', state);
});
```

## `mini`

Triggered when the player enters mini mode

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.mini = true;
});

art.on('mini', (state) => {
    console.info('mini', state);
});
```
## `pip`

Triggered when the player enters Picture-in-Picture mode

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});

art.on('pip', (state) => {
    console.info('pip', state);
});
```

## `screenshot`

Triggered when the player takes a screenshot

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});

art.on('screenshot', (dataUri) => {
    console.info('screenshot', dataUri);
});
```
## `seek`

Triggered when the player jumps in time

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('seek', (currentTime) => {
    console.info('seek', currentTime);
});
```

## `subtitleOffset`

Triggered when the subtitle offset occurs in the player

<div className="run-code">▶ Run Code</div>

```js{11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitleOffset: true,
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    setting: true,
});

art.on('subtitleOffset', (offset) => {
    console.info('subtitleOffset', offset);
});
```

## `subtitleBeforeUpdate`

Triggered before subtitles are updated

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('subtitleBeforeUpdate', (cues) => {
    console.info('subtitleBeforeUpdate', cues);
});
```

## `subtitleAfterUpdate`

Triggered when the subtitles are updated

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('subtitleAfterUpdate', (cues) => {
    console.info('subtitleAfterUpdate', cues);
});
```

## `subtitleLoad`

Triggered when the subtitle loads

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('subtitleLoad', (option, cues) => {
    console.info('subtitleLoad', cues, option);
});
```

## `info`

Triggered when the information panel is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('info', (state) => {
    console.log(state);
});
```
## `layer`

Triggered when a custom layer is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('layer', (state) => {
    console.log(state);
});
```

## `loading`

Triggered when a loader is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('loading', (state) => {
    console.log(state);
});
```

## `mask`

Triggered when a mask layer is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('mask', (state) => {
    console.log(state);
});
```

## `subtitle`

Triggered when the subtitle layer is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('subtitle', (state) => {
    console.log(state);
});
```

## `contextmenu`

Triggered when the right-click menu is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('contextmenu', (state) => {
    console.log(state);
});
```

## `control`

Triggered when the controller is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('control', (state) => {
    console.log(state);
});
```

## `setting`

Triggered when the settings panel is shown or hidden

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.on('setting', (state) => {
    console.log(state);
});
```

## `muted`

Triggered when the muted state changes

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('muted', (state) => {
    console.log(state);
});
```

## `keydown`

Listen to the `keydown` event from `document`

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('keydown', (event) => {
    console.log(event.code);
});
```

## `video:canplay`

The browser can play the media file, but estimates there is not enough data to play through to the end without having to stop for further buffering

## `video:canplaythrough`

The browser estimates it can play the media through to the end without stopping for content buffering

## `video:complete`

OfflineAudioContext rendering is complete

## `video:durationchange`

Triggered when the value of the duration property changes

## `video:emptied`

The media content becomes empty; for example, when this media has been completely loaded (or partially loaded), this event is sent and the load() method is called to reload it

## `video:ended`

The video has stopped because the media reached the end point

## `video:error`

An error occurred while fetching media data, or the resource type is not a supported media format

## `video:loadeddata`

The first frame of the media has finished loading

## `video:loadedmetadata`

Metadata has been loaded

## `video:pause`

Playback has been paused

## `video:play`

Playback has started

## `video:playing`

Playback is ready to start following a pause or delay due to lack of data

## `video:progress`

Periodically triggered while the browser is loading resources

## `video:ratechange`

The playback rate has changed

## `video:seeked`

A seek (frame skipping) operation has completed

## `video:seeking`

A seek (frame skipping) operation has started

## `video:stalled`

The user agent is trying to fetch media data, but the data unexpectedly has not appeared

## `video:suspend`

Media data loading has been suspended

## `video:timeupdate`

The time specified by the currentTime attribute has changed
## `video:volumechange`

Volume changed

## `video:waiting`

Playback has stopped due to temporarily missing data