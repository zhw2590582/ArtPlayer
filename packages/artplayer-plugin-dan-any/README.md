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
| `modes` | `['Normal', 'Reverse', 'Top', 'Bottom']` | Visible modes. |
| `fontSize` | `'source'` | Font size. Supports pixel number, percentage string, or source file size. |
| `antiOverlap` | `true` | Avoid overlapping danmaku when possible. |
| `synchronousPlayback` | `false` | Adjust danmaku speed with the video playback rate. |
| `mount` | control bar left side | Control panel mount point. Accepts an element or selector. |
| `heatmap` | `false` | Enables the danmaku heatmap. Accepts `true` or a heatmap option object. |
| `points` | `[]` | External heatmap points as `{ time, value }[]`; `time` is in seconds. Empty points use loaded danmaku automatically. |
| `visible` | `true` | Whether the danmaku layer is visible. |
| `emitter` | `true` | Whether the danmaku emitter is enabled. |
| `maxLength` | `200` | Maximum danmaku input length, clamped to `1` - `1000`. |
| `width` | `512` | When player width is smaller than this value, the control panel moves below the player. |
| `filter` | `() => true` | Filters loaded `UDanmaku` items before they enter the render queue. |
| `beforeVisible` | `() => true` | Called before each danmaku is shown. Can return a `Promise<boolean>`. |
| `renderer` | built-in DOM renderer | Custom renderer object or factory. |

Supported render modes are `Normal`, `Reverse`, `Top`, and `Bottom`.

Heatmap option fields match `artplayer-plugin-danmuku`: `xMin`, `xMax`, `yMin`, `yMax`, `scale`, `opacity`, `minHeight`, `sampling`, `smoothing`, and `flattening`.

## Instance API

After initialization, the plugin instance is available at `art.plugins.artplayerPluginDanAny`.

```js
await art.plugins.artplayerPluginDanAny.load('/assets/sample/danmuku.xml')
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

Optional renderer methods are `load`, `config`, `hide`, `show`, `reset`, and `destroy`. Optional state fields are `isHide` and `isStop`.

## License

MIT © Harvey Zhao
