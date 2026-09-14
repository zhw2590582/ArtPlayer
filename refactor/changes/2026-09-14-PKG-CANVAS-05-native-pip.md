# PKG-CANVAS-05 Canvas + 原生 Document PiP 检查点

进行中。新增 canvas-dpip.spec.js 验证实际 requestWindow、Canvas/底层 video/字幕
轨道跨文档归属、持续绘制与时间推进、暂停寻址字幕、插件关闭/原生关闭/销毁。
使用真实本地媒体和 VTT，RAF 观察器转发原生调度，不替换 PiP API 或媒体状态。
不支持的引擎只记录能力缺口，不计作原生窗口播放通过。

首轮为源码组合，18 项成功退出包含 Chromium/Firefox 12 项真实窗口播放与
WebKit 6 项 API 不可用记录。初版明确拒绝安装 map，避免把源码 Document PiP
混称为已安装包；报告保留在 canvas-dpip-source-report。

## 安装与 CI 范围扩展

package-check 通过已有 dpip-contract 核对发布文件，将 Document PiP 加入显式
可选包注册表。现在五包经过源码快照、三格式构建、pack、仓库外离线安装和冻结
重装，再校验全部文件摘要。core/chapter 的36运行时、5旧类型+8精确类型模式
仍是原来的两包范围；不把它们当作 Document PiP 的完整消费者验收。

dpipCandidate 现在优先核验显式安装 map，缺文件/缺包/旧输入报错，不再回退到
源码；冻结 workspace 与独立 ARTPLAYER_DPIP_ARTIFACT 覆盖也不能混用。这个
错误已有旧红新绿：此前不存在的安装map被静默忽略，Node测试3通过1失败；
修正后包/runner/CI检查共46通过，包含缺 Document PiP 安装步骤的工作流反例。

installed scope 和 CI 准备步骤增加第五包及 canvas-dpip.spec.js，仍保留完整
source suite、不吞失败、两份独立报告及原消费者执行顺序。main/legacy 的实际
浏览器结果与输入摘要见[证据](../baselines/canvas-dpip-validation.json)：每种格式
均为51项成功退出，其中12项原生PiP、6项API不可用、33项Canvas字幕/生命周期与
Ambilight组合。原生窗口覆盖六种 core/ending 组合各在 Chromium/Firefox 执行，
不把 WebKit 的能力分支计为原生播放。这里不代表远端 CI 已运行。
严格工具 TS、专项/根 lint（0错误/1既有warning）、actionlint 和固定工具链通过。
未新增依赖，也没有更改浏览器重试、超时或媒体断言；新测试初版样式诊断已修复。

## 维护与限制

Canvas、Document PiP 的架构说明和测试/CI入口已同步。本次没有生产运行时修改，
不修改已有全局源码/安装性能门槛。重跑时先提供含五包的安装map，再运行 README
所列命令；source 对照仍独立存在。报告中的 API 不可用分支不是设备支持通过。

PKG-CANVAS-05 仍 doing：实际Safari/移动设备、后台节流和完整生态组合没有闭环。
DPIP-05/06、Canvas-06 及全量远端 CI/发布任务仍开放。作为本任务检查点单独本地
提交，提交审计通过后接续；没有推送、部署或npm发布。回退需一并还原五包CI配置、
加载器、测试与文档，不能只删除安装准备步骤而保留依赖它的新scope。
