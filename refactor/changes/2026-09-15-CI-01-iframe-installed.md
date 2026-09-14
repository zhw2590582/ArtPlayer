# CI-01 Iframe 安装产物与跨窗口组合

## 范围与兼容性

接续 `4a9ef16b168eecc1f39b08290415d76a25852314`。统一 browser 安装清单加入
artplayer-tool-iframe 和五个既有浏览器测试文件。生产源码、公开类型、API、
DOM/事件、依赖版本和实际发布入口没有变化，也没有新增测试重试或放宽等待。

这个包的真实 npm 前身是 artplayer-plugin-iframe@1.0.0，拥有独立的 plugin/
helper 文件；未发布工作区则使用 artplayer-tool-iframe。打包检查先核验真实
旧归档与冻结 Git 源文件，再从冻结 tool manifest/dist/types 提取四个必须
保留的工具文件名。不会伪造 tool 名下的旧 npm 版本，也不会把旧 helper 当成
新工具的等价入口。`historicalDistributionFiles()` 为此提供显式分支；其他
包继续核对同名 npm 分发。旧包名与 helper 的最终分发策略仍由原任务负责。

`iframeBrowserCandidate()` 在有安装 map 时通过共用 browserCandidate 核验
核心/Chapter/工具的新鲜度和安装文件，加载正常 UMD，拒绝显式 artifact 与
冻结工作区替换。父/子窗口候选分别附加安装成员、归档和源文件身份。纯历史
对照仍使用原来的固定 npm/工作区字节；source 入口清除继承的安装 map。

原来的 `iframeCandidate()` 保留 unit/history 的源码或显式产物语义。核对
调用方时确认 history 服务会继承只含核心的 map，因此不能直接让这个旧 helper
改读工具安装包。两种用途有独立入口和回归保护，history 的 BFCache 配置也
保持原样。安装范围拒绝 BASELINE、LIFECYCLE_ONLY、BOUNDARIES_ONLY 三个
诊断开关，防止候选被替换或历史行被删掉。源码诊断仍保留原功能。

## 实际验证

Windows、Node 24.21.0、Yarn 1.22.22；Chromium 153.0.8010.12、Firefox
155.0、WebKit 26.6。完整结果及输入指纹见
[机器证据](../baselines/ci-iframe-installed-validation.json)。

| 检查 | 实际结果 |
| --- | --- |
| `yarn test:package --browser` | 十九包正常构建、pack、隔离安装及离线冻结复装通过，118.17 秒；run-qBFP13 |
| installed 全量 collection | 72 文件、2,406 项，三个引擎各 802 项；只收集，不计为全量运行 |
| `yarn test:browser:installed iframe --workers=2` | 五文件、三个引擎 426/426 通过，279,343.054 ms；每个引擎 142 项，零 skip/失败/flaky/重试 |
| source 定向检查 | Chromium 的真实编辑器、属性导航、新核心新父/子工具组合 3/3 通过，34,660.732 ms |
| Node 单元与工程回归 | 113/113 通过，3,402.3125 ms；包含原 Iframe 行为/生命周期/边界/导航和打包/launcher 负例 |
| 工程检查 | 改动文件只读 ESLint、library/docs-tools 严格类型、固定工具链和 CI 契约通过 |

五文件每个引擎分别为：协议 58、边界 20、导航 39、播放器 24、编辑器 1。
实际协议包含新旧消息、同一时刻请求、销毁中请求及 clone 失败；边界/导航
覆盖同源、跨域、opaque sandbox、重定向、属性/子页面导航及历史对照。播放器
使用三代核心与新旧父/子工具，真实播放、seek、切源、全屏网页控制和销毁。
编辑器通过实际 docs index/Monaco/Run 检查清理；它仍使用既有观察子类和测试
广告脚本拦截，不扩展成生产行为。

安装用例有 264 项附带候选工具身份，共 318 条身份记录；父/子同时使用候选
时会记录两条，不能将身份条数当成用例数。其余 162 项为纯历史对照。源码
三个用例共有四条 source-build 身份，安装 map 为 null。通用 pack 的运行时/
类型消费仍仅 core/chapter：36 运行时、5 旧类型与 8 精确类型模式。Iframe
自己的公开类型证据保留在 PKG-IFRAME-04，本次不虚报全包通用类型覆盖。

报告在进程实际结束后归档为 `refactor/.cache/ci01-iframe-installed-report`、
`ci01-iframe-source-report` 和 `ci01-iframe-collection-report`；同前缀日志保存
真实终态输出。复跑先执行 test:package --browser、设置其 browser-artifacts.json，
再执行上述 installed 命令。源码定向正则见机器记录中的 args；全量 CI 不使用
这个定向正则。重跑前先归档同一 scope 的旧报告。

## 剩余门槛

CI-01、PKG-IFRAME-05 继续 doing；197/263 完成不变。此次没有重跑特殊 Chromium
channel 的 BFCache suite，也不声称 Firefox/WebKit 实际缓存恢复、物理设备、
旧包 helper 分发或发布复盘已完成。远端完整 OS × 引擎矩阵仍未运行。

没有 push、部署或 npm 发布。代码、测试、架构说明和证据随独立 CI-01 本地
检查点提交，之后执行提交审计。回退此提交只撤回安装验证接入及相关记录，
不会回退或改变已迁移的工具生产实现。
