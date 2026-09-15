# CI-01：安装验收入口拒绝渲染诊断替换

基线 `eba8c29fa78c8040204bab3dc9773500842a2ddd`。本轮修复安装浏览器验收的环境
策略缺口，CI-01 整体继续 doing。没有修改播放器/插件源码、公开 API、类型、
版本、Yarn 锁或已配置的 CI 矩阵/权限；没有推送或触发远端作业。

## 复现及实现

原 `browserInvocation('installed', ...)` 会接受九个实际启用的 JASSUB 诊断
开关，改变 custom canvas、on-demand、offscreen、asyncRender、rAF读取、
截图、原生bitmap、读取等待及单任务队列。它也接受 Multiple Subtitles 的
`ARTPLAYER_SOURCE_RESTORE_EVENT=1`，用原生事件等待代替既定的Promise/seeking
条件。即使 tarball 哈希正确，这些配置也不是标准安装测试的原条件。

此外，直接 import `playwright.installed.config.js` 仅校验安装字节，会绕过
launcher 已有的 MediaBunny/Iframe/Mask/DASH 诊断限制。本轮用子进程先指定
不存在的 map 和诊断参数：旧配置走到 ENOENT，证明环境策略没有先执行。
原测试结果6通过/11失败，其中10项对应新发现的环境替换，1项对应直接配置路径。

把现有策略抽为 `scope.ts` 的 `verifyInstalledBrowserEnvironment(env)`，
由 launcher 和 installed config 在读取 tarball 之前共同调用，并增加上述
十个精确启用值的校验。错误明确指出变量；不偷偷删除用户选择的诊断参数。
直接配置同时获得原有 MediaBunny/Iframe/Mask/DASH 规则，避免维护两份策略。

这不是禁止播放器用户配置 offscreen，也没有全局关闭异步渲染。标准 native
JASSUB 用例保留显式主线程路径，hybrid 按浏览器能力运行；用例内部显式覆盖
onDemandRender=true/false 的矩阵仍保留。外部环境不能悄悄替换这些既定条件。
明确停用的值允许进入；不替换恢复条件的事件 trace 仍允许。普通 source 和
`yarn test:browser` 诊断继续可用，caller 环境不被修改。

## 验证

固定 Node24.21.0、YarnClassic1.22.22，Windows。

| 验证 | 实际结果 |
| --- | --- |
| 修改前环境回归 | 17项：6 pass / 11 fail |
| 修改后最终入口回归 | 18 pass，含明确停用值、source保持、真实配置子进程、子进程退出0/17 |
| `yarn test:ci` | 77 pass，CI矩阵/汇总/影响/Pages/消费者原规则保留 |
| docs-tools严格类型、scoped lint | 通过；初次lint的对象换行已修正 |
| `yarn test:package --browser` | 20包重新构建、pack、隔离安装及离线frozen复装成功，133.89秒 |
| 安装消费者 | core/chapter 的36项运行时、5旧类型模式、8精确类型模式通过；不是20包全部类型验收 |
| 正常 installed Chromium JASSUB生命周期 | 4 pass / 0 skip / 0 retry；真实视频替换、两种on-demand、重复销毁、无效Worker URL、CSP失败清理 |

原20包 map `run-yqnfgx` 因 DASH 源码已更新被新鲜度检查拒绝；没有绕过检查
或只替换哈希，重新执行正常打包生成 `run-uRbTbe`。新包的浏览器选择、源文件
和归档摘要由原有 verifier 校验，成功用例使用安装后的候选，而不是回退源码。
消费者隔离安装按既有脚本使用 offline/ignore-scripts；本轮没有重新安装根
工作区依赖。没有把安装成功当作历史 WebKit/JASSUB 渲染问题已解决。

脚本维护文档、浏览器说明及CI说明同步更新。机器证据保留前后测试日志、精确
安装map、运行结果、源输入和归档指纹，见
[ci-rendering-policy-validation.json](../baselines/ci-rendering-policy-validation.json)。
提交前计划、风险、风险测试、严格工具链及diff检查通过。

本地已复现并修复的入口缺口登记为 CI-BROWSER-MODE-01；它的关闭范围只包含
以上既有规则和明确列出的十个替换开关，不宣称自动发现将来新增的所有诊断参数。
后续添加能改变断言、fixture、SDK或执行范围的环境开关时，需同时更新共用策略
和对应负例。更多平台、远端CI/取消/缓存验证和完整插件验收仍按原任务执行。
回退本提交仅恢复旧验收环境策略，不影响 npm 消费者的运行行为。
