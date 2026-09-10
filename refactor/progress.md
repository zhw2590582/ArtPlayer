# 进度与证据

## 当前阶段：DOC-07 计划复审

2026-09-10，针对实际依赖图审查并调整计划。现为 198 项任务：7 项规划任务、191 项待实施/验收任务；生产代码重构完成数仍为 0。DOC-06 已提交为 `d7b348f3`，本次审查按 `[DOC-07]` 主题独立提交。

主要调整：最小启动基线、旧核心上的早期 chapter 试点、消费者/环境矩阵、历史失败与测试可靠性、核心无障碍回归、提前建立分包发布准入及回退演练。新增 execution-gates.md，原 192 个任务 ID、包范围和完成状态均保留。

校验结果：

- plan.mjs 生成与检查通过：198 任务、22 包、依赖无环、本地链接与生成同步。
- 专项依赖断言通过：PILOT-01 无 CORE 前置；CORE-01 依赖试点；SITE-04/05、REL-01/02 无 Cast/VAST/DPiP/mask 设备验收前置；REL-03 仍包含这些门槛。
- 既有 192 项任务 ID、scope、status 未丢失或伪造完成；只有本次 DOC-07 新标完成，其余新增任务待执行。
- 本次未修改生产代码、依赖或测试实现，没有运行浏览器播放或生产测试。

完整发现、改动及回退见 [DOC-07 审查记录](changes/2026-09-10-DOC-07-plan-review.md)。下一任务仍是 BASE-01，先固定核心与 chapter 的最小发布基线。

## 2026-09-10：建立重构工作区

- 分支：`codex/compatible-modernization`，由干净 master 创建。
- 基线：`40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f`。
- 已清点：22 包、全部插件、proxy、工具、文档与 React/Vue 示例；逐步任务以 tasks.json 为准。
- 本轮修改仅包含重构文档、其生成/校验工具，以及 AGENTS.md 的文档入口。未修改生产源码、声明或发布产物。
- 初始化阶段 DOC-01 至 DOC-04 完成时尚未提交。用户随后要求每任务独立 commit；已有规划文件作为 DOC-05 初始文档基线入库，实际提交以 Git 日志中的 `[DOC-05]` 为准。未推送、未发布。

本轮交付共 190 个任务：4 个 DOC 规划任务完成，186 个实施/验收任务待执行。包括核心 22 步，普通生态包各 6 步，danmuku 9 步，MediaBunny 10 步，另含基线、工程、文档、消费者、工具链和发布任务。

本轮文档验证：

- `node refactor/scripts/plan.mjs --write` 与 `--check`：任务 ID/状态/依赖、无环检查、22 包覆盖、完成证据和计划同步通过。
- 本地 Markdown 文件链接共 30 个均存在；初始清单中的 manifest、源码、类型和 demo 路径均存在。manifest 自身声明的缺失目标仍如实登记，不伪造文件。
- `node --check refactor/scripts/plan.mjs`：通过。
- `git diff --check`：通过；工作区仅 AGENTS.md 和 refactor/ 变化。
- 本轮没有重跑生产源码测试或浏览器播放；没有生产源码修改。

## 先前评估证据

以下来自建立计划前的同一会话评估，属于初步诊断，不代替 BASE 阶段的已发布产物基线与完整浏览器测试：

| 检查 | 结果与限制 |
| --- | --- |
| `node --test test/playback.test.js test/dash-control.test.js` | Node 25.2.1，19 项通过；这是 mock/单元测试 |
| 核心 src/types、test、scripts/*.js 的 ESLint（不加 --fix） | 通过；没有把插件模板占位符作为普通源码 lint |
| 三个 TS 样例，TS 5.9.3、strict、types: [] | 通过；未隔离环境类型时存在第三方 DOM/WebCodecs/markdown 声明冲突 |
| 使用项目构建配置 write:false 进行 ESM/现代 UMD/legacy UMD 内存构建 | 成功；不是完整 npm pack 或全部发布构建；未写产物 |
| 销毁源码隔离探针 | 重复 destroy 可误删其他实例注册项；需要正式回归用例 |
| 连续切源源码隔离探针 | 一次 canplay 可结算两次切源；尚未真实浏览器复现影响 |
| `bun test ./test/playback.test.js ./test/dash-control.test.js` | Bun 1.3.14：1 通过、18 失败，mock.fn 不兼容；未来版本需重测 |

## 清点中新增的待核对项

- artplayer-tool-thumbnail：manifest 的 types 目标当前不存在，ESM 历史路径与统一构建命名不同；在包契约任务中核对发布内容。
- ads、VAST、auto-thumbnail、vtt-thumbnail 等包的声明与源码参数/同步异步形状需要逐项对照。
- JASSUB、字幕 parser、screenfull 等第三方复制代码需要来源与许可台账。
- package-inventory 是当前 checkout 的清单，npm 发布基线尚未获取。

## 下一步

2026-09-10 新增 DOC-06：用户授权自主安装需要的新依赖、添加或改进合理脚本。已写入根指令、质量要求、工具链规范、AI 流程和 ADR-015；没有在这次记录任务中安装依赖或修改生产脚本。当时总数为 192 项。DOC-05 已提交为 `570600d2`；DOC-06 已提交为 `d7b348f3`。

2026-09-10 新增 DOC-05，记录并落实“每完成一项任务立即独立本地 commit”。当时总任务为 191 项。DOC-05 的范围是文档初始化和提交纪律，不包含生产实现；具体检查与提交主题见 changes/2026-09-10-DOC-05-task-commits.md。

2026-09-10 用户补充要求已落实到 quality-contract.md、ADR-013、根 AGENTS.md、AI 工作流程和变更模板：自主改进不合理内部设计、TS 化同时拆清模块、增加风险对应的有效测试，并持续维护包内架构和后续 AI 接续文档。初始任务数量保持 190，可按后续发现扩展；这次更新不代表开始或完成任何生产代码重构。

从 BASE-01 开始取得并固定消费者版本基线；随后完成接口/事件/DOM/包分发清单及 ENG 测试基础。当前没有任何核心或插件重构任务被标为完成。

## 会话记录模板

```text
日期 / HEAD / 分支：
任务 ID 和实际修改：
兼容差异与决策：
验证命令、环境、结果、报告：
未验证项与阻塞：
变更记录链接：
下一步与依赖：
提交/推送/发布状态：
```
