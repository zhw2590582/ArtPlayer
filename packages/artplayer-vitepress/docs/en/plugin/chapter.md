# Video chapters

[简体中文](../../plugin/chapter.md)

Divide the progress bar into chapters and display a title on hover while retaining the player's seeking and thumbnail controls. The plugin does not extract chapter metadata from the media file; your application supplies the times.

This page describes the refactor branch. Its candidates and fixes are not published yet. The online example and unpinned npm/CDN packages may use different code.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-chapter
```

```js
import Artplayer from 'artplayer';
import artplayerPluginChapter from 'artplayer-plugin-chapter';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-chapter.js`. The plugin global is `artplayerPluginChapter`. The following code is unchanged from the [online chapter example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter). The site provides its container, video and thumbnail image; replace those resources when integrating it into your application.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-chapter/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-chapter
// import artplayerPluginChapter from 'artplayer-plugin-chapter';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  miniProgressBar: true,
  autoOrientation: true,
  thumbnails: {
    url: '/assets/sample/thumbnails.png',
    number: 60,
    column: 10,
  },
  plugins: [
    artplayerPluginChapter({
      chapters: [
        { start: 0, end: 18, title: 'One more chance' },
        { start: 18, end: 36, title: '谁でもいいはずなのに' },
        { start: 36, end: 54, title: '夏の想い出がまわる' },
        { start: 54, end: 72, title: 'こんなとこにあるはずもないのに' },
        { start: 72, end: Infinity, title: '终わり' },
      ],
    }),
  ],
})
```

## chapters

The factory accepts an optional options object containing `chapters`. Each entry has these fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `start` | `number` | Start time in seconds; a finite, nonnegative number |
| `end` | `number` | End time in seconds; `Infinity` means the current video's end |
| `title` | `string` | Hover title; an empty string retains an untitled interval |

Every interval must satisfy `start < end <= video duration`, without overlapping the next chapter. The plugin sorts chapters by start time and fills uncovered intervals at the beginning, end and between chapters. It **mutates the supplied array** by sorting it, inserting untitled entries and replacing `Infinity` with the current duration. Pass a fresh array and fresh entry objects whenever you need to preserve the original configuration.

Chapters are created only when the media duration is finite and positive. Missing, empty or non-array input clears the view; TypeScript still accepts only the declared array type. Invalid field types throw `TypeError`; invalid times and overlapping intervals throw `Error`. Titles are plain text, not HTML. Displayed titles are trimmed without changing the original object's `title`.

## update

The result has the fixed `name` of `artplayerPluginChapter`. `update(option)` replaces the chapters synchronously and returns `undefined`. Its options object is required; `update({})` clears the chapters:

```js
art.plugins.artplayerPluginChapter.update({
    chapters: [{ start: 0, end: Infinity, title: 'Introduction' }],
});

// Clear all chapter segments and the hover title.
art.plugins.artplayerPluginChapter.update({});
```

An update clears the previous view before validating the replacement. If validation throws, the previous chapters are not retained. A successful update synchronously emits the existing `setBar('loaded', ...)` event; progress interactions continue to use the core controls.

The initial configuration is applied only on the first `video:loadedmetadata`. Switching media does not calculate new chapters automatically. After the new media loads, call `update` with fresh data for its duration. Do not reuse an object whose `Infinity` end was already replaced by the previous duration.

## Lifecycle and styling

Destroying the player removes this plugin's listeners, chapter nodes, title and `artplayer-plugin-chapter` class, including when `art.destroy(false)` retains the player HTML. Calling `update` on a retained result after destruction does not recreate the view. There is no separate plugin `destroy()` method.

The existing `.art-chapter`, `.art-chapter-title` and chapter `data-start/end/duration/title` hooks remain. Long titles are clipped to the progress bar width, while their full text remains in the text content and data attributes. The stylesheet is shared by the page and is retained when one player is destroyed.

## TypeScript

The root and `/legacy` entries share the public API and export the `Chapters`, `Option` and `Result` types. This package does not require a separate `/runtime` entry:

```ts
import artplayerPluginChapter from 'artplayer-plugin-chapter';
import type { Chapters } from 'artplayer-plugin-chapter';

const chapters: Chapters = [{ start: 0, end: Infinity, title: 'Introduction' }];
const installChapters = artplayerPluginChapter({ chapters });
```

Desktop tests cover chapters with quality selection, thumbnails and fullscreen. They do not establish support on every mobile device. The current Windows WebKit quality-switch tests still encounter stalls while reading browser state, so this page does not promise timing reliability on every platform.
