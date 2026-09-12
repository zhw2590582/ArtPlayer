# PKG-IFRAME-01 冻结发布名、改名与消息契约

实际npm包为artplayer-plugin-iframe@1.0.0，含8个成员和两个不同的类协议；新工具名的
registry查询返回404，已保存查询时间/状态，不将工作区1.1.0冒充已发布版本。
冻结旧包完整性、8成员哈希、发布gitHead关联核心4.5.9及初始工作区11输入。实现地图与
公开契约见[契约文档](../baselines/iframe-contract.md)和[来源清单](../baselines/iframe-release.json)。

19个独立Node契约检查已通过：CJS namespace/default与直接类代际、script全局、ESM、
字段/方法、监听先于导航、resove拼写、numeric id、'*'目标、message回调receiver、commit
body、静态异步resolver返回及辅助helper的独立destroy协议。第一轮6个失败是误将helper
当主类的测试假设；保留日志，按实际artifact建立独立断言，没有把不同协议合成假别名。

本任务不改生产源码、声明、包版本或demo。记录未验证生命周期和source/origin信任边界，
IFRAME-02建立异常/销毁/并发回归，03整理资源，04处理TS及精确/兼容声明，05真实浏览器，
06分发和demo。旧helper deep入口与类名迁移的结论必须在04/06明确，不能因main测试通过而遗漏。
完整CI1437项与44重复契约、最终来源核验通过，任务标done并立即专用本地提交。

完整结果见[验证记录](../baselines/iframe-contract-validation.json)。324个现有生产TS通过检查；
本包仍为JS，不能把全局TS数量当成本包迁移完成。三项iframe风险保持open，下一项IFRAME-02。
