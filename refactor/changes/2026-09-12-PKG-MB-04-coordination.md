# PKG-MB-04：VideoShim、事件与主协调器

任务通过完整CI后标记done，并立即以专用本地提交交付。前置shim检查点为9af253a5；本轮将
MediaBunnyEngine.js实际迁移为严格TS，删除其临时声明桥。包内现在16个生产TS模块，
AudioEngine/VideoEngine两个显式临时声明桥不计作实现迁移，分别留给MB-06/05。
文件职责、状态归属、错误传播和继续维护入口见包内ARCHITECTURE.md。

## 行为修复与兼容性

- playback.ts独立管理播放意图和操作完成信号；pause能够阻止pending play或seek恢复，
  新操作使旧结果失效。取消可先结束公开Promise，底层晚结果仍被观察。
- seek完成信号先于可选恢复播放，避免play等待seek而seek又等待play的死锁。
  play-pause-play共享尚未结束的audio resume，只有当前操作启动video和发送play/playing。
- 每次就绪/播放事件前重新检查归属，允许用户在回调中同步切源、销毁或改变播放状态。
  正常play/pause、seek/resume和HLS replacement事件顺序由对照测试保持。
- 两个metadata参与者均完成才发布一次metadata；无轨道容器提前报code 4，信息为
  `Input has no audio or video tracks.`，不再错误地readyState 4。有效媒体行为保持。
- 活动play失败保留原始Promise拒绝并恢复paused；活动seek失败报告一次error并拒绝。
  currentTime同步setter观察无法返回的拒绝，直接调用engine.seek仍能捕获错误。
- HLS旧source查询失败不污染新source，当前查询失败继续拒绝；replacement改变media对象
  后的活动错误也不能被误认为旧查询并吞掉。
- destroy尽力执行所有input/audio/video释放步骤，之后保留首个异常；shim仍以finally
  清理事件和synthetic RAF。事件安静不等于底层解码器晚操作已完全停止。

工厂签名、公开声明、canvas描述符和同步/Promise接口保持。正常事件顺序、方法转发及
描述符对照继续纳入验证。非正常行为差异是以上明确的竞态/错误修复，不宣称逐字节行为不变。
旧createTimeout帮助方法保持原样，受管理的load路径不使用它；不要称所有手动调用的内部
帮助方法也都具备自动取消。

## 验证

新增40项协调器测试，使用实际构建代理、受控异步音视频操作和实际SDK解析输入。
同一断言对adba8a3d冻结main为8通过/32失败，候选全部通过。包专项108项通过。
main与legacy各72项通过，其中68候选产物断言、4冻结正常事件对照。三格式构建通过。

初轮main产物测试有一条断言把新source合法waiting/loadstart误当作旧replacement事件。
已缩小到旧seek/readiness结果并保留完整禁止列表，重新运行main/legacy均72通过；未修改
生产代码来消除新来源合法事件。历史同断言仍32失败，修复回归证据没有被放宽掉。

浏览器报告及整个results归档后记录到mb-coordination-validation.json。39项候选检查区分
12真实播放、9原生Stream取消、9synthetic RAF、6Windows WebKit能力对照及3无轨道拒绝。
WebM在Chromium/Firefox另验证真实播放的play回调内pause后不会再发playing。
此断言附属于现有播放用例，不增加测试数量。长播放、听觉输出和AV同步仍为MB-09。

## 后续边界

MB-05/06继续实际视频帧、解码器迭代器和Web Audio调度迁移；两处声明桥必须移除。
MB-07继续HLS控件拓扑与并发选轨；MB-08完整公开类型/工厂兼容矩阵；MB-09/10完成组合、
长播放、demo、真实安装包与许可通知。MB-LIFE-01/MB-READY-01保持open并更新已修复范围，
既有轨道但不支持codec的路径仍需要解码器验证。此任务不构成npm发布验收。

最终完整CI1269项（1114单元+14工程+141基线）通过，另44重复契约；306生产TS。
所有记录的源码/测试/产物及报告哈希已核验，三格式docs/compiled与dist一致。ESM默认工厂
及实际源码名称artplayerProxyMediabunny保持；首次临时检查误写大小写，已按实际入口修正。
回退本任务可revert专用提交；旧shim检查点9af253a5与更早adba8a3d基线仍可对照。
未推送、打tag或发布；下一项PKG-MB-05处理视频迭代器、晚帧与seek释放。
