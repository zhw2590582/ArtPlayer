# SITE-07 Monaco 核心 Markdown 来源与许可补全

修改前 HEAD：426fee8faa7d4fe183fb3b5911d8b515f5f34bab。

## 实际发现和处理

核对 Monaco core 0.30.1 的原始 source map 和开发产物，发现 DOMPurify 2.3.1
未列入已交付的 Monaco ThirdPartyNotices。同一路径的 marked 版本由 VS Code
固定提交 829382514cb1065f5ebb90f436e1c6103e153953 的 cgmanifest 确认为 3.0.2，
并由完整源码匹配验证；不能仅凭相似代码选择其他 3.x 版本。

新增四个 npm 归档、七个固定 Git 文件的来源记录和可重跑脚本。npm DOMPurify
的 export 被替换为 AMD factory 及 ESM 注释；marked 增加 ESM 包装注释。明确的
适配边界再加 AMD 名称后，与 Git、source map 及开发产物中的完整片段精确相等。
两个片段分别为 52,931 / 95,547 字节。站点完整 editor.main.js 与原 Monaco
归档相等，其中 core 前缀及 source map 尾部与原 core 包相等。

这证明两个内嵌组件及现有 core 分发边界，不声称重新构建了整个 VS Code 编译
流水线。编辑器 core 的其他模块、loader、翻译及后续内嵌来源继续留在 SITE-07。

新增四份站点文件：DOMPurify 原始完整许可、marked npm 原始许可、VS Code 保留
的旧 marked 许可、版本与适配说明。DOMPurify 原文同时保留 Apache/MPL 两种
上游许可全文；VS Code 副本只比 npm 少一个末尾换行，脚本精确验证该差异，
分发完整 npm 字节。原 Monaco 第三方说明没有被改写或删去。

core-origins.ts 管理来源和 notice 绑定，普通站点生成前拒绝漏发、互换许可或
版本错误；完整复验另外验证归档、Git、npm 适配、source map 和产物边界。
新的 yarn verify:monaco-core-origins 支持离线与 --fetch，不安装新依赖、不改锁。
完整维护入口见 [Monaco README](../../scripts/site-vendor/monaco/README.md)。

## 验证和限制

- 四归档/七 Git 来源联网复验与离线复验均通过；生成及只读 notices 检查通过。
- 18/18 单元通过，含遗漏四份补充文件、错误许可绑定、重复适配边界等反例。
- 严格 docs-tools 类型检查和本批 lint 通过。
- 三引擎 Markdown 渲染检查表格、代码、链接、指定过滤行为和临时 hook 清理。
- 三引擎移动实际播放、日志、销毁及全站 85 份 notice HTTP 字节/说明链接通过。
  两组共 6/6 浏览器测试，无跳过或重试；具体浏览器版本和诊断保留在
  [验证记录](../baselines/monaco-core-origins-validation.json)。

上述用例不构成对 sanitizer 的穷尽安全审计，也不替代设备/外部 SDK/远端 CI/
全部站点内容/三轮复盘。SITE-07 doing / VENDOR-06 open，整体 199/265 不变。
Thumbnail 默认策略仍待用户决定。可独立回退本批脚本、基线、测试和新增 notices；
没有改播放器/编辑器运行产物或公开 API。独立本地提交，不推送、部署或发布。
