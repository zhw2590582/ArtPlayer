# CORE-16 显示模式迁移

状态：完成。以下阶段记录保留当时的进度；当前交付结论以末尾最终验收为准。

## 第一批：页面全屏和位置快照

fullscreenWebMix.ts 保留旧 boolean 属性及真实 DOM class getter，委托 display/web-fullscreen.ts 管理样式、位置快照和操作代次。display/placement.ts 保存原父节点与后继节点，display/types.ts 声明最小宿主。实际核心入口仍然是 JS，不把单个模式迁移计作全部显示服务完成。

浏览器先对发布包与迁移前候选复现：重复进入覆盖原始样式，空样式退出后残留 100% 宽高；body 模式丢失原父节点/兄弟顺序，静态 flag 中途改变会影响返回位置；destroy 不恢复 body 中的播放器，留下可见孤立节点。36 项基线中发布包 18 项确认缺陷，候选 18 项按目标行为失败，原始报告保留。

修正策略：

- 一次进入会话只捕获一次样式和位置。重复 true 仍保留原 true 事件，不再覆盖快照。
- false 恢复实际原父节点和后继，不依赖退出时的 FULLSCREEN_WEB_IN_BODY 值；后继已移除则追加到原父节点。
- 空 style 与未设置 style 分别按原属性恢复。resize 可继续更新控件自身的 CSS 变量，不覆盖用户宽/高/颜色。
- 实例销毁先恢复自己移出的播放器，再由现有 template.destroy 执行 removeHtml；资源清理不额外发 fullscreenWeb/resize 事件。
- 每次 setter 都有代次；事件监听者退出/重新进入/销毁后，旧操作不再写入或发出过期 resize。
- 进入失败尝试恢复原布局；退出移动失败保留快照，可由下一次 false 重试。用户 DOM/事件回调的任意外部副作用不属于通用事务回滚。

兼容边界：普通调用仍同步、事件顺序为 fullscreenWeb 再 resize，class/getter/静态 flag 名称不变。state 仍通过旧门面退出其他模式；本批未解决那些模式自己的异步退出和权限问题。公开声明未修改。

## 阶段验证与限制

- 已新增真实浏览器的新旧恢复契约和候选重入/失败用例。
- 首轮候选样式断言误把 CORE-13 的 --art-controls-height 更新计作恢复失败；原始报告保留。改为退出事件内验证精确快照、resize 后验证宽高颜色，并附带完整前后样式。
- 本批 CI 210 项、139 个生产 TS 文件严格检查、完整工作区三浏览器 651 项通过，其中页面全屏 51 项。无重试或跳过；四个 TS 源文件涉及页面全屏门面、宿主、位置与恢复逻辑。见 [阶段证据](../baselines/display-web-validation.json)。
- 重新用同一浏览器构建配置生成候选，核对 SHA-256 与全部 651 项的 manifest 一致；核心三个分发格式和 docs/compiled 字节一致，构建与语言生成通过。本批尚未验证安装 UMD/legacy，不把工作区验证说成发布验收。
- 原生全屏/PiP 权限、mini 拖拽、方向锁与退出失败、完整安装 UMD/legacy 都仍未完成 CORE-16 验收。后续还要验证旋转监听者与用户原始宽高恢复的组合，以及销毁期间位置恢复本身失败的处理；两个新增风险保持 open。
- 无新依赖或脚本；继续 Node 24.21.0 / Yarn 1.22.22。完成 CORE-16 后才作对应独立本地提交，不推送或发布。

## 第二批：原生 document 全屏

fullscreenMix.ts 保留首个 metadata 后安装属性的时机，调用 display/fullscreen-adapter.ts、native-fullscreen.ts、fullscreen-request.ts；原 vendor screenfull 内容和前缀映射不变。新增最小 FullscreenHost/NativeFullscreenAdapter 类型，公开声明不变。

发布包在三个引擎均复现：一个实例进入会使另一实例报告全屏并可退出别人的全屏；destroy(false) 后仍会收到后续全屏事件和 class 更新；请求拒绝后遗留临时 change 监听。登记 BASE-DOM-10、BASE-LIFE-18，保持 open 到最终安装产物验收。

