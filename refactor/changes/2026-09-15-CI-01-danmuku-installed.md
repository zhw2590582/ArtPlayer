# CI-01 Danmuku / Mask 安装产物与原生组合

## 范围和兼容性

十八包共同清单包含 Danmuku/Mask，增加十三个浏览器文件；纯历史基线/负载
文件保留固定归档，其他候选使用正常构建、pack 和隔离安装后的 UMD。
冲突 artifact 会被拒绝，不能回退源码。弹幕 Worker 随正常 UMD 内嵌执行，
没有换成单元测试中的受控 Worker；PiP/Mask 组合分别记录两个包的来源。

Mask SDK 与 solutionPath 资源分别核对。十二个固定本地模型/元数据文件
在安装服务启动时核验并加入 manifest，明确为 local-model-resource，不
把它们描述为 npm 主包内容。代码与二进制必须逐字节一致，只有元数据
允许 Git 换行归一。实际 HTTP 响应另行记录，资源清单不等同全部已请求。

生产源码、API、依赖、类型、资源 URL、既有断言和超时不变。标准安装入口
拒绝 Mask CPU profiling，明确的源码诊断保留。原生 RAF/视频/Worker、
压力、受控调度延迟、CSS/OS 全屏和 PiP 能力继续各自区分；不会将有限
负载通过称为长期稳定性或 GPU/设备验收。

## 验证

Windows x64 / Node 24.21.0 / Yarn 1.22.22。十八包正常构建、pack、仓库外
安装、离线冻结复装和完整成员核验通过（run-ifGhEv，128.40 秒，退出 0）。
通用消费者仍仅 core/chapter 的 36 运行时、5 旧类型和 8 精确类型模式。
完整 installed collection 为 67 文件/1980 项，本轮仅执行新增十三文件。

Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6 各 133 项，合计 399/399
断言通过，0 skip/失败/重试，实际退出 0，耗时 1350.066 秒（22.5 分钟）。
包括 #958 的十八个 16000-row 密度/resize 组合、二十七个实际模型及弹幕
组合、二十四个三轮播放/两档密度压力案例，以及原有输入、调度、资源和
新旧版对照。二十四个全屏用例验证三轮生命周期。

PiP 共四十八项：Chromium/Firefox 各十六项实际运行，分别保留旧版 DOM
留存和候选清理断言；WebKit 十六项是原生 API 不可用对照，不算窗口播放。
候选/旧版选择与组合的包身份分别统计，不能把身份数当唯一测试数。固定
SVG mask 边界用例不运行模型；压力和 CPU/异步间隙用例的受控部分仍显式
记录。十二个模型资源在所有安装 manifest 中一致，逐例请求另行记录。

故意继承安装 map 后，source 入口清除它。Chromium 的 #958 uniform、
替换加载/销毁、候选核心与候选弹幕的真实 Mask 组合三项 3/3，通过四个
source-build 选择身份核验（组合含两个包），64.914 秒，实际退出 0。
单元 323/323、工程 49/49、scoped lint、library 类型、严格工具链和 CI
契约通过。没有新增依赖或生产 API 改动。

进程终止后归档 ci01-danmuku-installed-report、ci01-danmuku-source-report
和 ci01-danmuku-collection-report。逐例结果、来源/源码/资源/归档摘要与
日志指纹见[机器证据](../baselines/ci-danmuku-installed-validation.json)。
此前 Chapter/Audio/DASH/JASSUB 的失败未被本轮重跑或关闭。

## CI 运行时间与剩余工作

本地仅这批安装用例已耗时 22.5 分钟；现有 browser-smoke 的 60 分钟任务
还串行包含全量三引擎 source、installed、消费者与性能等步骤。这不是远端
超时的实测结论，但足以要求后续 CI-01 进行分片和实测时间核定，不能靠
删压力用例或盲目扩大超时收尾。远端工作流尚未运行。CI-01 及各包
集成/设备/发布门槛保持开放，没有推送或发布。回退此检查点恢复十六包
安装清单和原有浏览器候选/本地模型读取方式。
