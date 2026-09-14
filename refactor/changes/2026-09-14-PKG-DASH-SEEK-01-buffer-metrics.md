# PKG-DASH-SEEK-01：旧 SDK 暂停跳转的缓冲指标修复

## 行为与兼容边界

dash.js 4.5.2 切换轨道、稳定暂停后，若 seek 目标正好位于视频缓冲末端，
空裁剪分支没有刷新缓冲量。调度器继续读取暂停前约 2.8 秒的指标，停止下载，
播放时间停在 6 秒。旧候选插件在新旧核心、Chromium/Firefox 的四个严格用例
全部复现。生产修复后，相同目标及顺序恢复播放，SDK 5.2.1 对照不受影响。

公开工厂、option、update、类型、事件、DOM/CSS 和分发入口保持原样。
消费者仍通过原来的 `art.seek = 6` 操作，不需要更换 SDK 或调用新接口。
涉及 API-02/04/05/07/09；不是对所有历史 SDK 本体的修复声明。

## 模块与根因证据

新增 `src/seek-buffer.ts`，仅负责 4.5.2 空缓冲指标同步；`sdk-events.ts`
负责注册和释放 playbackSeeking 回调。精确版本、可用方法、正在 seeking、
有限时间、实际范围为空、缓存量大于零、无正在进行或计划中的裁剪全部满足
后，调用 SDK 自有 `addBufferLevel(type, new Date(), 0)`。读取指标以秒计、
SDK 保存指标以毫秒计，这里只写实测零值，不存在非零单位换算。

写入前再次验证 stream、metrics、video、时间与插件生命周期身份；销毁、
替换 SDK、teardown 和重入均使陈旧回调失效。错误保留现有菜单并允许后续
seek 重试。不创建异步任务、计时器或新资源管理器；回调复用现有订阅归属。

只改 BufferController.getBufferLevel 的诊断在两引擎都未恢复，读取次数为零；
调度器实际从 DashMetrics 读取。四个原生失败后，仅同步真实空范围对应指标，
四次均恢复，配置和同步前后的时间不变。诊断保留原失败退出码，不能计入通过。
诊断函数抽到 `test/browser/dash-seek-diagnostics.js`，显式开关不可混用，也不能
搭配修改后的 SDK。抽取后另一次原生失败及随后的指标恢复验证了该诊断入口。

拒绝 pruneAllSafely：该 SDK 方法不传时间时可能清空全部缓冲。
拒绝伪造零长裁剪范围：不能提供真实裁剪完成语义。生产实现不替换 SDK 方法、
不改 SDK 配置、不清缓冲、不设置媒体时间、不发送合成 DOM 媒体事件。
根因源码及历史诊断另见 [原始记录](2026-09-12-PKG-DASH-05-seek-diagnosis.md)。

## 实际验证

环境为 Windows、Node 24.21.0、Yarn 1.22.22，Playwright Chromium 153.0.8010.12
及 Firefox 155.0。完整输入指纹、退出码及失败内容见
[机器证据](../baselines/dash-seek-recovery-validation.json)。

| 范围 | 结果 |
| --- | --- |
| 修复前候选，4.5.2 × 新旧核心 × 两引擎，严格暂停跳转 | 4 失败，原报告保留 |
| 修复后源码，4.5.2/5.2.1 × 新旧核心 × 两引擎，同一严格用例 | 8 通过 |
| 最终源码与 main/legacy/ESM 三格式 Node 行为/生命周期/历史契约 | 414 通过、0 失败/跳过 |
| 最终 main 的真实 SDK 定向矩阵 | 76 通过、0 跳过/重试 |
| 最终 legacy 的同一矩阵 | 75 通过、1 失败，0 跳过/重试；其中严格跳转 8 项全通过 |
| 最终含文档包，仓库外离线安装及冻结重装、公开类型 | 5 模式通过，每模式 8 个非法调用被拒绝 |
| 包内严格 TypeScript、根 lint | 通过；根 lint 0 错误、1 个既有 warning |
| 诊断开关混用、诊断搭配已改 SDK | 两种均在收集阶段拒绝 |

浏览器输入来自 tt3sEt tarball 解出的运行时；最终含文档 8CjCBf tarball 的三个
运行时 SHA 与它们逐一相等，安装检查也验证了所有文件。类型检查确实从仓库外
安装包解析；浏览器用的是相同 tarball 字节，不能将其称作全包 installed 浏览器验收。

main 初轮较宽矩阵 79 通过、1 个旧发布插件/4.5.2 失败也保留。最终 76 项命令
仅在本次调用中排除了裸 SDK 与旧发布插件的历史对照；默认测试文件与 CI 没有
添加 skip、预期失败、过滤或延长超时。完整源码 CI 中的裸 4.5.2 仍会失败。

legacy 唯一失败是“旧核心 + 新插件 + SDK 5.2.1”的设置质量选择：180p 元素
解析后先不稳定、随后不可见，点击超时。该 SDK 不进入本次 4.5.2 修复分支；
这不证明菜单失败的根因或历史来源。登记 DASH-MENU-01 / PKG-DASH-MENU-01
继续调查，保留截图、trace 和原断言，不以强制点击、重跑或忽略失败结案。

## 交付与后续

本次 4.5.2 修复任务完成；PKG-DASH-05/06、DASH-SEEK-01 的旧 SDK/旧插件边界、
新菜单失败、WebKit/设备及全局三轮发布复盘仍开放。没有新增依赖、锁文件或
公共声明变更。生产构建由仓库脚本生成，并同步 docs/compiled 三种格式。

重跑使用 Node 固定版本和 Yarn：`yarn test:dash-control`、
`yarn test:dash-types-package`；浏览器使用 `ARTPLAYER_DASH_ARTIFACT` 指定核验过的
main/legacy 文件后执行 `yarn test:browser:source test/browser/dash-sdk.spec.js
--project=chromium --project=firefox --workers=2`。不加过滤会包含原始历史失败对照。
回退本任务的独立提交并重建 DASH 三格式即可恢复修复前行为。禁止只回退生成文件。
本地提交后运行提交审计再启动下一项；没有 push、部署或 npm 发布。
