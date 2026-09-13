# PKG-ASR-05 检查点：相邻稳定核心与本地编辑器

本记录是 ASR-05 的局部进展，任务保持 doing。ASR-07/08 已独立修复原生音量和
捕获回退漏声；本检查点扩大核心对照并建立无需识别服务的真实演示页验证。

## 核心来源与实测范围

ASR 来源提交的核心 manifest 写作 5.3.1，但 npm 精确版本接口和 tarball 均 404，
完整版本目录也没有 5.3.1。`asr-core.json` 记录准确请求、UTC 时间与响应摘要；
来源提交关联不能被当成正式发布，也不能把缺失的版本列为测试通过。

选择真实、相邻稳定发布 5.3.0 作为额外对照，冻结 registry integrity、SHA256、
41 个成员、入口和来源说明。它不是最低支持承诺，也不是那个未发布的 5.3.1。
浏览器服务器核验实际 tarball 后新增 `/published-5.3.0/artplayer.js`，三个 ASR
原生测试组均纳入此核心。

正式 main 产物下的 5.3.0 组合：14 通过/7 能力跳过，含 2.0/2.1 历史观察及候选。
正式 legacy 候选另 6 通过/3 能力跳过。覆盖 PCM/WAV、字幕、暂停/切源/stop恢复、
最终清理、线性音量及回退静音输出。Firefox 回退仍明确使用受控绑定拒绝，不能
视为自然解决 ASR-FOREIGN-01。全部候选产物哈希对应 ASR-08。

## 无服务演示与真实 Run

新增 `docs/assets/example/asr.local.js`，沿用已有同源 steve-jobs.mp4。每个 PCM/WAV
分块显示计数、字节、采样率、时长和峰值，字幕明确标注 Simulated，不冒充语音识别。
Stop ASR 等待公开 stop；播放继续，pause/play 恢复采集；销毁后的晚回调不再写 UI。
原 asr 示例保留其 URL 与外部服务逻辑，未在本项改写。

三个受控示例测试执行实际示例文本，禁用 fetch/WS/XHR/EventSource/sendBeacon
识别路径，并检查统计、异步 stop 及销毁期间返回。与既有 ASR 组合为 216 项通过。

`yarn test:asr-demo` 自启真实 repo dev 服务，访问 localhost:8082 的 docs/Monaco，
不替换插件脚本。在 Chromium/Firefox 用真实播放控件和 Run Code 验证非零 PCM、
模拟字幕、stop 时视频时间继续前进、暂停/恢复、重复 Run 销毁旧实例/context，以及
最终所有 context 关闭。实际响应与磁盘脚本哈希比较，并保存源代码/构建配置指纹、
请求、trace 和截图。只隔离准确的 AdSense 请求，不允许外部识别请求。

此脚本针对当前 Windows 环境验收，8082 被占用时退出；只停止自己启动的进程树，
检查释放端口。子代理独立实现和运行，主代理复核脚本、报告与相关输入后整合。
具体核心/编辑器报告摘要见 [检查点证据](../baselines/asr-local-core-validation.json)。

## 未完成范围

ASR-05 继续保留跨源/CORS、audio-track 组合、Firefox 外部双 owner、macOS/iOS及
物理设备门槛；SDK-11 仍不宣称真实识别服务已验证。新增本地示例不等于服务验收。
ASR-06 的完整发行文档/导出及后续主版本准备仍独立执行。本项没有生产源码改动，
正式 dist/compiled 沿用 ASR-08；真实 dev 命令正常生成并更新 uncompiled 演示产物。
没有整仓 CI、推送或发布。台账与第三方记录区分已有证据
和这些未完成项，不因单个演示通过而把整包标 done。
