# BASE-05：分发、类型与 SSR 消费

日期 2026-09-10；分支 codex/compatible-modernization；起点 2b7054d8。

## 实现与证据

固定 core 5.4.0 / chapter 1.1.0 的 47 个发布成员经完整性检查后复制到独立消费者，无 workspace 链接，不修改包 manifest。真实 Node 24.21.0 验证 root/legacy CJS 与 ESM、全局/最小 AMD loader、11 语言、exports 边界及 SSR import/模板/非浏览器构造错误，18 项断言通过。AMD 同时写入全局的历史副作用已保留。

TypeScript 5.9.3 以 strict=true / skipLibCheck=false 跑 16 个消费场景，8 项编译通过、8 项捕获历史诊断，按模式和场景分别记录。NodeNext ESM 默认导出互操作、chapter 可选参数及旧解析 legacy 声明问题已分配 ENG-04/CORE-07/包任务；toggle/plugins.add 旧声明返回差异交 BASE-07。测试通过代表如实复现历史，不能当作全部类型已经正确。

新增浏览器 SSR 夹具和报告白名单，两次最终重载各 5 项断言通过，原有 player/video 节点及自定义标记保留，真实 metadata/ready、插件注册和清理通过。无意外错误/拒绝，浏览器 error/warn 为空。预置模板复用不是服务端构造或 React/Vue SSR 集成。

清点全部 22 包 manifest、118 个观察到的 dist/types 文件、入口匹配、源码资源和构建规则。thumbnail tool 的 .esm.js/缺失声明与文档站实际站点分发已明确；清单没有把陈旧 dist 等同真实 npm 内容。没有更改生产源码、声明、依赖、锁文件或生成分发。

详见 [契约/固定 ID/复现/责任](../baselines/consumer-coverage.md)、[Node 与 TS 报告](../baselines/consumers.json)、[浏览器 SSR](../baselines/ssr.json)、[全包资源](../baselines/distribution.json)。消费者、清单和浏览器源验证分开，避免一个大脚本混淆已验证范围。

## 验证与接续

新增 3 项 Node 测试，包含真正隔离重跑和来源、缺案例、skipLibCheck、旧合法类型失败、媒体证据等负例。完整 ci:check、计划/链接、脚本语法和 diff 检查通过；没有为本任务重建无变化的生产包。冻结内容与再次运行的 runtime/类型结果一致。

本任务独立本地提交，主题含 BASE-05；不推送、不发布。撤销本提交可恢复旧基线服务/测试入口，发布历史记录保留于 Git。下一任务 BASE-06：固定媒体下的性能/资源基线，随后继续类型和试点实施基础。
