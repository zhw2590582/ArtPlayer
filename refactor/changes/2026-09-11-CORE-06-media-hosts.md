# CORE-06：内部媒体与宿主类型

## 实现与边界

新增 src/media/types.ts 描述 NativeMedia、CanvasMedia、MediaState 和 PlaybackMethods；
src/media/hosts.ts 描述最小播放、暂停和布局宿主。五个 player 模块 playMix、pauseMix、
playingMix、durationMix、rectMix 从 JS 迁移 TS，依赖各自实际需要的字段，避免全部接收整个
Artplayer 或将所有代理都视为 HTMLVideoElement。入口仍按原顺序调用这些模块。

CanvasMedia 包含 canvas 自身能力及媒体字段，source 允许 MediaBunny 使用的 null；
textTracks、PiP、视频帧回调及 WebKit 扩展为可选能力，NativeMedia 也不能假定所有浏览器
都有这些功能。PlaybackMethods 保留实际方法返回值，不将所有代理的 pause 改成 Promise。
Notice 的 getter 与 setter 分开描述，因为读取是显示状态，写入是消息。

模块 assertion 签名表达 def 安装后的属性，rectMix 保留一处说明过的内部 getter 安装断言；
没有把代理断言成 HTMLVideoElement，没有新增全局 any。主入口目前仍是 JS，其整体静态类型
集成属于 CORE-20；这些内部类型不是运行时校验器，也不表示所有第三方 proxy 已经验证。

## 保留契约

API-02/03/04/07/09/10/11：公开 art.video 仍返回原始媒体对象，声明和所有分发入口未改变。
play 仍 await 底层返回值，再设置 notice、emit play、处理 mutex；pause 同步返回底层结果。
方法可抽取调用，底层方法 receiver 仍是媒体对象。playing 优先读取 shim 的 boolean，
否则使用原生状态组合；duration 只按原规则处理 Infinity/假值。播放、暂停、playing 捕获
原媒体引用，duration 动态读取 template.$video；布局 getter 动态读取 DOM 和页面滚动偏移。
属性安装顺序和 enumerable/configurable/writable 保持原样。

不新增公开媒体包装层，不要求旧用户修改 art.video 调用。旧公开 video 声明不能用来掩盖
内部 canvas 类型；公开类型扩展需另有消费者兼容检查。没有在本任务宣称修复 proxy 自身的
异步绘制销毁问题或验证 MediaBunny codec，代理完整迁移及其资源所有权由各包任务继续处理。

## 验证与交接

- 四项 Node 测试覆盖结构化代理返回值、this、事件/互斥顺序、属性描述符、shim playing、
  时长规范化和实时布局。已有播放拒绝、切源、销毁回归同步执行。
- 类型正例覆盖原生/canvas、最小宿主、同步返回及 readonly getter；五项负例拒绝裸 canvas、
  将 shim 当完整 video、无检查调用可选能力、错误暂停返回和写入只读布局。
- yarn ci:check：83 单元、4 工程、24 冻结基线，共 111 项通过；28 个生产 TS 文件严格检查，
  其中核心 23 个、chapter 5 个。未迁移 JS 不计入。
- yarn build artplayer 和 yarn build:i18n 生成产物；yarn test:package:release 在仓库外安装
  tarball，27 项运行时及五组类型模式零诊断。包内文档与源码指纹已与最终构建快照核对。
- 安装 UMD 候选完整三浏览器 132 项通过；安装 legacy 的播放、生命周期和媒体宿主 48 项
  通过，无重试或跳过。新六项 canvas 测试验证真实播放、暂停、seek、对象身份和布局变化。
  canvas 来自已有 docs/compiled 工件，附件记录其 SHA；它不是独立安装的 npm 发布 proxy。

详见 [验证报告](../baselines/media-hosts-validation.json)、
[核心维护地图](../../packages/artplayer/ARCHITECTURE.md) 和
[类型说明](../../packages/artplayer/types/README.md)。无新增依赖或锁文件修改；test:unit
加入新宿主测试。未推送、发布或执行远端 CI/真机验收。

本任务单独提交，回退该提交可一并恢复五个 JS 模块、生成产物、文档及任务状态。
下一项 CORE-07 协调公开声明差异，保留历史合法类型消费并以运行时证据补充类型。
