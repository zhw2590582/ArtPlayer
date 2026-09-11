# CORE-19 进度、质量、截图与缩略图

## 范围与状态

基线 `98a18000`，分支 `codex/compatible-modernization`。源码和完整任务验收完成；下文分阶段 doing/待验证描述保留历史过程。关联 API-02/03/04/05/08/11/12。

任务开始时，进度与质量已在 CORE-13/17 迁移 TS，本任务复核其计算及边界；截图、缩略图当时仍为 JS。本任务拆出图像捕获和布局计算，明确异步请求与资源归属，保持公共声明、方法描述符、PNG 返回值、截图事件、文件名和缩略图 DOM/CSS。

## 旧实现事实与待验证问题

- screenshotMix 在 Promise executor 内捕获绘制异常，但 toBlob 的异步回调没有异常捕获。空 Blob 或 createObjectURL 异常可能留下 pending Promise；先用受控回调复现。
- getBlobUrl 返回的 URL 交给消费者使用；不能在播放器销毁时自动撤销一个仍被消费者使用的 URL。调用方负责 URL.revokeObjectURL。
- screenshot 等待 getDataURL 后没有检查销毁或换源；需防止晚到截图触发下载/事件，保持已经产生的字符串结果。
- thumbnailsMix 在配置替换后仍接受旧 loadImg 结果；加载失败没有清理 loading 标志。缩放 loadImg 内创建的 Blob URL 无成功释放路径，需明确内部所有权。
- 缩略图历史行列计算需建立固定输入基线并核对生成工具；后续已复现裁剪错误，修复差异见下文，不能作为未声明的布局改动。

## 计划验证

受控 Node 用例覆盖同步绘制、异步失败/空 Blob、并发、销毁和替换。真实浏览器比较发布版/候选版 PNG 内容、截图文件名/事件、跨域失败、缩略图布局与加载顺序；复验质量和进度。严格类型检查、正常构建、实际 tarball 消费和安装产物浏览器检查完成前不标 done。

不新增依赖或更改版本。测试脚本按需接入已有 Node runner。包内 ARCHITECTURE.md 随实施维护。任务完成后独立提交 `refactor(core): CORE-19 type capture and preserve progress lifetimes`；回退该任务提交并按原工具链重建产物。

## 截图阶段实现与实测

- 新增 capture/frame.ts，截图门面迁移到 player/screenshotMix.ts。公共声明不变；绘制仍在调用栈同步完成，避免 await 之后取到不同帧。默认文件名仍读取等待之后的 currentTime，后缀始终追加 .png。
- 异步 null Blob/createObjectURL 失败明确拒绝；同步 toBlob/drawImage 异常仍在返回 Promise 前更新 notice。缺少 2D context 保留 TypeError 类别并提供明确消息。notice setter 自身抛错也变成拒绝。
- 返回 Blob URL 不随播放器销毁撤销，由调用者管理。已捕获结果照常结算，销毁/切源后不下载、不发 screenshot 事件、不覆盖 notice。错误事件监听器的异常仍遵循原 Promise 传播机制。
- 内部截图工具栏用 silencePromise 消费拒绝；公开 screenshot/getDataURL/getBlobUrl 不吞错。发布版工具栏的受控失败每个浏览器产生一次未处理拒绝；用严格 Error 对象身份登记该已知历史错误，不屏蔽其他 pageerror。
- 这是截图阶段的历史记录，随后缩略图已继续迁移；不要把截图阶段证据当成整个 CORE-19 完成。

阶段证据见 baselines/screenshot-partial.json。初始旧代码 7 项中 3 通过、4 失败；候选截图专项扩展到 11 项通过。CI 354 单元 + 4 工程 + 25 基线 = 383 项；202 个生产 TS 严格检查，五组消费者模式通过。源码构建 UMD 的三浏览器截图 39 项通过，无重试、跳过或意外 pageerror；真实跨域使用相同本地服务的不同 hostname，无 CORS 放行。

本阶段不是安装 tarball 验收，没有重建正式 dist/docs 分发产物；对应完整验收仍在本任务中待执行。BASE-LIFE-36/37/38 保持 open，等待任务最终证据。没有新增依赖或修改 yarn.lock，仅将 screenshot.test.js 接入既有 test:unit 脚本。

## 缩略图阶段实施

thumbnailsMix.ts 管理配置代次、缓存、最新悬停位置和控件生命周期；thumbnails/layout.ts 负责纯几何。image/load.ts 复用公开 loadImg 与内部加载，不复制两套缩放逻辑。公开 utils 只继续导出 loadImg，内部 loadThumbnailImage 不加入公开对象。public loadImg 的名称、形参数量、Promise<HTMLImageElement> 和成功 Blob 所有权保留；其内部 onload/onerror 完成后清理。

