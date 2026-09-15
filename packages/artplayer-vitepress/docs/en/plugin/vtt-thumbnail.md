# VTT Thumbnail

[中文](../../plugin/vtt-thumbnail.md)

Load a WebVTT thumbnail index and show the selected sprite region when hovering over the progress bar. Generate the index and images beforehand; this plugin does not scan the video or require another SDK.

This page describes the current refactor branch. Parser and lifecycle fixes and the precise `/runtime` types are not published yet. An unpinned npm or CDN installation is not evidence of this branch's behavior.

## Installation

```sh
yarn add artplayer artplayer-plugin-vtt-thumbnail
```

```js
import Artplayer from 'artplayer';
import artplayerPluginVttThumbnail from 'artplayer-plugin-vtt-thumbnail';
```

For script loading, load ArtPlayer first, followed by `dist/artplayer-plugin-vtt-thumbnail.js`. The global is `artplayerPluginVttThumbnail`. Pin dependency versions and make the VTT and images accessible. Cross-origin VTT requests require appropriate server CORS headers.

## Complete example

This is the exact code from the [online thumbnail example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail). The demo site supplies the media and `.artplayer-app` container; replace them in your application.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-vtt-thumbnail/index.js"></div>

```js
// npm i artplayer-plugin-vtt-thumbnail
// import artplayerPluginVttThumbnail from 'artplayer-plugin-vtt-thumbnail';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/bbb-video.mp4',
  plugins: [
    artplayerPluginVttThumbnail({
      vtt: '/assets/sample/bbb-thumbnails.vtt',
    }),
  ],
})
```

## Options

The options object passed to `artplayerPluginVttThumbnail(option)` is required.

| Field | Type | Behavior |
| --- | --- | --- |
| `vtt` | `string`, optional in the declaration | VTT file URL. Supply a valid URL in practice: omission fetches an empty URL, meaning the current page, rather than disabling the plugin. |
| `style` | Optional `Partial<CSSStyleDeclaration>` | Initial inline styles on the thumbnail control, such as `borderRadius: '4px'`. |

Rendering updates display, width, height, left, backgroundImage and backgroundPosition. Initial styles cannot permanently override these properties. Each cue supplies the crop dimensions; the plugin does not automatically scale the sprite.

## Index format and image paths

```text
WEBVTT

00:00.000 --> 00:05.000
bbb-sprite.jpg#xywh=0,0,128,72

00:05.000 --> 00:10.000
bbb-sprite.jpg#xywh=128,0,128,72
```

The four values `x,y,w,h` are the left position, top position, width and height within the image, in pixels. x/y must be nonnegative and w/h positive; all four must be finite numbers. Each cue has one image URL line with a crop fragment. Ordinary subtitle text is not a thumbnail index.

Relative images are joined to the directory of the **supplied VTT URL**. For example, `bbb-sprite.jpg` inside `/assets/sample/bbb-thumbnails.vtt` becomes `/assets/sample/bbb-sprite.jpg`. Root-relative URLs and full URLs with supported protocols are kept as supplied. The directory is not recalculated from a redirected HTTP response URL. Prefer explicit image URLs when redirects or complex relative paths are involved.

The parser supports a BOM, common line endings, optional cue identifiers and timing settings, and skips NOTE, STYLE and REGION blocks. It is a thumbnail index parser, not a complete WebVTT subtitle layout engine.

## Timing and display boundaries

For historical compatibility, start and end times are rounded down to whole seconds. Both interval endpoints are included, and the first matching cue in file order wins. At exactly 5 seconds in the example above, the first image still applies; the second appears after 5 seconds. Do not assume millisecond precision or exclusive end times.

Desktop hover selects a cue using the progress percentage multiplied by the video duration. Gaps hide the preview, and previews near the edges are aligned inward. The mobile path responds to progress dragging with an input event and hides about 500ms after the last drag update. Desktop coverage does not establish real touch-device support.

## Asynchronous registration, errors and cleanup

Registration fetches and parses the VTT and actually returns a Promise. Its success result contains only `name: 'artplayerPluginVttThumbnail'`. Installation through the constructor's plugins array is asynchronous; do not assume that the result is registered immediately after construction.

To wait explicitly and handle request or parse errors, call `art.plugins.add()` once after constructing the player:

```ts
import Artplayer from 'artplayer';
import thumbnails from 'artplayer-plugin-vtt-thumbnail/runtime';

const art = new Artplayer({
    container: '.artplayer-app',
    url: '/video/movie.mp4',
});

async function installThumbnails() {
    try {
        const result = await art.plugins.add(thumbnails({ vtt: '/video/movie.vtt' }));
        console.log(result.name);
    }
    catch (error) {
        console.error('Unable to load thumbnails', error);
    }
}
void installThumbnails();
```

Request and format errors reject registration; format errors include a line number. Registration completion establishes that the VTT was parsed and the control created, not that every image has decoded. Images load when the browser displays them; a later image failure does not reject an already settled registration Promise.

There is no update, reload or independent destroy method. Switching the main video does not refetch the VTT. For a different video and thumbnail set, you can destroy and recreate the player. Removing a control is not a complete uninstall; repeated installation is not an update API.

Destroying the player cancels outstanding requests where AbortController is available, settles canceled registration, removes owned listeners and timers, and removes the control only if this installation still owns it. Cancellation still returns the name object, so the name alone does not prove an image is available. Late requests cannot remount the interface.

## TypeScript compatibility

The root and `/legacy` entrances preserve the latest published 1.1.0 synchronous return declaration and replacement-function shape, although registration is asynchronous at runtime. The `/runtime` entrance above uses the same JavaScript implementation and accurately declares the Promise and runtime `.default` self-alias. It also exposes `Option`, `Result`, `Factory` and `RuntimeFactory` types.

The older 1.0.x `export =` shape cannot preserve the same type extraction as the 1.1.0 default export. TypeScript consumers relying on those earlier CommonJS declarations should migrate to `/runtime`. NodeNext ESM consumers should also prefer this entrance to avoid the historical namespace shape retained by the root. Legal older JavaScript calls and distribution file entrances remain available.

Browser checks cover cropping and cleanup with published and candidate cores. Complete mobile, plugin combination and release-artifact acceptance remains tracked separately.
