# CORE-21 公开声明生成与兼容视图

从 ee895a55 接续；CORE-20 已独立提交，开始时工作区干净。下文保留各阶段当时的进展与限制，最终结果见末尾验收章节；阶段快照不替代最终证据。

## 范围和约束

既有 default/named、CJS/ESM/legacy/i18n、TS 4.3.5 和模块扩展入口必须继续有效。类型源码、生成的声明和编辑器文件应有明确来源；内部实现路径及测试文件不能进入 npm 声明依赖。CORE-20 的安装包证据固定旧声明，本任务改变包内容后必须重新验收。

BASE-TYPE-04/05/07/08/09/10 包括同步插件注册、timer 返回、setting 返回、cue 数组、notice、只写命令、template/icons 和 PiP 的历史声明冲突。不能把不相容返回写成交叉类型，不能用运行时包装或增加虚构 getter 迎合错误声明。先保留旧合法消费，再明确准确视图的入口与取舍；本任务完成前不能继续把这些差异推迟而不提供方案。

## 声明生成第一阶段

以 packages/artplayer/public/ 作为公开声明的 TypeScript 源。先等价迁移现有定义及 CJS/ESM/语言桥，保留共享身份和扩展位置，由固定 TypeScript 编译器输出至历史 types/ 路径。public/ 不进入发布包；实际实现仍是 src/。这只是生成与兼容基础，不代表这些旧定义已经准确描述全部运行时。

生成流程必须支持只读检查，禁止以一次自动重写隐藏漂移；错误源、过期产物和意外实现 import 应使检查失败。包构建/打包消费和 CI 接入同一流程；docs 编辑器声明生成需另行核实实际依赖图，不能继续依靠删除 import 后拼接字符串。

未新增依赖或变更版本，使用固定 Node 24.21.0、Yarn 1.22.22、TypeScript 5.9.3，旧消费者继续用 4.3.5。下一步实现生成器，验证原声明消费者，再逐项完成精确类型策略、包内容及编辑器回归。

## 生成基础验证

固定编译器已生成 22 个原路径文件，包含 CJS/ESM 桥及旧语言回退。public/artplayer.ts 使用 ambient class 和 default 标识符导出，维持同一类型身份；CJS 的值、实例别名与 namespace 合并明确保留。编译器会移除普通行注释，生成桥的必要 lint 合并说明由生成器标头提供，不关闭其他文件的规则。

新增 build:types/check:types；CI 只读验证生成状态，ci:build 与隔离 package 构建先生成。严格类型检查及五组旧消费者通过，CI 448 项通过（418 单元、5 工程、25 基线），229 个生产 TS 文件。生成器负例覆盖缺失/过期产物、错误源不覆盖已有文件、内部实现 import 拒绝和不生成 JS。随后追加 public/src/node_modules 包泄漏负例，两个 package-check 测试及对应 lint 通过。未删除或放宽旧消费者断言。

run-GY8u71 初次实际安装包通过 29 项运行时与五组类型，public/ 未进入包；此后 README/ARCHITECTURE.md 更新，所以它仅为生成基础阶段证据，不能代替最终包验收。当前没有改变播放器运行时代码。[阶段证据](../baselines/core-declarations-generation.json) 固定声明源、生成文件、脚本、日志和编译器探针；任务保持开放。

## 访问器约束与下一步

真实编译器探针确认精确 undefined getter/number setter 在 4.3.5 报 TS2380，而 5.9.3 通过；写入扩大为 number|undefined 才能通过 4.3.5，但会改变类型接受范围。详见 [公共类型出口设计](../core-public-types.md) 及其官方语言依据。下一步优先实现并检验映射到同一 JS 产物的可选精确入口，保留全部旧入口及旧编译器支持。

目前未实现精确入口，也未完成六项类型差异与编辑器验收；任务保持 doing，未提交完成 commit。生成流程的成功不能作为类型已准确的证明。

## 精确模块与源码对应检查

