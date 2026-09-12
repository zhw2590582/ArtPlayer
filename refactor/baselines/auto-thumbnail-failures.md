# Auto-thumbnail 失败与原生对照

`PKG-AUTO-THUMB-02` 补64项旧行为回归，八份固定夹具各执行八类问题。
配合01的38项正常/分发契约，成功、失败、切源和销毁有可重跑对照。
这里测试通过意味着 **成功复现旧缺陷**，不是候选已经修复。
生产源码和包版本本步仍未变化，下一步03负责模块和生命周期修复。

## 受控故障

| 情况 | 实际旧行为 | 03应建立的候选断言 |
| --- | --- | --- |
| destroy期间等待Blob | 迟到回调继续写thumbnails，最终URL存活，decoder src/handlers未清 | 取消后不写UI、不创建URL；清理decoder/监听器/本任务URL |
| 切源后旧metadata迟到 | 旧width/旧源覆盖新结果，两个任务URL同时留存 | 代际检查覆盖metadata/seek/Blob，只有当前任务可发布 |
| 重复metadata | 创建三个独立decoder和三个未释放URL | 新任务替换旧任务，并明确保留预览与释放的时机 |
| 编码回调逆序到达 | 完整→空白→半成品倒退，每次撤销前一可用URL | 串行或按代际/序号提交可用帧，不能倒退 |
| toBlob返回null | 先撤销可用URL，再抛错；核心配置仍指向已失效URL | 验证Blob后才替换；失败有归属并释放临时资源 |
| drawImage/toBlob同步抛错 | 异常逃逸，decoder和回调未清 | 出错后停止任务，继续清理，即使个别清理动作再抛错 |
| getContext为null/原生media error | 前者稍后在drawImage抛错，后者没有处理者 | 失败不能静默挂起，不能冒充可用输出 |
| 核心thumbnails setter抛错 | 新URL泄漏，后续帧继续工作 | 保留错误身份、收回新URL、停止失效任务及迟到副作用 |

这些测试控制的是事件/编码回调，媒体对象不是原生解码器。无效数值、重入、跨实例、
监听器安装/清理失败还需03的候选测试补齐，不能从上述八类推断穷尽覆盖。
01中的旧高度参数、异步注册、CJS形状与类型推导问题保持独立处理。

## 三浏览器真实证据

最终9项原生测试覆盖1.0.1 main、1.1.0 main和冻结工作区main，分别运行
Chromium153.0.8010.12、Firefox155.0、Windows WebKit26.6，均无重试/跳过。
使用真实HTTP `/test/pattern.mp4`、原生seek、canvas.toBlob JPEG编码、BlobURL及img.decode
读取像素。仅 **延迟交付原生编码结果** 来确定性验证竞争，没有替换视频帧或Blob内容。
核心一侧是最小宿主替身，故这不是05的新旧核心联调、8082示例或真实Safari验收。

每项原生证据都记录：0/2/4/6秒附近四次seek，五份编码（第一份空白），最终拼图
800×45，四个已填格子的采样点，完整/空白两份回调的交付顺序，destroy前后更新及
URL存活状态。最终URL在destroy后仍存活，迟到空白回调仍写入并撤销前一份URL。
测试结束由测试方清理decoder和URL，明确不是旧插件完成了清理。

### WebKit黑色采样没有作为能力豁免

首次运行6项通过、3项WebKit像素断言失败；后续独立loadeddata+两次动画帧对照显示，
不播放就draw也可能黑色（包括Chromium对照）。这不足以认定平台不支持。
再加入可见、静音的独立video，等待播放前进至少0.25秒后暂停和draw，三个浏览器
均得到彩色原始像素及JPEG；红色静态canvas→JPEG也通过。

WebKit旧插件仍在四个采样点得到黑色JPEG，原生播放对照的原始/编码像素均有颜色。
因此登记`AUTO-THUMB-PIXEL-01`为**旧抽帧路径缺陷**，根因仍需03用解码/帧就绪证据细化。
没有将它归为不可用或跳过，也没有把“返回了JPEG”当成抽帧成功；不以四个采样点
声称整幅图每个像素都是黑色。Firefox/Chromium旧插件的四格均采到彩色像素。

最终测试严格断言这些旧版差异以及原生阳性对照，不是删除像素断言来通过。
三个中间诊断运行（各6通过/3失败）和完整最终9通过报告/附件均独立归档。
未来候选须验证可用像素，不能继承历史黑色结果作为成功标准。
Windows的黑色历史断言明确限制在win32/WebKit，不将该平台现象硬编码成所有系统的
WebKit行为；其他系统接受有正常采样的输出，若仍黑则必须是WebKit并保留同一原生阳性
对照。最后这项平台边界调整经过定向lint和整组9项原生重跑；Linux托管CI本步未执行。

### 03前置实验线索（不是候选验收）

另用独立本地HTTP/原生video探测DOM挂载、loadeddata、播放、帧回调和seek条件。
Windows WebKit26.6的该运行没有requestVideoFrameCallback；脱离DOM的等待/播放
仍产生透明原始像素，挂载后追加seek可出现有效像素。display:none仍透明；
将video渲染为1×1会把正常蓝色采样变成灰色平均值，**不能以非黑判定内容正确**。
visibility:hidden且保留正常尺寸的探测保留了正常采样颜色，可作为03验证方向。
首次seek位置还有偏离目标的记录，需要验证精确帧条件，不能直接把实验代码作为实现。
原始记录在`.cache/auto-thumbnail-readiness-initial.{mjs,json,log}`和
`.cache/auto-thumbnail-readiness-probe.{mjs,json,log}`；实验有明确不支持/超时结果，
不计入上面9项验收，也不据此关闭像素风险。

## 执行与接续

- `yarn test:auto-thumbnail`：64项旧失败对照+38项冻结契约。
- `yarn test:browser test/browser/auto-thumbnail.spec.js`：9项固定历史原生对照。
- Node64项纳入`test:unit`；基线38项由`test:baseline`继续执行。
- 03按入口注册、任务/源所有权、抽帧/编码、错误清理拆分，并保留有效旧调用；
  新增的候选回归先在冻结旧版失败，再在源码/构建产物/原生浏览器通过。
- 04迁严格TS与声明，05最终核心/真实设备，06实际tarball和完整demo，不合并冒充完成。

详见[机器验证记录](auto-thumbnail-failures-validation.json)。本步不推送、不发布。
