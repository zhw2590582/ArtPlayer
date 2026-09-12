# PKG-CANVAS-04 公开类型与导出兼容

公开namespace定义Option、Result、Callable、Factory及显式MediaCanvas视图。Callable
只有可选callback签名，保持1.1.0的Parameters包含undefined；Result仍精确等于
HTMLCanvasElement，不把返回值收窄为必须具备全部媒体属性的交叉类型。MediaCanvas
供显式使用转发成员的消费者断言，Canvas自有成员优先，不声称新增浏览器能力。

入口default自别名兼容旧require.default与直接可调用工厂；ESM仅default运行时导出。
新增.d.mts/.d.cts入口包装和import/require条件类型，typesVersions保留旧TS legacy路径。
公开namespace接入语义编辑器声明生成，README和包内架构同步说明用法与边界。

四组专项覆盖五种旧/新编译器模式、11项非法用法、两份真实发布声明、生成全局声明
以及实际三格式产物。1.0.0回调必填到1.1.0可选是既有发布差异，候选不恢复必填限制。
新旧ReturnType消费者仍可赋值普通Canvas；没有借用Ads的类型推导修正授权。

仓库外真实安装先复现npm1.1.0在TS5.9.3 NodeNext ESM的五个精确诊断：
2349/2349/2322/2344/2344。默认导入被当作CommonJS模块namespace而不可调用，
额外ReturnType断言也受影响；该历史失败单独保留，不能把历史全部场景称为零诊断。
候选安装消费者必须无诊断，且移除@ts-expect-error后拒绝全部11项非法用法。

结果和输入哈希见[验证证据](../baselines/canvas-types-validation.json)。05真实设备和
06完整分发/demo验收仍需完成，本步不发布npm、不修改版本、不推送。

最终四组专项、编辑器/三格式构建、仓库外17场景和18项真实浏览器通过；17场景保留1项历史五诊断，不能等同17项零错误。完整CI1052项通过（938单元+14工程+100基线），另44项重复契约观察；284个生产TS文件严格检查。CANVAS-TYPE-01及CANVAS-DIST-01具体风险关闭，本任务done并独立本地提交，05/06及整体发布验收继续。
