# PKG-CHAPTER-05：进度、清晰度、缩略图与全屏组合

状态：进行中。起点 d18c5456，工作区已核实干净；Chapter-04 和 CORE-22 前置已完成。

现有 chapter.spec.js 的全面章节用例固定旧核心。新增组合覆盖旧/新核心、旧/新 chapter，
使用本地固定 MP4 和缩略图网格验证真实 hover、seek、清晰度切换、显式章节更新、原生/
网页全屏进出与缩略图/标题位置。触摸部分在 390px、hasTouch 与 iPhone UA 模拟环境中
要求可信 touchstart，并检查进入/退出网页全屏后的章节 seek；不声称已在 iPhone 真机运行。

本阶段先保留实际测试结果；任何失败先核对原生能力、旧版行为、测试夹具与候选实现，
不改断言使候选假通过。物理设备和未覆盖场景继续作为未验收范围。

## 已确认的显示缺陷与源码修复

390px 的长标题在新旧插件都超过进度条右边界；真实页面显示文字被播放器外边缘直接裁切。
先加入候选不越界的失败断言以及旧版溢出观察，三引擎分别两种核心：6 个候选失败、
6 个历史观察通过。style.less 现使用 max-width:100%、border-box、overflow:hidden 和
text-overflow:ellipsis，把显示宽度交给样式层；progress.ts/chapters.ts、同步 update、
数组原地变更、事件以及声明不变。完整 textContent 与 data-title 仍按原样保留。
正式 main/legacy/module 与 docs/compiled 已由 yarn build artplayer-plugin-chapter 生成。

## 夹具修正与尚未关闭的时序疑点

第一轮 48 项：36 个全屏/触摸组合通过，12 个 quality 场景失败。10 个卡在 hover 结束
章节：鼠标点在展开的 quality 菜单覆盖区域，尚未进入进度条；两个旧核心 WebKit 的
位置回到 0，已有 progress-quality.spec.js 复现该历史缺陷。该旧版观察保持显式分支，
候选核心仍必须恢复切换前位置，没有用旧缺陷放宽候选断言。

第二轮先移动鼠标，仍 12 项失败：候选菜单有焦点保持；旧 core CSS 原本只有 opacity=0
和 pointer-events:none，并无 visibility:hidden，toBeHidden 不能表示它的视觉关闭。
第三轮外部 Pause 按钮点击后，候选菜单退出，旧核心的 toBeHidden 仍失败。对照实际
发布包样式后改为检查 opacity=0，选择前等待 opacity=1，随后仍要求真实标题与缩略图
可见、位置不重叠。所有首轮报告均保留；这是菜单交互前提修正，不是删除章节断言。

第三轮 24 项中长标题全部通过；另有候选核心 WebKit 的 quality restart 等待超时。
修正菜单后的一轮 12 quality 为 11 通过/1 失败，最后候选核心+候选章节仍在 7 秒
轮询内未看到 restart，而 afterEach 已记录 restart、新源、恢复位置、readyState=4，
没有媒体错误。来源可能涉及原生 seek/事件耗时，尚未证明；不据此修改核心或提高超时，
也不因后续某次通过关闭这个疑点。原始事件序列和失败 trace 继续保留。

本次未安装依赖、未更改发布版本。触摸模拟不代替物理 Safari/iOS/Android，完整分发与
8082 demo 属于 Chapter-06。任务仍 doing，源码修复与证据以独立 checkpoint 提交。
回退本检查点会移除长标题显示限制，恢复旧显示；已发布的 npm 包没有发生变化。

## 本检查点验证结果

- 正式 main 和 legacy 分别 102 项通过，无重试/跳过；使用明确产物映射，核心与章节包
  的浏览器服务指纹均与实际 dist 字节一致，不是冒用源码运行结果。
- 每组包含原有 42 项章节用例与新增 60 项组合。新增部分为 12 个长标题（含 6 个历史
  溢出观察）、12 个 quality/缩略图（含两项旧核心 WebKit 位置归零观察）、24 个真实元素/
  网页全屏、12 个触摸模拟。不能把所有通过项都称为没有历史缺陷的候选验收。
- 完整 CI 599 项（550 单元、14 工程、35 基线）通过；严格源码/类型消费、声明一致性、
  lint 通过，保留一条已知生成声明 warning。最终新增测试定向 lint 通过。
- 长标题修复后截图已实际查看：文字省略且标题框在播放器内，完整内容保持在 DOM 数据。
- 全部阶段包括 48 项首轮、12 项菜单修正失败、12 项长标题先红后绿、24 项第三轮
  17 通过/7 失败及最后 quality 11/1 均保留，见 [冻结证据](../baselines/chapter-combinations-checkpoint.json)。

CHAPTER-LAYOUT-01 已按具体显示范围关闭；CHAPTER-TIMING-01 仍 open。最终产物两轮
通过不解释早期时序超时，不能以它们消除待查证据。当前 217 项，70 done、3 doing、144 todo。
下一步可推进独立包；Chapter-05 的物理设备和时序缺口继续随风险台账接续，不阻塞全局目标。
