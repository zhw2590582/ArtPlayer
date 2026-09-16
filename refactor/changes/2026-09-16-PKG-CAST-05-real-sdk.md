# PKG-CAST-05 真实 Chrome / Google Cast SDK 检查点

起点 `681eccfa76eb36da87bb85e32a5dbb93037d8c13`。Chrome 扩展连接恢复，本批使用
实际本地编辑器和 Google 远端 SDK，没有替换 Cast API 或模拟接收设备。
结果见[机器记录](../baselines/chromecast-real-sdk-validation.json)。05 从 todo
进入 doing，实际接收端验收尚未完成。没有生产代码、依赖、测试输入或产物修改。

## 实测过程

环境为 Windows / Google Chrome **152.0.7977.84**，通过连接的 Chrome 操作，
不是 Playwright Chromium 或内置浏览器。`http://localhost:8082` 的
`isSecureContext` 为 true。打开原 `example=chromecast`，依赖为实际编译的插件。

1. 现有未编译工作区核心报告版本 5.4.1。点击 Cast 后，bootstrap、Chrome sender
   和 Framework 三个远端脚本均 HTTP 200。Framework 创建成功，实际 CastContext
   返回 `NO_DEVICES_AVAILABLE`，无当前 session；插件原始状态为 null，isCasting=false。
   这不是 npm 5.4.0 或最早支持核心的验证，不将工作区版本当作发布基线。
2. 通过原 Prod 开关切到重构核心 6.0.0。首次点击时 bootstrap/sender 返回 200，
   Framework 子脚本返回 HTTP 502。保留失败；观察时 Framework 未就绪、session
   不存在、bootstrap script 数量为零。未记录到具体 onError/Promise 结算，不能
   用这个快照推断错误通知、超时或用户取消已验证。
3. 再次正常点击后，Framework 返回 200，SDK 就绪，状态仍为无设备，插件未显示
   正在投屏，页面有一个 bootstrap script。
4. 点击原 Run Code，页面保留一个播放器和一个 Cast 控件，观测时 Framework
   未就绪、bootstrap script 为零。这是整个编辑器重跑流程的结果，不单独归因于
   插件 destroy。新实例再次点击后，三个真实脚本均 200，进入无设备状态，
   仍只有一个播放器、一个控件和一个 bootstrap script。

Chrome 的 checkbox 自动化曾在模式切换重载时报告未勾选；随后新 DOM 明确显示
Prod 已勾选且核心版本为 6.0.0，因此没有盲目重复点击。结束时通过 UI 将 Prod
恢复为原先 false，并关闭本次创建的测试页；未修改浏览器权限、代理或用户其他页。

## 来源和证据边界

用 Chrome Network.getResponseBody 读取实际响应，在页面中计算 UTF-8 SHA256。
本地核心与插件两项响应分别匹配当前 docs/compiled 和已登记候选包的对应成员；
不存在只看本地文件、却声称浏览器实际使用该内容的替代验证。

三个远端成功响应也记录了 URL、状态、内容摘要和字符数，首次成功与重跑成功
内容一致。SDK 自己根据当前页面加载了 HTTP sender/Framework 子脚本，本批没有
重写 URL。这些可变远端 URL 的一次哈希不等于锁定 SDK 版本，也不能证明生产
HTTPS 页面的加载行为。502 原始观察保留，不因后来成功而删除。

没有可用 Cast 接收设备，所以未验证 session 建立、接收端播放、源更新、会话
断开或声音输出；无设备状态本身也不证明 requestSession 的拒绝/取消语义。
原确定性 SDK/生命周期测试继续提供受控边界证据，本批真实观察不能替代它们。
下一步按 [Cast 验收说明](../chromecast-validation.md) 在实际接收设备上继续。

## 状态与回退

225 done /24 doing /36 todo。05/06 的设备和完整分发门槛仍在；本批只提交来源、
观察、重跑步骤和状态，没有声称任务完成或发布就绪。计划检查与本地响应/候选
文件摘要核对通过。没有重跑未变的生产测试，也没有修改其通过标准。
发布台账检查确认21库build指纹仍有效，零项因本批文档观察而失效。
撤销本检查点只撤销文档/证据/任务状态；不影响生产 API。
正式复盘仍由用户指导，没有推送、部署、远程工作流或 npm 发布。
