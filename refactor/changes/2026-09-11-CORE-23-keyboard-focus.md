# CORE-23 键盘、焦点与可访问名称

从 faaa3e8c 接续，开始时工作区干净。任务 doing，覆盖主要控件、设置树/范围输入、选择列表、模式退出及字幕可用性；本页随实现补充证据，不代表全任务已完成。

## 已核实的问题与边界

BASE-DOM-01 已记录主要控件没有 Tab 入口。进一步源码审查发现：播放/音量由两个互斥显示的图标处理点击，直接让图标可聚焦会在切换时隐藏焦点；控件自动隐藏仅检查鼠标/播放/输入状态；设置按钮/树和质量 selector 依赖点击及 hover，未实现键盘操作。已有 tooltip 提供 aria-label，应复用当前语言文本。

保留现有 DOM 节点和类名、指针点击事件及公开回调形状。新增内部按键归属记录，避免键盘激活同时触发全局 Space 快捷键；不把所有 defaultPrevented 事件一概排除，以免改变旧自定义热键行为。内部监听器随条目/实例 scope 释放，更新/移除/销毁后不得继续响应。

实现依据：[WAI Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)、[Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)、[Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)。采用 Enter/Space 激活、可见焦点及范围键盘语义；角色和属性必须与真实交互一起验证。这些模式不等于整个产品已通过屏幕阅读器或 WCAG 认证。

## 分步实施与验收

1. 固定实际 Tab 缺口，建立可清理的按钮按键处理，接入稳定的主控件节点与已有点击路径。
2. 补齐进度/音量范围操作、选择列表与设置树的进入/返回/关闭和焦点恢复；保护输入和已有快捷键。
3. 检查全屏/mini 等模式退出、动态更新/移除、跨实例、SSR、名称变化及字幕可用性。
4. 严格类型、风险用例、安装包及三浏览器完整回归；更新架构、风险、任务状态后独立提交。

CORE-23 已完成。按钮、滑块、选择列表、设置树、动态控件、mini、信息面板、锁定层和默认菜单均已实现并取得阶段证据；模式退出、SSR/字幕及设置入口失效的补充检查通过，新安装包现代/legacy 全量验收通过，BASE-DOM-01 已关闭。下列各阶段记录保留当时的状态与证据，最终结论见末尾验收表。

## 按钮与焦点第一阶段

新增 accessibility/button、keyboard、focus 三个 TS 模块。按键标记保留原事件身份，Enter 按下/Space 松开复用旧 click 路径，阻止重复按键、失焦或销毁后的晚到操作；旧 Hotkey 的普通 keydown 观察和无关 defaultPrevented 策略保留。原生 button/summary/ARIA button/switch 的激活键及链接 Enter 不被播放器劫持，KeyK 等其他自定义快捷键仍工作。

已接入主要按钮和自定义 option.click 控件。播放使用稳定 wrapper；音量保留原图标/面板层级，在互斥图标切换时只移交原有焦点；设置按钮增加 aria-expanded。原有 tooltip/i18n 提供名称，没有新增英文专用翻译键。键盘焦点更新已有 isFocus/isInput，不增加指针 focus/blur 公开事件次数。新增焦点样式和 art-keyboard-focus 类。

首次真实 Chromium 运行固定 Tab 缺口：发布基线通过“控件被跳过”的已知行为断言，修改前候选在目标可达断言失败。首轮三浏览器有三个 Firefox 用例失败，精确探针确认原生 video 本身先接受 Tab；修正测试保留该原生入口，再验证控制按钮，未删除或跳过失败测试。随后新增鼠标用例复现本轮最初 :focus-within/任意焦点策略会让控制栏常驻；改为独立输入方式与资源归属，保留鼠标自动隐藏。该回归及修正证据保留在阶段记录中。

