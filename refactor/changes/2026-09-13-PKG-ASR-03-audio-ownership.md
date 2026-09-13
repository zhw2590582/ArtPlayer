# PKG-ASR-03：拆分 ASR 并修复音频归属

从 53c295819db004e507b35689a7bdec1955e08396 开始，将单个生产 JS 文件拆成
8 个严格 TypeScript 模块。公共声明不在本任务改写，ASYNC/旧工厂类型与实际安装
消费者仍由 PKG-ASR-04 验收。无新依赖，版本不变，正常构建生成三格式及 docs 副本。

## 结构改动

index 只承担工厂、事件和兼容门面；subtitles 管字幕和隐藏定时器；capture 管代际、
初始化、节拍和回调；audio-graph 管浏览器节点；encoding/sample-queue/worklet
分离纯数据与处理器边界。完整维护地图在包内 ARCHITECTURE.md。

## 独立列明的缺陷修正

- 链式块队列保留不足块及尾部，复制输入且避免重复 concat/shift。编码与 7 个
  历史实现逐字节匹配。每个活动代际只允许一个识别回调，拒绝被捕获且后续可继续。
- 暂停/切源/停止/终止使旧结果失效；旧结果不会解锁新回调。退休 recorder 的
  消息即使已经被外部保留也被身份检查拒绝。首次候选回归发现此消息竞态后修复。
- 初始化去重，取消后不晚建录音图；Worklet URL 在成功、失败和终止路径释放。
  Worklet 模块先准备再绑定 video，失败不会先接管并关闭视频的播放通路。
- stop 清录音/识别任务，保持可再次播放；已有字幕保留原自动隐藏期限，与历史版一致，
  并拒绝旧识别结果新建隐藏任务。直接绑定视频的 context/source/
  播放 gain 由播放器持有，直到 art.destroy 才关闭；pause/stop 保持播放路由。
  捕获流 fallback 属于可释放的采集资源，stop 关闭；切源时重新取得流与音轨。
- destroy 清监听器、节点、流、timer，并禁止通过保留的 append 引用复活。
- 慢回调超过队列上限时明确报错并暂停采集，播放路由保留。上限取 60 秒与两个配置块
  长度的较大值，以支持原本合法的长 interval；有超过 60 秒配置块的回归。不会无限缓存，
  也不声称过载时音频无损；调用者网络请求仍由调用者负责取消。
- 工厂补不可枚举的自引用 default，兼容 2.0 的 require(...).default 及 2.1 的
  require(...) 函数路径；保留键顺序、同步注册、选项快照、字幕 HTML/CSS 行为。

## 为什么 stop 不再关闭 direct context

实际 Chromium 在 close 后经 capture fallback 重启时无法得到非零 PCM；两个核心
组合失败，Firefox 两组合通过。原生探测报告保留在证据文件中，没有把能力失败
抹成通过。Web Audio 规定绑定后的媒体声音走节点图，close 会忽略关联媒体输出；
关闭后不能简单重新绑定节点来恢复。用户公开 stop/play 用法需要可靠恢复，因此
修正内部生命周期，而不删除重启测试或更改公开方法。

子代理独立复核了 [Web Audio close](https://www.w3.org/TR/webaudio-1.0/#dom-audiocontext-close)、
[媒体源节点](https://www.w3.org/TR/webaudio-1.0/#MediaElementAudioSourceNode)及
[捕获流切源](https://www.w3.org/TR/mediacapture-fromelement/#html-media-element-media-capture-extensions)。
保留 direct-first，避免把采样语义和兼容范围改成尚未全面支持的 capture-first。
旧版 close 行为在 ASR-02 历史测试中保留；候选测试要求停止后有播放路由、同一
context 恢复非零 PCM，最终销毁才关闭。初始化尚未绑定 video 时仍立即完整关闭。

## 验证与剩余范围

源代码分包 strict/noUncheckedIndexedAccess、定向 ESLint、正常 main/legacy/ESM
构建通过。历史/纯模块/候选共 210 项，真实 ESM 与副本校验另 2 项；main 与 legacy
各重跑 25 项候选生命周期。浏览器源码全组 12 通过/6 Windows WebKit 能力跳过，
main/legacy 候选各 4 通过/2 能力跳过；没有 failed/flaky。
具体输入哈希、报告、构建与浏览器版本见 [验证记录](../baselines/asr-ownership-validation.json)。

浏览器实际验证：两核心、非零 PCM/WAV、本地回调字幕、暂停恢复、同视频切源、
stop 后恢复及最终 context 关闭。Windows WebKit 无 WebAudio，不能代表 macOS Safari；
真实 fallback 音轨拓扑、音量/静音、跨源媒体、设备仍归 ASR-05。ASR-04 的公共类型和
实际包安装、ASR-06 的示例及发行文档仍未完成，本记录不表示整包已可发布。

仅运行本包、类型、构建和台账检查，未重复整仓全量 CI。两次子代理承担纯音频模块/
回归与规范审查，主代理负责图与控制器集成、浏览器、文档及提交。每项职责已核对。
回退本任务提交可恢复旧源码及构建产物，但会同时恢复已复现丢样本和生命周期缺陷。
