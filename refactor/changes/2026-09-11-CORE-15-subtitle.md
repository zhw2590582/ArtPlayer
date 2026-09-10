# CORE-15 字幕请求、track 与渲染

状态：完成。以下阶段记录保留当时的进度；当前交付结论以末尾最终验收为准。

## 结构和兼容边界

- 原 src/subtitle.js 拆为 subtitle/index.ts、types.ts、request.ts、parse.ts、state.ts、track.ts、render.ts；字幕偏移 mixin 同时迁移 TS。
- 保留实际 Component 原型链和 update 绑定、url/style/show/toggle/init/switch/createTrack、原生 cue 对象、默认 escape 与 DOM/CSS 行结构。正常转换仍调用现有 SRT/ASS 工具，onVttLoad 的 this 仍为字幕选项对象。
- 正常 switch/init 返回转换 URL；无 textTrack 返回 null；空 URL 返回 undefined。字幕切换仍基于 art.option.subtitle 合并，不静默把上一次 switch 的临时配置变成默认值。
- 内部准确声明 SubtitleCue[]。旧公开声明及 CORE-07 的显式数组监听重载保持；旧隐式 scalar 回调冲突仍由 BASE-TYPE-07 / CORE-21 协调。

## 已复现问题和修正

三个真实浏览器引擎分别对发布基线和迁移前候选执行受控异步请求。HTTP 响应由测试控制，track/Blob/DOM 为原生浏览器对象。不是网络可靠性或实体设备测试。

1. 旧 first 请求晚于 second 完成时覆盖后者，notice 也回到 first；已加入请求代次及 AbortController，过期结果不再写页面。
2. 销毁后，旧请求仍生成 Blob 并替换 track；请求归实例作用域，关闭时及时以 undefined 结算，即使 fetch 忽略 signal 也不等待它。
3. 旧代码替换字幕时撤销调用者传入的 Blob URL，却未在销毁时撤销最后的自建 URL；现在仅释放自己创建的资源，原生全屏 track 重建保留当前资源。

这些异常竞争路径按缺陷修正处理。主动调用 switch/init 的真实错误仍拒绝；构造和 url setter 没有可接收的 Promise，内部处理拒绝，避免已显示 notice 的失败再成为未处理异常。HTTP 非成功响应在生成 track 前报告错误，具体新旧对照及错误回归仍在补齐。

render.ts 在 before 事件后检查代次，防止监听者切换/销毁后旧渲染继续写入；正常回调修改 cue 文本仍在同次渲染生效。track.ts 持有 onload/cuechange 清理，失败安装尝试恢复旧节点。复杂重入和清理异常仍需补齐测试后才能验收。

## 阶段证据

- 初始浏览器复现报告 core15-baseline-browser.json：首轮 notice 断言包含模板空白导致额外三项失败，已保留，未作为通过证据。
- 修正后的 core15-baseline-corrected-browser.json：18 项中，发布基线 9 项确认旧缺陷；候选 9 项按目标行为失败。修改源码前生成。
- 第一批 core15-first-browser.json：30 项三浏览器通过，含上述生命周期路径和既有声明契约。
- 第一批严格类型及五组消费者检查通过：135 个生产 TS 文件；后续代码和新增用例仍需重新检查。
- Node 新增请求取消/异常/能力缺失、解析及偏移共 9 项通过。
- 最终产物、原生全屏、完整浏览器回归和失败路径证据待补充。

## 依赖、脚本和后续

不增加依赖。test:unit 将加入 test/subtitle.test.js；仍使用 Node 24.21.0 / Yarn Classic 1.22.22。不修改公开类型、版本或 lockfile。本任务完成后独立本地提交，不推送/发布。

需继续审查：track 事件错误与原生全屏、重入/清理失败、代理无 textTracks、cue/偏移组合、产物与安装消费。源码、测试、文档一起回退，不覆盖 BASE 历史发布证据。

规范参考：[HTML TextTrack 模型](https://html.spec.whatwg.org/multipage/media.html#text-track-api)规定 disabled 模式 cue 列表可为 null；内部 getter 对此返回空数组。真实设备 Safari/iOS 能力仍需按全项目环境矩阵验证。

## 最终验收

- 七个字幕 TS 模块及字幕偏移 mixin 完成，核心 130 个与 chapter 5 个生产 TS 文件严格检查。旧公开声明保持，内部明确 cue 数组与 string/null/undefined 返回。
- yarn ci:check：210 项通过（181 单元、4 工程、25 基线）；新增字幕 Node 10 项覆盖取消、错误、能力缺失、解析、偏移及属性失败后的作用域释放。
- 实际核心/chapter tarball 仓库外安装：27 项运行时、五组类型零诊断。最终安装 UMD 和 legacy 各 600 项三浏览器通过，其中各 81 项字幕检查；无重试、跳过或未处理页面错误。
- [最终证据](../baselines/subtitle-validation.json)核对当前全部核心源码与构建快照、三个分发格式与 tarball/docs、公开类型、包内架构说明、22 个语言文件及独立分发许可。
- 真实 native fullscreen 在三个桌面引擎执行进出与字幕 DOM 检查；另外驱动 WebKit 视频全屏信号验证 metadata/subtitles track 重建、旧 handler 清理及 URL 保留。这不是实体 iOS 验证。
- 插入失败恢复旧 track；注册重入保留胜出的 track；旧清理抛错后保留已提交新资源。标签属性抛错立即释放本次作用域。HTTP 失败、实际 native track 失败、disabled cue 列表、转换重入和空 URL 取消均有覆盖。
- Node/cue 身份与默认 escape、SRT/ASS 转换 this、样式返回、show/toggle 事件、偏移原始时间和旧 cue 数组事件均保留。正式 TYPE-07 出口还在 CORE-18/21；不把保留的历史公开声明说成全部精确。

### 验证中发现并保留的失败

- 最初 notice 文本包含模板空白；断言改为 trim 后保留旧缺陷/候选失败对照。VTT 空白行在 Firefox 是 cue 分隔符，改用有效 VTT，并直接改变原生 cue 文本验证空行过滤。
- WebKit 原生 cue 改文案后会暂时更新 activeCues，改为等待真实字幕行就绪后读取结果；没有放宽最终行文本或样式断言。短暂 notice 通过实际 setter 完成后的 DOM 写入记录验收，避免错过自动隐藏的提示；没有替换真实 setter。
- 第一次安装 UMD 全套 600 项通过后，额外修正属性失败作用域释放；最终重新构建/安装，UMD 与 legacy 都基于新包再验证。旧结果仅作阶段证据。
- 两次 Windows copyfile UNKNOWN（分别复制 mjs/js 到 docs/compiled）保留日志。磁盘/权限/独立复制检查未复现根因；后续串行正常构建通过，未修改依赖或跳过分发复制。

关闭 BASE-LIFE-15/16。当前 214 项中 51 完成、163 待办；下一项 CORE-16 全屏、PiP、mini 与尺寸模式。全生态 SDK、实体设备、远端 CI、多轮复盘和发布门槛仍按原计划继续。本任务独立本地提交，不推送或发布。
