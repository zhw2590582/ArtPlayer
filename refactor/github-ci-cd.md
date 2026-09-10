# GitHub CI/CD 优化与验收

2026-09-10 用户明确要求在本次重构中优化和增强 GitHub CI/CD。范围包含仓库检查、测试矩阵、构建产物、文档站部署和 npm 发布准备，并持续维护脚本文档及故障处理指南。本文是待实施规范，不代表 workflows 已更新或远端运行成功。

## 当前源码基线

[nodejs.yml](../.github/workflows/nodejs.yml) 是当前唯一 workflow：仅 push master 触发，Ubuntu + Node 20.x，checkout/setup-node 使用 v2；单一 job 执行 yarn 安装、两组 Node 测试、lint 和 build:all，再提交 docs、subtree split 并 force push gh-pages。

[package.json](../package.json) 中 lint 使用 --fix，build:all 又包含 lint；当前 workflow 没有 PR 触发、真实浏览器矩阵、类型消费者/tarball 检查、显式权限、并发取消、超时或报告上传。上述是文件检查结果，尚未核对 GitHub 的实际历史运行、Pages 配置、分支保护、环境规则或 npm 账号配置。旧流程的部署目标与访问路径必须先核实，不能仅改 YAML 就宣称迁移完成。

## 目标流水线

| 流程 | 触发和范围 | 交付/门槛 |
| --- | --- | --- |
| PR 和主线 CI | PR、主线及重构分支的相关提交；支持人工重跑 | 固定安装、只读 lint、类型、单元/生命周期、影响范围内的浏览器和产物测试、计划/文档检查 |
| 完整兼容回归 | 共享核心/构建变更、候选准备、定期或手动执行 | 全生态构建、新旧组合、所需 Node/TS/浏览器/系统矩阵、docs 编辑器及 HTML、性能/资源证据 |
| 候选产物准备 | 明确源码 ref 与包/版本范围的手动或受控调用 | 构建、pack、隔离消费者、完整性清单及报告；不发布 npm |
| 文档站部署 | 仅受信任主线或明确发布操作，依赖对应 CI | 部署已验证 Pages artifact，保留域名/CNAME、旧 URL、语言页和 compiled 路径，发布后探测 |
| npm 候选/正式发布 | 明确包批次、registry、版本、tag 和已批准的候选内容 | 三轮复盘与真实环境门槛通过后发布准确 tarball，读回版本/integrity并记录回退 |

ENG-02 先建立只读 PR 检查和部署隔离框架，后续 CI 任务逐步接入已完成的测试基础；不能等全套回归齐备才给 PR 加基础检查。定期 workflow 是拟实现仓库能力，本文不创建 Codex 定时任务，也不即时启用远程作业。

## CI 的可靠性与运行成本

- Node/TS/包管理器版本来自 ENG-01、BASE-08 和 Bun 试点；最低消费者兼容与构建所需运行时分别验证，不因 Actions 升级静默提高消费者要求。
- 覆盖 Linux 与 Windows 的关键脚本；浏览器覆盖 Chromium/Firefox/WebKit 和有需要的正式 Chrome。真机、Cast 等证据仍使用环境矩阵，不将 hosted runner 通过当作真机通过。
- 安装使用选定包管理器的锁定模式；缓存按 OS、运行时、包管理器及锁文件隔离，浏览器缓存还绑定测试工具版本。禁止无关 PR 缓存/产物进入有发布权限的任务。
- 快速检查依据依赖图而非简单路径过滤；共享核心/构建/锁文件变化扩大检查，影响不确定时完整回归。文档单改可缩小范围，但 required 汇总检查必须给出真实结果，不能将失败/取消误报成功或留下永久 pending。
- PR 同分支的新提交取消过期检查；发布与部署按目标串行，不能取消一半已发生写入的发布。设置任务超时、合理并行/分片和报告保留期，避免重复 build:all 或重复 lint。
- 只读检查不改源码；显式构建在指定输出目录生成产物。记录生成漂移，确保 build/test 不包含提交、推送或部署副作用。
- 报告包含 commit、运行链接、工具版本、测试计数/跳过/重试、逐包结果、覆盖率、大小和性能；失败也上传可获得的日志、截图和 trace。大媒体/录像不提交源码，报告避免凭据泄露。
- YAML/actionlint 等静态检查与真实 Actions 执行分别留证。至少演练正常 PR、失败测试、文档单改、核心变更及发布 dry run；旧问题按 ENG-10 台账处理，不用 continue-on-error 掩盖发布相关失败。

