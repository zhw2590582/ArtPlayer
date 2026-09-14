# PKG-DANMUKU-MASK-LOAD-01 真实模型负载下的弹幕调度

状态：本缺陷修复验收完成；完整组合/分发任务仍独立开放。起点
475d38043e917b412018c6851d6a7464ef7bda67。范围为弹幕内部调度及组合验证；
Mask生产实现、MediaPipe模型/SDK、视频尺寸、负载与等待预算不变。

## 缺陷与诊断

原始真实模型矩阵18项12通过6失败，保留在
[原始记录](2026-09-14-PKG-DANMUKU-08-combined-load.md)及
[原始证据](../baselines/danmuku-combined-load-validation.json)。
5项候选120行未完整显示，另1项beta核心负载前行未显示；旧插件也漏显，
不能据此声称是重构引入的回归。

增加只读pending/reserved行快照和显式Chromium CDP CPU诊断入口。
单worker原实现诊断仍失败：120行均已采样，仅68行显示，reserved中62行，
其中52行尚未显示，确认串行放置积压。CPU采样显示SDK结果转换中的
createImageBitmap约5.57秒，二值mask转换约1.01秒，drawImage约0.89秒；
自有调度约15毫秒。这是一次采样的自耗时，不是精确分阶段计时或总成本保证。
调用栈指向MediaPipe转换image/segmentationMask的原有路径；没有替换SDK私有
函数、禁用输出、降低模型/视频尺寸或使用假时钟让负载通过。

## 结构与兼容边界

- `placement.ts`从Worker中原样提取轨道计算。Worker保留旧消息协议；
  scheduler仅在`antiOverlap: false`时直接调用同一计算，消除逐行消息往返。
  默认防重叠模式和内部postMessage仍使用Worker，没有新增公共选项或依赖。
- `sampling-window.ts`拥有连续媒体采样及当前document的visibility监听器。
  自动调度可补回上次已在wait池、尚未被采样而被连续播放跨过的行。
  不追加播放刚插入的过期行，不因跨窗口再次调用已采样的false回调。
  pause/seek/hide/reset等失效、原生seeking、页面隐藏、反向时间和document切换
  切断追赶窗口；销毁释放监听器及保留引用。
- 公开`readys`仍是当前时间±0.1秒查询；公开wait/ready池不被采样模块写入。
  ready优先级、批次身份保留、beforeVisible串行与取消、可见事件顺序、
  显示寿命和已有DOM/CSS/类型/分发入口保持不变。

这是API-04/05/08/11/12边界内的缺陷修复，扩展了PKG-DANMUKU-12只处理
异步等待期间采样的能力。连续播放CPU卡顿后可能出现旧版漏掉的行；
它不承诺跨暂停、seek或后台时段重放，也不承诺无限吞吐量。
架构、维护入口和资源归属同步更新于两个包的ARCHITECTURE.md。

## 验证记录

固定Node24.21.0、YarnClassic1.22.22；没有新增依赖。

- 可控旧红：首批6项4通过2失败，分别复现允许重叠模式Worker积压和CPU跨窗漏显。
- 当前弹幕Node套件275/275通过，包含串行回调、生命周期重入、公开readys不变、
  不重放追加过期行、false回调不额外重试及visibility监听器释放。
  后续增加document迁移用例：旧窗口不追赶、旧监听器移除、新窗口恢复连续采样，
  最终source/main/legacy各276/276通过。直接内部用例仍执行源码，集成用例加载
  指定产物及其实际内嵌Worker，不把所有276项都称为产物执行。
- 首次直接`yarn tsc`错误地进入根`.bin/tsc`所指向的TS5.1.6兼容别名，
  setting-lifecycle闭包收窄产生TS18048。按既有typechecking.md指定的
  `node node_modules/typescript/bin/tsc -p packages/artplayer-plugin-danmuku/tsconfig.json --noEmit`
  使用生产编译器TS5.9.3通过。未修改该源文件或放松strict；TS4.3/5.1的
  消费者兼容与生产源码编译器是不同要求。
