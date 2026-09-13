# PKG-VTT-THUMB-04 严格运行时类型检查点

六个 JS 实现迁为 TS，并增加 types.ts，明确 Option/Result、字符串矩形和 Thumbnail、
资源生命周期、事件元组与最小预览输入。分包 allowJs=false，继承 strict、
noUncheckedIndexedAccess、skipLibCheck=false、types=[]，不引入 any 或忽略检查。
运行时注册准确返回 Promise<Result>，取消分支为 void；parser 输入用 unknown 并先验证。

新增由分包 tsconfig 检查的正反例，覆盖 URL/CSS、必传参数、异步结果、关闭状态、
事件元组和矩形字段。非空/类型断言仅用于已校验正则/数组边界、四键对象构造、
真实 Artplayer constructor 和关闭检查后的原生 Response；包内架构说明具体不变量。
数值计算显式 Number 转换，保留正常坐标/进度样式及零值写入。

公开声明、package exports、版本、依赖保持原样。类型用例明确复现旧声明返回同步
对象与实际 Promise 的冲突，没有靠给 Promise 增加 name 属性或类型断言伪造同步结果。
04 继续 doing，下一步验证旧编译器/消费形式、异步类型视图、CJS default 兼容、
模块声明和编辑器；不能将严格内部类型通过等同于公开声明已完成。

本次沿用 246 项本包契约/错误/候选测试，并验证正式构建和真实浏览器。
准确入口、类型和 CI 结果见 [验证记录](../baselines/vtt-thumbnail-runtime-types.json)。
正常构建生成 dist 与 docs 副本；无新依赖。内部源码路径从 .js 迁至 .ts，历史
源码深导入仍归 06 分发审查，当前不能声称所有深路径已验收。
独立本地检查点提交；回退可恢复前次 JS 实现，不影响历史冻结测试。不推送或发布。
