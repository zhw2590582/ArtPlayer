# PKG-HLS-SDK-01：Firefox 原生异常取证

状态仍为 doing；本检查点没有修复或关闭 HLS-CRASH-01 / HLS-PLAYBACK-01。

## 新证据与边界

Windows 的 Playwright Firefox 155.0（firefox-1543）在直接 Hls 1.5.17、
enableWorker=true、HTTP 本地样本、立即切组时捕获到原生异常。没有加载 ArtPlayer
或插件，也没有替换 SDK/worker 输出。播放器与 SDK 配置沿用已有诊断器。

- 首轮 6 次：4 passed、2 failed，两次页面崩溃都在显式 destroy 之前。
  第一次保留 96 条宿主事件，第二次保留 95 条。
- 2026-09-15 09:24:38 UTC（北京时间 17:24:38），PID 29080 的 ProcDump
  记录 unhandled C0000005.ACCESS_VIOLATION 并写出 3,768,909 字节转储。
  SHA-256：`e1b6e514521aa5e1cdc3a4ea5b896b6fd11c7b331dcc6882fbcceff605cd1a31`。
- 转储异常线程 36484，名称 `DOM Worker`；指令地址归属实际加载的 `xul.dll`，
  相对模块偏移 `0x3bc4be0`。异常参数 `[0, 8]` 表示读取地址 `0x8`。
  这只是故障位置及异常元数据，**没有函数名、符号堆栈或已证明的根因**。
- 首次崩溃前最后收到 BUFFER_FLUSHED/video，主控制器 FRAG_LOADING、level 1，
  音频 WAITING_TRACK，两个 SourceBuffer 均为空且 updating=false，播放时钟
  0.413481、90p、10 帧。宿主 receipt phase 是 low-group，后续断言 phase 是
  high-group；异步收集不能证明最后一条事件就是原生异常的直接原因。
- 后续 6 次和最终文件名隔离 smoke 2 次播放全部通过，未产生转储。它们不是修复证据。

三轮分别尝试监控 14、14、10 个经过归属筛选的进程；所有监控进程均已退出。
第一轮两个监控报告权限不足，捕获转储的监控退出码为 1；后两轮各一个监控权限不足。
因此没有声称完整覆盖全部 Firefox 子进程，也没有为此提升到管理员或 SYSTEM。
最终脚本遇到任何监控非零退出、没有目标或未停止监控会返回失败；后两轮即使播放
全通过，整体诊断仍退出 1。详细日志与指纹见[机器证据](../baselines/hls-native-validation.json)。

这次原生异常不能自动解释另一项 Hls 1.7.2 播放停滞，也不能证明所有历史页面崩溃
都具有同一原因。下一步需要匹配本构建的符号/堆栈或能区分触发路径的最小复现；
不以禁用 worker、放宽播放断言或修改 ArtPlayer destroy 顺序代替兼容修复。

## 工具、结构和运行方式

新增 Windows 专用、显式调用的外围诊断，不改动原 HLS runner 的默认路径：

| 文件 | 职责 |
| --- | --- |
| `refactor/scripts/hls-native-diagnostic.mjs` | 启动已有 runner，验证工具，发现目标，保存监控/退出/转储指纹 |
| `refactor/scripts/firefox-process-scope.mjs` | 根据存活 runner 的 PID、创建时间、路径和完整祖先链筛选 Firefox |
| `refactor/scripts/firefox-minidump.mjs` | 有边界检查地读取异常、模块、线程名；不展开堆栈、不上传 |
| 对应两个 `.test.mjs` | 误选其他浏览器、PID 复用、坏时间、祖先缺失、循环和二进制截断等回归 |

[Microsoft ProcDump 12.01](https://learn.microsoft.com/en-us/sysinternals/downloads/procdump)
从官方 `https://download.sysinternals.com/files/Procdump.zip` 下载到忽略的工具缓存。
zip SHA-256：`68e057587b0fd654efa095f76d80d633c0e5c60ea26fd3e7c0011c076bb2d00c`；
procdump64.exe SHA-256：`d1fc99ae304bd1d2bf28abeb62531da959e2431916194981b88c958fd713a8e6`。
实际 FileVersion 为 12.01，Authenticode Valid，签名者 Microsoft Corporation。
每次运行重新核对 exe 哈希、版本和签名。标准 EULA 由 `-accepteula` 接受；
未注册系统级事后调试器。它是可选本地开发工具，不是 npm 依赖或发布包内容。

Node 使用 .node-version 的 24.21.0；Yarn 保持 Classic 1.22.22；需要 PATH 中有
PowerShell 7（本机 7.6.5）。初次尝试 Windows PowerShell 5 因继承的模块环境
无法加载 Security 模块而在启动浏览器前失败，改用本机已验证的 pwsh.exe。

```sh
node --test refactor/scripts/firefox-process-scope.test.mjs refactor/scripts/firefox-minidump.test.mjs
node refactor/scripts/hls-native-diagnostic.mjs --procdump refactor/.cache/toolchains/procdump/procdump64.exe -- --version 1.5.17 --iterations 6 --controller-state --capture-before-destroy --switch-boundary immediate
node refactor/scripts/firefox-minidump.mjs <本次生成的转储路径>
```

监控只按精确 PID 使用 `-mm -e -n 1 -at 10`；不使用全局进程名等待、系统安装、
上传或 kill 选项。每个目标使用不同文件名，避免同秒崩溃覆盖证据。轮询存在发现
窗口，附加也会影响调度，不能把监控期间的通过视为无观察器通过。退出优先交给
原 runner 的 browser.close；如需取消仍在运行的监控，再核对目标身份并使用
`-cancel PID`。不结束用户浏览器、不强杀被调试进程。

解析依据是 Microsoft 的 [MINIDUMP_EXCEPTION_STREAM](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_exception_stream)、
[MINIDUMP_EXCEPTION](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_exception) 和
[MINIDUMP_MODULE](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_module) 定义。
原始转储只保留在本机忽略缓存；提交元数据、有限事件和完整性指纹，不提交进程内存。

## 验证与回退

6 项针对筛选与二进制边界的回归通过；五个新脚本只读 ESLint 通过。
两轮实现检查及最终 smoke 的区别和原始失败都保留，没有把早期报告重写成最终脚本运行。
没有播放器源码、公开 API/类型、依赖清单、锁文件、版本、分发产物修改，无需重建播放器。
撤销本检查点仅移除可选原生诊断与相关说明；不推送、部署、发布或上报第三方 issue。
