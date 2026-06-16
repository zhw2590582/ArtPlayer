# artplayer-plugin-dan-any

Danmaku plugin for ArtPlayer powered by `@dan-uni/dan-any`.

It loads common danmaku formats through `@dan-uni/dan-any`, converts them to `UDanmaku`, and renders them with an ArtPlayer control panel.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-dan-any/index.js&example=dan.any)

## Install

```bash
npm install artplayer-plugin-dan-any
```

## Usage

```js
import Artplayer from 'artplayer'
import artplayerPluginDanAny from 'artplayer-plugin-dan-any'

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginDanAny({
      danmuku: {
        url: '/assets/sample/danmuku.xml',
        filename: 'danmuku.xml',
      },
      modes: ['Normal', 'Reverse', 'Top', 'Bottom'],
      opacity: 1,
      fontSize: 'source',
      speed: 5,
      heatmap: true,
      emitDefaults: {
        fontsize: 25,
        color: 0xFFFFFF,
        mode: 'Normal',
      },
      beforeEmit: danmaku => danmaku.content.length <= 100,
    }),
  ],
})
```

The plugin uses the pure `@dan-uni/dan-any` backend internally, so it does not require PGLite or drizzle in the browser bundle.

## Sources

`danmuku` and `art.plugins.artplayerPluginDanAny.load(source)` accept a source, a `Promise` of a source, or a function returning either one.

Supported source values:

- `UniChunk`
- `Iterable<UDanmaku>`
- URL string
- `File`
- `{ url, filename?, ext?, init?, handlerList? }`
- `{ file, filename?, ext?, handlerList? }`
- `{ data, filename?, ext?, handlerList? }`

Examples:

```js
artplayerPluginDanAny({
  danmuku: () => ({
    url: '/assets/sample/danmuku.xml',
    filename: 'danmuku.xml',
  }),
})

await art.plugins.artplayerPluginDanAny.load({
  data: danmakuJson,
  filename: 'danmaku.json',
})
```

When `filename` or `ext` is provided, the plugin detects the format from the name first. Without a detectable name, it tries body-based detection.

The built-in detection list includes:

- DanUni JSON / PB
- Bilibili XML / gRPC PB / command gRPC PB / UP JSON
- Artplayer JSON
- Dplayer JSON
- DDPlay JSON
- Tencent JSON
- VOD JSON

Use `handlerList` to restrict detection or add custom `Metadata` / `Adapter` pairs:

```js
import { BiliXmlAdapter, BiliXmlMetadata } from '@dan-uni/dan-any/adapters'

art.plugins.artplayerPluginDanAny.load({
  data,
  filename: 'danmaku.xml',
  handlerList: [[BiliXmlMetadata, BiliXmlAdapter]],
})
```

Source-level `handlerList` overrides `option.handlerList`, which overrides the built-in default list.

## Dan-any Plugins

`option.plugins` accepts an array of `@dan-uni/dan-any` plugins and runs them after the source is loaded:

```js
import { MergePluginConfigurator } from '@dan-uni/dan-any/plugins'

artplayerPluginDanAny({
  danmuku: '/assets/sample/danmuku.xml',
  plugins: [
    MergePluginConfigurator(10),
  ],
})
```

Plugins run in array order. When a plugin returns a `UniChunk`, the next plugin runs on that returned chunk. When a plugin returns anything else, the next plugin keeps running on the current chunk.

## Count Danmaku

When a `UDanmaku` item contains `extra.danuni.merge`, the built-in DOM renderer treats it as a count danmaku. This data is produced by `MergePluginConfigurator()` from `@dan-uni/dan-any/plugins`.

Count danmaku render as `{content}` plus a visually separated `x{count}` badge. When the danmaku appears, the count value quickly eases out from `0` to `count`. The `duration` field in `extra.danuni.merge` is interpreted as milliseconds; if it is missing or invalid, the renderer falls back to the current renderer speed.

Count danmaku are fixed at the top of the player, use an adaptive font size based on the final text length and player size, stay above normal danmaku, and do not use the original `mode` for rolling/top/bottom animation. Multiple count danmaku with overlapping lifetimes use their own top lanes, separate from normal danmaku anti-overlap.

