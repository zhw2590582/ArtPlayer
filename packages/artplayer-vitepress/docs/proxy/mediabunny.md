# Mediabunny 视频代理

[English](../en/proxy/mediabunny.md)

通过 Mediabunny 读取媒体，由 Canvas 与音频管线提供 video-like 接口，并支持 HLS 音轨/清晰度选择。安装位置是 ArtPlayer 的 proxy 选项。本页描述未发布分支；它不补齐浏览器缺少的解码器或所有 HTMLVideoElement 能力。

## 安装和示例

```sh
yarn add artplayer artplayer-proxy-mediabunny
```

ESM 使用 `import mediabunny from 'artplayer-proxy-mediabunny'`。script 加载 `dist/artplayer-proxy-mediabunny.js`，全局为 `artplayerProxyMediabunny`。下面保留[原始 HLS 示例](https://artplayer.org/?libs=./uncompiled/artplayer-proxy-mediabunny/index.js&example=mediabunny)，其远端流不是离线夹具：

<div className="run-code" data-libs="./uncompiled/artplayer-proxy-mediabunny/index.js">▶ Run Code</div>

```js
// npm i artplayer-proxy-mediabunny
// import artplayerProxyMediabunny from 'artplayer-proxy-mediabunny';

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  autoSize: true,
  setting: true,
  loop: true,
  flip: true,
  playbackRate: true,
  fullscreen: true,
  fullscreenWeb: true,
  miniProgressBar: true,
  autoPlayback: true,
  autoOrientation: true,
  proxy: artplayerProxyMediabunny({
    m3u8: {
      quality: {
        control: true,
        setting: true,
        getName: level => level.height ? `${level.height}P` : level.name,
        title: 'Quality',
        auto: 'Auto',
      },
      audio: {
        control: true,
        setting: true,
        getName: track => track.name || track.language,
        title: 'Audio',
        auto: 'Auto',
      },
    },
  }),
})
```

工厂接受可选配置，初始化同步返回真实 HTMLCanvasElement，同时设置 `art.mediabunny`。Canvas 的同名原生成员优先：DOM 事件/属性方法并不自动变成 shim 方法。用 ArtPlayer 的 video:* 事件或显式 shim 访问媒体能力。

## 输入和配置

| 选项 | 默认或作用 |
| --- | --- |
| `source` | 初始来源；非空值优先于 art.option.url，之后宿主赋值仍可替换 |
| `loadTimeout` | 0，不设置加载期限；有限正数按毫秒限制本次加载 |
| `timeupdateInterval` | 250ms，渲染器的更新间隔，不是精确计时承诺 |
| `avSyncTolerance` | 0.12秒，参与开启丢帧时的迟到阈值计算 |
| `dropLateFrames` | false；启用后允许跳过超过容差的迟到画面 |
| `poster` | 默认空字符串；视频引擎初始化时捕获的海报地址 |
| `preflightRange` | false；可选的普通 URL HEAD 检查 |
| `volume` / `muted` | 0.7 / false 的初始 shim 状态，之后可被播放器设置覆盖 |
| `autoplay` / `loop` | 默认 false 的兼容读取值；不会仅凭代理配置自行启动/循环 |
| `crossOrigin` | 默认空字符串的兼容读取值；不配置 SDK fetch 的凭据或 CORS |
| `m3u8` | 可选清晰度/音轨菜单，见下节 |

自动播放、循环等播放器行为使用 ArtPlayer 自身配置，并受浏览器播放策略限制。代理 shim 的 autoplay/loop/crossOrigin setter 保留为空操作，不能当作原生 video 设置使用。改变 shim.poster 更新其配置读取值，不保证重绘视频引擎已捕获的海报。

source 声明接受 URL 字符串、Blob 或 ReadableStream 字节流；运行时也把 SDK Source/SourceRef 交给 SDK 验证。字符串按 `.m3u8` 后缀（忽略大小写，允许 query/hash）识别 HLS，使用 HLS_FORMATS；其他输入使用 ALL_FORMATS。无此后缀的地址不会仅凭返回内容自动启用本代理的 HLS 菜单状态。可读流能否随机访问/重复加载仍取决于其来源能力。

Range 检查仅对启用检查的非 HLS 字符串请求 HEAD。没有 accept-ranges 或值为 none 时发出 detail 为 RangeNotSupported Event 的 error，停止该次加载前置过程，但不会设置 shim.error。网络请求异常会警告并继续；HLS 和非字符串跳过 HEAD。它不是完整 Range GET 或编码支持验证。媒体服务器仍需要实际可读响应及 CORS。

## HLS 菜单与选择

m3u8.quality 和 m3u8.audio 都可配置 control、setting、title、auto、getName。control/setting 都不启用时不显示对应菜单；使用 setting 还需播放器设置面板。

| 配置 | 默认 |
| --- | --- |
| `quality.title` / `audio.title` | Quality / Audio |
| 两者 `auto` | Auto |
| `quality.getName(level)` | level.name，否则高度加 P |
| `audio.getName(track)` | track.name、lang、language 顺序取值 |

level 包含 id、index、name、height、bitrate；audio 包含 id、index、name、lang、language、bitrate。完整状态还带 SDK track 对象。name 可为 null，getName 应返回可显示字符串。

有视频级别才显示清晰度；可配对音轨至少两条才显示音轨菜单。清晰度按高度降序，相同显示名称会合并，优先保留当前选中项。高亮和按钮文本依据实际当前 track；即使 mode 是 auto，也可能显示实际选中的清晰度/音轨而非 Auto。

```js
const shim = art.mediabunny;
const state = await shim.getM3u8State();
if (state?.levels.length) {
  await shim.switchM3u8Quality(state.levels[0].id);
}
await shim.switchM3u8Audio('auto');
```

用状态中的数值 id 或字面量 `'auto'`，不要把 index、显示名或数字字符串当成 id。Auto 重新选择 SDK primary track，不代表代理会测带宽并持续自动切码率。切清晰度时尽量保留可配对音轨，否则重新选 primary pairable audio；音轨变化同样维护视频配对。未知 id 沿用当前轨道；无 HLS 来源时这些方法无操作。

菜单标识为 mediabunny-quality / mediabunny-audio。metadata/restart 刷新，loadstart/error/销毁清理。新来源缺少对应能力时移除旧 UI，旧菜单回调及过期选择不能覆盖新状态。异步切换失败仍可能拒绝，应处理 Promise。

## shim 成员

| 成员 | 行为 |
| --- | --- |
| `canvas` | 原生输出元素 |
| `src` / `currentSrc` | 来源值；非空 src 赋值发起加载，空值不等同于卸载 |
| `play()` / `pause()` / `load()` | Promise 播放、同步暂停、按当前 src 重新加载；load 不返回完成 Promise |
| `currentTime` | 秒；写入启动异步 seek，setter 本身不能等待完成 |
| `duration` | 秒；未知可为 NaN，直播可为 Infinity |
| `volume` / `muted` | volume 数值转换并钳制0–1，写 volume 同时取消静音；写 muted 布尔化 |
| `playbackRate` | 默认1，接受转换后大于0且非NaN的值；设置发 ratechange |
| `paused` / `playing` / `ended` / `seeking` | 播放协调器状态，playing 不是已显示真实帧的证明 |
| `readyState` / `networkState` / `error` | 兼容状态及 `{code, message}` 或 null |
| `videoWidth` / `videoHeight` | 视频引擎尺寸 |
| `buffered` / `played` / `seekable` | 合成范围：0到时长、0到当前时间、0到时长，不是实际网络缓冲测量 |
| `createTimeRanges(start, end)` | 同一合成范围工具，空范围返回长度0；非空长度1，未实现原生索引越界异常 |
| `canPlayType(type)` | 固定返回 maybe，不检测支持能力 |
| `getM3u8State()` | Promise，非HLS/失效状态为 null |
| `switchM3u8Quality(value)` / `switchM3u8Audio(value)` | Promise 轨道选择 |
| `addEventListener` / `removeEventListener` | shim 媒体事件，不是 Canvas DOM 监听器 |
| `getBoundingClientRect()` | 委托 Canvas |
| `setAttribute(name, value)` | shim 方法特殊处理 src/muted，autoplay/loop沿用空setter；其他委托Canvas |
| `destroy()` | 同步终止 shim 及其引擎，重复调用无操作 |

兼容字段 poster、autoplay、loop、crossOrigin 如上。controls=false、playsInline=true、preload='auto'、defaultMuted=false、defaultPlaybackRate=1；这些字段的 setter 无操作。直接 canvas.setAttribute 使用原生 Canvas 方法，与 shim.setAttribute 不同。正常宿主清理应使用 art.destroy，以同时释放 UI/别名/订阅。

HlsState 包含 levels、audios、currentLevel、currentAudio、videoMode、audioMode；当前项可为 null，模式为 auto/manual。audios 是与当前视频可配对的音轨，纯音频状态不保证有菜单项。track 类型为 unknown，按应用使用的 SDK 类型缩窄。

## 事件、帧回调与清理

shim 事件转发到 ArtPlayer 的 video:*，监听参数为 Event 加 detail。普通监听保留重复注册、移除首个匹配项和活数组遍历；异常可传播，不提供原生 EventTarget 的 options 参数或完整语义。

成功加载在音视频准备后先发布 loadedmetadata/durationchange/progress，再发布 loadeddata/canplay/canplaythrough/progress；加载的 waiting/loadstart 保留延迟通知。两个已选轨道都无法解码时报告 code4，不发布成功就绪序列；仍有可用轨道时可部分播放。seek 发 seeking/waiting，完成后 seeked；轨道替换还会更新 metadata/ready 事件。每一步检查是否已被新操作或销毁取代。

requestVideoFrameCallback(callback) 返回可取消的 RAF 编号，是一次性模拟通知，不保证解码新帧；暂停时也可能回调。callback(now, metadata) 的 now/captureTime/receiveTime 为 RAF 时间，expectedDisplayTime 估计为 now+16.6；presentationTime 和 mediaTime 是媒体秒数。width/height 来自引擎，presentedFrames、processingDuration、rtpTimestamp 恒为0。不要将这些值用于真实解码吞吐或网络延迟统计。

切源、取消与销毁使旧异步任务失效；暂停取消待开始播放并阻止旧 seek 完成后自行恢复。被替代操作可能正常结算，不能据此判定原意图已执行。活动播放/轨道错误仍可拒绝；src/load 的加载错误通过媒体事件报告，常规错误为 code4，Range 前置检查是上述独立路径。

销毁取消输入和预检查、帧回调、定时器、音频节点/AudioContext 及解码资源。宿主销毁还移除自身菜单、订阅，并只删除仍由该代理持有的 art.mediabunny。晚到结果不能重新激活实例。清理调用不是 GPU/浏览器全部底层资源已物理回收的 Promise；长期播放和真机验证保持独立。

## TypeScript

根和 `/legacy` 保留可选配置及精确 HTMLCanvasElement 返回推导，无 `/runtime` 子路径。需要媒体能力时使用显式类型视图：

```ts
import Artplayer from 'artplayer';
import mediabunny from 'artplayer-proxy-mediabunny';
import type { MediaBunnyPlayer } from 'artplayer-proxy-mediabunny';

const art: MediaBunnyPlayer = new Artplayer({
  container: '#player', url: '/movie.m3u8',
  proxy: mediabunny({ m3u8: { quality: { control: true } } }),
});
async function selectFirstLevel(): Promise<void> {
  const shim = art.mediabunny;
  if (!shim) return;
  const state = await shim.getM3u8State();
  if (state?.levels.length) await shim.switchM3u8Quality(state.levels[0].id);
}
```

公开类型为 Option、Result、HlsLevel、HlsAudio、HlsState、MediaBunnyCanvas、MediaBunnyPlayer、MediaBunnyShim、MediaListener、SyntheticFrameCallback、SyntheticFrameMetadata。Canvas 视图保留同名原生成员；Player 别名可缺省且销毁后移除。CommonJS 运行时支持直接工厂和历史 `.default`，默认工厂类型仍为纯可调用签名。legacy 构建不提供 WebCodecs、Web Audio 或其他浏览器能力的 polyfill。
