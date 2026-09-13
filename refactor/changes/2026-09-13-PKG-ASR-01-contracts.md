# PKG-ASR-01：固定 ASR 公开契约

源起点为 3b016970f24fea603706a2f4bd50026846f5d939。冻结实际 npm 2.0.0/2.1.0、
12 个归档成员、9 个工作区 Git 文本及各自历史核心 manifest；不覆盖初始 BASE 快照。
交付物为 [契约](../baselines/asr-contract.md)、[来源](../baselines/asr-release.json)、
可重跑的 asr-contract 校验器与 test/asr.test.js。生产行为未改动。

确认接口同步注册、异步 stop、工厂参数快照、字幕替换/HTML/隐藏行为及样式去重。
公开声明与异步行为不一致、队列丢样本及初始化清理疑点分别登记到后续任务，
未把源码观察写成已修复问题。README 的 Ads 误写修正并链接包内维护说明。

验证：`node --test test/asr.test.js refactor/scripts/asr-contract.test.mjs` 32 项通过；
定向 ESLint、计划与风险台账检查通过。未运行全量 CI、真实浏览器、安装消费者或外部 ASR。
本批只固定后续迁移依据，真实音频、旧类型消费与发行验收仍由 ASR-02 至 ASR-06 负责。

无新依赖。增加 test:asr 命令并把公开行为测试接入 test:unit；来源检查在既有
test:baseline 通配入口执行。每次重跑都会校验归档，不静默重写基线。
回退本任务提交可移除这些基线、测试、文档与任务状态，不影响当前播放器运行时。
