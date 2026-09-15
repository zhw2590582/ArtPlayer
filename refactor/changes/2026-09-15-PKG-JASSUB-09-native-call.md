# PKG-JASSUB-09：区分原生调用阻塞和 Promise 等待

接续 HEAD `319dccb60593f6206418dc04b27b1170767fa716`。本检查点只改诊断测试及
证据，PKG-JASSUB-09/05 和 JASSUB-FIREFOX-OFFSCREEN-01 仍未完成。未修改生产
源码、vendor、声明、构建产物、依赖、版本或默认渲染模式。

## 已排除的假设和新边界

给原生对照增加显式 SINGLE_FLIGHT 后，任意时刻最多一个未确认的绘制任务。
在旧核心宿主上仍复现停顿，maxOutstanding=1；因此同时堆积多个 ImageBitmap
任务不是该次失败的必要条件。主线程仍按原来的方式读取画布，没有等待 Worker。

初版定时探针在停顿期间也没有执行，因此把 createImageBitmap 调用入口、同步
返回、Promise 结算分开记录。最终版本先构造 ImageData 再开始调用计时，避免
把像素缓冲区构造算入原生 API。一次精确边界运行中，旧核心宿主的调用耗时
10010ms，返回后约2ms即结算；同时主线程 drawImage 耗时10004ms，之后
getImageData 没有额外可测停顿。最终三浏览器运行对应耗时10006ms/10004ms。
这是原生调用阻塞的观测，不是 Promise 已返回后单纯长时间未结算的证据。
不同 realm 的 performance.now 原点不同，以上只比较各自内部时差。

更早的边界运行中，完全不加载 ArtPlayer/JASSUB 的原生页面也发生10003ms的
画布复制停顿；包含 ImageData 构造的创建表达式耗时10005ms。该用例最终拿到
期望颜色而显示 passed：expect.poll 不能中断正在阻塞的浏览器调用，成功的
晚到断言不足以证明没有停顿。不能继续用“native 通过”排除原生路径的问题。
新 SINGLE_FLIGHT 诊断在全部播放、seek、布局采样之后检查每次读取少于7000ms，
保留原像素、尺寸及时间前进断言；没有扩大原 expect/test 超时。

上述证据排除了“必须加载核心”和“必须存在多个并发创建任务”两个必要条件，
没有证明所有 JASSUB 截图失败都出自同一原因，也没有识别底层锁、原生堆栈、
浏览器缺陷修复版本或合适的生产降级策略。不能据此关闭原风险。

## 可维护入口

`test/browser/jassub-platform.spec.js` 保留默认 fillRect 和原有 bitmap/idle
控制，新增 `ARTPLAYER_JASSUB_CONTROL_SINGLE_FLIGHT=true`。它只在没有未确认
绘制时发送下一帧，记录跳过的回调、最大队列、逐任务ID及主线程采样耗时。
Worker 每250ms尝试报告尚未结算的任务，区分调用入口、返回、结算和绘制完成。
定时器随原有 Worker terminate 释放，不向页面引入长期存活的额外服务。
没有改动 JASSUB Worker 协议；这是仅含原生画布操作的独立控制 Worker。

保持固定 Node24.21.0/Yarn1.22.22，顺序运行并在每轮后归档共享 report/results：

```powershell
$env:ARTPLAYER_JASSUB_CONTROL_BITMAP = 'true'
$env:ARTPLAYER_JASSUB_CONTROL_SINGLE_FLIGHT = 'true'
$env:ARTPLAYER_JASSUB_CONTROL_IDLE_READBACK = 'false'
yarn test:browser test/browser/jassub-platform.spec.js --workers=1

$env:ARTPLAYER_JASSUB_CONTROL_IDLE_READBACK = 'true'
yarn test:browser test/browser/jassub-platform.spec.js --project=firefox --workers=1

$env:ARTPLAYER_JASSUB_CONTROL_BITMAP = 'false'
$env:ARTPLAYER_JASSUB_CONTROL_SINGLE_FLIGHT = 'false'
$env:ARTPLAYER_JASSUB_CONTROL_IDLE_READBACK = 'false'
yarn test:browser test/browser/jassub-platform.spec.js --workers=1
```

## 验证与限制

| 运行 | 结果 | 证据含义 |
| --- | --- | --- |
| 初版单任务＋定时探针，Firefox三宿主 | 2 pass / 1 fail | 一个未确认任务也会停顿 |
| 创建表达式返回＋采样计时，Firefox三宿主 | 2 pass / 1 fail | native 的 pass 内含10秒停顿；不能当作流畅通过 |
| 分离 ImageData 和原生调用，Firefox三宿主 | 2 pass / 1 fail | 确认约10秒在 API 返回 Promise 之前 |
| 最终单任务并行读取，三浏览器三宿主 | 8 pass / 1 fail | Firefox旧核心宿主再次复现；其余只代表本次结果 |
| 最终单任务且读取前等待 Worker，Firefox三宿主 | 3 pass | 改变观察调度的对照；不是生产修复 |
| 原默认 fillRect，三浏览器三宿主 | 9 pass | 基本绘制控制仍通过 |

浏览器为 Chromium153.0.8010.12、Firefox155.0、Windows WebKit26.6。
前两者使用真实 Worker、转移画布和 ImageBitmap；WebKit缺少transfer，实际验证
主线程fillRect能力回退，不是其 offscreen/bitmap 支持证明。所有运行无重试。
各中间版本的观测能力差异在机器记录中逐一标注，不把最终源码指纹套用到旧运行。

保留所有红结果以及 trace、失败截图、附件。机器摘要保存源文件/报告/日志哈希、
各宿主完整 Worker 时点和采样数据、错误及浏览器版本，见
[jassub-native-call-validation.json](../baselines/jassub-native-call-validation.json)。
原生源代码和单个浏览器调用的同步耗时已经足以改变下一步调查方向；继续获取
对应浏览器原生堆栈或独立最小复现，而不是继续缩小 JS 队列或静默关闭默认异步绘制。

提交前 scoped ESLint、工具链、计划/风险校验、风险测试和 diff 检查通过。
因为本轮没有生产/类型/依赖修改，不重复构建包或把此前类型/安装矩阵视作本轮结果。
回退本提交仅撤销诊断观测及记录，不撤销先前 hybrid 生命周期修复。无推送或发布。
