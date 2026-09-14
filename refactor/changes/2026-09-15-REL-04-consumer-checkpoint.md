# REL-04 核心与 Chapter 实际安装回退检查点

任务保持 doing，未增加完成任务数。生产源码、声明、分发文件及根锁未修改。

新增 `test:rollback`、`test:rollback:browser`，复用现有包构建和播放器浏览器用例。
安装流程、文件完整性校验、浏览器产物来源验证分别拆分，维护说明见
[回退演练](../rollback-rehearsal.md)。没有引入新依赖，使用已固定 Node/Yarn/Playwright。

## 验证

- `yarn test:package`：隔离生产构建与安装通过，36 项候选运行时检查，5/5 旧类型模式、8/8 精确类型模式。
- `yarn test:rollback`：七次连续安装/升级/回退均通过，237 项运行时检查；所有文件与冻结锁恢复一致。
- 最终安装产物在五种状态各执行三引擎真实播放，共 15/15，通过解码像素、播放/暂停/拖动/切源/销毁与 Chapter DOM 检查。
- Node 文件验证负例、相关工程回归、scoped lint、plan 检查及严格工具链结果随机器证据保存。
- 普通 installed runner 最初拒绝 REL-04 报告（它要求 ENG-07）；这次尝试未运行浏览器。不改变其约束，新增独立回退验证入口后测试通过。初次七步报告及拒绝日志仍保存在 cache。

具体 HEAD、tarball/lock/报告指纹、命令和报告位置见
[机器证据](../baselines/rollback-consumer-validation.json)。此检查点证明核心/Chapter
流程，不证明所有包或最终 6.0.0 等候选已验收。浏览器读取已核验安装副本，原临时
消费者已清理；新旧包必须按 archive 指纹区分，不能只看版本号。

## 主线与未完成项

只读 fetch 后，master/origin/master/FETCH_HEAD 均为
`40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f`，当前 HEAD 比其领先 256 提交，
没有主线新增提交。仍需执行可重复的冲突同步演练、iframe 更名回退和全包恢复表。
Thumbnail 缺失完整历史包及站点远端恢复不因此关闭，正式发布仍须三轮复盘。

回退本次工程改动可以撤销本检查点提交；不涉及用户安装版本或远端状态。
