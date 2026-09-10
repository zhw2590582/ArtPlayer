# 事件、媒体与生命周期基线

BASE-03 在 Codex 内置浏览器以固定 core 5.4.0 / chapter 1.1.0 执行，样本为仓库 video.mp4、video2.mp4。来源成员、媒体 SHA-256、夹具 LF 指纹、实际 UA 和采集时间均保存在 [lifecycle.json](lifecycle.json)。

## 验证方式与范围

点击 ../fixtures/lifecycle.html 的 Run lifecycle baseline，实际加载媒体、静音播放并观察 currentTime 推进。使用 ready/原生事件/状态条件等待，单步骤超时 12 秒；暂停及销毁后状态采用至少 250ms 的帧观察窗口。这个窗口用于测量稳定性，不是用 sleep 猜测加载完成。

公开 play 拒绝和切源恢复失败通过临时替换该实例 video.play 返回受控拒绝来验证，随后恢复原生方法。恢复失败发生在真实媒体切换、真实 canplay 之后；它验证包装器的错误传播，不代表测过浏览器自动播放权限、真实网络错误或所有 codec 故障。仅精确匹配受控错误对象的 unhandledrejection 会被探针记录到 expectedUnhandled 并 preventDefault；其他拒绝一律判为采集失败。

## 固定测试 ID 与契约

| 契约/场景 | 已执行 ID | 结果或约束 |
| --- | --- | --- |
| API-04 Emitter | EVENT.chain/context-arguments/once-reentry/dispatch-snapshot/off-original-once/throw-propagation | 同步链式调用、ctx/参数、once 重入、当前派发快照、按原回调移除 once、异常原样抛出且停止余下回调 |
| API-01/05 ready | LIFE.ready-callback/ready-once-after-switches | readyCallback 的 this 和参数均为实例，正常切源不重复 ready |
| API-02 真正播放 | MEDIA.metadata/play-promise/play-result/time-advances/pause-sync-stable/seek | native video 有有效媒体尺寸和 duration；时间推进；pause 同步返回 undefined，观察期间时间稳定；seek 到达目标 |
| API-02 切源 | MEDIA.quality-preserves-time/url-resets-resumes/latest-source、LIFE.restart-url | 暂停中 switchQuality 保留时间和暂停状态；播放中 switchUrl 归零并恢复播放；restart 参数为目标 URL |
| API-02 拒绝 | MEDIA.play-rejects-original | 原始受控 media.play 错误由公开 art.play Promise 原样拒绝；不是 codec/权限测试 |
| API-06 插件 | PLUGIN.async-promise/async-registry/duplicate-throws | async 工厂返回 Promise，结果随后可见、this/参数为 art，兑现值仍为 registry；重名同步抛错并保留原结果 |
| API-05 销毁 | LIFE.destroy-retains-markup/destroy-cleans-proxy/destroy-removes-markup/constructor-plugin-error | destroy(false) 保留 art-destroy 标记，proxy 监听移除、注册表移除；destroy(true) 清空容器；插件初始化异常能传播 |

完整的 27 个 ID 以 lifecycle.mjs 的 lifecycleChecks 为准，斜线缩写共享同一前缀。其余多插件组合、异步构造失败、真实网络重试、mutex、后台/移动端、字幕/SDK/worker 资源和类型测试仍由 BASE-08、ENG-05 和对应 CORE/包任务补齐。

记录的事件顺序有语义校验：loadedmetadata 在 ready 前；首次播放 native play -> native playing -> 公开 play；公开 pause 同步发生，native pause 随后到达；质量切换的 canplay 观察回调在 restart 前。原始 trace 保留更完整数据，但不把所有 native 事件计数、绝对媒体时间或跨阶段到达的 seeked 固定为全浏览器契约。

## 历史问题台账

这些发现不是必须永久保留的 API，也不是本次已修复。对应任务需要添加候选回归并记录兼容处理；不能通过要求旧缺陷继续发生来判断重构成功。

| ID | 发布版实测 | 负责修复/核对 | 判断边界 |
| --- | --- | --- | --- |
| BASE-LIFE-01 | 连续两个 switchUrl 在最后一个源的一次 canplay 后都兑现，旧操作没有独立完成依据 | CORE-09 | 最后源正确；过期操作结果语义需要明确，不直接推断发生了内容覆盖 |
| BASE-LIFE-02 | switchUrl 后立即 destroy，Promise 在至少 250ms 观察窗口内仍未结算 | CORE-09，关联 CORE-04 | 这是有界观察；不能仅凭窗口称永远 pending。源码移除 native 事件后缺少取消结算路径 |
| BASE-LIFE-03 | 异步插件结果在 destroy 后仍被注册 | CORE-08 | 已确认晚到注册；没有将它夸大为所有插件都泄漏资源 |
| BASE-LIFE-04 | A/B 两实例，A 连续 destroy 两次后 B 从 Artplayer.instances 消失 | CORE-04 | B 仍是活实例；探针随后显式销毁 B，避免污染后续用例 |
| BASE-LIFE-05 | 构造过程插件抛错后，已初始化的 DOM 和 57 个监听清理项仍存在，但实例未进入注册表 | CORE-04 | 探针持有失败实例并主动清理；57 为本次配置实测，不冻结为跨环境数量 |
| BASE-LIFE-06 | 已发布版本切源恢复 play 拒绝，产生未处理拒绝且切源 Promise 在观察窗口内仍 pending | CORE-09 | 受控错误注入。当前工作区 switchMix 已使用 silencePromise，原 playback 测试覆盖该修复；重构必须保持这项已有改进，不能倒退成发布版行为 |

发布产物中的 switchMix、playMix、Events 与工作区源码已对照。BASE-LIFE-04 的原因是没有检查 instances.indexOf(this) 的 -1 就 splice；BASE-LIFE-03 的注册管理器没有销毁状态检查；BASE-LIFE-05 构造链没有异常回收路径。它们由后续实现任务处理，不在基线采集时修改播放器。

## 重跑和报告检查

1. `node refactor/scripts/browser-server.mjs`；默认 http://127.0.0.1:8083/fixtures/lifecycle.html。
2. Chrome 不可用时直接用内置浏览器。每次 reload 后点击 Run lifecycle baseline，确认 CAPTURE COMPLETE、errors/unhandled 为空，并阅读 historical findings；这个状态表示采集完成，不表示没有缺陷。
3. `node refactor/scripts/lifecycle.mjs --compare refactor/.cache/reports/lifecycle.json`，验证媒体、来源、事件顺序，再比较稳定的发布版观察结果。
4. `node refactor/scripts/lifecycle.mjs --check` 只验证保存的报告。`yarn test:baseline` 包含报告校验负例：伪造播放推进、意外拒绝、事件颠倒会失败，合理时钟抖动不会造成快照失败。这些 Node 命令不重新执行浏览器。

lifecycleProfile 排除波动的时钟值和 native 事件次数，但保留已观察的 Promise、插件、实例注册及失败构造结果。它用于复验固定旧版本；候选修复历史问题后应采用正向回归与差异记录，不要求候选满足同一缺陷 profile。正式自动浏览器框架与候选包矩阵由 ENG-05/07 接续。
