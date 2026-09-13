# PKG-ASR-05 检查点：CORS 与 audio-track 组合

此项仍为 doing 检查点。新增真实原生浏览器用例，补充跨源与独立音轨的明确边界；
没有改变生产源码、默认音频路由、公开类型或版本。

## CORS

浏览器测试服务器增加专用允许跨源音频入口和同源跳转到跨源的入口；其余媒体
路由保持原响应头。实际响应 URL、状态和允许头随每个用例记录，不使用 request
拦截伪造 PCM 或 CORS 权限。

真实 2.1.0 与候选在 5.4.0/current 核心分别观察：anonymous 属性与允许头同时存在
时得到非零 PCM 和原生输出；未设置跨源属性、以及同源 URL 跳转到无授权资源时
输出为零，但媒体时间仍前进。Chromium 收到零样本，Firefox 没有分块回调。候选
随后切到同源资源，在原有一个 AudioContext 中恢复非零 PCM 与播放输出。

首次测试错误地期待 Firefox 也返回零样本分块，8 项失败；保留 probe 报告后按
原生行为明确区分引擎，不把它改成任意零值或空列表都通过的宽松断言。
这符合 [Web Audio 跨源规则](https://www.w3.org/TR/webaudio-1.0/#MediaElementAudioSourceNode-security)。
默认绑定会让本来可播放的未授权跨源音频变静音，登记 ASR-CORS-01；不能把安全
规则观察通过写成该播放问题已修复。后续显式捕获模式可隔离播放归属，但不能
绕过 CORS，也不能仅凭 URL 推测重定向、MSE、blob 或凭据的实际授权结果。

## 独立 audio-track

子代理新增专用用例，主代理审查并运行。两个包均从真实源码/指定正式产物加载，
本地音频由原生 media 与 Worklet 处理。检查两个插件的独立元素归属、暂停恢复、
音轨 update 不改主视频、ASR stop 保留播放、再次播放重采集、destroy 与晚到调用。
另一顺序用例由测试自有 AudioContext 测量独立音轨：主视频静音而独立音轨有信号
时，ASR PCM 确实为零；unmute 后恢复。两个插件均不擅自关闭外部 probe Context。

这纠正了“audio-track 会自动 mute 主视频”的未证实推测：源码和真实初始状态均
显示两个元素不自动静音。默认 ASR 采主视频，没有混入独立 Audio 的承诺；README
和架构文档已说明配置与边界。

## 验证与未完成项

当前证据和正式产物摘要见 [验证记录](../baselines/asr-combinations-validation.json)。
Windows WebKit 缺少 WebAudio 的用例明确跳过，不等同 Safari 或物理音频输出。
外部 owner 的显式集成、其他不支持的媒体与设备仍在 ASR-05；ASR-06 发行工作、
识别服务 SDK-11 和整仓发布验收尚未完成。没有推送或 npm 发布。
