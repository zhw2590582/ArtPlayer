# 遗留问题交接清单（2026-09-16）

用户要求停止本轮自主实施，遗留问题以后逐项处理。本清单是交接快照；主台账仍为 [risks.json](risks.json)，执行安排见 [自测交接](self-test-handoff.md)。后续修复时同步台账与本清单，不凭旧标题判断当前代码仍有同样缺陷。

## 如何理解这些数量

- 主台账共 288 条：77 条 open、206 条 resolved、5 条 accepted-with-scope；另有独立分支 MB-DROP-01 尚未合入。
- 77 条 open 不是 77 个当前必现 bug：其中包括历史缺陷已经局部修复但验收未结束、分发差异、环境/设备缺口、来源与许可待核实事项。
- 60 项延期任务是工作计划，与风险条目不是一一对应；全部保留在文末，避免没有独立风险 ID 的剩余工作丢失。
- 本次只整理已有证据，未重新验证每条问题；“已复现”不代表在本次交接重新复现。下文保留原记录措辞与版本边界。

## 后续可优先关注的项目

| 项目 | 已知情况与接续边界 |
| --- | --- |
| MediaBunny 长时间 AV 采样越界 | MB-SYNC-01；两个 Chromium 组合约549/570ms，运行已中断。先诊断，不能直接认为是用户可见持续失步。 |
| MediaBunny 显式丢帧 | MB-DROP-01；修复独立提交保存，缺原生专项与合入。与上项分开处理。 |
| JASSUB | JASSUB-HYBRID-01 与 JASSUB-FIREFOX-OFFSCREEN-01；分别保留绘制/终止生命周期问题与 Firefox 原生 Worker 对照，避免混成同一根因。 |
| HLS / DASH | HLS-CRASH-01、HLS-PLAYBACK-01、DASH-SEEK-01；按精确 SDK/核心/浏览器组合重现，旧 SDK 原生问题不自动归因重构。 |
| WebKit 媒体 / 缩略图 / 字幕 | AUDIO-BUFFER-01、AUTO-THUMB-PIXEL-01、MULTI-SUB-SWITCH-01、CHAPTER-TIMING-01 等；保留原失败和原生对照，不靠扩大超时抹平。 |
| Mask / Cast / PiP / VAST / ASR | 仍有设备、资源释放、媒体与外部服务组合缺口；VAST 受 VPN 影响确实无法加载时允许记录跳过，不扩展到 Ads。 |
| 文档和来源 | SITE-05/07、字体和样本来源、尚未发布到远端的新文档链接；不把本地构建等同线上部署完成。 |
| 性能与发布 | ENG-PERF-01/02、旧归档/回退完整性、候选指纹、远端 CI/npm 工作流；留待用户安排专项或发布准备。 |

## 77 条未关闭记录

每条列出责任任务、当前已知状态、处理方向、关闭条件和原始证据。原记录没有新增现场结论时明确保持未知。
### ENG-PERF-01：Candidate core bundles exceed the BASE-06 size review threshold in all three formats

证据性质：源码/声明/产物事实。后续任务：CORE-22、MOD-03、REVIEW-01。

当前状态：First ENG-08 modern core measurement: 134037 to 207875 raw bytes, 35486 to 58374 gzip9, 32533 to 53326 Brotli6. Chapter remains below the combined relative/absolute review threshold. This is a review requirement, not a release approval. CORE-22 navigation phase: 208030 raw / 58429 gzip9 / 53361 Brotli6 modern bytes. Preferred-target revalidation removes a second panel scan at a cost of 55 gzip bytes over ENG-08; it does not resolve total bundle growth. Final CORE-22: modern 208037 raw / 58434 gzip9 / 53372 Brotli6; legacy 212218 / 59686 / 54412; ESM 361496 / 77141 / 70030. Navigation and initial-layout work were reduced, but total size remains above the historical threshold. MOD-03 and REVIEW-01 must review this before release. MOD-03 slider checkpoint: dynamic ARIA writes compare actual DOM before mutation. Main/legacy three paired groups per desktop engine pass operation/native-playback checks. Synthetic repeated-event timings include slower groups; main is 208943 raw / 58756 gzip9 / 53660 Brotli6, +10 gzip bytes from the immediate prechange artifact. Full installed BASE-06 pairing and remaining hotspots are still outstanding; this risk stays open. MOD-03 completion: native persistence (9 paired cases), installed layout/navigation (12 cases), Chromium first-frame CPU sampling, and fresh installed BASE-06 three-group comparisons are complete. Final formal candidate resource windows all pass; original 349ms harness failure and first Chromium destruction signal are retained. Size remains review-required. Storage caching was rejected to preserve independently parsed objects and synchronous interleaved settings. REVIEW-01 retains this open release review; completion of MOD-03 does not waive it.

已做处理/后续方向：Attribute the growth to actual modules and build output, remove avoidable overhead while preserving APIs, and document any justified remaining cost against matching published entries.

关闭条件：Fresh isolated artifacts have reproducible raw/gzip9/Brotli6 results and an explicit size review; do not raise or overwrite the historical threshold to pass.

复现、排查与验证依据：

- [refactor/coverage-performance.md](../refactor/coverage-performance.md)
- [refactor/baselines/quality-validation.json](../refactor/baselines/quality-validation.json)
- [refactor/changes/2026-09-11-ENG-08-quality-reports.md](../refactor/changes/2026-09-11-ENG-08-quality-reports.md)
- [refactor/baselines/core-setting-navigation-partial.json](../refactor/baselines/core-setting-navigation-partial.json)
- [refactor/changes/2026-09-11-CORE-22-core-acceptance.md](../refactor/changes/2026-09-11-CORE-22-core-acceptance.md)
- [refactor/core-acceptance.md](../refactor/core-acceptance.md)
- [refactor/baselines/core-acceptance-validation.json](../refactor/baselines/core-acceptance-validation.json)
- [refactor/changes/2026-09-14-MOD-03-slider-updates.md](../refactor/changes/2026-09-14-MOD-03-slider-updates.md)
- [refactor/baselines/slider-updates-validation.json](../refactor/baselines/slider-updates-validation.json)
- [refactor/changes/2026-09-14-MOD-03-performance-acceptance.md](../refactor/changes/2026-09-14-MOD-03-performance-acceptance.md)
- [refactor/baselines/core-performance-validation.json](../refactor/baselines/core-performance-validation.json)

### ENG-PERF-02：Intermittent constructor and destruction timing signals require follow-up paired measurement

证据性质：待取证或环境缺口。后续任务：CORE-22、MOD-03、REVIEW-01。

当前状态：First ENG-08 run: Firefox group 2 had core/chapter constructor delta 3/5 ms, WebKit group 3 chapter delta 3 ms, versus 2 ms absolute allowance. Other groups did not trigger. Candidate resource checks passed independently. Final run: Chromium/Firefox had no timing signals; WebKit group 1 core/chapter each increased 3 ms, with no signals in the other two groups. The intermittent review remains open. CORE-22 navigation phase: Chromium group 1 core/chapter destroy deltas 3.1/2.5 ms and group 3 chapter constructor delta 2.8 ms; WebKit group 1 chapter destroy delta 27 ms (71 to 98 ms); Firefox has no timing signals. Other groups do not reproduce those destroy signals. All 54 candidate resource probes pass. The timed fixture uses default settings disabled, so these measurements do not establish any timing effect from setting navigation changes. Final CORE-22: no constructor timing signals in any of the three engines; Chromium/Firefox have no timing signals. WebKit group 1 chapter destruction delta 44 ms and group 2 core delta 30 ms remain, group 3 has no signal. All 54 candidate resource probes pass. Chromium sampling identifies native load/DOM teardown cost but does not establish the cause of WebKit signals. MOD-03/REVIEW-01 retain the open review without changing allowances. MOD-03 slider checkpoint: dynamic ARIA writes compare actual DOM before mutation. Main/legacy three paired groups per desktop engine pass operation/native-playback checks. Synthetic repeated-event timings include slower groups; main is 208943 raw / 58756 gzip9 / 53660 Brotli6, +10 gzip bytes from the immediate prechange artifact. Full installed BASE-06 pairing and remaining hotspots are still outstanding; this risk stays open. MOD-03 completion: native persistence (9 paired cases), installed layout/navigation (12 cases), Chromium first-frame CPU sampling, and fresh installed BASE-06 three-group comparisons are complete. Final formal candidate resource windows all pass; original 349ms harness failure and first Chromium destruction signal are retained. Size remains review-required. Storage caching was rejected to preserve independently parsed objects and synchronous interleaved settings. REVIEW-01 retains this open release review; completion of MOD-03 does not waive it.

已做处理/后续方向：Repeat paired measurements on the same environment, distinguish initialization and teardown work from host jitter, and optimize only after identifying a reproducible cost.

关闭条件：Explain repeat-group timing signals with retained samples and source fingerprints; do not infer a regression or improvement from a single group or expand timing allowances.

复现、排查与验证依据：

- [refactor/coverage-performance.md](../refactor/coverage-performance.md)
- [refactor/baselines/quality-validation.json](../refactor/baselines/quality-validation.json)
- [refactor/changes/2026-09-11-ENG-08-quality-reports.md](../refactor/changes/2026-09-11-ENG-08-quality-reports.md)
- [refactor/baselines/core-setting-navigation-partial.json](../refactor/baselines/core-setting-navigation-partial.json)
- [refactor/changes/2026-09-11-CORE-22-core-acceptance.md](../refactor/changes/2026-09-11-CORE-22-core-acceptance.md)
- [refactor/core-acceptance.md](../refactor/core-acceptance.md)
- [refactor/baselines/core-acceptance-validation.json](../refactor/baselines/core-acceptance-validation.json)
- [refactor/changes/2026-09-14-MOD-03-slider-updates.md](../refactor/changes/2026-09-14-MOD-03-slider-updates.md)
- [refactor/baselines/slider-updates-validation.json](../refactor/baselines/slider-updates-validation.json)
- [refactor/changes/2026-09-14-MOD-03-performance-acceptance.md](../refactor/changes/2026-09-14-MOD-03-performance-acceptance.md)
- [refactor/baselines/core-performance-validation.json](../refactor/baselines/core-performance-validation.json)

### BASE-DEMO-01：旧 thumbnail 插件示例不对应当前 workspace 包

证据性质：源码/声明/产物事实。后续任务：SITE-01、EX-03。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：核实旧外部插件和链接，不自动替换为不同 API 的 auto-thumbnail。

关闭条件：示例依赖有来源，旧参数/URL 的保留或迁移解释完整。

复现、排查与验证依据：

- [docs/assets/example/thumbnail.js](../docs/assets/example/thumbnail.js)
- [refactor/baselines/demo-inventory.json](../refactor/baselines/demo-inventory.json)
- [refactor/site-inventory.md](../refactor/site-inventory.md)

### BASE-DIST-01：thumbnail tool 分发入口与类型文件缺失

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-TOOL-THUMB-04、PKG-TOOL-THUMB-06。

当前状态：Current root ESM, direct CJS, legacy and declarations pass isolated installs. Missing historical .esm.js was replaced by the real root .mjs entry. Historical 3.5.31 CSS path/disposition and complete original promised-path review remain 06; item stays open.

已做处理/后续方向：Recovered 3.5.31 has main and a CSS entry; baseline workspace lacks main and points to missing .esm.js/types. Recoverable CDN main is verified against Git, not an original tarball. Preserve supported paths, decide historical CSS disposition, add real declarations and verify isolated installs in 04/06.

关闭条件：隔离打包消费者能加载所有原承诺路径，dist 不作为源码直接手改。

复现、排查与验证依据：

- [refactor/baselines/distribution.json](../refactor/baselines/distribution.json)
- [refactor/baselines/thumbnail-contract.md](../refactor/baselines/thumbnail-contract.md)
- [refactor/baselines/thumbnail-release.json](../refactor/baselines/thumbnail-release.json)
- [refactor/scripts/thumbnail-contract.test.mjs](../refactor/scripts/thumbnail-contract.test.mjs)
- [refactor/baselines/thumbnail-public-types-validation.json](../refactor/baselines/thumbnail-public-types-validation.json)

### BASE-SOURCE-01：工作区 5.4.1 与采集时真实发布 5.4.0 不同

证据性质：源码/声明/产物事实。后续任务：BASE-08、REL-01。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：分别保留工作区与 npm 基线，目标大版本不变；更新发布窗口需新取证。

关闭条件：候选报告明确比较版本与 tarball，不声称工作区版本即已发布。

复现、排查与验证依据：

- [refactor/baselines/releases.json](../refactor/baselines/releases.json)

### BASE-SOURCE-02：registry gitHead 与发布包版本对应不可靠

证据性质：源码/声明/产物事实。后续任务：ENG-07、REL-01。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：以 tarball 内容和可验证的构建来源为准，不能据 gitHead 自动声称复现。

关闭条件：候选 commit、工具链、包内容可关联，旧来源未知仍明确。

复现、排查与验证依据：

- [refactor/baselines/releases.json](../refactor/baselines/releases.json)

### BASE-SITE-01：文档站实际为静态站点但 manifest 未设 private

证据性质：源码/声明/产物事实。后续任务：SITE-01、REL-01。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：区分站点部署和库 npm 发布；自身 next-major 要求保留。

关闭条件：发布流程显式列出站点处理方式，不机械将其当库发布。

复现、排查与验证依据：

- [refactor/baselines/distribution.json](../refactor/baselines/distribution.json)
- [refactor/site-inventory.md](../refactor/site-inventory.md)

### BASE-MEDIA-01：示例媒体和字体的完整来源/授权链待核实

证据性质：待取证或环境缺口。后续任务：BASE-08、SITE-01、EX-03、SITE-07。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：复用现有样本时记录来源；缺许可的公开分发样本需补证据或可兼容替代，不能从文件名猜授权。

关闭条件：候选实际分发样本有来源、许可/使用依据和测试映射。

复现、排查与验证依据：

- [docs/assets/sample](../docs/assets/sample)
- [docs/assets/jassub](../docs/assets/jassub)
- [refactor/site-inventory.md](../refactor/site-inventory.md)
- [refactor/baselines/site-provenance.json](../refactor/baselines/site-provenance.json)
- [refactor/changes/2026-09-15-SITE-07-font-notices.md](../refactor/changes/2026-09-15-SITE-07-font-notices.md)
- [refactor/baselines/site-font-notices-provenance.json](../refactor/baselines/site-font-notices-provenance.json)
- [refactor/baselines/site-font-notices-validation.json](../refactor/baselines/site-font-notices-validation.json)

### VENDOR-04：jassub-code-and-workers 来源、版本与许可闭环

证据性质：源码/声明/产物事实。后续任务：PKG-JASSUB-01、PKG-JASSUB-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Keep separate from owned TS migration. Verify source/version/diff and license notices before replacement; preserve API/CSS/worker URLs and run owning package tests.

关闭条件：固定上游版本/内容差异、完整组件许可与分发 notices，兼容测试通过；仅当前上游许可证名称不足以关闭。

复现、排查与验证依据：

- [refactor/third-party.json](../refactor/third-party.json)
- [packages/artplayer-plugin-jassub/src/jassub.es.js](../packages/artplayer-plugin-jassub/src/jassub.es.js)
- [packages/artplayer-plugin-jassub/worker](../packages/artplayer-plugin-jassub/worker)
- [docs/assets/jassub/jassub-worker.js](../docs/assets/jassub/jassub-worker.js)
- [docs/assets/jassub/jassub-worker.wasm](../docs/assets/jassub/jassub-worker.wasm)
- [docs/assets/jassub/jassub-worker-modern.wasm](../docs/assets/jassub/jassub-worker-modern.wasm)
- [refactor/baselines/jassub-release.json](../refactor/baselines/jassub-release.json)
- [refactor/baselines/jassub-vendor.json](../refactor/baselines/jassub-vendor.json)
- [refactor/baselines/jassub-font-metadata.json](../refactor/baselines/jassub-font-metadata.json)
- [refactor/baselines/jassub-contract.md](../refactor/baselines/jassub-contract.md)
- [refactor/baselines/jassub-contract-validation.json](../refactor/baselines/jassub-contract-validation.json)
- [refactor/changes/2026-09-13-PKG-JASSUB-01-baseline.md](../refactor/changes/2026-09-13-PKG-JASSUB-01-baseline.md)
- [refactor/baselines/jassub-provenance.json](../refactor/baselines/jassub-provenance.json)
- [refactor/baselines/jassub-provenance-validation.json](../refactor/baselines/jassub-provenance-validation.json)
- [refactor/changes/2026-09-14-PKG-JASSUB-01-provenance.md](../refactor/changes/2026-09-14-PKG-JASSUB-01-provenance.md)

### VENDOR-05：jassub-font-assets 来源、版本与许可闭环

证据性质：源码/声明/产物事实。后续任务：PKG-JASSUB-01、SITE-01、PKG-JASSUB-06、SITE-07。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Keep separate from owned TS migration. Verify source/version/diff and license notices before replacement; preserve API/CSS/worker URLs and run owning package tests.

关闭条件：固定上游版本/内容差异、完整组件许可与分发 notices，兼容测试通过；仅当前上游许可证名称不足以关闭。

复现、排查与验证依据：

- [refactor/third-party.json](../refactor/third-party.json)
- [docs/assets/jassub/default.woff2](../docs/assets/jassub/default.woff2)
- [docs/assets/jassub/fonts](../docs/assets/jassub/fonts)
- [refactor/baselines/jassub-release.json](../refactor/baselines/jassub-release.json)
- [refactor/baselines/jassub-vendor.json](../refactor/baselines/jassub-vendor.json)
- [refactor/baselines/jassub-font-metadata.json](../refactor/baselines/jassub-font-metadata.json)
- [refactor/baselines/jassub-contract.md](../refactor/baselines/jassub-contract.md)
- [refactor/baselines/jassub-contract-validation.json](../refactor/baselines/jassub-contract-validation.json)
- [refactor/changes/2026-09-13-PKG-JASSUB-01-baseline.md](../refactor/changes/2026-09-13-PKG-JASSUB-01-baseline.md)
- [refactor/baselines/jassub-provenance.json](../refactor/baselines/jassub-provenance.json)
- [refactor/baselines/jassub-provenance-validation.json](../refactor/baselines/jassub-provenance-validation.json)
- [refactor/changes/2026-09-14-PKG-JASSUB-01-provenance.md](../refactor/changes/2026-09-14-PKG-JASSUB-01-provenance.md)
- [refactor/site-inventory.md](../refactor/site-inventory.md)
- [refactor/baselines/site-provenance.json](../refactor/baselines/site-provenance.json)
- [refactor/changes/2026-09-15-SITE-07-font-notices.md](../refactor/changes/2026-09-15-SITE-07-font-notices.md)
- [refactor/baselines/site-font-notices-provenance.json](../refactor/baselines/site-font-notices-provenance.json)
- [refactor/baselines/site-font-notices-validation.json](../refactor/baselines/site-font-notices-validation.json)

### VENDOR-06：monaco-static-assets 来源、版本与许可闭环

证据性质：源码/声明/产物事实。后续任务：SITE-01、SITE-05、SITE-07。