public/runtime/ 已新增九个声明源模块：media、player、utils、plugin、template、subtitle、events、component、setting。它们描述实际只写属性、原生/proxy 结果、PiP、可空模板节点、图标 wrapper、同步/异步注册、timer/def 返回、notice、字幕及设置/控件结果。声明总数现为 31；构造器/包 exports 精确入口尚未接入，不能把这些模块当作已经可用的 artplayer/runtime import。

新增 runtime-player/utils/subsystems/events/components 类型夹具直接将真实源码属性或对应最小 Host 的子系统赋给公开接口，没有整实例双重断言。检查全部 Player 属性和 Utils 导出覆盖、默认图标名称、输入对象身份、回调 this、Promise 分支及拒绝错误读取。原生默认播放与 canvas/proxy 的结果分别建模。此阶段将模板 container 写为 HTMLElement 的假设不准确，后续已根据真实 DIV 校验纠正，见下文。

源码 CoreEvents 改为引用生成的精确事件契约，保留旧 Events 的自定义扩展并覆盖已知 builtin 错误。字幕更新数组和 video:error 的 Event、blur 的原事件、seek 的数字/字符串请求值都有正反例。仅模板字面量索引不能满足现有泛型 Host 对具名媒体事件的结构检查，因此显式保留具名原生事件映射；没有改写监听器实现。control/setting 的内部 blur payload 同步为 Event。

def 的首个严格负例发现标准库的 PropertyDescriptor 与 ThisType 组合仍会接受 primitive；精确视图增加 object 约束，仍由真实 Object.defineProperty 实现赋值证明。没有删除这个负例或用 void/交叉返回隐藏问题。

## 新增编译器与阶段验收

新增根 devDependency：typescript-runtime-compat = npm:typescript@5.1.6。它只验证现代精确声明的最低编译器点，不进入任何播放器运行依赖；5.9.3 继续开发/生成，4.3.5 继续旧入口回归。yarn.lock 仅新增该 alias 的五行固定解析与 integrity。首次 add 使用了不必要的 engine/platform/optional 忽略选项，随后已执行正常 frozen install（只跳过生命周期脚本）恢复标准解析，并通过严格工具链检查；这些忽略选项没有进入项目脚本或 CI。

七模块阶段的 CI 448 项、229 个生产 TS 检查、旧入口五组消费者及精确叶层 5.9.3/5.1.6 各四组解析通过。run-SIkzMV 阶段安装包通过 29 项运行时和五组旧类型，证明当前生成链能打包，不能代表完整精确入口。随后新增 component/setting，正在复验包含九模块的新阶段。旧生成基础和七模块报告保留历史快照，不覆盖它们。

下一步组装 runtime 构造器、option 与静态/实例门面，处理旧插件工厂接收者、Plugins/Events 扩展、设置回调与最小内部 Host 的关系。当前模块按 Host 参数检查实际子系统；内部最小 Host 并不等于公开回调真的只收到这些字段。对无法直接由结构赋值证明的旧声明边界，必须用明确的兼容输入方案和实际回调身份/消费者验证，不制造假的实例类型关系。全部六项风险和 CORE-21 仍保持开放。

## 精确构造器与安装包阶段

新增 runtime.ts/cts/mts 门面及 runtime/services、runtime/option，共 36 个声明文件。精确门面覆盖真实实例和静态成员；缺失/虚构成员分别有 keyof 负向覆盖，服务、存储、config、validator 与非回调配置直接赋值对照源码。static env/build 不在新视图中，存储原始 JSON 为 unknown，config 数组保持可变；字幕保留实际继承的 Component 成员并覆盖不同 update 返回。

artplayer/runtime 和 artplayer/runtime/legacy 的 JS 条件出口分别指向现有 modern/legacy 文件，runtime/types 为共享扩展入口。CJS 构造器值/实例/namespace 和 ESM 类型共享定义；旧入口不引入现代访问器语法。新旧插件/事件模块扩展均有正负例，旧 factory 通过明确输入重载接入，内联 add 回调推断完整实例；没有伪造新实例可赋给错误旧返回视图的关系。

