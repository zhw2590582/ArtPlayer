# PKG-AMBILIGHT-05 已安装产物组合检查点

## 解决的证据缺口

此前 Ambilight/Canvas 回归通过 helper 在内存中构建源码。即使指定核心的已安装
artifact map，插件仍会构建源码，不能据此宣称整个组合验证了 npm 安装内容。
本次扩展既有隔离打包流程，纳入有冻结发布契约的 Ambilight 和 Canvas：源快照
重建、Yarn pack、仓库外离线安装、冻结重装、逐文件摘要验证后保存浏览器产物。

使用 `yarn test:package --include=artplayer-plugin-ambilight,artplayer-proxy-canvas`。
未审核的额外包与重复包名被拒绝；额外包模式不允许 `--release`。报告明确 36 项
runtime 与 5 组旧/8 组精确类型检查仍只覆盖 core/chapter；另外两包的打包安装
成功不自动成为其全部运行时/类型/发布验收。原有逐包类型矩阵仍独立保留。

## 结构与兼容

把性能模块中通用的安装来源验证提取到 `scripts/installed-artifacts.mjs`，原
`verifyPerformanceArtifacts` 名称作为兼容导出保留。通用验证可指定包集合，检查
安装文件摘要、当前 src/public/package.json 与构建快照，以及锁和构建工具输入。
Ambilight/Canvas helper 收到明确 map 后只加载这些已验证文件；缺包、文件变化、
源码漂移或同时启用 frozen-workspace 都失败，不再回退源码。未设置 map 的原源码
测试保留。没有新增依赖、改变 bundler、库生产代码、公开 API 或声明。

CI 在 Node/React/Vue 消费者之后、浏览器之前额外准备两包的安装产物并更新 map；
避免默认 core/chapter map 触发缺包。性能兼容导出只返回其已校验的两包，不把
额外插件自动加入旧性能基线。配置反例保护新增步骤不能缺失或被跳过；其他插件的
installed/SDK 全矩阵仍归 CI-01，不宣称这次能使整个远端 CI 全绿。

组合测试额外观察两个独立 RAF owner。真实视频解码后通过公开 Canvas callback
绘制九色区域，验证输出 resize 和九格取色，再检查销毁后两队列为空且没有新绘制。
这仍是真实 DOM/Canvas/getImageData/RAF；颜色来自显式后处理 callback，不声称是
自然视频画面的取色结果。5.1.7 核心没有 proxy 配置，明确只测原生 video 能力边界。

## 验证与余项

结果、两次打包差异、产物映射与报告摘要见
[机器证据](../baselines/ambilight-installed-validation.json)。现代首轮 45 项，增强
组合销毁断言后的现代 9 项与 legacy 45 项均使用实际安装产物；legacy 指向同一
安装目录的真实 legacy 文件，其摘要仍须匹配 tarball。三个引擎的旧核心是冻结
已发布版本，新核心/插件/代理来自该次安装；没有用浏览器模拟替代 SDK 或真机。

Ambilight 49、Canvas 57、打包/来源/性能回归 10 项通过。新增反例保护额外包不能
误标 release-ready、显式 map 不得回退源码以及额外插件的源码漂移。包维护说明与
测试流程同批更新。另32项CI配置回归通过，工程合计42项。首轮 lint 的新导入
顺序/未用 import 等已修正；根lint保留1条既有生成声明unused-disable warning。

PKG-AMBILIGHT-05 继续 doing：物理移动设备、剩余完整组合/分发仍缺证据；本次
没有关闭 PKG-CANVAS-05 的字幕/Document PiP/真机要求，也不关闭 CI-01 的全包
消费者与远端矩阵。不推送、部署或发布。回退本检查点可恢复原默认 core/chapter
安装流程与源码 helper；注意不能再把旧 helper 的运行当成完整 installed 组合。