当前状态：Monaco 0.30.1 remains byte-pinned, including its known CSS newline-only difference. Codicons 0.0.26, TypeScript 4.4.4 and language-service licenses are delivered. Three service workers, four modes and 76 basic-language bundles reproduce exactly; all 13 core JS minified outputs reproduce with locked esbuild 0.12.6 on Windows x64. Loader/header and css/nls source origins match fixed Git; two maps inventory 584 prepared-source entries and 549 different names. DOMPurify 2.3.1 and marked 3.0.2 have exact source adaptations and complete notice supplements; 85 site notices were verified by HTTP/mobile browser checks. Latest contribution check verifies six archives and 102 Git members, emits 88 TS registration modules and uses RequireJS 2.3.6/Terser 5.9.0 to reproduce the entire dev/min editor assembly, including core string-table entry, dependency injection, order, alias and map trailer. Latest units 23/23, strict type/lint and offline/network source checks pass; modes/tokenizer regressions pass 6/6 across three engines with 2523 token cases per engine. Earlier ten-locale editing/find 30/30 and diff-worker 3/3 evidence remains recorded separately. CSS now reproduces from 68 styles, three embedded images and the copied font, with 81 verified Git members. The archived transport/plugin recipes match every prepared ESM stylesheet; explicit normalization of 70 generated CRLF separators reproduces the entire development CSS. cssnano 4.1.11/PostCSS 7.0.35 reproduce complete minified CSS using isolated frozen Yarn installs (153 selectors/143 versions) and historical browser defaults. The site retains its five header CRLF differences. The exact upstream stage that normalized the 70 development separators is still unidentified. Latest units 25/25, strict type/lint and offline/network checks pass; new three-engine style/theme/font/resize regressions pass 3/3. Original core TS compilation and remaining embedded-origin review stay open; this is not release approval or an exhaustive sanitizer audit. The Node path origin is now fixed to v14.16.0/bd60e93357a118204ea238d94e7a9e4209d93062 and the verified VS Code port. Its complete existing notice text matches both sources; a source supplement corrects the older index link without rewriting it. Six removed exports reproduce both source-map inputs; pinned TS 4.5.0-dev.20211021 emits exact full editor/worker modules. Thirty deterministic original Node path results pass in each browser engine, together with all 86 delivered notices and actual playback: 6/6 browser, 28/28 unit, type/lint, offline/network checks. Chromium retains one observed media ERR_ABORTED despite successful playback. Other embedded origins/full core compilation remain open. DOM helpers now bind six exact VS Code/source-map declarations and fixed WinJS4.4.5 comparison source/complete MIT terms to the unchanged editor; original adaptation version remains unknown, not inferred from that reference. Other origins and full original core compilation remain open. Unicode checkpoint reproduces RTL/Emoji predicates and all 5034 grapheme integers using mixed historical snapshots, matching both original maps and unchanged shipped editor/worker; complete historical Unicode terms and explicit source/version limitations are delivered. Other origins and full original core compilation remain open.

已做处理/后续方向：Keep separate from owned TS migration. Verify source/version/diff and license notices before replacement; preserve API/CSS/worker URLs and run owning package tests.

关闭条件：固定上游版本/内容差异、完整组件许可与分发 notices，兼容测试通过；仅当前上游许可证名称不足以关闭。

复现、排查与验证依据：

- [refactor/third-party.json](../refactor/third-party.json)
- [docs/assets/js/vs](../docs/assets/js/vs)
- [refactor/site-inventory.md](../refactor/site-inventory.md)
- [refactor/baselines/site-provenance.json](../refactor/baselines/site-provenance.json)
- [refactor/changes/2026-09-14-SITE-07-vendor-notices.md](../refactor/changes/2026-09-14-SITE-07-vendor-notices.md)
- [refactor/baselines/site-notices-checkpoint.json](../refactor/baselines/site-notices-checkpoint.json)
- [scripts/site-vendor/manifest.json](../scripts/site-vendor/manifest.json)
- [refactor/baselines/site-codicons-provenance.json](../refactor/baselines/site-codicons-provenance.json)
- [refactor/baselines/site-codicons-validation.json](../refactor/baselines/site-codicons-validation.json)
- [refactor/changes/2026-09-15-SITE-07-codicons.md](../refactor/changes/2026-09-15-SITE-07-codicons.md)
- [refactor/baselines/monaco-typescript-provenance.json](../refactor/baselines/monaco-typescript-provenance.json)
- [refactor/baselines/monaco-typescript-validation.json](../refactor/baselines/monaco-typescript-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-typescript.md](../refactor/changes/2026-09-15-SITE-07-monaco-typescript.md)
- [scripts/site-vendor/monaco/typescript.ts](../scripts/site-vendor/monaco/typescript.ts)
- [scripts/site-vendor/monaco/reproduce-typescript.ts](../scripts/site-vendor/monaco/reproduce-typescript.ts)
- [refactor/baselines/monaco-languages-provenance.json](../refactor/baselines/monaco-languages-provenance.json)
- [refactor/baselines/monaco-languages-validation.json](../refactor/baselines/monaco-languages-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-languages.md](../refactor/changes/2026-09-15-SITE-07-monaco-languages.md)
- [scripts/site-vendor/monaco/languages.ts](../scripts/site-vendor/monaco/languages.ts)
- [scripts/site-vendor/monaco/reproduce-languages.ts](../scripts/site-vendor/monaco/reproduce-languages.ts)
- [refactor/baselines/monaco-language-notices.json](../refactor/baselines/monaco-language-notices.json)
- [refactor/baselines/monaco-language-notices-validation.json](../refactor/baselines/monaco-language-notices-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-language-notices.md](../refactor/changes/2026-09-15-SITE-07-monaco-language-notices.md)
- [scripts/site-vendor/monaco/notices.ts](../scripts/site-vendor/monaco/notices.ts)
- [refactor/baselines/monaco-modes-provenance.json](../refactor/baselines/monaco-modes-provenance.json)
- [refactor/baselines/monaco-modes-validation.json](../refactor/baselines/monaco-modes-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-modes.md](../refactor/changes/2026-09-15-SITE-07-monaco-modes.md)
- [scripts/site-vendor/monaco/compiler.ts](../scripts/site-vendor/monaco/compiler.ts)
- [scripts/site-vendor/monaco/reproduce-modes.ts](../scripts/site-vendor/monaco/reproduce-modes.ts)
- [refactor/baselines/monaco-basic-provenance.json](../refactor/baselines/monaco-basic-provenance.json)
- [refactor/baselines/monaco-basic-validation.json](../refactor/baselines/monaco-basic-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-basic.md](../refactor/changes/2026-09-15-SITE-07-monaco-basic.md)
- [refactor/baselines/monaco-core-origins-provenance.json](../refactor/baselines/monaco-core-origins-provenance.json)
- [refactor/baselines/monaco-core-origins-validation.json](../refactor/baselines/monaco-core-origins-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-core-origins.md](../refactor/changes/2026-09-15-SITE-07-monaco-core-origins.md)
- [refactor/baselines/monaco-core-build-provenance.json](../refactor/baselines/monaco-core-build-provenance.json)
- [refactor/baselines/monaco-core-build-validation.json](../refactor/baselines/monaco-core-build-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-core-build.md](../refactor/changes/2026-09-15-SITE-07-monaco-core-build.md)
- [refactor/baselines/monaco-contributions-provenance.json](../refactor/baselines/monaco-contributions-provenance.json)
- [refactor/baselines/monaco-contributions-validation.json](../refactor/baselines/monaco-contributions-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-contributions.md](../refactor/changes/2026-09-15-SITE-07-monaco-contributions.md)
- [refactor/baselines/monaco-css-build-provenance.json](../refactor/baselines/monaco-css-build-provenance.json)
- [refactor/baselines/monaco-css-build-validation.json](../refactor/baselines/monaco-css-build-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-css.md](../refactor/changes/2026-09-15-SITE-07-monaco-css.md)
- [refactor/baselines/monaco-node-path-provenance.json](../refactor/baselines/monaco-node-path-provenance.json)
- [refactor/baselines/monaco-node-path-validation.json](../refactor/baselines/monaco-node-path-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-node-path.md](../refactor/changes/2026-09-15-SITE-07-monaco-node-path.md)
- [refactor/changes/2026-09-15-SITE-07-monaco-dom.md](../refactor/changes/2026-09-15-SITE-07-monaco-dom.md)
- [refactor/baselines/monaco-dom-origins-provenance.json](../refactor/baselines/monaco-dom-origins-provenance.json)
- [refactor/baselines/monaco-dom-origins-validation.json](../refactor/baselines/monaco-dom-origins-validation.json)
- [refactor/changes/2026-09-15-SITE-07-monaco-unicode.md](../refactor/changes/2026-09-15-SITE-07-monaco-unicode.md)
- [refactor/baselines/monaco-unicode-provenance.json](../refactor/baselines/monaco-unicode-provenance.json)
- [refactor/baselines/monaco-unicode-validation.json](../refactor/baselines/monaco-unicode-validation.json)

### SDK-01：hls.js 实际集成验证范围

证据性质：源码/声明/产物事实。后续任务：PKG-HLS-05、EX-03。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Caller supplies art.hls; homepage demo loads hls.js 1.5.17. Preserve quality/audio selectors and old core integration.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-plugin-hls-control/src/index.ts](../packages/artplayer-plugin-hls-control/src/index.ts)
- [docs/assets/example/hls.control.js](../docs/assets/example/hls.control.js)
- [refactor/hls-validation.md](../refactor/hls-validation.md)

### SDK-02：dash.js 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：PKG-DASH-01、EX-03、PKG-DASH-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Caller supplies art.dash. Preserve published 4.x callers (demo 4.5.2) and workspace 5.x stable representation IDs (demo 5.2.1); verify actual media and SDK lifecycle in PKG-DASH-05.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-plugin-dash-control/src/index.ts](../packages/artplayer-plugin-dash-control/src/index.ts)
- [docs/assets/example/dash.control.js](../docs/assets/example/dash.control.js)
- [refactor/baselines/dash-control-contract.md](../refactor/baselines/dash-control-contract.md)

### SDK-03：flv.js 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：EX-03。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Demo dependency flv.js 1.6.2; customType playback/teardown must be tested with actual SDK.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [docs/assets/example/flv.js](../docs/assets/example/flv.js)

### SDK-04：mpegts.js 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：EX-03。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Demo dependency mpegts.js 1.7.3; actual codec/stream/browser support remains unverified.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [docs/assets/example/mpegts.js](../docs/assets/example/mpegts.js)

### SDK-05：webtorrent 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：EX-03。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Demo URL uses webtorrent@1, a moving major selector; preserve caller integration and explicitly capture actual runtime version.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [docs/assets/example/webtorrent.js](../docs/assets/example/webtorrent.js)

### SDK-06：google-cast 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：PKG-CAST-01、PKG-CAST-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Default remote cast_sender.js?loadCastFramework=1; sdk URL/options and actual Cast device/session behavior require separate validation.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-plugin-chromecast/src/sdk.ts](../packages/artplayer-plugin-chromecast/src/sdk.ts)

### SDK-07：ima-via-glomex 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：PKG-VAST-01、PKG-VAST-05。

当前状态：Real IMA3.789.0 executes with immutable npm1.0.0/candidate bundles: final27 desktop combinations22 passed5 failed; error303 recovery/recreation/active-ad destruction6 passed. Initial27 were23 passed4 failed and are preserved. SDK9000/late loading and historical WebKit ad-frame failures remain open. IAB SDK200 but bridge document ERR_BLOCKED_BY_CLIENT; physical devices/playUrl/skip not accepted. No VPN exception or timeout widening/retry-to-green. Native playUrl/IMA skip UI adds5/6 passes (one9000 failure despite later skip), shared server12/12 passes. Historical WebKit trace contains real ad frames; three fixed raw-media diagnostic runs passed without changing the assertion, so the original intermittent failure is not closed. CI-01 complete installed bundle checkpoint: source/installed native-script loader and cancellation controls each36/36; real remote IMA3.789.0 across three desktop engines39/39 (30 installed candidate,9 published controls), including303 recovery/recreation/active-ad destroy and actual skip UI. No retries/skips or VPN exception. This new successful run does not close earlier intermittent9000/late-ad/historical WebKit observations, physical-device or full distribution gates.

已做处理/后续方向：@glomex/vast-ima-player loadImaSdk loads external IMA; preserve event/content/ad state and teardown, do not equate mocks with vendor service acceptance.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-plugin-vast/src/sdk.ts](../packages/artplayer-plugin-vast/src/sdk.ts)
- [refactor/baselines/vast-contract.md](../refactor/baselines/vast-contract.md)
- [refactor/baselines/vast-release.json](../refactor/baselines/vast-release.json)
- [refactor/changes/2026-09-12-PKG-VAST-01-contract.md](../refactor/changes/2026-09-12-PKG-VAST-01-contract.md)
- [refactor/baselines/vast-contract-validation.json](../refactor/baselines/vast-contract-validation.json)
- [refactor/vast-validation.md](../refactor/vast-validation.md)
- [refactor/baselines/vast-behavior-validation.json](../refactor/baselines/vast-behavior-validation.json)
- [refactor/changes/2026-09-14-PKG-VAST-05-native-checkpoint.md](../refactor/changes/2026-09-14-PKG-VAST-05-native-checkpoint.md)
- [refactor/baselines/vast-native-validation.json](../refactor/baselines/vast-native-validation.json)
- [refactor/changes/2026-09-14-PKG-VAST-05-skip-checkpoint.md](../refactor/changes/2026-09-14-PKG-VAST-05-skip-checkpoint.md)
- [refactor/baselines/vast-skip-validation.json](../refactor/baselines/vast-skip-validation.json)
- [refactor/changes/2026-09-15-CI-01-vast-installed.md](../refactor/changes/2026-09-15-CI-01-vast-installed.md)
- [refactor/baselines/ci-vast-installed-validation.json](../refactor/baselines/ci-vast-installed-validation.json)

### SDK-08：mediapipe-tensorflow 实际集成验证范围

证据性质：源码/声明/产物事实。后续任务：PKG-MASK-01、PKG-MASK-05、PKG-MASK-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Npm dependency versions are separate from unversioned solutionPath CDN assets; keep option override, backend fallback, model result disposal and masks.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-plugin-danmuku-mask/src/index.ts](../packages/artplayer-plugin-danmuku-mask/src/index.ts)
- [refactor/baselines/danmuku-mask-contract.md](../refactor/baselines/danmuku-mask-contract.md)
- [refactor/baselines/danmuku-mask-contract-validation.json](../refactor/baselines/danmuku-mask-contract-validation.json)
- [refactor/baselines/danmuku-mask-release.json](../refactor/baselines/danmuku-mask-release.json)
- [refactor/baselines/danmuku-mask-native-validation.json](../refactor/baselines/danmuku-mask-native-validation.json)
- [refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md](../refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md)

### SDK-09：jassub-worker-wasm-fonts 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：PKG-JASSUB-01、PKG-JASSUB-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Preserve options pass-through, result.instance and worker/wasm/font URLs. Wrapper, worker and WASM must be a verified compatible set.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-plugin-jassub/src/index.ts](../packages/artplayer-plugin-jassub/src/index.ts)
- [docs/assets/example/jassub.js](../docs/assets/example/jassub.js)

### SDK-10：mediabunny 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：PKG-MB-01、PKG-MB-09。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Preserve native-video-like events, HLS input and topology, codec capability failures and AV sync; actual library/codec environment still requires verification.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-proxy-mediabunny/src/input.ts](../packages/artplayer-proxy-mediabunny/src/input.ts)
- [packages/artplayer-proxy-mediabunny/package.json](../packages/artplayer-proxy-mediabunny/package.json)

### SDK-11：asr-caller-service 实际集成验证范围

证据性质：待取证或环境缺口。后续任务：PKG-ASR-01、PKG-ASR-05、EX-03。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Core plugin supplies PCM to caller onAudioChunk. Example fetches an external ASR endpoint and opens its returned WebSocket; not an embedded ASR SDK or a verified service.

关闭条件：固定 SDK/外部资源版本和环境；成功/失败/切换/销毁有真实证据，设备和网络限制逐项记录。

复现、排查与验证依据：

- [packages/artplayer-plugin-asr/src/index.ts](../packages/artplayer-plugin-asr/src/index.ts)
- [docs/assets/example/asr.js](../docs/assets/example/asr.js)

### BASE-ENV-01：Windows WebKit native Blob video samples lack decoding support; Apple-device validation remains outstanding

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：REL-03、REVIEW-02。

当前状态：Independent video probes on Windows WebKit 26.6 return error 4 and width zero for both local MP4 and WebM Blob samples. Chromium and Firefox decode the tested Blob sample. WebKit ownership tests explicitly report decodedBlob=false.

已做处理/后续方向：Keep byte ownership and real HTTP playback evidence distinct from native Blob decoding; do not infer Safari or Apple-device support from Windows WebKit.

关闭条件：Record actual Safari and Apple device versions and native sample capabilities, then compare published/candidate load, playback, seek, source replacement and Blob ownership.

复现、排查与验证依据：

- [test/browser/progress-quality.spec.js](../test/browser/progress-quality.spec.js)
- [refactor/environment-matrix.md](../refactor/environment-matrix.md)

### HLS-ENV-01：Windows WebKit 缺失 MSE，HLS 播放矩阵尚缺 Safari 证据

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-HLS-05、REL-09、REVIEW-02。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：显式验证宿主不支持，保留 14 skipped，不作为播放通过；补有 MSE 的 Safari/macOS/iOS 环境。

关闭条件：实际 Safari/MSE/native 路径证据齐全，不能仅凭 Windows 能力检查关闭。

复现、排查与验证依据：

- [refactor/hls-validation.md](../refactor/hls-validation.md)
- [test/hls-control.test.js](../test/hls-control.test.js)
- [test/browser/hls-control.spec.js](../test/browser/hls-control.spec.js)

### HLS-CRASH-01：Firefox Hls 1.5.17 worker 播放切组及销毁路径出现页面崩溃信号

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-HLS-SDK-01、PKG-HLS-05、REVIEW-02。

当前状态：2026-09-14 direct HTTP/no ArtPlayer/plugin/Worker observer:35 diagnostics,31 passed4 failed. Worker reset-first fails1/10 and1/5; no-worker10/10 and optional pre-destroy snapshot5/5 pass. SDK-first also fails2/5. Three phase-recorded crashes occur during final-state collection after destroy returned. Installed Firefox TargetRegistry observer receives oop-frameloader-crashed; no native stack/root cause established. Do not substitute no-worker/snapshot success or change core teardown order; risk remains open. 2026-09-15 sequence: direct native video first 1.5.17 case reports page crash in high-group phase before explicit destroy; no earlier SDK case, ArtPlayer, plugin, route, SDK logger or Worker observer. Three ordered sequences plus one default invocation total 8 passed/1 failed. Native cause remains unproven; do not restrict investigation to teardown or merge distinct signals into a proven shared cause. 2026-09-15 installed Firefox 1543 local omni.ja buildconfig includes --disable-crashreporter; playwright.cfg locks crash reporter off. No native stack collected. Environment-variable-only capture cannot restore a compile-disabled component; next evidence needs scoped Windows native debugging or a separately validated browser build. Later in this checkpoint, direct 1.5.17 crashed twice before destroy (one first-in-sequence); no ArtPlayer/plugin. Optional Node event queue retained 97 events in the second crash, ending during overlapping audio/video flush and high selection at media time 0.381837. Crash receipt was low-group; following assertion failure was high-group. No native module/exception/stack established. 2026-09-15 native capture: direct Hls 1.5.17, worker=true, HTTP, immediate switch yielded two pre-destroy page crashes in six iterations. ProcDump 12.01 captured one unhandled C0000005 read at address 0x8, exception thread named DOM Worker, xul.dll+0x3bc4be0. First/second page crashes retained 96/95 host events. No symbol stack or root cause; do not equate the separate 1.7.2 playback stall. Later six and two iterations pass without dumps, but native monitoring is partial due to permission-denied subprocesses; all monitors exited. Risk remains open.