## 权限和第三方 Actions

普通 CI 默认只读 contents，fork PR 不获取发布 secrets；不使用有写权限的 pull_request_target 执行外部 PR 代码。部署/发布权限仅授予相应 job。固定第三方 Actions 的完整提交 SHA 并注释版本，建立可审阅的升级流程，具体版本在实施时验证 runner 兼容性。GitHub 建议参见 [安全使用参考](https://docs.github.com/en/actions/reference/security/secure-use)。

required checks、环境审批、Pages source、npm trusted publisher 等是外部配置：记录现状、目标、所需权限和完成证据。仓库代码可先实现并提交；缺少远端配置时不得声称已启用发布能力。工作流配置优化不等于本次已经授权推送、部署或 publish；按已有发布授权规则操作，不重复询问常规本地修改。

## Pages 与 npm 分发

Pages 优先评估官方 artifact 部署流程，替代 CI 内提交/force push gh-pages 的耦合；先核对当前站点来源、域名、静态目录及保留文件，迁移前准备恢复旧部署方式的步骤。具体权限及 artifact 约束依据 [GitHub Pages workflow 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。尚未迁移远端设置时，旧站点仍须可恢复。

npm 保持 Lerna independent 的分包版本，不自动统一版本或抬高 major。优先评估 [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) 的 OIDC 和 provenance；逐包核对支持环境、CLI 版本及信任配置，不能因支持 OIDC 就假定本仓库已配置。发布 CLI 环境要求不自动改变消费者最低 Node 要求。

发布只接收明确受信任来源的候选 artifact，并核对源码 SHA、workflow run、包/版本/registry/tag 和 tarball integrity。不能执行任意外部 URL 提供的代码或仅凭 artifact 名称信任内容。避免发布阶段生命周期脚本悄悄重建包；若内容改变，重新验证。dry run 不能证明 npm 权限、OIDC 或真实发布成功。

重跑发布先读 registry：相同版本存在时核对 integrity；内容不符则停止，禁止覆盖或默认 unpublish。分包发布部分成功时记录已成功包、失败包及 tag 状态，按兼容依赖顺序恢复；不盲目重发全部。候选 tag 升为正式前重核 REVIEW 和反馈修复证据。发布/部署后分别验证 npm 安装与站点关键路径，并记录分包/tag/站点回退方案。

## 任务归属

| 任务 | 交付 |
| --- | --- |
| ENG-02 | 只读脚本、PR/主线检查及部署隔离基础 |
| ENG-05/07/08/09/10 | 浏览器、tarball、覆盖/性能、影响图、历史失败的可调用检查 |
| CI-01 | 完整回归矩阵、缓存/并发/超时、稳定汇总检查和持久报告 |
| CI-02 | Pages artifact 部署配置、路径保留、预检和恢复指南；远端切换状态明确 |
| CI-03 | npm 分包候选准备/发布工作流、信任配置清单、artifact 校验及部分失败恢复 |
| CI-04 | 流水线静态/干净环境/真实 PR 检查证据、dry run 与远端准入状态验收 |
| REVIEW-03、REL-05/06 | 发布前核对 CI-04；实际发布和部署按明确授权执行，读回真实结果 |

CI-04 的仓库实现与远端配置证据分别报告。真实运行或必要配置尚未核实则该验收保持未完成，仍可继续其他独立本地任务；第三轮“发布就绪”不能绕过此缺口。
