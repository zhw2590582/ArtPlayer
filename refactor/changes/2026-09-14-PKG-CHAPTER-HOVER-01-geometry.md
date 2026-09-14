# PKG-CHAPTER-HOVER-01 全屏悬停测试同步

## 问题与边界

CI-BROWSER-01 的已安装四包检查曾实际出现 224 通过、1 失败：Chromium 中
5.4.0 核心搭配候选 Chapter，原生全屏后的章节标题先通过文本断言，再隐藏，
opacity 从 0.279 降到 0。原始报告、trace 和截图保留在
`refactor/.cache/ci-browser-installed-full-report`，不改写为通过。

旧测试在 `art.fullscreen === true` 后立即读取进度条 boundingBox 并移动鼠标。
核心 bottom.less 的进度条/控件有 transform transition；全屏布尔状态不代表
几何已稳定。原 trace 的鼠标位置为 (640, 665.9921875)，终态截图的进度条已
移动。仅靠后来通过不能证明原因，因此另建受控移动实验。

## 实现与责任

- `test/browser/chapter-hover.ts` 统一几何读取：先通过 Playwright locator 的
  `hover({ trial: true })` actionability/stability 检查，再读取 box 并实际移动鼠标。
  trial 不发送实际 hover；没有增加固定 sleep、断言超时或 test retries。
- `chapter-combinations.spec.js` 复用该函数；标题、透明度、缩略图、边界及全屏
  退出断言保持原样。
- `chapter-hover.spec.js` 在真实原生全屏中用原生 Web Animation 让进度条移动
  600ms，结束后通过真实 hit-test 验证指针仍在进度条内，再验证 Middle/opacity。
  这是故意注入的几何移动，不是宣称产品 transition 实际持续 600ms。
- `ARTPLAYER_CHAPTER_HOVER_BASELINE=1` 可恢复旧的立即读取路径，保留可重跑的
  反例。默认必须使用稳定路径；诊断模式的失败不能豁免正式验收。
- 新 TS helper 纳入严格工具类型检查；安装浏览器范围显式加入该回归文件。

API-08 仅涉及测试如何操作 DOM；生产源码、公开接口/事件/声明/CSS 和安装包
字节都未修改。包架构文档记录入口和边界。本任务不需要重建生产运行时或引入依赖。

## 证据与限制

完整结果、报告摘要、浏览器版本、实际安装入口及 SHA 见
[chapter-hover-validation.json](../baselines/chapter-hover-validation.json)。
先前立即读取路径在受控移动中 4 失败、2 通过；等待稳定后同样 6 项全部通过。
Chromium/Firefox 的失败是最终指针已离开移动后的进度条。首版 WebKit 旧路径
通过，但审查附件发现其 hit-test 与最终矩形不一致。因此补上最终 x/y 矩形范围
断言：最终 baseline 三引擎 6 项全部失败；默认稳定路径在 main/legacy 各 6 项
通过。首版的 2 项通过仍留档，不能把只依赖 hit-test 的结果当作几何正确。
原有组合与首版新增移动回归在 main/legacy 各 66 项
通过，均无重试、跳过或失败。严格 TS、专项 ESLint、根 lint（0 错误/1 个既有
warning）、4 项 browser runner 测试和固定工具链检查通过。

实验确认旧测试的几何竞态及针对该机制的修正，原失败符合相同症状；不能重新播放
原 run 的精确调度，也不能据此声称所有全屏生产缺陷已排除。新旧包字节保持一致，
本次修复归类为测试同步问题。CHAPTER-TIMING-01 的 WebKit restart 观察耗时、
真机、完整发布/分发验收仍由 Chapter-05/06 负责。

验证使用 Node 24.21.0、Yarn 1.22.22、实际安装产物及桌面三引擎。没有远端 CI、
真机、全量 source suite 或 npm 发布；不把模拟触摸称为手机证据。

## 回退与接续

诊断时设置 baseline 环境变量并运行 README 所列命令，可比较真实指针与终态
矩形。交付回退可还原本任务的 helper、回归测试、scope 和文档/状态；不要删除
历史失败报告或把 opacity 断言放宽。后续 UI/CSS 改动须继续运行这两个浏览器文件。
