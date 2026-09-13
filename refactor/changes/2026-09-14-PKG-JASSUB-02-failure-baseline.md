# PKG-JASSUB-02 行为、错误与原生渲染基线

本步骤建立迁移前基线，生产源码、第三方文件和资源未修改。新增的历史失败
断言证明问题存在，不能当作修复通过；后续 03/07 负责修复，05 完成组合验收。

## 受控行为

七份真实发布/冻结实现各九个失败或保护场景，共 63 项；既有工厂、入口和
来源测试加上事件时钟与切换字幕轨道，`yarn test:jassub` 联合 120 项通过。
实际运行 vendor JS，DOM/Worker/RVFC 为受控平台，以下六类问题均已复现：

| 问题 | 具体结果与后续责任 |
| --- | --- |
| 直接 destroy 再宿主 destroy，或直接重复 destroy | 二次移除容器抛错；03 修宿主重复调用，07 保证公开实例重复销毁 |
| setVideo 切到其他父容器再 destroy | 从新视频父节点删除旧容器失败，Worker 未终止、七监听器保留；07 |
| 自定义 canvas | vendor 已创建 Worker，adapter 访问不存在的 _canvasParent.style 抛错，尚未注册宿主清理；03 |
| Worker 构造抛 SecurityError | 原错误保留，但先前创建的容器和七监听器遗留；07 |
| setVideo 后旧 RVFC 到达 | 实际已排队的旧回调以 time=123 驱动 currentTime=9 的新视频，再建立第二条回调链；07 |
| 事件模式 ratechange | 直接 setRate(2) 正常；媒体 ratechange 却将 Event 当作 rate 传给 Worker，未使用 playbackRate=1.5；07 |

测试还保护已有正常行为：ready 前 destroy 会终止 Worker 并去监听器，虽然测试
能观察到终止后仍尝试发 init；Worker error 原样分发，宿主销毁仍能清理；
destroy 后遗留的单个 RVFC 到达会退出且不再排队。不能将这些观察夸大成
“终止后 Worker 仍实际执行”或“销毁后永远循环”。受控 removeChild 抛的是
ERR_ASSERTION，不冒充原生 DOMException；rate 错误负载尚非真实 clone 异常证据。

正常事件用例验证时间偏移、playing/seeking 状态，以及同步 setTrackByUrl、
setTrack、freeTrack 的实际 Worker 消息顺序。保留公开 instance 与返回值。

## 真实浏览器

新 `jassub-native.spec.js` 加载真实 npm 1.1.0 主产物、原生 Worker、本地固定 WASM
和 Liberation 字体，使用两条自编 ASS 字幕及实际视频。明确设置
offscreenRender=false 以读取真实字幕 canvas 像素，其他默认路径未冒充验收。
原生 Worker 子类只记录 postMessage/message/terminate，仍委托浏览器原实现。
断言初始非透明像素、seek 后不同字幕像素、网页全屏尺寸和正常单次销毁。

Chromium/Firefox 各三个核心组合通过：候选、实际 npm 5.4.0、实际 5.3.1-beta.1。
截图确认字幕已由真实 WASM 绘制。首次 Chromium 三例失败是测试服务器未提供
application/wasm，补齐 MIME 后通过；没有改 SDK、替换编译器或放宽等待时间。

Windows WebKit 26.6 的三个默认 onDemandRender 场景均没有可见字幕。保留的
进一步观测显示：资源 200、Worker ready，但媒体已到 6.4992094 秒仍只有 init/
canvas 消息，没有 demand 请求；canvas 为零可见像素。显式设置旧选项
onDemandRender=false 的候选核心诊断通过。这个诊断不能替代默认路径验收，
也不足以断言所有 Safari/设备不支持 RVFC。新增 JASSUB-NATIVE-FRAME-01，后续
07/05 继续验证原因与兼容处理。默认 WebKit 用例保持失败，不加 skip、重试或
扩大超时。02 的完成只表示已建立成功/失败基线，不表示全浏览器绿色。

## 维护与验收边界

```sh
yarn test:jassub
yarn test:browser test/browser/jassub-native.spec.js --workers=1
```

历史失败测试进入既有 baseline glob 和 test:jassub。设置
ARTPLAYER_JASSUB_FAILURE_REPORT 可输出详细受控观察；默认测试不写报告。
原生诊断可设置 ARTPLAYER_JASSUB_ON_DEMAND=false，报告保存该选择。按不同运行
分别归档 report/results，等待进程终态后再跑下一轮。机器报告包含成功、失败和
诊断结果，见 [验证](../baselines/jassub-failures-validation.json)。

自有 adapter 修复与 vendor 方法修复必须分开。新增 PKG-JASSUB-07，在 03 之后、
05 之前处理有证据的 vendor 生命周期/时钟问题；保留原文件及来源基线，任何
实际补丁都必须单列差异与候选正例，不得把未修改 vendor 宣称为已修复。
完整设备、默认 OffscreenCanvas、真实资源失败、CSP、倍率、长时播放/内存和
VideoFrame/ResizeObserver 回收仍属后续验证。源码/类型/发布门槛全部保留。

本次新增测试及测试服务器 MIME 修正，定向 lint、计划和风险检查通过；完整
浏览器流程仍有上述 WebKit 失败，不宣称 CI 或后续组合验收通过。
没有新依赖、锁文件或生产产物变化。独立本地提交，不推送或发布；回退本步骤
仅移除新基线/测试与 MIME 支持，生产行为保持原样。
