# Canvas video proxy

[简体中文](../../proxy/canvas.md)

Decode audio/video with a real video element, draw its picture to Canvas and optionally post-process each draw. Install through ArtPlayer's proxy option, not its plugins array. This page describes the unreleased branch; decoding, pixel access and device limitations still apply.

## Install and example

```sh
yarn add artplayer artplayer-proxy-canvas
```

ESM uses `import canvas from 'artplayer-proxy-canvas'`. Scripts load `dist/artplayer-proxy-canvas.js`, exposing `artplayerProxyCanvas`. The [original example](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas) is retained below:

<div className="run-code" data-libs="./uncompiled/artplayer-proxy-canvas/index.js">▶ Run Code</div>

```js
// npm i artplayer-proxy-canvas
// import artplayerProxyCanvas from 'artplayer-proxy-canvas';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  poster: '/assets/sample/poster.jpg',
  volume: 0.5,
  autoplay: false,
  autoSize: false,
  screenshot: true,
  setting: true,
  loop: true,
  flip: true,
  pip: true,
  playbackRate: true,
  aspectRatio: true,
  fullscreen: true,
  fullscreenWeb: true,
  miniProgressBar: true,
  autoPlayback: true,
  autoOrientation: true,
  subtitle: {
    url: '/assets/sample/subtitle.srt',
  },
  thumbnails: {
    url: '/assets/sample/thumbnails.png',
    number: 60,
    column: 10,
    scale: 0.85,
  },
  proxy: artplayerProxyCanvas(),
})
```

The optional argument is a drawing callback, not an options object:

```js
proxy: artplayerProxyCanvas((context, video) => {
  context.fillStyle = 'rgba(0, 0, 0, 0.4)';
  context.fillRect(0, 0, context.canvas.width, 32);
  context.fillStyle = '#fff';
  context.fillText(video.currentTime.toFixed(1), 10, 22);
})
```

It receives the actual CanvasRenderingContext2D and backing HTMLVideoElement. The base picture is drawn and any acquired ImageBitmap closed before the synchronous callback. Return values are unused; an async callback's Promise is not awaited. Set required Canvas state yourself; changing dimensions resets drawing state.

## Returned element and media surface

Initialization synchronously returns an actual HTMLCanvasElement for ArtPlayer's media position. The backing video is connected to the player before playback, transparent and unfocusable, without another visible player.

Native Canvas members win: width/height, DOM events, getContext and toDataURL remain Canvas operations. Only enumerated video members absent from Canvas are forwarded; this is not a complete runtime copy of HTMLVideoElement. Access the real video through the draw callback when needed.

Backing media events are forwarded as ArtPlayer `video:<type>` events with the original Event. Canvas addEventListener('play', ...) is not a backing-video listener; use art.on('video:play', ...). Assigning media src/srcObject or invoking load invalidates old draws.

Normal ArtPlayer subtitle options remain supported. The active proxy's appendChild specially routes HTML tracks to the video; ordinary nodes still belong to Canvas. Core owns subtitle track replacement and URLs. The initial empty metadata track is removed before the first real subtitle is attached. Its final parent is VIDEO.

## Drawing, dimensions and events

| Trigger | Behavior |
| --- | --- |
| Play | One RAF drawing chain without overlapping asynchronous acquisitions |
| Pause/source emptying | Cancel pending draws, keeping the displayed picture |
| Paused seek | Request one fresh picture |
| Resize | Coalesce requests and invalidate old asynchronous results |
| loadedmetadata | Set Canvas dimensions when intrinsic video size is valid |
| autoSize=false | Fit the video aspect ratio into the container with centering padding on resize |
| autoSize=true | Skip that proxy fit; let the player handle automatic sizing |

Drawing needs readyState>=2, no seek in progress, and valid video/Canvas dimensions. It uses createImageBitmap when available, otherwise drawImage(video). This does not guarantee a callback for every decoded frame. Cross-origin CORS settings/responses still determine screenshot and pixel-read access.

| Custom event | Arguments and order |
| --- | --- |
| `artplayerProxyCanvas:draw` | Context and backing video, after a successful callback |
| `artplayerProxyCanvas:error` | Original failure value from drawing, callback or initialization |

A missing2D context reports an error. The specific first-frame createImageBitmap InvalidStateError before decoding waits for another draw request; callback/drawImage errors are not broadly treated as first-frame delays. Destroying the player in the callback prevents a subsequent draw event or restarted loop.

## Cleanup and capabilities

Player destruction cancels RAF/deferred setup, removes internal subscriptions, pauses/unloads the video, clears srcObject and releases Canvas buffers. Late bitmaps are still closed. Clearing the stream reference does not stop caller-owned media tracks. Cleanup attempts all resources before throwing its first error. Escaped media methods/forwarded setters cannot restart playback or source loading; native Canvas methods still act on the same element.

There is no separate public start/stop/destroy control object; use ArtPlayer lifecycle. The original example's PiP/fullscreen/screenshot options remain subject to actual browser capabilities. Their presence is not proof of universal support, and Windows results do not establish Safari/iPhone/Android acceptance.

## TypeScript and historical types

Root and `/legacy` retain published1.1.0's optional callback, plain factory and exact HTMLCanvasElement result. Ordinary replacement functions remain assignable. The conflicting1.0 export= required-callback shape follows the approved latest-root policy. Use `/runtime` for accurate ESM/older CommonJS invocation and self-alias types with the same implementation:

```ts
import Artplayer from 'artplayer';
import canvas from 'artplayer-proxy-canvas/runtime';
import type { MediaCanvas, Option } from 'artplayer-proxy-canvas/runtime';

const overlay: Option = (context, video) => {
  context.fillText(video.currentTime.toFixed(1), 10, 22);
};
const art = new Artplayer({ container: '#player', url: '/movie.mp4', proxy: canvas(overlay) });
const media = art.template.$video as MediaCanvas;
function play(): Promise<void> { return media.play(); }
```

Public types are Option, Result, Factory, Callable, MediaCanvas and RuntimeFactory. MediaCanvas is an explicit view preserving native Canvas collisions; it adds no runtime capabilities and does not narrow factory return inference. The root's historical NodeNext ESM namespace remains; use runtime for accurate default calls. JavaScript root and `.default` reference the same factory; runtime types describe the alias as readonly. CommonJS can require the function directly, and older TS import=require callers can choose runtime.
