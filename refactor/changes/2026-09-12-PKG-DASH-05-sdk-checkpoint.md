# PKG-DASH-05：真实 DASH SDK 与本地媒体验证检查点

起点 `6840544e`。本批新增真实 SDK/媒体测试与来源证据，没有修改生产实现、公开声明、
依赖或版本。05 保持 doing，不把浏览器能力缺口或尚未解释的播放停滞计为完成。

## 输入与执行

- 固定实际 npm dash.js 4.5.2 与 5.2.1，归档 SHA512 integrity/SHA256，保存运行脚本、
  package.json、原始声明和 BSD-3-Clause 许可证成员指纹。SDK 仅供测试，未复制进生产包。
- 新增 `scripts/generate-dash-fixture.mjs`：FFmpeg 合成 12 秒、90p/180p、英语 440 Hz/
  法语 880 Hz AAC 的本地 DASH。三种 MPD 分别为双画质双音轨、纯视频、单画质纯视频。
  31 个资源逐字节校验，生成器拒绝覆盖已有目录；MPD 强制 LF，m4s 作为二进制。
  MPD 保留生成时移除音轨/画质节点留下的空白节点，Git 对此类夹具关闭行尾空白提示，
  不手改已运行的 XML 字节或重新写指纹；此例外不适用于源码与其他文件。
- `test/browser/dash-sdk.spec.js` 加载真实 SDK、发布插件或候选插件、新旧核心，在真实
  Chromium/Firefox/WebKit 执行。测试控制栏选择、Auto、实际解码视频尺寸与时钟、
  外部 SDK 选择后的同步 update、换源菜单拓扑、旧回调与调用方 SDK 销毁所有权。
- 原生对照不创建 ArtPlayer/插件实例，直接用同一 SDK、video、媒体、缓冲配置执行
  画质/音轨与暂停 seek。页面仍加载核心脚本，另断言 Artplayer.instances 为零。
- 每例附 SDK/插件/媒体来源、输入指纹、能力、轨道/画质、媒体缓冲区、事件时间、片段请求
  和浏览器 trace。报告与整个 results 目录在下一次套件前归档到独立缓存。

## 失败原因与证据边界

首轮 24 项：10 通过、8 失败、6 跳过。6 个能力探针的失败来自测试主动 destroy 未 initialize
的 SDK：实际 4.5.2 源码 destroy → reset → attachSource(null)，后者要求已初始化。
探针只读取版本/能力，不创建媒体资源；已移除错误的未初始化销毁，实际播放用例仍验证销毁。

其余两项分别出现在 Chromium 候选核心/发布插件与 Firefox 发布核心/候选插件的 SDK 4.5.2
组合：暂停后 seek 到 6 秒无法推进。trace 证明 AbortError 在测试超时后的销毁才出现，
不能把它当成停滞起因。补充诊断后 24 项为 17 通过、1 失败、6 跳过；Chromium 停滞复现：
视频缓冲终点 5.999999 秒，time=6、paused=false、seeking=true、readyState=1，未请求
下一段视频，SDK 错误列表为空。SDK 音轨 rendered 事件已先于 seeking 到达，不能简单
归因为“没有等音轨切完”。DASH-SEEK-01 保持 open。

原生初始对照、增加缓冲终点接近 6 秒的前提后各 6 项为 4 通过、2 跳过，均没有复现停滞。
这些通过不能证明 ArtPlayer 是根因，也不能关闭此前新旧核心组合的失败。后续应继续比较
SourceBuffer 与 video.buffered 的范围、SDK 调度和暂停/seek 顺序；不得仅增大超时、偏移
seek 目标或吞掉未处理异常来制造通过。

外部 update 与换源首轮 24 项为 8 通过、8 失败、8 跳过。8 个换源失败源于测试保留了
registry 的可变 option 对象；Component.update 会 Object.assign 修改它，调用到的是新
回调。改为在换源前保存实际函数和旧 selector item；定向重跑 12 项为 8 通过、4 跳过。
验证真实 SDK 连续切到无音轨、单画质、原拓扑，旧回调不改变新 SDK，四次 SDK 生命周期
由调用方恰好销毁四次。没有据此修改生产组件更新语义。

正式 main 整套 54 项为 36 通过、2 失败、16 跳过；两个失败是 Chromium 新旧核心/发布插件
的同类 SDK 4.5.2 seek 停滞。候选组合本轮通过不能关闭首轮 Firefox 候选插件失败。
完整 `yarn ci:check` 717 项通过（661 单元、14 工程、42 基线），261 个生产 TS 严格检查通过；
它不包含该浏览器套件，不能把本地工程检查通过表述为全部浏览器通过。生成器整理参数后
在新目录重建，31 个资源与冻结字节全部相同；只证明同一 FFmpeg/主机下本次重建。
已查看候选核心/main/SDK 5.2.1 的 Chromium 播放截图，6 秒画面和 Auto/fr 控件显示正常。

最终 main 执行和 CI 摘要见 [机器证据](../baselines/dash-sdk-checkpoint.json)。所有早期报告、
trace 和结果目录均保留；本地缓存未上传，换机器应重新执行。后续通过不覆盖开放失败。

## 后续范围与回退

当前 217 项：74 done、4 doing、139 todo。DASH-05 仍需完成停滞排查、实际 SDK 类型消费者、
SDK 驱动状态刷新/错误和播放组合、legacy 正式产物与有效 MSE/设备环境验证。
原有同步 update 已通过实际 SDK 对照；当前插件不会自动订阅 SDK 状态变化，自动刷新是否
增强及其订阅/重入/销毁规则需单独验证，不能从显式 update 的通过推导自动同步已实现。
06 继续实际 8082 示例生命周期与完整隔离分发，版本升级和全项目发布复盘按总计划执行。

本批为独立本地 checkpoint，不推送、不发布。回退只移除这批测试、合成媒体、生成器和记录，
保留 01～04 已完成的源码、兼容声明与验证。新增基线测试纳入已有 test:baseline/ci:check。
