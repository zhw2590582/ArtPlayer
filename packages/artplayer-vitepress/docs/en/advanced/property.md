# Instance Properties

Here, `Instance Properties` refer to the `first-level properties` mounted on the `instance`, which are commonly used.

## Instance identity and lifecycle {#instance-lifecycle}

Artplayer.instances returns the shared array of successfully constructed, still-registered instances. The constructor adds an instance only after synchronous initialization finishes; a constructor plugin does not yet find its own instance there. It is not a copy or a list of ready players. Read or copy it rather than editing it: registration, duplicate-container checks and mutex playback use this array. Destruction removes only that instance.

art.constructor is the same Artplayer constructor and its prototype is the instance prototype. Artplayer.version is the package version string, not a capability test. The historical root declarations still name Artplayer.env and Artplayer.build, but neither is supplied by the frozen npm 5.4.0 runtime or the current 6.0.0 runtime; their reads return undefined. The runtime declaration view omits them. The build process's NODE_ENV replacement does not create these public properties.

art.id is an incrementing numeric identifier within one loaded constructor, allocated before option validation. Failed construction can leave gaps; independent bundle copies have independent counters/registries. It is unrelated to option.id, which is a playback-memory key. Do not use it as a globally unique persistent identifier.

### State fields and owned services {#instance-state}

These six fields start as false and are ordinary writable fields, not commands or capability promises. Assigning them does not run the corresponding feature or perform cleanup.

| Field | Core meaning |
| --- | --- |
| isReady | Set before the first ready event after canplay. Not reset to false by reset, source changes or normal destruction, so it does not prove the current URL is ready |
| isDestroy | Set after core teardown and instance removal, before the destroy event. Internal closing guards start earlier; it can still be false while cleanup is executing |
| isFocus | Updated by player focusin/focusout and inside/outside document click/contextmenu paths. Not a direct alias of document.activeElement |
| isInput | Tracks INPUT targets in those paths, not every editable target. Keyboard filtering separately checks editable content |
| isLock | Updated by the mobile lock helper alongside its CSS state. Assigning this field alone does not create the lock UI or emit lock |
| isRotate | Tracks the CSS rotation used by web auto-orientation. Native screen-orientation locking does not make this a general device-orientation flag |

Optional flv/m3u8/hls/ts/mpd/torrent fields are integration slots for caller-installed adapters. The core does not initialize those SDKs or automatically call arbitrary objects' destroy methods. Follow each adapter's ownership contract and register its cleanup. runtime describes unknown integration values so that consumers check them before use.

art.player is the descriptor installer object, with no public operational methods; playback APIs are installed on art itself. info/loading/mask are existing component services with show and toggle(). Their show setters update CSS state and synchronously emit their named event, including identical assignments. They are not promises and do not fetch media or control buffering. Native media handlers may subsequently change their visibility.

The info service initializes on desktop, polls data-video fields at INFO_LOOP_TIME even while hidden, formats numbers to two decimals, and updates textContent. Its runtime init() restarts the owned polling/listener scope rather than creating an independent extra loop. Loading mounts the configured loading icon. Mask mounts state/error icons, requests play on state-button click, and switches to its terminal error presentation on destruction; a thrown user destroy listener does not skip its final cleanup. These services are not custom-entry containers like layers or controls.

plugins.add remains the registry method documented in the plugin guide: a synchronous result is immediately installed, a same-realm Promise returns a Promise of the registry, and neither shape is converted into a universal async API. The runtime Plugins.add type accepts accurate and legacy factories without wrapping the actual function. Plugin result objects are not automatically disposed merely because they contain a destroy method.

### Reset, destruction, and failure {#instance-cleanup}

reset() only calls video.removeAttribute('src') followed by video.load(). It returns undefined, keeps the UI, registration, option.url, readiness flag and user subscriptions, and does not revoke caller URLs, destroy SDKs or rebuild plugins. Native media events may still follow. Use the source-switch APIs for coordinated source changes; reset is not a full player restart or an asynchronous cancellation receipt.

destroy(removeHtml = true) synchronously starts teardown. When REMOVE_SRC_WHEN_DESTROY is enabled and a media node is available it first calls reset, then releases owned scopes, handles the template, removes the instance, marks isDestroy, emits destroy, and finalizes remaining resources. Browser promises already in flight are not synchronously made complete by its return. Both reset and destroy use the method receiver; keep them bound to the instance when passing them elsewhere.

