# DASH Control 验证与维护入口

测试保护真实 npm 1.1.0 的既有调用契约，以及重构前工作区的 SDK 5.x 稳定 ID 修正。
版本来源见 [发布契约](baselines/dash-control-contract.md)。02 建立基线，03 改造运行行为，
04 已把五个自有模块迁移为严格 TS 并补齐公开类型与编辑器生成；
实际模块地图与生命周期规则见 [包内架构](../packages/artplayer-plugin-dash-control/ARCHITECTURE.md)。

## 可重跑的测试

- `yarn test:dash-control`：原有 5 项过滤/稳定 ID 回归、80 项行为/历史观察、31 项候选生命周期，共 116 项。
  该脚本和 `test:unit` 都保留旧测试，完整 CI 自动执行。
- `yarn test:browser test/browser/dash-control.spec.js --trace on`：84 项，两个核心、发布插件 SDK 4/
  候选插件 SDK 4/5、两类菜单、两种选择及候选清理、Chromium/Firefox/WebKit。
  浏览器套件串行运行，避免共享端口和报告覆盖。
- `yarn ci:check`：工具链、计划、lint、声明漂移、严格类型和 Node/基线测试。
- `yarn test:browser test/browser/dash-editor-types.spec.js --trace on`：三引擎 Monaco 实际
  worker 编译全局声明、验证回调/旧类型提取及错误诊断，并执行发出的 JS 工厂。
- `yarn build:ts`：重新生成编辑器声明；`refactor/scripts/dash-types.test.mjs` 校验可复现、
  TS 4.3.5/5.9.3、五种模块模式、八条非法用法及实际 npm 旧声明的消费者对照。
- `yarn test:dash-types-package`：Yarn 打包核心/DASH、工作区外离线安装与冻结锁重装，
  检查五种模式、CommonJS callable/命名空间、每模式八条非法调用，并拒绝解析回工作区。
- `yarn test:browser test/browser/dash-sdk.spec.js --trace on`：真实 npm dash.js 4.5.2/5.2.1，
  本地多画质/多音轨 MPD，新旧核心/插件、外部同步 update、连续换源和 SDK 原生对照。
  `ARTPLAYER_DASH_ARTIFACT` 可选择正式 main/legacy；未指定则测试源码构建。
  无 MSE 的引擎只通过能力探针，播放用例明确跳过，不计为该引擎 DASH 验收。
- `node --test refactor/scripts/dash-sdk.test.mjs`：SDK 归档/成员/许可证来源、媒体指纹与拓扑。
  如需重新合成诊断媒体，用 `node scripts/generate-dash-fixture.mjs refactor/.cache/new-dash-media`，
  输出目录必须不存在；可通过 `ARTPLAYER_FFMPEG` 指定 FFmpeg，不覆盖已冻结输入。

Node helper 分别加载当前源码、固定 Git 提交的旧工作区 UMD、实际 npm main/legacy/module。
Git 内容以 LF 指纹核对，发布归档与成员以原始字节指纹核对。`ARTPLAYER_TEST_DASH` 可指定
待测产物，以系统路径分隔符连接；同时指定 main/legacy/module 时共 266 项，包含两代 SDK 的
行为与生命周期。未设置时不会把源码测试冒充三种候选产物验证。

`test/helpers/dash-control.js` 只提供可控 SDK 方法和组件注册表，检查 this、类型参数、
原始轨道身份、调用顺序、错误身份、ABR 配置保留、换 SDK、多实例和关闭后的引用。
真实旧实现的缺陷观察保持冻结；候选生命周期新增正确行为断言，不把历史缺陷当作兼容要求。

`dash-control.spec.js` 使用真实发布/候选 ArtPlayer DOM、真实发布/候选插件和本地原生 MP4。SDK 方法可控，
断言真实点击触发的参数及控制栏/设置同步，再通过真实播放按钮验证视频时钟推进、无媒体错误。
**没有加载 dash.js，没有验证 MPD、ABR 自动切换或自适应流解码。** 这些仍是 05 必须完成的
固定 dash.js 4.5.2 / 5.2.1 集成验证。独立 `dash-sdk.spec.js` 已开始真实验证，状态以
[05 检查点](changes/2026-09-12-PKG-DASH-05-sdk-checkpoint.md) 为准；不覆盖早期停滞失败。
`ARTPLAYER_DASH_ARTIFACT` 可替换插件脚本；02 未设置，
03 分别使用正式 main 与 legacy 文件。核心仍按服务端 manifest 加载发布/候选源码构建。

## 02 首次失败与证据

首次浏览器运行 24 通过、24 失败；全部失败位于设置选项文字定位。trace 中选项确实已渲染，
整行文本包含图标 SVG 的换行，`^fr$`/`^720p$` 不能匹配。改为当前面板内专用
`.art-setting-item-left-text` 的精确文本定位；保持原有调用、同步和播放断言，没有增大超时或跳过。
补充清理前行文本诊断，最终 48 项通过；候选设置选择的截图已人工查看，文字与控制栏一致。

首轮与最终报告、全部结果/trace 目录都保留在本地缓存；输入和证据指纹见
[本步执行记录](baselines/dash-validation.json)。缓存不入 Git，永久保存的是测试、来源和结果摘要；
换机器应按上述命令重新取得执行证据，不能声称本地 trace 已上传。

## 03 修正与后续边界

- DASH-SDK-01：通过能力适配恢复两代方法表，实际 SDK/媒体仍由 05 验证。
- DASH-LIFE-01：空列表/禁用后 UI、旧回调、销毁后 update/订阅已修正，补充重入和错误回归。
- DASH-STATE-01：唯一克隆当前轨道、重复标签、数字零 ID 已修正；实际 SDK 轨道身份仍由 05 核验。

状态以 risks.json 为准；受控修复不替代真实 SDK 验收。严格 TS/公开类型已有独立验证，05 完成
真实 SDK/媒体/组合验证，06 完成包分发验收。物理设备和 npm 发布准入仍待完成。
