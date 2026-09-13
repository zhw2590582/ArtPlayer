# ADR-027：已确认的历史类型冲突规则

本规则先前误记为ADR-025，与Iframe决策重号；2026-09-13改为ADR-027。旧类型相关
记录中的ADR-025是本规则的历史别名，冻结测试报告和已验证包内容保留原字节。

2026-09-13，用户对以下完整问题回答“接受这条规则并继续”：保留各包最新已发布
版本的旧类型形状，较早版本的冲突写清迁移说明；所有合法旧JavaScript调用继续
兼容，新增/runtime提供准确类型。本次明确涉及Canvas、Ambilight、VTT Thumbnail、
Multiple Subtitles。此确认独立于此前Ads的参数推导修正。

## 实施约束

- 从真实npm归档确定最新已发布声明；不得把重构中的候选声明当成兼容基线。
- 保留默认工厂的完整赋值关系、参数必需性、Parameters/ReturnType及模块形状，
  不以附加必填default属性或可选重载破坏普通替代函数。
- 正确运行时异步结果、额外可选调用及自default别名通过独立/runtime类型描述，
  与根入口复用同一运行实现。
- 对较早export=/export-default等互相矛盾的声明，保留历史失败证据并给出迁移
  示例；这些被批准的类型差异不再等待重复确认。
- 所有合法旧JS入口仍验证，不将类型取舍扩展成任意运行时破坏或删除旧分发入口。
- 真实安装消费者、正反例、编辑器声明和包内文档通过后才完成相关任务。批准方案
  不等同实现完成、风险自动关闭或发布授权。

适用任务：PKG-FACTORY-01、PKG-VTT-THUMB-04、PKG-MULTI-SUB-04。后续记录必须注明
采用哪一个真实版本、哪些旧类型用法需要迁移，以及/runtime的具体形状。

Chromecast的PKG-CAST-04沿用此规则保留最新npm 1.1.0根声明，不引入新的根类型
破坏。1.0.0的export=与1.1.0的default export已有历史差异，分别保留测试证据；
准确异步注册、回调和查询类型通过新增/runtime提供。此处记录规则的应用，
不声称用户另行确认过Cast专属问题，也不扩大到未验证的运行时变化。

Danmuku的PKG-DANMUKU-06保留实际npm 5.3.0根声明的完整类型形状与字节（忽略
换行格式），包括历史同步emit结果、必填danmuku、对象形points和NodeNext ESM的
既有namespace限制。新增/runtime描述真实Promise/owner结果、可选配置字段、tuple
points、静态icons和回调receiver；根/legacy/runtime复用原分发实现，不添加不存在
的factory.default。旧入口用户不需要因本次类型迁移修改代码。切换/runtime是可选
的准确类型入口，历史声明与运行时的区别见包README；这里没有新增旧类型破坏授权。
