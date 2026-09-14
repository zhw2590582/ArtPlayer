# PKG-CHAPTER-05 原生时钟与纠正对照

进一步缩小 CHAPTER-TIMING-01 的范围，任务仍为 doing。没有修改核心或章节的
生产代码，没有扩大测试超时。相似的五秒页面停顿已在未加载 ArtPlayer 的 video
对照中出现；尚未确认底层原因，也不能据此宣称每次章节超时都与核心无关。

## 诊断结构

`test/browser/chapter-timing.js` 在显式开关下包装实际 video 实例的六个属性：
currentTime、duration、readyState、seeking、playbackRate、paused。它转发真实
原生 getter/setter 并记录前后页面时钟、返回值和异常，不替换媒体行为。最多保存
10,000 条属性记录，同时保存不读取媒体属性的原生事件时间和 100 ms 心跳。
本次所有样本均未达到记录上限。get/set 的记录本身会有开销，不能当作零干扰探针。

章节组合默认不启用探针；设置 ARTPLAYER_CHAPTER_TIMING_DIAGNOSTICS=1 才安装。
afterEach 先停止心跳并保存附件，随后保留原有状态与销毁流程。记录/属性包装和
原生监听器属于该测试页面，随 Playwright 的页面销毁释放，不进入播放器包。

`chapter-native-media.native.js` 使用不加载播放器脚本的独立 HTML，只放原生
video 和播放/暂停/切换按钮；使用相同的 pattern.mp4、query 区分两个 URL，
保持媒体字节不变。它提供 metadata 时恢复、seeked 时一次纠正和下一任务纠正
三种显式诊断模式，不改变生产实现。默认 `.native.js` 不纳入 source spec。
独立 `playwright.chapter-native.config.js` 复用原引擎/断言/超时，新增
`yarn test:chapter-native` 入口和独立输出目录；没有新增依赖或更换运行时。

## 固定序列结果

Windows、Node 24.21.0、Yarn 1.22.22、WebKit 26.6；每一组先固定次数再运行，
没有失败重试。既有安装组合使用 run-s8MkZT 已核验的 main，源码 HEAD 为
a03e5acc500ceee13f79f438bd0533995f883eaa。

| 组别 | 通过 / 失败 | 页面心跳间隔 >500 ms 的样本 |
| --- | --- | --- |
| 新旧核心/章节四组合 × 3，默认 trace | 11 / 1 | 4 / 12 |
| 相同四组合 × 3，诊断时 trace=off | 11 / 1 | 7 / 12 |
| 原生 video，仅 metadata 恢复 × 6 | 0 / 6 | 0 / 6 |
| 原生 video，一次直接纠正 × 6 | 6 / 0 | 2 / 6 |
| 原生 video，一次下一任务纠正 × 6 | 6 / 0 | 1 / 6 |
| Chromium/Firefox 原生直接纠正入口各一次 | 2 / 0 | 0 / 2 |

前两组被监测的原生属性访问最长分别为 1 ms、2 ms，但心跳出现约五秒空档，
失败样本连续出现两段。关闭 trace 仍复现，说明录制不是必要条件。停顿发生于
这些被采样的属性访问之外；未分别测量原生方法、布局、媒体线程、GPU、OS 调度，
不能据此断言具体线程死锁或协议问题。

没有纠正的原生对照六次都回到接近零的位置，保留原位置断言失败，不改成成功。
加入一次纠正后六次均回到约三秒、保持暂停并能继续播放，且确认 window.Artplayer
不存在；两次仍有约五秒心跳空档。下一任务纠正也有 5104 ms 空档，因此没有采用
简单 setTimeout 作为核心修复。不能由小样本的数量差异推导某种模式更快或更可靠。

原始结果、错误、每例属性最大耗时、页面事件、心跳、位置与输入摘要见
[机器记录](../baselines/chapter-native-timing-validation.json)。此前的十秒读取
失败及本次失败均保留；后续须定位这些停顿与具体失败的因果关系。

## 复跑

先按 scripts/browser-validation/README.md 准备六包并设置安装 map。

```powershell
$env:ARTPLAYER_CHAPTER_TIMING_DIAGNOSTICS = '1'
yarn test:browser:installed chapter-combinations.spec.js --project=webkit --workers=2 --grep='quality switch' --repeat-each=3
```

`--trace=off` 只用于独立诊断对照，不修改正式 CI。完成进程后先归档该输出目录，
再执行下一组。恢复默认组合测试前清除上述诊断环境变量。

```powershell
# 不带纠正：本次 Windows WebKit 因位置归零而失败的原生对照。
$env:ARTPLAYER_NATIVE_QUALITY_CORRECTION = ''
yarn test:chapter-native --project=webkit --workers=2 --repeat-each=6
# 一次同步纠正，或改为 deferred 测试下一任务纠正。
$env:ARTPLAYER_NATIVE_QUALITY_CORRECTION = '1'
yarn test:chapter-native --project=webkit --workers=2 --repeat-each=6
```

每组都会写 refactor/.cache/chapter-native；先等待原进程终止，再核对目录归属并
归档，不能覆盖之前的失败。源码/工具后续变化要另记输入和结果，不套用旧报告。
scoped lint、严格工具链和计划检查通过；原生入口两引擎运行通过。这不是完整
章节/真机/发布验收，PKG-CHAPTER-05 与 CHAPTER-TIMING-01 继续开放。
撤销本检查点只移除诊断工具和文档，不涉及生产产物回退。未推送、部署或发布。