当前 accessibility/hotkey 三浏览器共 69 项通过（含 18 项按钮/焦点/指针用例），25 项按钮/焦点/Hotkey/组件资源单元通过。最终本阶段 CI 456 项（425 单元、6 工程、25 基线）、232 个生产 TS 文件严格检查通过。[阶段证据](../baselines/keyboard-buttons-partial.json) 保存当前源/用例指纹、三组失败复现和最终通过结果。核心源已有改动，当前浏览器使用 Vite 源码构建，不能作为最新 npm/legacy 安装产物的验收；完整包构建和全量矩阵留最终任务收尾。

下一步继续进度/音量 slider、selector、设置树与 Escape/焦点恢复、动态更新/跨实例/SSR/字幕检查。CORE-23 和 BASE-DOM-01 仍开放，未创建任务完成 commit；上一完成任务仍为 faaa3e8c。无新依赖、版本调整、push/publish/tag/merge。

## 进度与音量滑块阶段

新增 accessibility/slider.ts 与 control/progress/keyboard.ts，分别负责通用范围键盘/ARIA 状态和播放器进度绑定。原 progress/interactions.ts 保持鼠标职责。方向键使用 SEEK_STEP 或 VOLUME_STEP；PageUp/PageDown 使用十倍步长，Home/End 到达端点，重复按键可连续调整。无有效时长/范围时禁用操作并认领按键，避免回落到播放器全局快捷键；ARIA 数值随实际媒体时间、时长、音量更新。

进度按键保持 setBar 在 seek 之前，第三个指针事件参数省略，不把 KeyboardEvent 混入旧 MouseEvent/TouchEvent 类型。回调切源、移除、销毁或触发更新的嵌套按键后，旧 seek 不得继续。音量键先取消静音再设置音量，muted 回调销毁或触发新操作会取消旧写入。音量范围位于原图标按钮之外，键盘聚焦静音图标时展开面板，Tab 继续进入滑块；鼠标拖动和原图标节点保留。

增加 Progress 可访问名称及十二个已有语言字典的翻译。public/i18n.ts 使用可选 Progress 字段，保持完整旧字典可赋值；通过 build:types/build:ts 同步生成包声明与 Monaco 声明，未手工修改生成文件。无新增依赖。

验证与实际修正：

- 新增七项单元用例，与原进度拖动测试合计 17 项通过：步长/重复/上下限、无效范围、修饰键/IME、scope 清理、事件顺序、切源与嵌套取消。
- 初次 Chromium 浏览器 9 通过、1 失败，复现 transition: all 将新 visibility 状态一起过渡，快速 Tab 跳过音量滑块。限制过渡为 opacity/transform 后，原用例通过，未通过等待或跳过来隐藏该问题。
- 首次三浏览器 122 通过、1 失败，WebKit 在请求 1 秒时实际落点约 1.003 秒；测试改为验证实际时间的步长和 ARIA 同步，并保留请求值/事件顺序的精确检查。
- 首次完整 CI 检出 Monaco 声明遗漏新翻译键；build:ts 生成修复后完整 CI 463 项通过（432 单元、6 工程、25 基线），234 个生产 TS 文件严格检查通过。此处计数包括核心与 chapter。
- 最终 accessibility、hotkey、progress-quality 三浏览器 123 项全部通过，无失败、重试或跳过；其中滑块专项 12 项。实际版本 Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6。

[滑块阶段证据](../baselines/keyboard-sliders-partial.json) 保存源文件、声明、用例、日志及报告指纹、浏览器构建来源、失败复现与最终结果。此前按钮阶段快照保持原样。本阶段浏览器仍为 Vite 源码构建，最新安装包/legacy 全量验收尚未执行。

下一步处理 selector 与设置树的键盘进入、选择、返回/Escape，以及动态焦点恢复、模式退出、跨实例/SSR/字幕检查。CORE-23 仍 doing，BASE-DOM-01 保持开放，总体 57 done、1 doing、156 todo；完成整个任务后再独立 commit。

## 选择列表阶段

