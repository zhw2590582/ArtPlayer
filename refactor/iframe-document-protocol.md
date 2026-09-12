# ADR-026：兼容的文档标记与导航归属

关联PKG-IFRAME-03/05；2026-09-13。实现与验证以本轮记录为准。

## 问题与取舍

WindowProxy在导航中保持身份。旧协议只用Date.now的请求ID，无法区分某个inject、
响应或UI通知属于哪个子文档。直接在iframe load时清空状态也不正确：实际子页可以
先inject，再等待图片等资源完成load。只观察src属性同样不足，片段跳转不会更换文档。

本轮先采用直接属性取消的候选，真实Chromium三个attribute-fragment场景证明它误拒绝
同文档请求。修复使用“导航意图—确认离开”两个阶段；失败报告保留，不靠放宽断言通过。
不更换公开传输为另一套RPC，不要求旧页面改写commit函数，也不把WindowProxy当作文档ID。

## 可选扩展与旧端兼容

公开type/data/id、任意非error同ID响应、message({type,data})回调及其this保持原样。
新增内部可选字段`__artplayerIframe`，包含version=1、document字符串和phase。
文档标记是关联标识，不是秘密或认证令牌；来源信任仍按ADR-025。

| 消息 | 行为 |
| --- | --- |
| inject | 新子页在原inject封套上附文档标记；旧父页仍只读取原三个字段 |
| ack | 新父页识别标记后，使用带标记的`artplayer-tool-iframe:session`确认；不进入公开message回调 |
| message | 确认后，子页普通postMessage/响应带文档标记；父页发出的请求也标注目标文档 |
| leave | 已确认子页在原生pagehide发送私有通知，父页取消原文档所属请求 |
| resume | 原生pageshow.persisted恢复时通知；不伪造普通inject回调 |
| fragment | 原生hashchange报告实际location.href；匹配父页目标src时完成同文档跳转 |

没有新父页ack时，新子页的普通消息保持旧封套，也不发新的私有生命周期通知。
没有子页文档标记时，新父页继续使用旧封套。实际npm主类与初始工作区主类在父/子
两侧均有正常wire组合；额外helper的不同协议仍由IFRAME-04/06单独处理。
原生window监听器会看见可选字段和已协商的私有控制流；工具的公开message回调不暴露私有控制包。

## 请求与导航状态

1. 监听src/srcdoc属性；公开postMessage入口和等待轮询也消费尚未送达的MutationObserver记录。
2. 已标记的文档开始导航时，捕获当时仍属于它的请求集合，暂停后续发送。新请求排队等待。
3. pagehide或另一个文档inject确认换页后，只取消捕获的旧集合；之后排队的新请求保留。
   在任何新文档注入前连续修改目标，只更新目标，不重新捕获排队请求；这些尚未发送的请求交给最终注入的文档。
4. 片段跳转仍在同一文档：hashchange报告的完整URL必须匹配实际目标src，释放暂停并保留旧请求。
   不把src相对/绝对写法或重新设置片段属性误当作新文档；不以load事件猜测文档身份。
5. 不同标记的迟到响应/通知被忽略，发给旧标记的commit不会在新子页执行。
6. destroy解除监听、observer、请求边界和捕获集合；立即拒绝仍归属实例的全部请求。

文档确认离开时的Error消息为`The iframe document has changed`；destroy沿用
`The instance has been destroyed`。调用方需要处理commit/postMessage的拒绝。
未确认离开前，原文档已完成的响应仍可结算原请求；这属于活文档的正常完成，不是假定所有导航意图都是换页。

整页进入BFCache时父页也会冻结，子页的best-effort leave不一定送达。实际完整Chromium
恢复证明父子文档及标记可以保持不变：未收到leave的原请求可以在恢复后继续完成；已收到
leave的原请求保持拒绝。resume不伪造公开inject，也不会让已结算的请求复活。测试同时
核对实际私有消息阶段和Promise结果，而不只检查history.back或Navigation Timing类型。

停止加载、HTTP 204及截断响应不会授权把新请求发送给旧目标。旧文档仍活跃时可完成
原请求，新队列继续等实际inject；设置后续有效iframe.src或destroy分别恢复或取消队列。
没有新增隐式超时、自动旧源回退或覆盖window.stop。真实停止方法和网络响应见history测试记录。

公开promises记录保留resove/reject和对象身份。普通响应仍尊重用户替换的公开回调；
内部取消独立持有原Promise拒绝入口，不能因用户删除/替换记录而泄漏原Promise。

## 明确限制与后续门槛

- 旧端没有文档标记；不同有效源地址的属性导航可以管理，但同地址重载、子页内部导航和文档级迟到过滤
  不能通过未升级的一侧可靠证明。完整文档保护需双方使用新实现，旧正常协议继续兼容。
- MutationObserver不可用时，只能在公开方法/轮询时检查可观察的源变化；语法legacy目标不等于补齐DOM能力。
- 未标记的自定义原生消息仍按旧协议接受；其文档级归属由应用管理。SDK提供的消息在协商后携带标记。
- 历史返回必须核对实际pageshow.persisted与文档标识。IFRAME-05新增完整Chromium真实缓存恢复、
  实际播放器及编辑器、停止/204/截断响应验收。Firefox/WebKit的重新加载对照不能计作缓存恢复；
  原生设备、其余缓存引擎及最终分发仍待验收，不由桌面通过结果自动豁免。
- 本协议不验证父页origin许可，也不把可执行commit变成代码沙箱；嵌入父页和选定子内容仍需可信。

验证入口为test/iframe-navigation.test.js和test/browser/iframe-navigation.spec.js，记录见
baselines/iframe-navigation-validation.json。回退本轮源码后使用正常package build重建，不手改产物。
