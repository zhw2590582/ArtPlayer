# SITE-07 Monaco 核心压缩、加载器与十语言编辑回归

修改前 HEAD：244695e7262902c59b522b0a72543f787a442afd。

## 本批实现

固定 VS Code 配方/锁文件确认 core 0.30.1 使用 esbuild 0.12.6。新增独立
reproduce-core-build.ts，校验 Monaco/core/历史 esbuild 归档和七个 Git 文件，
直接从平台归档读取已校验的可执行文件；不执行安装脚本、不改根依赖或 yarn.lock。
记录 Windows/Linux x64 两种归档，实际执行证据仅覆盖 Windows x64。

13 个 core JS 文件（editor、worker、loader、英文及九份翻译）的完整压缩字节
均复现。保留 node/esnext/minify 原参数，准确恢复 source-map 注释前的额外换行
及相对路径，没有用 trim 忽略差异。12 个文件直接匹配站点；editor.main 核心
部分保留原入口改名和追加贡献模块边界，不把该边界检查称为完整后缀重建。

loader 原始 Git 源码及版本头精确匹配，css/nls loader 固定源码与 source map
一致。两个原始 source map 的 584 个条目、549 个不同源码名逐项登记内容哈希
和字节数。这些是上游准备后的构建输入，不是完整 VS Code 原始 TS 编译证明。

core-build.ts 将 NLS 静态解析、source map 清单和末尾注释装配分开。原 NLS
包含尾逗号，所以用 TS AST 读取字面量数组；不执行翻译脚本，拒绝动态调用、
重复键或额外语句。十种语言查找文案从原归档解析后冻结为浏览器输入，完整
复验会重新读取并比较。新命令 yarn verify:monaco-core-build 支持 --fetch。

## 浏览器与其他验证

editor-core.spec.js 每种语言执行真实键盘输入、撤销、重做，打开本地化查找框，
等待新查询对应的实际选择范围后跳到下一项，退出并销毁 editor/model。
初始测试用了不存在的旧 CSS 组合，页面快照表明查找框已经显示；改成实际
可访问名称。又修正了旧选区先于查询更新的测试竞态，未增加任意等待或改运行代码。
十种语言在三引擎 30/30 通过，另一个真实 diff worker 用例三引擎 3/3 通过：
第二行变更被计算出来、输入改成相同内容后差异清空、模型全部释放。

单元 20/20、严格 docs-tools 类型与本批 lint 通过。归档/Git 联网复验与离线
复验通过，13 个压缩产物相等。环境、输出指纹和两次浏览器报告见
[验证记录](../baselines/monaco-core-build-validation.json)。未改变运行资产或许可
交付，本批没有重复声称播放器/设备/SDK/远程 CI 验收。

## 后续与范围

维护入口：[Monaco README](../../scripts/site-vendor/monaco/README.md)。继续 core
贡献模块装配、CSS 以及已定位的来源边界：Node path、WinJS 适配、unicode-utils
生成数据、HSL 公式引用和 marked 的 Stack Overflow 片段。引用不自动等于许可
缺口，后续需按实际表达和来源确认。本批没有替这些条目作完结判断。
SITE-07 doing / VENDOR-06 open，199/265；Thumbnail 默认策略仍待用户答复。
可独立回退新增脚本、基线和测试。独立本地提交，不推送、部署或发布。
