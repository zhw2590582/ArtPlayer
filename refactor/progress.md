# 进度与证据

## 最新完成：PKG-HLS-03 源码分层与生命周期修复

HLS control 已拆为入口、选择映射、菜单管理、SDK 订阅四个 JS 模块，保持公开入口和同步调用；修复空轨道旧菜单、过期回调、Auto 标签、重复组丢失选中态，并补事件同步、销毁/订阅失败恢复及重入保护。公开类型和严格 TS 迁移属于下一步 04。

56 项 Node 专项通过，加入三种构建格式后 83 项通过；完整 CI 533 项、249 个既有生产 TS 文件通过。modern/legacy 浏览器各 35 passed、16 skipped，无失败/重试；Windows WebKit 的 MSE 缺口未关闭。三份 package/dist 与 docs/compiled 一致，modern gzip 为 2536 字节（发布基线 1439），不声称体积优化。

见 [交付记录](changes/2026-09-12-PKG-HLS-03-modules.md)、[冻结证据](baselines/hls-modules-validation.json) 与包内 ARCHITECTURE.md。HLS-UI-01/LIFE-01/AUTO-01 已按范围关闭，SDK-01/ENV-01 与其余发布门槛仍 open。64 done、151 todo；本任务独立本地 commit，核实后进入 PKG-HLS-04。没有 push/tag/publish/merge。

## 最新完成：PKG-HLS-02 行为与 SDK 基线

45 项 HLS Node 契约通过，覆盖源码及发布 main/legacy/ESM；完整 CI 522 项、249 个生产 TS 文件通过。真实 Hls.js 1.5.17 与本地双档位/双音轨流验证四组合的解码、实际选择、pause/seek、切源、失败恢复和销毁。

浏览器结果为 31 passed、14 skipped；Windows WebKit 26.6 没有 MSE/ManagedMediaSource，能力/失败清理通过不能替代其播放矩阵。首轮 14 失败及定向诊断已保留，Safari/native/worker 等缺口仍 open。旧 Auto 标签与空音轨菜单残留有真实 SDK 复现，过期回调有受控证据；HLS-03 将修复这些问题。

见 [测试说明](hls-validation.md)、[冻结证据](baselines/hls-validation.json) 与 [交付记录](changes/2026-09-11-PKG-HLS-02-tests.md)。63 done、152 todo；本任务独立本地 commit，核实后进入 HLS-03 职责拆分。HLS 生产源码尚未迁移 TS，类型和全发布矩阵继续按 04～06 执行，没有发布放行。

## 最新完成：PKG-HLS-01 发布契约

HLS control 1.1.0 的六文件归档、历史源码、声明/README/manifest 与两段主逻辑对照通过。新增独立冻结记录及只读重验工具；保留 BASE-01。空轨道旧菜单、过期回调、Auto 状态、getName 类型及示例清理已映射到后续任务，没有把静态观察写成 SDK 或浏览器通过。

见 [契约](baselines/hls-control-contract.md) 与 [交付记录](changes/2026-09-11-PKG-HLS-01-contract.md)。62 done、153 todo；本任务独立本地 commit，核实后进入 PKG-HLS-02 的旧版行为测试。完整目标与性能/发布剩余事项不变。

## 最新完成：CORE-22 核心结构与兼容自动化验收

核心阶段完成，完整目标继续覆盖全部 22 包。本任务在设置导航优化之外，按实际 CPU 热点移除了原生 ResizeObserver 环境中构造时的额外控件布局读取；首次布局结果、fallback、窄屏字幕与销毁都有三引擎回归。三个生产 TS 模块、生成产物、诊断脚本及包内架构说明同步交付。

最终安装包 run-vynq7l：modern/legacy 全量各 1761 项（每引擎 587 项）通过，零失败/重试/跳过；34 个运行时、5 组旧类型、8 组精确类型通过，107 个分发/声明文件与三份 docs 核心产物匹配。完整 CI 476 项、249 个生产 TS 严格检查和三个导入检查通过。最新 Node 覆盖率四个关键文件的行/分支/函数均 100%，总体行 60.90%；浏览器数量不合并为覆盖率。

新三引擎三组配对均完整，54 次候选资源清理通过，本轮没有构造计时信号；WebKit 第一组 chapter 销毁增加 44 ms、第二组 core 增加 30 ms，仍需复核。现代 gzip 58434 字节，体积风险保持开放。ENG-PERF-01/02 由 MOD-03/REVIEW-01 接续，不改变历史阈值或豁免发布。SDK-12 的同步 validator 集成范围已补齐并关闭；其余插件、外部 SDK、真机、全站/消费者、完整 CI/CD、逐包 major 和三轮复盘仍待原任务完成。

见 [核心验收范围](core-acceptance.md)、[最终证据](baselines/core-acceptance-validation.json) 和 [实施记录](changes/2026-09-11-CORE-22-core-acceptance.md)。当前 61 done、154 todo；本任务独立本地 commit，提交后以 Git 核对。下一步 PKG-HLS-01，先固定 HLS control 的发布契约，再迁移与验证该插件；不把当前 chapter 四组合当作全部旧插件已通过。没有 push/tag/publish/merge。下方记录保留各阶段当时的状态。

## 当前实施：CORE-22 设置导航优化与新安装包复核

已修改设置键盘与焦点 TS 模块：无关按键不再扫描面板；选定目标实时复核后直接聚焦，保留失效目标的原回退。40 按钮探针的正常导航从两次扫描/80 次样式读取降至一次/41 次；三引擎结果一致，动态隐藏/inert/禁用/tabindex、恢复及移除后的实际焦点通过。没有跨事件缓存或公开 API/声明变更。

完整本地 CI 476 项、249 个生产 TS 文件通过；设置/布局/所有权/交互/网页全屏/快捷键三引擎组合 327 项通过。新安装包 run-UElxNR 通过 34 运行时、5 组旧类型、8 组精确类型，107 个工作区分发/声明文件和三份 docs 产物与安装包匹配；三个导入检查通过。安装包 modern/legacy 的设置键盘专项各 36 项通过，无失败、重试或跳过。这些是专项证据，不是当前产物的全量浏览器验收。

现代包 gzip 为 58429 字节，比 ENG-08 增加 55 字节；减少重复 DOM 工作不等于体积优化。新三引擎三组配对均完整，54 次候选资源清理通过，但 Chromium 个别组有构造/销毁信号，WebKit 一组有销毁信号；Firefox 本轮无计时信号。固定计时夹具默认关闭设置面板，不能用这组计时解释导航改动的收益。已保留样本，并将 ENG-PERF-02 扩展为构造及销毁计时待复核；两个性能风险继续 open。

详见 [阶段冻结证据](baselines/core-setting-navigation-partial.json) 与 [实施记录](changes/2026-09-11-CORE-22-core-acceptance.md)。下一步继续默认构造/销毁路径的实际开销归因、设置树/显示模式的可避免体积审查，再完成核心公开差异与新安装包全量矩阵。CORE-22 仍 doing，60 done、1 doing、154 todo；本任务尚未验收完成，无新的完成 commit，未推送或发布。

## 当前实施：CORE-22 恢复核心完整验收

ENG-11 提交 5efc7f76 已核实，三个格式的核心产物字节未变。CORE-22 的新增前置已完成，恢复 doing；60 done、1 doing、154 todo。接下来审查设置树/显示模式开销、间歇构造耗时和核心完整兼容性，现有两项性能风险仍 open。

## 最新完成：ENG-11 构建归因；CORE-22 保留待验收

新增正式构建 --analyze 开关，三个格式的产物字节不变，报告仅写本地缓存。实际构建夹具覆盖 TS/JS/Less/SVG/worker，并验证分析前后内容和清单一致。476 项 CI 通过，最终报告计量修正后另跑 lint 与实际构建测试通过；当前核心三格式均与 ENG-08 指纹一致。

起点源码用当前工具链重建后 gzip 35703 字节，当前 58374；样式单独只增加 277 gzip 字节。历史产物表明键盘/焦点、设置树和显示模式三阶段贡献约六成净增量，没有发现 TS/测试工具进入播放器。模块渲染计量和压缩差异分开记录，见 [归因说明](build-analysis.md)、[证据](baselines/bundle-attribution.json) 和 [交付记录](changes/2026-09-11-ENG-11-build-analysis.md)。这不是优化收益或风险关闭。

工具从核心总验收拆为独立任务，总计 215 项，60 done、155 todo。ENG-11 以独立本地 commit 交付；核实后恢复 CORE-22 doing，继续审查实际开销和核心完整兼容性。ENG-PERF-01/02 保持 open，没有 push/publish/tag/merge。

