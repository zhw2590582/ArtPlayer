# PKG-AUDIO-03：音频同步与资源归属

状态：本步生命周期与结构验收完成；起点 803e8725。02 已冻结真实旧版缺陷。
将媒体状态/操作与 ArtPlayer 事件安装分开，保留公开工厂、同一 audio、同步 update。
修复原生暂停/结束后继续播放、销毁空 src 错误、销毁后的外部 update 和注册中断清理。
本步仍为 JS，04 单独完成严格 TS/兼容声明。负偏移起点等未完整验证项继续由 05 接续，
不为本次资源修复顺便改变偏移/空 URL/同 URL 更新语义。

## 实现和兼容

index.js 只负责读取核心状态、安装/释放订阅、公开 update 和失败回滚。
track.js 拥有 Audio、URL/offset/sync、关闭状态与媒体操作；不接收整个 art、不依赖新核心工具。
两个模块职责清楚，不为拆分额外创建纯转发模块。包内 ARCHITECTURE.md 给出实际入口、
资源归属、时序、错误规则、回归命令及未完成事项。

原生 video:pause/ended/waiting/emptied/seeking 暂停音频；seeked/playing 重新同步并按主视频
实际播放状态恢复。原公开 play/seek/timeupdate 及音量/倍率仍保留。
销毁先关闭入口、解绑所有自有订阅，再关闭媒体状态、pause/removeAttribute('src')/load。
每步清理独立尝试，正常销毁传播首个清理错误；初始化失败保留原始错误。
关闭后的 update/保留事件回调/待决播放拒绝不会重新写入资源或警告；活动状态拒绝仍警告原错误。

保持工厂必传对象、注册/返回同步、公开 name/audio/update、同一元素引用、无自动主视频静音、
空/同 URL 不重载、update 部分配置的运行时支持、默认值和严格漂移阈值。
没有更改公开 manifest/声明（与 1.1.0 冻结 LF 哈希相同）或新增运行依赖；JS/TS 类型不一致
由 04 处理。构建产物只通过正式 yarn build 生成，docs/compiled 三份与包内产物逐字节相同。

## 验证结果

- Source Node 专项 44 项；含候选三格式后 89 项，均通过。六组候选生命周期回归也在
  main/legacy/ESM 执行，不只检查源码；旧版缺陷观察仍绑定旧 npm 归档。
- 完整 CI 583 项（540+11+32）、254 生产 TS 通过。本步两个音频 JS 文件未计为 TS 完成。
- main/legacy 各三引擎 42 项通过，无失败、重试或跳过；各包括 9 项旧缺陷观察、3 项原生诊断。
  新增候选验证确认直接暂停/结束停止音频、直接 currentTime seek 同步、关闭后引用无效及无媒体错误。
- 正式构建通过；main 2102 字节/gzip 973，旧基线 1471/gzip 676。增加 297 gzip 字节用于
  原生事件与资源守卫，不称体积优化。所有分发 SHA 与样本/运行输入见冻结记录。
- 定向 lint 通过；完整 CI 后仅修改浏览器清理断言，额外定向 lint 和两产物矩阵均通过。
  计划/风险表和 diff 检查通过：216 项任务、126 项风险，无未解决事项豁免。

证据：[audio-lifecycle-validation.json](../baselines/audio-lifecycle-validation.json)。
首轮 36 通过、6 失败全部保留：测试错误要求只读 currentSrc 清空，而三个引擎的 audio
和核心 video 均已 src 属性缺失、paused=true、readyState/networkState=0、error=null，
currentSrc 仍保留旧值。改检查这些可观察资源状态，没有修改媒体源码、扩大等待或忽略错误。
这也明确限定清理保证：不会伪造浏览器只读属性。

## 后续与交付

AUDIO-LIFE-01 按已登记范围关闭；不声称所有设备没有泄漏。
AUDIO-SYNC-01 仅原生暂停/结束/seek 问题已修复，负偏移起点/时长边界、真实缓冲和连续切源
仍由 05 保持 open。WAV/WebKit、设备、安装包、类型、示例和版本门槛继续保留。

独立提交主题：`refactor(audio): [PKG-AUDIO-03] separate track ownership and native lifecycle`。
可回退本任务提交恢复旧生产行为及生成产物；不要回退旧发布基线或删除历史缺陷证据。
接续 PKG-AUDIO-04，把这两个职责模块迁移严格 TS，补兼容公开声明和编辑器；无 push/tag/publish/merge。
