# CI-01 VAST 完整安装包与真实 IMA 验证

## 实现范围

接续 `ce67eaa73ec177b23de9a4c7e27ba99fdf458ae9`。统一 browser 安装清单加入
VAST，正常构建/pack/隔离安装二十包；校验真实 npm 1.0.0 的 dist/types 路径
和冻结 SDK 归档。没有修改生产源码、公开接口/声明、依赖版本或 npm 入口。

原 `vast.spec.js` 通过替换 glomex 验证插件逻辑，继续作为源码范围的受控测试。
新增 `vast-package.spec.js` 加载完整普通构建，包括真实 glomex 实现，分别在
三代核心、两种兼容模式、三个引擎下验证两个边界：

- 两个并发注册共享一次真实 script 请求；网络失败传递同一个原生 error Event，
  两个注册均拒绝、各自释放 destroy listener、回调不执行。新注册产生第二次
  SDK 请求，失败后仍释放监听；主片继续实际解码和播放。
- SDK 请求尚未完成时销毁核心，然后返回只含 readiness 标记的脚本。这个哨兵
  没有 IMA 播放器 API，迟到的结果不能创建 session 或调用用户回调。

这些是完整 glomex 的加载/销毁验证；受控网络和哨兵不计为 Google 广告播放。
两种模式继续使用同一个完整包，已批准的 npm 默认与 workspace-1.2 行为保留。

独立 `test:vast-native` 默认仍构建源码；显式给出安装 map 后，config 核验核心、
Chapter、VAST 文件及构建新鲜度，三份 native 测试直接加载安装 UMD。真实旧 npm
插件仍使用固定归档。初始化前附加来源，失败在播放之前发生时也能核对候选。
没有替换 AdsLoader/AdsManager、修改 SDK 超时、添加重试或把 native 测试移入
普通 PR 的受控范围。

## 实测

Windows、Node 24.21.0、Yarn 1.22.22；Chromium 153.0.8010.12、Firefox
155.0、WebKit 26.6；本轮真实 Google IMA 为 3.789.0。原始报告目录、输入摘要、
逐文件结果和源码/安装/历史身份见
[机器证据](../baselines/ci-vast-installed-validation.json)。

| 检查 | 实际结果 |
| --- | --- |
| `yarn test:package --browser` | 二十包正常构建/打包/隔离安装/离线冻结复装通过；run-yqnfgx，113.47 秒 |
| installed 全量 collection | 73 文件、2,442 项；仅清单收集，不是全量运行 |
| source 完整 SDK 加载边界 | 36/36，25,485.435 ms，三个引擎各 12 项 |
| installed 完整 SDK 加载边界 | 36/36，23,818.323 ms，三个引擎各 12 项 |
| installed-map 真实 IMA 专项 | 39/39，281,695.315 ms；零失败、skip、flaky 或重试 |
| 单元/工程检查 | 94/94，3,676.2619 ms，包含原 VAST 导出/兼容/生命周期回归和 native 配置的无 map/坏 map 验证 |
| 静态检查 | 改动文件只读 ESLint、library/docs-tools 严格类型、CI/影响范围和固定工具链通过 |

真实专项包含三个引擎各 13 项：三代核心 × 两种候选模式和一个历史插件共
9 项播放/主片恢复，加 2 项真实 303 恢复/重建/活跃广告销毁、2 项 playUrl/SDK
跳过按钮。全组 30 个安装候选、9 个历史对照，每个引擎分别 10/3；候选均附带
核验过的安装身份。实际广告解码、SDK 事件顺序、点击可用的跳过按钮和恢复主片
仍由原断言判定。本轮加载正常，没有启用用户许可的 VPN/脚本加载跳过例外。

这次 native 全组通过是本次安装候选证据，不是对过去间歇 SDK9000/迟到广告和
旧插件 WebKit 首帧失败的生产修复。旧报告和开放风险保留；没有循环执行相同
失败直到变绿。加载边界的首次 lint 两个多语句行已格式修正，原 lint 日志保留。

通用 pack 中 36 运行时、5 旧类型、8 精确类型模式仍仅覆盖 core/Chapter；VAST
自己的根/legacy/runtime 十四组安装类型证据继续引用 PKG-VAST-04，不虚报为
本次全包类型重跑。源码加载测试的 map 为 null；安装加载和 native 专项分别
核验同一 run-yqnfgx 的完整 UMD，不使用外部化 glomex 的测试构建。

## 重跑和剩余工作

先执行 test:package --browser，设置其 ARTPLAYER_BROWSER_ARTIFACTS，然后运行
`yarn test:browser:installed vast-package.spec.js --workers=2` 和独立的
`yarn test:vast-native`。后者包含真实远端依赖；移除 map 才回到原源码模式。
源码对照使用 `yarn test:browser:source vast-package.spec.js --workers=2`。
三个入口保持各自报告目录，重跑前先归档旧证据。此次原始报告已在进程终态后
归档为 `refactor/.cache/ci01-vast-{source,installed,native,collection}-report`；
native 的实际调用/退出记录另存同前缀 invocation/result JSON。

CI-01、PKG-VAST-05 仍 doing；197/263 完成不变。物理 iOS/Android、SDK 间歇
行为、完整分发/远端 CI 与发布复盘仍未完成。工作区保持已批准的公开兼容边界，
没有发布、部署、推送或修改浏览器/VPN 设置。代码、测试、架构和证据随独立
CI-01 本地提交，随后运行提交审计。