已做处理/后续方向：直接原生 video（无 ArtPlayer/插件）和候选核心已有 page crashed；候选核心无观察器也复现。继续区分 SDK、Firefox/Playwright 与媒体销毁，不静默改核心 destroy 顺序或调用方 SDK 配置。

关闭条件：取得可解释的崩溃诊断或直接 SDK 对照；验证处置和新旧核心/worker/分组销毁矩阵，不能仅以再次通过关闭。

复现、排查与验证依据：

- [test/browser/hls-sdk.spec.js](../test/browser/hls-sdk.spec.js)
- [refactor/changes/2026-09-12-PKG-HLS-SDK-01-integration.md](../refactor/changes/2026-09-12-PKG-HLS-SDK-01-integration.md)
- [refactor/baselines/hls-sdk-diagnostics.json](../refactor/baselines/hls-sdk-diagnostics.json)
- [refactor/scripts/hls-sdk-diagnostic.mjs](../refactor/scripts/hls-sdk-diagnostic.mjs)
- [refactor/changes/2026-09-14-PKG-HLS-SDK-01-http-teardown.md](../refactor/changes/2026-09-14-PKG-HLS-SDK-01-http-teardown.md)
- [refactor/baselines/hls-http-teardown-validation.json](../refactor/baselines/hls-http-teardown-validation.json)
- [refactor/changes/2026-09-15-PKG-HLS-SDK-01-sdk-sequence.md](../refactor/changes/2026-09-15-PKG-HLS-SDK-01-sdk-sequence.md)
- [refactor/baselines/hls-sdk-sequence-validation.json](../refactor/baselines/hls-sdk-sequence-validation.json)
- [refactor/changes/2026-09-15-PKG-HLS-SDK-01-controller-state.md](../refactor/changes/2026-09-15-PKG-HLS-SDK-01-controller-state.md)
- [refactor/baselines/hls-controller-validation.json](../refactor/baselines/hls-controller-validation.json)
- [refactor/changes/2026-09-15-PKG-HLS-SDK-01-native-exception.md](../refactor/changes/2026-09-15-PKG-HLS-SDK-01-native-exception.md)
- [refactor/baselines/hls-native-validation.json](../refactor/baselines/hls-native-validation.json)

### HLS-PLAYBACK-01：Firefox 旧核心与 Hls 1.7.2 切组后视频档位未完成切换

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-HLS-SDK-01、PKG-HLS-05、REVIEW-02。

当前状态： 2026-09-15 unchanged integration 20/20 passes do not close historical failure. Optional --controller-state now captures fixed SDK controller/buffer/fragment tracker state. Final direct and published-core controls pass for both SDKs; successful cases can briefly show main ENDED and empty media ranges while video SourceBuffer remains populated. Original failure still needs those independent buffers and tracker state; no forced-reset workaround.

已做处理/后续方向：区分 SDK、测试媒体/时序和宿主问题，保留真实档位/解码断言及 trace；不扩大等待或只验证菜单。

关闭条件：直接 Hls 与新旧核心对照定位切换停滞，验证处置和正常/连续组切换，不能以重复通过关闭。

复现、排查与验证依据：

- [test/browser/hls-sdk.spec.js](../test/browser/hls-sdk.spec.js)
- [refactor/changes/2026-09-12-PKG-HLS-SDK-01-integration.md](../refactor/changes/2026-09-12-PKG-HLS-SDK-01-integration.md)
- [refactor/baselines/hls-sdk-validation.json](../refactor/baselines/hls-sdk-validation.json)
- [refactor/changes/2026-09-15-PKG-HLS-SDK-01-switch-boundary.md](../refactor/changes/2026-09-15-PKG-HLS-SDK-01-switch-boundary.md)
- [refactor/baselines/hls-switch-boundary-validation.json](../refactor/baselines/hls-switch-boundary-validation.json)
- [refactor/changes/2026-09-15-PKG-HLS-SDK-01-controller-state.md](../refactor/changes/2026-09-15-PKG-HLS-SDK-01-controller-state.md)
- [refactor/baselines/hls-controller-validation.json](../refactor/baselines/hls-controller-validation.json)

### AUDIO-SYNC-01：Audio Track 未同步原生暂停/结束，偏移边界与切源/缓冲仍待完整验证

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUDIO-02、PKG-AUDIO-03、PKG-AUDIO-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：03 已修复原生暂停/结束；05 的连续切源和偏移原生对照已验证，真实缓冲 Chromium/Firefox 初轮通过但 Windows WebKit 保留 AUDIO-BUFFER-01；策略/设备缺口继续 open。

关闭条件：正常/边界/失败/缓冲恢复有媒体与受控断言，实际支持环境缺口明确处理。

复现、排查与验证依据：

- [refactor/baselines/audio-track-contract.md](../refactor/baselines/audio-track-contract.md)
- [refactor/baselines/audio-track-release.json](../refactor/baselines/audio-track-release.json)
- [test/audio-track.test.js](../test/audio-track.test.js)
- [test/browser/audio-track.spec.js](../test/browser/audio-track.spec.js)
- [refactor/baselines/audio-validation.json](../refactor/baselines/audio-validation.json)
- [refactor/baselines/audio-lifecycle-validation.json](../refactor/baselines/audio-lifecycle-validation.json)
- [refactor/baselines/audio-combinations-checkpoint.json](../refactor/baselines/audio-combinations-checkpoint.json)

### AUDIO-DEMO-01：Audio Track README 示例链接名称不匹配且缺维护说明

证据性质：源码/声明/产物事实。后续任务：PKG-AUDIO-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：修正 audio.track 示例路径，补真实模块地图及 update/生命周期说明。

关闭条件：README、示例、公开声明一致，8082 正式 demo 和包分发验证通过。

复现、排查与验证依据：

- [refactor/baselines/audio-track-contract.md](../refactor/baselines/audio-track-contract.md)
- [refactor/baselines/audio-track-release.json](../refactor/baselines/audio-track-release.json)

### AUDIO-BUFFER-01：Windows WebKit 原生媒体无法在受限响应下推进至真实缓冲

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUDIO-05。

当前状态：CI-01 九包安装扩展的首轮 336 项中，Windows WebKit 八项新旧音频受限媒体组合继续失败。七项未观察到目标可信 waiting，一项受限视频路径耗尽整体时间并在最终状态读取中报页面关闭。其他引擎均通过；保留原始失败，不以销毁后状态反推初始解码错误，不推断新的共同底层原因。 Same-file prefix controls now show Windows WebKit can start before releasing the tail with larger prefixes (video188653/audio65536), but four committed native diagnostics still record no trusted waiting. Default three-engine diagnostics retain Chromium/Firefox8 progression+waiting and WebKit4 no progression/no waiting. Before-release request copies distinguish held bytes from final sent counters; no production fix or waiver. Complete WebKit source run ae56937d3: all eight initial dual-clock assertions pass, then all eight fail the original trusted waiting/time>0.3 assertion at line30. Seven record no waiting; one has only a trusted time0 event. Held prefixes remain96KiB/32KiB. Recovery assertions are not reached; no production fix or waiver.

已做处理/后续方向：保留真实 waiting 断言；使用独立原生对照和其他实际支持环境/输入继续验证，不将没有播放推进的诊断当成缓冲通过，也不凭此改变插件 API 或否定真实 Safari 支持。 PKG-AUDIO-BUFFER-01已修正测试等待顺序；独立切源放行12项通过，原WebKit真实缓冲8项仍失败，本风险不关闭。

关闭条件：受影响的缓冲/恢复得到真实媒体证据；与原生能力和测试夹具差异分开，发布环境的剩余范围经显式处理。

复现、排查与验证依据：

- [test/browser/audio-buffering.spec.js](../test/browser/audio-buffering.spec.js)
- [test/browser/media-gate-native.spec.js](../test/browser/media-gate-native.spec.js)
- [test/helpers/media-gate.js](../test/helpers/media-gate.js)
- [test/media-gate.test.js](../test/media-gate.test.js)
- [refactor/baselines/audio-combinations-checkpoint.json](../refactor/baselines/audio-combinations-checkpoint.json)
- [refactor/audio-validation.md](../refactor/audio-validation.md)
- [refactor/changes/2026-09-15-CI-01-subtitles-installed.md](../refactor/changes/2026-09-15-CI-01-subtitles-installed.md)
- [refactor/baselines/ci-subtitles-installed-validation.json](../refactor/baselines/ci-subtitles-installed-validation.json)
- [refactor/changes/2026-09-15-PKG-AUDIO-05-prefix.md](../refactor/changes/2026-09-15-PKG-AUDIO-05-prefix.md)
- [refactor/baselines/audio-prefix-validation.json](../refactor/baselines/audio-prefix-validation.json)
- [refactor/changes/2026-09-15-CI-01-source-webkit.md](../refactor/changes/2026-09-15-CI-01-source-webkit.md)
- [refactor/baselines/ci-source-webkit-validation.json](../refactor/baselines/ci-source-webkit-validation.json)
- [refactor/changes/2026-09-15-CI-01-installed-webkit.md](../refactor/changes/2026-09-15-CI-01-installed-webkit.md)
- [refactor/baselines/ci-installed-webkit-validation.json](../refactor/baselines/ci-installed-webkit-validation.json)
- [refactor/changes/2026-09-16-PKG-AUDIO-BUFFER-01-order.md](../refactor/changes/2026-09-16-PKG-AUDIO-BUFFER-01-order.md)
- [refactor/baselines/audio-buffer-order-validation.json](../refactor/baselines/audio-buffer-order-validation.json)

### CHAPTER-TIMING-01：Windows WebKit 清晰度切换曾在等待窗口内未见 restart，稍后状态恢复

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-CHAPTER-05。

当前状态：Six-package installed run: WebKit candidate/core Chapter failed after restart while waiting for non-seeking readyState>=2. A trace evaluation took 9939.104 ms and returned false; initial seeked had already fired, followed later by another seeking/canplay. This is a different observed phase from the previous restart timeout; common root cause remains unconfirmed. Keep both failures and investigate without relaxing timeouts. Fixed diagnostic runs with/without trace each retain one WebKit combination failure, while observed native getters/setters remain <=2 ms and page heartbeats show roughly five-second gaps. A no-ArtPlayer native video control restores with one correction yet reproduces a similar five-second gap; deferring correction still shows 5104 ms. Exact cause and relation to each earlier ten-second failure remain unconfirmed; no production timer workaround adopted. Current major core6/Chapter2 installed matrix: 11 pass, 1 WebKit failure (candidate core + published Chapter). Restart was recorded 619ms after selection; the next trace evaluation took 9989.901ms and returned the correct restart list after the 7000ms observation deadline. This case establishes timely event emission but not the underlying stall cause; no timeout or production workaround adopted.

已做处理/后续方向：记录原生事件和绝对/相对时序，进一步区分媒体驱动耗时、夹具和核心源操作；未证明原因前不改核心、不扩大超时或重复到绿灯。

关闭条件：确认先前超时的来源并有对应可靠回归；后续单次通过不足以关闭。

复现、排查与验证依据：

- [refactor/baselines/chapter-combinations-checkpoint.json](../refactor/baselines/chapter-combinations-checkpoint.json)
- [test/browser/chapter-combinations.spec.js](../test/browser/chapter-combinations.spec.js)
- [refactor/changes/2026-09-12-PKG-CHAPTER-05-combinations.md](../refactor/changes/2026-09-12-PKG-CHAPTER-05-combinations.md)
- [refactor/changes/2026-09-14-PKG-CHAPTER-05-timing.md](../refactor/changes/2026-09-14-PKG-CHAPTER-05-timing.md)
- [refactor/baselines/chapter-timing-observations.json](../refactor/baselines/chapter-timing-observations.json)
- [refactor/baselines/ci-ads-installed-validation.json](../refactor/baselines/ci-ads-installed-validation.json)
- [refactor/changes/2026-09-15-CI-01-ads-installed.md](../refactor/changes/2026-09-15-CI-01-ads-installed.md)
- [refactor/changes/2026-09-15-PKG-CHAPTER-05-native-timing.md](../refactor/changes/2026-09-15-PKG-CHAPTER-05-native-timing.md)
- [refactor/baselines/chapter-native-timing-validation.json](../refactor/baselines/chapter-native-timing-validation.json)
- [refactor/changes/2026-09-15-CI-01-installed-webkit.md](../refactor/changes/2026-09-15-CI-01-installed-webkit.md)
- [refactor/baselines/ci-installed-webkit-validation.json](../refactor/baselines/ci-installed-webkit-validation.json)
- [refactor/changes/2026-09-16-PKG-CHAPTER-05-major-timing.md](../refactor/changes/2026-09-16-PKG-CHAPTER-05-major-timing.md)
- [refactor/baselines/chapter-major-timing-validation.json](../refactor/baselines/chapter-major-timing-validation.json)

### DASH-SDK-01：npm 发布版 4.x 与工作区仅 5.x 的 SDK 接口不兼容

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-DASH-02、PKG-DASH-03、PKG-DASH-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：按方法能力适配两代已存在用法，保留 v5 稳定 ID，不能要求旧消费者改用新 SDK。

关闭条件：归档旧用法、v4/v5 受控及实际媒体矩阵通过，清晰度键不混用。

复现、排查与验证依据：

- [refactor/baselines/dash-control-contract.md](../refactor/baselines/dash-control-contract.md)
- [refactor/baselines/dash-control-release.json](../refactor/baselines/dash-control-release.json)
- [packages/artplayer-plugin-dash-control/src/index.ts](../packages/artplayer-plugin-dash-control/src/index.ts)
- [packages/artplayer-plugin-dash-control/types/artplayer-plugin-dash-control.d.ts](../packages/artplayer-plugin-dash-control/types/artplayer-plugin-dash-control.d.ts)
- [docs/assets/example/dash.control.js](../docs/assets/example/dash.control.js)
- [test/dash-contract.test.js](../test/dash-contract.test.js)
- [refactor/dash-validation.md](../refactor/dash-validation.md)
- [test/dash-lifecycle.test.js](../test/dash-lifecycle.test.js)
- [refactor/baselines/dash-runtime.json](../refactor/baselines/dash-runtime.json)
- [refactor/baselines/dash-sdk-checkpoint.json](../refactor/baselines/dash-sdk-checkpoint.json)

### DASH-DEMO-01：DASH 示例仅新 SDK 且重复安装会累积销毁回调

证据性质：源码/声明/产物事实。后续任务：PKG-DASH-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：验证真实 SDK 销毁和示例重载路径，对齐 v4/v5 文档与示例，不让旧监听误操作新实例。

关闭条件：真实 8082 demo、旧/新 SDK 路径与 tarball 产物一致，监听和 SDK 所有权可验证。

复现、排查与验证依据：

- [refactor/baselines/dash-control-contract.md](../refactor/baselines/dash-control-contract.md)
- [refactor/baselines/dash-control-release.json](../refactor/baselines/dash-control-release.json)
- [packages/artplayer-plugin-dash-control/src/index.ts](../packages/artplayer-plugin-dash-control/src/index.ts)
- [packages/artplayer-plugin-dash-control/types/artplayer-plugin-dash-control.d.ts](../packages/artplayer-plugin-dash-control/types/artplayer-plugin-dash-control.d.ts)
- [docs/assets/example/dash.control.js](../docs/assets/example/dash.control.js)

### DASH-SEEK-01：dash.js 4.5.2 空裁剪漏更新缓冲量，稳定暂停 seek 后调度停滞

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-DASH-05、REVIEW-02、PKG-DASH-SEEK-01。

当前状态：CI-01 十二包安装扩展中，裸 SDK 4.5.2 在 Chromium/Firefox 的恢复时间仍为 6，原断言大于 6.2 失败；候选插件集成通过不关闭裸 SDK 原始缺陷，完整失败报告保留。 Complete Firefox source run at 4545c4367 again fails the bare 4.5.2 control; all four candidate stable-boundary cases pass. Original failure remains open and unfiltered. Complete Chromium installed roster at 5e0447fc5, twenty freshly packed packages: 844/845 pass, with the same bare 4.5.2 currentTime=6 failure; all four installed candidate stable-boundary combinations pass. Original failure remains open. Complete Firefox installed roster at b3344a7c6, the same verified twenty-package run-cRduve installation: 844/845 pass, with the same bare 4.5.2 currentTime=6 failure; all four installed candidate stable-boundary combinations pass. Original failure remains open.

已做处理/后续方向：PKG-DASH-SEEK-01 已在候选插件按精确版本和真实空缓冲同步 SDK 指标，新旧核心及两引擎严格跳转通过。裸 SDK 4.5.2 和冻结旧插件仍保留原始失败；不伪造媒体事件、不偏移 seek、不强制升级 SDK，完整组合及发布验收仍开放。

关闭条件：原失败的新旧核心/插件组合有确定根因与对应修复/可验证环境边界；原生对照及原顺序、原目标回归成立，后续偶然通过不能关闭。

复现、排查与验证依据：

- [test/browser/dash-sdk.spec.js](../test/browser/dash-sdk.spec.js)
- [refactor/baselines/dash-sdk-checkpoint.json](../refactor/baselines/dash-sdk-checkpoint.json)
- [refactor/changes/2026-09-12-PKG-DASH-05-sdk-checkpoint.md](../refactor/changes/2026-09-12-PKG-DASH-05-sdk-checkpoint.md)
- [refactor/changes/2026-09-12-PKG-DASH-05-seek-diagnosis.md](../refactor/changes/2026-09-12-PKG-DASH-05-seek-diagnosis.md)
- [refactor/baselines/dash-seek-diagnosis.json](../refactor/baselines/dash-seek-diagnosis.json)
- [test/browser/dash-buffer-observer.js](../test/browser/dash-buffer-observer.js)
- [refactor/changes/2026-09-14-CI-01-source-chromium.md](../refactor/changes/2026-09-14-CI-01-source-chromium.md)
- [refactor/baselines/ci-source-chromium-validation.json](../refactor/baselines/ci-source-chromium-validation.json)
- [refactor/changes/2026-09-14-PKG-DASH-SEEK-01-buffer-metrics.md](../refactor/changes/2026-09-14-PKG-DASH-SEEK-01-buffer-metrics.md)
- [refactor/baselines/dash-seek-recovery-validation.json](../refactor/baselines/dash-seek-recovery-validation.json)
- [refactor/changes/2026-09-15-CI-01-adaptive-installed.md](../refactor/changes/2026-09-15-CI-01-adaptive-installed.md)
- [refactor/baselines/ci-adaptive-installed-validation.json](../refactor/baselines/ci-adaptive-installed-validation.json)
- [refactor/baselines/ci-source-firefox-validation.json](../refactor/baselines/ci-source-firefox-validation.json)
- [refactor/changes/2026-09-15-SITE-EDITOR-VAST-01-consumer.md](../refactor/changes/2026-09-15-SITE-EDITOR-VAST-01-consumer.md)
- [refactor/changes/2026-09-15-CI-01-installed-chromium.md](../refactor/changes/2026-09-15-CI-01-installed-chromium.md)
- [refactor/baselines/ci-installed-chromium-validation.json](../refactor/baselines/ci-installed-chromium-validation.json)
- [refactor/changes/2026-09-15-CI-01-installed-firefox.md](../refactor/changes/2026-09-15-CI-01-installed-firefox.md)
- [refactor/baselines/ci-installed-firefox-validation.json](../refactor/baselines/ci-installed-firefox-validation.json)

