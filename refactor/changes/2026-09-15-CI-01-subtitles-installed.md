# CI-01 Audio Track、VTT Thumbnail 与 Multiple Subtitles 安装验证

## 实现与兼容边界

统一 installed 名单从六包扩展为九包，新增三个插件的十二个浏览器文件。
package-check 先校验各自冻结发布契约，再构建、打包、独立安装、冻结复装和核对
完整安装文件。工作流准备命令与静态校验同步；通用运行时/类型消费者仍只负责
core/chapter，不把新增浏览器覆盖当作全包声明或发布准入。

三个候选加载器使用 browser-candidate.js，安装 map 存在时读取已验证的 tarball
安装文件，禁止显式 artifact 覆盖；VTT 也拒绝 frozen-workspace baseline 标记。
缺失、篡改、过期安装不能回退源码。无 map 时保留源码和显式产物方式。
附件记录实际候选文件、归档与来源指纹；Audio 的旧标题 source audio 是候选槽位，
实际来源查 audio-inputs.selected。真实旧插件和 no-plugin 控制继续保留原输入。

本轮只修改测试、工程入口与维护文档，没有修改生产 API、播放器实现、超时、
依赖或锁文件。一处 ASS 等待断言修正见下文，最终数量/文本要求保持严格。
VAST 类型决定已有独立实施，不合并到本 CI 检查点。

## 验证范围

Windows x64，Node 24.21.0、Yarn 1.22.22。九包安装 run-QsLTUc 通过；通用
core/chapter 36 运行时检查、5/5 旧类型模式、8/8 精确类型模式通过。
新增插件相关单元 504/504、工程 46/46、scoped lint、library 类型、严格工具链、
CI 工作流契约与 actionlint 1.7.12 通过；actionlint 未运行 shellcheck/pyflakes。

完整 installed collection 为 25 文件、762 项。实际执行仅新增十二文件、三个
引擎的 336 项，workers=2、retries=0；最终结果与原始报告指纹见机器证据。
这不是本次运行完整九包套件；此前 CHAPTER-TIMING-01 失败继续保留。WAV能力、
旧字幕宿主缺陷及合成移动输入等控制只证明其记录的范围，不能冒充真机通过。

各包 ARCHITECTURE.md 与 scripts/browser-validation/README.md 记录加载边界。
CI-01 继续 doing，远端 Actions、其他生态包及最终设备/发布门槛未完成。
撤销本检查点可恢复六包 CI 范围；不涉及生产源码回退。未推送或发布。

## 实测结果与修复

首轮 336 项为 327 通过、9 失败，耗时 388.566 秒，实际退出 1。Chromium 和
Firefox 各 112/112 通过；WebKit 103/112。失败中的八项是已有 AUDIO-BUFFER-01
的新旧音频组合；七项未等到可信 waiting 且时间大于 0.3 的目标状态，一项在受限
视频路径耗尽测试时间并在 finally 的状态采集中报页面关闭。保留真实等待和失败，
不把销毁后的 error=4 当作加载阶段解码失败；未证明新的底层根因。

另一项是旧核心 published + 候选 Multiple Subtitles 的 ASS 断言：seeked 后，
单元素文本 locator 在旧字幕三个节点尚未替换时立即 strict-mode 失败。失败快照
已经显示 Later cue，视频时间 5.002334；不是字幕永久丢失的证据。将断言改为
exact array [Later cue]，在原 7000ms 内同时要求恰好一个元素与准确文本；不接受
额外节点、子串或错误字幕。增加检查前的产物附件，失败也可识别输入。修正后
五核心 × 三引擎 ASS 15/15 通过，没有重试；原始九失败报告不被覆盖。

三个加载器的 Chromium 源码定向实际媒体测试 3/3，通过继承安装 map 的 source
入口执行，附件均明确 source-build。只证明这三个开发路径继续可用。
初轮有 197 项附件直接验证候选安装身份；失败的 ASS 在原断言之前尚无其最终
附件，不能把缺失附件计入该数；修正后的 15 项均在操作前验证安装身份。
机器证据见 [ci-subtitles-installed-validation.json](../baselines/ci-subtitles-installed-validation.json)。
原日志和报告位于 ci01-subtitles-installed-report/source-report/ass-report，各自保持
实际退出状态。安装报告内的旧附件路径已随目录归档，读取时用归档目录下 results。

完整九包套件未在本次重跑，八项音频失败仍开放。准备 tarball 后补充了包内架构
说明，本轮不是最终发布候选批准；发布前仍需重新打包绑定最终内容。
