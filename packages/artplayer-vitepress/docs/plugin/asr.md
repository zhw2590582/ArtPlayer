# 音频采集与识别字幕

[English](../en/plugin/asr.md)

从播放器视频采集音频，将 PCM/WAV 片段交给应用提供的识别回调，并显示回调返回的字幕。插件不内置识别模型或网络服务，也不读取麦克风。本页描述当前未发布的重构分支；新增类型入口和采集选项不等于线上版本已具备这些能力。

## 安装和本地示例

```sh
yarn add artplayer artplayer-plugin-asr
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAsr from 'artplayer-plugin-asr';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-asr.js`，全局名为 `artplayerPluginAsr`。以下保留 `asr.local` 原始示例：只采集本地站点的样本视频并显示统计，字幕是模拟文字，不上传音频，也不代表识别准确率。识别服务由应用在回调内自行接入。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-asr/index.js">▶ Run Code</div>

```js
/* global Artplayer, artplayerPluginAsr */
// Local audio capture demo. The subtitles below are simulated, not recognized speech.
// No audio is uploaded; only the sample media is loaded from this local site.
const statistics = document.createElement('div')
statistics.textContent = 'Local ASR demo: press play. No recognition service is used.'
let chunks = 0
let pcmBytes = 0
let wavBytes = 0

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/steve-jobs.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  layers: [{
    name: 'asr-local-statistics',
    html: statistics,
    style: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      right: '12px',
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.65)',
      color: '#fff',
      fontSize: '12px',
      whiteSpace: 'pre-line',
      pointerEvents: 'none',
    },
  }],
  controls: [{
    name: 'asr-local-stop',
    position: 'right',
    html: 'Stop ASR',
    tooltip: 'Stop capture; pause and play to restart',
    async click() {
      await art.plugins.artplayerPluginAsr.stop()
      if (!art.isDestroy)
        statistics.textContent = 'Local capture stopped. Pause and play to restart. Nothing was uploaded.'
    },
  }],
  plugins: [artplayerPluginAsr({
    length: 2,
    interval: 250,
    sampleRate: 16000,
    autoHideTimeout: 5000,
    onAudioChunk({ pcm, wav }) {
      if (art.isDestroy)
        return
      chunks++
      pcmBytes += pcm.byteLength
      wavBytes += wav.byteLength
      const sampleRate = new DataView(wav).getUint32(24, true)
      const samples = new DataView(pcm)
      let peak = 0
      for (let offset = 0; offset < pcm.byteLength; offset += 2)
        peak = Math.max(peak, Math.abs(samples.getInt16(offset, true)))
      const duration = (pcmBytes / 2 / sampleRate).toFixed(2)
      statistics.textContent = [
        'Local capture only - simulated subtitles, no speech recognition',
        `Chunks: ${chunks} | ${sampleRate} Hz mono PCM16 | ${duration} seconds captured`,
        `PCM: ${pcmBytes} bytes | WAV: ${wavBytes} bytes | Current peak: ${peak}`,
      ].join('\n')
      return `Simulated local subtitle: audio chunk ${chunks} received.`
    },
  })],
})
```

## 配置和音频片段

| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `length` | `3` | 从本次字幕按标点拆分的非空片段中保留最后多少段，不是音频秒数 |
| `interval` | `100` | 采集消费定时器间隔和每片音频的目标时长，单位毫秒 |
| `sampleRate` | `16000` | 请求的采样率，单位 Hz；需要环境支持 |
| `autoHideTimeout` | `10000` | 接受字幕后自动隐藏的等待时间，单位毫秒 |
| `onAudioChunk` | 返回 `null` 的函数 | 接收 `{ pcm, wav }`；返回字符串时显示字幕，可返回 Promise |
| `audioInput` | 未设置 | 默认直接 Web Audio 路径；`{ type: 'capture' }` 显式选择捕获流 |

`pcm` 和 `wav` 都是 `ArrayBuffer`。音频来自第一声道，PCM 为有符号 16 位小端，WAV 包含 44 字节单声道头。每片样本数为 `Math.floor(sampleRate * interval / 1000)`，需要至少一个样本和正的有限 interval。实际回调频率受音频就绪、浏览器调度和识别耗时影响，不承诺精确间隔。

