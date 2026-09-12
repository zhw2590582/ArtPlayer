# MediaBunny proxy 验证入口

开始改动前读取[冻结契约](baselines/mb-contract.md)、[接口快照](baselines/mb-surface.json)、
[归档/源码哈希](baselines/mb-release.json)。MB-01接口基线与
[MB-02行为基线](changes/2026-09-12-PKG-MB-02-baseline.md)分开记录；不得把接口测试称为真实媒体验收。

## 可重复命令

使用仓库固定Node 24.21.0、Yarn 1.22.22：

```sh
node refactor/scripts/mb-contract.mjs
node --test refactor/scripts/mb-contract.test.mjs
node --test test/mediabunny.test.js
yarn test:browser test/browser/mediabunny-inputs.spec.js test/browser/mediabunny.spec.js
yarn ci:check
```

归档缺失时仅从固定npm URL下载，并验证SHA-512/SHA-256及逐文件哈希。冻结工作区从明确Git
提交读取，后续迁移不能修改冻结来源。已安装SDK校验来自Yarn锁及原始文件，仅描述候选工具链。

历史测试使用实际main/legacy/ESM；受控Canvas与ArtPlayer事件宿主只测公开接口、方法绑定、
属性写入、默认值和事件桥。空媒体源不会构造真实AudioContext或解码，SDK存在不等于SDK播放已验收。
play/load/seek转发测试刻意截获engine方法；不得宣传为真实播放测试。

## 后续顺序

MB-03实施将input分离为六个strict TS模块，接入加载session、Range取消和SDK Input释放。
实际文件地图见包内ARCHITECTURE.md，过程见[输入迁移](changes/2026-09-12-PKG-MB-03-input.md)。
`yarn test:mediabunny`现在包括24历史、20候选加载及12输入/轨道检查；20加载断言可通过
`ARTPLAYER_MB_BASELINE=1`重跑冻结main，正常控制6通过、缺陷回归14失败。
浏览器默认包含两个发布版与候选，并增加mediabunny-load.spec.js的三种真实Stream取消；
`ARTPLAYER_MB_ARTIFACT`指定构建的UMD文件，`ARTPLAYER_MB_BROWSER_CANDIDATE=1`可仅跑候选。
每轮须读取报告确认具体数量和结果；配置了用例不等于该轮已运行。

1. MB-02的输入、seek、HLS轨道、无轨道和失败样本见行为基线。42项浏览器检查须区分
   20次实际播放、12次能力对照、6次历史输入失败及4次无轨道就绪行为；24项生命周期测试含18个历史缺陷。
   后续修改须复跑对应正常和负例，不把全部负例变为候选豁免；并发选轨、晚帧和音频回调的完整修复分别在04/05/06/07。
2. MB-03输入/取消，MB-04事件/状态协调，MB-05帧调度，MB-06音频时钟，MB-07配对轨道/控件。
   按已批准计划分步迁移，不等到MB-08才一次性堆积全部源码修改。
3. MB-08完成严格TS和公开声明兼容矩阵；保留HTMLCanvasElement精确Result、可选工厂和全工厂
   替换用例，避免重演FACTORY-TYPE-01。1.0.0 namespace.default与1.2.0直接导出分别验证。
4. MB-09新旧核心、AV sync、长播放、原生DPiP和浏览器组合；MB-10实际打包安装、许可来源/通知和8082示例。

Chrome连接不可用时可使用内置浏览器；CLI自动化也按现有Playwright三引擎流程执行。
保留report.json及整个results目录。受控输入不能替代真实解码，iframe不能替代原生Document PiP。
VAST脚本VPN豁免不适用于本包。

## MB-04 coordinator implementation

VideoShim/EventTarget与主协调器已拆为严格TS模块，详情见
[协调器变更](changes/2026-09-12-PKG-MB-04-coordination.md)及
[验证记录](baselines/mb-coordination-validation.json)。包专项命令已包含新的协调器回归用例。
无轨道容器由历史readyState 4改为code 4错误；有效媒体的正常顺序保持，重复就绪和
失效操作结果被阻止。不要把synthetic RAF、受控竞态或Windows WebKit能力对照计为真实播放。
音视频解码器仍通过两个显式声明桥连接，MB-05/06继续实际实现迁移和底层晚操作清理。

