# 性能与资源基线

BASE-06 使用固定发布 core 5.4.0 / chapter 1.1.0、本地 video.mp4 和 640x360 容器。两次独立页面重载，每次 12 个计时样本和 6 个资源探针；保留原始数据、预热标记和来源，见 [performance.json](performance.json)。没有修改生产实现，本任务不声称任何优化收益。

## 环境与采样

- Codex 内置浏览器，UA Chrome 152.0.0.0 / Windows，viewport 890x1272，devicePixelRatio=1，全程 visible，无 visibilitychange。
- 浏览器报告 hardwareConcurrency=12、deviceMemory=32；这些是浏览器暴露值。测量后独立 Windows CIM 查询为 i5-12400F / 6 物理核心 / 12 逻辑线程 / 31.8 GiB 内存，记录在 hostContext，不将浏览器字段当硬件容量证明。
- 发布 JS、夹具 LF 指纹和媒体 SHA-256 均绑定报告；固定本地服务返回 no-store，但未强制清空操作系统/解码器/连接缓存，不能称严格冷启动。其他应用负载、CPU 电源/温度和浏览器调度未锁定。
- 每轮 core/chapter 交错执行，各 1 个预热、5 个计时样本；原始预热也保留。构造同步耗时、构造到 ready、play Promise 兑现、destroy 同步耗时分别测量。ready 通过 RAF 轮询已就绪状态，包含约一帧的观察量化和本地媒体初始化，不能称精确解码延迟。
- 每个样本真实播放 currentTime 至少前进 0.15 秒，然后暂停、销毁；不通过固定 sleep 假装媒体就绪。没有测完整片段播放、FPS、 dropped frames、seek 热路径、首个呈现帧或下载耗时。

## 两轮计时结果

以下均为各 5 个非预热样本的中位数，单位 ms；完整 min/median/max 在报告中。样本量不足以报告有意义的尾部百分位或置信收益。

| 配置/轮次 | constructor | ready | play Promise | destroy |
| --- | ---: | ---: | ---: | ---: |
| core 第一轮 | 5.60 | 30.20 | 3.00 | 3.00 |
| chapter 第一轮 | 5.70 | 29.80 | 3.40 | 3.10 |
| core 第二轮 | 4.10 | 12.80 | 3.10 | 2.80 |
| chapter 第二轮 | 5.00 | 14.50 | 1.40 | 3.20 |

代码完全相同，ready 中位数仍明显变化，说明一次快慢差异不足以证明优化。后续候选须在相同浏览器/设备/viewport/样本/配置中交错旧新运行，至少三组配对复测后评估，不拿这张旧表与不同机器/浏览器直接比较。

## 资源观察

计时样本不替换定时器。资源探针另行临时追踪 window timeout/interval/RAF，并显式启用 USE_RAF=true；默认计时保持发布默认 USE_RAF=false。探针保留原生回调 this、参数、句柄和取消行为，但任何 instrumentation 仍可能扰动时序，因此资源探针的耗时不纳入性能比较。

每轮资源 probe 运行 core/chapter 各三次：实际播放至至少两个 raf 事件、开启 notice、触发一个自定义代理事件，以及受控的 synthetic window resize 后立即 destroy。350ms 是销毁后观察窗口，不是等待媒体加载的固定延迟。

| 观察面 | 两轮实际结果 | 判断界限 |
| --- | --- | --- |
| 计时样本 DOM / 实例 / proxy 清理 Set | 每次挂载 core 113 节点、chapter 125 节点；57 个代理清理项；销毁后均为 0 | 数量是本配置的观察，不是必须永远固定的内部结构；Set 为内部账本，不等同全浏览器原生监听器统计 |
| video | 每次销毁后 paused=true、src 属性移除 | 未证明网络连接、解码器、GPU 内存即时释放 |
| 资源探针自定义代理 | 销毁前收到一次，销毁后再次 dispatch 不增加调用 | 真实 DOM 事件分发但为受控 synthetic 事件，不冒充用户输入 |
| RAF | 销毁前至少 2 次；销毁后 0 次 | 检查 opt-in USE_RAF 路径，不等于所有插件的动画循环通过 |
| pending resize / notice | 每次销毁后仍有 200ms timeout；它执行一次 resize，随后创建新的 2000ms notice timeout；350ms 后仍在记录中 | BASE-PERF-01，见下节；不是已经修复或永久泄漏证明 |