### ADS-DIST-01：Ads npm 1.0.6 default namespace 与未发布 2.1.0 callable/exports 分发不同

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-ADS-04、PKG-ADS-06、REL-01。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：保留旧 require(pkg).default、global 与有效 dist 路径，同时支持当前 callable/ESM/legacy。工作区 2.1.0 不冒充实际已发布版本，正式目标仍按计划 3.0.0。

关闭条件：工作区外真实 tarball 的旧/新导入、浏览器与声明入口全部验证，版本占用再次核实。

复现、排查与验证依据：

- [refactor/baselines/ads-release.json](../refactor/baselines/ads-release.json)
- [refactor/baselines/ads-contract.md](../refactor/baselines/ads-contract.md)
- [refactor/scripts/ads-contract.test.mjs](../refactor/scripts/ads-contract.test.mjs)
- [packages/artplayer-plugin-ads/package.json](../packages/artplayer-plugin-ads/package.json)
- [refactor/baselines/ads-types-validation.json](../refactor/baselines/ads-types-validation.json)

### ADS-MEDIA-01：Ads metadata 与 play 拒绝、隐藏页媒体状态和内容恢复仍缺真实验证

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-ADS-02、PKG-ADS-03、PKG-ADS-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：用本地媒体验证事件安装顺序、加载失败与拒绝、倒计时和广告播放的独立语义，恢复主片时不吞公共拒绝或在销毁后播放。 05已验证桌面Chrome真实后台标签暂停/恢复、视频继续播放和后台销毁，main/legacy各6组合；最小化和实际移动端媒体策略仍缺设备证据，保持open。

关闭条件：实际广告/主片的加载、暂停/恢复、失败/换源/销毁和隐藏状态有新旧核心组合证据。

复现、排查与验证依据：

- [refactor/baselines/ads-contract.md](../refactor/baselines/ads-contract.md)
- [packages/artplayer-plugin-ads/src/index.ts](../packages/artplayer-plugin-ads/src/index.ts)
- [docs/assets/example/ads.js](../docs/assets/example/ads.js)
- [test/ads.test.js](../test/ads.test.js)
- [test/browser/ads.spec.js](../test/browser/ads.spec.js)
- [refactor/ads-validation.md](../refactor/ads-validation.md)
- [refactor/baselines/ads-validation.json](../refactor/baselines/ads-validation.json)
- [refactor/baselines/ads-lifecycle-validation.json](../refactor/baselines/ads-lifecycle-validation.json)
- [refactor/changes/2026-09-12-PKG-ADS-03-lifecycle.md](../refactor/changes/2026-09-12-PKG-ADS-03-lifecycle.md)
- [packages/artplayer-plugin-ads/ARCHITECTURE.md](../packages/artplayer-plugin-ads/ARCHITECTURE.md)
- [refactor/baselines/ads-ui-visibility-validation.json](../refactor/baselines/ads-ui-visibility-validation.json)
- [refactor/changes/2026-09-12-PKG-ADS-05-browser.md](../refactor/changes/2026-09-12-PKG-ADS-05-browser.md)

### VAST-LIFE-01：VAST SDK and container lack core destruction ownership and pending work cancellation

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-VAST-02、PKG-VAST-03、PKG-VAST-05。

当前状态：Task03 controlled82 Node/162 browser checks remain valid; task05 adds6 real IMA303 recovery/recreation/active-ad core destruction passes across three engines/two modes. Native full combination failures, devices and remaining ad lifecycle paths keep this risk open; no claim of complete vendor/device acceptance. Native playUrl/IMA skip UI adds5/6 passes (one9000 failure despite later skip), shared server12/12 passes. Historical WebKit trace contains real ad frames; three fixed raw-media diagnostic runs passed without changing the assertion, so the original intermittent failure is not closed. CI-01 complete installed bundle checkpoint: source/installed native-script loader and cancellation controls each36/36; real remote IMA3.789.0 across three desktop engines39/39 (30 installed candidate,9 published controls), including303 recovery/recreation/active-ad destroy and actual skip UI. No retries/skips or VPN exception. This new successful run does not close earlier intermittent9000/late-ad/historical WebKit observations, physical-device or full distribution gates.

已做处理/后续方向：Reproduce pending SDK/callback destruction, errors, duplicate IDs and stale ad events before adding compatible cleanup and state ownership.

关闭条件：Tests prove cleanup during load/callback rejection/core destruction and distinguish explicit plugin recreation from terminal core destruction; vendor media restoration is separately verified.

复现、排查与验证依据：

- [refactor/baselines/vast-contract.md](../refactor/baselines/vast-contract.md)
- [refactor/baselines/vast-release.json](../refactor/baselines/vast-release.json)
- [refactor/changes/2026-09-12-PKG-VAST-01-contract.md](../refactor/changes/2026-09-12-PKG-VAST-01-contract.md)
- [refactor/baselines/vast-contract-validation.json](../refactor/baselines/vast-contract-validation.json)
- [refactor/changes/2026-09-12-PKG-VAST-02-tests.md](../refactor/changes/2026-09-12-PKG-VAST-02-tests.md)
- [refactor/baselines/vast-behavior-validation.json](../refactor/baselines/vast-behavior-validation.json)
- [refactor/baselines/vast-core.json](../refactor/baselines/vast-core.json)
- [refactor/vast-validation.md](../refactor/vast-validation.md)
- [refactor/baselines/vast-lifecycle-validation.json](../refactor/baselines/vast-lifecycle-validation.json)
- [refactor/changes/2026-09-12-PKG-VAST-03-lifecycle.md](../refactor/changes/2026-09-12-PKG-VAST-03-lifecycle.md)
- [refactor/changes/2026-09-14-PKG-VAST-03-compatibility.md](../refactor/changes/2026-09-14-PKG-VAST-03-compatibility.md)
- [refactor/baselines/vast-compatibility-validation.json](../refactor/baselines/vast-compatibility-validation.json)
- [refactor/changes/2026-09-14-PKG-VAST-05-native-checkpoint.md](../refactor/changes/2026-09-14-PKG-VAST-05-native-checkpoint.md)
- [refactor/baselines/vast-native-validation.json](../refactor/baselines/vast-native-validation.json)
- [refactor/changes/2026-09-14-PKG-VAST-05-skip-checkpoint.md](../refactor/changes/2026-09-14-PKG-VAST-05-skip-checkpoint.md)
- [refactor/baselines/vast-skip-validation.json](../refactor/baselines/vast-skip-validation.json)
- [refactor/changes/2026-09-15-CI-01-vast-installed.md](../refactor/changes/2026-09-15-CI-01-vast-installed.md)
- [refactor/baselines/ci-vast-installed-validation.json](../refactor/baselines/ci-vast-installed-validation.json)

### VAST-DIST-01：Published VAST CommonJS default namespace differs from the current callable distribution

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-VAST-04、PKG-VAST-06、PKG-VAST-07。

当前状态：Task07 preserves old JavaScript default calls. Task04 adds accurate typed default on /runtime, actual isolated root/legacy/runtime imports and native ESM identity checks; preserves npm root types. Historical deep paths, complete browser distribution and old namespace reflection distinction remain task06; risk stays open.

已做处理/后续方向：Preserve require(pkg).default alongside callable factory, script global and current ESM/legacy paths.

关闭条件：Real packed main/legacy/ESM, historical deep imports, export= consumers and local demo/editor all pass with immutable published comparisons.

复现、排查与验证依据：

- [refactor/baselines/vast-contract.md](../refactor/baselines/vast-contract.md)
- [refactor/baselines/vast-release.json](../refactor/baselines/vast-release.json)
- [refactor/changes/2026-09-12-PKG-VAST-01-contract.md](../refactor/changes/2026-09-12-PKG-VAST-01-contract.md)
- [refactor/baselines/vast-contract-validation.json](../refactor/baselines/vast-contract-validation.json)
- [refactor/changes/2026-09-14-PKG-VAST-07-default-alias.md](../refactor/changes/2026-09-14-PKG-VAST-07-default-alias.md)
- [refactor/baselines/vast-alias-validation.json](../refactor/baselines/vast-alias-validation.json)
- [test/vast-exports.test.js](../test/vast-exports.test.js)
- [refactor/changes/2026-09-14-PKG-VAST-04-types.md](../refactor/changes/2026-09-14-PKG-VAST-04-types.md)
- [refactor/baselines/vast-types-validation.json](../refactor/baselines/vast-types-validation.json)

### AMBILIGHT-LIFE-01：Ambilight sampling and RAF/DOM ownership lack terminal/error handling

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AMBILIGHT-02、PKG-AMBILIGHT-03、PKG-AMBILIGHT-05。

当前状态：Candidate source split into four strict TS modules. RAF zero, terminal cleanup, rollback and reentrant frames repaired; 16 candidate tests pass (14 fail against frozen source). Eighteen native video/canvas tests pass across three cores and three engines after reproducing Firefox width-reset taint and replacing failed canvas. Risk remains open for proxy lifecycle/capability checks in PKG-AMBILIGHT-05; do not extend native video evidence to proxies.

已做处理/后续方向：Reproduce errors, zero sizes, RAF id zero, escaped methods and destroy before adding plugin-local ownership without changing stop semantics.

关闭条件：Published failures reproduced, candidate cleanup and real canvas/media/source-switch checks pass.

复现、排查与验证依据：

- [refactor/baselines/ambilight-contract.md](../refactor/baselines/ambilight-contract.md)
- [refactor/baselines/ambilight-release.json](../refactor/baselines/ambilight-release.json)
- [refactor/changes/2026-09-12-PKG-AMBILIGHT-01-contract.md](../refactor/changes/2026-09-12-PKG-AMBILIGHT-01-contract.md)
- [refactor/changes/2026-09-12-PKG-AMBILIGHT-02-tests.md](../refactor/changes/2026-09-12-PKG-AMBILIGHT-02-tests.md)
- [refactor/baselines/ambilight-behavior-validation.json](../refactor/baselines/ambilight-behavior-validation.json)
- [refactor/ambilight-validation.md](../refactor/ambilight-validation.md)
- [refactor/changes/2026-09-12-PKG-AMBILIGHT-03-lifecycle.md](../refactor/changes/2026-09-12-PKG-AMBILIGHT-03-lifecycle.md)
- [refactor/baselines/ambilight-lifecycle-validation.json](../refactor/baselines/ambilight-lifecycle-validation.json)

### DPIP-PACK-01：Published Document PiP 1.0.0 tarball omits every declared runtime entry

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-DPIP-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Keep the immutable broken archive as a negative case; verify complete candidate tarball and document the historical version boundary.

关闭条件：Candidate archive and real runtime entries verified; missing 1.0.0 runtime is documented rather than replaced or claimed fixed in place.

复现、排查与验证依据：

- [refactor/baselines/dpip-release.json](../refactor/baselines/dpip-release.json)
- [refactor/baselines/dpip-contract.md](../refactor/baselines/dpip-contract.md)
- [refactor/changes/2026-09-12-PKG-DPIP-01-contract.md](../refactor/changes/2026-09-12-PKG-DPIP-01-contract.md)

### DPIP-LIFE-01：Document PiP has no separate ownership for pending window requests and delayed post-transition callbacks

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-DPIP-02、PKG-DPIP-03、PKG-DPIP-05。

当前状态：Six strict TS modules with candidate fixes for pending requests, terminal effects, partial rollback and style ownership. Candidate versus frozen tests preserve historical failures. Native Document PiP/proxy/device evidence remains task05; current iframe coverage controls the window API.

已做处理/后续方向：Reproduce overlapping open/close/destroy and retained controls/listeners before implementing terminal state and resource ownership.

关闭条件：Historical races reproduced; candidate late windows and delayed effects cannot revive disposed players, with native lifecycle validation.

复现、排查与验证依据：

- [refactor/baselines/dpip-release.json](../refactor/baselines/dpip-release.json)
- [refactor/baselines/dpip-contract.md](../refactor/baselines/dpip-contract.md)
- [refactor/changes/2026-09-12-PKG-DPIP-01-contract.md](../refactor/changes/2026-09-12-PKG-DPIP-01-contract.md)
- [refactor/changes/2026-09-12-PKG-DPIP-02-tests.md](../refactor/changes/2026-09-12-PKG-DPIP-02-tests.md)
- [refactor/baselines/dpip-behavior-validation.json](../refactor/baselines/dpip-behavior-validation.json)
- [refactor/changes/2026-09-12-PKG-DPIP-03-lifecycle.md](../refactor/changes/2026-09-12-PKG-DPIP-03-lifecycle.md)
- [refactor/baselines/dpip-lifecycle-validation.json](../refactor/baselines/dpip-lifecycle-validation.json)

### DPIP-DOM-01：Document PiP copies global-document styles and retains original parent without transactional rollback

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-DPIP-02、PKG-DPIP-03、PKG-DPIP-05。

当前状态：Six strict TS modules with candidate fixes for pending requests, terminal effects, partial rollback and style ownership. Candidate versus frozen tests preserve historical failures. Native Document PiP/proxy/device evidence remains task05; current iframe coverage controls the window API.

已做处理/后续方向：Reproduce adoption/style/restore errors and foreign ownerDocument cases, then implement explicit document and rollback ownership.

关闭条件：Candidate failures restore node identity, order, document bindings and styles with native window/proxy evidence.

复现、排查与验证依据：

- [refactor/baselines/dpip-release.json](../refactor/baselines/dpip-release.json)
- [refactor/baselines/dpip-contract.md](../refactor/baselines/dpip-contract.md)
- [refactor/changes/2026-09-12-PKG-DPIP-01-contract.md](../refactor/changes/2026-09-12-PKG-DPIP-01-contract.md)
- [refactor/changes/2026-09-12-PKG-DPIP-02-tests.md](../refactor/changes/2026-09-12-PKG-DPIP-02-tests.md)
- [refactor/baselines/dpip-behavior-validation.json](../refactor/baselines/dpip-behavior-validation.json)
- [refactor/changes/2026-09-12-PKG-DPIP-03-lifecycle.md](../refactor/changes/2026-09-12-PKG-DPIP-03-lifecycle.md)
- [refactor/baselines/dpip-lifecycle-validation.json](../refactor/baselines/dpip-lifecycle-validation.json)

### DPIP-MEDIA-01：WebKit reports styled width640 for width320 media in the controlled Document PiP iframe matrix

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-DPIP-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Use independent native media controls to determine the dimension behavior and verify real Document PiP playback and proxy dimensions.

关闭条件：Exact browser/version evidence distinguishes layout-driven reports from intrinsic pixels and validates native media continuity; do not treat controlled iframe success as native PiP acceptance.

复现、排查与验证依据：

- [refactor/changes/2026-09-12-PKG-DPIP-02-tests.md](../refactor/changes/2026-09-12-PKG-DPIP-02-tests.md)
- [refactor/baselines/dpip-behavior-validation.json](../refactor/baselines/dpip-behavior-validation.json)

### MB-LICENSE-01：Historical MediaBunny proxy bundles embed SDK code without MPL notice markers or separate license/source provenance

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MB-10。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Inventory the actual candidate bundle modules, preserve relevant license/notice text and corresponding source availability; never infer embedded historical SDK version from the current lock.

关闭条件：Final candidate archive includes verified dependency license/notice and source provenance, with historical unknowns documented; no root-MIT substitution.

复现、排查与验证依据：

- [refactor/baselines/mb-release.json](../refactor/baselines/mb-release.json)
- [refactor/baselines/mb-contract.md](../refactor/baselines/mb-contract.md)
- [refactor/changes/2026-09-12-PKG-MB-01-contract.md](../refactor/changes/2026-09-12-PKG-MB-01-contract.md)

### MB-LIFE-01：MediaBunny load, track replacement, timeout, RAF and audio callbacks lack one shared terminal owner

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MB-02、PKG-MB-03、PKG-MB-04、PKG-MB-05、PKG-MB-06、PKG-MB-07、PKG-MB-09。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Reproduce pending operations and destroy/source-switch races before migrating each owner; preserve public event and promise behavior while preventing stale resource use. MB-02 now reproduces late load rejection and uncancelled waiting/loadstart timers after destroy in all three historical implementations using a controlled host. Other interleavings and full-core native behavior are not yet verified. Expanded MB-02 baseline reproduces play-after-pause/destroy, rejected-play false state, seek-after-destroy and retained successful-load timeout timers in all three actual historical implementations; Range and active-timeout normal controls remain separate. MB-03 candidate owns pending Input before track selection and cancels load/HEAD/timers on source replacement, timeout and destroy; source/main/legacy regressions pass. Pending play/seek, late decoder work and full readiness coordination remain MB-04/05/06, so this risk stays open. MB-04 shim checkpoint fixes synthetic RAF retention and terminal event-listener cleanup, including engine cleanup exceptions. Closing the event bridge does not prove pending engine operations stopped; coordination remains in progress. MB-04 now guards play/seek/replacement completion, preserves explicit pause, observes stale failures and isolates reentrant event sequences. Decoder-internal late frames/audio and HLS UI races remain MB-05/06/07; risk stays open. MB-05 migrates VideoEngine and owns iterators, late first/second seek frames, pending reads, per-instance RAF and poster callbacks; same native race assertions fail on old main and pass on candidate. Independent CanvasSink pools also prevent multiple obsolete seek samples from overwriting queued current-frame pixels. Audio nodes, long-run AV sync and HLS UI topology remain MB-06/07/09. MB-06 migrates AudioEngine into six checked modules, owns context/gain/nodes/iterators and removable cancellation waits, preserves clock and gain formulas, and invalidates pending resume/decoding across pause/source/destroy. Same old main fails 29 of 37 audio assertions and four native pause-cleanup cases; candidate passes with short native 1x/2x AV-clock samples. Long-run AV sync, full combinations and HLS UI topology remain MB-07/09, so risk stays open. MB-07 migrates HLS UI to four checked modules, guards stale refresh/selection callbacks, cleans each surface and owns terminal listeners. Quality/audio queries share a latest-intent token and retry pairing against changed media snapshots. Forty-three old-main assertions yield 11 pass/32 fail; sixteen old native UI/query cases fail and twenty candidate native cases pass across old/new cores. Long-run AV sync and full combinations remain MB-09; capability/type/package gates remain MB-08/10. MB-09 checkpoints add 24 actual native Document PiP playback/lifecycle cases with visible openers and four native old/new-core sustained HLS cases, each at least 195 wall seconds across 1x/2x, seek, quality and audio. Maximum sampled frame/audio-clock delta is 51.34ms; active nodes peak at 64 and all approximately 13.7k created nodes per case disconnect on teardown, with iterators/queues empty. This does not close background behavior, complete plugin combinations, physical-device capability, acoustic synchronization or hour-scale validation.

