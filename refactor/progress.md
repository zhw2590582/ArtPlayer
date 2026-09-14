# 进度与证据

## PKG-AUTO-THUMB-10 编码归属与取消时限完成

JPEG编码拆为独立TS模块，原来帧等待结束后编码无时限，现有独立30秒编码时限。
完成时先撤销该时限再发布/取下一帧，切源/销毁/超时清理资源，迟到和重复Blob
不再产生后续动作；保留最后可用预览。此项明确限制极慢编码，不声称原生编码器
已复现自发卡死，也不改变公开时间公式/类型/工厂。初始六项旧红，候选九项编码
回归并入174项插件检查全部通过；严格TS通过，lint保留1既有warning。实际构建
三格式及docs副本，产物11项Node与9项三浏览器通过；源码27项浏览器与50项CI
回归通过。超时浏览器用例执行真实JPEG但受控扣留回调/触发时限，像素测试原有
首帧缺口仍独立保留。见[记录](changes/2026-09-14-PKG-AUTO-THUMB-10-encoding.md)及
[证据](baselines/auto-thumbnail-encoding-validation.json)。新增任务10独立提交，246项：
174 done、16 doing、56 todo；任务03/首帧风险仍开放。没有依赖/版本变化或发布。
下一步继续未完成包的资源、类型收尾与组合验证，不重复已失败的原生首帧等待方案。

## Auto Thumbnail 原生首帧边界检查点

新增独立 video/canvas 诊断，完全不加载 ArtPlayer 或插件。冻结原视频不变，另用
FFmpeg生成无B帧对照，确认两文件首帧均为紫色。Windows三引擎/两文件/三模式
共18组：WebKit26.6六组均未得到紫色，Chromium/Firefox十二组得到；可见视频也
会在currentTime0读到后续红帧。此证据将问题缩小到该宿主的原生画面路径，不能
推断所有Safari或标为修复。速率、微小seek偏移和布局/绘制等待的探索同样无效，
没有采用绕过首帧断言的方案。命令、实际FFmpeg/浏览器版本、事件/像素和报告指纹
见[检查点](changes/2026-09-14-PKG-AUTO-THUMB-03-native-decoder.md)和[证据](baselines/auto-thumbnail-native-decoder.json)。
源码/类型/分发与像素验收未改，仅新增诊断脚本和文档；目标lint与计划/风险检查
通过。PKG-AUTO-THUMB-03/AUTO-THUMB-PIXEL-01保持开放，245项/173 done不变。
下一步按原生边界选择其他支持后端/设备取证，同时继续该包的资源与异步边界审查；
不重复追加任意等待。VAST默认行为选择仍待答复。本地检查点提交，无推送/发布。

## MOD-DEV-01 自有开发服务器与关闭流程完成

HTTP、静态资源与 SSE 拆为严格 TS 模块，修复 Servor4.0.2 端口占用却退出0的
已复现问题。旧 dev 命令/默认8082保留，新增可选 ARTPLAYER_DEV_PORT；冲突退出1，
原服务继续运行。关闭负责监听器、连接、文件流、心跳/防抖与构建中的异步工作；
编译错误可恢复，成功构建和 docs HTML 修改均验证自动刷新。根开发依赖新增
mrmime2.0.1 仅查 MIME，Yarn冻结安装通过；Lerna/安装钩子/包源码与产物未改。
26项库工具、522项baseline、50项CI通过，严格类型与工具链通过，lint 1既有warning。
Windows三引擎最终6项通过，包括真实JS命令关闭、Monaco运行TS和本地MP4
播放/暂停/跳转/解码帧；实际tracked核心5.4.1不等于新npm候选，远端OS与真机
门槛仍保留。失败尝试和最终报告分开存档。详见[记录](changes/2026-09-14-MOD-DEV-01-dev-server.md)
和[证据](baselines/dev-server-validation.json)。关闭DEV-SERVOR-PORT-01，245项变为
173 done、16 doing、56 todo。独立本地提交后核实审计；无推送或发布。
下一步继续 Auto Thumbnail/VAST 等未完成包与组合验证，VAST默认行为选择仍待答复。

## MOD-02 库构建与开发脚本 TS 迁移完成

旧 build/dev/utils/projects/rebuild/build-analysis 入口保留，实现拆为严格 TS
模块，Vite 配置、banner/AMD、命名、包选择、队列和分析责任分离。63 个产物
在同一来源/路径下用旧脚本与新脚本构建，SHA-256 全部相同；真实 dist/docs 未改。
性能证据校验同步覆盖新的 TS 构建输入。默认8082保留，测试使用自有端口，未
终止原有服务。输出目录提前创建，避免漏入 Servor 初始 Linux 目录枚举；远端
Linux/macOS 实测仍待 CI。Windows 三浏览器验证真实 Worker、自动刷新、修改和
编译失败恢复最终3项通过，测试启动参数/手动刷新竞态的失败报告另存。
18项专项、522项baseline、50项CI回归通过；严格库/文档工具类型和工具链检查
通过，lint 保留1条既有warning。详情见[记录](changes/2026-09-14-MOD-02-library-tooling.md)
和[证据](baselines/library-tooling-validation.json)。没有新增依赖、Lerna变更或发布。
另用隔离子进程复现 Servor4.0.2 端口占用却退出0，新增开放风险及 MOD-DEV-01
作为下一任务处理启动失败和资源关闭责任，已接入最终工具链任务依赖。
245项：172 done、16 doing、57 todo。MOD-02 完成不代表该服务器缺陷或完整
重构完成。本地独立提交；VAST 默认行为选择仍待用户答复。


## MOD-PLUGIN-01 插件生成器与 TS 模板完成

生成器拆为严格 TS 的模板渲染、文件写入和 CLI，保留 create.js 旧命令入口及
合法命名规则。冻结旧脚本复现示例覆盖和 README 链接不匹配；候选拒绝覆盖，
失败时回退自己的未修改文件，保留外部修改并报告恢复路径。生成 TS 工厂、
CJS/ESM 声明、三格式分发消费测试和维护指南，不改既有包或添加真实 workspace。
11 项目标测试、522 项 baseline、50 项 CI 回归通过；生成包 lint 零 warning，
源码及新旧编译器严格检查通过，全仓 lint 保留 1 条既有 warning。初始子进程
测试报告问题及模板格式失败日志保留；详见[变更记录](changes/2026-09-14-MOD-PLUGIN-01-scaffold.md)
和[证据](baselines/scaffold-validation.json)。没有新增依赖、安装、推送或发布。
DOM 证据是 linkedom，不是未来插件功能的真实播放验收；文件写入不承诺进程
被杀后的自动恢复。244 项变为 171 done、16 doing、57 todo。下一步 MOD-02
继续 dev/build/utils 等剩余工程脚本；VAST 默认行为选择仍待用户答复。


## VTT Thumbnail 五核心组合检查点

PKG-VTT-THUMB-05 进入 doing。冻结真实核心5.1.6的197成员，和已有5.1.7、
5.3.0、5.4.0及候选核心验证实际预览截图像素、Chapter、网页/原生全屏、
播放/暂停、切源不重抓VTT及销毁。移动分支为Android UA和合成DOM触摸事件，
不能当真机。最终三浏览器69项通过，其中9项确认1.0.1在5.1.7起的历史控件
重名拒绝；其余60项行为通过。1.0.1/5.1.6合法组合及较新旧插件/新核心另测。
初次漏传测试事件与Chromium全屏截图超时报告保留；后者通过稳定控件后定位
鼠标并显式检查预览可见改善测试，不宣称生产修复。252项VTT、50项CI和lint
通过（1既有warning）。见[检查点](changes/2026-09-14-PKG-VTT-THUMB-05-combinations.md)和[证据](baselines/vtt-thumbnail-combinations.json)。
生产源码/类型/分发及依赖未改，任务/历史重名风险保持开放，未完成真机或打包
验收。243项保持170 done、16 doing、57 todo。下一步MOD-02剩余工程脚本与
模板迁移可独立推进；VAST默认行为选择仍待用户答复。本地提交，无推送/发布。



## Auto Thumbnail 首次 seek 诊断检查点

SITE-04 的全包文档核对依赖尚未完成的 Auto Thumbnail/VAST 迁移，本轮先回到
PKG-AUTO-THUMB-03。新增 --first-seek 诊断，保留唯一紫色首帧和真实 setter
记录。最终十组中 WebKit 六组均完成抽帧但首帧错误；Chromium/Firefox 各两组
控制正确。去掉首次 seek、延迟绘制与核实完成的前进/回零都不能作为修复。
迟到零点事件使最初 warm 探针没有实际回零；已修正观测并保留无效/超时报告。
普通十四组诊断也完成；生产源码、产物和像素断言未改。任务/风险仍开放，
不是整包验收通过。见[检查点](changes/2026-09-14-PKG-AUTO-THUMB-03-first-seek.md)和[证据](baselines/auto-thumbnail-first-seek.json)。
任务数保持 243 / 170 done。下一步推进已满足依赖的 VTT Thumbnail 新旧核心
组合验收；SITE-04 保持 todo，不跳过其依赖。本地检查点提交，无推送/发布。

## SITE-03 桌面编辑器与生成流程完成

桌面自有 UI 拆为严格 TS 的 bootstrap、Monaco、运行会话、文件导入与设置模块；
common.js/bootstrap.js 由源码生成，编辑器声明列表移到生成的 TS 单一来源。
实际 TS worker 编译后运行，修复旧版原样 eval TS、文件读取错误不结算及存储
被拒时无法启动。三浏览器验证发现并修复 Monaco 语言模块与依赖 loader 的
AMD 竞态，保留初始失败。原 DOM、偏好键、URL、Run/Ctrl-S 与公共包 API 保留。
最终浏览器 42、目标集成 21、baseline 522、CI 50 全部通过；严格类型、工具链、
生成一致性、冻结安装和 lint 通过（1 条既有 warning）。只新增 Monaco0.30.1
开发类型依赖，既有锁条目、vendor、核心公开声明未变。合成 pagehide 不代替
真机 BFCache；完整示例/搜索/链接/设备与远端发布验收仍开放。
见[变更](changes/2026-09-14-SITE-03-desktop-editor.md)和
[证据](baselines/site-editor-validation.json)。当前 243 项：170 done、15 doing、
58 todo。下一步 SITE-04 中英文 API 语义核对；Auto Thumbnail/VAST 源码迁移和
全部插件最终验收仍开放。独立本地提交后审计，无推送或发布。

## SITE-BUILD-01 构建流程完成

i18n/VitePress 构建完成严格 TS 模块拆分，暂存后替换并保留失败恢复路径；
文档子进程固定使用当前 Yarn1.22.22，保留退出码。11 语言的 22 个 UMD/ESM
文件在两处输出与起点 Git 内容一致，四类导出/历史别名验证通过。实际完整
文档构建发现随机 code-group ID 导致哈希不稳定，已用本地 renderer hook 修复，
连续两次构建树指纹一致。生成 docs/document 已同步源码。
7 项目标测试、522 baseline、50 CI、严格类型/工具链/lint 通过（1 既有 warning）。
三浏览器最终 6 项验证中英文深层页面、Run Code 目标和代码组切换；目标编辑器
为受控接收页，完整编辑器/搜索/链接/设备仍另行验收。初次测试入口问题和随机
ID 的失败证据保留。目录替换/进程崩溃的限制与恢复说明见模块 README。
见[变更](changes/2026-09-14-SITE-BUILD-01-staged-builds.md)和
[证据](baselines/site-build-validation.json)。当前 243 项：169 done、15 doing、
59 todo。下一步 SITE-03 桌面 common.js UI 的 TS 迁移；其它包开放问题不变。
本任务独立本地提交后审计，不推送、不发布。


## SITE-AI-DOCS-01 文档工具完成

将 build-llm/trans-docs 拆为严格 TS 模块，保留旧命令路径。离线 LLM 文件含
66 个原始来源及指纹清单，生成/只读检查进入 CI；翻译默认只显示计划，显式
远程操作先生成草稿，校验后应用，捕获写入失败时回滚并保护并发作者修改。
已复现并修复旧工具先删英文、错误修补代码块及最后 429 返回 undefined。
新增 12 项测试、目标组合 18 项、完整 baseline 522 项、CI 回归 50 项通过。
严格类型、工具链和 lint 通过（根 lint 1 条既有 warning）；最终悬空链接修复
后复跑新测试/目标 lint/类型。当前中英文源文档与起点一致，无远程翻译或
发布。崩溃/断电不具备跨文件事务保证，英文质量与浏览器验收未计入本任务。
见[变更](changes/2026-09-14-SITE-AI-DOCS-01-documentation-pipeline.md)和
[证据](baselines/documentation-pipeline-validation.json)。当前 242 项：168 done、
15 doing、59 todo。下一步 SITE-03 剩余 i18n/VitePress 编排和桌面 UI 迁移；
VAST 默认行为、Auto Thumbnail 首帧及各包最终验收保持开放。独立本地提交并
审计，无推送或发布。


## SITE-LOAD-01 示例加载与导航完成

从 SITE-03 拆出共享 TS loader、移动入口与 Run Code/语言导航；恢复 define 原
描述符，串行依赖/批次并缓存成功项、重试失败项，阻止旧示例晚到覆盖新 Run。
保留原 URL、example 优先、Run cleanup 和页面使用方式。生成三个 ES2020
资产，root build:docs 先生成；浏览器类型、生成一致性与 common.js lint 已纳入
CI。13 项最终目标测试、522 项 baseline、50 项 CI 回归通过。三浏览器最终
24 项通过（21 新项 + 3 Monaco）；一次 Firefox page fixture 创建超时保留报告，
其后等基线结束串行复验，没有扩大超时/重试取绿。类型、只读资产、工具链、
lint 均通过（根 lint 1 条既有 warning）。见
[变更](changes/2026-09-14-SITE-LOAD-01-site-loading.md)和
[证据](baselines/site-loading-validation.json)。当前 241 项：167 done、15 doing、
59 todo。SITE-03 保留生成/翻译流程与桌面剩余 UI 的 TS 迁移；未验证完整
VitePress 构建/设备/广告服务/远端 CI。下一步接续 SITE-03，不改变 VAST 默认
行为和 Auto Thumbnail 首帧的开放状态。仅本地独立提交，无推送或发布。

## SITE-02 编辑器声明生成链完成

build:ts 与 core/plugin 转换器完成 TS 模块拆分，原 JS/MJS 命令/导入路径保留。
修复 Chapter/VAST 文本回退产生的冲突导出与 SDK 类型丢失；22 份实际加载声明
在内存格式化后用主 TS 5.9.3/旧 TS 4.3.5 整组检查，通过才写文件。其余 20 份
声明与起点一致，生产源码/公开类型/锁不变。VAST SDK 类型保留私有命名空间与
原签名，生成上游 notices；新增只读 check:editor-types 接入 CI。4 项编辑器
测试、522 项 baseline、50 项 CI 回归、严格工具链/工具类型/lint 通过（根 lint
1 条既有 warning）。三浏览器实际 Monaco 检查 22 份声明、拒绝坏参数并执行
Chapter emit 的 ready/destroy，3 项通过。VAST 仅验类型，未执行广告。
见[变更](changes/2026-09-14-SITE-02-editor-declarations.md)和
[验证](baselines/editor-declarations-validation.json)。当前 240 项：166 done、
15 doing、59 todo。下一步 SITE-03 站点/移动加载与编辑器流程；VAST 默认行为、
Auto Thumbnail 首帧及插件最终验收保持开放。独立本地提交，无推送或发布。

## SITE-SMOKE-01 示例生成器与就绪检查完成

从 SITE-02 拆出文档示例工具，TS parser/generator/runtime 与严格检查的原 JS
入口职责分开。固定旧版复现异常围栏无限循环，保留 11 文件 233 段旧示例；
生成清单和浏览器 bundle 可重复、可只读检查。每例 iframe 等待真实 ready、
收集同步/异步错误并清理，替换旧固定 100ms 成功。三浏览器共 33 项、生成器
5 项、完整 baseline 522 项、CI 50 项及 406 生产 TS/消费者检查通过；frozen
安装、工具链与 lint 通过（根 lint 1 既有 warning）。新增两项根开发类型依赖，
显式使用主 TS 5.9.3，修复共享 tsc bin 指向兼容 5.1.6 的检查歧义。Windows
WebKit 原尺寸差异仍保留 DPIP-MEDIA-01；完整 233 例交互/SDK/设备没有计为通过。
见[变更](changes/2026-09-14-SITE-SMOKE-01-documentation-smoke.md)与
[证据](baselines/docs-smoke-validation.json)。当前 240 项：165 done、15 doing、
60 todo。下一步 SITE-02 编辑器声明生成器；VAST 兼容选择、Auto Thumbnail 首帧
和各包最终验收仍开放。仅本地独立提交，无推送或发布。

## SITE-01 文档/示例/生成链清点完成

建立当前 22 包、27 Markdown、30 示例、36 HTML、963 声明成员和 204 资产
的可重跑清单。增加文档站维护地图；核对六类执行 HTML、查询/存储/移动加载、
声明注入和生成链。修复 BASE-04 漏登记 asr.local.js 导致的真实路径校验失败，
保留历史快照并用有提交来源的增量记录覆盖新增路径。固定 npm 对照确认 vConsole
3.15.0 字节一致，Monaco 0.30.1 的 98/99 字节一致、余下 CSS 仅换行不同；
取得 notices，console bundle/字体/样本和历史 thumbnail 差异仍需处置。新增
SITE-07 接续资产/notice 并成为 SITE-05 前置。517 项完整基线测试无失败/跳过，
目标和根 lint（0 error/1 既有 warning）、严格工具链、清单/计划/风险校验通过。
见[变更](changes/2026-09-14-SITE-01-site-inventory.md)、[清单](site-inventory.md)
和[验证](baselines/site-inventory-validation.json)。没有执行实播、完整站点构建或
远端 CI/部署；来源指纹与标题候选不作为授权/语义/发布通过。当前 239 项：
164 done、15 doing、60 todo。下一步 SITE-02 声明/示例生成器；VAST 兼容选择和
Auto Thumbnail 首帧仍开放。

## EX-02 Vue 消费者完成

Vue 示例入口和配置职责完成 TS 整理；保留挂载时读取 option、原 getInstance
事件/类型和私有 ref 边界。严格检查实际 SFC/模板，原 JS 调用单独验证。候选
与旧包装分别开发/生产 × 三引擎，各 15 类检查共 12 组通过，实际 Worker、
实例和 DOM 均清理。新依赖下 React 六组回归、全仓 406 个生产 TS 文件、50 项
CI 回归、lint（0 error/1 既有 warning）、frozen 安装、工具链、声明漂移和
Vue 构建检查通过。内置浏览器另验证真实开发页公网样例播放/暂停/Home，UA
报告 Chrome/152.0.0.0，补丁版本未提供；临时页和服务已关闭。见
[变更](changes/2026-09-14-EX-02-vue-consumer.md)及
[证据](baselines/vue-consumer-validation.json)。未关闭 PiP/Danmuku 等专项和
真实设备/发布门槛；远端 CI 未验证，无推送/发布。当前 238 项：163 done、
15 doing、60 todo。下一步推进 SITE-01 文档站入口/资产核对，VAST 兼容选择和
Auto Thumbnail 首帧仍未关闭。


## ENG-LINT-01 全仓 lint 恢复

在 EX-01 独立提交 e0d785662 并通过提交审计后，只调整 Mask manifest 顶层字段
顺序。解析后与起点完全相等；全仓 lint 返回 0（0 error、1 条既有生成声明
注释 warning），严格工具链通过。见[变更](changes/2026-09-14-ENG-LINT-01-manifest-order.md)
和[证据](baselines/manifest-lint-validation.json)。未改运行代码/类型/产物/锁，
未关闭 Mask 设备等任务，未推送发布。当前 238 项：162 done、15 doing、61 todo。
下一步为 EX-02 Vue 实际消费者；VAST 默认选择和 Auto Thumbnail 首帧仍待关闭。


## EX-01 React 实际消费者完成

修复 React HTML 错误入口，以及 getInstance 抛错时实例泄漏；保留 Partial<Option>、
可选回调、div 属性、引用变化重建和示例插件/语言覆盖规则。拆出示例配置模块，
补齐严格 TSX、维护说明和根 Yarn 命令。实际打包安装核心/Danmuku/Document PiP，
逐文件对照并 frozen 重装；类型不允许从工作区补齐。最终开发/生产 × 三引擎六组
各 12 类检查通过，包括真实播放/暂停/seek/像素、兄弟实例、卸载重挂载和异常
清理。固定旧包装控制复现 1 个残留实例。全仓 406 个生产 TS 文件检查、示例
构建/lint、严格工具链和 frozen 安装通过；47 项 CI 回归通过。GitHub 增加消费
检查和失败证据上传，远端运行未验证。见[变更](changes/2026-09-14-EX-01-react-consumer.md)
和[证据](baselines/react-consumer-validation.json)。另有全仓 lint 被未改动 Mask manifest 排序阻断，已登记独立 ENG-LINT-01。
任务现为 238 项：161 done、15 doing、62 todo；未关闭插件专项任务。
下一步推进已就绪的 Vue 消费者 EX-02；Auto Thumbnail 首帧与 VAST 兼容选择仍未关闭。


