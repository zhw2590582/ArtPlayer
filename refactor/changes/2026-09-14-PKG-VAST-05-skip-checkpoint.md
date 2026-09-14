# PKG-VAST-05：playUrl、真实跳过按钮和失败分层

前置HEAD75da50a45。本次继续05，保持doing；生产源码、公开类型、依赖和产物没有
变化，不把测试夹具修正包装成播放器缺陷修复。全部原报告和新证据见
[vast-skip-validation.json](../baselines/vast-skip-validation.json)。

## 新增的实际覆盖

`test/browser/vast-skip.native.js`在候选核心的两种VAST模式下调用playUrl，真实IMA
iframe通过HTTP读取广告XML，核对200、MIME、CORS与响应原文；广告实际解码后，
等待AdSkippableStateChanged和可用的SDK按钮，真实点击，再验证AdSkipped、主片
恢复及销毁。没有调用模拟事件、强制隐藏广告、伪造时间或通过skipAd替代UI。

[Google AdsManager接口](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/interface/google.ima.AdsManager#skip)
明确限制：当IMA自己显示跳过按钮时，程序skip方法不负责跳过。因此本项直接测试
SDK按钮。观察到的SDK为3.789.0，浏览器与前检查点相同。

`vast-fixture.mjs`生成8秒pattern.mp4广告、5秒跳过点、独立本地跟踪图片；
`server.mjs`增加一个测试XML映射及XML MIME。仅这个资源允许明确的http/https
imasdk.googleapis.com来源并返回凭据CORS和Vary:Origin，不给其他路由统一加CORS。
正常PR套件只服务该本地资源，不自动运行外部SDK测试。没有新增依赖或脚本。

## 实际结果与失败记录

| 批次 | 结果 | 原因或实际范围 |
| --- | --- | --- |
| 4秒素材，首次HTTP标签 | 0/2 | 测试服务缺少CORS，真实iframe请求被拒绝；主片继续播放 |
| 补CORS，仍用4秒/1秒跳过点 | 0/2 | 广告真实完成但没有跳过状态/按钮；没有推断所有短广告都不支持跳过 |
| 8秒/5秒素材，旧按钮等待 | 0/2 | 1项SDK9000/标签等待超时；1项在倒计时已暴露的Skip Ad控件上过早点击 |
| 等待真实可跳过事件和可用按钮 | 5/6 | 三引擎两模式；Chromium默认项收到9000后虽完成跳过/恢复仍判失败 |
| WebKit旧插件媒体采样诊断 | 3/3 | 预先固定3次执行、无重试；未修改原首帧断言，不关闭历史失败 |
| 既有播放/切源/错误/Range回归 | 12/12 | 三引擎、新旧核心；验证共享测试服务未破坏已有路径 |

所有浏览器进程退出后才读取最终JSON/归档，记录实际退出码。SDK加载和广告请求
超时仍保持失败，没有提高SDK默认5秒/10秒预算；HTTP响应等待由默认整例30秒
收紧到7秒以更快暴露资源读取失败。首三轮失败用于修正可定位的夹具问题，不作为
成功证据；未反复运行相同断言直到变绿。最终5/6不是完整兼容通过。

## 旧WebKit首帧问题的新增证据

上个检查点的失败trace里，主脚本和bridge都返回200，AdStarted之后有实际
“Linear Ad”画面（画面时钟00:00:00,12），随后AdComplete/主片恢复也发生了。
它不能再被表述为没有播放广告；但当时首帧video属性断言为何始终不成立仍未确定。
`vast.native.js`现在保存每次采样的currentSrc/src、尺寸、时间、readyState和paused，
原判定不变。固定三次诊断都通过，不能覆盖旧失败或宣称间歇问题已修复。

## 后续与回退

专项只读lint、plan/risk-register生成与检查通过；风险/浏览器runner工程测试6通过，
固定Node24.21.0/Yarn1.22.22严格工具链检查通过。git diff --check通过。没有为
该测试改动重建生产包；上一步运行时、类型与分发文件保持原样。

更新包架构、维护说明和风险/进度，05仍doing。下一步是SDK9000后迟到广告的可控
真实SDK复现与处置、历史首帧观测差异、物理iOS/Android验证及06分发。不能把这些
环境门槛拖延其他依赖已满足的源码任务。没有修改用户VPN/浏览器保护，也未使用
VAST脚本加载豁免。该检查点可独立回退；未push、未发布npm。
