# PKG-DASH-MENU-01：SDK 自动刷新保留设置子菜单

## 问题和根因

此前最终 legacy SDK 矩阵中，Chromium、旧核心和 dash.js 5.2.1 的 180p 设置点击
超时。trace 在点击前显示质量子菜单拥有 `art-current`；失败时设置仍然显示，
但根菜单重新成为当前面板。选项仍存在于隐藏子菜单，所以 locator 已解析但不可见。
原报告保留于 `refactor/.cache/dash-seek-legacy-final-sdk-report`，不覆盖该失败。

SDK 自动事件刷新通过 `update()` 更新质量、音轨两个菜单。核心 `setting.update()`
会回到根面板；两次更新都会重置导航。新增真实 SDK 选择变化的回归用例，在保持
菜单打开时触发实际质量/音轨选择，检查刷新后的当前面板，并用普通鼠标点击选择
另一项。修复前质量用例在新旧核心、两代 SDK 的四个 Chromium 组合全部失败。
这将 trace 中的导航复位现象与可控的真实 SDK 刷新联系起来，没有伪造 SDK 事件。

## 实现、兼容和类型

`src/menu.ts` 在自动刷新前捕获本插件拥有的打开子菜单，两项更新完成后才恢复
新的 selector。恢复要求设置仍显示、当前面板确实回到根菜单、目标仍由插件拥有。
关闭、移除、其他调用方接管及缺少可选导航能力时不恢复，不强制打开设置。
该职责与菜单所有权放在同一模块，不新增只用于转发的抽象或异步资源。

`src/index.ts` 将此逻辑限定在 SDK observer 的自动 refresh 中；公开同步 `update()`
继续保留原有导航行为。恢复与原 SDK 身份、销毁状态、确切 update revision 绑定。
初版的嵌套显式 update 用例有两项失败，补入 revision 守卫后通过；销毁中的最后
lookup 同样不能重新打开菜单。`src/types.ts` 只添加可选内部导航能力的窄类型。

工厂/option/update 签名、SDK 选择顺序、公开声明、DOM/CSS hooks、入口不变。
没有修改核心 setting.update 的语义，没有强制点击或增加等待超时，没有新增依赖。
包内 README 与 ARCHITECTURE 已解释自动和显式刷新、导航及资源所有权。

## 验证

固定 Node24.21.0/Yarn1.22.22，Windows 的 Chromium153.0.8010.12、Firefox155.0。
源码初轮设置矩阵32项通过；增加重入守卫后，完整候选DASH定向矩阵92项通过。
源码及main/legacy/ESM三格式Node446项通过，包内严格TS与专项lint通过；根lint
0错误/1个既有warning。最终含文档tarball在仓库外离线安装并冻结重装，全部
文件指纹核对，五组类型模式通过且各拒绝八项非法调用。

打包产物的main设置矩阵32项、legacy完整定向矩阵92项均通过，0失败/跳过/重试。
任务完成，DASH-MENU-01按根因和旧红新绿证据关闭；完整组合及发布任务仍开放。
浏览器使用核验tarball解出的运行时，类型检查使用实际安装包；不是完整installed
浏览器验收。[最终报告](../baselines/dash-menu-validation.json)记录每个浏览器的
输入SHA、退出码及失败，不以套件名称替代输入来源证明。

一次tarball提取辅助脚本最初把字节传给需要路径的函数，提取失败；随后运行未能
设置产物路径而实际验证了源码。已按附件输入明确归档为源码92项，修正提取后
main/legacy另行运行并核对候选SHA，未把该源码结果计作打包产物验证。

定向候选矩阵仅在命令行排除已冻结的裸SDK与旧发布插件对照；默认完整文件与CI
仍保留它们的原断言。原DASH-SEEK-01的上游缺陷、PKG-DASH-05/06、WebKit能力、
设备、远端CI及三轮发布复盘不因本次菜单修复而完成。

## 重跑与回退

`yarn test:dash-control`、`yarn test:dash-types-package`；设置专项通过
`yarn test:browser:source test/browser/dash-sdk.spec.js --project=chromium
--project=firefox --grep 'SDK refresh preserves the open|actual settings' --workers=2`。
产物验证必须显式设置 `ARTPLAYER_DASH_ARTIFACT` 为已核验的main/legacy文件。
完整候选范围使用 `--grep-invert 'native SDK track switch|published DASH / 4.5.2'`；
去掉过滤将包含保留的历史SDK/旧插件失败。每次运行前先归档已有报告。

回退本任务独立提交并重建DASH三格式即可，不单独修改生成文件。没有push、部署或发布。