旧实现首轮 7 项中 2 通过、5 失败。已补到 18 个有效 Node 用例，覆盖配置覆盖、失败重试、控件移除、重复清理、晚到编码、源切换、公开/内部 URL 所有权、空 Blob、构造和 DOM 写入重入。初始基线保留当时的旧裁剪规则断言；进一步核对生成工具后，裁剪回归改为验证正确格子，并用浏览器明确比较旧/新差异。

BASE-DOM-19 的证据来自生成工具 creatScreenshotDate 与真实编号 SVG：生成工具按 `(index % column, floor(index / column))` 排列。旧播放器在 index=column 时选到上一行末格，index=0 时写出双负号 CSS，浏览器保留之前的位置。候选修正这两类显示缺陷；不改参数、DOM、尺寸、缩放、预览边缘定位和 0/1 进度端点处理。

三浏览器缩略图 24 项通过；首次截图/缩略图合并执行 63 项中 Firefox 的重试夹具失败，其余 62 项通过。首次夹具用成功 200 返回错误图像，不能可靠表达临时网络失败；改成明确 no-store 的 503 后，同 URL 第二次请求正常图像在三浏览器通过，不增加等待、不为请求追加 cache-busting 参数。随后还补了缩放 Image 构造中销毁的保护，当前源码需再走整轮检查，最终结果以新的阶段证据为准。

BASE-LIFE-39/40/41 和 BASE-DOM-19 保持 open，等待任务最终安装产物验收。已将 thumbnails.test.js 接入 test:unit；没有依赖或锁文件变化。截图阶段 screenshot-partial.json 保留历史指纹，不能用来代表当前新增图片模块后的全量候选。

在该历史阶段，进度和源 URL 所有权尚待复核；后续实施和实测见下文。

## 截图与缩略图阶段的最终重跑

本阶段实际执行的当前源码检查：`yarn ci:check` 共 401 项（372 单元 + 4 工程 + 25 基线），生产 TS 205 个；公开声明与 HEAD 相比未改动。`yarn test:browser test/browser/thumbnails.spec.js test/browser/screenshot.spec.js` 在 Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6 一次完整通过 63 项，无重试/跳过/意外 pageerror。精确登记了旧截图工具栏每引擎一次受控拒绝；临时 503 是有意网络失败，不宣称控制台没有任何错误输出。

`baselines/capture-thumbnails-partial.json` 固定本阶段源码/测试/夹具/工具链指纹、报告哈希、测试 ID、浏览器版本、候选/发布代码指纹和早期 Firefox 夹具失败。实际候选渲染截图已检查：编号 99 预览在进度右端，符合最后一格与右边缘约束。阶段记录不替代最终安装产物验收，也不关闭 CORE-19。

## 进度、媒体 URL 和清晰度复核

progress/interactions.ts 现在按控件、源、交互动作检查有效性。几何读取和 setBar 回调后重新检查，防止 remove/destroy/切源/新点击重入后继续 seek；旧拖动在切源后停止，新按下可重新开始。position.ts 保留坐标钳制、live 事件和正常 setBar-before-seek 顺序。新增 10 项 progress Node 检查并接入 test:unit。

urlMix.ts 删除对传入旧媒体 URL 的无条件 revokeObjectURL：调用方或 adapter 创建的 URL 由创建方释放。真实 Node Blob fetch 与浏览器换源、销毁后的字节读取对比旧版错误和候选结果。截图、公开 loadImg 与内部 thumbnail/subtitle 的不同资源归属均有独立验证。

质量 selector 增补首个 default、空数组、引用和只写描述符边界。真实点击同时检查源、标签、暂停位置、速率与 customType 参数身份。WebKit 原生事件记录发现首次恢复 seek 接受位置后却落到近零。曾试验等待 seeked 后恢复 rate，以及延后至 canplay 再 seek，均不能单独解决；不能声称 rate 是已证实根因。显式第二次 seek 有效，因此拆出 source/restore-position.ts：等待原生 seek 完成、恢复速率一次、对超过 0.05 秒的偏差最多修正一次，尊重实际钳制目标和用户 seek，并在源失效时停止。第二次也失败时不无限循环，不伪造成功位置。

第一次修正实验还暴露 seeked 监听只消费一次导致 Promise 挂起；监听持续至操作结束后，WebKit 15 项通过。新增受控用例验证第二次 seeked 结算、最多一次修正、用户覆盖、钳制/时钟舍入、getter 重入、同步 seeked 重入只恢复一次。三引擎截图/缩略图/进度/质量/源专项最终源码运行 126 项通过；仍以最终安装产物检查作为任务完成门槛。

