# SITE-DANMUKU-01 弹幕双语使用指南

来源 HEAD：`520727d762d958bbc0378a04426bd885789d655b`。
从 SITE-04 拆出不依赖 Thumbnail 历史决策的 Danmuku 文档核对，依赖已完成的
SITE-03 和 PKG-DANMUKU-07。SITE-04 保留全部旧依赖并新增本任务；完整插件组合、
物理设备、全站搜索和发布复盘没有改为完成。

## 用户文档与准确边界

新增英文独立页和侧栏入口，中文原路径与 19 个已有标题 ID 全部保留。
中英文都覆盖配置、输入、回调、方法、状态、外部挂载、事件、热力图和类型入口。
不是把旧文字直接翻译：逐项核对 src/index.ts、danmuku.ts、config.ts、input.ts、
setting-send.ts、setting.ts、scheduler.ts、heatmap.ts、heatmap-geometry.ts 及 runtime-shared.d.ts。

修正或补齐的具体事实：

- time 缺省为 currentTime + 0.5 秒，显式 0 保留；单项颜色继承配置。
- 工厂要求配置对象，但运行时字段均可省略；根历史声明仍要求 danmuku。
- emit/load 返回 Promise，完成后是内部 owner；config/hide/show/reset 同步返回同一 owner。
  owner 与 art.plugins 上的注册对象不同；入队完成不等于已显示。
- 无参数 load 替换配置输入，带参数追加；config 不自动重载，输入读取失败与逐项过滤失败
  的边界不同，不承诺整批原子回滚。取消加载的 Promise 仍正常结束，不发迟到事件。
- beforeEmit 仅用于输入框且严格 true 才发送；filter 同步，不能用 Promise 做异步过滤。
  beforeVisible 可异步，错误恢复与取消边界单独说明；三个回调的 receiver 与输入函数不同。
- reset 不删除队列；isStop 与 isHide 不同；mount 要求有效目标，外部容器由应用清理。
- heatmap 在初始化启用，points 配置不自动绘图；points 事件默认 x 为像素，内层数组会修改。
  resize/load 恢复自动曲线；示例重新计算像素坐标并创建新数组。记录 issue #958 修复的范围。
- root/legacy 继续保留 npm 5.3.0 声明，准确 /runtime 入口尚未发布；页面明确区分当前分支与 CDN。

中文保留现有 13 个 Run Code 并补充热力图；修正 mount 示例误用播放器自身容器，增加外部
容器清理和公开异步命令的 catch。visible 示例用 textContent 写文本。英文有 4 个 runnable
示例及经过编译的类型示例。包源码、根历史声明、版本、依赖和锁文件均未改动。

## 生成与维护

源码在 packages/artplayer-vitepress/docs/；通过 build:site-assets、build:llm、build:docs
更新导航路由、LLM 语料和实际 VitePress 站点，没有手工修改生成输出。
LLM 重建还同步了此前已提交但尚未进入语料的三个输入：VAST 编辑器声明
（e5c73fa62）、核心编辑器声明（7cf6f3313）、Canvas 示例（c3967bcbf）。逐字核对
这三份输入与任务开始 HEAD 相同，本任务未编辑它们；生成物减少的旧声明文本是
按当前已提交输入刷新，不是本次删除公开声明或另行完成插件任务。
site-inventory 从 27 页更新为 28 页（中英各 14），HTML 从 36 到 37。
build:test/check:docs-smoke 也执行通过，但其生成器排除所有 plugin/en 页面，因此输出不变；
新 document-danmuku.spec.js 直接复用现有解析器和 readiness runner，专门执行双语弹幕示例。
站点 README 与浏览器 README 写清维护入口、命令和验证边界。

## 实际验证与失败记录

Windows / Node 24.21.0 / Yarn Classic 1.22.22。

- VitePress 真实构建通过，28 页清单和生成文件漂移检查通过。
- 两份文档的原样 TS 片段分别使用 TS 5.9.3、strict、NodeNext、types: []、skipLibCheck: false
  编译，均零诊断。静态检查双语页面所有 /document/ 本地链接和中文原有 19 个标题 ID。
- 站点构建测试 7 项、导航和文档流程测试 17 项通过；定向 lint 通过。
- 三引擎浏览器最终 60 通过、0 跳过、0 重试：18 个示例 × 3 的真实样本 readiness/清理，
  加上双语导航和 Run Code × 3。本轮没有执行全部控件交互或声称完整播放/设备验收。

保留首轮问题，不计作播放器缺陷：lint 首轮 1 项 import 排序错误已修正；调用构建测试时，
直接 node 和 yarn node 都不提供脚本需要的 npm_execpath，改用既有 yarn test:site-build 后通过。
浏览器首轮 54 通过、6 失败：Vue 客户端导航把 className 变成 class，旧测试选择器只查前者，
站点原处理器已支持两者。测试改用两种选择器后全部通过，没有修改产品 handler。
一次性静态核对也遇到 linkedom 属性大小写差异；改为读取实际属性名后检查成立。
最后清理中文行尾空格并重新构建，两个页面 HTML 哈希与通过浏览器的版本相同。
暂存源码 diff --check 通过；新英文 HTML 中 VitePress 模板生成的两行空白带有缩进，
完整 diff --check 会报告它们。保留生成器原始输出，没有手工清理生成 HTML。

命令：`yarn test:browser document-site.spec.js document-danmuku.spec.js --workers=1`、
`yarn test:site-build`、`node --test test/site-loading.test.js test/documentation-pipeline.test.js`、
`yarn check:site-assets`、`yarn check:llm`、`yarn check:docs-smoke`、
`node refactor/scripts/site-inventory.mjs --check`。
具体文件/片段/浏览器版本指纹、首轮与最终计数见
[机器证据](../baselines/danmuku-docs-validation.json)。

## 回退和剩余工作

独立回退本提交会移除英文指南与导航，恢复中文指南和对应生成站点、语料、清单与测试。
不改变播放器运行时。SITE-04 全包双语审查、SITE-05 搜索/全站验收、EX-03 完整示例和
PKG-DANMUKU-08 组合验收仍未完成。没有推送、部署或 npm 发布。
