# VAST 测试维护

PKG-VAST-03已落实用户确认的两种初始化模式；04按独立类型确认提供准确/runtime。
来源见
[实际契约](baselines/vast-contract.md)、[VAST/SDK归档](baselines/vast-release.json)
和 [核心5.1.7归档](baselines/vast-core.json)。工作区1.2.0不是npm发布版本。

早期03检查点：新增`test/vast-lifecycle.test.js`的15项候选修复断言，冻结工作区全部失败、
当前5个TS模块全部通过；现有测试共60项Node、117项浏览器通过。覆盖终止/回调失败、
初始化回滚、活动广告重建、旧事件、配置getter和SDK同步重入；完整CI900项通过。
该文件已纳入`yarn test:vast`和`test:unit`。实际资源所有权见
[包内架构](../packages/artplayer-plugin-vast/ARCHITECTURE.md)；
[初始化冲突](vast-compatibility-decision.md)当时尚未决定。以下缺陷清单保留历史
来源，不代表候选实现仍包含这些已获可控修复证据的问题；真实IMA验收仍待05。

## 文件与执行

PKG-VAST-04新增`yarn test:vast-types`和`yarn test:vast-types-package`。根声明与
实际npm1.0.0原文一致，/runtime与同一JS产物绑定；TS5.9.3/4.3.5、CommonJS、
NodeNext、Bundler、关闭interop共14组实际安装消费通过。安装后强制frozen重装、
成员哈希与解析路径隔离均检查；14条runtime反例逐行断言错误，不能只统计数量。
主项目`yarn typecheck`也接入根/准确消费样例，baseline测试自动发现vast-types。

编辑器CommonJS生成器补齐旧VAST的内联工厂与局部type；当前global回归npm旧类型，
冻结工作区的SDK生成路径仍独立测试。三真实浏览器的Monaco消费生成声明、拒绝
错误输入，并运行主片解码样例均通过；不执行广告SDK。正式VAST运行回归82通过，
类型/编辑器/工程20通过。见[04记录](changes/2026-09-14-PKG-VAST-04-types.md)。

PKG-VAST-07补回工厂`.default`自身别名，不改变初始化决策。当时`yarn test:vast`
65项通过；实际main/legacy加ESM各4项导出通过。117项三浏览器检查通过，其中候选
异步注册场景使用`.default`，其他场景保留直接调用。浏览器仍替换SDK边界，实际
打包SDK只做无广告的导出/已销毁宿主验证。详见
[变更](changes/2026-09-14-PKG-VAST-07-default-alias.md)。

2026-09-14用户确认默认保留npm语义、显式选择workspace惰性模式。当前Node82项
通过，三浏览器×三核心×四插件实现/模式162项通过（99候选，63历史）。主片解码
是真实浏览器行为，SDK仍受控。首次新增7项Node中5项在原候选失败，修复后新增
10项全过；首轮浏览器153过9失败来自默认模式仍被旧断言当作工作区显隐，原报告
保留。修正为各自历史前缀、监听数和显隐责任，并补充回调开始时资源/数据字段
检查；未删除清理/重建断言。最终源码格式整理后重跑，完整证据见
[03完成记录](changes/2026-09-14-PKG-VAST-03-compatibility.md)。
版本以实际附件为准：npm核心5.1.7/5.4.0、候选5.4.1；早期文档把published路径
写为5.4.1不准确，本轮报告已按来源及实际coreVersion纠正。

- `test/vast-exports.test.js`：源码构建或环境变量指定的实际main/legacy/ESM导出。
  保持现有callable，不宣称复刻旧namespace对象的反射形状；新文件纳入test:vast/test:unit。
- `test/helpers/vast-sdk.js`：可在Node和浏览器使用的SDK记录器，控制加载、构造、
  监听、请求、销毁失败和晚到事件；不实现IMA、广告请求或主片暂停恢复。
- `test/helpers/vast.js`：只在精确的`@glomex/vast-ima-player`导入边界替换SDK。
  当前JS/TS入口可打包加载；两套历史源码必须来自哈希验证的npm归档/Git内容。
  source与source-workspace是相同编译代码，后者显式传第二参数；published字段
  表示行为模式，historical才表示历史代码。浏览器附件记录实际选项，避免混计。
  Node宿主仅提供事件和DOM所有权意图，不模拟布局或视频解码。
- `test/vast.test.js`：共享契约、工作区新增功能、独立的历史缺陷观察。
  修复时为当前候选增加正确行为断言，保留历史缺陷复现，不能把旧缺陷移入共享契约。
- `test/vast-compatibility.test.js`：对照实际npm源码，验证提前初始化、原数据属性、
  SDK默认设置、重复请求、回调拒绝/取消、构造重入、销毁重建及显式模式选择。
  与原生命周期文件一起纳入test:vast/test:unit；后者保留工作区专属getter/四事件
  故障断言，默认模式由兼容文件和共享/浏览器矩阵覆盖。
- `test/browser/vast.spec.js`：三真实浏览器×三核心，测试异步注册、加载失败、真实
  DOM显隐、显式清理重建、主片解码/切源和销毁后晚到初始化。SDK仍是同一受控记录器。
- `refactor/scripts/vast-core.test.mjs`：实际5.1.7 tarball、197成员和发布关联检查。
- `refactor/scripts/vast-contract*.mjs`：VAST及SDK归档、真实发布导出和冻结源码契约。