## MB-05 video ownership

VideoEngine与迭代器/渲染/海报职责已实际迁移TS，删除视频声明桥；只剩音频声明桥。
执行yarn test:mediabunny及新增mediabunny-video.spec.js，按实际报告区分普通播放、
真实帧竞态、能力对照和synthetic RAF。[变更](changes/2026-09-12-PKG-MB-05-video.md)与
[验证](baselines/mb-video-validation.json)记录38个新断言、旧产物复现及真实解码场景。

## PKG-MB-06 音频归属与时钟

实际AudioEngine迁移并拆为六个TS模块，包内26生产TS，无JS声明桥；m3u8/index由07/08接续。
[变更](changes/2026-09-12-PKG-MB-06-audio.md)记录文件地图、resume归属下移、兼容边界和回退，
[证据](baselines/mb-audio-validation.json)记录旧main 37断言8通过/29失败、候选专项183及
main/legacy各159通过。最终78浏览器含16新增原生音频场景及8新增WebKit能力对照。
同24音频浏览器断言对旧main20通过/4失败，失败为实际暂停后的节点清理；其余为回归对照。
短时1×/2×帧/音频时钟偏差验证不替代长播放、听觉及设备验收；全部报告/results已归档。
完整CI1344项及另44重复契约通过，316生产TS；完成后立即专用提交，MB-LIFE-01剩余范围仍open。

## PKG-MB-07 HLS配对、选择与UI拓扑

实际m3u8迁移并拆成四个TS模块，包内30生产TS，仅index.js由08接续。
[变更](changes/2026-09-12-PKG-MB-07-hls.md)记录刷新/选择/source归属、稳定media配对、
兼容默认值、清理及回退；[证据](baselines/mb-hls-validation.json)记录43条断言旧main
11通过/32失败，候选专项226及main/legacy各202通过。最终108浏览器含20新增原生HLS
新旧核心/UI/SDK场景与10新增能力对照。旧main同30项14通过/16失败，未把能力缺失计作播放。
全部报告/results已归档；完整CI1387项及44重复契约通过，320生产TS；完成后立即专用提交，MB-LIFE-01剩余组合/长播范围仍open。

## PKG-MB-08 入口与声明检查点（doing）

index实际迁移，入口/Canvas桥/生命周期/清理拆为四模块，全包34生产TS。
精确默认Canvas和整工厂保留；可选shim/HLS/RAF视图、ESM声明及旧legacy解析已验证。
15条新断言旧main6通过/9失败，候选专项241及main/legacy各217通过。新增12真实Canvas/
新旧核心场景通过，旧main同12项失败；最终8文件120浏览器通过，其中29能力对照不计作播放。
实际打包安装17类型矩阵通过，候选7组各拒绝15非法用法；旧NodeNext失败保留负例。
见[变更](changes/2026-09-12-PKG-MB-08-entry-checkpoint.md)和[证据](baselines/mb-entry-checkpoint.json)。
完整CI1402项及44重复契约通过，324生产TS。受控canDecode=false已复现旧/候选
video-only输入及替换无sink仍readyState=4；任务保持doing，下一步修复该能力边界。

## PKG-MB-08 完成：能力与公开声明验收

入口检查点后补齐解码能力就绪门槛：全部无sink时通过原code 4通道拒绝，至少一条可用则
保留正常部分播放。16新增Node断言旧main8通过/8失败；候选专项257、main/legacy各233通过。
新增30浏览器中12受控拒绝、8原生部分播放及10能力对照；旧main相同30项18通过/12失败。
最终150浏览器、17组实际安装类型/导出、完整CI1418与44重复契约通过，324生产TS。
[变更](changes/2026-09-12-PKG-MB-08-capability.md)和[证据](baselines/mb-capability-validation.json)
核对全部源码/产物/报告/安装文件哈希。MB-TYPE-01/MB-READY-01关闭；任务done并立即专用提交。
39个WebKit能力对照不是播放或物理Safari支持，长播放/设备/组合及分发许可仍由09/10接续。
