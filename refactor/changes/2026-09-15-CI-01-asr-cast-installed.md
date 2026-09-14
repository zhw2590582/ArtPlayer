# CI-01 统一包清单并接入 ASR、Chromecast 安装验证

## 工程与加载边界

新增 yarn test:package --browser，从 browser-validation/scope.ts 的 installedPackages
生成额外包清单，与安装浏览器预检使用同一数据来源。默认 core/chapter 与显式
--include 保留；未知/重复/空选项及 --browser 与 --include/--release 混用被拒绝。
工作流、契约负例和维护文档同步，不能在 CI 偷换为手写部分包列表。
此 CLI 属于固定 Node 24 工程工具，不改变消费者运行环境或公开播放器接口。

新增 ASR 六文件与 Chromecast 一文件。ASR 使用实际 WebAudio/Worklet、本地媒体、
原生或明确强制的 capture fallback、音量/CORS/Audio Track 组合；组合分别核验
ASR 和 Audio Track 安装身份。Chromecast 使用真实核心 DOM/点击/本地视频及受控
SDK，不验证接收设备、发现或远端媒体。其余未知真实环境保持各自任务门槛。
候选加载器拒绝安装 map 与显式 artifact 同时使用；已发布输入仍按冻结归档加载。

VAST 主测试 externalize 后替换 wrapper 依赖，不能直接换为完整 bundle 并冒充
真实安装验收，因此未纳入这个范围；实际 IMA 路径继续独立验证。没有修改生产
源码、公开 API、超时、业务断言、依赖或锁文件。历史包内说明中的硬编码清单
改为指向 --browser 与共同清单，防止未来列表和文档漂移。

## 已验证的工程范围

Windows x64，Node 24.21.0、Yarn 1.22.22。--browser 实际创建十四包 run-N2u2Kr，
正常构建/pack/独立安装/冻结复装与完整文件核验通过。通用消费者依然仅验证
core/chapter 的 36 运行时、5 旧类型模式和 8 精确类型模式。

相关单元 357/357、工程 48/48、scoped lint、library 类型、严格工具链、工作流
契约和 actionlint 1.7.12 通过（未调用 shellcheck/pyflakes）。初始未使用 import/
顺序及既有测试行格式错误已改正；旧工作流负例依赖手写包名，修改为禁止手写
部分名单后通过。中间失败日志保留，最终结果明确区分。

完整 installed collection 为 39 文件/1308 项；本轮实际执行新增七文件的 171 项，
三引擎、workers=2、retries=0。结果、实际输入指纹与能力限制见机器证据。
这不代表完整十四包矩阵或远端 CI 全绿；之前 Chapter/Audio/DASH 失败继续保留。
部分既有包的文档措辞在准备快照后更新，发布前仍需重新打包绑定最终内容。

CI-01 仍 doing，ASR/CAST 真机门槛未关闭，没有推送或发布。回退此检查点恢复
十二包名单和手写准备命令，不涉及生产代码回退。

## 实测结果

Chromium 153.0.8010.12 与 Firefox 155.0 各 57/57 通过；WebKit 26.6 为 15 通过、
42 WebAudio 能力跳过。合计 129 通过、42 跳过、0 失败，耗时 173.947 秒，
实际退出 0、无重试；这是新增范围的结果，不覆盖完整 1308 项安装清单。
Chromecast 45 项均为受控 SDK 生命周期；ASR 84 项通过中 48 项选择候选，
其余保留旧包控制。候选 ASR/Audio Track 的八项组合分别记录两个安装身份，
不能把身份条数重复算作测试条数；在 skip 前记录的候选身份不计处理能力通过。

故意继承安装 map 后，source 入口清除它，三个 Chromium 定向用例 3/3 通过：
ASR 原生 Worklet、ASR/Audio Track 组合、Cast 注册点击。四个实际选包身份均为
source-build（组合包含两个包）。源码回归仍是定向范围，不代表全量源码矩阵。
所有输入、命令、统计和 skip 注解见
[机器证据](../baselines/ci-asr-cast-installed-validation.json)。归档目录为
ci01-asr-cast-installed-report 与 ci01-asr-cast-source-report；原始日志和实际退出
状态均保留。无新增运行失败，但 ASR 真机/物理输出、Cast 接收设备和整体发布
门槛继续开放。
