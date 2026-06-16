# 弹幕库 (Dan-Any)

基于 `@dan-uni/dan-any` 驱动的现代化弹幕插件，支持多种弹幕格式和高级功能。

与 `artplayer-plugin-danmuku` 保持基本兼容性，你几乎不需要进行修改就可以切换到更强大的 `artplayer-plugin-dan-any` 。

## 演示

👉 [查看完整演示](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-dan-any/index.js&example=dan.any)

## 安装

::: code-group

```bash [npm]
npm install artplayer-plugin-dan-any @dan-uni/dan-any
```

```bash [yarn]
yarn add artplayer-plugin-dan-any @dan-uni/dan-any
```

```bash [pnpm]
pnpm add artplayer-plugin-dan-any @dan-uni/dan-any
```

```html [script]
<script src="path/to/artplayer-plugin-dan-any.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-dan-any/dist/artplayer-plugin-dan-any.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-dan-any/dist/artplayer-plugin-dan-any.js
```

:::

## 快速开始

```js
import { BiliXmlAdapter, BiliXmlMetadata } from '@dan-uni/dan-any/adapters' // 可选
import Artplayer from 'artplayer'
import artplayerPluginDanAny from 'artplayer-plugin-dan-any'

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginDanAny({
      danmuku: {
        url: '/assets/sample/danmuku.xml',
        filename: 'danmuku.xml', // 文件名仅用于快速匹配弹幕解析器，您可以像之前一样使用 URL 甚至 File 对象或直接传入数据
      },
      // 或
      // danmuku: '/assets/sample/danmuku.xml',
      // 或
      // danmuku: {
      //   data: xmlString,
      //   filename: 'danmuku.xml',
      //   handlerList: [[BiliXmlMetadata, BiliXmlAdapter]], // 可选，限制或扩展格式检测
      // },
      // 或
      // danmuku: {
      //   data: danmakuJsonData,
      //   adapterList: [[BiliXmlMetadata, BiliXmlAdapter]], // 可选，限制或扩展格式检测
      // },
      // 或
      // danmuku: chunk, // 直接传入 UniChunk 对象
      speed: 5,
      opacity: 1,
      heatmap: true,
    }),
  ],
})
```

## 弹幕来源

插件支持多种弹幕来源格式，`danmuku` 选项和 `art.plugins.artplayerPluginDanAny.load(source)` 方法接受以下类型：

- `UniChunk` 对象
- `Iterable<UDanmaku>` 可迭代对象
- URL 字符串
- `File` 对象
- `{ url, filename?, ext?, init?, handlerList? }` 对象
- `{ file, filename?, ext?, handlerList? }` 对象
- `{ data, filename?, ext?, handlerList? }` 对象

也支持返回上述类型的 `Promise` 或函数。

### 支持的弹幕格式

内置支持以下弹幕格式的自动检测：

- DanUni JSON / Protocol Buffers
- Bilibili XML / gRPC PB / 命令 gRPC PB / UP JSON
- Artplayer JSON
- Dplayer JSON
- DDPlay JSON
- 腾讯视频 JSON
- VOD JSON

### 示例

```js
// URL 方式
artplayerPluginDanAny({
  danmuku: '/assets/sample/danmuku.xml',
})

// 对象方式
artplayerPluginDanAny({
  danmuku: {
    url: '/assets/sample/danmuku.xml',
    filename: 'danmuku.xml',
  },
})

// 函数方式（延迟加载）
artplayerPluginDanAny({
  danmuku: () => ({
    url: '/assets/sample/danmuku.xml',
    filename: 'danmuku.xml',
  }),
})

// 动态加载
await art.plugins.artplayerPluginDanAny.load({
  data: danmakuJsonData,
  filename: 'danmaku.json',
})
```

### 自定义格式处理器

可以通过 `handlerList` 限制检测范围或添加自定义格式：

```js
import { BiliXmlAdapter, BiliXmlMetadata } from '@dan-uni/dan-any/adapters'

art.plugins.artplayerPluginDanAny.load({
  data: xmlString,
  filename: 'danmaku.xml',
  handlerList: [[BiliXmlMetadata, BiliXmlAdapter]],
})
```

## Dan-Any 插件系统

`option.plugins` 接受 `@dan-uni/dan-any` 插件数组，在弹幕源加载后运行：

```js
import { MergePluginConfigurator } from '@dan-uni/dan-any/plugins'

artplayerPluginDanAny({
  danmuku: '/assets/sample/danmuku.xml',
  plugins: [
    MergePluginConfigurator(10), // 合并相似弹幕
  ],
})
```

