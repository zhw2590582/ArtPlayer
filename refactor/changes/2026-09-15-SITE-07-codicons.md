# SITE-07 Codicons 历史来源与随站点分发

## 本次修改

现有 Monaco 0.30.1 包内 codicon.ttf 与官方 npm @vscode/codicons 0.0.26 的
package/dist/codicon.ttf 逐字节一致；相邻 0.0.25 不匹配。下载归档先核对 npm
SHA-512 SRI 和 SHA-1，再记录 SHA-256、发布时间、gitHead、成员路径及字体直接
比较结果。完整固定证据见 [来源记录](../baselines/site-codicons-provenance.json)。
依据为历史 npm 归档原文；固定 GitHub 页面经网页工具未能取回，未计作取证成功。

从该归档保留完整 LICENSE、LICENSE-CODE、README，另加 Microsoft/contributors
署名、来源和未修改说明。历史 README 将内容列为 CC BY 4.0、代码列为 MIT；
没有套用当前上游许可，也没有用 Monaco MIT 代替字体许可。三份原文保留 CRLF，
Git 精确路径 -text 规则避免跨系统改写；生成到 docs/licenses/monaco-editor/codicons。
原文存放 [冻结目录](../baselines/site-vendor/codicons-0.0.26)。

TS 生成模块增加嵌套组件关联，要求字体存在于父包清单且每份通知均有输出。
CLI 拒绝遗漏已确认的 Codicons 组件。旧文件检查继续拒绝运行时代码和字体漂移；
生成过程不能把删改的原文自动认可为新基线。站点索引标明独立组件版本和来源。
实现与重跑方法见 [模块说明](../../scripts/site-vendor/README.md)。没有新依赖。

## 验证

- Node 24.21.0 / Yarn 1.22.22；notice、vConsole 生命周期、Pages 资产测试 16/16。
  新负例验证缺少嵌套许可、丢失字体关联、空证据和 CRLF 被转换，失败发生在写出前。
- strict docs-tools 类型检查和相关源码 lint 通过。初次 lint 发现 Buffer 显式导入
  和 import 排序问题，均已修正后重新通过。
- Git 初次暂存检查将原文 CRLF 与原始尾空格视为空白错误；仅为这六个不可改写的
  原文源/输出路径设置空白规则例外，继续由字节指纹保护，没有格式化上游文件。
- build:site-notices / check:site-notices：8 个输出（原 4 个加 4 个 Codicons 文件），
  全部通过；原 100 个 Monaco/vConsole 运行时文件通过固定指纹检查。
- 三引擎真实浏览器 6/6，22.72 秒，退出 0，无失败、跳过、重试。每引擎各验证
  桌面 TS worker 编译/Run/Ctrl-S/语法错误保留实例，以及移动 vConsole 日志、
  真实本地视频播放、销毁和 HTTP 返回全部 7 份 notice 的完整原文。
  另外实际请求旧字体 URL 比较 SHA-256、读取索引确认组件条目。
- Windows Playwright Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6；
  使用源码构建核心、真实本地 Monaco/vConsole；没有重新打包全部 npm 包。
  移动页面测试不代表物理手机验证。报告摘要见
  [验证记录](../baselines/site-codicons-validation.json)，完整报告在 ignored cache 中。

## 边界和后续

API-08/09：字体、JS/CSS、AMD/worker、旧 URL 均未修改，仅增加通知文件与校验。
本次解决 Codicons 历史字体归属和通知分发缺口；SITE-07 仍 doing，任务完成数不变。
Monaco 全组件通知复核、vConsole MIT 正文与捆绑依赖、console.js 来源、其他字体及
媒体仍分别跟踪。旧 vConsole 销毁问题已有 SITE-VCONSOLE-01 修复，不重复当作本次
新问题；当前三引擎仍保留销毁断言。没有执行远端 Pages/npm 发布或声称真机通过。

本次为 SITE-07 独立本地检查点提交。回退时还原对应源通知、manifest、生成文件、
校验和文档即可，运行时资产无需回退。后续优先处理 vConsole 许可正文和依赖来源。