两轮六组资源状态相同，errors/unhandled 与浏览器 error/warn 日志为空，最终 Artplayer.instances=0。探针先保存未清资源，再用原生取消函数清理其追踪到的剩余句柄并恢复 API；**此额外清理不能算作播放器自己的清理成功**。追踪器本身会临时持有回调/句柄，未进行 heap snapshot、强制 GC、detached-node 可达性或进程 RSS 测量，不能给出“无内存泄漏”结论。

### BASE-PERF-01：销毁后的 resize 工作

受控 window resize 在 destroy 前安排 debounce，destroy 清掉 DOM 代理、现有 Info/Notice timer 和 RAF，但没有取消该 debounce。晚到回调再次 emit resize，aspectRatio setter 又安排 notice timeout。当前源码 resizeInit、utils/time、aspectRatioMix 与发布行为一致；CORE-17 负责取消/晚到事件，关联 CORE-04 生命周期和 CORE-18 notice 防线。

后续应增加候选正向断言：销毁后没有该 resize 回调及新通知计时器，同时保持正常 resize 时序和公开快捷键。不要要求候选继续满足历史异常 profile，也不要只延长等待至 timer 自然结束来掩盖失去生命周期归属的问题。旧实现的现象仅在此有界窗口确认，不能直接断言永久保留内存。

## 包体积与审查阈值

[sizes.json](sizes.json) 分别保存 28 个真实发布 JS 文件和 85 个工作区 JS 文件的 raw/gzip9/Brotli6 字节数。工作区覆盖 21 库并匹配 BASE-05 的历史观察哈希，可能包含陈旧 dist，不能当作 21 包的真实 npm 版本。文档站没有库 bundle 入口，其站点体积由 SITE/ENG-08 单独测量。压缩使用固定 Node 24.21.0 及记录的 zlib/Brotli 版本，单文件独立压缩不是生产 HTTP 实际传输量或安装后大小。

| 发布主文件 | raw bytes | gzip level 9 | Brotli quality 6 |
| --- | ---: | ---: | ---: |
| core .js | 134037 | 35486 | 32533 |
| core .legacy.js | 135748 | 36021 | 33045 |
| core .mjs | 208826 | 43868 | 40443 |
| chapter .js / .legacy.js，各自 | 4973 | 1850 | 1653 |
| chapter .mjs | 7721 | 2126 | 1904 |

阈值是初始审查规则，不是测得的收益承诺或单次自动发布裁决：

- 同环境中位数增加超过 max(25%, 绝对容差) 才产生计时 review signal；constructor/destroy 容差 2ms，ready 50ms，play Promise 10ms。绝对容差防止毫秒级噪声因比例被夸大；ready 容差还考虑 RAF/媒体噪声。发布前 ENG-08/MOD-03 结合更多配对样本复核阈值。
- 同一分发文件、相同压缩方法增加超过 max(5%, 1024 bytes) 必须解释。不同格式、总安装体积、不同来源不可混比；较小变化不豁免接口或依赖审查。
- 新增可复现的销毁后监听响应、RAF、DOM/实例持续增长或未说明残留资源属于功能/生命周期阻断项，不能用计时改善抵消。BASE-PERF-01 作为已有问题有明确修复责任。

## 命令和维护入口

1. 运行 `node refactor/scripts/browser-server.mjs`，打开 `http://127.0.0.1:8083/fixtures/performance.html` 并点击 Run performance baseline。保持前台，采样期间不要同时构建/压缩或运行其他重负载。
2. 显示 Saved 12 timing samples and 6 resource probes / errors 0 后，运行 `node refactor/scripts/performance.mjs --compare refactor/.cache/reports/performance.json`。比较会验证来源、媒体、前台状态及基本清理，再输出中位数、计时审查信号和资源 profile 差异；时间信号要求配对复测。
3. 重载重复，保留每轮报告，不覆盖历史证据。`performance.mjs --check` 只校验已存报告，不重跑浏览器。`sizes.mjs --check` 会重算真实发布文件压缩大小，工作区部分仍为历史清单。
4. `node --test refactor/scripts/performance.test.mjs` / `yarn test:baseline` 包含假播放、后台、缺样本、清理失败、设备不一致、重大变慢和体积遗漏负例。计时比较排除预热，并允许候选修正历史残留后报告明确差异。

performance.js 负责实际采样与有限资源追踪，performance.mjs 负责数据有效性、统计和比较，sizes.mjs 负责内容哈希与压缩。任务归属：BASE-06 提供首批基线；ENG-08 参数化候选与趋势/体积准入；MOD-03 核心性能、MOD-04 重型插件/proxy、CORE-17/04/18 处理已复现残留。未覆盖的字幕/worker/模型/网络/GPU/真机长期资源验证仍由对应包和发布复盘承担。
