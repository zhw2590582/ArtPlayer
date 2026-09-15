# VAST 广告

[English](../en/plugin/vast.md)

通过 Glomex VAST IMA Player 和 Google IMA SDK 请求并展示广告。与 [Ads 插件](./ads.md)的本地倒计时广告不同，这里使用广告标签地址或 VAST 响应。SDK 脚本和广告资源需要可访问，网络、VPN 或广告拦截规则可能阻止加载。本页描述未发布重构分支，线上示例不是当前候选的验收证据。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-vast
```

```js
import Artplayer from 'artplayer';
import artplayerPluginVast from 'artplayer-plugin-vast';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-vast.js`，全局名为 `artplayerPluginVast`。插件通过其 Glomex 依赖加载 IMA，无需另造加载器。以下保留[原在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-vast/index.js&example=vast)；其中的外部广告地址并非本地测试夹具。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-vast/index.js">▶ Run Code</div>

```js
// Depends on:
// https://glomex.github.io/vast-ima-player/
// https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side

// Google's IMA SDK are blocked by your Ad blocker.
// Please Turn Off Your Ad Blocker.

// npm i artplayer-plugin-vast
// import artplayerPluginVast from 'artplayer-plugin-vast';

var art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  fullscreen: true,
  fullscreenWeb: true,
  plugins: [
    artplayerPluginVast(({ playUrl, imaPlayer, ima }) => {
      // Play the ad when the video is played
      art.once('play', () => {
        playUrl('https://artplayer.org/assets/vast/linear-ad.xml')
      })
    }),
  ],
})
```

## 初始化兼容模式

工厂形状为 `artplayerPluginVast(callback?, options?)`，返回异步注册函数。加载 SDK、创建相应上下文并 await 用户回调后，注册才完成。回调可返回 Promise，但注册完成不等于广告已请求或播放。

| 行为 | 默认 npm 模式 | `{ compatibility: 'workspace-1.2' }` |
| --- | --- | --- |
| 回调开始时 | 已创建 IMA player 和容器 | 尚未创建，等 init/playUrl/playRes |
| IMA 设置 | 保留 SDK 自身默认值 | 预加载和广告结束后恢复自定义播放状态默认为 true |
| 资源字段 | imaPlayer/id/$container 是可写数据字段 | 三者是实时只读 getter，初始化前或释放后为 null |
| 请求 | 包装层转发每次显式请求 | 活动广告期间抑制新的请求 |
| 容器 | 由 SDK 管理广告显隐，保留默认样式 | 黑色覆盖层，四个广告事件控制显隐和活动状态 |

这是已批准的兼容选择：已发布 npm 1.0.0 用户保留默认行为，依赖未发布工作区 1.2 惰性初始化的代码必须显式选择工作区模式。模式在工厂调用时读取一次；未知值立即抛出 TypeError，不会启动 SDK 加载。

## 回调上下文

| 字段 | 实际用途 |
| --- | --- |
| `art` | 当前播放器实例 |
| `ima` | 已加载的 IMA SDK |
| `adsRenderingSettings` | 传给新 SDK player 的 IMA AdsRenderingSettings 对象 |
| `playerOptions` | 传给新 SDK player 的 Glomex PlayerOptions 对象 |
| `imaPlayer` | SDK player，默认模式已创建；工作区模式可为 null |
| `id` / `$container` | 该模式的容器 ID/元素，空值和快照规则见上表 |
| `container` | 两种模式均为当前容器的只读 getter；未创建或释放后为 null |
| `init()` | 取得或创建当前 SDK player，终止后返回 null |
| `playUrl(url, config?)` | 创建 AdsRequest，设置 adTagUrl 并请求广告；同步返回 void |
| `playRes(response, config?)` | 创建 AdsRequest，设置 adsResponse 并请求广告；同步返回 void |

config 是附加请求字段；沿用历史 for-in 复制行为，包括可枚举的继承字段，且复制发生在主字段之后，因此可以覆盖 adTagUrl/adsResponse。请传入应用明确控制的配置。请求构造或 SDK 同步错误可直接抛出，void 返回不表示广告成功，也不是播放完成 Promise。

要在 SDK player 创建前配置选项，使用工作区模式并先修改原 settings/options 对象，再调用 init 或请求方法。默认模式的首个 player 在回调之前已经创建；不要假设回调内修改选项能追溯改变构造行为。

默认模式释放后，imaPlayer/id/$container 仍保留上次分配的快照，但 SDK 已销毁、容器已移除；不能继续把快照当作活跃资源。显式重建会更新它们。写入这些字段不会转移插件内部资源所有权。工作区模式应保留 context 并实时读取 getter，避免解构保存初始化前的 null。

## 广告事件与销毁

SDK 事件通过 imaPlayer 订阅，不是同名的 ArtPlayer 事件。工作区包装层监听 `AdContentPauseRequested`、`AdContentResumeRequested`、`AdStarted`、`AdError`，改变覆盖层和活动状态；AdError 同时记录错误。默认模式不增加这些工作区监听器。正文暂停/恢复由 SDK 负责，包装层不重复实现。

结果名为 `artplayerPluginVast`，通过 `art.plugins.artplayerPluginVast` 取得，公开 `destroy()` 同步释放当前会话。播放器仍存活时，可再次调用回调中保留的 init/playUrl/playRes 创建新会话。重建后的 SDK 是新对象，需要重新安装应用自己的 SDK 监听器。

核心销毁使这次插件安装永久终止：SDK 加载的迟到完成不再调用回调或创建容器，init 返回 null，请求方法为空操作。它不会取消其他实例共用的 SDK 脚本加载。SDK 加载或用户回调失败会清理附件并保留原拒绝值；清理失败可能可观察，但其余资源仍会尝试释放。不要将插件 destroy 与核心 destroy 的终止语义混同。

真实广告播放还涉及可用广告响应、IMA、浏览器策略和设备。SDK 加载受阻时不能把 mock、页面导航或正文继续播放当作广告播放通过；使用目标网络和设备单独验收。

## TypeScript 入口

根入口和 `/legacy` 保留 npm 1.0.0 的必填回调、any SDK 字段和错误的同步 name-only 返回声明，不要求旧替换函数增加 `.default`。实际注册一直是异步的。需要准确类型、可省略回调、第二参数或 destroy 时使用同一实现的 `/runtime`：

```ts
import vast from 'artplayer-plugin-vast/runtime';
import type { RuntimeResult } from 'artplayer-plugin-vast/runtime';

const installPublished = vast(({ imaPlayer }) => {
  imaPlayer.addEventListener('AdStarted', () => console.log('Ad started'));
});

const installWorkspace = vast((context) => {
  context.playerOptions.autoResize = false;
  context.init()?.addEventListener('AdStarted', () => console.log('Ad started'));
}, { compatibility: 'workspace-1.2' });

function releaseAd(result: RuntimeResult): void {
  result.destroy();
}
```

runtime 导出 RequestConfig、CompatibilityOptions、Context、PublishedContext、WorkspaceContext、RuntimeContext、RuntimeCallback、RuntimeResult、Registration、RuntimeFactory，及旧工作区别名 ArtplayerPluginVastOption/ArtplayerPluginVastInstance。前者是工作区回调类型，后者是 await 后的结果类型。CommonJS 无 interop 时可用 runtime 的 `import = require`，支持函数和 `.default`；这些类型不会更改旧根声明。