control/selector-keyboard.ts 独立管理打开/关闭、焦点与键盘导航，旧 selector.ts 继续负责条目绑定、check 和异步 onSelect 结果归属。Tab 可到达当前值，Enter/Space/上下键打开并聚焦当前项；方向键、Home/End 和连续字符前缀仅移动焦点，不提前切换清晰度。Enter/Space 通过原 item.click 提交，保持回调 this、item/node 身份、click 参数及已有 generation/trackSelection 检查。Escape 关闭并返回当前值，Tab 离开不提交；关闭后再次 Escape 交回播放器。

普通列表采用 listbox/option 和 aria-selected，参考 [WAI Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)。含原生交互 HTML 的选项采用 group，保留按钮/输入框语义与编辑按键；group 不声明不匹配的 aria-haspopup。原生按钮作为当前值时直接承担展开入口，外层不新增嵌套 button 角色。check/异步 HTML 返回会刷新该绑定，仅在替换已聚焦的当前值子节点导致焦点回到 body 时恢复新入口；回调主动移交外部焦点时不抢回。调用方自定义交互内容仍需自行提供其可访问名称。

列表的可见性过渡只涉及 opacity/transform，避免重现滑块阶段的快速 Tab 问题。hover 与键盘打开状态分别维护，Escape 可在鼠标仍悬停时关闭列表。disabled 空列表不会报告 expanded=true。原来的 DOM 类名、selector getter 描述符、鼠标 click 路径和异步失效检查保留；无新增依赖或公开类型字段。

新增十项浏览器场景，覆盖实际 Tab/Enter/Space、typeahead、Escape 与 web fullscreen 的先后归属、空列表、鼠标 hover、异步竞态/移除、回调移交焦点及原生按钮/输入框。截图检查确认当前项高亮与独立焦点框同时可见。补充用例先在 Chromium 复现“关闭后的第二次 Escape 仍被吞掉”和“空列表悬停报告展开”两个失败，再统一用实际 expanded 条件修复；失败与最终验证均保留在阶段证据中。

最终 CI 463 项通过（432 单元、6 工程、25 基线），235 个生产 TS 文件严格检查通过；accessibility/hotkey/progress-quality/components 匹配到的三浏览器回归共 282 项通过（包括 prompt-components），无失败、重试或跳过，其中选择列表专项 30 项。[选择列表阶段证据](../baselines/keyboard-selectors-partial.json) 保存当前源文件/用例、完整 CI、浏览器构建来源、三引擎截图指纹和修复前两个失败。浏览器仍使用 Vite 源码构建，尚非新安装包/legacy 全量验收。

下一步是设置树、模式退出、动态控件移除/替换焦点恢复，以及跨实例/SSR/字幕检查。任务与发布门槛保持开放：CORE-23 doing，BASE-DOM-01 open；57 done、1 doing、156 todo，完成全部任务验收后再独立 commit。无 push/publish/tag/merge。

## 设置面板、DOM 移动焦点与原生跳转校正阶段

设置模块新增 keyboard.ts、keyboard-item.ts、keyboard-focus.ts，分别负责面板导航和关闭、条目按键/语义、可见焦点目标及恢复。设置按钮 Enter/Space/ArrowDown 进入当前项，ArrowUp 直接进入最后一项；方向键/Home/End 在可操作项间移动，Right 进入子面板，Left/返回行回到原项，Escape 关闭并返回设置按钮。Tab 离开后关闭，不把原生 input 的编辑键交给播放器。原生按钮保留浏览器 click 路径，不新增嵌套按钮角色；开关同步 aria-checked，选择项同步 aria-current，范围输入使用条目文字作为名称。

面板与条目监听器遵循已有 scope 暂停/恢复/释放。更新成功、失败回滚及移除后，仅在原焦点因替换或隐藏丢失时恢复可见目标；回调已移交外部焦点则保留外部焦点。focusout 使用可释放的零延迟任务读取浏览器完成 Tab 后的实际焦点：首次微任务版本会在焦点暂处 body 时误关闭，已由真实用例复现修正。暂停中的条目既不能激活，也不能让方向键落入全局 seek。

