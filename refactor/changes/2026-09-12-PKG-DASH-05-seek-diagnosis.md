# PKG-DASH-05：暂停 seek 停滞的 SDK 根因

起点 `a9cf50bc`。本批没有修改生产源码、公开声明、依赖或产物。DASH-SEEK-01 从
“偶发且来源未知”推进到可独立复现的 SDK 4.5.2 调度缺陷；**风险仍 open**，不能把诊断
补丁的通过当成实际发布 SDK 或本项目的修复。DASH-05 继续 doing。

## 证据链

1. 给现有真实 SDK 测试增加原生 SourceBuffer 观测。原生 addSourceBuffer 仍以相同 this、
   参数执行一次，返回原对象；额外监听 updateend 并读取缓冲，不改写媒体时间或片段。
   首次 10 项中 9 通过、1 失败，再次复现新核心/已发布插件的 6 秒停滞。
2. 失败时视频 SourceBuffer 与 video.buffered 均止于 5.999999 秒，排除 Chromium 上
   “SourceBuffer 其实已覆盖 6 秒”的猜测。SDK 仍保留暂停前约 2.975 秒的视频缓冲指标。
3. 加入实际 SDK seekTime、timeupdate、bufferLevelUpdated 和处理器状态：10 项中
   8 通过、2 失败，新旧核心搭配发布插件均失败。SDK 收到的目标为 6；视频 hasTarget=false、
   pruning=false、complete=false，旧缓冲量约 2.96 秒；seek 后没有后续时间/缓冲更新。
4. 原生 SDK 对照不创建 ArtPlayer，只使用同一媒体、相同 SDK 设置和选择顺序。等待音轨
   渲染完成，在约 3 秒暂停，并观察半秒内没有时钟/追加事件，再 seek 到 6 秒。
   实际 npm 4.5.2 在 Chromium/Firefox 都失败，5.2.1 两边通过。该等待用于建立真实暂停
   稳态、排除仍排队的进度更新，没有延长恢复超时或改变目标。
5. 仅在上述断言失败后，启用诊断开关注入一次原生元素 timeupdate：SDK 4 视频指标立即
   从 2.81/2.748 变成 0，随后请求下一视频片段，buffered 延长到约 8 秒，播放越过 6.2。
   原测试仍记为失败，合成事件没有进入生产实现或默认验证路径。
6. 读取校验过完整 npm 归档的 debug 成员：4.5.2 的 BufferController.clearBuffers 在
   ranges 为空时直接 resolve；5.2.1 同一分支先调用 _updateBufferLevel。
   4.x ScheduleController 以缓存指标是否小于目标决定请求；失败时视频指标约 2.8 而
   目标为 2，即使当前位置实际缺帧也不会下载。无后续 progress/timeupdate 时形成停滞。
7. 保持 SDK 4 debug 字节不变的原生对照 1 通过/1 失败；仅在空裁剪分支增加
   _updateBufferLevel 的诊断补丁，原生及新旧核心/插件组合 10 项全部通过。
   这是因果对照，不是正式 SDK 的发布准入。

Firefox 的视频范围恰好止于 6，SDK 的包含端点判断返回 true，但解码下一帧仍需下一片段。
该路径的 pruneBuffer 也经过空 clearBuffers；相同缓冲量刷新解释了两引擎的恢复。
这批证据说明是 SDK 调度所需数据未更新，不是 ArtPlayer 新核心修改了 seek 目标；历史
Firefox/候选插件失败仍保留，不能据此声称所有其他 DASH 风险已经解决。

## 测试入口与隔离

默认 `yarn test:browser test/browser/dash-sdk.spec.js` 仍加载原始固定 npm min 产物。
新增 `test/browser/dash-buffer-observer.js` 保存浏览器缓冲、SDK 指标及可用处理器状态。
SDK 内部诊断 getter 不可用时只标记 unavailable；不通过修改 SDK 来模拟这些状态。
每页新建后安装观测器，页面关闭释放资源，不复用到产品 demo。

原生复现可用 `--grep 'native SDK' --project chromium --project firefox --trace on`。
诊断环境变量（用完应清空；每次运行前后归档共享报告和 traces）：

| 变量 | 值与用途 |
| --- | --- |
| ARTPLAYER_DASH_DIAGNOSE_STALL | 1：已失败且停在 6 秒时，保存合成时间更新的前后状态，不改变失败结果 |
| ARTPLAYER_DASH_DIAGNOSTIC_SDK | none/未设置：原始 min；upstream4：原始 SDK 4 debug；bufferlevel4：单分支诊断补丁 |

debug 成员来自完整性校验后的 npm 归档；补丁仅在内存替换唯一匹配的完整分支，匹配数
不是一就报错。输入附件记录原始/有效代码 SHA256、member、模式和 acceptance=false。
不得在正式报告中省略诊断模式，不得把补丁归档冒充上游包，也不得将合成事件作为产品修复。

过程中一次括号笔误导致测试发现失败，日志保留；修正语法后继续取证。加入 seekTime 的
中间运行 10 项通过，但没有以它关闭风险。全部失败、通过和对照的报告/trace 分别冻结，
见 [机器证据](../baselines/dash-seek-diagnosis.json)。本地缓存不提交，测试和摘要可重跑。

## 后续与回退

旧 SDK 合法调用仍须兼容；不能要求用户升级 SDK 后才算重构完成。后续应评审隔离且不改变
调用方媒体事件/SDK 所有权的兼容处置，或正式记录第三方边界与发布处理。在此之前，风险和
设备/完整分发门槛保持开放。不得在核心伪造 timeupdate、偏移 seek 或全局放宽测试。

局部 lint、既有 SDK/媒体来源测试及计划/风险链接校验用于本批验证；没有改生产代码，
不重复宣称完成全项目 CI 或 114 项完整浏览器验收。回退本批仅涉及诊断测试与文档，
生产产物与 a9cf50bc 的指纹保持一致。
