# ENG-02：只读 PR 检查与独立 Pages 流程

日期：2026-09-10；分支 codex/compatible-modernization；起点 9a6cfe5c。

## 改动

- lint 改为只读，lint:fix 显式修复，覆盖新增 MJS 工具。新增 ci:check、ci:build、test:node、test:baseline、test:imports、check:plan；旧测试/构建入口保留。
- Node CI 支持 PR、master/codex/** push、手动和复用调用；固定 Actions SHA、Node/Yarn、冻结安装、只读权限、并发与超时，失败也上传可获得的日志/来源摘要。
- Pages 改为独立手动 workflow，仅 master 且 PAGES_DEPLOY_ENABLED=true 时准备和部署。复用同一次检查/构建得到的 docs artifact；仅部署作业有 Pages/OIDC 权限，移除 CI 内 Git 提交、subtree 和 force push。
- 当前仅实现隔离框架，未切换远端 Pages source 或启用变量。合并后原 master 自动部署会停止；CI-02 完成域名/路径/恢复验证后再启用，详见 ci-setup.md。

## 检查中发现并修复

原 build-docs.js 没有把构建子进程的失败传给调用方，导致 CI 可能错误成功。新增 error/close 处理，并用真实子进程退出 23/0 验证失败和成功均正确传播。

声明生成器产生的 46 处格式错误以前由 lint --fix 清理。将 layout 修正纳入声明生成器，只处理它刚生成的文件，不能自动改生产源码或调整类型逻辑。21 份声明经 TypeScript printer 规范化后与格式修正前完全一致，构建后只读 lint 通过。声明拼接本身的设计问题仍由后续类型/站点任务处理。

旧 esm/i18n/ssr 文件只有导入和 console，不是完整行为断言；把它们放到构建后的 test:imports，避免检查旧 dist 后宣称候选已测。

## 验证

- Node 24.21.0 / Yarn 1.22.22，使用 ENG-PM-01 冻结安装的独立环境；开发依赖和 yarn.lock 未变。
- 最终 ci:check 通过：21 项有行为断言的 Node 测试、2 项发布包/HTTP 基线测试。426 个源码/类型/测试文件检查前后哈希不变。
- ci:build 的库包、i18n、编辑器声明、VitePress 全流程通过；21 库包 63 产物，构建后另有 3 个导入 smoke 通过。
- 两份 workflow 经 actionlint 1.7.12 本地检查；Windows 归档 SHA-256 已核对。Windows 本轮禁用不可用的 shellcheck/pyflakes，Linux CI 命令保留其默认检查，远端尚未运行。
- 负例：故意引入格式错误导致 ci:check 失败且文件字节未被修改；非法 workflow key 被 actionlint 拒绝。负例均在临时副本恢复，没有修改生产文件。
- 计划/链接/依赖、源码 lint 和 Git 差异检查通过；报告见 [ci-validation.json](../baselines/ci-validation.json)。

没有运行新的远端 workflow、发布或推送。最低 Node/跨平台/浏览器/完整类型/候选包矩阵由后续 ENG/CI 任务实施，不能将本次绿色基础检查等同整个重构通过。

## 维护与回退

根 AGENTS、ci-setup.md、github-ci-cd.md、工具说明和任务状态同步维护。新增第三方工具只有校验归档方式使用的 actionlint 1.7.12；Actions 固定 SHA 和版本在 YAML 注释中，来源是官方发布 tag 对应提交。

可撤销 ENG-02 提交恢复旧脚本/workflow 配置；重新执行旧自动部署仍需要核对远端 Pages 状态。下一个任务 BASE-02 使用内置浏览器继续公共 API 快照，再推进事件/生命周期及试点所需测试基础。每项任务继续独立提交。
