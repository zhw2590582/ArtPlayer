# 完整重构执行计划表

> 由 tasks.json 生成。请修改数据后运行 `node refactor/scripts/plan.mjs --write`，不要手改本表。

基线：`40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f`。总任务 222 项，范围 22 个包及工作区/示例。

状态：todo 95 / doing 12 / blocked 0 / done 115 / deferred 0。风险 L/M/H 表示兼容风险，不表示工期。

前置依赖是启动条件；验收是完成条件。任务可以继续拆分，但不能复用或悄悄删除旧 ID。

每项实施任务同时适用[全项目质量要求](quality-contract.md)：清晰拆分职责和依赖，主动改善不合理设计，以有效测试证明旧接口兼容，并同步维护后续 AI 可接续的包内文档。

## 包覆盖索引

| 包 | 基线版本 | 任务 |
| --- | --- | --- |
| artplayer | 5.4.1 | CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07, CORE-08, CORE-09, CORE-10, CORE-11, CORE-12, CORE-13, CORE-14, CORE-15, CORE-16, CORE-17, CORE-18, CORE-19, CORE-20, CORE-21, CORE-23, CORE-22, CORE-24 |
| artplayer-plugin-ads | 2.1.0 | PKG-ADS-01, PKG-ADS-02, PKG-ADS-03, PKG-ADS-04, PKG-ADS-05, PKG-ADS-06 |
| artplayer-plugin-ambilight | 1.1.0 | PKG-AMBILIGHT-01, PKG-AMBILIGHT-02, PKG-AMBILIGHT-03, PKG-AMBILIGHT-04, PKG-AMBILIGHT-PROXY-01, PKG-AMBILIGHT-05, PKG-AMBILIGHT-06, PKG-FACTORY-01 |
| artplayer-plugin-asr | 2.1.0 | PKG-ASR-01, PKG-ASR-02, PKG-ASR-03, PKG-ASR-04, PKG-ASR-05, PKG-ASR-06 |
| artplayer-plugin-audio-track | 1.1.0 | PKG-AUDIO-01, PKG-AUDIO-02, PKG-AUDIO-03, PKG-AUDIO-04, PKG-AUDIO-05, PKG-AUDIO-06 |
| artplayer-plugin-auto-thumbnail | 1.1.0 | PKG-AUTO-THUMB-01, PKG-AUTO-THUMB-02, PKG-AUTO-THUMB-03, PKG-AUTO-THUMB-04, PKG-AUTO-THUMB-05, PKG-AUTO-THUMB-06 |
| artplayer-plugin-chapter | 1.1.0 | PILOT-01, PKG-CHAPTER-01, PKG-CHAPTER-02, PKG-CHAPTER-03, PKG-CHAPTER-04, PKG-CHAPTER-05, PKG-CHAPTER-06 |
| artplayer-plugin-chromecast | 1.1.0 | PKG-CAST-01, PKG-CAST-02, PKG-CAST-03, PKG-CAST-04, PKG-CAST-05, PKG-CAST-06 |
| artplayer-plugin-danmuku | 5.3.0 | PKG-DANMUKU-01, PKG-DANMUKU-02, PKG-DANMUKU-03, PKG-DANMUKU-04, PKG-DANMUKU-05, PKG-DANMUKU-06, PKG-DANMUKU-07, PKG-DANMUKU-08, PKG-DANMUKU-09 |
| artplayer-plugin-danmuku-mask | 1.1.0 | PKG-MASK-01, PKG-MASK-02, PKG-MASK-03, PKG-MASK-04, PKG-MASK-05, PKG-MASK-06 |
| artplayer-plugin-dash-control | 1.1.0 | PKG-DASH-01, PKG-DASH-02, PKG-DASH-03, PKG-DASH-04, PKG-DASH-05, PKG-DASH-06 |
| artplayer-plugin-document-pip | 1.1.0 | PKG-DPIP-01, PKG-DPIP-02, PKG-DPIP-03, PKG-DPIP-04, PKG-DPIP-05, PKG-DPIP-06 |
| artplayer-plugin-hls-control | 1.1.0 | PKG-HLS-01, PKG-HLS-02, PKG-HLS-03, PKG-HLS-04, PKG-HLS-SDK-01, PKG-HLS-05, PKG-HLS-06 |
| artplayer-plugin-jassub | 1.1.0 | PKG-JASSUB-01, PKG-JASSUB-02, PKG-JASSUB-03, PKG-JASSUB-04, PKG-JASSUB-05, PKG-JASSUB-06 |
| artplayer-plugin-multiple-subtitles | 1.2.0 | PKG-MULTI-SUB-01, PKG-MULTI-SUB-02, PKG-MULTI-SUB-03, PKG-MULTI-SUB-04, PKG-MULTI-SUB-05, PKG-MULTI-SUB-06 |
| artplayer-plugin-vast | 1.2.0 | PKG-VAST-01, PKG-VAST-02, PKG-VAST-03, PKG-VAST-04, PKG-VAST-05, PKG-VAST-06 |
| artplayer-plugin-vtt-thumbnail | 1.1.0 | PKG-VTT-THUMB-01, PKG-VTT-THUMB-02, PKG-VTT-THUMB-03, PKG-VTT-THUMB-04, PKG-VTT-THUMB-05, PKG-VTT-THUMB-06 |
| artplayer-proxy-canvas | 1.1.0 | PKG-AMBILIGHT-PROXY-01, PKG-CANVAS-01, PKG-CANVAS-02, PKG-CANVAS-03, PKG-CANVAS-04, PKG-CANVAS-05, PKG-CANVAS-06, PKG-FACTORY-01 |
| artplayer-proxy-mediabunny | 1.2.0 | PKG-MB-01, PKG-MB-02, PKG-MB-03, PKG-MB-04, PKG-MB-05, PKG-MB-06, PKG-MB-07, PKG-MB-08, PKG-MB-09, PKG-MB-10 |
| artplayer-tool-iframe | 1.1.0 | PKG-IFRAME-01, PKG-IFRAME-02, PKG-IFRAME-03, PKG-IFRAME-04, PKG-IFRAME-05, PKG-IFRAME-06 |
| artplayer-tool-thumbnail | 4.4.0 | PKG-TOOL-THUMB-01, PKG-TOOL-THUMB-02, PKG-TOOL-THUMB-03, PKG-TOOL-THUMB-04, PKG-TOOL-THUMB-05, PKG-TOOL-THUMB-06 |
| artplayer-vitepress | 1.1.0 | SITE-01, SITE-02, SITE-03, SITE-04, SITE-05, SITE-06 |

## 0 规划

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| DOC-01 | workspace<br>创建兼容重构分支 | - | 独立本地分支和起点 SHA | 分支由干净 master 创建，起点可追溯 | L | done |
| DOC-02 | workspace<br>清点全部包与消费者 | DOC-01 | package-inventory.json | 22 包及 React/Vue/demo 有明确清单 | L | done |
| DOC-03 | workspace<br>建立计划、契约、决策和协作记录 | DOC-02 | refactor 文档集与任务数据 | 每包有独立步骤、依赖、交付物和验收条件 | L | done |
| DOC-04 | workspace<br>验证文档完整性与生成表 | DOC-03 | 计划生成校验工具、AGENTS 入口 | 依赖无环、包覆盖、生成同步、文档链接通过 | L | done |
| DOC-05 | workspace<br>建立每任务提交规则并提交文档基线 | DOC-04 | 根指令、质量要求、AI 流程、变更记录与初始文档提交 | 文档与计划检查通过，独立 DOC-05 commit 保存本次交付；提交后核实 SHA 和工作区 | L | done |
| DOC-06 | workspace<br>记录自主安装依赖与添加脚本授权 | DOC-05 | 根指令、工具链规范、AI 流程、决策及变更记录 | 授权、依赖归属、脚本文档和兼容验证要求明确，计划校验通过并独立提交 DOC-06 | L | done |
| DOC-07 | workspace<br>复审并优化计划顺序和执行门槛 | DOC-06 | 依赖优化、执行门槛规范、测试/发布补充和审查记录 | 依赖与覆盖校验、专项执行顺序断言通过；任务范围完整并独立提交 | L | done |
| DOC-08 | workspace<br>记录 Chrome 验证及多轮 npm 发布复盘 | DOC-07 | 浏览器分工、三轮复盘规范、发布依赖与接续文档 | 计划和发布依赖检查通过；独立提交 DOC-08，连接可用不冒充测试通过 | L | done |
| DOC-09 | workspace<br>记录 docs HTML 与在线编辑器测试入口 | DOC-08 | 页面/加载方式、状态隔离、行为断言与既有任务映射 | 源码清点和计划检查通过，独立提交 DOC-09；不把页面存在当作测试通过 | L | done |
| DOC-10 | workspace<br>记录 GitHub CI/CD 增强范围与验收 | DOC-09 | CI/CD 规范、四项实施任务与发布依赖 | 现有 workflow 核对、计划检查通过并独立提交；不冒充远端执行完成 | L | done |
| DOC-11 | workspace<br>记录全部包各自升级一个大版本 | DOC-10 | 22 包目标版本清单、决策和发布/CI/复盘规则同步 | 版本表与 manifest 对照、计划检查通过并独立提交；不修改旧 API 兼容要求 | L | done |
| DOC-12 | workspace<br>复审开发启动、验收覆盖及发布依赖 | DOC-11 | 语义依赖修正、版本实施任务、基线/分发分类及契约映射要求、校验器保护 | 原范围状态保持，计划检查和故障负例通过，独立提交 DOC-12 | M | done |
| DOC-13 | workspace<br>记录并验证内置浏览器回退规则 | DOC-08 | 根指令、复盘和夹具文档中的浏览器回退及实际环境证据 | 内置浏览器打开真实页面，报告基础检查结果及未覆盖项；独立提交 | L | done |

## 1 基线

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| BASE-01 | workspace<br>固定核心与试点的最小发布基线 | DOC-07 | 核心及 chapter 的 npm tarball/integrity、源码 SHA、已知支持窗口；其他包标待核对 | 核心/试点来源可重跑；不虚构全生态已验证，各包 01 步负责补齐自身历史发布基线 | H | done |
| BASE-HARNESS-01 | workspace<br>建立最小发布包浏览器采集夹具与服务 | BASE-01 | 固定 tarball 静态服务、本地媒体 Range、公开 API 采集页面及受控报告路径 | HTTP 精确内容/范围和路由隔离测试、夹具语法通过；浏览器采集仍由 BASE-02 负责 | M | done |
| BASE-02 | workspace<br>捕获公共 API 和属性描述符 | BASE-01, BASE-HARNESS-01 | 核心与试点的构造/默认值/静态和实例 API 快照，其余包由 01/02 步补齐；登记契约/版本/固定测试 ID/命令/报告与负责任务 | 真实发布包反射与旧用户调用可重跑，未验证项明确 | H | done |
| BASE-03 | workspace<br>捕获事件、异步和生命周期 | BASE-02 | ready/restart/destroy、Promise、切源/插件事件 trace；登记契约/版本/固定测试 ID/命令/报告与负责任务 | 成功、失败、重入和多实例有断言，历史缺陷有标记；使用已发布包和最小可重跑探针启动，不等待后续 ENG 服务 | H | done |
| BASE-04 | workspace<br>捕获 DOM、CSS 和官方 demo | BASE-02 | 核心模板/类名/变量、键盘/焦点/可访问名称基线及全 demo 路径映射；docs-browser-testing.md 中 HTML/编辑器的脚本来源与存储状态；登记契约/版本/固定测试 ID/命令/报告与负责任务 | 核心/试点用户样式和输入用法已记录，其他 demo 运行状态与未知项明确；使用已发布包和最小可重跑探针启动，不等待后续 ENG 服务 | M | done |
| BASE-05 | workspace<br>捕获包入口、资源和类型消费 | BASE-01 | 全包 manifest/资源路径清单；核心/试点的 UMD/AMD/ESM/CJS/legacy/i18n 和类型消费者基线；登记契约/版本/固定测试 ID/命令/报告与负责任务；区分库/npm 与站点实际分发类别，SSR import/模板/非浏览器构造错误分别捕获 | 核心/试点隔离消费可运行，其他包由各自契约任务验证，thumbnail tool 差异已登记 | H | done |
| BASE-06 | workspace<br>记录性能与资源基线 | BASE-03, BASE-04 | 固定媒体/设备测量、包体积、反复装卸资源报告 | 多次采样可重跑，指标和审查阈值确定，不承诺未经测量的收益；使用已发布包和最小可重跑探针启动，不等待后续 ENG 服务 | M | done |
| BASE-07 | workspace<br>建立差异和风险台账 | BASE-03, BASE-05 | 销毁/切源/类型差异、vendored 许可和外部 SDK 清单 | 已确认与待复现分开，每项有负责任务及兼容处理路线；纳入 BASE-TYPE-01/02/03/04 和 BASE-DIST-01 的发布/声明/工作区证据；纳入 BASE-PERF-01 销毁后 resize/notice 延迟工作 | H | done |
| BASE-08 | workspace<br>建立消费者与真实环境验证矩阵 | BASE-01, BASE-05 | 每包版本/浏览器/codec/SDK/设备/样本、证据和负责验证任务的矩阵 | 格式兼容与运行能力分开，未知/缺环境不算通过，明确哪些检查阻止哪些批次发布 | H | done |