- getter 与退出按本实例 player/video 的真实归属判断；其他实例的事件不再污染本实例。普通 fullscreen → state/class → resize 顺序保留。
- 请求在调用栈中同步发起，不提前 await，保留用户手势权限。原生 Promise 拒绝保留错误对象；void 前缀 API 使用 change/error 结算。
- 每个请求的临时监听和实例永久监听分别随操作/实例 scope 清理。取消及时结算；现代 Promise 的晚到进入及销毁均作归属检查后退出。普通属性赋值提供 notice 和内部 rejection handler，直接调用 descriptor setter 仍能 await/catch 原错误。
- 无法取消且不返回 Promise 的旧 API 使用一个按 document 共享的晚到事件 guard。只有该取消路径才创建它；弱键保存目标节点，值只持有 native exit，不引用 art/scope。新请求清除旧标记，其他节点不被退出。此监听有意保留到 document 结束，不计为实例监听器泄漏。
- 补测修复了本批初版的重入 true 丢失 class/resize、fullscreenerror 抢先覆盖原始 Promise 错误，以及取消后 change 先于 Promise 完成导致短暂旧状态的问题。

验证过程：初版新旧原生/页面全屏 69 项通过；新增组合首轮 159 通过、3 失败，原因是 notice 测试未限定主实例而匹配两个元素，已改为明确主容器定位，原始报告保留。随后原生/页面全屏/字幕 174 项三引擎通过；最后一处晚到 change 修正后，完整工作区三浏览器 693 项通过，其中原生全屏 42 项、页面全屏 51 项。新增 18 项 Node 测试已接入原有 test:unit/CI，合计 228 项通过；144 个生产 TS 文件及五组消费者严格检查通过。没有新依赖。

核心三个格式与语言重新生成，docs/compiled 与核心分发产物字节相同。独立用浏览器配置重建候选，SHA-256 为 5dc3d53e13486d2b93be4935d37ba3e624a10724bd6b804ed364ab922d9988b4，与 693 项报告中全部 manifest 一致。详见 [阶段证据](../baselines/display-native-validation.json)；该证据明确标记 partial，未运行最终安装 UMD/legacy 验收。

限制：桌面实际全屏/用户手势与受控 Promise/void 故障注入分别记录。受控 void API 不等于旧 Safari/iOS 实机验证；video-only WebKit fallback 目前只保留旧实现并清理订阅，尚未完成语义修正。销毁后的 native exit 为 best effort，浏览器拒绝仍可能保留原生全屏；普通失败退出保留实际 getter/class 并允许重试。最终模式组合与安装 UMD/legacy 尚未验收。

## 第三批：video-only WebKit 全屏

fullscreenMix.ts 的 fallback 委托 display/video-fullscreen.ts；display/video-fullscreen-state.ts 管理实际状态判定和无实例引用的晚到取消。依照 [Apple 的视频全屏事件说明](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html)，补充 webkitbeginfullscreen / webkitendfullscreen 及 presentation-mode 监听，并保留 document:webkitfullscreenchange 的历史桥接。

受控浏览器基线确认发布包在视频自身显示全屏时 getter 仍为 false，原生进入/退出事件不更新 ArtPlayer；销毁时视频保持全屏。登记 BASE-DOM-11、BASE-LIFE-19。浏览器 fixture 明确关闭 document 全屏能力并模拟视频方法/状态，不能把这项复现解释为已在 iPhone 上复现。首轮 fixture 未给原型方法设置 writable，影响新增失败注入场景；保留报告，修正后才用于验证这些场景。前两组新旧状态/销毁基线不依赖方法覆写，仍可使用。

普通 setter 仍同步、返回 undefined；原生同步异常保持同一对象并允许下一次调用重试。新状态读取优先区分 fullscreen 与 picture-in-picture；没有 presentation 属性时使用 webkitDisplayingFullscreen，再回退到 document/原生事件。多种原生通知只发一次相同状态变化，事件内重入/销毁停止旧 resize。

