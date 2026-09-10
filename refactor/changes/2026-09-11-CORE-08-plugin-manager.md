# CORE-08：插件注册与扩展类型

## 结构与类型

plugins/index.js 拆为四个 TS 文件：index.ts 管理调用与同步/异步结算，builtins.ts 按原顺序
装配内置插件，registration.ts 负责命名与属性写入，types.ts 定义最小宿主和内部返回类型。
内置插件实现仍由 CORE-18 逐项迁移；本任务没有把它们计作已 TS 化。

内部已知同步工厂返回 registry，当前 realm 的 Promise 工厂返回 Promise registry，unknown
返回保留 union；保持 instanceof Promise 的历史识别规则，不用 Promise.resolve 同化普通
thenable 或外部 realm Promise。PluginFactory 只有原来的一个 art 参数与 this receiver。

新增公开类型 PluginFactory/Plugins，并加入仅含 types 条件的 artplayer/types 子路径及旧
typesVersions 回退。该路径指向共享声明，允许跨 Node10、NodeNext CJS/ESM、Bundler 和
TS 4.3.5 扩展同一个 Plugins/Events 接口；运行时 require/import 均被拒绝。没有新增 JS
导出或依赖。根 CJS namespace 的类型别名不能直接当成可合并接口，故采用共享类型入口。
插件类型扩展不会安装插件；示例保留可选属性与存在性检查。

公开 plugins.add 的历史 Promise 返回声明不在这里静默收紧；BASE-TYPE-04 继续开放至
CORE-21，内部精确类型与旧消费者测试并存。

## 兼容与故障修正

API-03/04/05/06/07/09/11：保留内置/用户顺序、一次 option 捕获、后续实时条件读取、用户
数组实时遍历、返回结果优先命名、函数名回退和 completion-time id 回退。失败调用仍消耗 id；
结果属性仍不可枚举、不可写、不可配置；重复名称与同步/异步错误继续保留原始错误对象。
没有新增名称黑名单，保留旧 prototype 方法遮蔽语义。

动态 name 读取与 PropertyKey 边界保留局部断言；普通活跃注册中的对象键三次原生转换位置
不变。只有对象/函数键的最终转换在临时对象上提前完成，以便写入前再次检查是否发生销毁，
不因 ToPropertyKey 中的重入而在关闭后新增不可删除的属性。名称 getter、重复检查和消息
转换之后也检查关闭状态。

修复 BASE-LIFE-03：销毁前发起的异步 add 仍按原 Promise 成功/失败规则结算，但晚到结果
不再进入注册表。既有拒绝继续传播；没有引入新的“取消拒绝”。销毁后直接 add 则在 id
递增及工厂执行前同步抛 ArtPlayerError，明确阻止继续初始化已经关闭的实例。
生命周期新增内部 isClosing，覆盖 reset 已开始而 scope 尚未 dispose 的重入窗口。

同步工厂关闭构造时停止后续插件；构造器自己发起、没有外部接收者的 Promise 注册增加
拒绝观察，console.warn 一次原错误，避免孤立的 unhandled rejection。公开 add 的 Promise
不被该观察器吞掉。未将任何结果的 destroy 方法自动当成清理协议；工厂 await 后自行创建
的 DOM/SDK/监听器仍需各插件负责，不能把阻止晚到注册宣称为整个生态无资源泄漏。

## 验证

- 八项 Node 测试覆盖 this/参数/描述符/id/命名、同步/Promise 返回、完成时 id、原始错误、
  thenable/跨 realm、迟到结果、四个命名重入位置、构造停止与拒绝观察、reset 重入。
- 内部类型正反例检查同步/异步/unknown union 和宿主参数；公开插件结果及事件扩展在五组
  工作区和实际安装消费模式通过。所有原声明消费者继续编译，新增类型路径无运行时入口。
- yarn ci:check 共 120 项：91 单元、4 工程、25 基线；32 个生产 TS 文件严格检查，其中
  核心 27 个、chapter 5 个。build:ts、build artplayer、build:i18n 由仓库脚本生成产物。
- 严格打包消费 27 项运行时及五组类型零诊断；实际安装 UMD 三浏览器全套 162 项、legacy
  插件/章节/生命周期 90 项通过，无重试或跳过。新增插件专项 18 项含旧版迟到注册负例、
  候选修复、同步关闭/拒绝观察以及模拟 mobile UA 的内置顺序与直播排除；不是真机证据。

验证曾捕获拆分时遗漏的 fastForward 直播排除条件；已与 Git 起点和发布版对照恢复，保留
对照测试。Firefox 的 console 文本只显示 Error，测试改为核对 console 参数中原错误对象
的 identity/message，而非放宽错误要求。初始失败日志保留在本地 cache。

详见 [验证报告](../baselines/plugins-validation.json)、[核心维护地图](../../packages/artplayer/ARCHITECTURE.md)
与 [类型说明](../../packages/artplayer/types/README.md)。依赖/锁文件未变，test:unit 加入插件
测试，工作区及安装类型脚本加入扩展用例。没有远端 CI、推送、发布或真机通过结论。

本任务独立提交，回退提交可恢复管理器、生命周期辅助函数、声明/子路径、测试、生成产物和
状态。下一项 CORE-09 处理 URL/切源操作身份及异步结算；内置插件资源清理仍属 CORE-18。
