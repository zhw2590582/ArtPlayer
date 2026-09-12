# Canvas代理测试维护

先读 [实际契约](baselines/canvas-contract.md) 和canvas-release.json。来源包含两个真实
发布、当前Git冻结工作区，以及1.0.0关联核心Git源码，后者不等于同版本npm内容。

`node --test refactor/scripts/canvas-contract.test.mjs`运行13项：归档/导出/声明、Git与
实际npm核心能力区别、三实现属性转发和事件、正常bitmap与无bitmap绘制/resize。
测试已接入test:baseline；test/helpers/canvas.js控制元素属性、microtask、RAF、延迟
订阅和事件对象，后续02复用以构造乱序/销毁。假Canvas不证明真实像素、codec或设备。

13项正常契约通过以后，02必须分别复现过期bitmap完成、回调错误/close资源、重复
play/pause、destroy前后订阅、缺context和尺寸异常；保留历史失败与候选通过两套测试。
03拆媒体adapter/绘制调度/订阅和所有权，04明确公共类型（尤其可选参数及canvas自有
方法优先），05/06核验新旧核心、实际媒体/浏览器/设备/安装包和8082 demo。

当前已有的Ambilight代理颜色测试会直接加载proxy的src/index.js；代理迁移文件入口
或模块拆分时必须同步改为实际候选入口加载，不能用旧dist掩盖改名或遗漏模块。
Canvas本身的正式历史浏览器矩阵尚未建立；没有在01使用新浏览器结果作包整体验收。

01最终13项Canvas专项、7项契约索引检查与991项完整CI通过；证据见
[发布契约验证](baselines/canvas-contract-validation.json) 和
[实施记录](changes/2026-09-12-PKG-CANVAS-01-contract.md)。三个新增风险继续open，
生命周期仅source-observed，02需先复现再推进03源码修复。
