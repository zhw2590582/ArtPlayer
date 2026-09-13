# Danmuku Mask 历史契约与 SDK-08 证据

任务 PKG-MASK-01。依据 [真实归档](danmuku-mask-release.json) 与
[原始 npm 响应](danmuku-mask-registry.json)，捕获时全部稳定版为 1.0.0、1.1.0。
冻结工作区提交为 `b0cfbfe3a09a84a295a257e45e4577847588d1cb`。
源码文本以 LF 归一化；tarball、成员、已有模型资源均按原始字节计算哈希。

## 发布来源与公开形状

两版各有六个实际归档成员：README、manifest、main/legacy/module 三种产物和声明。
四个 manifest 入口以及 root/legacy exports 目标全部存在。源码由 `.npmignore`
排除；不能声称 npm 包含源码。1.1.0 六个成员与冻结工作区对应文件完全一致。

| 项目 | npm 1.0.0 | npm 1.1.0 |
| --- | --- | --- |
| registry gitHead | `b36f88db5f7fe0250285fd4f47229842231f402b` | `daf133b22630b4a0eecfa3336bbddab0e9119d96` |
| gitHead 的插件 manifest | 1.0.0 | **1.0.1**，与发布版本不一致 |
| 同提交核心 manifest | 5.3.1-beta.1 | 5.3.1 |
| 实际 CommonJS main/legacy | 对象的 `.default` 工厂 | 直接工厂，无 `.default` |
| 实际 script main/legacy | 全局 `artplayerPluginDanmukuMask` 工厂 | 同名工厂 |
| module | `.mjs` 中 default export | `.mjs` 中 default export |
| 声明 | optional option、同步注册结果 | 与 1.0.0 字节一致 |

核心版本仅是 Git 关联，不是已经通过的兼容矩阵。main/legacy 的 CommonJS 与 script
导出已用实际归档字节在隔离 VM 验证，包括不启动模型的注册/stop；module 这里只做
成员与文本形状核实，尚未完成真实安装 ESM/NodeNext 消费。较早来源源码的额外
`window.artplayerPluginDanmukuMask = ...` 已在冻结工作区移除；归档全局仍保留。

公开工厂 `artplayerPluginDanmukuMask(option?)` 同步返回 registrar；registrar 同步
返回 `{ name: 'artplayerPluginDanmukuMask', start, stop }`。`start(): Promise<void>`，
`stop(): void`，两版声明均如此。Option/Result 未作为命名导出发布。后续类型工作应
保持最新完整工厂赋值和 NodeNext 旧模块形状，遵守统一类型政策；旧 CJS `.default`
调用是实际合法 JS，不能因为最新声明没有属性而删掉兼容路径。

## 源码参数与样式

参数在 registrar 调用时快照为内部 config，之后修改原 option 不会重读。默认值：

| 字段 | 默认值 / 合并规则 |
| --- | --- |
| solutionPath | `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation`，`||` |
| modelSelection | 1，`||`，传 0 仍为 1 |
| smoothSegmentation | true，仅 undefined 使用默认，false 保留 |
| minDetectionConfidence / minTrackingConfidence | 各 0.5，`||` |
| selfieMode / drawContour | 各 false，`||` |
| foregroundThreshold | 0.5，`||` |
| opacity | 1，`||` |
| maskBlurAmount | 3，`||` |

这些是**插件传给适配器的值**，不是所有参数都对模型有效。源码始终指定
`runtime: 'mediapipe'`、`modelType: 'general'`；先尝试 `tf.setBackend('webgl')`，
仅 rejection 时尝试 `cpu`。这不能证明 MediaPipe 自身推理切换成 CPU，也不能把
`setBackend` fulfilled false 视为已执行 fallback。

registrar 捕获 `art.template.$video/$danmuku`，订阅 ready→start、destroy→stop。
必须在 Danmuku 插件建立 `$danmuku` 后注册；demo 正是先 Danmuku 再 Mask。
start 建立 2D canvas 并设置 `$danmuku.style`：maskMode=alpha、maskSize=contain、
maskRepeat=no-repeat、backgroundSize=contain、backgroundRepeat=no-repeat。
每轮以视频固有尺寸推理，白色前景/黑色背景生成 binary mask，drawMask 后将 RGB
三个分量均 **>250** 的像素 alpha 置 0，以 canvas PNG data URL 写入 maskImage。
值等于 250 的边界不透明。stop 只写 maskImage=none 并取消所记住的一次 RAF；
其余样式不恢复。没有额外 public 事件或插件自建可见 DOM。

## SDK-08：锁文件、适配器和模型资源是不同来源

| 依赖 | manifest 范围 | 冻结 Yarn / 当前安装 |
| --- | --- | --- |
| @mediapipe/selfie_segmentation | ^0.1.1675465747 | 0.1.1675465747 |
| @tensorflow-models/body-segmentation | ^1.0.2 | 1.0.2 |
| @tensorflow/tfjs-backend-cpu | ^4.21.0 | 4.22.0 |
| @tensorflow/tfjs-backend-webgl | ^4.21.0 | 4.22.0 |
| @tensorflow/tfjs-converter | ^4.21.0 | 4.22.0 |
| @tensorflow/tfjs-core | ^4.21.0 | 4.22.0 |