## PKG-AUTO-THUMB-03 渲染/等待诊断检查点（仍 doing）

新增可重跑的 `yarn probe:auto-thumbnail-rendering`，用固定实际 ESM/时间轴媒体
对照真实尺寸下四种可见性样式及 current/readyState/loadeddata 事件三种策略。
最终 Windows WebKit 12 组均未取得唯一紫色首帧；Chromium/Firefox 两个对照正常。
首个 loadeddata 的交付计数被直接记录，避免将 readyState>=2 误称为已等待事件。
正确 Firefox 帧的 totalVideoFrames 仍为 0，不能用该计数 >0 构造通用等待条件。
另外捕获三组旧 seeked 导致的同目标重试，保留全部事件，不把它算作额外采样。
生产源码、dist 和普通像素断言均未改变；没有采用未通过验证的 CSS/等待修复。
见[诊断记录](changes/2026-09-14-PKG-AUTO-THUMB-03-rendering-readiness.md)与
[证据](baselines/auto-thumbnail-rendering-readiness.json)。脚本/lint/工具链及计划
检查通过只说明诊断可运行，不代表首帧通过。PIXEL-01 和 03 保持未完成，计划
仍为 237 项：160 done、15 doing、62 todo。后续不再重复这些已否定的简单策略，
继续定位当前媒体路径和补齐独立的历史消费验证；VAST 默认初始化选择仍待答复。

## PKG-AUTO-THUMB-09 历史 default 调用兼容完成

通过同一函数上的 default 自引用补齐 1.0.1 的 JavaScript 调用，继续支持 1.1.0
直接调用。根声明字节未变；/runtime 新增 RuntimeFactory 描述递归别名，保留
原纯调用 Factory，实际源码无需断言即可通过两类公开类型检查。旧候选两项
失败、新实现通过；源码联合 165 项、正式 main/legacy 各 60 项通过。实际安装
验证 1.0.1 default、1.1.0 direct 与候选同函数身份，确认 1.0.0 缺运行文件。
十组编译配置及三组 no-interop 通过。三引擎 main/legacy 各 18 项原生生命周期
检查通过，新增 alias-complete 真实抽帧、JPEG 解码和清理；不是首帧像素验收。
严格包类型、lint、构建副本一致性、frozen 安装与工具链检查通过。见
[变更](changes/2026-09-14-PKG-AUTO-THUMB-09-alias.md)与
[验证](baselines/auto-thumbnail-alias-validation.json)。TYPE-01/EXPORT-01 的完整
历史类型形状仍待 04/06，PIXEL-01 和物理设备仍未关闭。08 的无别名验证保留为
旧候选快照，不能替代本次新产物证据。全计划 237 项：160 done、15 doing、
62 todo；03/04/05/06 继续，VAST 初始化兼容选择仍待回复。

## PKG-AUTO-THUMB-08 公开类型入口完成

保留实际 npm 1.1.0 根声明字节与旧工厂提取/替换形状，新增复用原运行文件的
`/runtime`，准确声明 Promise 注册、选项和结果；未添加不存在的 default 自引用。
内部选项与运行类型共用，源码返回值通过公开 Factory 验证。编辑器改用语义
生成器，修复混合导出声明；Node10 legacy 类型路径已补齐。最新与候选实际安装
十组编译配置和三组无 interop 验证通过，安装产物 Promise 注册与清理通过。
联合 163 项、最终三项类型回归、全仓严格类型检查（406 个生产 TS 文件）、lint、
正常构建、frozen Yarn 安装和严格工具链检查通过；构建运行代码与起点归一化
换行后完全一致。中间 no-interop 声明失败已修复并留证。没有新增依赖或发布。
见[变更](changes/2026-09-14-PKG-AUTO-THUMB-08-types.md)与
[验证](baselines/auto-thumbnail-types-validation.json)。本项从 04 独立拆出，04
仍依赖 03 与 08；03 首帧、1.0.x 完整历史隔离消费及 05/06 仍未完成，不关闭
AUTO-THUMB-PIXEL-01/TYPE-01/EXPORT-01。源码和公开类型阶段完全完成的插件仍
为 14/16；全计划 236 项中 159 done、15 doing、62 todo。

## PKG-AUTO-THUMB-07 私有画布清理完成

抽帧 canvas 现由 job 清理宽高；取消、失败和正常完成后归零，单个 reset 抛错
仍继续其他清理，分配期间销毁不会继续分配另一维。已编码 JPEG 和最终预览 URL
保留。六项受控回归旧实现全部失败、新实现全部通过；冻结 main 的原生完成检查
同样先失败。联合 160 项通过，main/legacy 各 58 项受控检查和各 21 项原生检查
通过，完成后的 JPEG 仍可解码为 800×45。严格包 TS、lint、正常三格式构建及
docs 副本一致性通过。关闭 AUTO-THUMB-CANVAS-01；不声称精确 GPU/内存回收量。
[变更](changes/2026-09-14-PKG-AUTO-THUMB-07-canvas.md)和
[红绿记录](baselines/auto-thumbnail-canvas-validation.json)含中间测试调整。
03 依赖该独立修复，仍继续前两格 WebKit 像素和其他迁移工作；04-06、版本及
发布验收未完成。VAST 的初始化决定仍待答复。下一步继续未完成源码/类型迁移。

## PKG-CHAPTER-05 时序取证继续（doing）

复核旧失败 ZIP：一次 restart 数组读取耗时 9956.244 ms，返回时已含目标 URL；
不能只凭原超时文本认定七秒都未触发 restart。新增公共/原生事件页面时点与
restart 读取往返耗时，三浏览器四组质量/章节/缩略图组合十二项通过，保留两项
已发布核心 WebKit 位置归零观察。无生产或依赖变更，CHAPTER-TIMING-01 和物理
设备缺口保持未关闭，05/06 未完成。详见[记录](changes/2026-09-14-PKG-CHAPTER-05-timing.md)
及[trace 摘要](baselines/chapter-timing-observations.json)。VAST 的初始化兼容
选择已再次列为待答复事项，尚未变更默认行为；其他独立实施继续。

## PKG-JASSUB-09 合成截图验证（doing）

新增显式截图模式，由 Node pngjs@7.0.0 解码实际页面 PNG，不复制转移画布。
绿色 ASS 字形有 seek 前后签名、播放推进、全屏、隐藏归零和恢复可见断言。
修正截图用例短字幕窗口导致 WebKit 前置样本过期的问题后，三浏览器与三核心
最终九项通过。默认 readback 和其红序列保留；早期截图模式也出现 Firefox
首次像素/全屏失败，不能把本轮全绿解释成停顿已修复。09/05 继续 doing。
根测试依赖与唯一 Yarn 锁同次更新，frozen 安装、严格工具链、相关 ESLint 和
工具链反例测试通过。生产源码/公共类型/分发产物未变。
[变更与中间失败](changes/2026-09-14-PKG-JASSUB-09-display.md)及
[截图阶段和运行摘要](baselines/jassub-display-validation.json)记录实际覆盖。
下一步保留 Firefox 未关闭风险继续取证，同时推进其他可独立完成的插件迁移和
组合验收；本问题尚不足以阻止整项重构的其他实施工作。

## PKG-JASSUB-09 Firefox 原生绘制诊断（doing）

新增不加载 JASSUB 的 Worker/ImageBitmap 控制，按新核心、已发布核心及无脚本的
原生页面验证 seek/viewport 布局。一次失败的 createImageBitmap 等待区间约十秒；
统一尺寸后纯原生仍通过，尚不能完全排除核心宿主/样式/合成调度影响。前置切字幕
已不是必要条件：无前置测试的重叠读取 2 通过/1 失败，等待 Worker 完成再读取
三项通过。软件渲染对照也有失败，rAF 等待亦未解决，均不作为默认配置替代。
最终 fillRect 三浏览器控制九项通过；这是原生控制，不是 JASSUB 字幕验收。
本轮只改测试和诊断文档，生产代码/类型/产物未变，保留 09/05 和风险 open。
[诊断记录](changes/2026-09-14-PKG-JASSUB-09-firefox-diagnostics.md)及
[机器证据](baselines/jassub-firefox-diagnostics.json)保存不同参数和所有红绿结果。
下一步验证画布像素复制与异步绘制竞争的假设，补充无需复制转移画布的实际显示
证据；仍须证明字幕在播放、seek、布局后真实可见，不能只检查 Worker 通知。

## PKG-JASSUB-09 hybrid 归属修复检查点（doing）

修复旧混合帧干扰新 offscreen 画布、被丢弃完成通知导致等待卡死，以及销毁后
两个切字幕方法重新分配画布。受控 11 项旧产物 7 通过/4 失败，候选全部通过；
联合 196 项、源码/main/legacy 各 79 项和 15 个实际安装类型组合通过。
Chromium 实际 Worker/ImageBitmap 跨公开切字幕交错通过，legacy 切换三项和主线程
九项通过；Firefox matrix=null、WebKit 无转移能力均只算普通切换控制。
默认 main 最终顺序回归 11 通过/1 Firefox 全屏失败，08 产物同顺序也复现旧核心
失败；不能归因于并发负载，根因仍待查。09/05 及相关风险不标完成。
[检查点记录](changes/2026-09-14-PKG-JASSUB-09-hybrid.md)和
[完整红绿证据](baselines/jassub-hybrid-validation.json)保留中间不完整修复和对照。
下一步处理 JASSUB-FIREFOX-OFFSCREEN-01，再继续完整分包验收和未完成迁移。

## PKG-JASSUB-08 默认 offscreen 初始化完成

05 默认模式验收发现 Chromium/Firefox 六项真实页面错误；初始 canvas 消息先于
offscreenCanvas，使 Worker 返回主线程无法绘制的 render。现在先交接画布再打开
ready 门槛，保留原能力选择，新增六项顺序/取消/回退测试（旧 5 通过/1 失败）。
联合 191 项、源码/main/legacy 各 74 项通过；默认 main、默认 legacy 加生命周期、
显式主线程加生命周期共 51 项原生验证通过。15 个安装类型矩阵和最终包成员一致。
[变更与复跑](changes/2026-09-14-PKG-JASSUB-08-offscreen.md)及
[证据](baselines/jassub-offscreen-validation.json)保留失败与修复，关闭
JASSUB-OFFSCREEN-01。08 独立交付；05 保留全量组合、hybrid/错误恢复/设备等验收，
06、VENDOR-04/05、独立 major 与全局发布复盘均未完成。

## PKG-JASSUB-07 vendor 生命周期与默认字幕时钟完成

独立补丁保留原上游身份，修复幂等销毁、构造回滚、跨视频帧归属、数值倍率和
查询异常清理；Windows WebKit 全零质量计数的默认逐帧停滞有旧失败及候选修复。
联合 185 项、源码/main/legacy 各 68 项、406 生产 TS 检查通过；实际安装 15 个
类型矩阵，核心 68/JASSUB 15 成员与候选相符。真实浏览器 51 项通过，包括默认
onDemand 播放/seek、自定义 canvas、跨父节点换视频、原生构造与 CSP 错误。
[变更与限制](changes/2026-09-14-PKG-JASSUB-07-vendor.md)和
[验证记录](baselines/jassub-vendor-validation.json)保留测试时序/CSP/WebKit 的中间
失败及修正，不冒充设备、默认 offscreen 或完整发布验收。关闭六项已证实风险，
05/06、VENDOR-04/05 及全局三轮复盘仍保留。下一步继续分包兼容验收与未完成迁移。

## PKG-JASSUB-04 自有 TS 与准确类型入口完成

两个自有模块已迁为严格 TS，编译后的 JS 和三种正常构建产物保持上一任务行为。
实际 npm 两版旧根声明完整保留，新增 /runtime 描述真实同步方法/可选参数，
修复旧 Node10 legacy 解析与编辑器导出冲突；无 interop 的 CJS 类型引用也通过。
联合 139 项、源码/main/legacy 各 15 项、406 生产 TS 全仓检查通过；实际两旧包及
候选的仓库外安装 15 编译器组合通过，新增真实 WASM 查询/修改测试。
[变更记录](changes/2026-09-14-PKG-JASSUB-04-types.md)和
[安装与类型证据](baselines/jassub-types-validation.json)保留中间失败及最终候选。
新增 JASSUB-QUERY-01 有冻结错误复现，交由下一项 07 修复；没有宣称新浏览器
播放或发布验收。下一步继续 vendor 生命周期/时钟/查询清理，05/06 仍未完成。


## PKG-JASSUB-03 自有注册/清理改造完成

入口与 registration 分离；自定义 canvas、直接实例销毁后的宿主清理、重入与
注册异常回滚已修复。旧产物同断言 1 通过/7 失败，候选八项通过；联合 128 项、
main/legacy 各 15 项和实际浏览器 24 项通过，三格式正常构建。
[实现记录](changes/2026-09-14-PKG-JASSUB-03-registration.md)说明 onDemand=false 的
自定义 canvas 验证边界；WebKit 默认逐帧和 vendor 其他问题仍在 07/05。04 接着
完成自有 TS 和公开类型，vendor/资源/声明本次未变；每项单独本地提交。

## PKG-JASSUB-02 历史缺陷与原生渲染基线完成

联合 120 项通过，其中 63 项确认旧失败/已有保护；没有宣称修复。Chromium/Firefox
实际 npm 插件和 WASM/字体六个核心组合通过，WebKit 默认逐帧路径仍失败，显式
事件时钟诊断单独通过。测试 server 的 WASM MIME 错误已修正并保存首次失败。
[基线记录](changes/2026-09-14-PKG-JASSUB-02-failure-baseline.md)明确新增六项风险；
03 处理自有 adapter，新增 07 专门修 vendor 生命周期/时钟且纳入 05 前置。生产文件
未改，02 仅完成基线职责，全部兼容与发布门槛保留。

## PKG-JASSUB-01 来源及契约核对完成

两份 WASM 与 11 份字体的上游 blob 已精确匹配，nightly 对应源码、七子模块和
构建/通知来源明确；新联网验证 23 请求成功，13 字节比较通过。本包联合 50 项
通过，saved-evidence 三项通过。旧 npm WASM 不匹配事实保留，VENDOR-04/05 仍
open，完整通知/未明确字体分发由 06/SITE-01 继续。
[来源补充](changes/2026-09-14-PKG-JASSUB-01-provenance.md)和验证器已落地，生产资源
未变；02 接着建立异常及资源基线，然后继续自有 adapter TS。此项新增一项 done。

## PKG-MASK-05 真实模型组合检查点（仍 doing）

main/legacy 各 18 项，三个浏览器引擎和三个核心组合共 36 项通过。实际模型、PNG
透明像素、弹幕节点、暂停/seek/网页全屏和画布清理已有证据；启动窗口遗漏单独
登记 MASK-SCHEDULING-01，GPU/WASM/设备与其他剩余门槛未关闭。
[检查点](changes/2026-09-14-PKG-MASK-05-native-checkpoint.md)记录失败历史、独立审查、
历史 beta 归档、重跑和限制；没有生产修改或新增 done。

## PKG-MASK-04 严格TS及公开类型完成

五个自有模块迁TS且运行产物保持MASK03字节；真实核心宿主、SDK声明桥接和私有资源
类型通过严格检查。修复旧Node解析/legacy类型路径与编辑器混合导出，保留根工厂。
联合99项、安装包15编译器模式和全仓404生产TS通过；[详细记录](changes/2026-09-14-PKG-MASK-04-types.md)。
16插件中源码与类型迁移未完成的剩AutoThumbnail/VAST/JASSUB三包；所有后续组合/发布
门槛继续按tasks.json执行，不能把迁移完成当作已可发布。Mask05/06与实际SDK资源风险待验收。


## PKG-MASK-03 生命周期拆分完成

五个职责模块和单运行归属控制器落地；停止/销毁、迟到回调、并发启动、释放等待和
多实例互不干扰有36候选测试。联合历史共96通过，lint和三格式正常构建通过。
新增包架构与[变更记录](changes/2026-09-13-PKG-MASK-03-lifecycle.md)，候选用例接入test:unit。
MASK-START关闭；真实GPU/WASM释放、模型/后端/DOM组合仍保留05门槛，04 TS迁移下一步。
自动缩略图内部TS检查点已独立提交6c989decc并通过提交审计；03仍doing。


## PKG-AUTO-THUMB-03 内部TS检查点（仍doing）

六个抽帧/会话/资源运行模块迁到严格TS，内部类型和实际核心宿主接入fixture齐备。
源码154项（52候选、102历史）、产物各52项、三格式浏览器各21共63项通过；
严格分包及全仓398生产TS流程通过，最终宿主兼容修正另经分包fixture验证。
仅当前实现内部契约；公开声明04、WebKit无帧回调的前两格像素与资源边界仍待完成。
详见[检查点](changes/2026-09-13-PKG-AUTO-THUMB-03-internal-types.md)；不增加done数，
不关闭像素风险。该检查点单独本地提交，Mask源码与状态不纳入同一提交。

## PKG-DANMUKU-07 弹幕稳定性阶段验收完成

12后的源码在三引擎完成新旧插件两档负载对照，每例三轮42秒原生播放；候选
72/720条全部采样、显示并回收一次，真实节点复用、状态池唯一归属和Worker清理通过。
两核心共享CSS mask根层与已有资源回归通过；最终12+6+48共66项，0重试/跳过。
首轮错误测试把load(rows)当替换，修正为历史追加契约并保留失败报告；独立审查
补足复用与跨轮重复断言。Mask不依赖队列，根层属于核心；纠正文档和影响映射原因，
保留组合CI范围。lint及影响检查通过，没有生产/声明/依赖变化，复用12的相关验证。
见[变更](changes/2026-09-13-PKG-DANMUKU-07-stability.md)和
[证据](baselines/danmuku-stability-validation.json)。DANMUKU-LOAD-01按已解释来源及
11/12独立修复闭环；CPU阻塞下旧窗口不追赶的边界明确保留，不声称无条件无漏弹幕。
231项：149 done、14 doing、68 todo。08完整组合、09分发、真实Mask模型和设备/
发布复盘继续；独立本地提交，不推送、不发布。

## PKG-DANMUKU-12 持续采样与串行放置完成

异步beforeVisible/Worker等待期间继续原生RAF采样和可见寿命维护，以内部身份
buffer保留真实采到的行；公开readys窗口和状态不改，callback/放置仍串行。
取消清空待处理引用，旧finally不清新代buffer；同批不重排，后续批保持ready优先。
完整源码264项、main/legacy各68项单测，以及三格式各102共306项浏览器通过，
无重试/跳过；后者含CPU阻塞诊断，不能计作任意负载无漏弹幕证明。
严格分包TS、lint、构建和工具链检查通过。红测、历史双循环差异、内部RAF断言
更新及准确验证范围见[变更](changes/2026-09-13-PKG-DANMUKU-12-frame-sampling.md)
和[证据](baselines/danmuku-frame-sampling-validation.json)。
231项：148 done、15 doing、68 todo。关闭DANMUKU-SAMPLING-01；07恢复doing，
DANMUKU-LOAD-01保留，继续真实持续负载、资源和Mask边界，不跳过后续插件迁移。
本任务独立本地commit；未推送、未发布。

## PKG-DANMUKU-11 Worker 等待寿命修复

07负载审查独立发现并复现：隐藏Worker等待超过speed时，刚显示的弹幕下一帧就被
回收。成功放置时重置可见起点，保留准备时速度、几何、取消检查与事件顺序。
三模式受控红/绿、两核心与三引擎真实延迟Worker验证通过；完整源码253项、
main/legacy各57项单测，源码90及两个产物各12共114项浏览器通过。构建/lint/严格
分包TS通过，见[变更](changes/2026-09-13-PKG-DANMUKU-11-visible-lifetime.md)和
[机器证据](baselines/danmuku-lifetime-validation.json)。
这是实际视频/Worker加受控请求延迟，不声称自然饥饿或持续高负载通过。
230项：147 done、15 doing、68 todo；07继续，DANMUKU-LOAD-01仍开放。
新增11是独立缺陷任务和本地commit；不推送或发布。

## PKG-DANMUKU-06 自有 TS 与公开声明完成

