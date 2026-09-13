# PKG-MASK-05 真实模型与弹幕组合检查点

本次保持 doing，不增加完成任务数。生产源码、公开声明和构建产物没有修改。
新增可重跑的真实 MediaPipe/WASM 测试，固定历史核心来源并增强发布归档工具。

## 实际覆盖

`test/browser/danmuku-mask-native.spec.js` 使用正常构建的 Mask 与 Danmuku、仓库内
Steve Jobs 视频和 12 个固定模型资源，不替换 SDK、原生媒体时钟或 canvas 编码。
候选核心、实际发布核心和实际 5.3.1-beta.1 核心各有两例，分别验证：

- 模型加载、连续原生输出、PNG 中同时存在透明和不透明像素；stop 后重启、
  destroy(false) 后画布清零，连续观察 500ms 没有新输出或 mask 复活。
- 模型就绪后的时间戳弹幕显示；真实节点仍在原根层且有尺寸；暂停时媒体时钟
  停止，允许最多一次已在执行的输出；等待原生 seeked 后至少两次新输出，
  网页全屏进出保持根节点；隐藏/显示后另一条新弹幕正常投递。

独立审查发现只检查编码时的 currentTime 会误认 seek 前已启动的推理已更新，
因此测试明确等待 seeked 并记录其输出计数。visible 事件也必须附有实际节点
连接、尺寸与归属证据。截图可见人物区域遮住弹幕，但不是精确分割质量评分。
自动夹具同时保存浏览器版本、资源指纹、媒体状态、请求和错误。

主产物与 legacy 各 18 项、合计 36 项通过，0 重试/跳过；精确环境见
[机器记录](../baselines/danmuku-mask-native-validation.json)。浏览器是 Windows 下的
Playwright Chromium/Firefox/WebKit；不是连接 Chrome、macOS Safari 或移动真机。
无需重新构建生产文件：04 已确认这些产物与 03 的输出一致。

## 历史失败与尚未修复的现象

最初收集失败来自 Windows checkout 把 README 换为 CRLF。现在仅文档、声明及
JSON 允许 LF 归一化比较，同时记录实际 SHA；执行 JS、WASM 和模型二进制仍需
逐字节匹配固定基线，没有修改资源文件。

首次组合测试以固定 time=6 弹幕作为启动验收，六例中五例没有投递该条。
后续 Chromium 诊断保留原条目和原 readys getter 的委托观测：发布核心一例
首次采样为 6.202297，已经超过原 6±0.1 秒窗口；模型就绪后新增的未来条目正常。
这是实际启动窗口遗漏，尚不足以断言具体哪段 CPU/SDK 操作造成它。首次报告在
执行期间有另一处尚未到达的暂停断言编辑，因此只作为固定启动断言的失败证据，
不作为全文件版本的最终验收。

最终用例把启动条目明确保留为诊断，成功断言覆盖模型就绪后的持续组合；
最终主产物 9 个组合中 8 个、legacy 9 个组合中 9 个未显示启动条目，这一现象
仍然存在；两轮各 9 个模型就绪后的组合断言均通过，不能混为启动验收通过。
没有扩大原弹幕资格窗口、添加追补语义或把遗漏标为已修复。启动性能与采样
影响保留在 MASK-SCHEDULING-01 / PKG-MASK-05，不能据此声称全时段零丢失。

## 历史核心与工具修改

[独立捕获记录](../baselines/danmuku-mask-historical-cores.json) 区分插件发布关联 Git
manifest 的核心版本与实际 npm 产物。5.3.1 未找到发布归档：metadata、packument
和 tarball 检查保留缺失事实；5.3.1-beta.1 则有实际 tarball、SHA-512/SHA-256、
manifest 与入口校验。不能把 prerelease 或相邻 5.3.0 当作 5.3.1。

共享 releases helper 现在接受受限的 prerelease 标识，仍拒绝路径穿越并保留
registry 源、归档完整性验证。新增危险版本反例与真实 beta 归档测试，共三项。
浏览器 server 从该归档提取固定主入口，manifest 记录其实际身份与 SHA。
原捕获记录中的 stable-only helper 限制是捕获时事实，本次才补齐支持。

## 重跑与剩余门槛

使用 .node-version 的 Node 与 Yarn 1.22.22：

```sh
yarn test:browser test/browser/danmuku-mask-native.spec.js --workers=1
node --test refactor/scripts/releases.test.mjs
```

第二轮设置 `ARTPLAYER_MASK_ARTIFACT` 为
`packages/artplayer-plugin-danmuku-mask/dist/artplayer-plugin-danmuku-mask.legacy.js`。
每轮等待进程完成，保存 report.json/results 后再启动下一轮。当前加载方式是
script global，不支持把 .mjs 传入该 override；真实 ESM/安装包验证仍属 06。

尚缺多实例共享原生后端、切源/网络失败恢复、实际推理 fallback、OS 全屏、
设备矩阵、GPU/WASM 内部释放和持续资源测量。body-segmentation 1.0.2 的 dispose
没有返回内部 close Promise，画布归零不能证明 GPU 已释放。默认远端未固定
solutionPath 与许可/分发核对仍在 06；本次仅验证本地固定资源。

归档工具三项、定向 lint、plan/risk 检查与影响分析通过。共享测试 server/helper
使影响分析保守要求全生态 CI；这不是本地全套或远端 CI 已通过的声明。原生报告
无 pageerror/console error，媒体 abort/cache 请求诊断保留在机器记录中。

回退此检查点测试、server 路由与 prerelease 支持不影响生产接口。没有新增依赖、
修改锁文件、推送、发布或远端 CI 验收。
