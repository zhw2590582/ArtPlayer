# SITE-VCONSOLE-01: vConsole 销毁后的异步工作

## 问题与修复

SITE-07 的真实 mobile 页面发现 vConsole 3.15.0 销毁后更新已删除日志 store。
冻结 npm bundle 后，原生三引擎进一步确认三条独立路径：

- 最后一个日志插件移除时没有取消 RAF，也没有清空单例日志模型的旧队列。
  `lifecycle.ts` 管理调度票据；先失效再取消，清空队列/标志，最后恢复 console。
  被人为迟到交付的已取消回调也不能消费重建后的队列。
- core 的延迟面板插入以全局同名 DOM 查找目标，销毁后会报错，同名插件替换后会
  把旧面板插入新插件。延迟回调现在核对原实例 isInited 和 plugin 对象身份。
- recycleScroller 的高度和条目尺寸异步续段在 timer 后访问已销毁的 Svelte 绑定
  元素。两个续段现在在绑定元素为空时返回，保留正常布局路径。

## 结构、类型与兼容

`scripts/site-vendor/vconsole/upstream.js` 保留 npm 3.15.0 完整原字节，构建器校验
整个 SHA-256 及六个唯一替换位置。自有生命周期逻辑使用严格 TS，既有 TypeScript
5.9.3 和 esbuild 0.27.7 生成 ES5 私有辅助模块，不新增依赖或锁文件。
其余 bundle 字节、UMD 分支、CSS 和原 URL 保留；命名 AMD、CommonJS 和 browser
global 都有真实页面回归。没有改 ArtPlayer 核心/插件公开 API 或声明。
模块维护与重跑命令见 `scripts/site-vendor/vconsole/README.md`。

新增 `build:vconsole`、只读 `check:vconsole`、`test:vconsole`；接入根 Node 测试、
严格 docs-tools TS，以及 ci:check/ci:build 的 notices 前置顺序。生产 minified 文件
由生成器写出；manifest 与第三方台账分别保存上游和候选指纹。

## 验证记录

最终结果与输入指纹见 [机器证据](../baselines/vconsole-lifecycle-validation.json)。
原失败报告保留在 refactor/.cache，不能以最终通过覆盖：

- 最初原版 6 失败，首个仅日志补丁仍有面板异常；第二轮 9 项通过。
- 扩展原版回归 13 失败/2 通过中，AMD harness 错把命名 define 当匿名 define；
  这是测试错误，已按冻结 UMD 原文改正，不计为产品缺陷。
- 扩展候选 17 通过/1 失败暴露间歇 scroller style 异常；没有扩大等待或吞掉错误。
- 原版 scroller 专项通过控制零延迟 timer 在三引擎稳定得到空节点 style 异常。
  该轮 `.vc-log` 选择器错误也留档；仅改成 `.vc-log-row` 时，因为挂起了初始化，
  仍没有日志行。正式测试先确认日志可见，再挂起 timer、改变 viewport 高度，
  销毁前均有 21 条真实日志行；原版出现空节点异常，候选无异常。
- 最终同一测试：原版 12 失败/6 通过；候选含 mobile 播放 21 全通过。40 项单元/
  CI 测试、严格 docs-tools TS、工具链、冻结安装、生成校验和定向 lint 通过。
  根 lint 无错误，保留既有 docs/assets/ts/artplayer.d.ts 的 1 条 unused-disable warning。

日志及面板用例使用原生 RAF/DOM；迟到已取消 RAF 和挂起的零延迟 timer 是显式
故障注入，未把它们称作未经控制的用户操作。mobile 用例仍有实际视频播放和可见
日志。浏览器是本机 Playwright 三引擎，不是物理 iOS/Android 或远端 CI 结果。

## 剩余边界与回退

本任务只关闭已复现的日志/面板/布局迟到工作，不宣称覆盖 vConsole 所有生命周期。
原 LICENSE 原文继续分发；缺失的 MIT 正文和依赖 notices 仍属于 VENDOR-07，
SITE-07 仍 doing。Monaco/Codicons、console bundle、字体/媒体许可也未关闭。
没有 npm 发布、部署或 push。回退本任务提交同时恢复生成器、候选、指纹和 CI
命令；不要只替换 docs 中的压缩文件而留下失配的生成检查。
