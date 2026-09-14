# CI-01 JASSUB 安装包与 Worker/WASM 资源验证

## 范围

共同清单加入 JASSUB 五个浏览器文件。native 渲染在安装模式保留真实 npm
历史 wrapper，并加入安装候选，分别覆盖三个核心。原有 source 命令默认
历史 wrapper 的含义不变；其余三组 wrapper 回归默认构建源码，安装模式
必须读取核验过的安装文件，拒绝冲突 artifact。platform 文件不加载
JASSUB，仅是原生 Canvas/视频的对照。

安装服务将 worker JS、两个 WASM URL 映射到 tarball 安装后的 worker 目录，
核对冻结资源及归档成员摘要。字体仍来自 docs 的固定外部资源，并单列摘要，
不能声称字体在 npm 包中。旧 wrapper 与候选使用相同固定 worker 字节；
没有升级外部资源或修改用户 URL。worker 目录同时加入源输入新鲜度校验。

新增负例验证 worker 源码变化、安装 worker 替换、字体漂移不能静默通过，
服务器 manifest 保留实际资源内容和来源。没有生产实现/依赖/类型/分发入口
变更，也没有改变原来的失败断言与超时。

## 实测

Windows x64 / Node 24.21.0 / Yarn 1.22.22。十六包正常构建/pack/隔离安装和
离线冻结复装通过，run-JYQlOv，63.18 秒，实际退出 0。通用消费者仍仅
core/chapter 的 36 运行时、5 旧类型和 8 精确类型模式；不代表 JASSUB 全部
消费者/许可验收。完整安装清单收集 54 文件/1581 项，本轮只执行新增五文件。

Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6 共 45 项，41 通过、4 失败，
0 skip/重试，63.575 秒，实际退出 1。候选 27 项中 26 通过：三核心、三引擎
的显式 offscreenRender=false 原生字幕组合 9/9 通过；Firefox hybrid 在首次
像素读取等待处失败，尚未进入延迟位图交付分支，关联既有
JASSUB-FIREFOX-OFFSCREEN-01，不宣称新的安装包问题或已修复。另三项是
实际 npm 1.1.0 在 WebKit 三核心组合的历史零帧计数问题，候选对应项通过。
九项无 JASSUB 的原生平台对照通过，不能计为字幕功能通过；hybrid 的能力
回退也不能算完整离屏/颜色空间验证。没有把任何失败转换成 skip 或放宽等待。

每个安装模式 browser-evidence 的 manifest 均核验四个资源摘要：三个 worker/
WASM 来自实际安装文件并与归档成员一致，字体来自单独本地资源；原生字幕
用例另外记录实际 HTTP 响应。manifest 可用资源清单不等同每个用例都请求
全部资源，更不声称两个 WASM 分支在单次渲染中同时使用。

故意继承 map 后 source 入口清除它；Chromium 视频替换、hybrid、绘制失败
恢复三项 3/3，通过附件证明 source-build，32.948 秒，实际退出 0。相关候选
单元 84/84、工程 54/54、scoped lint、library 类型、严格工具链和 CI 契约通过。
初始 lint 的 Buffer 导入与循环缩进已修正，相关日志保留。工程负例还验证
即使本地字节符合基线，归档缺少 worker 成员仍会拒绝。

原始报告在实际进程结束后归档为 ci01-jassub-installed-report、
ci01-jassub-source-report 和 ci01-jassub-collection-report。命令、逐例状态、
失败现场、资源/源码/归档摘要及日志指纹见
[机器证据](../baselines/ci-jassub-installed-validation.json)。CI-01/完整 JASSUB
设备和发布门槛保持开放，
不以本地安装覆盖代替物理设备、持续 GPU/内存或许可材料审查。
回退本检查点恢复十五包安装清单和原有 docs 资源加载，不影响播放器 API。
