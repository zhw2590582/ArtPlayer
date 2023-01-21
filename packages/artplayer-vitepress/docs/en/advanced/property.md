# Instance Property

The `Instance Property` here refers to the `Primary Property` attached to the `Instance`, which is more commonly used

## `play`

-   Type: `Function`

Play video

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

Pause video

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

Toggle video playback and pause

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

To destroy the player, accept a parameter indicating whether to remove the player's html after destruction. The default value is `true`

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

## `seek`

-   Type: `Setter`
-   Parameter: `Number`

Video time jump in seconds

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

Video time fast forward in seconds

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

Video time rewind in seconds

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

Set and get video volume, range: `[0, 1]`

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

Set and get video url

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

## `switchUrl`

-   Type: `Function`
-   Parameter: `String`

Setting the video url is similar to that of `url`, but some optimization operations will be performed

The function supports two parameters, the first is the new video url, and the second is the optional new video name

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switchUrl('/assets/sample/video.mp4?t=0', 'New Video Name');
    }, 3000);
});
```

## `switchQuality`

-   Type: `Function`
-   Parameter: `String`

Set the video quality address, similar to `switchUrl`, but with the previous playback progress

The function supports two parameters, the first is the new video url, and the second is the optional new video name

<div className="run-code">▶ Run Code</div>

```js{9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.seek = 10;
    setTimeout(() => {
        art.switchQuality('/assets/sample/video.mp4?t=0', 'New Video Name');
    }, 3000);
});
```

## `muted`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Set and get whether the video is muted

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

Set and get the current time of the video. Setting the time is similar to `seek`, but it will not trigger additional events

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

Get video duration

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

:::warning Tip

Some videos have no duration, such as live videos or videos that have not been decoded. The duration obtained at this time will be `0`

:::

## `screenshot`

-   Type: `Function`

Download a screenshot of the current video frame

<div className="run-code">▶ Run Code</div>

```js{7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.screenshot();
});
```

## `getDataURL`

-   Type: `Function`

Get the `base64` address of the screenshot of the current video frame, and return a `Promise`

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

Get the `blob` address of the screenshot of the current video frame, and return a `Promise`

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

Set and get full screen of player window

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

:::warning Tip

Due to the browser security mechanism, the page must have interaction before triggering the full screen of the window (for example, the user has clicked on the page)

:::

## `fullscreenWeb`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Set and get full screen of player web page

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

Set and get the picture-in-picture mode of the player

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

:::warning Tip

Due to the browser security mechanism, before triggering picture-in-picture, the page must have interaction (for example, the user has clicked on the page)

:::

## `poster`

-   Type: `Setter/Getter`
-   Parameter: `String`

Set and obtain video posters. You can only see the poster effect before the video is played

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

Set and get player mini mode

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

Get whether the video is playing

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

## `autoSize`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

Set whether the video is adaptive size. After setting it to `true`, it will only be executed once

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.autoSize);
    art.autoSize = true;
    console.info(art.autoSize);
});
```

## `rect`

-   Type: `Getter`

Get the size and coordinate information of the player

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

:::warning Tip

Dimension and coordinate information are obtained through `getBoundingClientRect`

:::

## `flip`

-   Type: `Setter/Getter`
-   Parameter: `String`

Set and get player rollover, support `normal`,  `horizontal`,  `vertical`

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

Set and get player playback speed

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

Set and obtain the player aspect ratio

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

## `loop`

-   Type: `Setter/Getter`
-   Parameter: `Array`

Set and obtain interval sequential playback in seconds

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.loop);
    art.loop = [5, 10];
    console.info(art.loop);
});
```

:::warning Tip

To delete interval looping, just set `loop` to `[]`

`art.loop` and `art.option.loop` aer two different things, please don't mix them up

:::

## `autoHeight`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

When the container has only width, this attribute can automatically calculate and set the height of the video. After it is set to `true`, it will only be executed once

<div className="run-code">▶ Run Code</div>

```js{7,11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.autoHeight = true;
});

art.on('resize', () => {
    art.autoHeight = true;
});
```

:::warning 提示

This attribute is useful when your container has only width but does not know the specific height. It can automatically calculate the height of the video, but you need to determine the time to set this attribute

:::

## `attr`

-   Type: `Function`
-   Parameter: `String`

Get and set the attributes of the video element dynamically

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

## `title`

-   Type: `Setter/Getter`
-   Parameter: `String`

Get and set player titles dynamically

<div className="run-code">▶ Run Code</div>

```js{8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.title);
    art.title = 'New Title';
    console.info(art.title);
});
```

## `type`

-   Type: `Setter/Getter`
-   Parameter: `String`

Get and set video types dynamically

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

Get and set player theme color dynamically

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

Enable airplay

<div className="run-code">▶ Run Code</div>

```js{10}
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

The proportion of video cache, with the range of `[0, 1]`, is often used in conjunction with the `video:timeupdate` event

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

## `played`

-   Type: `Getter`

The proportion of video playback, with the range of `[0, 1]`, is often used in conjunction with the `video:timeupdate` event

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

The proxy function of DOM event essentially proxies `addEventListener` and `removeEventListener`. When `proxy` is used to process the event, the player will also automatically destroy the event when it is destroyed

<div className="run-code">▶ Run Code</div>

```js{7-10}
var container = document.querySelector('.artplayer-app');

var art = new Artplayer({
	container: container,
	url: '/assets/sample/video.mp4',
});

art.proxy(container, 'click', event => {
	console.info(event);
});
```

:::warning Tip

If you need some DOM events only exist in the life cycle of the player, we strongly recommend using this function to avoid memory leakage

:::

## `query`

-   Type: `Function`

The query function of DOM is similar to `document.querySelector`, but the queried object is limited to the current player, which can avoid errors of the same class name

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

Return the `video` element of the player

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
	container: '.artplayer-app',
	url: '/assets/sample/video.mp4',
});

console.info(art.video);
```