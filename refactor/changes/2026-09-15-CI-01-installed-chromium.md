# CI-01 完整 Chromium 安装包回归

2026-09-15，固定源码 `5e0447fc514b581f7bc02caf175c3ce077bc5ca3`，
Node 24.21.0、Yarn 1.22.22、Windows Chromium 153.0.8010.12。
这是 CI-01 的执行检查点，任务保持 doing；本次没有修改生产、测试或工作流。

## 新安装产物

`yarn test:package --browser` 重新快照源码、构建、打包20个包，并在仓库外完成
离线安装和 frozen 重装。退出0，149.29秒；输出 `run-cRduve`。核心/Chapter
36项运行时检查、旧类型5种编译模式、精确类型8种模式通过；Audio/HLS 另有各5种
安装类型模式及负例检查。报告已知运行时和类型阻断为0，仅适用于上述消费者范围。

20包的源码和安装文件指纹由启动器与浏览器配置再次校验，不退回工作区源码。
tarball、清单、构建/安装日志及浏览器输入映射保留；新安装产物包含本次源码HEAD
对应的维护文档。包版本仍为升级前版本，所有包 next major 准备仍是独立任务。

## 完整浏览器运行

```powershell
$env:ARTPLAYER_BROWSER_ARTIFACTS='D:\github\ArtPlayer\refactor\.cache\packages\run-cRduve\browser-artifacts.json'
yarn test:browser:installed --project=chromium --workers=2
```

运行当前安装测试清单全部77文件、845项，没有文件/grep筛选、重试或诊断覆盖。
**844通过、1失败、0跳过、0重试，948.777秒，退出1。** 运行期间跟踪文件保持不变。
完整报告、截图、trace、调用及退出记录归档到
`refactor/.cache/ci-installed-chromium-5e0447fc5`。
逐文件计数、失败详情、浏览器版本、20包tarball和安装文件哈希见
[机器证据](../baselines/ci-installed-chromium-validation.json)。

唯一失败是 `dash.js 4.5.2: native SDK track switch and paused seek without ArtPlayer`：
`dash-sdk.spec.js:276` 等待 currentTime 大于6.2，7000ms后仍为6。
该用例只加载裸SDK，未创建ArtPlayer或候选插件；与此前源码及定向安装回归一致。
候选DASH在新旧核心与SDK4.5.2/5.2.1的四个稳定边界seek用例全部通过。
DASH-SEEK-01继续open，不更改原失败或将整个运行说成通过。

CI-JASSUB-SOURCE-01 的安装路径也在本轮验证：候选完整包在三套核心上实际
加载WASM/字体、绘制字幕、seek/布局并清理通过。直接销毁插件时宿主仍存活、
worker终止一次且画布清零，随后宿主销毁的既有断言通过。这是Chromium的安装
产物证据，不代替另外两引擎或默认offscreen/hybrid模式的独立门槛。

## 验收边界与后续

本轮包含新旧实现、SDK、受控窗口和能力边界用例；844通过不等于844种原生
功能，也不等于所有插件设备验收完成。20包安装清单不是全部22个workspace，
Thumbnail工具和文档站仍有各自交付门槛；其他库的专用消费者与格式验收保留。
旧的五包三引擎255项报告保持独立，不将不同包范围和HEAD合并为一个绿色矩阵。

下一步用同一安装映射继续完整Firefox/WebKit安装清单，核对真实失败及能力缺口。
此前间歇故障不因这一次Chromium通过而关闭。远端Actions、物理设备、最终major
候选、三轮发布复盘仍未验收；没有推送、部署或npm发布。

此提交只归档证据和更新维护索引，公开JS/TS、事件、DOM/CSS、入口及依赖均未改，
无需额外生产构建或消费者迁移。计划、风险同步与只读检查通过后单独提交
`docs(ci): [CI-01] record complete Chromium installed regression`；回退只撤销本轮索引
和归档摘要，不改变运行时代码。
