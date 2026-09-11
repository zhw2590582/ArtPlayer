# 核心阶段验收范围

CORE-22 汇总核心自有源码、公开声明、生成产物和当前固定消费者的自动化证据。
本文件不能作为全部生态包或 npm 发布放行。实际执行结果、源码/产物指纹和剩余事项见
[交付记录](changes/2026-09-11-CORE-22-core-acceptance.md)；任务状态以 tasks.json 为准。

后续 Audio-05 的新组合测试复现了候选核心连续切源丢失播放意图，见
[首轮证据](baselines/audio-combinations-first.json)。CORE-SOURCE-01/CORE-24 作为新发现
继续修复，当前不能据本文件历史阶段结果放行；原有通过记录保留其当时的测试范围。

## 契约与回归入口

| 契约 | 本阶段检查与可重跑入口 | 明确边界 |
| --- | --- | --- |
| API-01 构造/配置 | options、initialization、entry 单元测试；浏览器 options、initialization、template-resources；实际 option-validator 2.0.6 | 保留 getter 读取、默认值、容器身份、错误种类/首错、挂载前失败与回滚；非浏览器构造仍抛错 |
| API-02/03 属性与返回 | playback-properties、facade-properties、public-behavior；浏览器 declarations、runtime-types、initialization；安装 runtime.cjs | 保留描述符、绑定/身份、同步返回及 Promise；只写命令不虚构 getter |
| API-04 事件 | emitter、media-events、listener-registry、event-scheduling、source 及对应浏览器用例 | 比较实际语义顺序与 payload，不冻结浏览器媒体时钟或平台允许的原生事件差异 |
| API-05 生命周期 | resource-scope、instance-lifecycle、initialization；全部浏览器销毁/回滚用例；正式性能资源探针 | 包含多实例、失败构造、连续操作及延迟回调；不等于原生 heap/GPU 泄漏认证 |
| API-06/07 扩展 | plugins、component/setting 的正常/异常/重入用例；published/current chapter 四组合；安装旧插件类型消费者 | 可控自定义插件和 chapter 已有固定发布基线；其余插件的实际 SDK 组合由各包 01/05 步补齐 |
| API-08 DOM/CSS | components、setting 系列、display 系列、字幕/缩略图/截图、accessibility 系列 | 保留原 hooks、鼠标/点击入口，新增键盘和焦点行为；UA/触摸模拟不代表物理设备验收 |
| API-09/10 分发/浏览器 | 隔离 tarball 安装、UMD/AMD/global/CJS/ESM/legacy/i18n/runtime 入口，modern/legacy 三引擎完整矩阵 | es2015 语法不为 WebCodecs/PiP 等能力提供 polyfill；正式目标版本由 REL-09/02 再验 |
| API-11 类型 | check:types、249 个生产 TS 文件严格检查、五组旧消费者、八组精确消费者、真实 Monaco worker 用例 | 旧根入口保留 TS 4.3.5 及历史可编译赋值；可选 runtime 入口提供准确类型且复用原 JS 构造器 |
| API-12 持久状态/资源 | storage、source、subtitle、thumbnails、gesture 单元与浏览器回归 | 保留存储格式和调用方 URL 所有权；远端 SDK/服务协议仍须由对应包验证 |

统一命令是 yarn ci:check、yarn test:package、指定该安装包 ARTPLAYER_BROWSER_ARTIFACTS 的
yarn test:browser，以及同一安装包的 yarn test:performance。legacy 必须映射安装后的
*.legacy.js，不能让测试服务回退到源码。原始冻结报告中的历史结果不自动覆盖新源码。

## 已处置的兼容差异

- 旧切源 Promise 被替代或销毁后以 undefined 兑现，避免新增 AbortError；当前源的真实失败仍拒绝。
  Promise 结束不表示该源曾激活，调用方继续通过 URL/媒体事件确认。见 CORE-09 交付记录。
- 同步插件注册仍同步可见；销毁后延迟结果不再写回实例。重复销毁、失败挂载、移除后的监听器和
  过期异步 UI 更新属于已复现缺陷修正，不是新公开调用形式。
- root 类型保留历史接受范围，可选 artplayer/runtime 精确描述真实返回、访问器和事件数组。
  不使用交叉返回伪装矛盾，也不包装运行时 Promise。见 core-public-types.md 与包内 types/COMPATIBILITY.md。
- 新键盘/焦点和窄屏布局保持原类名、模板、点击回调及普通快捷键。设置树的资源归属、更新回滚和
  显示模式恢复保护真实重入/异常路径，不为压缩体积删除这些已被回归用例约束的行为。
- --art-controls-height 是此次重构增加的派生布局值。原生 ResizeObserver 下改在首次布局通知填充，
  CSS 继续使用单行高度 fallback；旧环境及显式 resize 仍同步测量。它不是对历史公开 API 的删改。

## 性能处置和继续实施条件

模块归因确认主要体积增长来自键盘/焦点、设置树和显示模式的能力及异常路径，TS 与测试工具没有
进入运行时包。CORE-22 已移除设置导航的重复扫描和构造中的一次强制控件布局；不夸大其收益，
也不将原始 gzip/计时阈值上调。native load/DOM 销毁成本不通过异步延迟清理转移出计时区间。

ENG-PERF-01/02 的后续核心性能工作归 MOD-03，并在 REVIEW-01 重新审查。它们保持 open，
表示不能批准发布，也不能宣称性能已经全面达标；保留相同设备媒体三组配对和原始样本。
核心结构及兼容自动化阶段的交付不删除这些任务、风险或后续依赖。

## 仍需全项目完成的范围

- 各 PKG-*-01/05/06：完整发布基线、支持范围旧核心/新插件、新核心/旧插件、SDK/组合/分发；
  chapter 的本轮四组合不能代替所有包，也不能代替它自己的最终进度/质量/全屏组合任务。
- EX-01/02/03 与 SITE：React/Vue、全部 demo/在线编辑器及远端资源；核心 Monaco 场景不是全站验收。
- REL-03、REVIEW-02：物理 Apple/Android、原生 PiP/AirPlay/方向/触摸、外部 SDK、codec/模型及压力环境。
- ENG/MOD 后续任务：完整 GitHub CI/CD、覆盖/提交索引、剩余脚本、性能优化及工具链采用决策。
- REL-09/02 和 REVIEW-01/02/03：逐包下一个 major、最终 tarball、三轮全项目复盘及发布批准。

包内 ARCHITECTURE.md 是实际源码地图；本目录保存迁移与验收记录。
核心 src 下唯一保留的 JS 为有来源记录的第三方 screenfull 文件，不能冒充待迁移的自有实现，
也不能把本阶段完成理解为全部 22 包已迁移。