## 2 工程保障

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| ENG-01 | workspace<br>固定 Node、包管理器与依赖 | BASE-01 | 版本 pin、唯一锁文件、安装说明 | 干净环境可复现，最低 Node 与构建依赖一致，未夹带全量升级 | M | done |
| ENG-PM-01 | workspace<br>按用户选择切换固定 Yarn 包管理器 | ENG-01 | Yarn 固定版本、唯一 yarn.lock、工具检查与安装维护文档 | 干净冻结安装、Node 测试和全部构建通过；记录解析差异和依赖用途，独立提交 | M | done |
| ENG-02 | workspace<br>拆分只读检查并建立 PR CI | ENG-01, ENG-PM-01 | lint/lint:fix、PR 与主线检查、独立部署任务；遵循 github-ci-cd.md，PR/重构分支触发、最小权限及 workflow 静态检查 | 仓库内检查可执行且不改源码、不发布；required checks 的外部设置状态列入发布台账，不阻塞本地框架建设 | M | done |
| ENG-03 | workspace<br>建立公共行为与单元测试入口 | ENG-02, BASE-03 | 保留现有 node:test，测试目录/夹具/统一入口 | 已有 19 项回归保留，旧版与候选可用同一夹具运行 | M | done |
| ENG-04 | workspace<br>建立类型测试基础 | ENG-02, BASE-05 | 根与分包 tsconfig、显式 TS 依赖、正反例测试 | 核心/试点与迁移模块严格检查，未迁移第三方/包历史问题独立台账；明确最低/当前 TS 和各环境类型；复用 BASE-05 的四种消费模式，不以 skipLibCheck 掩盖 BASE-TYPE-01/03 | M | done |
| ENG-05 | workspace<br>建立真实浏览器测试服务 | ENG-03, BASE-04, BASE-08 | Playwright projects、本地 Range/失败媒体服务；复用 docs 页面/样本的状态隔离、错误采集与候选资源映射 | Chromium/Firefox/WebKit 的基础播放 smoke 和报告可执行；以媒体状态断言判定通过，区分轻量用例与真实编辑器交互 | M | done |
| ENG-06 | workspace<br>支持按包非交互与 JS/TS 构建 | ENG-02, BASE-05 | build/dev 入口解析、指定包参数、原交互保留 | 三种产物、Less/SVG/worker 和本地 8082 demo 正常；保持 BASE-05 的 AMD 同时写入全局行为及 i18n/legacy 入口 | H | done |
| ENG-07 | workspace<br>建立 tarball 消费与产物检查 | ENG-04, ENG-06 | 隔离 npm 消费 fixtures、API/声明/入口差分 | 不借 workspace 源码通过，能识别缺文件与默认导出变化 | H | done |
| ENG-08 | workspace<br>增加覆盖率、资源与性能报告 | ENG-03, ENG-05, BASE-06 | 覆盖率基线、资源清理断言、性能报告与阈值 | 关键生命周期分支有门槛，报告不靠无意义断言堆数量；将 BASE-06 的同环境多组配对、计时/压缩审查阈值与资源异常分开接入候选，不把历史现象冻结成正常要求 | M | done |
| ENG-AUDIT-01 | workspace<br>核对每任务完成提交的真实Git历史 | ENG-07, DOC-04 | 独立完成提交、初始DOC例外、父分支合并和证据共提交审计；CI完整历史与报告 | 真实仓库及隔离Git反例通过，done任务不允许缺独立commit，固定DOC-01～04例外可追溯；提交后验证自身 | M | done |
| ENG-IMPACT-01 | workspace<br>建立全包依赖与共享变更影响映射 | ENG-07, DOC-04 | 核心/构建/类型/锁文件到受影响包和必需生态检查的映射及CI接入 | 核心变化触发必需生态检查；新增包、未知共享文件或失配依赖不能静默漏检；解释受影响路径和测试命令 | M | done |
| ENG-COVERAGE-01 | workspace<br>建立公开契约与版本测试证据覆盖索引 | BASE-08, CORE-22, ENG-07 | 契约-包-支持版本-固定测试ID-命令-候选/报告-责任任务索引和文档检查 | 计划、已执行和缺证据状态分开，所有公开契约都有验证归属；无效路径、版本依据或报告对应不明确会被识别 | M | done |
| ENG-09 | workspace<br>建立全包依赖影响和文档检查 | ENG-07, DOC-04, ENG-AUDIT-01, ENG-IMPACT-01, ENG-COVERAGE-01 | 共享核心/构建影响映射、文档及每任务完成提交的 Git 审计接入；契约-支持版本-测试 ID-命令-候选/报告-任务的覆盖索引 | 核心变化触发必需生态检查；原有 DOC-01 至 04 基线例外明确，后续 done 任务不能缺失独立 commit；计划/已执行/缺证据分开，识别缺少验证归属的公开契约 | M | done |
| ENG-10 | workspace<br>建立历史失败分级和测试可靠性规则 | ENG-03, ENG-04, ENG-05, ENG-07, BASE-07 | 历史失败 ID/环境/旧版复现/负责修复任务、逐模块门槛、受控等待与 trace/retry 规则 | 不靠全局忽略或无理由 skip 隐藏问题，新增回归阻止交付，设备缺口和偶发失败单独可见；以 risks.json 为统一差异索引；关闭必须有 resolutionEvidence/rationale，已复现、源码事实、未验证分开，登记不等于豁免 | M | done |
| ENG-11 | workspace<br>增加不改变产物的模块构建分析 | ENG-03, ENG-08 | 正式构建的可选模块归因报告及源码/产物指纹 | 相同构建开关前后三格式字节一致，报告不进入分发包；区分 Rollup 渲染字节与压缩体积，并保留真实工作区/发布来源 | L | done |

## 2.2 GitHub CI/CD

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| CI-01 | workspace<br>增强兼容矩阵、并发缓存与 CI 报告 | DOC-10, ENG-08, ENG-09, ENG-10 | OS/Node/TS/浏览器与影响范围矩阵、缓存、超时、汇总检查和 artifact 报告 | 固定安装、失败/取消不误报、核心影响全生态；检查只读，失败证据可追溯 | H | todo |
| CI-02 | workspace<br>分离并改进 GitHub Pages 部署 | DOC-10, ENG-02, SITE-03 | Pages artifact 部署配置、旧路径/域名核对、预检和迁移恢复指南 | 部署只取受信任已验证产物；本地实现可验收，远端 source/环境和实际部署状态单独登记 | H | todo |
| CI-03 | workspace<br>建立 npm 分包候选与发布工作流 | DOC-10, CI-01, REL-08, REL-04 | 候选准备、精确 artifact 发布配置、OIDC 评估、版本/tag/registry 预检和部分失败恢复 | 不自动发布；明确逐包信任前置和 dry run 限制，不能重建未验证内容或重发冲突版本；按版本清单校验各包下一 major 和预发布/正式 tag，保留旧核心支持范围 | H | todo |
| CI-04 | workspace<br>验收 GitHub 流水线与远端发布准入 | CI-01, CI-02, CI-03, SITE-06 | 静态/干净环境检查、真实 PR 正反例、候选 dry run、required checks/Pages/npm 必需配置状态及运维指南 | 必要 Actions 证据和远端配置核对齐全；缺失保持未完成，真实 publish/deploy 仍在授权发布步骤执行 | H | todo |

## 2.1 早期试点

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PILOT-01 | artplayer-plugin-chapter<br>在旧核心上完成小插件迁移闭环 | PKG-CHAPTER-04, ENG-07, ENG-05, ENG-10 | chapter 的 TS、旧核心消费、真实浏览器、tarball、包内维护地图及粒度/成本反馈 | 不依赖 CORE 重构即可通过整个试点；最终核心仍由 chapter 05/06 重新验收 | H | done |

