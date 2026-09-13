# PKG-VTT-THUMB-04 类型兼容实施完成

用户已批准ADR-025，之前检查点中的待确认状态由本记录取代。根/legacy保留真实npm
1.1.0的必填Option、同步name结果和完整可替换工厂类型；实际异步行为继续通过
/runtime表达。修正根入口条件映射，保留旧NodeNext ESM合法namespace及整个模块
的双向替换关系，不能只让默认调用通过就声称类型兼容。

/runtime的Node10声明改为export=并补全Option/Result/Factory/RuntimeFactory命名
类型，与NodeNext CommonJS、ESM入口一致。精确异步结果与可写self.default均验证；
较早1.0.x的export=冲突、1.1的模块类型及建议迁移已在README和架构文档写明。

最终真实安装报告包含五个历史版本与候选的32配置，候选7配置全部正例通过，每个
配置按语句行拒绝12个反例。保留旧1.1 NodeNext直接调用的7个错误及36组历史/候选
CommonJS直接/default对照；1.0.0发布包原始SyntaxError单独记录。最新合法namespace
和候选一致，实际JS调用身份单独核验。安装位于工作区外，归档成员逐字核对、离线
安装及frozen重装通过。5项专项测试含独立编辑器、历史声明和替代签名验证通过。

生产TS迁移、模块拆分及先前运行时验证见
[运行时检查点](2026-09-13-PKG-VTT-THUMB-04-runtime-types.md)与
[公共声明检查点](2026-09-13-PKG-VTT-THUMB-04-public-types.md)。此次源码/dist未变，
根公共声明内容未变，生成编辑器一致性已验证，无需重复构建或浏览器播放。

本任务04完成，VTT-THUMB-TYPE-01关闭；涉及历史控件名称、核心组合和完整分发的
VTT-THUMB-EXPORT-01继续交给05/06。没有把类型冲突批准扩大为运行时行为变更，
没有新增设备证据，也没有推送或npm发布。详见
[最终证据](../baselines/vtt-thumbnail-approved-types.json)。
