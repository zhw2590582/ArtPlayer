# PKG-DASH-CLEANUP-01 保留 DASH 清理的首个原始异常

来源 HEAD：`1c522f181be42f1c3fe5ce309cd42d85e58ac4dc`。
对应 API-04 异常传播、API-05 生命周期和 API-07 控件集成。

## 缺陷、结构与兼容边界

原来四处清理循环使用 `failure ||= error` 记录失败，并用 `if (failure)` 判断
是否抛出。用户通过公开 controls.update 注册的 beforeUnmount 抛出 undefined、
null、false、0、-0、空字符串或 NaN 时，这些值被吞掉，或被后续清理的 Error
覆盖。SDK off 的自定义包装抛出同类值也会受到影响。

新增私有 cleanup.ts，把菜单、SDK 订阅、整个插件的清理调度归到一个实现。
独立 failed 标记与 unknown 原值分别表示“发生异常”和“异常是什么”；继续
执行快照中其余清理，最后原样抛出第一个值。入口的 revision 检查继续在每个
菜单清理动作之前执行；SDK 绑定和菜单所有权仍先失效，防止重入及迟到回调。
八个模块的责任与维护入口在包内 ARCHITECTURE.md 同步说明。

不改公开工厂、同步 update、选项、DOM/CSS、类型及分发路径；没有新运行时依赖、
版本或锁文件变化。SDK 仍由调用方所有。异步 SDK 刷新失败继续清理并 warn；
同步 update/destroy 才沿原调用栈传播错误，未将其改成 Promise。

核心 beforeUnmount 自身的异常可阻止该控件删除。插件会清理其他菜单并传播
原值，不绕过核心回调删除这个控件，也不承诺出错后整个 ArtPlayer.destroy
仍然完成。重复插件销毁、失效回调和剩余监听器释放分别由回归覆盖。

## 复现与验证

新增六项源码回归在未修复候选上全部失败；修复后每项实际遍历七种值，用
独立 threw 标记和 Object.is 检查，区分未抛出/throw undefined、0/-0、NaN。
覆盖 update、destroy、SDK off、后续错误覆盖、兄弟资源释放和重复销毁。

浏览器首轮四项失败来自测试输入复用旧 selector 对象：核心已经在其上定义
不可重新定义的 $control_option。修正测试为传入新的 selector 对象后，仍使用
公开 controls.update 和 beforeUnmount；这次在未修复产物上四项 Chromium
回归均因异常被吞掉而失败。两份失败报告分别保留，首轮不计产品缺陷复现。

源码专项 167 项通过；加载仓库外实际安装并保留的 main/legacy/module 三种
产物后，加上源码及历史对照共 470 项通过。不是新增了 470 个独立回归。
严格包类型、定向 lint、三格式正常构建及严格工具链检查通过。

Yarn Classic 1.22.22 / Node 24.21.0；Yarn pack 后在仓库外离线安装，再冻结锁
重装并逐文件核对。5 组 TS 5.9.3/4.3.5 模块配置的正例零诊断，每组拒绝
8 项非法调用，共 40 个预期错误。脚本保留核对后的安装副本，支持随后直接
验证该份文件，而不重新构建冒充安装产物。

浏览器采用 Windows 上 Playwright 管理的 Chromium 153.0.8010.12、Firefox
155.0 和 WebKit 26.6。结果如下；没有用 Chrome 扩展连接或模拟 SDK 代替实播。

| 输入与范围 | 通过 | 跳过 |
| --- | --- | --- |
| 源码，新增真实核心回调回归 | 12 | 0 |
| 安装 main，完整受控 SDK/DOM/原生 MP4 套件 | 96 | 0 |
| 安装 legacy，同套件的候选插件场景 | 72 | 0 |
| 安装 main，真实 SDK 解码/UI、换源清理、异步错误恢复 | 24 | 12 |
| 安装 legacy，同组真实 SDK 场景 | 24 | 12 |

合计 228 项通过、24 项能力跳过，没有失败或重试；main 中额外的发布旧插件
对照不在 legacy 轮重复执行。三格式 dist、docs/compiled 与安装副本逐字节一致，
安装包 ARCHITECTURE.md 与当前包内文档也一致。根 test:dash-control/test:unit
已纳入新增回归。本轮浏览器和分发核对结果见
[机器证据](../baselines/dash-cleanup-errors-validation.json)。
真实 SDK 播放与受控 SDK 的 DOM 测试分开记录；Windows WebKit 缺失 MSE 的
真实 MPD 场景不能算播放通过。物理设备、完整安装/SDK 矩阵和发布验收仍由
PKG-DASH-05/06 负责。本轮没有推送、部署或发布。

## 回退与交付

本任务单独提交实现、测试、打包产物、文档、风险和任务状态。回退该提交会
恢复四个有缺陷的清理循环，并撤销本次回归和安装副本保留能力；不会撤销
此前 TS 迁移、SDK 自动刷新、菜单导航或 SDK 4.5.2 seek 恢复。
