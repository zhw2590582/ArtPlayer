# CORE-04：构造回滚与可靠销毁

## 核心改动

核心 index.js 已直接接入 lifecycle/instance.ts，实例状态保存在 WeakMap，不增加公开属性。
正常构造顺序不变；Template 在修改容器前保留原 DOM，成功后丢弃回滚引用。
template-rollback.ts 按原节点、子节点顺序、文本和属性恢复失败挂载，保留旧 DOM 监听和
SSR 节点身份。容器在初始化阶段就被预留，避免实例尚未进入注册表时被重入构造占用。

Events 在安装第一个监听前注册清理，覆盖 new Events 中途失败、art.events 尚未赋值的情况。
构造失败会释放已接入的资源、移除实例、标记 isDestroy、发出 destroy 供已有插件清理，
并恢复原容器。原始构造错误保持身份和传播，清理错误独立报告。
失败回滚结束前保留容器归属，防止 cleanup 回调中的新挂载被旧回滚覆盖；正常 destroy 事件前
释放容器，允许该回调创建替代实例。对应回归同时验证两种路径，旧实例重复销毁不影响替代实例。

destroy 通过内部防重入状态保护整个过程，包括 reset 内触发的重入。正常顺序保持
reset → 资源/DOM 监听清理 → template → instances 移除 → isDestroy=true → destroy 事件。
reset 中观察到的公开 isDestroy 仍为 false；destroy 回调观察到 true、已移除注册且 DOM
符合 removeHtml。重复调用不再改变任何状态，因此 destroy(false) 后再 destroy(true)
也不清空保留节点或新的播放器。instances.indexOf 为 -1 时绝不 splice。

每个内部清理阶段独立执行，失败不会阻断注册表清理和 destroy 派发；第一个错误原样抛出，
额外错误报告到 console.warn。Emitter 内单次派发的“抛错停止后续订阅”契约保持；不能借此
改动普通 emit。核心资源清理已不单靠 destroy 订阅，因此用户监听抛错不会阻止这些清理。

## 延迟任务归属

- resize 防抖改为作用域拥有的 timeout，保留正常合并行为；销毁立即取消等待中的 burst。
- Info 循环、update RAF、setting mounted 回调接入作用域；Notice 销毁释放 timer，关闭后不接受新提示。
- customType/空 URL、quality 初始化和 reconnect 使用 wait(scope)，取消时兑现 false，
  正常保留 timer → Promise microtask 的顺序；await 后再次检查 closed，覆盖定时器已完成但
  continuation 尚未运行时发生销毁的竞态。
- Events.proxy 的真实 callback、返回 disposer 和 destroyEvents 形状保持；关闭后新增注册返回空清理函数。

不引入依赖，不改变 Yarn、版本或公开类型入口。内部新增两个 TS 文件；入口及被接入的 JS
模块保留渐进迁移，完整入口 TS 收敛属于 CORE-20。

## 兼容性差异与风险

API-01/03/04/05/07/08/10：保留公开属性、正常事件顺序、同步返回、removeHtml 和分发路径。
BASE-LIFE-04 的误删其他实例、BASE-LIFE-05 的失败构造 DOM/监听残留以及 BASE-PERF-01 的
销毁后 resize 重建 notice timer 是有意修复的缺陷。冻结发布基线不改，新增旧版观察和候选正向断言。
构造过程中插件主动同步 destroy 的实例不进入注册表。

这里的 DOM 回滚不承诺恢复任意用户 callback 的外部副作用、存储、原生媒体状态或外部节点。
也不表示全部媒体功能的资源已经迁移：字幕请求/URL 为 CORE-15，progress/thumbnail 为
CORE-19，view throttle 为 CORE-17，内置插件延迟工作为 CORE-18，切源 Promise 为 CORE-09，
异步插件兑现为 CORE-08。它们仍须在对应任务完成，不能因本任务通过而提前允许发布。

## 验证

- yarn ci:check：71 项单元、4 项工程、24 项冻结基线，共 99 项；严格源类型检查 17 个 TS 文件。
- 四项内部实例测试覆盖销毁顺序、reset 重入/抛错、destroy 监听错误身份及微任务竞态；
  资源测试增加 wait 完成/取消结算。
- 安装 UMD 候选三浏览器完整 108 项通过，无重试/跳过，包括 30 项生命周期对照/修复场景。
  覆盖真实媒体播放/切源、正常 resize、pending resize/notice/RAF/reconnect/mounted、
  插件初始化/清理同时失败、早期 proxy 失败、SSR、Events 半初始化失败、重复/重入销毁、重入容器预留和同步关闭构造。
- 安装 legacy 候选另跑三个浏览器 30 项生命周期验证；按实际产物映射加载，没有源码回退。
- yarn build artplayer / yarn build:i18n 生成 dist 与 docs/compiled。
- yarn test:package:release：仓库外实际安装 tarball，27 项运行时和五组类型消费者零诊断。
  包内架构文档更新后重新打包，并核对浏览器候选 JS 与最终包成员指纹一致。

证据见 [验证报告](../baselines/instance-lifecycle-validation.json)；持续维护地图见
[核心架构](../../packages/artplayer/ARCHITECTURE.md)。早期本地测试曾被 ESLint 自动改为未安装
的 Vitest 导入，已恢复仓库 Node runner 并明确局部 lint 说明，没有添加另一个测试框架。

本任务独立提交；回退整个提交可同时恢复源码、生成产物、测试与台账。未推送或发布。
下一项 CORE-05 区分输入配置与内部配置，再继续核心类型和模块迁移。