With true, destruction empties the container; it does not remove the caller's container node or restore its pre-mount content. With false, it keeps the generated DOM and marks the player art-destroy while still stopping core resources. A repeated/reentrant destroy is a no-op, so destroy(false) followed by destroy(true) does not later remove the retained DOM. Reusing the released container requires a new player. The old instance must not be treated as revived, and later property access is not uniformly guaranteed to be a no-op.

Cleanup continues after a failure, then throws the first caught value and logs additional failures. A failing synchronous constructor instead restores its captured DOM/attributes and rethrows the original initialization error. User event registrations are not all erased by destroy: retaining an instance also retains those callbacks until removed. Caller-created timers, native listeners and external SDK resources need their own cleanup; the core-owned listener manager and scopes only release resources registered with them.

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player' });
const instances: Artplayer[] = [...Artplayer.instances];
const identifier: number = art.id;
art.info.show = true;
art.loading.toggle();
const dispose = art.destroy.bind(art);
const retained: void = dispose(false);
void [instances, identifier, retained];
```


## `play`

-   Type: `Function`

Play the video.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();
});
```

## `pause`

-   Type: `Function`

Pause the video.

<div className="run-code">▶ Run Code</div>

```js{11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();

    setTimeout(() => {
        art.pause();
    }, 3000);
});
```

## `toggle`

-   Type: `Function`

Toggle video play and pause.

<div className="run-code">▶ Run Code</div>

```js{11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.toggle();

    setTimeout(() => {
        art.toggle();
    }, 3000);
});
```

## `destroy`

-   Type: `Function`
-   Parameter: `Boolean`

Destroy the player. Accepts a parameter indicating whether to also remove the player's `html` after destruction. Defaults to `true`.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.destroy();
});
```

## `reset`

-   Type: `Function`

Reset the player's video element: removes the current `src` and calls `load()` once. Commonly used to manually release media resources or reinitialize the video tag in single-page applications.

> Note: The global configuration `Artplayer.REMOVE_SRC_WHEN_DESTROY` will also automatically execute similar logic when `destroy()` is called.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    // Only reset the video, do not remove the interface
    art.reset();
});
```

## `seek`

-   Type: `Setter`
-   Parameter: `Number`

Seek to a specific time in the video, in seconds.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 5;
});
```

## `forward`

-   Type: `Setter`
-   Parameter: `Number`

Fast-forward the video time, in seconds.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.forward = 5;
});
```

## `backward`

-   Type: `Setter`
-   Parameter: `Number`

Rewind the video time, in seconds.

<div className="run-code">▶ Run Code</div>

```js{10}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 5;

    setTimeout(() => {
        art.backward = 2;
    }, 3000);
});
```

## `volume`

-   Type: `Setter/Getter`
-   Parameter: `Number`

Set and get the video volume, range: `[0, 1]`.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.volume);
    art.volume = 0.5;
    console.info(art.volume);
});
```

## `url`

-   Type: `Setter/Getter`
-   Parameter: `String`

Set and get the video URL.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.url = '/assets/sample/video.mp4?t=0';
});
```

## `switch`

-   Type: `Setter`
-   Parameter: `String`

Set the video URL. Similar to `art.url` when setting, but performs some optimization operations.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switch = '/assets/sample/video.mp4?t=0';
    }, 3000);
});
```

## `switchUrl`

-   Type: `Function`
-   Parameter: `String`

Set the video URL. Similar to `art.url` when setting, but performs some optimization operations.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switchUrl('/assets/sample/video.mp4?t=0');
    }, 3000);
});

```

:::warning Note

`art.switch` and `art.switchUrl` have the same functionality, but the `art.switchUrl` method returns a `Promise`. It `resolve`s when the new URL is playable and `reject`s when the new URL fails to load.

:::

## `switchQuality`

-   Type: `Function`
-   Parameter: `String`

Sets the video quality URL. Similar to `art.switchUrl`, but retains the previous playback progress.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switchQuality('/assets/sample/video.mp4?t=0');
    }, 3000);
});
```

## `muted`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Sets or gets whether the video is muted.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.muted);
    art.muted = true;
    console.info(art.muted);
});
```

## `currentTime`

-   Type: `Setter/Getter`
-   Parameter: `Number`

Sets or gets the current playback time of the video. Setting the time is similar to `seek`, but it does not trigger additional events.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.currentTime);
    art.currentTime = 5;
    console.info(art.currentTime);
});
```

## `duration`

-   Type: `Getter`

Gets the duration of the video.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.duration);
});
```

:::warning Note

