# PKG-MB-09 检查点：真实 Document PiP 组合

本任务保持doing；本检查点只完成原生画中画的首组组合验证，不代表长播放、设备与全部组合验收。
执行环境为本机Windows，Playwright Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6。
原生行为按实际API探测与运行结果记录，不由浏览器名称猜测，也不将WebKit称为真实Safari设备。

新增mediabunny-dpip.spec.js使用固定main产物、实际发布核心/候选核心和Document PiP产物。
从真实button click调用requestWindow，未覆盖API，未使用iframe代替窗口。确认独立Window与
Canvas/播放器节点迁移，迁移后实际drawImage及媒体时钟继续前进。

矩阵为2个核心×video-only/HLS音视频×插件close/原生window.close/destroy×3个引擎，共36项。
Chromium/Firefox共24项完成真实窗口/Canvas播放；HLS另验证实际AudioBufferSourceNode调度，
插件close场景在PiP内切换到90P与French音轨后还原。关闭还原验证原parent/document、同一Canvas、
占位符清零和原生窗口关闭；销毁验证引擎关闭且不再向销毁后的ArtPlayer发document-pip=false。
WebKit共12项记录为Document PiP API不可用，未创建播放器或计作媒体播放成功。

此前dpip-helpers.js仍是受控requestWindow与真实iframe DOM测试；本文件有明确独立作用，
不能用本轮少数组合替换那些异常时序/部分setup失败回归，也不能把旧iframe证据重新标为原生。
首轮12项（8原生/4不可用）及扩展36项均保留report.json和整个results目录。

验证命令：设置ARTPLAYER_MB_ARTIFACT和ARTPLAYER_DPIP_ARTIFACT指向各包已构建main后，
运行`yarn test:browser test/browser/mediabunny-dpip.spec.js`。源模式也能运行，但报告必须记录
实际code hash和实施来源；产物验证不能默默降级为源构建。新用例已由默认浏览器文件发现机制纳入。

结果、产物/测试哈希、核心来源和浏览器版本见[原生窗口证据](../baselines/mb-native-pip-checkpoint.json)。
当前没有生产源码或依赖变更。最终完整CI1418项和44重复契约通过，324生产TS；台账失败与修复均保留。

## 接续范围

- 生成可重复长AV媒体，独立运行真实持续播放与1×/2×、seek/quality/audio切换，记录逐帧与音频时钟偏差。
- 跟踪在用音频节点、迭代器/RAF与destroy后清理，避免测试自身持有所有历史节点造成伪内存增长。
- 验证PiP opener不可见、重复开关、恢复播放与更多键盘/焦点组合；本轮opener始终visible，不作后台节流保证。
- 原生视频、Canvas proxy与完整Document PiP插件验收仍归PKG-DPIP-05，不能由本轮只测MediaBunny宣告完成。
- 真实Safari/设备支持矩阵、长播放和完整分发/许可仍未关闭；MB-CAP-01、MB-LIFE-01、MB-LICENSE-01保持open。

FFmpeg已在D:\ffmpeg\bin\ffmpeg.exe可用，长媒体应由明确命令生成并保存版本/参数/哈希，不能把短视频
若干次seek冒充长时间持续播放。本检查点不发布、不推送，不计作任务完成。

## CI台账修复

首轮完整CI在风险检查失败：MB-08验收后更新状态时，遗漏了MB-TYPE-01和MB-READY-01
的resolutionEvidence/resolutionRationale。原关闭事实及证据不变，补齐台账要求字段，
保留失败日志mb09-native-ci.log，不放宽验证器。今后任务/风险状态与最终文档更新后，
还须执行plan --check、risk-register --check及风险测试，避免只检查状态更新前的快照。
