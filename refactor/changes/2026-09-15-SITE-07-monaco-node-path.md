# SITE-07 Monaco Node 路径库来源与交付绑定

修改前 HEAD：d2b2f76db84ba107751766935a79b78766b81c7d。

## 来源、实现与兼容

VS Code path.ts 明确注明来自 Node v14.16.0。本批将该 tag 解析到固定 commit
bd60e93357a118204ea238d94e7a9e4209d93062，冻结 Node 原源码及 VS Code 移植源码，
并使用 SHA-256/Git blob 校验。原站点 ThirdPartyNotices 的完整 Joyent/Node
许可与两份源码正文一致；仅其中链接指向更早 commit。保留原文件，补充一份
core-path/ATTRIBUTION.md，准确说明实际来源和既有移植变化，没有虚构许可缺失。

新增 node-path.ts / reproduce-node-path.ts，将来源、6 个未用导出的移除、原版
路径参考用例及 notice 绑定分开维护。Node 路径算法经既有 VS Code 移植，包含
类型/参数名/括号整理、Windows join 字符串保护、两处 basename 循环变量调整、
本地参数校验和 Error 类、process adapter、显式导出及旧 _makeLong 别名的省略。
不声称等同未经修改的 Node 运行时，本批没有改动这些既有运行逻辑。

移除六个精确指定的顶层导出后，完整源码与主编辑器/worker 两份原 source map
一致。初始记录误用了整理缓存中的 file URI；读取原归档确认两个 map 实际使用
不同的 out-editor/.../file:/ 前缀，现按原始 key 精确核对。固定 VS Code 原锁中
TypeScript 4.5.0-dev.20211021，发射的完整路径模块分别匹配主编辑器 57,628 字节
和 worker 57,627 字节的唯一源码片段。对应站点压缩文件与固定归档完全相同，
整体压缩链复用既有 core-build 证据；这不是完整原 VS Code TS 工程编译证明。

历史编译器仅解包到隔离缓存，不覆盖已有 Monaco TypeScript 4.4.4 复现工具，
不改项目依赖、根 yarn.lock、运行资源、公开 API 或 worker URL。

## 测试与交付

冻结 Node 源码实际计算 30 个确定性合法路径用例，涵盖 POSIX/Windows 的空值、
点段、UNC、路径组合/相对关系、扩展名、中文路径、格式化和命名空间路径。
参考环境限制额外 import 与 cwd 使用，不模拟完整 Node 错误文本或驱动器环境。
三引擎测试直接调用真实 Monaco 两个 namespace，并检查平台别名和原有
Error/ERR_INVALID_ARG_TYPE 行为。另一组三引擎测试验证实际移动播放、全部
86 份 notice 的 HTTP/内容以及新增相对链接，总计 6/6 通过。

28/28 单元、严格 docs-tools 类型、lint、联网/离线来源与发射复验通过；普通
notice 构建新增 Node 双资产/原许可/补充说明绑定，负例覆盖遗漏 worker 或原
条款、错误/重复导出、额外 Node import 和非确定性 cwd。总交付为 86 notices
加索引，即 87 outputs。

Chromium 移动测试记录一条 pattern.mp4 net::ERR_ABORTED，保留在证据中；实际
播放时间推进断言通过，没有将本轮描述为所有网络请求零失败。其余本轮浏览器
错误/控制台错误为空。详情见[验证记录](../baselines/monaco-node-path-validation.json)。

## 后续与回退

维护入口：[Monaco README](../../scripts/site-vendor/monaco/README.md)。Node 路径
条目的版本/来源/原有条款/实际模块对应已核实；WinJS、Unicode 数据和其他
内嵌来源、完整 core TS 编译以及 SITE-07 其他交付范围继续开放。CSS 70 个
生成分隔符的发布归一化位置仍按前一批记录保留限制。

SITE-07 doing / VENDOR-06 open，199/265；Thumbnail 默认策略仍待答。独立本地
提交；回退时同批撤回新增来源/测试/绑定和重新生成 notice 索引，无推送或发布。
