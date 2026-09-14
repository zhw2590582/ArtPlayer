# CI-01 MediaBunny 安装产物浏览器验证

## 范围与兼容边界

公共运行时、类型、依赖、媒体夹具和测试断言不变。共同安装清单新增
artplayer-proxy-mediabunny，沿用其已冻结 npm 契约，正常打包、隔离安装后
核验文件。SDK 随 UMD 构建内联；MP4/WebM/HLS 输入仍是独立测试媒体。

十个 MediaBunny 浏览器文件共用已验证安装候选；有 map 时禁止回退源码、
旧工作区或另一个显式 artifact。安装入口拒绝仅候选的环境过滤，以保留旧版
对照。源码入口保留原有诊断方式。可用输入附件提前记录清单，不能据此声称
所有列出的版本均运行；最终观察记录实际 implementation/provenance。
Document PiP 组合同时记录 proxy 和 PiP 身份。

原生解码、WebAudio/HLS、Canvas、真实窗口能力与受控竞态分开说明。
缺失 API 的对照即使断言通过，也不算该平台播放验收；短期音画采样不等于
物理声音、长时漂移或真机验证。CI-01 与 PKG-MB-09/10 门槛保持开放。

## 验证

Windows x64 / Node 24.21.0 / Yarn 1.22.22。十五包正常构建、pack、仓库外安装、
离线冻结复装及完整成员核验通过（run-cblqI3，69.25 秒，退出 0）；通用消费者
仍是 core/chapter 的 36 运行时、5 旧类型模式和 8 精确类型模式，不扩大声称。

完整 installed collection 为 49 文件/1536 项，本轮仅实跑十个 MediaBunny 文件。
Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6 各 76 项，合计 228/228
断言通过，0 skip/失败/重试，110.678 秒，实际退出 0。这里“通过”包含能力和
历史缺陷对照；WebKit 有 51 个缺解码/音频能力对照、12 个 PiP 不可用分支，
不是这些功能的成功播放。Chromium/Firefox 各 12 个原生 Document PiP 案例
验证 Canvas/窗口播放、恢复或销毁；每例分别核验 proxy 与 PiP 安装身份。
其余原生输入、HLS、音频/视频竞态及受控 decoder 分支详见逐例 outcome。

故意继承安装 map 后，source 入口清除它，Chromium 的 HLS menus、av-clock、
seek-source 三项 3/3 通过（34.899 秒），观察附件均为 source-build。
这是源码入口定向证明，不是全量源码回归。单元 257/257、工程 48/48、scoped
lint、library 类型、严格工具链和 CI 契约检查通过。最初新增 beforeEach 的空
对象参数和格式被 lint 拦截，改为记录实际 browserName 后通过；日志均保留。

报告已在进程实际结束后归档为 ci01-mb-installed-report、ci01-mb-source-report
和 ci01-mb-collection-report。输入指纹、完整逐例结果/能力分类、报告与日志
哈希见[机器证据](../baselines/ci-mediabunny-installed-validation.json)。
此前 Chapter/Audio/DASH 的失败未重跑或关闭；全十五包矩阵、远端 CI、物理
音频与长时/设备门槛仍未完成。没有新增依赖或生产源码变更，没有推送或发布。
回退本检查点恢复十四包清单及 MediaBunny 原有源码加载方式。
