# 回退演练与维护入口

REL-04 的早期演练已完成，覆盖核心/Chapter 连续安装、iframe 更名、主线冲突同步和旧站点本地恢复。正式候选逐包回退由 REL-02 承接，并受发布台账及 REVIEW-03 约束；本页不代表所有包或最终大版本候选已可回退。

## 已实现的安装演练

固定 Node `.node-version`、Yarn Classic 1.22.22，先运行 `yarn test:package`，再运行
`yarn test:rollback`。前者在隔离快照中执行正常生产构建、类型生成和打包；后者读取
同一 HEAD 的构建报告及已冻结 npm 历史 tarball。不会改写工作区生产产物或根锁文件。

`scripts/rollback-consumer.mjs` 建立四套消费者 manifest/lock：旧核心+旧插件、
新核心+旧插件、旧核心+新插件、新核心+新插件。准备锁文件时从根锁解析离线依赖，
随后在同一个仓库外消费者目录中连续执行以下步骤：

| 步骤 | 安装状态 | 验证意图 |
| --- | --- | --- |
| install-old | 旧核心+旧插件 | 原始安装 |
| upgrade-core | 新核心+旧插件 | 独立升级核心 |
| upgrade-plugin | 新核心+新插件 | 升级插件 |
| rollback-plugin | 新核心+旧插件 | 单独回退插件 |
| restore-candidate | 新核心+新插件 | 恢复升级状态 |
| rollback-core | 旧核心+新插件 | 单独回退核心 |
| rollback-all | 旧核心+旧插件 | 恢复完整旧组合 |

每一步恢复对应 manifest/lock 后执行 Yarn `install --offline --frozen-lockfile
--force --ignore-scripts --non-interactive`；不会先删除 node_modules，因此能够检测
替换过程中遗留的新版文件。冻结锁字节必须不变，所有包成员及文件清单必须与实际
tarball 一致。版本号相同也检查内容；例如本次 Chapter 新旧均为 1.1.0。

`scripts/rollback-files.mjs` 专门检查安装清单、成员哈希和 workspace/symlink 逃逸。
仅忽略包根目录的 Yarn `.yarn-metadata.json`、`.yarn-tarball.tgz` 安装元数据。
负例覆盖相同版本的错误内容、新版残留文件及缺失文件；纳入 `test:node`。
消费者临时目录在成功或失败后清理，日志、锁和已核验安装副本保存在
`refactor/.cache/rollback/run-*`，`latest.json` 指向最近一次结果并记录成功状态。

复用 `test/package/runtime.cjs` 检查实际 CJS/ESM/UMD/AMD/legacy/i18n、SSR 与
Emitter/公开形状。旧核心显式使用历史配置，保留历史 SSR 失败断言；不会因为
回退而要求旧包支持新 `/runtime` 入口。安装脚本禁用不代表验证了 lifecycle hooks。

## 真实浏览器验证

设置 `ARTPLAYER_BROWSER_ARTIFACTS` 为成功演练输出中的某个
`<action>-browser-artifacts.json`，运行 `yarn test:rollback:browser`。
`playwright.rollback.config.js` 复用已提交播放用例，三引擎、零自动重试；检查实际
解码像素、播放、暂停、seek、切换 docs 媒体、Chapter DOM、事件与 destroy。

`scripts/rollback-artifacts.mjs` 在浏览器启动前校验：演练已成功、HEAD/Node 一致、
候选构建输入仍匹配当前源码/工具链、包来自已验证候选或冻结历史 archive、安装
副本所有文件和对应锁哈希一致。直接使用普通 installed runner 会因报告不是
ENG-07 而被拒绝；保留该门槛，回退使用独立验证入口。

浏览器通过独立 fixture 服务读取已核验安装副本，不是从仍存活的临时消费者目录
加载。用例中的 `candidate` 是路由名，具体版本以演练 profile 为准。
报告写入 `refactor/.cache/rollback-browser`；连续测试不同状态前，在前一进程
结束后把报告移入唯一 cache 子目录，防止覆盖。端口沿用测试服务 8084。

## 当前结果与剩余工作

2026-09-15，七步安装/回退均通过，共 237 个运行时检查；五组状态在三个桌面引擎中
15/15 真实播放通过。隔离候选构建另有 5/5 旧类型模式、8/8 精确类型模式通过。
详见 [机器证据](baselines/rollback-consumer-validation.json) 和
[检查点](changes/2026-09-15-REL-04-consumer-checkpoint.md)。

后续检查点已补齐[22 包恢复清单](rollback-inventory.md)、iframe 更名安装回退以及
JS→TS 冲突同步/中止演练。`yarn check:rollback-inventory` 校验生成表并重新检查
20 份完整冻结 archive；CI 的 `ci:check` 同样运行该检查。缺失 tarball 时只按
冻结 registry URL/完整性恢复缓存，不查询或跟随 latest。

