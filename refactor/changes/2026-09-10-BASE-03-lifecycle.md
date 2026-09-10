# BASE-03：事件、播放与生命周期实测

日期：2026-09-10；分支 codex/compatible-modernization；起点 b382ec08。

## 交付与真实范围

新增 lifecycle.html/js，通过可见按钮运行固定 npm core 5.4.0 + chapter 1.1.0。真实加载本地两个 MP4，验证 metadata、play Promise、时间推进、pause 稳定、seek、质量/URL 切换、ready/restart、Emitter、async 插件及销毁。公开 play 拒绝和切源恢复失败使用明确的受控 video.play 注入，未冒充真实权限/网络/codec 故障。

服务器增加白名单 /reports/lifecycle，保留原 API 报告路径；生命周期报告包含发布成员/媒体哈希及夹具 LF 指纹。来源校验从 api.mjs 提取为共用函数，原 API 冻结数据不变。

## 实测与发现

Codex 内置浏览器最终两次执行，27 项断言通过，语义结果一致；各有 64 条原始事件记录。首次媒体时间从 0 到 0.196562 秒，尺寸 640x360，duration 90.046009；pause 观察 253.2ms，最大时间偏移为 0。只要求关键顺序和状态，不冻结浮动时钟。

已复现六项发布版问题：过期切源也兑现、销毁中切源未结算、销毁后晚到插件注册、重复 destroy 注销其他实例、构造失败后未回收 DOM/监听项、恢复播放拒绝后的未处理拒绝与 pending 切源。后两类 pending 均是有界观察，不能凭 250ms 声称永久挂起。恢复失败为受控错误注入；该路径在当前工作区已有 silencePromise 处理，不能让重构撤销已有修复。

所有正常及失败实例都由探针清理，最终注册数为 0。未预期 errors/unhandled 为空，浏览器 error/warn 日志为空。精确匹配的受控未处理拒绝单独保存在 expectedUnhandled，探针 preventDefault 只用于这一个已登记对象。

完整报告：[lifecycle.json](../baselines/lifecycle.json)。契约 ID、已测/未测范围、复现、六项问题及 CORE-04/08/09 责任见 [lifecycle-coverage.md](../baselines/lifecycle-coverage.md)。这些缺陷不被定义为必须兼容的正常行为，后续修复需正向候选测试和差异说明。

## 验证与接续

新增 lifecycle.mjs 校验及比较命令，两项 Node 负例覆盖假播放推进、意外拒绝、事件颠倒和时钟抖动。原 API、归档/HTTP 基线继续通过；新增检查自动进入 test:baseline。夹具和脚本语法、完整 ci:check、计划/链接与 Git 差异检查通过。

本轮没有修改生产代码、声明、依赖或分发产物，不代表全生态、网络重试、mutex、移动设备或完整资源生命周期通过。对应责任在覆盖文档中保留，ENG-05 再建立正式自动浏览器/故障注入框架。

本任务独立本地提交，主题含 BASE-03；可撤销提交恢复旧基线服务，冻结记录保留于 Git 历史。没有推送或发布。下一步 BASE-04 记录 DOM/CSS 与基础交互，再推进试点所需的类型/分发/测试基础。
