# SITE-07 控制台 CommonJS 来源检查点

本批从 13 个经过 SRI 校验的官方 npm 归档重建 41 个模块，加上已有 console-feed
32 个，累计 73/100 个第三方模块与冻结函数体逐字一致。组件版本、归档和成员
指纹、完整相对依赖关系与剩余 27 个模块见
[来源记录](../baselines/console-commonjs-provenance.json)。

新增匹配包括 React/ReactDOM 17.0.2、scheduler 0.20.2、object-assign 4.1.1、
react-is 16.13.1、prop-types 15.7.2、shallowequal 1.1.0、process 0.11.10、
hoist-non-react-statics 3.3.2、is-dom 1.1.0、is-object/is-window 1.0.2、
linkifyjs 2.1.9。这里记录的是可精确重建的来源，不是找回原始安装锁或唯一版本。

## 构建规则与保留差异

生产入口的 NODE_ENV 变换和 process.browser 赋值移除，均在官方 Parcel 1.12.5
对应 visitor 中找到依据。只有固定且已哈希校验的源码经过这些操作，并必须得到
旧模块原字节。未匹配时不得换成语义近似、规范化 AST 或放宽字符串比较。

首次普通压缩匹配 40/42；process 的 browser 字段差异按原 visitor 处理后精确
匹配，故最终收录 41 项。react-inspector 5.1.1 CJS 仍不匹配；进一步调查显示
可能涉及 ES module 转换，但本地 Babel 缺少转换插件/传递 helper，尚未形成
可复现的匹配。该条及 Emotion/styled-components/Babel helper 共 27 项保持未确认。
没有将失败归档或缺失工具当作发布豁免。

## 工具与验证

现有 reproduce.ts 扩展为同时校验两个来源记录，显式 --fetch 下载固定 15 个归档
（14 个运行时来源加 Terser 工具）；无参数只使用独立缓存。没有安装依赖、改根
Yarn 锁或执行被比对的运行时库。provenance.ts 支持显式多个包根，并限制相对依赖
不能跨归档；完整来源集和剩余集都验证，防止丢失、重复或错误归属。

联网准备后与离线复现均为 73/73。单元 10/10，覆盖跨归档、遗漏根、重复根及先前
SRI/源码/输出/依赖反例；严格 docs-tools TS、相关 lint、build:console --check
通过。原始日志保留在 refactor/.cache/console-commonjs-{fetch-rebuild,offline,unit}.log。
所有运行时 JS、生成资产、包入口与锁文件不变，故未重复页面/播放测试。

13 个归档的原始许可已按实际字节冻结，并加 Git 属性防止换行改写。它们不是对
内嵌组件的完整许可审查；尚未作为整套 console notices 对外分发。SITE-07 doing、
VENDOR-08 open，完成数仍为 199/265；无远端 CI、部署或发布验收。

维护/复现入口见[说明](../../scripts/site-vendor/console/README.md)。回退本检查点
恢复 32 模块的复现工具和台账，移除本批来源/许可/测试，不影响运行时修复。
本检查点独立本地提交，无推送或发布。
