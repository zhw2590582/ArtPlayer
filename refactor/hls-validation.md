# HLS control 测试与环境边界

PKG-HLS-03 已在入口、映射、菜单和 SDK 订阅四个模块实施修复，实际地图见
[包内架构](../packages/artplayer-plugin-hls-control/ARCHITECTURE.md)，本轮证据见
[模块验证](baselines/hls-modules-validation.json)。下方 02 的数量与缺陷观察属于冻结的迁移前基线。
新版用例增加事件同步、菜单节点复用和候选生命周期断言，公开 TS 迁移仍是 04。

新增构建文件入口：ARTPLAYER_TEST_HLS 以平台路径分隔符接受 main/legacy/ESM，用于同一 Node
契约；ARTPLAYER_HLS_ARTIFACT 选择实际 main/legacy 浏览器文件。测试记录实际 hash，错误路径
明确失败。这是工作区构建验证；隔离安装以及整套 ARTPLAYER_BROWSER_ARTIFACTS 映射仍由 06 完成。

PKG-HLS-02 建立迁移前基线。源码目前仍为 src/index.js，不能把测试任务当作 TS 迁移已完成。
来源见 [发布契约](baselines/hls-control-contract.md)、[SDK 固定记录](baselines/hls-sdk.json)、
[本轮证据](baselines/hls-validation.json)。

## 可重跑入口

- `node --test test/hls-control.test.js`：45 项，源码与发布 main/legacy/ESM 共用正常契约，
  发布包单独复现旧缺陷；已接入 `yarn test:unit`。
- `yarn test:browser hls-control.spec.js`：当前源码与发布插件在旧核心 5.4.0/当前核心上的四组合，
  加上 SDK 能力检查。通过现有 Playwright 工程入口执行；源码候选构建不写 dist。
- `node refactor/scripts/hls-contract.mjs`：HLS 插件发布来源核验。
- `node scripts/generate-hls-fixture.mjs <新的输出目录>`：只在需要改变样本时执行；
  测试使用已提交媒体和 manifest，不要求安装 FFmpeg。详见 test/browser/media/hls/README.md。

SDK 使用示例原有的 Hls.js 1.5.17，首次从固定 npm URL 下载并验证 SHA-512/SHA-256，
代码取归档中的 dist/hls.min.js。SDK 仅在测试浏览器执行，不加生产依赖，不改 Yarn 锁文件。
归档读取工具允许合法的点分包名 hls.js，同时测试拒绝路径穿越等非法标识。
生成器记录 FFmpeg 版本和参数；媒体源为 testsrc2/sine，不依赖远程影片版权或服务可用性。

## 已验证的内容

Node 契约覆盖同步注册/update、媒体身份校验、quality/audio 显示开关、名称/顺序/去重、
getName 输入引用与一参/两参调用、SDK 写入→notice→check 顺序、回调/SDK 异常传播、替换实例。
这些受控测试不提供 DOM、实际 ABR 或媒体解码证明。

Chromium 与 Firefox 各 14 项播放/失败组合通过，另各 1 项 SDK 能力检查通过：
本地两档位和双音轨、可见画面像素与解码帧、实际播放推进、90P→180P、返回 Auto、French
音轨切换完成事件、暂停/seek/继续、503 manifest 失败后恢复、切到无音轨 master、SDK 与核心销毁。
选择通过真实鼠标操作控件；属性、画面和 SDK 事件联合断言，不只验证菜单文字。

旧版真实 Auto 状态下 update 将标签改成当前播放档位；旧版切到无音轨 master 后仍保留音轨控件。
旧菜单回调写旧实例、destroy 后公开 update 继续工作在受控测试复现；后者不是浏览器泄漏定量证明。
SDK 在当前双音轨样本中将 id 与选择索引对齐，没有把静态 id/index 差异误报为已复现错误。

## Windows WebKit 缺口必须保留

首轮完整三引擎 28 通过、14 失败。定向诊断确认 Windows Playwright WebKit 26.6 的
MediaSource 和 ManagedMediaSource 均为 undefined，Hls.isSupported() 为 false，实际 SDK
报告 manifestIncompatibleCodecsError。新旧核心与插件共同受影响，不是 TS 候选特有回归。

