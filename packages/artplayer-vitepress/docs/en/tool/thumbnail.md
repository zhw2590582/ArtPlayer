# Local video thumbnail tool

[简体中文](../../tool/thumbnail.md)

Generate a PNG thumbnail sheet from a selected local video, then download it or use it with the player's thumbnails option. This is a standalone constructor, not the Auto Thumbnail plugin. This page describes the unreleased branch and its approved compatibility modes.

## Install and example

```sh
yarn add artplayer-tool-thumbnail
```

ESM uses `import ArtplayerToolThumbnail from 'artplayer-tool-thumbnail'`. Scripts load `dist/artplayer-tool-thumbnail.js`, exposing `ArtplayerToolThumbnail`. The tool does not depend on the player; the [original example](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=tool.thumbnail) below uses this site's DOM and ArtPlayer to display the result:

<div className="run-code" data-libs="./uncompiled/artplayer-tool-thumbnail/index.js">▶ Run Code</div>

```js
if (window.lastThumbnail) {
    window.lastThumbnail.destroy();
}

var $popups = document.querySelector('.popups');
var $popinner = document.querySelector('.popinner');
var $artplayer = document.querySelector('.artplayer-app');

$artplayer.innerHTML = 'Drop video file here or click to upload.';
var thumbnail = new ArtplayerToolThumbnail({
    fileInput: $artplayer,
    number: 60, // 数量
    width: 160, // 宽度
    column: 10, // 列数
    begin: 0, // 开始
    end: NaN, // 结束
});

window.lastThumbnail = thumbnail;

thumbnail.on('file', function (file) {
    console.log('Read video successfully: ' + file.name);
});

thumbnail.on('video', function (video) {
    console.log('Video size: ' + video.videoWidth + ' x ' + video.videoHeight);
    console.log('Video duration: ' + video.duration + 's');
    thumbnail.start();
});

thumbnail.on('canvas', function (canvas) {
    console.log('Build canvas successfully');
    console.log('Canvas size: ' + canvas.width + ' x ' + canvas.height);
    console.log('Preview density: ' + thumbnail.density + ' p/s');
});

thumbnail.on('update', function (url, percentage) {
    console.log('Processing: ' + Math.floor(percentage.toFixed(2) * 100) + '%');
    $popups.style.display = 'flex';
    $popinner.style.backgroundImage = 'url(' + url + ')';
});

thumbnail.on('download', function (name) {
    console.log('Start download preview: ' + name);
});

thumbnail.on('done', function () {
    $popups.style.display = 'none';
    thumbnail.download();
    console.log('Build preview image complete');

    [...Artplayer.instances].forEach(function (art) {
        art.destroy(true);
    });

    new Artplayer({
        container: $artplayer,
        url: thumbnail.videoUrl,
        autoSize: true,
        poster: thumbnail.thumbnailUrl,
        thumbnails: {
            url: thumbnail.thumbnailUrl,
            number: thumbnail.option.number,
            column: thumbnail.option.column,
        },
    });

    console.log('Build player complete');
});
```

File selection loads the video without automatically extracting images; the example calls start from the video event. Application code should handle both synchronous start errors and Promise rejection. The video notification does not guarantee metadata readiness; start waits for it. Subscribe before loading, especially with synchronous workspace-mode notifications.

## Options and defaults

Successful construction needs fileInput: an existing file input or an Element upload wrapper. Missing input throws synchronously even though the type allows omitted constructor options. A wrapper receives an owned transparent input; caller inputs remain caller-owned. Selection/drop reads only the first file.

| Field | Default | Meaning |
| --- | --- | --- |
| `fileInput` | Required for construction | File input or upload wrapper |
| `compatibility` | published-3.5 behavior | Alternatively choose `workspace-4.4` |
| `number` | `60` | Frame count, numerically clamped to10–1000 |
| `width` | `160` | Frame width, clamped to10–1000 |
| `height` | `90` | Fixed default-mode height, clamped to10–1000 |
| `column` | `10` | Columns, clamped to1–1000 |
| `begin` | `0` | Start time in seconds |
| `end` | `NaN` | End time in seconds; NaN/0 uses media duration |
| `delay` | `300` | Default-mode milliseconds, clamped to10–1000 |

Use valid finite dimensions and integer counts/columns; historical numeric checks are not integer validation. Start normalizes the interval against media duration and requires end greater than begin, finite duration and `number / intervalSeconds <= 1`. The default60 frames therefore needs an interval of at least60 seconds; change the count for shorter files.

| Behavior | Default / published-3.5 | workspace-4.4 |
| --- | --- | --- |
| Height | Keep configured height | Derive from video aspect ratio at start and update option.height |
| video event | After src assignment plus delay | Synchronously after src assignment |
| Frame wait | Policy delay after each seek plus frame readiness | Frame readiness without a fixed extra delay |
| done | Another delay × 2 after the last update | No fixed final wait |
| Input value | Retained | Cleared after reading the selected file |