关闭条件：Historical failing interleavings and candidate cancellation/cleanup pass with real media and event evidence, including long playback and track topology.

复现、排查与验证依据：

- [refactor/baselines/mb-release.json](../refactor/baselines/mb-release.json)
- [refactor/baselines/mb-contract.md](../refactor/baselines/mb-contract.md)
- [refactor/changes/2026-09-12-PKG-MB-01-contract.md](../refactor/changes/2026-09-12-PKG-MB-01-contract.md)
- [refactor/changes/2026-09-12-PKG-MB-02-checkpoint.md](../refactor/changes/2026-09-12-PKG-MB-02-checkpoint.md)
- [refactor/baselines/mb-media-checkpoint.json](../refactor/baselines/mb-media-checkpoint.json)
- [refactor/changes/2026-09-12-PKG-MB-02-baseline.md](../refactor/changes/2026-09-12-PKG-MB-02-baseline.md)
- [refactor/baselines/mb-behavior-validation.json](../refactor/baselines/mb-behavior-validation.json)
- [refactor/changes/2026-09-12-PKG-MB-03-input.md](../refactor/changes/2026-09-12-PKG-MB-03-input.md)
- [refactor/changes/2026-09-12-PKG-MB-04-shim-checkpoint.md](../refactor/changes/2026-09-12-PKG-MB-04-shim-checkpoint.md)
- [refactor/changes/2026-09-12-PKG-MB-04-coordination.md](../refactor/changes/2026-09-12-PKG-MB-04-coordination.md)
- [refactor/baselines/mb-coordination-validation.json](../refactor/baselines/mb-coordination-validation.json)
- [refactor/changes/2026-09-12-PKG-MB-05-video.md](../refactor/changes/2026-09-12-PKG-MB-05-video.md)
- [refactor/baselines/mb-video-validation.json](../refactor/baselines/mb-video-validation.json)
- [refactor/changes/2026-09-12-PKG-MB-06-audio.md](../refactor/changes/2026-09-12-PKG-MB-06-audio.md)
- [refactor/baselines/mb-audio-validation.json](../refactor/baselines/mb-audio-validation.json)
- [refactor/changes/2026-09-12-PKG-MB-07-hls.md](../refactor/changes/2026-09-12-PKG-MB-07-hls.md)
- [refactor/baselines/mb-hls-validation.json](../refactor/baselines/mb-hls-validation.json)
- [refactor/baselines/mb-native-pip-checkpoint.json](../refactor/baselines/mb-native-pip-checkpoint.json)
- [refactor/baselines/mb-sustained-validation.json](../refactor/baselines/mb-sustained-validation.json)

### MB-CAP-01：Current Windows WebKit lacks WebCodecs and Web Audio constructors needed by historical MediaBunny proxies

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MB-02、PKG-MB-09。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Keep exact capability negative controls and validate usable browsers/codecs separately; improve unsupported-capability reporting during migration without fabricating decoder support.

关闭条件：Per-browser native media/support matrix and predictable unsupported-capability behavior verified, including target Safari evidence where support is claimed.

复现、排查与验证依据：

- [refactor/changes/2026-09-12-PKG-MB-02-checkpoint.md](../refactor/changes/2026-09-12-PKG-MB-02-checkpoint.md)
- [refactor/baselines/mb-media-checkpoint.json](../refactor/baselines/mb-media-checkpoint.json)
- [refactor/changes/2026-09-12-PKG-MB-02-baseline.md](../refactor/changes/2026-09-12-PKG-MB-02-baseline.md)
- [refactor/baselines/mb-behavior-validation.json](../refactor/baselines/mb-behavior-validation.json)

### IFRAME-LIFE-01：Iframe timestamp IDs and unowned pending requests/timers lack terminal cleanup

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-IFRAME-02、PKG-IFRAME-03、PKG-IFRAME-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Owned requests and ADR-026 document cancellation are implemented. Task 05 verifies actual desktop players/Monaco and source/main/legacy cached history plus stop/204/truncated-response recovery. Full Chromium proves native BFCache; Firefox/WebKit only prove reload controls. Keep open for physical devices, remaining cache engines and final release acceptance; legacy peers retain documented document-identity limits.

关闭条件：Old behavior and candidate fixes have deterministic race/resource tests plus actual iframe integration.

复现、排查与验证依据：

- [refactor/baselines/iframe-contract.md](../refactor/baselines/iframe-contract.md)
- [refactor/baselines/iframe-release.json](../refactor/baselines/iframe-release.json)
- [refactor/changes/2026-09-12-PKG-IFRAME-01-contract.md](../refactor/changes/2026-09-12-PKG-IFRAME-01-contract.md)
- [refactor/baselines/iframe-behavior-validation.json](../refactor/baselines/iframe-behavior-validation.json)
- [refactor/changes/2026-09-12-PKG-IFRAME-02-behavior.md](../refactor/changes/2026-09-12-PKG-IFRAME-02-behavior.md)
- [refactor/changes/2026-09-12-PKG-IFRAME-03-requests-checkpoint.md](../refactor/changes/2026-09-12-PKG-IFRAME-03-requests-checkpoint.md)
- [refactor/baselines/iframe-requests-checkpoint.json](../refactor/baselines/iframe-requests-checkpoint.json)
- [refactor/changes/2026-09-12-PKG-IFRAME-03-boundaries-checkpoint.md](../refactor/changes/2026-09-12-PKG-IFRAME-03-boundaries-checkpoint.md)
- [refactor/baselines/iframe-boundaries-checkpoint.json](../refactor/baselines/iframe-boundaries-checkpoint.json)
- [refactor/changes/2026-09-13-PKG-IFRAME-03-navigation.md](../refactor/changes/2026-09-13-PKG-IFRAME-03-navigation.md)
- [refactor/baselines/iframe-navigation-validation.json](../refactor/baselines/iframe-navigation-validation.json)
- [refactor/iframe-document-protocol.md](../refactor/iframe-document-protocol.md)
- [refactor/changes/2026-09-13-PKG-IFRAME-05-integration.md](../refactor/changes/2026-09-13-PKG-IFRAME-05-integration.md)
- [refactor/baselines/iframe-integration-validation.json](../refactor/baselines/iframe-integration-validation.json)
- [refactor/changes/2026-09-13-PKG-IFRAME-05-history.md](../refactor/changes/2026-09-13-PKG-IFRAME-05-history.md)
- [refactor/baselines/iframe-history-validation.json](../refactor/baselines/iframe-history-validation.json)

### IFRAME-TRUST-01：Iframe executable commit protocol accepts messages without source/origin validation

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-IFRAME-03、PKG-IFRAME-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：ADR-025 binds actual native peers; ADR-026 correlates negotiated documents. IFRAME-05 adds actual same/cross-origin media and editor evidence on three core versions, four bridge pairings and three desktop engines. This is not an origin allowlist or commit sandbox. Keep final acceptance and legacy/custom unmarked-message limits open.

关闭条件：Controlled and real same/cross-origin evidence plus an explicit documented compatibility decision and supported trust model.

复现、排查与验证依据：

- [refactor/baselines/iframe-contract.md](../refactor/baselines/iframe-contract.md)
- [refactor/baselines/iframe-release.json](../refactor/baselines/iframe-release.json)
- [refactor/changes/2026-09-12-PKG-IFRAME-01-contract.md](../refactor/changes/2026-09-12-PKG-IFRAME-01-contract.md)
- [refactor/baselines/iframe-behavior-validation.json](../refactor/baselines/iframe-behavior-validation.json)
- [refactor/changes/2026-09-12-PKG-IFRAME-02-behavior.md](../refactor/changes/2026-09-12-PKG-IFRAME-02-behavior.md)
- [refactor/changes/2026-09-12-PKG-IFRAME-03-boundaries-checkpoint.md](../refactor/changes/2026-09-12-PKG-IFRAME-03-boundaries-checkpoint.md)
- [refactor/baselines/iframe-boundaries-checkpoint.json](../refactor/baselines/iframe-boundaries-checkpoint.json)
- [refactor/iframe-message-boundary.md](../refactor/iframe-message-boundary.md)
- [refactor/changes/2026-09-13-PKG-IFRAME-03-navigation.md](../refactor/changes/2026-09-13-PKG-IFRAME-03-navigation.md)
- [refactor/baselines/iframe-navigation-validation.json](../refactor/baselines/iframe-navigation-validation.json)
- [refactor/iframe-document-protocol.md](../refactor/iframe-document-protocol.md)
- [refactor/changes/2026-09-13-PKG-IFRAME-05-integration.md](../refactor/changes/2026-09-13-PKG-IFRAME-05-integration.md)
- [refactor/baselines/iframe-integration-validation.json](../refactor/baselines/iframe-integration-validation.json)
- [refactor/changes/2026-09-13-PKG-IFRAME-05-history.md](../refactor/changes/2026-09-13-PKG-IFRAME-05-history.md)
- [refactor/baselines/iframe-history-validation.json](../refactor/baselines/iframe-history-validation.json)

### IFRAME-DIST-01：Iframe tool name is unavailable at registry observation and old archive includes distinct helper exports

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-IFRAME-04、PKG-IFRAME-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：IFRAME-04 adds paired CJS/ESM declarations and verifies three actual isolated installs, including old namespace/helper and existing Function callback differences. Keep old package-name/helper facade, emitted-consumer runtime and final distribution gates with IFRAME-06; the time-scoped tool registry observation is not a release claim.

关闭条件：Actual installed entry/declaration tests and documented old-name/helper/new-tool distribution behavior; registry observation remains time scoped.

复现、排查与验证依据：

- [refactor/baselines/iframe-contract.md](../refactor/baselines/iframe-contract.md)
- [refactor/baselines/iframe-release.json](../refactor/baselines/iframe-release.json)
- [refactor/changes/2026-09-12-PKG-IFRAME-01-contract.md](../refactor/changes/2026-09-12-PKG-IFRAME-01-contract.md)
- [refactor/changes/2026-09-13-PKG-IFRAME-04-types.md](../refactor/changes/2026-09-13-PKG-IFRAME-04-types.md)
- [refactor/baselines/iframe-types-validation.json](../refactor/baselines/iframe-types-validation.json)

### THUMB-LIFE-01：Thumbnail drop binding and repeated destroy fail; pending work and replacement resource ownership need repair

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-TOOL-THUMB-02、PKG-TOOL-THUMB-03、PKG-TOOL-THUMB-05。

当前状态：04 strict types and approved default/workspace policy are complete. 05 source and installed tool main pass actual Chromium/Firefox extraction, two generated sheets, preview pixels and exact URL ownership against core 3.5.31/5.4.0/candidate. Windows WebKit native Blob error 4 and physical Safari/device evidence remain open.

已做处理/后续方向：03 splits input/sheet/source/extraction/lifecycle and fixes reproduced cancellation, Blob URL ownership, native errors, callback failure/reentrancy and decoder reset. Keep risk open for 04 strict types and 05 complete core/Safari integration; Windows WebKit Blob-unavailable controls do not prove extraction.

关闭条件：Deterministic old failure/candidate success for replacement, error and destruction plus real media/browser resource validation.

复现、排查与验证依据：

- [refactor/baselines/thumbnail-contract.md](../refactor/baselines/thumbnail-contract.md)
- [refactor/baselines/thumbnail-release.json](../refactor/baselines/thumbnail-release.json)
- [refactor/scripts/thumbnail-contract.test.mjs](../refactor/scripts/thumbnail-contract.test.mjs)
- [refactor/baselines/thumbnail-behavior-validation.json](../refactor/baselines/thumbnail-behavior-validation.json)
- [refactor/changes/2026-09-13-PKG-TOOL-THUMB-02-behavior.md](../refactor/changes/2026-09-13-PKG-TOOL-THUMB-02-behavior.md)
- [test/thumbnail.test.js](../test/thumbnail.test.js)
- [test/browser/thumbnail-tool.spec.js](../test/browser/thumbnail-tool.spec.js)
- [refactor/changes/2026-09-13-PKG-TOOL-THUMB-03-input-checkpoint.md](../refactor/changes/2026-09-13-PKG-TOOL-THUMB-03-input-checkpoint.md)
- [packages/artplayer-tool-thumbnail/ARCHITECTURE.md](../packages/artplayer-tool-thumbnail/ARCHITECTURE.md)
- [test/thumbnail-input.test.js](../test/thumbnail-input.test.js)
- [test/browser/thumbnail-input.spec.js](../test/browser/thumbnail-input.spec.js)
- [refactor/baselines/thumbnail-input-checkpoint.json](../refactor/baselines/thumbnail-input-checkpoint.json)
- [refactor/changes/2026-09-13-PKG-TOOL-THUMB-03-lifecycle.md](../refactor/changes/2026-09-13-PKG-TOOL-THUMB-03-lifecycle.md)
- [test/thumbnail-lifecycle.test.js](../test/thumbnail-lifecycle.test.js)
- [refactor/baselines/thumbnail-lifecycle-validation.json](../refactor/baselines/thumbnail-lifecycle-validation.json)
- [refactor/changes/2026-09-16-PKG-TOOL-THUMB-05-core-combinations.md](../refactor/changes/2026-09-16-PKG-TOOL-THUMB-05-core-combinations.md)
- [refactor/baselines/thumbnail-core-validation.json](../refactor/baselines/thumbnail-core-validation.json)
- [refactor/baselines/thumbnail-core.json](../refactor/baselines/thumbnail-core.json)
- [test/browser/thumbnail-core.spec.js](../test/browser/thumbnail-core.spec.js)

### THUMB-MEDIA-01：Windows WebKit native Blob URLs cannot load tested MP4 media despite successful HTTP controls

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-TOOL-THUMB-05、PKG-TOOL-THUMB-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Preserve independent HTTP/Blob capability controls; obtain actual supported WebKit/Safari file extraction evidence before release acceptance. Do not count the 12 unavailable controls as successful thumbnail generation or silently replace local files with HTTP media.

关闭条件：Actual generated PNG/extraction and lifecycle proof in supported Safari/WebKit environments, or explicit supported-environment decision with migration documentation; Windows limitation stays identifiable.

复现、排查与验证依据：

- [refactor/baselines/thumbnail-behavior-validation.json](../refactor/baselines/thumbnail-behavior-validation.json)
- [refactor/changes/2026-09-13-PKG-TOOL-THUMB-02-behavior.md](../refactor/changes/2026-09-13-PKG-TOOL-THUMB-02-behavior.md)
- [test/thumbnail.test.js](../test/thumbnail.test.js)
- [test/browser/thumbnail-tool.spec.js](../test/browser/thumbnail-tool.spec.js)
- [refactor/changes/2026-09-16-PKG-TOOL-THUMB-05-core-combinations.md](../refactor/changes/2026-09-16-PKG-TOOL-THUMB-05-core-combinations.md)
- [refactor/baselines/thumbnail-core-validation.json](../refactor/baselines/thumbnail-core-validation.json)
- [refactor/baselines/thumbnail-core.json](../refactor/baselines/thumbnail-core.json)
- [test/browser/thumbnail-core.spec.js](../test/browser/thumbnail-core.spec.js)

### AUTO-THUMB-TYPE-01：Published declarations misdescribe async registration and switch height/number option fields across generations

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUTO-THUMB-04、PKG-AUTO-THUMB-08。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Preserve actual Promise runtime and old valid consumers; explicitly retain the historically ignored height field and verify paired CJS/ESM declarations. PKG-AUTO-THUMB-08 retains npm 1.1.0 root bytes and adds tested /runtime types and editor generation; older 1.0.x isolated consumer/export evidence is still pending in 04/06.

关闭条件：Old and current isolated consumers, negative type cases and matching runtime registration pass; any irreconcilable inference change has an explicit user decision.

复现、排查与验证依据：

- [refactor/baselines/auto-thumbnail-release.json](../refactor/baselines/auto-thumbnail-release.json)
- [refactor/baselines/auto-thumbnail-contract.md](../refactor/baselines/auto-thumbnail-contract.md)
- [refactor/scripts/auto-thumbnail-contract.test.mjs](../refactor/scripts/auto-thumbnail-contract.test.mjs)
- [refactor/changes/2026-09-14-PKG-AUTO-THUMB-08-types.md](../refactor/changes/2026-09-14-PKG-AUTO-THUMB-08-types.md)
- [refactor/baselines/auto-thumbnail-types-validation.json](../refactor/baselines/auto-thumbnail-types-validation.json)

### AUTO-THUMB-EXPORT-01：Published 1.0.1 CommonJS default namespace differs from the direct function exported by 1.1.0

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUTO-THUMB-04、PKG-AUTO-THUMB-06、PKG-AUTO-THUMB-09。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Exercise both old .default calls and direct require calls plus globals, actual ESM and legacy. PKG-AUTO-THUMB-09 restores default JavaScript calls on the same callable and validates actual 1.0.1, 1.1.0 and candidate installs, plus accurate runtime alias types and three-engine native completion. Full old root type/import-shape evidence remains in 04/06.

关闭条件：Installed tarballs and matching type consumers retain both usable calling forms with documented entry behavior.

复现、排查与验证依据：

- [refactor/baselines/auto-thumbnail-release.json](../refactor/baselines/auto-thumbnail-release.json)
- [refactor/baselines/auto-thumbnail-contract.md](../refactor/baselines/auto-thumbnail-contract.md)
- [refactor/scripts/auto-thumbnail-contract.test.mjs](../refactor/scripts/auto-thumbnail-contract.test.mjs)
- [refactor/changes/2026-09-14-PKG-AUTO-THUMB-09-alias.md](../refactor/changes/2026-09-14-PKG-AUTO-THUMB-09-alias.md)
- [refactor/baselines/auto-thumbnail-alias-validation.json](../refactor/baselines/auto-thumbnail-alias-validation.json)

### AUTO-THUMB-DIST-01：Published 1.0.0 archive lacks declared main and legacy runtimes

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUTO-THUMB-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Keep the historical missing-entry baseline explicit; never substitute Git source as a released artifact.

关闭条件：Candidate pack has all declared runtime/types/assets and reviewed historical deep paths; missing old entries remain explicitly recorded.

复现、排查与验证依据：

- [refactor/baselines/auto-thumbnail-release.json](../refactor/baselines/auto-thumbnail-release.json)
- [refactor/baselines/auto-thumbnail-contract.md](../refactor/baselines/auto-thumbnail-contract.md)
- [refactor/scripts/auto-thumbnail-contract.test.mjs](../refactor/scripts/auto-thumbnail-contract.test.mjs)

### AUTO-THUMB-LIFE-01：Extraction tasks, decoder handlers and final object URLs lack source-switch and destroy ownership

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUTO-THUMB-02、PKG-AUTO-THUMB-03、PKG-AUTO-THUMB-05、PKG-AUTO-THUMB-11。