插件按数组顺序执行，每个插件接收上一个插件返回的 `UniChunk` 进行处理。

## 计数弹幕

当 `UDanmaku` 项包含 `extra.danuni.merge` 字段时，渲染器将其视为计数弹幕。此数据由 `@dan-uni/dan-any/plugins` 的 `MergePluginConfigurator()` 生成。

### 特性

- 显示格式为 `{content}` + `x{count}` 徽章
- 出现时计数值从 `0` 快速渐变到 `count`
- 固定在播放器顶部
- 根据文本长度和播放器尺寸自适应字号
- 位于普通弹幕之上
- 独立的顶部泳道，与普通弹幕防重叠分离

### 控制

通过 `typeOptions.count` 控制显示，设为 `false` 时即使数据存在也不渲染。

## 全部选项

| 选项                  | 默认值                                          | 说明                                                                                 |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| `danmuku`             | `[]`                                            | 初始弹幕来源                                                                         |
| `handlerList`         | 内置列表                                        | 默认格式检测处理器                                                                   |
| `plugins`             | `[]`                                            | `@dan-uni/dan-any` 插件数组                                                          |
| `speed`               | `5`                                             | 弹幕持续时间（秒），范围 `1` - `10`，值越小速度越快                                  |
| `margin`              | `[10, '25%']`                                   | 顶部和底部显示边距，支持像素或百分比                                                 |
| `opacity`             | `1`                                             | 弹幕不透明度，范围 `0` - `1`                                                         |
| `color`               | `'#ffffff'`                                     | 默认颜色，CSS 颜色或数值颜色                                                         |
| `modes`               | `['Normal', 'Reverse', 'Top', 'Bottom', 'Ext']` | 可见模式列表                                                                         |
| `typeOptions`         | `{ color: true, count: true }`                  | 类型过滤选项。`color: false` 忽略单条弹幕颜色使用默认色；`count: false` 隐藏计数弹幕 |
| `fontSize`            | `'source'`                                      | 字号，支持像素数值、百分比字符串或源文件字号                                         |
| `antiOverlap`         | `true`                                          | 尽可能避免弹幕重叠                                                                   |
| `synchronousPlayback` | `false`                                         | 弹幕速度随视频播放速率调整                                                           |
| `mount`               | 控制栏左侧                                      | 控制面板挂载点，接受元素或选择器                                                     |
| `heatmap`             | `false`                                         | 启用弹幕热力图，接受 `true` 或热力图选项对象                                         |
| `points`              | `[]`                                            | 外部热力图数据点 `{ time, value }[]`，`time` 单位为秒。空数组时自动使用已加载弹幕    |
| `visible`             | `true`                                          | 弹幕层是否可见                                                                       |
| `emitter`             | `true`                                          | 是否启用弹幕发射器                                                                   |
| `emitDefaults`        | `{}`                                            | UI 发射器使用的默认 `UDanmaku` 字段。`ctime` 和 `DMID` 每次发送时自动生成            |
| `emitterFontSizes`    | `[{ size: 18, text: '较小' }, ...]`             | 发射器面板字号选择                                                                   |
| `emitterColors`       | 常用颜色列表                                    | 发射器面板颜色值，DanUni 数值颜色                                                    |
| `emitterModes`        | `Normal`/`Top`/`Bottom`                         | 发射器面板位置选择，每项为 `{ type, text? }`                                         |
| `maxLength`           | `200`                                           | 弹幕输入最大长度，范围 `1` - `1000`                                                  |
| `lockTime`            | `5`                                             | 发送成功后 UI 发射器锁定时间（秒），范围 `1` - `60`                                  |
| `width`               | `512`                                           | 当播放器宽度小于此值时，控制面板移到播放器下方                                       |
| `filter`              | `() => true`                                    | 过滤加载的 `UDanmaku` 项                                                             |
| `beforeEmit`          | `() => true`                                    | 发送前调用，可返回 `Promise<boolean>`                                                |
| `emit`                | `() => true`                                    | 弹幕被接受时调用，可返回 `Promise`，返回 `false` 取消本地渲染                        |
| `beforeVisible`       | `() => true`                                    | 每条弹幕显示前调用，可返回 `Promise<boolean>`                                        |
| `renderer`            | 内置 DOM 渲染器                                 | 自定义渲染器对象或工厂函数                                                           |
| `onLike`              | `undefined`                                     | 点赞弹幕回调。配置后弹幕工具提示显示点赞按钮，可返回 `Promise`                       |
| `onReport`            | `undefined`                                     | 举报弹幕回调。配置后弹幕工具提示显示举报按钮，可返回 `Promise`                       |
| `enableInteraction`   | `true`                                          | 是否启用弹幕点击交互。设为 `false` 时弹幕无法点击                                    |