## 3-4 核心迁移

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| CORE-01 | artplayer<br>迁移纯工具并冻结导出 | ENG-03, ENG-04, ENG-06, PILOT-01 | utils/time/property/format/file/error/subtitle 的分批 TS 迁移 | Artplayer.utils 导出/参数/绑定保持，纯逻辑与类型测试通过 | M | done |
| CORE-02 | artplayer<br>迁移内部 Emitter | CORE-01, BASE-03 | 带类型事件映射的原 Emitter 实现 | ctx、once/off、重入/异常和链式返回保持 | H | done |
| CORE-03 | artplayer<br>建立内部资源作用域 | CORE-02 | 监听/订阅/定时器/RAF/请求/URL 的资源登记 | 实例与操作作用域分离，单项清理失败不阻断其他资源 | H | done |
| CORE-04 | artplayer<br>修复初始化与销毁生命周期 | CORE-03, ENG-05, BASE-07 | 构造失败回收、重复/重入 destroy、instances 修复 | 事件顺序、removeHtml、多实例和销毁中异步有真实回归；处理 baselines/lifecycle-coverage.md 的 BASE-LIFE-04/05 并增加候选正向回归；协调 BASE-PERF-01 销毁后定时器与回调归属 | H | done |
| CORE-05 | artplayer<br>区分输入配置和内部配置 | CORE-01, ENG-04 | Option/ResolvedOption、默认值与校验整理 | 配置合并/错误时机不变，JS 输入仍运行时校验 | M | done |
| CORE-06 | artplayer<br>建立内部媒体与宿主类型 | CORE-05 | 原生 video、canvas shim、UI host 类型 | 不更改公开 art.video 用法，不以 HTMLVideoElement 断言掩盖 shim | M | done |
| CORE-07 | artplayer<br>逐项协调公开声明差异 | CORE-02, CORE-06, BASE-07 | plugins/toggle/cue/setting/static 的旧新类型对照 | 每项有兼容重载/扩展或待决结论，不能删除旧类型样例；处理 BASE-TYPE-01/04，分别保留旧合法声明消费并验证真实返回；协调 BASE-TYPE-05 的 Utils 导出、descriptor 和 timer 旧声明差异 | H | done |
| CORE-08 | artplayer<br>整理插件管理器与扩展类型 | CORE-03, CORE-07 | 注册流程、同步/异步结果、插件/事件扩展接口 | 旧插件同步可见性、重名与命名、销毁中异步插件保持明确语义；处理 baselines/lifecycle-coverage.md 的 BASE-LIFE-03 并增加候选正向回归；接续 CORE-07 / BASE-TYPE-04 的同步/异步注册返回声明冲突，内部返回类型精确，保留历史消费者 | H | done |
| CORE-09 | artplayer<br>整理 URL 与切源操作 | CORE-04, CORE-06, CORE-08 | url/switch/customType 的操作身份及取消方案 | 并发切源、错误、同 URL、销毁和 Promise 结算有契约；处理 baselines/lifecycle-coverage.md 的 BASE-LIFE-01/02/06 并增加候选正向回归 | H | done |
| CORE-10 | artplayer<br>迁移播放与时间/状态属性 | CORE-09 | play/pause/toggle/seek/volume/rate/duration 等模块 | 旧返回值、拒绝、mutex、位置恢复、属性描述符与事件通过；接续 CORE-07 / BASE-TYPE-04 的 toggle void 与实际 Promise 分支冲突，不吞拒绝 | H | done |
| CORE-11 | artplayer<br>整理媒体事件、ready 与重连 | CORE-10 | 媒体转发、重连、UI 响应职责分离 | readiness 次数/顺序、过期重连、原错误参数有回归 | H | done |
| CORE-12 | artplayer<br>迁移模板及公开资源入口 | CORE-06, CORE-04, BASE-04 | template/icons/i18n/style、SSR 与 proxy 挂载 | DOM/CSS/global/样式注入、i18n 子路径及 SSR import 保持；不把 SSR import/useSSR 保持扩大为服务端构造播放器；复跑 BASE-05 的 SSR import/模板、浏览器 useSSR 节点复用和非浏览器构造错误；接续 VENDOR-01/02，核对 screenfull/hint 复制版本、修改与分发通知，保留 DOM/CSS/fullscreen 行为 | H | done |
| CORE-13 | artplayer<br>迁移组件注册与控件 | CORE-12, CORE-08 | Component/control/layer/contextmenu 的资源与 TS 边界 | add/update/remove、name、selector、mounted/beforeUnmount 通过；处理 BASE-DOM-02 窄容器控件裁切，保留 controls.update 的旧 undefined 返回值 | H | done |
| CORE-14 | artplayer<br>拆分设置树、渲染和布局 | CORE-13 | setting model/selection/render/layout 的分批实现 | 不强行统一控件返回值，嵌套选择、默认高亮、更新清理通过；结合 BASE-DOM-02 验证窄容器设置定位；接续 BASE-TYPE-07 的 find null、add/update item、remove undefined 声明冲突 | H | done |
| CORE-15 | artplayer<br>迁移字幕获取、解析和渲染 | CORE-11, CORE-13 | subtitle 请求/track/DOM/URL 生命周期与类型 | 过期结果、偏移、cue 数组、原生全屏及错误路径通过；接续 BASE-TYPE-07 的真实 cue 数组与旧隐式 scalar 回调声明兼容 | H | done |
| CORE-16 | artplayer<br>迁移全屏、PiP、mini 与尺寸模式 | CORE-11, CORE-12 | 显示模式服务和原公开属性门面 | 模式互斥/恢复位置、手势权限、移动方向和退出失败通过 | H | done |
| CORE-17 | artplayer<br>迁移键盘、手势、焦点和全局事件 | CORE-13, CORE-16 | events/hotkey 的明确 document 与资源归属 | 跨 document 重绑、触摸/键盘、快捷键及销毁无重复响应；修复 BASE-PERF-01 pending resize debounce 销毁后执行，并验证正常 resize 不变 | H | done |
| CORE-18 | artplayer<br>迁移内置插件和提示模块 | CORE-14, CORE-16, CORE-17 | autoPlayback/autoOrientation/fastForward/lock/miniProgressBar 及 info/notice/loading/mask | 默认启用条件、storage 格式、定时器/动画清理通过；结合 BASE-PERF-01 防止销毁后重新安排 notice timer；接续 BASE-TYPE-07 的 notice.show boolean getter 与历史读类型冲突 | M | done |
| CORE-19 | artplayer<br>整理进度、质量、缩略图和截图 | CORE-10, CORE-13, CORE-16 | 相关 player/control 功能与纯计算分离 | 截图跨域失败、缩略图布局、quality/进度边界保持 | M | done |
| CORE-20 | artplayer<br>收敛核心入口与依赖方向 | CORE-14, CORE-15, CORE-18, CORE-19 | Artplayer 门面、初始化依赖与最终目录 | 所有核心自有源码迁移，公开描述符/静态接口/事件差分通过 | H | done |
| CORE-21 | artplayer<br>生成核心声明并校验包内容 | CORE-20, ENG-07 | 由 TS 生成的既有入口声明与三种发布产物 | 内部类型不泄漏，旧 JS/TS 消费者与 i18n 通过；逐项完成 CORE-07 留下的 BASE-TYPE-04/05/07 声明方案，旧合法消费者与实际返回分别留证；不能以虚假的交叉返回类型或改变运行时来掩盖冲突，未决项阻止核心声明出口；处理 CORE-10 / BASE-TYPE-08 的 setter-only 属性虚构 getter 声明，并复核 PlaybackControls 精确视图与旧 toggle 声明共存策略 | H | done |
| CORE-23 | artplayer<br>检查并补齐键盘、焦点与可访问名称 | CORE-13, CORE-14, CORE-17, ENG-05, BASE-04 | 主要控件/设置/模式退出的键盘与焦点回归、名称和字幕可用性检查及必要兼容修正 | 保持旧快捷键和 DOM/CSS 钩子；真实浏览器验证，不以静态属性检查代替交互；处理 BASE-DOM-01 的主要控件 Tab 不可达，保留既有名称与快捷键 | H | done |
| CORE-22 | artplayer<br>核心阶段完整验收 | CORE-21, CORE-23, PILOT-01, ENG-08, ENG-10, ENG-11 | 核心与旧插件的可自动化完整回归、资源/性能及明确外部验证缺口 | 核心自动化和公开差异处置通过；真实环境缺口链接包集成/REL 门槛，阶段完成不代表可公开发布 | H | done |
| CORE-24 | artplayer<br>修复连续切源的播放意图继承 | CORE-22, PKG-AUDIO-04 | 连续切源保留原播放意图，同时尊重显式暂停与最新来源，回归旧/新 audio | 真实暂停状态的受控测试、重入/取消/失败/销毁、三引擎和 main/legacy 产物验证通过；不恢复过期来源的公开副作用 | H | done |

## 5 包迁移：artplayer-plugin-chapter

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-CHAPTER-01 | artplayer-plugin-chapter<br>核对包契约与历史用法 | BASE-05 | chapters 时间区间、update、name 和进度 DOM 清单 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | M | done |
| PKG-CHAPTER-02 | artplayer-plugin-chapter<br>建立特有行为与错误测试 | PKG-CHAPTER-01, ENG-03, ENG-05 | 区间重叠/空列表/边界 seek、hover 标题和 update 用例 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言；修正 BASE-TYPE-02 的可选参数声明并补正反例 | M | done |
| PKG-CHAPTER-03 | artplayer-plugin-chapter<br>以 TypeScript 拆分内部职责与资源 | PKG-CHAPTER-02, ENG-07 | 以严格 TS 拆分区间计算、进度 DOM、事件生命周期与样式注入；公开声明消费在 04 闭环 | 不依赖新核心方法或大范围设置重构；旧 API/事件和资源通过，必要适配限包内 | M | done |
| PKG-CHAPTER-04 | artplayer-plugin-chapter<br>迁移自有源码和公开类型 | PKG-CHAPTER-03, ENG-04, ENG-06 | 承接 03 的自有源码 TS 化，完善公开 Chapters/Option/Result 与 update 推导，关闭声明模块解析和旧消费差异 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容；处理 BASE-TYPE-01/03，保持运行时和新旧 TS 模块解析消费 | M | done |
| PKG-CHAPTER-05 | artplayer-plugin-chapter<br>验证新旧核心和组合 | PKG-CHAPTER-04, CORE-22 | chapter + quality/thumbnail、移动和全屏进度场景 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | M | doing |
| PKG-CHAPTER-06 | artplayer-plugin-chapter<br>验证分发并同步文档 | PKG-CHAPTER-05, ENG-07 | chapter.js 示例、产物和变更记录 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | M | todo |

## 5 包迁移：artplayer-plugin-ambilight

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-AMBILIGHT-01 | artplayer-plugin-ambilight<br>核对包契约与历史用法 | BASE-05 | blur/opacity/frequency/duration、start/stop 与挂载样式 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | M | done |
| PKG-AMBILIGHT-02 | artplayer-plugin-ambilight<br>建立特有行为与错误测试 | PKG-AMBILIGHT-01, ENG-03, ENG-05 | 跨域 canvas 失败、零尺寸、暂停、重复 start/stop 和 destroy | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | M | done |
| PKG-AMBILIGHT-03 | artplayer-plugin-ambilight<br>整理内部职责与资源 | PKG-AMBILIGHT-02, CORE-03, CORE-12 | 取色计算与绘帧分离，统一 RAF 和 DOM 清理 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | M | done |
| PKG-AMBILIGHT-04 | artplayer-plugin-ambilight<br>迁移自有源码和公开类型 | PKG-AMBILIGHT-03, ENG-04, ENG-06, CORE-07 | canvas 上下文、参数及 start/stop 的明确类型 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | M | done |
| PKG-AMBILIGHT-PROXY-01 | artplayer-plugin-ambilight, artplayer-proxy-canvas<br>修复Canvas代理输出尺寸与取色区域 | PKG-AMBILIGHT-04, CORE-22 | 按Canvas实际输出buffer取色，原生video保留intrinsic尺寸，明确5.1.7没有proxy配置 | 旧错误复现、三引擎实际代理九色区域对照及原生视频回归通过；不把本子项当作最终代理/设备验收 | M | done |
| PKG-AMBILIGHT-05 | artplayer-plugin-ambilight<br>验证新旧核心和组合 | PKG-AMBILIGHT-04, CORE-22, PKG-AMBILIGHT-PROXY-01, PKG-CANVAS-04, PKG-FACTORY-01 | 原生 video、canvas proxy 的能力边界及销毁无帧循环 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | M | todo |
| PKG-AMBILIGHT-06 | artplayer-plugin-ambilight<br>验证分发并同步文档 | PKG-AMBILIGHT-05, ENG-07 | ambilight.js 示例及样式/分发验证 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | M | todo |

## 5 包迁移：artplayer-plugin-audio-track

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-AUDIO-01 | artplayer-plugin-audio-track<br>核对包契约与历史用法 | BASE-05 | url/offset/sync、audio 实例暴露、update 与音量语义 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-AUDIO-02 | artplayer-plugin-audio-track<br>建立特有行为与错误测试 | PKG-AUDIO-01, ENG-03, ENG-05 | 偏移、倍率、seek、waiting/playing、加载错误和 autoplay 拒绝 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-AUDIO-03 | artplayer-plugin-audio-track<br>整理内部职责与资源 | PKG-AUDIO-02, CORE-10 | 外部 audio 的同步策略、监听与源更新生命周期 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-AUDIO-04 | artplayer-plugin-audio-track<br>迁移自有源码和公开类型 | PKG-AUDIO-03, ENG-04, ENG-06, CORE-07 | Option/Result/audio、update 输入和事件类型 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | done |
| PKG-AUDIO-05 | artplayer-plugin-audio-track<br>验证新旧核心和组合 | PKG-AUDIO-04, CORE-22, CORE-24 | 主视频切源和缓冲恢复，多实例独立音频、旧核心 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | doing |
| PKG-AUDIO-06 | artplayer-plugin-audio-track<br>验证分发并同步文档 | PKG-AUDIO-05, ENG-07 | audio.track.js 示例与运行返回值一致的声明 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-auto-thumbnail

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-AUTO-THUMB-01 | artplayer-plugin-auto-thumbnail<br>核对包契约与历史用法 | BASE-05 | url/width/number/scale、异步工厂和渐进缩略图更新 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-AUTO-THUMB-02 | artplayer-plugin-auto-thumbnail<br>建立特有行为与错误测试 | PKG-AUTO-THUMB-01, ENG-03, ENG-05 | 抽帧边界、短视频、失败、连续来源和销毁中的抽帧 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-AUTO-THUMB-03 | artplayer-plugin-auto-thumbnail<br>整理内部职责与资源 | PKG-AUTO-THUMB-02, CORE-09, CORE-19 | 隐藏 video、seek 队列、canvas 编码与 Blob URL 清理 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | doing |
| PKG-AUTO-THUMB-04 | artplayer-plugin-auto-thumbnail<br>迁移自有源码和公开类型 | PKG-AUTO-THUMB-03, ENG-04, ENG-06, CORE-07 | 抽帧结果和真实异步插件返回类型兼容 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | todo |
| PKG-AUTO-THUMB-05 | artplayer-plugin-auto-thumbnail<br>验证新旧核心和组合 | PKG-AUTO-THUMB-04, CORE-22 | 旧核心/候选核心预览、多次加载无过期缩略图覆盖 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-AUTO-THUMB-06 | artplayer-plugin-auto-thumbnail<br>验证分发并同步文档 | PKG-AUTO-THUMB-05, ENG-07 | auto.thumbnail.js、三种产物和内存/URL 证据 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-vtt-thumbnail

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-VTT-THUMB-01 | artplayer-plugin-vtt-thumbnail<br>核对包契约与历史用法 | BASE-05 | vtt/style、异步返回、预览控件名与样式契约 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | M | done |
| PKG-VTT-THUMB-02 | artplayer-plugin-vtt-thumbnail<br>建立特有行为与错误测试 | PKG-VTT-THUMB-01, ENG-03, ENG-05 | VTT 解析、xywh、相对 URL、时间边界、请求失败和定位 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | M | todo |
| PKG-VTT-THUMB-03 | artplayer-plugin-vtt-thumbnail<br>整理内部职责与资源 | PKG-VTT-THUMB-02, CORE-09, CORE-19 | 纯解析/区间查找与 DOM、请求/定时器生命周期分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | M | todo |
| PKG-VTT-THUMB-04 | artplayer-plugin-vtt-thumbnail<br>迁移自有源码和公开类型 | PKG-VTT-THUMB-03, ENG-04, ENG-06, CORE-07 | cue/rect/result 和参数可选性保持兼容 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | M | todo |
| PKG-VTT-THUMB-05 | artplayer-plugin-vtt-thumbnail<br>验证新旧核心和组合 | PKG-VTT-THUMB-04, CORE-22 | 鼠标和移动进度、全屏、切源、chapter 组合 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | M | todo |
| PKG-VTT-THUMB-06 | artplayer-plugin-vtt-thumbnail<br>验证分发并同步文档 | PKG-VTT-THUMB-05, ENG-07 | vtt.thumbnail.js、VTT/图片资源解析和产物验证 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | M | todo |

