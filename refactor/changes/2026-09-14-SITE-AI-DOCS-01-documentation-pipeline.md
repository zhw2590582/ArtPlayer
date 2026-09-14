# SITE-AI-DOCS-01 离线文档与翻译草稿

起点 `647f3e7f12b1026f7d0de0830080d2d17b23d14d`。从 SITE-03 拆出 LLM
文档和翻译工具链，父任务保留 i18n/VitePress 编排、桌面 common.js UI 迁移。
核心/插件运行时、公开类型、DOM/CSS、分发入口、版本及 yarn.lock 均未修改。

## 实现及兼容

- `scripts/documentation/` 以严格 TS 拆分 CLI、来源聚合、Markdown 保护、请求、
  草稿调度/应用和文件操作。旧 build-llm.js/trans-docs.js 命令路径保留为 checked
  JS 适配层。模块 README 记录数据流、状态、资源、命令、维护入口及限制。
- 固定起点旧函数的隔离复现确认：翻译 main 在第一次请求前递归删除英文目录，
  API 失败后人工维护页面消失；启发式 fence 修补破坏包含 `##`/`:::` 的合法
  代码；最后一次 429 退出循环后返回 undefined。新流程不沿用这些缺陷。
- build:llm 改为离线、确定顺序、保留 LF 归一后的源文本。输出仍为 docs/llms.txt，
  增加来源/output SHA-256 清单。当前 66 个来源：13 英文 Markdown、实际加载的
  22 编辑器声明、30 示例、1 VAST 类型 notices；不收入未加载的遗留 WebSR 声明。
  原三组标题保留，增加 notices。完整源码替代远程摘要，内容体积变化有意为之。
- trans:docs 默认只显示计划；只有显式 --remote 才读取 dotenv/key、请求原
  DeepSeek endpoint/model。生成独立 ignored 草稿，不写英文目录。翻译范围保持
  index/advanced/component/start，共 13 篇，没有顺便生成 Danmuku 英文页面。
  老自动化需改为 --remote、复核草稿、--apply；这是内部维护命令的明确缺陷修正，
  不涉及消费包 API。请求仍可能产生服务费用，本任务没有执行实际远程请求。
- 保护并恢复代码/HTML/指令块，校验内联代码、链接和 Markdown 结构；分段有界，
  不拆 UTF-16 代理对。无效响应拒绝而非修补。单 worker 失败中止并等待所有
  worker；429/5xx/传输失败有界重试，认证/无效 JSON/空响应直接失败。计时覆盖
  响应正文读取，finally 清理，失败 HTTP body 取消。
- --validate 允许复核后修改草稿散文，但必须保持结构和源/目标指纹；它不证明
  翻译质量。--apply 全集预检、逐文件复检、临近临时文件替换，捕获失败后逆序
  恢复原始字节。过期源/目标、映射篡改、目录越界以及悬空链接均拒绝。未选中
  的英文页面保留；并发作者改写时拒绝覆盖该文件并报告 aggregate error。
- 回滚不是跨文件崩溃事务：原始字节只在进程内，断电/强杀可能部分应用；目录
  检查也不是针对恶意并发文件系统攻击的沙箱。README 明确先保留 Git 状态、
  失败后检查 diff 和草稿。这些限制不伪称为全局事务保证。

## 工程与验证

无新增依赖。使用 Node24.21.0/Yarn1.22.22、现有 TS5.9.3、glob13.0.6、
dotenv17.2.4 和 Markdown 工具链。新增 check:llm 进入 ci:check，离线 build:llm
在 ci:build 的 build:ts 后执行；trans:docs --remote 不进入 CI。文档模块进入
根 lint/docs-tools 严格检查，测试进入 test:node，当前站点清单同步 TS 文件指纹。

- 新增 12 项测试：旧缺陷复现、全部 13 篇实际源文件往返、保护标记/结构拒绝、
  请求失败、并发取消/等待、复核应用、过期输入、路径篡改/链接、回滚及并发修改、
  重试/认证/无效响应、离线可复现与默认不联网。真实 loopback HTTP 服务复现
  headers 已到而 body 卡住，超时能够中止；服务/连接在 finally 关闭。
- 连同编辑器生成、文档退出码、站点清单共 18 项通过；最后补充悬空链接拒绝后
  12 项再次通过、目标 lint 和严格类型复验通过。CI 回归 50 项通过。
- 根 lint 最终 0 error/1 既有生成声明 warning；一次新增 README 空行错误已修正。
  工具链、只读来源一致性及计划/风险/站点清单检查通过。完整基线结果与源/产物
  指纹见 [验证清单](../baselines/documentation-pipeline-validation.json)。
- 全量 git diff --check 报告两处生成语料空白：英文 start/i18n.md 第 9 行原有
  `:::warning ` 尾空格和语料末尾分隔空行。保留源文本是此输出的用途，没有
  修剪 Markdown 或伪称全量空白检查通过；排除该生成语料后的源码检查通过。

当前中英文 Markdown 文件与起点完全相同。没有调用 DeepSeek、应用真实翻译、
验证英文语义质量、生成完整 docs/document、执行浏览器或设备/远端 CI/Pages/npm。
既有播放器/插件验收仍由各自任务完成，本任务不扩大这些验收结论。

## 交接与回退

按独立任务提交，随后运行提交审计；无推送或发布。生成文件仅通过源码工具
更新。回退本提交会恢复旧远程和删除行为，优先针对问题修复；若整体回退，应
停用旧 trans:docs 自动调用以免重现数据丢失。下一步继续 SITE-03 剩余生成和
桌面 UI，不改变 VAST 默认行为、Auto Thumbnail 首帧或其它开放问题的状态。
