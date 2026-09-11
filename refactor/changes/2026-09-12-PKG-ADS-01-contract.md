# PKG-ADS-01：Ads 实际发布基线

从 `bafbf2c8` 开始核对 Ads。发现工作区 2.1.0 未发布，实际 npm 仅五个 1.0.x 版本，
最新观察为 1.0.6。已下载并校验所有五个归档、30 个成员，记录原始 manifest、Git 关联、
源码/声明/样式/README 差异。初始采集错误地假设 2.1.0 存在且有 mjs，读取失败；
随后依据 registry 版本列表和实际 tar inventory 修正，没有生成假的 2.1.0 发布基线。

五版运行时始终为 html/video/url，当前声明的 source/type 并非已发布参数；旧声明还将
number 时长误标 string。真实 CommonJS 返回 default namespace，与当前 callable 入口
不同；1.0.6 的关联提交核心为 4.5.5，而当前源码增加了 >=5 检查。这些都进入兼容计划，
不能仅保留当前错误声明或要求全部旧消费者升级核心。

新增 [契约](../baselines/ads-contract.md)、[来源数据](../baselines/ads-release.json) 和
`ads-contract.mjs` 校验器。两项 Node 检查通过：全部发布/历史文件指纹；实际 npm 1.0.6
CommonJS/浏览器工厂、静态字段、延迟 ready 订阅与同步结果形状。测试没有执行广告媒体
或伪装成浏览器验收；后续 02 建立倒计时、生命周期、广告媒体和错误用例。

ADS-TYPE/DIST/CORE/LIFE/MEDIA/UI 六项差异分别指派到 02～06；类型、模块、timer、DOM、
主片恢复和旧核心矩阵的后续交付物已细化。保留大版本目标 3.0.0，未改版本、生产源码、
依赖、样式、demo 或 dist。任务完成指的是来源/契约核对，插件重构仍未完成。

局部 lint、两项 Ads 检查及完整 45 项基线检查通过；计划/风险链接检查通过。45 项包含
这两项 Ads 测试，不重复累计为 47；未重新运行完整工程 CI 或浏览器播放。
执行指纹见 [验证记录](../baselines/ads-contract-validation.json)。PKG-ADS-01 完成后为
217 项：75 done、4 doing、138 todo，下一项 PKG-ADS-02。本任务独立本地提交，不推送发布。
