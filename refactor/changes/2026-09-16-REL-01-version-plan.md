# REL-01 分包版本与差异方案

起点267b21226a11930b1dd89508f326956c1e106928。所有源码/声明决策前置任务已完成，
包括Thumbnail批准的默认策略；本任务完成22包版本准备方案，不改变manifest，
不宣称包已通过发布验收，不执行复盘、推送、npm或标签操作。

## 交付

- [version-plan.json](../version-plan.json)冻结每包源版本、下一major目标、分发类别、
  变更日志路径/内容范围、声明规则、原依赖字段、维护文档和剩余验收责任。
  [可读方案](../version-plan.md)说明本地候选和后续版本/标签步骤。
- [registry快照](../baselines/version-registry-2026-09-16.json)为本次真实只读网络请求，
  覆盖22名和Iframe旧名。记录状态、URL、时间、响应SHA256、active/time/unpublished
  版本和dist-tags；未观察到目标版本或目标/更高major稳定版占用。
  Iframe新名404、Thumbnail撤包、VitePress无npm记录分别保留含义与门槛。
- [version-registry.mjs](../scripts/version-registry.mjs)提供后续刷新入口，只写新的
  本地证据文件。并行上限4；未知HTTP/JSON/名称响应不会转成版本可用。
  一次初始路径检查因Windows根路径尾部分隔符拒绝执行，未发网络请求/写快照；
  根路径规范化后成功完成23次观察，不放宽目录范围与覆盖保护。
- [version-plan.mjs](../scripts/version-plan.mjs)区分方案一致性和版本已经落实。
  prepared要求22包目标版本、各包目标CHANGELOG和两套示例依赖，不以静态方案
  冒充版本更改；所有检查都不授权发布。

## 冻结决策

本轮本地候选使用用户要求的精确M+1.0.0版本，不增加rc后缀。它是尚未上传的
tarball。未来经授权公开候选用next，正式推广用latest；next不会隔离明确请求
该版本的用户，也不是发布权限。已经公开的版本不能覆盖，若需改内容则必须
新版本与重新验证。其余复盘、设备、回退、许可和远端CI门槛均保留。

22包没有相互声明的workspace依赖；已有外部dependency/peer字段保持，不能
因core6.0.0增加只接受6的peer限制。React/Vue源示例计划把三个本仓库包依赖改成
本地file路径以消费未发布版本；冻结历史消费者和隔离tarball测试保留。REL-09
核验实际安装/类型/构建流程，只维护根yarn.lock。根private包与示例不升版本。

VitePress仍仅站点分发；Iframe旧名与新名的恢复/权限不混淆；Thumbnail历史归档
缺口不被major升级掩盖。已接受的Ads/VAST/Thumbnail和其他类型差异均要求继续
记录。公开入口/声明的确切文件沿用现状与逐包维护指南，不统一改成一种导出。

方案内准入观察来自真实release-ledger计算，22包均blocked。它是带时间的规划
快照，后续当前状态仍由原台账计算；REL-01完成不会自动消除这些阻塞。

## 验证与后续

固定Node24.21.0/Yarn1.22.22。真实registry捕获退出0；5项注册表规则测试通过，
覆盖已发布/撤包版本不可复用、更高major冲突、404非所有权、错误HTTP/格式、
请求目的地与返回包名。变更脚本lint通过；version-plan --check通过；
--prepared正确退出1并指出artplayer仍是5.4.1，没有误报已经完成major升级。
版本目标同时与初始清单和release-ledger逐包交叉校验。

REL-09落实所有版本、适用示例/依赖/锁和CHANGELOG，单独提交。
REL-02随后重建目标版本候选并绑定新的证据；旧版本的测试报告只保留作历史依据。
工具链发布文档同时修正为实施后等待用户指导复盘，消除自动启动的旧表述。