Some videos may not have a duration, such as live streams or videos that have not been fully decoded. In such cases, the obtained duration will be `0`.

:::

## `screenshot`

-   Type: `Function`

Downloads a screenshot of the current video frame. An optional parameter specifies the screenshot filename.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.screenshot('your-name');
});
```

## `getDataURL`

-   Type: `Function`

Gets the `base64` URL of a screenshot of the current video frame. Returns a `Promise`.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', async () => {
    const url = await art.getDataURL();
	console.info(url)
});
```

## `getBlobUrl`

-   Type: `Function`

Gets the `blob` URL of a screenshot of the current video frame. Returns a `Promise`.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', async () => {
    const url = await art.getBlobUrl();
    console.info(url);
});
```

## `fullscreen`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Sets or gets the player's window fullscreen state.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'Fullscreen Switch',
            click: function () {
                art.fullscreen = !art.fullscreen;
            },
        },
    ],
});
```

:::warning Note

Due to browser security mechanisms, a user interaction (e.g., a click on the page) must occur before triggering window fullscreen.

:::

## `fullscreenWeb`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Sets or gets the player's web page fullscreen state.

<div className="run-code">▶ Run Code</div>

```js{8,11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});

art.on('ready', () => {
    art.fullscreenWeb = true;

    setTimeout(() => {
        art.fullscreenWeb = false;
    }, 3000);
});
```

## `pip`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Sets or gets the player's Picture-in-Picture (PIP) mode.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'PIP',
            click: function () {
                art.pip = !art.pip;
            },
        },
    ],
});
```

:::warning Note

Due to browser security mechanisms, a user interaction (e.g., a click on the page) must occur before triggering Picture-in-Picture.

:::

## `poster`

-   Type: `Setter/Getter`
-   Parameter: `String`

Sets and gets the video poster. The poster effect is only visible before the video starts playing.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});

art.on('ready', () => {
    console.info(art.poster);
    art.poster = '/assets/sample/poster.jpg?t=0';
    console.info(art.poster);
});
```

## `mini`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Sets and gets the player's mini mode.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.mini = true;
});
```

## `playing`

-   Type: `Getter`
-   Parameter: `Boolean`

Gets whether the video is currently playing.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    console.info(art.playing);
});
```

## `state`

-   Type: `Setter/Getter`
-   Parameter: `String`

Gets or sets the player's current state. Supported values: `standard` (normal), `mini` (mini window), `pip` (picture-in-picture), `fullscreen` (window fullscreen), `fullscreenWeb` (webpage fullscreen).

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.state); // Default is 'standard'
    art.state = 'mini';
});
```

## `autoSize`

-   Type: `Function`

Sets whether the video adapts its size automatically.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.autoSize();
});
```

## `rect`

-   Type: `Getter`

Gets the player's dimensions and coordinate information.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(JSON.stringify(art.rect));
});
```

:::warning Note

The dimension and coordinate information is obtained via `getBoundingClientRect`.

:::

## `bottom` / `top` / `left` / `right` / `x` / `y` / `width` / `height`

-   Type: `Getter`

These properties provide quick access to `rect`:

- `bottom`, `top`, `left`, `right`, `x`, `y`: Correspond to the fields of the same name in `DOMRect`.
- `width`, `height`: The player's current visible width and height.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.width, art.height, art.left, art.top);
});
```

## `flip`

-   Type: `Setter/Getter`
-   Parameter: `String`

Sets and gets the player's flip state. Supported values: `normal`, `horizontal`, `vertical`.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.flip);
    art.flip = 'horizontal';
    console.info(art.flip);
});
```

## `playbackRate`

-   Type: `Setter/Getter`
-   Parameter: `Number`

Sets and gets the player's playback speed.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.playbackRate);
    art.playbackRate = 2;
    console.info(art.playbackRate);
});
```

## `aspectRatio`

-   Type: `Setter/Getter`
-   Parameter: `String`

Sets and gets the player's aspect ratio.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.aspectRatio);
    art.aspectRatio = '16:9';
    console.info(art.aspectRatio);
});
```

## `autoHeight`

-   Type: `Function`

When the container only has a defined width, this property can automatically calculate and set the video's height.

<div className="run-code">▶ Run Code</div>

```js{7,11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.autoHeight();
});

art.on('resize', () => {
    art.autoHeight();
});
```

:::warning Note

This property is useful when your container has only a width but the exact height is unknown. It can automatically calculate the video height, but you need to determine the timing for setting this property.

:::

## `attr`

-   Type: `Function`
-   Parameter: `String`

Dynamically get and set attributes of the video element.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.attr('playsInline'));
    art.attr('playsInline', true);
    console.info(art.attr('playsInline'));
});
```

