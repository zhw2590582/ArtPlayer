# ASS 字幕：JASSUB

[English](../en/plugin/jassub.md)

使用 JASSUB Worker/WASM 在 Canvas 上渲染 ASS 字幕。插件返回真实 JASSUB 实例，保留其方法与事件，不将字幕转换成普通 VTT。本页描述当前未发布分支；Worker、WASM、字体和实际视频效果仍需按部署环境验证。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-jassub
```

```js
import Artplayer from 'artplayer';
import artplayerPluginJassub from 'artplayer-plugin-jassub';
```

script 先加载 ArtPlayer，再加载 `dist/artplayer-plugin-jassub.js`，全局名为 `artplayerPluginJassub`。下面保留[原在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-jassub/index.js&example=jassub)；其中的 Worker/WASM 和字体地址属于站点资产，不会因为安装插件而自动出现在应用中。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-jassub/index.js">▶ Run Code</div>

```js
// https://github.com/ThaUnknown/jassub
// npm i artplayer-plugin-jassub
// import artplayerPluginJassub from 'artplayer-plugin-jassub';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/jassub/FGOBD.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginJassub({
            subUrl: '/assets/jassub/FGOBD.ass',
            workerUrl: '/assets/jassub/jassub-worker.js',
            wasmUrl: '/assets/jassub/jassub-worker.wasm',
            modernWasmUrl: '/assets/jassub/jassub-worker-modern.wasm',
            availableFonts: {
                'liberation sans': '/assets/jassub/default.woff2'
            },
            fonts: [
                '/assets/jassub/fonts/Averia Sans Libre Light.ttf',
                '/assets/jassub/fonts/Averia Serif Simple Light.ttf',
                '/assets/jassub/fonts/Gramond.ttf'
            ],
            timeOffset: -0.041
        }),
    ],
});
```

自行托管相互匹配的 Worker、WASM 和字体，确认路径、访问策略及字体使用许可。缺失字体会影响排版；相对默认路径存在不等于文件已部署。

## 资源和渲染选项

实际配置可省略，默认绑定 art.video；配置在注册时读取，显式 video 可覆盖它。以下按当前本地实现描述，不照搬上游注释中的旧默认值。

| 字段 | 实际默认或含义 |
| --- | --- |
| `video` / `canvas` | 默认 video 为 art.video；提供自己的 canvas 可手动管理节点，至少需要可用的渲染目标 |
| `workerUrl` | `'jassub-worker.js'` |
| `wasmUrl` | `'jassub-worker.wasm'` |
| `legacyWasmUrl` | `'jassub-worker.wasm.js'` |
| `modernWasmUrl` | 检测到 SIMD 且提供此地址时优先使用，否则使用 wasmUrl |
| `subUrl` / `subContent` | 字幕地址或 ASS 文本，传给 Worker |
| `fonts` | 默认空数组，元素可为 URL 或 Uint8Array |
| `availableFonts` | 默认 `{ 'liberation sans': './default.woff2' }`，字体名到 URL/字节映射 |
| `fallbackFont` | `'liberation sans'` |
| `useLocalFonts` | 只有存在 queryLocalFonts 时启用；未指定时当前实现为 true，可显式 false；仍受权限限制 |
| `blendMode` | `'js'`，也可选 `'wasm'` |
| `asyncRender` | 默认 true，但需 createImageBitmap 能力 |
| `offscreenRender` | 默认 true，但需 transferControlToOffscreen 且没有传入自有 canvas |
| `onDemandRender` | 默认 true，但需 requestVideoFrameCallback 能力 |
| `targetFps` | 默认 24，按需渲染时不作为固定更新承诺 |
| `timeOffset` | 默认 0，单位秒 |
| `debug` | 默认 false |
| `prescaleFactor` / `prescaleHeightLimit` / `maxRenderHeight` | 默认 1 / 1080 / 0，控制渲染尺寸；0 的最大高度表示不设置此上限 |
| `dropAllAnimations` / `dropAllBlur` | 转发给 Worker 的简化渲染选项，未指定时不在包装层设置为 true |
| `libassMemoryLimit` / `libassGlyphLimit` | 默认 0，libass 缓存限制参数，单位 MiB；不是浏览器总内存上限 |

若平台缺少能力，渲染路径会与配置意图不同。不要把异步、离屏或后端选项视为所有设备的速度保证，也不要在不同版本 Worker 与包装层之间混用资源。

## 实例和方法

注册同步返回 `{ name: 'artplayerPluginJassub', instance }`，不是 Worker ready Promise。通过 `art.plugins.artplayerPluginJassub.instance` 取得实例。实例是 EventTarget，监听 ready 后再进行查询；error 事件属于该实例，不是播放器的同名事件。

| 方法 | 行为与单位 |
| --- | --- |
| `resize(width?, height?, top?, left?, force?)` | 同步返回 void；实际 force 在最后，省略尺寸时依据视频计算 |
| `setVideo(video)` | 同步切换绑定视频、观察器和自有容器位置 |
| `setTrackByUrl(url)` / `setTrack(content)` / `freeTrack()` | 切换地址、ASS 文本或释放字幕轨道 |
| `setIsPaused(boolean)` / `setRate(number)` | 手动更新 Worker 的播放状态/倍率 |
| `setCurrentTime(isPaused?, currentTime?, rate?)` | currentTime 使用秒 |
| `createEvent(event)` / `setEvent(event, index)` / `removeEvent(index)` | 增删改 ASS event，修改对象为部分字段 |
| `getEvents(callback)` | 回调返回 event 数组，非 Promise |
| `createStyle(style)` / `setStyle(style, index)` / `removeStyle(index)` | 增删改样式，修改对象为部分字段 |
| `getStyles(callback)` | 回调返回样式数组，非 Promise |
| `styleOverride(style)` / `disableStyleOverride()` | 设置/取消样式覆盖 |
| `setDefaultFont(font)` / `addFont(font)` | 设置默认字体或添加 URL/字节字体 |
| `runBenchmark()` | 请求 Worker 基准操作，不代表端到端性能结论 |
| `sendMessage(target, data?, transferable?)` | Promise 仅表示已发送，或销毁后无需发送，不等待 Worker 确认 |
| `destroy()` | 同步清理并可重复调用，没有资源回收完成 Promise |

除 sendMessage 外，上表普通控制方法返回 void；查询通过回调提供数据。`destroy(error)` 保留历史返回行为：原 Error 原样返回，非空字符串转为 Error，空字符串原样返回。正常调用使用无参 destroy。

AssEvent 的 Start/Duration 为毫秒，Style 是数字样式索引；其余字段为 Name、MarginL/MarginR/MarginV、Effect、Text、ReadOrder、Layer。AssStyle 包含 Name/FontName/FontSize、PrimaryColour/SecondaryColour/OutlineColour/BackColour、Bold/Italic/Underline/StrikeOut、ScaleX/ScaleY/Spacing/Angle、BorderStyle/Outline/Shadow/Alignment、MarginL/MarginR/MarginV、Encoding、treat_fontname_as_pattern、Blur、Justify。查询结果没有 `_index`，不要混淆 ASS 文本格式的样式名称与运行时 Style 数字。

查询回调成功为 `(null, array)`；失败为 Error 或原生 Event 且没有数据。销毁会在清理监听器/定时器后使待处理查询失败。协议按响应 target 匹配，没有新的请求 ID；避免把同时发出的同类查询当作独立关联响应。

## 生命周期和类型

插件创建的 `.JASSUB` 容器设为 z-index 20，销毁时移除；调用方传入的 canvas/video 保留。播放器销毁调用实例当前的 destroy，直接销毁也保持幂等。setVideo 和销毁会使旧帧回调失效，Worker 和自有观察器会清理；晚到的异步位图不应重新启动渲染。真实离屏停顿、浏览器差异和物理设备仍有独立验收要求。

根和 `/legacy` 保留旧 JassubOption/JassubInstance 类型：三个资源 URL 必填、force-first resize，以及错误的 Promise 方法返回和任意扩展索引。准确类型使用同一实现的 `/runtime`：

```ts
import type Artplayer from 'artplayer';
import jassub from 'artplayer-plugin-jassub/runtime';

function attachSubtitles(art: Artplayer) {
  const { instance } = jassub({
    workerUrl: '/assets/jassub/jassub-worker.js',
    wasmUrl: '/assets/jassub/jassub-worker.wasm',
    subUrl: '/subtitles.ass',
  })(art);
  instance.addEventListener('ready', () => {
    instance.getEvents((error, events) => {
      if (error) console.error(error);
      else console.log(events);
    });
  });
  return instance;
}
```

runtime 导出 FontSource、RuntimeOption、AssEvent、AssStyle、AssEventInput、AssStyleInput、WorkerRequestError、EventsCallback、StylesCallback、RuntimeEventMap、RuntimeInstance、RuntimeResult、RuntimeFactory。精确实例字段包括 timeOffset、debug、三项尺寸设置、可选 busy，以及历史公开 `_canvas/_ctx`；`_ctx` 可能为 false/null。没有运行时工厂 `.default` 自引用；NodeNext 根类型的命名空间不能当作这种别名。runtime 支持准确 ESM 默认导入和 CommonJS `import = require`。
