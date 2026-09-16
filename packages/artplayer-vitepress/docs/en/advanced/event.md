# Instance Events

Player events are divided into two types: `native events` of the video (prefixed with `video:`), and `custom events`.

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

Listening to an event only once:

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

Manually triggering an event:

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.emit('focus');
```

Removing an event:

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

:::warning For a complete list of events, please refer to:

[artplayer/types/events.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/events.d.ts)

:::

## Subscription and synchronous dispatch {#emitter-contract}

Players inherit `Artplayer.Emitter`. `on(name, callback, ctx?)`, `once`, `off`, and `emit(name, ...args)` all return the current instance. They are neither DOM addEventListener nor a Promise-based message queue.

- on keeps registration order. Registering the same function twice invokes it twice. ctx is passed unchanged as an ordinary function's this; omission means undefined, not an automatic player binding. Arrows retain their lexical this.
- emit synchronously walks a snapshot taken at dispatch start. Added listeners wait until a later dispatch; removed ordinary listeners already in the snapshot still run. Arguments retain their references; callback return values are ignored.
- once removes itself before invoking the callback and prevents nested dispatch from consuming the same registration twice, even if the callback throws. off(name, callback) removes all ordinary/once registrations for that function regardless of ctx; off(name) removes every listener for the name.
- A synchronous throw stops subsequent listeners in that dispatch and propagates through the call stack. Async callbacks are not awaited; handle their failures yourself. The name error has no special Node EventEmitter behavior.
- e is the lazily created registry of fn/ctx records and remains a visible historical interface. A fresh standalone Emitter may not have it yet. Use on/off rather than editing the table. Numeric keys share their string-equivalent channel; symbols have separate keys. The root player's historical overloads accept narrower names than the accurate entry or a generic Emitter.

Manual emit only sends a notification; it does not replace player methods. Emitting built-in names may also trigger internal listeners. Destruction releases core-owned DOM/internal subscriptions but does not clear every user registration; remove unwanted subscriptions if you retain the instance. The advanced-properties guide explains the separate DOM listener manager, art.events.

## Native forwarding {#native-event-contract}

The default media events below are forwarded with a `video:` prefix and the original Event object. The browser or proxy determines when they occur:

`abort`, `canplay`, `canplaythrough`, `durationchange`, `emptied`, `ended`, `error`, `loadeddata`, `loadedmetadata`, `loadstart`, `pause`, `play`, `playing`, `progress`, `ratechange`, `seeked`, `seeking`, `stalled`, `suspend`, `timeupdate`, `volumechange`, `waiting`.

The `video:error` argument is not a MediaError or Error instance; inspect `art.video.error` when needed. Historical types include `video:complete` and `video:encrypted`, but neither appears in the default config.events, so the core does not automatically forward them. An adapter must provide forwarding or configure the event inventory before construction. A declared name does not prove an event is produced at runtime.

Global forwarding uses the player's currently bound document/window and passes the original Event:

| Prefix | Default names |
| --- | --- |
| `document:` | click, mouseup, keydown, touchend, touchcancel, touchmove, mousemove, pointerup, contextmenu, pointermove, visibilitychange, webkitfullscreenchange |
| `window:` | resize, scroll, orientationchange |

These are not restricted to interactions inside the player. events.bindGlobalEvents can rebind them to the owning window. Destruction stops native forwarding. Arguments preserve native subtypes such as KeyboardEvent/MouseEvent; forwarding does not guarantee that a browser produces every event.

## Custom payloads and timing {#custom-event-contract}

Internal and user listeners share synchronous dispatch. Internal listeners registered during construction can emit a custom event before later user listeners receive the native forwarding event. Do not assume one total ordering across all browsers and proxies.

### Media and lifecycle

| Event | Payload and actual stage |
| --- | --- |
| `ready` | No arguments; once in the first successfully handled video:canplay, after isReady is set. Does not wait for async plugins, subtitles, or SDKs |
| `restart` | Submitted URL; for a ready player with an existing URL, the active source change emits at canplay when the actual media URL changed. Assigning the same URL need not emit it |
| `play` | No arguments; art.play emits after the media play call succeeds while its operation remains current. Direct video.play does not generate this custom event, though native video:play can occur |
| `pause` | No arguments; art.pause emits synchronously after calling media pause and updating the notice, even if already paused. Separate from video:pause |
| `destroy` | No arguments; after native resources/template cleanup, instance removal, and setting isDestroy true. Do not assume mounted DOM inside the callback; destroy(false) separately preserves DOM |
| `error` | Original error value and retry count; emitted when reconnection submits a retry after waiting, not on every native error or every async failure |
| `seek` | currentTime after assignment and the original requested time (number or string), not native seeked completion |
| `muted` | Boolean supplied to art.muted, including repeated assignments. Observe video:volumechange for direct video.muted changes |
| `screenshot` | PNG data URI after image capture and an attempted download, not proof a file was saved. getDataURL/getBlobUrl alone do not emit it |
| `airplay` | No arguments; after invoking an available native picker, not confirmation of remote connection or playback |
| `raf` | No arguments; emitted during playback when USE_RAF was enabled before construction. Not a decoded-video-frame callback |

### UI and input

| Event | Payload and actual stage |
| --- | --- |
| `info`, `layer`, `loading`, `mask`, `subtitle`, `contextmenu`, `control`, `setting` | Boolean assigned to show; repeated identical assignments can emit again. Not animation completion |
| `focus` / `blur` | Original document click/contextmenu event, classified by whether its path includes the player. Not DOM focus/blur; can emit even without a state change |
| `click` / `dblclick` | Video click event. Double-click is counted within DBCLICK_TIME; the first click emits immediately, before playback/fullscreen actions |
| `hover` | Enter/leave boolean and original mouseenter/mouseleave event |
| `mousemove` | MouseEvent from the player node, not throttled document coordinates |
| `hotkey` | KeyboardEvent after matching shortcut callbacks, subject to focus/input filtering |
| `keydown` | KeyboardEvent after desktop shortcut dispatch, even without a matching key or player focus. Mobile does not automatically install this shortcut dispatcher; use document:keydown for the raw global event |
| `resize` | No arguments; window debounce, metadata, display-mode changes, or explicit layout paths, not just window:resize |
| `view` | Viewport-intersection boolean after leading scroll throttling, not complete visibility or occlusion detection |
| `lock` | Boolean after the built-in lock plugin updates state, not an observer of direct isLock assignment |
| `setBar` | Type, fraction, and optional original mouse/touch event. Built-in types are loaded/played/hover; programmatic and keyboard updates may omit the third argument. A progress UI protocol, not playback completion |

### Size, display, and subtitles

| Event | Payload and actual stage |
| --- | --- |
| `aspectRatio` / `flip` | String after the setter normalizes an empty value; not necessarily a member of the built-in selector list |
| `autoHeight` / `autoSize` | Height number / {width, height} after valid media dimensions allow layout. No event when calculation is unavailable |
| `fullscreen` / `fullscreenWeb` / `mini` / `pip` | Boolean from the display adapter's observation or transition. Duplicate-assignment behavior varies by mode; not a universal replacement for request completion |
| `fullscreenError` | Owned native fullscreen error event/adapter value. A request Promise rejection may instead only update the notice; this does not collect every fullscreen failure |
| `subtitleOffset` | Original requested offset; stored offset clamps to[-10,10]. No event without cues |
| `subtitleBeforeUpdate` / `subtitleAfterUpdate` | Cue arrays, not individual cues, synchronously before/after rendering. Neither emits without active cues |
| `subtitleLoad` | Current cue array and the subtitle manager's current options (possibly null), after native track load. Not an alias for switch fulfillment |

## TypeScript event views {#event-types}

The root entry retains historical declarations and custom augmentation: video:error was typed as Error and subtitle updates as one VTTCue. It also has array overloads through SubtitleUpdateEvents. Use `artplayer/runtime` for accurate contextual inference: Event for native media payloads, SubtitleCue arrays for updates, unknown for error/fullscreenError, and a string-capable second seek argument. Unknown custom events retain unknown arrays without runtime payload validation. A generic Emitter can declare its own event tuples:

```ts
import Artplayer from 'artplayer/runtime';
import type { Events, SubtitleCue } from 'artplayer/runtime';

