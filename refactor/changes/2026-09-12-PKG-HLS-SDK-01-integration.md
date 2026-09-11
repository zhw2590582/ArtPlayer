# PKG-HLS-SDK-01：真实 worker 与分组轨道验证（进行中）

本子任务来自 PKG-HLS-05，负责可独立取证的桌面 SDK worker、分组轨道与重绑定。
父任务增加对子任务的依赖，仍要求真实设备/SDK 证据，不因拆分而降低完成条件。
当前子任务保持 doing，尚无完成提交；HLS-CRASH-01 未解释，不能继承为正常通过。

## 已实现

- 固定 Hls.js 1.5.17 和核实时 npm latest 为 1.7.2 的两个归档。SHA-512、SHA-256、
  选定源/运行/许可文件均核验；历史冻结对象保持相同。版本元数据 URL 及获取时间见
  baselines/hls-sdk-matrix.json。新版本来源为 https://registry.npmjs.org/hls.js/1.7.2，
  上游变更核对 https://github.com/video-dev/hls.js/releases，不执行浮动 latest 测试。
- test/browser/hls-sdk.spec.js 使用原生 Worker 子类观察 init/transmuxComplete/error/
  terminate，所有操作委托实际 Worker。视频帧、媒体时钟和 enableWorker 保持启用共同验证，
  防止只设置开关或发生 SDK main-thread fallback 后仍冒充 worker 通过。
- 新旧核心与插件四组合覆盖两个固定 SDK、真实播放/seek、换成无音轨来源和 worker 清理。
  候选插件另覆盖实际 detach/reattach、两档位不同音轨组、重编号/偏好保持和 UI 选择。
  Commentary 复用 English 正弦样本，只验证轨道拓扑，不声称真实语音或音频语言识别。
- 新增 baseline runner 用例核验 SDK 归档、Apache-2.0 许可和未引入运行时依赖；现有
  ci:check 纳入它。生产代码/构建产物保持 HLS-04 提交 2f9bee4e，未因 SDK 测试升级生产依赖。

## 已执行与未解释失败

完整本地 CI 537 项通过（496 单元、11 工程、30 基线），254 个生产 TS 文件严格检查通过。
首轮 Chromium 18 项通过。随后 main/legacy 完整矩阵各 38 passed、16 skipped。
强化新实例 worker 启用/错误断言后，一次 main 运行出现 37 passed、16 skipped、1 failed：
Firefox、Hls 1.5.17、候选核心在高低音轨组切换后的 destroy 附近出现 Target crashed。
错误发生在实际 destroy 返回后读取 worker 终止状态，无法从已关闭页面获取诊断状态。
目前没有证据将其归因于插件、核心、Hls、浏览器或内存压力，不称为“环境偶发已解决”。

随后同样源码的 legacy 完整矩阵和 main 完整复核各 38 passed、16 skipped；
Firefox 两个 SDK × 新旧核心分组场景各重复三次，共 12 passed。这些结果不关闭首次失败。
另进行 DEBUG=pw:browser + trace=on 的五次重复诊断，保留独立报告/trace 目录。
该轮 20 项中 19 通过、1 失败，未复现首次崩溃，但出现另一种失败：Firefox、Hls 1.7.2、
旧核心的组切换后音轨组已更新、视频仍为 90P，7 秒未达到 180P。SDK 有非致命 aborted
记录，未收到对应 LEVEL_SWITCHED=1。此问题另记 HLS-PLAYBACK-01，不混称崩溃已在旧核心复现。
有实际 SDK/浏览器状态及完整 trace，后续需直接 Hls 对照与时序取证；不扩大等待来掩盖。
首次失败报告/错误栈保留；首次 trace 所在共享结果目录被后续套件覆盖，不能声称 trace 仍在。
后续诊断复制完整 results 至专用 cache 路径，避免再丢失。

冻结的当前进度见 baselines/hls-sdk-validation.json，状态 partial-unresolved-crash。
其中记录首次失败、后续重复、完整矩阵、输入指纹及原生 worker 消息计数，不能只引用绿灯摘要。
浏览器报告中的 skipped 仅为 Windows WebKit 无 MSE；每个 SDK 的能力/失败清理实际执行。

## 剩余与接续

