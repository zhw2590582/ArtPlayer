# Instance Events

Player events are divided into two types: `native events` from the video (prefixed with `video:`) and `custom events`.

Listen for events:

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

Listen for an event only once:

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

:::warning For all events, please refer to the following address:

[artplayer/types/events.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/events.d.ts)

:::

## `ready`

Triggered when the player is ready for the first time

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

Triggered when the player switches URL and is ready to play

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

Triggered when a player hotkey is pressed

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

Triggered when an error occurs while the player is loading a video

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

Triggered when the mouse pointer enters or leaves the player

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

Triggered when the mouse pointer moves over the player

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

Triggered when the player's dimensions change

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

Triggered when the player enters or leaves the viewport

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

Triggered when the lock state changes on mobile devices

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

Triggered when the player's aspect ratio changes

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

Triggered when the player automatically sets its height

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

Triggered when the player automatically adjusts its size

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

Triggered when the player's video is flipped

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

Triggered when the player enters or exits fullscreen mode

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

Triggered when an error occurs during fullscreen mode transition

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

Triggered when the player enters or exits web page fullscreen mode

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

Triggered when the player enters or exits mini mode

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

Triggered when the player enters or exits picture-in-picture mode

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

Triggered when the player captures a screenshot

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

Triggered when the player performs a time jump

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

Triggered when subtitle offset changes

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

Triggered after subtitles are updated

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

Triggered when subtitles are loaded

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

Triggered when the info panel is shown or hidden

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

Triggered when custom layers are shown or hidden

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

Triggered when the loading indicator is shown or hidden

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

Triggered when the mask layer is shown or hidden

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

Triggered when the context menu is shown or hidden

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

Triggered when the controls are shown or hidden

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

Listens for the `keydown` event from `document`

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

The browser can start playing the media, but estimates that there isn't enough data to play through to the end without having to stop for further buffering

## `video:canplaythrough`

The browser estimates it can play the media through to the end without having to stop for buffering

## `video:complete`

OfflineAudioContext rendering is complete

## `video:durationchange`

Triggered when the value of the duration property changes

## `video:emptied`

The media has become empty; for example, this event is sent when the media has already been loaded (or partially loaded), and the load() method is called to reload it

## `video:ended`

Playback has stopped because the media has reached its end point

## `video:error`

An error occurred while fetching the media data, or the resource type is not a supported media format

## `video:loadeddata`

The first frame of the media has finished loading

## `video:loadedmetadata`

Metadata has been loaded

## `video:pause`

Playback has been paused

## `video:play`

Playback has begun

## `video:playing`

Playback is ready to start after having been paused or delayed due to lack of data

## `video:progress`

Fired periodically as the browser loads the resource

## `video:ratechange`

The playback rate has changed

## `video:seeked`

A seek operation has completed

## `video:seeking`

A seek operation has begun

## `video:stalled`

The user agent is trying to fetch media data, but data is unexpectedly not forthcoming

## `video:suspend`

Media data loading has been suspended

## `video:timeupdate`

The time indicated by the currentTime attribute has been updated

## `video:volumechange`

The volume has changed

## `video:waiting`

Playback has stopped because of a temporary lack of data