使用仓库固定Node24.21.0与Yarn1.22.22：`yarn test:vast`、`yarn test:baseline`、
`yarn test:browser vast.spec.js`。Node用例纳入`test:unit`，浏览器用例由常规Playwright
流程发现。8084浏览器运行串行执行；每次报告/完整results先归档再开启下一轮。
所有失败日志保留；不改超时、不加重试、不能把外部SDK受控替换说成供应商服务通过。

## 已复现问题与修复入口

VAST-LIFE-01由源码观察提升为受控运行复现，问题如下：

1. 核心destroy不清理SDK；真实浏览器中旧插件在核心销毁后仍能分配到已脱离文档的player。
2. SDK加载中销毁后仍执行callback并初始化。
3. callback拒绝后已分配SDK和容器保留。
4. callback等待中销毁，恢复后仍可请求广告。
5. SDK构造失败后容器不回滚。
6. 同毫秒多个实例产生重复ID。
7. 工作区活动广告destroy后状态未复位，新的play请求被永久忽略。
8. 工作区晚到SDK回调在destroy后抛错，重建后可污染替代容器与状态。
9. 工作区SDK destroy抛错阻止DOM及引用清理。
10. 工作区事件注册失败后留下不完整SDK，下一次init错误地认为它已就绪。

03已建立生命周期/SDK/DOM所有权，区分可重建的显式广告destroy与终止性的核心destroy。
初始化差异按用户本次独立确认处置；04处理准确类型、SDK声明依赖和同步误声明。
运行时确认没有扩大Ads类型批准范围，也不自动豁免VAST声明兼容。

## 验证边界

这些测试不是实际Google IMA加载、广告加载/播放/跳过/内容恢复的验收，也没有检查
物理移动设备或最终npm tarball。SDK记录器对load错误、constructor错误、destroy错误
使用精确注入；Node固定Date.now用于同毫秒ID复现，未改变生产时钟。

只有实际VAST外部脚本持续因VPN无法加载时，可按用户授权记录并跳过该网络验证；
它不豁免类型、生命周期或其他包。本次未用该例外。05/06和SDK-07继续开放。

## 真实 Google IMA 专项入口

固定工具链运行 `yarn test:vast-native`；可使用 `--project=chromium` 缩小复现。
`playwright.vast-native.config.js` 复用8084隔离服务、单worker、零重试，输出
`refactor/.cache/vast-native/`。此目录在进程终止后归档，再开始下一轮。`.native.js`
命名避免在默认PR受控测试中隐式请求远端SDK；后续CI/发布环境需明确执行此命令。

测试保留实际Glomex打包代码，由其正常加载Google IMA；手写本地VAST响应仅指定
测试广告媒体和本地跟踪图片，不替换AdsLoader、AdsManager、事件或媒体实现。
Google的[AdsRequest接口](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/interface/google.ima.AdsRequestInterface)
提供adsResponse作为广告输入。每项附件记录真实执行的输入、SDK版本、浏览器版本、
广告解码截图、主片播放位置及事件；远端SDK版本会变，结果仅代表对应运行环境。

三核心固定为npm5.1.7、npm5.4.0、候选5.4.1；实际npm1.0.0插件完整bundle通过
归档校验后直接加载，候选两种模式默认使用同一生产构建配置的内存bundle。
设置 ARTPLAYER_BROWSER_ARTIFACTS 后改为核验并加载安装包；config 要求核心、
Chapter、VAST 的安装和源码新鲜度证据，三个 native 文件都保留早期输入身份附件。
历史插件的
SDK清理由夹具在证据后显式补做，不能据DOM被核心移除就认为旧插件拥有SDK清理。
源代码组合通过不等于最终tarball通过，也不等于iOS/Android物理设备通过。

`vast-recovery.native.js`补充候选核心两模式的真实303错误恢复、显式会话重建及
广告播放中核心销毁。当前结果见[05检查点](changes/2026-09-14-PKG-VAST-05-native-checkpoint.md)：
最终组合22/27，恢复6/6；SDK超时/迟到、旧插件首帧及真机未关闭。独立入口失败应
保留为失败，不能用默认受控套件通过抵消，也不能为稳定CI添加宽泛skip。

`vast-skip.native.js`经真实HTTP调用playUrl，只允许IMA来源读取测试XML，验证响应
原文/MIME/CORS及广告解码；等待SDK可跳过事件和可用按钮后点击，断言AdSkipped与
主片恢复。SDK倒计时控件提前有Skip Ad名称，不能只靠名称和visible就点击。
8秒生成视频配5秒跳过点；4秒/1秒素材未出现跳过状态的结果独立保留，不泛化。
最终5/6（另1项9000失败）、共享服务12/12及固定WebKit诊断3/3见
[增补记录](changes/2026-09-14-PKG-VAST-05-skip-checkpoint.md)。媒体采样仅用于
记录，未放宽原首帧断言；三次通过不能覆盖先前间歇失败。

统一安装清单中的 `vast-package.spec.js` 只覆盖完整打包 glomex 的脚本加载、
并发拒绝、重试请求和销毁边界。它通过网络拦截控制失败，迟到成功仅提供空的
IMA readiness 哨兵；不会执行广告。原 `vast.spec.js` 继续替换 glomex 边界，
不纳入完整安装 bundle 声明。真实广告仍必须单独执行上述 native 入口，并按
实际 SDK/网络结果记录。见[安装检查点](changes/2026-09-15-CI-01-vast-installed.md)。