HLS-CRASH-01/HLS-PLAYBACK-01：继续保留失败并追查 Firefox 销毁崩溃和独立切组卡住；
定位前不完成本子任务。
适当的下一步是浏览器诊断日志/崩溃证据与直接 Hls+原生 video 对照，避免靠反复重跑宣布修复。
父 HLS-05 还包括 Safari/native、真机和完整 SDK/网络范围；HLS-06 包含例子/隔离安装分发。
本轮 1.7.2 只提供运行时验证，公开 SDK 类型消费仍以 HLS-04 的实际 1.5.17 为已验证范围。
没有将两个 SDK 点版本称为整个区间或新的最低版本。SDK-01/HLS-ENV-01 继续 open。

当前任务可提交明确标注 checkpoint 的诊断进度，但状态仍为 doing，不计入完成数。
满足原验收后仍须独立完成提交；checkpoint 不代表任一风险已关闭。
没有 push/tag/publish/merge。全项目目标继续。

## 后续诊断入口与当前判断

新增 refactor/scripts/hls-sdk-diagnostic.mjs：固定 SDK、确定性媒体和本地随机端口服务器，
可选择普通 HTTP/Playwright route、直接原生 video/发布核心/候选核心、是否安装候选插件、
SDK 调试日志、worker 开关/观察器以及直接 video 的销毁顺序。日志包含 SDK/媒体事件、
暂停/缓冲区/时钟与最终状态；每次运行使用专用目录保存每轮 trace 和报告。
直接模式不加载 ArtPlayer/插件，报告检查其 global 为 undefined；三种宿主的输入字节均记录。
此工具用于对照取证，不以诊断重复通过替代原场景或发布验收。

```sh
node refactor/scripts/hls-sdk-diagnostic.mjs --version 1.7.2 --iterations 10 --transport route
node refactor/scripts/hls-sdk-diagnostic.mjs --version 1.7.2 --iterations 10 --transport route --host published --plugin --observe-workers
node refactor/scripts/hls-sdk-diagnostic.mjs --version 1.5.17 --iterations 5 --transport route --host candidate --plugin --observe-workers
```

共享 test/helpers/worker-observer.js 保留原生 Worker 操作；grouped playlist 移到
test/browser/fixtures/hls-grouped.m3u8，内容与先前内嵌字符串相同，避免两套样本漂移。
原集成测试补充 paused、readyState、buffered 和 SDK 事件当时的媒体状态，保持原断言及超时。
移动 helper 后的一次完整 main 矩阵仍为 38 passed、16 skipped，trace 独立保存。

初始直接 HTTP/route 及更接近真实切轨完成顺序的 direct 对照各十次通过；
旧核心初始化在异步 customType 前暴露 video 尚未赋值，一轮新诊断脚本因此自身失败，
已改为动态 getter 与就绪条件，这不是播放器缺陷，不能计入 SDK 通过/失败归因。
其后带 SDK 日志的三宿主并行各 15 次通过，关闭 SDK 日志/采用相同条件轮询各十次通过，
加入相同 Worker 观察器后各十次通过。没有证明任一宿主/日志/路由/观察器是原因。
1.5.17 同样安排直接、旧核心、候选核心观察器对照各五次，结果与版本/指纹另存
baselines/hls-sdk-diagnostics.json；旧失败文件 hls-sdk-validation.json 不覆盖。

1.5.17 对照确实再次捕获崩溃：直接原生 video 与候选核心均出现 page crashed；
直接模式没有加载 ArtPlayer/插件（输入文件和 runner 分支可核对）。候选核心关闭 Worker
观察器后也出现两次崩溃，所以既不能只归因于核心，也不能只归因于 Worker 观察器。
直接模式关闭观察器、以及先销毁 SDK 再清理 video 的有限对照通过；尚不足以确定修复策略。

这些诊断还暴露早期 runner 的计数问题：操作断言完成后，最后状态读取失败或稍后 crash
没有改写 passed。现在状态/trace/关闭错误及 pageerror/crash 都参与最终结果，结束前再次核对。
冻结汇总保留原 recordedStatus，并按原始 errors/state.error 重算 effective status，
不是通过删除失败来刷新统计。全部有效诊断共 184 passed、6 failed；另有前述十条脚本自身
初始化失败单列排除。此处通过数不是发布矩阵通过数，未解释失败仍阻止本子任务完成。

目前不能从这些有限对照推出“已修复”或具体的“上游缺陷”。两风险保留 open，本子任务保持 doing。
下一轮优先比较非插桩/非路由的 1.5.17 worker 销毁与禁用 worker 控制，并保留最后销毁前
状态或原生崩溃证据。没有依据提前更改核心公开 destroy 顺序或消费者拥有的 SDK 配置。
继续其他无依赖的包迁移时，HLS 的原生/设备/压力与复盘门槛仍必须回来完成。
