# PKG-MB-08 检查点：入口、Canvas 转发与公开声明

任务保持doing。本包自有源码已全部迁移为34个strict TS模块，但不可解码轨道的回退与
就绪能力审查尚未完成；不能据此把整个MB-08标done。进入本轮的源码/产物冻结于
[入口基线](../baselines/mb-entry-source.json)，对应8a2b56e8。

## 实现与兼容边界

入口从index.js迁至index.ts，Canvas转发、入口生命周期和通用清理分别进入
canvas-bridge.ts、entry-lifecycle.ts、cleanup.ts。后者从HLS菜单层下移，避免入口依赖
UI层的通用释放实现。HLS初始化支持部分注册失败时撤销，返回内部destroy供入口回滚。

保留createElement脱离receiver调用、原生可枚举方法getter读取两次、Canvas原生方法优先、
shim own/直接prototype转发、每次读取绑定方法、getter-only写入TypeError等旧行为。
资源状态不增加Canvas公开字段。销毁取消入口resize/metadata/destroy监听，已保存回调失效；
只删除仍属于当前shim的art.mediabunny，保留调用方替换的别名。一个清理步骤抛错仍尝试其余步骤，
setup失败保留原始异常。缺少off的历史自定义host仍可用，残留回调在销毁后保持无副作用。

公开默认工厂继续是可选Option到同步initializer、精确HTMLCanvasElement的签名；不将Result
缩窄成Canvas与shim交叉类型，不增加强制default属性，也不全局增强Artplayer。
新增type-only Option/Result、MediaBunnyShim、MediaBunnyCanvas、MediaBunnyPlayer、HLS状态和
SyntheticFrameCallback等。MediaBunnyPlayer的别名可缺省；Canvas视图明确原生DOM方法优先。
VideoShim实际implements媒体视图，getter显式返回类型防止unknown setter污染读取推导。

声明不引入MediaBunny SDK的现代DOM/Disposable依赖；track对象保持unknown，由消费者按
自用SDK缩窄。SyntheticFrameMetadata保留历史估算语义，尤其presentationTime是媒体秒数。
canPlayType仍恒为maybe，TimeRanges不代表真实网络缓冲；新类型不制造能力承诺。

新增.d.mts及条件types路由修正NodeNext ESM不可调用问题，typesVersions补齐经典解析的legacy。
CommonJS继续保留旧default声明门面；运行时直接工厂增加不可枚举、可写、可配置的default自身别名，
同时支持1.0.0的namespace.default和1.2.0的直接调用。整工厂双向赋值使用实际两个npm冻结声明检查。

## 验证与迭代

15条入口断言在旧main上6通过/9失败；候选包专项241通过，main/legacy各217通过，其中
各213条候选断言和4条冻结正常控制。HLS测试将清理断言限定为其自己拥有的5个listener；
新增入口断言单独检查额外3个listener，不再错误假设resize回调应一直残留。

新增12浏览器用例使用真实Canvas与发布版/候选核心，覆盖方法receiver、DOM事件/属性优先、
清理和替换别名。旧main同12项全部复现缺陷；候选通过。首轮夹具错误地把后续核心尺寸处理后的
inline style当作入口独占结果，现单独调用已注册入口resize callback验证其行为；首轮18份失败
report/results保留，并合并了两组重复场景。未增加重试或放宽超时。最终8个MediaBunny浏览器文件
共120通过：新增12项为Canvas/生命周期检查，原有29项为Windows WebKit能力对照，均不冒充播放。

新增yarn test:mediabunny-types-package：实际pack核心与代理，在工作区外安装两个冻结发布包及
候选，offline/frozen重装、锁文件和安装文件哈希检查。17组编译/导出矩阵通过；候选7组各拒绝
15条非法用法，并验证原始两份声明的整工厂双向赋值。保留旧版NodeNext ESM的准确诊断作为负例。
最初pack发现tsconfig泄漏，补入.npmignore后修复。旧TS不读取SDK声明，所有解析文件限于安装
目录或编译器标准库。该检查并非MB-10完整分发/许可验收。

最终源码、打包安装、构建与浏览器证据见[检查点记录](../baselines/mb-entry-checkpoint.json)。
完整CI1402项（1247单元+14工程+141基线）通过，另44重复契约，324生产TS。
首轮全局noUncheckedIndexedAccess发现消费者夹具直接读取空数组首项，改为可选访问后
完整CI和17组实际安装矩阵重跑通过；运行时产物未变化。本轮未添加依赖，Yarn和SDK锁版本不变。

## 立即接续

继续检查已有track但codec/canDecode不可用时，VideoEngine/AudioEngine的历史空轨道回退。
必须保留有效audio-only/video-only播放，阻止没有可用解码器时假就绪，并覆盖加载、HLS替换、
晚能力查询、pause/source/destroy和错误事件顺序。不要仅凭新增接口或现有WebKit负例宣布修复。
长播放/AV sync/设备及组合由MB-09，示例、安装分发及MPL/source notice由MB-10继续。
本检查点独立本地提交，回退该提交即可恢复本轮前状态；冻结历史输入保持不变，不推送或发布。

接续缺陷已用实际SDK解析的video-only MP4复现：受控canDecode=false与AudioContext下，
旧/候选均为videoSink=null、audioSink=null，却readyState=4并发loadedmetadata/data/canplay/through；
replaceTracks后同样假就绪。该受控复现见检查点记录，不能当作真实浏览器解码结果。