accessibility/moved-focus.ts 保存 DOM 移动前实际聚焦节点。网页全屏进入/退出和失败恢复后，只有该节点仍连接且移动导致焦点落到 body 才恢复；销毁清理不聚焦，恢复时回调销毁会阻止后续 fullscreenWeb/resize 通知。真实用例先复现 FULLSCREEN_WEB_IN_BODY 丢失设置按钮焦点，再验证恢复和销毁边界。新增 Back、Settings 的十二语言翻译，公开字段可选，包和 Monaco 声明均用生成脚本同步。无新增依赖。

扩大回归时复现 WebKit 的原生跳转竞态：End 后立即 PageDown 已正确发出 seek(3)，焦点未丢失，但结束事件随后将实际时间写回约 8 秒。重复五次探针中四次失败，不能归为帧级舍入。进度键盘复用 source/restore-position.ts 的一次有限校正；初次仍经过原 seek setter，校正使用 currentTime，不重复公开 seek 事件。操作 scope 同时归控件与 source 管理；新键盘操作、公开 currentTime 写入、切源、移除或销毁会取消旧校正。新增单元检查一次上限、事件顺序、手动覆盖及监听器释放；修正后五次 WebKit 探针全部通过。

验证记录：

- 完整 CI 468 项（437 单元、6 工程、25 基线）和 239 个生产 TS 严格检查通过。严格检查期间修正 cleanup 的 undefined 返回约定和 proxy 媒体宿主的内部结构类型，没有放宽到 any。
- 扩大 accessibility/setting/display-web/hotkey/progress-quality/source 三浏览器回归 477 项通过。该运行在上述内部类型修正前启动；之后对最终源码重跑设置、滑块、切源专项 57 项，全部通过。分别保存构建指纹，不能把两次当作同一构建的全量通过。
- 最终专项中途出现 56 通过、1 失败：旧测试 once(setBar) 会被媒体加载的 loaded/零进度更新提前消费，控件提前移除后按键实际走全局 Hotkey。测试改为匹配本次非零 played 更新后再移除，仍精确验证取消 seek；未添加等待、重试或跳过。修改后的两个浏览器文件额外 lint 通过。
- 七项设置场景跨三引擎共 21 项通过，覆盖真实 Enter/Space/Tab、树导航、switch/range、更新回滚、暂停和原生按钮。截图目标改为全屏移动后的实际 .art-video-player，避免只截到旧容器的局部视频。

[设置阶段证据](../baselines/keyboard-settings-partial.json) 保存失败报告、源文件/类型/测试指纹、CI、两轮浏览器构建及截图。此前三个阶段快照不改写。当前均为 Vite 源码构建；新安装包/legacy 全量验收、剩余动态控件焦点/模式退出/跨实例/SSR/字幕检查及最终提交仍未完成。CORE-23 doing，57 done、1 doing、156 todo；无版本调整、push/publish/tag/merge。

## 动态控件替换与移除焦点阶段

修改前在真实 Chromium 固定六个场景，其中五项失败：聚焦控件更新、移除、失败替换、聚焦 selector 子项替换及最后控件移除均会失去焦点；回调主动聚焦外部的既有场景通过。新增 component/focus.ts，Component.remove/update 在 finally 中结束焦点操作，仅对 control 生效；同一 update 的内部 remove 不先把焦点移到相邻项，保持单次最终恢复和旧 add/update 返回约定。

优先聚焦同名替换条目的可用节点，否则按原 DOM 顺序选择后续或前一个仍存活的控件。原生按钮作为实际目标，隐藏/禁用字段集/aria-disabled/inert 内容不能承担恢复目标。beforeUnmount 拒绝移除时原节点仍聚焦；mounted 失败清理后恢复相邻控件。回调主动聚焦外部，或正在操作其他实例时不移交焦点；焦点恢复中的回调销毁播放器后，保留节点也不得再触发旧 click。

没有可用控件时使用 accessibility/player-focus.ts 聚焦仍连接的播放器。首版立即移除临时 tabindex 的实测会让 Chromium 再次失焦；现在保留自建 tabindex=-1 至实例清理，不增加顺序 Tab 停留点，既有调用方 tabindex 保留。该失败及修正记录保存在独立报告中。