## 最新完成：ENG-08 覆盖率、资源与性能报告

覆盖率统计核心/chapter 的 224 个运行时文件，明确列出 26 个类型或第三方排除项。首轮发现 file URL 与路径过滤不一致，产生虚假 100% 行覆盖率/零函数分支；已通过原始 V8 数据定位并修复到独立归一化阶段，保留原始文件。真实 esbuild/Vite 映射回归覆盖未执行分支、未导入文件、缺失/过期源码和无效计数。

完整 CI 476 项、249 个生产 TS 严格检查通过；覆盖率四个关键生命周期文件通过原定门槛。新安装包 34 项运行时、5 组旧类型及 8 组精确类型通过，113 个分发/声明/示例产物哈希一致，三个导入检查通过。modern/legacy 的资源、实例和字幕生命周期组合各 114 项通过（每引擎 38 项），没有失败、重试或跳过。

最终三引擎各完成三组配对，54 次候选资源探针严格清理通过；计时/体积仍为 review-required。核心 gzip 增长和间歇构造耗时信号登记为 ENG-PERF-01/02，由 CORE-22/REVIEW-01 处理。新增覆盖率与性能 CI 配置通过 actionlint，但远端尚未运行。见 [冻结证据](baselines/quality-validation.json)、[实施记录](changes/2026-09-11-ENG-08-quality-reports.md) 和 [维护说明](coverage-performance.md)。

ENG-08 done；59 done、155 todo。本任务以独立本地 commit 交付，包含实现、测试、依赖/锁文件、CI、生成产物及文档。下一步 CORE-22 核心总验收，包含性能/体积归因与复核；报告工具通过不是发布放行。没有 push/publish/tag/merge。

## 最新完成：CORE-23 键盘、焦点与可访问名称

默认菜单、原生模式/SSR/字幕检查已完成阶段验证；最终审查另复现并修正设置入口被删除/隐藏/禁用后留下隐藏焦点，以及导航进入隐藏/inert 设置项。四项旧产物回归全部失败，修正后三浏览器设置/集成组合 45 项通过。

修正后的完整 CI 468 项、249 个生产 TS 文件、新安装包 34 项运行时/5 组旧类型/8 组精确类型通过；381 个源/声明/资源文件与打包快照一致，工作区生成产物与安装包字节一致。现代版与 legacy 安装包全量各 1749 项通过（各引擎 583 项），无失败、重试或跳过。见 [最终验收证据](baselines/keyboard-validation.json) 与 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。

CORE-23 done、BASE-DOM-01 resolved；58 done、156 todo。本任务以独立本地 commit 交付，包含源码、测试、生成文件、架构与迁移记录。下一步先完成 CORE-22 尚缺的依赖 ENG-08（覆盖率、资源与性能报告），再做核心总验收。其余生态包、CI/CD 完整流程、各包下一大版本及三轮发布复盘继续推进；没有 push/publish/tag/merge。下方各阶段保留当时的状态与证据。

## 当前实施：CORE-23 默认菜单键盘阶段

默认菜单新增 Shift+F10/ContextMenu 入口、方向键/Home/End/文字导航和 Escape/Tab 退出。保留原 action/choice 点击路径、回调参数与关闭职责；菜单转入信息面板或 mini 后回到最初控件。动态菜单项替换/移除复用组件焦点恢复；输入字段的上下文菜单手势不再被播放器拦截。Context Menu 可选翻译键、十二语言与两份声明已同步。

完整 CI 468 项、249 个生产 TS 严格检查通过；accessibility/components/prompt-components/display-mini/hotkey 三浏览器组合 444 项全部通过，其中菜单十三场景共 39 项，无失败、重试或跳过。见 [菜单阶段证据](baselines/keyboard-contextmenu-partial.json) 和 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。中途两个测试假设错误按实际 DOM 顺序和 Emitter 上下文契约修正，保留失败报告。

CORE-23 doing、BASE-DOM-01 open；57 done、1 doing、156 todo。继续原生模式退出焦点与 SSR/字幕可用性，再进行新安装包/legacy 完整验收。本阶段仍是源码构建证据，尚无本任务完成 commit，无 push/publish/tag/merge。

## 当前实施：CORE-23 信息面板与锁定层阶段

信息面板新增独立键盘模块，支持进入、关闭和返回焦点，重复 init 保留返回目标并替换监听器；缺少可选 SSR 外层时保留原轮询/关闭行为。锁定层增加稳定按钮、aria-pressed 和 Escape 解锁，隐藏控制栏暂时退出 Tab 顺序，动态新增/移出控件和清理恢复原属性；保留调用方后续修改的值。已锁定时重挂载的图标初始化也按实际状态修正。

最终完整 CI 468 项、245 个生产 TS 严格检查通过；accessibility/builtin-layers/prompt-components/hotkey 三浏览器组合 306 项通过，其中信息面板及锁定层共 39 项，无失败、重试或跳过。见 [阶段证据](baselines/keyboard-info-lock-partial.json) 与 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。本轮新增可选 Lock 翻译键，十二语言、包声明与 Monaco 声明已同步生成。

CORE-23 仍 doing、BASE-DOM-01 open；57 done、1 doing、156 todo。接下来审查默认菜单入口、其余模式退出和跨实例/SSR/字幕可用性，再做新安装包与 legacy 全量验收。当前为源码构建阶段证据，尚无本任务完成 commit；未推送或发布。

## 当前实施：CORE-23 mini 键盘与退出焦点阶段

mini 关闭和稳定播放 wrapper 已支持 Enter/Space，弹窗内 Escape 关闭；键盘打开聚焦关闭入口，关闭后恢复原控件或播放器，鼠标/程序打开保留外部焦点。重复会话不沿用陈旧入口，回调销毁/重入取消后续通知。复用现有翻译键及图标 click 路径，调用方自有 mini 容器的 DOM、样式和控件仍由调用方管理。

修改前四项 Chromium 场景全部失败；最终六场景跨三引擎 18 项通过。完整 CI 468 项、242 个生产 TS 严格检查通过；accessibility/display-mini/display-web/hotkey 三浏览器组合回归 300 项通过，无失败、重试或跳过。见 [mini 阶段证据](baselines/keyboard-mini-partial.json) 与 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。

下一步信息面板/锁定层、其他模式退出和跨实例/SSR/字幕检查，然后重新构建安装包与 legacy 全量验收。CORE-23 doing、BASE-DOM-01 open；57 done、1 doing、156 todo。当前为源码构建专项证据，尚无本任务完成 commit，未推送或发布。

## 当前实施：CORE-23 动态控件焦点阶段

新增 component/focus.ts，控件更新只在完整替换结束后恢复一次焦点；移除、禁用替换或 mounted 失败时选择可用相邻控件，beforeUnmount 中断则保留原节点。支持 selector 子项与原生按钮，跳过隐藏/禁用/inert 内容；不抢回调用方已移交外部或另一实例的焦点。最后一个控件移除后使用受实例清理管理的 tabindex=-1 聚焦播放器，不新增顺序 Tab 入口。

真实 Chromium 修改前六项中五项失败，修正后动态控件九场景跨三引擎 27 项通过。完整 CI 468 项、241 个生产 TS 严格检查通过；accessibility/components/setting/hotkey/progress-quality 三浏览器组合回归 507 项全部通过，无失败、重试或跳过。见 [阶段证据](baselines/keyboard-control-focus-partial.json) 与 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。

下一步补齐 mini/信息面板/锁定层等模式操作与退出焦点，继续跨实例/SSR/字幕可用性及最终安装包/legacy 全量验收。当前仍为 Vite 源码构建证据；CORE-23 doing、BASE-DOM-01 open，57 done、1 doing、156 todo，完成整项后独立 commit。最近完成提交仍 faaa3e8c，未推送或发布。

## 当前实施：CORE-23 设置面板与播放位置校正阶段

核心自有源码 TS 迁移已在 CORE-20 完成，公开声明生成与兼容入口在 CORE-21 完成。当前继续修改源码：设置面板新增独立键盘、条目语义与焦点恢复模块，支持进入/返回、Escape、原生范围输入及更新失败恢复；网页全屏移动播放器节点后恢复已有焦点。最新完成提交仍为 faaa3e8c，CORE-23 尚未验收提交。

