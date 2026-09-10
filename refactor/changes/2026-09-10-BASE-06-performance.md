# BASE-06：性能与资源基线

日期 2026-09-10；分支 codex/compatible-modernization；起点 c7a375e1。

## 实现及测量

新增 performance.html/js，使用固定发布核心/chapter 和本地视频。两次前台重载各收集 12 个交错计时样本（每配置 1 预热+5 样本），真实播放推进后销毁；分别测 constructor、ready、play Promise 和 destroy，不用固定延迟声称媒体已就绪。

资源诊断独立于计时，临时追踪定时器/RAF、开启 USE_RAF=true、触发代理事件和销毁前的 pending resize。两轮各 6 组结果一致：DOM/实例/代理账本清空、原代理不再响应、RAF 停止；同时复现 BASE-PERF-01，销毁后的 debounce 触发 resize 并重新创建 notice timer。追踪器记录后自己的额外取消操作没有计入播放器清理结果。

新增独立验证/统计/比较工具、阈值说明、28 个已发布 JS 与 85 个工作区 JS 的压缩体积清单（21 库）。真实发布来源与工作区陈旧产物分开。浏览器报告和测量后的 host CIM 参数均留存；不声称已测内存/GC/GPU 泄漏或获得性能收益。同代码两轮 ready 中位数从约 30ms 到 13-15ms，恰说明需要多组配对比较。

详细结果、ID、环境、范围、阈值和复现见 [性能台账](../baselines/performance-coverage.md)、[浏览器原始数据](../baselines/performance.json) 和 [体积数据](../baselines/sizes.json)。BASE-PERF-01 已分配 CORE-17，关联 CORE-04/18；ENG-08/MOD-03 接续候选比较与改进。

## 验证与接续

两轮 errors/unhandled 和浏览器 error/warn 为空；新增 3 项 Node 测试包含数据无效、后台/假播放、清理失败、忽略预热、重大变慢、不同设备与体积漏项负例，真实发布压缩结果可重算。完整 ci:check、计划/链接、语法和 diff 检查通过。没有修改生产代码、依赖、声明或分发产物，不用历史异常要求候选继续出错。

本任务独立本地提交，主题含 BASE-06；不推送/发布。撤销提交恢复上一个基线服务和测试入口；历史报告由 Git 保留。下一任务 BASE-07：整合差异、vendored/外部依赖与风险，随后继续工程基础和首个 TS 试点。
