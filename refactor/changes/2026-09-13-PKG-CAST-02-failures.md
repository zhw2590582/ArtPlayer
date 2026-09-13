# PKG-CAST-02 受控 SDK 与错误基线

新增65项1.1.0及冻结工作区缺陷/边界观察，连同01的28项公共行为共93项通过。
这些测试验证历史错误确实可复现，不代表候选已修复；所有SDK/DOM均明确受控，
没有连接真实Cast设备、请求远程SDK或验证实际媒体播放。

## 已复现与下一步修正

| 风险 | 精确复现 | 03的修复方向 |
| --- | --- | --- |
| CAST-SDK-01 | requestSession成功返回undefined，旧click把它当session后在loadMedia处TypeError | 请求结算后读取getCurrentSession并处理null和过期归属 |
| CAST-LOADER-01 | 已就绪Framework仍等待过去的availability；两实例覆盖handler、插两脚本、首click不结算；回调中setOptions异常逃逸 | 共享可重用加载协调、真实ready检测、保留外部handler、单一错误边界 |
| CAST-LIFE-01 | 无destroy订阅/解绑，销毁后仍回调和加载；第二实例改第一图标；复用工厂共享状态 | 实例范围控制器、控件节点归属、代际取消及独立监听释放，不擅自结束共享会话 |
| CAST-STATE-01 | SESSION_ENDED更新原始getter但图标/归一化回调仍connected | 完整终态映射，保持getter返回SessionState |
| CAST-ERROR-01 | loadMedia拒绝另起脱离链，click已fulfilled而末端Promise拒绝 | 返回并await完整加载链，原错误与单次onError、notice有明确归属 |

另验证false availability、用户拒绝会话、脚本失败后重试残留、当前art.option.url、
live回调替换与this===option。SDK自身返回的Promise链由测试独立观察并附拒绝处理，
没有修改插件全局Promise或把孤立拒绝伪装成click拒绝。

来源规范：[CastContext](https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastContext)、
[CastSession.loadMedia](https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastSession#loadMedia)、
[SessionState](https://developers.google.com/cast/docs/reference/web_sender/cast.framework#SessionState)。
1.0.0的提前SDK加载、仅name结果、已有SDK可立即注册及原始加载拒绝在01中单独冻结；
不把1.1.0新增的回调/getter测试强行套给1.0.0，也不将它列为skip。

新增失败文件接入test:chromecast及test:unit。精确输入和日志哈希见
[证据](../baselines/chromecast-failures-validation.json)。生产源码/声明/产物未改，不进行
无意义重构建。03接着拆分loader/SDK适配/实例会话/UI与清理，并解决VENDOR-10图标
来源问题；04处理精确类型，05保留真实HTTPS Chrome/接收设备/媒体可达性门槛。
这些问题按已有任务修复，不仅记录后搁置；本步单独提交，不推送或发布。
