# SITE-07 控制台许可分发检查点

以 63e4e8ad9206049c48bd2e2aee05166c05bed8d7 为修改前 HEAD，继续同一任务。
100 个模块及 Parcel 来源复现已通过；本次补齐已核实许可的实际站点分发。

## 实现与来源

站点 manifest 新增 console 组，把 32 个运行时包、Parcel 加载器的完整许可
接入现有 notices 生成器。styled-components 继续使用上一批已固定的上游文本。
原包许可不自动覆盖内嵌代码：console-feed 的 string-utils 明确保留 Chromium
2014 年 BSD 许可；styled-components 5.3.3 的 browser ESM source map 中，
stylisPluginInsertRule.js 保留 Sultan Tarimo 2016 年 MIT 全文。两段完整注释
分别保留，记录归档、成员、映射源路径和三层 SHA-256，不删注释符或改写原文。

新增 embedded-notices.ts 负责精确抽取和验证，reproduce.ts 纳入离线复核。
站点 CLI 保护三个组、原10组件及控制台35组件/35许可数量，避免清单意外缩小。
生成 docs/licenses/console/ 下35文件及公共总索引；所有许可输出共53文件，
加总索引为54输出。Git 属性保留原字节，后续修改从来源/manifest 更新再生成。

## 验证

- Node 24.21.0，Yarn 1.22.22 配置不变，未新增依赖或锁文件修改。
- 控制台与 notices 单元20/20；包括缺映射源、重复源、缺正文、篡改/截短许可、
  删除包或独立署名时在写出前失败的反例。
- 完整离线复现100/100、Parcel及跨包边通过，新增两段许可抽取精确匹配。
- docs-tools 严格 TS 通过；首次 lint 发现 includes 写法与 import 排序问题，
  修复后相关 lint 通过；console 与 notices 只读生成检查通过。
- 三引擎实际本地页面3/3，无重试或跳过。每个引擎请求并逐字节比较全部53份
  许可，校验公共索引、Codicons 字体，且运行移动页日志、原生播放与销毁。
  具体浏览器版本、报告哈希及诊断见[验证记录](../baselines/console-notices-validation.json)。
  外部 HTTPS 被测试夹具隔离；这是 Windows 本地页面证据，不代表手机或远端发布。
  Chromium 诊断记录一次 pattern.mp4 的 ERR_ABORTED；播放断言及销毁通过，
  没有未处理页面错误/console error。现有诊断没有请求失败时间，故不将其断言
  为特定销毁时刻的取消；许可 HTTP 请求全部成功且字节一致。

## 剩余范围与回退

这不是完整许可审查结论。需继续核对 console-feed 的 replicator 与 Component
内 Stack Overflow 引用、linkifyjs 的 simple-html-tokenizer、Emotion 中的
stylis/hash/cache rule-sheet，以及 react-inspector 源码映射显示的 Babel/
regenerator 内嵌代码。已发现链接或映射源并不等于已确认其版本/许可要求；
详见 console-embedded-notices.json 的 pending 项。VENDOR-08 保持 open，
SITE-07 保持 doing，仍199/265完成；Monaco/字体/媒体的其他范围继续待审。

无站点运行时 JS、旧 API、包版本或入口变化。上一批控制台运行时测试仍对应
相同源码产物，本轮补测实际许可交付。回退移除 console notice 组/新增输出及
抽取器，恢复原生成器检查，不改变已交付的控制台生命周期修复。
本地独立检查点提交，无推送、部署或发布。