20个自有运行模块完成严格TS，新增内部状态/Worker/parser/UI类型边界；公开运行
数据单一维护。实际npm5.3.0根声明完整保留，新增同实现/runtime准确描述Promise、
owner、getter、回调和数据；语义docs编辑器声明同步生成。包架构和维护命令已更新。
完整源码250项、main/legacy各164项联合单测、4项类型检查、12组仓库外安装消费者
通过；全仓390生产TS严格检查、冻结Yarn安装、工具链、构建和目标lint通过。
三格式/两核心/三引擎最终468项浏览器通过，原断言/超时不变、无重试/跳过；内置
Chrome152完成现有docs示例实际播放、发送与暂停。Worker data URL测试加载器、
先前报告目录冲突和WebKit超时均保留原因与失败证据，未把重跑等同历史从未失败。
关闭DANMUKU-TYPE-01/02；LOAD-01与稳定性/组合/分发及发布复盘继续保留。
见[变更](changes/2026-09-13-PKG-DANMUKU-06-types.md)和[机器证据](baselines/danmuku-types-validation.json)。
229项：146 done、15 doing、68 todo；07进入负载、渲染与资源稳定性验收。
本地独立任务提交，不推送或发布。

## PKG-DANMUKU-10：issue #958 密集热力图修复

用户新增的16000条弹幕热图过高/裁平已独立复现并修复。自动密度拟合到底部四分之一，
保留显式坐标、自定义points、getter和历史生命周期。完整弹幕250项与102项真实浏览器
通过，包含两核心/三引擎/三格式；构建和lint通过。详见[变更](changes/2026-09-13-PKG-DANMUKU-10-heatmap-density.md)及[证据](baselines/danmuku-heatmap-density-validation.json)。
229项：145 done、15 doing、69 todo。06的TS迁移仍进行中，07长负载与发布复盘未完成。
独立本地提交；未推送、未发布、未关闭远端issue。

## PKG-DANMUKU-05 渲染、设置与热力图完成

拆renderer、Setting模板/滑块/发送/资源/全局样式和heatmap采样/几何/生命周期。
修复外部DOM、锁计时器、订阅与节点清理、初始化回滚及窄热力图卡死，保留共享宿主
用户写入、原points mutation、首实例SVG钩子与合法大数据。源码/main/legacy各159项
联合测试，完整test:danmuku245项、三格式×138共414原生浏览器项通过；冻结安装、
严格工具链、完整类型检查和正常构建通过。内置浏览器完成现有docs示例播放/暂停/发送。
关闭CLEANUP-01/HEATMAP-01，见[变更](changes/2026-09-13-PKG-DANMUKU-05-resources.md)及[机器证据](baselines/danmuku-resources-validation.json)。
228项：144 done、15 doing、69 todo；06进入完整TS。
真实长负载、发布前复盘仍待对应任务；无推送或发布。


## PKG-DANMUKU-04 时钟、队列与轨道调度完成

拆分scheduler/queue/worker-client，修复多RAF、同毫秒请求串线、取消后续写、
节点重复分配、异步拒绝及恢复重入；复审修复03引入的NaN兼容回归。
源码/main/legacy各104联合测试、三格式共198真实浏览器项及60次额外密集场景通过；
完整构建、lint通过。关闭ASYNC-01/TRACK-01，Settings/heatmap/完整TS/长负载仍待后续。
见[变更](changes/2026-09-13-PKG-DANMUKU-04-scheduler.md)及[机器证据](baselines/danmuku-scheduler-validation.json)。
228项：143 done、15 doing、70 todo；05进入实施。
没有推送或发布。


## PKG-DANMUKU-03 输入、解析和配置源码完成

拆分input/config/XML parser模块，修复过期替换、加载拒绝、资源清理、time0、函数配置
及初始化销毁/失败；保留同步数组前缀、内部返回身份、追加及回调约定。候选三格式
各46单测、三格式×两核心×三引擎共72真实浏览器项、旧基线86项通过；正式构建、
lint和366生产TS/消费者检查通过。首轮产物parser故障夹具误伤已校正，原日志保留。
见[变更](changes/2026-09-13-PKG-DANMUKU-03-input.md)及[机器证据](baselines/danmuku-input-validation.json)。
228项：142 done、15 doing、71 todo。04进入时钟/轨道；
本步仍是JS分层，完整TS归06，旧轨道重叠/Setting/heatmap风险继续。无推送或发布。


## PKG-DANMUKU-02 历史错误和真实浏览器基线完成

42项受控旧缺陷、48项原生Worker/视频/布局/设置及6项300弹幕负载观察通过；所有
初轮失败留档。纠正两个测试假设，保留严格非重叠断言；首次测到的实际轨道重叠
仍为DANMUKU-TRACK-01开放问题，后次48通过不能替代修复。短时heap/帧间隔不是
长期内存或性能验收。见[变更](changes/2026-09-13-PKG-DANMUKU-02-browser-baseline.md)与[机器证据](baselines/danmuku-browser-validation.json)。
根test:unit接入受控测试，浏览器文件由已有Playwright流程收集。
228项：141 done、15 doing、72 todo。03开始输入/解析/config
实施；04调度/05DOM和07负载稳定性继续。无推送或发布。


## PKG-MASK-02 生命周期与错误基线完成

54项冻结历史测试及父代理复核通过，覆盖源码和两旧版本三格式的关键生命周期；
完整失败矩阵聚焦源码/最新main，四个未处理拒绝在独立进程精确取证。归档SDK接缝
五处callee转换哈希可重放，不能当作真实模型通过。新测试接入test:unit和专属
yarn test:danmuku-mask；四类风险由源码观察提升为已复现，保持开放待修复。
见[变更](changes/2026-09-13-PKG-MASK-02-failures.md)与[证据](baselines/danmuku-mask-failures-validation.json)。
228项：140 done、15 doing、73 todo。Mask03仍等待Danmuku07
稳定依赖；Danmuku02受控失败和真实浏览器基线继续并行。没有推送或发布。


## PKG-DANMUKU-01 弹幕契约与归档完成

冻结81稳定版目录、15真实归档和28源码/文档/图标输入。44项测试及父代理复核通过；
实际模块、完整方法与配置、设置、Bilibili/worker接口、返回身份和旧缺陷已登记。
其他66版只有目录证据，没有扩张支持承诺。
见[契约](baselines/danmuku-contract.md)和[变更](changes/2026-09-13-PKG-DANMUKU-01-contracts.md)。
228项：139 done、16 doing、73 todo。02开始独立受控异步失败
与真实浏览器基线；03至09的源码迁移、性能和最终分发仍待实施。无推送或发布。


## PKG-MASK-01 弹幕遮罩契约完成

冻结全部两个真实稳定发布版、Git关联和导出差异；核对六个Yarn/SDK版本与12个已有
本地资源字节。6项测试及父代理复核通过。未固定CDN、无效模型参数、异步生命周期、
重复启动、backend与DOM/通知风险归入后续任务，SDK-08保持开放。
见[契约](baselines/danmuku-mask-contract.md)与[变更](changes/2026-09-13-PKG-MASK-01-contract.md)。
228项：138 done、16 doing、74 todo。02开始受控历史失败测试；
没有启动真实模型、GPU或远程投屏，没有推送或发布。


## PKG-CAST-04 公开类型与隔离安装完成

最新npm 1.1.0根类型保持，/runtime精确描述异步注册、回调与查询。17安装配置、
7候选配置各17逐行反例、4项专项测试和全局366生产TS strict通过。pack混入tsconfig
已修复，最终文档包重新安装通过；正常构建的六个JS文件与CAST03逐字节一致。
见[变更](changes/2026-09-13-PKG-CAST-04-types.md)及[证据](baselines/chromecast-types-validation.json)。
类型策略重号更正为ADR-027，旧冻结记录保留并中央解释。
228项：137 done、16 doing、75 todo。弹幕/遮罩契约并行推进，
Cast05真实SDK设备与06完整分发仍待完成；没有推送或发布。


## PKG-CAST-03 Chromecast生产重构完成

5个TS模块与35个候选测试落地，SDK等待/会话返回值/过期结果/实例图标/错误Promise
已修复。真实浏览器进一步发现Control.add返回undefined导致图标不变色，已用mounted
修复并保留红绿证据。128项历史+候选测试、main/legacy各35项、三形态各45项浏览器
全部通过；正常构建和366生产TS strict检查通过。原商业SVG换为原创几何图形。
见[变更](changes/2026-09-13-PKG-CAST-03-runtime.md)及[证据](baselines/chromecast-runtime-validation.json)。
228项：136 done、14 doing、78 todo。04公开类型、05真实SDK/设备、06分发继续；
135浏览器项使用受控SDK，不能当作接收设备投屏通过。没有推送或发布。


## PKG-MULTI-SUB-04 Multiple Subtitles 类型兼容实施完成

已落实用户批准的最新npm 1.2.0根类型及较早1.0.0/1.1.0迁移规则；/runtime准确
描述异步结果和模块形式。22个真实安装配置、7个候选配置正例通过，每配置拒绝
16个指定反例，7项专项测试含编辑器通过。见[完成记录](changes/2026-09-13-PKG-MULTI-SUB-04-approved-types.md)及[证据](baselines/multiple-subtitles-approved-types.json)。
MULTI-SUB-TYPE-01关闭，MULTI-SUB-EXPORT-01仍保留组合/完整分发验证。源码与dist未变，
不新增浏览器设备通过声明。228项：135 done、15 doing、78 todo；不推送或发布。


## PKG-VTT-THUMB-04 VTT Thumbnail 类型兼容实施完成

已落实用户批准的最新npm 1.1.0根类型及较早1.0.x迁移规则；/runtime准确
描述异步结果和模块形式。32个真实安装配置、7个候选配置正例通过，每配置拒绝
12个指定反例，5项专项测试含编辑器通过。见[完成记录](changes/2026-09-13-PKG-VTT-THUMB-04-approved-types.md)及[证据](baselines/vtt-thumbnail-approved-types.json)。
VTT-THUMB-TYPE-01关闭，VTT-THUMB-EXPORT-01仍保留组合/完整分发验证。源码与dist未变，
不新增浏览器设备通过声明。228项：134 done、16 doing、78 todo；不推送或发布。


## PKG-FACTORY-01 历史工厂类型修复完成

Canvas/Ambilight落实已批准规则：保留真实npm1.1.0根工厂与NodeNext namespace，
/runtime提供准确可选调用与self.default；1.0冲突迁移已入两包README。共34个真实
安装配置、14个候选配置全部正例通过，每配置分别拒绝14/15个指定反例。8项专项
测试、共享strict消费检查和编辑器生成通过。见[变更](changes/2026-09-13-PKG-FACTORY-01-compatible-types.md)
及[证据](baselines/factory-compatibility-validation.json)。FACTORY-TYPE-01关闭；
包05/06及发布验收仍独立。ASR编辑器导出冲突另已修复并提交111710703。
228项：133 done、17 doing、78 todo。CAST03源码迁移开始；VTT/MultiSub类型规则
由独立子代理继续落实。未推送或发布。


## PKG-CAST-02 Chromecast 错误基线完成

93项受控历史测试通过，其中65项新增错误/生命周期观察。首次会话结果误用、已就绪
SDK悬空/多实例覆盖、错图标与销毁后加载、终态遗漏、脱离媒体Promise均已复现并
登记03修复任务。live选项/回调this/原始SessionState继续保留。见[变更](changes/2026-09-13-PKG-CAST-02-failures.md)
与[证据](baselines/chromecast-failures-validation.json)。生产仍未改，真实Cast设备与
远程SDK尚未验证。228项：132 done、17 doing、79 todo；217风险。
下一步03生产模块与资源修复；已获授权的Canvas/Ambilight类型修复正由两个子代理
独立实施，父代理协调共享类型检查和编辑器生成。没有推送或发布。


## PKG-CAST-01 Chromecast 契约与来源完成

冻结真实npm1.0.0/1.1.0与9个工作区输入，逐成员、入口及git关联核验通过。1.0.0
提前加载SDK/仅name结果与1.1.0懒加载/状态回调分别测试，28项公共行为通过；
gitHead和banner版本差异明确记录。VENDOR-10登记商业图标来源，CAST-TYPE-01
登记同步声明缺口，SDK-06仍缺真实会话。见[变更](changes/2026-09-13-PKG-CAST-01-contracts.md)
与[契约](baselines/chromecast-contract.md)。228项：131 done、17 doing、80 todo；
212风险。下一步02错误基线、03拆分与修复；未改生产代码、未连接设备或发布。

用户已确认历史类型冲突统一规则，见[type-compatibility-policy.md](type-compatibility-policy.md)；
Canvas/Ambilight/VTT/Multiple Subtitles可继续实施，无需重复等待类型取舍确认。


## PKG-ASR-09 显式捕获归属完成

新增可选capture策略，旧默认与根类型保留；Firefox无需强制异常，显式模式零直接
绑定、非零PCM、零附加输出，外部Context保持独立。无CORS源遵循原生限制且不
接管播放，同源切换恢复。独立审查发现的延迟close后过期重启已用两项红绿测试修复。
229定向、main/legacy各43项通过；最终source/main/legacy原生106过、53能力跳过；
正常构建、strict/lint、隔离安装17配置及每候选18个负例通过。见[变更](changes/2026-09-13-PKG-ASR-09-explicit-capture.md)
与[证据](baselines/asr-explicit-capture-validation.json)。外部归属按显式模式闭环，默认
CORS静音仍open，不声称自动检测或物理设备已完成。228项：130 done、17 doing、
81 todo；210风险。ASR-05继续，完整发行和整仓重构仍有剩余任务；无推送或发布。


## PKG-ASR-05 CORS 与独立音轨检查点

新增跨源允许/不允许/重定向及同源恢复、audio-track组合生命周期与独立音频归属
验证；source/main/legacy共72过、36项Windows WebKit能力跳过，无失败或重试。
初次Firefox无回调与Chromium零样本差异已单独记录。默认无CORS媒体会被绑定后
静音，ASR-CORS-01保持open；不能把边界观察当作修复。见[变更](changes/2026-09-13-PKG-ASR-05-cors-combinations.md)
与[证据](baselines/asr-combinations-validation.json)。README和架构已说明配置。
227项：129 done、17 doing、81 todo；209风险。ASR-05继续，显式外部归属、设备
和完整发行仍待完成。生产代码和产物未改变；没有推送或发布。


## PKG-ASR-05 本地编辑器与相邻核心检查点

真实 npm 5.3.0 核心扩大对照：main 14过/7能力跳过，legacy 6过/3能力跳过。
实际 localhost:8082 docs/Monaco 在 Chromium、Firefox 均通过非零 PCM、stop保留
播放、暂停恢复、Run销毁旧实例并重采集、最终清理；216项ASR测试通过。新增可
重放的 yarn test:asr-demo，保存真实响应哈希、trace、截图及自有进程清理证据。
见[检查点](changes/2026-09-13-PKG-ASR-05-local-core-checkpoint.md)与
[证据](baselines/asr-local-core-validation.json)。源关联5.3.1未发布，5.3.0不作最低
支持承诺。ASR-05保持doing，CORS、audio-track、Firefox外部归属和设备范围待完成。
227项：129 done、17 doing、81 todo；208风险。子代理成果经主代理复核整合，
本检查点单独提交；没有推送或发布。


## PKG-ASR-08 回退漏声修复完成，ASR-05 继续

独立审查指出 captureStream 回退额外接扬声器；Chromium 原生两个候选核心确实在
视频静音后仍有该分支输出。已改 recorder -> gain(0) 静音 sink，非零PCM与外部
播放图保留；五项先红后绿单测覆盖清理/恢复/换源。最终 source/main/legacy 原生
52过、26能力跳过，含直接音量与既有采集回归；213定向及两产物各30通过，正常
构建、strict/lint、重新隔离安装17配置通过。见[变更](changes/2026-09-13-PKG-ASR-08-capture-output.md)
与[证据](baselines/asr-fallback-validation.json)。
Firefox自然允许重复源绑定；受控拒绝验证了原生回退，但自动外部归属仍登记为
ASR-FOREIGN-01 open。不得把它隐藏成回退通过，也不等于 Safari/设备验收完成。
227项：129 done、17 doing、81 todo；208风险。ASR-05已进入doing，继续真实示例、
相邻稳定核心、CORS与插件组合/设备。子代理负责独立测试和8082示例验收，主代理
整合源码、浏览器与提交；没有推送或发布。


## PKG-ASR-07 原生音量修复完成

ASR-05 原生验证发现旧版与候选都重复应用音量：50% 设置只有约25%输出振幅。
新增独立修复任务，移除重复监听/转发，保留媒体原生音量与静音。修复前线性断言
已在 Chromium 失败；修复后 source/main/legacy 两核心验证共36过、18明确能力跳过，
涵盖原有采集生命周期和音量/静音/stop后播放与恢复。208定向及两产物各25生命周期
通过，正常构建、strict/lint和重新隔离安装17配置通过。见[变更](changes/2026-09-13-PKG-ASR-07-playback-volume.md)
与[证据](baselines/asr-volume-validation.json)。
226项：128 done、16 doing、82 todo；206风险。旧版音量缺陷已修复；物理设备、fallback、
跨源和插件组合仍属 ASR-05。子代理已准备离线示例，并确认来源核心5.3.1未发布；
后续以真实相邻稳定5.3.0作扩大对照，不能伪造发布基线。无全量CI、推送或发布。


## PKG-ASR-04 公共类型与安装兼容完成

保留根入口及 legacy 的旧工厂、void stop 和 NodeNext ESM 命名空间形状；新增
runtime 精确类型入口，描述字幕回调与 Promise stop。子代理补消费者并发现
CommonJS 命名类型遗漏、旧 ESM 替换对象兼容风险，均修复后由主代理隔离安装验收。
实际 2.0/2.1/候选共 17 配置：候选 7 配置通过，每种 12 负例按语句拒绝；两旧包
各有 1 组原生 NodeNext direct 声明错误单独冻结，三个包的合法 namespace 用法通过。
根/分包 strict、定向 lint、包字节与 frozen reinstall 检查通过，修复 tsconfig 打包泄漏。
见[变更](changes/2026-09-13-PKG-ASR-04-public-types.md)与[证据](baselines/asr-types-validation.json)。
225 项：127 done、16 doing、82 todo；205 风险，ASR-TYPE-01 闭环。
下一步 ASR-05 原生 fallback/音量/跨源/设备组合与 ASR-06 发行；运行时 JS 未改，
沿用 ASR-03 浏览器证据，本项不等于 ASR 整包发布验收，没有推送或发布。


## PKG-ASR-03 TS 拆分与音频生命周期完成

生产源码拆为 8 个严格 TS 模块；队列保留半块/尾部，识别回调背压、拒绝恢复、
初始化去重和代际清理完成。退休 Worklet 消息反例由失败转通过。
Chromium stop 后不能恢复的原生问题已修复：直接媒体路由由播放器持有到 destroy，
stop 只停 ASR 并允许重新播放；先准备 Worklet 后绑定视频，失败可真正释放未绑定 context。
定向 212 项通过，main/legacy 各重跑 25 候选项；严格分包 tsc、lint、正常三格式构建通过。
最终浏览器源码 12 过/6 能力跳过，main/legacy 各 4 过/2 能力跳过；共 20 过、10 明确
Windows WebKit 无 WebAudio 跳过。非零 PCM、暂停、切源、stop 重启与 destroy 已实测。
见[变更](changes/2026-09-13-PKG-ASR-03-audio-ownership.md)和[证据](baselines/asr-ownership-validation.json)。
225 项：126 done、16 doing、83 todo；205 风险，两项 ASR 音频风险闭环。
下一步 ASR-04 公共异步类型与安装消费者；完整设备/fallback/音量和发行仍未完成。
没有重复全量 CI、没有推送或发布。子代理承担独立模块/测试和规范审查，主代理集成验收。


## PKG-ASR-02 音频与错误基线完成

子代理交付并由主代理审查的 133 项音频历史测试通过，连同公开契约/来源共 165 项。
复现丢样本、异步乱序、停止后字幕回写、初始化竞态、URL/节点残留和切源旧数据。
真实 Chromium/Firefox 共 8 组合通过；Windows WebKit 26.6 原生 WebAudio 全局缺失，
4 项明确跳过，未计入采集通过；首次失败及能力诊断保留。未请求外部识别服务。
见[变更](changes/2026-09-13-PKG-ASR-02-audio-baseline.md)和[证据](baselines/asr-audio-validation.json)。
225 项：125 done、16 doing、84 todo；205 风险，音频队列/生命周期风险升级为已复现。
下一步 ASR-03 拆分生产源码并逐项修复，历史测试保留，候选正确行为另建回归。


## PKG-ASR-01 发布契约完成

冻结实际 npm 2.0.0/2.1.0 共 12 成员及工作区 9 个 Git 输入；32 项契约测试通过，
包含 CJS/global、实际 ESM、字幕 HTML/行数/隐藏、异步 stop 和工厂选项快照。
声明异步差异、音频丢样本及生命周期疑点已分别登记，未将源码疑点写成已修复。
修正 README 的 Ads 误写并增加包内维护地图；无生产源码、依赖或版本变化。
见[契约](baselines/asr-contract.md)和[变更](changes/2026-09-13-PKG-ASR-01-contracts.md)。
225 项：124 done、16 doing、85 todo；205 风险。下一步 ASR 受控音频测试与源码拆分。
用户已授权子代理；当前子代理只写独立音频测试文件，主代理负责契约、台账和提交。
实际浏览器、旧类型消费者和全包发布仍待完成；没有运行外部识别服务。


