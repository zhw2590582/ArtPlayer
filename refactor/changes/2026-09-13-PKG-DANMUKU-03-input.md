# PKG-DANMUKU-03 加载、解析和配置重构

弹幕生产源码已开始分层：`config.js`负责默认值、schema、变化比较与归一化；
`input.js`负责输入形式、替换/追加归属及取消；`bilibili-parser.js`保持原XML转换；
`bilibili.js`负责网络、解析Worker及资源收尾。原`danmuku.js`保留队列提交与事件出口，
`index.js`保留同步门面。包内[维护地图](../../packages/artplayer-plugin-danmuku/ARCHITECTURE.md)
和README说明这些边界。此步使用JS拆分，完整TS/Worker消息/公开声明归06，不能将本步
描述成整个弹幕包已完成TS迁移。

## 保持的契约与明确修复

- `load/emit`仍返回Promise并解析为内部Danmuku，区别于同步门面；绑定方法、getter、
  属性顺序、`config/hide/show/reset`同步返回身份和`mount`的undefined结果保持。
- 空数组初始化仍在注册返回前发出show/config/reset/loaded；非空数组在首次await前
  插入第一项，其后逐项await emit。过滤器接收当前option为this，加载函数无显式receiver。
- 无参数load成功获取输入后替换；显式load追加且不修改配置。并发追加彼此独立，也可
  在替换后继续追加。逐项错误仍保留此前已接受项，并由load发一次原始error再拒绝。
- 修复旧替换迟到覆盖新替换；新替换只使旧替换失效。销毁取消所有加载。取消的公共
  Promise成功解析为同一内部实例，不发迟到loaded/error、不写队列；外部Promise仍可
  运行，但其拒绝有局部观察。可用时abort fetch，不依赖AbortController才能正确取消。
- 在reset、filter及异步返回后检查归属。只检查当前嵌套emit任务，允许旧filter里同步
  发起的新替换正常写入，再阻止旧调用续写；不是把旧任务的取消状态传给整个嵌套调用栈。
- `time:0`保持0，负值钳位0，缺省为currentTime+0.5；原输入对象补mode/style/color后
  过滤及浅复制行为仍保留，未借修复时间顺便更改所有对象身份。
- 单独更新函数配置现在生效，Promise按身份更新，普通结构相等项仍保持静默。先校验
  临时合并值再提交，非法配置不污染当前option。初始Promise输入与既有声明对齐。
- fetch/text拒绝不再因async Promise executor悬挂；公开load保留拒绝，自动初始load
  在实例内观察拒绝并console.warn。空XML正常结束，解析Worker失败沿相同parser降级。
  成功/降级/协议错误/取消均清理Worker与Blob；其中一项清理抛错仍尝试另一项，原业务
  错误优先。原XML实体顺序、模式、未补齐颜色与数值转换保持，不引入HTTP状态硬拒绝。

## 初始化闭环与审查结果

为了捕获初始show/config/loaded中同步销毁，提前建立destroy订阅并在入口跳过后续
Setting/heatmap创建。非法配置或初始轨道Worker构造失败回滚提前订阅并重抛原错。
新增测试实际发现旧resize解绑身份错误；本步最小修正为解绑实际this.resize，避免
初始化已销毁仍留监听。Setting既有DOM/计时器、RAF/轨道算法与heatmap没有在本步重写。

三代理分工为源码、输入测试、解析测试，父代理负责审查、真实浏览器、构建及整合。
只读复审也独立指出Worker构造失败的提前订阅泄漏，修复后通过同一原错及零新增监听
断言。没有修改冻结历史helper或把候选修复反写进旧版证据。

## 验证与失败证据

- 冻结旧契约44项及旧失败42项，共86项父代理复跑通过。
- 候选20项输入/配置/初始化和26项解析/取消/错误测试，源码、正式main、正式legacy
  各46项联合通过，共138次；严格子进程确认自动加载已观察、公开load仍拒绝。
- 原生浏览器：3种实现×2核心×4场景×3引擎，共72项通过，无跳过或未处理页面错误。
  核心为真实已发布5.4.0及候选5.4.1；Chromium、Firefox和Windows WebKit。
  成功路径断言收到实际Worker回复，不能让fallback掩盖压缩后函数脚本失效；故障场景
  单独替换原生解析Worker脚本为抛错脚本，确认局部错误处理、真实fallback与资源回收。
- 使用仓库正常build生成main/legacy/esm及docs/compiled对应产物；ESM本步为构建通过，
  不把它计入三组运行用例。改动文件lint及全仓typecheck通过，后者检查366个已迁移
  生产TS文件与消费者矩阵，未迁移JS不算TS覆盖。

产物单测首轮main/legacy各41通过5失败：测试在工厂前注入parser Worker故障，产物
inline Worker查全局Worker时误伤了初始轨道Worker；source夹具先捕获构造器而未显露
此问题。将parser专用故障移到正常初始化和flush之后，原清理/原错断言全部保持；
三组各26解析复验和最终各46联合复验均通过。原失败日志保留且机器报告引用哈希，
不把这五项错误测试归为新增生产缺陷。初始化泄漏的红测则确有源码修复。

完整输入指纹、构建文件、日志、浏览器版本和原始附件见
[机器证据](../baselines/danmuku-input-validation.json)。未新增依赖或改动Yarn锁文件，
根`test:unit`与`test:danmuku`加入候选测试，浏览器沿用既有CI发现规则。

## 后续范围

INPUT-01与CONFIG-01在本步关闭；ASYNC-01只完成输入/解析子项，待04/05的可见性续体、
轨道Worker及单RAF所有权。TYPE-01待06真实安装声明矩阵，CLEANUP-01只修resize部分。
此前真实轨道重叠、heatmap零采样和Setting资源问题保持开放；72输入浏览器通过不代表
它们被修复。04继续时钟/队列/轨道，05负责渲染/设置/热力图，06完整TS，07做稳定性验收。
本地XML及故障夹具不是Bilibili实网、CSP矩阵、Safari设备或长时负载验收，也不是npm
发布就绪证明。本任务独立commit，无推送、标签或发布。
