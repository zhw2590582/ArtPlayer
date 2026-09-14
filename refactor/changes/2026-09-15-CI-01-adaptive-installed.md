# CI-01 HLS、DASH 与 Auto Thumbnail 接入安装范围

## 实现与边界

十二包统一安装名单新增 HLS Control、DASH Control、Auto Thumbnail。七个浏览器
文件通过 browser-candidate.js 加载校验后的实际 tarball 安装文件，拒绝显式产物
覆盖和 Auto Thumbnail frozen baseline；缺失/过期/篡改安装不退回源码。
既有源码入口保留，DASH 安装入口额外拒绝诊断 SDK 替换与恢复探针，防止诊断变体
混入正常验收。source 模式仍保留明确诊断开关。相关守卫负例已纳入 Node 测试。

HLS 使用固定实际 SDK、manifest/分片，区分无 Worker 与有真实 Worker 两套用例。
DASH 的 controlled 文件仅验证真实核心 DOM/原生 MP4 和受控 SDK 方法；SDK 文件
加载真实固定 dash.js 4.5.2/5.2.1。SDK 能力附件只记录可用候选，不声称加载插件；
dash-plugin-inputs 记录集成场景的实际选包。纯原生 SDK 无插件对照保持不变。
Auto Thumbnail 使用原生视频、Canvas 和 JPEG，但核心宿主是 stub；无原生帧呈现
回调时首两格仍为诊断而非通过，AUTO-THUMB-PIXEL-01 不因此关闭。

首次十二包准备被 HLS 的 tsconfig 泄漏拦截；PKG-HLS-PACK-01 已独立修复并提交
7094cf6f9，详细旧/中间/新归档证据另存。CI 接入未改公开生产 API、超时、SDK 或
断言；lint 自动修正了改动文件内既有 finally 括号格式。无新增依赖，根锁不变。

## 工程验证

Windows x64，固定 Node 24.21.0、Yarn 1.22.22。run-UmEnUj 实际十二包构建/pack/
隔离安装/冻结复装和完整成员核验通过。通用消费者仍只覆盖 core/chapter 的
36 运行时、5 旧类型模式、8 精确类型模式，不是全生态 Node/类型准入。

相关单元 278/278、工程 47/47、scoped lint、library 严格类型、严格工具链、CI
工作流契约与 actionlint 1.7.12 通过；未调用 shellcheck/pyflakes。初始 lint
四处格式错误日志保留，最终改正。完整 installed collection 为 32 文件/1137 项；
本轮实跑仅新增七文件三引擎 375 项，workers=2，retries=0，结果见机器证据。

## 维护与剩余工作

维护入口为三个包的 ARCHITECTURE.md、scripts/browser-validation/README.md、
test/package/README.md。所有实际失败、能力跳过和原生对照单独计数；保留旧
AUDIO-BUFFER-01 与 CHAPTER-TIMING-01 报告，未在本次重复执行此前插件集合。
CI-01 与各包真实 SDK/设备/完整分发门槛继续开放。尚未运行远端 Actions，也没有
发布候选授权。回退此检查点恢复九包 installed 范围；HLS 排除配置修复为独立提交。

## 实测结果

Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6。375 项共 293 通过、
2 失败、80 跳过，耗时 350.040 秒，实际退出 1、无重试；Chromium/Firefox 各
124 通过与 1 失败，WebKit 45 通过与 80 能力跳过。32 文件/1137 项只是完整
collection，本轮没有重跑其他二十五文件，不能将新子集结果当成完整十二包 CI。

两项失败均为裸 dash.js 4.5.2 的暂停边界 seek，重新播放后 currentTime 停在 6，
未达到大于 6.2 的断言。该路径未创建 ArtPlayer 实例，候选插件没有参与；已有
DASH-SEEK-01 与候选插件的精确版本修复分别保留。实际候选插件集成通过并不修复
裸 SDK。状态附件在清理后的视频尺寸/时间归零不能被反推为失败当时的解码状态。
原始 trace/截图/报告保留在 ci01-adaptive-installed-report，读取旧附件路径时映射
到归档目录的 results；没有重跑覆盖、升级 SDK 或放宽 seek 断言。

80 项跳过全部在 Windows WebKit：DASH SDK 48、HLS 主矩阵 16、HLS SDK 矩阵 16。
实际能力记录仍验证无 MSE 的边界，不等于适配流播放通过。Auto Thumbnail 三引擎
候选 27 项通过，但 WebKit 两个像素用例对首两格仅记录诊断，不能关闭首帧风险。
测试输入附件确认 221 项选择已验证候选安装文件，其中含能力边界与受控宿主，
不把该数当作 221 项真实自适应解码。固定 SDK 为 hls.js 1.5.17/1.7.2、dash.js
4.5.2/5.2.1，来源和实际包成员哈希均保留。

刻意继承 installed map 后，source 入口清除了它。三个 Chromium 源码定向用例
（HLS 解码/选择、DASH 5.2.1 MPD/选择、Auto Thumbnail pattern 像素）3/3 通过，
附件均为 source-build；这不重验所有源码文件。所有结果见
[机器证据](../baselines/ci-adaptive-installed-validation.json)。
