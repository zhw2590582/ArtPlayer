# DASH Control 验证与维护入口

PKG-DASH-02 保护真实 npm 1.1.0 的既有调用契约，以及重构前工作区的 SDK 5.x 稳定 ID
修正。版本来源见 [发布契约](baselines/dash-control-contract.md)。本步没有更改生产实现。

## 可重跑的测试

- `yarn test:dash-control`：原有 5 项过滤/稳定 ID 回归和新增 69 项行为测试，共 74 项。
  该脚本和 `test:unit` 都保留旧测试，完整 CI 自动执行。
- `yarn test:browser test/browser/dash-control.spec.js --trace on`：48 项，两个核心、两个插件、
  两类菜单、两种选择、Chromium/Firefox/WebKit。浏览器套件串行运行，避免共享端口和报告覆盖。
- `yarn ci:check`：工具链、计划、lint、声明漂移、严格类型和 Node/基线测试。

Node helper 分别加载当前源码、固定 Git 提交的旧工作区 UMD、实际 npm main/legacy/module。
Git 内容以 LF 指纹核对，发布归档与成员以原始字节指纹核对。`ARTPLAYER_TEST_DASH` 可指定
待测产物，以系统路径分隔符连接；未设置时不会把源码测试冒充三种候选产物验证。

`test/helpers/dash-control.js` 只提供可控 SDK 方法和组件注册表，检查 this、类型参数、
原始轨道身份、调用顺序、错误身份、ABR 配置保留、换 SDK、多实例和关闭后的引用。
真实旧实现的缺陷观察保持冻结；03 修复时为候选实现新增正确行为断言，不把历史缺陷当作兼容要求。

浏览器使用真实发布/候选 ArtPlayer DOM、真实发布/候选插件和本地原生 MP4。SDK 方法可控，
断言真实点击触发的参数及控制栏/设置同步，再通过真实播放按钮验证视频时钟推进、无媒体错误。
**没有加载 dash.js，没有验证 MPD、ABR 自动切换或自适应流解码。** 这些仍是 05 必须完成的
固定 dash.js 4.5.2 / 5.2.1 集成验证。`ARTPLAYER_DASH_ARTIFACT` 可替换插件脚本；本次没有使用。

## 首次失败与证据

首次浏览器运行 24 通过、24 失败；全部失败位于设置选项文字定位。trace 中选项确实已渲染，
整行文本包含图标 SVG 的换行，`^fr$`/`^720p$` 不能匹配。改为当前面板内专用
`.art-setting-item-left-text` 的精确文本定位；保持原有调用、同步和播放断言，没有增大超时或跳过。
补充清理前行文本诊断，最终 48 项通过；候选设置选择的截图已人工查看，文字与控制栏一致。

首轮与最终报告、全部结果/trace 目录都保留在本地缓存；输入和证据指纹见
[本步执行记录](baselines/dash-validation.json)。缓存不入 Git，永久保存的是测试、来源和结果摘要；
换机器应按上述命令重新取得执行证据，不能声称本地 trace 已上传。

## 下一步缺陷与边界

- DASH-SDK-01：两代旧实现分别在另一代 SDK 方法表上失败。03 通过能力适配恢复旧用法。
- DASH-LIFE-01：空列表/禁用后 UI 残留，旧回调仍写旧 SDK，销毁后 update 和订阅仍有效。
- DASH-STATE-01：克隆当前轨道、重复标签、数字零 representation ID 会丢失高亮。

这些受控复现仍是 open，不能以本步绿色测试关闭。03 处理结构、清理与正确当前项，04 完成公开
类型兼容，05 完成真实 SDK/媒体/组合验证，06 完成包分发验收。物理设备和 npm 发布准入仍待完成。