当前状态：Task03 ownership checkpoint: 22 candidate lifecycle regressions fail on frozen source and pass on source/main/legacy; two further explicit-URL short-circuit and duration-snapshot cases preserve historical successes. Final candidate runs have 24 passing cases each; 27 native lifecycle cases verify destroy/restart/completion and URL/decoder cleanup. New index/options/session/extraction modules fix serial encoding, stale callbacks, failure cleanup and selected reentry paths. Pixel/frame correctness, resource budgets and additional boundaries remain for task03; old/final core acceptance remains task05. Risk stays open rather than claiming complete extraction repair. Task11 fixes throwing event-property cleanup skipping deadline/frame cancellation: eight controlled regressions fail on pre-change main and pass source/main/legacy; each actual artifact also passes21 native lifecycle checks. This does not prove spontaneous native setter failure or close remaining resource/pixel/combination gates.

已做处理/后续方向：Cancel obsolete work and release owned resources while retaining live options and progressive usable sheet updates.

关闭条件：Delayed callbacks, repeated metadata, switching, destroy, multiple instances and failure cleanup are reproduced then pass source/artifacts and native browser checks.

复现、排查与验证依据：

- [refactor/baselines/auto-thumbnail-release.json](../refactor/baselines/auto-thumbnail-release.json)
- [refactor/baselines/auto-thumbnail-contract.md](../refactor/baselines/auto-thumbnail-contract.md)
- [refactor/scripts/auto-thumbnail-contract.test.mjs](../refactor/scripts/auto-thumbnail-contract.test.mjs)
- [test/auto-thumbnail.test.js](../test/auto-thumbnail.test.js)
- [refactor/baselines/auto-thumbnail-failures.md](../refactor/baselines/auto-thumbnail-failures.md)
- [refactor/baselines/auto-thumbnail-failures-validation.json](../refactor/baselines/auto-thumbnail-failures-validation.json)
- [test/auto-thumbnail-lifecycle.test.js](../test/auto-thumbnail-lifecycle.test.js)
- [test/browser/auto-thumbnail-lifecycle.spec.js](../test/browser/auto-thumbnail-lifecycle.spec.js)
- [refactor/baselines/auto-thumbnail-lifecycle-checkpoint.json](../refactor/baselines/auto-thumbnail-lifecycle-checkpoint.json)
- [refactor/changes/2026-09-14-PKG-AUTO-THUMB-11-handler-cleanup.md](../refactor/changes/2026-09-14-PKG-AUTO-THUMB-11-handler-cleanup.md)
- [refactor/baselines/auto-thumbnail-handler-validation.json](../refactor/baselines/auto-thumbnail-handler-validation.json)
- [test/auto-thumbnail-frames.test.js](../test/auto-thumbnail-frames.test.js)

### AUTO-THUMB-ENCODE-01：Unserialized encodes include blank output and lack media/canvas/input failure handling

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUTO-THUMB-02、PKG-AUTO-THUMB-03、PKG-AUTO-THUMB-05。

当前状态：Task03 ownership checkpoint: 22 candidate lifecycle regressions fail on frozen source and pass on source/main/legacy; two further explicit-URL short-circuit and duration-snapshot cases preserve historical successes. Final candidate runs have 24 passing cases each; 27 native lifecycle cases verify destroy/restart/completion and URL/decoder cleanup. New index/options/session/extraction modules fix serial encoding, stale callbacks, failure cleanup and selected reentry paths. Pixel/frame correctness, resource budgets and additional boundaries remain for task03; old/final core acceptance remains task05. Risk stays open rather than claiming complete extraction repair.

已做处理/后续方向：Preserve JPEG grid/time/scale while bounding jobs, sequencing valid updates and handling null Blob, invalid media and thrown callbacks.

关闭条件：Fault controls and native valid/corrupt media prove no stale sheet replacement, leaked URLs or unhandled async callbacks; capability limitations remain explicit.

复现、排查与验证依据：

- [refactor/baselines/auto-thumbnail-release.json](../refactor/baselines/auto-thumbnail-release.json)
- [refactor/baselines/auto-thumbnail-contract.md](../refactor/baselines/auto-thumbnail-contract.md)
- [refactor/scripts/auto-thumbnail-contract.test.mjs](../refactor/scripts/auto-thumbnail-contract.test.mjs)
- [test/auto-thumbnail.test.js](../test/auto-thumbnail.test.js)
- [refactor/baselines/auto-thumbnail-failures.md](../refactor/baselines/auto-thumbnail-failures.md)
- [refactor/baselines/auto-thumbnail-failures-validation.json](../refactor/baselines/auto-thumbnail-failures-validation.json)
- [test/auto-thumbnail-lifecycle.test.js](../test/auto-thumbnail-lifecycle.test.js)
- [test/browser/auto-thumbnail-lifecycle.spec.js](../test/browser/auto-thumbnail-lifecycle.spec.js)
- [refactor/baselines/auto-thumbnail-lifecycle-checkpoint.json](../refactor/baselines/auto-thumbnail-lifecycle-checkpoint.json)

### AUTO-THUMB-PIXEL-01：Historical auto-thumbnail yields black sampled JPEG cells on Windows WebKit while played native video and static JPEG controls yield color

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-AUTO-THUMB-03、PKG-AUTO-THUMB-05。

当前状态：The frames module now waits for native presentation and seek completion on capable browsers. Chromium/Firefox source/main/legacy assert all five cells including first purple frame, second red cell, legitimate black and presentation times. Callback-less Windows WebKit first two cells remain diagnostic, later cells asserted; physical Safari/core combinations remain open. 84 native lifecycle/pixel cases passed with explicit held native-frame vs Blob-fallback paths; 19 new Node cases fail 17 ways on prior checkpoint and all 52 current cases pass per candidate. Risk and task03 remain open. Native-only18-case Windows probe also misses the purple first frame in all6 WebKit26.6 cases (hidden/visible paused and immediate play-pause, original and no-B-frame H.264);12 Chromium/Firefox controls recover it. No ArtPlayer/plugin is imported, narrowing but not resolving the native surface boundary. Rate/offset/layout explorations failed and must not be reintroduced as assumed fixes. CI-01 实际安装候选三引擎生命周期/像素 27 项通过；Windows WebKit 两个像素用例仍明确仅验证后面三格，首两格为诊断。没有将此结果用于关闭原首帧风险或认定完整核心组合。

已做处理/后续方向：Establish actual decoded-frame readiness for the existing timeline/grid and preserve silent independent extraction; do not waive colored pixel checks as unsupported media. Intrinsic-size hidden/opacity/clip/visible rendering crossed with current/readyState/first-loadeddata-event strategies still misses the unique first frame in all 12 Windows WebKit profiles. Correct Firefox frames retain totalVideoFrames=0, so that counter cannot be a portable readiness gate. Do not reintroduce these unvalidated workarounds. First-seek diagnostics additionally exclude drawing the first loadeddata frame without seek, one/two RAF waits, post-seek RAF waits and verified forward/back seeking on the recorded Windows WebKit host. The warm comparison first had an invalid stale-event completion, then a timeout; final bounded retries verify actual [1,1,0] seeking and still miss purple. Controls retain purple. These are exclusions, not production fixes.

关闭条件：Candidate source and artifacts generate usable sampled pixels on native browser controls with lifecycle checks; supported Safari and core combinations remain explicit final gates.

复现、排查与验证依据：

- [test/browser/auto-thumbnail.spec.js](../test/browser/auto-thumbnail.spec.js)
- [refactor/baselines/auto-thumbnail-failures.md](../refactor/baselines/auto-thumbnail-failures.md)
- [refactor/baselines/auto-thumbnail-failures-validation.json](../refactor/baselines/auto-thumbnail-failures-validation.json)
- [test/browser/auto-thumbnail-pixels.spec.js](../test/browser/auto-thumbnail-pixels.spec.js)
- [refactor/baselines/auto-thumbnail-hidden-renderer.json](../refactor/baselines/auto-thumbnail-hidden-renderer.json)
- [refactor/baselines/auto-thumbnail-timeline-media.json](../refactor/baselines/auto-thumbnail-timeline-media.json)
- [test/auto-thumbnail-frames.test.js](../test/auto-thumbnail-frames.test.js)
- [refactor/baselines/auto-thumbnail-frame-presentation.json](../refactor/baselines/auto-thumbnail-frame-presentation.json)
- [refactor/changes/2026-09-14-PKG-AUTO-THUMB-03-rendering-readiness.md](../refactor/changes/2026-09-14-PKG-AUTO-THUMB-03-rendering-readiness.md)
- [refactor/baselines/auto-thumbnail-rendering-readiness.json](../refactor/baselines/auto-thumbnail-rendering-readiness.json)
- [refactor/changes/2026-09-14-PKG-AUTO-THUMB-03-first-seek.md](../refactor/changes/2026-09-14-PKG-AUTO-THUMB-03-first-seek.md)
- [refactor/baselines/auto-thumbnail-first-seek.json](../refactor/baselines/auto-thumbnail-first-seek.json)
- [refactor/changes/2026-09-14-PKG-AUTO-THUMB-03-native-decoder.md](../refactor/changes/2026-09-14-PKG-AUTO-THUMB-03-native-decoder.md)
- [refactor/baselines/auto-thumbnail-native-decoder.json](../refactor/baselines/auto-thumbnail-native-decoder.json)
- [refactor/changes/2026-09-15-CI-01-adaptive-installed.md](../refactor/changes/2026-09-15-CI-01-adaptive-installed.md)
- [refactor/baselines/ci-adaptive-installed-validation.json](../refactor/baselines/ci-adaptive-installed-validation.json)

### VTT-THUMB-DIST-01：Historical 1.0.0 main/legacy contain invalid regular expressions and cannot load

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-VTT-THUMB-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Preserve archive evidence without reproducing broken entry syntax.

关闭条件：Candidate actual installed main/legacy/ESM/types/global entries work and historical deep paths are reviewed.

复现、排查与验证依据：

- [refactor/baselines/vtt-thumbnail-release.json](../refactor/baselines/vtt-thumbnail-release.json)
- [refactor/baselines/vtt-thumbnail-contract.md](../refactor/baselines/vtt-thumbnail-contract.md)
- [refactor/scripts/vtt-thumbnail-contract.test.mjs](../refactor/scripts/vtt-thumbnail-contract.test.mjs)

### VTT-THUMB-LIFE-01：Fetch completion, setBar listeners and mobile timers have no destroy ownership

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-VTT-THUMB-02、PKG-VTT-THUMB-03、PKG-VTT-THUMB-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Own requests, listeners, timers and controls per registration without stale writes or cross-instance cleanup.

关闭条件：Deferred request, destroy, failure, timer, repeated registration and native core scenarios demonstrate cleanup.

复现、排查与验证依据：

- [refactor/baselines/vtt-thumbnail-release.json](../refactor/baselines/vtt-thumbnail-release.json)
- [refactor/baselines/vtt-thumbnail-contract.md](../refactor/baselines/vtt-thumbnail-contract.md)
- [refactor/scripts/vtt-thumbnail-contract.test.mjs](../refactor/scripts/vtt-thumbnail-contract.test.mjs)
- [test/vtt-thumbnail.test.js](../test/vtt-thumbnail.test.js)
- [refactor/baselines/vtt-thumbnail-failures.json](../refactor/baselines/vtt-thumbnail-failures.json)
- [test/vtt-thumbnail-lifecycle.test.js](../test/vtt-thumbnail-lifecycle.test.js)
- [test/browser/vtt-thumbnail-lifecycle.spec.js](../test/browser/vtt-thumbnail-lifecycle.spec.js)
- [refactor/baselines/vtt-thumbnail-resources.json](../refactor/baselines/vtt-thumbnail-resources.json)

### VTT-THUMB-EXPORT-01：Older CommonJS default objects and thumbnails control names differ from latest direct export and vtt-thumbnail name

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-VTT-THUMB-04、PKG-VTT-THUMB-05、PKG-VTT-THUMB-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Approved latest npm 1.1.0 root factory/namespace stays exact; additive runtime supplies accurate asynchronous and module forms. Earlier 1.0.x type conflicts have explicit migration under ADR-025. Historical thumbnails/vtt-thumbnail control names and complete core/distribution validation remain 05/06.

关闭条件：Actual package consumers and old/new cores prove supported forms; unresolved differences stay explicit.

复现、排查与验证依据：

- [refactor/baselines/vtt-thumbnail-release.json](../refactor/baselines/vtt-thumbnail-release.json)
- [refactor/baselines/vtt-thumbnail-contract.md](../refactor/baselines/vtt-thumbnail-contract.md)
- [refactor/scripts/vtt-thumbnail-contract.test.mjs](../refactor/scripts/vtt-thumbnail-contract.test.mjs)
- [refactor/changes/2026-09-13-PKG-VTT-THUMB-04-public-types.md](../refactor/changes/2026-09-13-PKG-VTT-THUMB-04-public-types.md)
- [refactor/baselines/vtt-thumbnail-public-types.json](../refactor/baselines/vtt-thumbnail-public-types.json)
- [refactor/scripts/vtt-thumbnail-package-types.mjs](../refactor/scripts/vtt-thumbnail-package-types.mjs)
- [refactor/changes/2026-09-13-PKG-VTT-THUMB-04-module-forms.md](../refactor/changes/2026-09-13-PKG-VTT-THUMB-04-module-forms.md)
- [refactor/baselines/vtt-thumbnail-module-forms.json](../refactor/baselines/vtt-thumbnail-module-forms.json)
- [refactor/baselines/vtt-thumbnail-approved-types.json](../refactor/baselines/vtt-thumbnail-approved-types.json)
- [refactor/changes/2026-09-13-PKG-VTT-THUMB-04-approved-types.md](../refactor/changes/2026-09-13-PKG-VTT-THUMB-04-approved-types.md)

### MULTI-SUB-MERGE-01：1.0.0 merges cues by index while later versions concatenate independently timed track cues

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MULTI-SUB-02、PKG-MULTI-SUB-03、PKG-MULTI-SUB-05、PKG-MULTI-SUB-10。

当前状态：Task10 adapts old activeCue-only hosts to display all independently timed native cues. Source/main/legacy regressions cover old5.1.2/5.1.7. Historical1.1/1.2 losses remain explicit; broader profile/device acceptance remains in task05. Old5.1.2 ASS converter is separate task11.

已做处理/后续方向：Keep historical merge profiles explicit and test real overlap/timing before choosing compatibility behavior.

关闭条件：Unaligned lengths, overlap, sorting, names and real subtitle display across supported cores are verified.

复现、排查与验证依据：

- [refactor/baselines/multiple-subtitles-release.json](../refactor/baselines/multiple-subtitles-release.json)
- [refactor/baselines/multiple-subtitles-contract.md](../refactor/baselines/multiple-subtitles-contract.md)
- [test/multiple-subtitles.test.js](../test/multiple-subtitles.test.js)
- [refactor/scripts/multiple-subtitles-contract.test.mjs](../refactor/scripts/multiple-subtitles-contract.test.mjs)
- [test/multiple-subtitles-failures.test.js](../test/multiple-subtitles-failures.test.js)
- [test/browser/multiple-subtitles-history.spec.js](../test/browser/multiple-subtitles-history.spec.js)
- [refactor/baselines/multiple-subtitles-failures.json](../refactor/baselines/multiple-subtitles-failures.json)
- [refactor/changes/2026-09-13-PKG-MULTI-SUB-02-failures.md](../refactor/changes/2026-09-13-PKG-MULTI-SUB-02-failures.md)
- [refactor/baselines/multiple-subtitles-resources.json](../refactor/baselines/multiple-subtitles-resources.json)
- [refactor/changes/2026-09-13-PKG-MULTI-SUB-03-resources.md](../refactor/changes/2026-09-13-PKG-MULTI-SUB-03-resources.md)
- [test/multiple-subtitles-lifecycle.test.js](../test/multiple-subtitles-lifecycle.test.js)
- [test/multiple-subtitles-merge.test.js](../test/multiple-subtitles-merge.test.js)
- [test/browser/multiple-subtitles-lifecycle.spec.js](../test/browser/multiple-subtitles-lifecycle.spec.js)
- [refactor/changes/2026-09-14-PKG-MULTI-SUB-05-combinations.md](../refactor/changes/2026-09-14-PKG-MULTI-SUB-05-combinations.md)
- [refactor/baselines/multiple-subtitles-combinations-validation.json](../refactor/baselines/multiple-subtitles-combinations-validation.json)
- [test/browser/multiple-subtitles-combinations.spec.js](../test/browser/multiple-subtitles-combinations.spec.js)
- [refactor/changes/2026-09-14-PKG-MULTI-SUB-10-legacy-captions.md](../refactor/changes/2026-09-14-PKG-MULTI-SUB-10-legacy-captions.md)
- [refactor/baselines/multiple-subtitles-legacy-validation.json](../refactor/baselines/multiple-subtitles-legacy-validation.json)
- [test/multiple-subtitles-caption.test.js](../test/multiple-subtitles-caption.test.js)
- [test/browser/multiple-subtitles-legacy.spec.js](../test/browser/multiple-subtitles-legacy.spec.js)

### MULTI-SUB-LIFE-01：Pending downloads and final object URL have no destroy owner

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MULTI-SUB-02、PKG-MULTI-SUB-03、PKG-MULTI-SUB-05。

当前状态：Candidate resource fixes and serialization parity are verified in task 03. This risk remains open for the complete supported-core/device coverage owned by task 05.

已做处理/后续方向：Reproduce stale completion and own requests and URLs without changing public selection methods.

关闭条件：Cancellation, failures, source changes, repeated selection and destroy are verified with native core coverage.

复现、排查与验证依据：

- [refactor/baselines/multiple-subtitles-release.json](../refactor/baselines/multiple-subtitles-release.json)
- [refactor/baselines/multiple-subtitles-contract.md](../refactor/baselines/multiple-subtitles-contract.md)
- [test/multiple-subtitles.test.js](../test/multiple-subtitles.test.js)
- [refactor/scripts/multiple-subtitles-contract.test.mjs](../refactor/scripts/multiple-subtitles-contract.test.mjs)
- [test/multiple-subtitles-failures.test.js](../test/multiple-subtitles-failures.test.js)
- [test/browser/multiple-subtitles-history.spec.js](../test/browser/multiple-subtitles-history.spec.js)
- [refactor/baselines/multiple-subtitles-failures.json](../refactor/baselines/multiple-subtitles-failures.json)
- [refactor/changes/2026-09-13-PKG-MULTI-SUB-02-failures.md](../refactor/changes/2026-09-13-PKG-MULTI-SUB-02-failures.md)
- [refactor/baselines/multiple-subtitles-resources.json](../refactor/baselines/multiple-subtitles-resources.json)
- [refactor/changes/2026-09-13-PKG-MULTI-SUB-03-resources.md](../refactor/changes/2026-09-13-PKG-MULTI-SUB-03-resources.md)
- [test/multiple-subtitles-lifecycle.test.js](../test/multiple-subtitles-lifecycle.test.js)
- [test/multiple-subtitles-merge.test.js](../test/multiple-subtitles-merge.test.js)
- [test/browser/multiple-subtitles-lifecycle.spec.js](../test/browser/multiple-subtitles-lifecycle.spec.js)

