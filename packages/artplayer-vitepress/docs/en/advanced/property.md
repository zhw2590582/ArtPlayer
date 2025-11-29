# Instance Properties

Here, `Instance Properties` refer to the `first-level properties` mounted on the `instance`, which are commonly used.

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

Toggle video playback and pause.

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

Destroy the player. Accepts a parameter indicating whether to remove the player's `html` after destruction. Defaults to `true`.

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

Fast forward the video time, in seconds.

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

Sets and gets whether the video is muted.

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

Sets and gets the current playback time of the video. Setting the time is similar to `seek`, but it does not trigger additional events.

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

Some videos may not have a duration, such as live streams or videos that have not been fully decoded. In these cases, the obtained duration will be `0`.

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

Sets and gets the player's window fullscreen state.

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

Due to browser security mechanisms, the page must have prior user interaction (e.g., the user has clicked on the page) before triggering window fullscreen.

:::

## `fullscreenWeb`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Sets and gets the player's web page fullscreen state.

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

Sets and gets the player's Picture-in-Picture mode.

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

Due to browser security mechanisms, the page must have prior user interaction (e.g., the user has clicked on the page) before triggering Picture-in-Picture.

:::

## `poster`

-   Type: `Setter/Getter`
-   Parameter: `String`

Sets and gets the video poster. The poster effect is only visible before video playback starts.

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

Gets or sets the player's current state. Supported values: `standard` (normal), `mini` (mini window), `pip` (picture-in-picture), `fullscreen` (fullscreen window), `fullscreenWeb` (webpage fullscreen).

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.state); // Default: standard
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

These properties provide shortcut access to `rect`:

- `bottom`, `top`, `left`, `right`, `x`, `y`: Correspond to the fields of the same name in `DOMRect`
- `width`, `height`: The player's current visible width and height

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

Sets and gets the player flip state. Supported values: `normal`, `horizontal`, `vertical`.

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

Sets and gets the player's playback rate.

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

When the container only has a defined width, this property can automatically calculate and set the video height.

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

This property is useful when your container has only a defined width but an unknown height. It automatically calculates the video height, but you need to determine the appropriate timing to set this property.

:::

## `attr`

-   Type: `Function`
-   Parameter: `String`

Dynamically gets and sets attributes of the video element.

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

Dynamically gets and sets the video type.

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

Dynamically gets and sets the player's theme color.

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

Initiates AirPlay.

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

The proportion of the video that has been buffered, ranging from `[0, 1]`. Often used with the `video:timeupdate` event.

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

The amount of media that has been buffered, in seconds. Typically used alongside `loaded` to display detailed buffering progress.

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

The proportion of the video that has been played, ranging from `[0, 1]`. Often used with the `video:timeupdate` event.

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

A proxy function for `DOM` events, essentially proxying `addEventListener` and `removeEventListener`. When using `proxy` to handle events, the event is automatically removed when the player is destroyed.

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

If you need `DOM` events to exist only for the duration of the player's lifecycle, it is strongly recommended to use this function to avoid memory leaks.

:::

## `query`

-   Type: `Function`

A `DOM` query function, similar to `document.querySelector`, but the search is scoped to the current player instance, preventing errors from duplicate class names.

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

## `cssVar`

-   Type: `Function`

Dynamically gets or sets CSS variables.

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

## `quality`

-   Type: `Setter`
-   Parameter: `Array`

Dynamically sets the list of available quality levels.

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

## `thumbnails`

-   Type: `Setter/Getter`
-   Parameter: `Object`

Dynamically set thumbnails

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

Dynamically set subtitle offset

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