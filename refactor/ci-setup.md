# PR 检查和 Pages 操作说明

## 本地命令

使用 toolchain-setup.md 的 Node/Yarn 环境与冻结安装。

| 命令 | 行为 |
| --- | --- |
| `yarn lint` | 只读 ESLint，覆盖包源码/声明、JS/MJS 工具、测试和编辑器声明 |
| `yarn lint:fix` | 显式自动修复相同范围 |
| `yarn typecheck` | 根/迁移包严格检查、当前与兼容 TS 消费；历史 NodeNext ESM 错误单独核对，见 typechecking.md |
| `yarn test:node` | 显式执行 4 个有行为断言的 Node 测试文件，保留原 test:playback/test:dash-control 入口 |
| `yarn test:imports` | 3 个既有包导入 smoke，构建后执行以使用新产物；不把 console 示例视为完整行为断言 |
| `yarn test:baseline` | 固定发布包完整性及本地 HTTP 基线测试；首次可能下载已固定归档到缓存 |
| `yarn ci:check` | 严格 Node/Yarn/锁检查、计划、只读 lint、类型、Node 和基线测试；允许写忽略缓存，不修改源码 |
| `yarn ci:build` | 21 库包、i18n、编辑器声明和文档站构建，以及构建后包导入 smoke；会生成 dist 和 docs 内容 |
| `yarn build:all` | 保留旧入口，执行 ci:build 后只读 lint |

scripts/build-docs.js 保留原 npm run build 子命令兼容入口，现在传播失败退出码；包管理/锁维护继续使用 Yarn。MOD-02 可再统一旧内部脚本。build-ts.js 仅对刚生成的声明执行 ESLint layout 格式修正，使只读 lint 在构建后仍能通过；不是对生产源码执行自动修复。

## PR 和主线

.github/workflows/nodejs.yml 在 PR、master/codex/** push 和手动运行时触发，也供 Pages 复用。Checks and build 作业只授予 contents: read，checkout 不保留 Git 凭据，没有提交、推送、npm 发布或部署步骤。PR/推送取消过期运行，手动部署不被中途取消；初始 Ubuntu 作业限时 30 分钟。

Actions 固定完整 SHA，Node 来自 .node-version，Yarn 固定 1.22.22；安装使用 frozen-lockfile。actionlint 1.7.12 从官方固定归档取得，先核对提交在 workflow 中的 SHA-256，再执行。没有执行 curl 管道脚本。日志在失败时也尽量上传，包含源码 SHA、工具版本、锁摘要和生成差异概览，保留 14 天。

本轮不缓存 node_modules；矩阵、下载缓存、覆盖率、浏览器 trace 和候选 tarball 汇总由 CI-01 等后续任务扩展。当前测试通过不代表尚未实现的类型消费者或浏览器矩阵通过。将来的稳定 required 汇总名称由 CI-01/CI-04 核实后设置，不把本地 YAML 当作分支保护已生效。

## Pages 隔离与启用条件

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