本阶段完整 CI 468 项通过（437 单元、6 工程、25 基线），239 个生产 TS 文件严格检查通过。扩大三浏览器回归 477 项通过；随后修正内部类型和清理回调返回类型，最终源码上的设置/滑块/切源专项 57 项通过。两轮构建指纹分别保留，不能合并宣称最终源码已跑完完整矩阵。见 [设置阶段证据](baselines/keyboard-settings-partial.json) 与 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。

回归复现 WebKit 在 End 后立即 PageDown 时原生结束状态覆盖新 seek；复用一次有限校正，保留公开事件顺序，新操作、公开时间写入、切源、控件移除或销毁取消旧校正。修复后的 WebKit 五次重复探针通过。另修正测试 once(setBar) 提前消费加载事件的竞态，未增加等待或跳过失败。

总体仍为 214 项：57 done、1 doing、156 todo，覆盖 22 个包。下一步完成动态控件焦点、剩余模式退出及跨实例/SSR/字幕可用性，进行 CORE-23 新安装包和 legacy 全量验收，再提交并进入 CORE-22 核心总验收。多数生态包、后续 CI/CD、各包下一大版本、三轮发布复盘和真机门槛仍待实施。BASE-DOM-01 open；没有 push/publish/tag/merge。

## 当前实施：CORE-23 选择列表阶段

选择列表已拆出 selector-keyboard.ts，支持实际 Tab 入口、Enter/Space 打开与提交、方向键/Home/End/typeahead 导航、Escape 返回和不提交的 Tab 离开。原 selector.ts 保留绑定与异步结果归属；正常列表同步 aria-selected，包含原生交互 HTML 的内容保留按钮/输入框语义。鼠标悬停、异步结果、回调移交焦点及旧 click 参数均经过回归。

补充浏览器用例先复现再修复“已关闭列表继续吞掉 Escape”和“空列表悬停报告展开”。最终 CI 463 项、235 个生产 TS 严格检查通过；相关三浏览器回归 282 项通过，无失败/重试/跳过，其中选择列表专项 30 项。见 [阶段证据](baselines/keyboard-selectors-partial.json) 和 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。当前仍是源码构建证据，新安装包/legacy 全量验收尚待进行。

下一步设置树和面板切换焦点，再检查模式退出、动态控件移除/替换、跨实例/SSR/字幕。CORE-23 doing，BASE-DOM-01 open；57 done、1 doing、156 todo，最新完成提交仍 faaa3e8c。整个 CORE-23 验收后独立 commit；未推送或发布。

## 当前实施：CORE-23 进度与音量滑块阶段

进度/音量已有独立 TS 键盘范围模块，支持方向键、PageUp/PageDown、Home/End、范围禁用和 ARIA 同步；进度保留 setBar-before-seek 及可选指针参数，切源/销毁/嵌套操作取消旧写入。音量面板可通过 Tab 进入，修复 visibility 过渡导致快速 Tab 跳过滑块的问题。新增十二语言 Progress 翻译，公开字段可选，包与 Monaco 声明均由脚本再生成。

