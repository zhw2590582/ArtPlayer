# ENG-AUDIT-01 独立完成提交的Git审计

起点4f324a84。把ENG-09拆出可独立验收的Git审计、依赖影响和契约覆盖三个子任务；
本步实现Git审计，其他两项及父任务保持todo。VAST初始化选择仍待用户确认，没有
更改其默认行为或将VAST-03标完成。

`commit-audit.mjs`核对真实任务状态迁移、父分支/merge、准确ID、plan和当时的本地
证据文件，不从done标志或提交标题推断工作已提交。初始80个done任务对应76个
独立完成提交，DOC-01～04只在固定DOC-05提交中合并。历史标题符号差异保留，
任务ID仍准确可追溯；没有重写、amend或伪造过去的提交。

新命令`yarn check:commits --report`接入`ci:check`，报告由既有CI日志artifact收集。
三个GitHub checkout补`fetch-depth: 0`；除审计外，已有测试也会读取历史源码Git对象。
没有新增依赖或更改Yarn锁文件。详细行为与本地提交前后顺序见
[维护说明](../commit-audit.md)。

使用隔离的真实Git仓库验证反例和分支合并，不能用mock成功输出替代历史验证。
实际仓库审计、测试、lint与工作流静态检查结果见
[验证记录](../baselines/commit-audit-validation.json)。远端GitHub运行仍由CI验收任务
处理，本次没有push，不能把本地通过称为远端通过。

完成后独立本地提交`ENG-AUDIT-01`，提交后重新运行审计验证本任务自身。回退本步
撤销脚本/测试/命令/checkout设置及文档台账，生产包API和已有历史均不变。

最终本地CI904项通过（832单元、14工程、58基线）；脚本lint、plan及两个工作流的
actionlint检查通过。提交后审计将验证新增的第81个done任务及第77个独立完成提交。
