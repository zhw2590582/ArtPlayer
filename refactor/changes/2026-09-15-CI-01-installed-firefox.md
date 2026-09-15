# CI-01 完整 Firefox 安装包回归

2026-09-15，执行HEAD `b3344a7c6de4355e2e1c3bb7476dd34284f691b3`，
Node24.21.0 / Yarn1.22.22 / Windows Firefox155.0。
继续使用在 `5e0447fc5` 打包的20包安装映射 `run-cRduve`；两个HEAD之间仅新增
Chromium验收记录及索引，启动器和配置再次验证当前源码/构建输入与安装文件指纹。
本轮没有重新打包，也没有把旧安装报告改写成当前HEAD生成的产物。

```powershell
$env:ARTPLAYER_BROWSER_ARTIFACTS='D:\github\ArtPlayer\refactor\.cache\packages\run-cRduve\browser-artifacts.json'
yarn test:browser:installed --project=firefox --workers=2
```

运行当前安装清单的全部77文件/845项，**844通过、1失败、0跳过/重试，
1043.223秒，退出1**。没有文件/grep筛选、诊断覆盖或运行中修改跟踪文件。
完整JSON、截图、trace、调用和退出记录保存于
`refactor/.cache/ci-installed-firefox-b3344a7c6`；各文件结果、输入/归档哈希与
失败附件见[机器证据](../baselines/ci-installed-firefox-validation.json)。

唯一失败仍为裸dash.js4.5.2：`dash-sdk.spec.js:276` 等待currentTime大于6.2，
7000ms后仍为6。该用例没有创建ArtPlayer或候选插件。候选DASH的两套核心与
SDK4.5.2/5.2.1四个稳定边界seek全部通过，安装JASSUB三套核心的真实字幕绘制、
seek/布局及直接销毁后宿主销毁也全部通过。DASH-SEEK-01继续open，保留原失败。

ASR/Audio的原生音频与断流恢复用例在本轮完成，但不能据此关闭WebKit的能力或
事件问题。一次HLS/JASSUB/Chapter通过不关闭此前间歇故障。通过数同时包含旧版
缺陷对照、受控窗口和SDK边界用例，不等同845种原生功能；此处没有真实投屏、
Apple/Android设备、远端Actions或真实VAST广告播放的新证据。

安装产物及消费者准备沿用[Chromium记录](2026-09-15-CI-01-installed-chromium.md)，
版本仍为major升级前值，完整20包清单不替代全部22workspace的独立门槛。
CI-01保持doing；下一步同一安装映射进行完整Windows WebKit回归。

本检查点仅更新证据、任务引用、风险说明与维护索引；无生产、测试、类型、依赖、
工作流或分发变更，不新增构建或消费者迁移。计划/风险生成与检查、风险校验负例、
严格工具链和Git diff检查通过后独立提交
`docs(ci): [CI-01] record complete Firefox installed regression`。
回退仅撤销该轮记录；没有推送、部署或发布授权变化。
