# PKG-ADS-05 页面与媒体组合：进行中

起点 fb1cfa70；本步仍 doing。Ads-04 的类型推导修正已由用户明确接受，范围不扩大。

2026-09-12，用户更正：可能被 VPN 规则阻止的是 VAST 脚本，若始终无法加载，可以
记录并跳过，由用户后续修复。授权范围仅 VAST 的 VPN 加载限制，不适用于 Ads，
也不将未执行检查记为通过。Ads 本地脚本加载成功，继续正常验收。

## 已修复与已验证

- 复现销毁前从未初始化广告时，调用方预设的 `template.$ads = undefined` 属性描述符
  被误删。session 的清理增加 root 存在判断，只删除实际拥有的节点引用。
  原失败见 `.cache/ads05-ownership-before.log`；当前源码及三格式194项Node测试通过，
  见 `.cache/ads05-artifacts-node.log`。构建由仓库脚本生成。
- 新增 ads-ui.spec.js，三个核心（实际4.5.5、5.4.1、候选）与三个浏览器引擎，
  验证原生全屏前初始化、外部退出、广告按钮切换、双实例真实视频/静音/销毁隔离、
  实际详情popup与窄屏翻译控件布局。源码、正式main和legacy矩阵分别27项通过。
  报告/完整results分别归档于 `.cache/ads05-ui-source-*`、`.cache/ads05-ui-main-*`、
  `.cache/ads05-ui-legacy-*`。实际查看390px截图，控件和翻译文案无溢出；不是手机真机。

## 真实后台页面验证

无头三引擎和普通headed Playwright实例切换标签均保持 visible，不能算验收。
浏览器连接工具当前返回 nodeRepl.fetch request failed；完整测试Chromium下载多次
30秒超时，日志保留。未改变锁文件或浏览器版本声明。

本机Chrome152.0.7977.84以独立临时profile启动，通过connectOverCDP的noDefaults
关闭自动框架默认模拟。探针实际获得可信 hidden/visible 事件，见
`.cache/ads05-native-cdp-probe.json`。不会连接用户日常profile，不修改document.hidden。

新增可重跑 `yarn test:ads-native-visibility` 和 native-chrome helper：独占8084服务、
读取候选产物、保存trace及报告，最终关闭自建浏览器和服务，临时profile清理有目录校验。
首轮广告集成在4.5.5的isReady等待失败；报告和trace保留在
`.cache/ads-native-visibility-tJauB0/`，日志 `.cache/ads05-native-main.log`。
追加状态观测证实页面初始hidden、无元数据请求，不是脚本下载失败。显式切到测试页
后进一步确认桌面其他窗口遮挡影响；通过单一 --disable-backgrounding-occluded-windows
排除桌面遮挡，只测真实标签选择切换。noDefaults仍保留，不模拟focus或document.hidden。
Chrome刚创建DevToolsActivePort时曾出现EBUSY，启动器有界等待文件完整内容，不重启进程。

最终main/legacy各6组：4.5.5/5.4.1/候选核心分别使用HTML和视频广告，真实可信
hidden/visible事件、后台2200ms倒计时不变、返回后恢复倒计时，视频时间继续推进且
paused=false；再次后台销毁后回前台不出现广告或skip。报告包含浏览器版本、实际
核心manifest、广告产物SHA、各例隐藏/恢复媒体状态和trace。此范围不包含桌面
最小化和真实移动设备生命周期。

最终代码/产物指纹、原失败、main/legacy UI和原生Chrome结果、CI统计见
[验证证据](../baselines/ads-ui-visibility-validation.json)。源码和三产物Node194通过，
本地完整CI835项通过、269个生产TS严格检查、37份核心声明无漂移。

## 尚待完成

真机Safari/移动端和最小化等实际后台策略仍待对应设备证据，05继续doing。Ads核心
支持门槛、资源所有权和桌面UI具体问题已有闭环证据；媒体设备与完整分发不提前关闭。
全包发布、npm分发完整验收不属于本次通过结论。
本批以PKG-ADS-05独立本地检查点提交，保留明确未完成项，无推送或发布。
