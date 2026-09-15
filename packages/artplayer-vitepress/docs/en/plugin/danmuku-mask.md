# Danmuku Mask

[简体中文](../../plugin/danmuku-mask.md)

Generate a CSS mask from person segmentation so danmuku avoids people in the video. The plugin masks the core `.art-danmuku` layer without changing its queue, individual items or video pixels. This describes the unreleased branch; the online example and navigation checks are not model-quality acceptance.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-danmuku artplayer-plugin-danmuku-mask
```

```js
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import artplayerPluginDanmukuMask from 'artplayer-plugin-danmuku-mask';
```

For scripts, load the core and both plugin dist files. Their globals are `artplayerPluginDanmuku` and `artplayerPluginDanmukuMask`. The [original example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js%0A./uncompiled/artplayer-plugin-danmuku-mask/index.js&example=danmuku.mask) registers them in that order and loads MediaPipe assets from the site's own directory:

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js&#10;./uncompiled/artplayer-plugin-danmuku-mask/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-danmuku-mask
// import artplayerPluginDanmukuMask from 'artplayer-plugin-danmuku-mask';

// npm i @mediapipe/selfie_segmentation
// 把 node_modules/@mediapipe/selfie_segmentation 目录复制到你的项目下

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/steve-jobs.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  autoOrientation: true,
  plugins: [
    artplayerPluginDanmuku({
      danmuku: '/assets/sample/danmuku.xml',
    }),
    artplayerPluginDanmukuMask({
      solutionPath: '/assets/@mediapipe/selfie_segmentation',
    }),
  ],
})
```

Host matching MediaPipe assets under solutionPath. Copying a directory alone does not establish script, model, WASM, network-policy or browser support.

## Options

Options may be omitted; values are captured at registration:

| Field | Type / default | Runtime use |
| --- | --- | --- |
| `solutionPath` | `string` | SDK asset root; default CDN URL is unversioned |
| `modelSelection` | `number` / `1` | Historical forwarded field, not proof that the current model changes |
| `smoothSegmentation` | `boolean` / `true` | Historical forwarded field; explicit false is retained |
| `minDetectionConfidence` | `number` / `0.5` | Historical forwarded field |
| `minTrackingConfidence` | `number` / `0.5` | Historical forwarded field |
| `selfieMode` | `boolean` / `false` | Historical forwarded field |
| `drawContour` | `boolean` / `false` | Passed to binary-mask conversion |
| `foregroundThreshold` | `number` / `0.5` | Passed to foreground threshold conversion |
| `opacity` | `number` / `1` | Passed to SDK drawMask, not directly applied as danmuku-layer opacity |
| `maskBlurAmount` | `number` / `3` | Blur argument passed to SDK drawMask |

The default solutionPath is the unversioned [MediaPipe asset root on jsDelivr](https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation).

Except for smoothSegmentation's undefined check, defaults retain `value || default`. Zero modelSelection, opacity, threshold or blur uses its default rather than disabling the effect. Use stop to disable masking.

The current selection is fixed to `runtime: 'mediapipe'` and `modelType: 'general'`. The installed adapter maps general to modelSelection 0 and ignores some extra forwarded fields. Their presence does not promise an inference change. TensorFlow first attempts webgl and tries cpu only on rejection; that does not establish MediaPipe's actual inference backend.

## Start, stop and failures

Registration synchronously returns `{ name: 'artplayerPluginDanmukuMask', start, stop }`, available at `art.plugins.artplayerPluginDanmukuMask`. The ready event starts it automatically; call start yourself if installed after ready.

| Method | Behavior |
| --- | --- |
| `start()` | Returns `Promise<void>` after initialization/scheduling, not after a complete first mask |
| `stop()` | Returns undefined synchronously; cancels scheduling and immediately sets layer maskImage to none |

Repeated start does not overlap inference loops. Stop during initialization settles public start promptly while uncancellable SDK work remains observed. Late results cannot update the mask. A subsequent start waits for old work and disposal before creating another model.

Model creation failure logs an error and can resolve start without a usable model; explicit start can retry. Backend or required DOM/Canvas initialization can still reject start. Automatic ready startup logs rejection. Inference/pixel errors log and continue scheduling while retaining the previous usable mask.

Inference runs only while video is playing, not ended, and has valid dimensions. Binary-mask conversion, drawMask and Canvas pixel processing produce a PNG data URL assigned to the whole layer. No-person results retain the preceding mask. Accuracy, performance and cross-origin pixel access need actual media checks.

## Lifecycle and types

Player destruction stops work and removes ready/destroy subscriptions. The plugin owns its private canvas; after SDK work settles it resets dimensions and disposes the model. Stop is not a GPU-release completion Promise. Private SDK disposal completion still needs separate evidence. There is no public destroy, update or new event, and no takeover of application-wide TensorFlow lifetime.

Root and `/legacy` retain optional options, synchronous registration, async start and sync stop. There is no `/runtime` subpath. Option/Result are private declaration types, extractable from the factory. This example is type-only extraction for NodeNext ESM; it does not call `.default` at runtime:

```ts
import type MaskModule from 'artplayer-plugin-danmuku-mask';

type MaskFactory = typeof MaskModule.default;
type MaskOptions = Parameters<MaskFactory>[0];
type MaskResult = ReturnType<ReturnType<MaskFactory>>;

const options: MaskOptions = { solutionPath: '/assets/@mediapipe/selfie_segmentation' };
async function restartMask(mask: MaskResult): Promise<void> {
  mask.stop();
  await mask.start();
}
```

The preserved NodeNext root declaration has namespace behavior; it does not give the current runtime factory a `.default` property. Current CommonJS calls the function directly, and ESM runtime uses its default export. Do not infer runtime aliases from the type namespace. Historical export forms, actual segmentation and device performance remain separate checks.