最终 CI 463 项、234 个生产 TS 严格检查通过；accessibility/hotkey/progress-quality 三浏览器 123 项通过，无失败/重试/跳过。WebKit 实际 seek 时间与目标的微小差值按实际媒体值校验；中途检出的 Monaco 声明遗漏已生成修复。具体失败、修正和来源见 [滑块阶段证据](baselines/keyboard-sliders-partial.json) 与 [实施记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。这是源码构建专项，尚非新安装包/legacy 全量验收。

接下来实现 selector、设置树和 Escape/焦点恢复，再检查模式退出、动态移除、跨实例/SSR/字幕。CORE-23 仍 doing，BASE-DOM-01 开放；57 done、1 doing、156 todo，最新完成提交仍 faaa3e8c。整个 CORE-23 完成后独立 commit；未推送或发布。

## 当前实施：CORE-23 按钮与键盘焦点第一阶段

从 faaa3e8c 接续，任务 doing。新增 accessibility/button、keyboard、focus 三个 TS 模块，接入播放、音量、设置、全屏/PiP/AirPlay/截图及自定义 click 控件；处理 Enter/Space、按键归属、焦点切换、动态移除和 scope 清理。新增键盘焦点样式，保留鼠标自动隐藏、旧点击回调和普通快捷键。

真实 Chromium 固定修改前 Tab 缺口；Firefox 探针确认其原生 video 是既有 Tab 入口，测试保留该入口后继续检查控件。新指针用例复现并修正了本轮任意焦点策略造成的控制栏常驻，现使用独立输入方式状态。当前完整 CI 456 项、232 个生产 TS 文件、按钮/焦点及 Hotkey 三浏览器 69 项通过。见 [阶段证据](baselines/keyboard-buttons-partial.json) 和 [变更记录](changes/2026-09-11-CORE-23-keyboard-focus.md)。

下一步实现/验证进度与音量 slider、selector、设置树进入/返回/Escape、模式退出、动态焦点恢复、跨实例/SSR 和字幕可用性，再进行安装包与全量矩阵验收。当前是源码构建浏览器证据，不能当作最新 npm/legacy 安装包已验证。CORE-23 与 BASE-DOM-01 保持开放，尚无本任务完成 commit；57 done、1 doing、156 todo。未推送或发布。

## 当前实施：CORE-21 公开声明生成与兼容视图完成

从 ee895a55 接续。公开声明源移至 packages/artplayer/public/，生成 37 个声明文件：22 个历史文件与精确模块/入口。新增 artplayer/runtime、runtime/legacy 和共享类型扩展入口，映射原有 JS 产物；build:types/check:types 已接入 CI 和隔离构建。旧入口继续支持 4.3.5，新精确入口验证 5.1.6/5.9.3 各四模式。核心自有源码 TS 迁移已在 CORE-20 完成，本任务完成公开类型出口与核心编辑器验收。

CI 449 项、229 个生产 TS 检查、37 个生成声明无漂移通过。最终隔离安装 run-LYDR8W 通过 34 项运行时、五组旧类型和八组精确类型；CJS/ESM/legacy 入口身份相同。UMD 与 legacy 各 1521 项三浏览器检查通过，各含 18 项构造/返回/Monaco 专项。浏览器使用 run-y0PLWJ 的实际安装字节，最后打包仅修改三个 Markdown 文档，JS/声明逐文件一致；三个核心 JS 与 CORE-20 字节一致。见 [最终证据](baselines/core-declarations-validation.json)，先前阶段快照保持历史原样。

已完成 proxy/组件/插件构造阶段宿主，并纠正 DIV 容器及 customType 延迟执行的假设。核心编辑器使用依赖图打包和 AST 全局桥，独立 TS 4.3.5/5.9.3 语义检查及真实 Monaco worker 运行通过；冻结 Yarn 安装与严格工具链通过。关闭 BASE-TYPE-04/05/07/08/09/10，保留旧入口历史类型接受范围。214 项：57 done、157 todo，下一步 CORE-23 键盘/焦点/名称，然后 CORE-22 核心完整验收。详见 [设计](core-public-types.md) 与 [实施记录](changes/2026-09-11-CORE-21-public-declarations.md)。本任务独立本地提交，无推送或发布；真机门槛、其余生态包和多轮复盘仍待完成。

## 当前实施：CORE-20 核心入口与依赖收敛完成

核心全部 224 个自有源文件已迁移 TS，唯一 JS 为登记第三方 libs/screenfull.js。拆清入口、浏览器 bootstrap、DOM 叶层、实际属性/事件与初始化依赖；保持公开形状及顺序，修复构造/配置/AirPlay 销毁后继续安装和 proxy 挂载清理。

CI 447 项、229 个生产 TS 严格检查、实际 tarball 29 项运行时及五组类型通过。安装 UMD/legacy 各 1503 项三浏览器全量通过，各含 45 项 DOM/初始化专项；源码、包内文件、三个格式、docs/语言/许可指纹一致。见 [实施记录](changes/2026-09-11-CORE-20-entry.md) 和 [最终证据](baselines/entry-validation.json)。

关闭七项 CORE-20 差异；真实设备和 BASE-ENV-01 仍保留发布门槛，公开精确类型交 CORE-21。当前 214 项：56 完成、158 待办；下一项 CORE-21 生成声明及安装包类型协调。本任务独立本地提交，无推送或发布。

## 当前实施：CORE-19 进度、质量、截图与缩略图完成

截图和缩略图门面迁移 TS，拆清图像捕获、加载与布局。进度交互防止回调重入/跨源拖动继续 seek；质量切换对原生首次 seek 偏差最多修正一次，保持用户覆盖、取消与 Promise 结算。媒体/公开图片 URL 由调用方拥有，内部资源在配置、控件或实例结束时释放。保留公开 API、类型、正常事件顺序和 DOM/CSS；整列与首格缩略图裁剪是明确记录的显示修复。

CI 421 项、207 个生产 TS 严格检查、真实 tarball 27 项运行时及五组类型通过；安装 UMD/legacy 各 1458 项三浏览器全量通过，各含 129 项本任务和关联源专项。源码、包文件、三个分发格式、语言、docs 副本和许可指纹一致。见 [实施记录](changes/2026-09-11-CORE-19-capture-thumbnails.md) 和 [最终证据](baselines/capture-progress-validation.json)。

关闭十项已复现差异。BASE-ENV-01 保留 Windows WebKit 本机 Blob 解码限制，真实 Apple 设备仍交 REL-03/REVIEW-02；公共类型精确视图交 CORE-21。当前 214 项：55 完成、159 待办，下一项 CORE-20。本任务独立本地提交，无推送或发布。

## 当前实施：CORE-18 内置插件与提示模块完成

notice、autoPlayback、fastForward、lock、miniProgressBar、info、loading、mask 已迁移 TS，拆清记录、提示、长按与轮询归属；autoOrientation 组合复验通过。修复重复响应、陈旧回调和清理，同时保持公开结果、存储格式、DOM 与 destroy 观察顺序。

CI 372 项、200 个生产 TS 严格检查、实际 tarball 27 项运行时与五组类型通过；安装 UMD/legacy 各 1350 项三浏览器全量通过，各含 207 项本任务专项。源码、包文件、三个格式、语言、文档副本和许可指纹一致。见 [交付记录](changes/2026-09-11-CORE-18-builtins-prompts.md) 和 [最终证据](baselines/builtins-prompts-validation.json)。

关闭五项生命周期差异；BASE-TYPE-07 精确公共视图继续交 CORE-21，物理设备与多轮复盘仍保留发布门槛。当前 214 项：54 完成、160 待办；下一项 CORE-19。本任务独立本地提交，无推送或发布。

## 当前实施：CORE-17 输入、全局事件与调度完成

Hotkey 与 Events 全部初始化器已迁移 TS，拆清焦点、监听器、全局重绑、手势和调度；正常旧 API、回调/事件和交互保持，新增 document:touchcancel。

CI 321 项、核心 183 个与 chapter 5 个生产 TS 文件严格检查通过。实际安装 UMD 与 legacy 各通过 1119 项全量和 24 项补充三浏览器检查，对同一产物累计 1143 项，各含 243 项输入专项；真实 tarball 27 项运行时及五组类型零诊断，源码、包内文件、产物、文档副本、语言与许可指纹一致。见 [交付](changes/2026-09-11-CORE-17-input.md) 和 [最终证据](baselines/input-validation.json)。

关闭十一项输入/生命周期差异；控件 Tab 可达性 BASE-DOM-01 留 CORE-23；物理触摸/IME/方向等限制仍由 REL-03/REVIEW-02 验收。当前 214 项：53 完成、161 待办；下一项 CORE-18 内置插件和提示模块。本任务独立本地提交，不推送或发布。

## 当前实施：CORE-16 显示模式完成

全屏、video-only fallback、PiP、mini、自动尺寸、宽高比、翻转和方向已迁移 TS，拆清能力、状态、几何、DOM 和资源归属。修复重入/取消/销毁、节点和样式恢复、跨实例归属、过期事件及无效尺寸；正常旧 API、返回和事件保持。

CI 269 项、核心 159 个与 chapter 5 个生产 TS 文件严格检查通过。实际安装 UMD 和 legacy 各 900 项三浏览器通过（各含 300 项显示检查）；真实 tarball 27 项运行时及五组类型零诊断。源码、产物、全部包内文件、公开类型、语言与许可指纹一致。见 [交付](changes/2026-09-11-CORE-16-display.md) 和 [最终证据](baselines/display-validation.json)。

关闭十三个 DOM/生命周期缺陷。BASE-TYPE-10 公开 PiP 声明继续交 CORE-21；物理设备与受控 fallback 的限制仍保留在 REL-03/REVIEW-02。当前 214 项：52 完成、162 待办；下一项 CORE-17 键盘、手势、焦点与全局事件。本任务独立本地提交，不推送或发布。

## 当前实施：CORE-15 字幕请求、track 与渲染完成

字幕管理器拆为 7 个 TS 模块，字幕偏移 mixin 同时迁移；请求取消及时结算，过期结果停止写入；仅释放自建 URL，处理 track 重入/失败恢复、原生 cue/全屏、错误及清理。正常转换、回调、DOM、返回和事件契约保留。

CI 210 项通过，核心 130 个与 chapter 5 个生产 TS 文件严格检查；实际安装 UMD 与 legacy 各 600 项三浏览器通过，其中各 81 项字幕检查。真实 tarball 27 项运行时、五组类型零诊断；当前源码/产物/声明/文档/语言/许可指纹一致。见 [交付](changes/2026-09-11-CORE-15-subtitle.md) 和 [最终证据](baselines/subtitle-validation.json)。

关闭 BASE-LIFE-15/16，BASE-TYPE-07 公开类型协调保持开放。当前 214 项，51 完成、163 待办；下一项 CORE-16 全屏、PiP、mini 与尺寸模式。当前仅本地提交，未推送或发布。

## 当前实施：CORE-14 设置树、渲染与布局完成

设置目录迁移为 17 个 TS 模块，拆清树模型、渲染、布局、选择、条目/面板资源、更新事务、注册代次与根事件；保留原对象和返回约定，修复失效回调、残留订阅、失败恢复、跨实例绑定抢占及长文本控件裁切。

CI 200 项通过，核心 122 个与 chapter 5 个生产 TS 文件严格检查；实际安装 UMD 与 legacy 各 519 项三浏览器通过，其中各含 177 项设置检查。真实 tarball 27 项运行时及五组类型零诊断；源码、三个格式、公开类型、包内文档、语言及许可指纹一致。见 [交付](changes/2026-09-11-CORE-14-setting.md) 和 [最终证据](baselines/setting-validation.json)。

关闭 BASE-DOM-02/06/07/08、BASE-LIFE-12/13/14，公开返回声明差异 BASE-TYPE-07 保持开放。当前 214 项，50 完成、164 待办；下一项 CORE-15 字幕获取、解析和渲染。本任务独立本地提交，未推送或发布。

## 当前实施：CORE-13 组件注册与控件完成

Component/control/layer/contextmenu 与 qualityMix 迁移 TS，拆清注册、DOM、资源、选择生命周期、进度交互和布局；修复移除后残留订阅、失败注册与重入清理、过期选择写入、selector 重用和文本属性注入。正常回调/排序/别名/描述符保持，controls.add/update 仍返回 undefined。

177 项 Node/工程/基线通过，核心及 chapter 共 110 个生产 TS 文件严格检查；最终安装 UMD 和 legacy 各 342 项三浏览器通过，实际 tarball 27 项运行时与五组类型零诊断。见 [交付](changes/2026-09-11-CORE-13-components.md) 和 [指纹及结果](baselines/components-validation.json)。关闭 BASE-LIFE-09/10/11、BASE-DOM-03/04/05；BASE-DOM-02 的窄设置面板留 CORE-14，公开返回值与只写属性声明仍交 CORE-21。

当前分支 codex/compatible-modernization，214 项中 49 完成、165 待办；核心 105 个 TS 文件、chapter 5 个。下一项 CORE-14 设置树、选择、渲染与布局；CORE-13 按单任务本地提交，未推送或发布。

## 当前实施：CORE-12 模板及公开资源入口完成

模板、图标、语言和样式入口迁移 TS，保留 SSR/DOM/proxy 身份及语言分发。169 项 Node/工程/基线通过，最终安装 UMD 与 legacy 各 258 项三浏览器通过；打包 27 项运行时及五组类型零诊断。复制资源固定上游内容、全部适配和实际分发许可已核对，关闭 VENDOR-01/02 与 BASE-I18N-01；公开模板/图标类型差异 BASE-TYPE-09 交 CORE-21。见 [交付](changes/2026-09-11-CORE-12-template-resources.md)。当前 214 项，48 完成、166 待办；核心 71 个 TS 文件、chapter 5 个。下一项 CORE-13 组件注册与控件。

## 当前实施：CORE-11 媒体事件、ready 与重连完成

事件入口迁移 TS，拆出转发、ready、播放 UI、重连、订阅和宿主类型；资源代次与切源操作分离，失败切源仍可重试，换源/恢复/销毁取消过期工作。158 项 Node/基线、安装 UMD 与 legacy 各 222 项三浏览器、打包 27 项运行时及五组类型检查通过。见 [交付](changes/2026-09-11-CORE-11-media-events.md)。关闭新增 BASE-LIFE-07/08，保留原 Event、重试次数和正常 ready 顺序；第三方 SDK 事件仍由适配器负责。当前 214 项，47 完成、167 待办；核心 49 个 TS 文件、chapter 5 个。下一项 CORE-12 模板及公开资源入口。

## 当前实施：CORE-10 播放与时间/状态属性完成

八个 mixin 迁移 TS，新增最小播放属性宿主；保持转换、通知、存储、进度和状态优先级。新增 PlaybackControls 精确视图，旧 toggle 声明仍兼容。145 项 Node/基线、安装 UMD 与 legacy 各 195 项三浏览器、打包 27 项运行时和五组类型检查通过。见 [交付](changes/2026-09-11-CORE-10-playback-properties.md)。发现 BASE-TYPE-08 的只写属性虚构 getter 声明，已交 CORE-21；没有添加运行时 getter 来掩盖它。当前 214 项，46 完成、168 待办；核心 42 个 TS 文件、chapter 5 个。下一项 CORE-11 媒体事件、ready 与重连。

## 当前实施：CORE-09 URL 与切源操作完成

URL/switch 门面迁移 TS，新增四个 source 模块，统一切源取消、事件清理、同步代理事件和 Promise 结算；真实 playMix 同步接入源身份，避免晚到播放覆盖新状态。137 项 Node/基线、安装 UMD 与 legacy 各 183 项三浏览器检查、打包 27 项运行时和五组类型检查通过。见 [交付](changes/2026-09-11-CORE-09-source-operations.md)。关闭 BASE-LIFE-01/02/06；customType 外部 SDK 清理、对象 URL 归属和过期重连仍由对应后续任务处理。当前 214 项，45 完成、169 待办；核心 33 个 TS 文件、chapter 5 个。下一项 CORE-10 播放与时间/状态属性。

## 当前实施：CORE-08 插件管理器 TS 完成

插件注册、内置装配、命名与内部类型拆成四个 TS 模块；修复销毁后晚到注册，保持 Promise 结算与同步可见性，新增共享类型扩展入口。120 项 Node/基线、安装 UMD 三浏览器 162 项及 legacy 插件/章节/生命周期 90 项通过；严格打包 27 项运行时、五组类型零诊断。见 [交付](changes/2026-09-11-CORE-08-plugin-manager.md)。关闭 BASE-LIFE-03；公开返回声明和各插件自有资源清理仍有后续责任。当前 214 项，44 完成、170 待办；核心 27 个 TS 文件、chapter 5 个。下一项 CORE-09 URL/切源操作。

## 当前实施：CORE-07 公开声明逐项协调完成

OptionInput、数字组件输入、Utils 缺失项、静态 Emitter 和显式 cue 数组重载已补充，旧合法返回赋值样例保留。112 项 Node/基线、安装 UMD 三浏览器 144 项及 legacy 声明/配置 30 项通过；严格打包 27 项运行时与五组类型零诊断。见 [交付](changes/2026-09-11-CORE-07-declarations.md)。关闭 BASE-TYPE-06；BASE-TYPE-04/05/07 的返回/隐式推断冲突保持开放，已接入模块任务与 CORE-21 出口，不代表全部公开类型已精确化。当前 214 项，43 完成、171 待办；下一项 CORE-08 插件管理器与扩展类型。

## 当前实施：CORE-07 公开声明协调进行中

已补充 OptionInput/ComponentInput 和兼容重载，保留旧 Option 读取类型；补齐部分 Utils 声明，新增历史返回值消费样例。112 项 Node/基线、五组安装包类型及 18 项配置浏览器测试通过，见 [当前记录](changes/2026-09-11-CORE-07-declarations.md)。plugins/toggle/timer/setting/cue/static 仍需逐项协调，本任务保持 doing，尚未提交。当前 214 项，42 完成、1 实施、171 待办；上个完成任务 CORE-06 提交 ee859e48。

## 当前实施：CORE-06 媒体与宿主类型完成

建立原生 video/canvas 媒体及最小宿主类型，五个播放/布局 mixin 迁移 TS，保持公开 art.video 身份、描述符和返回时序。111 项 Node/基线、安装 UMD 三浏览器 132 项及 legacy 播放/生命周期/代理 48 项通过；严格打包 27 项运行时、五组类型零诊断。见 [交付](changes/2026-09-11-CORE-06-media-hosts.md)。当前 214 项，42 完成、172 待办；核心二十三个 TS 文件、chapter 五个。代理完整迁移和主入口静态集成尚未完成；下一项 CORE-07 逐项协调公开声明差异。

## 当前实施：CORE-05 配置与默认值 TS 拆分完成

核心入口接入独立默认值/解析模块，scheme 迁移 TS，区分 Option 与 ResolvedOption 并保留应用扩展类型。107 项 Node/基线、安装 UMD 三浏览器 126 项及 legacy 配置/生命周期 48 项通过；严格打包 27 项运行时、五组类型零诊断。见 [交付](changes/2026-09-11-CORE-05-resolved-options.md)。新登记 BASE-TYPE-06（省略 URL/数字控件 HTML 的声明缺口）交 CORE-07。当前 214 项，41 完成、173 待办；核心十六个 TS 文件、chapter 五个。下一项 CORE-06 内部媒体与宿主类型。

## 当前实施：CORE-04 构造/销毁生命周期完成

核心入口接入实例作用域，修复重复/重入销毁、失败构造回滚和 pending resize；正常 destroy 回调仍可挂载替代实例。99 项 Node/基线、安装 UMD 三浏览器 108 项及 legacy 三浏览器 30 项通过；严格打包 27 项运行时、五组类型零诊断。见 [交付](changes/2026-09-11-CORE-04-instance-lifecycle.md)。关闭 BASE-LIFE-04/05 与 BASE-PERF-01，字幕/异步插件等后续任务继续开放。当前 214 项，40 完成、174 待办；核心十二个 TS 文件、chapter 五个，主入口仍为 JS 兼容门面。下一项 CORE-05 输入与内部配置类型。

## 当前实施：CORE-03 内部资源作用域完成

新增两个核心 TS 文件，明确同步清理、实例/操作作用域、异常汇总及原生资源适配。94 项 Node/基线与 78 项三浏览器检查通过；首次 Firefox 图片缓存误判已保留并改为 fresh fetch 验证。见 [交付](changes/2026-09-11-CORE-03-resource-scope.md)。当前 214 项，39 完成、175 待办；核心十个 TS 文件、chapter 五个。作用域尚未接入播放器，旧生命周期风险仍开放；下一项 CORE-04 直接改构造与销毁。

## 当前实施：CORE-02 Emitter TS 迁移完成

事件映射、payload/ctx 和链式类型已加入；九组普通契约保持，另修复原型事件名与嵌套快照重复 once。85 项 Node/基线、75 项三浏览器、三格式各 29 项 Emitter 检查通过；严格打包 27 项运行时/五组类型零诊断。见 [交付](changes/2026-09-11-CORE-02-typed-emitter.md)。当前 214 项，38 完成、176 待办。核心八个 TS 文件、chapter 五个 TS 文件；下一项 CORE-03 内部资源作用域。

## 当前实施：CORE-01 核心工具 TS 迁移完成

七个核心 utils 文件已迁移为 TS，保留导出、属性与定时器契约，修复合并结果原型和下载失败清理；核心产物与 docs/compiled 已由脚本更新。75 项 Node/基线检查、69 项安装产物三浏览器测试、三格式各 18 项工具契约通过；严格打包零诊断。见 [交付](changes/2026-09-10-CORE-01-typed-utils.md)。当前 214 项，37 完成、177 待办。生产迁移：chapter 五个 TS 文件、核心 utils 七个 TS 文件；核心其他模块仍待迁移。下一项 CORE-02 内部 Emitter。公开 Utils 声明差异单独登记 BASE-TYPE-05，交 CORE-07 协调，不计为已修复。

## 当前实施：PILOT-01 试点出口通过

当前源码和包内文件指纹与既有通过证据一致；chapter 的 TS、旧核心、三浏览器、打包、类型和维护地图闭环，见 [汇总](changes/2026-09-10-PILOT-01-chapter.md)。当前 214 项，36 完成、178 待办。接下来 CORE-01 开始核心纯工具 TS 迁移，不再建立重复基线；chapter 05/06 和完整发布验收仍待执行。

## 当前实施：ENG-10 测试可靠性规则完成

核对并整合现有风险分类、候选零诊断、旧发布隔离、精确媒体取消和无重试/跳过验收规则，见 [记录](changes/2026-09-10-ENG-10-test-reliability.md)。不新增测试框架或重复基线。当前 214 项，35 完成、179 待办；chapter TS 已完成，核心源码尚未开始。下一项 PILOT-01 核对现有产物/源码证据并汇总，再进入 CORE-01。

## 当前实施：PKG-CHAPTER-04 类型消费闭环完成

chapter 公开命名类型、核心/插件 CJS/ESM 桥接及旧 legacy/language 回退通过五组编译模式（31 场景），实际 tarball 严格发布检查诊断为零；62 项 Node/基线测试和 54 项安装产物三浏览器检查通过。关闭 BASE-TYPE-01/03，旧发布基线不改。见 [交付](changes/2026-09-10-PKG-CHAPTER-04-public-types.md)。当前 214 项，34 完成、180 待办。生产运行时：chapter 已 TS 化，核心仍未迁移；本任务核心只修正类型入口。03 提交 48660c4e；下一项 ENG-10 接续现有风险/可靠性规则，然后 PILOT-01 汇总现有试点证据，进入 CORE-01。

## 当前实施：PKG-CHAPTER-03 首包 TS 源码拆分完成

chapter 已从单体 JS 入口改为五个 TS 文件，区间、DOM、生命周期和样式职责清楚；修复标题、NaN、销毁和重复样式问题。61 项 Node/基线检查、源码及安装产物各 54 项三浏览器测试通过；三格式产物已生成。见 [交付](changes/2026-09-10-PKG-CHAPTER-03-typescript-modules.md)。当前 214 项，33 完成、181 待办。生产迁移：chapter 自有运行时已 TS 化，核心尚未开始。ENG-07 提交 a0286c4e；下一项 PKG-CHAPTER-04 公开类型与消费者闭环。

## 当前实施：ENG-07 打包消费入口完成

实际重建、打包、仓库外安装及 23 项运行时检查通过；安装产物三浏览器 39 项通过，ci:check 57 项通过。精确的 11 条历史类型诊断仍阻止严格发布检查，未作为发布豁免。见 [交付](changes/2026-09-10-ENG-07-package-consumers.md)。当前 214 项，32 完成、182 待办；生产源码 TS 迁移仍为零。下一项直接实施 PKG-CHAPTER-03 的 TS 模块拆分，再以 04 完成公开类型和消费者闭环。

## 当前实施：PKG-CHAPTER-02 测试与声明修正完成

chapter 27 项真实浏览器回归通过，合并原 smoke 共 39 项；工厂 option 声明已扩展为可选并重新生成编辑器声明，新旧 TS 正反例通过，BASE-TYPE-02 关闭。见 [交付](changes/2026-09-10-PKG-CHAPTER-02-tests.md)。当前 214 项，31 完成、183 待办。PKG-CHAPTER-01 提交 70174952，本任务单独提交；下一项 ENG-07，随后直接以 TS 拆分 chapter 源码。运行时源码尚未迁移。

## 当前实施：PKG-CHAPTER-01 契约完成

源码/发布插件逻辑和元数据对照完成，冻结 chapter 调用、数组变更、DOM/事件和入口，登记待修问题；见 [契约](baselines/chapter-contract.md)。当前 214 项，30 完成、184 待办。ENG-05 提交 7318d338，下一项 PKG-CHAPTER-02 包特有测试与声明修正。生产源码 TS 迁移仍为零。

## 当前实施：ENG-05 真实浏览器入口完成

Playwright 三浏览器 12 项真实播放/失败/映射测试通过，指定候选 UMD 文件的 Firefox 4 项通过；新增 CI smoke、报告与自生成媒体。见 [ENG-05](changes/2026-09-10-ENG-05-browser-tests.md)。当前 214 项，29 完成、185 待办；生产源码 TS 迁移仍为零。已具备 chapter 试点所需浏览器入口，下一项 PKG-CHAPTER-01，接特有测试和 ENG-07，再迁移插件源码。远端 CI、完整编辑器及真机尚未验收。

## 当前实施：ENG-03 公共行为与单元入口完成

原 19 项播放/DASH 回归保留，JS/TS loader 与受控媒体夹具复用；同一份五组 Emitter 契约在发布 core 5.4.0、工作区和三格式候选上通过。统一 yarn test:unit/test 与 CI 入口已接入，见 [ENG-03](changes/2026-09-10-ENG-03-unit-entry.md)。当前 214 项，28 完成、186 待办；生产源码 TS 迁移仍为零。ENG-06 提交 b53461da，本任务独立提交，下一项 ENG-05 浏览器自动化。

## 当前实施：ENG-06 JS/TS 构建与开发完成

正常 build/dev 支持指定包与唯一 JS/TS 入口，dev 可禁止自动打开浏览器并串行重建。构建夹具复现并修复 AMD 全局参数错误；63 产物中 39 字节相同、24 仅该修复；内置浏览器 42 个 AMD 入口、TS worker/资源及首页真实播放通过。见 [ENG-06](changes/2026-09-10-ENG-06-build-development.md)。

当前 214 项，27 完成、187 待办。43 项 Node/基线测试通过，生产源码 TS 迁移仍为零；工具链代码已有实际修改。ENG-04 提交 77148242，本任务独立提交。下一项 ENG-03 公共行为/单元入口，再接 ENG-05 浏览器自动化与 chapter 特有测试和源码迁移。

## 当前实施：ENG-04 类型检查基础完成

根/核心/chapter 配置和 yarn typecheck 已接入 CI。TS 5.9.3 三种消费模式与 TS 4.3.5 旧解析通过，NodeNext ESM 七项历史诊断单独记录；40 项 Node/基线测试通过。见 [ENG-04](changes/2026-09-10-ENG-04-typechecking.md)。当前 214 项，26 完成、188 待办；工具代码已有实施，生产源码 TS 迁移仍为零。BASE-08 提交 09902b8b，本任务独立提交。下一项 ENG-06 构建 TS 与非交互入口，再完成测试服务和 chapter 源码迁移。

## 当前实施：BASE-08 环境矩阵完成

22 包的格式/类型/运行环境/codec/SDK/设备与样本缺口已分配任务和发布影响；见 [矩阵](environment-matrix.md)。只引用已有基线，没有新增浏览器通过结论。当前 214 项，25 完成、189 待办；生产源码 TS 迁移仍为零。BASE-07 提交 ed293231；本任务独立提交。下一项直接实施 ENG-04 类型检查配置，再推进构建与 chapter 试点。

## 当前实施：BASE-07 风险与第三方来源台账完成

39 项差异/来源缺口已关联责任任务、证据与关闭条件，22 包运行依赖、8 组内嵌资源（123 个文件）及 12 个集成边界可校验。全部风险仍 open，不能把清点完成视为已修复或获准发布。见 [BASE-07](changes/2026-09-10-BASE-07-risk-register.md)。

当前 214 项任务，24 完成、190 待办。生产源码 TS 迁移仍为零；已完成工作主要是规划、工程流程与基线，后续继续单独报告源码迁移进度。BASE-06 已提交 e01f39ff；本轮独立提交 BASE-07。下一任务 BASE-08，随后进入必要 TS 工程配置和 chapter 试点；没有推送或发布。

## 当前实施：BASE-06 性能与资源基线完成

内置浏览器两轮各 12 个计时样本和 6 组资源探针已保存；真实播放及基本清理通过，同时复现销毁后 resize 防抖重新安排 notice timer，已分配 CORE-17/04/18。28 个发布 JS 与 85 个工作区 JS 的压缩体积独立记录。阈值只用于复测/审查，无生产优化或无内存泄漏结论。见 [BASE-06](changes/2026-09-10-BASE-06-performance.md)。

当前 214 项任务，23 完成、191 待办。BASE-05 已提交 c7a375e1；本轮独立提交 BASE-06。没有生产 TS 迁移、推送或发布；下一任务 BASE-07 差异/外部依赖风险台账。

## 当前实施：BASE-05 分发与类型消费者完成

固定发布包隔离消费的 18 项 Node runtime 检查通过；16 项 strict TS 场景中 8 项编译通过、8 项历史失败独立登记，未掩盖 NodeNext ESM 与 chapter 声明问题。内置浏览器两轮各 5 项 SSR 节点复用/媒体/清理检查通过。全包 manifest 与 118 个工作区 dist/types 资源已清点，thumbnail tool 和站点分发差异有后续责任。见 [BASE-05](changes/2026-09-10-BASE-05-consumers.md)。

当前 214 项任务，22 完成、192 待办。BASE-04 已提交 2b7054d8；本轮独立提交 BASE-05。没有生产 TS 迁移、推送或发布；下一任务 BASE-06 性能与资源基线。

## 当前实施：BASE-04 DOM 与输入基线完成

内置浏览器最终两轮 16 项检查通过，模板/类名/变量、用户样式、控件/设置、Tab/热键与网页全屏已留证。320px 裁切和控件 Tab 不可达已分配 CORE-13/14/23，未把历史问题当成正常兼容要求。29 示例、36 HTML 和 22 包的路径已映射，官方 docs 页面仍待真实运行。见 [BASE-04](changes/2026-09-10-BASE-04-dom.md)。

当前 214 项任务，21 完成、193 待办。BASE-03 已提交 94893929；本轮独立提交 BASE-04。没有生产 TS 迁移、推送或发布。下一任务 BASE-05：入口、资源与类型消费者基线。

## 当前实施：BASE-03 生命周期基线完成

固定发布包在内置浏览器最终两次执行 27 项断言、真实媒体时间推进与关键事件顺序均通过，语义观察相同，保存 64 条事件 trace 和六项历史问题。受控恢复拒绝单独登记，其余 errors/unhandled 为空；无把历史缺陷当作正常兼容要求。见 [BASE-03](changes/2026-09-10-BASE-03-lifecycle.md) 和 [问题/覆盖台账](baselines/lifecycle-coverage.md)。CORE-04/08/09 验收已链接相应复现。

当前 214 项任务，20 完成、194 待办。BASE-02 已提交 b382ec08；本轮独立提交 BASE-03。没有生产 TS 迁移、推送或发布。下一任务 BASE-04：DOM/CSS 与基础交互基线。

## 当前实施：BASE-02 公共 API 基线完成

内置浏览器最终两次执行固定 core 5.4.0/chapter 1.1.0 的 14 项同步 API 断言，快照相同，error/warn 日志为空。已保存静态配置、默认选项、实例及继承 API、10 个子系统的描述符和来源指纹；比较器能拒绝描述符/方法/默认值等回归。见 [BASE-02](changes/2026-09-10-BASE-02-public-api.md) 与 [契约覆盖](baselines/api-coverage.md)。

当前 214 项任务，19 完成、195 待办。ENG-02 已提交 833cc116；本轮独立提交 BASE-02。没有生产 TS 迁移或发布结论。下一任务 BASE-03，捕获事件、异步和生命周期，并验证真实媒体场景；同步 API 快照不能替代该工作。

## 当前实施：ENG-02 只读检查与 CI 基础已完成

新增 PR/主线/复用检查与独立手动 Pages 流程；lint 与自动修复拆分，修复文档构建退出码和生成声明格式。23 项 Node/基线测试、3 个构建后导入 smoke、21 库包 63 产物与文档构建通过；426 个源/类型/测试文件只读检查前后不变，actionlint 静态和负例通过。详见 [ENG-02](changes/2026-09-10-ENG-02-readonly-ci.md) 与 [操作说明](ci-setup.md)。

当前 214 项任务，18 完成、196 待办。ENG-PM-01 已提交 9a6cfe5c；本轮独立提交 ENG-02。未推送、未启用远端 CI/Pages、未发布；CI-02/CI-04 继续负责远端验收。下一任务 BASE-02，使用内置浏览器保存并校验公共 API 基线。

## 当前实施：ENG-PM-01 已完成 Yarn 切换

标准工具链为 Node 24.21.0 / Yarn Classic 1.22.22，唯一维护 yarn.lock。最终干净冻结安装、20 项 Node 测试、只读工具检查、21 库包及文档站构建通过，63 个库产物与 npm 基线 SHA-256 全同。详见 [ENG-PM-01](changes/2026-09-10-ENG-PM-01-yarn-toolchain.md)。既有搜索 peer 警告交 SITE-05 验证。

DOC-13 已提交 9d1d5fda；内置浏览器的 9 项基础 API 检查通过，BASE-02 可继续完整快照。当前 214 项任务，17 完成、197 待办。下一项 ENG-02，接入 Yarn 冻结安装和只读 PR CI；随后继续浏览器基线。没有生产 TS 迁移、推送或发布。

## 当前实施：Yarn 选择与浏览器回退

用户指定 packageManager 使用 Yarn，正在准备 ENG-PM-01 替换 ENG-01 的 npm 默认工具选择。ENG-02 暂回待办，待 Yarn 锁定验证后接续。用户同时授权 Chrome 不可用时使用内置浏览器；9 项发布包基础 API 检查已通过，BASE-02 连接阻塞解除，完整快照任务仍待完成。详见 [DOC-13](changes/2026-09-10-DOC-13-browser-fallback.md)。历史 npm 和 Chrome 失败记录保留为当时事实。

## 当前实施：ENG-01 工具链已验证

Node 24.21.0/npm 11.19.0、16 个直接工具和 npm lock 已固定；干净安装 1141 包、原 19 项测试、21 库包 63 产物与文档站构建全部通过，已有依赖解析版本没有升级。详见 [ENG-01 交付](changes/2026-09-10-ENG-01-reproducible-toolchain.md)。

完成 12 项规划、3 项实施基础任务；BASE-02 仍因 Chrome 连接阻塞，196 项待办。BASE-HARNESS-01 提交为 `3c759f14`。没有生产 TS 迁移、推送或发布。下一项 ENG-02，拆分只读检查并更新 PR/主线 CI。

## 2026-09-10：浏览器夹具已保存

BASE-01 已提交 `1d705b30`。BASE-HARNESS-01 完成发布包采集页面/本地 HTTP 服务及 1 项真实 HTTP 测试，详见 [交付记录](changes/2026-09-10-BASE-HARNESS-01-browser-fixture.md)。BASE-02 因 Chrome 连接失败保持 blocked；用户要求先继续其他实施任务，没有伪造浏览器基线。

完成 12 项规划、2 项实施基础任务；BASE-02 阻塞，其余 197 项待办。没有生产 TS 迁移。下一项 ENG-01 固定依赖和运行环境，浏览器恢复后继续 BASE-02。

## 2026-09-10：BASE-01 已发布基线

2026-09-10，goal 开始执行。固定核心 5.4.0/chapter 1.1.0 的真实 tarball、47 个成员哈希和支持范围未知项。核心工作区 5.4.1 未发布，两包 registry gitHead 版本过旧，均已如实记录。详见 [BASE-01 交付](changes/2026-09-10-BASE-01-published-baseline.md)。

两个包完整性和入口存在性验证通过，损坏检测 1 项测试通过。完成 12 项规划及 1 项实施基础任务；198 项待办。没有生产 TS 迁移或浏览器通过结论，没有推送/发布。下一步 BASE-02 捕获公开 API，ENG-01 固定依赖与运行环境。

## 2026-09-10：DOC-12 开发前计划复审

2026-09-10，再次检查依赖和验收，修正首轮复盘间接等待 mask 设备、版本准备缺实施任务，补清基线启动、站点分发分类、SSR 边界与契约覆盖索引。详见 [DOC-12 记录](changes/2026-09-10-DOC-12-execution-readiness-review.md) 和 [执行门槛](execution-gates.md)。

现为 211 项任务：12 项规划完成、199 项待办，生产重构未开始。计划/链接/语义依赖、校验器语法及四类故障负例、Git 差异检查通过。DOC-11 提交为 `9b9739ab`；本轮独立提交 DOC-12，没有生产或浏览器测试、远端 CI 或发布。下一项仍为 BASE-01，后续实现细节随开发证据补充。

## 2026-09-10：DOC-11 全包大版本策略

2026-09-10，用户要求所有包各自升级到下一 major。已核对 22 个 manifest 并记录 [目标清单](version-policy.md)，同步发布/CI/复盘及根指令，详见 [DOC-11 记录](changes/2026-09-10-DOC-11-major-version-policy.md)。现有 209 项任务：11 项规划完成、198 项待办。

版本目标对应与计划/链接/依赖、Git 差异检查通过。仅修改文档，未改 manifest/锁文件或运行生产测试；旧 API 兼容要求不变。DOC-10 提交为 `a9197f59`，本轮独立提交 DOC-11。下一项仍为 BASE-01。

## 2026-09-10：DOC-10 GitHub CI/CD 规划

2026-09-10，用户明确纳入 GitHub CI/CD 优化。已核对现有 workflow 源码，新增 CI-01 至 CI-04 并接入第三轮发布复盘，文档见 [CI/CD 规范](github-ci-cd.md) 和 [DOC-10 记录](changes/2026-09-10-DOC-10-github-ci-cd.md)。现有 208 项任务：10 项规划完成、198 项待办；生产重构和 CI 改造均未开始。

计划/链接/依赖和 Git 差异检查通过；未修改 workflow、执行远端作业或发布。DOC-09 提交为 `21fd40ec`，本轮独立提交 DOC-10。下一项仍为 BASE-01。

## 2026-09-10：DOC-09 docs 测试入口记录

2026-09-10，将现有 HTML/Monaco 编辑器纳入真实测试方案，补充已有实施任务的具体要求。现有 203 项任务：9 项规划完成、194 项待办；生产重构与浏览器验收尚未开始。DOC-08 提交为 `3af9becf`。

本轮仅静态核对页面与脚本并维护文档，计划生成/校验、原任务范围/状态/依赖保持和 Git 差异检查通过，没有构建或运行真实播放测试。详见 [入口规范](docs-browser-testing.md) 和 [DOC-09 记录](changes/2026-09-10-DOC-09-docs-test-surfaces.md)。本轮独立提交 DOC-09，无推送或发布。下一任务仍为 BASE-01。

## 2026-09-10：DOC-08 浏览器与发布复盘规范

2026-09-10，记录用户要求的 Chrome 验证方案和重构后的多轮复盘。新增 REVIEW-01/02/03 三项待办并接入候选发布依赖。现有 202 项任务：8 项规划完成，194 项待办；生产重构与三轮复盘均未开始。

本轮仅更新文档及任务数据，计划生成/校验、专项发布依赖断言与 Git 差异检查通过。Chrome 扩展连接已在工具清单确认，但未执行播放器测试；其余设备可用性未核实。DOC-07 提交为 `1fa0a578`；本轮按 `[DOC-08]` 独立提交，无推送或发布。

详情见 [浏览器与复盘规范](release-reviews.md) 和 [DOC-08 记录](changes/2026-09-10-DOC-08-browser-and-release-reviews.md)。下一任务仍为 BASE-01。

## 2026-09-10：DOC-07 计划复审

2026-09-10，针对实际依赖图审查并调整计划。现为 198 项任务：7 项规划任务、191 项待实施/验收任务；生产代码重构完成数仍为 0。DOC-06 已提交为 `d7b348f3`，本次审查按 `[DOC-07]` 主题独立提交。

主要调整：最小启动基线、旧核心上的早期 chapter 试点、消费者/环境矩阵、历史失败与测试可靠性、核心无障碍回归、提前建立分包发布准入及回退演练。新增 execution-gates.md，原 192 个任务 ID、包范围和完成状态均保留。

校验结果：

- plan.mjs 生成与检查通过：198 任务、22 包、依赖无环、本地链接与生成同步。
- 专项依赖断言通过：PILOT-01 无 CORE 前置；CORE-01 依赖试点；SITE-04/05、REL-01/02 无 Cast/VAST/DPiP/mask 设备验收前置；REL-03 仍包含这些门槛。
- 既有 192 项任务 ID、scope、status 未丢失或伪造完成；只有本次 DOC-07 新标完成，其余新增任务待执行。
- 本次未修改生产代码、依赖或测试实现，没有运行浏览器播放或生产测试。

完整发现、改动及回退见 [DOC-07 审查记录](changes/2026-09-10-DOC-07-plan-review.md)。下一任务仍是 BASE-01，先固定核心与 chapter 的最小发布基线。

## 2026-09-10：建立重构工作区

- 分支：`codex/compatible-modernization`，由干净 master 创建。
- 基线：`40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f`。
- 已清点：22 包、全部插件、proxy、工具、文档与 React/Vue 示例；逐步任务以 tasks.json 为准。
- 本轮修改仅包含重构文档、其生成/校验工具，以及 AGENTS.md 的文档入口。未修改生产源码、声明或发布产物。
- 初始化阶段 DOC-01 至 DOC-04 完成时尚未提交。用户随后要求每任务独立 commit；已有规划文件作为 DOC-05 初始文档基线入库，实际提交以 Git 日志中的 `[DOC-05]` 为准。未推送、未发布。

本轮交付共 190 个任务：4 个 DOC 规划任务完成，186 个实施/验收任务待执行。包括核心 22 步，普通生态包各 6 步，danmuku 9 步，MediaBunny 10 步，另含基线、工程、文档、消费者、工具链和发布任务。

本轮文档验证：

- `node refactor/scripts/plan.mjs --write` 与 `--check`：任务 ID/状态/依赖、无环检查、22 包覆盖、完成证据和计划同步通过。
- 本地 Markdown 文件链接共 30 个均存在；初始清单中的 manifest、源码、类型和 demo 路径均存在。manifest 自身声明的缺失目标仍如实登记，不伪造文件。
- `node --check refactor/scripts/plan.mjs`：通过。
- `git diff --check`：通过；工作区仅 AGENTS.md 和 refactor/ 变化。
- 本轮没有重跑生产源码测试或浏览器播放；没有生产源码修改。

## 先前评估证据

以下来自建立计划前的同一会话评估，属于初步诊断，不代替 BASE 阶段的已发布产物基线与完整浏览器测试：

| 检查                                                               | 结果与限制                                                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `node --test test/playback.test.js test/dash-control.test.js`      | Node 25.2.1，19 项通过；这是 mock/单元测试                       |
| 核心 src/types、test、scripts/*.js 的 ESLint（不加 --fix）         | 通过；没有把插件模板占位符作为普通源码 lint                      |
| 三个 TS 样例，TS 5.9.3、strict、types: []                          | 通过；未隔离环境类型时存在第三方 DOM/WebCodecs/markdown 声明冲突 |
| 使用项目构建配置 write:false 进行 ESM/现代 UMD/legacy UMD 内存构建 | 成功；不是完整 npm pack 或全部发布构建；未写产物                 |
| 销毁源码隔离探针                                                   | 重复 destroy 可误删其他实例注册项；需要正式回归用例              |
| 连续切源源码隔离探针                                               | 一次 canplay 可结算两次切源；尚未真实浏览器复现影响              |
| `bun test ./test/playback.test.js ./test/dash-control.test.js`     | Bun 1.3.14：1 通过、18 失败，mock.fn 不兼容；未来版本需重测      |

## 清点中新增的待核对项

- artplayer-tool-thumbnail：manifest 的 types 目标当前不存在，ESM 历史路径与统一构建命名不同；在包契约任务中核对发布内容。
- ads、VAST、auto-thumbnail、vtt-thumbnail 等包的声明与源码参数/同步异步形状需要逐项对照。
- JASSUB、字幕 parser、screenfull 等第三方复制代码需要来源与许可台账。
- package-inventory 是当前 checkout 的清单，npm 发布基线尚未获取。

## 下一步

2026-09-10 新增 DOC-06：用户授权自主安装需要的新依赖、添加或改进合理脚本。已写入根指令、质量要求、工具链规范、AI 流程和 ADR-015；没有在这次记录任务中安装依赖或修改生产脚本。当时总数为 192 项。DOC-05 已提交为 `570600d2`；DOC-06 已提交为 `d7b348f3`。

2026-09-10 新增 DOC-05，记录并落实“每完成一项任务立即独立本地 commit”。当时总任务为 191 项。DOC-05 的范围是文档初始化和提交纪律，不包含生产实现；具体检查与提交主题见 changes/2026-09-10-DOC-05-task-commits.md。

2026-09-10 用户补充要求已落实到 quality-contract.md、ADR-013、根 AGENTS.md、AI 工作流程和变更模板：自主改进不合理内部设计、TS 化同时拆清模块、增加风险对应的有效测试，并持续维护包内架构和后续 AI 接续文档。初始任务数量保持 190，可按后续发现扩展；这次更新不代表开始或完成任何生产代码重构。

从 BASE-01 开始取得并固定消费者版本基线；随后完成接口/事件/DOM/包分发清单及 ENG 测试基础。当前没有任何核心或插件重构任务被标为完成。

## 会话记录模板

```text
日期 / HEAD / 分支：
任务 ID 和实际修改：
兼容差异与决策：
验证命令、环境、结果、报告：
未验证项与阻塞：
变更记录链接：
下一步与依赖：
提交/推送/发布状态：
```