浏览器专项纠正了三个初始测试假设：构造工厂运行时 plugins 尚未赋值；controls.add 缺少 position 会抛错；pause 会再显示提示，因此 notice 隐藏状态要在 pause 前取样。前两项同时改进精确声明：PluginFactory 的 PluginHost 将 plugins 标为可选，Controls.add/OptionInput.controls 使用要求 top/left/right 的 ControlInput。加入相应类型负例，旧根声明不收窄，运行时不改。其余 proxy/层/控件/设置构造回调的阶段宿主还需审查，不能宣布整个初始化类型已经精确。

初次入口 run-j7FG9r 为中间快照；当前 run-heewv5 的真实 tarball 通过 34 项运行时、五组旧类型、八组精确类型（5.1.6/5.9.3 各四模式）。旧 4.3.5 消费者继续通过，实际解析全部限制在临时安装目录与编译器标准库内。验证 CJS/ESM/legacy 新旧入口模块、构造器和实例集合身份相同，type-only 入口不能在运行时导入；public 源不泄漏，36 个声明与包内字节对应。

当前 CI 448 项、229 个生产 TS 检查通过；新增 UMD 与 legacy 安装产物专项各在 Chromium/Firefox/WebKit 通过，使用真实媒体 ready 和已发布 chapter 工厂，核对 this/参数、保留 option 工厂身份、同步/异步注册、只写读取、控件/设置/字幕/notice 和不存在的字段。三个运行时产物 SHA 与 CORE-20 一致；历史全量浏览器证据只按相同字节引用，不冒充本轮重新全量运行。[阶段证据](../baselines/runtime-entry-partial.json) 固定当前源、工具、生成声明、包文件、类型结果和浏览器摘要。

build:ts 排除了新增 runtime 根声明，避免把第二份门面拼入历史全局编辑器；该旧字符串拼接器的完整语义与生成流程仍未验收。下一步继续构造回调宿主和编辑器，六项类型风险与任务保持 doing；本轮没有完成任务 commit，也没有 push/publish/tag/merge。

## 构造阶段回调与编辑器生成

新增 public/runtime/construction.ts，声明总数 37。proxy 仅暴露已初始化的基础字段和 Emitter，不暴露尚不可用的 template/video/query/proxy getter。layers、controls、contextmenu 的构造输入回调按当时赋值顺序标记未来子系统可选；PluginHost 的 plugins 可选。直接组合 Player 而非对其做 Omit/Pick，避免映射类型丢失独立读写访问器。runtime-construction.ts 在工作区和真实安装消费者中检查这些边界及 seek 写入。

读取 urlMix 和 setting 调度实现后确认，customType 在 await wait 后执行，setting mounted 经过定时调度，二者接收完整实例。浏览器同时检查冻结发布包和候选的阶段字段及接收者身份。模板明确只接受 DIV，故修正精确 OptionInput/container 与 template.$container 的 HTMLElement 假设；非法 section 和配置 proxy 返回 undefined 均有反例。旧类型入口接受范围和运行时构造顺序保持。

核心 build:ts 不再剥离 import 后拼接声明。新增 scripts/editor-types.mjs 与 tsconfig.editor.json，以 dts-bundle-generator 9.5.1 读取旧 public/artplayer.ts 依赖图，再由 TypeScript AST 生成私有 ArtplayerDefinitions 命名空间及 Artplayer 构造器/实例/命名别名。直接打包 CJS 桥的早期探针产生自引用别名，因此未采用该输出；独立语义检查拒绝别名损坏、外部依赖、私有全局泄漏及错误泛型。TS 4.3.5 和 5.9.3 都检查，不使用 skipLibCheck。原插件编辑器输出未改变，SITE-02 仍负责全站/插件生成器改造。

新增根 devDependency dts-bundle-generator@9.5.1。它的 TypeScript 范围首次解析到 7.0.2；随即增加 dts-bundle-generator/typescript=5.9.3 的 Yarn resolution，正常安装去掉该临时图，生成器同时核对实际编译器身份。最终 frozen install --ignore-scripts --non-interactive 和严格工具链通过：Node 24.21.0、Yarn 1.22.22、22 workspaces、23 pinned tools、1343 dependency selectors。依赖不进入播放器运行包，编译器点继续为旧 4.3.5、精确最低 5.1.6、生成/当前 5.9.3。

