# PKG-CHAPTER-02：章节回归与可选参数声明

## 改动

新增 [chapter.spec.js](../../test/browser/chapter.spec.js)，在已发布核心 5.4.0 上分别运行发布与当前
chapter：每浏览器 8 项正常/边界/失败/生命周期测试，另加 1 项只针对发布包的历史缺陷观察。
实际鼠标 hover、进度点击 seek、metadata 与切源由真实浏览器执行；没有替换 HTMLMediaElement。

覆盖无参工厂完整注册、name/结果 key、同步 update、数组原地排序/补齐/对象引用、Infinity、
标题 trim 和 HTML 纯文本、gap、三类进度条、标题两侧夹紧、边界 seek、空配置、六类非法数据、
无参 update 错误、切源后显式 update、destroy 和全局 style 保留。

生产声明的工厂参数从必填扩展为可选，运行时已有默认值，不改变旧调用；update 的对象仍必填。
[消费者夹具](../../test/types/chapter-options.ts) 验证无参/undefined/空对象/正常调用及三个反例。
运行 build:ts 再生成编辑器声明，仅 chapter 文件有实际差异。README 补调用说明与测试入口。
没有迁移或修改插件 JS 运行时；生产源码 TS 迁移仍为零。

## 验证和发现

- Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6：chapter 27 项通过；连同原 smoke 总计 39 项通过。
- TS 5.9.3 的 Node10 CommonJS / NodeNext CommonJS / Bundler ESM 与 TS 4.3.5 旧消费通过，
  错误 update/标题/null 参数仍被拒绝。关闭 BASE-TYPE-02；BASE-TYPE-01/03 不受本修复影响。
- `yarn ci:check` 55 项检查通过；build:ts、计划/风险台账、Git 差异检查通过。
- [运行记录](../baselines/chapter-validation.json) 保存源码/声明指纹、浏览器版本、结果及历史观察。

实际复现空白 gap 沿用上一标题、NaN 区间进入 DOM、切源后保留旧区间。历史观察仅对发布版本
固定这些结果，不要求候选永久保持缺陷。PKG-CHAPTER-03 负责标题/非法时间修正、生命周期与
模块拆分；切源后的显式更新责任和已有调用方数组变化保持可解释，不能意外改变公开语义。

测试使用真实鼠标来提供核心 hover 事件需要的原生 event；整数坐标决定实际百分比。同步
setBar 断言在一次 page.evaluate 中发出并读取，避免与原生 timeupdate 交错导致测试误报。
完整套件另复现 Firefox 已缓存媒体 Range 的 NS_ERROR_PARSED_DATA_CACHED；按
[Mozilla 的说明](https://bugzilla.mozilla.org/show_bug.cgi?id=1347174#c4) 增加精确引擎/媒体类型/同源/
用例 URL 限定，保留原始记录和全部播放断言，不全局忽略请求失败。

## 边界和下一步

仍未验收完整编辑器、移动真机、所有核心历史版本或最终 tarball；旧核心/新插件的范围以当前
基线为准。类型消费者的 NodeNext ESM/legacy 解析归 PKG-CHAPTER-04。先完成 ENG-07 候选消费，
再进入 PKG-CHAPTER-03 源码拆分；可直接用 TS 实现模块，04 继续完成公开类型/分发消费闭环。

回退本提交恢复原必填声明及编辑器输出，并移除新增测试/文档；旧合法调用和运行时代码不变。