const bus = new Artplayer.Emitter<{ progress: [value: number] }>();
const context = { total: 0 };
bus.on('progress', function (value) { this.total += value; }, context);
bus.emit('progress', 2);

const art = new Artplayer({ container: '.artplayer-app', url: '/assets/sample/video.mp4' });
art.on('video:error', (event: Event) => console.info(event.type));
art.on('subtitleBeforeUpdate', (cues: SubtitleCue[]) => console.info(cues.length));
const seekArgs: Events['seek'] = [0, '0'];
void seekArgs;
```


## `ready`

Triggered when the player is ready for the first time.

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

Triggered when the player switches URLs and becomes ready to play.

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

Triggered when the player is paused.

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

Triggered when the player starts playing.

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

Triggered when a player hotkey is pressed.

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

Triggered when the player is destroyed.

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

Triggered when the player gains focus.

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

Triggered when the player loses focus.

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

Triggered when the player is double-clicked.

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

Triggered when the player is clicked.

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

Triggered when an error occurs while the player is loading a video.

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

Triggered when the mouse enters or leaves the player.

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

Triggered when the mouse moves over the player.

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

Triggered when the player's dimensions change.

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

Triggered when the player enters the viewport.

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

Triggered when the lock state changes on mobile devices.

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

Triggered when the player's aspect ratio changes.

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

Triggered when the player's height is automatically set.

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

Triggered when the player's size is automatically set.

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

Triggered when the player is flipped.

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

Triggered when the player enters or exits windowed fullscreen mode.

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

Triggered when a windowed fullscreen error occurs.

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

Triggered when the player enters or exits web fullscreen mode.

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

Triggered when the player enters or exits mini mode.

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

Triggered when the player enters or exits Picture-in-Picture mode.

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

Triggered when the player takes a screenshot.

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

Triggered when the player performs a time seek.

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

Triggered when the subtitle offset changes in the player.

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

Triggered before subtitles are updated.

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

Triggered after subtitles are updated.

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

Triggered when subtitles are loaded.

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

Triggered when the info panel is shown or hidden.

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

Triggered when a custom layer is shown or hidden.

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

Triggered when the loader is shown or hidden.

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

Triggered when the mask layer is shown or hidden.

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

Triggered when the subtitle layer is shown or hidden.

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

Triggered when the context menu is shown or hidden.

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

Triggered when the control bar is shown or hidden.

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

Triggered when the settings panel is shown or hidden.

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

Triggered when the muted state changes.

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

Listens for the `keydown` event from the `document`.

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

The browser can start playing the media, but estimates there is not enough data to play through to the end without stopping for further buffering.

## `video:canplaythrough`

The browser estimates it can play the media through to the end without stopping for buffering.

## `video:complete`

Historical declared name; not forwarded by the default video event inventory. Use `video:ended` for media reaching its end.

## `video:durationchange`

Triggered when the value of the `duration` property changes.

## `video:emptied`

The media has become empty; for example, this event is sent when the media has already been loaded (or partially loaded), and the `load()` method is called to reload it.

## `video:ended`

Playback has stopped because the media has reached its end.

## `video:error`

An error occurred while fetching the media data, or the resource type is not a supported media format.

## `video:loadeddata`

The first frame of the media has finished loading.

## `video:loadedmetadata`

Metadata has been loaded.

## `video:pause`

Playback has been paused.

## `video:play`

Playback has begun.

## `video:playing`

Playback is ready to start after having been paused or delayed due to lack of data.

## `video:progress`

Fired periodically as the browser loads the resource.

## `video:ratechange`

The playback rate has changed.

## `video:seeked`

A seek operation has completed.

## `video:seeking`

A seek operation has begun.

## `video:stalled`

The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.

## `video:suspend`

Media data loading has been suspended.

## `video:timeupdate`

The time indicated by the `currentTime` property has changed.

## `video:volumechange`

The volume has changed.

## `video:waiting`

Playback has stopped because of a temporary lack of data.