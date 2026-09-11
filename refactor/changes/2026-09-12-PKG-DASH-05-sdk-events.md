# PKG-DASH-05：SDK 事件刷新与资源清理

起点 `2ad00730`。本批修复外部 SDK 选择后菜单不更新，新增独立 `sdk-events.ts`，
DASH 现在有六个严格 TS 模块。DASH-05 仍 doing；不改变公开工厂、同步 update、
配置类型、DOM/CSS、入口或调用方 SDK 所有权，没有新增依赖或修改版本。

## 行为与兼容边界

原实现只在 ready/restart/显式 update 时重建菜单。固定真实 dash.js 4.5.2/5.2.1、
新旧核心的外部画质/音轨选择复现 8 项失败、4 项无 MSE 跳过，证明 UI 陈旧。
新增观察器在媒体身份校验后订阅质量、音轨、流初始化/更新、时间和 teardown 七类事件。
同轮事件合并到一个微任务，保留选择过程内 setCurrentTrack、notice、controls.check、
setting.check 的同步顺序和返回标签。formatter 中发出的事件不递归排队。

普通 playbackTimeUpdated 只比较 Auto 布尔值，未变化时不重绘、不调用 formatter。
暂停时纯配置写入且 SDK 没发事件，仍通过原有同步 update 即时刷新；没有引入轮询计时器
或拦截 SDK 方法。没有 on/off 的旧宿主继续支持原有显式更新。

teardown 清理菜单并使排队工作失效，同一 SDK 后续 streamInitialized/Updated 可以恢复。
切换 art.dash 后由 ready/restart/update 绑定新实例。解绑先关闭记录再移除自己的监听，
不删除调用方监听，不销毁 SDK；安装部分失败、off 抛错和同步重入都有回归。
异步 getter/formatter 失败释放监听、清理菜单并报告原始 Error；修复后显式 update 恢复。
显式 update 及同步菜单错误仍以原始身份同步抛出，不把公开 API 改为 Promise。

标准构建重新生成 main/legacy/module 与平铺 docs/compiled。体积约从 5.36/5.80/9.58 KiB
增至 7.24/7.70/13.74 KiB，增加来自监听所有权、调度和失败清理；未引入运行时依赖。
内部职责与维护规则见 [包内架构](../../packages/artplayer-plugin-dash-control/ARCHITECTURE.md)。

## 验证与测试修正

- 源码 Node 144 项、三格式 Node 378 项通过，覆盖两代 SDK、历史契约、清理和事件重入。
- 正式 main/legacy 实际 SDK 各 90 项：62 通过、28 无 MSE 跳过；覆盖实际解码、外部选择、
  Auto、同 SDK attachSource、拓扑清理以及 formatter 错误/恢复。
- 随后新增真实设置按钮点击：main 连同修正后的原生 SDK 对照 20 通过/10 跳过；
  legacy 设置点击 16 通过/8 跳过。已查看 main 设置选择截图，180p 菜单、控制栏和画面一致。
- 正式 main/legacy 的受控 SDK、真实 DOM 与原生 MP4 回归各 84 项通过，没有跳过或重试。
- 完整 `yarn ci:check` 746 项通过（689 单元、14 工程、43 基线），262 个生产 TS 文件严格
  检查通过，核心声明 37 个文件无漂移。lint 零错误，保留既有生成声明的 unused-disable 警告。

DASH-STATE-01 已按当前 representation/track 与 UI 一致的证据关闭；它不涵盖下述 seek、
设备或完整分发验收。任务仍为 217 项：74 done、4 doing、139 todo。

完整 spec 现在定义 114 项；上面的 90 项运行发生在新增设置用例和修正原生对照参数之前，
不能表述为最终 114 项完整运行。报告及全部 traces 已分别归档，未并行覆盖共享输出。

第一次 async error 浏览器验证有 4 项 Firefox 失败：ConsoleMessage.text 没展开 Error.message。
改为读取消息参数并验证 message 和页面内 Error 对象身份，保留一次 warning 断言。
第一次三格式 Node 有 8 项失败：UMD 的 VM console 未转发给外部监听。测试 helper 显式
注入宿主 console 后通过；这两项修正都没有修改生产错误处理或放宽原始错误身份断言。

原生 SDK 对照此前额外传 forceReplace=true，与插件的两参数调用不同。本批将对照改为
相同参数后再验证（包括 main 最新 30 项运行），没有修改公开 seek 目标、放宽等待或重试。
此前 DASH-SEEK-01 的 6 秒边界停滞仍未定位；这些后续通过不足以关闭它。

执行指纹与本地归档索引见 [本批证据](../baselines/dash-sdk-events-validation.json)。
缓存不提交，指纹只用于本机证据追踪；换机器按测试入口重新执行。
Windows WebKit 无 MSE、有效设备、demo 与完整安装分发，以及全项目发布复盘继续保留。
回退应一起恢复事件模块、入口、测试脚本和构建产物，保留历史失败证据。
