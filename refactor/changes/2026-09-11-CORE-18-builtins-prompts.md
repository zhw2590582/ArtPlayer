# CORE-18 内置插件与提示模块

状态：完成；父提交 `a8420581`。以下分批过程保留历史结果，最终验收见末节。

## 第一批：notice 与 fastForward

- `src/notice.ts` 使用最小宿主类型，公开字段仍只有 art/timer，原型仍为 constructor/destroy/show。内部请求代次放在 WeakMap；取消、重入与销毁不再让旧提示覆盖新提示。功能规模较小，状态与 DOM 操作保留在一个模块。
- `src/plugins/fastForward.ts` 负责插件接口、原生触摸和实例事件订阅；`src/input/long-press.ts` 负责按压状态、延时、原播放速率和资源释放。每次按压归属于当前 source scope，重复开始、取消、锁定、暂停、切源、销毁都会释放旧工作。
- 保留 notice 的 Error 消息 trim、字符串空白、false/空字符串仅隐藏而保留旧文本/待执行清空计时器，以及显式 notice.destroy 仅取消计时器、存活实例仍可复用的行为。
- 保留 fastForward 的名称、只读 state、默认安装条件、单指/播放/未锁定条件、实时 FAST_FORWARD_TIME/VALUE 以及松手恢复原速率。新增 touchcancel 等清理是生命周期缺陷修正。
- notice 的真实 getter 为 boolean，历史公开声明却是 string/Error/false。本批源类型与正反例明确实际行为，旧声明保持；BASE-TYPE-07 继续开放，由 CORE-21 提供兼容的精确公共视图，不能简单用 boolean 替换旧消费者读类型。
- builtins 的 fastForward 类型断言与已有 autoOrientation 相同，只位于尚未迁移的构造器到最小宿主的接合处；CORE-20 收敛入口时需核对，不向内部传播 any。

## 已复现与测试过程

notice 初次六项 Node 复现为三通过、三失败，显示写入中销毁后仍创建 timer、过期回调覆盖新消息、到期清空中重入的新消息被隐藏。初次复现使用宿主 Node 25.2.1；后续执行切回固定 Node 24.21.0。真实旧发布包在 Chromium/Firefox/WebKit 均复现 DOM 写入中的销毁和重入缺陷；候选通过。

fastForward 初次十一项固定 Node 复现为三通过、八失败，包含重复定时器、缺少取消与生命周期防护。后续扩展源切换、回调时状态变化及恢复速率时重入的回归。

notice 三浏览器专项 33 项通过，涵盖旧包/候选的接口、DOM、自然提示到期与真实视频播放，及候选过期回调防护。fastForward 第一轮 27 项中六项失败：测试误把切源/原生 load 后的默认速率重置当成必须保持 1.5。检查实际 reset() 调用 video.load()，补入旧包/候选原生换源重置对照；检查实际恢复 setter 收到 1.5，而随后原生换源保持默认 1。待触发按压销毁后则明确断言 resetRate=1 且迟到回调不再修改它。修正后专项 33 项通过，没有增加等待时间或重试。

测试文件：`test/notice.test.js`、`test/fast-forward.test.js`，对应 `test/types/` 正反例和 `test/browser/notice.spec.js`、`test/browser/fast-forward.spec.js`。模拟触摸使用真实 DOM 事件与实际视频，物理设备仍由 REL-03/REVIEW-02 验收。

第一批最终源码已通过 `yarn ci:check`：311 项单元、4 项工程、25 项基线，共 340 项；191 个生产 TS 文件（核心 186、chapter 5）及五组新旧消费者模式通过。notice/fastForward/event-scheduling 三组源码构建的浏览器专项合跑 96 项通过，Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6，无重试、跳过和未处理页面错误。精确指纹及日志信息见 [部分阶段证据](../baselines/builtin-prompts-partial.json)。本结果明确不代表安装包或 legacy 出口验收，后续源码变化须重新验证对应范围。

## 剩余与交接

