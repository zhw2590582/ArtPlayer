# PKG-DPIP-03 严格 TypeScript 与窗口资源

原单文件迁为6个TS模块：index核心门面、window-session请求/窗口状态、projection节点
归属与还原、styles共享样式与跨文档复制、control控件监听器、resources延迟与清理。
分包严格tsconfig接入根typecheck；生产依赖和版本不变，公开声明留04独立验收。
三种构建产物通过仓库脚本重建，.npmignore排除分包tsconfig。

结构迁移保留同步注册和Result字段顺序、能力快照、工厂options浅拷贝、默认值、
右侧index40控件、CSS id/class、同步toggle、open/close Promise<void>和正常事件顺序。
未新增公开destroy方法。Window API类型为局部可选能力，不污染全局Window声明。
DOM/状态模块不依赖Artplayer，新核心仅通过既有接口集成，不提升插件最低核心依赖。

缺陷修复单独由候选测试覆盖：正在申请时coalesce、close/toggle撤销申请并提前结算
调用者、迟到窗口直接关闭、销毁终态、取消100ms定时器、事件重入/初始化失败回收、
adoption错误回滚、占位移动/删除后恢复原parent/sibling、原ownerDocument样式复制。
父节点拒绝插入时尽力恢复到原document.body并报告close失败；原document也拒绝插入
仍无法保证恢复，不声称任意DOM破坏都可以修复。所有清理逐项尝试，不因单一监听器
清理异常而跳过窗口和节点释放。销毁期间保留类清理/还原，禁止新事件/UI/延迟效果。

20项候选测试在旧冻结源码上3项正常契约通过、17项失败；候选全部通过。新加样式
插入重入测试曾发现第一版迁移残留3节点，现追加插入返回后的终态检查与二次清理。
首版记录和修正后记录都保留，不通过放宽断言隐藏失败。

浏览器宽矩阵66项（48历史+18候选）通过，随后释放control宿主引用的调整再次用
最终构建main产物运行18项候选验证。两实际核心为npm5.4.0和候选，三引擎均覆盖。
使用真实iframe DOM与受控窗口API；原生Document PiP/媒体连续性/代理设备组合仍05，
不能把这一步称为原生文档窗口验收。LIFE/DOM风险记录实现修复证据并保持原生验收
缺口开放；STYLE重复注入已有候选正反对照。类型和分发差异仍由04/06完成。

模块维护见包内ARCHITECTURE.md，测试入口与限制见[验证入口](../dpip-validation.md)，
结果与哈希见[证据](../baselines/dpip-lifecycle-validation.json)。回退需整体回退src、
分包配置与同批生成产物，保留历史测试；不修改归档基线。不推送、发布或升级版本。

最终复查新增notice setter异常传播兼容用例，修复首版吞掉异常的回归；20项候选在旧源码上3正常通过/17失败。链路使用Promise.then结算，不新增Promise.finally能力要求。最后main产物浏览器与main/legacy受控生命周期重跑覆盖此修正。

最终完整CI1136项（1006单元+14工程+116基线）、44项重复契约观察与290个生产TS严格检查通过；main/legacy各20候选回归、最终main产物18项浏览器通过。main原始字节4624→6874，gzip1776→2831；资源正确性增加了体积，不宣称全项目性能门槛已经通过。本任务done并独立提交，04/05/06继续。
