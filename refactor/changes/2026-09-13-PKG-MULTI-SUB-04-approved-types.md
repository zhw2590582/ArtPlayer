# PKG-MULTI-SUB-04 类型兼容实施完成

用户批准ADR-025后，Multiple Subtitles按实际npm1.2.0保持根/legacy的必填subtitles、
同步name结果、普通工厂双向赋值和NodeNext namespace。较早1.0.0/1.1.0的export=
差异通过迁移说明处理；不再等待重复授权，也不把实际异步实现改成历史声明的同步行为。

修正根入口类型条件映射，移除候选时期根.d.mts/.d.cts包装。/runtime继续与根共用
JS实现，精确描述异步注册、tracks/select/reset和可写default自别名；Node10的
export=声明现在也提供完整命名类型。README提供可执行的CommonJS async函数迁移
示例，架构文档说明历史类型与精确入口各自职责。

最终安装三历史版本和候选共22配置，候选7配置正例均无诊断，各按语句行拒绝16个
反例。真实归档成员与安装目录逐字核对、仓库外离线安装及frozen重装通过。
最新1.2.0及候选保留旧NodeNext直接调用的8个原始诊断，合法namespace调用与整个
模块双向替换通过；较早export=直接/default对照保留，候选JS身份另行验证。
7项声明、编辑器及内部strict测试通过，定向lint通过。

原有生产TS拆分和资源/异步类型验证仍见
[运行时检查点](2026-09-13-PKG-MULTI-SUB-04-runtime-types.md)与
[公共声明检查点](2026-09-13-PKG-MULTI-SUB-04-public-types.md)。此次源码/dist和根
公共声明内容未变，已验证生成编辑器一致性，没有重复播放测试或新增设备通过声明。

04完成，MULTI-SUB-TYPE-01关闭；MULTI-SUB-EXPORT-01的完整分发与demo部分继续交给06，
核心组合/设备仍由05负责。前次文档中的待确认状态由本记录与ADR-025替代。
最终报告及哈希见[验证记录](../baselines/multiple-subtitles-approved-types.json)。
独立完成提交，不推送或发布。
