# PKG-DANMUKU-05 渲染、设置和热力图资源归属

本步完成JS职责整理，完整自有TS、Worker消息和已安装声明消费者归06。渲染模块负责
节点和几何，设置模块拆为协调器、模板/icons、Slider、发送、生命周期及全局样式；
热力图拆为采样、曲线计算和control生命周期。实际维护地图见包内
[ARCHITECTURE.md](../../packages/artplayer-plugin-danmuku/ARCHITECTURE.md)。

## 实现与兼容

- renderer接管原节点分配、样式、位置快照及暂停/恢复几何，scheduler继续决定操作
  是否有效；两者之间保留generation与节点身份检查。destroy(false)仍移除自己的
  弹幕节点、清除引用与空闲池，保留其他节点。替换加载仍执行旧整层清空，并在
  释放归属记录前移除已被移动到层外的自有节点，保留层外无关内容。
- Setting在创建资源前登记销毁；自身初始化失败清理资源，入口再回滚已创建的
  Danmuku/Worker并保留原错。精确解绑art监听、proxy和registry条目；某项解绑
  抛错仍清理其他项。旧核心5.4.0的proxy返回函数需配合events.remove删除登记。
- pending beforeEmit与销毁竞速，销毁后不清input、不加锁、不迟到发送。保留
  option receiver及严格true；普通发送仍同步插入、清input和启动原倒计时。
  新增对emit返回Promise的局部观察，继续使用原console.error出口，不改为插件error。
- mount/fullscreen移动同一节点；销毁只移除自有设置DOM。宿主dataset/display按
  最后写入值及实例归属恢复；共享mount保留存活实例，用户后续写入不被覆盖。
  原始display的!important通过真实浏览器验证。全局样式仍在import时安装且不随
  单实例销毁，DOMContentLoaded等待在重复bundle间去重，触发后解除监听。
- 热力图窄宽度和无效sampling使用正步长，非法尺寸/duration不生成NaN SVG。采样
  由逐bin扫描整队列改为排序及二分计数，保留原浮点步进、严格左开右闭和数值边界。
  曲线与旧源码、实际5.3.0 main/legacy逐字对照；points事件仍只复制外层，内层y
  原地变化及重复调用累积保持，未静默改成immutable。
- 不设置任意100000数量上限，合法100001+采样/自定义点继续工作。仅拒绝不可表示
  的数组长度、非有限参数或无法推进的数值步长；不声称任意巨大输入CPU成本有界。
- 无冲突的首个gradient保留旧heatmap-solids，其他实例使用独立ID；同文档重复
  bundle也检查实际ID占用。heatmap-start/stop局部钩子、control名、样式与进度保持。
  control卸载解除订阅，销毁不误删后来替换的同名control。
- 工厂门面、返回身份、getter、静态icons、合法输入和原轨道Worker算法保持。
  不修改公共声明、分发入口或消费者运行时依赖。版本递增仍由统一版本任务实施。

## 验证及证据边界

源码、正式main、正式legacy各159项联合测试通过：原输入/解析/调度/Worker104项，
Setting36项、heatmap14项、renderer5项。每组101项随候选实现变化，另58项固定为
原Worker模块18、历史数值3、历史Setting18、直接heatmap14、直接renderer5；不能
把这些共同测试重复描述成不同产物覆盖。完整yarn test:danmuku为245项通过。

最终源码、main、legacy各138项原生浏览器通过：输入24、调度66、资源48，共414项。
每种实现使用2并发，最终报告unexpected/skipped/flaky均为0，retries为0。此前的
手工诊断和失败分别留档，不把最终通过描述成此前从未失败或负载问题已关闭。
实际已发布5.4.0和候选5.4.1核心，Chromium、Firefox、Windows WebKit。
覆盖真实视频/Worker、旧调度轨道、pending发送和计时器、外部及共享mount、初始化
回滚、原生!important、destroy(false)和重复bundle热力图。WebKit不是Safari真机。

完整构建生成main/legacy/esm并与docs/compiled逐一核对字节；ESM只计构建与复制，
不列入额外运行矩阵。源码/测试lint、Yarn冻结安装、严格工具链、全仓366生产TS与
消费者检查通过；未迁移JS不计入TS覆盖。早前被中断的typecheck日志不作为成功证据。

内置浏览器Chrome/152.0.0.0打开现有8082 docs编辑器及danmuku示例，使用正常yarn dev
构建和本地video.mp4/danmuku.xml：播放时间推进至46.89784、实际解码宽640，暂停后
保持46.911033；真实弹幕可见，示例异步beforeEmit发送完成后input清空，按钮恢复。
这是开发示例smoke，不是实际发布包或设备验收。读媒体时两次调试调用失败已记录，
不混同为页面错误，也不从一次截图推断无后台工作。

