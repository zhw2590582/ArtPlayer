# PKG-JASSUB-09 Firefox 绘制诊断检查点

任务保持 doing。本轮未修改生产源码、默认选项、公开类型或发布产物；没有把一次
对照通过当作修复。接续 HEAD `7f185f698dbd303b00ca7bc0c21f51cf65c69a04` 的 hybrid
修复检查点，调查 JASSUB-FIREFOX-OFFSCREEN-01。

## 新证据

默认 Firefox 155.0、Windows、单 worker、不并行运行安装/构建。以前的失败仍保留。

| 对照 | 结果 | 可以支持的结论 |
| --- | --- | --- |
| JASSUB 读取前等待 rAF，前置字幕切换 | 1 通过 / 3 失败 | 单等一帧不是修复 |
| JASSUB 请求软件 WebRender，前置字幕切换 | 4 通过 | 仅该次诊断成功，不能确定硬件原因 |
| JASSUB 显式 asyncRender=false，前置字幕切换 | 4 通过 | 同步路径可作为异步绘制的对照，不改变消费者默认值 |
| 原生 Worker fillRect，前置字幕切换 | 4 通过 | 简单绘制对照成功 |
| 原生 Worker ImageBitmap，初版较小 native 尺寸 | 2 通过 / 2 失败 | 两个核心宿主失败，native 通过；初版报告误写未使用 ImageBitmap，已在测试及此处更正 |
| ImageBitmap，统一 viewport 尺寸且 native 不加载核心脚本，前置字幕切换 | 2 通过 / 2 失败 | 字幕切换与 candidate 控制失败，published/native 控制通过 |
| 同样控制，请求软件 WebRender | 3 通过 / 1 失败 | 软件选项也不保证消除问题 |
| ImageBitmap，等待 Worker 全部完成再读像素，无前置字幕切换 | 3 通过 | 受控无重叠读取路径通过 |
| 同一最终控制取消读取等待，无前置字幕切换 | 2 通过 / 1 失败 | candidate seek 后仍可失败，前置字幕切换并非必要条件 |
| 最终 fillRect 控制，三种浏览器，无前置字幕切换 | 9 通过 | Chromium/Firefox 验证 Worker；WebKit 无 transfer，只验证主线程能力回退 |

统一尺寸的失败记录中，Worker `bitmap-start` 时间为 500 ms，`bitmap-ready`
为 10510 ms，随后立即 `drawn`。这把一次约十秒停顿定位到原生
createImageBitmap Promise 的等待区间。该页面没有加载 JASSUB wrapper、WASM
或字体，不能把停顿归因于本次 hybrid guard。另一方面，纯原生页面迄今通过，
因此尚不能断言彻底排除了核心宿主、样式或合成调度的影响。

读取与绘制重叠是下一步的具体假设，尚未证明因果。需要验证不复制转移画布的
真实显示证据，例如浏览器截图中的字幕像素，同时保留原失败用例。不能简单删除
像素断言、扩展超时、全局关闭 offscreen/asyncRender，或更改默认 Firefox 配置。
修改后的检查必须仍证明播放、seek、布局后的真实字幕，而不只是 Worker 发回通知。

## 可维护的测试入口

`test/browser/jassub-native.spec.js` 保留原默认行为，增加显式 rAF 读取和同步绘制
诊断参数，并在报告内记录选择。`jassub-platform.spec.js` 只负责分离视频、
ImageBitmap、转移画布与宿主影响，不承担 ASS 渲染正确性。它使用原生 Worker，
记录创建/绘制时点，释放 Worker、URL、帧回调和宿主；失败收尾读取已保存的像素
及当前计数，不再次触发可能阻塞的画布复制。

`playwright.jassub-diagnostic.config.js` 单独请求软件 WebRender。早期运行使用
同偏好的 cache 配置，原文件和指纹保存在验证记录中；正式文件的 reporter 路径
继承根配置。这里只确认设置了偏好，没有从 about:support 验证实际 GPU 后端。

在固定 Node 24.21.0 / Yarn Classic 1.22.22 下复跑：

```powershell
$env:ARTPLAYER_JASSUB_ARTIFACT = 'packages/artplayer-plugin-jassub/dist/artplayer-plugin-jassub.js'
$env:ARTPLAYER_JASSUB_OFFSCREEN = 'default'
yarn test:browser test/browser/jassub-hybrid.spec.js test/browser/jassub-native.spec.js --project=firefox --workers=1
$env:ARTPLAYER_JASSUB_CONTROL_BITMAP = 'true'
$env:ARTPLAYER_JASSUB_CONTROL_IDLE_READBACK = 'false'
yarn test:browser test/browser/jassub-platform.spec.js --project=firefox --workers=1
$env:ARTPLAYER_JASSUB_CONTROL_IDLE_READBACK = 'true'
yarn test:browser test/browser/jassub-platform.spec.js --project=firefox --workers=1
```

各命令之间先归档共享 report/results。使用软件对照时指定
`--config playwright.jassub-diagnostic.config.js`；不要混入默认验收统计。
关闭诊断时清除对应环境变量。完整路径、报告哈希、选择的参数与失败附件摘要见
[机器记录](../baselines/jassub-firefox-diagnostics.json)。原始 trace、截图和报告
保留在 `.cache/`；提交的机器记录用于缓存清理后的证据摘要和复跑定位，不代替原始 trace。

本检查点不关闭 09/05，也不计入 npm、设备、完整组合或三轮发布复盘通过。
回退本诊断提交只移除测试入口及记录，不改变上一提交的生产实现。

最终只读 ESLint（两个 spec 和诊断配置）、固定 Yarn 严格工具链检查、计划与风险
登记校验、git diff --check 通过。正式软件配置 `--list` 发现 Firefox 三文件七项；
此命令仅验证发现/配置，不声称重新运行其播放。没有依赖/锁文件变更，因此没有
重新安装或重跑全部生产单测/类型打包。上一个生产提交的验证仍只代表其既定范围。
