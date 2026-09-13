# PKG-FACTORY-01 历史工厂类型修复完成

根据用户2026-09-13确认及ADR-025，Canvas和Ambilight根/legacy声明保留真实npm
1.1.0的完整纯函数形状。Canvas回调可选、结果精确为HTMLCanvasElement；Ambilight
参数必填、字段可选、结果仍为同步start/stop。普通替代函数可双向赋值，不再要求
必填default成员，也不靠重载只保住Parameters。

新增/runtime映射到现有JS文件，独立描述可选调用及readonly self.default。
ESM/CommonJS/Node10解析各有准确声明。根入口保留1.1.0 NodeNext ESM历史namespace
及原直接调用诊断；不能以修复该旧诊断为由破坏原合法namespace赋值。较早1.0.0的
export=及参数/字段差异有真实归档对照，并在包README给出/runtime迁移示例。

两包最终tarball分别验证17配置，合计34配置。候选各7配置均无正例诊断，Canvas
每配置拒绝14个指定反例，Ambilight为15个；反例按语句行核对。安装目录位于工作区
之外，执行离线安装、frozen重装、归档及安装字节比对；不借用workspace类型软链。
旧1.0及1.1诊断保留，不将其混作候选失败或静默删除。

8项专项测试核对真实历史声明、完整工厂赋值、编辑器生成和main/legacy/global/ESM
身份。共享typecheck在修改当时验证361个生产TS文件及所有已有消费模式，通过；
后续Chromecast新增源码不计入该快照。定向lint通过。可追溯报告和哈希见
[验证记录](../baselines/factory-compatibility-validation.json)。

生产源码和JS产物未改，已有运行时行为保留；本次没有新增浏览器或设备验证声明。
FACTORY-TYPE-01已关闭，包05/06和npm发布复盘仍须继续。一个任务一个独立完成提交，
不推送、不发布。
