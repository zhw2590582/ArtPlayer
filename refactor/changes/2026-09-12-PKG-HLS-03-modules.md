# PKG-HLS-03：HLS 映射、菜单与订阅分层

## 结构调整

入口只协调核心生命周期、实例绑定和刷新代次；mapping.js 负责标签/选择模型，menu.js 负责
既有 controls/setting API 与回调归属，sdk-events.js 负责 SDK 能力探测、订阅与解绑。
没有引入 Hls 运行时依赖或新公开参数/方法。自有源码仍是 JS，严格 TS 和公开声明迁移继续
由 PKG-HLS-04 完成，不能把本步的源码拆分计入 TS 文件数。

## 缺陷修正与兼容处理

- HLS-UI-01：空 levels/audioTracks 或关闭显示开关时删除相应旧菜单，再恢复时可以重建。
- HLS-LIFE-01：旧菜单回调检查当前实例/菜单归属；核心销毁解绑自身 core/SDK 监听器，保留
  update 调用不再触碰 SDK/UI。SDK DESTROYING 清理自身菜单、永久拒绝该实例重新绑定。
- HLS-AUTO-01：自动策略与实际播放档位分开；真实 Auto 播放的标签保持 Auto，手动选择与
  外部音轨切换通过 SDK 事件同步。无 autoLevelEnabled 能力的旧适配对象保留 currentLevel fallback。
- 重复标签合并时，如果实际选中项位于后面的重复项，用该项的 value 代表同名组，避免丢失
  default；这一内部代表项修正单独测试，不将它称为完全无行为变化的文件移动。
- SDK 事件优先复用未变化的菜单，不在 ABR 事件中反复销毁控件；当前音轨未知时清除旧高亮。
  同步 SDK 事件延后至本次选择操作完成，保留 write→notice→checks→同步返回顺序。
- formatter 销毁/替换实例或嵌套 update 时，旧刷新不能覆盖较新的 UI；SDK 注册异常撤回已经
  安装的监听器并允许重试。没有延后 SDK 写入或将 update 改成 Promise。

公开工厂、name/update、配置、原回调对象与可选索引、控件名、SVG、布局和分发路径保持。
getName 的旧声明缺陷仍属 04；自动模式不再为错误的当前档位标签调用一次 selected getName，
列表命名仍按原对象与索引执行。参见 [包内实际架构](../../packages/artplayer-plugin-hls-control/ARCHITECTURE.md)。

## 验证与范围

证据见 [冻结记录](../baselines/hls-modules-validation.json)。Node 专项含共享发布契约和候选修复；
额外读取本次 build 生成的 main/legacy/ESM 运行同一组正常契约。浏览器使用明确的构建文件，
覆盖新旧核心/插件组合及真实 SDK 外部事件的选中态、菜单节点身份、清理等行为。
Hls 1.5.17、Chromium/Firefox、Windows WebKit 的不支持能力边界与旧版测试分开保留。

本步构建产物及 docs/compiled 副本由正式 build 生成；未手改分发文件。真实 Safari/native、
SDK worker/版本/分组轨道、官方示例和隔离 tarball 消费仍为 05/06，SDK-01/HLS-ENV-01 不关闭。
完整 ci:check 检查类型、lint、工程与旧基线；没有把源码浏览器或工作区 dist 当作 npm 安装通过。
本任务没有改变核心源码，不重复全量核心浏览器矩阵。

最终 Node 专项 56 项通过；加入三个构建格式后 83 项通过。modern/legacy 浏览器各 35 passed、
16 skipped、0 failed/retry；跳过仅 Windows WebKit 的无 MSE 播放场景，能力/失败清理仍执行。
完整 CI 533 项通过（496 单元、11 工程、26 基线），249 个既有生产 TS 文件严格检查通过。
modern 为 5257 raw / 2536 gzip9 字节，发布基线为 3156 / 1439；增加订阅与生命周期成本，
不称为体积优化。package/dist 与 docs/compiled 三格式逐字一致，源/产物/报告指纹已核对。
既有生成 editor 声明的 unused eslint-disable warning 沿用，不手改生成文件。

回退本任务的独立 commit 可恢复单文件实现及其生成产物，保留 01/02 冻结来源和缺陷观察。
下一步 PKG-HLS-04，迁移已拆分模块与兼容公开类型，同样独立提交。
