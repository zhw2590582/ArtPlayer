# 全生态迁移规范

完整的逐包、逐步骤计划在 [plan.md](plan.md)，基线入口和 demo 在 [package-inventory.json](package-inventory.json)。每个包都有独立任务 ID，不用一个“迁移所有插件”的任务代表完成。

## 每包六步

| 步骤 | 内容 | 交付物 |
| --- | --- | --- |
| 01 契约 | 核对源码、声明、README、真实发布包与 demo | 公开 option/result/events/static/入口及差异表 |
| 02 测试 | 捕获现有可观察行为、边界、资源和错误流程 | 可重复运行的旧行为用例与固定样本 |
| 03 内部整理 | 抽离该包具体职责、补资源归属和过期任务处理 | JS 内部改造及缺陷的独立变更记录 |
| 04 类型迁移 | 自有生产源码 TS 化、声明生成、旧类型兼容 | 严格类型模块和消费者类型测试 |
| 05 集成 | 在最终重构核心、旧支持范围核心、组合场景验证 | 浏览器、旧调用方式和资源清理证据 |
| 06 分发 | 验证 tarball、产物/资源路径、文档与示例 | 分包交付记录、版本/回退建议 |

复杂包可以把任一步拆成新子任务并保留依赖。每步不要求一次提交解决全部；默认按一个可回退行为边界切分。

六步同时受 quality-contract.md 约束：步骤 03 交付清楚的职责与依赖，步骤 04 不能仅改扩展名，步骤 05 验证有风险的真实行为，步骤 06 验收包内实现地图与维护命令。包内架构文档从实现开始同步维护，不能只在最后一步补写。

## 各包重点

| 包 | 重点与特殊边界 |
| --- | --- |
| artplayer-plugin-chapter | 时间区间、进度条 DOM、hover 与 update；适合作为简单插件试点 |
| artplayer-plugin-ambilight | canvas 取色、RAF、暂停/销毁和跨域画布错误 |
| artplayer-plugin-audio-track | 外部 audio 与主视频的时钟、seek、buffering、倍率、音量和自动播放拒绝 |
| artplayer-plugin-auto-thumbnail | 异步插件、隐藏 video、seek 抽帧、Blob URL、切源后旧任务和取消 |
| artplayer-plugin-vtt-thumbnail | VTT 区间/xywh/相对 URL、预览定位、请求和定时器清理 |
| artplayer-plugin-hls-control | 实际 level/audio track、Auto、过滤和去重、旧 selector 名称、源拓扑变化 |
| artplayer-plugin-dash-control | representation ID、ABR/手动状态、过滤、排序与已有回归用例 |
| artplayer-plugin-multiple-subtitles | VTT/SRT/ASS 合并、排序、同名轨道、onParser、异步返回形状；保留 multipleSubtitles 名称 |
| artplayer-plugin-jassub | 保留 result.instance 和选项透传；worker/WASM/font 路径及销毁，vendored JASSUB 不顺带重写 |
| artplayer-plugin-danmuku | 加载/过滤/调度/轨道/DOM/设置/heatmap/worker 分开；保留 emit/load/config/show/hide/reset/mount 和静态 icons |
| artplayer-plugin-danmuku-mask | 分割模型加载、CPU/WebGL fallback、推理并发、启停竞态和 GPU 资源；不擅自升级模型或改变阈值 |
| artplayer-plugin-asr | AudioContext/Worklet/MediaStream、PCM/WAV 分块、回调背压、停止及字幕；不增加网络 ASR 服务 |
| artplayer-plugin-ads | 源码 html/video/url 与现有声明 source/type 等差异先核实；保留倒计时、跳过及主视频恢复语义 |
| artplayer-plugin-vast | 异步 SDK 加载、callback 上下文、IMA Player 生命周期、广告结束/错误后的内容恢复 |
| artplayer-plugin-chromecast | SDK loader、会话、媒体元数据、重复实例、不可用设备/拒绝；设备检查与 stub 分开 |
| artplayer-plugin-document-pip | DOM 跨 document 移动、样式复制、焦点/键盘/全局事件重绑、窗口关闭/销毁还原 |
| artplayer-proxy-canvas | video-like surface、原 canvas 方法、事件转发、绘帧、回调和 document PiP |
| artplayer-proxy-mediabunny | VideoShim/MediaBunnyEngine/AudioEngine/VideoEngine/input/m3u8/EventTarget 分层；ready 顺序、音画同步、HLS 配对和资源释放 |
| artplayer-tool-thumbnail | 当前声明目标文件不存在；exports/module 指向 .esm.js，统一构建输出 .mjs，先核实已发布包，保持旧路径可用 |
| artplayer-tool-iframe | commit/message/inject 协议、请求 ID、Promise、销毁和 origin/source 边界；历史公开拼写保留，安全修改独立评估 |
| artplayer-vitepress | 中文/英文原始文档、运行示例、声明注入、插件文档、链接与构建；不手改生成目录 |

以上是代码清点形成的验证重点，不代表已逐一复现缺陷。

## 代表性组合

| 组合 | 必测场景 |
| --- | --- |
| 核心 + HLS/DASH + chapter/thumbnail | 清晰度/音轨切换、进度状态、Auto、换成无对应轨道的来源 |
| 核心 + danmuku + mask | 暂停、seek、倍速、全屏、模型失败及反复启停 |
| 核心 + multiple-subtitles/JASSUB | cue 时间、偏移、切源、全屏和字幕资源释放 |
| 核心 + audio-track/ASR | 主视频与外部音频、缓冲、AudioContext 生命周期及重复挂载 |
| 核心 + ads/VAST | 广告完成/跳过/失败恢复内容；使用本地 stub 或官方测试资源，避免真实计费跟踪 |
| 核心 + document-pip + canvas/MediaBunny | 节点迁移、ownerDocument、全局事件、关闭后正常播放 |
| 多实例 + 任意可组合插件 | mutex、独立 DOM/样式/资源归属，销毁一实例不影响其他实例 |
| 原生 JS / React / Vue + 旧插件 | 不改用户调用完成挂载、更新、卸载、再次挂载 |

不是所有插件两两组合都必须支持；BASE 阶段登记已有支持组合，REL 阶段覆盖高风险组合。明确不支持的组合有理由和文档，不能把测试未覆盖等同于不支持。

## 资源与依赖

大模型、外部 SDK、worker/WASM、字体和视频文件的来源、版本、许可、下载时机和可配置 URL 都要记录。CI 中将确定性 adapter 测试和真实服务/硬件验证分开。升级供应商 SDK 与内部 TS 迁移分开执行，尽量固定一项变量。
