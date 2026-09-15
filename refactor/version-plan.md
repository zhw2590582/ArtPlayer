# 分包版本与迁移方案（REL-01）

2026-09-16 冻结方案。机器源为 [version-plan.json](version-plan.json)，目标沿用用户批准的 [大版本政策](version-policy.md)。这是版本准备方案，22包当前均被正式发布台账阻止发布；任务、风险和实际准入继续以 tasks.json、risks.json、release-ledger.json 为准，不手工维护另一份“已经通过”清单。

## 版本和候选编号

REL-09 将22个 workspace manifest 设为各自下一 major 的正式数字版本，minor/patch 归零，不给根 private 管理包或两个 private 示例提升版本。本轮本地候选就是未上传的目标版本 tarball，不加 -rc 后缀；不能将此称为已经发布的预发布版本。

后续经用户授权公开候选时使用 next 标签，正式推广使用 latest；相同版本只能上传一次，标签推广应使用已验证的同一内容。next 标签不是版本隔离或发布授权，明确选择新版本的消费者仍可取得它。若公开后需要改内容，必须准备新版本并重新验证，不能覆盖或撤包后复用原版本。所有实际发布及标签操作仍等待三轮复盘和单独授权。

## 逐包目标与变更日志范围

表中源码版本是冻结快照；npm latest 是本次只读 registry 观察，并非新的兼容性基线。REL-09 为每包维护 CHANGELOG.md 的目标版本 unreleased 条目；每条的具体变更、声明策略、维护文档、依赖字段和剩余门槛见机器源。

| 包 | 源码 → 目标 | npm latest / 状态 | 变更日志要点 |
| --- | --- | --- | --- |
| artplayer | 5.4.1 → 6.0.0 | 5.4.0 | TypeScript subsystems and generated public declarations; preserve root APIs and offer precise /runtime types. Lifecycle, source/event ownership, components, subtitles, playback/display and accessibility fixes; historical consumer matrix retained. |
| artplayer-plugin-ads | 2.1.0 → 3.0.0 | 1.0.6 | Typed ad lifecycle and cleanup with preserved published defaults. Approved totalDuration type inference correction; migration explanation remains mandatory. |
| artplayer-plugin-ambilight | 1.1.0 → 2.0.0 | 1.1.0 | Typed rendering and cleanup with legacy factory behavior. Published root types retained; precise /runtime entry and older conflicting declaration migration. |
| artplayer-plugin-asr | 2.1.0 → 3.0.0 | 2.1.0 | Typed recognition, media/audio ownership, fallback routing and explicit capture. Preserve capability errors and cleanup; supported devices and WebAudio remain release gates. |
| artplayer-plugin-audio-track | 1.1.0 → 2.0.0 | 1.1.0 | Typed dual-media synchronization and owned track listeners. Buffer starvation/recovery validation remains open; do not claim a fully green playback matrix. |
| artplayer-plugin-auto-thumbnail | 1.1.0 → 2.0.0 | 1.1.0 | Separated metadata, frame capture, encoding and plugin cleanup in TypeScript. Native frame readiness/pixel issues remain tracked; migration does not claim all browsers passed. |
| artplayer-plugin-chapter | 1.1.0 → 2.0.0 | 1.1.0 | Typed parsing, chapter UI and lifecycle integration. Preserve chapter selection/events; remaining restart timing and distribution gates are explicit. |
| artplayer-plugin-chromecast | 1.1.0 → 2.0.0 | 1.1.0 | Typed SDK initialization, session/receiver state and failure ownership. Keep old public plugin surface; physical Cast/receiver verification is separate. |
| artplayer-plugin-danmuku | 5.3.0 → 6.0.0 | 5.3.0 | Typed input, scheduling, Worker placement, renderer, UI and resource ownership. Fix issue #958 heatmap density and CPU/async/first-frame scheduling loss; retain root published types with precise /runtime. |
| artplayer-plugin-danmuku-mask | 1.1.0 → 2.0.0 | 1.1.0 | Typed model/SDK lifecycle, rendering and cancellation. Preserve model behavior; combined native load and final SDK/device resource evidence stay explicit. |
| artplayer-plugin-dash-control | 1.1.0 → 2.0.0 | 1.1.0 | Typed SDK 4.x/5.x adapter, selector reconciliation and cleanup. Preserve published options/events; distinguish bare-SDK failures from candidate behavior. |
| artplayer-plugin-document-pip | 1.1.0 → 2.0.0 | 1.1.0 | Typed document/window lifetime and content restoration. Preserve existing API and DOM ownership; actual document-PiP/device gates remain. |
| artplayer-plugin-hls-control | 1.1.0 → 2.0.0 | 1.1.0 | Typed track/quality control and listener/selector lifecycle. Preserve supported hls.js combinations and source-topology cleanup; native worker/device gaps remain. |
| artplayer-plugin-jassub | 1.1.0 → 2.0.0 | 1.1.0 | Typed renderer/Worker/font ownership and native drawing compatibility. Preserve root entry and precise /runtime; hybrid late drawing issue remains an explicit blocker. |
| artplayer-plugin-multiple-subtitles | 1.2.0 → 2.0.0 | 1.2.0 | Typed caption parsing, ASS conversion, merging and load cancellation. Retain published root declaration; /runtime describes actual behavior and conflicting older extraction migration. |
| artplayer-plugin-vast | 1.2.0 → 2.0.0 | 1.0.0 | Typed SDK/loading/disposal and published initialization timing by default. Approved workspace-1.2 opt-in timing and /runtime type migration; SDK/network and device evidence remain separate. |
| artplayer-plugin-vtt-thumbnail | 1.1.0 → 2.0.0 | 1.1.0 | Typed VTT parsing, sprite lifecycle and cleanup. Preserve published root types and precise /runtime; document supported old-core combinations and name conflicts. |
| artplayer-proxy-canvas | 1.1.0 → 2.0.0 | 1.1.0 | Typed canvas/media shim, source and native subtitle-track ownership. Retain published root types with precise /runtime and documented older type conflicts. |
| artplayer-proxy-mediabunny | 1.2.0 → 2.0.0 | 1.2.0 | Typed engine/shim, input/HLS, audio/video pipelines and track controls. Preserve media-like event ordering and published entries; native codec/long-duration/device evidence remains scoped. |
| artplayer-tool-iframe | 1.1.0 → 2.0.0 | not-found | Typed cross-frame protocol, navigation generations, origin checks and teardown. Preserve the documented migration from artplayer-plugin-iframe; new-name rights and distribution rollback are not inferred from 404. |
| artplayer-tool-thumbnail | 4.4.0 → 5.0.0 | unpublished | Typed source/extraction/input/emitter ownership and actual constructor declarations. Approved published-3.5 default with workspace-4.4 opt-in; preserve delay/height, event and input policies and historical creat* names. |
| artplayer-vitepress | 1.1.0 → 2.0.0 | not-found | Typed site/editor/documentation/build modules and local library declaration generation. Preserve URLs, examples and editor globals; font provenance, site verification and Pages gates remain. No new npm distribution. |