### 支持的渲染模式

- `Normal` - 从右向左滚动
- `Reverse` - 从左向右滚动
- `Top` - 顶部固定
- `Bottom` - 底部固定
- `Ext` - 扩展模式（内置 DOM 渲染器暂未实现非计数高级弹幕）

计数弹幕（包含 `extra.danuni.merge`）在 `typeOptions.count` 为 `true` 时渲染，不受原始模式或 `modes` 列表限制。

### 弹幕发送流程

UI 发送的弹幕被构建为完整的 `UDanmaku` 对象：

- `content` - 来自输入
- `progress` - 默认为 `Math.round(art.currentTime * 1000)`，限制为非负 int32 毫秒值
- `ctime` - 发送时间
- `DMID` - 使用当前 `UniDB.DMIDGenerator` 生成

发送顺序：`filter` -> `beforeEmit` -> `emit` -> 本地渲染器 -> `artplayerPluginDanAny:emit`

发送的弹幕仅添加到当前渲染器队列，不插入当前 `UniChunk`，不改变 `udanmakus`。

### 持久化发送的弹幕

使用 `emit` 回调在弹幕进入本地渲染队列前持久化：

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

### 热力图选项

热力图选项字段与 `artplayer-plugin-danmuku` 一致：`xMin`、`xMax`、`yMin`、`yMax`、`scale`、`opacity`、`minHeight`、`sampling`、`smoothing`、`flattening`。

## 实例 API

插件初始化后，实例位于 `art.plugins.artplayerPluginDanAny`。

### 方法

```js
// 重新加载或切换弹幕源
await art.plugins.artplayerPluginDanAny.load('/assets/sample/danmuku.xml')

// 发送完整 UDanmaku 到当前渲染器队列
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

// 更新渲染器/控制选项
art.plugins.artplayerPluginDanAny.config({ opacity: 0.8 })

// 更新热力图和数据点
art.plugins.artplayerPluginDanAny.config({
  heatmap: true,
  points: [
    { time: 30, value: 12 },
    { time: 60, value: 24 },
  ],
})

// 隐藏弹幕层
art.plugins.artplayerPluginDanAny.hide()

// 显示弹幕层
art.plugins.artplayerPluginDanAny.show()

// 重置待显示和可见弹幕
art.plugins.artplayerPluginDanAny.reset()

// 移动控制面板
art.plugins.artplayerPluginDanAny.mount('.danmaku-control')
```

### 属性

```js
// 当前 UniChunk 或 null
console.log(art.plugins.artplayerPluginDanAny.chunk)

// 从当前 chunk 加载的已排序 UDanmaku[]
console.log(art.plugins.artplayerPluginDanAny.udanmakus)

// 标准化选项对象
console.log(art.plugins.artplayerPluginDanAny.option)

// 弹幕层是否隐藏
console.log(art.plugins.artplayerPluginDanAny.isHide)

// 渲染器是否停止
console.log(art.plugins.artplayerPluginDanAny.isStop)
```

## 事件

