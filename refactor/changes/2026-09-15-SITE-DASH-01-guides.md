# SITE-DASH-01：DASH 双语指南与示例生命周期

本任务从 SITE-04 拆出，依赖已完成 SITE-03 和 PKG-DASH-04；父任务全部旧依赖保留。
本次完成 DASH 使用指南与示例修复，不提前完成 PKG-DASH-05/06 或整站验收。

## 复现与改动

直接执行原 docs/assets/example/dash.control.js 的三个受控回归全部失败：

- 三次加载累积三个 destroy 监听器；最终销毁会再次调用已经释放的旧 SDK。
- MediaSource 不支持时仍调用 SDK 控制插件工厂；该分支没有 SDK，安装没有意义。
- 实际 SDK 允许音轨 lang 为 null，原 getName 直接 toUpperCase 会抛错。

修正后，示例局部 dash 变量管理所有权：换源先释放旧 SDK，清空局部引用，再创建
并赋给 art.dash 后 initialize；播放器只注册一个最终清理监听器。重复调用这个
清理函数不会重复销毁实例。useDash 固定在该播放器实例的能力分支，不支持时保留
原提示文字、不创建 SDK 或插件。音轨标签保留现有大写语言，缺失时依次回退到
字符串化的 id（包括0）和 Audio。三个回归全部通过。

保留原容器、媒体 URL、插件名称、配置形状、SDK initialize 参数和默认设置。
改动限于应用示例，没有改变插件公开 API、类型、SDK版本选择、同步错误语义或
SDK归属。没有把 dash.destroy 的调用次数当作所有异步底层资源都已证明释放；
特殊应用的异步SDK关闭策略仍由集成层负责。

## 文档和架构

新增 plugin/dash-control.md、en/plugin/dash-control.md 和中英文侧栏。
两页完整 Run Code 与实际 demo 逐字相同，由浏览器测试启动时强制检查。
只有一份相同代码参与每组真实SDK验证，不为了两个语言副本重复同一播放过程。

指南覆盖配置默认值、空列表、重复标签、原对象 formatter、只有一个参数与无绑定
this、音轨空语言；区别 SDK4 qualityIndex 和 SDK5 representation ID，保留0值。
说明手动选择关闭视频ABR、Auto只修改相应开关，音轨传原对象且无额外Auto轨道；
同步选择结束不意味着解码完成。

说明 ready/restart、SDK事件合并刷新、暂停修改设置后手动 update、同步返回值、
异步观察失败的警告/恢复、SDK所有权与旧回调失效，补齐泛型TS示例和两代SDK类型
差异。明确当前重构尚未发布，不能把无版本CDN当作本分支代码，也不把Windows
WebKit能力检查当作Safari/设备播放。原外部编辑器URL仍从指南可达。

包 README/ARCHITECTURE、站点 README、浏览器维护说明一起更新。
Node 示例回归加入既有 test:unit，自动进入现有CI；没有新增依赖或锁条目。
通过 build:llm、build:docs（含 build:site-assets）生成全部相关输出，站点清单
从30 Markdown/39 HTML增为32 Markdown/41 HTML，中英各16页。
没有手改 dist、uncompiled、生成HTML或脚本产物。

## 验证

Windows / Node24.21.0 / YarnClassic1.22.22 / TypeScript5.9.3。

| 检查 | 结果及限制 |
| --- | --- |
| 原示例回归 | 3 fail，保留原失败日志 |
| 修复后示例、文档流程、导航工具 | 20 pass，其中示例3项 |
| 站点构建测试 | 7 pass，真实VitePress构建完成 |
| 两页原样TS片段 | strict NodeNext、types:[]、skipLibCheck:false，各0诊断 |
| 静态生成页 | 两页各1个Run Code、20个本地链接，目标均存在 |
| 浏览器首次及最终运行 | 18 pass、0 skip、0 retry、0 fail，无测试断言调整 |
| lint、站点产物/语料/清单、工具链、计划和风险 | 提交前通过，机器证据保留指纹 |

浏览器的8项真实播放来自 Chromium153.0.8010.12 和 Firefox155.0，各两版SDK
（4.5.2/5.2.1）×新旧核心：初次时钟和解码帧推进、菜单出现、switchUrl 后继续
解码、旧/新SDK分别销毁一次。SDK来自冻结npm归档，原示例远端媒体请求路由到
哈希校验过的本地MPD/片段。只对 SDK 创建/销毁加透明计数，不替换方法结果、
视频帧、网络响应内容以外的播放行为或SDK设置。

Windows WebKit26.6的4项仅验证无MSE时不创建SDK、不注册控制插件、显示原提示
并清理；另6项是三引擎双语导航、生成页及Run Code两个库/代码参数。它们不是
外部编辑器播放或真机验收。原有完整SDK/DRM/暂停seek/安装包矩阵继续由既有任务负责。

内置浏览器也打开实际 localhost:8082 的原DASH示例URL，编辑器显示新的 useDash
和 destroyDash；视频时长12:14，画质菜单含1080P/720P/480P/360P/288P/Auto，
音轨EN/EN-AU/ET-ET，控制台出现loadedmetadata/loadeddata/canplay。这个只计
页面加载和菜单观察，没有执行点击播放/换源/销毁；工具未返回浏览器版本。
未重启或修改已有8082服务。

最终风险回归2项通过，计划/风险与站点清单检查通过。暂存源码diff --check通过；
完整检查报告两个新HTML各两行VitePress模板生成的缩进空白，保留原生成输出。

## 交接与回退

见[机器证据](../baselines/dash-docs-validation.json)。改示例时同步两页并执行：

```sh
node --test test/dash-example.test.js
yarn test:browser document-dash.spec.js document-site.spec.js --workers=1
yarn test:site-build
yarn build:llm
yarn build:docs
node refactor/scripts/site-inventory.mjs --write
node refactor/scripts/site-inventory.mjs --check
```

DASH-EXAMPLE-01 在本任务关闭；PKG-DASH-05、其余插件双语文档、整站及发布验收
保持原状态。包README更新会改变后续tarball，最终候选必须重新绑定验收证据。
回退本提交恢复原示例与导航，移除两页和相关生成内容；播放器/插件生产源码及
公开类型不变。没有推送、部署或npm发布。
