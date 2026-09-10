# CORE-10 播放与时间/状态属性

状态：完成；本地源码、产物、安装消费和三浏览器检查通过。

## 范围与兼容决策

迁移 toggle/currentTime/seek/volume/playbackRate/played/loaded/state 八个 mixin，增加 media/playback.ts 最小宿主类型；play/pause/playing/duration 已在 CORE-06/09 迁移，本任务继续复验。显示模式实现归 CORE-16，媒体转发归 CORE-11，剩余通用 attr/type 门面归 CORE-20。

保留 API-02/03/04/07：toggle 精确返回当前 play/pause 分支结果；currentTime 保持 parseFloat/NaN 忽略/范围限制；seek 保留原输入事件参数；forward 的 JS 加法与 backward 的减法不互换；音量按原 parseInt 百分比格式且非零才持久化；速率假值重置 1、相同值不刷新通知。played/loaded 在未加载或零时长时可能 NaN/Infinity，不能为了测试方便改成 0。保留捕获媒体引用和 duration 动态读取的差别。

state getter 优先 mini、pip、fullscreen、fullscreenWeb；setter 仅退出其他状态，不主动进入指定状态。未把它变成新的显示模式状态机。

## 类型策略

新增纯类型 PlaybackControls，现有 art 可直接赋给该视图，无转换/代理对象；toggle 返回 Promise<void> | void。原 art.toggle(): void 声明保留，使旧合法赋值继续编译。此为 BASE-TYPE-04 的 toggle 分支兼容方案，plugins.add 及总体公开门面仍由 CORE-21 收口。

发现 BASE-TYPE-08：seek/forward/backward/switch/quality 的运行时描述符只有 setter，读取 undefined；旧公共声明却有数字、字符串或数组 getter。源接口按实际读取值建模，旧公开读取声明暂保留并交 CORE-21，不能凭添加 getter 来伪造兼容。

## 验证与回退

完整证据见 [playback-properties-validation.json](../baselines/playback-properties-validation.json)，含源码、声明、测试、生成编辑器声明和安装包指纹，以及逐项浏览器结果。

| 检查 | 结果 |
| --- | --- |
| yarn ci:check | 145 项：116 单元、4 工程、25 基线；47 个生产 TS 文件严格编译 |
| 属性专项 | 新增 8 项 Node，覆盖转换、通知、存储、范围、描述符、状态和引用 |
| 安装包消费 | 核心/chapter 的 27 项运行时通过，五组类型模式零诊断 |
| UMD 三浏览器 | 195 项通过，无跳过、重试或 flaky |
| legacy 三浏览器 | 195 项通过，无跳过、重试或 flaky |
| 生成声明 | build:ts 重新生成编辑器声明；PlaybackControls 命名导出进入 CJS/ESM/共享类型入口 |

测试入口：test/playback-properties.test.js、test/types/playback-properties.ts、test/types/playback-public.ts、test/browser/playback-properties.spec.js；既有 play/source/canvas 及发布基线全部继续通过。新旧类型消费同时包含旧 toggle:void、命令属性读取赋值和新 PlaybackControls 分支。

没有执行实体设备、远端 CI、完整 fullscreen/PiP 或全部生态包发布验收。本任务不关闭 BASE-TYPE-04/08 的剩余公共门面工作。

专项浏览器首轮 WebKit 的旧/新版本均在 seek 后出现空 buffered 区间，说明“此时必须大于 0”的测试假设不成立。改为与同一媒体的原始 TimeRanges 最后一个区间精确对照，保留空区间检查；非空/多区间公式由专项单元测试固定验证。未修改实现或添加等待来隐藏差异。

完整检查另发现风险台账的负向测试依赖“第一项风险尚未关闭”。CORE-09 关闭该项后，重复设置 resolved 已不是非法操作。测试现在显式移除关闭证据，继续验证无证据关闭必定失败，不再依赖台账顺序或当前完成程度。

未新增依赖或改变锁文件/版本。任务结束单独本地 commit。需要回退时整体回退源码、声明、生成产物和文档；不单独删除类型桥接或源宿主文件。
