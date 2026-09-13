# CI-01 系统矩阵、缓存与结果汇总检查点

2026-09-13，基于 2c73e2b105ee55f95e3ffc906ea4ea1f25221622，分支 codex/compatible-modernization。
本批修改工程流程，不修改播放器或插件的生产源码、公开声明、版本、运行时依赖或构建产物。
CI-01 保持 doing；没有推送、部署、修改仓库保护设置或发布 npm。

## 旧行为与本批改动

原 checks 仅 Linux，浏览器仅 macOS，coverage 为 Linux/Windows；没有缓存或统一结果作业。
checks 扩为 Linux/Windows（45 分钟），浏览器扩为 Linux/Windows/macOS（60 分钟），
coverage 保留双系统（15 分钟）。每个系统运行完整已有命令，矩阵 fail-fast=false；
浏览器仍是 Chromium/Firefox/WebKit，真实设备和全生态覆盖不能由这个配置推导。

新增固定名称 CI result，依赖 checks、coverage、browser-smoke，并在前序失败后运行。
只有三个作业组全部 success 才返回 0；失败、取消、跳过、缺失、错误 JSON 或未知额外作业
均返回 1。GitHub 的 needs 是矩阵作业组的汇总结果，本地不伪造或推断每个远端子作业。
整个运行被强制取消或 runner 不可用时能否执行最终作业，仍需 CI-04 实际验证。

Yarn 只缓存下载内容，浏览器缓存与 Playwright 精确版本绑定；key 包含 OS、架构、Node、
Yarn、ref 和锁摘要，不设宽松恢复前缀，不缓存 node_modules 或构建产物。每次冻结安装，
浏览器即使命中缓存仍 install --with-deps。缓存目录由 Node 在 step 内从 RUNNER_TEMP
解析，写入 GITHUB_ENV/OUTPUT；初始把 runner.temp 放 job env 的 actionlint 失败已修复。

三个矩阵使用显式 bash，保留 tee 上游失败码；安装和执行日志、源码/工具/锁 metadata、
各类既有报告 always 上传，名称区分系统、run 和 attempt，保留 14 天。Pages 产物只有
受信任 master 的 Linux checks 分支上传，部署仍由原独立 workflow 的准入门槛控制。

## 模块与维护入口

- scripts/ci-context.mjs：只依赖 Node 内置模块，读取真实 checkout 和固定版本/锁，写运行 metadata 与缓存路径。
- scripts/ci-summary.mjs：独立评估结构化 needs，生成 summary.json/Markdown、Job Summary 和 CLI 退出码。
- refactor/scripts/ci-workflow.mjs：用现有 yaml 2.8.2 解析实际工作流，保护矩阵、不可变 Actions、安装顺序、权限、报告和最终依赖。
- test/ci-summary.test.js：运行真实 CLI 的成功/失败/无效 JSON、结果缺失与环境文件；纳入 test:node。
- refactor/scripts/ci-workflow.test.mjs：真实 YAML 正例和 20 个破坏条件的反例；纳入 test:baseline。
- 现有 impact-model/impact.test 继续保护六项必需命令及全生态影响传播。

新增 yarn check:ci（只读工作流校验，纳入 ci:check）和 yarn test:ci（以上三组 37 项）。
没有修改依赖或 yarn.lock。新增 Actions/cache 采用官方 v5 ref 当次解析的完整 SHA
caa296126883cff596d87d8935842f9db880ef25，其 action.yml 使用 node24；不使用浮动 tag 执行。
升级缓存 Action 时重新核对官方 ref/action.yml 和 runner 要求，不把 Node Action 运行时
等同于播放器消费者的最低 Node。

## 验证与范围

本地 Windows，Node 24.21.0 / Yarn 1.22.22：定向 37 项通过；完整 ci:check 2422 项通过
（2031 单元、23 工程、368 基线）。actionlint 1.7.12 与新增文件的只读 ESLint 通过。
原有 Yarn deprecation/生成声明提示仍存在，不声称整个 CI 无警告。
源码和日志指纹、计数与运行时长见 [验证记录](../baselines/ci-matrix-validation.json)。

没有新跑完整浏览器播放、ci:build 或 GitHub hosted jobs：这次没有修改生产源码和产物，
主要验证编排与错误传播。跨平台构建/浏览器、缓存命中和失效的实际结果仍是缺口，
配置成功不计入这些远端验收。现有 test:package 只对 core/chapter 实际安装，不能称全包消费通过。

## 后续与回退

CI-01 继续最低 Node/TS 消费者组合、全包 installed/browser 覆盖和有完整证据的影响范围调度。
当前保留全量运行，影响报告用于解释范围，不输出跳过必需检查的开关。CI-04 负责真实 PR
成功/失败/取消、各系统、缓存冷/热运行及稳定检查绑定的远端验收；这些均未完成。
公开 JS/TS、事件/DOM/CSS、分发入口无变化，不需要用户迁移。
回退本检查点可恢复旧编排和脚本入口，不需要重新生成库产物；远端设置未改，无远端回退动作。
提交主题：ci: [CI-01] add OS matrices, scoped caches and required result gate。
