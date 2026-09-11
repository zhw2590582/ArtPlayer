# Ads 发布与工作区契约

PKG-ADS-01，源码起点 `bafbf2c8`。来源与全部字节指纹见 [发布记录](ads-release.json)，
可运行 `node --test refactor/scripts/ads-contract.test.mjs` 重新校验。

## 来源和支持范围

本次 registry 观察到 1.0.0/1.0.2/1.0.3/1.0.4/1.0.6，全部五个归档的 SHA512/SHA256、
30 个文件与 manifest 已校验。最后发布版本是 1.0.6；工作区 2.1.0 没有对应 npm 版本。
冻结版本观察不等于未来 latest。版本政策仍按工作区 2.1.0 → 3.0.0，REL-01/09 复核落地。

1.0.6 为主要行为基线；更早归档用于确定公共参数和历史差异，不能把早期重复监听等缺陷
升级为新实现必须保留的规则。五个版本运行时都是 html/video/url，从未实现 source/type。
1.0.6 的 registry gitHead 对应仓库核心 manifest 为 4.5.5，无 plugin peer 或版本检查；
当前源码新增核心 >=5 检查，并把原生 document visibility 订阅换成核心事件桥。
4.5.5 是有来源的旧核心组合候选，实际 npm/core 浏览器验收仍由 05 完成，不能宣称全部 4.x
已支持或以当前未发布源码的版本门槛证明已发布插件也有此限制。

## 公开形状

| 范围 | npm 1.0.6 / 当前工作区 |
| --- | --- |
| 工厂 | artplayerPluginAds(option)(art)，同步返回 name/skip/pause/play；JS 省略 option 可合并默认值 |
| 参数 | html/video/url 默认空字符串；非空 video 优先于 html；图片通过 html 中的 img 展示 |
| 时长 | playDuration=5、totalDuration=10，运行时校验为 number，按一秒倒计时；不得擅自更改广告时长产品规则 |
| 静音 | muted=false；1.0.6 支持初始值及音量按钮，1.0.0 未包含该项 |
| i18n | close/countdown/detail/canBeClosed 四字段，整体浅合并；部分对象不能当作已实现的深合并 |
| 启动 | ready 后订阅首次 play/video:playing，init 只一次；show 后暂停主内容 |
| 视频广告 | loop/playsInline；metadata 后开始倒计时和 play；媒体 error 走 skip；广告时长不等同素材 duration |
| HTML 广告 | 使用调用方 HTML，立即倒计时；不是内置广告服务，不访问实际计费追踪 |
| 结果方法 | play/pause 管理倒计时，未同步暂停/恢复广告 video；skip 绕过按钮阈值并请求主内容播放 |
| 事件 | artplayerPluginAds:skip 与 :click，参数为校验合并后的 option；无 URL 点击广告内容仍 emit click，详情入口隐藏 |
| DOM/CSS | template.$ads、artplayer-plugin-ads 及其 html/video/loading/timer/close/countdown/control/detail/muted/fullscreen 类，style ID 相同 |
| 静态 | 已发布 bundle 的 env/version/build 和 window.artplayerPluginAds；注入一次样式，SSR 无 document 时不注入 |

skip 目前先 art.play，再暂停广告 video、隐藏容器、emit skip。正常用户调用、事件时序与
同步返回需在 02 固定。重复/过早调用、销毁后的工作属于待复现问题，不能从源码有函数
就宣称这些路径可用。options 被重赋给外层工厂变量，复用工厂多实例的身份也需要测试。

## 类型与入口冲突

| 来源 | 声明与实际内容 | 后续 |
| --- | --- | --- |
| npm 五版声明 | export=、export as namespace；html/video/url；totalDuration 错写 string；没有 i18n | 04 保留旧类型消费者接受方式，同时表达真实数字/i18n、工厂可选参数 |
| 工作区声明 | default export；必填 source/type，totalDuration number，没有 html/video/url/i18n | source/type 是已存在的工作区类型接受面，但不是发布 JS 接口；不能据此删旧真实字段或悄悄伪称原本支持 image 类型 |
| npm bundle | Parcel CommonJS 是 {default: factory}，浏览器显式 window 全局；没有 module/exports/legacy 字段 | 06 保留 require(pkg).default/既有 dist 文件路径，并兼容当前 callable/ESM/legacy 入口 |
| 工作区 bundle/manifest | main/module/legacy 三格式、条件 exports；类型路径沿用但内容已变 | 不能将新文件布局直接当作已发布布局；隔离 tarball 消费证明入口 |

实际 npm bundle 的 namespace、全局工厂、静态字段、延迟 ready 注册及结果形状已通过 Node
加载检查。校验器在形状用例中只记录参数/schema；没有模拟真实播放或把校验器桩当成媒体测试。
具体合法/非法值及类型编译矩阵由 02/04 补齐。源文件也在旧归档内，但带 Parcel 专属
bundle-text 导入；私有打包器标识不属于稳定 API，不能把这段 raw source 直接当 Node 入口。

## 风险与执行顺序

- ADS-TYPE-01：公开声明和 JS 输入双向漂移，旧 string 时长的类型兼容与运行时拒绝分开处理。
- ADS-DIST-01：旧 default namespace/路径和当前 callable/exports 不同；保留两侧可用调用。
- ADS-CORE-01：已发布包没有 >=5 门槛；以能力 fallback 和真实 4.5.5/5.4.1/候选核心验证边界。
- ADS-LIFE-01：重复 play 可建立多个计时链，skip 不清计时器，无 destroy 清理；工厂复用、异常/过早调用待测。
- ADS-MEDIA-01：metadata 时序、广告与主内容 play 拒绝、隐藏页媒体状态/换源/错误恢复待测。
- ADS-UI-01：playDuration<=0 初始文案可关闭，但 isCanClose 直到首 tick 才真；全屏按钮图标和外部状态待核验。

上述除实际 export 形状外，运行路径问题先记 source-observed，由 02 复现再在 03 修正。
03 按配置/状态与计时/视图/内容恢复拆分；04 严格 TS 与公开类型；05 真实媒体/旧核心/
多实例；06 demo、文档和完整分发。保持本地广告素材，不触发真实投放、跳转或计费服务。

## 02 执行补充

上述为 01 捕获时的状态。02 已以 58 项 Node 和 66 项三引擎浏览器测试固定正常行为，
复现计时/工厂复用/过早调用/销毁、零阈值及两类播放拒绝问题；三个相关风险保持 open。
实际结果、原始失败和仍待验证边界见 [Ads 验证说明](../ads-validation.md) 及
[02 记录](../changes/2026-09-12-PKG-ADS-02-tests.md)。本步不修改生产接口。
