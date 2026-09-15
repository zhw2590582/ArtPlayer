# Multiple Subtitles

[简体中文](../../plugin/multiple-subtitles.md)

Download several subtitle files, retain their individual cue times, and merge selected tracks into the player's subtitles. Display multiple languages and select or reorder them by name. This page describes the unreleased refactor branch; online examples and unpinned packages are not the current candidate.

## Installation and example

```sh
yarn add artplayer artplayer-plugin-multiple-subtitles
```

```js
import Artplayer from 'artplayer';
import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';
```

For script usage, load ArtPlayer before `dist/artplayer-plugin-multiple-subtitles.js`; the global is `artplayerPluginMultipleSubtitles`. The following preserves the [online example](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles), including its selection menu and styles. The application configures that menu; the plugin does not create one automatically.

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-multiple-subtitles/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-multiple-subtitles
// import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';

var art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  setting: true,
  plugins: [
    artplayerPluginMultipleSubtitles({
      subtitles: [
        {
          name: 'chinese',
          url: '/assets/sample/subtitle.cn.srt',
        },
        {
          name: 'japanese',
          url: '/assets/sample/subtitle.jp.srt',
        },
      ],
    }),
  ],
  settings: [
    {
      width: 200,
      html: 'Subtitle',
      tooltip: 'Double',
      icon: '<img width="22" height="22" src="/assets/img/subtitle.svg">',
      selector: [
        {
          html: 'Display',
          tooltip: 'Show',
          switch: true,
          onSwitch(item) {
            item.tooltip = item.switch ? 'Hide' : 'Show'
            // 显示/隐藏字幕
            // Show/hide subtitles
            art.subtitle.show = !item.switch
            return !item.switch
          },
        },
        {
          html: 'Reverse',
          tooltip: 'Off',
          switch: false,
          onSwitch(item) {
            item.tooltip = item.switch ? 'Off' : 'On'
            // 修改字幕顺序
            // Change the order of subtitles
            if (item.switch) {
              art.plugins.multipleSubtitles.tracks(['chinese', 'japanese'])
            }
            else {
              art.plugins.multipleSubtitles.tracks(['japanese', 'chinese'])
            }
            return !item.switch
          },
        },
        {
          default: true,
          html: 'Double',
          name: 'double',
        },
        {
          html: 'Chinese',
          name: 'chinese',
        },
        {
          html: 'Japanese',
          name: 'japanese',
        },
      ],
      onSelect(item) {
        if (item.name === 'double') {
          // 重置字幕
          // Reset subtitles
          art.plugins.multipleSubtitles.reset()
        }
        else {
          // 显示单个字幕
          // Show single subtitle
          art.plugins.multipleSubtitles.tracks([item.name])
        }
        return item.html
      },
    },
  ],
})

// 自定义你自己的样式，请勿复制以下代码
// Customize your own style, please do not copy the following code

const style = `
.art-subtitle-chinese {
	color: red;
	font-size: 18px;
}

.art-subtitle-japanese {
	color: yellow;
	font-size: 12px;
}
`

