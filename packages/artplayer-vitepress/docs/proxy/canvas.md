# Canvas 视频代理

[English](../en/proxy/canvas.md)

使用真实 video 解码音视频，把画面绘制到 Canvas，并允许逐帧后处理。通过 ArtPlayer 的 proxy 配置安装，不放进 plugins 数组。本页描述未发布分支；Canvas 输出仍受浏览器解码、像素访问及设备能力限制。

## 安装与示例

```sh
yarn add artplayer artplayer-proxy-canvas
```

ESM 使用 `import canvas from 'artplayer-proxy-canvas'`。script 加载 `dist/artplayer-proxy-canvas.js`，全局名为 `artplayerProxyCanvas`。以下保留[原始示例](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-canvas/index.js&example=canvas)：

<div className="run-code" data-libs="./uncompiled/artplayer-proxy-canvas/index.js">▶ Run Code</div>

```js
// npm i artplayer-proxy-canvas
// import artplayerProxyCanvas from 'artplayer-proxy-canvas';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  poster: '/assets/sample/poster.jpg',
  volume: 0.5,
  autoplay: false,
  autoSize: false,
  screenshot: true,
  setting: true,
  loop: true,
  flip: true,
  pip: true,
  playbackRate: true,
  aspectRatio: true,
  fullscreen: true,
  fullscreenWeb: true,
  miniProgressBar: true,
  autoPlayback: true,
  autoOrientation: true,
  subtitle: {
    url: '/assets/sample/subtitle.srt',
  },
  thumbnails: {
    url: '/assets/sample/thumbnails.png',
    number: 60,
    column: 10,
    scale: 0.85,
  },
  proxy: artplayerProxyCanvas(),
})
```

可选参数是一个绘制回调，不是配置对象：

```js
proxy: artplayerProxyCanvas((context, video) => {
  context.fillStyle = 'rgba(0, 0, 0, 0.4)';
  context.fillRect(0, 0, context.canvas.width, 32);
  context.fillStyle = '#fff';
  context.fillText(video.currentTime.toFixed(1), 10, 22);
})
```

回调收到真实 CanvasRenderingContext2D 和内部 HTMLVideoElement。基础画面先绘制，已取得的 ImageBitmap 先关闭，再同步调用回调；返回值不参与渲染，异步回调的 Promise 不被等待。每帧需要的 Canvas 状态应自行设置，尺寸改变会重置绘制状态。

## 返回元素与媒体接口

初始化同步返回实际 HTMLCanvasElement，ArtPlayer 将其作为视频位置的元素。内部 video 在播放前连接到播放器容器，透明且不可聚焦，不创建第二个可见播放器。

Canvas 原有成员优先：width/height、DOM 事件、getContext、toDataURL 等仍属于 Canvas。只有遍历到且 Canvas 上不存在的 video 成员才转发给内部 video；这不是完整 HTMLVideoElement 的运行时复制。需要底层 video 时使用回调参数。

媒体事件从内部 video 转成 ArtPlayer 的 `video:<type>`，传递原 Event。不要把 `canvas.addEventListener('play', ...)` 当作内部 video 监听；使用 `art.on('video:play', ...)`。媒体 src/srcObject 写入及 load 会使旧绘制失效。

subtitle 仍使用 ArtPlayer 的正常配置。活动代理的 appendChild 对 HTML track 有专门转发，使实际字幕 track 挂到内部 video；普通子节点继续挂在 Canvas。核心负责字幕 track 替换和 URL，代理最初的空 metadata track 会在第一条真实字幕插入前移除。字幕 DOM 的最终父节点是 VIDEO。

## 绘制、尺寸和事件

| 行为 | 实际处理 |
| --- | --- |
| 播放 | 开启单条 RAF 绘制链，不重叠执行多次异步取帧 |
| 暂停、清空来源 | 取消待处理绘制，保留已显示画面 |
| 暂停后 seek | 请求一次新画面 |
| resize | 合并绘制请求，旧异步结果失效 |
| loadedmetadata | 有有效原始尺寸时设置 Canvas width/height |
| autoSize 为 false | resize 时按视频比例适配容器，并用 padding 居中 |
| autoSize 为 true | 代理不执行上述容器适配，交由播放器处理自动尺寸 |

帧需要 readyState 至少2、非 seeking、有效视频和画布尺寸。可用时使用 createImageBitmap，否则直接 drawImage(video)；这不是保证每个解码帧都有回调。跨域视频的 CORS 配置和响应仍决定截图/像素处理是否可用。

| 自定义事件 | 参数与顺序 |
| --- | --- |
| `artplayerProxyCanvas:draw` | context、真实 video；成功回调之后发出 |
| `artplayerProxyCanvas:error` | 原始失败值；绘制、回调或初始化失败时报告 |

缺少2D context 会报告错误。首帧 createImageBitmap 在特定未解码状态下的 InvalidStateError 会等下一次绘制请求；不会把回调或 drawImage 的失败都当成“等首帧”。回调中销毁播放器后不再发 draw 或重启循环。

## 清理与能力边界

播放器销毁后取消 RAF/延迟初始化，移除内部监听器，暂停并卸载 video、清空 srcObject 和 Canvas 缓冲区。晚到位图仍会关闭。释放流引用不会 stop 调用方拥有的媒体 tracks；资源清理尽量全部执行后才抛首个错误。逃逸的媒体方法和转发 setter 不再启动播放或重新设源，原生 Canvas 方法仍操作原元素。

代理没有独立的公开 start/stop/destroy 控制对象；使用 ArtPlayer 的生命周期。原示例打开的 PiP、全屏、截图等选项仍取决于实际底层能力，不能从配置存在推断所有浏览器都支持。Windows 浏览器结果不能替代 Safari/iPhone/Android 真机验证。

## TypeScript 与旧类型

根和 `/legacy` 保留最新已发布1.1.0 的可选回调、纯工厂及精确 HTMLCanvasElement 返回类型，普通替换函数仍可赋值。1.0 的 export= 必填回调形状与之冲突，已批准选择最新根形状；需要准确 ESM/旧式 CommonJS 调用和自引用描述时用同实现的 `/runtime`：

```ts
import Artplayer from 'artplayer';
import canvas from 'artplayer-proxy-canvas/runtime';
import type { MediaCanvas, Option } from 'artplayer-proxy-canvas/runtime';

const overlay: Option = (context, video) => {
  context.fillText(video.currentTime.toFixed(1), 10, 22);
};
const art = new Artplayer({ container: '#player', url: '/movie.mp4', proxy: canvas(overlay) });
const media = art.template.$video as MediaCanvas;
function play(): Promise<void> { return media.play(); }
```

公开类型为 Option、Result、Factory、Callable、MediaCanvas、RuntimeFactory。MediaCanvas 是显式类型视图，保留 Canvas 同名成员，不增加实际能力或收紧工厂的返回推导。根 NodeNext ESM 的历史命名空间类型仍保留，准确默认调用使用 runtime。JavaScript 根工厂和 `.default` 指向同一函数；runtime 类型将该别名描述为 readonly。CommonJS 可直接 require，旧 TS 的 `import = require` 可选择 runtime 入口。
