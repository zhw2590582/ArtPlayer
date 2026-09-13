# PKG-DANMUKU-02 受控失败基线子项

本记录只交付 02 的受控测试部分，**不代表 PKG-DANMUKU-02 整体完成**。
真实浏览器的时钟、轨道、密集/稀疏负载和可视结果由主任务另行验收。
没有修改生产源码、声明、构建产物、共享元数据或 root scripts；没有启动服务或浏览器。

## 冻结输入与测试方法

复用 [01 发布基线](../baselines/danmuku-release.json) 与
[不可变校验器](../scripts/danmuku-contract.mjs)，执行三个实际实现：

- Git `b0cfbfe3a09a84a295a257e45e4577847588d1cb` 的冻结源码，只在内存打包。
- 真正 npm artplayer-plugin-danmuku@5.3.0 main 字节。
- 同一发布版的 legacy 字节。

[test/helpers/danmuku.js](../../test/helpers/danmuku.js) 提供受控 DOM、时钟、rAF、
timer、fetch 和 Worker transport；配置验证使用实际发布核心 5.4.0 的 validator。
[`danmukuHistorical()`](../../test/helpers/danmuku.js) 返回 `{name,code,coreCode}` 数组；
`danmukuEnvironment(implementation, settings)` 控制请求、帧、回应和资源观察。
其捕获的 Bilibili Blob 内容在独立 VM 中实际执行，XML 的空输入和正常解析不是手写替身。
框架只模拟传输/布局，不把它说成原生 Worker 或真实 DOM/播放验证。

[test/danmuku-failures.test.js](../../test/danmuku-failures.test.js) 每个实现有 14 个场景，
共 42 项历史观察全部通过。测试中的“失败”指真实历史缺陷；这些断言不能用于要求候选
保留缺陷。候选修复必须在后续任务中另加正确行为断言。

## 已复现观察

| 测试场景 | 精确结果 | 后续责任 |
| --- | --- | --- |
| DMK-FAIL-01 fetch rejection | fetch 原拒绝成为未处理拒绝；公开 load 不 settle，未发 :error | 03 |
| DMK-FAIL-02 text rejection | response.text 原拒绝同样脱离公开 load/error 路径 | 03 |
| DMK-FAIL-03 beforeVisible rejection | 异步 rAF 回调 Promise 被忽略，原错成为未处理拒绝；无 :error | 04 |
| DMK-FAIL-04 narrow heatmap | offsetWidth=99 的默认 sampling=0 耗尽 VM 时间预算；显式 sampling=1 正常完成 | 05 |
| DMK-FAIL-05 parser worker error | 未装错误处理；错误投递后 load 不 settle，destroy 也未终止这个 parser worker | 03/05 |
| DMK-FAIL-06 empty XML | 实际 Blob parser 忽略空 XML 而不回消息；load 一直等待，parser worker 活着 | 03 |
| DMK-FAIL-07 Blob URL | 真实 parser 成功后 worker terminate，但对应 URL 没有 revoke | 03/05 |
| DMK-FAIL-08 late parser | destroy 时 parser worker 未终止；之后实际 parser 完成仍向 queue 添加并发 :loaded | 03/05 |
| DMK-FAIL-09 out-of-order load | 两次无参数替换 load，第二次先完成，第一次晚完成将新队列覆盖为旧数据 | 03 |
| DMK-FAIL-10 late function input | destroy 后异步输入继续入队并触发 :loaded | 03 |
| DMK-FAIL-11 late beforeVisible | destroy 后用户 Promise 成功继续创建弹幕 DOM，尝试向已 terminate worker postMessage | 04/05 |
| DMK-FAIL-12 late continuation | worker 消息在 destroy 前送达，await continuation 在 destroy 后将 wait 改成 ready | 04/05 |
| DMK-FAIL-13 competing loops | play + playing 建两条循环；不同 id 的第二请求覆盖 onmessage，第一请求永不 settle | 04 |
| DMK-FAIL-14 remaining frame | 双 start 后 pause/destroy 只取消最后一帧，另一已排定帧仍存在 | 04 |

DMK-FAIL-12 不依赖浏览器在 terminate 后再派发 Worker 消息：测试先完成消息投递，
同步 destroy，再让 Promise continuation 恢复；不会夸大原生 Worker 终止语义。
DMK-FAIL-11 的证据是 DOM 分配与 postMessage 调用尝试，不宣称原生 worker 已终止后
仍执行代码或真的显示弹幕。测试也确认 late worker 分支没有发新的 :visible。

03 需要明确异步取消如何 settle 公开 load Promise、如何保持原错误通知/返回关系；
04/05 需要单一帧循环、每请求关联、generation/销毁防护和 parser/Blob/设置的资源所有权。
这只是后续设计边界，不在本任务提前实现或改变接口。

## 进程隔离与可重复证据

三类未处理拒绝各实现分别运行独立 Node 子进程，共 9 次，固定
`--unhandled-rejections=strict`。只用 `uncaughtExceptionMonitor` 记录原错误、origin、
公开 Promise settled 标记和 :error 数量，不注册吞掉错误的 unhandledRejection 或
uncaughtException 处理器。实际进程 exit 1，monitor 记录 origin=unhandledRejection；
不是把未处理拒绝隐藏到通过结果中。

热力图另有 6 次独立进程：三个 sampling=0，三个 sampling=1 对照。内部 VM 100ms
执行预算明确产生 `ERR_SCRIPT_EXECUTION_TIMEOUT`；对照完成且没有超时。外层进程
还有 3000ms 最终保护，外层超时本身会使测试失败，不能被算作正常观察。
整个重放不会把零步长循环交给真实浏览器页面。

每次测试写独立 `refactor/.cache/danmuku02-controlled/run-*/`，保留 15 个子进程
stdout/stderr/status JSON。最终目录、文件 SHA、脚本 SHA、命令与汇总见
[danmuku-failures-validation.json](../baselines/danmuku-failures-validation.json)。

```text
node --test test/danmuku-failures.test.js
node node_modules/eslint/bin/eslint.js test/helpers/danmuku.js test/danmuku-failures.test.js
```

实际 Node 24.21.0 / Windows，42 passed / 0 failed / 0 skipped；专属 lint 通过。
没有新依赖、没有修改 Yarn lock。缺少归档缓存时，01 verifier 只向冻结 npm URL 请求，
测试本身不会请求 Bilibili、媒体或任何识别服务。

## 未完成范围与回退

尚未覆盖原生 Worker/CSP、真实媒体时钟和 seek/倍率、实际测量的防重叠/轨道顺序、
长时间负载、内存、设置触摸/旋转、mask/fullscreen/PiP/外部挂载、浏览器错误表现。
这些内容仍是 PKG-DANMUKU-02 及后续组合验收的门槛。本报告不标包重构完成或 npm 可发布。

此批只有历史测试与证据，可独立撤销，不影响发布包。整合代理将本子项与 02 的其他
必要证据一起管理状态；不要仅依据这 42 个观察把整个任务标为 done。
