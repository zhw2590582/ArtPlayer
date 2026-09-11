# CORE-21 公共类型出口设计

本页记录 CORE-21 的类型出口方案及验证过程。生成声明、安装消费和核心编辑器已验收；尚未发布 npm。最终结果见 [验收证据](baselines/core-declarations-validation.json)。

## 已验证的约束

根入口历史声明必须继续接受 test/types/declaration-legacy.ts 的旧消费者，包括已知不准确的 Promise/void、setting 返回及只写属性读取。替换这些返回会破坏已有 TS 代码；在原签名上增加一个虚假的交叉类型也不能解决实际值不同的问题。

固定编译器探针进一步确认：同一个属性声明为 `get seek(): undefined`、`set seek(value: number)`，TS 5.9.3 通过，4.3.5 报 TS2380。把 setter 扩成 `number | undefined` 虽可通过旧编译器，却额外允许并非原声明接受的写入；不能为了让编译器通过而机械扩宽所有命令输入。探针见本任务阶段证据。

[TypeScript 5.1 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html) 明确从该版本起允许显式注解的读写访问器使用不相关类型。这个语言限制与 ArtPlayer 的 JS 行为无关，不应通过制造运行时 getter 来处理。

## 已实施方案与验证要求

保留现有 `artplayer`、`artplayer/legacy`、`artplayer/types` 与语言入口的历史类型接受范围和 TS 4.3.5 验证。可选择的精确声明入口 `artplayer/runtime` 映射到同一已有 JS 构造器产物：它只改变所选类型视图，不创建第二个播放器、包装实例或重跑全局初始化。独立读写访问器需要 TS 5.1 语言特性，实际最低验证点为 5.1.6，当前编译器为 5.9.3。

旧入口不能引用新的现代声明，否则旧编译器仍会被迫解析它。也不能在旧根入口导出一个间接引用现代声明的类型别名。新入口与旧入口的构造器及实例运行时身份需要安装包内的 CJS/ESM/legacy 对照证明；用户继续使用旧 import 时无需改动。

精确公开声明仍从 public/ 的 TypeScript 源生成，不能直接发布 src/ 的整个内部图。通过源类型夹具逐项检查实际实现和公开视图的对应关系，尤其注意 getter/setter、可空节点、media-like proxy、插件工厂 this 和返回、事件泛型及链式 this；不能用整个实例双重断言当对应证明。

本任务逐项实现并留证的边界：

- 插件注册同步/Promise 分支与旧插件工厂接收者：保持原注册身份，验证旧插件可接入及新内联回调有正确上下文推断。
- toggle、timer、def、setting/subtitle/notice：分别提供实际结果，旧入口的历史错误仍明确记录，不假装已变成正确返回。
- seek/forward/backward/switch/quality：精确入口读为 undefined，写入仍按对应运行时参数建模；拒绝仅为满足旧 TS 关系而扩宽。
- template/icons、PiP、fullscreen、URL、option 与 static：区分真实能力、可空结果、可变配置和不存在的旧声明字段，不把初始化时的默认形状当永远成立。
- 新入口的 Events/Plugins 扩展要到达正确共享定义；旧 `artplayer/types` 的扩展能力继续回归。
- 新声明、旧声明、文档编辑器与 npm 路径保持明确依赖关系。SITE-02 负责整个编辑器/示例生成器现代化，但本任务引入的声明布局不能破坏当前 build:ts 或编辑器消费。

旧插件输入重载、新旧扩展关系、真实返回和安装入口身份已分别验证。六项类型风险按最终证据关闭；旧入口历史错误接受范围是明确的兼容保留，不宣称旧声明因此变得准确。

## 构造器入口阶段记录（36 文件快照）

public/runtime.ts 组合 11 个精确叶模块，生成总数为 36 个声明文件。新增 artplayer/runtime 与 artplayer/runtime/legacy 的条件类型出口，分别重用已有 modern 与 legacy JS；artplayer/runtime/types 为共享扩展入口。CJS 桥使用 export =，ESM 桥共享类型定义，不新增运行时导出。

