# PKG-AUDIO-05 字节前缀与原生缓冲诊断

接续 `bf56d091787bc32c1aacc84ac96904e0349bb0a8`，任务05仍为 doing。
不改播放器/插件、默认媒体、公开 API、事件、分发或依赖，不关闭 AUDIO-BUFFER-01。

## 取证与变化

旧诊断中，Windows WebKit 在 96 KiB 视频 / 32 KiB 音频前缀下不推进，放行后恢复。
本轮仅改变已发字节量，使用相同 `pattern.mp4` 和 `audio-tone.m4a`，原生对照没有
ArtPlayer 实例；早期独立探针连核心脚本也未加载。

- 六项独立起播探针：视频 98,304 字节不推进，188,653 和 251,537 字节推进；
  音频 32,768 字节不推进，99,327 和 132,435 字节推进。所有尾部仍扣住，放行后
  时钟前进。相同文件的结果不能解释为通用 codec 不支持渐进播放。
- 两项中间前缀探针：视频 131,072、音频 49,152 字节仍不推进/无可信 waiting。
  这只是已测点，不推断精确启动阈值、内部缓冲策略或所有系统相同。
- 较大前缀探针增加九秒观察后，视频时钟曾达 9.319 秒而文件只有 8 秒，
  ended=true；音频停在 5.611 秒且 readyState=4。均没有可信 waiting。
  第一轮视频恢复断言因要求再推进而超时；随后在放行前写检查点并始终保留恢复
  错误，没有把媒体结束误报成插件恢复失败，也没有用后来结果覆盖首次异常。

九秒窗口只用于上述一次独立诊断，不进入已提交测试。提交的原生测试保留原先
3 秒推进 / 7 秒 waiting 观察和原恢复断言。新增两个显式诊断变量：

```powershell
$env:ARTPLAYER_MEDIA_GATE_VIDEO_LIMIT = '188653'
$env:ARTPLAYER_MEDIA_GATE_AUDIO_LIMIT = '65536'
yarn test:browser media-gate-native.spec.js --project=webkit --workers=1
```

数值须为正整数且小于文件大小，由真实 HTTP gate 校验；结束诊断后清除这两个变量，
恢复原默认前缀。参数仅用于 native spec，不作用于 `audio-buffering.spec.js`。

在读取原生状态后、`gate.release()` 之前，测试现在拷贝 `requestsBeforeRelease` 并
立即附加 `native-gate-before-release`，避免后续 sent 数字被完整响应改写，也避免
恢复断言失败丢失前半段证据。最终 capability 附件放在 finally 中，包含已到达阶段，
不把缺少 after 当作恢复成功。增加 duration/ended/buffered，便于区分时钟和实际
响应状态。没有改变或删除音轨组合测试的可信 waiting、双时钟恢复与同步断言。

## 验证范围

机器结果见[前缀证据](../baselines/audio-prefix-validation.json)。固定 Node 24.21.0、
Yarn 1.22.22；Playwright Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6，win32。
独立报告/trace 输出保留在 `.cache/audio-prefix-*`，没有覆盖之前的缓冲失败。

较大前缀的四项 WebKit native 流式/完整部分 Range 诊断均正常退出：四项推进、
零项可信 waiting。视频放行前约 7.3 秒，流式音频约 5.6 秒，完整 Range 音频约
7.3 秒，readyState 均为 4；请求快照证明尾部尚未发送。它们只证明观察及放行后
时钟恢复，不是四项缓冲验收通过。

真实 HTTP gate 的三项单测和改动 spec 的只读 lint 通过。默认三引擎诊断的最终
统计及工作区检查在机器证据中记录；诊断通过数必须与 progressed/waiting 分开读。
本轮未重建无变化的生产产物、未重跑插件全矩阵、未验证实体 Safari、声音输出或远端 CI。

上游实现说明可帮助定位：[WebKit Windows 媒体后端](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/graphics/win/MediaPlayerPrivateMediaFoundation.cpp)
有独立的缓冲事件和时钟处理，
[Playwright 官方说明](https://github.com/microsoft/playwright/blob/main/docs/src/browsers.md)
要求区分各 OS 媒体能力。但本轮没有匹配所装 WebKit 二进制的完整源码和后端执行轨迹，
不能据当前上游文件宣布精确根因已找到。下一步需要对应原生后端或其他实际支持平台
的同输入缓冲证据；不在 ArtPlayer 中加入模拟 waiting、全局延时或放宽测试。

维护入口为 [audio-validation.md](../audio-validation.md) 和
[浏览器说明](../../test/browser/README.md)。本检查点可独立撤销以恢复旧观察方式，
生产运行字节不变；不推送、部署或发布。