- 第一轮修复后真实模型矩阵18/18退出0：9候选完整交付、9冻结旧插件行为观察；
  Chromium/Firefox/WebKit、当前/5.4.0/5.3.1-beta.1核心覆盖。每个候选120行
  完整显示且回收，模型保持运行。

最终结果及实际输入指纹见[机器证据](../baselines/danmuku-mask-load-validation.json)。

| 验证 | 结果与范围 |
| --- | --- |
| 实际模型源码矩阵 | 18通过，9候选完整交付、9旧插件观察；216.28秒 |
| 首次寿命/PiP/时钟回归 | 72通过12失败；12失败全部是候选允许重叠路径零Worker请求与旧测试前提冲突。48项PiP包含32原生播放和16API不可用记录 |
| 扩展两种放置路径后的源码寿命/时钟 | 60通过；48寿命含24候选/24旧插件，12时钟含6候选/6旧插件；114.36秒 |
| main候选 | 39通过：9模型、24寿命、6时钟；162.43秒 |
| legacy候选 | 同范围39通过；160.03秒 |
| Node source/main/legacy | 每轮276通过；内部纯函数仍是源码测试，集成测试加载对应产物 |
| 类型与实际安装 | TS5.9.3严格源码通过；4项类型/实现赋值/编辑器测试通过；实际隔离包12组消费者通过，保留精确旧声明诊断对照 |
| 构建/字节一致性 | 弹幕与Mask三格式构建通过；Mask产物无变化；原轨道函数逐字一致；隔离包79个成员仍匹配当前文件，三份docs/compiled与dist一致 |

源码/main/legacy的27个候选真实模型负载均显示120个唯一行，最终120行wait、
无节点引用、pending/reserved均为空，模型继续输出。原来负载前漏显的beta核心
路径同样通过。全部最终浏览器报告零重试、零跳过；API不可用是独立记录。
浏览器为Windows Chromium153.0.8010.12、Firefox155.0、WebKit26.6。
模型下帧间隔P95仍约79–275毫秒，故这里确认交付完整性，不宣称解决模型帧率
或GPU/WASM性能。公开类型、模型输入、负载和原等待预算未改变。

另一次错误调用把`.mjs`传入只接受CommonJS/UMD的同步VM测试宿主，271项
146通过125失败，语法解析报Unexpected token export，插件尚未执行。
保留该日志；不通过改写ESM字节伪装原生模块执行。test/README.md已明确入口范围。
真实ESM导入由仓库外打包消费验证，完整ESM浏览器分发仍属PKG-DANMUKU-09。

原始日志、CPU profile和各轮浏览器报告归档在refactor/.cache/danmuku-mask-load-*。
首次寿命回归仍假设允许重叠模式必经Worker，该前提已被本修复取消；已保留
原失败并扩展两种模式。防重叠候选仍要求一对真实Worker请求/回复、至少1400ms
受控延迟及至少900ms显示；允许重叠候选要求零请求/回复和至少900ms显示。
旧插件两种模式都仍复现被等待吃掉寿命的缺陷。原寿命断言没有降低。
CPU卡顿用例新增候选全部三行按序显示的断言，旧插件CPU漏显继续独立观察。

## 重跑与回退

实际模型：`yarn test:browser:source test/browser/danmuku-mask-native.spec.js
--grep 'actual model and Danmuku' --workers=2`。main/legacy分别指定存在的
ARTPLAYER_DANMUKU_ARTIFACT和ARTPLAYER_MASK_ARTIFACT文件；报告包含实际输入哈希。
诊断仅Chromium单worker增加ARTPLAYER_MASK_PROFILE=1；正式验收不打开profile。
每轮终止后先归档报告，再运行下一轮，不能混用源与产物证据。

回退本任务的独立提交会恢复原Worker逐行路径及点采样，并重新暴露记录中的漏显。
没有公共类型或数据迁移。完整组合任务08/Mask05、设备、其他包和发布复盘仍独立
验收；本修复不授权push、部署或npm发布。
