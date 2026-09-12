# PKG-MB-08：完成类型迁移与解码能力边界

入口与公开类型已在5e28dfee检查点落地，本轮完成剩余能力/就绪问题。
实际接续源码及main冻结于[能力基线](../baselines/mb-capability-source.json)。
完整CI与最终证据核对通过，任务标记done并立即专用本地提交。

## 问题与修复

实际SDK解析出的video-only/audio-only输入，在codec=null或canDecode=false时，旧引擎把
两端都降级为空轨道，却仍发布loadedmetadata/data/canplay/through并进入readyState 4。
HLS替换轨道也有相同问题。仅有音频时使用音频解码，或仅有视频时使用AudioContext作为时钟，
本来是有效场景；不能一律要求音频和视频两条轨道都支持。

readiness.ts新增内部requireDecoder，根据两个引擎完成现有能力检查后实际建立的sink判断。
不重复调用SDK canDecode，不改变decoder.load的Promise<void>返回，也不添加Canvas公开字段。
metadata barrier在发布metadata前检查；load在发布data/canplay前检查；轨道替换在decoder
加载后、seek及成功事件前检查。全部不可用时readyState归零，通过既有code 4错误通道报告
`Input has no decodable audio or video tracks.`。原SDK查询拒绝保留原消息。

至少一条轨道可用时，原有部分播放、事件顺序和AudioContext时钟保留。暂停不取消仍有效的加载；
过期能力查询不能对新source或已destroy实例发就绪/错误。后续有效source可正常恢复。
HLS失败触发现有error清理，移除失效菜单；旧canPlayType恒maybe及synthetic ranges/RAF不变。
内部AudioPort/VideoPort补上准确SDK sink类型，公共声明仍不引入这些SDK依赖。

## 验证

新增16项Node回归：两个单轨输入的false/null能力、轨道替换、正常音频、晚查询false/reject、
暂停期间查询、活动SDK错误、有效source恢复。使用真实SDK输入/track与受控能力响应；正常替换
夹具先模拟已工作的decoder并保留真实Input，再使用实际引擎执行失败替换。
同断言旧main8通过/8失败；候选全部通过。原协调器两个正常夹具补齐其声明模拟的有效sink，
事件/顺序断言保持原样，没有为错误实现放宽预期。候选包专项257、main/legacy各233通过；
每个产物命令包含229候选断言与4冻结正常控制。

新增30浏览器用例涵盖发布版/候选核心与三个引擎。Chromium/Firefox中12项受控不可解码
检查通过，8项混合媒体保留另一实际原生解码器并播放；Windows WebKit的10项API缺失为能力对照。
canDecode=false是受控输入，不把它描述为浏览器自身拒绝该真实fixture的编码。
旧main相同30项18通过/12失败；失败均为单轨假就绪和HLS替换假成功，正常部分播放仍通过。
每轮report及整个results目录均保留。

最终整组浏览器、隔离安装、完整CI及哈希记录见[最终证据](../baselines/mb-capability-validation.json)。
入口检查点的17组安装类型/导出矩阵在最终候选上重跑；两个冻结声明整工厂双向赋值、精确Canvas
结果和旧Option保持，新的可选shim/Player/HLS/RAF类型仍由实际VideoShim实现约束。

## 维护与验收边界

原有8个JS模块已在前序步骤细分并全部迁为34个生产TS模块，无相邻声明桥替代实现检查。
包内ARCHITECTURE.md记录模块、资源归属、能力/类型边界，README给出可选类型用法；
test:unit/test:mediabunny接入本轮用例，三种构建及docs复制由标准build生成。本轮没有新依赖。

MB-08交付严格TS实现、兼容媒体声明与明确的不可解码错误处理。MB-CAP-01仍保留物理Safari/
支持范围核验，MB-09负责长播放/音画同步/设备/组合，MB-10负责示例、完整分发与MPL/source notice。
这些门槛不因本轮正常检查通过而视为完成。后续发现具体失败应修复并加入回归，不能只增加豁免。
回退本轮commit可还原能力处理；入口/声明检查点单独回退5e28dfee，不改冻结历史输入。

最终9个MediaBunny浏览器文件150项通过，其中39项为Windows WebKit能力缺失对照；
完整CI1418项（1263单元+14工程+141基线）与44重复契约通过，324生产TS。
最终源码/声明/测试/产物/安装文件及报告哈希一致，三格式dist与docs复制一致。
MB-TYPE-01和MB-READY-01按其声明/就绪验收条件关闭；MB-CAP-01、MB-LIFE-01与MB-LICENSE-01仍open。