### MULTI-SUB-EXPORT-01：Older CommonJS default objects conflict with export-assignment declarations; latest exports a direct factory

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MULTI-SUB-04、PKG-MULTI-SUB-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Approved latest npm 1.2.0 root factory/namespace stays exact; additive runtime supplies accurate asynchronous and module forms. Earlier 1.0.0/1.1.0 type conflicts have explicit migration under ADR-025. Complete shipped archive/deep-entry and example acceptance remains 06; actual browser/core combinations remain 05.

关闭条件：Actual installed CJS/ESM/global/legacy consumers and their declarations are verified.

复现、排查与验证依据：

- [refactor/baselines/multiple-subtitles-release.json](../refactor/baselines/multiple-subtitles-release.json)
- [refactor/baselines/multiple-subtitles-contract.md](../refactor/baselines/multiple-subtitles-contract.md)
- [test/multiple-subtitles.test.js](../test/multiple-subtitles.test.js)
- [refactor/scripts/multiple-subtitles-contract.test.mjs](../refactor/scripts/multiple-subtitles-contract.test.mjs)
- [refactor/baselines/multiple-subtitles-public-types.json](../refactor/baselines/multiple-subtitles-public-types.json)
- [refactor/changes/2026-09-13-PKG-MULTI-SUB-04-public-types.md](../refactor/changes/2026-09-13-PKG-MULTI-SUB-04-public-types.md)
- [refactor/scripts/multiple-subtitles-types.test.mjs](../refactor/scripts/multiple-subtitles-types.test.mjs)
- [refactor/scripts/multiple-subtitles-package-types.mjs](../refactor/scripts/multiple-subtitles-package-types.mjs)
- [refactor/baselines/multiple-subtitles-approved-types.json](../refactor/baselines/multiple-subtitles-approved-types.json)
- [refactor/changes/2026-09-13-PKG-MULTI-SUB-04-approved-types.md](../refactor/changes/2026-09-13-PKG-MULTI-SUB-04-approved-types.md)

### JASSUB-TYPE-01：JASSUB declared required URLs, Promise methods and resize parameter order differ from actual historical behavior

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-JASSUB-04。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Keep synchronous registration and real instance methods while separately preserving old parameter/return extraction and extension indexes. Do not implement the old inaccurate declaration as new runtime behavior.

关闭条件：Strict old/new consumers and actual installed declarations cover option defaults, instance methods, callback/return extraction, resize order and existing extension fields.

复现、排查与验证依据：

- [refactor/baselines/jassub-contract.md](../refactor/baselines/jassub-contract.md)
- [test/jassub.test.js](../test/jassub.test.js)
- [refactor/scripts/jassub-contract.test.mjs](../refactor/scripts/jassub-contract.test.mjs)

### JASSUB-EXPORT-01：JASSUB historical CommonJS object.default changes to a direct factory in 1.1.0

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-JASSUB-04、PKG-JASSUB-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Preserve actual historical JS default/direct forms and validate their declared module views independently.

关闭条件：Installed CJS/ESM/global/legacy consumers and public types preserve the supported historical forms.

复现、排查与验证依据：

- [refactor/baselines/jassub-contract-validation.json](../refactor/baselines/jassub-contract-validation.json)
- [refactor/baselines/jassub-release.json](../refactor/baselines/jassub-release.json)
- [test/jassub.test.js](../test/jassub.test.js)

### ASR-CORS-01：Default WebAudio binding silences CORS-cross-origin media that otherwise advances normally

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-ASR-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Document required CORS setup and provide an explicitly chosen capture path that never takes over media playback; do not bypass browser security or silently change default PCM semantics.

关闭条件：Authorized capture and same-origin recovery remain valid; an explicit integration avoids direct ownership for restricted input, fails or stays silent without rerouting playback, and is documented with native evidence.

复现、排查与验证依据：

- [test/browser/asr-cors.spec.js](../test/browser/asr-cors.spec.js)
- [refactor/baselines/asr-combinations-validation.json](../refactor/baselines/asr-combinations-validation.json)
- [refactor/baselines/asr-explicit-capture-validation.json](../refactor/baselines/asr-explicit-capture-validation.json)

### MASK-LIFETIME-01：Mask asynchronous initialization and inference continue after stop or destroy

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MASK-02、PKG-MASK-03、PKG-MASK-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Invalidate stale work while keeping restartable stop distinct from final destroy; release model and subscriptions. PKG-MASK-03 fixes controlled stale work, owned bitmaps and subscriptions; native SDK dispose completion is not exposed by body-segmentation 1.0.2 and remains a real-resource validation limit in PKG-MASK-05.

关闭条件：Pending initialization/inference cannot write masks or schedule work after stop/destroy; errors settle and owned resources are released.

复现、排查与验证依据：

- [refactor/baselines/danmuku-mask-contract.md](../refactor/baselines/danmuku-mask-contract.md)
- [refactor/baselines/danmuku-mask-release.json](../refactor/baselines/danmuku-mask-release.json)
- [refactor/baselines/danmuku-mask-contract-validation.json](../refactor/baselines/danmuku-mask-contract-validation.json)
- [refactor/changes/2026-09-13-PKG-MASK-02-failures.md](../refactor/changes/2026-09-13-PKG-MASK-02-failures.md)
- [refactor/baselines/danmuku-mask-failures-validation.json](../refactor/baselines/danmuku-mask-failures-validation.json)
- [test/danmuku-mask-failures.test.js](../test/danmuku-mask-failures.test.js)
- [refactor/changes/2026-09-13-PKG-MASK-03-lifecycle.md](../refactor/changes/2026-09-13-PKG-MASK-03-lifecycle.md)
- [refactor/baselines/danmuku-mask-lifecycle-validation.json](../refactor/baselines/danmuku-mask-lifecycle-validation.json)
- [test/danmuku-mask-lifecycle.test.js](../test/danmuku-mask-lifecycle.test.js)
- [refactor/baselines/danmuku-mask-native-validation.json](../refactor/baselines/danmuku-mask-native-validation.json)
- [refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md](../refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md)

### MASK-MODEL-01：Published Mask options and installed MediaPipe adapter consume different model settings

证据性质：源码/声明/产物事实。后续任务：PKG-MASK-02、PKG-MASK-04、PKG-MASK-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Freeze actual default/zero behavior and distinguish supported SDK configuration from inactive historical option fields before changing effects.

关闭条件：Effective model selection, zero values and configuration mapping have controlled and real model evidence, with explicit compatibility decisions for effect changes.

复现、排查与验证依据：

- [refactor/baselines/danmuku-mask-contract.md](../refactor/baselines/danmuku-mask-contract.md)
- [refactor/baselines/danmuku-mask-release.json](../refactor/baselines/danmuku-mask-release.json)
- [refactor/baselines/danmuku-mask-contract-validation.json](../refactor/baselines/danmuku-mask-contract-validation.json)

### MASK-BACKEND-01：Mask TensorFlow backend fallback does not establish MediaPipe fallback and failed initialization keeps scheduling

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MASK-02、PKG-MASK-03、PKG-MASK-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Model backend outcomes explicitly, settle initialization failures and document the actual MediaPipe capability boundary.

关闭条件：Fulfilled false, rejection, CPU failure, createSegmenter failure and later retry are tested; real inference fallback is separately evidenced.

复现、排查与验证依据：

- [refactor/baselines/danmuku-mask-contract.md](../refactor/baselines/danmuku-mask-contract.md)
- [refactor/baselines/danmuku-mask-release.json](../refactor/baselines/danmuku-mask-release.json)
- [refactor/baselines/danmuku-mask-contract-validation.json](../refactor/baselines/danmuku-mask-contract-validation.json)
- [refactor/changes/2026-09-13-PKG-MASK-02-failures.md](../refactor/changes/2026-09-13-PKG-MASK-02-failures.md)
- [refactor/baselines/danmuku-mask-failures-validation.json](../refactor/baselines/danmuku-mask-failures-validation.json)
- [test/danmuku-mask-failures.test.js](../test/danmuku-mask-failures.test.js)
- [refactor/changes/2026-09-13-PKG-MASK-03-lifecycle.md](../refactor/changes/2026-09-13-PKG-MASK-03-lifecycle.md)
- [refactor/baselines/danmuku-mask-lifecycle-validation.json](../refactor/baselines/danmuku-mask-lifecycle-validation.json)
- [test/danmuku-mask-lifecycle.test.js](../test/danmuku-mask-lifecycle.test.js)

### MASK-DOM-01：Mask registration and frame processing assume Danmuku DOM, readable frames and a 2D context

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MASK-02、PKG-MASK-03、PKG-MASK-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Handle missing dependencies and frame/context failures without stale writes or uncontrolled loops while preserving plugin ordering.

关闭条件：Missing Danmuku/context, CORS failure, source changes and ready/destroy timing have controlled and real browser evidence.

复现、排查与验证依据：

- [refactor/baselines/danmuku-mask-contract.md](../refactor/baselines/danmuku-mask-contract.md)
- [refactor/baselines/danmuku-mask-release.json](../refactor/baselines/danmuku-mask-release.json)
- [refactor/baselines/danmuku-mask-contract-validation.json](../refactor/baselines/danmuku-mask-contract-validation.json)
- [refactor/changes/2026-09-13-PKG-MASK-02-failures.md](../refactor/changes/2026-09-13-PKG-MASK-02-failures.md)
- [refactor/baselines/danmuku-mask-failures-validation.json](../refactor/baselines/danmuku-mask-failures-validation.json)
- [test/danmuku-mask-failures.test.js](../test/danmuku-mask-failures.test.js)
- [refactor/changes/2026-09-13-PKG-MASK-03-lifecycle.md](../refactor/changes/2026-09-13-PKG-MASK-03-lifecycle.md)
- [refactor/baselines/danmuku-mask-lifecycle-validation.json](../refactor/baselines/danmuku-mask-lifecycle-validation.json)
- [test/danmuku-mask-lifecycle.test.js](../test/danmuku-mask-lifecycle.test.js)
- [refactor/baselines/danmuku-mask-native-validation.json](../refactor/baselines/danmuku-mask-native-validation.json)
- [refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md](../refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md)

### MASK-NOTICE-01：Published Mask bundles lack a separate third-party notice despite bundled SDK code

证据性质：源码/声明/产物事实。后续任务：PKG-MASK-06。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Trace included SDK assets and license notices against actual bundle sources; preserve required notices in candidate packages.

关闭条件：Document incorporated SDK provenance and applicable notices; inspect built and packed artifacts, without treating manifest license claims as full clearance.

复现、排查与验证依据：

- [refactor/baselines/danmuku-mask-contract.md](../refactor/baselines/danmuku-mask-contract.md)
- [refactor/baselines/danmuku-mask-release.json](../refactor/baselines/danmuku-mask-release.json)
- [refactor/baselines/danmuku-mask-contract-validation.json](../refactor/baselines/danmuku-mask-contract-validation.json)

### DANMUKU-SOURCE-01：Danmuku registry Git associations differ from releases and static icon provenance remains incomplete

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-DANMUKU-09。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Use actual archive identity, preserve missing historical Git information and audit icon source/notice obligations.

关闭条件：Candidate tarball paths, complete module forms and icon/source provenance are explicitly reviewed; unresolved history is not invented.

复现、排查与验证依据：

- [refactor/baselines/danmuku-contract.md](../refactor/baselines/danmuku-contract.md)
- [refactor/baselines/danmuku-contract-validation.json](../refactor/baselines/danmuku-contract-validation.json)
- [refactor/baselines/danmuku-release.json](../refactor/baselines/danmuku-release.json)

### MASK-SCHEDULING-01：Native Mask startup can coincide with a missed narrow Danmuku timestamp window

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MASK-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Retain startup sampling evidence and distinguish it from post-model-ready delivery; investigate actual startup scheduling without silently adding catch-up semantics.

关闭条件：Identify the startup scheduling cause and assess a compatible mitigation or explicitly reviewed limitation using actual model/media evidence; post-ready success alone cannot close this risk.

复现、排查与验证依据：

- [test/browser/danmuku-mask-native.spec.js](../test/browser/danmuku-mask-native.spec.js)
- [refactor/baselines/danmuku-mask-native-validation.json](../refactor/baselines/danmuku-mask-native-validation.json)
- [refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md](../refactor/changes/2026-09-14-PKG-MASK-05-native-checkpoint.md)

### JASSUB-HYBRID-01：Late hybrid frames mutate the new offscreen canvas or throw; terminal track calls recreate transferred canvases

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-JASSUB-09、PKG-JASSUB-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Ignore obsolete hybrid render side effects while releasing their bitmaps, and preserve terminal canvas ownership in reattachment.

关闭条件：Controlled and held-native-bitmap red/green cases preserve the newly reattached canvas and pending demand; terminal public track calls allocate nothing, normal hybrid and default/main-thread rendering remain valid. Native capability limitations are recorded.

复现、排查与验证依据：

- [test/jassub-offscreen.test.js](../test/jassub-offscreen.test.js)
- [test/browser/jassub-hybrid.spec.js](../test/browser/jassub-hybrid.spec.js)

### JASSUB-FIREFOX-OFFSCREEN-01：Windows Firefox offscreen readback and asynchronous ImageBitmap creation can stall through seek/layout, including a minimal Worker control

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-JASSUB-09、PKG-JASSUB-05。

当前状态：主台账未单列 workspaceState；须结合以下处理记录和证据确认候选已修复部分，不能仅以标题推断当前状态。

已做处理/后续方向：Isolate native media/compositor/readback and sequence effects without globally disabling default offscreen or deleting assertions. The pre-09 artifact also fails in the same sequence; do not claim the new hybrid guard caused or fixed this separate failure. Single-flight controls also stall; API-entry/return timing locates a captured delay before createImageBitmap returns its Promise, alongside synchronous main-thread canvas readback. A script-free native host has the same ten-second observation despite an eventual-pixel pass. Retain latency evidence; neither core scripts nor concurrent creation are required for that control stall.

关闭条件：Identify and verify a compatible fix or a reviewed precise platform boundary with native controls. Preserve known red sequence and successful standalone comparison; candidate playback/fullscreen pixels and lifetime must be justified, not merely rerun to green.

复现、排查与验证依据：

- [refactor/changes/2026-09-14-PKG-JASSUB-09-hybrid.md](../refactor/changes/2026-09-14-PKG-JASSUB-09-hybrid.md)
- [refactor/baselines/jassub-hybrid-validation.json](../refactor/baselines/jassub-hybrid-validation.json)
- [refactor/changes/2026-09-14-PKG-JASSUB-09-firefox-diagnostics.md](../refactor/changes/2026-09-14-PKG-JASSUB-09-firefox-diagnostics.md)
- [refactor/baselines/jassub-firefox-diagnostics.json](../refactor/baselines/jassub-firefox-diagnostics.json)
- [refactor/changes/2026-09-14-PKG-JASSUB-09-display.md](../refactor/changes/2026-09-14-PKG-JASSUB-09-display.md)
- [refactor/baselines/jassub-display-validation.json](../refactor/baselines/jassub-display-validation.json)
- [test/browser/jassub-platform.spec.js](../test/browser/jassub-platform.spec.js)
- [test/browser/jassub-native.spec.js](../test/browser/jassub-native.spec.js)
- [test/browser/jassub-hybrid.spec.js](../test/browser/jassub-hybrid.spec.js)
- [refactor/changes/2026-09-15-CI-01-jassub-installed.md](../refactor/changes/2026-09-15-CI-01-jassub-installed.md)
- [refactor/baselines/ci-jassub-installed-validation.json](../refactor/baselines/ci-jassub-installed-validation.json)
- [refactor/changes/2026-09-15-PKG-JASSUB-09-native-call.md](../refactor/changes/2026-09-15-PKG-JASSUB-09-native-call.md)
- [refactor/baselines/jassub-native-call-validation.json](../refactor/baselines/jassub-native-call-validation.json)

### VTT-CORE-NAME-01：Published VTT 1.0.1 control name conflicts with the core placeholder introduced in 5.1.7

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-VTT-THUMB-05、REL-08。

当前状态：Final three-engine suite passes nine assertions of this historical rejection, not nine successful compatibility cells. No production control behavior was changed.

已做处理/后续方向：Preserve current vtt-thumbnail and reserved core control identities; distinguish the actual working 1.0.1/5.1.6 pair from the already failing 5.1.7/5.4.0/candidate pair. Decide the supported historical pairing/migration or a compatible accommodation during release review without hiding duplicate-control failures.

关闭条件：Historical working and failing browser pairs remain reproducible; any claimed accommodation preserves reserved-control ownership and duplicate-registration contracts, or an explicit reviewed historical support/migration boundary is recorded.

复现、排查与验证依据：

- [refactor/changes/2026-09-14-PKG-VTT-THUMB-05-combinations.md](../refactor/changes/2026-09-14-PKG-VTT-THUMB-05-combinations.md)
- [refactor/baselines/vtt-thumbnail-combinations.json](../refactor/baselines/vtt-thumbnail-combinations.json)
- [refactor/baselines/vtt-thumbnail-core.json](../refactor/baselines/vtt-thumbnail-core.json)
- [test/browser/vtt-thumbnail-combinations.spec.js](../test/browser/vtt-thumbnail-combinations.spec.js)

### MULTI-SUB-SWITCH-01：Intermittent WebKit core5.3.0 caption loss after selected-track source switch

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MULTI-SUB-05、PKG-MULTI-SUB-09。

当前状态：Still open after task11: property traces3+9 and passive105 cases pass while confirming early old-core settlement; default untraced63 has another near-zero seek miss on5.3.0/WebKit (time0.0015139, intact1..3 cue, no active cue). No failing native-write trace yet. Opt-in metadata/restoration-seeked control passes27 cases but is not a production/API fix; default and immediate-call probes remain unchanged. Candidate source guarantees pass. Task05 still owns remaining diagnosis and acceptance.

已做处理/后续方向：Classify the old-host source/native-seek race separately from caption rendering; preserve immediate-call probes, require candidate first seeks, and wait for real native source completion before independent caption-seek assertions.

关闭条件：Root cause classified with targeted evidence, any required fix validated, and changed candidate/old-core combination rerun without hiding the original failure.

已有局部结论：No-plugin controls reproduce the same miss and a settled seek restores correct old/new captions without changing plugin data. Candidate source code already provides the necessary readiness guard (BASE-LIFE-44/CORE-19 context). This resolves the suspected plugin-switch defect; it does not approve every historical source call or complete package task05.

复现、排查与验证依据：

