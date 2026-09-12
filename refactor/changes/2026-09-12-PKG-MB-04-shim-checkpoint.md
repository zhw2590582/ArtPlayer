# PKG-MB-04 检查点：VideoShim 与事件资源

任务仍doing；本检查点不是整个主协调器迁移完成。进入04前的实际源码和main归属为
adba8a3d，冻结于[接续基线](../baselines/mb-coordination-source.json)。

VideoShim/EventTarget转为strict TS，抽出shim-values纯值与shim-frames资源模块，
engine-types描述临时协调器边界。MediaBunnyEngine.d.ts仅暂时连接JS协调器；后续必须
由实际MediaBunnyEngine.ts替代，不能把这份声明当作实现已类型检查。
生产TS增至11个（全项目301），仍有五个本包JS文件。

## 已复现并修正

1. destroy后保留的synthetic RAF仍会调用用户回调；现回收所有本实例ID（含0），
   即使已出队的回调函数晚执行也无副作用。销毁后不再分配新的RAF。
2. destroy未释放事件监听器，当前emit的后续监听器还能执行；现terminal状态清空Map，
   并阻止当前派发后续回调。正常forEach动态数组语义、重复listener和首次删除保留。
3. engine.destroy抛错时事件/RAF仍残留；现frame状态先关闭、事件由finally关闭，
   原异常仍向调用方传播；再次destroy不重复调用已失败的清理。

Canvas和shim的own/prototype属性顺序、描述符、每次读取重新绑定的方法、原生canvas方法优先，
以及play返回原Promise、pause/load同步void等都有实际旧/新对象对照。
初始volume不clamp、setter强制转换/取消mute、历史noop setter、synthetic TimeRanges和
presentedFrames=0继续保留。资源表使用WeakMap，不新增被复制到canvas的内部字段。

## 检查范围

同一12项shim测试在adba8a3d实际main上9通过/3失败；候选12通过。
四组正常契约同时比较原冻结1.2.0与候选；本轮共68项包专项，包含原24历史、20加载和12输入。
新增用例接入test:unit与test:mediabunny。三格式构建，main/legacy各32项加载+shim检查。
浏览器在实际RAF上检查正常callback、destroy和另一实例不受影响；不把synthetic callback当作解码帧。
最终验证及产物哈希见[检查点证据](../baselines/mb-shim-checkpoint.json)。

## 接续工作

立即接着04的主协调器：重复/无轨道就绪、错误后的metadata回写、play拒绝状态恢复、
pending play遇到pause/destroy、连续seek及resume意图。事件关闭只消除了销毁后的事件出口，
不证明旧Engine没有继续video.start、audio.play或改状态；不能用事件已经静默来掩盖这些未修复问题。
原MB-LIFE-01/MB-READY-01保持open。后续05/06仍处理底层帧与音频操作。

包内ARCHITECTURE.md同步当前地图，回退本检查点commit即可恢复04前shim；不要改动历史冻结输入。
本地checkpoint不计为任务完成，不推送、不发布。

最终完整CI1229项（1074单元+14工程+141基线）通过，另44重复契约；301生产TS。
main/legacy各32项中28项实际候选断言、4项冻结正常事件对照。39项浏览器无失败/重试/跳过，
其中12播放、9Stream取消、9synthetic RAF、7能力对照及2未关闭trackless就绪。
全部最终源码/测试/产物及报告哈希已核验，docs/compiled与dist三格式逐字节一致。
