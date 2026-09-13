# PKG-ASR-02：ASR 音频与错误基线

在 ASR-01 固定的 7 个实现上运行 19 类场景：npm 2.0.0/2.1.0 main/legacy、
冻结工作区源码/main/legacy。133 项受控音频测试通过；这些测试明确观察历史
缺陷，不能接到候选上要求保留缺陷。32 项既有公开契约仍通过。

## 可重跑证据

- `yarn test:asr` 运行公开契约及音频历史场景，161 项；归档校验另有 4 项。
- `yarn test:browser test/browser/asr-audio.spec.js` 使用实际发布包及本地 AAC 样本，
  两版插件乘新旧核心在 Chromium/Firefox 共 8 项通过；Windows WebKit 26.6 的
  AudioContext、webkitAudioContext、AudioWorkletNode 均不存在，4 项明确跳过。
- 初次浏览器执行因假设 AudioContext 可用而在 WebKit 失败；独立原生探针确认
  能力缺失后先记录能力再做精确平台断言，不放宽 Chromium/Firefox 要求。
- 每个真正采集通过的场景至少 3 块非零音频，每块 1600 个样本、3244 字节 WAV、
  16000Hz，并渲染本地回调字幕，显式 stop 后实际 AudioContext 为 closed。
- 报告、引擎版本、输入哈希和限制见 [持久证据](../baselines/asr-audio-validation.json)。
  没有调用外部 ASR、没有真实麦克风授权、没有真机 Safari 验收。

## 复现结果与修复职责

| 行为 | 实际观察 | 后续 |
| --- | --- | --- |
| PCM/WAV | 钳位、PCM16LE、mono WAV 头、首通道、定制采样字节精确匹配 | 保持编码契约 |
| 队列 | 两次半块输入全部丢弃；超出阈值的尾部也丢弃 | ASR-CHUNK-01 / ASR-03 |
| 异步回调 | 并发无背压、乱序旧字幕覆盖新字幕，拒绝透出 async interval | ASR-CHUNK-01 / ASR-03 |
| 停止 | pause/stop/destroy 后在途结果仍 append 并创建 hide timer | ASR-LIFE-01 / ASR-03 |
| 恢复 | 已有 direct source 未复用，改走捕获流；无 captureStream 时恢复失败 | ASR-LIFE-01 / ASR-03 |
| 初始化 | 并发 play 产生两图两 interval，stop 只清最后一组；pause 不取消在途 setup | ASR-LIFE-01 / ASR-03 |
| 异常 | addModule 拒绝留下 context/source/URL；显式 stop 仍未回收 URL | ASR-LIFE-01 / ASR-03 |
| 终止竞态 | destroy 后 addModule 完成仍继续访问已清空 context | ASR-LIFE-01 / ASR-03 |
| 切源 | restart 不清旧 PCM、不使旧识别结果失效 | ASR-LIFE-01 / ASR-03 |
| 增益 | 初始 gain=1，首次 volumechange 才跟随 art.volume | 原生音量对照后修复，避免重复衰减 |

受控环境执行实际 inline Worklet 源码；显式 Promise gate 控制初始化和识别顺序。
AudioContext/节点/捕获流由测试替代，无法证明音量、设备采样率、CORS 或音源恢复
在所有真实引擎中正常。实际浏览器目前只证明初次采集、字幕与 stop，恢复/切源/
并发修复后还需原生回归。ASR-05 保持未完成。

## 协作、兼容与回退

子代理独立编写受控 helper/tests，主代理审查并接入任务、浏览器与报告。没有生产
源码、类型、版本或依赖改变。候选修复将增加独立断言，历史缺陷不会被删掉或改绿。
只运行本包测试、定向 ESLint 和文档台账检查，未重复全量 CI。
独立提交回退可移除新增测试、证据和命令接入，不改变播放器行为。