最终增加到九项动态控件场景，包括原生替换按钮、禁用字段集、跨实例隔离及恢复时销毁，三引擎共 27 项通过。完整 CI 468 项通过（437 单元、6 工程、25 基线），241 个生产 TS 文件严格检查；accessibility/components/setting/hotkey/progress-quality 组合三浏览器 507 项通过，无失败、重试或跳过。12 项原组件资源和焦点单元专项也通过，未添加只镜像实现的模拟 DOM 测试。

[动态控件阶段证据](../baselines/keyboard-control-focus-partial.json) 保存两组先失败的报告、最终源/用例指纹、CI 和完整组合回归。架构说明同步至 packages/artplayer/ARCHITECTURE.md；此前阶段快照不改写。本阶段无新增依赖、公开类型或版本调整。

源码检查显示 mini-view.ts 的关闭与播放图标、info/poll.ts 的关闭图标及 plugins/lock.ts 的层按钮仍主要依赖点击，后续需先固定真实键盘缺口，再补模式内操作和退出焦点。跨实例动态控件已验证，但不能代表整个播放器的跨实例可用性已验收。SSR/字幕及安装包/legacy 全量检查继续保留；CORE-23 doing、BASE-DOM-01 open，57 done、1 doing、156 todo，无任务完成 commit，无 push/publish/tag/merge。

## mini 播放器键盘与退出焦点阶段

修改前四项真实 Chromium 场景全部失败。自建 mini-view 的既有关闭节点和稳定播放 wrapper 现使用 keyboardButton，Enter/Space 通过原关闭或当前可见播放/暂停图标的 click 路径执行。播放状态变化保留 wrapper 焦点并更新名称；弹窗内 Escape 仅在 mini 活跃时认领。focus-within 显示原 hover 按钮，focus-visible 提供白色焦点框。使用 Close、Mini Player、Play、Pause 既有翻译键，无新增公开类型或字典字段。

新增 display/mini-focus.ts 管理会话来源：键盘从播放器进入时聚焦关闭按钮；指针/程序打开不会抢走外部焦点。关闭仅在焦点仍属于弹窗时恢复原入口，入口已删除、隐藏、禁用或 inert 时聚焦播放器；新会话清除陈旧来源。mini 原有 revision/closing 检查围绕焦点回调，恢复焦点时销毁或再次切换会取消旧 mini 通知。销毁清理不尝试恢复焦点。

保留首次/复用 DOM 顺序、拖动、播放器视频节点移动/恢复和失败重试。调用方提供的自有 mini 容器不追加本轮自建按钮绑定、角色或样式，其交互继续由调用方管理；退出 API 可恢复其当前弹窗焦点。新 UI 资源随已有 mini scope 释放。

最终六场景跨三引擎共 18 项通过，覆盖实际 Tab/Enter/Space/Escape、真实播放/暂停、指针打开、重复会话、外部/隐藏/删除来源、国际化、隐藏后的晚到按键，以及焦点回调销毁后的节点点击。此前 Chromium 组合 24 项通过；最终 accessibility/display-mini/display-web/hotkey 三浏览器组合 300 项全部通过，无失败、重试或跳过。完整 CI 468 项、242 个生产 TS 严格检查通过。

[mini 阶段证据](../baselines/keyboard-mini-partial.json) 保存修改前失败、最终源和测试指纹、CI、三引擎版本及构建来源；截图保存在本地缓存并检查焦点框和按钮可见性。包内架构文档已同步。当前仍为 Vite 源码构建；信息面板/锁定层、其他模式退出、跨实例/SSR/字幕和安装包/legacy 最终验收仍待完成。CORE-23 doing，57 done、1 doing、156 todo，无新依赖、版本调整、任务完成 commit 或 push/publish/tag/merge。

## 信息面板与锁定层阶段

