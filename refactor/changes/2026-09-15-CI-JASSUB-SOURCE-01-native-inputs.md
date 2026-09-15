# CI-JASSUB-SOURCE-01 原生 JASSUB 当前源码覆盖

2026-09-15，分支 `codex/compatible-modernization`，基线 `5862f60b0`。
本任务修改浏览器测试选择和工程回归；关联 API-05、API-09 及 CI-01。

## 问题与修改

完整 WebKit 源码回归发现，`jassub-native.spec.js` 默认只加载 npm 1.1.0，
只有安装映射或显式 artifact 才构造候选输入。实际 Playwright CLI 收集负例
复现默认只有三个旧包用例，缺少当前源码与三套核心的组合。

现在统一调用 browserCandidate，默认保留发布包并加入当前源码；安装映射继续
验证发布包与已安装候选，显式单文件环境变量继续只运行所选诊断产物。缺失文件
和安装映射混用显式文件继续失败，不回退。来源以 provenance.kind 判别，不能
用 file 是否为空判别：内存源码构建的 file 为 null，仍是候选。

同样修正源码候选的直接销毁分支。在销毁 ArtPlayer 前，要求核心仍存活、worker
只终止一次、JASSUB 画布归零；随后销毁核心，原有最终清理断言继续执行。
这防止宿主销毁掩盖插件直接销毁失败。未更改字幕像素、seek、布局、资源或错误
断言，没有提高超时、增加重试或跳过旧失败。

生产运行时、公开 JS/TS API、事件时序、DOM/CSS、SDK 字节和分发入口均未更改。
无需新增依赖、锁文件变化或重建生产产物。包内 ARCHITECTURE、浏览器测试说明
和执行器维护说明同步输入语义；测试输入归 browserCandidate，宿主与插件资源
所有权保持既有实现。本任务不承担新的生产模块拆分或公开声明迁移。

## 实际验证

固定 Node 24.21.0 / Yarn 1.22.22 / Windows。完整机器证据、来源 SHA、资源结果、
逐项附件和错误见[验证记录](../baselines/jassub-source-selection-validation.json)。

- 修改前真实 CLI 收集回归退出1：实际三个发布包用例，缺三个源码用例。
- `node --test test/browser-validation.test.js`：20通过、0失败/跳过。
  覆盖默认源码、显式文件和缺失/混用拒绝，实际调用 Playwright CLI，未伪造收集器。
- 两个修改的 JS 文件定向 ESLint 通过。
- `yarn test:browser test/browser/jassub-native.spec.js --workers=1 --reporter=json`：
  Chromium 153.0.8010.12、Firefox 155.0、Windows WebKit 26.6 共18项，
  15通过、3失败、0跳过/重试，71.107秒，退出1。当前源码九项全部通过：实际
  WASM/字体资源、字幕绘制、seek/布局和直接销毁后宿主销毁；失败均为发布1.1.0
  在WebKit的首次字幕像素为零，保持原断言。候选帧时钟修复见 PKG-JASSUB-07。
- `yarn test:browser:source --list --project=chromium`：174文件/1667项，退出0。
  **只收集，没有执行1667项**；列表报告的 skipped 不是运行后的能力跳过。
- 使用已有 `run-5UdGXT/browser-artifacts.json` 收集原生 JASSUB：六项，退出0，
  发布与安装候选各三核心。辅助函数仍验证所选运行时指纹，但此处没有重新打包
  文档或实际执行安装包播放，不能当作当前最终候选验收。
- 计划、风险生成/检查、风险校验器负例、严格工具链与 Git diff 检查完成后提交。

## 结论与边界

关闭本任务的候选输入覆盖缺口；CI-01、JASSUB 完整组合和设备验证仍未完成。
本次使用默认受测 offscreen=false 的原生 worker/WASM 路径，不代表 hybrid、
offscreen、ESM 或物理设备验收。不把旧包失败改写为通过，也不声称完整矩阵全绿。

完成提交主题：`test(ci): [CI-JASSUB-SOURCE-01] include source in native JASSUB checks`。
回退该独立提交恢复原测试选择；无需消费者迁移或重建运行时。仅本地提交，
没有推送、部署、远端 Actions 运行或 npm 发布。