## 5 包迁移：artplayer-plugin-hls-control

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-HLS-01 | artplayer-plugin-hls-control<br>核对包契约与历史用法 | BASE-05 | quality/audio 配置、getName、update、控件名及 Hls 实例绑定 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-HLS-02 | artplayer-plugin-hls-control<br>建立特有行为与错误测试 | PKG-HLS-01, ENG-03, ENG-05 | Auto/手动实际 level、音轨、去重/过滤和拓扑变化 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-HLS-03 | artplayer-plugin-hls-control<br>整理内部职责与资源 | PKG-HLS-02, CORE-11, CORE-14 | 映射计算与 selector 更新/删除、Hls 事件订阅分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-HLS-04 | artplayer-plugin-hls-control<br>迁移自有源码和公开类型 | PKG-HLS-03, ENG-04, ENG-06, CORE-07 | HLS 能力适配类型、回调上下文和旧 getName 参数 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | done |
| PKG-HLS-SDK-01 | artplayer-plugin-hls-control<br>验证真实 SDK worker 与分组轨道组合 | PKG-HLS-04, CORE-22 | 固定历史及当前 SDK 归档、真实 worker/多音轨组、外部选择与重绑定浏览器证据 | 受支持桌面 MSE 引擎与新旧核心通过；无 worker 回退伪通过，设备缺口仍由 PKG-HLS-05 保持未完成 | H | doing |
| PKG-HLS-05 | artplayer-plugin-hls-control<br>验证新旧核心和组合 | PKG-HLS-04, CORE-22, PKG-HLS-SDK-01 | 本地多码率 HLS、换成无轨道来源、旧核心和最终核心 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-HLS-06 | artplayer-plugin-hls-control<br>验证分发并同步文档 | PKG-HLS-05, ENG-07 | hls.control.js、依赖范围与回退记录 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-dash-control

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-DASH-01 | artplayer-plugin-dash-control<br>核对包契约与历史用法 | BASE-05 | quality/audio、representation ID/Auto、getName 和 update | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-DASH-02 | artplayer-plugin-dash-control<br>建立特有行为与错误测试 | PKG-DASH-01, ENG-03, ENG-05 | 保留已有 5 项稳定 ID 回归，补发布版 SDK 4.x/当前 5.x、音轨/空列表/过滤/换源与关闭引用 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-DASH-03 | artplayer-plugin-dash-control<br>整理内部职责与资源 | PKG-DASH-02, CORE-11, CORE-14 | 能力适配保留 SDK 4.x 与 5.x，稳定 ID 映射、ABR 状态、UI 清理和生命周期职责分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-DASH-04 | artplayer-plugin-dash-control<br>迁移自有源码和公开类型 | PKG-DASH-03, ENG-04, ENG-06, CORE-07 | dash.js adapter、selector 和回调类型 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | done |
| PKG-DASH-05 | artplayer-plugin-dash-control<br>验证新旧核心和组合 | PKG-DASH-04, CORE-22 | 固定 dash.js 4.5.2/5.2.1 与本地 DASH 实际清晰度/音轨、高亮、Auto 和换源组合 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | doing |
| PKG-DASH-06 | artplayer-plugin-dash-control<br>验证分发并同步文档 | PKG-DASH-05, ENG-07 | dash.control.js、支持的 dash.js 版本与产物 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-multiple-subtitles

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-MULTI-SUB-01 | artplayer-plugin-multiple-subtitles<br>核对包契约与历史用法 | BASE-05 | subtitles/onParser、multipleSubtitles 名称及实际返回方法 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结；接续 VENDOR-03，定位 WebVTT parser 来源/修订及 CC0 头，保留解析/序列化行为 | H | todo |
| PKG-MULTI-SUB-02 | artplayer-plugin-multiple-subtitles<br>建立特有行为与错误测试 | PKG-MULTI-SUB-01, ENG-03, ENG-05 | VTT/SRT/ASS、编码/重叠 cue/排序/空轨/失败与切换 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | todo |
| PKG-MULTI-SUB-03 | artplayer-plugin-multiple-subtitles<br>整理内部职责与资源 | PKG-MULTI-SUB-02, CORE-15 | 解析与合并/获取/渲染分离，过期请求及对象 URL 清理 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | todo |
| PKG-MULTI-SUB-04 | artplayer-plugin-multiple-subtitles<br>迁移自有源码和公开类型 | PKG-MULTI-SUB-03, ENG-04, ENG-06, CORE-07 | 准确 parser/cue/tree/result 类型与真实异步形状 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | todo |
| PKG-MULTI-SUB-05 | artplayer-plugin-multiple-subtitles<br>验证新旧核心和组合 | PKG-MULTI-SUB-04, CORE-22 | 与核心字幕/偏移/全屏组合，旧名称调用不变 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-MULTI-SUB-06 | artplayer-plugin-multiple-subtitles<br>验证分发并同步文档 | PKG-MULTI-SUB-05, ENG-07 | multiple.subtitles.js、parser 来源许可及打包边界 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-jassub

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-JASSUB-01 | artplayer-plugin-jassub<br>核对包契约与历史用法 | BASE-05 | 选项透传、result.instance、vendor 来源、worker/WASM/font 路径 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结；接续 VENDOR-04/05，核对 wrapper/worker/WASM/font 的独立来源与通知，保持资源路径和选项透传 | H | todo |
| PKG-JASSUB-02 | artplayer-plugin-jassub<br>建立特有行为与错误测试 | PKG-JASSUB-01, ENG-03, ENG-05 | ASS 字体、时钟/seek/倍率/resize、加载失败和销毁 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | todo |
| PKG-JASSUB-03 | artplayer-plugin-jassub<br>整理内部职责与资源 | PKG-JASSUB-02, CORE-15, CORE-16 | 仅整理自有 adapter/销毁；保留第三方文件及来源 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | todo |
| PKG-JASSUB-04 | artplayer-plugin-jassub<br>迁移自有源码和公开类型 | PKG-JASSUB-03, ENG-04, ENG-06, CORE-07 | JASSUB option/instance 的兼容类型包装，vendor JS 例外记录 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | todo |
| PKG-JASSUB-05 | artplayer-plugin-jassub<br>验证新旧核心和组合 | PKG-JASSUB-04, CORE-22 | 真实 worker/WASM 字幕渲染与全屏、旧核心测试 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-JASSUB-06 | artplayer-plugin-jassub<br>验证分发并同步文档 | PKG-JASSUB-05, ENG-07 | jassub.js、外部资源路径、许可和离线失败记录 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-danmuku-mask

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-MASK-01 | artplayer-plugin-danmuku-mask<br>核对包契约与历史用法 | BASE-05 | 模型参数、start/stop、默认下载路径及 mask 样式 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结；接续 SDK-08，分别核实 Yarn 解析版本、未固定版本的模型 solutionPath 和资源来源 | H | todo |
| PKG-MASK-02 | artplayer-plugin-danmuku-mask<br>建立特有行为与错误测试 | PKG-MASK-01, ENG-03, ENG-05 | 加载期间停止/销毁、重复启动、推理失败、WebGL/CPU 边界 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | todo |
| PKG-MASK-03 | artplayer-plugin-danmuku-mask<br>整理内部职责与资源 | PKG-MASK-02, CORE-18, PKG-DANMUKU-07 | 模型加载/推理/画布输出分离，阻止重叠推理与过期写入 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | todo |
| PKG-MASK-04 | artplayer-plugin-danmuku-mask<br>迁移自有源码和公开类型 | PKG-MASK-03, ENG-04, ENG-06, CORE-07 | 模型 adapter、canvas 和选项的精确类型 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | todo |
| PKG-MASK-05 | artplayer-plugin-danmuku-mask<br>验证新旧核心和组合 | PKG-MASK-04, CORE-22 | 真实模型和 danmuku/seek/全屏组合，GPU 资源释放 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-MASK-06 | artplayer-plugin-danmuku-mask<br>验证分发并同步文档 | PKG-MASK-05, ENG-07 | danmuku.mask.js、资源版本/许可、CPU fallback 和包体积证据 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-asr

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-ASR-01 | artplayer-plugin-asr<br>核对包契约与历史用法 | BASE-05 | length/interval/sampleRate/onAudioChunk、append/hide/stop 的真实能力 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | todo |
| PKG-ASR-02 | artplayer-plugin-asr<br>建立特有行为与错误测试 | PKG-ASR-01, ENG-03, ENG-05 | PCM/WAV、chunk 时序、回调慢/拒绝、重复初始化与停止 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | todo |
| PKG-ASR-03 | artplayer-plugin-asr<br>整理内部职责与资源 | PKG-ASR-02, CORE-10, CORE-18 | AudioContext/Worklet/Stream 生命周期和背压分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | todo |
| PKG-ASR-04 | artplayer-plugin-asr<br>迁移自有源码和公开类型 | PKG-ASR-03, ENG-04, ENG-06, CORE-07 | 主线程/Worklet/音频 buffer 与异步回调类型 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | todo |
| PKG-ASR-05 | artplayer-plugin-asr<br>验证新旧核心和组合 | PKG-ASR-04, CORE-22 | 真实 WebAudio 分块、播放暂停/切源/销毁，不引入网络 ASR | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-ASR-06 | artplayer-plugin-asr<br>验证分发并同步文档 | PKG-ASR-05, ENG-07 | asr.js、Worklet 资源、输出格式与声明证据 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-ads

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-ADS-01 | artplayer-plugin-ads<br>核对包契约与历史用法 | BASE-05 | 核对 npm 1.0.0～1.0.6 与未发布工作区 2.1.0 的真实参数、类型、结果、倒计时、分发和旧核心来源 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-ADS-02 | artplayer-plugin-ads<br>建立特有行为与错误测试 | PKG-ADS-01, ENG-03, ENG-05 | 固定 npm 1.0.6 与工作区契约；HTML/视频/图片 HTML、跳过阈值、计时链、工厂复用、多实例、过早/重复方法、播放拒绝与销毁 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-ADS-03 | artplayer-plugin-ads<br>整理内部职责与资源 | PKG-ADS-02, CORE-10, CORE-13 | 配置/广告状态/计时/视图/主视频恢复分离，保留产品规则；资源与版本检查改用经验证的旧核心能力边界 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-ADS-04 | artplayer-plugin-ads<br>迁移自有源码和公开类型 | PKG-ADS-03, ENG-04, ENG-06, CORE-07 | 兼容真实 html/video/url/i18n、旧 export= 与工作区 source/type 类型接受面；时长 string/number 漂移与未实现别名单独处置 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | done |
| PKG-ADS-05 | artplayer-plugin-ads<br>验证新旧核心和组合 | PKG-ADS-04, CORE-22 | 本地广告 fixture、多实例、正常结束/跳过/销毁；核验历史关联核心 4.5.5、发布 5.4.1 与候选核心的实际归档/能力/媒体组合 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | doing |
| PKG-ADS-06 | artplayer-plugin-ads<br>验证分发并同步文档 | PKG-ADS-05, ENG-07 | ads.js/README/声明一致；旧 require(pkg).default、原 dist 路径、当前 callable/ESM/legacy 的隔离 tarball 及浏览器验收 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-vast

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-VAST-01 | artplayer-plugin-vast<br>核对包契约与历史用法 | BASE-05 | 异步工厂、callback context、playUrl/playRes/init 与 SDK 版本；实际 npm 1.0.0 与未发布 1.2.0、SDK 1.21.0/1.21.2 的60成员归档和发布关联核心5.1.7 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-VAST-02 | artplayer-plugin-vast<br>建立特有行为与错误测试 | PKG-VAST-01, ENG-03, ENG-05 | SDK 失败、重复初始化、广告事件、内容恢复和销毁竞态；发布 id/$container/eager 与工作区 lazy/config 覆盖、callback拒绝、加载中销毁、同毫秒多实例与晚到事件 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-VAST-03 | artplayer-plugin-vast<br>整理内部职责与资源 | PKG-VAST-02, CORE-10, CORE-13 | SDK loader、IMA adapter、广告状态和 DOM 清理分离；保持发布 callback 别名，明确初始化冲突；核心终止与显式 destroy 后重建区分 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | doing |
| PKG-VAST-04 | artplayer-plugin-vast<br>迁移自有源码和公开类型 | PKG-VAST-03, ENG-04, ENG-06, CORE-07 | IMA/context/Promise 真实类型，外部 SDK 动态对象限定边界；修复 @alugha/ima 声明依赖链，保留 export= 和 require.default 消费；同步错误声明的兼容决策单列 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | todo |
| PKG-VAST-05 | artplayer-plugin-vast<br>验证新旧核心和组合 | PKG-VAST-04, CORE-22 | 官方测试广告或受控 SDK 环境，错误后主视频状态恢复；核验真实5.1.7/5.4.1/候选核心，VAST VPN外部脚本例外逐项记录，不将受控SDK当作实际IMA验收 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-VAST-06 | artplayer-plugin-vast<br>验证分发并同步文档 | PKG-VAST-05, ENG-07 | vast.js、SDK 资源、声明消费和独立版本记录；核验实际发布 namespace default、历史深路径、ESM和准确声明，版本按政策2.0.0由REL-09统一处理 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-chromecast

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-CAST-01 | artplayer-plugin-chromecast<br>核对包契约与历史用法 | BASE-05 | url/sdk/icon/mimeType、loader、会话、全局 SDK 与结果 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | todo |
| PKG-CAST-02 | artplayer-plugin-chromecast<br>建立特有行为与错误测试 | PKG-CAST-01, ENG-03, ENG-05 | SDK 脚本加载失败/重入、无设备/拒绝、重复实例与销毁 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | todo |
| PKG-CAST-03 | artplayer-plugin-chromecast<br>整理内部职责与资源 | PKG-CAST-02, CORE-11, CORE-13 | SDK singleton/实例订阅/会话与控件职责分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | todo |
| PKG-CAST-04 | artplayer-plugin-chromecast<br>迁移自有源码和公开类型 | PKG-CAST-03, ENG-04, ENG-06, CORE-07 | Cast 能力 adapter、全局对象和元数据类型 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | todo |
| PKG-CAST-05 | artplayer-plugin-chromecast<br>验证新旧核心和组合 | PKG-CAST-04, CORE-22 | stub 测试之外记录实际 Cast 设备会话、源更新和断开 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-CAST-06 | artplayer-plugin-chromecast<br>验证分发并同步文档 | PKG-CAST-05, ENG-07 | chromecast.js、SDK URL/权限能力及待支持环境说明 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-document-pip

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-DPIP-01 | artplayer-plugin-document-pip<br>核对包契约与历史用法 | BASE-05 | width/height/placeholder/fallbackToVideoPiP、open/close/toggle 返回 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-DPIP-02 | artplayer-plugin-document-pip<br>建立特有行为与错误测试 | PKG-DPIP-01, ENG-03, ENG-05 | 不支持/拒绝、重复打开、pagehide、核心销毁和视频 PiP fallback | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-DPIP-03 | artplayer-plugin-document-pip<br>整理内部职责与资源 | PKG-DPIP-02, CORE-16, CORE-17 | 窗口生命周期、DOM 迁移、样式与事件 document 重绑分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-DPIP-04 | artplayer-plugin-document-pip<br>迁移自有源码和公开类型 | PKG-DPIP-03, ENG-04, ENG-06, CORE-07 | Document PiP 可选能力和真实状态/返回类型 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | done |
| PKG-DPIP-05 | artplayer-plugin-document-pip<br>验证新旧核心和组合 | PKG-DPIP-04, CORE-22, PKG-CANVAS-04, PKG-MB-04 | 原生视频及两个 proxy、键盘/焦点/全屏与关闭还原 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | doing |
| PKG-DPIP-06 | artplayer-plugin-document-pip<br>验证分发并同步文档 | PKG-DPIP-05, ENG-07 | document.pip.js、浏览器能力矩阵、旧接口与恢复证据 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-plugin-danmuku

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-DANMUKU-01 | artplayer-plugin-danmuku<br>核对弹幕全部公开契约 | BASE-05 | emit/load/config/hide/show/reset/mount、option/isHide/isStop/icons 与事件清单 | 源码、声明、发布包、Bilibili 输入和设置入口对照 | H | todo |
| PKG-DANMUKU-02 | artplayer-plugin-danmuku<br>建立弹幕算法与浏览器基线 | PKG-DANMUKU-01, ENG-05, ENG-08 | 密集/稀疏弹幕、过滤/异步输入、seek/倍率/重载测试 | 轨道选择、发射顺序、事件、内存和可视结果可重跑 | H | todo |
| PKG-DANMUKU-03 | artplayer-plugin-danmuku<br>整理加载、解析与配置 | PKG-DANMUKU-02, CORE-08 | bilibili/input/parser/config 的分层与取消 | 旧格式、回调、过滤、追加/替换语义保持 | M | todo |
| PKG-DANMUKU-04 | artplayer-plugin-danmuku<br>整理时钟、队列与轨道调度 | PKG-DANMUKU-03, CORE-10 | danmuku 调度器和确定性时钟测试 | seek/暂停/倍率/长时间运行无顺序和碰撞回归 | H | todo |
| PKG-DANMUKU-05 | artplayer-plugin-danmuku<br>整理 DOM 渲染、设置、热力图与 worker | PKG-DANMUKU-04, CORE-14, CORE-18 | renderer/setting/heatmap/worker 职责及资源归属 | mount/icons/设置和 worker 协议保持，销毁无后台工作 | H | todo |
| PKG-DANMUKU-06 | artplayer-plugin-danmuku<br>迁移 TS 与公开声明 | PKG-DANMUKU-05, ENG-04, ENG-06 | 自有模块、worker 消息、option/item/result 类型 | 旧参数、扩展字段和事件消费通过，vendored 边界清楚 | H | todo |
| PKG-DANMUKU-07 | artplayer-plugin-danmuku<br>弹幕能力稳定性验收 | PKG-DANMUKU-06 | 负载/渲染/资源对比及 mask 可依赖的稳定边界 | 在试点核心中旧插件 API 与关键帧路径通过 | H | todo |
| PKG-DANMUKU-08 | artplayer-plugin-danmuku<br>完成新旧核心与组合验收 | PKG-DANMUKU-07, CORE-22 | 最终核心/旧核心、mask/fullscreen/PiP 组合报告 | 性能无未解释退化，反复装卸无累计资源 | H | todo |
| PKG-DANMUKU-09 | artplayer-plugin-danmuku<br>完成分发、示例与文档 | PKG-DANMUKU-08, ENG-07 | danmuku.js、README、声明、worker 与产物 | tarball 和静态 icons 等旧调用通过，有独立回退版本 | H | todo |

