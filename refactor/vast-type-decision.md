# VAST 公开声明协调：已确认并实施

2026-09-14用户明确接受：“保留 npm 根类型，工作区类型迁移到 /runtime”。
本决定独立于初始化运行时批准；后续不再等待这项类型取舍授权。

PKG-VAST-04。运行时初始化策略已由用户单独确认，见
[运行时决策](vast-compatibility-decision.md)；这里不重新询问该决定。

## 已复现的声明冲突

实际npm1.0.0根声明采用export=，回调有id/$container/imaPlayer:any，工厂参数必需，
第二层错误地声明同步{name}。未发布工作区1.2.0改成default export，回调增加
init/选项/getter但丢失id/$container，imaPlayer可空，并导出Option/Instance类型。

使用实际npm归档声明和当前工作区声明，在TS5.9.3及4.3.5、strict、无skipLibCheck
下交叉编译：各自消费者在原声明通过；npm消费者在工作区声明出现4项错误，包括
完整工厂类型不等、两个字段缺失、imaPlayer可空。工作区消费者在原npm声明缺少
命名类型。临时证据为refactor/.cache/vast04-type-conflict.json；正式测试继续纳入04。
补充命名类型可以解决部分导入问题，但无法同时保持两套不同回调Parameters、完整
工厂赋值关系、同步Result和准确Promise。增加交叉类型/重载也会改变类型提取结果。

## 已接受的方案

1. 根入口/legacy保留实际npm1.0.0的完整工厂类型、必需参数、export=及同步历史声明。
   旧类型的any和同步误声明只作为历史兼容面保留，不声称它们准确描述运行时。
2. 新增/runtime，复用相同JS产物，提供准确Promise、必需destroy、可省略callback、
   两种初始化模式、SDK类型、配置字段及.default自身别名。
3. 依赖未发布工作区回调/命名类型的TS代码转到/runtime，并显式选择workspace-1.2。
   准确init返回Player|null；核心销毁后可能无法初始化，调用方需要判空。
4. 所有已验证的旧JavaScript调用保持上一任务已实现的行为。旧类型与真实行为的
   差异、TS迁移示例、CJS/ESM导入方式写入包文档，并以隔离安装消费者验收。

```ts
import vast from 'artplayer-plugin-vast/runtime'

vast((context) => {
  context.playerOptions.autoResize = false
  context.init()?.addEventListener('AdStarted', onAdStarted)
}, { compatibility: 'workspace-1.2' })
```

这会改变未发布工作区的根类型用法，已由本次用户明确确认。之前Canvas等包的类型
授权及VAST初始化授权均不作为此决定的替代依据；仍须实际消费验证才完成04。
没有推送或发布授权。

## 实施结果

根声明恢复实际npm原文（仅忽略换行格式比较）；新增/runtime的CJS/ESM类型门面和
共用runtime-api.d.ts，内部Context/Result/配置也引用这份准确定义。两套模式的资源
字段可空性/可写性、必需destroy和Promise已建立正反例。实际安装14组编译检查通过，
包括不启用interop的require导入；完整结果见
[04记录](changes/2026-09-14-PKG-VAST-04-types.md)。真实Google IMA验收仍由05负责。
