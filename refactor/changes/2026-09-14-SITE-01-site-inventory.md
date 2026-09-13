# SITE-01 文档/示例/生成链清点

起点 `d62ab13a35c756ea567c426d4fbe00d893dd7e2b`。本任务建立可重跑的当前清单、
核实静态资产来源，并修复示例路径台账漂移。没有修改生产包 API、声明、DOM、
播放器生命周期、静态资源内容、版本或发布入口。

## 实现与维护

- site-inventory.mjs 复用现有 demo 枚举，使用已安装 MarkdownIt 14.1.0 和
  TypeScript 5.9.3 枚举文档标题/声明成员；记录 22 包、27 Markdown、30 示例、
  36 HTML、963 声明成员和 204 资产。成员可能重载/继承/含 runtime 类型，
  标题候选不是语义通过证明；逐项保留 SITE-04 owner。
- site-provenance.mjs 显式 --network 下载三个固定版本，验证 SHA-512/SHA-1，
  只读归档，按文件与本地比较。网络失败直接失败，不回退缓存或执行安装脚本。
  下载和读取复用现有 releases 工具；浏览器验证不是该脚本的职责。
- 文档站新增 README，解释 VitePress/编辑器分工、源与生成目录、语言路由、
  生命周期、Yarn 命令、外部生成步骤和站点分发边界。
- 无新依赖或锁变更；新增脚本是维护检查入口，不加入产品页面。
- site-vendor 原始 notice 文本固定 LF，并仅对该取证目录允许上游末尾空行，
  防止 Windows checkout 改变冻结字节；不删改许可证原文来通过 whitespace 检查。

## 已复现问题

原 demos.test.mjs 因 asr.local.js 不在 BASE-04 中失败，错误是 Demo file coverage
drift。该示例已由 PKG-ASR-05 提交引入。保留原 29 示例快照，增添有完整提交、
路由和 owner 的 demo-additions.json。验证合并后的完整集合，仍拒绝未登记新增、
旧路径丢失和菜单/包遗漏。额外反例拒绝重复登记、错误路由、未知 owner、越界路径、
缺来源提交；没有通过删断言或全量重写历史快照解决。

触及旧脚本时修正 lint 指出的 process import 和 script src regex 的冗余零下界；
后者仍要求 script 与 src 间至少一个属性分隔字符。脚本外部接口不变。
一次 ESLint 写文件返回 UNKNOWN，确认文件完整后单独重试成功；测试文件的 node:test
采用与仓库其它基线测试相同的定向规则说明，不引入 Vitest 或更换实际测试 runner。

## 来源与未完成事项

详见 [清单说明](../site-inventory.md) 与 [冻结证据](../baselines/site-provenance.json)。
vConsole 3.15.0 字节一致；Monaco 0.30.1 的 98/99 字节一致，余下 CSS 仅换行差异。
本次取得原始 LICENSE/ThirdPartyNotices，保存在 refactor 取证目录，分发装配归 SITE-07。
console bundle 源码与组件完整版本、6 字体授权依据和样本来源仍开放。

thumbnail 示例与 npm 1.0.3 实际 VTT 实现/声明不一致，不能直接替换成 auto-thumbnail。
EX-03 接续旧 URL 的修复与迁移解释。原 36 HTML 路径全部保留；文档站静态部署与
缺 private 字段分开记录，REL-01 需显式发布分类，不能从缺字段推断 npm 发布意图。

新增 SITE-07 作为 SITE-05 前置，承接 notices/资产处置；加强 SITE-02 的坏代码块
终止反例、SITE-03 的移动失败恢复/加载顺序/路由验证，以及 SITE-04 的双语成员覆盖。
相关风险仍为 open，没有把清点视为发布接受或虚构免验。

## 验证与回退

最终命令和结果见 [验证记录](../baselines/site-inventory-validation.json)。定向检查包括
真实当前清单、历史加增量的路径校验、错误输入反例、目标 lint、计划和风险登记。
不需要重建生产 dist；没有运行播放器实播、完整文档构建、远端 CI/Pages/npm。

回退 SITE-01 提交恢复旧检查器和任务/清单；生产行为无需数据迁移。
后续从 SITE-02 的声明/示例生成器开始，SITE-07 独立处置第三方分发来源。
