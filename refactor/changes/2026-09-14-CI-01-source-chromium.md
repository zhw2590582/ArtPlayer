# CI-01 Chromium 完整源码范围回归

固定源码 HEAD fc566f14d50ac19cfe02f5f0375a168699a91c99、Node24.21.0、
Yarn1.22.22，在Windows执行 `yarn test:browser:source --project=chromium --workers=2`。
没有文件/grep过滤，没有重试，也没有设置诊断SDK或其他ARTPLAYER环境覆盖。
source入口清除安装map；执行期间未修改工作区源码或测试文件。

## 实际结果

152文件、1481项：1480通过、1失败、0跳过、0重试，Playwright耗时839.637秒。
浏览器Chromium153.0.8010.12。子进程和Yarn最终退出码均为1；这不是完整CI通过。
报告、截图和trace归档在 ci-source-chromium-full-report，机器证据记录逐文件
计数、失败断言、附件摘要与实际入口：[ci-source-chromium-validation.json](../baselines/ci-source-chromium-validation.json)。

唯一失败是 dash-sdk.spec.js 中 dash.js4.5.2 的原生对照，不创建ArtPlayer。
完成切轨、稳定暂停、seek=6后，媒体时间一直为6，未达到>6.2；7秒条件等待超时。
这与已定位的DASH-SEEK-01一致：旧SDK空裁剪分支不刷新缓冲量，调度继续使用
暂停前缓存值。此次没有运行诊断补丁、合成timeupdate或改变seek目标。5.2.1
原生对照与其余37项DASH SDK用例通过，但不能据此关闭4.5.2的问题。

风险保留open，并增加本次独立全量运行的证据。没有为了让CI通过而跳过、标成
预期失败、放宽超时或重跑覆盖原始失败。修复/兼容处置继续归PKG-DASH-05。

## 结果解释与后续

source范围保留旧版本、受控错误/能力分支和明确的已有分发产物测试。通过计数
不是1480项新运行时功能，也不是全部原生能力通过。机器证据中的11条含
unsupported的outcome是MediaBunny受控不支持轨道及历史HLS对照，不能解读为
Chromium缺失了11项能力。具体测试中的旧缺陷观察保持原断言。

尚未在本轮执行Firefox/WebKit完整源码范围、Actions系统矩阵或物理设备；
五包installed完整回归属于另一份报告。默认读取工作区dist的原生测试仍需在
后续CI输入审查中核对其构建来源，不能把source入口名称当作全部依赖都现场构建。

CI-01仍doing，整体任务计数不变。下一步优先处理DASH的兼容处置与源码测试的
候选输入来源，并继续其他引擎的完整回归。没有生产代码/依赖修改、push或发布。
