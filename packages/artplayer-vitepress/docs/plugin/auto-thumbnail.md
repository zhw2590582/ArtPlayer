# 自动缩略图

[English](../en/plugin/auto-thumbnail.md)

使用独立视频元素读取画面，在浏览器内逐步生成 JPEG 雪碧图，并更新播放器进度条的缩略图配置。本页描述未发布的重构分支；在线示例及未固定版本的 npm/CDN 包不等于当前候选。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-auto-thumbnail
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAutoThumbnail from 'artplayer-plugin-auto-thumbnail';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-auto-thumbnail.js`，全局名为 `artplayerPluginAutoThumbnail`。以下代码保留[原在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-auto-thumbnail/index.js&example=auto.thumbnail)。工厂参数对象必填，使用 `{}` 选择默认值。

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

## 配置与生成方式

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `url` | `string` | 当前 `art.option.url` | 独立解码器读取的媒体地址；显式非空地址优先 |
| `width` | `number` | `160` | 每格缩略图宽度，单位像素 |
| `number` | `number` | `100` | 目标采样数量，通常使用正整数 |
| `scale` | `number` | `1` | 传给播放器的预览显示缩放，不降低生成画布尺寸 |
| `height` | `number` | 按视频宽高比计算 | 历史参数，实际忽略；精确 runtime 类型接受它 |

这些默认值沿用 `value || default` 规则，例如 `width: 0` 回退为 160。width 和 number 回退后需要为可转换成有限正数的值；旧 JavaScript 数值字符串和小数计数行为保留，但类型示例使用数字与正整数。生成高度为 `Math.floor(width * videoHeight / videoWidth)`，每行固定十列。媒体必须有有限的正时长和尺寸，不适用于直播无限时长。

采样时刻为 `duration * index / number`，从 index 0 开始，不包含媒体终点。时长与画布尺寸在独立视频 metadata 时固定；每次画出一格后编码整张 JPEG，再发布新的 `art.thumbnails` 配置。因此生成期间后面的格子可能尚未填充，并不是所有缩略图同时就绪。

较大的 width 和 number 会增加画布、解码和反复编码成本；尺寸校验不是浏览器内存预算保证。选择适合视频长度和目标设备的配置，或使用预先制作的 [VTT 缩略图](./vtt-thumbnail.md)。

## 注册、切源和清理

工厂返回异步注册函数，结果仅包含 `name: 'artplayerPluginAutoThumbnail'`。注册 Promise 在安装播放器事件后完成，不等待缩略图生成，也不表示媒体已成功读取。没有公开的进度、生成完成、update、stop 或 destroy 方法。

每次 `video:loadedmetadata` 启动新一轮提取，并重新读取原配置对象；之后修改原对象会影响下一轮。插件不补发安装之前已经过去的 metadata 事件。`restart` 取消旧提取，后续 metadata 才启动新任务。旧的异步帧和编码回调不能覆盖新任务。

独立解码器的 metadata、每帧就绪和每次 JPEG 编码各有 30 秒等待上限，不是整个任务的总时限。媒体、画布或编码失败会清理当前任务，通过 `console.warn` 报告，并保留最后一张可用预览；已完成的注册 Promise 不会因此重新拒绝。

完成或取消后释放独立视频与画布；最后的图片 URL 保留至被新的可用图替换或播放器销毁。只撤销插件生成的 URL，不撤销应用自己的外部缩略图地址。销毁同时移除监听器；直接调用已保留的注册函数且播放器已销毁时，只返回名称，不分配解码器，这不改变核心 `plugins.add()` 的销毁检查。

## 媒体访问和浏览器边界

独立视频固定使用 `crossOrigin = 'anonymous'`，静音且不主动播放。媒体必须允许浏览器原生读取和 Canvas 像素访问，跨域服务需要正确的 CORS 响应。播放器的自定义加载器、SDK、请求头或代理不会自动安装到这个独立解码器；必要时用 `url` 提供它能直接读取的媒体。

独立视频会以隐藏但具有渲染尺寸的节点挂到文档中；这不表示新增可见播放器。真实解码和首帧正确性仍依赖浏览器。当前 Windows WebKit 首帧问题尚未完成验收，不能把类型、导航或其它浏览器通过当作该问题已解决，也不代表真实 Safari/手机已验证。

## TypeScript 兼容入口

根入口和 `/legacy` 保留 npm 1.1.0 的同步结果声明，工厂对象必填，根 Option 没有 height。需要实际 Promise、旧 height 参数或 `.default` 自引用类型时，使用同一实现的 `/runtime`：

```ts
import type Artplayer from 'artplayer';
import autoThumbnail from 'artplayer-plugin-auto-thumbnail/runtime';
import type { Option, Result } from 'artplayer-plugin-auto-thumbnail/runtime';

const options: Option = { width: 160, number: 100, scale: 1 };

async function registerThumbnails(art: Artplayer): Promise<Result> {
  return await autoThumbnail(options)(art); // Registration only, not extraction completion.
}
```

runtime 导出 `Option`、`Result`、`Factory`、`RuntimeFactory`；Factory 是普通异步工厂，RuntimeFactory 还描述可写的 `.default` 自引用。实际 CommonJS 支持直接调用及 `.default(...)`。更早 1.0.x 的 `export =` 和 height 声明与 1.1.0 不同，需要旧导入形式时可迁到 runtime 的 `import = require`。根 NodeNext 模块形状保留，准确的可调用默认导入使用 runtime；经典 Node10 默认导入需要 `esModuleInterop`。
