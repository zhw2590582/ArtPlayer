# 文档内容核对跟踪（SITE-04）

这是计划内的文档补全与语义核对，不是用户保留的 REVIEW-01/02/03。任务状态仅由
tasks.json 维护。SITE-01 的 963 条核心声明成员包含继承、重载和 runtime 形状，
标题候选不代表语义覆盖；本表不会把新增插件页面算作完成核心成员核对。

## 已核对的包

| 包 | 对照源码与声明 | 双语指南覆盖 | 保留边界 |
| --- | --- | --- | --- |
| Chapter | [入口](../packages/artplayer-plugin-chapter/src/index.ts)、[区间处理](../packages/artplayer-plugin-chapter/src/chapters.ts)、progress.ts、stylesheet.ts、公开 types、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/chapter.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/chapter.md)：工厂可选参数；Chapters.start/end/title；Option.chapters；Result.name/update；命名类型与 legacy；初始化、原数组修改、同步错误及销毁 | 一次 metadata 初始化；切源需新数据；update 对象必填；没有额外 runtime/destroy 入口；WebKit 停顿和真机缺口未关闭 |
| Ambilight | [入口](../packages/artplayer-plugin-ambilight/src/index.ts)、scheduler.ts、sampler.ts、view.ts、根/runtime/legacy 声明、README/ARCHITECTURE | [中文](../packages/artplayer-vitepress/docs/plugin/ambilight.md) / [English](../packages/artplayer-vitepress/docs/en/plugin/ambilight.md)：Option.blur/opacity/frequency/zIndex/duration；Result.name/start/stop；Callable/Factory/RuntimeFactory；默认导出、默认自引用及历史类型形状 | zIndex 参数忽略、实际层级9；stop保留颜色；仅播放时采样；ready后安装需手动start；无update/destroy；像素可读性、CORS与代理能力分别说明 |

上述说明与当前实现逐项对照，示例取自原 docs/assets/example 文件。Chapter 的空
视图、非法值和破坏性数组更新不能描述成不可变操作；Ambilight 的采样调度不能
描述成播放控制或保证帧率。两包原有实现地图已经描述这些行为，因此没有为了加
站点导航而改动包内实现、声明或分发文件。

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