所有目标模块已迁移，autoOrientation 沿用 CORE-16 实现并通过组合矩阵。完整任务出口已通过；BASE-TYPE-07 的兼容精确公共视图仍交 CORE-21，移动真机与多轮发布复盘仍由 REL-03/REVIEW-02 验收。下一任务 CORE-19。

没有增加依赖，使用既有 Yarn/Node/TypeScript/Playwright 工具。最终生产产物已由构建生成并核对安装包；本任务按独立本地 commit 交付，不推送、不发布。分批阶段的 doing 状态属于历史记录。

回退以父提交为比较基准，只撤销本任务源文件、测试、任务/架构/风险文档与最终生成产物，保留此前 CORE-17 交付。

## 第二批：autoPlayback

`plugins/autoPlayback.ts` 保留 name/times/clear/delete 结果；`auto-playback/records.ts` 负责 playing 时写入 times，`auto-playback/prompt.ts` 负责提示 DOM、ready/restart、点击和首个 timeupdate 后的超时。存储仍使用 artplayer_settings 的 times 成员，优先 option.id、回退 option.url；严格保留旧版的 keys.length > AUTO_PLAYBACK_MAX 时仅删除最早一项，不能在 TS 化时悄悄改为固定最大长度。

记录订阅属于实例；移除提示层仍继续记忆播放位置。每一轮提示属于图层且连接当前 source scope；重启、切源、图层移除、实例销毁均取消旧点击/首帧订阅/定时器。点击顺序仍为 seek、play、隐藏 poster/提示；用户回调若切源或销毁，则停止失效的后续操作。提示 HTML、类名、翻译、阈值和超时读取方式保持。新增内部类型，没有修改现有公共声明或增加依赖。

迁移前固定 Node 的八项复现为二通过、六失败；迁移后扩展了旧 timeout、seek 中 restart、翻译/存储回调销毁、NaN 阈值和内部播放拒绝。首轮三浏览器 39 项通过，明确证实旧包连续 restart 后一次点击执行三次 seek/play，而候选只使用最新保存时间响应一次；也覆盖真正的 seek/play/持续记录、本地存储信封、清理和销毁重入。新增关闭按钮与播放拒绝兼容用例后继续专项验证，完整结果见对应阶段证据，不覆盖或重写第一批的历史指纹。

## 第三批：lock / miniProgressBar

两个简单内置插件分别保留单文件并迁移 TS，使用最小宿主类型。lock 保留 name/state 结果、class → isLock → lock 事件顺序和重复相同赋值仍通知的行为。图层移除时只取消图标订阅，存活实例的插件 state 仍可读写；销毁后则忽略旧引用上的 setter/click。miniProgressBar 仍根据 control 事件切换原类名，仅返回 name，订阅归实例所有。没有为了拆文件创建多层转发。

迁移前五项 Node 复现为一通过、四失败；迁移后五项通过。浏览器增加旧包/候选、桌面/模拟移动、直播/点播的内置插件启用矩阵，以及 lock 重复事件、图标、图层移除、mini 控件同步和销毁后引用的验证。这里的移动条件用 userAgent 固定，只证明现有分支及 DOM 行为，不证明真实移动设备能力。

第二/三批第一次合跑 90 项有 15 项失败：12 项图标测试错误读取 art.icons getter 新建的节点，改为从实际挂载的 lock 图层取节点；其余 3 项准确暴露旧发布包在重复注册的续播点击中产生两个未处理播放拒绝。旧包专用捕获器只匹配本测试的 Error 对象，断言每个浏览器恰好两次并附带 known-resume-rejections 证据，不忽略其他异常；候选不安装捕获器且要求零异常。当前分支在本任务前已使用 silencePromise，这部分是保留既有修复，不能宣称是本批新修正的生产缺陷。