## `type`

-   Type: `Setter/Getter`
-   Parameter: `String`

Dynamically get and set the video type.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.type);
    art.type = 'm3u8';
    console.info(art.type);
});
```

## `theme`

-   Type: `Setter/Getter`
-   Parameter: `String`

Dynamically get and set the player's theme color.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.theme);
    art.theme = '#000';
    console.info(art.theme);
});
```

## `airplay`

-   Type: `Function`

Initiate AirPlay.

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'AirPlay',
            click: function () {
                art.airplay();
            },
        },
    ],
});
```

## `loaded`

-   Type: `Getter`

The proportion of video buffered, ranging from `[0, 1]`. Often used with the `video:timeupdate` event.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:timeupdate', () => {
    console.info(art.loaded);
});
```

## `loadedTime`

-   Type: `Getter`

The buffered media duration in seconds. Typically used alongside `loaded` to display detailed buffering progress.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:timeupdate', () => {
    console.info(art.loadedTime);
});
```

## `played`

-   Type: `Getter`

The proportion of video played, ranging from `[0, 1]`. Often used with the `video:timeupdate` event.

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('video:timeupdate', () => {
    console.info(art.played);
});
```

## `proxy`

-   Type: `Function`

A proxy function for `DOM` events, essentially proxying `addEventListener` and `removeEventListener`. When using `proxy` to handle events, the event is automatically cleaned up when the player is destroyed.

<div className="run-code">▶ Run Code</div>

```js{8-10}
var container = document.querySelector('.artplayer-app');

var art = new Artplayer({
	container: container,
	url: '/assets/sample/video.mp4',
});

art.proxy(container, 'click', event => {
	console.info(event);
});
```

:::warning Note

If you need certain `DOM` events to exist only for the player's lifecycle, it is strongly recommended to use this function to avoid memory leaks.

:::

## `query`

-   Type: `Function`

A `DOM` query function, similar to `document.querySelector`, but the search is scoped to the current player, preventing errors with duplicate class names.

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

console.info(art.query('.art-video'));
```

## `video`

-   Type: `Element`

Quickly returns the player's `video` element.

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

console.info(art.video);
```

### Native and proxy media capabilities {#media-capabilities}

art.video is the current template media node, identical to art.template.$video; it may be an adapted canvas rather than an HTMLVideoElement. The root entry retains its historical video type. runtime exports MediaSurface as NativeMedia | CanvasMedia: CanvasMedia describes an actual canvas plus media state, source, dimensions, buffered ranges, volume/rate, load and playback methods supplied by an adapter. A bare canvas does not satisfy that contract, and the type does not install an adapter.

PlaybackMethods allows an adapter's own play/pause return types. Calling art.video.play/pause acts directly on that surface, with its native or adapter result; the Artplayer method facade separately applies notices, custom events, operation ownership and mutex behavior. MediaState describes currentTime/duration/paused/ended/readyState and an optional boolean playing hint; when that hint is absent, the core derives playing from time greater than zero, not paused/ended, and readyState greater than two. These state fields do not prove decoded frames are being presented.

| Optional capability | Meaning and check |
| --- | --- |
| textTracks, error | Track-list-like data / native or adapter error value. Proxies may omit either; error is unknown, not guaranteed to be an Error instance |
| requestVideoFrameCallback, cancelVideoFrameCallback | Optional paired frame-callback methods. Detect each function and preserve the media receiver; no timer fallback is promised by these types |
| requestPictureInPicture | Optional native PiP request returning a Promise; availability does not remove user-activation, policy or media requirements |
| webkitEnterFullscreen, webkitExitFullscreen, webkitSupportsFullscreen | WebKit media-fullscreen methods and capability flag; detect before use |
| webkitSupportsPresentationMode, webkitSetPresentationMode, webkitPresentationMode | WebKit presentation-mode capability, request and observed mode; a supported method does not guarantee the requested mode succeeds |
| webkitDisplayingFullscreen | Optional observed media-fullscreen state, not a request |
| webkitShowPlaybackTargetPicker | Optional AirPlay picker. The core additionally checks availability events; calling it is not proof of a receiver connection |

Keep optional native calls bound to the media object, handle Promise failures, and use the public display APIs for normal player integration. Capability detection or Windows WebKit execution is not physical Safari/iOS/AirPlay acceptance. The following type-only consumer keeps access optional without issuing a display request:

```ts
import Artplayer from 'artplayer/runtime';
import type { MediaSurface, NativeMedia, CanvasMedia } from 'artplayer/runtime';

const art = new Artplayer({ container: '#player' });
const media: MediaSurface = art.video;
const error: unknown = media.error;
const tracks: ArrayLike<TextTrack> | undefined = media.textTracks;
const supportsFrames = typeof media.requestVideoFrameCallback === 'function'
    && typeof media.cancelVideoFrameCallback === 'function';
const surface: NativeMedia | CanvasMedia = media;
void [error, tracks, supportsFrames, surface];
```


## `cssVar`

-   Type: `Function`

Dynamically get or set `CSS` variables.

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.log(art.cssVar('--art-theme'));
    art.cssVar('--art-theme', 'green');
    console.log(art.cssVar('--art-theme'));
});
```

### Values, writes, and cascade {#css-variable-contract}

art.cssVar(name) reads getComputedStyle from art.template.$player and returns a **string**, including for opacity, scale and z-index. It returns the computed custom-property text, not a parsed number or necessarily a normalized color. A missing variable returns an empty string. art.theme delegates to '--art-theme'.

The second argument uses a historical truthiness check. A truthy value calls style.setProperty and returns undefined; numeric 0, an empty string, false, null, undefined or NaN instead read the current value. Use the string '0' to write zero. To remove an inline override, use art.template.$player.style.removeProperty(name); cssVar(name, '') does not remove it. Values are passed to CSS rather than validated against CssVar; invalid CSS tokens may be stored while the consuming property falls back or becomes invalid.

Writes affect this player's inline style and its descendants, not other instances. They do not update art.option.cssVar or art.option.theme, emit a theme event, or install a plugin. At construction, nonempty option.theme takes precedence over the initial '--art-theme' option. External styles follow normal CSS cascade rules: scope overrides to the actual .art-video-player, because the built-in defaults declared on that node can override values merely inherited from its container. Inline overrides generally win ordinary stylesheet declarations; !important declarations can still change the result.

The root cssVar signature retains historical numeric/literal types, including the 9999 literal for '--art-fullscreen-web-index'. Runtime values are not limited to that literal. The runtime entry exposes string reads and string-or-void writes without changing behavior; the constructor's legacy cssVar option shape remains distinct.

### Built-in defaults and consumers {#css-variable-defaults}

These are the base stylesheet values, before constructor overrides, mobile/fullscreen classes, user CSS and inline styles. Length values need CSS units where applicable. Naming a variable here does not prove support for a browser-specific pseudo-element or feature.

| Variable | Base value | Used for |
| --- | --- | --- |
| `--art-theme` | `#f00` | Accent color for progress and selected items |
| `--art-font-color` | `#fff` | Base text, links and SVG fill |
| `--art-background-color` | `#000` | Player background |
| `--art-text-shadow-color` | `rgba(0, 0, 0, 0.5)` | Base text shadow color |
| `--art-transition-duration` | `0.2s` | Duration for transitions that consume it, not every animation |
| `--art-padding` | `10px` | Spacing for the bottom area, menus and info |
| `--art-border-radius` | `3px` | Corner radius for panels and tips |
| `--art-progress-height` | `6px` | Progress control height; inner track starts at half height |
| `--art-progress-color` | `rgba(255, 255, 255, 0.25)` | Progress track background |
| `--art-progress-top-gap` | `10px` | Top interaction padding above the progress track |
| `--art-hover-color` | `rgba(255, 255, 255, 0.25)` | Progress hover range color |
| `--art-loaded-color` | `rgba(255, 255, 255, 0.25)` | Buffered range color |
| `--art-state-size` | `80px` | Central playback-state button size |
| `--art-state-opacity` | `0.8` | State-button opacity when shown |
| `--art-bottom-height` | `100px` | Bottom gradient background height, not total control layout height |
| `--art-bottom-offset` | `20px` | Translation of bottom controls while hidden |
| `--art-bottom-gap` | `5px` | Gap below progress and around related overlays |
| `--art-highlight-width` | `8px` | Timestamp marker width |
| `--art-highlight-color` | `rgba(255, 255, 255, 0.5)` | Timestamp marker color |
| `--art-control-height` | `46px` | Control-item minimum height/width and layout fallback |
| `--art-control-opacity` | `0.75` | Control-item opacity outside hover |
| `--art-control-icon-size` | `36px` | Control icon width and height |
| `--art-control-icon-scale` | `1.1` | Control icon scale, with a further pressed-state factor |
| `--art-volume-height` | `120px` | Volume panel height |
| `--art-volume-handle-size` | `14px` | Volume slider handle size |
| `--art-lock-size` | `36px` | Mobile lock-button size |
| `--art-indicator-scale` | `0` | Base progress indicator scale; hover/active rules can override it |
| `--art-indicator-size` | `16px` | Progress indicator width and height |
| `--art-fullscreen-web-index` | `9999` | Web-fullscreen stacking level, not native fullscreen permission |
| `--art-settings-icon-size` | `24px` | Left-side setting icon size |
| `--art-settings-max-height` | `300px` | CSS setting-panel maximum; JS also constrains available space |
| `--art-selector-max-height` | `300px` | Control selector maximum height |
| `--art-contextmenus-min-width` | `250px` | Context-menu minimum width |
| `--art-subtitle-font-size` | `20px` | Subtitle font size |
| `--art-subtitle-gap` | `5px` | Gap between subtitle lines |
| `--art-subtitle-bottom` | `15px` | Base subtitle bottom offset; controls can add layout height |
| `--art-subtitle-border` | `#000` | Subtitle outline text-shadow color, not border width |
| `--art-widget-background` | `rgba(0, 0, 0, 0.85)` | Menu, setting and thumbnail panel background |
| `--art-tip-background` | `rgba(0, 0, 0, 0.7)` | Progress tip, notice and lock-button background |
| `--art-scrollbar-size` | `4px` | Width/height of WebKit scrollbar pseudo-elements |
| `--art-scrollbar-background` | `rgba(255, 255, 255, 0.25)` | WebKit scrollbar thumb color |
| `--art-scrollbar-background-hover` | `rgba(255, 255, 255, 0.5)` | Hovered WebKit scrollbar thumb color |
| `--art-mini-progress-height` | `2px` | Retained historical value; current core styles do not consume it |

