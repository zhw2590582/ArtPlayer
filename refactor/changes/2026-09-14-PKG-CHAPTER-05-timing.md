# PKG-CHAPTER-05 历史超时与事件观测

任务仍为 doing。本轮接续已提交的组合检查点，未修改生产源码、类型、产物或依赖。
没有把已通过的桌面模拟宣称为物理设备验收。

## 历史 trace 的新发现

读取原 `chapter05-quality-ready-results` 中 candidate core + candidate chapter 的
WebKit 失败 trace，核对实际 before/after 调用，而非只看测试错误摘要：

| 操作 | 耗时 | 返回值 |
| --- | --- | --- |
| 选择 Quality A | 582.473 ms | 点击完成 |
| 检查当前 URL | 38.196 ms | true |
| 第一次读取 restart 数组 | 3.373 ms | 空数组 |
| 第二次读取 restart 数组 | 9956.244 ms | 目标 URL 已在数组中 |

最后一次 evaluate 超过原 7000 ms 轮询期限，之后的 afterEach 才得到恢复位置和
readyState=4。这不是持续快速轮询七秒都得到空数组。旧 trace 没有为 restart
和原生媒体事件记录页面时钟，仍无法判断事件发生在该调用的哪一时刻，或区分
媒体驱动、页面主线程、协议传输、trace 快照开销。不能据此关闭风险，更不能仅
凭类似十秒停顿把它和 JASSUB 的 Firefox 问题认定为同一根因。

原 trace ZIP/member hash、准确时点和序列化返回值保存在
[机器记录](../baselines/chapter-timing-observations.json)。原始 ZIP 未改写。

## 测试改进与本轮验证

`chapter-combinations.spec.js` 现在记录公共事件与原生事件的 performance.now，
清晰度选择前的时间点，以及每次完成的 restart 读取的 Node 起点、往返耗时、
页面时间和 performance.timeOrigin。future trace 可以对齐两端时钟，分离已发生
但晚观察到的事件和真正晚发生的事件。原目标 URL、恢复位置、菜单、章节及
缩略图断言不变，超时没有增加，测试未启用重试。

固定 Node 24.21.0 / Yarn 1.22.22，执行：

```sh
yarn test:browser test/browser/chapter-combinations.spec.js --grep 'quality switch' --workers=1
```

三浏览器、四组新旧核心/章节组合共 12 项通过。两个已发布核心的 WebKit 用例
仍是历史位置归零观察，候选核心仍要求恢复原位置；不能将这两项统计为修复。
本轮使用浏览器服务的源码构建，报告保存实际资源 hash。定向只读 ESLint 通过。
没有重新运行章节全量、fullscreen/touch 全部矩阵或 tarball 安装验收。

本轮通过仅验证新增观测没有破坏既有组合断言，不解释历史停顿。CHAPTER-TIMING-01
保持 open，05/06 和物理设备门槛仍未完成。下一步可继续独立插件实施；若再次出现
停顿，先对照页面事件时点和往返耗时，避免直接修改核心或用更长等待掩盖它。
回退本提交只移除观测及记录；不 push/publish。
