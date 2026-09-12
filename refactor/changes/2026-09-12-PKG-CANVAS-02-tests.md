# PKG-CANVAS-02 历史行为与错误回归

对实际npm1.0.0、1.1.0和01冻结工作区运行33项Node测试，覆盖挂起bitmap在pause/
destroy之后完成、重复play产生并发帧、旧帧覆盖新帧、drawImage异常未close、bitmap
拒绝、用户回调异常、回调中同步销毁、延迟订阅在销毁后安装、注册失败未回滚、已销毁
宿主、零尺寸和缺失2D context。正常回调错误语义与资源缺陷分别记录；假Canvas的
NaN仅描述输入赋值，不声称真实Canvas能存储NaN尺寸。

真实浏览器直接执行两个归档及冻结JS，组合实际npm核心5.4.0/候选核心和Chromium/
Firefox/WebKit，36项代理检查加6项独立原生对照。代理检查包含loadedmetadata→
loadeddata→canplay顺序、播放/暂停/seek、resize、切源，以及回调中destroy以后
原生RAF仍被调用。RAF观察器只包装代理的词法引用，仍委托浏览器调度；媒体、Canvas、
bitmap、回调和事件均为实际执行。

首次矩阵30通过/6失败：WebKit的六个正常代理场景透明，视频时间仍推进。等待更多帧、
对同一视频直接drawImage、将其在播放后挂载到页面均未恢复。独立原生video播放前
挂载则三个引擎都读到alpha255；未挂载的WebKit对照为alpha0，另两个引擎仍255。
这将问题收窄到当前WebKit环境的未挂载媒体路径，没有据此宣称所有Safari设备相同。
最终测试明确断言历史透明结果；它们证明旧失败可复现，不是WebKit渲染成功或skip。
03必须以候选实际像素验证修复，不能把原生对照当作代理修复证据。

新增test:canvas并接入test:unit，源码、类型、依赖和构建产物保持本任务开始时状态。
验证结果及保留的失败/最终报告见[证据](../baselines/canvas-behavior-validation.json)。
生命周期风险升级为reproduced，新增未挂载视频像素风险，均继续open交给03～05。

VAST脚本VPN例外继续只适用于VAST；本任务没有使用例外，也没有跳过浏览器场景。
完成检查后本任务独立本地提交，不推送/发布。

首次完整CI在风险索引一致性检查失败：新增风险的JSON台账已更新，生成的risk-table.md
尚未同步。使用risk-register.mjs --write重新生成并重跑CI，保留首次失败日志。

最终专项lint、33项历史Node、42项浏览器及完整CI1024项通过（914单元+14工程+96基线），另44项重复契约观察不计为新增。278个生产TS文件严格检查；状态done，准备独立提交。