最终报告为 **31 passed、14 skipped、0 failed**：WebKit 只通过显式能力/失败清理断言；
14 个播放场景按这个已经验证的宿主限制跳过。能力测试会在环境变化时失败提醒重新核对，
不能把跳过转换为播放通过。最初失败和定向诊断报告的摘要/完整性保留在冻结证据中。
Safari/macOS/iOS 的真实 MSE/ManagedMediaSource 与原生 HLS fallback 仍由 PKG-HLS-05、
EX-03、REL-09/REVIEW-02 接续，SDK-01/HLS-ENV-01 保持 open。

本轮 enableWorker=false，流通过 Playwright 本地路由提供。远端网络、SDK worker、分组音轨变更、
Safari/native fallback、更多 SDK 版本、安装包及示例页面全部组合不是本轮完成内容。
显式安装产物映射暂不接受 HLS 源码回退；HLS-06 必须加入 HLS 包对应映射和隔离 tarball 消费。

## PKG-HLS-03/04 后续验证

PKG-HLS-03 已拆出映射、UI 提交/删除、Hls 订阅与生命周期；旧缺陷成为候选修复断言，
保留发布版观察。该步最终 Node 专项 56 通过，三格式共享契约累计 83 通过，modern/legacy
浏览器各 35 通过、16 跳过；以上早期 02 结果保持其原始范围，不冒充当前源码结果。

PKG-HLS-04 把五个模块迁移为严格 TS，公开类型保留旧调用和类型提取习惯，补齐默认字段、
SDK 泛型、可选 index 和 CJS/ESM/legacy 声明路径。在线编辑器声明从公开源生成，构建时用
TS 4.3/5.9 严格校验；真实 Monaco 验证推断、错误提示及编译后的工厂执行。
这些编辑器用例不声称执行 HLS 播放，实际播放仍由 hls-control.spec.js 负责。
本步结果见 [类型迁移记录](changes/2026-09-12-PKG-HLS-04-types.md) 和
[冻结证据](baselines/hls-types-validation.json)。

实际 Hls.js 1.5.17 声明在 TS 4.3 缺少 MediaDecodingConfiguration 和
MediaCapabilitiesDecodingInfo；仅 SDK 的消费者也出现相同两个诊断。插件无新增诊断，
不注入虚假 DOM 定义或打开 skipLibCheck。独立插件五组类型模式均要求零诊断。
PKG-HLS-05/06 继续完整 SDK、浏览器、示例及安装包验收，SDK-01/HLS-ENV-01 仍开放。

## PKG-HLS-SDK-01 桌面 SDK 扩展

本子任务作为 PKG-HLS-05 前置单独交付，不降低父任务的设备/SDK 验收条件。
test/browser/hls-sdk.spec.js 使用冻结的 Hls.js 1.5.17/1.7.2 和真实 native Worker：
监听 init/transmuxComplete 消息、错误与 terminate，并且同时验证视频帧、时间推进和销毁。
只有 enableWorker=true 或仅创建 Worker 不算通过；实际转封装结果和清理是断言的一部分。
这些探针委托原生操作，不注入模拟转封装输出。SDK 仍为测试归档，不进入生产依赖。

worker 切源/清理覆盖两个 SDK 与新旧核心/插件四组合；候选插件另测 detach/reattach、
两档位不同音轨组、组内重新编号和实际 SDK 切轨完成事件、鼠标选择与 UI 清理。
高档组有 French/English/Commentary 三项、低档组有 English/French 两项，顺序有意不同。
音频是确定性正弦样本，Commentary 复用 English 样本，不冒充真实语音或音频语言识别。

版本来源、Apache-2.0 许可及成员哈希见 baselines/hls-sdk-matrix.json；新增版本来自
[npm 固定 1.7.2 元数据](https://registry.npmjs.org/hls.js/1.7.2)，
[上游发布记录](https://github.com/video-dev/hls.js/releases) 仅用于核对版本变化。
这里不测试所有中间版本或外部服务器，也没有将 1.7.2 的声明改动等同于类型矩阵全部通过。
实际 TypeScript SDK 声明消费仍只有 PKG-HLS-04 明确记录的 1.5.17 范围。

本子任务暂未完成：一次 Firefox 分组切换后的销毁出现 Target crashed，HLS-CRASH-01
仍待定位。后续完整矩阵和重复通过不能抹去首次失败；详见
[进行中记录](changes/2026-09-12-PKG-HLS-SDK-01-integration.md)。
