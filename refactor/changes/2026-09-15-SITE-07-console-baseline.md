# SITE-07 console.js 来源与行为基线检查点

冻结原始 340,306 字节 bundle，静态提取 102 个模块的依赖表与函数指纹；所有表内
依赖均在 bundle 内解析，明确 Focm 安装入口和 W5CS 自有视图。实际发现 React、
ReactDOM、consoleLog、parcelRequire 全局以及 consoleLog 返回组件实例等兼容面。
来源、原提交和依赖未知项见[清单](../baselines/site-console-inventory.json)。

新增真实浏览器测试，当前文件与冻结文件各覆盖全局/实例复用、日志等级/普通对象、
Clear、计数、滚动和鼠标悬停。仅冻结旧版的另外三组用例复现待修复问题：卸载后
滚动回调、多容器 hook 所有权错误、Firefox/WebKit Error 消息丢失。原生产脚本
未修改，因此不能把历史复现通过当作修复成功。

首轮 24 项：20 通过、4 失败。Firefox/WebKit 的两种输入都显示原生 Error 堆栈却
丢失消息，定位到 parser 的 stack 分支。普通展示契约改用显式错误文字加 Error；
Error-only 问题另设专用历史复现并列为新实现的修复门槛，未豁免候选正确展示消息。
后两轮各 24/27：修正了测试错误假设，分别是 Error 仍保持对象身份、DOM textContent
逐字保留堆栈换行；源码表明 Error 已转成 stack，HTML 节点也会改变换行。改为检查
解析结果精确等于 stack、每行帧仍显示，以及消息是否缺失。完整失败报告保留。

测试 fixture 明确设置 UTF-8，消除新建隔离 HTML 默认编码导致的伪差异。原站点
编码和运行时文件未改。最终结果、引擎版本、当前/历史输入和失败历史见
[验证记录](../baselines/site-console-validation.json)。这是控制台界面隔离测试，
不是新 npm 包、实际主编辑器组合、真实播放或手机验证。

新增 SITE-CONSOLE-01，负责自有 TS 模块、兼容构建和三项修复；由 SITE-05 验收依赖
确保进入发布路径。三项风险保持 open；SITE-07/VENDOR-08 仍 doing/open。
具体迁移顺序见[控制台迁移边界](../console-modernization.md)。本检查点不完成任务，
只提交可复跑的旧契约和缺陷依据；下一步进入 SITE-CONSOLE-01 的源代码实现。

无依赖、版本、锁、生产代码或既有接口变化。回退仅移除新增基线、测试和任务/风险
记录，不改站点当前行为。未推送、未发布。