实例销毁时释放所有实例监听，退出当前视频全屏。不能取消的 pending void 进入只保留视频自身的静态监听与 WeakSet 标记；回调不引用 art/scope，新进入会移除旧取消标记。正常销毁退出的同步错误由现有生命周期清理收集器传播；晚到取消退出是 best effort。该路径不添加 document 全局监听。

新增 9 项 Node 测试已接入 test:unit，包括只有事件而没有状态属性的 shim、PiP 状态区分、事件顺序、重入、失败与晚到清理；没有新依赖。首轮 video-only 与 document 全屏 60 项三引擎通过。最终 CI 237 项、146 个生产 TS 文件和五组消费者严格检查通过；当前源码的 video-only/document/web 全屏与字幕组合 192 项三引擎通过，其中 fallback 18 项。该次是相关组合回归，没有重跑完整浏览器套件。

核心三个格式与语言生成通过，docs/compiled 与分发字节相同；独立重建候选并核对全部报告 manifest。详见 [video-only 阶段证据](../baselines/display-video-validation.json)，仍标记 partial，物理设备与最终安装产物门槛保持开放。

PiP 下一步入口审查发现：原生分支 getter 返回 document.pictureInPictureElement（Element/null），WebKit 分支返回 boolean，而公开声明统一为 boolean。迁移时必须保留旧合法 JS 返回形态，同时处理跨实例归属和公开类型协调；不能直接把所有返回强制转为 boolean 来掩盖差异。该点目前是源码观察，下一批补发布基线与消费者用例。

## 第四批：PiP

pipMix.ts 选择可调用的原生或 WebKit 能力；native-pip.ts 与 webkit-pip.ts 分别拥有其状态、事件和销毁。发布包复现确认：原生 getter 返回 Element/null，setter 返回 undefined；WebKit getter 为 boolean，重复 setter 保持同步 pip 通知。本批保留这些形态，内部 PipProperty 使用真实联合类型，不修改历史公开 boolean 声明；差异登记 BASE-TYPE-10 并由 CORE-21 继续协调。

原生分支按本视频归属读取/退出，避免关掉别人的 PiP；销毁时先移除实例监听，再退出自己持有的窗口。进入调用不 await，保留手势调用栈。异步拒绝显示原错误 notice，旧操作不覆盖新 notice；由于原 setter 返回 void，内部处理拒绝以避免无消费者的 unhandledrejection，没有伪造一个新 Promise 返回。同步原生错误仍同步抛出。取消或销毁后的晚到进入会检查归属后退出。

WebKit 分支保留初始 inline 设置和重复 setter 事件；补充原生 UI 的 presentation/PiP 事件，避免多种原生通知造成重复事件。进入时检查当前能力，媒体就绪后可以重试；false 不关闭另一种 fullscreen presentation。pending void 进入取消只保留视频自身的静态 guard 与弱标记，不引用 art/scope。同步销毁失败与晚到清理限制沿用显示生命周期规则。

基线 27 项中，旧发布的 9 项和候选普通契约 3 项通过，其余候选 15 项按新目标失败，包含跨视频归属、销毁、晚到进入和未处理拒绝。迁移后首轮 native PiP/video-only 45 项通过；新增 WebKit 组合后 162 项通过。补测修复了原生进入在 mode 同步中被取消时发出未曾对应 true 的 false 事件；WebKit 的显式 false setter 仍保留原 false 通知。14 项 Node 测试已接入 test:unit；无新依赖。

实际原生验证：当前 Chromium、Firefox 均支持标准 API，成功获取非零大小 PiP 窗口、记录视频播放进度，并验证向页面全屏/原生全屏切换；当前 WebKit 标准 API 不可用，记录能力边界。受控 WebKit 用例另行验证 fallback，不将其算成原生 PiP 或物理 iOS 通过。

最终本批 CI 251 项、149 个生产 TS 文件及五组消费者严格检查通过；PiP/全屏组合 162 项三浏览器通过，其中 PiP 51 项。核心三个分发格式和语言生成通过，docs/compiled 字节一致；独立重建候选并逐个核对浏览器 manifest。见 [PiP 阶段证据](../baselines/display-pip-validation.json)，其中单独保存实际 PiP 能力/窗口/播放证据，明确标记 partial；没有进行最终安装 UMD/legacy 验收。

