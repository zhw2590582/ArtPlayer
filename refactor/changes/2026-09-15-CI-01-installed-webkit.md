# CI-01 完整 Windows WebKit 安装包回归

2026-09-15，执行HEAD `bb2c12df3`，固定Node24.21.0/Yarn1.22.22，Windows WebKit26.6。
复用5e0447fc5打包的20包run-cRduve；启动时再次验证源码/构建和安装文件指纹。
运行 `yarn test:browser:installed --project=webkit --workers=2`，没有筛选、诊断覆盖、
重试或运行期间的跟踪文件修改。77文件/845项：**694通过、13失败、138能力跳过、
0重试，1214.860秒，退出1**。完整报告/trace归档于
`refactor/.cache/ci-installed-webkit-bb2c12df3`，见[机器证据](../baselines/ci-installed-webkit-validation.json)。

## 失败与实际阶段

- Audio四个视频断流用例：初始双时钟通过，trace确认在29行等待switchUrl返回，
  20秒整例超时；没有到达后续waiting/恢复断言。最终视频停在新受限URL的0秒、
  paused=true、readyState=2。四个音频断流用例在30行可信waiting断言失败。
  不沿用前次source全量“全部失败在waiting”的结论。AUDIO-BUFFER-01继续open。
- Chapter新核心/旧插件切画质：轮询仅记录到一次空事件列表（at4037），
  后续状态包含at4088的正确restart及原生就绪事件。原轮询超时仍为失败；
  不推断生产restart缺失或用任意延迟修复。CHAPTER-TIMING-01继续open。
- 候选弹幕main-thread-gap：实际800ms CPU阻塞期间媒体从约0.461走到1.261，
  随后第一次记录的readys为空；first/middle仍为wait且未触发beforeVisible，
  只有sentinel显示。117行missing要求空数组失败。这是当前安装候选的真实失败，
  新登记DANMUKU-INSTALLED-GAP-01，由PKG-DANMUKU-08处理；未把它当作旧版预期，
  也未据此撤销已有不同场景的修复证据。根因和确定修复尚待验证。
- 冻结JASSUB1.1.0三核心仍在首次字幕像素断言失败。当前安装候选三核心均通过
  实际WASM/字体、绘制、seek/布局及直接销毁后宿主销毁。旧失败保留，不重开
  已有候选帧时钟修复，也不据此关闭hybrid/设备门槛。

138跳过由58项ASR WebAudio、48项DASH MSE及32项HLS MSE组成；逐项原因保存。
这些不是Safari/设备或播放通过。694通过亦含历史与受控边界用例，不等同原生
功能覆盖。Chromium/Firefox各844通过1失败与本轮分开记录；同一安装产物的三引擎
运行已经有结果，矩阵仍有真实失败，不能宣称全部验收或发布就绪。

## 后续与边界

CI-01保持doing，原风险继续处理；新弹幕问题保留确定输入与原始trace供修复。
用户已批准Thumbnail默认采用npm行为、工作区显式选择，下一步完成该工具实施。
按用户最新要求，实施与必要测试完成后先交接，等待其指导复盘，不自动启动复盘。

本次仅归档证据、登记新失败和更新维护索引；没有生产、测试、类型、依赖或分发
变化，无需重复构建。计划/风险检查、风险校验负例、严格工具链及Git diff通过后
提交 `docs(ci): [CI-01] record complete WebKit installed regression`。
回退只撤销本次记录；没有推送、部署或npm发布。
