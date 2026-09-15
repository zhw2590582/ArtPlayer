# CI-TYPES-02：全生态安装类型门槛

基线 `00c131bff130fad4ff03f90d7f02c124bc177cb5`。已有17个独立包类型命令
没有作为全生态必需步骤进入CI；CI-TYPES-01只补齐了共享Audio/HLS类型消费。
本任务建立显式21库包清单，将完整已存在的类型契约真正串入流水线。

## 结构与失败语义

`scripts/consumers/ecosystem.ts` 管理包/命令清单、子进程和逐步报告。
21库包恰好覆盖一次；VitePress站点由既有site/editor检查承担，不冒充可安装库。
共享命令覆盖核心、Chapter、Audio、HLS，其余17包运行原独立测试，保留历史
诊断、版本对比、类型提取、条件导出和准确runtime入口，不用空导入替换。

`yarn test:ecosystem-types` 先运行build:types、build all、build:i18n。
准备失败立即停止，避免测试旧dist；准备成功后串行运行18组，单包失败记录
实际退出码并继续收集其他包证据，总命令最终非零退出。子进程不开shell，
NODE_PATH清空，stdout/stderr写独立日志，每组结束写报告和日志SHA-256。
目录位于refactor/.cache/ecosystem-types/run-*，各包原报告保持独立。

正常构建允许生成分发文件，但不得夹带无关变更。本轮重建后Git没有分发内容
差异，源码、公开声明、版本、依赖及锁文件保持原状。没有添加新依赖。
工具模块已纳入原严格TS/lint，调度器测试加入test:node。

## CI与维护

browser-consumers在原Node20/22/标准版、React/Vue、Iframe及性能检查之后
执行新步骤，保留三OS矩阵和原60分钟作业期限。此顺序避免共享四包类型检查
更新latest.json影响前面已选定的浏览器map。后续全installed浏览器检查必须
重新准备完整--browser清单。原有步骤、缓存边界、只读权限及总CI result不变。

CI校验器和影响模型将该命令作为第九项必需调用，拒绝移除、条件跳过和丢失
原始类型证据；上传总报告及专用包JSON/log。维护说明位于消费者模块README、
test/package/README.md和ci-setup.md。本地配置并不证明远端运行成功或耗时
满足预算，CI-01/CI-04继续保留实际Actions验收。

## 验证范围

最终命令、每包退出结果、原始报告及代码指纹见
[机器证据](../baselines/ecosystem-types-validation.json)。
调度器受控子进程测试验证缺包/重复/缺命令、非零退出、双输出流、启动失败，
以及构建失败不进入消费、首包失败仍跑完其余包并使总命令失败。
这些故障测试只证明调度语义；真实包兼容证据来自另外执行的完整安装命令。

类型命令成功允许已明确记录并精确断言的历史诊断，不等于历史声明错误消失。
Thumbnail仍待默认运行时行为决策，Auto Thumbnail首帧及其他SDK/设备/像素
问题继续开放。本次没有修复或降低这些门槛，没有浏览器播放、远端CI、部署
或发布操作，不把21包类型检查替代全生态运行时组合与三轮发布复盘。

## 回退

回退本独立提交移除汇总命令、新CI门槛、对应验证/报告与维护说明；17个
独立包检查和CI-TYPES-01的四包共享检查继续可用。消费者API无需迁移。
