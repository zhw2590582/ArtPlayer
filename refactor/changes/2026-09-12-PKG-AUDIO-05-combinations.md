# PKG-AUDIO-05：同步边界与真实媒体组合

状态：未完成；起点 13c898c1，已核实 Audio-04 独立提交且工作区干净。

覆盖已发布核心和候选核心，与旧/新 audio 的合法组合。先验证主视频连续切源、
暂停后恢复、外部音频多实例隔离，以及正/负偏移和超时长的真实媒体行为，再补真实
网络缓冲/恢复。保留浏览器事件、输入指纹、失败报告和 trace，不能以受控 emit
充当真实 waiting。物理设备和实际声音输出缺口继续明确记录。

Audio-04 的模块边界及旧类型入口不变；发现问题先比较已发布行为并登记兼容差异。

首轮 36 项为 28 通过、8 失败。六项是候选核心（所有三引擎、两种 audio）连续切源
最终视频与音频均停在 0：源码每次重新读取 playing，第二次读到前一次内部 pause
后的 false，原播放意图丢失。已拆 CORE-24 为独立修复与提交，Audio-05 暂回 todo
等待前置；不把核心历史阶段通过视为已覆盖这次新发现。

另有 WebKit 旧核心 + 新 audio 切源后视频继续、音频暂停的失败，AUDIO-RESUME-01
保持 open，继续核实 seeked/canplay 就绪时序。旧核心 + 旧 audio 边界返回 16.01
而断言精确 16，需原生媒体对照，不算候选回归。没有跳过或重试这些失败。
原始报告和 trace 已独立保存，见 [首轮证据](../baselines/audio-combinations-first.json)。

共用输入/事件/清理辅助移入 audio-fixture.js，通过显式 useAudioFixture() 为每个测试
文件注册各自 hooks，避免 import 缓存让后一个 suite 缺输入。原有媒体用例也会重跑。
本阶段只提交明确标注 checkpoint 的测试与发现，未提交生产修复，也未完成 Audio-05。

## CORE-24 后恢复实施

0218196d 已核实，工作区干净。六项候选核心切源回归已由 CORE-24 修复并重跑原断言。
Audio-05 恢复 doing；继续旧核心 WebKit 的音频恢复、边界原生对照和真实网络缓冲。

## 第二个检查点：已修复时间零恢复，保留缓冲缺口

本次有生产修复，仍不是 Audio-05 完成提交。index.ts 的 resume 判断优先采用 proxy
显式 playing 布尔值；原生媒体在时间零、未暂停/未结束且 readyState>2 时也可恢复。
canplay 只对暂停音频且宿主可播放的状态补恢复，监听仍由当前实例统一解绑。模块职责、
public 类型、update 同步返回、默认 offset/sync、音频身份和 URL 真值语义不变。

修复前日志精确显示 video:playing/seeking/seeked 的时间为 0、readyState=4、paused=false，
而 art.playing=false。不是先前猜测的 readyState=2。先加受控失败用例，修复后源/历史
共 46 项、三格式产物共 97 项通过。主/legacy 实际构建分别 78 项浏览器测试通过，无重试
或跳过；每组含 36 新旧组合、原 42 媒体项，其中 9 项历史缺陷观察和 3 项 WAV 原生诊断。
完整 CI 599 项通过（550 单元、14 工程、35 基线）；声明校验和严格类型通过。
保留生成声明的一条既有 ESLint warning，没有新 lint error。

负偏移和超过时长现在与同文件独立原生 Audio 比较。main 首轮 78 通过；legacy 首轮
77 通过/1 失败，失败是原生负 seek 的实际 0.01 与严格 0 不等。记录此证据后，对两端
统一使用小于 0.05 秒的原生边界/候选差值断言，同时检查起点非负、无错误及区间内恢复。
最终 main/legacy 重新执行各 78 项通过。负/超时长的状态在断言之前保存，方便后续诊断。

新增 loopback media-gate 及三项真实 HTTP 测试，已纳入 test:node，没有新依赖。
真实缓冲测试保留完整四种新旧组合和三个引擎的要求，初轮 Chromium/Firefox 16 通过、
Windows WebKit 8 失败。换为有强 ETag 的完整部分 Range 响应后 WebKit 8 项仍失败；
没有删掉失败用例。原生 preload=auto 对照两种响应形状，证明 Chromium/Firefox 可以推进
后 waiting，Windows WebKit 此输入则没有推进到缓冲；12 项诊断通过仅证明观测与放行后恢复。
最初原生默认 preload 导致 Firefox 也不推进，已对齐插件属性，保留前后两个报告。
此独立原生观察不证明真实 Safari 不支持，也不替代插件实际缓冲验收。
最终流式夹具对实际 main/legacy 在 Chromium/Firefox 分别执行 16 项，均通过；这是明确
限定引擎的补充验证，不能覆盖之前保留的 Windows WebKit 失败。

证据和报告指纹见 [本次冻结记录](../baselines/audio-combinations-checkpoint.json)。所有首轮失败
报告/trace 按独立路径保留。原始报告中的附件仍写共用路径，读取时使用记录的复制结果目录；
cache 不入 Git，丢失后应按命令重跑，不能声称旧 trace 永久可用。

AUDIO-RESUME-01 按具体切源恢复范围关闭；AUDIO-SYNC-01 与新增 AUDIO-BUFFER-01
保持 open，任务仍为 doing。下一步需要有效原生环境补齐缓冲，并继续策略/设备要求；
Audio-06 的 tarball/8082 demo 仍待验收。其他独立包可继续，不能将该缺口升级成全局阻塞。
本检查点未更改包版本、推送、打 tag 或发布。回退整个本次提交可恢复 CORE-24 后的
候选音频行为；已确认的时间零恢复问题会随生产修复回退而重新出现。
