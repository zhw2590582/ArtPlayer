# Chromecast

[English](../en/plugin/chromecast.md)

在播放器右侧添加 Chromecast 按钮，通过 Cast SDK 选择会话并加载媒体。需要受支持的 Chrome 发送端、HTTPS 页面、实际接收设备和接收端能访问的媒体地址。本页描述未发布分支；本地页面、模拟 SDK 或成功建立会话均不证明电视已播放。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-chromecast
```

```js
import Artplayer from 'artplayer';
import artplayerPluginChromecast from 'artplayer-plugin-chromecast';
```

script 先加载 ArtPlayer，再加载 `dist/artplayer-plugin-chromecast.js`，全局名为 `artplayerPluginChromecast`。以下保留[原在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chromecast/index.js&example=chromecast)。部署到接收设备时请提供它实际能够访问的绝对媒体 URL；发送端的 localhost、相对地址或 Blob 地址不会被插件自动转换。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-chromecast/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-chromecast
// import artplayerPluginChromecast from 'artplayer-plugin-chromecast';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  fullscreen: true,
  fullscreenWeb: true,
  plugins: [
    artplayerPluginChromecast({
      // sdk: '', // The URL of the Cast SDK
      // mimeType: '', // The MIME type of the media
    }),
  ],
})
```

## 配置与回调

配置对象必填，`{}` 使用默认值。除了注册时捕获的 icon，其余选项和回调在对应操作时读取原对象。

| 字段 | 类型 | 行为 |
| --- | --- | --- |
| `url` | `string` | 优先使用非空值，否则读取当前 art.option.url |
| `sdk` | `string` | 可覆盖 Cast SDK 脚本地址 |
| `icon` | `string` | 替换按钮内部 HTML；使用可信内容，保留 art-icon/art-icon-cast 包装 |
| `mimeType` | `string` | 优先使用非空值，否则按 URL 扩展名推断 |
| `onStateChange` | `(state) => void` | normalized state：disconnected/connecting/connected/disconnecting |
| `onCastAvailable` | `(available: boolean) => void` | SDK 设备可用性事件，不是接收端播放成功 |
| `onCastStart` | `() => void` | 当前媒体 loadMedia 完成后调用 |
| `onError` | `(error: unknown) => void` | SDK 初始化、连接或加载失败；错误不一定是 Error 实例 |

回调中的 this 是原配置对象。默认 SDK 地址为 `https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1`。同一模块、同一 window 的并发 SDK 加载共享任务，以首个请求地址为准；失败后重试可读取新地址。

MIME 推断忽略 query/hash 并将扩展名转小写：mp4/webm/ogg/ogv/mp3/wav/flv/mov/avi/wmv/mpd/m3u8 分别使用 video/mp4、video/webm、video/ogg、video/ogg、audio/mp3、audio/wav、video/x-flv、video/quicktime、video/x-msvideo、video/x-ms-wmv、application/dash+xml、application/x-mpegURL；未知扩展名使用 application/octet-stream。映射不是接收设备对所有格式的支持承诺，必要时显式提供 mimeType。

## 注册和连接状态

注册实际返回 Promise，但添加 `chromecast` 控件发生在等待之前；SDK 在首次点击时才加载。注册完成不是 SDK ready。加载器有 30 秒就绪期限，单纯 script load 但 Framework 未准备好不算成功。使用默认媒体接收应用及 ORIGIN_SCOPED 自动加入策略，不提供自定义接收应用配置选项。

一次控件点击初始化 SDK、读取当前会话；没有会话则请求会话，再重新读取当前会话，然后等待 loadMedia。同一播放器的重复待处理点击共享操作。请求成功但仍无会话会报告连接错误。源地址在发送时读取；播放器之后切源不会自动再次投屏，应通过控件重新发送需要的媒体。

结果位于 `art.plugins.artplayerPluginChromecast`：

| 成员 | 含义 |
| --- | --- |
| `name` | 固定 artplayerPluginChromecast |
| `getCastState()` | 最近一次原始 SDK SessionState，初始 null；不是回调里的标准化状态 |
| `isCasting()` | 是否保留会话引用，不证明接收端媒体正在播放 |

控件图标以白色、橙色、红色表达断开、过渡、连接状态。会话结束、启动失败或被替换会使旧请求失效，迟到结果不启动旧媒体或显示陈旧通知。SDK 错误显示阶段对应 notice 并传给 onError；用户回调抛错仍可传播。

## 清理和共享会话

播放器销毁释放该实例的加载订阅、SDK 监听器和待处理操作，不中断其他播放器的 SDK 加载，也不结束页面共享的接收会话。成功加载的 SDK 脚本留在页面，失败或最后一个等待者取消时移除待加载脚本。控件 DOM 由核心管理。

插件没有公开的 start、stop、disconnect 或 destroy 方法，不负责持续同步本地暂停、进度和音量。回调与图标只描述该控制器观察到的状态。真实设备播放、网络可达性、切源与断连需用接收端验证，现有本地测试不能替代。

## TypeScript

根入口和 `/legacy` 保留 npm1.1.0 的必填配置、同步且仅含 name 的声明。准确回调、Promise 和状态方法使用同一实现的 `/runtime`：

```ts
import cast from 'artplayer-plugin-chromecast/runtime';
import type { RuntimeOption, RuntimeResult } from 'artplayer-plugin-chromecast/runtime';

const options: RuntimeOption = {
  onStateChange(state) { console.log(state, this.url); },
  onError(error) { console.error(error); },
};
const registerCast = cast(options);
function readSession(plugin: RuntimeResult): boolean {
  return plugin.isCasting(); // Session presence, not receiver playback.
}
```

根和 runtime 可导出的类型为 Option、Chromecast、Result、Factory、ConnectionState、RuntimeOption、RuntimeResult、RuntimeFactory。旧根 NodeNext 命名空间形状保持不变；准确 ESM 默认调用和较早的 `import = require` 用法使用 runtime。JavaScript 支持直接工厂及 `.default(...)`；这些兼容类型不扩展实际设备能力。
