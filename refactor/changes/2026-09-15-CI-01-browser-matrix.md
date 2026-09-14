# CI-01 按浏览器引擎拆分播放作业

## 原因与实现

上一个检查点仅弹幕/Mask 安装子集就运行了 22.5 分钟。原 browser-smoke 每个
系统串行执行 Node 消费者、React/Vue、三个引擎的 source/installed、iframe
history 和性能检查。没有完整远端超时证据，但这批实测足以支持减少单个作业
的串行工作量；不能承诺此次拆分后每个远端组合一定在 60 分钟内完成。

- browser-smoke 使用三个 OS × 三个引擎，共 9 个组合，最多同时运行 6 个。
  每个组合独立冻结安装、正常打包完整 browser 包清单，再执行所选引擎的
  source 和 installed 两个范围。唯一新增参数是 `--project=${{ matrix.browser }}`。
- browser-consumers 每个 OS 一次，共 3 个组合，最多同时运行 3 个。保留同一
  core/chapter tarball 的 Node 20.19.0、22.12.0、标准 24.21.0 消费，以及原有
  React/Vue、iframe history 和性能三引擎检查。恢复 Node 的次序保持不变。
- 两组互不依赖；source/installed 保留 `!cancelled()`，普通失败不会阻止另一
  范围采证，失败仍传入最终结果。每个作业有独立 runner，报告目录不混用。
- 稳定的 CI result 同时依赖 checks、coverage、browser-smoke、browser-consumers。
  任一组失败、取消、跳过、缺失都不能通过。artifact 名增加引擎维度；消费者
  使用独立前缀。既有固定 action SHA、只读权限、精确缓存键和失败上传保留。
- 影响策略将每个必需调用绑定到其实际 job、参数和条件。同名 test:package
  在两个作业有不同用途，不能再只以命令名去重。原先残留的 test:browser
  门槛改为两个真实的 scope 入口；没有通过删除门槛绕过校验。

代价是更多独立 runner 和重复打包。当前没有新增依赖、版本变化或生产 API
变更；没有修改用例断言、重试、超时、既有能力跳过或 installed 包清单。
远端队列、总计费分钟和实际加速幅度仍待测量。

## 验证

环境为 Windows、Node 24.21.0、Yarn 1.22.22；真实浏览器为 Chromium
153.0.8010.12、Firefox 155.0、WebKit 26.6。证据及输入指纹见
[机器记录](../baselines/ci-browser-matrix-validation.json)。

| 验证 | 结果及边界 |
| --- | --- |
| source 完整 collection | 154 文件、4,641 项；三个独立引擎各 1,547 项，按测试 ID 精确比较，并集完全相同且不重叠 |
| installed 完整 collection | 67 文件、1,980 项；三个独立引擎各 660 项，同样精确比较，无遗漏/重复 |
| source 定向实际运行 | Chromium 25、Firefox 25、WebKit 19 通过；WebKit 6 项 ASR 能力跳过 |
| installed 定向实际运行 | Chromium 10、Firefox 10、WebKit 4 通过；WebKit 6 项 ASR 能力跳过 |
| CI 工程测试 | 最终 77/77 通过，5,997.7666 ms；覆盖矩阵/引擎删减、artifact 冲突、跨组依赖、遗漏消费者、结果失败/取消/跳过/缺失和影响策略 |
| 静态检查 | actionlint 1.7.12、改动 JS/MJS 只读 ESLint、check:ci、check:impact --report、严格工具链通过 |

八次 collection 只列出用例，report 的 skipped 不代表实际能力跳过或播放通过。
六次真实运行分别使用 scope 入口加 `--project=<engine> playback.spec.js`；这个
文件正则匹配 source 的 asr-playback、auto-playback、playback 三文件，以及
installed 的 asr-playback、playback 两文件。它们合计 93 通过、12 能力跳过，
零失败、零重试；这不是全量 6,621 项重跑。WebKit 跳过原因是 Windows 下缺少
原生 AudioContext/AudioWorkletNode，不能记录为 ASR 播放成功。

核心旧/新播放器实际解码画面、播放/暂停、seek、切源和销毁仍由既有用例断言。
源码入口清除继承的安装 map；安装入口校验上轮 run-ifGhEv 十八包的构建新鲜度
和安装字节，真实服务的核心摘要与该 map 一致。本次没有重建生产包，因为改变的
是 CI 编排和校验脚本；安装检查拒绝陈旧输入的机制保持执行。

本地报告归档在 `refactor/.cache/ci01-browser-matrix-<scope>-<engine>-collection`
和 `...-playback`。相邻同前缀日志保留实际退出码对应输出。首轮 CI 测试因为旧
影响策略仍要求原作业调用而失败；第二轮暴露同名脚本去重问题，两次日志保留，
修正后全组 77 项通过。没有把最初失败覆盖为通过。

复核 collection 时分别运行两个 scope 的 `--list`，再分别加三个 `--project`；
比较 report 中每个 spec ID 与 projectName 的组合。再次运行前先归档本地同一
scope 的旧报告。完整 CI 使用上述不带文件过滤的工作流命令。

## 尚未完成

CI-01 保持 doing，任务总数 263、已完成 197 不变。远端 Linux/macOS/Windows
全量运行、实际缓存/取消/报告上传/60 分钟预算、分支保护、其余生态分发与设备
门槛尚未验收。既有 Chapter/Audio/DASH/JASSUB 失败未因本轮关闭。

没有推送、触发远端流程、部署或发布。当前改动随独立 CI-01 检查点本地提交；
提交后按 check:commits --report 审计。