## 5 包迁移：artplayer-proxy-canvas

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-CANVAS-01 | artplayer-proxy-canvas<br>核对包契约与历史用法 | BASE-05 | callback、canvas 原方法、转发 media 属性/方法/事件 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-CANVAS-02 | artplayer-proxy-canvas<br>建立特有行为与错误测试 | PKG-CANVAS-01, ENG-03, ENG-05 | ready/loadeddata/canplay、play/seek、回调、resize 与销毁 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-CANVAS-03 | artplayer-proxy-canvas<br>整理内部职责与资源 | PKG-CANVAS-02, CORE-06, CORE-11, CORE-16 | video adapter/原 canvas 方法/RAF 绘制/事件订阅分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-CANVAS-04 | artplayer-proxy-canvas<br>迁移自有源码和公开类型 | PKG-CANVAS-03, ENG-04, ENG-06, CORE-07 | canvas 与媒体能力的精确组合类型，保持 Result | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | done |
| PKG-CANVAS-05 | artplayer-proxy-canvas<br>验证新旧核心和组合 | PKG-CANVAS-04, CORE-22, PKG-DPIP-04, PKG-FACTORY-01 | 真实 video/canvas 绘制、字幕和 document PiP 恢复 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-CANVAS-06 | artplayer-proxy-canvas<br>验证分发并同步文档 | PKG-CANVAS-05, ENG-07 | canvas.js、三种产物、调用兼容与资源证据 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-proxy-mediabunny

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-MB-01 | artplayer-proxy-mediabunny<br>核对 shim 与媒体契约 | BASE-05 | 全部 option、art.mediabunny、canvas/shim 属性及事件表 | 公开暴露成员和实际发布依赖/资源范围明确；核实 third-party.json 所记录依赖 MPL-2.0 元数据与实际 bundle 的许可/通知范围，不从根 MIT 推断 | H | done |
| PKG-MB-02 | artplayer-proxy-mediabunny<br>建立真实媒体与事件基线 | PKG-MB-01, ENG-05, ENG-08 | MP4/WebM/HLS/Blob/Stream、seek/错误/轨道切换样本 | ready 事件顺序、音画同步、超时和释放可重跑 | H | done |
| PKG-MB-03 | artplayer-proxy-mediabunny<br>整理 input 与加载取消 | PKG-MB-02, CORE-09 | input.js 源检测、输入资源、Range 与取消 | HLS 检测在 input 边界，旧来源类型和超时保持 | H | done |
| PKG-MB-04 | artplayer-proxy-mediabunny<br>整理 VideoShim/EventTarget/Engine 协调 | PKG-MB-03, CORE-06, CORE-11 | shim 描述符、事件桥、加载状态和操作隔离 | 公开属性/同步异步返回与事件重入顺序保持 | H | done |
| PKG-MB-05 | artplayer-proxy-mediabunny<br>整理视频解码、seek 和帧释放 | PKG-MB-04 | VideoEngine 调度、队列、晚帧处理和资源释放 | 暂停/seek/切源无旧帧覆盖，默认丢帧策略不变 | H | done |
| PKG-MB-06 | artplayer-proxy-mediabunny<br>整理音频解码、时钟与同步 | PKG-MB-04 | AudioEngine 时钟、缓冲和 AudioContext 归属 | AV sync、倍速、无音轨、静音/音量和暂停恢复通过 | H | done |
| PKG-MB-07 | artplayer-proxy-mediabunny<br>整理 HLS 配对轨道与 selector | PKG-MB-05, PKG-MB-06, CORE-14 | m3u8 配对、质量/音频选择及拓扑清理 | 实际选择高亮、切到无轨道来源清理、无重复 readiness | H | done |
| PKG-MB-08 | artplayer-proxy-mediabunny<br>完成 TS 与媒体能力声明 | PKG-MB-07, ENG-04, ENG-06 | 8 个自有 JS 模块迁移与 Result/shim 类型 | 解码器/Stream/DOM 类型清楚，旧 Option 和 art.mediabunny 使用保持 | H | done |
| PKG-MB-09 | artplayer-proxy-mediabunny<br>完成新旧核心和真实媒体组合 | PKG-MB-08, CORE-22 | 跨浏览器能力、长播放、DPiP、HLS 音轨/质量报告 | 资源释放、事件顺序、AV sync 与支持范围满足基线 | H | doing |
| PKG-MB-10 | artplayer-proxy-mediabunny<br>完成分发和文档 | PKG-MB-09, ENG-07 | mediabunny.js、README、依赖版本、三产物和许可; 拆分media声明后的独立编辑器生成/辅助文件过滤与语义检查（IFRAME-04全量生成时暴露） | tarball 可消费、无意外依赖升级、旧调用与回退可用 | H | todo |

