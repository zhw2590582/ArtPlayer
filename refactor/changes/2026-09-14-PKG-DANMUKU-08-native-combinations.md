# PKG-DANMUKU-08 原生画中画与 Mask 源码组合检查点

本任务仍 doing；这是组合覆盖的增量，不是完整弹幕或发布验收。

## 改变与原因

新增 `test/browser/danmuku-dpip.spec.js`，在新旧核心中让播放器先播放，再通过
真实用户点击打开系统 Document PiP 窗口。每个播放器连续打开两次窗口，在窗口中
按媒体时间投放弹幕，检查可见文本、实际尺寸、绝对定位、图层及热力图的 document
归属、真实 Worker 回复和复用。分别以插件关闭、原生关闭、播放器销毁结束。
结束时核对 Worker 只终止一次、调度 RAF/operation 清空、设置/弹幕节点和占位
清零；普通关闭后检查原父节点恢复且媒体时间继续前进。

没有用 iframe 模拟窗口。实际 API 不可用的场景单独输出 unavailable，不能计入
播放通过数；本机 WebKit 如实保留该限制。此测试不声称浏览器后台节流或物理设备
性能已经通过，也不把两次开窗当作两次播放器重新装卸。

`danmuku-mask-native.spec.js` 原默认读取 Mask 与 Danmuku 已有 dist，现在默认并行
构建当前源码 UMD；显式 ARTPLAYER_MASK_ARTIFACT / ARTPLAYER_DANMUKU_ARTIFACT
可分别选择产物，文件不存在直接失败。附件记录两个实际输入与摘要。修正的是测试
的输入来源，不修改生产逻辑，不宣称其他仍默认读取 dist 的测试都已完成来源审查。

包内 Danmuku 与 Mask 架构文档同步了入口、覆盖及限制。没有增加依赖、公开类型、
运行时 API 或 DOM/CSS hook。两包正常生产构建重新执行后，产物与原跟踪内容相同。

## 实际验证

Node24.21.0、Yarn1.22.22、Windows，Chromium153.0.8010.12、Firefox155.0、WebKit26.6。
报告指纹、逐例输入和回收结果见[机器证据](../baselines/danmuku-combination-checkpoint.json)。

| 范围 | 结果及含义 |
| --- | --- |
| 首轮 Chromium 原生 PiP | 4通过、2失败；失败为销毁事件的测试预期错误 |
| 更正后的源码 PiP | 18项退出0：12项原生窗口播放/清理，6项WebKit API不可用 |
| main 两插件构建产物 PiP | 18项退出0，同上；新增可见文本断言和窗口截图 |
| legacy 两插件构建产物 PiP | 18项退出0，同上；新增可见文本断言和窗口截图 |
| 当前 Mask + Danmuku 源码、真实本地模型 | 9项通过，三核心组合 × 三浏览器，含暂停/seek/网页全屏 |
| 新增/修改浏览器文件 ESLint | 通过 |
| Danmuku、Document PiP 正常三格式构建 | 通过；现有跟踪产物未变化 |

三个 PiP 报告各有24次原生开窗，但不能叠加成独立播放器样本。没有跳过或重试。
源码 PiP 报告在额外可见文本断言与截图之前；main/legacy包含这两项增强。
已人工查看 main 的原生窗口截图，视频与顶部弹幕可见，发送栏和进度控件布局正常。
截图在 `refactor/.cache/danmuku08-native-window.png`，原附件保留在 main 报告中。

首轮2个失败不能删除：原先预期 destroy 时还有最后一个 document-pip=false。
现有 Canvas 原生 PiP 测试和 Document PiP 生命周期契约均规定销毁后不再发公开
关闭事件；据此将销毁结尾明确断言为 [true,false,true]，普通关闭仍严格断言
[true,false,true,false]。资源释放检查全部保留，没有为了通过而增加合成事件。

真实模型检查继续保留启动期时间窗口的诊断。断言的是模型就绪之后按媒体时间
显示的行，并非启动阶段完全不丢行，也不是私有 GPU/WASM 完整释放证明。

## 接续与重跑

PKG-DANMUKU-08仍需补旧发布插件/新旧核心组合、系统全屏、重复播放器装卸，
并结合07基线比较组合负载性能。09继续最终安装分发、示例、文档及 Worker 入口。
与Mask、Document PiP关联的设备/后台/模型内部资源门槛不由本检查点关闭。

源码入口：`yarn test:browser:source test/browser/danmuku-dpip.spec.js --workers=2`；
模型组合：`yarn test:browser:source test/browser/danmuku-mask-native.spec.js
--grep 'actual model and Danmuku' --workers=2`。产物PiP运行同时指定
ARTPLAYER_DANMUKU_ARTIFACT 和 ARTPLAYER_DPIP_ARTIFACT；每次运行前归档前一份报告。
正常构建分别使用 `yarn build artplayer-plugin-danmuku` 与
`yarn build artplayer-plugin-document-pip`。

本检查点独立本地commit，提交审计完成后再继续下一批；无push、部署或发布。
回退本检查点即可恢复测试输入与覆盖，生产运行时没有变化。
