# PKG-MB-09：数小时播放验收入口

任务保持 doing。本检查点扩展现有持续播放验收；不以入口实现替代长测结果。
当前核心/MediaBunny 公开接口、运行时代码及发布产物不变。

## 执行与维护

`ARTPLAYER_MB_SOAK_SECONDS` 指定每个连续阶段的实际墙钟秒数，默认仍为 90，
仅允许 90..3600 整数。3600 模式执行连续一小时 1×、一小时 2×，随后保留 seek、
质量/音轨切换和 destroy 清理。两段连续阶段之间不 seek、循环或修改媒体时钟。
每项超时是两段目标墙钟加原有 90 秒操作余量；默认仍是 270 秒，未放宽原有断言。
媒体必须至少覆盖 `max(600, 3 * phaseSeconds + 60)` 秒；不足在启动浏览器前失败。

生成器最大素材时长由 3600 扩展到 14400 秒，仍禁止覆盖既有目录。默认 12 秒素材
已重新生成，32 个文件、FFmpeg 参数和哈希全部与原冻结 manifest 相同。

```powershell
yarn generate:media:hls refactor/.cache/mb09-hour-hls 11000
$env:ARTPLAYER_MB_SOAK_SECONDS = '3600'
$env:ARTPLAYER_MB_SOAK_MEDIA = (Resolve-Path refactor/.cache/mb09-hour-hls).Path
$env:ARTPLAYER_BROWSER_ARTIFACTS = (Resolve-Path refactor/.cache/packages/run-kK0VCe/browser-artifacts.json).Path
Remove-Item Env:ARTPLAYER_MB_ARTIFACT -ErrorAction SilentlyContinue
yarn test:mediabunny-soak --project chromium --project firefox
```

该安装映射对应已登记的 core 6.0.0 / MediaBunny 2.0.0 文件，实际来源由既有校验器
及浏览器附件记录。共享工程变动后旧候选输入指纹失效，使用固定运行时字节测试不表示
通过发布准入；未来运行必须明确选择当时的安装映射。

修复原入口对 `ARTPLAYER_MB_ARTIFACT` 的无条件要求：现在允许显式构建文件或经过
验证的安装映射，仍禁止隐式源码编译，同时指定覆盖值仍由现有 helper 拒绝。
长素材按需读取，只常驻文件索引；初始化核对全部哈希，每次响应前再次核对分片，
不再把整套媒体字节复制到每个 worker 的常驻 Map。

每 5 秒另写逐用例 `progress.jsonl`，记录媒体/墙钟、绘制、节点/迭代器、可见性与
累计最大 AV 偏差；进程中断时也保留采样。原有最终附件、AV 250ms 阈值、活动节点
上限、推进速度和清理检查不变。时长参数位于 `test/helpers/soak-options.js`，
由 Playwright 配置和用例共享，避免超时与媒体长度计算漂移。

## 当前验证与边界

- Node 24.21.0 / Yarn 1.22.22；FFmpeg 与原冻结工具版本相同。
- 参数与启动拒绝测试 3/3：默认时长/超时保持、边界拒绝、缺少显式产物和短素材拒绝。
- 变更文件只读 lint 通过；安装映射模式 `--list` 成功发现六个原有浏览器/核心用例。
- 默认素材重新生成后的完整 manifest 深比较通过，32 文件及命令没有改变。
- 11,000 秒素材生成完成，22,008 文件 / 598,523,989 字节，manifest 摘要和工具信息
  见[启动证据](../baselines/mb-hour-soak-start.json)。开始采样时 Chromium 新旧核心都在
  1× 实际推进，无媒体错误、活动节点分别 50/53、AV 最大偏差约 25ms。
  这些是约 55 秒时的中途状态，不是数小时通过结论。

Chromium/Firefox 新旧核心四项以两个 worker 执行，理想执行约四小时加启动/切换清理。
不要同时启动占用 8084 的普通浏览器测试。运行前归档旧 `refactor/.cache/soak`；
运行中依据实际进程句柄与 progress 文件观察，不把未完成报告或锁文件当成功。
失败时保留日志和采样，不提高阈值或重试直到通过。

即使通过，也不证明声学输出同步、完整堆/GPU无泄漏、后台节流、物理设备或全部插件组合。
WebKit 缺失原生 WebCodecs 的对照不算播放；MB-09 与相关风险继续保留未完成项。
