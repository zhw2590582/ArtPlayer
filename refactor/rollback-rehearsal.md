# 回退演练与维护入口

REL-04 仍在进行中。本页记录已经可重跑的核心/Chapter 演练，不代表所有包或最终大版本候选已可回退。

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

尚需：22 包逐包旧版本/tag/依赖恢复表、iframe 更名前后消费者回退、主线修改与
JS→TS 冲突同步/中止演练。已执行 `git fetch origin master`，当时 master 没有
新增待同步提交；这不等于验证过冲突解决。

Thumbnail 的完整旧 npm tarball 缺失、文档站的真实部署恢复继续受原有发布门槛
约束。正式每批需要重新绑定实际 next-major 候选及旧包产物并重跑对应验证。
不执行 npm tag 修改、unpublish、推送或部署，不把本演练当作这些动作的授权。
