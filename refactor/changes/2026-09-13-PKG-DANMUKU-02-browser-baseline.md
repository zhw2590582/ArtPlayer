# PKG-DANMUKU-02 浏览器与负载基线

本记录整合先前的[受控失败子项](2026-09-13-PKG-DANMUKU-02-controlled-failures.md)：
42项旧失败观察及父代理复跑通过，新增真实浏览器的行为、布局和负载记录。
这里完成的是重构前基线，生产代码、类型及dist均未修改；没有把已复现缺陷当作
候选必须保持的行为，也不代表弹幕能力或整包已经达到发布条件。

## 实际浏览器范围

使用真实npm Danmuku 5.3.0 main/legacy归档字节，每次核验SHA；真实已发布核心
5.4.0及当前候选5.4.1。Chromium 153.0.8010.12、Firefox 155.0、Windows WebKit26.6，
后者不是Safari真机。页面运行本地八秒视频、原生Blob Worker、实际DOM/设置操作。
Worker子类只记录创建/消息/终止，不替换回复、算法、RAF或媒体时钟。外网被拒绝，
同源Blob可用。共2核心×2插件格式×4场景×3引擎，48项通过、无跳过或未处理页面错误。

- 三种弹幕模式、同步filter与异步beforeVisible，真实居中/边界布局与Worker工作。
- 六条同时固定弹幕的顺序、严格非重叠几何与暂停状态。
- 原生play/pause/seek、两倍播放及四秒CSS运动时长，reset节点复用和load替换/追加。
- 实际设置面板、异步发送去重和锁定、外挂输入框在网页全屏时移入并回位，双实例
  销毁隔离；旧版外部设置DOM残留如实记录为后续清理问题。

截图、原始几何、事件/Worker记录和运行输入在
[机器报告](../baselines/danmuku-browser-validation.json)引用的不可变归档中。

## 初轮失败及处置

首轮Chromium为7通过、9失败，原spec、报告、截图和trace完整保留。
八项来自两个错误测试假设：网页全屏会把播放器移到body，原容器选择器失效；
旧版可能复用一个节点后又生成额外节点，不能要求最终可见节点必须是原节点。
测试改为验证实际控件引用归属，以及原节点确实被再次使用，同时记录额外/隐藏节点。
没有修改生产行为来满足测试。

另一次是**实际轨道重叠**：dense0和dense1的y都为10，宽70、高22.5，并观察到
两次start及重复Worker消息id。截图也显示两条文字重叠。DANMUKU-TRACK-01保持开放，
与已受控复现的双RAF/请求覆盖问题一同由04/05/07修复验收。严格非重叠断言仍保留；
后次48通过只能说明那一轮没有触发，不能说明竞态已修复，后续运行仍可能再次报红。

负载首轮六项也保留：读取不存在的art.paused导致等待失败。改为原生
art.template.$video.paused后重跑通过；这属于测试错误，不记录成生产缺陷。

## 300条弹幕负载观察

两种实际插件格式、已发布核心、三个引擎，共六个配置；各载入300个独立ID混合模式
弹幕，确认完整队列、真实播放到至少四秒、可见输出、Worker工作和销毁。保存原始
帧时间戳/间隔、实际DOM池与几何、可见ID及各阶段performance.memory。独立RAF
观察者不更改插件时钟，但其自身也有测量开销。

初次三worker运行全部通过。WebKit帧间隔较长，因此再以单worker串行复测六个配置，
减少并行测试争用；两份报告均保留，不能混为相同条件或增加六种功能覆盖。
初次并行样本的可见唯一ID为51–129，DOM节点53–131；300载入成功不代表300条都
在短窗口显示。真实排队/轨道与显示窗口仍受当前调度器影响。

串行六项也通过。该主机上的帧间隔中位数：Chromium两格式约16.7ms，Firefox约
16.66ms，Windows WebKit为78/80ms；WebKit的p95为101/104ms。其样本可见51个ID、
DOM53个节点；记录保留这个差异，不因测试通过就称流畅，也不外推为Safari设备结论。
实际暂停时间约4.61–5.06秒，原始时间戳保留，后续比较须使用相同输入/观察方式。

Chromium提供堆读数，Firefox/WebKit为空；没有强制GC、跨引擎堆值比较、短样本
泄漏结论或凭空设置性能阈值。串行结果是后续同条件对照，07仍需更长负载、重复
装卸和资源稳定性验收。真实设备/CSP、Bilibili网络、Mask模型和最终新旧组合仍归后续。

## 重放、提交与下一步

```sh
yarn test:danmuku
yarn exec playwright test test/browser/danmuku-baseline.spec.js --workers=3
yarn exec playwright test test/browser/danmuku-load-baseline.spec.js --workers=1
```

固定Node24.21.0/Yarn1.22.22。受控测试接入test:unit，契约由test:baseline收集，
浏览器文件由既有Playwright发现。没有安装依赖、修改锁文件或使用全局吞错处理。
lint及任务/风险/契约索引校验随本次提交；本任务独立commit，无推送、标签或npm发布。

03接着整理加载、解析与config，保留数组同步初始化顺序、内部链式返回身份、
追加/替换区别、逐条await emit以及live option回调接收者；优先修复网络拒绝悬挂、
空XML、解析Worker/Blob释放、过期替换、time0和函数配置更新。轨道Worker/RAF、
设置/heatmap和完整TS公开类型分别由04/05/06接续。