信息面板新增 info/keyboard.ts，监听器随原 poll scope 初始化、替换和释放，保留 Info 自有字段、原型方法、轮询次数及 close click 路径。键盘打开聚焦关闭按钮，Enter/Space/Escape 关闭并返回当前会话的播放器入口，原入口不再可用时聚焦播放器。程序/指针操作保留外部焦点；重复 init 不丢失返回目标。名称复用 Close、Video Info。失败名称初始化释放新监听器和轮询，原错误仍可捕获并重试。

严格类型检查发现 $info 在历史模板边界中可空，不能为了通过检查直接断言为必需。保留这个 SSR 约定：缺少外层时跳过依赖该节点的键盘逻辑，轮询和原关闭事件保持；旧发布版和候选版都通过真实 SSR 节点保留与关闭用例。节点存在时才加 group 名称和按键行为。Node 单元宿主补齐实际新增的 EventTarget/属性契约，原轮询和错误用例仍完整执行。

锁定层新增 plugins/lock-keyboard.ts，使用原层节点作为稳定 toggle button，aria-pressed 跟随 lock 通知，Enter/Space 复用原 click，Escape 仅在锁定状态解锁。accessibility/suspend-focus.ts 在锁定期间为控制栏设置自有 inert/aria-hidden 并保存 tabindex，MutationObserver 处理新增与移出节点；解锁、移除或销毁恢复自有值，已被调用方改成不同值的属性不覆盖。实际移除原生 inert 后仍能通过 Tab 回退用例，原有 inert/aria-hidden 和正 tabindex 也能恢复。

键盘焦点样式不再覆盖锁定控制栏原来的隐藏位移；锁定按钮在控制栏隐藏时保留 Tab 可达性，仍按原逻辑视觉隐藏，聚焦后显示。新增可选 Lock 字典类型和十二语言翻译，通过 build:types/build:ts 生成包及 Monaco 声明，旧完整字典不被新增必需字段拒绝。无新依赖。

另外固定了已锁定状态重挂载层的旧缺陷：原 mounted 总把锁定图标隐藏，与实际 state 不符；现在按 getState 初始化图标，保留通常未锁定初始化的样式写入。重挂载恢复新的焦点 scope，Space 解锁仍仅发一次事件。

验证与纠正：

- 信息面板修改前四项 Chromium 场景中三项失败、程序/指针焦点场景通过；锁定层修改前三项全部失败。实现后首批信息面板/提示组件 Chromium 19 项和相关 Node 17 项通过。
- 首轮锁定组合有一项测试错误假设外部 Outside 按钮紧随播放器，真实测试页先有 Play/Pause；依据实际 Tab 结果改为验证 Play，再 Shift+Tab 返回锁定按钮。未增加等待或跳过。
- 重挂载先复现图标 display:none，修正后浏览器把 flex 子项的 inline-flex 计算为 flex，导致三个引擎的计算样式断言失败。测试改为实际可见性与 inline display 值分别检查，仍保留解锁次数及属性清理断言。失败和修正报告都保留。
- 最终完整 CI 468 项通过（437 单元、6 工程、25 基线），245 个生产 TS 文件严格检查；最后仅上述浏览器样式断言调整，额外 lint 通过。最终 accessibility/builtin-layers/prompt-components/hotkey 三浏览器组合 306 项全部通过，无失败、重试或跳过；信息面板共 21 项（含旧/新 SSR 对照），锁定层共 18 项。新专项没有未处理浏览器错误或 console error。

[信息面板与锁定层证据](../baselines/keyboard-info-lock-partial.json) 固定源文件、单元宿主、公开/编辑器声明、用例、CI、构建指纹及各次失败。移动条件使用 UA 选择加真实键盘测试，不能当作物理 Android/iOS 或屏幕阅读器验收。默认菜单入口、其他模式退出、跨实例/SSR/字幕和新安装包/legacy 完整矩阵继续交本任务剩余工作。CORE-23 doing、BASE-DOM-01 open，57 done、1 doing、156 todo，无任务完成 commit、版本调整或 push/publish/tag/merge。

