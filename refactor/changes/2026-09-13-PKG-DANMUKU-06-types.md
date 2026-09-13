# PKG-DANMUKU-06 自有 TypeScript 与兼容声明

本步将前面已拆分的20个自有运行模块迁移为严格TypeScript，明确输入、队列、
Worker协议、UI与生命周期边界。任务完成状态以tasks.json为准。

## 实现与兼容边界

- 入口保持同步插件门面；Danmuku拥有配置与队列，scheduler负责时钟与有效操作，
  renderer负责节点，WorkerClient负责请求身份与终止，worker只计算轨道。
  input、bilibili及parser保持请求/解析/取消分层；设置和热图继续使用05/10的模块边界。
- 新增内部types、worker-types、parser-types、setting-types及Worker资源声明。
  公开运行数据由types/runtime-shared.d.ts单一维护，内部通过type-only转发使用；
  DOM宿主与Worker协议留在src。不存在新的运行时模块环或消费者依赖。
- 类字段使用declare，不改变原初始化顺序或新增undefined自有属性。保留同步数组
  加载前缀、Promise/owner返回身份、回调receiver、默认参数、事件与原DOM属性写入。
  取消符号明确区分异步结果；没有为了通过类型检查改变轨道算法。
- 受控断言用于旧核心constructor声明、已初始化的设置节点、已分配的活动弹幕节点、
  DOM WebIDL的原始数值/null赋值，以及历史无效margin字符串回退。它们不替代输入
  验证，不引入全局any。旧postMessage空对象默认值仍保留，未知协议不产生回复。
- 分包tsconfig禁用allowJs。ES2021.String仅描述既有parser.replaceAll，不新增该
  运行时要求；现代es2020与legacy es2015构建目标不变。本包没有自有遗留JS或vendor。
  模块地图、生命周期与维护指引见包内ARCHITECTURE.md。

## 公开类型与消费者

实际npm 5.3.0根声明完整保留，换行归一后SHA256为
`006c3e2d22425b936d6d09bf5138b0ae13c4cfffd0a571d03722c17137dbe99c`。
旧根/legacy的参数、返回提取和普通替代工厂关系不变；没有给工厂增加必填default。
新增可选/runtime路径指向相同分发文件，只提供准确声明：

- 工厂参数对象仍必传，但对象内字段可选。保留弹幕扩展字段；输入可为数组、URL、
  Promise或返回数组/Promise的函数，config可以传部分字段。
- emit/load返回Promise<Owner>，同步命令返回Owner，Owner与注册门面分别描述；
  门面的option/isHide/isStop只读getter不会使内部配置对象变为深只读。
- filter接收填默认值后的数据，beforeVisible接收队列项；两者按truthy判断，
  beforeEmit严格比较true。回调this为实际NormalizedOption。
- mount需要有效目标。icons描述真实可写属性；Slider与margin元组、heatmap坐标和
  配置保持实际格式。points配置目前只保存，自定义绘图由points事件触发，保留内层
  元组mutation。EventMap提供明确payload，不全局改写旧核心事件声明。
- 旧根的同步emit结果和对象points属于历史声明错误，切换/runtime后需按真实行为
  使用await及元组；继续使用旧入口无需因本次迁移修改代码。实际运行并未被旧声明
  所描述的行为替换，具体示例见README及type-compatibility-policy.md。

四项类型测试覆盖真实声明归档、正反例、实现赋值和语义编辑器生成。安装测试在
仓库外实际Yarn pack/install并离线冻结重装，逐成员核对字节，检查CJS/ESM身份。
12个编译器/解析模式组合包括TS5.9.3与4.3.5；候选每个适用模式有4个root和14个
runtime负例，逐个去掉expect-error确认相应错误实际出现。
旧根在NodeNext ESM默认namespace方式的7个历史诊断与候选逐代码/行号比较，
显式namespace适配通过；保留失败事实，不把它包装成全部旧TS用法均无错误。

