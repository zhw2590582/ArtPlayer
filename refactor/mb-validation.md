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
