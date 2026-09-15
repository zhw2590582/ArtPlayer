# Automatic Thumbnails

[简体中文](../../plugin/auto-thumbnail.md)

Read frames with a separate video element, progressively create a JPEG sprite sheet in the browser, and update the player's progress-bar thumbnails. This page describes the unreleased refactor branch; the online example and unpinned npm/CDN packages are not the current candidate.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-auto-thumbnail
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAutoThumbnail from 'artplayer-plugin-auto-thumbnail';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-auto-thumbnail.js`; the global is `artplayerPluginAutoThumbnail`. This preserves the [original online example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-auto-thumbnail/index.js&example=auto.thumbnail). The factory requires an options object; use `{}` for defaults.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-auto-thumbnail/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-auto-thumbnail
// import artplayerPluginAutoThumbnail from 'artplayer-plugin-auto-thumbnail';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginAutoThumbnail({
      //
    }),
  ],
})
```

## Options and generation

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `url` | `string` | Current `art.option.url` | Media read by the separate decoder; an explicit nonempty URL takes precedence |
| `width` | `number` | `160` | Width of each thumbnail cell in pixels |
| `number` | `number` | `100` | Target sample count; normally use a positive integer |
| `scale` | `number` | `1` | Preview display scale passed to the player; does not reduce the generated canvas size |
| `height` | `number` | Derived from video aspect ratio | Historical ignored option accepted by the precise runtime type |

Defaults preserve `value || default` behavior: `width: 0`, for example, uses 160. After fallback, width and number must convert to finite positive values. Historical JavaScript numeric strings and fractional counts are retained, but typed examples use numbers and positive integer counts. Height is `Math.floor(width * videoHeight / videoWidth)`, with ten columns per row. Media needs finite positive duration and dimensions; infinite-duration live streams do not qualify.

Sampling uses `duration * index / number`, starting at index 0 and excluding the media endpoint. Duration and sheet dimensions are captured at the separate video's metadata event. Each drawn cell is followed by encoding the whole JPEG and publishing a new `art.thumbnails` configuration. Later cells can therefore remain empty while generation is in progress.

Larger width and count increase canvas allocation, decoding and repeated encoding cost. Dimension checks are not a browser memory budget. Choose values appropriate for the media and device, or use prebuilt [VTT thumbnails](./vtt-thumbnail.md).

## Registration, source changes and cleanup

The factory returns an asynchronous registrar whose result contains only `name: 'artplayerPluginAutoThumbnail'`. Its Promise resolves after installing player subscriptions, before extraction. It does not confirm that media was read successfully. There are no public progress, extraction-completion, update, stop or destroy methods.

Each `video:loadedmetadata` event starts extraction and rereads the original options object, so later mutations affect the next run. Installation does not replay metadata events that already occurred. `restart` cancels the old job; a subsequent metadata event starts another. Old frame or encoding callbacks cannot overwrite the newer job.

Metadata acquisition, each frame wait and each JPEG encoding operation have separate 30-second limits, not one total extraction deadline. Media, canvas and encoding failures clean up the current job, report through `console.warn` and retain the last usable preview. They cannot reject an already-resolved registration Promise.

Completion or cancellation releases the separate video and canvas. The final image URL remains until a usable replacement is installed or the player is destroyed. Only generated URLs are revoked; application-owned thumbnail URLs are not. Destroy also removes subscriptions. Directly invoking a retained registrar after player destruction returns the same name without allocating a decoder; it does not override core `plugins.add()` destruction checks.

## Media access and browser limits

The separate video uses `crossOrigin = 'anonymous'`, is muted, and is never explicitly played. Media must support native browser loading and Canvas pixel access, including appropriate server CORS headers. Player custom loaders, SDKs, request headers and proxies are not installed into this decoder; supply a directly readable media `url` when necessary.

The hidden video is attached to the document with a rendered box; it is not an additional visible player. Actual decoding and first-frame correctness remain browser-dependent. The current Windows WebKit first-frame issue is still unresolved. Types, navigation and other browser results do not close it or establish physical Safari/mobile support.

## Compatible TypeScript entries

The root and `/legacy` preserve npm 1.1.0 synchronous result declarations and required options; the root Option does not contain height. For the actual Promise, historical height input or `.default` self-alias types, use `/runtime`, which loads the same implementation:

```ts
import type Artplayer from 'artplayer';
import autoThumbnail from 'artplayer-plugin-auto-thumbnail/runtime';
import type { Option, Result } from 'artplayer-plugin-auto-thumbnail/runtime';

const options: Option = { width: 160, number: 100, scale: 1 };

async function registerThumbnails(art: Artplayer): Promise<Result> {
  return await autoThumbnail(options)(art); // Registration only, not extraction completion.
}
```

Runtime exports `Option`, `Result`, `Factory` and `RuntimeFactory`. Factory is a plain asynchronous factory; RuntimeFactory adds the writable `.default` self-alias. CommonJS runtime supports direct and `.default(...)` calls. Earlier 1.0.x `export =` and height declarations differ from 1.1.0; use the runtime `import = require` form when migrating those imports. Root NodeNext namespace behavior remains unchanged; use runtime for an accurate callable default import. Classic Node10 default imports need `esModuleInterop`.