Consumers of unpublished4.4 workspace behavior add `compatibility: 'workspace-4.4'`; this mode ignores delay. Static DEFAULTS returns a fresh default object including published delay on every access, regardless of instance mode. Browser scheduling means delays are not exact timestamps.

## Methods, state and output

| Method | Behavior |
| --- | --- |
| `setup(options?)` | Merge partial options, retain extra fields and transfer input listeners when needed; returns this |
| `loadVideo(file?)` | Accept File; absent input is a no-op; check canPlayType and create a Blob URL |
| `start()` | One extraction job returning `Promise<void>`; duplicates and ready-metadata preflight can throw synchronously |
| `creatScreenshotDate()` | Historical spelling; return `{ time, x, y }[]`, with time in seconds |
| `creatCanvas()` | Historical spelling; create the sheet with black background and footer text |
| `download()` | Trigger PNG download when idle with file/image available; returns this, throws if not ready |
| `inputChange(event)` / `ondrop(event)` | Bound input handlers, normally installed by the tool |
| `errorHandle(condition, message)` | Emit error and throw when the condition fails |
| `destroy()` | Synchronous, idempotent cancellation and owned-resource cleanup |

Static creatVideo creates an offscreen muted/controls video in the document; callers invoking it directly own that extra node. Static ondragover calls preventDefault. Historical creat* names remain unchanged.

Fields include processing, option, video, duration, density, file, videoUrl, thumbnailUrl and optional event registry e. Duration is the selected interval, not necessarily full media duration; density is frames per interval second. File/URLs/density may be absent before their operation. Canvas listeners observe processing=false, update listeners true, and done listeners false.

Frames sample interval midpoints: `begin + (i + 0.5) * duration / number`. Sheet width is width × column; height is ceil(number / column) × height + 30. The30px footer retains source/layout text. Fractional coordinates keep historical behavior. Each frame produces a PNG update; previous thumbnail Blob URLs are revoked, leaving the latest thumbnailUrl. Download naming removes the last extension segment and adds `.png`; extensionless names retain the historical `.png` result.

## Events and cleanup

on/once/emit/off return this. The third on/once argument sets callback this. off(name) removes all listeners for that event; off(name, callback) removes matches. Custom string, number and symbol events are supported. A listener exception stops the remaining callbacks in that dispatch.

| Event | Arguments and timing |
| --- | --- |
| `file` | File, synchronously before video.src assignment |
| `video` | HTMLVideoElement; timing depends on mode |
| `canvas` | HTMLCanvasElement before extraction |
| `update` | Latest URL and0–1 progress |
| `done` | No arguments, before the start Promise resolves |
| `download` | Filename after link click; not proof of completed disk writing |
| `error` | Usually a message string; user callback failures can carry other values |
| `destroy` | No arguments, once after resource cleanup |

Start can wait for the first file selection with no new metadata deadline. Replacing an existing source or destroying the instance rejects old work with AbortError without an error event for cancellation. Source, seek, draw, encoding and callback failures settle the job. Stale callbacks cannot update a newer result.

Destroy removes the owned video/generated input/listeners/Blob URLs and restores wrapper position if the tool still owns that write. Caller inputs and the emitter registry remain. Cleanup attempts all steps, then throws its first failure. Destroyed instances cannot recreate input/source resources; start rejects cancellation. Keep the tool alive while a player depends on videoUrl/thumbnailUrl: those URLs remain tool-owned.

MIME canPlayType, actual decoding, Canvas encoding and Blob URL support are separate conditions. Windows WebKit has a recorded native Blob-loading gap; successful guide navigation or HTTP video playback is not proof of local-file extraction.

## TypeScript

Root and `/legacy` share one class declaration, with no `/runtime` or runtime `.default` self-alias. CommonJS TS supports `import Thumbnail = require('artplayer-tool-thumbnail')`; ESM uses default/type imports:

```ts
import Thumbnail, { type Option } from 'artplayer-tool-thumbnail';

function createTool(input: HTMLInputElement) {
  const options: Option = { fileInput: input, number: 10, height: 90 };
  const tool = new Thumbnail(options);
  tool.on('update', (url, progress) => console.log(url, progress));
  tool.on('video', () => {
    void (async () => {
      try { await tool.start(); }
      catch (error) { console.error(error); }
    })();
  });
  return tool;
}
```

Types include SheetOptions, Compatibility, DefaultOptions, Option, ResolvedOption, ScreenshotPoint, Events, EventArgs, Listener and EventRegistry. Known events have precise arguments; custom protocols remain application-defined. The old workspace referenced a missing declaration, so the new types are not claimed as a recovered historical TS baseline. Missing complete old npm archives and rollback acceptance remain separately tracked.