修正测试后合跑 90 项通过，无重试或跳过，候选与非预期页面错误为零。最终 `yarn ci:check` 通过 330 项单元、4 项工程、25 项基线，共 359 项；196 个生产 TS 文件（核心 191、chapter 5）及五组消费者类型检查通过。新增自动续播单元 14 项、图层单元 5 项已加入 test:unit。嵌套的浏览器/类型文件另行 lint 通过；精确源码、报告和日志指纹见 [续播与内置图层部分证据](../baselines/auto-layers-partial.json)。尚未生成本任务最终产物或执行安装包出口，CORE-18 继续 doing。

## 第四批：info / loading / mask

info.ts 保留 Component 字段与 init 原型方法；info/poll.ts 管理动态媒体字段、原 DOM 文本转换、关闭监听与循环。每次 init 先释放上一轮，WeakMap 保存内部代次；支持手动 destroy 事件停止轮询、存活时 init 重启，拒绝实际销毁后的写入。固定数值保留 toFixed(2)，空值、布尔、对象、NaN/Infinity 与 Symbol 错误用真实 DOM 对照验证。

loading.ts 仍只负责 loading 图标与继承的组件行为。mask.ts 保留原生点击内部播放处理和 state/error 图标。最初尝试在根 scope 清理时切换 mask，随后新增的观察顺序测试揭示它会让早于 mask 注册的 destroy 监听器看到提前变化的图标；已修正。lifecycle/instance.ts 新增内部 finalization scope：普通销毁在原 destroy 事件之后释放，直接根 scope.dispose 则在根资源清理完毕后释放。mask 正常仍由原注册位置的事件回调显示终止图标，最终阶段只补偿未执行/失败的回调并取消订阅，避免改变旧观察顺序或重复正常 DOM 写入。较早的用户 destroy 回调抛错时，清理完成后仍抛出原错误。

迁移前八项专项为二通过、六失败；扩展后包含十二项单元与生命周期关联测试。初始 mask 顺序修复前的十二项中一项失败，修复后联合 instance-lifecycle/resource-scope 共二十六项通过。完整源码与安装包出口结果在任务收尾时追加。

info/mask 源码浏览器专项 45 项通过；其中新增观察顺序用例最初遗漏 option.layers 的必需 html 字段，导致九项初始化失败，补齐合法输入后通过，没有改变播放器验证规则。最终兼容复核还发现 notice setter 不应通过可被消费者覆盖的 public destroy 方法取消旧 timer；七项 notice 单元中新增覆盖测试曾失败，改用内部 cancelNotice 后修正，并加入旧包/候选的真实浏览器回归。该修正发生在首轮打包之后，先前 run-7Jpsrp 不作为最终候选，必须重新打包验证。

## 最终任务验收

固定 Node 24.21.0 / Yarn 1.22.22。完整 CI 372 项通过（343 单元、4 工程、25 基线），200 个生产 TS 文件（核心 195、chapter 5）及五组新旧类型消费模式通过。实际 tarball 安装为 run-4YqfAy，27 项运行时与五组类型零诊断；工作区源文件、包内全部文件、UMD/legacy/ESM、docs 副本、22 个语言产物与许可指纹一致。

安装的 UMD 和 legacy 各完整执行 1350 项三浏览器测试，各含 207 项本任务专项与 300 项显示模式回归，无重试或跳过。Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6；原生桌面 fullscreen 与可用引擎 PiP 播放继续验证。精确匹配并记录旧包的已知续播播放拒绝；候选和非预期页面错误为零。完整报告、源码与测试指纹见 [最终证据](../baselines/builtins-prompts-validation.json)。

公开声明未改；类型冲突仍按兼容策略交 CORE-21，不能把旧消息读类型改成 boolean 并宣称无影响。关闭 BASE-LIFE-31/32/33/34/35；BASE-PERF-01 已有修复通过相关全量回归。无新增依赖或 lockfile 变化；新增五组单元文件共 51 项并接入既有命令，浏览器/类型与包内架构同步维护。

当前 214 项：54 完成、160 待办，下一项 CORE-19。本任务独立本地提交，不推送、不发布，也不代表完整重构或发布复盘已完成。
