# PKG-ASR-05 无音轨视频与恢复检查点

来源 HEAD：`65368809ee70803e4dae7cb145a17310a386b4e4`。任务继续 doing，
本次补齐明确列出的无音轨场景，不关闭 ASR 的设备、其他不支持媒体或发布要求。
生产源码、类型、依赖、根锁和工作区分发字节均未修改。

## 验证边界

新增 `test/browser/asr-no-audio.spec.js`，使用同一旧核心/候选核心宿主，分别调用
默认 direct 和显式 `audioInput: { type: 'capture' }`。原生 AudioContext 方法仅
记录输入及返回资源，仍调用浏览器实现；不注入异常或伪造 stream/PCM。

`ffprobe` 确认既有 pattern.mp4 只有一条 H.264 视频流，无音轨；后续 audio-tone.m4a
只有一条 48 kHz 单声道 AAC。两份文件未重新生成，完整字节摘要及 probe 输出
保存在[机器证据](../baselines/asr-no-audio-validation.json)。输入变化需要重新验收。

每个可处理音频的场景均验证：

- 无音轨视频的媒体时钟和 Canvas 读取的解码画面持续变化，视频未被暂停或报错，
  音量/静音不变，ASR 不产生非零 PCM。
- 默认路径保留原生 element source 和 Context。Chromium 输出全零块；Firefox
  此阶段没有回调。二者都是记录到的实际行为，没有强制统一为某种 callback 数量。
- 显式捕获得到仅含一条视频轨的原生 stream，原生 stream source 初始化失败；
  Context 关闭、捕获轨停止，零直接绑定，原视频继续播放。初始化错误保留在证据中。
- 同一播放器切换到 AAC 后出现至少三块非零 PCM。默认路径复用一个 Context；
  捕获模式新建 Context，旧 Context 已关闭。销毁后全部 Context/捕获轨关闭，DOM 清理。

这不是物理扬声器输出、跨域授权绕过或完整设备能力证明。此前显式跨域失败与同源
恢复已有 ASR-09 证据；本次没有重跑它来制造新进度，ASR-CORS-01 的默认限制仍保留。

## 产物与 CI

`yarn test:package --include=artplayer-plugin-asr` 在 `run-NH0n0v` 快照重建、打包、
仓库外安装并冻结复装 core/chapter/ASR，检查文件摘要。通用 36 项 runtime、
5 组旧类型和 8 组精确类型仍只覆盖 core/chapter，不冒充 ASR 全包消费者验收。

新增测试通过 `browserCandidate` 核验安装文件与源码/构建输入。main 和 legacy
各用同一安装目录内对应真实文件，legacy 映射也逐项符合 tarball 摘要。没有用
源码回退代替安装产物。公开版本尚未升级为下一 major；这只是内部验收候选。

`scripts/browser-validation/scope.ts` 纳入该文件，ASR 安装清单从六个变为七个。
已有清单测试保护该用例不能遗漏；没有修改 CI 并发、超时、重试或其他必需命令。
远端 CI 尚未在本轮执行，局部通过不代表完整二十包矩阵通过。

## 结果与维护

Node 24.21.0、Yarn 1.22.22。源码、installed main、installed legacy 各 8 通过、
4 WebAudio 能力跳过，合计 24 通过、12 跳过、0 失败、0 重试。实际处理来自
Chromium 153.0.8010.12 和 Firefox 155.0；Windows WebKit 26.6 缺 AudioContext/
AudioWorklet，跳过在报告中明确保留，不视为 Safari 验收。
每轮另记录八条 Chromium 媒体 `ERR_ABORTED`，原始诊断保留；用例通过不表示
全部网络请求都正常结束。

ASR 229 项专项及浏览器清单 6 项通过，docs-tools 类型、定向只读 lint 和严格
工具链检查通过。初始 lint 的多变量同一行已修正；运行行为和断言未改变。

复跑：`yarn test:browser asr-no-audio.spec.js --workers=1`。使用安装内容时先运行
上述 package 命令，再把 `ARTPLAYER_BROWSER_ARTIFACTS` 指向其 `browser-artifacts.json`。
全量安装 CI 仍按 `yarn test:package --browser` 与 `yarn test:browser:installed` 执行。
包内 [ARCHITECTURE](../../packages/artplayer-plugin-asr/ARCHITECTURE.md) 同批更新。

本批没有发现新的生产缺陷。回退只撤销新增测试、CI 清单项与文档/证据，不恢复任何
旧运行时错误。后续继续其他不支持媒体、实际设备和完整分发验收；202/266 完成数
不变。没有推送、部署或发布。