原生 Blob 探针同时发现本机 Windows WebKit 26.6 不支持所测 MP4/WebM Blob 样本（错误 4、宽度 0），独立于 ArtPlayer。该引擎仅在此场景证明 HTTP 播放、实际 Blob 赋值和字节所有权，附件标明 decodedBlob=false。BASE-ENV-01 / REL-03 / REVIEW-02 保留真实 Apple 设备验证；不将能力缺口写成通过。Chromium/Firefox 实际解码 Blob。具体矩阵见 environment-matrix.md。

## 最终打包前的兼容补查

run-ECwxyz 安装 UMD 1455 项已通过，legacy 验证期间进一步发现自动修正只识别 seek 事件，会漏掉合法的直接 art.currentTime 写入。补上 media/position-revision.ts，在当前时间 setter 接受合法输入时记录代次；等待期间的直接赋值（包括 metadata 前）和嵌套赋值优先于自动恢复，NaN 仍无操作。专门回归使用真实 currentTimeMix 门面验证两个时序，而不是只验证内部 helper。该补查更改了候选源码，run-ECwxyz 及其 UMD/legacy 结果仅保留为历史证据，不能作为最终发布候选，需重新 CI、打包和安装浏览器验证。

新增原生浏览器重入用例：初次补查在旧候选三个引擎均复现用户写入 4 后又被自动写回 2。代次修复后 Chromium/Firefox 到达 4；WebKit 一次仍结束在约 2，另一次原生 setter 诊断结束在 4。这个重入用例因此把应用契约明确为原生 currentTime setter 序列只有恢复位置和用户新位置两次，禁止第三次写回旧值；完整记录实际时钟/seeked/速率 setter，不把可变原生落点当作应用覆盖的证据，也不宣称任意 native seek 精确度。普通清晰度位置、速率和暂停状态仍由已有独立用例进行真实数值断言，未取消该验证。

采用最终 setter 契约重跑旧候选时，Chromium/Firefox 两项失败、WebKit 一项通过，说明旧缺陷触发依赖原生时序，不能声称 WebKit 每次都会复现。相同用例在新 tarball 的三个引擎均通过。早期数值失败、原生诊断和新旧 setter 契约报告全部保留，并由最终证据记录哈希与各次结果。

run-bmh0dN 首轮完整 UMD 为 1457 通过、1 失败：旧 hotkey 用例尚未按方向键，准备阶段的原生 seek=1 在 Windows WebKit 落到 1.29903，没有页面错误。用例改为直接从真实暂停位置按左右方向键，新增每次请求等于当前位置 ± SEEK_STEP、事件数量为二及真实时间分别增加/减小、seek 完成的断言；保留播放/暂停、音量和 Escape。没有改播放器、放宽原生 seek 容差或延长等待。此 fixture 变更需要最终完整浏览器重跑，原失败报告保留。

## 最终任务验收与交接

固定 Node 24.21.0 / Yarn 1.22.22。CI 421 项（392 单元、4 工程、25 基线）通过，207 个生产 TS 文件（核心 202 + chapter 5）严格检查通过。新增截图/缩略图类型夹具及现有五组消费者模式通过；公开 types 目录未改动。

正式构建后，run-bmh0dN 的实际 tarball 消费通过 27 项运行时和 5 组类型检查。安装后的 UMD、legacy 在 Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6 各完整通过 1458 项，其中各 129 项截图/缩略图/进度/质量/源专项；无重试、跳过或意外 pageerror。已知旧截图工具栏和旧续播拒绝按精确对象身份计入证据，不屏蔽未知错误。原生桌面 fullscreen、可用引擎 PiP 及其余核心回归继续通过。

[最终证据](../baselines/capture-progress-validation.json) 核对当前全部核心源码、包内文件、UMD/legacy/ESM、docs 副本、22 个语言产物、声明和第三方许可；记录测试指纹、报告哈希、原生 Blob 能力与质量事件。中间失败报告保留，不能冒充最终产物结果。

关闭 BASE-LIFE-36 至 44 和 BASE-DOM-19 共十项。BASE-ENV-01、兼容公共类型精确视图及真实设备/多轮发布复盘继续保留；第二次原生 seek 仍不准确时不作无限修正。新增三个单元文件并接入 test:unit，源/组件文件增补关联回归；没有新增依赖、锁文件或版本变化。

当前 214 项：55 完成、159 待办，下一项 CORE-20 收敛入口、初始化与剩余自有 JS。按任务独立本地 commit 交付，不推送、不发布。回退只撤销本任务源码、测试、文档/风险和构建生成产物，保留 CORE-18 及之前交付。

CORE-20 读取入口：src/index.js、player/index.js、player/optionInit.js、config/index.js、storage.js、utils/dom.js、utils/compatibility.js，以及 player 中 airplayMix/attrMix/cssVarMix/typeMix/themeMix/posterMix.js。当前共 13 个剩余自有 JS；libs/screenfull.js 属第三方来源文件，须按既有 vendor 记录处理，不能随手重写为 TS。先核对初始化顺序、静态接口和描述符，再收敛门面类型。
