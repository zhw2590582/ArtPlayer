# VTT 缩略图

[English](../en/plugin/vtt-thumbnail.md)

读取一份 WebVTT 缩略图索引，在进度条悬停时显示对应的精灵图区域。图片和索引需要提前生成；插件不扫描视频，也不需要额外 SDK。

本页描述当前重构分支。解析和生命周期修复、`/runtime` 精确类型尚未发布；未固定版本的 npm/CDN 安装不能当作本分支代码。

## 安装

```sh
yarn add artplayer artplayer-plugin-vtt-thumbnail
```

```js
import Artplayer from 'artplayer';
import artplayerPluginVttThumbnail from 'artplayer-plugin-vtt-thumbnail';
```

通过 script 使用时先加载 ArtPlayer，再加载插件的 `dist/artplayer-plugin-vtt-thumbnail.js`。全局名称为 `artplayerPluginVttThumbnail`。固定依赖版本，并确保页面能读取 VTT、加载图片；跨域 VTT 请求需要服务器允许 CORS。

## 完整示例

下面与[在线缩略图示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vtt-thumbnail/index.js&example=vtt.thumbnail)使用同一份代码。站点提供媒体和 `.artplayer-app` 容器，自己的应用需要替换对应地址。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-vtt-thumbnail/index.js">▶ Run Code</div>

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

## 配置

`artplayerPluginVttThumbnail(option)` 的配置对象必须提供。

| 字段 | 类型 | 行为 |
| --- | --- | --- |
| `vtt` | `string`，类型中可选 | VTT 文件地址。实际使用应提供有效地址；省略会请求空地址，即当前页面，不是禁用开关。 |
| `style` | `Partial<CSSStyleDeclaration>`，可选 | 缩略图控件的初始内联样式，例如 `borderRadius: '4px'`。 |

显示缩略图时，插件会更新 display、width、height、left、backgroundImage 和 backgroundPosition；不要依赖初始 style 永久覆盖这些值。尺寸和裁剪来自每条索引，插件不自动缩放精灵图。

## 索引格式与图片路径

```text
WEBVTT

00:00.000 --> 00:05.000
bbb-sprite.jpg#xywh=0,0,128,72

00:05.000 --> 00:10.000
bbb-sprite.jpg#xywh=128,0,128,72
```

`x,y,w,h` 分别是图片内的左边位置、上边位置、宽度和高度，单位像素。x/y 必须非负，w/h 必须大于零，四项必须是有限数值。每条 cue 使用一行带裁剪片段的图片地址，不能直接把普通字幕文字当作缩略图索引。

相对图片地址按**传入的 VTT 地址所在目录**拼接：`/assets/sample/bbb-thumbnails.vtt` 中的 `bbb-sprite.jpg` 对应 `/assets/sample/bbb-sprite.jpg`。以 `/` 或已支持协议开头的完整地址直接使用。不以 HTTP 重定向后的 response URL 重新计算目录；有重定向或复杂相对路径时，建议索引使用明确的图片地址。

解析器支持 BOM、常见换行符、可选 cue 标识符和时间行设置，并跳过 NOTE、STYLE、REGION 块。它用于缩略图索引，不是完整 WebVTT 字幕排版实现。

## 时间与显示边界

为保留旧行为，开始和结束时间向下取整到秒；区间的两端都包含在内，并选择文件顺序中第一条匹配项。例如在上面的精确 5 秒边界仍显示第一张，超过 5 秒才显示第二张。不要假设它提供毫秒级精确区间或“结束时间不包含”的字幕语义。

桌面悬停按进度条百分比乘以视频总时长选择图片；没有匹配项时隐藏，预览靠近边缘时会向内对齐。移动端使用带输入事件的进度拖动路径，并在最后一次拖动更新后约 500ms 隐藏。桌面测试不能替代真实触摸设备验收。

绘制位置必须严格位于进度条内部。桌面进度恰好为 0 或 1 时隐藏预览；移动端这两个端点不会绘制新预览，但已有预览仍按计时器隐藏。插件使用控件名 `vtt-thumbnail` 和样式类 `art-control-thumbnails`，请保留这些既有挂钩。

## 异步注册、错误和销毁

注册会请求并解析 VTT，实际返回 Promise，成功结果只有 `name: 'artplayerPluginVttThumbnail'`。构造器 plugins 数组中的安装是异步的，不要在构造后立即假设结果已注册。

需要明确等待和处理请求或解析失败时，可在构造播放器后调用一次 `art.plugins.add()`：

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

请求失败或格式错误会拒绝注册，格式错误包含行号。注册完成只说明 VTT 已加载解析并创建控件，不表示所有图片已解码；图片在浏览器显示时加载，图片请求失败不会变成已经完成的注册 Promise 的拒绝。

插件没有 update、reload 或独立 destroy 方法。切换主视频不会自动重新请求 VTT；切换到另一套视频和缩略图时，可销毁并重建播放器。不要把 `controls.remove()` 当作完整卸载，也不要用重复安装模拟一个没有提供的更新接口。

销毁播放器会取消待处理请求（环境支持 AbortController 时），结算取消的注册、移除自己的监听器和计时器，并移除仍由本次安装持有的控件。取消结算仍返回名称对象，因此名称本身不是图片可用的证明。迟到请求不会重新挂载界面。

## TypeScript 兼容

根入口和 `/legacy` 保留最新已发布 1.1.0 的旧同步返回类型与函数替换形状，实际注册始终是异步的。上面的 `/runtime` 使用相同 JavaScript 实现，准确声明 Promise 和运行时 `.default` 自引用别名，并提供 `Option`、`Result`、`Factory`、`RuntimeFactory` 类型。

1.0.x 的旧 `export =` 与 1.1.0 的默认导出声明无法同时保持相同类型提取。依赖较早 CommonJS 声明的 TypeScript 代码应迁移到 `/runtime`；NodeNext ESM 消费者也优先使用此入口，避免根入口保留的历史命名空间形状。合法旧 JavaScript 调用和历史文件入口继续保留。

浏览器验证覆盖新旧核心的进度条裁剪和清理；完整移动端、插件组合与发布产物验收仍以项目记录为准。
