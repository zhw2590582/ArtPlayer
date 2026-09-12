# PKG-AUTO-THUMB-03 隐藏解码元素检查点（doing）

新增video.js，独立拥有内部video的挂载、静音、可访问性和移除。使用固定定位、
visibility:hidden及metadata时锁定的原始尺寸；不调用play，不用display:none或1px缩放。
extraction继续拥有原来的起点采样公式和串行编码。普通全局video样式不会把内部解码
元素缩成1px；初始化取消、插入前后同步重入、插入失败及load/pause异常也回收DOM。
公开参数、结果、Promise时序和声明未改。正常构建再生dist和docs副本。

构建main产物的验证又复现一次后续格偏移约1.6秒，失败报告独立保留为
auto-thumbnail03-render-browser-verified-main.json（该文件名虽含verified，结果仍是
14通过/1失败）。因此继续修复seeked归属：仍在seeking时忽略旧事件，绘制前检查有限
currentTime及目标50ms容差；偏离只重试原目标最多3次，再失败清理。新增4项回归覆盖
错时重试、重试界限/旧预览保留、seeking旧事件和时间getter销毁重入。最终证据使用
browser-timing及unit-timing文件，不把这次失败当成通过或靠重复运行覆盖。

新增5项单元边界：此前检查点运行29项为25通过/4失败，新实现29通过。第五项load抛错
本来就能通过，此次加强其DOM所有权断言。不能将29项都称为本次新修复。

真实浏览器新增两种像素样本：时间颜色片段及空间颜色图案。时间片段8秒/30fps，首帧
独立紫色，随后红、黑、蓝、黄；生成脚本、FFmpeg版本、参数、SHA256保存在媒体清单。
重新生成字节完全一致。解码前raw alpha区分“没有画出来”和合法黑画面，实际JPEG解码
验证颜色及空间差异，记录采样时间。9项原生生命周期还增加DOM脱离断言。

**这是局部修复，03和AUTO-THUMB-PIXEL-01保持未完成。** 新的像素验收只覆盖五格中的
第2-4格（从0编号）；前两格完整记录为诊断数据，不能当成通过。初次广泛断言的报告
保留在auto-thumbnail03-render-browser-source-initial.json：发现Firefox早期draw可能
透明，Windows WebKit的早期seeked可能时间回退。pattern样本的JPEG中心在色块交界处
存在色度混合，末段本身也改变颜色，因此不能错误地要求每一格中心始终纯蓝。
当前像素断言使用已知阶段的颜色优势和空间差异；这不意味着早期帧问题被修复。

独立诊断还证明：WebKit跳回0秒可能保留上一张图；两次rAF、先跳远再返回、fastSeek及
playing后立即pause均未稳定解决。唯一紫色首帧在Chromium/Firefox的0秒出现，而本机
WebKit可能在约0.04秒才读到；不能简单把所有浏览器偏移0.04秒，也不能用均匀红色片段
掩盖一帧的时间错误。相关原始实验摘要保存在本检查点验证记录，物理Safari仍未验证。

后续继续首帧和早期frame-ready调度，保持任务取消及URL归属，再完成资源预算/其余
边界；04转严格TS，05/06做核心组合、设备、真实安装与demo/editor。没有新依赖、
发布、推送或任务完成数变化。提交仅是可回退的03检查点。

见[验证记录](../baselines/auto-thumbnail-hidden-renderer.json)。

最终33项候选回归：此前检查点25通过/8失败，源码/main/legacy各33通过。最终源码原生
连续三轮45项，main/legacy各15项，共75项通过，无重试/跳过/未处理页面错误。完整CI1799项
（1553单元+14工程+232基线）及339生产TS通过；另核对4种实际bundle入口与无DOM异步
注册，尚不代表安装tarball。三份产物与docs副本逐字节相等，03仍doing，像素风险仍open。

后续实验auto-thumbnail-frame-callback-probe在loadeddata后对每次seek等待原生帧回调，
Chromium/Firefox隐藏和普通元素都能读到五格预期颜色，包括独立紫色首帧；本机WebKit
没有requestVideoFrameCallback。这尚未接入生产，下一步要处理回调归属/取消/失效/
超时及无该API浏览器的可靠路径，不能把实验结果提前标为修复。
