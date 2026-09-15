# PKG-HLS-SDK-01 分组切换边界与持续播放

来源 HEAD：`f37658d657dc89f4a1597ebd73b311529fc8e012`。任务仍为 doing，
HLS-PLAYBACK-01 和独立的 HLS-CRASH-01 均未关闭。本轮没有生产源码、类型、
依赖、媒体夹具或分发产物修改，没有改变 SDK 所有权或消费者配置。

## 本轮取得的失败证据

原分组集成场景再次复现 Firefox 155.0、Hls.js 1.7.2、发布核心、候选插件组合失败。
SDK 音轨已为 high 组 index 0，但视频高度仍为 90，播放位置停在 0.999146，
paused=false、ended=false、readyState=2、buffered=[]。原 7000ms 高度断言失败，
发生在本次新增持续播放断言之前。该轮四项测试为三通过、一失败，不删失败或重试。

该失败的 SDK error 数组为空。独立 trace 的 42 条媒体夹具请求均返回 200，
最终切到 high 组后继续请求 French 音频，但没有再次请求 high 视频片段。
早期自动选择阶段曾请求 high-01 至 high-05，不能写成整个测试从未请求 high 视频。
这些事实将下一步收窄到加载/缓冲状态转换，但尚不足以认定 SDK 或核心的根因。

失败报告和 trace 保留在独立的 hls-boundary-suite 路径，后续测试使用各自的输出
目录。机器证据包含原始报告指纹、失败附件及从 trace 提取的完整夹具请求序列。
较早 hls-sdk-validation.json 的历史失败保持原样。

## 验证补强

`test/browser/hls-sdk.spec.js` 原先返回 low 后只验证音轨数量与菜单。现在 high 和
返回 low 均要求未暂停、目标高度、媒体时钟推进超过 0.3 秒、额外帧数超过两帧。
没有额外 play/seek/reload，也没有扩大已有断言超时。检查新增观察和播放时间，
因此不能把本轮销毁成功用于关闭此前独立的 Firefox 销毁崩溃。

新增失败现场的 SDK 控制器状态、nextLoadPosition、独立缓冲区及加载/flush 事件。
这些私有字段仅供固定 SDK 的只读诊断，不作为生产依赖或跨版本公共契约。
SDK 销毁后不读取 currentLevel/loadLevel/nextLoadLevel：初版采集在成功销毁后读取
nextLoadLevel 时出现失效 getter，导致诊断附件只有 diagnosticError。该两轮原始
报告保留，最终轮明确检查附件没有 diagnosticError；不把它们当完整状态证据。

## 可重跑对照

`refactor/scripts/hls-sdk-diagnostic.mjs` 增加三个音轨/分组边界：

- `--switch-boundary switched`：默认，保持等待 AUDIO_TRACK_SWITCHED。
- `--switch-boundary selected`：插件宿主等待 UI 显示 French，直接宿主检查 audioTrack=1。
- `--switch-boundary immediate`：同一次页面调用内选择音轨后立即选择 high。

`--prefill` 等待单个原生 buffered 区间到达 duration-0.1；固定夹具视频 12 秒、
音频 12.032 秒，因此允许编码尾部差异。它在初次选择 low 前等待，非 immediate
模式还在选择 high 前等待。该受控对照不修改默认播放器，不是修复或延时兜底。

```sh
node refactor/scripts/hls-sdk-diagnostic.mjs --version 1.7.2 --iterations 3 --switch-boundary immediate --capture-before-destroy
node refactor/scripts/hls-sdk-diagnostic.mjs --version 1.7.2 --iterations 2 --host published --plugin --switch-boundary selected --transport route --observe-workers --capture-before-destroy
node refactor/scripts/hls-sdk-diagnostic.mjs --version 1.7.2 --iterations 2 --switch-boundary selected --prefill --capture-before-destroy
yarn test:browser hls-sdk.spec.js --grep "group changes" --workers=1
```

19 个可读取的诊断迭代通过：早期三种宿主/边界九次；加入双向持续播放后的直接
三次、发布核心两次、候选核心两次、prefill 两次、默认 switched 一次，共十次。
全部使用 Windows Firefox 155.0 和固定 Hls.js 1.7.2。直接模式不加载 ArtPlayer 或
插件。诊断宿主使用报告中哈希的既有 dist，集成用例使用源码选择的候选构建；
本轮不声称重新构建或隔离安装了这些 dist。

最初两轮共八次只打印 passed 后便在 JSON 序列化阶段失败，不能计入上述十九次。
原因是新增 LEVEL_SWITCHING 的 details 为带循环引用的对象；已限定采集标量字段。
不是播放器失败，也没有把未写出的报告认定为成功。

## 最终验证与剩余

最终三引擎分组用例八通过、四 Windows WebKit MSE 能力跳过，无重试；SDK 1.5.17
与 1.7.2、新旧核心均包括在有 MSE 的八项中。原失败之后的中间轮另行保存，不能
用最终通过覆盖或关闭原故障。定向 lint、固定 SDK 来源单测、严格工具链通过。
Node 24.21.0、Yarn Classic 1.22.22；无新依赖，无重打包或远端执行。

见 [机器证据](../baselines/hls-switch-boundary-validation.json)。完整目标仍需要解释
空缓冲且不再请求视频的路径，结合新增控制器/缓冲事件建立更小的可重复案例，
再决定归属与兼容修复；单次或多次通过不能关闭风险。Safari/真机/全部分发与
三轮发布复盘仍按原门槛执行。回退本提交仅移除诊断和验收增强，不涉及运行时。
