# PKG-ADS-03：Ads 职责拆分与生命周期修复

起点 069ad4aa。实际实现地图见包内 [ARCHITECTURE.md](../../packages/artplayer-plugin-ads/ARCHITECTURE.md)。
本步已经进入生产源码，公开声明/格式类型入口仍由 04 处理，完整分发和 demo 由 06 接续。

## 结构改造

原 index.js 拆为 7 个严格 TS 模块：入口、配置、内部类型、计时、资源、视图和 session。
计时模块不依赖核心/DOM；视图仅接收父节点、图标、三个 DOM 工具和回调；session 管理
状态转换及媒体请求。entry 中保留旧声明 constructor 边界的局部断言；私有固定 HTML
对应的节点种类断言集中在 view，未用 any 或全局索引签名掩盖全部类型问题。

配置每次 attach 独立归一化；i18n 仍浅合并；emit 的配置仍为同一活对象，修改事件配置
中的 totalDuration 会影响后续 tick。移除未经验证的 >=5 数字门槛，使用已有 validator/
DOM 工具；DOM 监听自有，兼容原生 visibility 与新核心事件桥，重复恢复只有一个 timer。

核心 4.5.5 的实际 npm 归档、SHA512/SHA256、完整成员清单和选定源码/主入口指纹记录在
[ads-core.json](../baselines/ads-core.json)，新增基线测试。浏览器服务器正式映射该
历史核心，manifest 记录实际字节来源；没有先加载新核心再覆盖全局变量/样式。

## 有意修正的缺陷与兼容边界

1. 重复 play/metadata/ready 不再创建多个计时链或视图；终止和暂停真正取消已排队 tick。
2. 跳过幂等；销毁后方法/媒体回调均无效。正常 skip 仍先请求主片播放，再暂停广告、
   隐藏 DOM、同步 emit 原配置。同步播放/广告暂停回调触发 destroy 时不再继续通知。
3. 提前 play/pause 无操作；提前 skip 取消尚未开始的 preroll 并 emit 一次，不创建 DOM
   或提前自动播放主片。旧路径抛错/留下永不结束遮罩，不作为兼容要求保留。
4. 零阈值关闭按钮立即可用；全屏图标按初始状态及外部 fullscreen 事件同步。
5. 媒体监听早于 src 赋值，覆盖同步/缓存 metadata；广告 play 失败观察原错误并按
   媒体失败完成广告。主片恢复失败保持完成状态并记录原错误，外部 art.play 不被改写。
6. 销毁独立释放 timer、core/DOM/document 监听、媒体 src 和 overlay，保留调用方
   新的 template.$ads 值及外部监听。部分构建失败也清理已拥有的节点和订阅。

正常公共 play/pause 只控制倒计时，未被改成媒体暂停/播放接口。视频优先于 HTML、
数值/默认时长、完整 i18n、URL/事件参数、同步返回及全部既有 CSS 类名保持。
结束时仍保留隐藏 overlay 与媒体 source/error 状态，到 destroy 才释放媒体。
初始隐藏文档暂停计时；真实设备后台策略仍需后续验收。

## 测试与原始失败

先增加的 10 个候选缺陷断言在旧源码上全部失败；初次实现受控测试的 Node 节点缺少
remove 方法，补足最小 DOM 意图模型，不伪装真实浏览器。之后增加动态事件配置、同步
src metadata、Promise 拒绝/晚到、部分构建失败、外部监听与模板所有权、全屏状态等断言。
广告暂停时同步 destroy 的额外回归先 19 通过/1 失败，补终止状态检查后通过。

正式三格式首次 182/186 通过；VM 与主环境 Promise 的跨 realm 同化多于两次 microtask。
改成让一个事件循环轮次排空已排队微任务，而非固定两次 Promise.resolve；未替换 VM 的
Promise 或修改生产实现来配合测试。最终三格式加源码/历史观察 186 项全部通过。

首次加入实际 4.5.5 的浏览器运行 66 通过/33 失败：测试夹具误用该核心不存在的 art.video。
改为已经存在的 template.$video；生产插件没有该依赖。扩展后 138/144 通过，6 个 Firefox
失败为 console 文本没有序列化 DOMException.message；改用透明 console.warn 参数记录，
仍调用原方法、严格核对原异常名/消息，不屏蔽其他页面异常。原始报告与 trace 保留。

正式 main 和 legacy 三引擎分别 144 项全部通过，无跳过或重试，报告中的候选插件哈希
逐例匹配本次正式文件；4.5.5 核心来源也核对实际 manifest 指纹。已查看其加载候选 main
的视频截图，画面、倒计时、静音/全屏控件均可见。完整本地 CI 830 项通过（770 单元、
14 工程、46 基线），269 个生产 TS 严格检查、核心 37 份声明无漂移。既有生成编辑器
声明的一条 unused eslint-disable warning 保留，没有新增 lint 错误。
最终记录见 [执行证据](../baselines/ads-lifecycle-validation.json)。同步源码/构建产物由
仓库 yarn build 生成，未手工编辑 dist/docs compiled。
本步不增加依赖，新增 tsconfig 从 npm 包排除，Ads 生命周期测试接入 test:ads/test:unit。
计划验证曾拒绝直接指向 refactor 外架构文件的 evidence 项，已改为内部变更记录再链接
包内文档；没有修改校验规则。异步测试新增 import 顺序按现有 lint 修正。

## 后续与回退

ADS 的生命周期、媒体/UI 风险保留到相应关闭证据齐全；DOM/媒体真实销毁、4.5.5 组合
证据也不代表所有历史核心或移动设备已认证。04 需要处理历史 export=、totalDuration
错误 string 声明与工作区 source/type 接受面；05 完成实际设备/隐藏页/全屏；06 隔离
tarball/旧 default namespace/8082 demo。DASH 等其他开放媒体风险仍有效。

本地独立提交包含本步生产拆分、生成产物、回归、架构/执行文档与状态；可整体 revert
回到 02 冻结实现与测试基线。没有 push、tag、publish 或 merge。
