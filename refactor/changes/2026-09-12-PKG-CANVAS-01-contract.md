# PKG-CANVAS-01 发布契约与基线

获取并固定npm1.0.0/1.1.0实际tarball共12成员，记录registry时点、integrity、逐成员
哈希与入口、Git工作区src/types/manifest/README/.npmignore/demo。验证器只读Git
冻结来源，未来迁移不会修改这些旧哈希。

真实执行三实现的同步canvas返回、属性/方法绑定、延迟媒体事件、callback/draw顺序、
bitmap.close及无bitmap路径、metadata/resize/autoSize。公开差异包括旧CJS.default与
新callable、export=与default、旧callback必填与新可选、Result尚未描述转发媒体面。
对应行为/类型/生命周期风险已登记，后续依次复现和修复。本步没有改生产源码。

registryGitHead的核心5.1.7有proxy源码，而实际npm5.1.7没有该配置。固定关联Git的
index/template哈希及实际旧核心声明对照，防止以相同版本号当作同样实现。5.3.1也是
Git关联而非已验证支持范围。旧代理浏览器/安装消费者尚未验收；13项为受控契约检查。

契约索引新增两个真实发布对照点，当前22工作区+11发布版本；保留255行尚未精确
索引的家族缺口，没有把本步运行自动计入每项全局契约通过。来源与验证说明见
[契约](../baselines/canvas-contract.md)、[维护入口](../canvas-validation.md)。

13项Canvas专项与7项索引反例共20项通过；专项lint和完整CI991项通过（881单元+
14工程+96基线），另44项契约重复观察不当作新增测试。278个生产TS文件严格检查；
本步没有新增生产TS文件或声称浏览器验收。结果、输入哈希与日志见
[验证证据](../baselines/canvas-contract-validation.json)。

01完成，独立本地commit并审计自身，不推送/发布。下一步PKG-CANVAS-02复现异步
bitmap/RAF及终止问题，03进入TS职责拆分；不能把源码观察直接升级为已修复问题。
