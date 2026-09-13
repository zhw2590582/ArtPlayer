# ASR 发布契约

PKG-ASR-01 于 2026-09-13 固定 npm 2.0.0、2.1.0 的实际归档，每包 6 个成员。
[来源与逐文件指纹](asr-release.json)另保存工作区提交的 9 个 Git 文本输入。
运行 `node --test test/asr.test.js refactor/scripts/asr-contract.test.mjs`：32 项通过。
首次下载使用固定 npm URL；缓存后离线复核 SHA-512、SHA-256、成员与历史 Git 输入。

## 支持范围与入口

- registry gitHead 对应核心 manifest 为 5.3.1-beta.1 / 5.3.1；这是来源关联，
  不是已完成这些核心的播放器组合验证，更不是最低核心版本声明。
- 两个发布包没有 engines/peerDependencies；工作区 2.1.0 不等于发布 tarball。
- main/legacy 可在 CJS 读取并作为普通 script 暴露 artplayerPluginAsr；2.0.0 的 CJS
  是只有 default 可枚举成员的对象，2.1.0 是无可枚举成员的函数。测试同时断言这些
  原始形状，再从函数或 default 成员取得工厂；迁移必须分别保留历史调用路径。
- 两个实际 ESM 文件均在无 DOM 环境导入，仅导出 default，调用工厂仍不创建音频资源。
- 旧 TS 工厂替换和安装消费者验收归 PKG-ASR-04；不能以本次
  VM 运行通过替代实际 tarball 安装验证。

## 公开行为

| 项目 | 既有行为 |
| --- | --- |
| 工厂 | option 可省略；在调用工厂时解构，之后更改 option 不影响注册 |
| 默认值 | length=3、interval=100ms、sampleRate=16000、autoHideTimeout=10000ms |
| 注册 | 同步创建 name=asr 的 layer，返回 name/stop/hide/append；无公开 start |
| 事件 | 注册 video:volumechange、play、pause、destroy；播放事件启动采集 |
| append | 同步返回 undefined；非字符串忽略，字符串替换全部内容 |
| 行拆分 | 按 、。！？!?. 断句，trim/filter，保留最后 length 段；length=0 保留全部 |
| 内容 | div.art-asr-line 包裹，通过 innerHTML 接受 HTML；不能静默改为纯文本 |
| hide | 只隐藏显示，不清内容；下一次字符串 append 恢复并重置自动隐藏定时器 |
| stop | 实际返回 Promise<void>，调用完整音频销毁；保留播放订阅，可随后重启 |
| 样式 | 模块加载时按 artplayer-plugin-asr ID 去重；沿用 art-layer-asr/CSS 变量 |

32 项测试包括两个发布版本的 main/legacy、冻结源码以及冻结工作区 main/legacy，
分别观察 CJS/global 工厂、返回值、选项快照、字幕行为、样式去重；另有归档与 ESM 检查。
冻结源码用 esbuild 转换，仅把 LESS import 换为测试字符串；该项不验证真实 CSS 编译。
真实发布和冻结工作区 bundle 使用其实际内嵌样式。

## 已发现的差异及后续处理

1. 两版及工作区声明把 stop 写成 void，onAudioChunk 写成 void | Promise<void>；
   实际 stop 是异步，并等待回调结果交给 append。类型迁移需保留旧函数赋值能力，
   补充精确异步消费，不能只改返回类型就宣布兼容。由 PKG-ASR-04 处理。
2. 源码每次 tick 取队列再截断，未满一块的样本和超过块长的尾部均没有放回；
   这是源码事实，PKG-ASR-02 用准确 PCM 样本序列复现，PKG-ASR-03 修复。
3. 初始化最后才置 started；停止及异常清理依赖 started，addModule 失败没有 finally
   回收 URL；停止不能使在途回调失效。PKG-ASR-02 复现后再作独立生命周期修复。
4. pause 后 sourceNode 仍存在，而 setupAudioSource 仅在不存在时直接返回节点；
   再次启动可能进入 captureStream 分支。需验证重复启动与恢复，不能只测一次播放。
5. README 误写 Ads；本次改正包功能描述。demo 使用外部 ASR HTTP/WebSocket，服务
   不是本包依赖或已验证能力。本包只产出 PCM/WAV，不请求麦克风，也不自带识别模型。

## 下一步与限制

PKG-ASR-02 建立 PCM/WAV、Worklet 消息、失败、乱序和资源的受控回归；PKG-ASR-03
拆分字幕、编码、队列和音频资源职责；PKG-ASR-04 完成严格 TS 与旧消费者。
PKG-ASR-05 使用本地媒体与本地 onAudioChunk 验证真实 WebAudio/Worklet、音频持续性、
新旧核心与三个浏览器。WebAudio mock 不代替实际音频/采样率/静音/CORS/设备验证。
本任务没有运行真实识别服务，不增加依赖，不改生产源码/分发版本。
