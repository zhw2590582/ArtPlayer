# PKG-ASR-05 首次媒体失败与恢复

来源 HEAD：`9cf4a58480118f92b1ae58e5d8ae6664961d1f70`。接续任务10的播放中错误
修复，验证此前没有覆盖的首次 metadata 之前失败；任务05保持 doing。

## 新增验证

`asr-initial-error.spec.js` 从构造起就使用不可解码的本地 HTTP JSON 内容，等待
原生 MediaError code 4，再通过真实按钮调用 play，确认原生 NotSupportedError
返回给调用方。播放器未 ready、零 Context、零识别回调、没有字幕。

按 default/capture 和核心 5.3.0/5.4.0/候选拆成两个独立用例：

1. 在失败状态下调用公开 stop、destroy，始终不创建音频资源并清理播放器 DOM。
   这部分不要求 WebAudio，所以 Chromium/Firefox/Windows WebKit 都实际执行。
2. 同一实例切换到首个有效 AAC 后，真实按钮播放、至少三块非零 PCM、字幕更新，
   一个 Context 从 running 到最终 closed。缺少 WebAudio 时仅跳过此恢复用例，
   不把已完成的失败路径观察算成音频恢复通过。

没有注入 native error、模拟 AudioContext/PCM，识别回调只把实际 PCM 统计并返回
本地测试文字。没有调用外部识别服务或麦克风。该用例证明首次失败的有限路径，
不声称覆盖每种网络中断、codec、设备或错误时序。

## 安装与维护

本次运行代码、类型、根依赖/锁均未改，复用任务10的已隔离安装 `run-gTeZ8R`。
main/legacy 两份映射经既有验证器检查当前源码、构建输入与 tarball 字节身份，
没有缺包时退回源码。没有重新打包或把这次新增 ARCHITECTURE 文字说成已包含在
旧安装归档；发布候选最终仍需重新打包。源代码一致性与完整包内容新鲜度是两件事。

CI installed 清单新增该文件，ASR 共九个浏览器文件；清单用例保护它不能被遗漏。
包内架构说明和环境矩阵 ASR 行同步，避免初始 BASE-08 的“待音频验证”描述被
当作当前进度。其他行仍按矩阵开头的时间范围说明读取，不在本轮代为宣称完成。

## 结果与限制

Node 24.21.0、Yarn 1.22.22；源码与 installed main/legacy 的实际报告见
[机器证据](../baselines/asr-initial-error-validation.json)。每轮包含18项首次失败
清理和12项实际恢复，另6项 Windows WebKit 恢复因缺WebAudio跳过。浏览器为
Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6。无重试，没有新生产缺陷。

定向 lint、docs-tools 类型、6项清单回归和严格工具链通过。本次不重复上一任务
已通过的234项生产专项，也不把重复使用安装归档算作一次新打包。原生媒体请求
取消/错误日志保留，不把测试通过写成所有请求都正常完成。

执行 `yarn test:browser asr-initial-error.spec.js --workers=1`；指定经验证的
`ARTPLAYER_BROWSER_ARTIFACTS` 则运行安装模式。源码/安装 scope 的其余规则不变。
没有推送或远端CI执行；设备、外部调用方服务、完整分发和发布复盘仍归既有任务。
回退只撤销新增测试、清单项和文档，不回退任务10的媒体错误修复。