Count danmaku display is controlled by `typeOptions.count`. When `typeOptions.count` is `false`, count danmaku are not rendered even if their data is present.

The package type declarations re-export `ExtraDanUniMerge` from `@dan-uni/dan-any/core` for consumers that want to type `extra.danuni.merge` directly.

## Options

| Name | Default | Description |
| --- | --- | --- |
| `danmuku` | `[]` | Initial danmaku source. |
| `handlerList` | built-in list | Default format detection handlers. |
| `plugins` | `[]` | `@dan-uni/dan-any` plugins run after source loading. |
| `speed` | `5` | Danmaku duration in seconds, clamped to `1` - `10`. Smaller values move faster. |
| `margin` | `[10, '25%']` | Top and bottom display margins. Values can be pixels or percentages. |
| `opacity` | `1` | Danmaku opacity, clamped to `0` - `1`. |
| `color` | `'#ffffff'` | Default CSS color or numeric color value. A danmaku item can override it. |
| `modes` | `['Normal', 'Reverse', 'Top', 'Bottom', 'Ext']` | Visible modes. |
| `typeOptions` | `{ color: true, count: true }` | Type filtering options. `color: false` ignores individual danmaku colors and uses the default color; `count: false` hides count danmaku. |
| `fontSize` | `'source'` | Font size. Supports pixel number, percentage string, or source file size. |
| `antiOverlap` | `true` | Avoid overlapping danmaku when possible. |
| `synchronousPlayback` | `false` | Adjust danmaku speed with the video playback rate. |
| `mount` | control bar left side | Control panel mount point. Accepts an element or selector. |
| `heatmap` | `false` | Enables the danmaku heatmap. Accepts `true` or a heatmap option object. |
| `points` | `[]` | External heatmap points as `{ time, value }[]`; `time` is in seconds. Empty points use loaded danmaku automatically. |
| `visible` | `true` | Whether the danmaku layer is visible. |
| `emitter` | `true` | Whether the danmaku emitter is enabled. |
| `emitDefaults` | `{}` | Default `UDanmaku` fields used by the UI emitter. `ctime` and `DMID` are generated for every send. |
| `emitterFontSizes` | `[{ size: 18, text: '较小' }, { size: 25, text: '标准' }, { size: 36, text: '较大' }]` | Font size choices for the emitter panel. |
| `emitterColors` | common color list | DanUni number color values for the emitter panel. The default list includes `16777215`. |
| `emitterModes` | `Normal` / `Top` / `Bottom` | Position choices for the emitter panel. Each item is `{ type, text? }`. |
| `maxLength` | `200` | Maximum danmaku input length, clamped to `1` - `1000`. |
| `lockTime` | `5` | UI emitter lock time after a successful send, clamped to `1` - `60` seconds. |
| `width` | `512` | When player width is smaller than this value, the control panel moves below the player. |
| `filter` | `() => true` | Filters loaded `UDanmaku` items before they enter the render queue. |
| `beforeEmit` | `() => true` | Called before a UI or API sent danmaku enters the render queue. Can return a `Promise<boolean>`. |
| `emit` | `() => true` | Called when a UI or API sent danmaku is accepted. Can return a `Promise`; returning `false` cancels local rendering. |
| `beforeVisible` | `() => true` | Called before each danmaku is shown. Can return a `Promise<boolean>`. |
| `renderer` | built-in DOM renderer | Custom renderer object or factory. |

Supported render modes are `Normal`, `Reverse`, `Top`, `Bottom`, and `Ext`. The default DOM renderer does not yet implement `Ext` mode rendering (non-count advanced danmaku).

Count danmaku with `extra.danuni.merge` are rendered when `typeOptions.count` is `true`, regardless of their original mode or the `modes` list.

UI sent danmaku are built as complete `UDanmaku` objects. `content` comes from the input, `progress` defaults to `Math.round(art.currentTime * 1000)` clamped to a non-negative int32 millisecond value, `ctime` is the send time, and `DMID` is generated with the current `UniDB.DMIDGenerator`. The send order is `filter` -> `beforeEmit` -> `emit` -> local renderer -> `artplayerPluginDanAny:emit`. They are added only to the current renderer queue; they are not inserted into the current `UniChunk` and do not change `udanmakus`.