## CORE-25 无 navigator 默认选项修复完成

defaults.ts 使用 typeof 保护不存在的全局绑定，保留浏览器语言小写、lang 自有字段及每次
独立默认对象；构造仍只在浏览器执行。源码反例 9 过/1 失败，修复后定向 16 项通过。
严格包检查通过，3 个 Node 各 36 候选/31 发布观察，候选默认选项问题清零；旧错误保留。
三浏览器源码/main/legacy 各 30 项共 90 项通过，英语/中文默认语言与显式覆盖保持一致。
完整本地 CI 2432 项通过（2033 单元、28 工程、371 基线）。三个正常构建与安装测试
使用相同 JS 字节，docs 副本一致；公开声明、依赖和版本不变。
生成时发现的 public 复制另由 ENG-12 提交 4a299eb2d 修复；最终干净 tarball 重新验证。
见[变更](changes/2026-09-13-CORE-25-defaults-ssr.md)和[证据](baselines/defaults-ssr-validation.json)。
225 项：123 done、16 doing、86 todo；202 风险，CORE-DEFAULTS-SSR-01 关闭。
独立本地提交，不推送、不发布；全生态/CI-01/真实远端与最终复盘仍待完成。


## ENG-12 库声明源码复制修复完成

CORE-25 构建期间发现 Vite 默认复制 core/public 到 dist；实际候选 tarball 含 37 个
误复制的声明源码。库配置现在禁用 publicDir，打包检查拒绝任意路径非声明 TS 后缀。
三个格式真实磁盘构建反例由失败转通过；旧候选被新检查拒绝，新包去掉 37 个文件，
其余 68 成员字节完全一致。完整 ci:build 的 21 库/i18n/编辑器/文档站/3 导入通过。
定向 3 项、元数据 9 项和 lint 通过；本任务未另跑完整 ci:check，留给 CORE-25 最终验证。
见[记录](changes/2026-09-13-ENG-12-library-public.md)和[证据](baselines/library-public-validation.json)。
恢复 58 个无关生成文件，13 个新增站点 hash 资源移至缓存；保留构建移除的污染文件。
CORE-25 源码/测试/三个 JS 产物仍在工作区，尚未完成/提交；本提交不包含这些修改。
225 项：122 done、16 doing、87 todo；202 风险。ENG-DIST-PUBLIC-01 关闭。
独立本地提交，不推送、不发布；下一步完成 CORE-25 全量验收。


## CI-01 Node 消费者矩阵检查点（doing）

标准 Node 24.21.0 构建同一 core/chapter tarball，20.19.0/22.12.0/24.21.0 实际
offline/frozen 安装逐成员验证，每个运行 36 项候选与 31 项发布观察；五个旧类型和
八个精确类型模式通过。三个系统 workflow 已接入精确运行时切换，浏览器前恢复标准 Node。
首次 Node 20 发现无 navigator 读取静态 option 抛错，旧与候选均复现。新增 CORE-25
与 CORE-DEFAULTS-SSR-01，并加入 REVIEW-01 前置；严格 package:release 已验证因此失败。
兼容检查成功包括明确的未修复缺陷观察，不能作为发布成功；下一步优先独立修复 CORE-25。
完整本地 CI 2429 项通过（2031 单元、27 工程、371 基线），定向 44 项、元数据 9 项，
actionlint/定向 lint 通过。无生产源码/公开类型/依赖/版本改动，无新浏览器或远端运行。
见[变更](changes/2026-09-13-CI-01-node-consumers.md)和[证据](baselines/node-consumer-validation.json)。
224 项：121 done、16 doing、87 todo；201 风险。CI-01 的更早 Node/最低工具环境、
全生态安装/影响调度及 CI-04 远端仍待验收。独立本地检查点，不推送、不发布。


## CI-01 系统矩阵、缓存与结果汇总检查点（doing）

checks 扩为 Linux/Windows，浏览器扩为 Linux/Windows/macOS；coverage 保留双系统。
固定来源下载缓存、每次冻结安装/浏览器系统依赖、失败日志和稳定 CI result 已实现。
最终作业只接受所有必需组 success；真实 CLI 和工作流反例共 37 项通过。
完整本地 ci:check 2422 项通过（2031 单元、23 工程、368 基线），actionlint 与定向 lint 通过。
见[变更](changes/2026-09-13-CI-01-matrix-summary.md)和[证据](baselines/ci-matrix-validation.json)。
没有新生产源码/类型/依赖/版本/产物变更，没有新浏览器播放或远端 Actions 运行。
CI-01 保持 doing：最低 Node 消费环境、全包安装矩阵与影响调度仍待完成；CI-04 验证远端。
223 项：121 done、16 doing、86 todo；本次未新增或关闭风险。独立本地检查点，不推送、不发布。
下一步继续消费者运行时矩阵和插件缺口；此前类型决策与第三方来源事项保持未完成。


## PKG-JASSUB-01 发布与来源检查点（doing）

冻结两个真实 npm 版本、12 成员、9 份 Git 文本及本地 worker/WASM/font/ASS/MP4 指纹。
七份实现 42 项行为与六项契约检查，本包 48 项通过，主 test:unit/baseline 均已接入。
确认同步注册、真实 instance、live options/video 覆盖和同步方法；声明的必填 URL、
Promise/resize 参数顺序有已复现差异，TYPE/EXPORT 两项新风险归 04/06。
wrapper 与 npm jassub 1.8.8 仅格式差异，worker JS/default font 精确匹配；WASM 可校验
但代码/数据段不同。12 字体元数据已提取，原始来源/通知未闭环，VENDOR-04/05 保持 open。
完整 CI 2392 项通过（2031 单元、14 工程、347 基线），严格生产 TS 仍 353 文件。
没有改 JASSUB 生产源码、声明、二进制、字体或版本；没有浏览器 ASS 渲染证据。
见[契约](baselines/jassub-contract.md)、[验证](baselines/jassub-contract-validation.json)及
[检查点](changes/2026-09-13-PKG-JASSUB-01-baseline.md)。新增只读字体脚本，检查依赖仅装缓存。
223 项：121 done、15 doing、87 todo；200 项风险。01 继续来源核对，未标完成。
独立本地检查点提交，不推送、不发布。多字幕/VTT 类型取舍仍待回复。


## PKG-MULTI-SUB-04 公开类型与仓库外安装检查点（doing）

保留 root/legacy 的旧必填 subtitles、同步 LegacyResult 提取与可替换工厂；新增 runtime
入口提供真实 Promise<Result> 和 tracks/reset，共享同一实现。新增可写 default 自别名、
分开的 ESM/CJS 声明、classic typesVersions 和语义生成的编辑器类型，包内文档同步。
实际旧三个 tarball 各五模式、候选 pack 七模式，共 22 格安装检查；offline/frozen 重装、
全成员字节、类型未逃逸、真实 Node 入口身份通过。旧 1.2 NodeNext ESM 失败独立登记。
公开声明每模式 12 个反例、编辑器各 2 个反例、严格运行时各 9 个反例通过；本包 274 项，
源码/main/legacy 各 39 项，三浏览器两核心三入口共 108 项通过。完整 CI 2344 项通过
（1989 单元、14 工程、341 基线），严格生产 TS 353 文件；实际 build 与 docs 副本一致。
见[变更与待决表](changes/2026-09-13-PKG-MULTI-SUB-04-public-types.md)和
[证据](baselines/multiple-subtitles-public-types.json)。没有新依赖、锁或版本修改。
旧 1.0/1.1 原始 CommonJS 模块类型提取与 1.2 default 模块声明矛盾；必填/可选 default
两种替代均有编译失败证据。JS 调用已兼容，纯旧类型差异尚未获接受，04 与 TYPE/EXPORT
风险保持 open。VTT 的相同历史声明问题仍待决；不能扩用此前 Ads 的参数类型授权。
223 项仍为 121 done、14 doing、88 todo；198 项风险。独立本地检查点，不推送、不发布。
下一步处理类型取舍及其迁移说明；实体解码、完整设备/核心/编辑器仍待 05/06。


## PKG-MULTI-SUB-07 内嵌时间戳与显示修复完成

修复数字时间戳被文本包装成 NaN；合法 VTT class 标记保留原生 processing instruction，
caption.ts 在既有事件后只展开专用标记，保留后续节点及用户文字，销毁移除监听。
覆盖顶层/嵌套、开始/中间/末尾、多个毫秒时间戳、冻结树和重复选择；私有类型不再
允许字符串时间戳。源码/main/legacy 各 37 项通过，本包 267 项通过，双 TS 编译器各
9 个负例准确拒绝。三入口原生各 36 项共 108 项通过，原生时间精确为 1.250/2.000/3.500 秒。
最初裸标签可见、删除标记丢后文及 vendor 实体分号问题均保留了实际失败报告。
时间戳修复后完整 CI 2337 项通过（1987 单元、14 工程、336 基线），严格生产 TS 353 文件。
正常构建/ESM 入口通过，dist/docs 副本一致；公开声明、依赖、版本和 vendor 源码未改。
TIMESTAMP 风险关闭；九份历史实体分号问题新增 ENTITY 风险，归 05 独立修复。
见[变更](changes/2026-09-13-PKG-MULTI-SUB-07-timestamps.md)和[验证](baselines/multiple-subtitles-timestamps.json)。
223 项：121 done、14 doing、88 todo；198 项风险。独立本地提交，不推送、不发布。
下一步继续 MULTI-SUB-04 公开声明/异步及旧模块消费者兼容；实体解码和完整设备组合仍待 05。


## PKG-MULTI-SUB-04 严格运行时 TS 检查点（doing）

五个自有模块迁为 TS，新增明确的 Option/Promise Result/Track/host/lifetime 类型；
parser.js 保持原 vendor，私有 parser.d.ts 区分 cue 与节点，分包 allowJs=false。
TS 5.9.3/5.1.6 严格正例通过，移除标记后各 8 个负例准确报错；公开旧声明未改。
源码/main/legacy 各 31 项通过，三入口原生各 30 项共 90 项通过；实际构建/ESM 导入通过。
实际 yarn pack 检查入口、成员及产物字节，私有源码、parser 声明和 tsconfig 未泄漏。
本包 252 项通过，完整 CI 2322 项通过（1972 单元、14 工程、336 基线），
严格生产 TS 增至 352 文件。见[检查点](changes/2026-09-13-PKG-MULTI-SUB-04-runtime-types.md)
和[验证](baselines/multiple-subtitles-runtime-types.json)。公开异步/旧类型及安装消费者仍待 04。
类型梳理复现旧/候选内嵌时间戳输出 NaN；九份历史实现均复现，新建 TIMESTAMP 风险与
PKG-MULTI-SUB-07，并将 07 加入 05 前置。此问题未修复，下一步先做 07，再继续公开类型。
223 项：120 done、14 doing、89 todo；197 项风险。独立本地检查点提交，不推送、不发布。


## PKG-MULTI-SUB-03 模块与资源修复完成

生产源码拆为入口、请求、纯解析合并、生命周期和宿主安装五个模块，vendor parser 不变。
修复 HTTP 失败、兄弟请求取消、fetch/body 销毁中结算、Blob 泄漏、分配失败替换顺序、
同步/异步安装失败与重入归属；保留 async 注册与 void tracks/reset、轨序、元数据和容错。
九种 markup/timing/空轨输入及真实转换/编码逐字对照已发布 1.2.0，冻结树重复序列化通过。
源码/main/legacy 各 31 项通过；本包 241 项通过，两新增文件已接入主 test:unit。
三入口配发布/候选核心，在 Chromium/Firefox/Windows WebKit 共 90 项通过：真实 SRT、
选择/清空/reset、请求销毁、Blob 不可访问、HTTP 失败和真实视频切源无重复字幕下载。
完整 CI 2311 项通过（1963 单元、14 工程、334 基线）；严格生产 TS 仍 346，04 继续 TS。
正常生产构建及实际 ESM 导入通过，三个 dist 与 docs/compiled 对应字节一致。
HTTP/HOST 风险关闭；LIFE/MERGE 完整支持范围组合仍待 05。见
[变更](changes/2026-09-13-PKG-MULTI-SUB-03-resources.md)和[验证](baselines/multiple-subtitles-resources.json)。
222 项：120 done、13 doing、89 todo；196 项风险。独立本地提交，不推送、不发布。
下一步 MULTI-SUB-04 自有模块严格 TS 与旧消费者公开类型；VTT 类型取舍继续待决。


## PKG-MULTI-SUB-02 错误与生命周期复现完成

9 份历史实现各 18 类异常/边界，共 162 项；本包命令及主 test:unit 已接入，
本包 215 项通过。真实核心 converter 与 TextDecoder 覆盖 SRT/ASS/编码，另验证
轨序、重叠、名称、空轨、坏 header 容错、错误身份、下载中销毁和保留方法。
真实 1.2.0 插件配发布/候选核心，在 Chromium/Firefox/Windows WebKit 共 18 项通过：
SRT 原生字幕显示与切换、挂起 fetch 销毁后继续安装、Blob URL 残留与 late reset。
这是历史缺陷的复现成功，不代表已修复；LIFE/MERGE 保持 open，新增 HTTP/HOST 风险。
完整 CI 2285 项通过（1937 单元、14 工程、334 基线），严格生产 TS 仍 346 文件；
新增文件显式 lint 通过。声明指纹差异已核对仅为 CRLF，生产源码/声明/产物均未改。
见[复现记录](changes/2026-09-13-PKG-MULTI-SUB-02-failures.md)和
[验证证据](baselines/multiple-subtitles-failures.json)。实体设备、ASS 原生显示及完整组合仍待 05/06。
222 项：119 done、13 doing、90 todo；196 项风险。独立本地任务提交，不推送、不发布。
下一步 MULTI-SUB-03 拆分获取/解析合并/资源所有权并修复已复现缺陷；VTT 类型取舍继续待决。


## PKG-MULTI-SUB-01 历史契约与 parser 来源完成

冻结三个实际 npm 版本、20 成员与 9 份 Git 输入；53 项本包契约/vendor 测试通过，
当前源码/main/legacy 各 5 项正常行为通过。区分 1.0.0 按 cue 下标合并与 1.1.0 起连接轨道，
记录 async/tracks/reset/onParser 声明差异及旧 CJS 形状，后续错误/类型/原生验收仍待 02–06。
固定 w3c/webvtt.js 比较修订，完整执行体仅封装/导出/格式适配，CC0 全文进入 notices、
实际 tarball 和三个独立文件头，VENDOR-03 关闭；原始取得修订仍明确未知。
完整 CI 最终 2123 项通过（含已接入主 test:unit 的 47 项新测试），严格生产 TS 仍 346 文件。
首次 CI 日志发现两个新测试文件未接入显式清单，已修复后完整重跑，没有沿用较窄结果。
见[契约](baselines/multiple-subtitles-contract.md)、[验证](baselines/multiple-subtitles-contract-validation.json)
和[变更](changes/2026-09-13-PKG-MULTI-SUB-01-contract.md)。生产工厂/声明未改，新增 4 项后续风险。
222 项：118 done、13 doing、91 todo；独立本地任务提交，不推送、不发布。
下一步 MULTI-SUB-02 复现错误和生命周期。VTT 的历史类型取舍仍待用户决定。


## PKG-VTT-THUMB-04 历史模块形式核对（doing，类型取舍待用户决定）

实际仓库外安装矩阵扩至 32 格默认导入：31 编译通过，1 格复现 1.1.0 NodeNext ESM
旧声明错误；候选该格通过。另核对 36 个 CommonJS 直接/default 提取和替换形式，
18 编译通过、18 准确复现两代声明差异，预期失败不等于兼容批准。
1.0.x 直接模块类型操作虽可通过、真实 CJS 直接调用却失败；1.1.0 改为 default 类型。
候选保留 1.1.0 类型，并使直接/default 两种 JS 调用均可用；早期纯类型提取仍有迁移差异。
已测试必需/可选 default 合并方案的具体代价，并向用户请求确认保留最新形状的建议。
5 项公开类型测试和显式 lint 通过；生产源码/声明/入口/产物不变，复用上一提交的生产
与浏览器证据，不声称本次重跑全量 CI。见[变更](changes/2026-09-13-PKG-VTT-THUMB-04-module-forms.md)
和[验证](baselines/vtt-thumbnail-module-forms.json)。任务与 TYPE/EXPORT 风险保持未完成。
222 项：117 done、13 doing、92 todo；独立本地检查点提交，不推送、不发布。
若决定尚未返回，可先进入依赖已完成的 PKG-MULTI-SUB-01，不以等待暂停整个重构。


## PKG-VTT-THUMB-04 公开类型与安装消费者检查点（doing）

保留 root/legacy 旧参数、同步结果类型及替换工厂赋值，新增 /runtime 表达真实 Promise，
两入口复用相同函数。可写 .default 自引用恢复旧 CJS default 调用，Promise 不伪装同步 name。
公开 Option/Result 与内部实现共用；成对模块声明、classic typesVersions 和编辑器生成同步。
本包 251 项、三入口各 48 项、原生三入口共 54 项通过；仓库外实际安装五历史包与候选包，
17 格类型矩阵和 Node 入口身份通过，offline/frozen 重装及成员字节核对通过。
修复实际 pack 发现的 tsconfig 泄漏。TS 5.9.3/5.1.6 严格正反例通过，完整 CI 2069 项通过。
见[变更](changes/2026-09-13-PKG-VTT-THUMB-04-public-types.md)和
[验证](baselines/vtt-thumbnail-public-types.json)。历史 NodeNext/raw require 类型形式仍待 04，
完整核心/设备、早期控件名与分发/demo 仍待 05/06，TYPE/EXPORT 风险未关闭。
222 项：117 done、13 doing、92 todo；独立本地检查点提交，不推送、不发布。


## PKG-VTT-THUMB-04 严格运行时 TS 检查点（doing）

六个 JS 实现迁为 TS，另有明确数据/资源类型模块，分包 allowJs=false。TS 5.9.3/5.1.6
严格检查及正反例通过，移除 expect-error 后各复现 8 个预期类型错误。内部注册准确为
Promise<Result>，公开旧同步声明保持原样，旧消费者/类型视图和导出兼容仍待 04。
源码/main/legacy 的解析与生命周期各 47 通过，原生三入口各 18 通过，共 54 项；
实际 ESM 和完整 CI 2064 项通过，全仓严格生产 TS 增至 346 文件。包内架构和构建同步。
见[变更](changes/2026-09-13-PKG-VTT-THUMB-04-runtime-types.md)和
[验证](baselines/vtt-thumbnail-runtime-types.json)。222 项：117 done、13 doing、92 todo。
本次为独立本地检查点提交，不推送、不发布。


## PKG-VTT-THUMB-03 内部模块与解析修复完成

在资源检查点上完成纯解析/首个区间查找，支持 cue ID、注释/元数据块和 timing settings，
修复长小时截断及非法输入无定位/坏 CSS。26 项解析在旧版 5 通过/21 失败；正常 demo 120 cue
完全相同。源码/main/legacy 的解析+生命周期各 47 通过，原生三入口各 18 通过，共 54 项。
实际 ESM 与完整 CI 2064 项（1727 单元、14 工程、323 基线）通过；无依赖/声明/版本变更。
见[变更](changes/2026-09-13-PKG-VTT-THUMB-03-parser.md)与[验证](baselines/vtt-thumbnail-parser.json)。
解析风险已关闭，类型/导出/完整设备和组合仍待 04–06。下一步严格 TS 及旧消费者。
222 项：117 done、12 doing、93 todo；独立本地任务提交，不推送、不发布。


## PKG-VTT-THUMB-03 请求与预览资源检查点（doing）

生产入口拆为注册、生命周期、请求、预览和纯解析，保留旧源码 helper。已修复销毁后
安装/样式写入、挂起请求取消、移动计时器和部分安装回滚；HTTP 错误明确拒绝。
21 项候选测试在旧版 4 通过/17 失败，源码/main/legacy 各 21 通过；原生旧版 6 项均复现失败，
候选三种入口各 12 项通过（两种核心 × 三浏览器 × 两场景），实际 ESM 也通过。
完整 CI 2038 项通过。构建产物与包内架构同步，未改变声明/版本；解析健壮性、严格 TS、
完整设备/核心组合与安装/demo 验收仍待。见[变更](changes/2026-09-13-PKG-VTT-THUMB-03-resources.md)
和[验证](baselines/vtt-thumbnail-resources.json)。222 项：116 done、13 doing、93 todo。
独立本地检查点提交，不推送、不发布。