- [refactor/changes/2026-09-14-PKG-MULTI-SUB-05-combinations.md](../refactor/changes/2026-09-14-PKG-MULTI-SUB-05-combinations.md)
- [refactor/baselines/multiple-subtitles-combinations-validation.json](../refactor/baselines/multiple-subtitles-combinations-validation.json)
- [test/browser/multiple-subtitles-combinations.spec.js](../test/browser/multiple-subtitles-combinations.spec.js)
- [refactor/changes/2026-09-14-CORE-SUBTITLE-OFFSET-01-paused.md](../refactor/changes/2026-09-14-CORE-SUBTITLE-OFFSET-01-paused.md)
- [refactor/baselines/subtitle-offset-validation.json](../refactor/baselines/subtitle-offset-validation.json)
- [refactor/changes/2026-09-14-PKG-MULTI-SUB-09-switch-order.md](../refactor/changes/2026-09-14-PKG-MULTI-SUB-09-switch-order.md)
- [refactor/baselines/multiple-subtitles-switch-validation.json](../refactor/baselines/multiple-subtitles-switch-validation.json)
- [test/browser/multiple-subtitles-switch.spec.js](../test/browser/multiple-subtitles-switch.spec.js)
- [refactor/changes/2026-09-14-PKG-MULTI-SUB-10-legacy-captions.md](../refactor/changes/2026-09-14-PKG-MULTI-SUB-10-legacy-captions.md)
- [refactor/baselines/multiple-subtitles-legacy-validation.json](../refactor/baselines/multiple-subtitles-legacy-validation.json)
- [refactor/changes/2026-09-14-PKG-MULTI-SUB-05-seek-diagnostics.md](../refactor/changes/2026-09-14-PKG-MULTI-SUB-05-seek-diagnostics.md)
- [refactor/baselines/multiple-subtitles-seek-diagnostics.json](../refactor/baselines/multiple-subtitles-seek-diagnostics.json)
- [test/browser/source-seek-diagnostics.js](../test/browser/source-seek-diagnostics.js)
- [test/browser/source-restoration.js](../test/browser/source-restoration.js)

### MB-SYNC-01：Installed MediaBunny hour soak exceeds the original frame/audio-clock tolerance in both Chromium core combinations

证据性质：已复现（可能针对历史版本，须看当前状态）。后续任务：PKG-MB-09。

当前状态：Running-at-capture, not a final report: around 1767 seconds both Chromium cases using the same candidate proxy reach approximately 549ms/570ms max delta; visibility, advancing media/draws, node bounds and lack of media errors remain intact. Core-specific, historical-proxy and OS-cause claims are unproven. Superseded running status: session34354 was interrupted at user request around3491 seconds of the first1x phase, exit1; original processes and8084 listener are absent. No completed four-case report or successful cleanup assertion is claimed. See self-test-handoff-stop.json.

已做处理/后续方向：2026-09-16 user requested stopping autonomous work. Preserve the interrupted run and original 250ms gate; defer diagnosis. If resumed, distinguish delayed presentation, catch-up draws, sustained clock drift and host scheduling with bounded controls before changing code; retain the public dropLateFrames default.

关闭条件：Retain the first failing samples and terminal report; establish cause with appropriate historical/native controls, fix any confirmed project regression, and complete unchanged duration/cleanup requirements with a justified clock/presentation interpretation. A later passing run alone does not close this risk.

复现、排查与验证依据：

- [refactor/baselines/mb-hour-av-breach.json](../refactor/baselines/mb-hour-av-breach.json)
- [refactor/changes/2026-09-16-PKG-MB-09-av-breach.md](../refactor/changes/2026-09-16-PKG-MB-09-av-breach.md)
- [test/soak/mediabunny.spec.js](../test/soak/mediabunny.spec.js)
- [refactor/baselines/self-test-handoff-stop.json](../refactor/baselines/self-test-handoff-stop.json)
- [refactor/self-test-handoff.md](../refactor/self-test-handoff.md)

## 独立分支的额外问题：MB-DROP-01

Queued frames ignore explicit late-frame dropping after the playback clock advances

处理进展：Apply the existing frameAction policy to due queued frames only when dropLateFrames is enabled; retain default false and do not report playing for a discarded frame. Isolated source/main/legacy controls pass; native verification and main-branch integration remain.

关闭条件：Old red/new green queued-frame controls, native scheduling/decode recovery, unchanged default behavior and cleanup pass; integrate source and updated artifacts. Do not infer closure of the default-mode long-soak AV risk.

分支 `codex/mb-queued-frame-fix`，提交 `1af2c1347866590a7341316dcf304de4e5ac0a9a`；主分支尚不包含该修复。详细测试数量、依赖 junction 与接续限制见 [交接记录](self-test-handoff.md)。

证据文件位于独立工作区 `D:\github\ArtPlayer-mb-queued-frame`：

- `refactor/baselines/mb-queued-frame-fix-checkpoint.json`
- `refactor/changes/2026-09-16-PKG-MB-DROP-01-queued-frames.md`
- `test/mediabunny-video.test.js`

## 已按范围接受的 5 项差异

这些是历史决定，不应被当作完全无风险，也不应自动重开。恢复相应任务前先核对批准范围。

### VENDOR-08：console-bundle 来源、版本与许可闭环

责任任务：SITE-01、SITE-07。

All 100 retained modules and Parcel have exact reproducing sources, all identified embedded origins have original notices, and 44 components are bound to verified upstream materials before actual distribution. The unchanged runtime retains tested API behavior. Accept only the documented historical-reconstruction limits: the original full lockfile, uniquely installed versions and former online Closure service are not recovered. Component licenses remain separate, including CC BY-SA 4.0. Re-review changed code or integration boundaries and revalidate release candidates.

依据：

- [refactor/third-party.json](../refactor/third-party.json)
- [docs/assets/js/console.js](../docs/assets/js/console.js)
- [refactor/site-inventory.md](../refactor/site-inventory.md)
- [refactor/baselines/site-provenance.json](../refactor/baselines/site-provenance.json)
- [refactor/console-modernization.md](../refactor/console-modernization.md)
- [refactor/baselines/site-console-inventory.json](../refactor/baselines/site-console-inventory.json)
- [refactor/baselines/site-console-validation.json](../refactor/baselines/site-console-validation.json)
- [refactor/changes/2026-09-15-SITE-07-console-baseline.md](../refactor/changes/2026-09-15-SITE-07-console-baseline.md)
- [test/browser/site-console.spec.js](../test/browser/site-console.spec.js)
- [refactor/baselines/console-feed-provenance.json](../refactor/baselines/console-feed-provenance.json)
- [refactor/changes/2026-09-15-SITE-07-console-feed-source.md](../refactor/changes/2026-09-15-SITE-07-console-feed-source.md)
- [scripts/site-vendor/console/provenance.ts](../scripts/site-vendor/console/provenance.ts)
- [scripts/site-vendor/console/reproduce.ts](../scripts/site-vendor/console/reproduce.ts)
- [refactor/baselines/console-commonjs-provenance.json](../refactor/baselines/console-commonjs-provenance.json)
- [refactor/changes/2026-09-15-SITE-07-console-commonjs.md](../refactor/changes/2026-09-15-SITE-07-console-commonjs.md)
- [refactor/baselines/console-esm-provenance.json](../refactor/baselines/console-esm-provenance.json)
- [refactor/changes/2026-09-15-SITE-07-console-esm.md](../refactor/changes/2026-09-15-SITE-07-console-esm.md)
- [scripts/site-vendor/console/reconstruction.ts](../scripts/site-vendor/console/reconstruction.ts)
- [refactor/baselines/console-embedded-notices.json](../refactor/baselines/console-embedded-notices.json)
- [refactor/baselines/console-notices-validation.json](../refactor/baselines/console-notices-validation.json)
- [refactor/changes/2026-09-15-SITE-07-console-notices.md](../refactor/changes/2026-09-15-SITE-07-console-notices.md)
- [scripts/site-vendor/console/embedded-notices.ts](../scripts/site-vendor/console/embedded-notices.ts)
- [docs/THIRD_PARTY_NOTICES.md](../docs/THIRD_PARTY_NOTICES.md)
- [refactor/baselines/console-embedded-sources.json](../refactor/baselines/console-embedded-sources.json)
- [refactor/baselines/console-embedded-validation.json](../refactor/baselines/console-embedded-validation.json)
- [refactor/changes/2026-09-15-SITE-07-console-embedded-sources.md](../refactor/changes/2026-09-15-SITE-07-console-embedded-sources.md)
- [scripts/site-vendor/console/embedded-sources.ts](../scripts/site-vendor/console/embedded-sources.ts)
- [refactor/baselines/console-derived-attribution.json](../refactor/baselines/console-derived-attribution.json)
- [refactor/baselines/console-derived-validation.json](../refactor/baselines/console-derived-validation.json)
- [refactor/changes/2026-09-15-SITE-07-console-derived-attribution.md](../refactor/changes/2026-09-15-SITE-07-console-derived-attribution.md)
- [scripts/site-vendor/console/attribution.ts](../scripts/site-vendor/console/attribution.ts)
- [refactor/baselines/console-stackoverflow-provenance.json](../refactor/baselines/console-stackoverflow-provenance.json)
- [refactor/baselines/console-stackoverflow-validation.json](../refactor/baselines/console-stackoverflow-validation.json)
- [refactor/changes/2026-09-15-SITE-07-console-stackoverflow.md](../refactor/changes/2026-09-15-SITE-07-console-stackoverflow.md)
- [scripts/site-vendor/console/stackoverflow.ts](../scripts/site-vendor/console/stackoverflow.ts)
- [refactor/baselines/console-shallowequal-validation.json](../refactor/baselines/console-shallowequal-validation.json)
- [refactor/changes/2026-09-15-SITE-07-console-shallowequal.md](../refactor/changes/2026-09-15-SITE-07-console-shallowequal.md)
- [refactor/console-notice-review.md](../refactor/console-notice-review.md)
- [refactor/baselines/console-notice-review-validation.json](../refactor/baselines/console-notice-review-validation.json)
- [refactor/changes/2026-09-15-SITE-07-console-notice-review.md](../refactor/changes/2026-09-15-SITE-07-console-notice-review.md)
- [scripts/site-vendor/console/notices.ts](../scripts/site-vendor/console/notices.ts)

### AUDIO-TYPE-01：Audio Track update 部分配置与公开/编辑器声明不一致

责任任务：PKG-AUDIO-04。

直接拓宽或重载会使旧上下文实现的 url 成为 string | undefined，已用实际编译复现。五组 TS 正反例、README、CJS/ESM 同一函数、真实 Monaco 三引擎已通过。接受默认旧声明有意保持窄签名的范围，不声称所有入口默认支持部分 update；隔离安装和完整分发仍由 Audio-06 验证。

依据：

- [refactor/baselines/audio-track-contract.md](../refactor/baselines/audio-track-contract.md)
- [refactor/baselines/audio-track-release.json](../refactor/baselines/audio-track-release.json)
- [refactor/changes/2026-09-12-PKG-AUDIO-04-types.md](../refactor/changes/2026-09-12-PKG-AUDIO-04-types.md)
- [refactor/baselines/audio-types-validation.json](../refactor/baselines/audio-types-validation.json)
- [refactor/decisions.md](../refactor/decisions.md)

### ADS-TYPE-01：Ads 声明丢失真实 html/video/url，旧 totalDuration 为 string，当前 source/type 未实现

责任任务：PKG-ADS-02、PKG-ADS-04。

用户在收到具体TS2322影响和两套矛盾声明证据后答复“接受这项类型推导修正，写清迁移说明并继续”。五模式、冻结声明、隔离包和真实编辑器通过；诊断测试继续保留，不声称所有历史TS程序无改动兼容。

依据：

- [refactor/baselines/ads-release.json](../refactor/baselines/ads-release.json)
- [refactor/baselines/ads-contract.md](../refactor/baselines/ads-contract.md)
- [packages/artplayer-plugin-ads/types/artplayer-plugin-ads.d.ts](../packages/artplayer-plugin-ads/types/artplayer-plugin-ads.d.ts)
- [packages/artplayer-plugin-ads/src/index.ts](../packages/artplayer-plugin-ads/src/index.ts)
- [refactor/changes/2026-09-12-PKG-ADS-04-types.md](../refactor/changes/2026-09-12-PKG-ADS-04-types.md)
- [refactor/scripts/ads-types.test.mjs](../refactor/scripts/ads-types.test.mjs)
- [refactor/baselines/ads-types-validation.json](../refactor/baselines/ads-types-validation.json)
- [packages/artplayer-plugin-ads/README.md](../packages/artplayer-plugin-ads/README.md)
- [test/types/ads.ts](../test/types/ads.ts)

### VAST-CONTEXT-01：Published VAST callback aliases and eager Player differ from the unpublished lazy workspace

责任任务：PKG-VAST-02、PKG-VAST-03、PKG-VAST-04。

The mutually exclusive initialization timing is explicitly approved and covered by published/workspace consumer tests. Unpublished lazy callers add the second option; public declarations remain VAST-TYPE-01/task04 and real IMA remains task05.

依据：

- [refactor/baselines/vast-contract.md](../refactor/baselines/vast-contract.md)
- [refactor/baselines/vast-release.json](../refactor/baselines/vast-release.json)
- [refactor/changes/2026-09-12-PKG-VAST-01-contract.md](../refactor/changes/2026-09-12-PKG-VAST-01-contract.md)
- [refactor/baselines/vast-contract-validation.json](../refactor/baselines/vast-contract-validation.json)
- [refactor/vast-compatibility-decision.md](../refactor/vast-compatibility-decision.md)
- [refactor/changes/2026-09-14-PKG-VAST-03-compatibility.md](../refactor/changes/2026-09-14-PKG-VAST-03-compatibility.md)
- [refactor/baselines/vast-compatibility-validation.json](../refactor/baselines/vast-compatibility-validation.json)

### VAST-TYPE-01：VAST declares an async factory as synchronous and imports an unavailable SDK type dependency

责任任务：PKG-VAST-04、PKG-VAST-06。

User separately accepted npm1.0.0 root compatibility types and /runtime accurate Promise/SDK/context types, with unpublished workspace migration. Fourteen actual isolated installation/compiler cases pass without skipLibCheck and enforce SDK dependency resolution; root historical inaccuracy is disclosed, not presented as runtime truth.

依据：

- [refactor/baselines/vast-contract.md](../refactor/baselines/vast-contract.md)
- [refactor/baselines/vast-release.json](../refactor/baselines/vast-release.json)
- [refactor/changes/2026-09-12-PKG-VAST-01-contract.md](../refactor/changes/2026-09-12-PKG-VAST-01-contract.md)
- [refactor/baselines/vast-contract-validation.json](../refactor/baselines/vast-contract-validation.json)
- [refactor/baselines/vast-lifecycle-validation.json](../refactor/baselines/vast-lifecycle-validation.json)
- [refactor/changes/2026-09-12-PKG-VAST-03-lifecycle.md](../refactor/changes/2026-09-12-PKG-VAST-03-lifecycle.md)
- [refactor/changes/2026-09-14-PKG-VAST-04-types.md](../refactor/changes/2026-09-14-PKG-VAST-04-types.md)
- [refactor/baselines/vast-types-validation.json](../refactor/baselines/vast-types-validation.json)
- [refactor/vast-type-decision.md](../refactor/vast-type-decision.md)

## 延期任务完整索引

下表涵盖主计划所有未完成任务。恢复前查 tasks.json 中的验收条件和原证据，不把延期算完成。

| 任务 | 停止前状态 | 内容 |
| --- | --- | --- |
| CI-01 | doing | 增强兼容矩阵、并发缓存与 CI 报告 |
| CI-03 | todo | 建立 npm 分包候选与发布工作流 |
| CI-04 | todo | 验收 GitHub 流水线与远端发布准入 |
| PKG-CHAPTER-05 | doing | 验证新旧核心和组合 |
| PKG-CHAPTER-06 | todo | 验证分发并同步文档 |
| PKG-AMBILIGHT-05 | doing | 验证新旧核心和组合 |
| PKG-AMBILIGHT-06 | todo | 验证分发并同步文档 |
| PKG-AUDIO-05 | doing | 验证新旧核心和组合 |
| PKG-AUDIO-06 | todo | 验证分发并同步文档 |
| PKG-AUTO-THUMB-03 | doing | 整理内部职责与资源 |
| PKG-AUTO-THUMB-05 | todo | 验证新旧核心和组合 |
| PKG-AUTO-THUMB-06 | todo | 验证分发并同步文档 |
| PKG-VTT-THUMB-05 | doing | 验证新旧核心和组合 |
| PKG-VTT-THUMB-06 | todo | 验证分发并同步文档 |
| PKG-HLS-SDK-01 | doing | 验证真实 SDK worker 与分组轨道组合 |
| PKG-HLS-05 | todo | 验证新旧核心和组合 |
| PKG-HLS-06 | todo | 验证分发并同步文档 |
| PKG-DASH-05 | doing | 验证新旧核心和组合 |
| PKG-DASH-06 | todo | 验证分发并同步文档 |
| PKG-MULTI-SUB-05 | doing | 验证新旧核心和组合 |
| PKG-MULTI-SUB-06 | todo | 验证分发并同步文档 |
| PKG-JASSUB-05 | todo | 验证新旧核心和组合 |
| PKG-JASSUB-06 | todo | 验证分发并同步文档 |
| PKG-MASK-05 | doing | 验证新旧核心和组合 |
| PKG-MASK-06 | todo | 验证分发并同步文档 |
| PKG-ASR-05 | doing | 验证新旧核心和组合 |
| PKG-ASR-06 | todo | 验证分发并同步文档 |
| PKG-ADS-05 | doing | 验证新旧核心和组合 |
| PKG-ADS-06 | todo | 验证分发并同步文档 |
| PKG-VAST-05 | doing | 验证新旧核心和组合 |
| PKG-VAST-06 | todo | 验证分发并同步文档 |
| PKG-CAST-05 | doing | 验证新旧核心和组合 |
| PKG-CAST-06 | todo | 验证分发并同步文档 |
| PKG-DPIP-05 | doing | 验证新旧核心和组合 |
| PKG-DPIP-06 | todo | 验证分发并同步文档 |
| PKG-DANMUKU-08 | doing | 完成新旧核心与组合验收 |
| PKG-DANMUKU-09 | todo | 完成分发、示例与文档 |
| PKG-CANVAS-05 | doing | 验证新旧核心和组合 |
| PKG-CANVAS-06 | todo | 验证分发并同步文档 |
| PKG-MB-09 | doing | 完成新旧核心和真实媒体组合 |
| PKG-MB-10 | todo | 完成分发和文档 |
| PKG-IFRAME-05 | doing | 验证新旧核心和组合 |
| PKG-IFRAME-06 | todo | 验证分发并同步文档 |
| PKG-TOOL-THUMB-05 | doing | 验证新旧核心和组合 |
| PKG-TOOL-THUMB-06 | todo | 验证分发并同步文档 |
| SITE-05 | doing | 构建文档站和验证链接/示例 |
| SITE-06 | todo | 文档站交付验收 |
| SITE-07 | doing | 整理站点第三方资产与来源说明 |
| EX-03 | todo | 验证全部原生 demo 与外部播放集成 |
| MOD-04 | todo | 测量并优化重型插件/proxy |
| MOD-05 | todo | 完成工具链与性能采用决策 |
| REL-02 | doing | 生成候选 tarball 并验证新旧组合 |
| REL-03 | todo | 完成真机、外部 SDK 与压力验收 |
| REVIEW-01 | todo | 第一轮全项目架构与兼容性复盘 |
| REVIEW-02 | todo | 第二轮真实浏览器与生态集成复盘 |
| REVIEW-03 | todo | 第三轮 npm 候选内容与发布准备复盘 |
| REL-05 | todo | 经授权发布候选并收集反馈 |
| REL-06 | todo | 经授权分批正式发布 |
| REL-07 | todo | 关闭重构里程碑并维护后续队列 |
| PKG-JASSUB-09 | doing | 修复 hybrid 迟到绘制与销毁后画布重建 |

已关闭的 206 项仍完整保存在 risks.json，修复证据不删除。本清单不代替未来用户主导的复盘，也不触发新的检查任务。