## 5 包迁移：artplayer-tool-iframe

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-IFRAME-01 | artplayer-tool-iframe<br>核对包契约与历史用法 | BASE-05 | constructor/commit/message/inject、postMessage 协议与历史公开拼写 | 源码/声明/README/demo/发布包差异已登记；公开形状和版本范围冻结 | H | done |
| PKG-IFRAME-02 | artplayer-tool-iframe<br>建立特有行为与错误测试 | PKG-IFRAME-01, ENG-03, ENG-05 | 跨窗口消息、ID 匹配、请求失败、重复 inject、销毁中请求 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-IFRAME-03 | artplayer-tool-iframe<br>整理内部职责与资源 | PKG-IFRAME-02, CORE-02, BASE-07 | 请求注册/响应匹配/监听清理分离；origin/source 安全边界独立决策 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-IFRAME-04 | artplayer-tool-iframe<br>迁移自有源码和公开类型 | PKG-IFRAME-03, ENG-04, ENG-06, CORE-07 | 消息联合类型、回调/Promise 推导、旧公开字段兼容；旧npm export=与实际namespace、额外helper协议分别核验 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容 | H | done |
| PKG-IFRAME-05 | artplayer-tool-iframe<br>验证新旧核心和组合 | PKG-IFRAME-04, CORE-22 | 真实同源/跨源 iframe、既有 commit 协议；安全变化有独立结论；新旧核心/demo、实际 BFCache/设备和外部中断导航验收，旧端无文档标记的限制明确 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | doing |
| PKG-IFRAME-06 | artplayer-tool-iframe<br>验证分发并同步文档 | PKG-IFRAME-05, ENG-07 | iframe.js、示例集成和原 script/class 导出验证；旧包名/额外helper深入口与新工具名的迁移结论; 保留旧npm Function回调及namespace/helper与工具类的区别，核验实际编译后消费而非仅声明通过 | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 5 包迁移：artplayer-tool-thumbnail

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-TOOL-THUMB-01 | artplayer-tool-thumbnail<br>核对包契约与历史用法 | BASE-05 | 构造/defaults/事件/方法/历史拼写、.esm.js 入口和缺失 types | 源码/声明/README/demo/可恢复发布内容差异已登记；公开形状和版本范围冻结；区分旧 npm 的 main/CSS 与当前工作区无 main、.esm.js/类型缺失，不把工作区状态冒称旧 npm 发布事实 | H | done |
| PKG-TOOL-THUMB-02 | artplayer-tool-thumbnail<br>建立特有行为与错误测试 | PKG-TOOL-THUMB-01, ENG-03, ENG-05 | 文件输入/拖放、抽帧网格、begin/end、进度/失败/重复任务 | 旧版本行为可重跑，成功/失败/切源/销毁有必要断言 | H | done |
| PKG-TOOL-THUMB-03 | artplayer-tool-thumbnail<br>整理内部职责与资源 | PKG-TOOL-THUMB-02, CORE-01 | 输入、抽帧队列、网格导出、URL/监听清理分离 | 结构变化和缺陷修复分开记录；原 API/事件/资源生命周期通过 | H | done |
| PKG-TOOL-THUMB-04 | artplayer-tool-thumbnail<br>迁移自有源码和公开类型 | PKG-TOOL-THUMB-03, ENG-04, ENG-06, CORE-07 | 补齐真实 API 声明，自有 emitter/utils TS 化 | 严格类型检查、旧消费样例通过；声明路径/导出和同步异步兼容；为 BASE-DIST-01 提供兼容入口/声明及消费者验证 | H | doing |
| PKG-TOOL-THUMB-05 | artplayer-tool-thumbnail<br>验证新旧核心和组合 | PKG-TOOL-THUMB-04, CORE-22 | 工具独立浏览器使用，生成缩略图在核心中显示 | 最终核心与原支持范围核心分别通过；设备/SDK 缺证据不能标完成 | H | todo |
| PKG-TOOL-THUMB-06 | artplayer-tool-thumbnail<br>验证分发并同步文档 | PKG-TOOL-THUMB-05, ENG-07 | tool.thumbnail.js、历史 ESM 兼容文件、types 路径和 tarball | tarball 入口/资源、类型、8082 demo 和 README 一致，有回退记录 | H | todo |

## 6 文档与消费者

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| SITE-01 | artplayer-vitepress<br>清点文档/示例/生成链 | BASE-04, BASE-05 | 中英文文档、插件页面、demo URL、编辑器声明与生成目录清单；六类 HTML 入口、prod/libs/code/example 加载行为及移动重定向 | 所有公开 API/插件有对应页面或明确补充任务；核实 BASE-DEMO-01 的历史 thumbnail 插件来源及 29 示例/36 HTML 路径；明确 BASE-05 所记录站点实际分发与未设 private 的 manifest 意图；接续 VENDOR-05/06/07/08 和 BASE-SITE-01/BASE-MEDIA-01，核对字体、Monaco、vConsole、console bundle 与样本来源及分发范围 | M | todo |
| SITE-02 | artplayer-vitepress<br>整理声明与示例生成器 | SITE-01, ENG-04, ENG-06 | build-ts/build-test 生成链的可验证 TS 脚本 | 不靠字符串拼接掩盖声明错误，生成示例有真实断言或仅标 smoke；替换固定 100ms 成功判定，明确异步错误、清理和生成覆盖限制 | M | todo |
| SITE-03 | artplayer-vitepress<br>整理 i18n/文档/LLM 生成流程 | SITE-02 | build-i18n/build-docs/build-llm/trans-docs 的任务边界和错误处理 | 原命令兼容、生成可复现，翻译步骤不隐式运行远程服务 | M | todo |
| SITE-04 | artplayer-vitepress<br>交叉核对逐包持续维护的文档 | CORE-21, SITE-03, PKG-CHAPTER-04, PKG-AMBILIGHT-04, PKG-AUDIO-04, PKG-AUTO-THUMB-04, PKG-VTT-THUMB-04, PKG-HLS-04, PKG-DASH-04, PKG-MULTI-SUB-04, PKG-JASSUB-04, PKG-MASK-04, PKG-ASR-04, PKG-ADS-04, PKG-VAST-04, PKG-CAST-04, PKG-DPIP-04, PKG-CANVAS-04, PKG-IFRAME-04, PKG-TOOL-THUMB-04, PKG-DANMUKU-06, PKG-MB-08 | 已随实现更新的中文/英文 API、包内实现地图、旧 JS 示例及已知能力限制的全包核对 | 未把缺环境的能力写成已验证，静态核对不等待设备任务；最终 demo 仍由 EX-03 验收 | M | todo |
| SITE-05 | artplayer-vitepress<br>构建文档站和验证链接/示例 | SITE-04, EX-01, EX-02 | VitePress 构建、链接与嵌入 demo 检查 | 文档构建、链接、嵌入路径与声明注入通过；真实完整 demo 保留 EX-03 独立门槛；核对 ENG-PM-01 登记的搜索 peer 范围和真实搜索行为 | M | todo |
| SITE-06 | artplayer-vitepress<br>文档站交付验收 | SITE-05 | 维护指南和站点变更记录 | 未手改 generated 目录，旧 URL 可用、部署与检查分离 | M | todo |
| EX-01 | example/react.js<br>验证 React 消费者与 TS | CORE-22, ENG-07 | React 挂载/卸载/重挂载、引用和插件样例 | 真实 tarball + TS 消费通过，保留既有 React 集成 API | M | todo |
| EX-02 | example/vue.js<br>验证 Vue 消费者与更新卸载 | CORE-22, ENG-07 | Vue 实例/ref、参数更新、卸载及插件样例 | 旧 JS 组件用法无需修改，重复挂载不泄漏 | M | todo |
| EX-03 | workspace<br>验证全部原生 demo 与外部播放集成 | EX-01, EX-02, PKG-CHAPTER-06, PKG-AMBILIGHT-06, PKG-AUDIO-06, PKG-AUTO-THUMB-06, PKG-VTT-THUMB-06, PKG-HLS-06, PKG-DASH-06, PKG-MULTI-SUB-06, PKG-JASSUB-06, PKG-MASK-06, PKG-ASR-06, PKG-ADS-06, PKG-VAST-06, PKG-CAST-06, PKG-DPIP-06, PKG-DANMUKU-09, PKG-CANVAS-06, PKG-MB-10, PKG-IFRAME-06, PKG-TOOL-THUMB-06 | 8082 全 demo、HLS/DASH/FLV/MPEGTS/WebTorrent 集成记录 | 旧 URL/参数/脚本加载保持；网络/SDK 限制明确，不静默跳过；覆盖编辑器重复 Run 和 ESM/i18n/mobile/iframe，记录实际候选脚本及状态隔离证据；依据 BASE-04 路径台账逐项消除 not-run，处理 BASE-DEMO-01 | H | todo |

## 7 工具链与性能

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| MOD-01 | workspace<br>Bun 固定版本干净安装试点 | ENG-09 | 独立目录的 Bun 安装与 Yarn 冻结基线对比，默认仍为用户选定的 Yarn | Node 测试仍通过；安装与资源一致才决定采用；不改 bundler；不自动替换默认 packageManager 或维护锁文件 | H | todo |
| MOD-02 | workspace<br>整理剩余开发/构建脚本与插件模板 | ENG-06, SITE-03 | dev/build/utils/create-plugin 的 TS 与可测 CLI，模板同时提供旧 API | 旧脚本入口保留、新插件类型/测试/示例齐全，Lerna 改动单独取证 | M | todo |
| MOD-03 | workspace<br>测量并优化核心热路径 | CORE-22, ENG-08 | DOM 读写、进度更新、持久化、初始化的测量与改进 | 相同设备媒体多次比较，契约不变，收益及无效尝试记录；复用 BASE-06 的原始样本与测量限制，至少三组同环境旧新配对，不以单次变快宣称收益 | M | todo |
| MOD-04 | workspace<br>测量并优化重型插件/proxy | PKG-DANMUKU-09, PKG-MASK-06, PKG-MB-10, ENG-08 | 帧/队列/推理/音画同步与资源长期运行比较 | 不改默认算法/阈值，性能改善有证据；无收益则保留旧实现 | M | todo |
| MOD-05 | workspace<br>完成工具链与性能采用决策 | MOD-01, MOD-02, MOD-03, MOD-04 | 最终 runtime/packageManager/构建配置及性能台账 | 干净安装和全包检查通过；Bun 未采用有理由，不为状态强行切换 | M | todo |

## 8 发布验收

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| REL-08 | workspace<br>提前建立逐包发布准入台账 | BASE-08, ENG-07 | 每批包/版本/源码/锁文件/工具/tarball integrity、必需测试/设备证据、限制和回退映射 | 受影响能力缺证据明确阻止对应批次；无关批次可独立准备，旧证据在候选内容变化后失效；站点采用真实构建/URL/资源验收，npm 分发依据历史核实，不从版本清单推断新增发布范围；关联 risks.json 和 third-party.json；受影响 bundle/worker/WASM/font/模型的来源与许可通知缺口必须有审查结论，未决项阻止对应批次 | H | todo |
| REL-01 | workspace<br>提前确定分包版本与差异方案 | REL-08, CORE-21, SITE-03, PKG-CHAPTER-04, PKG-AMBILIGHT-04, PKG-AUDIO-04, PKG-AUTO-THUMB-04, PKG-VTT-THUMB-04, PKG-HLS-04, PKG-DASH-04, PKG-MULTI-SUB-04, PKG-JASSUB-04, PKG-MASK-04, PKG-ASR-04, PKG-ADS-04, PKG-VAST-04, PKG-CAST-04, PKG-DPIP-04, PKG-CANVAS-04, PKG-IFRAME-04, PKG-TOOL-THUMB-04, PKG-DANMUKU-06, PKG-MB-08, PKG-FACTORY-01 | 每包版本/变更日志/依赖/类型差异方案和独立准入状态；按 version-policy.md 冻结各包下一 major（minor/patch 归零）并核实 registry 占用 | 所有包有方案和剩余门槛，未决项明确阻止相应发布；本步骤不声称已经可发布；全部包有 major 目标，版本冲突明确处理，独立准备任务同步 manifest/锁/依赖/日志；按 BASE-05 区分 21 库与文档站分发，不机械把文档站当库上传 npm | H | todo |
| REL-09 | workspace<br>落实全包下一 major 版本及依赖元数据 | REL-01, DOC-11 | 22 包版本目标落实、适用锁文件/依赖范围/示例/变更日志同步，核实 registry 版本占用 | 版本与 policy 一致，旧核心支持保留；必要拆子任务各自提交，候选构建前完成，不执行 publish | H | todo |
| REL-02 | workspace<br>生成候选 tarball 并验证新旧组合 | REL-01, CORE-22, ENG-07, REL-09 | 各候选本地 tarball/integrity 与新旧核心/插件消费者验证报告，外部门槛单独标注 | 隔离安装和可自动化组合通过；设备结论不伪造，最终发布绑定同一候选内容；在目标 major 版本确定后构建 pack，不在测试后改版本 | H | todo |
| REL-03 | workspace<br>完成真机、外部 SDK 与压力验收 | REL-02, EX-03, SITE-06, MOD-05 | Safari/移动/PiP/Cast/IMA/模型/长播放完整报告 | 包集成与全项目真机/SDK/压力结论齐全才完成本汇总；独立批次先建立自己的完整门槛子任务 | H | todo |
| REL-04 | workspace<br>提前演练回退与主线修复同步 | REL-08, ENG-07 | 分包旧版本/tag/依赖回退方案与 master 差异 | 隔离包演练可回退，主线修复同步流程可执行；正式每批再核对其实际回退产物 | H | todo |
| REL-05 | workspace<br>经授权发布候选并收集反馈 | REL-03, REL-04, REVIEW-03 | 候选 tag、完整产物 integrity、反馈与复现记录 | 实际发布授权/操作/版本可追溯；本计划不自动执行发布 | H | todo |
| REL-06 | workspace<br>经授权分批正式发布 | REL-05 | 正式分包版本/tag/站点文档及兼容公告 | 候选验收通过，安装/浏览器复核和回退入口就绪；候选反馈修复须独立建任务并复验三轮受影响结论，正式内容与最终验证产物一致 | H | todo |
| REL-07 | workspace<br>关闭重构里程碑并维护后续队列 | REL-06 | 最终任务/设计/证据归档和维护指南 | 全范围任务有结论、无未解释兼容缺口；遗留项有明确后续责任 | L | todo |