## PKG-VTT-THUMB-02 特有失败与生命周期复现完成

108 项新历史测试复现销毁后安装/计时器写入、请求拒绝、HTTP 状态忽略、非法 VTT/坐标、
切源不重载和边界；真实 demo 的 120 cue 坐标逐条核对。包命令共 199 项通过，
完整 CI 2017 项（1680 单元、14 工程、323 基线）通过。历史复现不是候选修复，
原生图片/核心组合仍待 05/06；见[变更](changes/2026-09-13-PKG-VTT-THUMB-02-failures.md)和
[验证](baselines/vtt-thumbnail-failures.json)。下一步 03 拆分并修复资源所有权，04 严格 TS。
222 项：116 done、12 doing、94 todo；独立本地提交，不推送、不发布。


## PKG-VTT-THUMB-01 历史契约完成

五份真实 npm 归档、34 成员、十份 Git 输入已冻结，91 项包契约及 9 项索引/风险检查通过。
完整 CI 1909 项（1572 单元、14 工程、323 基线）通过。明确区分 1.0.0 无效运行入口、
1.0.1–1.0.3 编译解析差异与有效随包源码；当前生产实现未改动。
见[契约](baselines/vtt-thumbnail-contract.md)、[验证](baselines/vtt-thumbnail-contract-validation.json)、
[变更](changes/2026-09-13-PKG-VTT-THUMB-01-contract.md)。五项风险保持 open，下一步 02 复现失败/销毁。
222 项：115 done、12 doing、95 todo；本任务独立本地提交，不推送、不发布。


## PKG-AUTO-THUMB-03 原生帧就绪检查点（doing）

新增frames模块，对支持的浏览器同时等待seek完成与原生帧呈现，补齐取消、超时、
重复/迟到回调和重试身份。Chromium/Firefox五格像素全部验收，WebKit缺该API时前两格
仍只诊断，像素风险继续open。19项新回归此前2通过/17失败；源码/main/legacy各52通过。
最终原生源码两轮42项，main/legacy各21项，共84项通过；包含真实帧挂起时destroy/restart。
完整CI1818项、339生产TS及4种bundle入口通过；见[验证](baselines/auto-thumbnail-frame-presentation.json)；
[变更](changes/2026-09-13-PKG-AUTO-THUMB-03-frame-presentation.md)记录能力边界和后续要求。
正常构建及文档同步，TS仍属04。222项：114 done、12 doing、96 todo；03未标完成。


## PKG-AUTO-THUMB-03 隐藏解码与错时seek重试检查点（doing）

新增video模块，挂载隐藏且保持实际尺寸的解码元素，完善DOM回收及插入/清理重入。
真实产物测试发现seeked可能停留在前一格，已增加绘制前时间核对及最多3次原目标重试。
33项候选单元在此前检查点25通过/8失败，新源码/main/legacy各33通过。
最终原生源码连续三轮45项、main/legacy各15项通过，共75项；其中仅第2-4格有像素
验收，前两格及首帧精度保持open。保留先前真实失败，不把重复通过当作全流程完成。
新增可再生时间颜色夹具及脚本，严格TS仍属于04，无依赖或版本改动。
完整CI1799项、339生产TS通过，4种实际bundle入口通过；见[验证](baselines/auto-thumbnail-hidden-renderer.json)，
[变更](changes/2026-09-13-PKG-AUTO-THUMB-03-hidden-renderer.md)解释修复和剩余边界。
222项：114 done、12 doing、96 todo；本次是03检查点，任务完成数未增加。


## PKG-AUTO-THUMB-03 源码任务与资源所有权检查点（doing）

生产源码拆为index/options/session/extraction，保持异步公开注册与原有效配置语义。
串行有效帧编码、任务取消和URL归属取代无主回调；完成/切源/destroy均回收decoder，
失败保留此前有效预览，修复重复回调、null Blob、原生错误及宿主setter/参数getter重入。
24项回归旧版2通过/22失败；源码/main/legacy各24通过；三份原生生命周期各9共27通过。
提交前抓住并修复fallback提前读取和duration快照两处新增偏差，重新验证最终实现。
完整CI1790项、339生产TS通过；本包此时仍为JS，04才迁严格TS。正常构建再生三份产物及
docs副本，包内维护地图同步。黑帧/准确帧时间/资源预算及更多边界仍需03继续，不能将
生命周期通过当成像素或最终核心验收。相关风险保持open，提交仅为03检查点。
见[变更](changes/2026-09-13-PKG-AUTO-THUMB-03-lifecycle-checkpoint.md)和
[验证](baselines/auto-thumbnail-lifecycle-checkpoint.json)。222项：114 done、12 doing、96 todo。


## PKG-AUTO-THUMB-02 完成：失败回归和原生抽帧对照

64项旧行为测试覆盖8份冻结夹具的销毁/切源/重复metadata/逆序Blob/null Blob/
draw与encode异常/缺context和media错误/setter异常。9项三浏览器原生HTTP/video/
seek/JPEG/像素对照复现迟到更新；WebKit旧插件四点黑色，而播放及静态JPEG对照有色，
登记为待修抽帧路径缺陷，不作为能力豁免。保留3次中间诊断失败报告和最终完整报告。
完整CI1766项、339生产TS通过。新增test:auto-thumbnail，Node64项纳入test:unit。
问题已复现并记录但源码尚未修复，03负责资源/抽帧重构；独立隐藏渲染实验仅作03线索。
见[故障表](baselines/auto-thumbnail-failures.md)和[验证](baselines/auto-thumbnail-failures-validation.json)。
222项：114 done、11 doing、97 todo；185风险，新增像素风险与已有相关风险均open。


## PKG-AUTO-THUMB-01 完成：自动缩略图发布与行为基线

核实全部三个npm版本及16成员，冻结8份工作区输入。明确1.0.0缺main/legacy，
其随包源码仅作为source-only夹具；1.0.1 CJS为default对象，1.1.0为直接函数。
发现旧声明height无效且漏number、注册Promise错写同步Result。38项契约固定正常
注册/活参数/默认值/十列JPEG/渐进更新；47项定向检查及完整CI1702项通过，339生产TS。
登记5项公开类型/导出/分发/资源/编码风险。生产源码/类型/版本/构建未改；02开始故障
复现后03实施源码修复。真实解码、核心组合与设备证据仍属于后续05/06。
见[契约](baselines/auto-thumbnail-contract.md)及[验证](baselines/auto-thumbnail-contract-validation.json)。
222项：113 done、11 doing、98 todo。契约索引22工作区+20发布，未补齐的精确索引不冒充通过。


## PKG-TOOL-THUMB-04 事件注册表修复检查点（doing）

复现并修复特殊事件名碰撞对象原型、继承getter/setter干扰，以及嵌套emit导致once重复执行。
保留普通派发快照/ctx/off原回调/独立重复注册语义，使用own key/data descriptor及每次
注册独立的once消费标记。新6项旧版1通过/5失败；候选源码53、main/legacy各55通过。
重新构建并重跑三份真实浏览器各63项，共189项：每份34工具、3输入、17Blob不可用、
3原生对照、3Monaco、3事件注册表。没有沿用运行文件改变前的媒体证据。
完整CI1664、339生产TS、3导入及实际安装7种模式/52项类型反例通过，关闭THUMB-EVENT-01。
默认行为策略问题继续等待用户选择；04不标完成。见[变更](changes/2026-09-13-PKG-TOOL-THUMB-04-emitter.md)
与[验证](baselines/thumbnail-emitter-validation.json)。222项：112 done、11 doing、99 todo。


## PKG-TOOL-THUMB-04 公开类型与真实安装检查点（doing）

补齐class/namespace及d.cts/d.mts，修复root ESM并保留直接CJS构造器，新增legacy类型路径。
仓库外实际安装验证7种候选编译模式、52项反例和全部文件；冻结Git夹具保留5种缺声明/
入口失败对照。明确该夹具不是原始npm包。完整MIT通知在实际tarball验证，相关来源风险关闭。
完整build:ts发现并修复MediaBunny辅助类型被误当独立插件的既有问题；原不支持runtime
re-export的错误提示在首次CI发现变化后恢复，未削弱测试。三浏览器真实Monaco通过，
同时消费核心/Thumbnail/MediaBunny类型并执行工具构造/清理。最终CI1658、339生产TS、
3导入通过；main/legacy各49项，运行文件和源码UMD与上个检查点完全一致，171项抽帧证据
按哈希复用并明确没有重跑。用户默认行为策略问题仍待答复，04不标完成；05/06继续设备/
完整demo/core与历史CSS分发。见[变更](changes/2026-09-13-PKG-TOOL-THUMB-04-public-types.md)
和[验证](baselines/thumbnail-public-types-validation.json)。222项：112 done、11 doing、99 todo。


## PKG-TOOL-THUMB-04 运行时 TS 与 emitter 来源检查点（doing）

8个运行时模块已迁为严格TS，新增类型模块明确option/事件/帧/job/资源状态；declare保留
旧实例字段顺序和按需出现的字段。移除未使用的sleep/serial助手。生成ESM除许可和两个
等价emitter局部变量外与03运行时相同，默认值和同步/异步行为保持。固定tiny-emitter
2.1.0上游比较文件及完整MIT通知，登记VENDOR-09；不声称确定原始复制revision。
新增6项门面/emitter兼容与2项来源/通知检查，源码/main/legacy各110项通过。
三份浏览器各57通过（34真实工具、3输入、17Blob不可用、3原生媒体对照）。
完整CI1654通过，339生产TS和3导入通过；保留既有编辑器声明lint警告及Yarn警告记录。
公开声明/旧编译器/实际安装入口和默认历史差异仍待04继续，05/06保留真实设备/分发门槛。
见[变更](changes/2026-09-13-PKG-TOOL-THUMB-04-runtime-types.md)和
[验证](baselines/thumbnail-runtime-types-validation.json)。222项：112 done、11 doing、99 todo。


## PKG-TOOL-THUMB-03 完成：抽帧任务与媒体资源所有权

增加lifecycle/source/extraction模块，保留公开类形状与工作区默认行为。元数据等待、
逐帧回调和URL归属明确；切源/destroy立即取消旧Promise，迟到PNG不能再update或创建URL。
修复原生错误、null Blob、监听器异常和重入；保留首次选文件前start等待。销毁暂停/清空
src/load重置媒体，即使部分清理抛错也继续。源码仍为JS，04负责严格TS/声明与来源审查。
新26项生命周期断言在冻结旧版2通过/24失败；连同输入测试，源码/main/legacy各40通过。
三份浏览器各57通过：34真实工具场景、3输入场景、17Blob不可用对照、3原生媒体对照。
实际切源期间持有原生PNG回调验证仅新任务完成，销毁后readyState=0且无src。
完整CI1646、330生产TS、3导入及候选ESM导入通过。类型/默认历史差异及Safari/分发风险
仍open。见[变更](changes/2026-09-13-PKG-TOOL-THUMB-03-lifecycle.md)与
[验证](baselines/thumbnail-lifecycle-validation.json)。222项：112 done、10 doing、100 todo。


## PKG-TOOL-THUMB-03 输入与导出源码检查点（doing）

生产入口拆出input/sheet模块，修复drop注册、输入切换与wrapper所有权、构造/安装失败
回滚、重复destroy及下载锚点清理；新增包内ARCHITECTURE.md。公开字段/方法/defaults
和正常事件顺序保持。14项新回归在旧版2通过/12失败，源码/main/legacy各14通过。
三份浏览器各54项通过：32真实工具场景、3候选原生输入场景、16WebKit Blob不可用
对照、3原生媒体对照；不把不可用对照算作成功抽帧。正常构建同步dist/docs副本。
完整CI1620、330生产TS与3导入测试通过。队列/URL取消、迟到Blob和失败重入仍需继续，
本项不标done；04负责最终TS与声明。见[变更](changes/2026-09-13-PKG-TOOL-THUMB-03-input-checkpoint.md)
和[验证](baselines/thumbnail-input-checkpoint.json)。222项：111 done、11 doing、100 todo。


## PKG-TOOL-THUMB-02 完成：抽帧、失败与资源基线

新增36项历史抽帧/生命周期测试，与26项契约共同通过；普通CI已接入新测试。
真实浏览器39项记录分为24个Chromium/Firefox工具场景、12个Windows WebKit
Blob不可用对照、3个原生媒体对照。验证实际PNG像素/重复生成/正常URL清理，并复现
迟到原生Blob回调在destroy后继续update和泄漏、替换文件URL泄漏、drop监听缺失。
原生HTTP能播放而Blob失败，未将WebKit对照冒称抽帧成功；原始失败报告完整保留。
完整CI1606、330生产TS检查通过。生产源码未改，03负责资源修复/拆分，04负责TS，
05/06保留WebKit/Safari实际文件抽帧和分发验收。见[变更](changes/2026-09-13-PKG-TOOL-THUMB-02-behavior.md)
与[验证](baselines/thumbnail-behavior-validation.json)。222项：111 done、10 doing、101 todo。


## PKG-TOOL-THUMB-01 完成：历史契约与发布证据

冻结11条HTTP观察、12个工作区及8个历史Git输入；恢复3.5.31 CDN主文件并逐字节
匹配Git，不冒称找回完整npm包。区分旧版delay/固定高度与4.4.0同步事件/比例高度，
保留公开拼写、导出和事件的26项可重跑契约。复现拖放绑定、重复销毁等既有问题；
默认语义、资源治理和分发风险保持open，由02–06继续。实际工具demo与外部插件区分。
完整CI1570项通过，330生产TS；本轮无生产源码/产物变化，无新浏览器/覆盖率结论。
见[契约](baselines/thumbnail-contract.md)、[验证](baselines/thumbnail-contract-validation.json)
和[变更](changes/2026-09-13-PKG-TOOL-THUMB-01-contract.md)。下一项为抽帧与失败测试。
222项：110 done、10 doing、102 todo；单项本地提交，不推送或发布。


## PKG-IFRAME-05 原生缓存与中断导航检查点（doing）

新增独立 `yarn test:iframe-history`：完整Chromium通道与可缓存HTTP页面，避免默认
Playwright禁用BFCache产生的错误验收。源码/main/legacy各90项通过，共270项；其中
36项实际Chromium缓存恢复、72项Firefox/WebKit重新加载对照、162项停止/204/截断响应
后的恢复和销毁。核对父子文档标识、原生persisted、媒体状态、请求结算和后续通信。
GitHub浏览器任务已增加运行及报告上传，actionlint通过；未推送或声称远端CI已执行。
全仓CI1544、330生产TS检查和3导入测试通过；不把未重新运行的覆盖率标成本轮新结果。
原生产源码/产物及公开接口未变；整页冻结可能保留未收到leave的原请求，已明确记录。
见[变更](changes/2026-09-13-PKG-IFRAME-05-history.md)与
[验证](baselines/iframe-history-validation.json)。物理设备、Firefox/WebKit实际缓存恢复、
最终分发仍待验收。222项：109 done、10 doing、103 todo。

## PKG-IFRAME-05 播放器与真实编辑器检查点（doing）

冻结原支持核心4.5.9的176个npm文件，与已冻结5.4.0、候选核心组成真实媒体矩阵。
源码/main/legacy各75项通过：每份72组同源/跨域、新旧父子端组合，加3个实际
Monaco页面Run流程。覆盖播放、seek/rate、网页全屏、切源、播放器/工具独立销毁。
实测修复docs的AMD加载顺序、重复Run遗留iframe工具和请求、多个父播放器清理。
源码和运行产物字节未变，旧公开API保持；失败探针、trace及后续通过报告均留存。
全仓CI1544、330生产TS检查、3导入测试通过，配置覆盖率门槛0违例（224运行文件）。
见[变更](changes/2026-09-13-PKG-IFRAME-05-integration.md)和
[验证](baselines/iframe-integration-validation.json)。后续缓存/中断证据见上方；物理设备与
最终分发仍待验收，不因此关闭任务或风险。222项：109 done、10 doing、103 todo。

## PKG-IFRAME-04 完成：公开类型、模块入口和编辑器

保留默认类的required data、void静态接收、readonly、resove及旧commit推导，增加
可选Runtime/Resolver视图、消息联合与命名类型。CJS/ESM声明分别路由，旧TS通过
types/legacy入口；无运行时self-default。编辑器使用实际大写类名并语义生成声明。
旧工作区NodeNext ESM的18条错误已复现并修复；旧编辑器三条错误在两编译器复现。
独立Yarn安装旧npm、冻结工作区和候选共16编译组合，候选6组/81非法使用被拒绝；
历史Function字段、namespace/helper及nullable回调区别明确保留，05/06仍待验收。
复查发现非Error抛出可产生非字符串error载荷，已用四历史产物与源码复现并修正类型。
最终CI1543与44重复契约、3导入/SSR通过，330生产TS。三运行产物及源码字节未变，
沿用03的真实浏览器证据，不冒称新跑浏览器。分包编辑器脚本避免改写迁移中的其他包。
见[变更](changes/2026-09-13-PKG-IFRAME-04-types.md)和[验证](baselines/iframe-types-validation.json)。
222项：109 done、9 doing、104 todo；本项独立本地提交，三个Iframe风险仍open。

## PKG-IFRAME-03 完成：按文档管理请求与六模块拆分

入口、连接、请求、消息边界、父页导航和子页生命周期拆为六个严格TS模块。
保留公开字段/回调/resove和旧协议；协商文档标记用于换页取消、迟到消息过滤，
连续切源只取消旧文档请求，未发送队列等待最终注入。实际片段导航回归和重复捕获
请求问题均先复现后修复，失败报告保留。ADR-026说明两阶段导航及旧端能力限制。
源码/main/legacy各50项Node通过；真实三引擎分别351/351/207通过，无跳过。
每份含117导航/旧子页、60边界/互通和30生命周期，source/main另含144历史断言。
完整CI1539与44重复契约、3导入/SSR通过，330生产TS；产物/docs/报告哈希核对。
见[决策](iframe-document-protocol.md)、[变更](changes/2026-09-13-PKG-IFRAME-03-navigation.md)
和[验证](baselines/iframe-navigation-validation.json)。222项：108 done、9 doing、105 todo。
IFRAME三个风险仍open：04公开声明/旧消费，05完整播放器/demo、实际BFCache/设备和
外部中断导航，06分发仍需完成。本项专用本地提交，不推送或发布。

## PKG-IFRAME-03 构造清理与窗口来源检查点（doing）

增加connection/protocol两个严格TS模块；构造失败清理监听和重入请求，destroy即使
移除监听报错仍取消请求。父/子仅处理选定对端的原生消息，忽略畸形封套；保留local
onMessage、空type、自定义响应及旧commit协议。ADR-025记录来源绑定、跳转/opaque
兼容与仍需信任嵌入父页的限制，未把WindowProxy身份误称作文档身份或代码沙箱。
新18断言对上一提交2通过/16失败，候选连同原生命周期各34通过；旧构建实际Chromium
12项全部失败。修复HTTP测试夹具后，源码浏览器60、正式main234、legacy90通过；
每份边界矩阵含36来源/封套及24旧npm/工作区父子互通，未声称未升级一侧已被修复。
完整CI1523与44重复契约、3导入/SSR通过，328生产TS；哈希与docs副本均一致。
见[决策](iframe-message-boundary.md)、[变更](changes/2026-09-12-PKG-IFRAME-03-boundaries-checkpoint.md)
和[验证](baselines/iframe-boundaries-checkpoint.json)。222项：107 done、10 doing、105 todo。
本地检查点提交。下一步导航/重新注入的文档代际与inject-before-load时序；三个风险仍open。

## PKG-IFRAME-03 请求资源与TS入口检查点（doing）

入口和请求管理拆为2个严格TS模块，保留7个公开字段及resove/回调/消息协议。
修复ID冲突/回拨、跨实例串线、销毁悬挂、轮询发送错误和公开回调的资源泄漏。
同16断言旧版5通过/11失败，候选源码/main/legacy各16通过；旧版真实Chromium
候选断言2通过/8失败。最终main浏览器174（历史144+候选30）、legacy候选30通过，
完整CI1505与44重复契约、3导入/SSR文件通过，326生产TS。审查发现并修复空记录
兼容回归；一次Windows复制失败经正常重建恢复，全部旧/失败/最终报告保留。
见[变更](changes/2026-09-12-PKG-IFRAME-03-requests-checkpoint.md)和
[验证](baselines/iframe-requests-checkpoint.json)。222项：107 done、10 doing、105 todo。
本地检查点提交；IFRAME-03和三个风险仍未关闭。下一步导航/重新注入、构造失败清理、
畸形消息与独立来源信任策略，随后04处理公开声明与旧helper/分发兼容。

## PKG-IFRAME-02 完成：历史生命周期与真实窗口缺陷复现

