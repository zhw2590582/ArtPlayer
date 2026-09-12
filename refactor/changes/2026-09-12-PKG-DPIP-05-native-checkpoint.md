# PKG-DPIP-05 原生窗口与文档归属检查点

任务保持doing。新增原生窗口测试覆盖发布核心5.4.0/候选核心、原生video/Canvas/MediaBunny、
Chromium/Firefox/WebKit，18项。实际requestWindow从真实点击发起，测试进入Playwright
捕获的真实popup，发送键盘按键，两轮开关还原均验证节点身份、媒体时钟、快捷键次数和占位符。
输入框用真实press而不是fill，避免漏掉keydown拦截问题。API缺失单列对照，不算播放通过。

## 已定位并处理的问题

1. Firefox的Playwright Page.close命令挂起，随后出现Browser.removeBrowserContext协议错误。
   trace中Page.close没有返回；改用原生documentPictureInPicture.window.close成功，还原断言
   保持。保留六个失败和完整trace，不延长超时、不改为跳过，也未修改播放器以迎合工具。
2. 核心5.4.0在PiP输入框误触发KeyQ并preventDefault。候选核心正常。旧插件1.1.0与旧核心
   同样复现，属于BASE-DOM-16，候选核心已在CORE-17按事件所属文档修复。新测试明确断言
   旧核心的输入失败/误触发次数作为历史对照，不能把旧核心输入体验宣称为已修复。
3. 候选核心开启FULLSCREEN_WEB_IN_BODY时使用全局document.body，会将PiP内播放器抢回
   opener。原生candidate/video场景在修改前失败；修复display/web-fullscreen.ts，改为读取
   player.ownerDocument.body。公开接口、默认值、全屏事件与退出还原逻辑不变。增加独立iframe
   真实DOM测试，覆盖当前文档body、原父节点/兄弟节点及焦点还原；它不是原生PiP支持证据。

修复后的源码两文件浏览器回归84项通过。构建main通过219项相关回归，legacy通过84项；完整CI1418与44重复契约、
3个导入/SSR文件通过，324生产TS，最终源码/产物/报告哈希一致。每次浏览器运行的report.json及整个results均已归档，包含失败证据。

## 接续

仍需验证真正的原生全屏与PiP交互、后台/不可见opener、支持范围中的物理设备，以及完整
包安装/示例路径。网页全屏不等于原生Fullscreen API。PKG-DPIP-05与PKG-MB-09保持doing；
PKG-DPIP-06负责后续分发。此次修复不要求旧用户改变调用，也不推送或发布npm。

每个产物的18项原生矩阵包含：6个候选核心正常场景、6个旧核心带既有输入框缺陷的
窗口还原场景、6个WebKit不可用对照，不能将18项全部称为正常原生播放。
219项还包含iframe与受控生命周期/方向场景。三格式dist/docs复制一致；核心构建清理
i18n后已用标准build:i18n恢复全部既有产物，无额外i18n差异。
见[验证证据](../baselines/dpip-native-validation.json)。DPIP-DISPLAY-01关闭，任务仍doing。
