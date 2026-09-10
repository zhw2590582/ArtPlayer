# Chapter 1.1.0 迁移契约

PKG-CHAPTER-01，2026-09-10。来源为 [固定发布归档](releases.json) 的 chapter 1.1.0、
工作区 packages/artplayer-plugin-chapter，以及 [官方示例](../../docs/assets/example/chapter.js)。
归档完整性沿用 BASE-01，不依赖 registry 最新版本或陈旧 gitHead。

## 已核对的一致性

发布包与工作区的 README、package.json、声明经 LF 归一化相同。当前源码插件函数与样式注入
if 块，与发布 ESM 中相应语句经 TypeScript 5.9.3 提取、esbuild 0.27.7 语法归一化后 SHA-256
均为 `f0bf5985794454bb2027d1d2bd718bbaf02230907245ef684e3f31ba955c9650`。比较不包含 CSS 字符串
或 bundler 包装，不能用它声称三个分发文件全部字节相同。

| 工作区文件 | SHA-256（LF） |
| --- | --- |
| src/index.js | fcd732e4257597a8cbb192fa4d715488b344df361a3a5b7d0e7c70f7554a73e6 |
| src/style.less | a7506541374cbf5b3a6906b19d4a925406b2ccebdb9be6c7406c3bb8d9045ee5 |
| types/artplayer-plugin-chapter.d.ts | 4ce65f8a55ed8f53ddd7f1cd7324923aacefeaee209d58d5981e1434050a6962 |
| README.md | 04f1d3338acdf7c4f56ac3596d7c5c3282f508400208cb6142da064ced7e72dc |
| package.json | 233ed9b732e14cb06955536157ba1650c4cffded74015a2417942e70ee5aca04 |

## 调用和行为

| ID | 兼容边界 | 后续断言 |
| --- | --- | --- |
| CHAPTER.factory | 默认导出/global 为 artplayerPluginChapter；工厂允许无参或 `{ chapters }`，返回同步插件函数 | 两种工厂调用、旧核心注册 |
| CHAPTER.result | 结果为 name=`artplayerPluginChapter` 与 update 方法；没有新增 Promise 或自动异步注册 | key/name、同步结果 |
| CHAPTER.update | `update({ chapters })` 同步返回 undefined；`update({})` 清空；`update()` 当前会抛 TypeError，不能把它与无参工厂混为一谈 | 正常、空配置与非法调用 |
| CHAPTER.intervals | start/end 为秒；合法范围满足 0 ≤ start < end ≤ duration，禁止重叠；end=Infinity 换成当前 duration；相邻区间允许接触 | 边界、重叠、Infinity、类型错误 |
| CHAPTER.input-mutation | 原地 sort，修改 Infinity end，并通过 unshift/push/splice 给原数组补空标题区间；原章节对象保留引用 | 迁移保留已合法可观察的数组/对象变化 |
| CHAPTER.render | 列表按时长比例展示，dataset start/end/duration/title 是字符串；title trim，只用 textContent，不执行标题 HTML | gap、百分比、标题文本 |
| CHAPTER.progress | `setBar(type, percentage)` 的 hover/loaded/played 更新对应子条；当前秒数小于/大于章节时分别 0/100%；未知 type 不更新 | 边界 seek、各条宽度 |
| CHAPTER.hover | 有标题时根据总进度位置定位，靠左右边缘夹紧；章节边界可能同时命中两段，后段覆盖标题 | 实际 mouse hover 与边缘位置 |
| CHAPTER.init | 创建 DOM 后等待一次 video:loadedmetadata；该回调用创建时 option.chapters；更新成功启用 class 并 emit setBar loaded | ready 前后及 loaded 同步 |
| CHAPTER.empty | 空列表、非数组、duration=0 会先清列表并关闭 class，再返回；校验失败也已经清旧 UI | 回退/异常后 DOM |
| CHAPTER.cleanup | 插件自身没有公开 destroy，也不注册专有清理函数；核心 destroy(removeHtml) 控制 DOM 清理 | destroy 真正移除/保留节点的区别 |
| CHAPTER.style | 导入时按 id 去重注入全局 style；文档 loading 时等待 DOMContentLoaded；SSR 无 document 不注入 | 导入安全、样式不随单实例销毁删除 |

DOM/CSS hooks：播放器 class `artplayer-plugin-chapter`；进度容器 `.art-control-progress-inner`；
`.art-chapters` → `.art-chapter` → `.art-chapter-inner` → `.art-progress-hover/.art-progress-loaded/.art-progress-played`；
标题 `.art-chapter-title`。保留 dataset start/end/duration/title、4px gap、用户 CSS 变量和 thumbnail
相对位置。样式依赖播放器 hover class，不能只把 title.textContent 当成可见性通过。

插件只依赖旧核心 template.$player、query、constructor.utils 的 append/query/clamp/setStyle/
addClass/removeClass、duration/loaded、on/once/emit。迁移不得意外依赖新核心专有工具。

## 入口、类型和版本边界

保留 main/module/types/legacy 的历史路径、默认导出以及 exports 的 `.`/`./legacy` 条件入口。
没有声明 peer 核心最低版本，不能新造一个最低版本或承诺全部旧版本；目前已验证的旧核心基线为
5.4.0，工作区核心为 5.4.1。其他旧版本范围仍按环境矩阵取证。计划发布 chapter 2.0.0，旧接口保持。

声明局部定义 Chapters/Option/Result，只有 default 导出，未导出这些类型名。声明把工厂 option
误写为必填，与运行时默认值不一致（BASE-TYPE-02）；PKG-CHAPTER-02 扩展为可选参数并验证。
NodeNext ESM 与 legacy 旧解析问题仍归 PKG-CHAPTER-04（BASE-TYPE-01/03），不混入此契约冻结。

README 只有简介、demo 链接和许可，无新增 API 承诺。示例使用 5 段章节、Infinity 收尾和多语言
标题，组合 autoSize、fullscreen/fullscreenWeb、miniProgressBar、autoOrientation、thumbnails。
示例真实组合验收归 PKG-CHAPTER-05/06；基础浏览器 smoke 不代表组合已覆盖。

## 已发现的改进点，不作为必须保留的缺陷

- 空白 gap 的 hover 不清除上一个标题；更新列表也不清旧 title 文本。PKG-CHAPTER-02 复现，03 修复。
- 只订阅一次 metadata，切源后章节不会自动按新 duration 重算。02 记录实际行为，03 明确更新责任，
  不悄悄把调用方数组中已替换的 Infinity 恢复成另一个公开语义。
- NaN 能绕过比较，Infinity duration / 非有限 start/end 缺严格约束。02 复现非法输入边界，03 处理，
  正常章节和已有明确错误类型/消息继续兼容。
- 保留插件结果调用 update 在销毁后可能继续操作脱离页面的 DOM；02 验证生命周期，03 整理所有权。

本任务核对实际实现并冻结范围；上述包特有运行断言由下一步 PKG-CHAPTER-02 执行，未将静态审查
写成浏览器通过。已有真实播放证据见 [ENG-05](browser-validation.json)。
