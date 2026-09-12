# Ads 回归测试与维护入口

## 03 源码改造补充

当前源码已按 [包内架构](../packages/artplayer-plugin-ads/ARCHITECTURE.md) 拆为 7 个严格 TS
模块。新增 test/ads-lifecycle.test.js，仅候选实现运行修复断言；test/ads.test.js 的旧
行为与冻结缺陷观察保留，新增动态修改事件配置的兼容检查。三个正式格式也可通过
ARTPLAYER_TEST_ADS 加入同一运行。02 的原始输入哈希/结果不覆盖更新。

浏览器加入实际 4.5.5 核心映射；候选用例覆盖提前 skip、零阈值幂等、真实 destroy/src
释放与两类内部播放拒绝。拒绝用例透明记录 console.warn 的实际参数，仍调用原方法，
不依赖 Firefox 等引擎不同的 console 文本渲染。成功播放仍检查真实像素和时钟。
结构/缺陷差异及验证过程见 [03 记录](changes/2026-09-12-PKG-ADS-03-lifecycle.md)。
03 最终正式三格式 Node 186 项通过；main/legacy 三引擎各 144 项通过；完整 CI 830 项
通过、269 生产 TS 严格检查。对应 [新执行证据](baselines/ads-lifecycle-validation.json)
与以下 02 历史结果分别保留，不能把任何一轮当作全部包的发布证明。

Ads 的实际发布行为以 [1.0.6 归档](baselines/ads-release.json) 为基线；工作区 2.1.0
未发布，其旧 bundle 单独从冻结 Git 提交加载。不要将当前声明里的 source/type 当成
发布 JS 支持的输入；正常广告仍使用 html/video/url，图片通过 HTML img 提供。

## 可执行入口

使用仓库固定 Node/Yarn 工具链：

```sh
yarn test:ads
yarn test:unit
yarn test:browser test/browser/ads.spec.js
```

Node 测试已接入 test:unit，因此 ci:check 会执行。浏览器测试独立运行；共享服务器端口
8084 和报告目录，每轮运行后先归档 report.json 与完整 results，再启动下一轮。
没有新增依赖、锁文件或生产打包规则变更。

`ARTPLAYER_TEST_ADS` 可以指定额外正式 JS/legacy/mjs 产物，多个文件使用本机路径分隔符。
`ARTPLAYER_ADS_ARTIFACT` 给浏览器指定单个 script 产物，默认按仓库 Vite 配置从源码
内存构建。路径无效直接失败，不自动回退。实际发布 bundle 总是先校验归档及成员哈希。

## 04 类型与编辑器验证

`refactor/scripts/ads-types.test.mjs` 验证五种类型消费模式、十个无效用法，以及实际
npm 和冻结工作区声明。普通调用通过不代表 scalar 提取兼容；诊断测试明确复现
旧字段读取在候选上的 TS2322。用户明确接受此项修正后，ADS-TYPE-01 标为
accepted-with-scope；保留诊断并编译迁移示例，不把批准范围扩大到其他 API。

`yarn test:ads-types-package` 在工作区外安装实际 tarball，验证安装字节、冻结离线
重装、五种类型模式和 Node exports。`test/browser/ads-editor-types.spec.js` 从
本地 docs 加载真实 Monaco 和生成声明，执行其编译结果并检查 default 工厂身份。
`test/ads.test.js` 增加候选 `.default === factory` 及同步取消断言，覆盖三种产物。
这些检查不替代全部历史子路径、媒体/设备与发布验收。

## 边界与文件职责

- `test/helpers/ads.js`：来源加载、冻结 bundle 的 VM、可控时钟和最小 ArtPlayer 宿主。
  使用真实 option-validator，记录计时/播放/DOM 操作意图；节点不是 HTML 解析器、布局
  引擎或媒体解码器。多实例共用一个测试时钟，独立维护监听、节点和归一化选项。
- `test/ads.test.js`：正常工厂/配置/优先级、倒计时、按钮阈值、公开方法返回、事件参数
  身份、独立实例、restart、静音、visibility 与错误顺序；历史缺陷只断言冻结实现。
- `test/browser/ads.spec.js`：实际 npm 1.0.6/候选源码与核心 5.4.1/候选四组合，使用
  本地图片与 MP4，验证解码像素、时间推进、点击、主内容恢复、404 和真实切源。
  每例附核心来源、插件 SHA、状态、浏览器版本；失败保留截图和 trace。

播放拒绝用例精确注入 NotAllowedError，只拦截指定广告或广告后的主视频 play。
仅对匹配的预期 unhandledrejection 记录并 preventDefault，其他页面异常仍使测试失败。
这证明旧插件的 Promise 处理路径，不能当作真实设备自动播放策略验收。
零阈值按钮测试初始化后暂停倒计时，以稳定观察首个 tick 前行为；正常视频测试不模拟时间。
Windows WebKit 的 videoWidth 可能是布局宽度，解码验证使用本地样本的实际颜色像素。

## 已复现的历史缺陷与接续

Node 同时复现 npm 1.0.6 和冻结工作区实现的八类问题：重复 play 建立多条计时链；
skip 后残留回调/重复完成；destroy 后仍请求主片播放；零阈值点击首秒无效；初始化前
skip 请求播放后抛错；复用工厂使首实例事件参数指向第二实例；重复 metadata 重复启动；
初始化前 play 的回调访问不存在的 DOM。

浏览器另外观察发布版广告 play 被拒后倒计时继续，以及主片恢复被拒后广告隐藏并
发出 skip，两条路径均泄漏未处理拒绝。历史观察不是候选验收要求；03 的修复需要
对应候选回归，保持正常事件顺序、同步结果与 play/pause 只管理倒计时的既有语义。

ADS-LIFE-01、ADS-MEDIA-01、ADS-UI-01 继续 open。全屏按钮/外部全屏状态、快速
metadata、真实隐藏页媒体、销毁资源回收、旧核心 4.5.5、实际设备策略、隔离打包与
完整 demo 验收由 03～06 接续。不能用本轮 5.4.1 组合扩大历史核心支持范围。

本步输入、原始失败和最终结果见 [执行记录](baselines/ads-validation.json)；生产模块
地图在 03 实际拆分时写入包内文档，本文件只解释测试维护边界。
