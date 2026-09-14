# CI-01 当前五包安装范围完整回归

基于 37ebb7a034c0b1723ce7839f875cb6b110a88b3b，使用固定 Node 24.21.0、
Yarn 1.22.22 和已经隔离构建、打包、安装并核验摘要的 run-z8nBqx 五包 main。
执行 `yarn test:browser:installed --workers=2`，没有文件、项目或 grep 过滤。
这是当前 installed 子集的完整运行，不是整个仓库 source 测试或全部22包验收。

## 结果及对照

255项成功退出，0失败、0跳过、0重试，Playwright耗时199.505秒，Yarn总耗时
200.52秒。11文件各在 Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6
运行，覆盖核心生命周期、章节/缩略图/全屏交互、Ambilight与Canvas，以及
Canvas字幕和原生Document PiP组合。实际运行在Windows桌面引擎中。

Canvas原生画中画共有12项窗口播放通过，另6项WebKit返回明确的API不可用记录。
这6项虽成功退出测试函数，不能计为原生画中画支持。完整证据逐文件、逐引擎统计，
记录安装输入与tarball摘要、实际子进程退出码、浏览器版本和能力分支：
[ci-installed-full-validation.json](../baselines/ci-installed-full-validation.json)。

原四包225项报告保留原样（224通过/1章节全屏悬停失败）。本次扩展后的完整运行
通过，结合独立的PKG-CHAPTER-HOVER-01旧红新绿证据，补足先前只有定向复测的
完整子集回归；不把原失败报告改写成成功，也不声称复现了原运行的精确调度。

## 后续范围

CI-01继续doing。仍需完整source耗时/失败调查、其他包安装范围、实际Actions
系统矩阵与远端验收。此轮只跑main；此前Canvas/PiP/章节定向legacy证据仍独立
保存，不能据此称完整legacy子集通过。没有修改运行时、依赖、超时或断言。
没有push、部署或发布；本次仅提交完整回归的可追溯证据与状态文档。