```js
// 弹幕加载完成
art.on('artplayerPluginDanAny:loaded', (udanmakus, chunk) => {
  console.log('加载了', udanmakus.length, '条弹幕')
})

// 弹幕发送
art.on('artplayerPluginDanAny:emit', (danmaku) => {
  console.log('发送弹幕:', danmaku.content)
})

// 错误
art.on('artplayerPluginDanAny:error', (error) => {
  console.error('弹幕错误:', error)
})

// 配置更新
art.on('artplayerPluginDanAny:config', (option) => {
  console.log('配置已更新')
})

// 弹幕显示
art.on('artplayerPluginDanAny:visible', (danmaku) => {
  console.log('弹幕显示:', danmaku.content)
})

// 重置
art.on('artplayerPluginDanAny:reset', () => {
  console.log('弹幕已重置')
})

// 尺寸调整
art.on('artplayerPluginDanAny:resize', () => {
  console.log('弹幕层已调整尺寸')
})

// 停止
art.on('artplayerPluginDanAny:stop', () => {
  console.log('弹幕渲染已停止')
})

// 开始
art.on('artplayerPluginDanAny:start', () => {
  console.log('弹幕渲染已开始')
})

// 显示弹幕层
art.on('artplayerPluginDanAny:show', () => {
  console.log('弹幕层已显示')
})

// 隐藏弹幕层
art.on('artplayerPluginDanAny:hide', () => {
  console.log('弹幕层已隐藏')
})

// 销毁
art.on('artplayerPluginDanAny:destroy', () => {
  console.log('弹幕插件已销毁')
})

// 点赞弹幕
art.on('artplayerPluginDanAny:like', (danmaku) => {
  console.log('用户点赞:', danmaku.content)
})

// 复制弹幕
art.on('artplayerPluginDanAny:copy', (danmaku) => {
  console.log('用户复制:', danmaku.content)
})

// 举报弹幕
art.on('artplayerPluginDanAny:report', (danmaku) => {
  console.log('用户举报:', danmaku.content)
})

// 外部更新热力图数据点
art.emit('artplayerPluginDanAny:points', [
  { time: 30, value: 10 },
  { time: 60, value: 20 },
])
```

## 弹幕交互

插件支持点击弹幕显示交互式工具提示。此功能默认启用。

### 功能特性

- **点击暂停** - 点击弹幕暂停其移动并停止消失计时器
- **交互式工具提示** - 显示浮动工具提示和操作按钮
- **复制按钮** - 始终可见，复制弹幕内容到剪贴板
- **点赞按钮** - 配置 `onLike` 回调后显示
- **举报按钮** - 配置 `onReport` 回调后显示
- **自动关闭** - 点击工具提示外部或点击其他弹幕时关闭当前工具提示

### 配置

```js
artplayerPluginDanAny({
  danmuku: '/assets/sample/danmuku.xml',

  // 启用/禁用交互（默认: true）
  enableInteraction: true,

  // 点赞回调 - 配置后显示点赞按钮
  onLike: async (danmaku) => {
    console.log('点赞:', danmaku.content)
    // 发送到服务器
    await fetch('/api/danmaku/like', {
      method: 'POST',
      body: JSON.stringify({ id: danmaku.DMID })
    })
  },

  // 举报回调 - 配置后显示举报按钮
  onReport: async (danmaku) => {
    console.log('举报:', danmaku.content)
    if (confirm(`举报 "${danmaku.content}"?`)) {
      await fetch('/api/danmaku/report', {
        method: 'POST',
        body: JSON.stringify({ id: danmaku.DMID })
      })
    }
  },
})
```

### 交互事件

```js
// 点赞按钮被点击
art.on('artplayerPluginDanAny:like', (danmaku) => {
  console.log('用户点赞:', danmaku.content)
})

// 复制按钮被点击
art.on('artplayerPluginDanAny:copy', (danmaku) => {
  console.log('用户复制:', danmaku.content)
})

// 举报按钮被点击
art.on('artplayerPluginDanAny:report', (danmaku) => {
  console.log('用户举报:', danmaku.content)
})
```

### 动态配置

可以在运行时启用或禁用交互：

```js
// 禁用交互
art.plugins.artplayerPluginDanAny.config({
  enableInteraction: false
})

// 启用交互
art.plugins.artplayerPluginDanAny.config({
  enableInteraction: true
})
```

### 按钮可见性

按钮可见性由配置决定：

- **复制按钮** - 始终可见（内置功能）
- **点赞按钮** - 仅当 `onLike` 为函数时可见
- **举报按钮** - 仅当 `onReport` 为函数时可见

如果 `onLike` 和 `onReport` 都未配置，工具提示仅显示复制按钮。

## 自定义渲染器

`renderer` 可以是对象或接收 `{ art, option }` 的工厂函数。

```js
artplayerPluginDanAny({
  danmuku: '/assets/sample/danmuku.xml',
  renderer: ({ art, option }) => ({
    load(udanmakus) {
      console.log(udanmakus.length, option, art)
    },
    emit(danmaku) {
      // 处理发送的弹幕
    },
    config(nextOption) {
      // 处理配置更新
    },
    reset() {
      // 重置渲染器状态
    },
    destroy() {
      // 清理渲染器资源
    },
    get isHide() {
      return false
    },
    get isStop() {
      return false
    },
  }),
})
```

可选的渲染器方法：`load`、`emit`、`config`、`hide`、`show`、`reset`、`destroy`

可选的状态字段：`isHide`、`isStop`