build:ts把Danmuku纳入语义声明生成，更新docs编辑器资产；不手改生成声明。
.npmignore排除实现tsconfig，公开类型仍随包分发。新增test:danmuku-types及
test:danmuku-types-package脚本，前者被既有test:baseline自动发现。本步无新依赖，
唯一yarn.lock不变，版本递增仍由统一版本任务执行。

## 测试与证据

最终机器证据见[验收报告](../baselines/danmuku-types-validation.json)。
完整源码250项单测通过，正式main和legacy各164项联合测试通过；严格类型检查覆盖
全仓390个生产TS文件。源码/main/legacy最终各156项真实浏览器通过，共468项，
每轮2并发、零重试、零跳过；覆盖实际发布5.4.0与候选5.4.1核心以及Chromium、
Firefox和Windows WebKit。正常构建、类型编辑器生成、目标lint、冻结安装及严格
Node24.21.0/Yarn1.22.22工具链检查通过；构建产物与docs复制逐字节相同。
源码单测、正式main/legacy联合测试包含共同内部模块与历史对照，不能把每一项都
计为独立产物测试。Worker加载器会执行选中产物内嵌Blob或data URL的实际字节；
只有源码受控模式才单独编译worker.ts。冻结的历史helper没有修改。

内置浏览器用正常yarn dev打开8082现有danmuku示例，本地视频和XML实际加载。
Chrome/152.0.0.0，视频播放至11.711807秒且解码宽640；发送
`TS migration browser check`后输入清空；暂停在43.744183秒，再次读取保持同值。
真实弹幕可见，页面warn/error记录为空。原生Browser.getVersion不支持，改用受支持
CDP只读navigator.userAgent取版本；之前失效tab的CDP焦点超时不作为页面失败。
这只是开发示例smoke，不替代发布包、Safari真机或07的持续负载验收。

## 失败处置与未完成范围

- 第一版实际pack发现实现tsconfig泄漏，修正.npmignore后重做完整隔离安装。
- 实现赋值fixture最初放在根test/types，导致根配置缺少分包Worker资源和既有
  ES2021.String声明；移至refactor/fixtures/implementation，并用分包配置检查。
  负例诊断行计算也修正了跨空白行匹配；保留失败日志，不弱化类型断言。
- 最终独立复查更正架构文档仍指向旧位置的实现fixture，并对最终包内容重新执行
  隔离打包安装；不使用修正文档前的归档作为最终候选证据。
- 产物Worker测试首次只识别Blob，实际正式构建使用百分号编码data URL。增加精确
  data URL解码后执行内嵌算法，保持未知来源断言，不用当前源码冒充产物。
- 一轮浏览器复测提前启动下一轮，共享结果目录被覆盖，导致最后两项trace清理失败；
  下一轮同时遇到端口占用。保留日志，改为一个串行命令，上一进程结束后归档再继续。
- 随后source矩阵154通过、2个WebKit uniform场景超时。trace显示published首次
  Play客户端13.17秒而浏览器动作仅0.39秒；candidate启动/建页/导航合计16.23秒，
  都在插件安装前。16k加载分别0.995秒与2.96秒；published超时后几何断言实际通过，
  但整项仍记失败。证据支持宿主或自动化延迟，不能确认更具体的系统原因。
  其他重型检查结束后，原断言/20秒超时不变，单worker WebKit诊断6项通过；完整
  最终矩阵单独归档，不关闭历史负载疑点，也不以重跑抹去首次失败。

07继续承担持续负载、渲染/资源对比及Mask稳定依赖，08承担完整组合，09承担分发
与文档最终验收。DANMUKU-LOAD-01仍保持待验证；本步不声称npm候选或全部重构完成。
三轮发布复盘、设备/外部SDK证据、全包独立major以及远端CI仍按原计划。

回退：单独revert本任务提交，恢复05/10的JS实现及原类型分发；#958独立修复不回退。
只提交本任务实现、测试、文档和状态，不推送或发布。
