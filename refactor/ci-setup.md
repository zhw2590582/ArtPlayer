# PR 检查和 Pages 操作说明

## 本地命令

使用 toolchain-setup.md 的 Node/Yarn 环境与冻结安装。

| 命令 | 行为 |
| --- | --- |
| `yarn lint` | 只读 ESLint，覆盖包源码/声明、JS/MJS 工具、测试和编辑器声明 |
| `yarn lint:fix` | 显式自动修复相同范围 |
| `yarn typecheck` | 根/迁移包严格检查、当前与兼容 TS 消费；历史 NodeNext ESM 错误单独核对，见 typechecking.md |
| `yarn test:unit` | 原播放/DASH 回归、同夹具的新旧公共契约与 JS/TS loader 验证 |
| `yarn test:node` | test:unit 加工具链/文档构建回归，保留原 test:playback/test:dash-control 入口 |
| `yarn test` | 统一执行 Node 与基线测试，源码/夹具维护入口见仓库 test/README.md |
| `yarn test:browser` | 隔离服务执行 Chromium/Firefox/WebKit 真实播放；首次先运行 test:browser:install，详见 [入口](../test/browser/README.md) |
| `yarn test:imports` | 3 个既有包导入 smoke，构建后执行以使用新产物；不把 console 示例视为完整行为断言 |
| `yarn test:baseline` | 固定发布包完整性及本地 HTTP 基线测试；首次可能下载已固定归档到缓存 |
| `yarn test:contracts` | 重跑已登记断言的Node文件并采集精确事件/候选指纹，当前44项包含10个索引断言 |
| `yarn check:contracts --report` | 校验12类契约/22包归属、版本及报告对应；--write更新静态表，详见 [维护说明](contract-coverage.md) |
| `yarn ci:check` | 严格 Node/Yarn/锁检查、计划、只读 lint、类型、Node 和基线测试；允许写忽略缓存，不修改源码 |
| `yarn check:ci` | 只读校验实际工作流的完整系统矩阵、安装、缓存、报告和最终检查；已接入 ci:check |
| `yarn test:ci` | CI 汇总退出码、工作流/影响分析反例与隔离运行时校验，共 44 项 |
| `yarn test:package:runtime` | 标准 Node 重装同一已检查 tarball；须先运行 test:package，其他 Node 使用显式 --expected-node |
| `yarn ci:build` | 21 库包、i18n、编辑器声明和文档站构建，以及构建后包导入 smoke；会生成 dist 和 docs 内容 |
| `yarn check:impact --report` | 读取实际依赖/验证关系和Git变更，核对workflow必需命令，写CI影响报告；已接入ci:check，见[影响映射](impact-analysis.md) |
| `yarn build:all` | 保留旧入口，执行 ci:build 后只读 lint |

scripts/build-docs.js 保留原 npm run build 子命令兼容入口，现在传播失败退出码；包管理/锁维护继续使用 Yarn。MOD-02 可再统一旧内部脚本。build-ts.js 仅对刚生成的声明执行 ESLint layout 格式修正，使只读 lint 在构建后仍能通过；不是对生产源码执行自动修复。

## PR 和主线