52项Node和144项Chromium/Firefox/WebKit真实窗口检查通过，覆盖4份历史产物、同源/跨源。
确认同毫秒请求串线、销毁/导航悬挂、克隆失败泄漏，以及无关窗口冒充握手/响应/commit。
这是历史缺陷断言通过，尚未代表修复；工具测试未创建播放器，不计作核心媒体集成。
完整CI1489与44重复契约通过，324生产TS；源码和归档报告哈希一致。
见[变更](changes/2026-09-12-PKG-IFRAME-02-behavior.md)与[验证](baselines/iframe-behavior-validation.json)。
222项：107 done、9 doing、106 todo；立即专用本地提交。三项Iframe风险仍open，下一项03实施修复。

## PKG-IFRAME-01 完成：发布名、辅助类与消息契约

实际旧包plugin-iframe@1.0.0的8个成员和工作区11个输入已冻结；新tool名本次npm查询404，
不将工作区1.1.0冒充发布版本。额外helper有不同destroy协议，主类两代CJS/default、
script/ESM、resove、callback receiver和commit序列化由19项实际产物检查保护。
完整CI1437与44重复契约通过，324现有生产TS；本包尚未迁移TS。
见[契约](baselines/iframe-contract.md)、[变更](changes/2026-09-12-PKG-IFRAME-01-contract.md)
与[验证](baselines/iframe-contract-validation.json)。生命周期、消息信任与分发风险保持open。
222项：106 done、9 doing、107 todo；立即专用本地提交，下一项IFRAME-02建立并发/销毁/跨窗口回归。

## PKG-DPIP-05 原生组合检查点与核心文档归属修复（doing）

真实popup键盘、两轮开关与节点还原覆盖原生video/Canvas/MediaBunny及新旧核心。
修复网页全屏把PiP播放器移回opener的问题：挂载到当前ownerDocument.body，恢复位置/焦点。
源码84、构建main219、legacy84浏览器检查通过，完整CI1418与44重复契约、3个导入/SSR文件通过。
每个产物的18项原生矩阵为6候选正常、6旧核心带BASE-DOM-16历史缺陷、6WebKit缺API对照。
旧插件1.1.0重现同一旧核心输入问题；Firefox Page.close协议挂起已用原生window.close处理，
失败/trace全部保留。见[变更](changes/2026-09-12-PKG-DPIP-05-native-checkpoint.md)和
[证据](baselines/dpip-native-validation.json)。DPIP-DISPLAY-01关闭；原生全屏/后台/设备仍待验收。
222项：105 done、9 doing、108 todo。本地检查点提交，未推送或发布。

## PKG-MB-09 持续播放检查点（doing）

独立yarn test:mediabunny-soak读取600秒固定HLS，四个Chromium/Firefox新旧核心场景
各连续90秒1×/90秒2×，再seek/切质量/切音轨，共至少195秒实际墙钟。六项通过，
两项WebKit为缺失API对照。最大AV时钟偏差51.34ms；每组创建约1.37万节点，
同时在用峰值64，destroy后全部断开，迭代器/队列归零且无迟到绘制。
完整CI1418与44重复契约通过，324生产TS；默认生成器保留原32文件哈希。
见[变更](changes/2026-09-12-PKG-MB-09-sustained-playback-checkpoint.md)和
[证据](baselines/mb-sustained-validation.json)。222项：105 done、8 doing、109 todo。
MB-09仍doing；数小时/声学/物理设备/后台与完整插件组合未由本轮关闭，托管长测job待接续。

## PKG-MB-09 原生画中画检查点（doing）

36个新旧核心/媒体/关闭方式/浏览器场景通过，24项实际原生窗口中Canvas解码播放，
12项WebKit缺失API对照未计作播放。HLS在画中画中切换质量/音轨，关闭还原与销毁清理通过。
本轮opener始终visible，未覆盖后台节流。完整CI1418与44重复契约通过；补齐MB-08风险
关闭字段遗漏，失败日志保留。见[变更](changes/2026-09-12-PKG-MB-09-native-pip-checkpoint.md)
和[证据](baselines/mb-native-pip-checkpoint.json)。222项：105 done、8 doing、109 todo。
MB-09仍doing；接续持续播放/AV同步/更多组合与设备，DPIP-05仍独立验收。

## PKG-MB-08完成：严格TS、兼容声明与解码能力边界

全包34生产TS已迁移，默认可选工厂/精确Canvas兼容；显式媒体类型不泄漏SDK现代声明。
本轮修复全部轨道不可解码时仍发布就绪和替换成功的问题；保留一条可用轨道的部分播放，
不重复canDecode查询，SDK原错误和过期查询取消保持。16新断言旧main8通过/8失败，
候选专项257及main/legacy各233通过。新增30浏览器含12受控拒绝、8实际部分解码播放、
10能力对照；旧main相同30项18通过/12失败。最终150浏览器全部通过，39能力对照不计播放。
最终实际安装17类型/导出矩阵、完整CI1418及44重复契约通过，324生产TS，全部哈希核对。
见[变更](changes/2026-09-12-PKG-MB-08-capability.md)与[证据](baselines/mb-capability-validation.json)。
222项：105 done、7 doing、110 todo；立即专用本地提交。MB-TYPE-01/MB-READY-01关闭。
下一项MB-09处理长播放、AV sync、原生DPiP与新旧核心组合；能力/设备、完整分发与许可门槛仍open。

## PKG-MB-08检查点：入口TS与兼容媒体声明（doing）

全包34个自有生产模块已转TS，入口/Canvas桥/生命周期/清理分离。默认工厂仍可选Option、
同步初始化与精确Canvas结果；新增可选媒体/HLS/RAF类型，修复旧legacy及NodeNext ESM解析。
15条入口断言旧main6通过/9失败，候选专项241及main/legacy各217通过。最终120浏览器
全部通过，含12原生Canvas/新旧核心场景及29能力对照；旧main相同12入口场景全部失败。
实际安装17组类型/导出矩阵通过，候选7组各拒绝15非法用法；整工厂按冻结声明双向赋值。
完整CI1402项及44重复契约通过，324生产TS。源码/产物/浏览器/安装包哈希已核验。
见[变更](changes/2026-09-12-PKG-MB-08-entry-checkpoint.md)与[证据](baselines/mb-entry-checkpoint.json)。
222项：104 done、8 doing、110 todo。本地检查点提交，不计任务完成。
下一步：修复受控canDecode=false时video-only输入及替换无可用sink却发布就绪；
该问题旧/候选均已复现。MB-08、能力风险及后续分发/许可/设备门槛仍未关闭。

## PKG-MB-07完成：HLS配对、选择意图与UI拓扑

m3u8实际迁移为四个TS模块，包内30生产TS，仅剩index.js待MB-08。
旧查询/菜单回调不再覆盖当前source；control/setting各自清理，失败恢复实际轨道高亮。
质量/音频共享最新选择意图，media在配对查询期间变化会重新计算，保留匹配轨道与正常默认行为。
43断言旧main11通过/32失败，候选专项226、main/legacy各202通过；旧main30项HLS浏览器
14通过/16失败，候选20新增原生新旧核心/UI/SDK场景和10能力对照通过。最终全部七个
MediaBunny文件108浏览器通过，29项为能力对照，不计作播放。完整CI1387及44重复契约通过，
320生产TS；源码/产物/报告哈希及三格式复制一致。
见[变更](changes/2026-09-12-PKG-MB-07-hls.md)与[证据](baselines/mb-hls-validation.json)。
222项：104 done、7 doing、111 todo；立即专用本地提交，下一项MB-08入口、能力与声明。
长播放、全组合、设备及安装包仍待后续；未放行npm发布。

## PKG-MB-06完成：音频解码、时钟与资源归属

AudioEngine实际迁移TS，拆清clock、context、nodes、pump、task职责，删除最后音频声明桥。
暂停/切源/销毁取消迟到resume和buffer，seek/rate释放旧速节点；时钟、增益与无音轨回退
保持契约，播放协调器的原生resume去重下移到context owner。包内26生产TS，剩m3u8/index
由07/08接续。37音频断言旧main8通过/29失败，候选专项183、main/legacy各159通过。
最终78浏览器通过：含16新增原生音频场景及8新增能力对照；旧main同24音频浏览器
20通过/4节点清理失败。短时1×/2×音画取样最大偏差约39/38ms，长播/听觉/设备仍MB-09。
完整CI1344项通过，另44重复契约；316生产TS。源码/产物/报告哈希及三格式复制一致。
见[变更](changes/2026-09-12-PKG-MB-06-audio.md)与[证据](baselines/mb-audio-validation.json)。
222项：103 done、7 doing、112 todo；立即专用本地提交，下一项MB-07 HLS UI/拓扑。
MB-LIFE-01剩余长播放、全组合及HLS UI范围仍open；不构成npm发布验收。

## PKG-MB-05完成：视频迭代器、seek、晚帧与RAF

VideoEngine实际迁移TS，拆出frame读取/释放、renderer与poster职责，删除视频声明桥。
新source立即取消旧视频操作；seek与加载、暂停分别管理，旧帧不覆盖新状态；单实例RAF
与海报回调有清理；保留默认丢帧策略并修复启动预取覆盖第二帧，以及多seek共享
Canvas池导致排队帧像素被旧样本改写。包内20生产TS，
只剩AudioEngine显式声明桥。38项新断言对旧main7通过/31失败、候选全通过；包专项
146、main/legacy各110通过。最终54浏览器：12普通播放+10真实解码帧竞态+9Stream
取消+9synthetic RAF+11能力对照+3无轨道拒绝。旧main10项真实帧竞态全部失败，
候选全部通过，完整报告/trace归档。最终完整CI1307通过，另44重复契约，310生产TS。
见[变更](changes/2026-09-12-PKG-MB-05-video.md)及[证据](baselines/mb-video-validation.json)。
222项：102 done、7 doing、113 todo；立即专用本地提交，下一项MB-06音频引擎。
音频、HLS拓扑、长播放/AV同步与codec能力剩余项继续，不构成npm发布验收。

## PKG-MB-04完成：主协调器TS与操作隔离

MediaBunnyEngine实际迁移TS，并拆分playback/readiness/HLS查询职责；正常接口和事件顺序
保持，修复旧play/seek覆盖、错误吞掉、重复就绪及无轨道假就绪。新增40项测试在旧main上
8通过/32失败，候选全通过；包专项108通过、main/legacy各72通过。最终39项浏览器
包括12真实播放、9Stream取消、9synthetic RAF、6能力对照及3无轨道拒绝；另在已有
Chromium/Firefox播放用例内验证play回调同步pause后无playing。完整CI1269通过，
另44重复契约，306生产TS；包内16生产TS和2个未迁移解码器声明桥明确区分。
见[变更](changes/2026-09-12-PKG-MB-04-coordination.md)及[证据](baselines/mb-coordination-validation.json)。
222项：101 done、7 doing、114 todo；立即专用本地提交，下一项MB-05视频帧资源。
MB-LIFE-01/MB-READY-01剩余解码器/能力与组合范围仍open；不构成npm发布验收。

## 当前检查点：PKG-MB-04 VideoShim、事件与RAF资源

新增五个生产TS模块，保持shim/canvas布局和正常事件/Promise/属性契约；修复销毁后的RAF、
事件监听器和清理异常残留。同一12项shim断言在adba8a3d main上9通过/3失败，候选全通过。
包专项68项通过；main/legacy各32项（28候选+4冻结正常对照），三格式构建通过。
39项候选浏览器检查通过：12播放、9原生Stream取消、9synthetic RAF、7能力失败对照、
2待修复无轨道就绪。完整CI1229项通过，另44重复契约，301生产TS，声明桥未计为JS实现迁移。
见[检查点](changes/2026-09-12-PKG-MB-04-shim-checkpoint.md)及[证据](baselines/mb-shim-checkpoint.json)。
MB-04保持doing；立即继续MediaBunnyEngine实际TS与readiness/play/seek协调。事件出口已关闭
不代表底层晚操作已停止，MB-LIFE-01/MB-READY-01仍open。222项：100 done、8 doing、114 todo。
本地checkpoint，不推送/发布；Canvas/Ambilight类型决定仍待确认。

## 最新完成：PKG-MB-03 输入、Range与加载取消

六个strict TS模块已接入生产，修复切源/销毁/超时后的待加载Input、HEAD及timer资源与陈旧回调。
同一20项加载断言在冻结版6通过/14失败，候选source/main/legacy各20通过；来源/轨道12项与
旧基线24项继续通过。实际SDK保持1.56.1，WebCodecs补充声明固定0.1.19解决严格DOM声明冲突。
三格式构建与导出通过，72项最终浏览器检查通过；候选30项含12播放、9原生Stream取消、7能力
失败对照、2待修复无轨道就绪。完整CI1217项（1062单元+14工程+141基线），另44重复契约，296生产TS。
见[步骤记录](changes/2026-09-12-PKG-MB-03-input.md)和[验证证据](baselines/mb-input-validation.json)。
下一步MB-04主协调/事件/VideoShim；晚帧、音频、HLS UI和完整发布验收仍未完成。
222项：100 done、7 doing、115 todo。Canvas/Ambilight类型决定仍待确认；独立本地commit，不推送/发布。

## 最新完成：PKG-MB-02 媒体、事件与资源基线

24项历史生命周期检查通过，已接入统一CI；42项真实浏览器检查包含20次播放、12次环境能力
对照、6次历史输入失败和4次无轨道就绪行为，不能当作42次播放成功。短时帧/音频时钟、seek、
HLS轨道状态及正常AudioContext/RAF释放均有证据；待完成操作的泄漏和陈旧回调已复现。
完整CI1185项（1030单元+14工程+141基线）通过，另44重复契约，290生产TS。
见[任务记录](changes/2026-09-12-PKG-MB-02-baseline.md)和[验证证据](baselines/mb-behavior-validation.json)。
生产源码未在本步变更；接着MB-03输入与加载取消。222项：99 done、7 doing、116 todo。
Canvas/Ambilight类型决定仍待确认；未推送或发布。

## 当前检查点：PKG-MB-02 真实MP4与销毁负例

22项Node（含3个销毁后晚加载历史缺陷）通过；6项浏览器检查中，4项Chromium/Firefox
真实MP4像素/时钟/暂停成功，2项Windows WebKit明确能力失败对照。六项不是六次播放成功。
见[检查点](changes/2026-09-12-PKG-MB-02-checkpoint.md)和[证据](baselines/mb-media-checkpoint.json)。
MB-02仍doing，剩余WebM/HLS/Blob/Stream、seek、时序与释放；98 done、8 doing、116 todo。
本步没有修改生产源码。Canvas/Ambilight类型取舍仍待确认。

## 最新完成：PKG-MB-01 MediaBunny proxy 契约基线

冻结实际npm1.0.0/1.2.0共12成员、17个Git输入、3份产物接口表面与25条配置路径；
19项专项通过。完整CI1161项（1006单元+14工程+141基线）通过，另44重复契约，
290生产TS文件保持严格检查；生产/demo/产物哈希均未改变。
见[步骤记录](changes/2026-09-12-PKG-MB-01-contract.md)、[完整契约](baselines/mb-contract.md)
和[验证证据](baselines/mb-contract-validation.json)。历史内嵌SDK版本未知，与当前锁定1.56.1
分开记录；MPL通知/来源缺口由MB-LICENSE-01跟进。真实媒体、取消、音画同步等仍待02以后。
当前222项：98 done、7 doing、117 todo；Canvas/Ambilight类型取舍仍待确认。

## 当前检查点：PKG-FACTORY-01 类型兼容决策

Canvas/Ambilight 的工厂替换问题已增加72场景编译对照，以及可选重载的独立反例。
推荐恢复已发布1.1.0默认工厂形状，保留JS导出，具体1.0.0 TypeScript迁移影响见
[待确认决策](factory-compatibility-decision.md)。生产声明尚未修改；风险保持open，
本任务doing，不计入完成。当前222项：97 done、7 doing、118 todo。
此提交仅保存可复现测试、提案与证据；后续仍须实施、安装消费和产物验证。

## 最新完成：Document PiP-04 类型、工厂赋值与导出兼容

默认工厂完整保留旧必填签名与可替换性；Result保持void/可写字段，显式RuntimeFactory
和AsyncResult描述实际可选调用、self.default和异步只读状态。27安装场景含候选7及历史
12零诊断，另8个精确历史错误对照；1.0.0缺运行时单独保留。四组专项、三格式/编辑器
构建、最终main哈希对应的18浏览器检查与完整CI1140项通过，另44重复契约，290生产TS。
横向复查确认Canvas/Ambilight也有旧工厂替换2741，新增PKG-FACTORY-01紧接修复，并
加入两包05及REL-01依赖；该风险保持open。当前222项：97 done、6 doing、119 todo。
见[本步记录](changes/2026-09-12-PKG-DPIP-04-types.md)和[证据](baselines/dpip-types-validation.json)。
Document PiP原生组合05与完整demo/分发06仍未完成；独立本地提交，无推送/发布。

## 最新完成：Document PiP-03 严格TS与窗口资源修复

6个模块分离窗口申请/终态、DOM还原、样式、控件与延迟资源。20候选用例在旧源码
3正常通过/17失败，候选20全部通过；48历史和16正常契约继续通过。main/legacy各20
生命周期、三格式构建、原生ESM导入通过。宽矩阵66项通过后，最终main产物18项
真实DOM浏览器复验通过；受控窗口API不等于原生Document PiP，05门槛保留。
完整CI1136项通过，另44项重复契约观察，290生产TS文件严格检查。STYLE风险关闭；
LIFE/DOM记录修复，保留原生组合验收缺口。当前221项：96 done、6 doing、119 todo。
见[本步记录](changes/2026-09-12-PKG-DPIP-03-lifecycle.md)和[证据](baselines/dpip-lifecycle-validation.json)。
下一步04公开类型、两代导出与安装消费者；独立本地提交，不推送/发布。

## 最新完成：Document PiP-02 生命周期历史复现

四实现×12组共48项复现迟到/重复窗口、销毁后效果、DOM回滚失败和样式差异，
另16项正常契约通过。三浏览器×两核心×四实现×两场景48项真实DOM iframe检查通过，
其中历史缺陷断言通过不代表修复；原生窗口/用户激活/连续播放仍待05。
完整CI1116项通过，另44项重复契约观察，284生产TS文件严格检查。
当前221项：95 done、6 doing、120 todo。见[本步记录](changes/2026-09-12-PKG-DPIP-02-tests.md)
和[验证证据](baselines/dpip-behavior-validation.json)。下一步03拆分TS状态与资源并修复，
保留历史负例；每任务独立本地提交，不推送/发布。

## 最新完成：Document PiP-01 实际发布契约

冻结四个npm归档/21成员及7个Git工作区输入。实际1.0.0缺少三个运行时入口，
作为分发负例和类型基线，不能冒充可执行版本。三份可运行发布与冻结工作区的正常
窗口/DOM/控件/返回值契约已覆盖；16项专项和7项索引检查通过，完整CI1068项通过，
另44项重复契约观察，284个生产TS文件严格检查。尚未修改Document PiP生产源码；
02继续复现窗口竞争/销毁/错误回滚，03处理实现，05保留真实窗口与设备验收。
当前221项：94 done、6 doing、121 todo。见[本步记录](changes/2026-09-12-PKG-DPIP-01-contract.md)
和[验证证据](baselines/dpip-contract-validation.json)。独立本地提交，不推送/发布。

## 最新完成：Canvas-04 公开类型与两代导出

公开namespace保留可选Parameters和精确HTMLCanvasElement返回，新增显式MediaCanvas
视图；工厂.default自别名、ESM/CJS声明包装、旧TS legacy路径及语义编辑器生成同步。
仓库外安装17场景：候选7个/历史9个零诊断，另1个历史NodeNext ESM保留五个精确
诊断；候选每种模式拒绝11项非法用法。四组专项、18项真实浏览器及完整CI1052项
通过，另44项重复契约观察，284个生产TS文件严格检查。类型/两代导出具体风险关闭，
设备、Document PiP组合及完整demo/分发仍待05/06。当前221项：93 done、6 doing、
122 todo。见 [本步记录](changes/2026-09-12-PKG-CANVAS-04-types.md) 和
[验证证据](baselines/canvas-types-validation.json)。独立本地提交，无推送/发布。

## 最新完成：Canvas-03 严格TS职责与生命周期

生产源码拆为入口/媒体转发/底层video所有权/尺寸/绘制/调度六个严格TS模块，修复
过期bitmap、并发RAF、回调销毁后继续执行和订阅残留。底层video在播放前挂载，
WebKit保留原始尺寸和多点颜色；Chromium首帧/寻址条件有精确处理。额外保留旧JS
falsy callback行为，避免可选调用语法引入异常。24项候选要求在旧源码20失败/4正常
通过，最终70项专项、三格式构建和1048项完整CI通过；另44项重复契约观察。
广矩阵87项通过，最终falsy兼容修正后重跑受影响27项通过，未重复计为新增用例。
全仓284个生产TS文件严格检查。生命周期/记录的桌面像素风险关闭，类型/两代分发与
真实设备仍留04～06。当前221项：92 done、6 doing、123 todo。下一步Canvas-04。
见 [本步记录](changes/2026-09-12-PKG-CANVAS-03-lifecycle.md) 和
[验证证据](baselines/canvas-lifecycle-validation.json)。独立本地提交，无推送/发布。

