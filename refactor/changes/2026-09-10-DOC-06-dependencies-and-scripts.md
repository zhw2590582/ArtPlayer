# DOC-06 自主选择依赖与添加脚本

- 日期：2026-09-10。
- 分支：`codex/compatible-modernization`。
- 基线提交：`570600d2`。
- 提交主题：`docs(refactor): [DOC-06] authorize dependencies and project scripts`。
- 关联决策：ADR-015。

## 用户要求与交付

用户明确允许按重构需要自主安装新依赖、添加合理脚本，并要求持久记录。现在根 AGENTS.md、质量要求、工具链规范、AI 工作流程及变更模板均明确此授权；常规选择不再重复请求确认。

记录用途、版本、所属 workspace/依赖类别，按需同步锁文件、CI、文档及验证。新脚本说明输入、输出和修改行为；新的运行依赖继续验证旧接口和产物兼容。执行顺序遵循实际任务，不提前批量安装工具。

## 范围与兼容

本次仅修改规则文档、任务数据及生成计划表。没有安装新依赖，没有修改 package.json、锁文件或生产脚本，也没有改变用户 API。

## 验证

- `node refactor/scripts/plan.mjs --write` 与 `--check`：生成同步、192 项任务、22 包覆盖、依赖与本地链接检查。
- `git diff --check` 和暂存后的 `git diff --cached --check`：格式检查。
- 提交后核对 `git log -1 --format='%h %s'` 与 `git status --short`。

本次为文档任务，未运行生产测试。实际提交通过主题中的 `[DOC-06]` 追溯，不在提交内容中预填自身 SHA。

## 后续

下一实施任务仍为 BASE-01。需要具体依赖和脚本时由对应 ENG/CORE/PKG/MOD 等任务选型、安装、验证并独立提交。必要时可以单独回退本次规则文档提交。
