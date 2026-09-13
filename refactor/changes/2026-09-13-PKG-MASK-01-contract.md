# PKG-MASK-01 Danmuku Mask 契约基线

冻结提交 `b0cfbfe3a09a84a295a257e45e4577847588d1cb`，只新增契约与验证文件，
未改生产、依赖、root 脚本、生成产物或 demo。没有推送或发布。

实际 registry 全部稳定版本 1.0.0/1.1.0 的归档、SHA512/SHA256、完整六成员及
四种入口已冻结。1.1.0 六发布文件与冻结工作区相同；registry gitHead 的插件
manifest 却是 1.0.1，显式保留此差异。两版声明完全相同，真实 CJS main/legacy
分别是旧对象.default、新直接工厂；script 全局仍为同名工厂。

SDK-08 记录六个 Yarn 解析版本、已安装 adapter 字节，以及 demo 12 个既有资源与
已安装 MediaPipe 0.1.1675465747 的字节一致性。默认 solutionPath 仍是无版本 CDN，
没有被锁文件固定。已安装 adapter 以固定 general 选择模型 0，不消费插件额外传入
的若干模型选项；因此不能将声明可传参数解释为已验证效果。

记录 start/stop 异步过期、多重 RAF、backend fallback、DOM/CORS、模型参数和第三方
通知后续问题。详见 [契约](../baselines/danmuku-mask-contract.md) 和
[完整来源](../baselines/danmuku-mask-release.json)。这些问题未在本任务修复，也未被
笼统认定必须保留；由 02 复现、03/04 实施、05/06 做真实模型与分发验收。

验证：固定 Node 24.21.0，独立 verifier 通过；6 项 node:test 全部通过、无跳过。
专属脚本 ESLint 通过。导出探针使用实际 bundle；自有源码默认值/零值/像素探针
使用受控 SDK 替身。没有新增下载/执行模型、浏览器服务器或真实 GPU/设备验证。
父代理复核六项测试通过，整合任务/风险/SDK-08索引并创建独立本地提交。
新增测试由现有test:baseline自动收集；两个直接重放命令见契约文档，无需重复脚本别名。