新增 editor-types 工程用例：生成输出漂移检查、独立编译、损坏声明必须报错。新增真实 Monaco worker 用例：加载 vendored editor、编译生成声明和有效/无效代码、执行编译后的播放器并等待真实媒体 ready。构造/返回/Monaco 共 18 项三浏览器专项已通过，其阶段报告使用此前安装的运行时产物，不作为最新包内容的最终证据。

最新 runtime-public.ts 的安装消费者进一步检查 PiP 的 Element|null|boolean 读取与 boolean 写入、图标元素/可空节点、setting 对象身份/void、字幕 style 元素、def 目标身份、debounce/throttle 的 void 返回；正反例均在 5.1.6/5.9.3 各四模式运行。完整 CI 已通过 449 项（418 单元、6 工程、25 基线），229 个生产 TS 文件，37 个生成声明无漂移。最终包与全量浏览器验收继续执行。

## 最终验收与交接

CORE-21 完成。公开接口按实际职责拆为历史兼容源、精确媒体/播放器/组件/服务模块、构造阶段宿主和 CJS/ESM 桥；内部实现保持独立，不泄漏至 npm 声明图。新增运行时入口共享既有 JS 构造器；旧入口、TS 4.3.5、语言及旧插件接受范围保留。包内 ARCHITECTURE.md 与类型维护文档已同步实际实现，旧段落中的待 CORE-21 表述已清理。

| 验收项 | 已取得证据 |
| --- | --- |
| 严格检查 | CI 449 项，229 个生产 TS 文件，37 个生成声明无漂移；新增类型/浏览器夹具另行显式 lint 通过 |
| 安装消费 | 最终 run-LYDR8W：34 项运行时、五组旧类型、八组精确类型，零诊断；public/src/node_modules 不泄漏 |
| 浏览器 | UMD 1521 项、legacy 1521 项；各含 18 项构造/返回/编辑器检查，无失败、重试或跳过 |
| 实际环境 | Windows Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6；使用真实媒体与已安装包 |
| 产物对应 | 三个核心 JS 与 CORE-20 字节一致；最后打包仅更新 ARCHITECTURE.md、types/README.md、types/COMPATIBILITY.md，JS/类型与浏览器使用的 run-y0PLWJ 完全一致 |
| 编辑器 | TS 4.3.5/5.9.3 独立语义、生成漂移负例、真实 Monaco worker 编译并运行类型示例；vendored 资源指纹保留 |
| 依赖复现 | Yarn frozen 安装、严格工具链、开发 bundler 的 TypeScript resolution 与实际加载身份检查通过 |

[最终验收证据](../baselines/core-declarations-validation.json) 保存全部源/声明/工具指纹、完整包文件、类型解析图、每个浏览器用例与报告指纹，以及文档重打包的差异。此前生成基础和 36 文件阶段 JSON 保持历史原样。

关闭 BASE-TYPE-04/05/07/08/09/10：实际类型使用可选 runtime 入口，历史入口保留既有接受范围；没有引入虚假交叉返回、运行时 Promise 包装或不存在的 getter。浏览器受控能力测试不等于物理 Apple/AirPlay/触摸/IME 认证，BASE-ENV-01 与 REL-03/REVIEW-02 门槛继续保留。全站及插件编辑器现代化由 SITE-02 负责，其余生态包、CORE-23 和 CORE-22 尚未完成。

本任务独立本地提交，包含实现、测试、文档、风险和任务状态；无 push/publish/tag/merge。回退时以 CORE-20 的 ee895a55 为父状态，对本任务 commit 做整体 revert，避免只回退生成声明而留下 manifest/编辑器/消费脚本不一致。下一步 CORE-23 键盘、焦点和可访问名称，随后 CORE-22 核心完整验收。
