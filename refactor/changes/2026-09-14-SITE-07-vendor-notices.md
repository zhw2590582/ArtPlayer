# SITE-07 Monaco/vConsole分发来源检查点（仍doing）

接续SITE-01的npm包对照：Monaco0.30.1共99文件，98逐字节一致、1个CSS只差换行；
vConsole3.15.0逐字节一致。新增冻结manifest、TS校验/生成模块和CLI，100个运行时
文件保持原样。三份上游原文复制到docs/licenses，加范围明确的站点索引。严格指纹
检查会拒绝运行时代码漂移、遗漏/新增资产和被删改的上游文本，而不是重新生成即通过。

build:site-notices/check:site-notices分别加入ci:build/ci:check；根lint、严格docs-tools
类型及Node回归覆盖新模块。没有新依赖、工具版本或packageManager变化。生成的许可
文件保留完整字节与末尾空行，Git LF规则防止跨系统转换；不手动改动vendor运行时。

## 本轮证据

- 3项文件/只读/输入完整性回归通过；初版Buffer与Uint8Array深比较误报索引漂移，
  已改成字节比较，负例继续要求变更输出失败。
- 真实浏览器6项为5通过/1失败：桌面TS编辑器三引擎均通过，实际Monaco worker发射、
  Ctrl-S和错误语法保护可用；移动vConsole日志/HTTP原文检查后，WebKit销毁出现
  `undefined is not an object (evaluating 's.O.get(n).update')`。保留失败，不关闭VENDOR-07。
- 固定v3.15.0上游源码显示日志模型用requestAnimationFrame延迟_flushLogs，并直接
  Store.get(id).update；解绑删除Store。该路径与报错相符，但还没有栈/最小用例
  完整证明具体触发链，不声称已经修复。源码引用固定提交05d80398bae35e793774f74e3c052b4e530e293a。
- 关闭风险前复核发现Monaco的ThirdPartyNotices没有Codicons条目。当前独立Microsoft
  Codicons项目区分内容CC-BY-4.0和代码MIT，见[官方来源](https://github.com/microsoft/vscode-codicons)。
  必须匹配本次codicon.ttf的历史版本与归属，不能自动套用当前许可或Monaco的MIT声明。
- vConsole npm及当前上游LICENSE只有9行，末尾声称附带MIT全文却没有正文。
  因此生成结果明确标记upstream文本不完整，不把自动复制当作许可放行；其捆绑
  依赖通知也继续核实。Monaco的完整LICENSE和ThirdPartyNotices已经随站点分发。

详见[证据](../baselines/site-notices-checkpoint.json)、[模块地图](../../scripts/site-vendor/README.md)
和风险台账。VENDOR-06/07/08、字体/媒体和新销毁缺陷保持open。SITE-07不标done，未执行新的完整
Pages构建/部署、真机或站点全部示例验收。此处浏览器使用未改变的现有安装核心，
不宣称重新打包了核心或插件。

下一步优先为vConsole销毁缺陷建立确定性复现和可维护修复，补MIT及捆绑依赖原文，
然后继续consoleLog bundle来源/可复现构建与字体媒体处置。不通过删除销毁检查或
使用空控制台替身来绕过旧行为。回退此检查点只移除新脚本/notice输出/状态及测试，
原JS/CSS/字体内容不变；没有push/publish或外部消息。
