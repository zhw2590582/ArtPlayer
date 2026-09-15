# SITE-AUDIO-01：独立音轨双语指南与原样示例验收

基线 `6af43208af43d3ecbaee3ee0049e237b4b23c117`。从 SITE-04 拆出独立指南任务，
依赖已完成 SITE-03/PKG-AUDIO-04；SITE-04 全部旧依赖保留并追加本任务。
没有修改 Audio Track 实现、声明、dist、依赖、版本或原 demo 代码。

## 文档与契约

新增 plugin/audio-track.md 及 en/plugin/audio-track.md，侧栏改为本地指南。
旧外部编辑器 URL 保留在完整示例链接中；两份 Run Code 的代码均从实际
docs/assets/example/audio.track.js 原样取得，由浏览器测试开头强制比较。

对照 src/index.ts、track.ts 与现有公开声明，指南说明：

- 音频目标时间=time+offset，严格大于sync阈值才同步；offset/sync部分更新
  不会立即触发seek。只替换不同且非空的url，相同/空url不作为reload/stop。
- update同步返回undefined，实际audio元素身份保持；换主视频不会自动换音轨。
  需要媒体加载证据时监听原生事件，不能await update当作加载Promise。
- 独立音频跟随播放/等待/seek/暂停/结束、音量、静音和倍速；不自动去除主视频
  原声。art.muted会同时影响两份媒体，只有无原声音源才能直接避免混音。
- 活动实例播放拒绝仍warn；销毁释放自己的订阅和音频加载，保留的update不复活
  音源。应用添加的audio监听器仍归应用，没有新增插件destroy方法。
- 根入口和/legacy保留旧必填url推导，/runtime为相同实现提供准确部分更新类型。
  编辑器全局的显式RuntimeFactory选择、未发布状态和真实设备范围明确。

两份严格TS片段只用公开入口，零诊断。边界值并未重新设计；文档说明浏览器媒体
边界与缺少采样级同步/循环/补静音能力，不虚构这些功能。包README/架构、站点
维护README及浏览器说明同步更新，避免仅在迁移记录中留下知识。

## 真实验证

Node24.21.0 / Yarn1.22.22 / TypeScript5.9.3 / Windows。

| 检查 | 结果 |
| --- | --- |
| 两页原样TS片段 | strict NodeNext，types:[]，skipLibCheck:false，各0诊断 |
| 生成HTML本地链接与Run Code | 每页21个本地链接目标存在、1个Run Code，库参数正确 |
| site-loading/documentation-pipeline | 17 pass |
| test:site-build | 7 pass，使用Yarn上下文 |
| lint、build:llm、build:docs | 通过；产物由生成工具写入 |
| 浏览器首轮 | 11 pass / 1 fail；WebKit旧核心即时读像素为黑帧 |
| 浏览器最终 | 12 pass / 0 skip / 0 retry：6实际媒体生命周期＋6双语导航/Run Code |

document-audio.spec.js 使用真实插件dist与新旧核心。原demo URL请求在本地改写为
Range服务的H264测试图与AAC/MP4音调，保持原代码与配置；不替换Audio、播放方法、
媒体属性或解码结果。音频文件按已有manifest核对sha256，视频身份由服务器
manifest附带。验证主视频非黑像素、双方时钟推进、原生暂停、0.25秒offset seek、
音量/倍速/静音跟随、更换音频URL后继续播放、元素身份不变、销毁及迟到update。
音频静音执行，不把媒体时钟推进当成物理扬声器发声或长时同步测量。

首轮在时钟>0.3秒后只即时读取一次画布，WebKit一例仍为黑帧。最终改为在原有
7秒expect轮询期限内等待实际非黑像素；没有改像素条件、扩大超时或跳过浏览器。
首次失败及trace保留，不称为修复了生产WebKit问题。最终 Chromium153.0.8010.12、
Firefox155.0、Windows WebKit26.6的新旧核心媒体路径均完成后续全部断言。

8082内置浏览器tab12加载原站点媒体，观察到原audio.track代码、10:29主视频时长、
loadedmetadata/loadeddata/canplay/canplaythrough。页面仍暂停00:00；未执行播放
点击或证明独立AAC发声，工具未返回浏览器版本。该观察仅算真实demo加载，不能
替代上述自动化或物理设备验收。

完整来源、原/最终日志与报告哈希、逐例状态及TS/链接摘要见
[audio-docs-validation.json](../baselines/audio-docs-validation.json)。

## 状态与回退

SITE-AUDIO-01完成；SITE-04、PKG-AUDIO-05/06、原有缓冲/设备/发布门槛不变。
站点34 Markdown/43 HTML，中英各17页；210 done、21 doing、43 todo，共274。
提交前检查计划、风险、风险测试、站点清单、LLM/站点产物和严格工具链。
生成HTML及原样复制的demo代码空白按原始内容保留；不手改生成产物来消除空白。
完整staged diff --check报告10处行尾空白：两份新HTML的模板空行4处，原样示例
在两份Markdown及LLM语料中的offset/sync行6处。排除这五个已核对文件的其余
变更检查通过；不将完整空白检查记为通过，也不因此改写原demo或手改生成文件。
回退本任务移除新增指南/导航/测试并恢复对应生成文件，不改变插件的公开行为。
没有新增依赖/脚本、推送、部署或发布。