## 第五批：mini

miniMix.ts 保留 boolean 门面；display/mini.ts 管理视频位置和操作代次，mini-view.ts 管理浮窗/播放按钮/订阅，mini-drag.ts 管理拖拽与 document 订阅，mini-layout.ts 为纯位置计算。五个新 TS 文件按职责分拆，共享此前的 Placement 工具，没有新依赖。

新旧浏览器复现确认：旧退出将视频直接 prepend 到 player，丢失原父节点和后继；两种 destroy 都留下 body 浮窗。登记 BASE-DOM-13、BASE-LIFE-21，保持 open。最初隐藏拖拽测试只检查形状而未比较持久值，已增强为前后存储完全相同，不将最初该条通过视为清理证据。

- 每轮首次进入记录视频实际 parent/next；重复进入不覆盖。退出失败保留快照，可重试；恢复前先分离旧快照，避免 DOM 回调重入时抹掉新会话的位置。
- 自建浮窗、播放与拖拽订阅均由实例 scope 清理；隐藏停止拖拽、保留可复用浮窗，销毁恢复视频并移除自建节点。调用方预置的 $mini 不删除，销毁恢复其初始 display。
- 保留首次 video-first/default display、重用 video-last/flex 的旧 DOM/样式细节，保留重复 setter 的 mini 事件和 top/left 存储键。
- 拖拽使用固定定位对应的 client 坐标；结束时限制在视口内。普通默认仍为 50px 边距，非有限/越界存储重置，小视口通过 max-width/max-height 保持可见。
- 自定义图标 getter 可能隐藏/销毁/再次进入 mini。重复创建的受控复现最初在三个引擎失败，已将创建串行化为单个浮窗，并验证未完成视图的清理和失败后重试。

纯位置计算 4 项 Node 测试接入 test:unit；新增内部 boolean/数字坐标类型用例。首轮 21 项、扩展 51 项通过；修正创建重入后 219 项 mini/PiP/全屏组合通过。补充销毁后的拖拽订阅验证后，最终组合 222 项通过，其中 mini 60 项；CI 255 项、154 个生产 TS 文件和五组消费者严格检查通过。初版 Cleanup 回调的 void/undefined 类型差异已修正，保留失败日志。

核心三个分发格式及语言生成通过，docs/compiled 字节一致；重新生成候选并逐个核对 222 项 manifest。见 [mini 阶段证据](../baselines/display-mini-validation.json)。本批没有重跑完整浏览器套件或最终安装 UMD/legacy；mobile touch 拖拽和物理设备验证未计作通过。

下一步处理尺寸/方向组合及剩余失败退出边界。回退时恢复对应旧 mixin，删除 display 新模块及类型用例，并由构建重新生成产物；保留已复现的基线记录。

## 第六批：尺寸、宽高比与翻转

autoSizeMix、autoHeightMix、aspectRatioMix、flipMix 迁移 TS，display/sizing.ts 集中纯尺寸计算，sizing-types.ts 限定各门面的最小依赖。保留自己的不可枚举/不可配置属性、可抽取方法、同步 undefined 返回、正常布局和事件；宽高比仍用原 split/Number 转换，保留多段字符串的旧解析、dataset、notice 与重复事件；翻转仍允许自定义字符串和 falsy 默认值。没有新依赖或公开声明变更。

发布基线 18 项中 15 通过、候选目标 3 失败，复现媒体尺寸为 0 时旧 autoSize 局部覆盖宽度、autoHeight 发出 NaN。新增 BASE-DOM-14，候选对未就绪/隐藏/非有限几何不改布局、不发无效测量，尺寸恢复后正常应用。非法比例仍保存输入并发原事件/提示，CSS 不再局部改写；这属于异常输入的布局修正。销毁后的调用不再改写残留节点。

