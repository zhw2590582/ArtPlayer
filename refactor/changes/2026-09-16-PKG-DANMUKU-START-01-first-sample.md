# PKG-DANMUKU-START-01 首帧之前的采样区间

状态：本缺陷修复完成。起点 b5f8b5e28e33cfb44e7aa93089b6dfbf247142f0。
关闭 DANMUKU-INSTALLED-GAP-01；PKG-DANMUKU-08 的其他组合与设备门槛仍保留。
这属于实施与回归验证，没有启动用户要求自行指导的正式复盘。

## 原因和修复

完整安装包 WebKit 回归的原始轨迹中，800ms CPU 阻塞期间媒体从约0.461前进到
1.261；第一次 readys 查询已经在阻塞之后，first/middle 留在 wait 且未进入
beforeVisible。原 sampling-window 直到 RAF 内第一次 capture 才保存时间及
等待队列，因此没有先前区间可供补回。此前的连续两帧间隔测试未覆盖这个入口。

新增受控测试在播放开始后、第一帧前推进800ms，稳定复现两行都未显示。
新增真实浏览器控制在 start 事件中进行1000ms CPU 工作，保留原生媒体时钟、
RAF、readys 返回值和队列状态；修复前 Chromium/WebKit 同样漏掉 first/middle。
Firefox 在这次负例的第一帧前没有前进媒体时间，不能称其复现了相同缺陷。

`SamplingWindow.begin` 只在没有起点时保存媒体时间及既有等待行；Scheduler
在确认开始播放且可见时、请求 RAF 前调用它。它不额外查询公开 readys，也不在
RAF 外执行 beforeVisible 或 visible。重复 play/playing/start 不向前覆盖起点。
原取消、seek、stop、hide、document visibility/adoption 清空规则保持。
新插入的过期行、已采样的 false 回调仍不会因跨窗口而被额外重试。

进一步补测发现第0秒也必须覆盖：旧公开 playing 要求 currentTime > 0。
因此内部起点还接受已解除暂停、未结束且 readyState > 2 的真实媒体状态。
这不修改公开 playing；实际显示调度仍使用原 playing 条件。第0秒受控用例
在此补充前失败、补充后通过，三浏览器同时验证了真实零点播放入口。

没有改变公开声明、事件负载、回调串行顺序、轨道算法、Worker 协议、显示寿命、
播放速度或依赖。维护文档明确起点与公开 getter 的区别。

## 验证证据

详见 [机器证据](../baselines/danmuku-start-validation.json)，包含原失败的精确输入、
首个采样、红绿结果、安装来源、源码/产物指纹和实际模型负载计数。

- Node24.21.0 / Yarn1.22.22。最终 `yarn test:danmuku` 278/278，通过旧契约、
  热力图、renderer、输入、Worker、失败/取消和调度回归；25.322秒。
  严格生产 tsc 和修改范围 lint 通过。
- 安装后的 main/legacy 各61/61调度测试通过，运行安装包内真正的 Worker 代码；
  包含三小时模拟时钟、池复用、暂停/seek、串行异步回调及首帧/零点红绿。
- 最终源码三引擎时序24/24，61.623秒；安装产物24/24，57.128秒；均无跳过、
  失败或重试。包括原800ms CPU窗口、首次RAF前阻塞、第0秒启动和异步回调间隔。
  原 readys 查询保持瞬时窗口，候选 first/middle/sentinel 按序显示。
  旧版本用例仍是历史观察或精确缺陷对照，不代表旧版已经修复。
- 最终候选核心下的真实 MediaPipe Mask 组合三引擎3/3，52.106秒。每引擎
  120行全部显示，模型输出分别73/88/49次，含暂停、seek和网页全屏。
  零点补充前还验证了三个新旧核心×三个浏览器9/9；它是中间版本证据，未冒充
  最终代码的完整九组合。没有降低模型尺寸、负载或替换 SDK 内部计算。
- 最终隔离安装为 `.cache/packages/run-n5mxDm`，显式包含核心、Chapter和Danmuku。
  此通用消费者检查的36项运行时、5旧类型/8精确类型模式属于核心/Chapter；
  Danmuku 另由安装后的调度及浏览器检查证明。它不是完整20包CI矩阵。
  main/legacy/ESM 在工作区、docs/compiled和安装目录的字节逐一相等。

最后构建曾出现一次 Windows copyfile UNKNOWN/-4094，磁盘空间充足且文件属性
正常；下一次相同构建成功。保留失败日志，根因未证实，没有为其修改构建逻辑。

## 剩余边界与下一步

原完整 WebKit 的13失败报告原样保留；本提交只关闭其中弹幕首采样缺陷。
Windows WebKit26.6不是物理Safari，真实设备、其余组合问题和远端CI尚不能
由这些本机结果替代。Chromium153.0.8010.12、Firefox155.0的版本见逐案例附件。

下一步继续剩余包验收与版本准备。每包大版本升级仍按已有政策单独实施；
完成全部实施后等待用户指导复盘，不能据此推送或发布。
回退本任务时须一起回退源码、生成产物、测试及状态；原始失败证据继续保留。
