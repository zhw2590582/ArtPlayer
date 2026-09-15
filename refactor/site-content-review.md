# 文档内容核对跟踪（SITE-04）

这是计划内的文档补全与语义核对，不是用户保留的 REVIEW-01/02/03。任务状态仅由
tasks.json 维护。SITE-01 的 963 条核心声明成员包含继承、重载和 runtime 形状，
标题候选不代表语义覆盖；本表不会把新增插件页面算作完成核心成员核对。

## 已核对的包

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Chapter | [入口](../packages/artplayer-plugin-chapter/src/index.ts)、[区间处理](../packages/artplayer-plugin-chapter/src/chapters.ts)、progress.ts、stylesheet.ts、公开 types、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/chapter.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/chapter.md)：工厂可选参数；Chapters.start/end/title；Option.chapters；Result.name/update；命名类型与 legacy；初始化、原数组修改、同步错误及销毁 | 一次 metadata 初始化；切源需新数据；update 对象必填；没有额外 runtime/destroy 入口；WebKit 停顿和真机缺口未关闭 |
| Ambilight | [入口](../packages/artplayer-plugin-ambilight/src/index.ts)、scheduler.ts、sampler.ts、view.ts、根/runtime/legacy 声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/ambilight.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/ambilight.md)：Option.blur/opacity/frequency/zIndex/duration；Result.name/start/stop；Callable/Factory/RuntimeFactory；默认导出、默认自引用及历史类型形状 | zIndex 参数忽略、实际层级9；stop保留颜色；仅播放时采样；ready后安装需手动start；无update/destroy；像素可读性、CORS与代理能力分别说明 |
| Document PiP | [入口](../packages/artplayer-plugin-document-pip/src/index.ts)、window-session.ts、projection.ts、根/legacy 声明与 exports、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/document-pip.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/document-pip.md)：四个配置默认值；name/isSupported/isActive/open/close/toggle；document-pip 事件；Option/Result/AsyncResult/Factory/RuntimeFactory | 旧 void/可写类型与实际 Promise/只读 getter 分开；没有 runtime 子路径；用户激活、降级视频 PiP 不计会话、取消/迟到窗口/销毁、样式复制与真实设备限制 |
| ASR | [入口](../packages/artplayer-plugin-asr/src/index.ts)、capture.ts、subtitles.ts、encoding.ts、根/runtime 声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/asr.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/asr.md)：六个配置；PCM/WAV；name/append/hide/stop；根与 runtime 命名类型、回调和模块入口 | 模拟示例不是识别；第一声道、串行回调/积压上限/陈旧结果；HTML 不自动转义；stop 可重启且保留直接播放图；捕获流/CORS/独立音轨/静音边界，不声称真机已验证 |

上述说明与当前实现逐项对照，示例取自原 docs/assets/example 文件。Chapter 的空
视图、非法值和破坏性数组更新不能描述成不可变操作；Ambilight 的采样调度不能
描述成播放控制或保证帧率。两包原有实现地图已经描述这些行为，因此没有为了加
站点导航而改动包内实现、声明或分发文件。

Auto Thumbnail 和 Multiple Subtitles 的本次核对：

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Auto Thumbnail | [入口](../packages/artplayer-plugin-auto-thumbnail/src/index.ts)、options.ts、extraction.ts、session.ts、video.ts、根/runtime 声明、README/ARCHITECTURE；核心 thumbnailsMix/layout | [中文](../packages/artplayer-vitepress/docs/plugin/auto-thumbnail.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/auto-thumbnail.md)：url/width/number/scale/忽略height；name；异步注册；Option/Result/Factory/RuntimeFactory | truthy默认值、十列与时间公式、渐进JPEG、原对象延后读取、独立解码/CORS、分阶段超时/清理、无完成API；Windows WebKit首帧未解决。维护说明的版本句改为区分初始迁移和当前major准备 |
| Multiple Subtitles | [入口](../packages/artplayer-plugin-multiple-subtitles/src/index.ts)、request.ts、merge.ts、render.ts、lifetime.ts、根/runtime 声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/multiple-subtitles.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/multiple-subtitles.md)：五个TrackOption字段、subtitles、multipleSubtitles.name/tracks/reset、全部根及runtime命名类型 | 并发下载/延后元数据、未调用onParser、未知名称同步错误、空选择/原序reset、共享escape和URL归属、整cue显示、取消结算；注册不等待宿主加载，无自动菜单/重下载，根按npm1.2形状 |

## 接续范围

- 核心：依据 site-inventory.json 的 963 条成员逐项或按明确的共享声明分组核对；
  必须记录对应文档及语义结论，不能仅按同名标题匹配标为通过。
- 已有 Danmuku、HLS、DASH、Audio、VTT 双语指南：继承各 SITE-* 任务的证据，但
  仍需在本轮全包核对中检查其当前声明、示例和能力边界。
- 其余插件、两个 proxy、两个 tool：包内 README/ARCHITECTURE 不能替代缺失的
  双语使用说明。按实际能力分组补入口，不机械复制维护文档。
- SITE-05 和 EX-03 负责后续完整页面与实际 demo 验收；静态内容核对不等待真机，
  也不能据此关闭真机、外部 SDK、发布或复盘门槛。

生成文件继续由 build:docs/build:llm 写入；新 HTML 必须登记 demo-additions.json，
使用 introducedAfter 记录制作之前的真实提交，不能虚构尚不存在的引入提交 SHA。
源码、Run Code 片段、类型检查、生成页面、本地链接及实际浏览器证据随变更记录维护。