## 默认菜单键盘与跨面板焦点阶段

修改前六项 Chromium 场景中四项失败。新增 contextmenu/keyboard.ts 管理 Shift+F10/ContextMenu、方向键/Home/End、文字导航、Escape/Tab 退出与焦点恢复；contextmenu/position.ts 原样提取鼠标定位计算，键盘使用当前元素边界作为入口坐标。容器用具名 group，动作项为 button，选择行保留 data-value span 并逐个增加按钮语义、aria-pressed；contextmenu/choices.ts 同步既有 art-current 状态。版本原生链接、自定义 button/input 保持原生角色与编辑/激活路径。

菜单 init 在成功添加条目后替换根 scope，重复添加失败不拆掉既有监听器。Component 焦点恢复从 control 扩展到 contextmenu，同名替换优先，否则选择 DOM 后续/前一个可用项。菜单关闭跳过已隐藏、删除、禁用或 inert 的原入口，必要时回到播放器；外部主动焦点、销毁中回调和双播放器相互独立。

accessibility/overlay-focus.ts 记录菜单来源，Info/mini 进入时解析到原始控件，避免退出后聚焦已经隐藏的菜单项。没有提前移动焦点或调整原 click/public 事件顺序；自定义菜单 callback 仍自行决定是否关闭，参数与 this 保持不变。输入/textarea/select/contenteditable 上的上下文菜单手势改为不拦截，这是修复用户编辑功能的行为差异（API-08），合成事件验证不等于操作过系统原生菜单。

Context Menu 是新增可选公开 i18n 键，十二语言及生成包/Monaco 声明一致。无依赖或版本调整。测试修正保留证据：首轮错误预期移除 Beta 后回到 Alpha，实际排序下下一项是 Info，截图确认恢复正确，现先断言 DOM 邻居再断言焦点；第二轮取消监听器错误假设 Emitter 默认 this 是 art，改为闭包引用已有实例，未修改 Emitter 契约。

最终完整 CI 468 项通过（437 单元、6 工程、25 基线），249 个生产 TS 文件严格检查；之后只有浏览器文件增加边界及修正上述假设，额外 lint 通过。最终 accessibility/components/prompt-components/display-mini/hotkey 三浏览器组合 444 项全部通过，无失败、重试或跳过；菜单十三场景共 39 项，无未处理错误或 console error。测试包含 Info/mini 交接、重复 init、失效来源、外部焦点/销毁、原生内容、取消打开、双实例及菜单边界，保留各引擎中文键盘焦点截图。

[菜单阶段证据](../baselines/keyboard-contextmenu-partial.json) 固定当前源/声明/用例、构建、CI、截图与失败报告，不改写此前快照。剩余原生模式退出、SSR/字幕和最终新安装包/legacy 全量验收继续推进；CORE-23 doing、BASE-DOM-01 open，57 done、1 doing、156 todo，尚无任务完成 commit，无 push/publish/tag/merge。

## 模式、SSR/字幕与最终边界审查

新增 accessibility-integration 四项真实场景，三引擎 12 项通过：Enter/Space 原生全屏进入退出、浏览器 API 主动退出后保留当前控件焦点、原生 PiP 键盘切换或不支持时提示，以及 SSR 保留播放器/video/字幕节点、实际 WebVTT cue、键盘字幕开关和网页全屏焦点。Chromium 153 与 Firefox 155 本次具有标准 PiP API，实际进入/退出并验证原事件；Windows WebKit 26.6 无该能力，验证既有不支持提示且不误触发播放，不能把该分支当作成功 PiP 会话。字幕维持被动呈现，不追加 Tab 停留点或强制 aria-live 逐条播报；截图检查字幕与焦点框实际可见，物理辅助技术仍由发布复盘验证。