## 最新完成：Canvas-02 历史错误与原生浏览器对照

33项Node回归与42项真实浏览器检查通过，就绪事件顺序、播放/暂停/seek/resize/切源
及销毁后RAF均有断言。WebKit六个旧代理场景首次透明失败；独立原生对照表明播放前
挂载可读到像素、未挂载透明。最终矩阵明确重现历史失败，不把它当作渲染成功。
完整CI1024项通过，另44项重复观察；未修改生产源码。CANVAS-LIFE-01升级reproduced，
新增CANVAS-PIXEL-01待03修复。当前221项：91 done、6 doing、124 todo。下一步03
拆分严格TS职责并以候选回归关闭生命周期/像素问题。见
[本步记录](changes/2026-09-12-PKG-CANVAS-02-tests.md) 和
[验证证据](baselines/canvas-behavior-validation.json)。独立本地提交，无推送/发布。

## 最新完成：Canvas-01 发布契约与正常基线

冻结npm1.0.0/1.1.0共12成员及工作区6个Git输入，运行三实现的同步返回、媒体属性/
方法转发、延迟事件、bitmap关闭、回调顺序和resize。明确同版本Git核心5.1.7已有
proxy而实际npm5.1.7没有，不能混为支持范围。13项Canvas专项、7项索引检查与991项
完整CI通过，另44项重复观察；新增两个发布对照点，索引现为22工作区+11发布。
生命周期/类型/分发风险已登记，生产代理源码尚未修改。当前221项：90 done、6 doing、
125 todo。下一步Canvas-02复现异步资源和终止问题，Canvas-03开始源码TS拆分。
见 [实施记录](changes/2026-09-12-PKG-CANVAS-01-contract.md) 和
[验证证据](baselines/canvas-contract-validation.json)。独立本地提交，无推送/发布。

## 最新完成：Ambilight-PROXY-01 Canvas输出区域修复

组合测试复现Canvas缩放后仍按底层视频尺寸截取而取错九格颜色；内部明确video/canvas
来源类型，Canvas采用输出buffer尺寸，原生video保留intrinsic尺寸。3项新Node测试
修改前2失败/1正常通过，专项56项、最终27项浏览器及978项完整CI通过。浏览器实际
覆盖6项Canvas组合、3项5.1.7没有proxy配置的原生能力对照、18项既有生命周期回归，
没有把未启用代理算作组合通过。新增独立子任务，当前221项：89 done、6 doing、
126 todo。05增加PKG-CANVAS-04依赖，代理自身仍未迁移；下一步PKG-CANVAS-01核对
真实发布和历史契约，再推进TS迁移。见 [实施记录](changes/2026-09-12-PKG-AMBILIGHT-PROXY-01-sampling.md)
和 [验证证据](baselines/ambilight-proxy-validation.json)。独立本地提交，无推送/发布。

## 最新完成：Ambilight-04 公开类型与两代导出

公共声明补齐可选调用，保留1.1.0的Parameters推导；CJS直接调用与历史.default自别名
同时可用，ESM/CJS声明身份、旧TS legacy映射、编辑器生成和打包排除已同步。
仓库外安装两版真实发布及候选，共17个场景（候选7个/历史9个零诊断，另1个历史
NodeNext ESM场景按4个精确诊断保存），候选各拒绝10项非法用法。四组专项、完整
CI975项及18项三核心/三引擎浏览器通过，278个生产TS文件严格检查；类型/两代导出
具体风险关闭。当前220项：88 done、6 doing、126 todo。下一步05代理/设备组合，
06完整分发/demo仍未完成。见 [实施记录](changes/2026-09-12-PKG-AMBILIGHT-04-types.md)
和 [验证证据](baselines/ambilight-types-validation.json)。独立本地提交，无推送/发布。

## 最新完成：Ambilight-03 TS模块与生命周期修复

生产源码已拆成入口、视图、取色、帧调度4个严格TS模块，修复销毁残留、重入旧帧、
初始化回滚和Canvas异常卡死。16项候选要求在旧源码14失败/2正常通过，候选与历史
及发布契约共53项通过。首次真实浏览器发现Firefox宽度重置仍污染，加入独立对照后
修复为下次有效取色替换Canvas，最终三核心/三引擎18项通过、无skip。正式三格式构建
及完整CI971项通过，另44项重复观察；全仓278个生产TS文件严格检查。当前220项：
87 done、6 doing、127 todo。04公开类型/历史CJS.default、05代理/设备、06包消费/demo
未完成。见 [实施记录](changes/2026-09-12-PKG-AMBILIGHT-03-lifecycle.md) 和
[验证证据](baselines/ambilight-lifecycle-validation.json)。本任务独立本地提交，无推送/发布。

## 最新完成：Ambilight-02 行为与失败回归

30项Node复现RAF id零、异常后卡住、销毁/重入/晚注册和初始化回滚问题。54项三引擎/
三核心真实媒体验证通过；原生跨域Canvas污染在同源恢复后仍持续，新Canvas能取色的
独立对照排除媒体未恢复误判。核心来源为实际npm5.1.7/5.4.0及候选；无skip。主CI955项
通过，另44项重复观察；03将拆TS并修复，尚未改生产源码。当前220项：86 done、
6 doing、128 todo。见 [实施记录](changes/2026-09-12-PKG-AMBILIGHT-02-tests.md)
和 [验证证据](baselines/ambilight-behavior-validation.json)。

## 最新完成：Ambilight-01 实际发布契约

冻结npm1.0.0/1.1.0共12成员及工作区源码/声明/demo；真实执行旧CJS.default、新CJS/
ESM/全局和三实现正常取色契约。zIndex一直忽略，参数省略与声明、历史导出形状的
差异已登记。7组专项及7组索引反例通过，完整CI主链925项通过（另44项重复观察）。
生命周期仍是源码观察，02复现、03修复；尚无生产源码改动或实际浏览器验收。当前
220项：85 done、6 doing、129 todo。见 [实施记录](changes/2026-09-12-PKG-AMBILIGHT-01-contract.md)
及 [验证证据](baselines/ambilight-contract-validation.json)。下一步Ambilight-02/03。

## 最新完成：ENG-09 工程保障整合

提交审计、核心到22包影响映射、264行契约归属和文档检查整合核验通过；三个子项已有
独立提交，保留DOC-01至04固定例外及255行精确测试索引缺口。本轮仅重跑整合检查，
完整CI沿用已提交子项证据，不声称新设备或发布验收。当前220项：84 done、6 doing、
130 todo。见 [整合记录](changes/2026-09-12-ENG-09-integration.md) 和
[验证证据](baselines/engineering-integration.json)。下一步继续Ambilight契约及源码迁移。

## 最新完成：ENG-COVERAGE-01 契约归属及精确证据索引

22包×12类契约共264行已分配验证任务，29个冻结版本对照点可校验。逐条核对10个已有
断言并接入Node结构化执行；44项重跑通过，不当成新增功能覆盖。旧报告、旧输入、
旧定义、skip/失败和未索引状态分别记录；255行仍待精确测试索引，不表示没有历史测试。
7组反例及完整CI主测试链918项通过；另有44项报告链路重复执行。修复Windows reporter
specifier，补上空清单与重复断言防护，完整失败/通过证据归档。当前220项：83 done、
6 doing、131 todo。父ENG-09仍待整合核验；VAST初始化选择待确认，其他包实施继续。
本步独立本地提交，随后审计自身；未推送/发布。见 [实施记录](changes/2026-09-12-ENG-COVERAGE-01-index.md)
和 [验证记录](baselines/contracts-validation.json)。

## 最新完成：ENG-IMPACT-01 全包影响与必需检查映射

实际22包依赖/验证关系、共享构建/类型/锁文件及示例映射已接入ci:check；Git变更包含
改名两端及所有本地状态，未知路径保守扩大到全包。六项必需CI命令继续执行，并校验
真实workflow的条件、失败传播和完整历史；shell漏检已用反例复现并修复。
7组专项测试和完整CI911项通过，专项lint及actionlint通过。报告明确统一安装消费者
当前只有core/chapter，其余19个库包不能据此算验收完成。ENG-COVERAGE-01和父任务
ENG-09继续，VAST初始化选择仍待确认。当前220项：82 done、6 doing、132 todo。
本任务独立本地提交后审计自身；未推送或发布。见 [实施记录](changes/2026-09-12-ENG-IMPACT-01-mapping.md)
和 [验证证据](baselines/impact-validation.json)。

## 最新完成：ENG-AUDIT-01 每任务提交审计

新增实际Git历史审计并接入ci:check，核对状态迁移、独立提交、证据/plan共提交和合并分支。
原80个done对应76个独立完成提交，另4项为固定DOC-05初始例外；保留真实历史标题格式。
真实Git反例及完整本地CI904项通过，GitHub三个checkout改为完整历史，actionlint通过。
提交后再审计本任务自身。ENG-09拆成Git审计、影响映射、契约覆盖三个子项，后二者
和父任务仍未完成；没有远端运行或推送。当前220项：81 done、6 doing、133 todo。
VAST初始化选择仍待确认；其余实施继续。见 [本步记录](changes/2026-09-12-ENG-AUDIT-01-commits.md)
和 [验证证据](baselines/commit-audit-validation.json)。

## 当前实施：VAST-03 TS拆分与生命周期修复

原入口拆成5个严格TS模块，处理核心终止、显式广告重建、SDK/DOM回滚与晚到/重入回调。
15项候选生命周期断言在旧工作区全部失败，修复后60项Node通过；三格式构建成功，
117项三核心/三引擎浏览器wrapper测试通过。完整CI900项通过、274个生产TS严格检查。
补齐@alugha/ima2.1.0类型依赖，两个编译器不再出现SDK缺失类型错误。
初始化行为存在真实发布/工作区冲突，已给出 [具体取舍](vast-compatibility-decision.md)，
确认前仍保持工作区默认，03保持doing；Google IMA及公开类型/分发完整验收未完成。
当前217项：80 done、6 doing、131 todo。此批独立提交未完成检查点，见
[实施记录](changes/2026-09-12-PKG-VAST-03-lifecycle.md) 和
[验证证据](baselines/vast-lifecycle-validation.json)。

## 最新完成：VAST-02 行为与生命周期回归

45项Node测试通过，覆盖当前源码及两套冻结历史源码；实际核心5.1.7的197成员已归档。
三引擎/三核心90项真实浏览器测试通过，含异步注册、SDK失败后主片解码、DOM显隐、
切源后广告重建及历史销毁竞态。SDK为受控记录器，实际Google IMA广告验收仍待05。
完整本地CI885项通过（817单元、14工程、54基线）。十类历史资源/异常问题已复现，
由03修复；本步没有VAST生产源码/类型/依赖/产物修改。当前217项：80 done、5 doing、
132 todo。详见 [本步记录](changes/2026-09-12-PKG-VAST-02-tests.md) 和
[验证证据](baselines/vast-behavior-validation.json)。

## 最新完成：VAST-01 实际发布契约

固定实际发布1.0.0、未发布工作区1.2.0及SDK1.21.0/1.21.2的60个归档成员。
四项可重跑测试确认公开callback字段、初始化、异步时序、请求配置和实际导出；
最小TS消费者复现缺失的SDK类型依赖。差异分配给02～06，尚未修改VAST生产源码。
VAST脚本的VPN跳过例外已按用户更正记录，本次未使用。下一步02补齐失败和销毁回归。
当前217项：79 done、5 doing、133 todo。详见
[本步记录](changes/2026-09-12-PKG-VAST-01-contract.md) 和
[验证证据](baselines/vast-contract-validation.json)。

## 当前实施：Ads-05 页面与媒体组合

补上27项原生全屏/多实例真实视频/详情导航/窄屏布局验证，源码、正式main/legacy均通过。
修复销毁前未创建广告时误删调用方undefined模板属性；源码及三格式Node194项通过。
独立Chrome实际标签切换的main/legacy各6组通过，覆盖后台倒计时暂停、恢复后视频
继续播放和后台销毁。首轮失败已定位为初始隐藏/桌面遮挡及启动端口文件竞争，保留
原始失败，未放宽超时或模拟document.hidden。完整CI835项通过。
关闭具体核心兼容/生命周期/桌面UI问题，实际设备媒体策略仍待验；VAST脚本VPN例外
按用户更正单独登记。详见 [进行中记录](changes/2026-09-12-PKG-ADS-05-browser.md)。
当前217项：78 done、5 doing、134 todo。05仍未完成，本批独立检查点提交。

## 最新完成：Ads-04 类型与导入兼容

公开声明补齐 html/video/url/i18n，增加 CJS/ESM 类型桥和同一运行时的准确 /runtime
类型入口。保留两套历史输入的普通调用，并补齐 require(pkg).default 自引用兼容。
严格消费者、历史声明对照、隔离安装和真实 Monaco 编译运行已经接入可重跑测试。

同一 Parameters 提取类型无法同时维持发布版 string 和工作区 number 时长字段；
普通调用通过，但旧 scalar 读取分别复现1/2个 TS2322。用户已明确接受这项类型
推导修正并要求迁移说明，ADS-TYPE-01 据此 accepted-with-scope，不扩展为其他豁免。
完整 CI 834 项通过，三格式 Node190、main真实媒体144、main/legacy编辑器各3项通过；
最终安装包五模式和迁移示例继续严格验证。04完成，下一步05真实页面与媒体/UI验收。
当前217项：78 done、4 doing、135 todo。详细结果见
[实施记录](changes/2026-09-12-PKG-ADS-04-types.md) 和
[验证证据](baselines/ads-types-validation.json)。

## 最新完成：Ads-03 源码拆分与生命周期修复

Ads 原入口拆为 7 个严格 TS 模块，职责为配置、类型、计时、资源、视图、session 和入口。
修复重复计时/metadata、工厂复用参数串用、零阈值、过早方法、播放拒绝、销毁/重入后的
回调；保留正常 skip 顺序、同步结果、活配置事件参数、CSS 和 play/pause 只控制倒计时。
实际模块地图及媒体/监听/定时器所有权写入包内 ARCHITECTURE.md。

实际核心 4.5.5 归档与实现能力已核验并接入浏览器映射。正式三格式 Node 186 项通过；
正式 main/legacy 的三引擎矩阵分别 144 项全部通过，无跳过/重试，覆盖 4.5.5/5.4.1/
候选核心、新旧插件、本地真实媒体、提前/重复 skip、销毁资源及内部播放拒绝。
完整本地 CI 830 项通过（770 单元、14 工程、46 基线），269 个生产 TS 严格检查，
37 份核心声明无漂移。原始缺陷/测试夹具失败、报告、trace 和最终输入哈希均保留。

当前 217 项：77 done、4 doing、136 todo。下一步 Ads-04 处理准确公开声明、历史
export=、string 时长误声明与工作区 source/type 类型接受面；尚未称整个 Ads 发布验收
完成。隐藏页/设备/全屏和完整分发仍由 05/06 接续，既有 DASH 等开放风险不变。
见 [本步记录](changes/2026-09-12-PKG-ADS-03-lifecycle.md)、
[执行证据](baselines/ads-lifecycle-validation.json) 和 [测试维护](ads-validation.md)。
以下为历史检查点当时状态。

## 最新完成：Ads-02 行为与真实媒体回归

新增 58 项 Node 测试，覆盖源码、实际 npm 1.0.6 和冻结的未发布工作区 2.1.0；
倒计时、阈值、方法返回/事件顺序、独立实例、restart、媒体错误及八类历史缺陷有可重跑证据。
Ads 测试接入 test:unit，并提供 yarn test:ads，没有新增依赖或修改生产源码/类型/产物。

三引擎实际浏览器 66 项全部通过、无跳过/重试：5.4.1/候选核心 × 旧/候选插件，
本地图片、视频解码像素、静音/跳过、自动恢复、404、暂停倒计时与切源。额外精确注入
两类 play 拒绝，并复现零阈值首 tick 前点击问题。注入拒绝不等于设备自动播放策略验收。
首轮事件名夹具错误及第二轮初始化等待/Windows WebKit 尺寸假设失败完整保留。

完整本地 CI 806 项通过（747 单元、14 工程、45 基线），262 个生产 TS 严格检查，
核心声明无漂移。Ads 生命周期/媒体/UI 风险仍 open，旧核心 4.5.5、全屏、隐藏页策略、
真实资源销毁、完整分发及设备验收由 03～06 接续；DASH 暂停 seek 等既有风险不变。

当前 217 项：76 done、4 doing、137 todo。下一项 Ads-03 开始配置/计时/视图/媒体与
生命周期拆分及历史缺陷修复。见 [测试说明](ads-validation.md)、
[本步记录](changes/2026-09-12-PKG-ADS-02-tests.md) 和 [执行证据](baselines/ads-validation.json)。
以下为历史检查点当时状态。

## 最新完成：Ads-01 实际发布契约核对

工作区 Ads 2.1.0 未发布；实际 npm 五个 1.0.x 版本、30 个成员已校验冻结，主要行为基线
为 1.0.6。五版均使用 html/video/url，当前 source/type 声明并非实际发布接口；旧声明的
totalDuration:string、旧 CommonJS default namespace 与当前 callable 的差异分别记录。
1.0.6 关联核心为 4.5.5，当前源码新增 >=5 门槛不能作为旧发布兼容证据；旧核心实际组合待测。

六项类型/分发/旧核心/生命周期/媒体/UI 风险已指派，02～06 交付物已细化。局部 lint、
两项 Ads 检查及完整 45 项基线检查通过，没有修改生产源码、依赖、版本或产物。
当前 217 项：75 done、4 doing、138 todo，下一项 Ads-02 建立时钟/媒体/错误回归。
见 [契约](baselines/ads-contract.md)、[本步说明](changes/2026-09-12-PKG-ADS-01-contract.md)
及 [执行证据](baselines/ads-contract-validation.json)。DASH 等开放媒体/设备风险仍保留。

## 当前实施：DASH-05 暂停 seek 根因已定位

真实 SourceBuffer、SDK seekTime/缓冲事件和处理器状态表明，SDK 4.5.2 在空裁剪分支未更新
暂停前缓冲量，调度器继续按旧值阻止下载。不创建 ArtPlayer 的稳定暂停用例在 Chromium/
Firefox 都复现；失败后合成一次 timeupdate 能恢复，测试仍保留失败。SDK 5.2.1 原生用例
两边通过；将其缓冲刷新移入 SDK 4 的单分支诊断补丁后，原生/新旧组合 10 项通过。

本批只增加诊断测试和证据，没有向生产注入事件、修补 SDK、增加依赖或改变产物。
DASH-SEEK-01 根因已知但兼容处置尚未完成，仍 open。DASH-05 仍 doing，217 项仍为
74 done、4 doing、139 todo。详见 [根因记录](changes/2026-09-12-PKG-DASH-05-seek-diagnosis.md)
和 [执行证据](baselines/dash-seek-diagnosis.json)。其余包的独立源码迁移可继续，发布门槛不降低。

## 当前实施：DASH-05 SDK 事件刷新源码改造

新增第六个严格 TS 模块 sdk-events：按 SDK 质量/音轨/流事件合并刷新菜单，保留同步
选择与 update，清理仅释放自有监听；覆盖 teardown/恢复、SDK 替换、异常和重入。
播放 tick 只检查 Auto 变化；暂停时纯配置修改且无 SDK 事件仍由显式 update 即时刷新。

源码 Node 144、三格式 378 项通过；正式 main/legacy 实际 SDK 各 62 通过/28 无 MSE
跳过（当时完整 90 项）；新增实际设置及修正参数的原生对照 main 20 通过/10 跳过，
legacy 设置 16 通过/8 跳过。main/legacy 受控 SDK 与真实 DOM 各 84 项全部通过。
实际 SDK spec 目前定义 114 项，90 项报告与后续过滤运行的范围分别保留，未冒充整套重跑。
完整本地 CI 746 项通过（689 单元、14 工程、43 基线），262 个生产 TS 严格检查通过。

当前项同步风险 DASH-STATE-01 已关闭；DASH-SEEK-01 仍 open，后续通过不能证明历史
边界停滞已解决。设备、Windows WebKit MSE、demo/完整分发继续推进。217 项仍为
74 done、4 doing、139 todo；本批是待完成 DASH-05 的本地检查点，不推送发布。
见 [本批说明](changes/2026-09-12-PKG-DASH-05-sdk-events.md) 和
[执行指纹](baselines/dash-sdk-events-validation.json)。以下为历史检查点当时状态。

## 当前实施：DASH-05 实际 SDK 类型与 nullable 元数据

