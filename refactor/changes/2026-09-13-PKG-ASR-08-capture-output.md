# PKG-ASR-08：阻止捕获回退额外播放声音

子代理复核指出 captureStream 回退不拥有原播放路由，源码却把原始捕获音轨
接到 gain=1 和 destination。主代理用外部原生 AudioContext 先绑定同一 video，
保持其播放图运行，让 Chromium 自然拒绝 ASR 的第二次媒体源绑定并进入回退。
原生测试证明 2.1.0 和 ASR-07 候选都产生额外输出，视频静音后该分支仍非零。
修复前两个候选核心组合在“ASR 输出必须为零”的断言失败，保留报告与 trace。

## 实现与契约

回退改为 `capture source -> recorder -> gain(0) -> destination`，保持 Worklet
处理活跃而不输出声音；直接绑定仍是自己的播放路由，使用 gain=1。暂停、停止、
切源和销毁复用现有归属模型。回调继续收到非零 PCM，不靠静音输入掩盖问题。
不改变媒体元素 muted/volume，不关闭外部 owner context，不修改公开 API、类型或版本。

captureStream 的 PCM 可不受媒体静音/音量影响，而直接路径跟随主 video。文档现在
明确区分两者；此前未限定路径的概括已修正。这个修复阻止额外可听分支，不能解释为
“视频静音后停止识别”；调用方仍使用 stop/pause 控制采集生命周期。

五项新单测由子代理独立编写并先得到全红；主代理集成后，检测出测试 helper 把
Worklet 浅拷贝为两个对象，导致节点清理列表观察到旧连接。已修正 helper 登记真实
对象身份，完整历史/候选测试重新验证，不以删除清理断言通过。

## 原生验证的边界

Firefox 实际允许重复创建 MediaElementAudioSource，两条原生播放分支都有信号，
因此它不会自然进入本回退。这一探测结果与四个失败报告保留，单独登记未闭环的
ASR-FOREIGN-01。Firefox 的回退验证显式强制绑定拒绝，其余 captureStream、轨道、
采样、Worklet 和音频 analyser 全为原生，报告标记 forcedException=true。
不能把受控拒绝说成 Firefox 自动识别外部音频图，也不能改成 skip 后宣称通过。

测试覆盖采集非零、ASR 输出零、原播放图静音、stop 只关闭自己、恢复时新轨道、
切源后旧轨道结束且新源重新输出 PCM、destroy 最终关闭自己的 context。
Firefox close 是异步的，校验使用有界轮询等待 state=closed，保持同步 destroy API。

验证记录见 [捕获回退证据](../baselines/asr-fallback-validation.json)。正常三格式
构建与副本、strict/lint、213 项定向、main/legacy 各 30 项、实际隔离安装声明矩阵
以及 source/main/legacy 原生组均记录确切输入。原生组还重跑直接路径音量和已有
采集生命周期。Windows WebKit 无 WebAudio 的结果仍为能力跳过，不代表 Safari。

本项只关闭“已进入捕获回退后额外输出”的缺陷，ASR-05 的外部双 owner、CORS、
audio-track 组合、更多核心和设备门槛继续保留。离线 demo 与 5.3.0 对照基线也由
ASR-05 独立验收。本次未做整仓 CI、推送或发布；回退会恢复静音仍有额外输出的缺陷。
