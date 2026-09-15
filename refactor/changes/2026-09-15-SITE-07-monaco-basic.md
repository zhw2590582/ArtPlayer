# SITE-07 Monaco 基础语言构建与语法高亮回归

修改前 HEAD：bc9cb61aaf1a4ca466cebd4645fe19286042e56d。

## 实现与兼容边界

新增 reproduce-basic.ts，将此前临时探针变成可重复执行的来源验证。固定 Monaco
提交的仓库归档通过字节数/SHA-256 检查；156 个选定成员逐个检查 Git blob ID
及 SHA-256，包含 76 份语法源码、75 份测试和五份配方/配置/runner/许可文件。
四个 npm 归档分别为 Monaco 0.30.1、TypeScript 4.4.4、Terser 5.9.0、source-map
0.7.3。历史工具只在忽略缓存中展开，不安装脚本、不增加运行时依赖或改锁。

76 个文件包含 77 个模块实例，JavaScript 文件包含共享 TypeScript 语法。
每份原始 AMD 发射覆盖完整开发产物，压缩结果与站点文件逐字节相等。
HTML/PHP 尾部源码注释后存在 RequireJS 添加的换行加分号，明确记录这两处
分隔符；没有放宽其他文件或未归属字节的检查。原始源码没有为通过比对而修改。
完整上游语义类型检查和内嵌来源审查不由这些字节检查替代。

新增 basic-fixtures.ts 单独负责提取上游测试定义。通过固定编译器及记录型 runner
保留 Clojure 动态生成与 SCSS 换行预处理，仅允许两个明确导入；VM 不是安全沙箱。
冻结 2,511 个用例供普通浏览器 CI 离线使用，完整来源命令重新提取并深比较。
冻结数据保留上游文件路径及 MIT 说明，原始 LICENSE/第三方说明完整保存。

## 测试范围

editor-basic-languages.spec.js 用真实 Monaco AMD loader、注册与 tokenizer 执行全部
上游预期，比较每行 token 类型与偏移，保留多行状态。额外 12 例补齐 INI 无上游
测试、CSP/ECL 空套件、pgsql/redshift 实际指向 SQL 的缺口；没有改写或删除
上游预期。所有 76 个真实语法 URL 必须返回 200。

Chromium/Firefox/WebKit 各执行 2,523 例，三项浏览器测试通过，没有重试或跳过。
单元 16/16，通过反例证明提取器保留动态预处理且拒绝未知导入；严格 docs-tools
类型与本批 lint 通过。完整来源离线复现通过；联网首次 GitHub DNS ENOTFOUND，
重试成功取得四个 npm 归档及源码仓库归档，复现结果与离线完全一致。详见
[验证记录](../baselines/monaco-basic-validation.json)。

## 状态与维护

源码/测试/重跑入口见 [Monaco 维护说明](../../scripts/site-vendor/monaco/README.md)。
SITE-07 保持 doing，VENDOR-06 保持 open，Monaco core 和内嵌来源细节仍需收尾。
本批不改变运行产物、URL、公共接口、声明或 notices 交付，不代表播放器实播、
真机、外部 SDK、远端 CI 或三轮复盘通过。Thumbnail 默认策略仍待用户决定。
整体仍 199/265。回退本批脚本、基线与测试即可；独立本地提交，不推送或发布。