Use `emit` to persist accepted sent danmaku before they enter the local renderer queue:

```js
artplayerPluginDanAny({
  emit: async (danmaku) => {
    const response = await fetch('/api/danmaku', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(danmaku),
    })

    return response.ok
  },
})
```

Heatmap option fields match `artplayer-plugin-danmuku`: `xMin`, `xMax`, `yMin`, `yMax`, `scale`, `opacity`, `minHeight`, `sampling`, `smoothing`, and `flattening`.

## Instance API

After initialization, the plugin instance is available at `art.plugins.artplayerPluginDanAny`.

```js
await art.plugins.artplayerPluginDanAny.load('/assets/sample/danmuku.xml')
await art.plugins.artplayerPluginDanAny.emit({
  DMID: 'local-id',
  SOID: 'video@artplayer',
  attr: [],
  color: 0xFFFFFF,
  content: 'Hello ArtPlayer',
  ctime: new Date(),
  extra: null,
  fontsize: 25,
  mode: 'Normal',
  platform: 'artplayer',
  pool: 'Def',
  progress: Math.round(art.currentTime * 1000),
  senderID: 'user@artplayer',
  weight: 0,
})
art.plugins.artplayerPluginDanAny.config({ opacity: 0.8 })
art.plugins.artplayerPluginDanAny.config({
  heatmap: true,
  points: [
    { time: 30, value: 12 },
    { time: 60, value: 24 },
  ],
})
art.emit('artplayerPluginDanAny:points', [
  { time: 90, value: 18 },
])
art.plugins.artplayerPluginDanAny.hide()
art.plugins.artplayerPluginDanAny.show()
art.plugins.artplayerPluginDanAny.reset()
art.plugins.artplayerPluginDanAny.mount('.danmaku-control')

console.log(art.plugins.artplayerPluginDanAny.udanmakus)
console.log(art.plugins.artplayerPluginDanAny.chunk)
```

API shape:

- `load(source?)`: reloads or switches the danmaku source and returns `Promise<Result>`
- `emit(danmaku)`: sends one complete `UDanmaku` to the current renderer queue and returns `Promise<Result>`; `progress` is an int32 millisecond value
- `config(option)`: updates renderer/control options
- `hide()`: hides the danmaku layer
- `show()`: shows the danmaku layer
- `reset()`: resets pending and visible danmaku
- `mount(el)`: moves the control panel
- `chunk`: current `UniChunk` or `null`
- `udanmakus`: sorted `UDanmaku[]` loaded from the current chunk
- `option`: normalized option object
- `isHide`: whether the danmaku layer is hidden
- `isStop`: whether the renderer is stopped

## Events

```js
art.on('artplayerPluginDanAny:loaded', (udanmakus, chunk) => {})
art.on('artplayerPluginDanAny:emit', danmaku => {})
art.on('artplayerPluginDanAny:error', error => {})
art.on('artplayerPluginDanAny:config', option => {})
art.on('artplayerPluginDanAny:visible', danmaku => {})
art.on('artplayerPluginDanAny:reset', () => {})
art.on('artplayerPluginDanAny:resize', () => {})
art.on('artplayerPluginDanAny:stop', () => {})
art.on('artplayerPluginDanAny:start', () => {})
art.on('artplayerPluginDanAny:show', () => {})
art.on('artplayerPluginDanAny:hide', () => {})
art.on('artplayerPluginDanAny:destroy', () => {})

art.emit('artplayerPluginDanAny:points', [
  { time: 30, value: 10 },
  { time: 60, value: 20 },
])
```

## Custom Renderer

`renderer` can be an object or a factory receiving `{ art, option }`.

```js
artplayerPluginDanAny({
  danmuku: '/assets/sample/danmuku.xml',
  renderer: ({ art, option }) => ({
    load(udanmakus) {
      console.log(udanmakus.length, option, art)
    },
    emit(danmaku) {},
    config(nextOption) {},
    reset() {},
    destroy() {},
    get isHide() {
      return false
    },
    get isStop() {
      return false
    },
  }),
})
```

Optional renderer methods are `load`, `emit`, `config`, `hide`, `show`, `reset`, and `destroy`. Optional state fields are `isHide` and `isStop`.

## License

MIT © Harvey Zhao