4 项纯计算测试覆盖比例保持、容器边界、尺寸未就绪后的恢复、非有限值和浮点溢出/下溢。浏览器尺寸用例 33 项覆盖发布/候选有效比例、属性描述符、可抽取方法、解析、隐藏后恢复、非法输入和销毁。扩展首轮 30 通过、3 失败来自测试错误地把 notice.show 的 boolean getter 当字符串；已改为检查真实提示节点，保留该失败日志。

最终本批 CI 259 项（230 单元、4 工程、25 基线）、160 个生产 TS 文件及五组消费者严格检查通过。尺寸/mini/PiP/全屏组合 255 项三浏览器通过，其中尺寸 33 项；核心三个格式和 i18n 构建通过，docs/compiled 字节一致。重新构建的候选指纹逐一匹配 255 项 manifest，见 [尺寸阶段证据](../baselines/display-sizing-validation.json)。这不是全量浏览器或最终安装包验证。

CORE-16 仍在实施：自动方向、旋转样式组合、恢复失败以及最终安装 UMD/legacy 验收尚未结束，不作完成任务提交。回退本批时恢复四个 JS 门面、删除 sizing 模块/类型/测试并用仓库脚本重建，保留基线缺陷记录。

## 第七批：自动方向

autoOrientation.ts 保留内置插件名称、只读 state、移动端启用条件和横竖不匹配规则；拆出 orientation-web.ts、orientation-native.ts、orientation-types.ts。原泛型插件注册器不声明完整 JS 构造宿主，因此仅在内置装配处桥接工厂类型；实际实现使用最小 OrientationHost，完整主入口类型仍由 CORE-21 接续。无新依赖、无公开声明变化。

基线 12 项中旧发布 6 项通过、候选目标 6 项失败，复现退出旋转会清空调用方样式、方向 lock 晚到后会重新添加 active class 且未 unlock。分别登记 BASE-DOM-15 和 BASE-LIFE-22。实现由实例 scope 拥有订阅与 timer，退出/销毁取消旧会话延时；重复全屏重新应用旋转尺寸但不覆盖首次快照。fullscreenWeb 退出先恢复完整样式，旋转 false 不再清空；销毁时旋转清理先于 fullscreenWeb 最终恢复。

