# SITE-07 Monaco 语言服务原始许可交付

修改前 HEAD：0d3ddbf355b41abb86fe8990767ff164933d9c5d。

上一批已从固定归档完整复现 CSS/HTML/JSON worker；本批补齐对应许可交付和
组件绑定验证，不修改 Monaco 的运行代码、版本、旧路径或 API。

## 交付内容

七个已核实 npm 包保留九份 LICENSE/第三方说明原文件，按原始 Buffer 冻结并
生成到站点。HTML 包另外保留两个完整源码注释：其 CSS/HTML 格式器包含
2007-2018 Einar Lielmanis、Liam Newman 等作者的 MIT 原文，以及 Harutyun
Amirjanyan、Nochum Sossonko 的署名。包内第三方说明仍保持原始 2007-2017 年份，
不覆盖旧文本；单独的 ATTRIBUTION 解释实际源码差异和来源范围。

JSON 服务 LICENSE 同时包含 Microsoft MIT 与 Nick Fitzgerald glob-to-regexp
的 BSD 条件，完整保留，不能只按源码短头部或 npm 的 MIT 字段简化。HTML 的
第三方说明还保留 HTML 5.1 W3C Working Draft 条目。textdocument 的通用第三方
说明也原样保留，不把其中条件性文字推断为已发现某个额外运行依赖。

确认 beautify.js 是 Microsoft 的 JS 格式化空适配器；实际 CSS/HTML 格式器
才包含上游实现。nls 是 Monaco 自有 shim，补充说明链接到已有 Monaco LICENSE。
未猜测独立 js-beautify/glob npm 版本，也未把格式器重新署名为本项目代码。

新增 notices.ts 分开处理低成本构建检查与归档复核：

- 构建前校验组件版本、来源、实际 worker、全部 notice 和指纹的对应关系。
  防止文件和计数俱全，但 JSON/BSD 组件错误指向 CSS/MIT 文件。
- 完整离线复现检查九份原始文件、两个完整源码注释的字节范围与源成员指纹，
  再复现全部三个 worker。ATTRIBUTION 是单独标明的本地说明。
- 生成站点新增 12 文件，共 81 份 notice 和一个索引；全部保持原始文本字节。

## 验证

14/14 单元通过，覆盖错误组件绑定、错误 worker 路径、缺少各份通知、替换归档
文本和既有生成规则。严格 docs-tools 类型、相关 ESLint、生成及只读检查通过。
Yarn 离线复现通过：11 归档、13 Git 来源、119 模块实例、三个完整压缩产物、
12 notice 输入。根依赖和 yarn.lock 不变。

三引擎共 6/6 浏览器测试通过，无重试/跳过：CSS/HTML/JSON 功能，81 份实际
HTTP notice 原文字节，新增说明的 12 个相对链接，移动播放器实播、日志及销毁。
详细环境与原始输出指纹见 [验证记录](../baselines/monaco-language-notices-validation.json)。
没有执行真机、Google IMA、远端 CI 或 npm 发布验证。

SITE-07 doing / VENDOR-06 open，整体仍 199/265。Monaco mode bundles、核心内嵌
库、语言定义和其余数据/来源细节继续审查，站点其他字体和媒体门槛仍保留。
回退本批 notice、绑定校验和生成入口改动即可；运行资产未变。独立本地提交，
没有推送、部署或发布。
