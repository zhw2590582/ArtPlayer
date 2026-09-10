# 历史失败与测试可靠性

ENG-10 接续已有验证入口，不增加第二份风险清单。差异 ID、确认程度、责任任务和关闭证据以
[risks.json](risks.json) 为准；支持环境和缺设备项以 [环境矩阵](environment-matrix.md) 为准。

| 类别 | 当前证据及入口 | 如何处理 |
| --- | --- | --- |
| 已发布版本的真实缺陷 | BASE-LIFE 系列及 BASE-PERF；baselines/lifecycle.json、performance.json 和对应脚本 | 保留旧版可重跑结果；候选需要修复用例与差异记录，不能只让新代码满足旧缺陷 |
| 已发布类型失败 | BASE-TYPE-01/02/03；baselines/consumers.json 的编译器、模式、fixture 和精确诊断 | 旧版仍按原诊断验证；候选 core/chapter 已修复，typecheck 和严格打包均要求零诊断 |
| 声明/源码不一致但未完成运行验证 | BASE-TYPE-04 等 source-observed 项 | 原任务继续核实；不能写成已复现或自动豁免 |
| chapter 已修缺陷 | chapter.spec.js 的 published-only 历史观察及 candidate 修复场景，chapter-migration-validation.json | 旧结果与修复回归分开；不把旧版本的 NaN、残留标题作为候选期望 |
| 浏览器允许的媒体取消 | playback.spec.js 中按引擎、错误码、media 类型、同源、当前 case 与两个 URL 限定 | 保留原始请求记录；其他错误仍失败，不全局忽略 net::ERR_ABORTED |
| SDK、codec、素材和设备缺口 | environment-matrix.md 与各包任务；确认程度 unverified | 保持缺证据状态，不计入通过；不能用 mock 代替目标设备支持 |
| 新候选回归或测试不稳定 | 本次运行的结果、版本、SHA、网络与 trace | 先作为失败处理，定位来源后修复；重试通过仍需保留首次失败及解释 |

## 每次运行

- 使用固定 Node/Yarn/浏览器工具链；源码、发布包、安装候选各自标注来源。
- `yarn ci:check` 负责严格类型、Node 行为、冻结基线、计划与风险校验。
- `yarn test:package:release` 重建并在仓库外消费候选，不能从 workspace 补声明；
  `refactor/scripts/consumers.mjs` 同样在仓库外重跑旧发布包。旧版数据文件保持不可覆盖。
- 浏览器报告包含引擎版本、资源 SHA、事件、实际媒体状态、请求和错误；故障保留截图与 trace。
  `ARTPLAYER_BROWSER_ARTIFACTS` 明确指定安装候选，无源代码 fallback。
- Playwright 当前 retries=0，CI forbidOnly=true；交付需 unexpected/skipped/flaky 均为 0。
  若手工诊断时启用重试，只作为取证，不能替代默认配置的最终回归。不得用 skip/only 缩小交付范围。
- 播放准备、seek、切源和异步状态用事件或条件等待，有明确超时。现有 pause 后 200ms 等待
  专门测量媒体时钟是否保持停止，不用于猜测加载完成。新等待必须说明相同的可观察目的。
- 控制时间/进度与 DOM 读数在同一次 evaluate 中完成，防止原生 timeupdate 插入造成误报。
  对画面/布局容差说明实际像素和浏览器差异，不能用放宽容差掩盖功能变化。

## 模块交付与发布

迁移中的模块不能继承未解释的错误：对应合法旧调用、修复回归、严格源类型、真实环境和打包消费
都必须完成。无关未迁移包可以继续保留有负责人、有来源的历史风险；这不允许它们通过发布准入。
关闭风险必须更新 resolutionEvidence 和 resolutionRationale，运行风险校验；文件存在检查不是
人工审查的替代品。设备缺口在对应包和发布批次保留，不降低全项目目标。

本次核对配置与测试实现，没有新增运行时改动或重复跑整套浏览器；引用的最新实际执行是
[chapter 类型闭环](changes/2026-09-10-PKG-CHAPTER-04-public-types.md)。
