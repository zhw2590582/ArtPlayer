# PKG-IFRAME-02 历史消息、请求与销毁行为

新增52项Node检查，使用冻结发布主main/legacy及工作区main/legacy，保留既有正常控制，
并将生命周期风险从源码观察推进到可重跑复现。额外helper继续由IFRAME-01独立契约覆盖，
本轮不能代表helper的完整迁移验收。

| 场景 | 四份主实现的实际结果 |
| --- | --- |
| 同毫秒两个请求 | id相同；第二回调覆盖第一，第一响应错误地结算第二请求，第一请求悬挂 |
| 已发送后destroy | 监听被移除，但public promises记录和Promise保留 |
| 等待inject时destroy | 200ms定时器仍保留；待旧timer执行才拒绝，不能称为立即取消 |
| 销毁后新请求 | 正常拒绝既有错误消息，没有新timer；作为正向控制 |
| 不同ID乱序/错误 | 正确对应resolve/reject与Error(data)，删除记录 |
| 同ID自定义非error类型 | 同样resolve；这是generic postMessage兼容协议，不能只允许response |
| event.data=null | public receiver抛TypeError |
| 即时发送失败 | Promise拒绝，但请求记录保留 |
| 轮询后发送失败 | 异常逃离timer回调，外层Promise悬挂且记录保留 |
| 销毁后的已保存receiver | 仍可结算旧请求并通知message回调 |
| iframe导航 | injected沿用旧值，未等新inject便发送 |
| 重复child inject | 重复握手，但浏览器式EventTarget对相同handler去重，不能声称重复注册监听 |
| child执行错误/恢复 | 发error后异步拒绝，后续命令正常 |

## 真实浏览器

矩阵4份产物×同源/跨源×6场景×Chromium/Firefox/WebKit，共144项通过。这里的通过是
旧行为/缺陷的复现断言通过，不表示这些缺陷已修复。所有场景都创建实际iframe，使用浏览器
原生WindowProxy、postMessage、event.source与event.origin；没有伪造MessageEvent来源。
跨源使用127.0.0.1与localhost两个实际不同origin，由本地route提供冻结库及可控页面。
首轮5项和120项、最终144项均归档report.json和整个results。

六类场景为：同步/resolve异步/错误/恢复round-trip，同毫秒冲突，destroy后迟到回复，
无关窗口消息，导航到未inject页面，以及原生结构化克隆失败。

无关窗口能让父实例误认inject、结算其请求，还能向另一个子iframe发送commit并让它执行
本地测试的常量表达式。报告保存真实origin/source关系；测试只操作自己创建的本地页面，
不能从这组证据推导其他站点的数据可访问性。

导航后，旧实例提前发出的commit被新页面真实接收，但因尚未inject而丢失；之后inject并
发出新请求可恢复，旧请求仍悬挂。clone-failure使用原生不可克隆函数触发DataCloneError，
分别验证timer中的未处理异常/悬挂与即时拒绝/留记录。只拦截测试刻意触发的DataCloneError
以及固定child错误，其余未处理页面错误仍由通用fixture判失败。Date.now仅为同tick冲突和
两个clone失败的不同ID做受控设置，不能将其报告为自然网络计时。

工具本身不依赖ArtPlayer实例；本轮未创建播放器，不计作旧/新核心媒体集成，也未访问线上demo。
正常消息控制和故障断言保持分离，后续03/04须新增候选修复断言，同时保留历史负例。

## 后续实施约束

保留resove公开拼写、promises公开视图、绑定onMessage、message回调receiver/返回形状、
任意非error的同ID响应、commit函数体/resolve约定及既有错误消息。请求身份、等待timer、
发送异常、销毁和导航的资源归属可在内部修复，必须用相同场景验证旧失败/候选成功。
source/origin与可执行commit的信任模型在IFRAME-03/05单独说明，保留同源/跨源正常使用，
不能将所有历史消息静默改成另一套RPC。

本任务没有修改生产源码、公开类型、协议或版本。完整CI和最终证据核验完成后专用提交；
IFRAME-LIFE-01、IFRAME-TRUST-01仍open，下一项IFRAME-03实施资源与消息边界。

完整CI退出0：1489项（1315单元、14工程、160基线）与44重复契约通过，324生产TS。
最终源码和浏览器报告哈希已核验；本任务完成后立即单独本地提交，不推送或发布。