## 8.1 多轮复盘

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| REVIEW-01 | workspace<br>第一轮全项目架构与兼容性复盘 | REL-02, CORE-22, SITE-04, DOC-08, MOD-01, MOD-02, MOD-03 | 22 包结构、类型、旧 API/路径、测试盲区和维护文档的逐包报告 | 本轮阻断项由独立修复任务关闭并复测；环境缺口转交下一轮，不宣称已发布就绪 | H | todo |
| REVIEW-02 | workspace<br>第二轮真实浏览器与生态集成复盘 | REVIEW-01, REL-03 | Chrome 交互、自动浏览器、新旧组合、真机/SDK/性能/资源的全范围报告 | 所需环境证据齐全，前轮修复再次核对；本轮阻断项关闭，无关 mock 不替代真实验收 | H | todo |
| REVIEW-03 | workspace<br>第三轮 npm 候选内容与发布准备复盘 | REVIEW-02, REL-04, CI-04 | 实际候选 integrity、干净安装构建/消费者、入口/许可/版本/tag/回退及前轮证据汇总 | 最终候选完整检查通过，发布阻断项为零；准备可审阅的批次报告，不自动执行 publish；逐包核对 major 目标，不能用大版本豁免旧 API 兼容 | H | todo |

## 5 工厂类型兼容补审

| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-FACTORY-01 | artplayer-proxy-canvas, artplayer-plugin-ambilight<br>修复已迁移工厂的反向赋值兼容 | PKG-CANVAS-04, PKG-AMBILIGHT-04, PKG-DPIP-04 | 复现两包旧typeof工厂替换与新.default/可选重载冲突，修复公开类型并补安装消费者、产物和文档 | 默认工厂的历史合法反向赋值继续通过；既有类型/运行时导出逐版本核对，不能只验证Parameters或直接调用 | H | doing |

## 完成证据与阻塞