移动节点修正后，重新正常构建dev示例并在单元测试结束后重载验证：发送
Final resource verification，beforeEmit记录媒体时间0.267138，真实播放UI推进到
00:47，随后暂停在53.404841，后次原生读取仍为同值，解码宽640，input为空且发送
按钮恢复。页面warning/error列表为空。一次旧AX索引因开发重载失效，一次只读
video locator读取超时；使用当前UI和支持的CDP只读接口完成最终取证，均单独记录。

本步新增根devDependency linkedom@0.18.13并维护唯一yarn.lock，用于真实模板解析、
selector和事件测试，不随播放器发布。其[官方说明](https://github.com/WebReflection/linkedom)
明确不是完整浏览器；测试受控几何/计时器与真实浏览器证据分别记录。根test:unit和
test:danmuku加入三组新测试，浏览器spec沿既有CI发现。远端CI未在本步执行。

## 失败如何处置

- 旧04正式main的两核心Chrome六项资源回归均失败：外部DOM残留、pending完成后
  清input并加锁、锁计时器保留及renderer节点引用残留。修复后由最终矩阵验证。
- renderer首轮受控检查因冻结假Element没有removeChild报错，仅给候选helper补
  删除语义；冻结历史helper不改。随后原109项联合检查通过，另用Linkedom和原生
  DOM断言真实节点删除，避免假DOM掩盖清理。
- 最后复审复现另一条资源遗漏：节点移到body后，替换加载清空归属集合但未移除
  层外节点，后续destroy也无法清理。增加红例后，clear先释放自有节点再执行原
  整层清空；受控回归验证层外无关节点保留，并新增两核心三引擎真实DOM用例。
- 中间热力图100000硬上限在复审中被否决。大输入两个红例中，一个巨大差异格式化
  导致断言报告内存分配失败，另一个实际返回null。移除上限，并在比较大数组前先
  断言长度，最终完整采样、曲线及内层mutation通过，不保留不兼容限制。
- 三引擎首轮128/132通过。两个WebKit例把打字/点击期间所有一秒定时器都当作
  发送锁，捕获了额外计时器；改为从beforeEmit的同步发送续体观察初始锁ID，仍
  要求该真实ID在销毁时清除。另两个取消/恢复例在预期时间未进入beforeVisible，
  Worker请求为0。其目的在验证进入准备后的生命周期，改为明确建立ready前置
  状态；原真实时间、轨道及数值例保持。不能据此宣称所有负载下的时间窗口无遗漏，
  此项由LOAD-01留给07采集真实帧/媒体时间和压力证据。第一次ready夹具修改又引入
  六个seek失败：旧项变为永久ready，seek后重新进入未结束的gate；恢复它按媒体时间
  触发，仅恢复/新续行项设ready。NaN与旧gate用真实0.25倍率扩大对应墙钟窗口，
  不代表任意调度延迟下均可送达。该轮还有一项NaN错过窗口，125/132通过，完整归档。最终受影响42项
  三引擎定向复验通过后重跑全矩阵。未扩大超时、改变生产逻辑或删除最终断言。
- 后续源码132项通过，主构建三并发131/132通过：WebKit旧核心的reused弹幕未进入
  beforeVisible，只有初始moving的Worker请求。queue与04及冻结源码的±0.1秒规则
  相同；2倍速时窗口约100毫秒，但没有当时逐帧媒体读数，不能断言帧间隔是根因。
- 同一主构建、同一132项改为单并发后128通过、4失败，原两核心倍速复用例均通过。
  新失败为两个初始媒体ready超时、一个context关闭超时、一个page创建超时及其
  null page后续错误。完整报告保留；这些不是移动节点修复的红例，也不能证明
  主机或WebKit自身是唯一原因。此后修复清理遗漏，新产物使用与CI一致的2并发
  重新运行完整矩阵，retries仍为0，前述失败并未被删除或算作已修复。
- 移动节点修复后的源码137/138通过，唯一失败在新增清理例的MOVED出现之前。
  清理例不负责固定时间窗口，把两个renderer资源例的起点明确设为ready，再要求
  原生视频、真实Worker和可见DOM后执行清理；原生时间/倍速/轨道用例继续保留。
  倍速用例额外代理原readys getter一次且原样返回，记录最多2000份真实媒体时间、
  队列与ready样本，方便后续区分资格遗漏与渲染失败，不修改生产时间或轨道判断。
  受影响18项定向验证通过后，重新运行三种产物完整414项，均通过。

机器记录、文件指纹、失败及最终报告见
[danmuku-resources-validation.json](../baselines/danmuku-resources-validation.json)。
首次三引擎失败完整归档，最终档案的截图附件保留原报告路径到archive目录的映射。

## 交接和回退

CLEANUP-01/HEATMAP-01按本步具体标准关闭。LOAD-01、完整TS/声明、真实长负载、
设备及发布前复盘仍归后续任务，不由本步通过替代。下一项06在提交核验后启动。
本步对应独立本地commit；若回退，整体revert该提交并同步任务/风险状态，不单独
恢复dist或只退资源模块。没有推送、标签或npm发布。