### Mode overrides and measured layout {#css-variable-modes}

The mobile class changes bottom-gap to 10px, control-height to 38px, control-icon-scale to 1, state-size to 60px, settings/selector-max-height to 180px, indicator-scale to 1, and control-opacity to 1. Fullscreen styles change progress-height to 8px, indicator-size to 20px, control-height to 60px and control-icon-scale to 1.3; web fullscreen reuses those styles. When classes overlap, specificity and stylesheet order decide the result, and explicit inline values can suppress these mode defaults. These are style changes, not device or fullscreen-capability detection.

The control-layout observer additionally writes '--art-controls-height' from the rendered control area's offsetHeight. Subtitle and panel positioning use that measurement, falling back to '--art-control-height'. It is an internal measured value, not one of the 43 declared input variables; manual writes can be replaced by a later resize observation. Changing CSS dimensions does not change layout constants such as SETTING_ITEM_HEIGHT or configure player features.

'--art-mini-progress-height' remains declared with a 2px default for compatibility, but has no current core consumer. The mini progress presentation uses the normal progress/control geometry; changing that unused variable alone has no effect.


```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player' });
const opacity: string = art.cssVar('--art-control-opacity');
const result: string | void = art.cssVar('--art-control-opacity', '0');
art.cssVar('--art-fullscreen-web-index', '10001');
art.theme = 'green';
const theme: string = art.theme;
art.template.$player?.style.removeProperty('--art-control-opacity');
void [opacity, result, theme];
```

## `quality`

-   Type: `Setter`
-   Parameter: `Array`

Dynamically set the quality list.

<div className="run-code">▶ Run Code</div>

```js{19-29}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
	quality: [
		{
			default: true,
			html: 'SD 480P',
			url: '/assets/sample/video.mp4',
		},
		{
			html: 'HD 720P',
			url: '/assets/sample/video.mp4',
		},
	],
});

art.on('ready', () => {
	setTimeout(() => {
		art.quality = [
			{
				default: true,
				html: '1080P',
				url: '/assets/sample/video.mp4',
			},
			{
				html: '4K',
				url: '/assets/sample/video.mp4',
			},
		];
	}, 3000);
})

```

## `thumbnails`

-   Type: `Setter/Getter`
-   Parameter: `Object`

Dynamically set thumbnails.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.thumbnails = {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
    };
});
```

## `subtitleOffset`

-   Type: `Setter/Getter`
-   Parameter: `Number`

Dynamically set subtitle offset.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
});

art.on('ready', () => {
    art.subtitleOffset = 1;
});
```