当前采集代内一次最多等待一个识别回调；未满一片的样本继续排队。回调拒绝会记录错误并允许后续处理。积压超过约一分钟音频或两片中较大的上限时，采集暂停并记录错误，避免无限占用内存。暂停、切源、停止或销毁使旧回调结果失效；插件不会取消应用已经发送的网络请求，应用应自行管理请求资源。

## 字幕与生命周期

插件结果在 `art.plugins.artplayerPluginAsr`，`name` 固定为 `artplayerPluginAsr`：

| 方法 | 行为 |
| --- | --- |
| `append(text)` | 同步返回 `undefined`；显示本次文本的最后 `length` 段并重置隐藏定时器，替换已有字幕，不累积历史 |
| `hide()` | 同步返回 `undefined`；隐藏字幕，不停止采集或清空文字 |
| `stop()` | 实际返回 `Promise<void>`；停止本次采集并丢弃旧结果，之后的播放事件可以重新开始 |

`append` 和回调返回的字符串保留历史 HTML 渲染行为，不会自动转义。只传入可信字幕；识别服务返回的外部文字需要由应用转义或清理。`null`、`undefined` 或其他非字符串回调结果不会更新字幕。`stop()` 不立即隐藏已有字幕，原自动隐藏时间仍然有效。

播放事件启动采集，暂停停止记录并丢弃待处理结果，切源重新建立适用的采集状态，媒体错误执行非终止的停止。默认直接连接会保留视频的音频输出路线直到 `art.destroy()`，因此 stop 后仍可正常播放；这不是资源未清理。销毁释放插件监听器、定时器、录音资源和音频上下文。插件没有单独的公开 `start()` 或 `destroy()`。

## 音频路径与跨域

默认路径读取 `art.video`，不混合独立 Audio Track 插件的音轨；视频自身的音量和静音会影响所采音频。跨域媒体需要加载前设置 `moreVideoAttr: { crossOrigin: 'anonymous' }`，同时服务端提供允许的 CORS 响应。仅视频可播放不代表 Web Audio 可以读取：无访问权限时可能仍走时间但音频输出静音、产生全零数据或收不到片段，重定向后的跨域同样受限。

如果应用已有 Web Audio 图，请显式选择 `audioInput: { type: 'capture' }`。此模式通过 `captureStream/mozCaptureStream` 采集，不接管已有播放输出，也不会在失败时退回直接连接。它只释放自己创建的上下文和捕获轨道；暂停保留采集图，stop 或切源释放，后续播放重新获取。缺少能力或初始化失败会记录错误并清理资源。

捕获流数据可能不受视频音量或静音影响，不包含外部音效图或独立音轨的最终混音。CORS 仍适用：可能拒绝捕获，也可能有轨道却没有可读音频。不要把某个桌面浏览器通过解释为 Safari、手机、所有代理或物理扬声器均已验证。

## TypeScript 入口

根入口保留历史 `AsrPluginOption`、`AsrPluginInstance` 和 `AudioChunk`：回调为 `void | Promise<void>`，stop 为 void。要在类型中返回识别字符串、等待 stop 或设置捕获流，使用同一运行时实现的 `/runtime`：

```ts
import asr from 'artplayer-plugin-asr/runtime';
import type { RuntimeResult } from 'artplayer-plugin-asr/runtime';

const installAsr = asr({
  audioInput: { type: 'capture' },
  onAudioChunk({ pcm, wav }) {
    console.log(pcm.byteLength, wav.byteLength);
    return null; // Replace with your recognizer; null displays no subtitle.
  },
});

async function stopAsr(plugin: RuntimeResult): Promise<void> {
  await plugin.stop();
}
```

精确类型为 `RuntimeOption`、`RuntimeResult`、`RuntimeFactory`，并导出 `AudioChunk`。旧根入口在部分 NodeNext ESM 消费中保留模块命名空间形状；需要可调用默认导入时选择 `/runtime`。CommonJS 运行时同时支持函数本身和 `.default` 自引用，`/runtime` 也支持 TypeScript 的 `import = require`。
