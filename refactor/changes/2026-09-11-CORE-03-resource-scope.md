# CORE-03：内部资源作用域

## 结构与契约

新增核心 lifecycle/scope.ts 与 resources.ts：前者管理同步清理、父子作用域及异常汇总；
后者封装 DOM 监听、定时器、RAF、AbortController 与自有 Blob URL。没有新依赖，
没有把内部能力导出到 Artplayer/utils 或要求旧插件依赖它。

实例可持有长期 scope，切源、字幕请求等单次操作使用 child。子作用域结束会脱离父登记，
不会释放兄弟操作。清理先关闭作用域，再逆序释放；释放登记在调用前移除，重复和重入安全。
单项失败不中断其他清理，最后统一抛出 ResourceCleanupError 并保留原始错误。
显式 release 的错误直接传播，该登记仍只消费一次；后续所有者需在生命周期边界处理。

Cleanup 的返回类型为 undefined，严格拒绝 async/Promise 清理，避免同步 destroy 丢失异步失败。
异步媒体/SDK 关闭将由对应包明确等待，不伪装成同步回收。Emitter 订阅用独立 callback 加入
scope，并通过原 off API 释放；实例和操作各自只清理拥有的资源。

监听保留函数/对象接收者、固定 capture、处理 once 重入和外部 abort；计时器/RAF 完成后脱离
登记，取消后即使已排队的回调被调用也不会工作。缺少 AbortController 时返回 undefined，
请求所有者必须继续防止过期回调。Blob URL 只释放本 helper 创建的 URL，不接管用户传入 URL。

对应 API-04/05/07/10：这是内部边界建立，不改变现有公开行为。CORE-04 才接入播放器的
构造/销毁；当前 Events、历史 timer/request 尚未迁移，BASE-LIFE-04/05 与 BASE-PERF-01
继续开放，不能把本任务的 scope 测试写成播放器泄漏已修复。

## 验证与维护

- test:unit 加入 resource-scope.test.js，共九项资源测试：异常汇总、重入、late add、
  子作用域脱离、独立释放失败、订阅归属、受控 timer、已排队 RAF、DOM/abort/URL 与能力缺失。
- test/types/resource-scope.ts 含四个必须拒绝的类型用例；全部严格源类型和消费者检查通过。
- yarn ci:check：66 项单元、4 项工程、24 项冻结基线，共 94 项通过，无跳过。
- 三浏览器 78 项通过；其中 3 项通过明确标注的 es2015 内部源码 fixture 验证原生 DOM、
  RAF、timer、进行中的 fetch 取消和 Blob URL 撤销。其余为既有发布/工作区播放与插件回归。
  源码 fixture 不冒充安装 tarball；内部代码尚未由公开入口引用。
- 负向控制只允许本 case 的精确 URL、fetch 类型及已观察的引擎错误；其他网络错误不被忽略。
- yarn build artplayer 与 yarn build:i18n 通过，生成产物无 Git 差异。本次未重复执行安装打包；
  没有把上一任务的打包证据冒充本次新执行。

首次浏览器运行 77 通过、Firefox 1 失败：撤销后的 URL 仍能复用已解码图片，说明图片缓存
不是 URL 可用性的可靠判断。测试改为撤销前读出内容、撤销后 fresh fetch 精确 TypeError；
同时验证进行中的 fetch 返回 AbortError。没有修改生产实现去迎合缓存，也没有重试或跳过。
最初 Node RAF mock 误用了不存在的方法创建选项，已改为显式安装并恢复测试全局；生产不打补丁。
执行指纹、首次失败摘要和最终状态见 [验证报告](../baselines/resource-scope-validation.json)。

[核心架构](../../packages/artplayer/ARCHITECTURE.md) 维护所有权、错误协议、内部/公开边界与修改入口。
下一项 CORE-04 需接入实例登记、处理构造失败/重复销毁并补真实播放器回归，再按各任务迁移
具体操作资源。本任务独立提交；回退提交即可恢复文件、脚本和文档。无推送、版本变更或发布。