第一次新安装包全量运行期间，额外真实 Chromium 探针复现设置按钮被删除后 Escape 仍聚焦隐藏面板中的条目。增加四项回归，在旧安装包上全部失败：入口删除、visibility:hidden、aria-disabled，以及导航遇到隐藏行/inert 子树。setting/keyboard-focus.ts 统一可用目标过滤，增加只接管关闭面板内焦点的设置入口恢复；无可用入口时使用播放器 fallback，外部焦点或销毁状态不接管。没有改变公开 Setting 的属性/方法或回调形状。

已验证原全量进程树身份后主动停止旧产物测试；保留 interrupted 日志，不计入通过。修正后三浏览器设置/集成组合 45 项通过；随后将隐藏面板断言的错误单数选择器改为实际 .art-settings，先检查唯一节点再检查隐藏，核心焦点缺陷的前后证据仍来自明确 toBeFocused 断言。最终 CI 和新打包检查重新执行，源与声明不复用旧结果。refactor/.cache/core23-setting-exit-before.json 保存四项旧产物失败；原阶段快照保留不变。

## 最终验收与交接

| 验收项 | 实际证据 |
| --- | --- |
| 结构 | 按键认领/按钮/范围/焦点与 DOM 所有权分离；控件、设置、菜单、mini、信息/锁定层各自持有局部状态和清理范围；包内 ARCHITECTURE.md 提供文件地图、回归入口及限制 |
| 类型 | 最终 CI 468 项通过，249 个生产 TS 文件严格检查；37 个公共声明无漂移；五组历史消费与八组精确消费模式无诊断，新增五个翻译字段均可选 |
| 兼容 | 保留旧构造器、属性、快捷键、click 回调参数/this、DOM/CSS 钩子及分发入口；新增键盘路径不重复激活播放；34 项隔离安装运行时契约通过，原有新旧核心/chapter 组合在全量矩阵中继续通过 |
| 真实交互 | 控件 Tab、Enter/Space、slider、selector/设置树、菜单/模式退出、动态更新移除、失效入口、双实例、SSR/字幕有真实浏览器用例，缺陷先固定失败再修正 |
| 最终安装包 | run-4QYvJQ 经 Yarn pack、隔离安装和 frozen 重装；源/声明/资源 381 文件与快照一致，工作区构建的分发内容与安装包字节一致；没有把工作区链接当作 npm 安装 |
| 完整浏览器 | modern 1749 项、legacy 1749 项；每种格式 Chromium/Firefox/WebKit 各 583 项，无失败、重试或跳过；每个用例核对已安装核心和 chapter 产物哈希 |
| 分发与导入 | 按正式脚本重建核心三个 JS 格式与 i18n；ESM/i18n/SSR 三项导入检查通过，声明/Monaco 由生成器维护 |
| 交接与提交 | 任务状态、风险台账、阶段快照和最终证据一并更新；本任务独立本地 commit，后续任务必须在核实该提交后开始 |

[最终证据](../baselines/keyboard-validation.json) 保存源/测试/工具指纹、包完整文件清单、运行时与类型结果、两个完整浏览器矩阵、构建/安装日志指纹、设置入口四项失败及中断旧产物运行的原因。此前八份阶段 JSON 不改写。新增 Progress/Back/Settings/Lock/Context Menu 可选翻译键，十二语言与两份声明同步；本任务没有新增依赖或改版本。

BASE-DOM-01 resolved，只关闭主要控件 Tab 不可达这一已复现问题。Windows 浏览器与受控 adapter 检查不代表物理 Apple/AirPlay/触摸/IME 或屏幕阅读器认证；相关 REL-03/REVIEW-02 与 BASE-ENV-01 门槛保留。CORE-22 仍待核心资源/性能及生态集成总验收，其前置 ENG-08 尚未完成，因此下一项先补覆盖率、资源清理与性能报告，再进入 CORE-22。多数生态包、CI/CD、各包下一大版本和三轮发布复盘仍待推进，没有公开发布结论。

总体为 214 项：58 done、156 todo。回退时以父提交 faaa3e8c 为基准整体 revert 本任务 commit，同步回退源、生成声明/编辑器、dist/docs 编译文件与测试，不只回退 helper 或复制旧 bundle。无 push/publish/tag/merge。
