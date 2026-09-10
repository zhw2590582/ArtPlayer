# CORE-05：输入配置与内部配置

## 文件与数据流

核心入口直接调用 option/resolve.ts，默认值移入 option/defaults.ts，scheme/index.js 迁移为
scheme/index.ts。option/types.ts 区分公开 Option 输入、补齐默认字段的
ResolvedOption 和保留应用扩展字段的 ResolvedInput。主入口不再内嵌默认值列表和合并步骤，
但仍是 JS 兼容门面，完整 TS 收敛属于 CORE-20。

数据流保持 Artplayer.option → mergeDeep(defaults, input) → 恢复 input.container 引用 →
原 option-validator 校验 → 后续生命周期。每次默认 getter 都生成独立对象、数组和 onVttLoad
回调；Safari preload、读取 navigator.language 的时点、字段次序与默认值不变。
实例 ID 在校验前递增，非法 JS 配置仍在挂载 DOM/调用 proxy 前抛错。

ResolvedOption 只用于符合已声明输入合同且成功合并的配置，不宣称是任意 unknown 的完整安全
类型守卫。顶层及 subtitle/thumbnails 默认字段成为必需，proxy 明确保留 undefined；集合成员、
回调和应用扩展沿用输入类型，不引入新的全局 any 索引签名。动态 merge 与该合同之间保留一处
有注释的结果断言，未知 JS/扩展数据仍须在具体消费者中核实。

scheme 的所有键以 Record<keyof Option, Scheme> 检查，保留原可变对象、ComponentOption
共享引用和错误消息。根 types/option-validator.d.ts 根据现有 2.0.6 实现补充 identity validator、
schema 回调路径、kindOf 类型；没有更换依赖、包装运行时或改变 Artplayer.validator 的引用。
根和核心 tsconfig 引入该声明，lint 同时覆盖根声明文件；test:unit 加入配置对照测试。

## 保留行为与声明缺口

API-01/03/04/07/09/11：容器 identity、输入 getter 的顺序/次数、继承容器恢复、unknown 自有
字段、数组元素引用、嵌套对象合并和原始 callback 引用均保留。显式 undefined 仍可能被原校验
拒绝，不改成悄悄填默认值；错误 path、首次错误及抛出类型与真实发布版对照。

新增 BASE-TYPE-06，交 CORE-07：真实旧/新 JS 均允许省略 url，并可将数字用作控件 HTML，
当前公开 Option/ComponentOption 却拒绝这两种形式。真实浏览器和类型反例分别证明差异；
公开声明本次保持，后续将这些类型负例转为正向消费者检查，不能修改运行时去迎合旧声明。
更宽松的底层 validator 接受某个值也不表示之后的 DOM/媒体模块一定接受它，阶段边界继续保留。

## 验证

- 八项 Node 配置测试：真实发布/当前默认对象隔离、完整默认值/字段顺序、合并所有权、getter
  读取、继承容器、九组非法字段输入的错误对照。
- 严格类型包含五项正常类型约束反例和两项已登记的公开声明缺口反例；回调 receiver、已补齐
  字段和应用扩展字段有正例。yarn ci:check 共 107 项：79 单元、4 工程、24 冻结基线；21 个
  自有 TS 源文件进入严格检查。
- 实际安装 UMD 候选三浏览器完整 126 项通过，其中 18 项配置场景验证正常/错误/声明差异，
  包含真实媒体 customType 与 ready 回调；其他播放、插件及生命周期回归同时通过。
- 实际安装 legacy 候选三浏览器配置与生命周期共 48 项通过，无源码回退、重试或跳过。
- yarn build artplayer / yarn build:i18n 生成核心 dist 与 docs/compiled；严格 tarball 仓库外
  消费通过 27 项运行时、五组类型零诊断。包内架构/类型说明更新后重新打包，最终 JS 指纹与
  UMD/legacy 浏览器候选匹配。

详见 [验证报告](../baselines/options-validation.json)、[核心架构](../../packages/artplayer/ARCHITECTURE.md)
和 [类型维护说明](../../packages/artplayer/types/README.md)。没有修改冻结发布数据、升级依赖、
更改版本或推送/发布。本任务独立提交，回退提交可恢复入口、模块、类型配置及生成产物。
下一项 CORE-06 建立内部媒体与宿主类型，随后 CORE-07 逐项协调公开声明差异。
