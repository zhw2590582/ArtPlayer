# PKG-HLS-SDK-01 控制器现场与 Firefox 诊断限制

来源 HEAD：`ea3174daa28e698af3db2ff36aecf4ef2da54470`。本次是进行中任务的检查点，
不是插件验收完成；HLS-PLAYBACK-01 与 HLS-CRASH-01 继续 open。

## 取得的证据与下一步变化

未改动的分组集成用例在 Firefox 155.0 / Hls.js 1.7.2 / 发布核心 / 候选插件上
连续执行 20 次均通过。这只能说明本轮未再现，不推翻先前 0.999146 秒停滞、
空媒体缓冲及没有后续 high 视频请求的失败。不能把重复通过作为关闭风险的依据。

对固定 SDK 增加可选 `--controller-state`：在已有事件及 buffer/fragment 事件上
读取主/音频控制器、独立 SourceBuffer、当前/上一片段、endList 和片段跟踪状态。
仍用原来最多 400 条的事件队列，未插入 play/seek、关闭 Worker、改变 SDK 参数或
扩大断言超时。未开启时不安装观察函数，也不增加这些观察事件。
启用后还通过页面绑定异步复制事件到 Node 的独立400条队列，页面崩溃后仍保留已收到的
记录；最后尚未送达的事件可能丢失，receivedDuring 仅表示宿主收到时的阶段。
无穷大的 flush 终点写为字符串 Infinity，避免 JSON 把它变成 null 后产生歧义。

新的成功对照也出现过主控制器 ENDED、video.buffered 为空，但视频 SourceBuffer
仍有 0–12 秒数据，音频 SourceBuffer 暂时为空的组合。其后正常恢复并双向切档实播。
因此，单独看到 ENDED 和 video.buffered=[] 不足以认定根因；后续失败需要同时保留
音频/视频缓冲、片段追踪和 flush 顺序，不能据此强行 reset 主控制器。

## 实现与验证

`test/helpers/hls-controller-state.js` 是可序列化进页面的只读快照函数，仅用于
两个冻结 SDK。fragmentTracker 归属 stream/audio controller；1.5.17 的
sourceBuffer 字典与 1.7.2 的 sourceBuffers 数组分别读取。loaded 对象会含循环
引用，只记录是否存在，不导出整个对象。销毁后不读取失效的公共档位 getter。
1.5.17 的 audio controller 从 networkControllers 中按 playlistType 识别；
1.7.2 则可读取 audioStreamController，不能因字段缺失误报没有音频控制器。
原生 range getter 失败时返回单独 diagnosticError，不覆盖播放器原失败。

新增四项 Node/独立 VM 测试覆盖页面序列化、循环引用、旧版缓冲布局、销毁 getter
和采集错误；与既有固定 SDK 来源测试合计 5 通过，定向 lint 通过。

最终观察器实际运行：直接 native video 两 SDK 各一次，发布核心+候选插件两 SDK
各一次；四次均通过且均取得非空独立缓冲、片段跟踪和 endList 记录，无采集错误。
两版都有音频控制器状态，并验证 Node 收到记录与页面队列数量相同。
原默认模式 Hls.js 1.7.2 另运行一次通过，未开启 controller/Worker observer 或 SDK logs。
这五次不是全包矩阵。原集成测试的 20 次在新增观察器前执行，单独记录。

最初七次观察运行虽完成播放，但 tracker 路径错误导致字段缺失；修正归属后又做
四次，确认 tracker 可读，不过 1.5.17 的独立缓冲字段仍未收集。补上旧缓冲布局的
早期四次和默认一次也保存；之后补齐页面外保留及1.5音频定位，再做最终验证。
所有这些日志分别保留，不能把早期部分附件当作完整控制器证据。
lint 首轮三处 runner 说明/格式问题已修正；没有更新 SDK 或媒体来制造通过。

## 本轮再次捕获的真实崩溃

上述改进期间，直接 native video 的两个诊断序列各发生一次 Hls.js 1.5.17 页面崩溃。
第一个序列为一失败一通过，首个1.5.17就在 high-group 阶段崩溃，无更早SDK、ArtPlayer
或插件；当时只有页内队列，崩溃后读不到现场。第二个序列为三通过一失败，失败是第三项
1.5.17，Node 在页面失联后仍保留97条已收到事件。两个序列退出码均为1，最终通过不覆盖它们。

第二次最后记录：播放位置0.381837、readyState=4、高度90、9帧；先发audio flush，
再选择音轨、高组，最后发video flush。最后video SourceBuffer仍为0–8秒，audio为空，
两者updating=true，main从PARSED进入IDLE，endList为空。此时尚未执行destroy。
crash事件在宿主low-group阶段收到，后续high-group等待抛出Target crashed；保留两种
阶段信息，不把宿主阶段标签当精确原生崩溃位置。最后收到的事件不一定是最后执行的事件。
这些记录增强了独立SDK/Firefox路径证据，但没有定位原生模块、异常代码或堆栈；
尤其不能把此页面崩溃与1.7.2的播放停滞合并成同一个已证明根因。

## Firefox 原生崩溃证据的限制

实际安装目录 firefox-1543/firefox/omni.ja 的
`chrome/toolkit/content/global/buildconfig.html` 明确包含 `--disable-crashreporter`。
同目录 playwright.cfg 第350行锁定 toolkit.crashreporter.enabled=false，且没有
crashreporter/minidump-analyzer 可执行文件。自动导航 about:buildconfig 超时后，
改为只读提取本地归档成员；并未改写浏览器、偏好或系统注册表。

[Mozilla 文档](https://firefox-source-docs.mozilla.org/toolkit/crashreporter/crashreporter/index.html)
说明环境变量可控制已构建的 crash reporter，但不能让本机已禁用的编译功能出现。
所以这里没有添加一个虚假的“设置变量即可收集 minidump”选项，也没有声称取得原生堆栈。
后续需要针对本任务创建的准确进程收集 Windows 原生异常，或使用具备相应功能的独立
浏览器对照。可选工具依据见
[Microsoft ProcDump](https://learn.microsoft.com/en-us/sysinternals/downloads/procdump)。
本轮仅查阅该工具说明，未安装、附加调试器、设置系统级崩溃捕获或上传报告。

## 重跑与交接

```sh
yarn test:browser hls-sdk.spec.js --project=firefox --grep "1.7.2.*published core: group changes" --repeat-each=20 --workers=1
node refactor/scripts/hls-sdk-diagnostic.mjs --sequence 1.5.17,1.7.2 --switch-boundary immediate --controller-state --capture-before-destroy
node refactor/scripts/hls-sdk-diagnostic.mjs --sequence 1.5.17,1.7.2 --host published --plugin --switch-boundary selected --controller-state --capture-before-destroy
node --test refactor/scripts/hls-controller-state.test.mjs refactor/scripts/hls-sdk-matrix.test.mjs
```

Windows / Node 24.21.0 / Yarn Classic 1.22.22；两个 SDK 都保持 enableWorker=true。
原分组停滞与独立原生页面崩溃仍未定位，后续优先获取失败现场或进程异常证据；
不要再把无观察器的重复绿色结果作为新修复。来源、实际样本和日志指纹见
[机器证据](../baselines/hls-controller-validation.json)。

回退本检查点仅撤销诊断采集、相应测试与说明。没有生产源码、公开 API、类型、
依赖、锁文件或分发产物变化，没有推送、部署或发布。
