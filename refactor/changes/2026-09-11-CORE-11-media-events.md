# CORE-11 媒体事件、ready 与重连

状态：完成；源码、构建、安装消费与本地三浏览器检查通过。

## 模块与生命周期

player/eventInit.ts 仅负责按原顺序装配；media/events 下分为 types、listen、forward、readiness、playback、reconnect 六个 TS 模块。转发仍使用原 proxy 和配置事件名，发出同一个原生 Event 对象。内部 Emitter 监听归实例作用域，销毁时只移除自己的监听，用户订阅和原 snapshot 顺序保留。

source/operation.ts 现在分开资源代次与切源操作。实例作用域拥有当前资源作用域，后者拥有 SourceOperation.scope 及重连等待。切源失败可以结束操作并拒绝调用方 Promise，同时保留当前资源的自动重连；新的 URL 赋值或 destroy 则释放整个旧资源作用域。不能把重连绑定在失败即释放的 switch 作用域上。

播放有效性同时捕获资源与操作身份，覆盖“失败切源已清除操作后，再开始播放并销毁”的组合路径；迟到 Promise 仍保留原值/拒绝，过期通知、play 和互斥暂停停止执行。

## 兼容和缺陷修正

- 保留 API-04/05/07：配置事件顺序、原 Event、ready 的正常顺序和次数、resize/mobile UI 顺序、loop 和 play 拒绝处理。
- 同一资源同时只排一个重试，保留第一条待处理错误。按原常量等待、保留原错误参数，最多按预算重试；canplay 重置预算。重试次数在开始该次重试时固定，避免同步代理 canplay 把错误回调的次数变成 0。
- 保留等待结束时读取 option.url 的行为，使应用能在 native error 回调更新重试目标；若该 getter 重入切换资源，旧任务立即退出。
- BASE-LIFE-07：旧待办重连在用户已换源后仍会重新加载并发 error。现在新 URL、canplay 或销毁会取消过期重试/失败通知；独立新资源使用新预算，恢复时移除 art-error。
- BASE-LIFE-08：旧 ready 流程在 control 回调销毁实例后仍能继续标记 isReady 并发 ready。现在每步 UI 检查关闭状态，停止后续 ready；用户其他事件订阅仍保留。
- 内部重连异步回调若抛错，通过 console.warn 带原异常报告，避免无人接收的 Promise 拒绝。直接用户 Emitter 回调的同步异常传播不统一吞掉。

## 验证与限制

test/media-events.test.js 通过真实 EventTarget 和受控计时验证预算、合并、资源代次、失败切源、恢复/销毁、UI 重入、同步代理和原错误身份；test/types/media-events.ts 验证最小媒体事件宿主。test/browser/media-events.spec.js 使用真实 HTTP 503 与本地媒体恢复，比较发布/候选，并验证 Android UA 元数据路径。

媒体事件没有资源 ID。第三方 customType/proxy 已启动的外部 SDK 任务及其伪装成当前资源的事件仍由适配器管理；这里不宣称能取消任意外部代码。UA 检查不是实体移动设备验收。

证据见 [media-events-validation.json](../baselines/media-events-validation.json)，包括完整源码/测试/包文件 SHA、实际安装消费者和逐项浏览器结果。

| 验证 | 结果 |
| --- | --- |
| yarn ci:check | 158 项：129 单元、4 工程、25 基线；54 个生产 TS 文件严格编译 |
| 媒体事件专项 | 新增 13 项 Node，涵盖 EventTarget、定时器、源/操作生命周期及真实 playMix |
| 安装包 | 核心/chapter 的 27 项运行时通过；五组类型模式零诊断 |
| 安装 UMD | 三浏览器 222 项通过，无跳过、重试或 flaky |
| 安装 legacy | 同套三浏览器 222 项通过，无跳过、重试或 flaky |
| 新旧差异 | 真实 HTTP 恢复/旧重连取消、ghost ready、移动 UA 顺序均有发布/候选对照 |

BASE-LIFE-07/08 已关闭，旧发布基线未改。HTTP 503 是受控失败，产生的请求/控制台记录保留在原始浏览器证据；未处理 JS 异常为零。早期通过报告不替代包含源级播放守卫的最终包指纹与完整复验。

未运行远端 CI、实体设备或所有生态包的发布验收。无依赖、锁文件或版本变化；本任务单独本地 commit。回退须连同 source/operation 的资源代次改动、事件模块、产物和文档整体回退。
