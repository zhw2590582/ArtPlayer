# SITE-07 Monaco DOM 改编来源与通知交付

来源 HEAD：`3eb550052531094753207bdadf4b0e32687792de`。SITE-07 继续 doing，
VENDOR-06 继续 open；本次没有更改编辑器脚本、CSS、worker 或播放器运行字节。

## 已核实范围

固定 VS Code `829382514cb1065f5ebb90f436e1c6103e153953` 的 dom.ts 五处明确注明
WinJS 改编。六个完整声明块——SizeUtils、getTopLeftOffset、getTotalWidth、
getContentWidth、getContentHeight、getTotalHeight——与 Monaco 0.30.1 原始
source map 的对应内容精确相同；当前 editor.main.js 与固定 npm 归档逐字节一致。
这不是完整 DOM 模块的编译证明，也不把 reference 注释等同于特定上游版本证据。

原注释没有 WinJS 版本。本批固定 WinJS 4.4.5 提交
`4329b1133b243d9ded3b5a1f98d096ee8e80e889` 的 `_ElementUtilities.js` 和完整
Microsoft MIT 许可作比较，保留 `originalWinjsVersion: null`。参考源码与 VS Code
改编存在像素转换、CSS 属性读取、尺寸助手、边框/RTL/ShadowRoot 位置处理等差异，
没有把两套实现强行判为完全相同，也没有声称添加前必然缺少 Microsoft 的许可授权。
完整参考许可和说明作为补充交付，原 Monaco 许可及 ThirdPartyNotices 均保留。

固定远端文件同时校验 SHA-256 和 Git blob SHA；两个 npm archive 校验 SHA-512/
SHA-256。源码保存在 `baselines/site-vendor/monaco-dom/`，保留原始字节，不经
Git 自动换行转换。说明明确标注参考版本和未知原始版本，后续 AI 不应把它改写为
“Monaco 内含原版 WinJS 4.4.5”。

## 实现与维护

- `scripts/site-vendor/monaco/dom-origins.ts` 管理声明边界及来源/通知绑定；以现有
  TypeScript 5.9.3 parser 识别完整顶层节点，不执行下载的 WinJS 代码。
- `reproduce-dom-origins.ts` 校验冻结来源、源码片段与原 map、交付脚本归档身份；
  新增 `yarn verify:monaco-dom-origins [--fetch]`，没有新依赖或锁文件变化。
- 正常 `build:site-notices` 增加 core-dom 完整许可/说明及索引，合计 88 份 notice
  加索引 89 outputs；校验器拒绝遗漏编辑器归属、条款或来源声明。
- 测试覆盖缺少/重复声明、同名字符串冒充声明、遗漏条款和错误资产归属。真实
  浏览器直接调用现有 Monaco 模块，在 padding/border/margin/嵌套滚动前后检查
  尺寸和原生页面位置；不是测试自造 DOM 工具的替代实现。

维护入口与复跑命令见 [Monaco README](../../scripts/site-vendor/monaco/README.md)。

## 验证与限制

Node 24.21.0、Yarn 1.22.22；30/30 单测，严格 docs-tools 类型与定向只读 lint
通过。联网/离线来源核验、正常通知生成及只读检查分别执行并记录。
Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6 的 DOM 检查和移动页面实际
播放/全部 notice HTTP/新增相对链接共 6/6，零跳过/重试；原始网络诊断保留在
[机器证据](../baselines/monaco-dom-origins-validation.json)，不宣称所有请求无取消。

原始 WinJS 改编版本仍未知；Unicode 数据、其他内嵌来源、完整 core TS 编译及
SITE-07 其他范围继续开放。没有在本轮补证据时悄悄放宽这些验收条件；202/266
完成数不变。回退本批时一并撤销通知绑定/新增文件并重建索引，不触碰原编辑器
资产。未推送、部署或发布。
