# CORE-02：带事件映射的 Emitter

## 实现与保留契约

Emitter 迁移为 src/utils/emitter.ts，支持事件名到参数 tuple 的映射、可选/readonly 参数、symbol、
ctx 推导和子类链式返回。默认开放通道；已知事件可与开放自定义事件组合，已知 payload 不被放宽。
当前 JS 播放器与现有公开声明继续渐进迁移，不在本任务改变 Artplayer 构造或新增公开方法。

保留懒创建的普通对象 e、原始 fn/ctx、once wrapper 的 `_` 引用、方法参数个数和描述符。
declare 字段不生成运行时初始化。派发浅拷贝数组，普通订阅移除/追加、原始 callback 移除 once、
异常传播和停止当前派发等语义由发布/工作区/产物共享的九组契约覆盖。一次受控的密集数组索引
断言保留 off 的原固定长度遍历；没有引入通用 any 或事件库依赖。

## 两处有意修复

- EVENT-NAME-01：旧版使用继承属性查询，toString/constructor/hasOwnProperty/__proto__ 不能
  正常注册。现在只读 own entries 并定义 own data property，registry 原型不变。
- EVENT-ONCE-01：较早的普通 listener 嵌套 emit 时，旧版的 once 被内外两个已捕获快照重复执行。
  wrapper 现在先记录 consumed 再取消订阅，跨快照只调用一次。普通 listener 的快照行为不变。

这两项是已复现缺陷，不作为必须保留的旧行为。Node 对照和三个真实浏览器都分别保留旧失败观察
与候选修复断言；不会通过更新冻结发布结果来制造兼容结论。

## 验证

- 严格源码类型检查包含七个必须拒绝的错误调用；名字/payload/receiver/自定义通道都有正例。
- `yarn ci:check` 共 85 项 Node/基线测试通过。
- 实际 UMD、legacy、ESM 各 29 项 Emitter 对照及修复测试通过。
- `yarn build artplayer` / `yarn build:i18n` 重建 dist 与 docs/compiled。
- 严格 tarball 安装消费：27 项运行时、五组类型零诊断；共享 Emitter 契约已随安装检查增加。
- 安装产物三浏览器 75 项通过，无重试/跳过，包括真实播放器和 chapter 的既有回归。
  [执行指纹](../baselines/emitter-validation.json) 记录最终 runtime 与浏览器资源的一致性。

[核心架构](../../packages/artplayer/ARCHITECTURE.md) 已更新数据和事件所有权。新修复在统一风险台账关闭，
公共 Emitter 声明扩展仍属于 CORE-07。下一项 CORE-03 建立内部资源作用域，再接初始化/销毁修复。
独立提交包含生成产物；未升级版本、推送或发布。回退该提交即可恢复本次行为及源码。
