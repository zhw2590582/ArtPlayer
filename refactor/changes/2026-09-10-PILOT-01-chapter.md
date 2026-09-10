# PILOT-01：chapter 试点闭环

## 出口核对

本任务核对已有执行证据与当前文件指纹，并从当前源码重跑严格打包消费，不重复宣称新的浏览器运行。

| 要求 | 已有实现与实际证据 |
| --- | --- |
| 自有运行时 TS 与职责拆分 | src/index.ts、chapters.ts、progress.ts、stylesheet.ts 和 types.ts；[03 记录](2026-09-10-PKG-CHAPTER-03-typescript-modules.md) |
| 旧核心新插件 | chapter.spec.js 在已发布 core 5.4.0 上验证注册、同步更新、数组变更、真实 hover/seek、切源与销毁 |
| 类型/旧编译器 | [04 记录](2026-09-10-PKG-CHAPTER-04-public-types.md)；TS 5.9.3 四模式及 TS 4.3.5 的 31 个场景，已知诊断为零 |
| 实际打包消费 | core/chapter 仓库外安装、成员 SHA 对照、23 项 runtime 与严格类型；运行时文件和公开路径保持 |
| 真实浏览器 | 最新安装产物 54 项 Chromium/Firefox/WebKit 通过，无重试、跳过或失败；[记录](../baselines/chapter-types-validation.json) |
| 维护地图和修复 | [包内架构](../../packages/artplayer-plugin-chapter/ARCHITECTURE.md)，标题/NaN/销毁/样式有单独回归 |
| 可靠性及已知问题 | [ENG-10](2026-09-10-ENG-10-test-reliability.md)；旧发布失败仍隔离重跑，不变成候选豁免 |

核对 03 的全部源码 SHA 与当前文件相同，当前源码重新构建的 core/chapter 安装产物与 04
通过的包内容一致，运行时 SHA 与实际浏览器资源相同。仓库中 tracked core dist 仍是此前的
历史产物，不冒充刚验证的候选；CORE-01 修改核心时会按正常流程重新生成。此次核对结果写入
[试点核对](../baselines/pilot-validation.json)。

## 对后续实施的调整

- 03/04 直接以 TS 整理运行时，再关闭公开类型消费问题，避免先做一遍 JS 目录迁移。
- 构建快照必须带根 tsconfig；消费者放仓库外，禁止沿父目录解析工作区声明。
- 默认导出需要与 ESM/CJS 实际格式一致的声明桥接，旧 TS 回退保留；不用复制 API 类。
- 先用纯函数测试控制数据边界，再用真实浏览器验证交互与资源归属；复用同一套服务、媒体和产物映射。
- 任务数量不能当工作量百分比。后续每个模块只补自身风险需要的证据，不重复建立通用基线；
  大任务有必要时再分子任务，简单文件保留直接实现。仍遵守一任务一提交。

试点出口已满足，可进入 CORE-01。chapter 05/06 仍需在最终重构核心上重新验证，不能提前完成；
完整编辑器、真机/SDK、远端 CI、全包大版本和多轮发布复盘也未由本试点替代。
本任务只增加汇总和指纹核对记录，没有源码/依赖/发布操作；回退本提交不影响已有试点实现。
