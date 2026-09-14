# CI-01 接入 Ads 安装产物与完整六包回归

安装范围由五包扩展到六包，新增 Ads 的真实媒体和 UI 用例。整个 installed 入口
运行 426 项，425 通过、1 项 WebKit 章节清晰度切换失败，退出码 1；不是绿色 CI。
Ads 两文件在三个引擎中共 171 项全部通过，其中 108 项使用已校验的候选安装包，
其余保留真实旧版 Ads 对照。CI-01 与各包最终设备/分发门槛继续开放。

## 实现与边界

- package-check 的额外包名单接入 Ads 已有冻结契约，先核验五份历史归档、30 个
  成员及来源，再按现有独立源码构建、pack、安装、冻结复装和完整成员校验流程执行。
- browser-validation 的统一名单、两个 Ads spec、CI 准备命令和工作流校验同步。
  Node/类型通用消费者仍只覆盖 core/chapter，不把浏览器扩展冒充全包类型验收。
- 新增 test/helpers/browser-candidate.js：安装 map 存在时验证来源/产物并读取实际
  安装文件，拒绝同时指定单包路径，失败不退回源码。无 map 时保留显式产物与
  源码构建入口。候选附件记录文件、tarball、源码指纹；旧版附件保留原发布输入。
- 缺失 map 和冲突覆盖的 Node 反例已加入现有测试。没有修改 Ads/核心生产代码、
  packageManager、锁文件、测试超时或断言。没有新增依赖。

维护入口为 [浏览器范围说明](../../scripts/browser-validation/README.md)、
[安装检查](../../test/package/README.md) 和 Ads ARCHITECTURE.md。

## 实测结果

Windows x64，Node 24.21.0、Yarn 1.22.22；Chromium 153.0.8010.12、Firefox
155.0、WebKit 26.6。包源码 HEAD 为 18215b97c0674667a5c451b341e922ed39f6b872，
本轮未提交的测试/工具差异另以指纹绑定。run-s8MkZT 的六包安装通过，通用
core/chapter 36 运行时、5 旧类型模式、8 精确类型模式通过。

`yarn test:browser:installed --workers=2` 无文件、引擎或 grep 过滤，无重试，
Playwright 耗时 432.371 秒。13 文件共 426 项：425 通过、1 失败、0 跳过。
Canvas/PiP 包含 12 项原生窗口播放及 6 项 WebKit 不支持记录；不能把后者算成
原生能力通过。Ads 解码、静音、倒计时、恢复主片、失败/拒绝、原生全屏、多实例
和真实 popup 用例均通过。没有执行移动后台/最小化或 IMA/VAST 验收。

源码入口另定向执行 Chromium 的 candidate core/candidate Ads 真实视频用例：
1/1 通过。启动时故意继承 installed map，source 入口清除它；附件确认为
source-build。这证明本次修改保留该开发路径，不代表重跑全部 source 测试。

Node 工程测试 46/46、scoped ESLint、library 严格类型、工作流契约、actionlint
1.7.12（未调用 shellcheck/pyflakes）与严格工具链通过。远端 Actions 尚未运行。
结果、输入附件、命令与日志摘要见 [机器证据](../baselines/ci-ads-installed-validation.json)。

## 保留的章节失败

失败是 WebKit 的 candidate core/candidate chapter 清晰度切换，在等待
`!video.seeking && video.readyState >= 2` 时超时。restart 在页面 3552 ms 已触发，
第一轮 seeked 在 3597 ms；trace 中第一次读取返回 false，第二次调用耗时
9939.104 ms 后仍返回 false。之后状态附件记录第二轮 seeking、canplay，媒体没有
error。它不同于之前“没及时观察到 restart”的具体阶段，不能据此直接断言同一
根因、网络失败或 Ads 回归。调用延迟及底层媒体/渲染原因仍待 PKG-CHAPTER-05
调查，补入 CHAPTER-TIMING-01，保持 open。

原始报告/trace 保存在 ci01-ads-installed-report；没有通过重复、增大超时或跳过
制造全绿。撤销本检查点可恢复旧五包范围，不涉及生产源码回退。未推送或发布。
