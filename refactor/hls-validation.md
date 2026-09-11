# HLS control 测试与环境边界

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

## 后续实施

PKG-HLS-03 拆出映射、UI 提交/删除、Hls 订阅与生命周期；把上述缺陷变成候选修复断言，
保留发布版观察。PKG-HLS-04 迁移自有模块和公开类型，修正可选 option、getName 对象与可选 index，
保持旧声明接受范围及分发路径。PKG-HLS-05/06 完成实际 SDK、浏览器、示例及安装包验收。
