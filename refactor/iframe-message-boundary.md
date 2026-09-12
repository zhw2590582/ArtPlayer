# ADR-025：Iframe 的消息对端与公开调用边界

关联：PKG-IFRAME-03/05，IFRAME-TRUST-01；2026-09-12。
状态：已实现方向，浏览器/最终构建结果以本轮验证记录为准；不是全包发布准入。

## 证据和选择

IFRAME-01冻结旧npm与初始工作区契约，02用真实WindowProxy复现了无关窗口冒充
inject、响应和可执行commit。构造参数明确指定iframe/url，仓库demo使用父页实例与
该子页inject配对；没有把所有无关窗口当作合法对端的公开功能说明。

据此将实际浏览器消息限定到所选窗口：父实例比较event.source与其$iframe.contentWindow，
子静态receiver比较event.source与window.parent。非对端消息在更新injected、结算请求、
调用message回调和执行commit之前被忽略。对端绑定是已有定向通信的缺陷修正。
这是明确记录的安全行为差异，不把历史误接收永久冻结为支持承诺。

不固定最初URL的origin，不修改targetOrigin='*'。固定初始origin会拒绝现有跨源配对、
跳转后的选定子窗口或sandbox opaque-origin；本轮分别用真实同源/跨源、HTTP302和
allow-scripts sandbox测试这些情况。窗口身份绑定不意味着验证该窗口当前内容的可信度。
父页必须信任选定iframe中的内容；注入子页必须信任其嵌入父页。自动允许任意父页执行
commit的部署风险不能通过“它确实是parent”消除，部署准入仍需独立审查。

公开onMessage仍允许local caller直接调用，source缺省或null时保留原方法用途。
此路径也允许具有本页脚本权限的代码自行构造事件；它不提供同页脚本隔离。验证测试的
跨窗消息均来自真实浏览器postMessage，不用source-less合成事件冒充已证明的来源校验。

## 消息与版本兼容

- 方法、公开字段/描述符、绑定receiver、type/data/id封套和resove保持原样。
- 对端的非null对象且type为string才参与协议；空字符串type仍是合法generic消息。
- 既有非error同ID响应继续结算；commit函数体/resolve约定及异常发包/拒绝通道不替换。
- 旧npm主类和初始workspace主类分别在父/子两侧与候选配对，检查普通同步和异步往返。
  这些对照证明旧wire可互通，不证明未升级一侧的来源检查已修复；完整防护需升级双方。
- 无关窗口的message通知、伪造响应/commit及无效封套的回调/崩溃被主动消除。
  如果应用确实需要收集其他窗口消息，应在自己的window message监听器中明确管理其对端；
  不再依赖本工具对任意窗口的历史误处理。
- 尚未处理导航握手代际；WindowProxy可跨导航保持身份，不能把来源绑定当作文档身份校验。
  PKG-IFRAME-03继续处理，IFRAME-05验证完整新旧核心/demo组合，风险未因本检查点自动关闭。

## 验证与回退

`test/iframe-boundaries.test.js`覆盖来源、畸形封套、local receiver、setup与destroy失败，
`test/browser/iframe-boundaries.spec.js`覆盖真实浏览器和旧wire组合。
验证记录：`baselines/iframe-boundaries-checkpoint.json`；历史失败必须与候选验收分开。
没有新增依赖、选项、公共类型或包版本。回退本检查点后用正常build重建产物；初始基线保留。
