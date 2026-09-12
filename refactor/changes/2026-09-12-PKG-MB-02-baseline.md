# PKG-MB-02 媒体、事件与资源基线

此记录接续63c8938d检查点。完成状态以[验证记录](../baselines/mb-behavior-validation.json)和
独立完成提交为准；历史负例通过表示问题已经复现，不表示生产实现已修复。

## 浏览器覆盖

两个实际npm proxy 1.0.0/1.2.0，三引擎，共42项：

- 6项完整核心5.4.0组合：4次真实MP4播放/像素/暂停成功，2次Windows WebKit能力失败对照。
- 36项真实SDK输入，使用实际核心utils/config与受控ArtPlayer宿主：WebM、MP4 Blob、4096字节分块
  ReadableStream、纯音频、HLS、无轨道容器。受控宿主用于隔离核心自动重连，不模拟浏览器解码器。
- 后36项中16项完成真实输入播放、暂停、精确seek和恢复；10项缺失WebCodecs/Web Audio构造器；
  3项1.0.0流锁定错误，3项1.0.0 HLS不支持；4项无轨道容器错误地声称ready的历史行为。
- 总计20次真实播放成功、12次环境能力对照、6次历史输入失败、4次无轨道就绪行为；不能称42次播放成功。

1.0.0的ReadableStream同时被旧音/视频输入读取，三个浏览器报精确的stream locked错误；
1.0.0的HLS错误为`Input has an unsupported or unrecognizable format.`。
这些在1.2.0已正常，候选必须保持修正。Windows WebKit的构造器缺失单独判断，不能把同一环境
中的历史stream/HLS错误都归为环境问题，也不能将Windows WebKit结论扩大为全部Safari。

## 就绪、seek、HLS与时钟

就绪顺序和次数使用逐事件断言：1.0.0 WebM/Blob初次有两个loadeddata，seek又发一次；1.2.0无该重复。
视频为空但音频存在的正常容器单独验证；无任何轨道的容器由仓库MP4移除trak后确定性生成，
记录父文件和派生文件哈希，不下载不明媒体。两代均readyState=4且尺寸0，1.2.0的loadedmetadata
发两次、1.0.0一次。MB-READY-01保留后续协调修复责任。

seek测试观测公开currentTime setter调用实际engine.seek的Promise，不替换实现；验证目标时间、
seeking/paused和精确事件序列。HLS使用既有哈希校验的本地12秒样本，实际切到90p、法语音轨，
核对manual模式，再切回MP4并确认HLS状态null。真实控件/设置DOM、并发选轨和组合长播仍由MB-07/09验收。

纯音频/HLS检查实际AudioBufferSink和已排程Web Audio节点。视频恢复播放时观测实际CanvasSink
迭代器的frame timestamp和真正drawImage时的audio.currentTime，保留原始样本与偏差统计。
这是短时SDK时钟基线，不能当作声学音画延迟、长期漂移或各设备音频输出都已验证；对应后续MB-06/09。

settled playback完成后验证创建的AudioContext关闭、所观测代理RAF队列归零。
不据此宣称所有内部资源或pending操作都已释放；后者有明确失败基线。

## 生命周期与Range

24项Node测试使用三份实际历史主产物、原始engine方法，控制外部Promise、音频动作和timer：

1. destroy后晚load失败仍回写error/networkState，waiting/loadstart两个timer仍执行。
2. pending play遇到pause，晚返回仍video.start并发play/playing，paused却为true。
3. pending play遇到destroy，晚返回仍video.start并发事件。
4. audio.play拒绝后engine.paused保持false，第二次play不再重试。
5. pending seek遇到destroy，晚返回仍seeked并恢复play。
6. 成功load与destroy都未回收loadTimeout timer；已settled的race继续观察其晚拒绝。
7. 正常超时仍保持code4/Load timeout，不被底层更晚的拒绝覆盖。
8. HEAD Range预检拒绝缺失响应头、网络异常警告后继续；不设置engine.error；1.0.0仍预检HLS，1.2.0跳过。

前6组共18项复现历史问题；后2组6项保留正常/版本边界。不会将受控宿主发事件直接等同于
完整ArtPlayer核心destroy后用户仍收到事件；也不会用模拟音频动作宣称真实音画同步通过。

## 检查与后续

```sh
node --test test/mediabunny.test.js
yarn test:browser test/browser/mediabunny-inputs.spec.js test/browser/mediabunny.spec.js
yarn ci:check
```

早期30项输入实验中的四个Chromium/Firefox 1.0.0错误已保留完整报告、trace及截图，随后才建立
精确历史负例。各次浏览器report和整个results目录分别归档，未覆盖失败证据。
下一步MB-03处理input、Range和取消，MB-04处理主状态/事件协调，05/06处理帧及音频调度，
07处理轨道/控件。这些缺陷均未在本步修改生产代码；工厂类型待决项仍只影响Canvas/Ambilight。

最终CI1185项（1030单元+14工程+141基线）通过，另44重复契约；290生产TS严格检查。
新增test:mediabunny并将24项加入test:unit，补齐首次CI未包含该文件的入口遗漏后重跑全量CI。
17个冻结生产/demo/产物和五个最终测试文件哈希已复核；本任务独立本地提交。
