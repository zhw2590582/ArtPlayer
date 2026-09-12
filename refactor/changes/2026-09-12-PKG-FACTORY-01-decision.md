# PKG-FACTORY-01 决策检查点

复核真实 npm Canvas/Ambilight 1.0.0、1.1.0 声明，两代 export= / export default
在相同严格 TypeScript 消费条件下支持不同的合法调用。增加可重复的四种候选类型形状
对照，覆盖两个编译器、两个包、三个消费者，共72个精确诊断场景；独立测试进一步证明
Ambilight 可选参数重载本身也破坏只接受必填参数的工厂替换，即使没有 `.default`。

详见[待确认取舍与迁移示例](../factory-compatibility-decision.md)以及
[完整编译矩阵和声明提案](../baselines/factory-compatibility-proposals.json)。

本步只有测试、分析与任务记录，没有修改生产声明或 JS 输出，不需要重建和浏览器复验。
专项 Node 测试和新增脚本 lint 通过，计划/风险注册校验通过。错误诊断是明确的历史/候选
反例对照，不代表这些有错误的方案已经被接受。

PKG-FACTORY-01 仍 doing；FACTORY-TYPE-01 仍 open；两包05与REL-01依赖不变。
本地 checkpoint commit 不是完成提交。用户确认后还需实施公开声明、格式包装、编辑器、
完整安装矩阵与分发验证，再用独立完成 commit 关闭此任务。
