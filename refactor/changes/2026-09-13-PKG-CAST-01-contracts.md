# PKG-CAST-01 发布来源与公共契约

冻结真实npm1.0.0/1.1.0、全部成员与九个工作区源码/声明/README/demo/产物文件。
历史banner和registry gitHead均存在版本差异，按真实tarball归档保存，不反推或改写。
来源核心5.1.2/5.3.1仅为git关联，不能据此宣称对应正式核心发布或完整支持范围。

新增只读重放verifier与28项公共行为测试，覆盖两版本main/legacy、冻结source及
工作区main/legacy，分别验证CJS/global、eager/lazy加载、异步注册、实际结果、live
option、MIME、回调/状态及加载失败。初次统一套用1.1.0流程导致1.0.0等待注册加载，
已终止该测试进程并按真实归档拆开场景；最终28项均通过。不是掩盖生产异常。

详见[契约表](../baselines/chromecast-contract.md)、[来源](../baselines/chromecast-release.json)
及[验证摘要](../baselines/chromecast-contract-validation.json)。根脚本增加test:chromecast并
纳入test:unit；没有生产代码、声明、依赖、版本或分发产物变化，不需要本步重新构建。

CAST-TYPE-01登记旧同步声明、缺失回调和查询方法，04保持旧声明形状并增加准确入口。
VENDOR-10记录商业图标标记与内嵌path匹配，归03替换和06分发核查。README/demo内容
极少，demo仅相对媒体URL，接收端网络可达性与真实SDK版本/设备验证仍归05/06及SDK-06。

独立子代理核验npm与来源，另一个子代理只读对照Google官方规范，主代理审查并建立
实际归档行为测试。01完成不表示SDK实现正确或已具备npm准入；02/03继续修复已发现
的问题。没有连接Cast设备、推送或发布。