const $style = document.getElementById('artplayer-subtitle-style')
if ($style) {
  $style.textContent = style
}
else {
  const $style = document.createElement('style')
  $style.id = 'artplayer-subtitle-style'
  $style.textContent = style
  document.head.appendChild($style)
}
```

## Track options

The factory requires an options object containing a `subtitles` array. Runtime `{}` uses an empty array; historical root types still require the field. Each `TrackOption` has these fields:

| Field | Type | Default or behavior |
| --- | --- | --- |
| `url` | `string` | Subtitle URL loaded with browser fetch; provide a valid URL despite the historical optional type |
| `name` | `string` | Selection and CSS name; use a unique simple identifier such as `chinese` |
| `type` | `'vtt' \| 'srt' \| 'ass'` | Explicit value takes precedence over the URL extension |
| `encoding` | `string` | Defaults to `'utf-8'`, passed to TextDecoder |
| `onParser` | `(...args: object[]) => object` | Retained historical declaration; the implementation does not call it |

Files download concurrently, then decode and merge. Cross-origin servers must allow fetch. SRT and ASS use core conversion utilities to produce VTT; full ASS layout and animation are not preserved. Use JASSUB when full ASS rendering is needed. Unknown types produce empty content. Parsing is best-effort, and diagnostics do not necessarily discard all usable cues.

Unsuccessful HTTP responses and thrown decoding/conversion errors reject registration and release sibling requests. Track metadata is read from the original configuration after downloads, not a deep copy; avoid mutating the array or track objects during installation.

## Registration and selection

Registration is asynchronous and returns `{ name: 'multipleSubtitles', tracks, reset }`. The registered result is `art.plugins.multipleSubtitles`, not the global factory name. Await registration before directly using its result; readiness of that result does not guarantee the player has finished loading subtitles.

| Call | Result |
| --- | --- |
| `tracks(['chinese', 'japanese'])` | Select tracks in the caller's name order |
| `tracks(['japanese'])` | Select only that track |
| `tracks()` or `tracks([])` | Clear the selection |
| `reset()` | Restore all originally downloaded tracks in their original order |

Both methods return `undefined` synchronously. Unknown names retain the historical synchronous TypeError. Repeated names select the first matching track on each lookup without deduplication; use unique configured names. Merging follows selection order but does not rewrite cue timestamps, so reordering cannot synchronize mistimed translations.

Each selection creates a new VTT Blob URL, initializes player subtitles and releases the previous owned URL. Async host installation failures warn and clean up the failed resource; void methods cannot be awaited for subtitle readiness. Video source changes do not refetch tracks, and reset does not reload the server files. There is no public update, reload or separate destroy method.

## Styling and resource ownership

Content is wrapped with `.art-subtitle-<name>`, such as the example's `.art-subtitle-chinese` and `.art-subtitle-japanese`. Names enter HTML class markup; use application-defined simple identifiers. Selection sets `art.option.subtitle.escape = false` and supplies the subtitle URL, type and onVttLoad. Establish ownership when combining it with other subtitle managers, since later writes replace that configuration.

Literal cue text, entities and supported markup are handled separately. Inline timestamps remain in cue data, while captions still display whole cues; this does not introduce karaoke highlighting. Older cores receive a multiple-active-cue display adapter. Install custom subtitle DOM listeners after plugin registration so the plugin's later view update does not overwrite them.

Player destruction cancels requests, removes subscriptions and releases generated URLs. Pending registration settles with an inert result; retained tracks/reset calls become no-ops. Destroy does not restore the shared escape option, because another consumer may have changed it. Fonts, historical core combinations and physical Safari/mobile display still need their own validation.

## Compatible TypeScript entries

The root and `/legacy` preserve the latest published 1.2.0 factory shape: required `{ subtitles: TrackOption[] }` and a synchronous name-only `LegacyResult`. This retains historical extraction and replacement functions. For the actual Promise and selection methods, use `/runtime`, pointing to the same implementation:

```ts
import type Artplayer from 'artplayer';
import multipleSubtitles from 'artplayer-plugin-multiple-subtitles/runtime';
import type { Result, RuntimeOption } from 'artplayer-plugin-multiple-subtitles/runtime';

const options: RuntimeOption = {
  subtitles: [{ url: '/subtitles/en.vtt', name: 'en' }],
};

async function selectSubtitles(art: Artplayer): Promise<Result> {
  const result = await multipleSubtitles(options)(art);
  result.tracks(['en']);
  result.reset();
  return result;
}
```

Root named types are `TrackOption`, `Option`, `RuntimeOption`, `LegacyResult`, `Result`, `Factory` and `RuntimeFactory`. Runtime exports TrackOption, RuntimeOption, Result and RuntimeFactory. RuntimeFactory also describes the writable `.default` self-alias; the historical Factory does not require it.

The 1.0/1.1 export-assignment declarations conflict with 1.2's default-module shape; the approved policy retains 1.2 at the root. NodeNext ESM root types expose the factory at `root.default`; use runtime for accurate default calls. Classic CommonJS without interop can use runtime `import = require`; classic default imports need `esModuleInterop`. Historical JavaScript `.default(...)` calls remain supported; an old incorrect declaration does not establish a runtime call that never worked.
