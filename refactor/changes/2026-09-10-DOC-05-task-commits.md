# DOC-05 文档初始化与每任务独立提交

- 日期：2026-09-10。
- 分支：`codex/compatible-modernization`。
- 基线：`40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f`。
- 提交主题：`docs(refactor): [DOC-05] establish refactor docs and per-task commits`。
- 关联决策：ADR-007、ADR-013、ADR-014。

## 问题与变化

此前已创建分支和规划文件，但没有规定每任务完成后必须提交。用户明确补充：每完成一个任务就创建一个 commit。

现在根 AGENTS.md、README、AI 流程、质量验收和变更模板都要求：任务通过验收后，包含任务 ID 的独立提交同时保存实现、测试、文档和状态；核实提交成功后才能开始下一任务。失败不能当作已完成交付。推送和发布未被这项授权涵盖。

DOC-01 至 DOC-04 在新规则前已经完成，文件尚未进入 Git。本次 DOC-05 将这些已有文档作为初始基线一并入库；不伪造更早的独立提交。之后新增完成的任务各自提交。

## 范围与兼容

仅 AGENTS.md 与 refactor/。没有修改生产代码、公开声明、依赖或构建产物。新增任务规则不改变浏览器用户的行为。

## 验证与追溯

- `node refactor/scripts/plan.mjs --write`：生成 191 项计划。
- `node refactor/scripts/plan.mjs --check`：检查任务、依赖、22 包、链接与生成同步。
- `node --check refactor/scripts/plan.mjs`：语法检查。
- `git diff --cached --check`：提交内容格式检查。
- 提交后使用 `git log -1 --format='%h %s'` 与 `git status --short` 核对实际提交和工作区。

SHA 通过上述提交主题在 Git 历史中追溯；在同一提交中写自身 SHA 会导致循环修改，因此不在这里预填。生产测试不适用于本次纯文档初始化，前期诊断仍单独列在 progress.md。

## 回退与下一步

必要时独立回退本次文档提交，不影响生产实现。下一项为 BASE-01，必须在 DOC-05 本地提交成功后开始。
