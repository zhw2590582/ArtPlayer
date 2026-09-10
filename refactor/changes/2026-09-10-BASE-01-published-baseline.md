# BASE-01 核心与 chapter 发布基线

- 日期：2026-09-10；分支：codex/compatible-modernization；起点：7a5354e3。
- 提交主题：`test(refactor): [BASE-01] freeze published core and chapter baselines`。
- 关联：API-09、ADR-019；本任务是来源与可重跑验证基础，不修改生产 API。

## 实际交付

固定 artplayer@5.4.0 和 artplayer-plugin-chapter@1.1.0 的 metadata URL、SRI、archive SHA-256、manifest、47 个成员哈希以及来源差异。新增无第三方 Node 依赖的验证脚本和损坏负例，缓存忽略规则及基线维护说明。

artplayer@5.4.1 当前未发布（registry 返回 404）；两个包的 registry gitHead 版本也与发布包不符，不能将它当成确定的发布源码。版本匹配的本地 tag 单独记录，精确构建重现仍待验证。其余 20 包及最低 TS/浏览器/核心支持范围尚未验证。

## 验证

- `node refactor/scripts/releases.mjs`：两个包 SHA-512/SHA-256、核心 41/chapter 6 成员哈希及主要 manifest 入口存在性通过。
- `node --test refactor/scripts/releases.test.mjs`：1 项通过，含替换 bytes 和错误 SHA-256 的负例。
- `node --check refactor/scripts/releases.mjs` 和计划检查通过。
- 环境：Node 25.2.1，Windows bsdtar 3.8.8；来源和完整哈希见 baselines/releases.json。
- 未运行生产播放/浏览器/类型回归；入口存在性不等于入口可运行，后续 BASE 任务继续验证。

## 兼容、交接与回退

没有修改 core/plugin 源码、manifest、锁文件或分发内容；目标仍为核心 6.0.0/chapter 2.0.0。验证脚本职责和命令见 baselines/README.md。可独立回退本提交；缓存是可重下载的本地文件。BASE-01 达到最小来源验收，后续先推进 BASE-02 和工程固定依赖。
