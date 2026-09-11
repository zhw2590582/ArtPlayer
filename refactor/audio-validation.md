# Audio Track 行为与媒体测试

PKG-AUDIO-02；公开来源见 [1.1.0 契约](baselines/audio-track-contract.md)，
固定执行结果及失败保留见 [验证记录](baselines/audio-validation.json)。

## 已实现命令

```sh
node --test test/audio-track.test.js
yarn ci:check
yarn test:browser test/browser/audio-track.spec.js --trace on
```

Node 专项 38 项：源码和真实发布 main/legacy/module，初始化/延迟安装、暴露 audio、
严格阈值、正负偏移、seek/播放前同步、playing 条件、waiting/pause、音量/静音/倍率、
同/空/新 URL、三处 play 拒绝、销毁和多实例隔离。Audio 是记录调用的受控对象，不模拟解码。
工厂输入跨 realm 检查使用冻结归档，源码使用既有 JS/TS loader，可随迁移继续回归。

真实浏览器最终 36 项通过，无重试、跳过：每引擎 8 项新旧核心/插件播放及失败恢复，
1 项原生 WAV 诊断、1 项旧插件空 src 销毁问题、2 项不同核心的原生暂停/结束缺陷观察。
因此 36 通过不代表 36 项无缺陷的候选功能验收：9 项复现历史问题，3 项是原生能力诊断。
旧核心固定 5.4.0、旧插件固定 1.1.0；候选来自源码构建，非隔离安装包。

播放证据包括主视频实际解码颜色、媒体时钟、AAC 音频加载/时钟、偏移 seek、倍率/音量、
音频切源后的同一元素及同步、503 加载失败后换源恢复。公开 audio 的事件、状态、
原始 warning、代码/媒体/核心产物指纹随测试附件保存。不声称已经测得扬声器输出或音画主观同步。
Node 控制 waiting/playing 与 play 拒绝；实际浏览器网络缓冲/自动播放策略和移动环境由 05 补充。

## 样本与失败归因

test/browser/media/audio-tone.m4a 是本地生成的 16 秒 440 Hz 单声道 AAC。
生成命令、FFmpeg 版本、ffprobe 及哈希见旁边 audio-tone.json，测试重验哈希。
服务器沿用已有 GET/HEAD/Range，增加 audio/mp4 MIME；无外网音频依赖。
WAV 诊断使用整数方波，完整参数/哈希冻结。直接原生 Audio（未创建 ArtPlayer）在
Windows WebKit 也给出错误 4；AAC 矩阵通过不能覆盖该 WAV 或真实 Safari 的能力。

初轮 24 失败及后续诊断均保存，没有覆盖成绿灯：

1. 测试先用了 currentTime setter；它不发 seek 事件。修正为已有公开 art.seek，未修改核心。
2. 旧插件 src='' 后 readyState=0、paused=true，但 currentSrc 可能保留且 error=4。
   正常基线清理检查属性/暂停/就绪状态，另立发布版缺陷断言，不把旧错误当作已修复。
3. WAV 在 Windows WebKit 失败；用无播放器原生 Audio 对照隔离，并增加独立 AAC 测试输入。
4. 最初 AAC route 固定返回 200 全文件，seek 返回 0；改用现有 Range 服务器，验证 seekable
   覆盖目标再 seek。没有增加超时或移除实际 seek 断言。
5. Windows WebKit 视频尺寸可能反映布局，既有 browser/README.md 已说明；播放证据改为
   固定样本的真实解码像素，保留已知尺寸限制，未改媒体实现。

最终源码/夹具都无生产行为变动。一次完整 CI 577 项（534+11+32）、254 个生产 TS 通过，
最终新增的浏览器观察经定向 lint 和三引擎验证。所有失败报告/trace 均复制到独立 cache 目录，
冻结 JSON 保存摘要、输入和关键状态；cache 丢失时应重跑，不能称旧 trace 仍存在。

## 后续修复与交接

- AUDIO-LIFE-01 已由旧版受控/实际媒体复现：保留的 update 可复活 src；src='' 触发新媒体错误。
  03 应使用关闭守卫、插件自身订阅清理和无错误的媒体释放；保留同一公开 audio 及同步 update。
- AUDIO-SYNC-01 部分已复现：主视频直接 pause 或播放结束，外部音频仍播放；03 修复原生事件同步。
  负偏移起点/时长边界、真实缓冲和快速切源仍须在 03/05 接续，不能以本次通过关闭全部条目。
- AUDIO-TYPE-01/DEMO-01 继续由 04/06 处理。归档分发、Monaco/8082 与设备验收尚未完成。

浏览器测试均共用端口 8084 和输出目录；不要同时执行多个 suite。开始下一次前复制报告
和结果目录（包含 trace），并记录对应测试输入。Node CI 可独立并行执行。
