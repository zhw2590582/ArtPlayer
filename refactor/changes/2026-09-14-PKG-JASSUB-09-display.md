# PKG-JASSUB-09 合成截图验证检查点

接续 `7ef605fba7e7009b4838ecf391969b17fd0e1315`，任务仍为 doing。前一轮原生
ImageBitmap 控制把停顿定位到异步创建与显示读取相关路径；本轮补充完全不复制
转移画布的实际合成截图，检查是否只是原来的 canvas readback 引入了问题。

## 实际改动

`test/browser/jassub-display.js` 只负责 Node 端 PNG 解码及绿色字形计数；浏览器
继续实际播放并运行 JASSUB Worker/WASM。原有 `jassub-native.spec.js` 默认流程
保留；显式 `ARTPLAYER_JASSUB_SCREENSHOT=true` 才走截图诊断。页面几何与媒体状态
由单独函数读取，避免几何检查间接触发复制画布。

截图用例使用可识别的绿色 ASS 字形，并在全屏后隐藏字幕验证绿色像素归零，
恢复后再次验证可见，防止把视频背景或播放器 UI 误认作字幕。同时检查 seek
前后字形签名、播放时间前进、布局尺寸及原有销毁/资源边界。没有屏蔽 Worker
错误，没有把默认 asyncRender/offscreenRender 改成 false，没有修改生产源码。

新增根 devDependency `pngjs@7.0.0`，只用于 Node 测试截图解码；MIT、无运行时
依赖，API 来源为 [上游文档](https://github.com/pngjs/pngjs#sync-api)。根 manifest
和唯一 yarn.lock 仅增加此项。Node 24.21.0 / Yarn 1.22.22 正常安装、随后 frozen
安装和严格工具链检查通过，未使用 ignore-scripts/ignore-engines。没有新增发布
依赖、提高播放器浏览器语法目标或重建无变化的发布产物。

## 保留的中间结果

- 首轮 Firefox 截图：2 通过 / 1 全屏失败；直接截图也未保证消除停顿，不能声称
  问题只由原先的 drawImage 复制造成。
- 增加截图耗时/调用错误记录后：2 通过 / 1 首次像素失败；随后加入完整尝试错误
  附件的版本三项通过。添加观测不是生产修复，成功重跑不关闭原风险。
- Chromium/WebKit 首轮：4 通过 / 2 失败。两个 WebKit 失败时 before-seek 已到
  5.389/5.412 秒，采样的已是后一条字幕；甚至通过的 WebKit before-seek 为
  4.146 秒、像素为零。说明第一版截图用例的短字幕窗口不可靠，不能把这组失败
  报成 WebKit 的字幕显示缺陷，也不能将那个通过样本作为完整前后字形证明。
- 修正仅作用于截图模式：第一条 0-30 秒、第二条 40-110 秒，seek 50 秒；明确
  before.time < 30 且 before.visible > 100。原非截图模式保持原 ASS 和 seek 10
  秒，expect/test 超时均未扩大。这样保留有限等待检查，同时不依赖截图在四秒内
  完成所有前置动作。最终三浏览器 × 三核心九项通过；Chromium/Firefox 使用真实
  offscreen 能力，Windows WebKit 无 transfer，验证实际主线程 fallback。最终结果
  见机器记录。

初版报告中的 limitation/subtitleSha256 尚沿用白色 ASS 文字；在最终测试中已
改为实际选中字幕的 hash 和截图模式描述。机器记录明确区分中间证据，不把旧
报告错误元数据当作实际输入身份。浏览器 fixture 自动失败截图发生在 finally
销毁之后，不能用空白页面推断销毁前的播放状态。命名阶段 PNG 在销毁前采集。

## 复跑与边界

```powershell
$env:ARTPLAYER_JASSUB_ARTIFACT = 'packages/artplayer-plugin-jassub/dist/artplayer-plugin-jassub.js'
$env:ARTPLAYER_JASSUB_OFFSCREEN = 'default'
$env:ARTPLAYER_JASSUB_SCREENSHOT = 'true'
yarn test:browser test/browser/jassub-native.spec.js --workers=1
```

保留 `jassub-hybrid.spec.js` 和原 readback 红序列，不用截图模式替代全部兼容验收。
每轮先归档共享 report/results。原始截图、trace、报告保存在 `.cache/`，提交的
[摘要](../baselines/jassub-display-validation.json)保存参数、hash、结果、失败及
阶段像素/媒体状态，不能替代所有物理设备和持续 GPU 使用证据。

本轮不关闭 JASSUB-FIREFOX-OFFSCREEN-01、09 或 05；不宣称整包、完整浏览器组合、
npm 准入、远程 CI 或三轮发布复盘完成。回退本检查点恢复原测试与锁文件；没有
生产实现需要回退，也没有 push/publish。
