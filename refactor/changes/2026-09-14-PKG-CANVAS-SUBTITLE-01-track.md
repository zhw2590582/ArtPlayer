# PKG-CANVAS-SUBTITLE-01 Canvas 原生字幕轨道

Canvas-05 的组合检查在三引擎、新旧核心均复现字幕 cues 为零。
核心初始化会检查 textTracks[0]；Canvas 底层 video 没有模板的初始 track，所以
字幕初始化直接返回。仅将后续 appendChild(track) 转给 video 仍是六项失败，
已保留两轮报告，不能把插入路由单独视为修复。

最终方案：底层 video 先创建无 URL 的 metadata 占位轨道以提供原有能力探测；
核心实际 appendChild(HTML track) 时移除占位轨道，把真实字幕交给原生 video。
普通 Canvas 节点操作保持原路径；销毁后不再向底层 video 插入轨道。
新 subtitles.ts 只负责此适配，入口负责初始化失败回滚和整体资源释放。

这是修复原本不可工作的字幕路径。原生 Canvas 返回值、绘制方法、公开类型和
媒体事件不变；实际字幕 track 的 parent 变成 video，已在 README/ARCHITECTURE
明确。仅 active 的 HTML track 插入进入媒体路径，普通节点继续使用绑定 Canvas
接收者的原方法。并未把所有 DOM 方法改为 video 方法，也没有修改消费者配置。
核心负责真实轨道替换、cuechange 订阅和 Blob URL；代理负责底层 video 的释放。
初始轨道创建/插入位于现有初始化 try/catch 内，失败回滚所有私有资源。

## 验证与历史对照

详情、浏览器版本、报告 SHA、加载包入口及摘要在
[canvas-subtitles-validation.json](../baselines/canvas-subtitles-validation.json)。

- 最初源码和仅插入路由两轮各 6 失败；初始轨道修正后 6 通过。
- 扩展原生字幕/Canvas 生命周期 24 通过，覆盖真实 VTT 加载、暂停寻址、字幕
  替换、旧节点断开且只留一个原生轨道、普通 span 插入/移除、Canvas 方法和销毁。
- 仓库外构建/打包/离线安装/冻结重装后，main/legacy 各 33 通过，另含 Ambilight
  组合播放/取色/双 RAF 清理。最后加入历史模式后再次定向 6 通过。
- 真正 npm 1.1.0 同一字幕用例三引擎共 6 失败。设置
  `ARTPLAYER_CANVAS_SUBTITLE_BASELINE=1.1.0` 可重跑；它不允许与 installed map
  混用，且失败不被改写为通过。首次失败的 $track 仍在被替换掉的模板 video 内；
  不能误称它已经被 append 到 Canvas，根因首先是同步能力检查返回空。
- 58 项 Canvas Node 回归，包括初始轨道插入异常后的回滚；17 项实际安装旧/新
  TypeScript 消费者；严格分包 TS、专项 ESLint、根 lint（0 错误/1 既有 warning）、
  6 项风险/runner 测试及固定工具链通过。所有公开声明未变。
- `yarn build artplayer-proxy-canvas` 生成三种 dist 并同步 docs/compiled。四包
  `test:package --include=artplayer-plugin-ambilight,artplayer-proxy-canvas` 的
  36 个运行时/5+8 类型模式仍只针对 core/chapter；不将它们虚报为 Canvas 验收。

本地 Canvas 示例增加现有 subtitle.srt 配置。内置浏览器显示一个 Canvas、底层
video 的 34 条原生 cues，实际播放并显示“星星降落的日子 / 星が降った日”。
UA 报 Chrome/152.0.0.0；该后端不支持完整版本查询或内容导出，截图在会话中。
一次直接诊断 seek 返回 0，未计为 demo 寻址成功；正式寻址证据来自安装测试。
临时标签页已关闭。对示例单独使用普通 Node ESLint 会报页面提供的 Artplayer/
插件全局与编辑器消费的 art 未使用；没有为此改动全局 lint 规则。示例语法和
实际页面验证通过，测试文件自身的 if 样式诊断已修复。

## 兼容、接续和回退

API-07/08 的修复限于原先无法工作的字幕能力与轨道父节点；原接口、样式类、
Canvas 绘制、工厂同步返回和 main/module/legacy/types 入口均保留。没有新增依赖。
后续字幕工作从 subtitles.ts 开始，调度仍归 scheduler/renderer，避免依赖核心私有
实现。运行 `yarn test:browser:installed test/browser/canvas-subtitles.spec.js
test/browser/canvas-lifecycle.spec.js test/browser/ambilight-proxy.spec.js --workers=2`
前提供已验证的四包 map；普通源码模式用 test:browser:source。

Canvas-05/06、Document PiP、真机及完整发布门槛仍未完成；Auto Thumbnail 首帧
问题也未改变。没有远端 CI、推送、部署或 npm 发布。本任务独立本地提交。
回退需一起还原 source、测试、架构/示例、生成产物和任务/风险状态，保留历史报告。