首轮真实 tarball run-j7FG9r 通过 34 项运行时、五组旧类型、八组精确类型检查（5.1.6/5.9.3 各四模式），包括 require/import/legacy 模块对象和构造器身份相同。后续新增 PluginHost、ControlInput，最终证据需重新生成，不能把初次 tarball 当当前声明验收。旧工厂有显式接收重载；旧 Plugins 已声明结果和 Events 自定义载荷传递至新共享接口，内联 add 回调保持精确推断。

浏览器专项先暴露测试错误假设：构造插件工厂运行时 art.plugins 尚未赋值；新 PluginFactory 改用 plugins 可选的 PluginHost，并加入负例。add 的内联工厂仍接收完整 Artplayer。控件 add 的 position 在运行时必填，ControlInput 现要求 top/left/right；更新已有条目仍可沿用原位置。另一个测试顺序问题是 pause 会更新 notice，验证隐藏状态必须在 pause 前取值，不能把后续提示当 getter 错误。

下一步继续审查 proxy、层、控件和设置在构造期间执行的回调宿主，区分当时已赋值的子系统；完成编辑器生成/语义消费与最终浏览器复验后才考虑关闭风险。build:ts 已避免把新 runtime 根声明拼入旧编辑器，但现有字符串拼接器和编辑器完整语义仍未验收。

## 构造阶段与编辑器实现（当前 37 文件）

新增 runtime/construction.ts，按实际构造顺序描述 ProxyHost、LayerHost、ControlHost、ContextmenuHost 和 PluginHost。proxy 执行时 template 尚未赋值，不能暴露依赖 template/events 的 getter；组件 mounted 执行时未来子系统可选；构造插件执行时 plugins 可选。公开实例的身份不变，类型描述当时可用的字段。Player 必须直接继承，不能经过 Omit/Pick 映射后丢失独立 getter/setter 写入类型。

customType 在 url setter 的 await wait 后执行，setting mounted 也经过延迟调度，二者收到完整宿主；不能误认为它们在构造中同步运行。真实发布包与候选的浏览器快照分别核对字段可用性和接收者身份。容器运行时明确验证 DIV，精确输入和 template.$container 改为 HTMLDivElement；旧入口保持原接受范围。此前阶段记录中的 HTMLElement 假设已由源码及浏览器反例纠正。

核心编辑器生成改用 dts-bundle-generator 9.5.1 解析旧 public/artplayer.ts 依赖图，并用 TypeScript AST 构造私有定义命名空间和 Artplayer 全局/UMD 别名。拒绝未解析 import/export、重复/未知声明；生成结果同时经过 TS 4.3.5/5.9.3 的独立语义消费，不能解析回工作区。负例验证错误别名确实报错，私有定义不泄漏全局，泛型/构造器及命名类型仍有效。生成漂移纳入 test:node。

新增依赖只属于根开发工具；Yarn resolution 将 bundler 的 TypeScript 固定为已有 5.9.3，生成器核实实际加载同一编译器。固定工具链与正常 frozen install 已通过。docs Monaco 的真实 worker 编译生成声明、报告非法输入，再执行编译后的播放器示例并等待真实媒体 ready。插件编辑器生成仍保留原流程，整体 SITE-02 改造另行验收。

构造/精确返回与 Monaco 专项共 18 项三浏览器通过，并纳入最终 UMD/legacy 各 1521 项全量回归。CI 449 项、229 个生产 TS 文件、37 个声明生成检查通过；最终 run-LYDR8W 的 34 项运行时、五组旧类型、八组精确类型全部通过。浏览器使用 run-y0PLWJ 的安装字节，最后一次重打包仅修改三个 Markdown 文档；全量文件对照证明 JS/类型完全一致，两个包及声明源/脚本/Monaco 指纹均保存在最终证据中。
