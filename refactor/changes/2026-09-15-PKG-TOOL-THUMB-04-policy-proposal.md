# PKG-TOOL-THUMB-04 默认兼容策略提案

修改前 HEAD：11c9fefaddc31316992b7da57b0323baea1f3dcf。

回到剩余源码任务时重新核对当前 TS 实现、恢复的 3.5.31 源码、基线 4.4.0 及
既有历史测试。工具的源码拆分、公开声明、emitter 与资源修复已有实现；04
未完成的明确原因之一是 THUMB-COMPAT-01，不能把尚未回答的问题当成已授权。

新增 [具体决策提案](../thumbnail-compatibility-decision.md)，推荐已发布的恢复
版本语义作为默认，工作区 4.4.0 使用显式模式。方案覆盖 delay/height 校验、
video/帧/done 时序、input.value 和类级 DEFAULTS 的不可同时兼容边界，以及
批准后内部策略归属、取消资源和正反测试。没有修改生产默认值或执行这个方案。

重跑冻结契约及行为测试共 62/62，通过；日志为
refactor/.cache/thumbnail-policy-baselines.log。这些用例还确认了历史缺陷，
不是宣称新策略已经实现或真实浏览器已验收。本批只有方案与状态说明，
无需重建未变化的生产产物。计划和本地文档链接检查通过。

PKG-TOOL-THUMB-04 仍 doing，THUMB-COMPAT-01 仍 open，等待用户选择。其他不依赖
该决定的工作可继续。回退本提交仅移除具体提案及对应状态记录；不回退此前
源码、类型和资源修复。独立本地 checkpoint 提交，不推送或发布。
