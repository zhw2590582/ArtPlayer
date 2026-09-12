# PKG-VAST-03 生命周期实现检查点

起点d5e1fead。原index.js迁为5个严格TS模块：入口、SDK/request边界、session所有权、
DOM视图及内部类型。实际职责/依赖/时序见
[包内架构](../../packages/artplayer-plugin-vast/ARCHITECTURE.md)。

核心destroy在SDK加载前订阅；加载或callback完成后不会再创建终止实例的广告。
session销毁时先使旧owner失效，再逐项释放监听/SDK/DOM，异常不阻断剩余清理；
构造和事件注册失败回滚；旧事件不能污染新session；活动广告显式destroy后可重建。
构造/订阅/销毁重入及request配置getter引发销毁/替换也有身份检查。

15项候选生命周期断言配合45项已有行为/历史观察，60项Node通过；另在冻结工作区
执行同一候选断言记录修复前失败。三格式正式构建成功，117项真实浏览器测试通过，
包含三核心/三引擎的新增终止、回调失败、旧事件与显式重建路径。SDK边界仍受控，
不代表正式bundle中的实际IMA执行；该部分留给05/06。

直接固定依赖@alugha/ima2.1.0（MIT），补齐Glomex声明引用但未作为运行依赖提供的
类型链；保持Glomex1.21.2与其实际SDK加载器，新增依赖没有直接运行时import。
Yarn仅新增该依赖和相应锁条目；包的tsconfig纳入严格检查，未用skipLibCheck掩盖错误。
初次lint发现单行try格式不符后修正，没有通过忽略整个文件避开检查。

**本任务仍doing**：[初始化决策](../vast-compatibility-decision.md) 展示npm发布版
eager与未发布工作区lazy的不可同时满足条件。当前默认行为暂保持工作区，尚未恢复
发布id/$container，因此不能声称03兼容验收完成。拟定方案默认保持npm1.0.0行为、
另提供显式工作区兼容选择；尚未实现，等待用户确认。Ads批准不扩展到VAST。

公开类型同步误声明、历史CJS.default入口仍由04处理。新ID增加同毫秒区分后缀，保留
workspace art-vast-前缀；发布ID规则与上面的初始化决策一起处理。SDK-07及VAST相关
风险继续open，候选可控修复证据与实际供应商/发布验收分开记录。

执行结果、输入和产物指纹见 [验证记录](../baselines/vast-lifecycle-validation.json)。
本批作为03未完成检查点独立本地提交；不push/tag/publish。回退该提交恢复旧VAST
源码、依赖、构建输出和测试接入；01/02不可变基线与历史缺陷证据保留。

最终完整本地CI900项通过（832单元、14工程、54基线），274个生产TS检查，37份核心
声明无漂移；15个候选断言在旧工作区均失败，修复后全部通过。TS5.9.3/4.3.5当前
最小公开消费者的缺失类型错误均消除，但同步返回误声明仍开放。
