# 视频背光

[English](../en/plugin/ambilight.md)

从视频画面采样颜色，在播放器周围显示模糊背光。插件使用 Canvas 读取像素，不需要额外 SDK，也不改变视频的播放或音频输出。

本页描述当前重构分支。生命周期修复及精确类型入口尚未发布；在线示例和未固定版本的 npm/CDN 包不等于当前候选。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-ambilight
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAmbilight from 'artplayer-plugin-ambilight';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-ambilight.js`，全局名为 `artplayerPluginAmbilight`。下面保留[在线背光示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-ambilight/index.js&example=ambilight)的原始代码；应用需要提供自己的容器和可访问的视频。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-ambilight/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-ambilight
// import artplayerPluginAmbilight from 'artplayer-plugin-ambilight';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  autoSize: true,
  plugins: [
    artplayerPluginAmbilight({
      blur: '50px',
      opacity: 1,
      frequency: 10,
      duration: 0.3,
    }),
  ],
})
```

## 配置

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `blur` | `string` | `'50px'` | CSS 模糊半径 |
| `opacity` | `number` | `0.5` | 背光网格透明度；示例显式设置为 `1` |
| `frequency` | `number` | `10` | 每秒采样次数上限，建议使用正数；实际频率受播放和帧调度限制 |
| `duration` | `number` | `0.3` | 背光颜色过渡时长，单位秒 |
| `zIndex` | `number` | 实际固定为 `9` | 保留的历史参数，不改变实际层级 |

插件按 3×3 网格采样颜色。它只在播放器处于播放状态且采样间隔满足条件时更新颜色；`frequency` 不是视频帧率设置。遮罩、裁剪或父容器的 `overflow` 样式也可能影响背光可见范围。

## start 和 stop

结果的 `name` 固定为 `artplayerPluginAmbilight`。在构造选项中安装时，插件收到播放器 `ready` 后开始调度：

```js
const light = art.plugins.artplayerPluginAmbilight;
light.stop();  // Stop sampling and retain the last colors.
light.start(); // Resume sampling while the player is playing.
```

两个方法都同步返回 `undefined`，不会播放或暂停视频。`stop()` 保留最后一次颜色；`start()` 不是“立即采一帧”的 Promise。重复调用不会创建多条采样循环。如果在播放器已经触发 `ready` 后才调用 `art.plugins.add(...)` 安装插件，需要自行调用返回结果的 `start()`。

插件没有 `update` 方法或独立的 `destroy` 方法。销毁播放器会停止帧调度、移除网格和插件订阅、释放采样画布。销毁后保留的 `start/stop` 不再启动工作。

## 媒体访问和代理

视频必须能被浏览器解码并允许 Canvas 读取像素。跨域视频需要正确的媒体跨域配置和服务端 CORS 响应；仅能播放不代表允许取色。像素读取失败时跳过该次更新并保留现有颜色，后续可读取的来源仍可恢复，插件不会绕过浏览器的跨域限制。

Canvas proxy 使用它实际输出的画布尺寸取样。其他代理能否提供可绘制画面需要分别验证；不要把一个桌面组合通过解释为所有浏览器或代理都支持。颜色采样也不代表物理显示器背光控制。

## TypeScript 兼容入口

根入口和 `/legacy` 保留已发布 1.1.0 的工厂类型：参数对象必填，字段可选。使用这些类型时传入 `{}` 选择默认值。JavaScript 运行时仍接受省略参数。

需要准确的可选调用、CommonJS `.default` 自引用或 NodeNext ESM 默认调用类型时，使用同一实现的 `/runtime`：

```ts
import ambilight from 'artplayer-plugin-ambilight/runtime';

const installLight = ambilight();
const installDefaultLight = ambilight.default({ opacity: 0.5 });
```

根声明可导入的类型包括 `Option`、`Result`、`Callable`、`Factory` 和 `RuntimeFactory`。1.0.0 的 `export =` 及必填配置字段与 1.1.0 不同；旧 `import = require` 代码可迁到 `/runtime`，读取可选字段时提供默认值。Node10 TypeScript 默认导入 `/runtime` 需要启用 `esModuleInterop`，不启用时可用 `import = require`。
