# PKG-DANMUKU-12 连续采样与串行放置

07原生诊断确认：beforeVisible等待600ms时，浏览器仍以约19–64ms媒体间隔出帧，
但旧调度不再读取readys达约583–647ms，中间已到时弹幕未被选中。单次ready快照
还会使已显示弹幕的到期回收等待后续异步准备。拆分本任务处理，07仍独立待验收。

## 设计与兼容边界

- 保留公开readys的当前时间±0.1秒规则，不补扫过去时间、不追赶seek跨过的区间。
  每次真实RAF继续维护可见寿命并采样。已经真实采到的项由内部buffer保留引用，
  不擅自把公开wait状态改为ready，不复制/替换队列对象。
- 用户beforeVisible和Worker放置仍串行，最多一个异步批次。当前批次不重排，
  批内所有项保留身份占位直到整批结束，false/无轨道只能在后续RAF再捕获。
  下一批次从pending按当前ready优先、各组捕获顺序构造，防止轨道满的ready行
  反复抢占同批后续wait。
- pause/stop/reset/替换加载/seek/hide/destroy及失败恢复保持既有代际取消；清空
  buffered引用，旧Promise迟到不能清掉新批次或显示已取消行。拒绝按本代跳过，
  false仍以未来真实采样决定是否重试；没有任意条数上限或并行用户回调。
- 明确内部变化：等待异步准备时仍有一个待执行RAF，而不是把采样也暂停。公开
  事件顺序、门面返回与声明不变；先前漏采样而丢失的弹幕可在其串行轮次显示。

本任务已完成实现与验证，任务和提交状态以tasks.json及Git为准。主线程完全卡住造成的未采样窗口
没有被本设计恢复，不得把这个修复称为任意负载下无漏弹幕。

## 实现与测试依据

`scheduler.ts` 拆开实际帧维护与异步批次，`scheduling-buffer.ts` 只持有观察过的
行引用及当前批次占位。没有新增依赖、公开字段、回调、声明或分发入口。
保留 API-04/05/07/08/11/12 边界；只修正异步等待期间漏采样和延期回收。
源码受控红测10项中3项失败，分别证明没有继续排队RAF、中间行丢失、可见行
未按期回收；其余7项覆盖取消和轨道占用保护。

最初原生红测有两项失败：候选确实丢失middle；已发布插件还触发其已知的
play/playing双循环，使对旧版新增的“回调串行”断言失败。该串行断言只适用
重构候选；旧版保留缺失middle的精确历史断言，不伪称旧版有串行保证。
首次接入后单测65/66通过，余下一项仍断言异步期间RAF为0；按明确的新内部
调度约束改为1，并增加执行该帧后callback仍只调用一次的保护，未放松公开事件。

包内 ARCHITECTURE.md 已同步文件职责、采样/放置关系、代际清理及CPU阻塞限制。
最终命令、构建格式、浏览器版本和结果在本任务机器证据中记录后才关闭任务。

最终验证：Node 24.21.0 / Yarn 1.22.22，完整源码264项、main/legacy调度与Worker
各68项全部通过。独立审查新增旧代finally不清新buffer、跨帧ready优先两项保护。
源码/main/legacy各102项原生浏览器测试全部通过，0重试/跳过；其中每格式66项
两核心调度、24项新旧插件真实延迟Worker寿命，以及12项候选核心时间窗口测试。
后者有6项CPU阻塞诊断，并不证明无漏弹幕；准确范围见机器证据。
分包严格TS、目标lint、三格式构建和严格工具链检查通过；没有新增依赖或修改声明。

可重跑命令：

```sh
yarn test:danmuku
yarn exec tsc -p packages/artplayer-plugin-danmuku/tsconfig.json --noEmit
yarn build artplayer-plugin-danmuku
yarn test:browser test/browser/danmuku-timing-diagnostic.spec.js test/browser/danmuku-scheduler.spec.js test/browser/danmuku-lifetime.spec.js --workers=2
```

产物复跑分别设置 `ARTPLAYER_DANMUKU_ARTIFACT` 为dist下的 `.js` / `.legacy.js`，
每次等待进程终态并归档报告再启动下一格式。受控产物测试运行
`node --test test/danmuku-scheduler.test.js test/danmuku-worker-client.test.js`。
证据：[danmuku-frame-sampling-validation.json](../baselines/danmuku-frame-sampling-validation.json)。

## 发布与回退

沿用每包下一major及原接口兼容政策，本次没有发布授权。回退本任务的scheduler、
buffer和生成产物即可恢复11的串行采样实现；保留测试用于展示回退会重现的漏采样。
不要同时回退11已修正的Worker可见寿命起点。07仍需真实持续负载、资源及Mask验收。