## 依赖、示例与分发

当前22包没有互相声明的 workspace dependencies/peerDependencies。保留已有外部依赖与版本范围，尤其不因核心升到6而新设只支持6的peer限制；声明中的核心类型引用和实际旧核心支持仍由各包测试验证。VitePress开发依赖、MediaBunny、Mask和VAST运行依赖保持现有范围。

React/Vue示例各有三项已发布版本依赖：core、Danmuku和Document PiP。REL-09 将仓库内示例指向对应本地包（file:../../packages/<name>），使未发布新版本可以真实安装/构建；原始历史消费夹具保留，隔离tarball验证继续替换其测试来源。示例README同步先构建本地包的步骤；只维护根yarn.lock，不生成示例锁文件。新旧框架消费脚本需重新验证路径处理，不能认为修改package.json就已通过。

21个库分别核对原入口、exports/typesVersions、legacy、声明与资源，不机械统一为一种导出形状。核心声明继续从public/生成；已有/runtime入口和已批准的历史类型冲突说明保持。工具Thumbnail保留npm默认和显式workspace模式；VAST保留npm初始化与显式workspace模式；其他已接受的类型差异不借major升级扩大。

artplayer-vitepress升至2.0.0，但仍是站点分发，不新增npm发布。Iframe保留旧发布名artplayer-plugin-iframe的冻结来源和回退关联；新名404不证明名称可由当前账号使用。Thumbnail撤包后的历史归档/CSS/恢复门槛仍需完成，不能恢复上传曾使用过的版本。

## Registry证据与刷新

[2026-09-16只读快照](baselines/version-registry-2026-09-16.json)覆盖22个workspace名及Iframe旧名。所有目标版本均为not-observed，未观察到目标或更高major的稳定版本占用。未观察到占用不等于取得名称权限、保留版本或批准发布；CI-03/04需在实际上传前重新查验并验证发布身份。

查询同时读取versions、time及unpublished历史；网络、权限、限流、服务器和格式错误不能当作不存在。npm规定已使用的name@version即使撤包也不能重复使用，见[npm Unpublish Policy](https://docs.npmjs.com/policies/unpublish/)。

```sh
node refactor/scripts/version-registry.mjs --capture refactor/.cache/version-registry-<new-id>.json
node refactor/scripts/version-plan.mjs --check
node refactor/scripts/version-plan.mjs --prepared
```

固定Node24.21.0/Yarn1.22.22。capture只读registry并写新的本地证据，不覆盖旧快照；遇到已使用目标、更高major或未知响应退出1。check验证方案与当前清单；prepared还要求22包目标版本、各包CHANGELOG和两个示例依赖全部落地，目前应失败。它们均不代替严格release:preflight，也不执行publish。

## 实施顺序与失效规则

1. 本任务冻结方案和registry证据，独立提交。
2. REL-09更新版本、变更日志和适用示例/依赖/锁文件，冻结安装、严格类型和必要构建验证；单独提交。
3. REL-02重新构建目标版本产物，检查所有入口/资源及新旧消费者并绑定真实候选。旧版本的绿色报告保留为历史证据，不自动适用于新版本产物。
4. 继续各包组合/分发、设备、CI/CD与站点门槛。完成实施后由用户指导启动复盘，不能自动开展三轮复盘或发布。
