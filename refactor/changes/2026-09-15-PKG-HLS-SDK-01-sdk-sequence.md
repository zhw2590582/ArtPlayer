# PKG-HLS-SDK-01 同浏览器实例的 SDK 顺序对照

来源 HEAD：`ca967ea1a2faeab3f5e23c612af31b41d22fd7f8`。任务保持 doing。
本轮扩展诊断工具并取得销毁前的崩溃信号，没有修改播放器、插件、公共声明、
依赖或分发文件。HLS-CRASH-01 和 HLS-PLAYBACK-01 均继续开放。

## 顺序对照

之前的集成失败发生于包含两个 SDK 的测试序列，单版本诊断不足以比较这个条件。
`hls-sdk-diagnostic.mjs --sequence` 现在能在同一个 Firefox browser 实例中依次
创建隔离 context，使用指定的固定 SDK。不能据此声称各 context 的原生内容进程
相同；也没有在一个播放器上直接替换 SDK 构造函数。

所有序列值必须在 hls-sdk-matrix.json 中，先验证归档成员哈希，再通过独立版本
URL 加载，初始化前检查页面 Hls.version。每项结果记录实际 version，报告记录
sequence/releases。旧 `--version --iterations` 方式继续支持，保留单版本 release
字段。两种 CLI 模式显式混用会报错，避免标签或执行次数与意图不符。最多50项。

| 对照 | SDK 顺序 | 宿主和传输 | 结果 |
| --- | --- | --- | --- |
| direct | 1.5.17 → 1.5.17 → 1.7.2 | 原生 video、普通 HTTP | 2通过，第一项崩溃 |
| published | 1.5.17 → 1.5.17 → 1.7.2 | 发布核心/候选插件、route、Worker观察器 | 3通过 |
| reverse | 1.7.2 → 1.5.17 | 原生 video、普通 HTTP | 2通过 |
| default | 1.7.2 一次，旧参数入口 | 原生 video、普通 HTTP | 1通过 |

均为 Windows Firefox155.0、真实 worker、同一冻结媒体夹具；没有替换 worker 输出。
前三组使用 selected 边界及销毁前快照；default 保留默认 switched 边界与关闭的
快照。direct/reverse 没有 ArtPlayer、插件、route、SDK logger 或 Worker观察器，
仍保留已有 Playwright trace 和事件记录，不能称为完全无插桩。

## 新的崩溃证据改变了什么

direct 第一项1.5.17在 high-group 阶段等待高度/音轨条件时收到 page-crash 信号，
时间为2026-09-15 07:05:48.727 UTC。还未执行 capture-before-destroy，也未调用
显式 destroy。它是该 browser 实例的第一项 SDK 用例，因此不能要求先运行其他
版本才会发生这次崩溃。完整报告及本项 trace 已独立保存并记录指纹。

此前已复现的销毁后崩溃不因此消失，但“只排查销毁顺序”已不充分。更新风险标题
及 workspaceState，保留旧证据和原关闭条件；没有将两次不同阶段的崩溃当作已
证明同一原生根因。后续成功的 context 也不证明浏览器状态完全无影响。

查阅本次信号前后各30秒的 Windows Application 1000/1001 事件没有匹配记录。
这仅说明该窄范围查询没有返回事件，不代表没有崩溃，也不是原生堆栈。当前仍缺
能够解释退出/异常的原生诊断。取得原生 dump 时可参考
[Mozilla Crash Reporter 文档](https://firefox-source-docs.mozilla.org/toolkit/crashreporter/crashreporter/index.html#environment-variables-affecting-crash-reporting)
的本地保存选项；本轮没有启用新报告环境、采集 dump 或上传崩溃数据。

本机 Playwright1.63.0 的 coreBundle 中默认 Firefox 与 BidiFirefox 是不同启动类，
不能把 Bidi 的 MOZ_CRASHREPORTER 默认环境误认为当前 Firefox 后端已应用。
安装目录未看到独立 crashreporter 文件，也不足以证明该二进制的所有 dump 能力。
下一步应先核实当前后端/二进制的原生取证方式，再处理 SDK/浏览器边界；不凭猜测
变更核心公开 destroy 顺序、强制无 worker 或宣称使用单一版本已修复问题。

## 验证与维护

```sh
node refactor/scripts/hls-sdk-diagnostic.mjs --sequence 1.5.17,1.5.17,1.7.2 --switch-boundary selected --capture-before-destroy
node refactor/scripts/hls-sdk-diagnostic.mjs --sequence 1.5.17,1.5.17,1.7.2 --host published --plugin --transport route --observe-workers --switch-boundary selected --capture-before-destroy
node refactor/scripts/hls-sdk-diagnostic.mjs --sequence 1.7.2,1.5.17 --switch-boundary selected --capture-before-destroy
node refactor/scripts/hls-sdk-diagnostic.mjs --version 1.7.2 --iterations 1
```

机器证据见 [hls-sdk-sequence-validation.json](../baselines/hls-sdk-sequence-validation.json)：
8通过、1失败，无重试/跳过。三项 CLI 非法输入（冲突模式、未冻结版本、超长序列）
均在浏览器启动前拒绝；定向 lint、SDK来源单测和严格工具链通过。
Node24.21.0、Yarn1.22.22，未重新安装/构建浏览器或工作区包。
本轮没有更改集成验收用例，复用上一检查点的最终测试验证，不重复完整矩阵。

报告中的原始路径/哈希保留完整事件，已提交摘要只保留事件统计和末尾状态，
复用输入对象按哈希去重。不同 runnerSHA256 对应增加 CLI 冲突检查之前/之后；
序列运行逻辑相同，不能把最终源码哈希说成早期运行时已有的字节。

这是诊断进展，不是修复或发布验收。回退本提交恢复单版本 runner 和此前的风险
说明，不改运行时。不得把新的失败从汇总删除；后续处置仍需独立测试、记录和提交。
