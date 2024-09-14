# 实例属性

这里的 `实例属性` 是指挂载在 `实例` 的 `一级属性`，比较常用

## `play`

-   Type: `Function`

播放视频

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

暂停视频

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

切换视频的播放和暂停

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

销毁播放器，接受一个参数表示是否销毁后同时移除播放器的 `html`，默认为 `true`

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

视频时间跳转，单位秒

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

视频时间快进，单位秒

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

视频时间快退，单位秒

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

设置和获取视频音量，范围在：`[0, 1]`

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

设置和获取视频地址

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

设置视频地址，设置时和 `art.url` 类似，但会执行一些优化操作

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

设置视频地址，设置时和 `art.url` 类似，但会执行一些优化操作

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

:::warning 提示

`art.switch` 和 `art.switchUrl` 的功能是一样的，只是 `art.switchUrl` 方法会返回 `Promise`，当 `resolve` 时表示新地址是可以播放，`reject` 时表示新地址加载错误

:::

## `switchQuality`

-   Type: `Function`
-   Parameter: `String`

设置视频画质地址，和 `art.switchUrl` 类似，但会带上之前的播放进度

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

设置和获取视频是否静音

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

设置和获取视频当前时间，设置时间时和 `seek` 类似，但它不会触发额外的事件

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

获取视频时长

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

:::warning 提示

有的视频是没有时长的，例如直播中的视频或者没被解码完成的视频，这个时候获取的时长会是 `0`

:::

## `screenshot`

-   Type: `Function`

下载当前视频帧的截图, 可选参数为截图名字

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

获取当前视频帧的截图的`base64`地址，返回的是一个 `Promise`

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

获取当前视频帧的截图的`blob`地址，返回的是一个 `Promise`

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

设置和获取播放器窗口全屏

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

:::warning 提示

由于浏览器安全机制，触发窗口全屏前，页面必须先存在交互（例如用户点击过页面）

:::

## `fullscreenWeb`

-   Type: `Setter/Getter`
-   Parameter: `Boolean`

设置和获取播放器网页全屏

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

设置和获取播放器画中画模式

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

:::warning 提示

由于浏览器安全机制，触发画中画前，页面必须先存在交互（例如用户点击过页面）

:::

## `poster`

-   Type: `Setter/Getter`
-   Parameter: `String`

设置和获取视频海报，只有在视频播放前才能看到海报效果

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

设置和获取播放器迷你模式

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

获取视频是否正在播放中

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

-   Type: `Function`

设置视频是否自适应尺寸

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

获取播放器的尺寸和坐标信息

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

:::warning 提示

尺寸和坐标信息是通过 `getBoundingClientRect` 获取的

:::

## `flip`

-   Type: `Setter/Getter`
-   Parameter: `String`

设置和获取播放器翻转，支持`normal`,  `horizontal`,  `vertical`

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

设置和获取播放器播放速度

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

设置和获取播放器长宽比

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

当容器只有宽度，该属性可以自动计算出并设置视频的高度

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

:::warning 提示

当你的容器只有宽度，但不知道具体高度时，这个属性很有用，它能自动计算出视频的高度，但你需要确定设置这个属性的时机

:::

## `attr`

-   Type: `Function`
-   Parameter: `String`

动态获取和设置 video 元素的属性

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

动态获取和设置视频类型

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

动态获取和设置播放器主题颜色

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

开启隔空播放

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

视频缓存的比例，范围是 `[0, 1]`，常配合 `video:timeupdate` 事件使用

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

视频播放的比例，范围是 `[0, 1]`，常配合 `video:timeupdate` 事件使用

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

`DOM` 事件的代理函数，实质上代理了 `addEventListener` 和 `removeEventListener`, 当使用 `proxy` 来处理事件，播放器销毁时也会自动销毁该事件

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

:::warning 提示

假如你需要一些 `DOM` 事件只存在于播放器的生命周期上时，强烈建议使用该函数，以避免造成内存泄漏

:::

## `query`

-   Type: `Function`

`DOM` 的查询函数，类似 `document.querySelector`，但被查询的对象局限于当前播放器内，可以避免同类名的错误

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

快捷返回播放器的 `video` 元素

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

动态获取或设置 `css` 变量

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

动态设置画质列表

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

动态设置缩略图

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

动态设置字幕偏移

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