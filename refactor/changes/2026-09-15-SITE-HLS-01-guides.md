# SITE-HLS-01：HLS 双语指南与示例生命周期

新增独立 SITE-HLS-01，依赖已完成 SITE-03、PKG-HLS-04；SITE-04 保留全部旧依赖并
增加本任务。这里完成 HLS 使用文档和示例修复，不提前完成 SDK/设备/分发验收。

## 已复现的问题与改动

此前只有弹幕插件有独立双语页面，HLS 侧栏直接跳转编辑器，没有配置、类型、SDK
所有权和原生播放的完整指南。本轮新增两页并把两个侧栏指向本地指南；原示例 URL
仍在指南保留。公开 factory、配置名、同步 update、菜单名与分发入口没有改动。

直接执行原 `docs/assets/example/hls.control.js` 的受控回归得到 2 失败/1 通过：

1. 连续加载三个源后有三个 destroy 监听器；已被替换并销毁的实例会在最终销毁时
   再次被调用。改为示例局部 SDK 变量和一个最终清理监听器，每次替换先释放旧实例。
2. Hls.isSupported() 为 false、video 支持原生 HLS 时仍注册控制插件，但没有
   art.hls；插件后续 ready/update 的实例检查不适用。示例按固定 useHls 能力结果
   安装插件，原生分支保留 video.src，完全不支持时保留原提示文字。

原有 .artplayer-app 容器、外部流地址、SDK 默认配置及全局命名保持不变。音轨标签
在 name 缺失时补充 lang/Audio 字符串回退；示例不引入共享全局 SDK 或新依赖。
这里只修复应用示例，不改变插件对调用方 SDK 所有权或缺少 art.hls 时的错误语义。

## 文档与维护

- 中英文逐项说明 quality/audio 的 control、setting、title、auto、getName，
  省略显示选项意味着隐藏、设置面板还需播放器配置 setting:true。
- 原对象 formatter、可选索引和普通回调 this，重复标签合并、空列表清理、Auto
  对应 currentLevel=-1；音轨没有虚拟 Auto 轨道。
- 解释同步 update 返回 undefined、SDK 自动刷新与没有事件能力时的手动刷新，
  以及菜单选择完成不等于解码完成。
- 完整示例与原 demo 逐字一致，浏览器测试强制核对两页源代码；两页各有一个
  Run Code，均传递固定 SDK URL 和原插件路径。用容器/媒体替换说明指导实际集成。
- 两个 TS 片段使用现有泛型 root 类型，不新增 /runtime 或要求升级调用方接口。
  明确本分支修复未发布，保持 Firefox 已知问题与 Safari/native HLS 验证缺口。
- 包 README/ARCHITECTURE、站点 README 和浏览器测试维护入口同步；新增 Node
  回归加入既有 test:unit，自动进入 CI。没有依赖或 Yarn 锁变化。

通过既有 build:llm、build:docs（含 build:site-assets）生成语料、语言路由与站点。
清单从 28 Markdown/37 HTML 增为 30 Markdown/39 HTML，中英各15页。生成产物
由构建器写入，没有手改 dist、uncompiled 或 VitePress HTML。package.json 只
追加一个已有测试脚本的文件参数；没有改包版本或 packageManager。

## 实际验证与限制

Windows、Node 24.21.0、Yarn Classic 1.22.22；SDK 1.5.17/1.7.2 来自已冻结 npm
归档，插件读取本地 dist 并记录哈希；源媒体从校验过的本地片段提供。源代码不
替换，测试只路由其外部媒体请求、静音播放，并观察实际 SDK destroy 次数。

| 检查 | 结果和含义 |
| --- | --- |
| 原示例 Node 回归 | 2 fail/1 pass，保留原失败日志 |
| 修复后 Node 示例及文档/导航工具 | 20 pass，其中示例3项；不把受控原生分支计成 Safari 播放 |
| 站点构建测试 | 7 pass；真实 VitePress 构建完成 |
| 两份原样 TS 片段 | TS 5.9.3 strict NodeNext、types:[]、skipLibCheck:false，各0诊断 |
| 两页生成内容与链接 | 每页一个 Run Code、18个本地链接，目标均存在 |
| 最终浏览器 | 30 pass、0 skip、0 retry；分项见下文 |
| 只读 lint/生成物检查/计划/风险 | 提交前通过，具体指纹见机器证据 |

浏览器分项：Chromium 153.0.8010.12 / Firefox 155.0 各8项，覆盖两种语言、两版
SDK、新旧核心的初次解码与时钟推进、换源后继续解码以及两个实例各销毁一次。
Hls 默认 enableWorker=true；本测试不采集 worker 输出，不单独证明未发生 SDK
worker fallback。Windows WebKit 26.6 的8项只核对不支持路径不安装插件、未创建SDK、
原提示和清理，不是 HLS 播放通过。另6项是三引擎的双语侧栏导航、文档加载与
Run Code 两个库/源代码参数；它们不打开远端编辑器执行播放。

首轮16 pass/8 fail，失败均为 WebKit 测试误把 notice.show 的布尔 getter 当作
文字；随后改查实际 .art-notice 文本，重新执行30项全部通过。未改产品 notice
语义、未放宽等待或播放断言。首轮/最终报告与 trace 目录分别保留。新增 lint
首次发现 import/格式问题，修正后通过；最终导航测试仅由 lint 改正字符串引号，
断言内容与通过浏览器时相同。

最终计划/风险校验、风险回归2项、站点清单和工具链严格检查通过。暂存源码
diff --check 通过；完整检查报告两个新HTML各两行由VitePress模板产生的缩进空白。
保留构建器原始输出，不手改生成HTML。包README更新会改变下一次打包内容，
最终候选仍须重新绑定完整验收证据，不能复用旧tarball的发布结论。

实际 localhost:8082 页面也通过内置浏览器打开，编辑器出现新 useHls/destroyHls
代码，视频元数据为10:48，画质和英语/西班牙语/解说菜单可见，控制台出现
loadedmetadata/loadeddata/canplay。一次整体浏览器状态查询失败，重新选择同一
tab恢复。该观察没有验证播放按钮、换源或最终销毁，浏览器版本未由此次工具返回，
只计页面加载/菜单证据。没有改写或重启原8082服务。

## 交接与回退

详情见[机器证据](../baselines/hls-docs-validation.json)。保持两个指南完整示例与
docs/assets/example/hls.control.js 一致；修改后运行 test/hls-example.test.js、
document-hls.spec.js、document-site.spec.js，并重建语料与站点、刷新站点清单。

HLS-EXAMPLE-01 在本任务关闭。PKG-HLS-SDK-01 的原生崩溃和1.7.2停滞保持 open；
原生HLS/完整组合/SDK错误恢复/外部媒体与安装包验收仍归既有任务，不因本页完成关闭。
回退本提交会恢复原示例、删除双语指南与导航并恢复相应生成内容；播放器包运行时
及公开类型未变化。本轮不推送、部署或发布。
