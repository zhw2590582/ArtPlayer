# PKG-MB-09 持续播放检查点

任务保持doing。本轮新增独立的持续播放测试入口，验证发布核心与候选核心下的MediaBunny
已构建main产物。没有更改生产实现、公开API、依赖或发布版本。

## 可重复运行

HLS生成脚本新增第三个参数duration（12到3600整数秒），省略时仍生成原12秒素材。
禁止覆盖已存在目录，manifest记录FFmpeg版本、完整参数、每个文件的SHA256及大小。
600秒素材包含160×90/320×180、24fps H.264和English/French两条AAC正弦音轨。
长素材放在缓存，未替换已经冻结的短素材。每次测试验证manifest中所有媒体文件哈希。

```powershell
yarn generate:media:hls refactor/.cache/mb-long-hls 600
$env:ARTPLAYER_MB_ARTIFACT = (Resolve-Path packages/artplayer-proxy-mediabunny/dist/artplayer-proxy-mediabunny.js).Path
$env:ARTPLAYER_MB_SOAK_MEDIA = (Resolve-Path refactor/.cache/mb-long-hls).Path
yarn test:mediabunny-soak
```

使用现有已验证的构建流程生成待测产物。显式产物和媒体目录为必需参数，不允许悄悄回退
到源码构建。测试核心来源仍由browser-evidence中的manifest标识，默认候选核心为工作区
构建；若使用ARTPLAYER_BROWSER_ARTIFACTS，则按既有服务器规则读取指定核心产物。

独立playwright.soak.config.js读取test/soak，两个worker，每项270秒超时、零重试，
不会被日常test:browser自动发现。沿用8084服务器，禁止与普通浏览器测试同时运行。
结果保存refactor/.cache/soak/report.json和results；下一轮前归档整个目录。
当前入口用于本地专项验收，尚未接入GitHub托管长播放job；后续CI/发布复盘需明确安排。

## 验证内容

- 每个支持环境连续90秒墙钟1×、90秒墙钟2×，不循环短素材、不跳转伪造持续时间。
- 每5秒确认媒体时钟与画面绘制继续前进、前台可见、未暂停或报错，以及实际播放速率。
- 包装真实SDK迭代器取得解码Canvas时间戳，比较实际AudioContext主时钟；每阶段保留
  帧数、最大/累计偏差和固定大小的毫秒直方图，阈值250ms。切换操作之间单独记录阶段。
- 连续播放后seek到100秒，再切换90P与French音轨，各阶段继续实际播放至少5秒。
- 包装真实AudioContext节点创建/断开，仅持有在用节点和未完成迭代器；每次采样节点少于96、
  迭代器不超过2。销毁后节点/队列/迭代器归零，AudioContext关闭，创建与断开数量相同，
  再等待300ms确认没有新节点或画面绘制。
- 缺少必要原生构造器的环境单独记录能力对照，不构造播放器，不计作播放通过。

本轮结果与完整CI已写入下方证据。失败记录保留，遇到实际缺陷先定位、修复并回归，
不会通过放宽阈值或把失败改为能力缺失来完成验收。

## 证据边界

这是至少195秒的实际墙钟组合，不能推导数小时音画漂移、声学输出同步、GC堆无泄漏、
后台节流或物理设备支持。资源断开计数只证明被测原生节点/迭代器的生命周期，不是完整
内存分析。前面的原生Document PiP检查点也只覆盖可见opener；MB-CAP-01、MB-LIFE-01
和MB-LICENSE-01仍按各自完整关闭条件继续，不由本检查点自动关闭。

## 本机验收结果

六项全部通过，其中Chromium/Firefox四项实际播放；两项Windows WebKit缺失能力对照
不计播放。四个原生场景都完成至少195秒墙钟播放、seek/quality/audio及destroy清理。

| 引擎 / 核心 | 五阶段墙钟合计 | 最大AV时钟偏差 | 创建 / 断开节点 | 同时在用峰值 |
| --- | --- | --- | --- | --- |
| chromium / published | 195.48s | 42.00ms | 13661 / 13661 | 64 |
| chromium / candidate | 195.52s | 41.33ms | 13661 / 13661 | 64 |
| firefox / published | 195.62s | 45.67ms | 13659 / 13659 | 64 |
| firefox / candidate | 195.62s | 51.33ms | 13675 / 13675 | 64 |

完整CI1418项和44重复契约通过，324生产TS。默认12秒生成结果与原冻结manifest、
FFmpeg版本、命令和32文件哈希完全一致。新长素材1208文件的manifest按LF归一化保存，
缓存报告保留原始字节哈希及完整results；每项原始附件包含固定直方图及逐5秒采样。
见[持续播放证据](../baselines/mb-sustained-validation.json)和[素材清单](../baselines/mb-sustained-media.json)。
本轮未发现需要修改生产实现的新运行时缺陷；新增的是可重复专项验证与工程入口。
任务保持doing并专用检查点提交，无推送或发布。