- DOC-01: [记录](progress.md)
- DOC-02: [记录](progress.md)
- DOC-03: [记录](progress.md)
- DOC-04: [记录](progress.md)
- DOC-05: [记录](changes/2026-09-10-DOC-05-task-commits.md)
- DOC-06: [记录](changes/2026-09-10-DOC-06-dependencies-and-scripts.md)
- DOC-07: [记录](changes/2026-09-10-DOC-07-plan-review.md)
- DOC-08: [记录](changes/2026-09-10-DOC-08-browser-and-release-reviews.md)
- DOC-09: [记录](changes/2026-09-10-DOC-09-docs-test-surfaces.md)
- DOC-10: [记录](changes/2026-09-10-DOC-10-github-ci-cd.md)
- DOC-11: [记录](changes/2026-09-10-DOC-11-major-version-policy.md)
- DOC-12: [记录](changes/2026-09-10-DOC-12-execution-readiness-review.md)
- DOC-13: [记录](changes/2026-09-10-DOC-13-browser-fallback.md)
- BASE-01: [记录](changes/2026-09-10-BASE-01-published-baseline.md) [记录](baselines/releases.json)
- BASE-HARNESS-01: [记录](changes/2026-09-10-BASE-HARNESS-01-browser-fixture.md)
- BASE-02: [记录](changes/2026-09-10-BASE-02-public-api.md) [记录](baselines/public-api.json) [记录](baselines/api-coverage.md)
- BASE-03: [记录](changes/2026-09-10-BASE-03-lifecycle.md) [记录](baselines/lifecycle.json) [记录](baselines/lifecycle-coverage.md)
- BASE-04: [记录](changes/2026-09-10-BASE-04-dom.md) [记录](baselines/dom.json) [记录](baselines/dom-coverage.md) [记录](baselines/demo-inventory.json)
- BASE-05: [记录](changes/2026-09-10-BASE-05-consumers.md) [记录](baselines/consumer-coverage.md) [记录](baselines/consumers.json) [记录](baselines/ssr.json) [记录](baselines/distribution.json)
- BASE-06: [记录](changes/2026-09-10-BASE-06-performance.md) [记录](baselines/performance-coverage.md) [记录](baselines/performance.json) [记录](baselines/sizes.json)
- BASE-07: [记录](changes/2026-09-10-BASE-07-risk-register.md) [记录](risk-guide.md) [记录](risk-table.md) [记录](risks.json) [记录](third-party.json)
- BASE-08: [记录](environment-matrix.md) [记录](changes/2026-09-10-BASE-08-environment-matrix.md)
- ENG-01: [记录](changes/2026-09-10-ENG-01-reproducible-toolchain.md) [记录](baselines/toolchain-validation.json)
- ENG-PM-01: [记录](changes/2026-09-10-ENG-PM-01-yarn-toolchain.md) [记录](baselines/yarn-validation.json)
- ENG-02: [记录](changes/2026-09-10-ENG-02-readonly-ci.md) [记录](baselines/ci-validation.json)
- ENG-03: [记录](changes/2026-09-10-ENG-03-unit-entry.md)
- ENG-04: [记录](changes/2026-09-10-ENG-04-typechecking.md) [记录](typechecking.md)
- ENG-05: [记录](changes/2026-09-10-ENG-05-browser-tests.md) [记录](baselines/browser-validation.json)
- ENG-06: [记录](changes/2026-09-10-ENG-06-build-development.md) [记录](build-development.md) [记录](baselines/build-validation.json)
- ENG-07: [记录](changes/2026-09-10-ENG-07-package-consumers.md) [记录](baselines/package-validation.json)
- ENG-08: [记录](coverage-performance.md) [记录](baselines/quality-validation.json) [记录](changes/2026-09-11-ENG-08-quality-reports.md)
- ENG-AUDIT-01: [记录](commit-audit.md) [记录](changes/2026-09-12-ENG-AUDIT-01-commits.md) [记录](baselines/commit-audit-validation.json)
- ENG-IMPACT-01: [记录](impact-analysis.md) [记录](changes/2026-09-12-ENG-IMPACT-01-mapping.md) [记录](baselines/impact-validation.json)
- ENG-COVERAGE-01: [记录](contract-coverage.md) [记录](contract-index.md) [记录](changes/2026-09-12-ENG-COVERAGE-01-index.md) [记录](baselines/contracts-validation.json)
- ENG-09: [记录](changes/2026-09-12-ENG-09-integration.md) [记录](baselines/engineering-integration.json)
- ENG-10: [记录](changes/2026-09-10-ENG-10-test-reliability.md) [记录](test-reliability.md)
- ENG-11: [记录](build-analysis.md) [记录](baselines/bundle-attribution.json) [记录](changes/2026-09-11-ENG-11-build-analysis.md)
- PILOT-01: [记录](changes/2026-09-10-PILOT-01-chapter.md) [记录](baselines/pilot-validation.json)
- CORE-01: [记录](changes/2026-09-10-CORE-01-typed-utils.md) [记录](baselines/core-utils-validation.json)
- CORE-02: [记录](changes/2026-09-11-CORE-02-typed-emitter.md) [记录](baselines/emitter-validation.json)
- CORE-03: [记录](changes/2026-09-11-CORE-03-resource-scope.md) [记录](baselines/resource-scope-validation.json)
- CORE-04: [记录](changes/2026-09-11-CORE-04-instance-lifecycle.md) [记录](baselines/instance-lifecycle-validation.json)
- CORE-05: [记录](changes/2026-09-11-CORE-05-resolved-options.md) [记录](baselines/options-validation.json)
- CORE-06: [记录](changes/2026-09-11-CORE-06-media-hosts.md) [记录](baselines/media-hosts-validation.json)
- CORE-07: [记录](changes/2026-09-11-CORE-07-declarations.md) [记录](baselines/declarations-validation.json)
- CORE-08: [记录](changes/2026-09-11-CORE-08-plugin-manager.md) [记录](baselines/plugins-validation.json)
- CORE-09: [记录](changes/2026-09-11-CORE-09-source-operations.md) [记录](baselines/source-operations-validation.json)
- CORE-10: [记录](changes/2026-09-11-CORE-10-playback-properties.md) [记录](baselines/playback-properties-validation.json)
- CORE-11: [记录](changes/2026-09-11-CORE-11-media-events.md) [记录](baselines/media-events-validation.json)
- CORE-12: [记录](changes/2026-09-11-CORE-12-template-resources.md) [记录](baselines/template-resources-validation.json)
- CORE-13: [记录](changes/2026-09-11-CORE-13-components.md) [记录](baselines/components-validation.json)
- CORE-14: [记录](changes/2026-09-11-CORE-14-setting.md) [记录](baselines/setting-validation.json)
- CORE-15: [记录](changes/2026-09-11-CORE-15-subtitle.md) [记录](baselines/subtitle-validation.json)
- CORE-16: [记录](changes/2026-09-11-CORE-16-display.md) [记录](baselines/display-validation.json)
- CORE-17: [记录](changes/2026-09-11-CORE-17-input.md) [记录](baselines/input-validation.json)
- CORE-18: [记录](changes/2026-09-11-CORE-18-builtins-prompts.md) [记录](baselines/builtins-prompts-validation.json)
- CORE-19: [记录](changes/2026-09-11-CORE-19-capture-thumbnails.md) [记录](baselines/capture-progress-validation.json)
- CORE-20: [记录](changes/2026-09-11-CORE-20-entry.md) [记录](baselines/entry-validation.json)
- CORE-21: [记录](changes/2026-09-11-CORE-21-public-declarations.md) [记录](baselines/core-declarations-validation.json) [记录](core-public-types.md) [记录](typechecking.md)
- CORE-23: [记录](changes/2026-09-11-CORE-23-keyboard-focus.md) [记录](baselines/keyboard-validation.json)
- CORE-22: [记录](changes/2026-09-11-CORE-22-core-acceptance.md) [记录](baselines/core-setting-navigation-partial.json) [记录](core-acceptance.md) [记录](baselines/core-acceptance-validation.json)
- CORE-24: [记录](baselines/audio-combinations-first.json) [记录](changes/2026-09-12-CORE-24-source-intent.md) [记录](baselines/core-source-intent-validation.json)
- PKG-CHAPTER-01: [记录](changes/2026-09-10-PKG-CHAPTER-01-contract.md) [记录](baselines/chapter-contract.md)
- PKG-CHAPTER-02: [记录](changes/2026-09-10-PKG-CHAPTER-02-tests.md) [记录](baselines/chapter-validation.json)
- PKG-CHAPTER-03: [记录](changes/2026-09-10-PKG-CHAPTER-03-typescript-modules.md) [记录](baselines/chapter-migration-validation.json)
- PKG-CHAPTER-04: [记录](changes/2026-09-10-PKG-CHAPTER-04-public-types.md) [记录](baselines/chapter-types-validation.json)
- PKG-CHAPTER-05: [记录](changes/2026-09-12-PKG-CHAPTER-05-combinations.md) [记录](baselines/chapter-combinations-checkpoint.json)
- PKG-AMBILIGHT-01: [记录](changes/2026-09-12-PKG-AMBILIGHT-01-contract.md) [记录](baselines/ambilight-contract.md) [记录](baselines/ambilight-release.json) [记录](baselines/ambilight-contract-validation.json)
- PKG-AMBILIGHT-02: [记录](changes/2026-09-12-PKG-AMBILIGHT-02-tests.md) [记录](baselines/ambilight-behavior-validation.json) [记录](ambilight-validation.md)
- PKG-AMBILIGHT-03: [记录](changes/2026-09-12-PKG-AMBILIGHT-03-lifecycle.md) [记录](ambilight-validation.md) [记录](baselines/ambilight-lifecycle-validation.json)
- PKG-AMBILIGHT-04: [记录](changes/2026-09-12-PKG-AMBILIGHT-04-types.md) [记录](ambilight-validation.md) [记录](baselines/ambilight-types-validation.json)
- PKG-AMBILIGHT-PROXY-01: [记录](changes/2026-09-12-PKG-AMBILIGHT-PROXY-01-sampling.md) [记录](ambilight-validation.md) [记录](baselines/ambilight-proxy-validation.json)
- PKG-AMBILIGHT-05: [记录](changes/2026-09-12-PKG-AMBILIGHT-PROXY-01-sampling.md) [记录](ambilight-validation.md)
- PKG-AUDIO-01: [记录](changes/2026-09-12-PKG-AUDIO-01-contract.md) [记录](baselines/audio-track-contract.md) [记录](baselines/audio-track-release.json)
- PKG-AUDIO-02: [记录](changes/2026-09-12-PKG-AUDIO-02-tests.md) [记录](audio-validation.md) [记录](baselines/audio-validation.json)
- PKG-AUDIO-03: [记录](changes/2026-09-12-PKG-AUDIO-03-lifecycle.md) [记录](baselines/audio-lifecycle-validation.json)
- PKG-AUDIO-04: [记录](changes/2026-09-12-PKG-AUDIO-04-types.md) [记录](baselines/audio-types-validation.json)
- PKG-AUDIO-05: [记录](changes/2026-09-12-PKG-AUDIO-05-combinations.md) [记录](baselines/audio-combinations-first.json) [记录](baselines/audio-combinations-checkpoint.json) [记录](audio-validation.md)
- PKG-AUTO-THUMB-01: [记录](baselines/auto-thumbnail-release.json) [记录](baselines/auto-thumbnail-contract.md) [记录](changes/2026-09-13-PKG-AUTO-THUMB-01-contract.md) [记录](baselines/auto-thumbnail-contract-validation.json)
- PKG-AUTO-THUMB-02: [记录](baselines/auto-thumbnail-failures.md) [记录](baselines/auto-thumbnail-failures-validation.json) [记录](changes/2026-09-13-PKG-AUTO-THUMB-02-failures.md)
- PKG-AUTO-THUMB-03: [记录](changes/2026-09-13-PKG-AUTO-THUMB-03-lifecycle-checkpoint.md) [记录](baselines/auto-thumbnail-lifecycle-checkpoint.json) [记录](changes/2026-09-13-PKG-AUTO-THUMB-03-hidden-renderer.md) [记录](baselines/auto-thumbnail-hidden-renderer.json) [记录](baselines/auto-thumbnail-timeline-media.json) [记录](changes/2026-09-13-PKG-AUTO-THUMB-03-frame-presentation.md) [记录](baselines/auto-thumbnail-frame-presentation.json)
- PKG-VTT-THUMB-01: [记录](baselines/vtt-thumbnail-release.json) [记录](baselines/vtt-thumbnail-contract.md) [记录](changes/2026-09-13-PKG-VTT-THUMB-01-contract.md)
- PKG-HLS-01: [记录](baselines/hls-control-contract.md) [记录](baselines/hls-control-release.json) [记录](changes/2026-09-11-PKG-HLS-01-contract.md)
- PKG-HLS-02: [记录](hls-validation.md) [记录](baselines/hls-sdk.json) [记录](baselines/hls-validation.json) [记录](changes/2026-09-11-PKG-HLS-02-tests.md)
- PKG-HLS-03: [记录](changes/2026-09-12-PKG-HLS-03-modules.md) [记录](baselines/hls-modules-validation.json) [记录](hls-validation.md)
- PKG-HLS-04: [记录](changes/2026-09-12-PKG-HLS-04-types.md) [记录](baselines/hls-types-validation.json) [记录](hls-validation.md)
- PKG-HLS-SDK-01: [记录](changes/2026-09-12-PKG-HLS-SDK-01-integration.md) [记录](baselines/hls-sdk-validation.json) [记录](baselines/hls-sdk-diagnostics.json)
- PKG-DASH-01: [记录](changes/2026-09-12-PKG-DASH-01-contract.md) [记录](baselines/dash-control-contract.md) [记录](baselines/dash-control-release.json)
- PKG-DASH-02: [记录](changes/2026-09-12-PKG-DASH-02-tests.md) [记录](dash-validation.md) [记录](baselines/dash-validation.json)
- PKG-DASH-03: [记录](changes/2026-09-12-PKG-DASH-03-runtime.md) [记录](baselines/dash-runtime.json) [记录](dash-validation.md)
- PKG-DASH-04: [记录](changes/2026-09-12-PKG-DASH-04-types.md) [记录](baselines/dash-types-validation.json) [记录](dash-validation.md)
- PKG-DASH-05: [记录](changes/2026-09-12-PKG-DASH-05-sdk-checkpoint.md) [记录](baselines/dash-sdk.json) [记录](baselines/dash-sdk-checkpoint.json) [记录](dash-validation.md) [记录](changes/2026-09-12-PKG-DASH-05-sdk-types.md) [记录](baselines/dash-sdk-types-validation.json) [记录](changes/2026-09-12-PKG-DASH-05-sdk-events.md) [记录](baselines/dash-sdk-events-validation.json) [记录](changes/2026-09-12-PKG-DASH-05-seek-diagnosis.md) [记录](baselines/dash-seek-diagnosis.json)
- PKG-ADS-01: [记录](baselines/ads-release.json) [记录](baselines/ads-contract.md) [记录](baselines/ads-contract-validation.json) [记录](changes/2026-09-12-PKG-ADS-01-contract.md) [记录](scripts/ads-contract.test.mjs)
- PKG-ADS-02: [记录](changes/2026-09-12-PKG-ADS-02-tests.md) [记录](ads-validation.md) [记录](baselines/ads-validation.json)
- PKG-ADS-03: [记录](changes/2026-09-12-PKG-ADS-03-lifecycle.md) [记录](ads-validation.md) [记录](baselines/ads-lifecycle-validation.json)
- PKG-ADS-04: [记录](changes/2026-09-12-PKG-ADS-04-types.md) [记录](baselines/ads-types-validation.json)
- PKG-ADS-05: [记录](changes/2026-09-12-PKG-ADS-05-browser.md) [记录](baselines/ads-ui-visibility-validation.json)
- PKG-VAST-01: [记录](baselines/vast-contract.md) [记录](baselines/vast-release.json) [记录](changes/2026-09-12-PKG-VAST-01-contract.md) [记录](baselines/vast-contract-validation.json)
- PKG-VAST-02: [记录](changes/2026-09-12-PKG-VAST-02-tests.md) [记录](baselines/vast-behavior-validation.json) [记录](baselines/vast-core.json) [记录](vast-validation.md)
- PKG-VAST-03: [记录](changes/2026-09-12-PKG-VAST-03-lifecycle.md) [记录](baselines/vast-lifecycle-validation.json) [记录](vast-compatibility-decision.md)
- PKG-DPIP-01: [记录](changes/2026-09-12-PKG-DPIP-01-contract.md) [记录](baselines/dpip-release.json) [记录](baselines/dpip-contract.md) [记录](baselines/dpip-contract-validation.json) [记录](dpip-validation.md)
- PKG-DPIP-02: [记录](changes/2026-09-12-PKG-DPIP-02-tests.md) [记录](baselines/dpip-behavior-validation.json) [记录](dpip-validation.md)
- PKG-DPIP-03: [记录](changes/2026-09-12-PKG-DPIP-03-lifecycle.md) [记录](baselines/dpip-lifecycle-validation.json) [记录](dpip-validation.md)
- PKG-DPIP-04: [记录](changes/2026-09-12-PKG-DPIP-04-types.md) [记录](baselines/dpip-types-validation.json) [记录](dpip-validation.md)
- PKG-DPIP-05: [记录](changes/2026-09-12-PKG-DPIP-05-native-checkpoint.md) [记录](baselines/dpip-native-validation.json)
- PKG-CANVAS-01: [记录](changes/2026-09-12-PKG-CANVAS-01-contract.md) [记录](baselines/canvas-contract.md) [记录](baselines/canvas-release.json) [记录](canvas-validation.md) [记录](baselines/canvas-contract-validation.json)
- PKG-CANVAS-02: [记录](changes/2026-09-12-PKG-CANVAS-02-tests.md) [记录](baselines/canvas-behavior-validation.json) [记录](canvas-validation.md)
- PKG-CANVAS-03: [记录](changes/2026-09-12-PKG-CANVAS-03-lifecycle.md) [记录](baselines/canvas-lifecycle-validation.json) [记录](canvas-validation.md)
- PKG-CANVAS-04: [记录](changes/2026-09-12-PKG-CANVAS-04-types.md) [记录](baselines/canvas-types-validation.json) [记录](canvas-validation.md)
- PKG-MB-01: [记录](baselines/mb-release.json) [记录](baselines/mb-surface.json) [记录](baselines/mb-contract.md) [记录](baselines/mb-contract-validation.json) [记录](mb-validation.md) [记录](changes/2026-09-12-PKG-MB-01-contract.md)
- PKG-MB-02: [记录](changes/2026-09-12-PKG-MB-02-checkpoint.md) [记录](baselines/mb-media-checkpoint.json) [记录](mb-validation.md) [记录](changes/2026-09-12-PKG-MB-02-baseline.md) [记录](baselines/mb-behavior-validation.json)
- PKG-MB-03: [记录](changes/2026-09-12-PKG-MB-03-input.md) [记录](baselines/mb-input-validation.json)
- PKG-MB-04: [记录](baselines/mb-coordination-source.json) [记录](changes/2026-09-12-PKG-MB-04-shim-checkpoint.md) [记录](baselines/mb-shim-checkpoint.json) [记录](changes/2026-09-12-PKG-MB-04-coordination.md) [记录](baselines/mb-coordination-validation.json)
- PKG-MB-05: [记录](baselines/mb-video-source.json) [记录](changes/2026-09-12-PKG-MB-05-video.md) [记录](baselines/mb-video-validation.json)
- PKG-MB-06: [记录](baselines/mb-audio-source.json) [记录](changes/2026-09-12-PKG-MB-06-audio.md) [记录](baselines/mb-audio-validation.json)
- PKG-MB-07: [记录](baselines/mb-hls-source.json) [记录](changes/2026-09-12-PKG-MB-07-hls.md) [记录](baselines/mb-hls-validation.json)
- PKG-MB-08: [记录](baselines/mb-entry-source.json) [记录](changes/2026-09-12-PKG-MB-08-entry-checkpoint.md) [记录](baselines/mb-entry-checkpoint.json) [记录](baselines/mb-capability-source.json) [记录](changes/2026-09-12-PKG-MB-08-capability.md) [记录](baselines/mb-capability-validation.json)
- PKG-MB-09: [记录](changes/2026-09-12-PKG-MB-09-native-pip-checkpoint.md) [记录](baselines/mb-native-pip-checkpoint.json) [记录](changes/2026-09-12-PKG-MB-09-sustained-playback-checkpoint.md) [记录](baselines/mb-sustained-validation.json) [记录](baselines/mb-sustained-media.json)
- PKG-IFRAME-01: [记录](changes/2026-09-12-PKG-IFRAME-01-contract.md) [记录](baselines/iframe-release.json) [记录](baselines/iframe-contract.md) [记录](baselines/iframe-contract-validation.json)
- PKG-IFRAME-02: [记录](changes/2026-09-12-PKG-IFRAME-02-behavior.md) [记录](baselines/iframe-behavior-validation.json)
- PKG-IFRAME-03: [记录](changes/2026-09-12-PKG-IFRAME-03-requests-checkpoint.md) [记录](baselines/iframe-requests-checkpoint.json) [记录](changes/2026-09-12-PKG-IFRAME-03-boundaries-checkpoint.md) [记录](baselines/iframe-boundaries-checkpoint.json) [记录](iframe-message-boundary.md) [记录](changes/2026-09-13-PKG-IFRAME-03-navigation.md) [记录](baselines/iframe-navigation-validation.json) [记录](iframe-document-protocol.md)
- PKG-IFRAME-04: [记录](changes/2026-09-13-PKG-IFRAME-04-types.md) [记录](baselines/iframe-types-validation.json)
- PKG-IFRAME-05: [记录](changes/2026-09-13-PKG-IFRAME-05-integration.md) [记录](baselines/iframe-integration-validation.json) [记录](changes/2026-09-13-PKG-IFRAME-05-history.md) [记录](baselines/iframe-history-validation.json)
- PKG-TOOL-THUMB-01: [记录](baselines/thumbnail-release.json) [记录](baselines/thumbnail-contract.md) [记录](changes/2026-09-13-PKG-TOOL-THUMB-01-contract.md) [记录](baselines/thumbnail-contract-validation.json)
- PKG-TOOL-THUMB-02: [记录](baselines/thumbnail-behavior-validation.json) [记录](changes/2026-09-13-PKG-TOOL-THUMB-02-behavior.md)
- PKG-TOOL-THUMB-03: [记录](changes/2026-09-13-PKG-TOOL-THUMB-03-input-checkpoint.md) [记录](baselines/thumbnail-input-checkpoint.json) [记录](changes/2026-09-13-PKG-TOOL-THUMB-03-lifecycle.md) [记录](baselines/thumbnail-lifecycle-validation.json)
- PKG-TOOL-THUMB-04: [记录](changes/2026-09-13-PKG-TOOL-THUMB-04-runtime-types.md) [记录](baselines/thumbnail-runtime-types-validation.json) [记录](changes/2026-09-13-PKG-TOOL-THUMB-04-public-types.md) [记录](baselines/thumbnail-public-types-validation.json) [记录](changes/2026-09-13-PKG-TOOL-THUMB-04-emitter.md) [记录](baselines/thumbnail-emitter-validation.json)
- PKG-FACTORY-01: [记录](baselines/factory-assignment-gaps.json) [记录](baselines/factory-compatibility-proposals.json) [记录](factory-compatibility-decision.md) [记录](changes/2026-09-12-PKG-FACTORY-01-decision.md)
