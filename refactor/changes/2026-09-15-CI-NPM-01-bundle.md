# CI-NPM-01 已验收候选的本地交付准备

来源 HEAD：`25faf88e80ab1fec5c1623c6bfb01655ede6c457`。
本任务从 CI-03 拆出本地文件准备能力，依赖已完成的 DOC-10、REL-08、REL-04。
CI-03 原有的 CI-01 等依赖全部保留，并新增本任务依赖；远端 CI、三轮复盘、
设备与最终候选要求没有删除，也未将原 CI-03 标为完成。

## 实现与使用

新增 `yarn release:bundle --packages artplayer,artplayer-plugin-chapter --tag next`。
脚本先执行严格工具链检查，拒绝脏 Git 工作区，再重新计算已有发布准入台账。
只有批次全部通过才复制其登记的精确 tarball。它不构建、不 pack、不安装、
不联网，也不执行 npm publish。缺证据时没有“先打包再补报告”的回退路径。

实现使用两个严格 TS 模块与一个薄 MJS 命令入口。prepare.ts 负责参数、工具链
与 Git 检查，bundle.ts 负责批次验证、文件复制、再次核验与失败清理。继续复用
release-ledger 的真实候选、来源、任务、风险、设备、回退与复盘检查；不创建
另一份手工状态表。包级 API、版本和分发文件不变，没有新增依赖或锁文件变化。

输出在新的 npm-bundle 缓存目录，manifest 最后写入，绑定完整 preflight 报告、
源码提交、工具链/锁、包版本、文件大小、SHA-256 与 SHA-512。第二次准入读取
必须与第一次一致，复制后的文件也再次核验，防止复制期间输入或输出漂移。
失败只清理确认位于缓存内的本次目录；若清理失败，保留原始错误及清理错误。

使用边界和后续 AI 维护入口见
[脚本架构](../../scripts/release/README.md)。CI-03 后续仍要建立受信任 artifact
下载、registry 占用检查、OIDC/权限、精确文件发布、部分失败恢复和读回核对。
manifest 明确 publicationAuthorized=false；自带摘要不能证明远端来源可信。

## 验证范围

新增回归使用真实小型 tar 归档与明确的合成准入报告，验证字节身份与拒绝路径；
Git 检查使用真实临时仓库。合成绿色报告不代表任何实际 ArtPlayer 包已验收。
覆盖批次/版本/tag 错误、站点混入、缺候选/缺证据、复制前后内容漂移、越界路径
和 junction、半成品清理、falsy 原始异常以及清理再次失败。没有网络调用或发布。

最终新增测试 25/25、既有 release-ledger 33/33、CI 相关 77/77 通过；严格 TS、
定向 lint、check:ci 和 check:impact 通过。环境为 Windows、Node 24.21.0、
Yarn Classic 1.22.22。首轮 lint 的 7 项导入/格式/测试异常写法错误保留在原日志，
修正后重新验证，没有把首轮写成通过。该任务不涉及播放器运行代码，未重复
运行浏览器、真实 SDK 或设备测试。

本仓库实际调用另验证未提交修改会被拒绝。现有严格 preflight 对 artplayer
仍返回 blocked，33 项缺口、publicationAuthorized=false；没有生成实际交付包。
检查计数、源码指纹、日志与原始失败轮见
[机器证据](../baselines/npm-bundle-validation.json)。

新增 `typecheck:release` 接入 ci:check，TS 目录进入 lint/lint:fix 范围；新增
`test:release-bundle` 同时被现有 test:baseline 通配发现。类型和脚本变更的检查
仅是本地结果，不能写作远端 CI 已运行或 npm 流程已启用。

## 回退

回退本任务独立提交会移除准备命令、TS 模块、对应测试/文档和脚本注册。
既有 release-ledger 及其严格发布门槛不变，不影响任何已发布包。
