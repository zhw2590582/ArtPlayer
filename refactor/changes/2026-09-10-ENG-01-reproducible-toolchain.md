# ENG-01 固定 Node/npm 和依赖

- 日期：2026-09-10；分支：codex/compatible-modernization；起点：3c759f14。
- 提交主题：`build(workspace): [ENG-01] pin reproducible Node and npm toolchain`。

## 改动和原因

根项目先前忽略全部锁文件，CI 使用未固定安装，工具声明允许浮动；最低 Node 20.0 也低于已经使用的 Vite 7 要求。新增 .node-version，指定官方 LTS Node 24.21.0/npm 11.19.0；16 个根工具移到 devDependencies 并按原安装版本精确固定，提交 npm lock v3，发布包依赖和版本不变。

新增 check:toolchain 脚本验证 lock、workspace 与标准运行时，维护说明见 toolchain-setup.md。下载工具到忽略目录后发现 plan.mjs 会扫描第三方 Markdown；改为跳过缓存、依赖和 Git 目录，仍检查全部维护文档。

## 验证

官方 Windows zip 校验 SHA-256 后用于本地隔离测试。全新目录 npm ci 成功（1141 包），锁文件不变，已有解析路径版本差异为零；严格工具检查通过。该环境原 19 项测试、21 库包共 63 产物及 VitePress 构建全部通过。工作区在 Node 24 下原测试加两项基础测试共 21 项通过。

manifest 故意改变的负例被工具检查拒绝，恢复后通过；计划缓存误扫场景修复后校验通过。完整输入及输出摘要见 baselines/toolchain-validation.json。最低 Node 矩阵、生产类型和浏览器测试尚未运行，不能从构建推断通过。

没有生产源/API 或各包版本变更；构建仅写隔离目录，不改 docs/compiled 或包 dist。没有推送或发布。现有 workflow 的 Yarn 安装与只读检查将在下一项 ENG-02 改造。

## 回退与下一步

本提交可恢复原工具声明/锁策略，不涉及用户播放器数据。原本地 node_modules/yarn.lock 留存；缓存目录可按明确路径另行清理。下一项 ENG-02，BASE-02 等待 Chrome 连接恢复。
