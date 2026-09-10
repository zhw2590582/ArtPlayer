# DOC-10 记录 GitHub CI/CD 优化范围

- 日期：2026-09-10；分支：`codex/compatible-modernization`。
- 基线提交：`21fd40ec`。
- 提交主题：`docs(refactor): [DOC-10] plan GitHub CI and release automation`。
- 用户要求：优化增强 GitHub CI/CD，并记入重构文档。

## 交付

静态核对唯一 nodejs.yml、package.json 和构建流程，记录 master-only、自动修复 lint、单 job 构建与 Pages force push 耦合等现状。新增 github-ci-cd.md，覆盖 PR/回归矩阵、缓存/并发/超时/报告、权限、候选 artifact、Pages、npm 分包发布和远端验收。

补充 ENG-02，新增 CI-01/02/03/04 待办并将 CI-04 接入 REVIEW-03。新增 DOC-10 完成状态；原 203 项任务的 ID/范围/状态保留。共 208 项任务：10 项规划完成，198 项待办。没有修改 workflow、生产代码或外部配置。

## 验证与限制

计划生成与同步、依赖无环、22 包覆盖、本地链接检查通过；专项检查新 CI 前置进入候选/正式发布，原真机和复盘门槛保留。Git 差异及暂存范围检查通过，独立提交后核实日志与工作区。

参考官方 GitHub Actions/Pages 与 npm trusted publishing 文档，选定工具版本在实施时再次核对。未运行 GitHub Actions、构建或浏览器测试，没有创建定时任务、推送、部署、修改信任配置或发布 npm。

## 后续与回退

下一项仍为 BASE-01；ENG/CI 按依赖逐步实施，远端未知项单独登记。可回退本提交恢复之前计划，不影响现有 CI/CD。
