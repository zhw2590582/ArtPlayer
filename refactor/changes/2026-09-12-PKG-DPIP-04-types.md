# PKG-DPIP-04 公开类型与两代导出

公开命名类型统一Option、Result、AsyncResult、Factory、RuntimeFactory。默认Result保留
可写boolean与void动作，不改变旧调用直接推导的返回值、initializer可赋值性或
ReturnType结果；默认工厂保持完整的必填参数函数形状，包括typeof工厂的替换赋值和
Parameters必填tuple。RuntimeFactory显式描述省略options、self.default与AsyncResult。
不能简单把旧void动作改成Promise，因为用户可以
合法创建Result或覆盖方法为`() => {}`。AsyncResult供未修改的实际结果显式断言，
准确描述readonly getter和Promise<void>动作；生产入口也用此类型检查实现。
这是兼容视图与精确视图并存，不把Ads的推导修正授权用于此插件。

main/legacy的.default自别名兼容1.0.1/1.0.2 namespace.default与1.1.0直接工厂。
ESM仍只有default运行时出口。新增.d.mts/.d.cts和import/require条件声明，typesVersions
保持旧编译器legacy解析。编辑器声明由语义生成器更新，README/ARCHITECTURE解释
真实异步语义、默认旧推导及何时用AsyncResult。声明仅增加类型出口，不增加运行时API。

四组专项验证五个编译器/模块模式、14项非法用法、四份实际发布声明、生成全局声明
以及实际三格式出口。历史源码/声明用例能创建Result、替换open/close及整个工厂；候选也必须
继续编译，不能只验证readonly精确视图而漏掉这类合法旧代码。

仓库外真实安装矩阵共27场景（四发布×5 + 候选7），都经过offline安装、frozen重装、
完整归档成员哈希核对，确认不是workspace链接，类型解析不得逃逸到仓库。候选7场景
和历史12场景零诊断；另外8个精确历史失败：

- 1.0.0：NodeNext CJS/ESM和bundler均2307。运行时require另验证MODULE_NOT_FOUND，
  不用Git代码补齐缺失归档。旧node解析还能找到types，与现代exports失败分开记录。
- 1.0.1：同三种现代解析均7016；声明在tarball里，但exports中没有对应类型路径。
- 1.0.2和1.1.0：NodeNext ESM各7个精确诊断，顺序为
  2322/2344/2349/2349/2344/2344/2349，默认导入被解释成不可调用的CJS namespace，
  连带Parameters/ReturnType错误。其他所测模式保持正常。

候选每种模式均拒绝14项非法用法；历史负例不是8项候选豁免，27场景也不代表全零错误。
首次安装遇到1.0.0现代解析2307，第二次进一步观察到1.0.2的Parameters赋值never产生
额外2322；两份中间诊断完整保留，最终检查用精确版本/模式/诊断列表，不接受任意错误。

额外反向赋值审查复现了首版声明的2741：为默认工厂增加必需.default类型属性，会让
旧的普通替换函数无法赋值；仅保留末重载的Parameters还不够。最终默认声明改为旧的
完整必填函数形状，精确/可选调用只通过显式RuntimeFactory视图提供。CommonJS声明
保留旧import=模块.default访问，ESM声明单独指定默认可调用类型以避免namespace错误。
运行时仍同时支持直接require与.default。此项没有请求用户接受类型破坏。

结果与哈希见[证据](../baselines/dpip-types-validation.json)，维护说明见[入口](../dpip-validation.md)。
05原生文档窗口/设备/代理组合和06完整分发/demo仍继续；不推送、发布或升级版本。
回退需要同时回退types、条件入口、运行时.default和对应生成产物，保留历史归档。

横向复查也证明Canvas/Ambilight的实际发布声明接受旧工厂替换，而当前声明各出现2741。新增PKG-FACTORY-01紧接本任务修复，并加入两包05与REL-01依赖；FACTORY-TYPE-01保持open，复现源码与结果见baselines/factory-assignment-gaps.json。此前完成记录保留为历史检查点，不冒充此新用法已通过。

最终四组专项、编辑器/三格式构建、27安装场景（19零诊断+8精确历史失败）及最终main哈希对应的18浏览器通过。完整CI1140项（1006单元+14工程+120基线），另44重复契约、290生产TS严格检查通过。任务done并独立提交；下一步PKG-FACTORY-01，DPIP05/06继续。
