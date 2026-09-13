# PKG-JASSUB-09 混合绘制的画布与等待状态归属

状态：doing 检查点。hybrid 修复已有受控及原生证据；Firefox 默认模式的继承
回归缺口仍需处理，因此此提交不把 09 或 05 标为完成。

## 复现与修复

在 05 补全字幕切换验收时，从 `b4b0276fe9df13218ece21c3ba6a51b42948e16d`
发现两类相连的生命周期缺陷。ASS 色彩矩阵和视频不一致时，JASSUB 会从纯
offscreen 转为 hybrid：Worker 返回 ImageBitmap，主线程用 canvas filter 修正
颜色。公开 setTrack/setTrackByUrl 随后重新转移画布。如果旧 hybrid 帧已经到达
消息队列，它会对 `_ctx=false` 执行绘制，或者在尺寸不同时借旧色彩信息重新创建
主线程画布，破坏刚完成的转移。销毁 hybrid 实例后调用上述方法也会创建新画布。

修复保留 API-04/05/08/12 的公开工厂、方法返回、选项、资源和 Worker 协议：

- 当前画布由 offscreen 所有时，旧 hybrid render 先关闭其 bitmap，立即返回，
  不改 busy、不做色彩转换、不创建/绘制新画布。正常 hybrid 帧继续绘制和关闭。
- reattach 先退休旧模式的 busy/待处理时间，再对新画布请求强制绘制。否则丢弃
  的旧 render 同时也是等待中的完成通知，后续 RVFC 只积累待处理时间，字幕会
  持续空白。新的强制绘制及其 unbusy 通知恢复当前帧处理。
- reattach 遇到已销毁实例直接返回，两个公开切字幕方法不能重新创建或转移画布。

没有修改 Worker JS、WASM、字体、公共声明、版本或依赖。原 07/08 补丁保留，
新增[补丁记录](../baselines/jassub-hybrid-patch.json)和
[独立 diff](../baselines/jassub-hybrid.patch)。来源测试按三段实际 Git 基线验证
原文件、修改后文件和 diff 身份，再反向检查最后一个补丁；不是覆盖旧指纹。
包内 ARCHITECTURE.md 同步了旧等待退休、强制新绘制、bitmap 和终态归属。

## 测试设计与中间失败

新增五项受控边界，和原 offscreen 六项一起，冻结 08 产物为 7 通过/4 失败，
最终候选 11 通过。它们分别保护迟到帧不解除新需求、正常帧实际绘制和释放、
切换时强制重绘，以及两个终态公开方法。没有把五项全部声称为旧版失败。

真实浏览器用不同 YCbCr Matrix 的 ASS 触发实际 WASM 色彩响应。Chromium 的
VideoFrame 对本视频返回 bt709，因此可自然进入 hybrid。测试截留一条已经从
原生 Worker 收到的 ImageBitmap 消息，在同步 setTrack 完成 reattach 后交付，
验证新 canvas 身份不变、bitmap width 归零，以及后续字幕像素和终态调用。
这是受控消息时序下的真实资源验证，不是未经拦截的全部生产时序或 GPU 耐久证明。

第一次只检查迟到消息是否抛错是不充分的：旧代码通过色彩修正重新创建画布，
可能不抛错。测试补上 canvas 身份和模式断言，旧 Chromium 明确失败。
第一次只丢弃旧 bitmap 的候选又出现持续空白，原生 sent 序列停在重连 canvas，
推动补上旧 busy/需求退休及 force=true 回归。两次失败都保留。

Firefox 155.0 对本样本的 VideoFrame matrix 返回 null；WebKit 26.6 没有转移
能力。它们仍执行真实字幕切换、像素变化和清理，但不能计入 hybrid 位图交错覆盖。
测试按真实能力走明确分支，没有 mock 出色彩矩阵或调用内部方法伪造原生转换。
受控测试才直接调用内部模式方法，负责确定性的状态机边界。

另有一轮 Firefox 在首次像素/网页全屏时超时：该轮同时运行安装类型检查。
失败中默认模式的 Worker received 没有 render，只有 unbusy；该页面也未调用
track 重新挂载，因此本补丁两个新分支并未在这条失败路径执行。去掉同时运行的
重负载检查后，候选 11 通过/1 失败，仍复现 published 核心的全屏超时。
08 产物单独播放三项通过，但先执行字幕切换再播放的顺序对照为 2 通过/2 失败，
也在两个旧核心复现。说明不能仅归因于本次补丁或 CPU 并发；真正原因未确定。
额外的 JASSUB-FIREFOX-OFFSCREEN-01 保持 open，不把重跑成功当作修复依据。

## 验证、复跑与剩余范围

最终命令、计数、候选指纹、安装成员和红绿浏览器结果见
[验证记录](../baselines/jassub-hybrid-validation.json)。联合检查含旧行为基线，
不是全部新功能测试。联合 196 项、源码/main/legacy 各 79 项、实际安装 15 个
类型矩阵通过；legacy 切换三项和显式主线程九项原生验证通过。默认 main 最终
顺序验证仍是 11 通过/1 失败，不能汇总成全绿。正常 main/legacy/ESM 均由仓库 build 生成并与 docs 副本
核对。安装验证在最终包文档和源码构建后重新运行；首次 pack 属中间候选。

```sh
yarn test:jassub
yarn test:jassub-types-package
yarn build artplayer-plugin-jassub
node --test test/jassub-offscreen.test.js
node --test refactor/scripts/jassub-vendor-patch.test.mjs
yarn test:browser test/browser/jassub-hybrid.spec.js --workers=1
```

设置 ARTPLAYER_JASSUB_ARTIFACT 选择正常 main/legacy；默认播放回归另设置
ARTPLAYER_JASSUB_OFFSCREEN=default 并执行 jassub-native.spec.js。不设置后者
验证显式主线程路径。归档共享浏览器报告后才开始下一轮；排查媒体等待问题时
避免同时运行其他重负载任务，并保留对照范围及原始失败。

本检查点记录已实现的 hybrid 归属修复，但任务和风险验收仍未关闭。05 继续完整字幕/核心组合、Firefox
稳定性、设备和持续 GPU/内存验证；06 与 VENDOR-04/05 保留分发/通知要求。
没有声明完整 JASSUB 验收、major 升级、CI/CD 远程运行、三轮复盘或发布已完成。
不 push/tag/publish。回退本 commit 并正常构建可恢复 08；不要对运行中 Worker
热替换协议或只回退来源指纹而保留不一致的 wrapper。