## iframe 更名回退

运行 `yarn test:rollback:iframe`。`scripts/iframe-rollback.mjs` 在隔离构建快照内
用正常构建器打包当前 tool 包，并从冻结来源验证旧 plugin 包。先准备两套应用
manifest、lock 和导入代码，再在同一仓库外消费者中依次安装旧包、升级新包、恢复
旧包。检查完整成员、冻结锁、应用代码哈希和被替换包目录确实消失；各步另有实际
require/helper/legacy 及 TS 5.9.3 strict 消费者验证。

实际旧包 `artplayer-plugin-iframe@1.0.0` 的根 require 返回对象，构造类位于
`.default`，并有独立 helper 文件；新 tool 包根 require 直接返回类。负例已实际
把旧 tarball 安装在新的依赖键下，确认构造和 `/legacy` 均无法沿用新版写法。
这是本地 file 依赖键映射验证，没有声称执行过 registry 的 npm alias 协议。
回退要恢复应用导入代码和包名/锁，不能只换版本或别名。

输出为 `refactor/.cache/iframe-rollback/run-*`，包括两套锁、应用代码、构建及
安装日志和报告。该演练覆盖安装/导出/类型恢复，iframe 真机和跨窗媒体测试仍由
PKG-IFRAME-05 承担，不借此关闭其门槛。

## 主线修复同步与中止

运行 `yarn test:rollback:mainline`。`scripts/mainline-rehearsal.mjs` 在仓库外创建
独立 Git 仓库，合成 JS 计算模块迁移至两个 TS 模块后，主线修复旧文件的情形。
它实际复现负数计算的断言失败、cherry-pick 的 modify/delete 冲突；先中止并验证
HEAD/tree/工作区完全恢复，再次应用并把修复移入 TS 计算模块。最终回归通过、旧 JS
文件不存在、提交中保留 `cherry-pick -x` 来源。原仓库没有被切换分支或 cherry-pick。

Git fixture 只使用目录内身份配置，禁用全局配置；所有命令/退出码、断言、冲突内容、
最终 patch 和可验证 Git bundle 保存到 `refactor/.cache/mainline-rehearsal/run-*`。
失败也写报告，并清理已验证的临时消费者目录。该合成演练验证工作流，不代表发现或
修复了真实 ArtPlayer 重试逻辑问题。

实际同步时先 `git fetch origin master`，记录 `git rev-list --left-right --count
HEAD...origin/master` 及修复 SHA，再审查每个上游 diff。找出迁移后的责任模块，
为原缺陷补可重跑回归，在隔离工作树应用 `git cherry-pick -x <已核实修复SHA>`。
发生冲突时审查 `git status`、`git ls-files --unmerged` 和上游完整 diff，不能为
结束冲突而直接恢复已淘汰 JS 文件。修复迁移后的对应模块、暂存明确文件、运行相关
单元/类型/浏览器检查，再 `git cherry-pick --continue`。无法正确落地则
`git cherry-pick --abort`，核对原 HEAD/tree 和工作区状态后登记待同步项。
每个实际修复仍建立任务、保留上游归属、独立提交并通过提交审计。

本次再次 fetch 后 master 仍无新增提交；真实仓库没有需要应用的修复。冻结起点和
当前差分记录在[后续检查点证据](baselines/rollback-workflows-validation.json)。

文档站的固定旧快照已通过[完整本地恢复](changes/2026-09-15-REL-04-pages-recovery.md)，
包括全部 538 个文件、12 条 HTTP 路径和六项播放检查。Thumbnail 的完整旧 npm
tarball 缺失、文档站的真实远端部署恢复继续受原有发布门槛约束。
REL-02 在 REL-04 早期演练完成后，仍须逐包准备完整回退产物，并重新绑定实际
next-major 候选及旧包产物、应用导入和冻结锁，重跑对应验证。Thumbnail 归档
缺口继续阻止该包准入，远端恢复仍由 CI-04 验证；不以本地演练替代。
不执行 npm tag 修改、unpublish、推送或部署，不把本演练当作这些动作的授权。

2026-09-15 的[早期验收](changes/2026-09-15-REL-04-acceptance.md)在
`8dcbe9441eb06971a34785857f9cf47451047bb5` 重新构建并执行七步连续安装、
五种状态的三浏览器播放、iframe 和主线同步演练。旧站点恢复实现与实际交付提交
`ddf3d6ccb` 一致，本轮重新核验已恢复的 538 文件及 HTTP/播放；未再次破坏和恢复
站点。新增发布负例确认：即使早期任务完成，缺少候选回退报告、候选版本错误或
tarball 不一致仍拒绝准入。[机器证据](baselines/rollback-acceptance-validation.json)
保留输入身份、报告哈希、验证范围与取消请求；早期报告不能直接登记为最终发布证据。