原生方向锁立即调用，成功后只有当前活跃请求能标记 class；退出/销毁立即尝试 unlock，晚到成功再次释放。弱平台对象 token 限定请求归属，旧实例不能 unlock 新实例的锁；旧错误不覆盖新 notice，当前错误保留身份并允许重试。锁成功前后的取消均有单元用例。外部代码直接调用方向 API 无法被 ArtPlayer 自动追踪；平台拒绝 unlock 仍按旧行为 best effort。标准依据为 [Screen Orientation](https://www.w3.org/TR/screen-orientation/)，不将受控 API 回调当作物理设备能力证明。

8 项 Node 测试接入 test:unit。首次浏览器迁移 9 通过、3 失败：源码已恢复用户四个属性，但 resize 合法添加 --art-controls-height，原测试错误地比较整个 style。诊断保存了实际前后字符串；改为逐一比较受管理属性，destroy 仍检查完整快照。扩展轮 17 通过、7 失败，其中重复进入覆盖旋转尺寸是实际缺陷，已修复；计时器测试在 Firefox 的时钟继续流逝，已用 pauseAt 明确冻结后按时间推进。修正后 24 项通过，再加入 pending destroy 与真实旋转播放/比例/翻转组合。

最终方向 30 项、全部当前显示模块组合 285 项三浏览器通过；CI 267 项（238 单元、4 工程、25 基线）、164 个生产 TS 文件及五组消费者严格检查通过。核心三个格式和 i18n 构建通过，docs/compiled 一致，独立重建指纹与全部 285 项 manifest 匹配，见 [方向阶段证据](../baselines/display-orientation-validation.json)。桌面引擎模拟移动 UA，方向 lock 为受控接口；真实媒体播放已验证，但物理旋转、安全区域和设备方向限制仍需设备证据。

CORE-16 保持 doing；下一步处理页面全屏销毁时位置恢复失败等边界，再跑完整源码/实际安装 UMD/legacy 和消费者出口。回退恢复 autoOrientation.js、内置装配与对应生成物；保留已复现缺陷和日志。

## 第八批：剩余退出与恢复失败边界

页面全屏销毁恢复测试先跑 12 项，6 项通过、6 项失败，确认 insertBefore 在移动前抛错时两种 destroy 都会留下 body 中的播放器。现在销毁恢复失败后，只有仍在原归属之外的播放器才尝试移除，防止孤立节点；已归位再抛错则交给正常 template.destroy。原错误继续抛出，二次移除也失败时由生命周期错误集合保留两者。异常 fallback 可能使 destroy(false) 的残留节点变成脱离文档状态，这比保留错误位置的可见播放器更可控，且调用者仍收到原恢复失败；正常退出的可重试快照不变。

原生 PiP 补充过期 leave 回调复现：视频仍属于当前 PiP 时，旧逻辑错误发出 false；现在以当前归属过滤该信号，真正退出仍发 false。15 项 PiP 单元测试通过。该补充属于 BASE-DOM-12 的事件一致性，未新增公开 API。

原生 void 全屏退出补充复现：文档实际全屏的是本实例 video、原请求 target 是 player 时，旧等待条件提前结算。现在进入仍等待 target，退出由实例归属判断，直到 player/video 都不再拥有全屏；另一元素成为全屏也可完成本次退出，不会把它当作自己。19 项原生全屏单元测试通过，并加入实际分发可运行的三浏览器受控用例。该补充属于 BASE-LIFE-18 的结算边界。

正在进行最后的源码与安装包出口验证；前七批 manifest 仍代表各自历史源码，不用它们覆盖本批新增改动。

## 最终验收

- 全屏、页面全屏、video-only fallback、PiP、mini、自动尺寸、宽高比、翻转与自动方向已迁移 TS，分离能力适配、状态、几何、DOM 和资源作用域。核心 159 个与 chapter 5 个生产 TS 文件严格检查通过；公开 mixin 属性描述符、旧返回形态及正常事件/DOM 契约保持。
- yarn ci:check：269 项通过（240 单元、4 工程、25 基线）。此前源码全量 897 项通过，但它早于最后的 void video-owner 修正；最终安装包矩阵包含新用例，不把旧源码指纹冒充最终源码。
- 实际 core/chapter tarball 仓库外安装：27 项运行时、五组类型零诊断。最终安装 UMD 和 legacy 各 900 项三浏览器通过，其中各 300 项显示模块检查；无重试、跳过或未处理页面错误。
- [最终证据](../baselines/display-validation.json)核对当前全部核心源码和构建快照、三个分发格式与 tarball/docs、全部包内文件、公开类型、架构说明、22 个语言文件和独立分发许可。
- Chromium/Firefox 真实原生 PiP 窗口与播放推进通过；三引擎真实桌面 document fullscreen 通过。当前 WebKit 标准 PiP 不可用，video-only/void/WebKit PiP/方向锁为受控路径，物理 iOS/Android、安全区域、实际方向/手势等仍交 REL-03/REVIEW-02，不声称设备或发布准入已通过。
- 销毁恢复失败的异常降级为移除仍脱离归属的播放器并保留原错误；原生平台拒绝退出或 unlock 时只能 best effort。外部任意 DOM/方向 API 副作用不被承诺可回滚。
- 无新增依赖、锁文件或版本修改。公开 PiP 历史 boolean 声明差异 BASE-TYPE-10 继续由 CORE-21 协调；不将保持旧 JS Element/null 返回改为强制 boolean。
- 回退本任务时恢复对应旧门面、autoOrientation 及内置装配，移除 display 新模块/对应测试，用仓库脚本重新构建核心和 i18n；保留历史基线与缺陷记录。

关闭本任务十三个 DOM/生命周期缺陷。当前 214 项中 52 完成、162 待办；下一项 CORE-17 键盘、手势、焦点和全局事件。全生态、设备、远端 CI、多轮复盘和发布门槛继续按计划推进。本任务独立本地提交，不推送或发布。