.github/workflows/nodejs.yml 在 PR、master/codex/** push 和手动运行时触发，也供 Pages 复用。检查作业只授予 contents: read，checkout 不保留 Git 凭据，没有提交、推送、npm 发布或部署步骤。PR/推送取消过期运行；Pages 部署继续使用独立队列。

Actions 固定完整 SHA，Node 来自 .node-version，Yarn 固定 1.22.22；安装使用 frozen-lockfile。actionlint 1.7.12 从官方固定归档取得，先核对提交在 workflow 中的 SHA-256，再执行。没有执行 curl 管道脚本。日志在失败时也尽量上传，包含源码 SHA、工具版本、锁摘要和生成差异概览，保留 14 天。

## CI-01 当前矩阵与结果汇总

| 作业 | 系统 | 内容 | 超时 |
| --- | --- | --- | --- |
| checks | Linux、Windows | ci:check、ci:build；Linux 额外执行 actionlint | 45 分钟 |
| coverage | Linux、Windows | 既有源码映射与生命周期覆盖检查 | 15 分钟 |
| browser-smoke | Linux、Windows、macOS | 同一 core/chapter tarball 的 Node 20/22/24 消费，三浏览器、iframe history、性能 | 60 分钟 |
| CI result | Linux | 汇总以上三个作业组，所有结果必须为 success | 5 分钟 |

构建与浏览器工具使用 .node-version 的 24.21.0。安装运行时消费分别使用固定 20.19.0、
22.12.0 和标准 Node，不重新构建候选。它们是根工具 engines 的边界测试点，发布包没有
声明 Node 下限；更早 Node 和最低工具链干净安装仍需验证。TS 5.9.3、4.3.5 和迁移运行时兼容 5.1.6
继续由既有类型脚本按各自适用范围运行，不代表最低 Node 或所有包/TS 组合已验收。
矩阵不设置 fail-fast，单个系统失败后仍尽量收集其他系统证据；显式 bash 保留 tee
上游命令的失败退出码。影响报告继续扩大核心/共享变更到全生态，当前不缩减必需作业。

稳定名称为 **CI result**。它以 always() 依赖 checks、coverage、browser-smoke，结构化
读取 needs；失败、取消、跳过、缺失、错误 JSON 或未知额外作业都失败。增加独立 job 时
同时修改 ci-summary.mjs 的 requiredJobs、workflow needs、矩阵策略和测试，防止遗漏汇总。
全局取消/runner 故障下的真实调度仍待 CI-04；本地退出码测试不证明远端作业一定被调度。
required checks 的实际绑定尚未设置，不能宣称分支保护已经生效。

## 下载缓存、日志与维护

scripts/ci-context.mjs 从真实 checkout、package.json、.node-version 和 yarn.lock 读取
来源与版本，将绝对缓存目录写入 GITHUB_ENV/OUTPUT，运行信息写入 refactor/.cache/ci/context.json。
Yarn 缓存与浏览器缓存均按 OS/架构/Node/Yarn/ref/锁隔离，浏览器另绑定 Playwright 版本；
只缓存下载内容，无宽松 restore-keys、跨 OS 恢复或 node_modules/产物缓存。每次 frozen
install；浏览器每次 install --with-deps，缓存命中不能替代 Linux 系统依赖安装。
相关行为依据 [Playwright CI 文档](https://playwright.dev/docs/ci)。

新增 actions/cache 固定 caa296126883cff596d87d8935842f9db880ef25，来自当次核实的
[官方 v5 ref](https://api.github.com/repos/actions/cache/git/refs/tags/v5)，
[该提交 action.yml](https://github.com/actions/cache/blob/caa296126883cff596d87d8935842f9db880ef25/action.yml)
使用 node24；升级时重新核对 tag/SHA、runner 和缓存格式，不使用浮动标签执行。
本批没有新增 npm 依赖或修改 yarn.lock。

安装/构建/测试日志和已有 HTML/JSON、截图、trace、tarball 由 always 上传步骤留存；
名称包含系统、run_id 和 run_attempt，保留 14 天。最终脚本独立写 summary.json、
summary.md 和 GitHub Job Summary，不依赖先前下载的 artifact 来判断作业是否成功。
下载对应作业 artifact，先核对 context.json 的 source/workflowSource、工具版本和锁摘要，
再查看失败阶段的日志和浏览器 trace。缓存异常时可删除对应远端 key 后重跑；该动作
必须针对实际故障，不以清缓存代替修复锁或构建问题。

本地验证与指纹见 [CI-01 记录](changes/2026-09-13-CI-01-matrix-summary.md)。
三个 Node 的 Windows 安装证据及新发现见 [消费者记录](changes/2026-09-13-CI-01-node-consumers.md)。
CORE-25 已修复无 navigator 默认选项缺陷，严格 test:package:release 的当前 core/chapter
夹具已通过；此前的失败记录保留，见 [修复证据](changes/2026-09-13-CORE-25-defaults-ssr.md)。
更早 Node 消费/最低工具环境、全生态安装矩阵和有证据的影响调度仍待 CI-01；CI-04 负责
各系统远端运行、冷热缓存、失败/取消演练及 required check 设置。没有新增远端通过证据。

## Pages 隔离与启用条件

ENG-07 将浏览器候选改为 `yarn test:package` 实际打包并安装后的文件，使用输出映射禁止
回退到源码。安装/构建日志、tarball、成员指纹和浏览器结果一并上传，构建快照的 node_modules
链接不上传。初始包范围为 core/chapter；PKG-CHAPTER-04 已将这两个包的已知类型诊断清零，
严格打包检查现已通过，仍不等于整批发布准入或远端 CI 已通过。
见 [消费者说明](../test/package/README.md)。本地已验证，远端执行仍待 CI-04。

.github/workflows/pages.yml 仅支持手动运行，限定 master，且仓库变量 PAGES_DEPLOY_ENABLED 必须为 true。初始启用状态未经远端核实；没有修改该变量或其他 GitHub 设置。保留此门槛用于 CI-02 完成域名、路径和远端配置验收后再启用，不能直接自动部署 PR 产物。

Pages 先调用同一检查/构建 workflow，成功后上传同一次运行生成的完整 docs artifact，再在 github-pages 环境的独立作业调用官方 deploy-pages。仅 deploy 作业有 pages: write / id-token: write，没有 Git contents 写权限，也没有原先的 gh-pages force push。发布排队执行，不取消正在执行的发布。

已静态核对当前 docs/CNAME 为 github.artplayer.org；上传包含隐藏文件以保留 .nojekyll。docs 根、document、compiled、旧 HTML/编辑器等实际线上路径和历史站点来源仍需 CI-02 逐项预检；目前未确认或修改线上 Pages source。合并该变更后旧 push-master 自动部署会停止，需先完成以下迁移步骤再启用新流程。

1. CI-02 记录当前 Pages source、gh-pages ref、域名/DNS、关键 URL 和可恢复的旧产物。
2. 先验证 artifact 内容及旧路径；设置 Pages source 为 GitHub Actions，核对 github-pages 环境只允许受信任 master 部署和所需审批。
3. 经实际部署授权后设置 PAGES_DEPLOY_ENABLED=true，在 master 手动运行 Deploy Pages；记录 CI 和部署 URL，逐项探测旧路径。
4. 出现问题时关闭启用变量，按保存的 Pages source/gh-pages ref 恢复；不默认重新 force push 覆盖历史。恢复旧 workflow 可从 ENG-02 前 Git 历史取回，但执行远端写入仍按部署授权处理。

## 待核实的外部状态

| 项目 | 当前证据 | 负责任务 |
| --- | --- | --- |
| 新 PR/主线 workflow 实际执行、故障演练 | 仅本地静态和命令验证，无远端 run | CI-04 |
| required checks、fork 权限和环境审批 | 未读取/修改仓库设置 | CI-04 |
| Pages source、启用变量、域名和回退目标 | 只读源码 CNAME，远端未知 | CI-02 |
| npm 权限、trusted publisher、候选发布 | 未配置、未执行 | CI-03/CI-04 |

参考：[GitHub Pages 自定义 workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[setup-node](https://github.com/actions/setup-node)、[actionlint 1.7.12](https://github.com/rhysd/actionlint/releases/tag/v1.7.12)。本轮已核对选用 Actions 的实际 action.yml 和发布 tag 对应 SHA；后续升级需重新检查。