实际 dash.js 4.5.2/5.2.1 类型消费者已接入，固定五个 @svta 类型依赖及原始 exports。
发现并修正两代 SDK 的 nullable id/index/lang 无法赋给新 AudioTrack 的问题；内部类型
直接复用公开形状，运行逻辑不变，重新构建的三份 JS 与 04 指纹逐字节一致。

十组 SDK/编译器/模块配置中八组零诊断，两组 SDK 5/旧解析方式保留 SDK 自身诊断；
候选插件均增加零诊断，两条非法用法均拒绝。源码 Node 118、三格式 274、Monaco 三引擎
3 项通过；隔离 Yarn tarball 的五种类型模式和每组八条非法用法通过。
完整工程 CI 720 项通过、261 个生产 TS 文件严格检查通过；最后的夹具整理已单独重跑十组类型矩阵。

任务仍为 74 done、4 doing、139 todo。DASH-SEEK-01、SDK 自动状态刷新、legacy 真实媒体、
有效设备和完整分发仍未完成。详见 [本步说明](changes/2026-09-12-PKG-DASH-05-sdk-types.md)
与 [执行记录](baselines/dash-sdk-types-validation.json)。以下为各检查点当时的状态。

## 当前实施：DASH-05 真实 SDK 与 MPD 检查点

已固定 npm dash.js 4.5.2/5.2.1 归档/成员/许可证指纹，新增本地双画质双音轨 DASH、
纯视频和单画质拓扑，真实 Chromium/Firefox/WebKit 测试及不创建 ArtPlayer 的 SDK 对照。
正式 main 共 54 项：36 通过、2 失败、16 因 Windows WebKit 无 MSE 跳过，不算播放验收。
外部 SDK 选择后的同步 update、连续换源/菜单清理、旧回调及调用方 SDK 销毁所有权通过。

两个 main 失败均为 SDK 4.5.2/发布插件的暂停 seek：新旧核心都可在 5.999999 秒缓冲
终点 seek 到 6 秒后停滞。DASH-SEEK-01 保持 open；AbortError 是超时后销毁的结果，
不能当作起因。原生对照通过不足以定位或关闭它，首次 Firefox/候选插件失败也仍保留。
已修正能力探针错误销毁未初始化 SDK、以及换源测试误保留可变 option 对象两个测试问题。
完整本地工程 CI 717 项通过、261 个生产 TS 严格检查通过；该 CI 不含上述失败的 SDK 浏览器套件。
生成器在同一 FFmpeg/主机的新目录重建 31 个资源，全部字节一致，已查看实际播放截图。

当前 217 项：74 done、4 doing、139 todo。DASH-05 尚未完成；实际 SDK 类型、自动状态
刷新/错误、legacy SDK 矩阵、设备和完整分发继续推进。此次没有修改生产源码、依赖或版本。
详见 [本批记录](changes/2026-09-12-PKG-DASH-05-sdk-checkpoint.md)、
[执行证据](baselines/dash-sdk-checkpoint.json)。以下各节为对应阶段当时的历史状态。

## 最新完成：DASH-04 严格 TS、公开类型和编辑器迁移

DASH 五个自有模块全部 TS 化，源码/公开工厂可互相赋值；默认字段和自定义 SDK 泛型准确，
旧 object 回调、Parameters 配置提取、同步 update 与所有 JS 分发路径保持。
补齐 CJS/ESM/legacy 类型桥和 Monaco 生成声明；实际 npm 旧声明与候选消费者对照通过。

全仓 261 个生产 TS 严格检查，完整 CI 715 项通过；源码 Node 116、三格式 Node 266 项通过。
正式 main 三引擎 90 项（含核心/DASH Monaco 6 项）、legacy 84 项通过，无重试/跳过。
工作区外 Yarn tarball 离线安装/冻结重装后五种类型模式通过，每模式拒绝八条非法用法。
首次发现 tsconfig.json 泄露到包，已保留失败并修正 .npmignore，未手改生成产物。

DASH-TYPE-01 关闭；真实 dash.js/MPD/ABR、SDK 类型与设备/完整分发仍待验证。
当前 217 项：74 done、3 doing、140 todo。下一步 DASH-05 进入真实 SDK 与媒体组合。
详见 [本次变更](changes/2026-09-12-PKG-DASH-04-types.md) 和
[执行证据](baselines/dash-types-validation.json)。独立本地提交，不推送/发布，全项目目标未完成。

## 最新完成：DASH-03 SDK 适配与生命周期源码改造

DASH 源码已拆为入口生命周期、SDK 适配、selector 模型、菜单所有权四个 JS 模块。
恢复发布版 4.x 方法表，保留 5.x 稳定 ID；修复空菜单残留、过期引用、销毁/安装异常清理、
重复标签/零 ID/唯一克隆轨道高亮，以及清理重入误删新 UI 和销毁后继续格式化的问题。

源码 116 项、三格式两代 SDK Node 266 项通过；正式插件 main/legacy 三引擎、新旧核心
DOM/原生 MP4 各 84 项通过。完整 CI 712 项通过，实际 SDK/MPD/ABR 与设备验证仍未完成。
初始 21 项失败和两组重入/格式化失败、VM 数组比较修正证据均保留，未以重试跳过制造通过。
DASH-LIFE-01 关闭；DASH-SDK-01/DASH-STATE-01 仍需 05 实际 SDK 验证。

当前 217 项：73 done、3 doing、141 todo。下一步 DASH-04 迁移这四个模块和公开类型到严格 TS。
详见 [源码变更](changes/2026-09-12-PKG-DASH-03-runtime.md)、[执行证据](baselines/dash-runtime.json)
及 [包内架构](../packages/artplayer-plugin-dash-control/ARCHITECTURE.md)。独立本地提交，不推送/发布。

## 最新完成：DASH-02 行为测试与真实 DOM 交互

保留原有 5 项稳定 ID 回归，新增发布三格式/冻结工作区/候选源码契约测试，定向 74 项通过。
完整 CI 670 项通过（619 单元、14 工程、37 基线），未修改生产源码、声明、依赖或产物。
新旧核心/插件、控制栏/设置、质量/音轨三引擎最终 48 项通过。首轮 24 通过/24 失败的报告
及全部 trace 已保留；失败原因是 SVG 换行使整行精确定位失效，改为专用文本节点，未放宽断言。

浏览器使用真实 DOM 和原生 MP4，SDK 方法受控；不代表 dash.js/MPD/ABR 实际集成通过。
SDK 两代不兼容、过期 UI/引用、当前项高亮问题已受控复现，仍保持 open，03/05 接续修复验证。
当前 217 项：72 done、3 doing、142 todo。下一步 DASH-03 开始源码职责和 SDK 适配改造。
详见 [本次变更](changes/2026-09-12-PKG-DASH-02-tests.md) 与 [验证维护入口](dash-validation.md)。
本任务独立本地提交，不推送/发布；其他媒体和设备风险、全包发布准入仍未完成。

## 最新完成：DASH-01 发布版与 SDK 兼容契约

已校验 DASH Control 1.1.0 的实际 npm 归档及 6 个成员。发现发布版使用 dash.js 4.x
方法，而当前同版本工作区只支持 5.x，不能把两者视为等价。后续 02/03/05 已明确保留
4.x 调用并适配 5.x 稳定 ID，至少验证原示例 4.5.2 和当前示例 5.2.1。

新增契约校验及旧有 DASH 回归共 7 项通过，完整基线 37 项通过；无生产/依赖/类型/
构建修改。SDK、生命周期/过期 UI、当前项定位、类型和示例问题已登记。当前 217 项：
71 done、3 doing、143 todo。下一项 PKG-DASH-02；Audio/Chapter/HLS 开放风险仍保留。
详见 [契约](baselines/dash-control-contract.md) 和 [本次变更](changes/2026-09-12-PKG-DASH-01-contract.md)。
本任务独立本地提交，不推送、不发布；全项目目标仍未完成。

## 当前实施：Chapter-05 组合验证与长标题修复检查点

正式 main/legacy 的章节基础及新旧核心/插件组合各 102 项通过，完整 CI 599 项通过。
新增覆盖清晰度/缩略图、窄屏长标题、真实元素与网页全屏，以及 390px 可信触摸模拟。
长标题超出进度条的显示缺陷已通过 CSS 修复，完整文本与公开接口不变；截图已查看。

保留菜单交互前提修正的失败记录、旧核心 WebKit 位置归零观察。一个早期 WebKit
quality restart 等待超时的确切原因尚未证明，CHAPTER-TIMING-01 保持 open；后续
两种产物通过不能关闭它。触摸模拟没有替代手机真机。Chapter-05 仍 doing，尚未执行 06。

当前 217 项：70 done、3 doing、144 todo。Audio-05、HLS-SDK-01 的风险仍保留。
本批为本地 checkpoint，未推送或发布。后续优先推进独立包的源码/契约迁移，并在有效
环境中接续开放的媒体/设备验证。详见 [本次变更](changes/2026-09-12-PKG-CHAPTER-05-combinations.md)
和 [冻结证据](baselines/chapter-combinations-checkpoint.json)。

## 当前实施：Audio-05 恢复修复与真实缓冲检查点

已修复旧核心时间零 seek 后候选音频漏恢复，严格 TS 与公开接口不变；三格式 Node 97 项、
完整 CI 599 项、main/legacy 三引擎媒体和新旧组合各 78 项通过。首次 legacy 原生负 seek
返回 0.01 导致的严格零断言失败已保留，补充边界对照后完整重跑。不是发布或全包验收。

独立原生媒体 preload=auto 对照已确认 Chromium/Firefox 可推进后真实 waiting，Windows
WebKit 在两种受限响应下未推进到缓冲，放行后可播放。AUDIO-RESUME-01 关闭，
AUDIO-BUFFER-01 与 AUDIO-SYNC-01 保持 open；没有跳过集成失败或将原生诊断当作通过。

当前 217 项：70 done、2 doing、145 todo。Audio-05 和 HLS-SDK-01 尚未完成。
本批为本地 checkpoint，源码、测试、包内架构与证据一同提交。其余包继续按依赖推进；
分发、设备、完整 CI/CD、各包大版本升级和三轮发布复盘仍待完成，未推送或发布。
见 [本次变更](changes/2026-09-12-PKG-AUDIO-05-combinations.md) 和
[冻结证据](baselines/audio-combinations-checkpoint.json)。以下是各阶段当时的历史状态。

## 最新完成：CORE-24 连续切源播放意图修复

Audio-05 检查点已提交 b5e96664，原六项候选核心回归保持原断言重跑全部通过。
切源现在继承尚未完成操作的播放意图，公开 play/pause 在用户回调前更新它；内部
暂停不覆盖意图，显式暂停和暂停修订号阻止晚到恢复的事件/提示副作用。

源切换单元 34 项、完整 CI 594 项通过；正式 main/legacy 三引擎各 81 项通过；
隔离 tarball 的 34 项运行时、5 组兼容类型、8 组精确类型通过，运行字节与正式文件一致。
覆盖率 0 门槛违例，Node 总行覆盖 61.04%，不声称全部源码均已覆盖。
CORE-SOURCE-01 关闭，AUDIO-RESUME-01、偏移原生对照、真实缓冲及 HLS 风险仍开放。

当前 217 项、70 done、1 doing、146 todo。本任务独立本地提交核实后恢复 Audio-05。
详见 [修复记录](changes/2026-09-12-CORE-24-source-intent.md) 和
[冻结证据](baselines/core-source-intent-validation.json)。未推送或发布，全局目标保持不变。

## 当前实施：Audio-05 发现连续切源回归，拆分 CORE-24

Audio-04 已独立提交 13c898c1。新组合测试覆盖旧/新核心、旧/新 audio 的连续切源、
双实例和偏移边界，首轮 28 通过、8 失败，原始报告/trace 和输入已保存。
六项候选核心切源失败确认原播放意图被前一次内部暂停覆盖；新增 CORE-24 独立修复，
Audio-05 暂回 todo 等待前置。另有 WebKit 旧核心/新音频恢复问题待精确诊断，以及
旧版边界 16.01 与精确 16 断言差异需要原生对照。没有修改测试使它们假通过。

任务现为 217 项、69 done、1 doing、147 todo。下一步 CORE-24 的播放意图与取消测试，
完成后继续 Audio-05 的恢复、真实缓冲和其余边界。HLS 仍 doing，全局目标不变。
见 [进行中记录](changes/2026-09-12-PKG-AUDIO-05-combinations.md) 和
[首轮证据](baselines/audio-combinations-first.json)。本次为测试发现检查点，不是完成提交。

## 最新完成：PKG-AUDIO-04 严格 TS 与兼容类型入口

Audio 两个职责模块已迁移 TS，累计 256 个生产 TS。默认/legacy 保留原 update 类型
推断；新增 /runtime 精确入口支持部分配置，复用同一 JS/mjs。直接拓宽类型会破坏旧
上下文实现的证据及决定已写入 ADR-023，编辑器生成和 README 同步。

完整 CI 586 项通过，五组 TS 消费各 12 个负例、专用类型 3 项、Monaco 三引擎 9 项
通过；三格式 Node 89 项、最终 main/legacy 各 42 项通过，三种 JS 与 Audio-03 字节
相同。结束用例首轮 WebKit 失败保留并补强 seek/恢复前提，未靠重试关闭问题。
真实 Yarn pack 修正 tsconfig 泄漏后保留全部 6 份声明及历史文件；隔离安装仍待 Audio-06。

当前 216 项、69 done、1 doing、146 todo。Audio-03 提交 9c07ea83 已核实，Audio-04
独立提交核实后进入 05 的边界/缓冲/切源/多实例。AUDIO-TYPE-01 按兼容范围接受，
AUDIO-SYNC-01/DEMO-01、HLS 两项 Firefox 风险和全局发布门槛仍开放。
详见 [交付记录](changes/2026-09-12-PKG-AUDIO-04-types.md) 和
[冻结证据](baselines/audio-types-validation.json)。无 push/tag/publish/merge。

## 最新完成：PKG-AUDIO-03 源码拆分与生命周期修复

Audio Track 已拆为入口事件管理与独立媒体状态两个 JS 模块；修复原生暂停/结束后
外部音频继续播放、销毁空 src 错误和旧引用复活，补失败回滚与自有订阅清理。
公开 audio、同步 update、旧 URL/偏移/阈值语义保持，包内架构文档已同步。

44 项源码/89 项含三格式 Node 通过，CI 583 项；正式 main/legacy 三引擎各 42 项通过，
其中保留 9 项旧缺陷观察和 3 项原生诊断。三份 docs/compiled 与包产物一致。
首轮错误 currentSrc 断言及原始 trace 保留；main gzip 973（基线 676），不声称体积优化。
当前 216 项、68 done、1 doing、147 todo。Audio-02 已提交 803e8725，03 独立提交核实后
进入 04 严格 TS/公开类型；完整负偏移/缓冲、真机、分发门槛仍待后续，HLS 两风险仍 open。
详见 [源码交付](changes/2026-09-12-PKG-AUDIO-03-lifecycle.md) 与 [冻结证据](baselines/audio-lifecycle-validation.json)。

## 最新完成：PKG-AUDIO-02 行为与真实媒体基线

38 项 Node 契约覆盖源码和发布三格式，完整 CI 577 项、254 个生产 TS 通过。
三引擎最终 36 项通过、零失败/重试/跳过；其中 9 项为旧版缺陷复现、3 项为原生 WAV
能力诊断，不能把这些数量全部作为无缺陷候选验收。真实 AAC/视频播放、偏移 seek、
音量倍率、音频切源/503 恢复已验证。原始夹具失败与归因/trace 均保留。

旧插件销毁后 update 可复活、src='' 新生媒体错误、原生视频暂停/结束未停外部音频
已有证据；AUDIO-LIFE-01/SYNC-01 仍 open，03 接续源码拆分修复。
当前 216 项、67 done、1 doing、148 todo；HLS 仍保持原发布门槛。
Audio-01 已提交 8c0a2fee，Audio-02 独立本地提交后核实，再进入 03。
详见 [测试说明](audio-validation.md) 和 [记录](changes/2026-09-12-PKG-AUDIO-02-tests.md)。

## 最新完成：PKG-AUDIO-01 外部音轨发布契约

冻结 npm audio-track 1.1.0 六文件及完整性，manifest/README/声明和起点一致，
发布工厂与源码规范化比较通过。两项可重跑检查通过；音频同步、update 部分配置、
销毁后引用和示例链接差异已分别登记，实际行为与媒体测试由 02 接续。
源码/声明/产物未改，本步不代表音频浏览器或类型验收通过。

HLS 诊断检查点已提交 26b2983d，HLS-SDK-01 仍 doing，两项 Firefox 风险仍 open。
当前 216 项、66 done、1 doing、149 todo。Audio-01 按任务独立本地提交后核实，
继续 Audio-02，避免未归因的 HLS 平台问题阻塞无依赖的其他包。
详见 [契约](baselines/audio-track-contract.md) 和 [记录](changes/2026-09-12-PKG-AUDIO-01-contract.md)。

## HLS 诊断 checkpoint：已缩小范围，尚未关闭风险

独立诊断 runner 已加入直接 Hls、发布核心、候选核心对照，以及 HTTP/route、worker/观察器、
SDK 日志和直接 video 销毁顺序选项。1.5.17 的直接原生 video 对照也收到了 page crashed；
候选核心关闭观察器仍复现，因此不是仅靠替换核心或移除观察器就能解释的问题。
有效诊断重算为 184 passed、6 failed，另十条初期 runner 初始化失败独立排除；
早期遗漏的末尾状态读取失败已纳入失败统计，没有删除原始证据。

见 [诊断记录](baselines/hls-sdk-diagnostics.json) 与 [进行中说明](changes/2026-09-12-PKG-HLS-SDK-01-integration.md)。
本次保存明确标注 checkpoint 的进度提交，PKG-HLS-SDK-01 继续 doing，HLS-CRASH-01/
HLS-PLAYBACK-01 继续 open，完成数仍为 65。完整 CI 537 项通过，最终 main 集成矩阵
38 通过、16 无 MSE 跳过；这些通过结果不覆盖已保留的六次诊断失败。
未修改生产源码、公开 API 或 destroy 顺序。可继续独立生态包迁移，HLS 的调查与发布门槛仍须完成。

## 当前实施：PKG-HLS-SDK-01 桌面 SDK 组合与崩溃取证

从 HLS-05 拆出可独立验证的 worker/分组轨道子任务，父任务仍保留全部设备门槛。
Hls 1.5.17/1.7.2 的实际 worker、切源清理、分组音轨和 detach/reattach 测试已加入。
完整 CI 537 项、254 个生产 TS 文件通过；main/legacy 完整复核各 38 通过、16 WebKit 无 MSE 跳过。
一次 Firefox 在候选核心 + 1.5.17 分组切换后的销毁阶段 Target crashed，尚未归因；
后续 12 项重复与完整复核通过不构成关闭证据。HLS-CRASH-01 保持 open，子任务仍 doing。
带 trace 的 20 项重复另有 1 项旧核心 + Hls 1.7.2 切组后画面未切到 180P，
登记 HLS-PLAYBACK-01；它不是同一种崩溃，完整 trace 已单独保存。

见 [进行中记录](changes/2026-09-12-PKG-HLS-SDK-01-integration.md) 与
[部分证据](baselines/hls-sdk-validation.json)。带浏览器诊断和 trace 的重复另存专用目录；
接续调查崩溃及直接 SDK 对照。当前 216 项、65 done、1 doing、150 todo；HLS-04 已独立提交
2f9bee4e，本子任务尚未完成/提交，没有发布放行。

## 最新完成：PKG-HLS-04 严格 TS 与公开类型

HLS 五个自有模块已迁移严格 TS；公开声明保留旧 object formatter、Parameters 配置提取、
同步 update 及运行时入口，补齐默认字段、SDK 泛型、可选索引和 CJS/ESM/legacy 类型桥。
在线编辑器由公开声明生成全局桥，并在 build:ts 内做双编译器严格语义检查。

完整本地 CI 536 项、254 个生产 TS 文件通过；HLS Node 专项 56 项，三格式累计 83 项通过。
modern/legacy 浏览器各 35 通过、16 跳过，核心+HLS Monaco 六项通过；无失败/重试。
最终产物输入指纹一致。实际 SDK 在 TS 4.3 的两个 DOM 类型缺失诊断有 SDK-only 对照，
不隐藏或称为全 SDK 支持；Windows WebKit 的 MSE/Safari 缺口依然开放。

见 [交付记录](changes/2026-09-12-PKG-HLS-04-types.md)、[冻结证据](baselines/hls-types-validation.json)
和包内 ARCHITECTURE.md。65 done、150 todo；本任务独立本地 commit，核实后进入 PKG-HLS-05。
完整 SDK/组合/安装包、其余生态包、性能/CI/CD/版本/复盘继续执行原计划，没有公开发布。

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
