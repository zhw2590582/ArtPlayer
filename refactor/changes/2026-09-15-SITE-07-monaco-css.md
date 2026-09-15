# SITE-07 Monaco CSS 来源、压缩与样式回归

修改前 HEAD：23ac6f71284547a5e4dbf6cdbf0966f6cef49c87。

## 源码与结构

新增 css.ts 和 reproduce-css.ts，分开处理注册顺序、原始 CSS 运输/拼接配方与
归档/锁/压缩验证。68 份样式从固定 VS Code commit 恢复，连同 3 个内联图片、
字体、配方、锁和许可共 81 个 Git 成员验证 blob/SHA-256。原始 transportCSS
函数由 AST 定位后在受限读取环境执行；每份准备样式均与 core ESM 产物相等。
64 份原文不变，另外四份涉及字体查询参数、URL 引号及 PNG/SVG 内联。字体复制
字节也与归档一致。此处 VM 是隔离辅助，不作为安全沙箱保证。

按实际 AMD 注册次序拼接，不能用模块名表的排列替代。原 CSS 插件生成的 70 个
CRLF 分隔符转换为发布包实际 LF，再加原版本头，完整开发文件 114,942 字节精确
匹配。这项发布换行归一化的具体原流水线位置尚未确认，因此记录为有证据的
字节转换，不声称未经改造地重跑了整个上游发布命令。

## 工具链与兼容

cssnano 4.1.11 / PostCSS 7.0.35 按原 preset: default 压缩后，完整 72,052 字节
产物匹配。复用 Yarn Classic 1.22.22：在新的忽略目录中按原始 lock 冻结安装，
禁用安装脚本，锁内容保持一致；153 个依赖选择器、143 个版本均有原 registry
integrity。没有改变项目依赖或根 yarn.lock。默认命令使用离线缓存，--fetch
重新取回源归档并允许安装访问 registry。

最初隔离工具继承父项目 Chrome-only Browserslist，导致 transparent 被压成
initial。固定历史默认目标后恢复全部字节，显式拒绝环境覆盖。历史 caniuse
数据过期提示不通过更新数据消除。原 archive 的 LICENSE.txt 按 .gitattributes
使用 CRLF，Git blob 为 LF；仅对该成员的 Git 身份检查转换，原许可全文保留。

站点 CSS 为 72,057 字节，精确保留现有五个头部 CRLF 差异；不改变运行代码、
CSS/DOM hooks、worker 或资源 URL，没有扩大消费者最低浏览器要求。

## 验证、后续与回退

25/25 单元、严格 docs-tools 类型及 lint 通过；来源/完整开发文件/压缩文件的
离线与联网复验通过。联网第一次遇到 codeload.github.com DNS ENOTFOUND，保留
失败记录后重试。三引擎样式回归 3/3：明暗主题、布局、查找面板边界、字体载入
与真实 codicon 字形、CSS/font HTTP、缩放及模型销毁。初始测试误把浅色背景
写成纯白，核实原 colorRegistry 的 #fffffe 后修正预期，未改生产颜色。

详细环境/产物/报告指纹见[验证记录](../baselines/monaco-css-build-validation.json)，
维护入口见[Monaco README](../../scripts/site-vendor/monaco/README.md)。本批未改变
站点 notices；完整原始 core TS 编译、其余内嵌来源和 SITE-07 其他许可交付范围
继续开放，未以浏览器样式测试替代设备、SDK、远程 CI 或发布验收。

SITE-07 doing / VENDOR-06 open，199/265；Thumbnail 默认策略仍待答。本批单独
本地提交，可回退新增脚本/基线/测试/文档；无推送、部署或发布。