范围、resolved、integrity、已安装 manifest 哈希、适配器关键文件哈希均在 JSON。
它们约束本仓库安装，**不约束消费者重新解析的依赖，也不约束默认 CDN URL**。
没有查询 CDN latest、下载远程模型或从 bundle 中猜出完整历史 TensorFlow 版本。
归档中出现 MediaPipe `VERSION` 字符串不等于整套 SDK/模型链已经认证。

body-segmentation 1.0.2 的
`dist/selfie_segmentation_mediapipe/segmenter.js` 已按已安装字节冻结。它以
`config.modelType` 映射 `general → modelSelection=0`、`landscape → 1`；不读取
插件额外传入的 `config.modelSelection/smoothSegmentation/minDetectionConfidence/
minTrackingConfidence/selfieMode`。构造时 selfieMode=false；segmentPeople 的
flipHorizontal 参数另有处理，而插件未传这个参数。后续不能直接把模型参数接通
当作等价重构；需先记录效果变化及兼容决策。

该 adapter 的 locateFile 去掉 solutionPath 尾部斜线再拼资源文件名。已安装
MediaPipe JS 选择 SIMD/普通 wasm loader、graph binarypb、general/landscape tflite，
loader 再加载 WASM 等资源。插件默认目录未带 `@version`，Yarn 固定 JS 依赖不能
固定这条额外下载链；自定义 solutionPath 必须继续保留。

demo 指向 `/assets/@mediapipe/selfie_segmentation`，注释要求从 node_modules 拷贝。
仓库已存在 **12 个文件**，package.json 为 0.1.1675465747；冻结 Git 中全部文件与
当前 node_modules 同名文件字节一致，包括两个 tflite、两个 wasm、loader JS、
binarypb、data、README/声明/manifest。未新增或执行这些模型；这是本地字节一致性，
不是对其获取链的独立真实性认证，也不是模型输出、离线网络闭包或 GPU 释放验证。

## 有依据的后续风险

| ID | 已确认事实与最小触发路径 | 归属 / 证据等级 |
| --- | --- | --- |
| MASK-LIFETIME-01 | start 等待初始化或一次推理期间 stop/destroy 不使异步工作失效；后续 continuation 仍能写 mask 并再排 RAF。没有 segmenter.dispose 或事件 off | 02 复现、03 修复；源码路径确认，尚非原生模型复现 |
| MASK-START-01 | start 无 pending/running 守卫；并发启动可重复初始化，已初始化的多次 start 可建立多条 RAF 链，只有一个 animationFrameId | 02/03；源码路径确认 |
| MASK-MODEL-01 | 插件声明/传参和已安装 adapter 实际消费不同，general 始终选择 0；零值受历史 OR 默认影响 | 02/04/05；适配器文本确认，默认/零值有受控源码测试 |
| MASK-BACKEND-01 | WebGL 仅 rejection 时 fallback；MediaPipe runtime 与 TF backend 不等同；createSegmenter rejection 被吞掉后仍能进入等待 RAF | 02/03/05；源码路径确认，真实降级未验证 |
| MASK-DOM-01 | 缺少 Danmuku、2D context 或视频可读帧时无完整前置保护；CORS getImageData 失败被 catch 后下一轮继续 | 02/03/05；需受控失败及真实浏览器复现 |
| SDK-08 | 默认无版本 CDN 与 Yarn 安装分离；本地资源一致不证明真实模型、设备、跨源、断网与资源释放 | 05/06；保持开放 |
| MASK-NOTICE-01 | 当前 SDK manifest 标 Apache-2.0；两版 plugin 归档只有六个文件，无独立第三方通知，抽查 module bundle 无 Apache/Google copyright 字面标记，顶部只有项目 MIT | 06；需核查完整嵌入来源和通知义务，不作已获授权/合规结论 |

## 重放与边界

使用固定 Node/Yarn 环境：

```sh
node refactor/scripts/danmuku-mask-contract.mjs
node --test refactor/scripts/danmuku-mask-contract.test.mjs
```

verifier 校验缓存 tarball SHA512/SHA256、全部成员/入口、原始 registry 快照、Git
来源关系、冻结 Yarn 解析与已安装 SDK/已有资产字节。缓存缺失时只从固定 npm
tarball 地址恢复插件发布包。测试六项：归档关系、两版声明、八个真实 main/legacy
CJS/script 导出探针、受控自有源码默认/零值/像素边界、SDK-08 证据。
导出探针执行 bundle 顶层注册但不启动模型；源码行为探针用 TF/MediaPipe 替身。
没有远程模型请求、真实推理、设备、浏览器播放、npm 安装矩阵或发布验证。
