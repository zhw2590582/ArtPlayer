# PKG-ASR-07：修复 ASR 音量二次衰减

ASR-05 的原生验证发现，2.1.0 和 ASR-04 候选都在 `video:volumechange` 中把
`art.volume` 再写入播放 gain。原生 MediaElementAudioSource 已包含视频音量，
二次应用导致 50% 设置约为 25% 输出振幅，25% 设置约为 6.25%。Chromium 和 Firefox
均复现。此缺陷单独增加任务与风险记录，ASR-05 的完整设备验收继续独立跟踪。

删除重复的 volume 监听器及 capture/graph 转发方法，内部播放 gain 保持 1。
视频继续拥有音量/静音控制。公开选项、工厂、回调、返回值和停止/销毁语义不变；
这是输出音量的行为修复，升级后调过音量的播放可能比旧版更响，不应声称声音字节
完全不变。PCM 仍随主视频音量缩放，静音时为零，不自动改为捕获外部音轨。

## 实测方法与验证

`test/browser/asr-playback.spec.js` 在原生 gain 与 destination 之间插入 unity
AnalyserNode，以同一本地 AAC 的全音量 RMS 归一化。设置 1/0.5/0.25、静音和取消静音；
候选允许 10% 窗口处理误差，要求线性振幅，旧发布版要求其原有平方衰减。
候选另检查 stop 后音量变化仍正确、采集停止、pause/play 后恢复正确输出。
该方法检查浏览器图信号，不代替物理扬声器或声卡测量。

修复前候选 Chromium 线性断言失败，报告和 trace 保留。修复后：

- 208 项定向 ASR 单元/分发测试通过，main/legacy 各 25 项生命周期通过。
- source 原生组 20 通过/10 跳过；main、legacy 各 8 通过/4 跳过。合计
  36 通过、18 明确的 Windows WebKit 无 WebAudio 跳过，0 failed/flaky。
- 包含发布核心 5.4.0 和候选核心，原生 PCM/WAV、字幕、暂停、切源、stop/restart、
  context 最终关闭及音量验证。来源提交的核心 5.3.1 未发布到 npm，不能伪造其发布
  基线；相邻稳定 5.3.0 对照与物理设备仍由 ASR-05 继续取证。
- 正常三格式构建、docs 副本字节、分包 strict、定向 lint 通过。
  更新产物重新隔离安装，17 配置声明/真实导出矩阵通过；原有 NodeNext 类型诊断
  继续明确保留。没有重复整仓 CI，没有增加依赖或改版本。

输入哈希、红绿报告和包安装摘要见
[音量验证记录](../baselines/asr-volume-validation.json)。本次新产物取代 ASR-03/04
记录的候选哈希；旧证据保留为对应历史提交的观察，不自动宣称覆盖新产物。

本任务不关闭捕获流 fallback 的原生拓扑、CORS、audio-track 组合或 Safari/设备
门槛。回退本提交会恢复已复现的音量二次衰减。子代理同期生成的离线 demo 与旧核心
取证属于 ASR-05 后续工作，不混入本项完成声明。
