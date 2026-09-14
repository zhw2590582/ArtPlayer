# SITE-07 控制台 100 模块与加载器来源重建

最后 27 个模块使用 18 个官方 npm 归档精确重建；与已有 32+41 项合计，覆盖全部
100 个第三方模块。Parcel 1.12.5 的 prelude 在按其 getExisting 规则去掉末尾分号
后，也与原加载器逐字一致；入口调用和 map trailer 单独核对。来源、成员/编译
哈希、环境、包根与外部边界见[记录](../baselines/console-esm-provenance.json)。

## 关键发现与复现规则

- @emotion/core、styled-base、emotion-theming 的精确来源为 10.3.0；较早候选
  版本的 chunk 名、helper 路径和内容不同，不以功能近似通过。
- Babel standalone 7.16.4 提供完整且自包含的历史转换器，避免将旧工具及其
  传递依赖混进根工程。React-inspector 5.1.1 使用 ES member；CJS member 不匹配。
- Parcel generate 在压缩前和最终输出前都加全局声明；因此保留 define/process
  的两次插入。默认全局声明放在 use strict 前的历史效果也保持，不手改输出。
- styled-components 先执行 typeof-symbol，再单独转换 CommonJS；把两者放在
  同一遍会误改新生成的 interop helper。NODE_ENV 固定 production，四项 SC 配置
  为 undefined，均来自已固定源码及 Parcel 环境处理规则的精确重建。
- Terser 3.17.0 会修改 options 对象，逐模块复制选项，避免跨模块状态与记录污染。

早期 Babel 插件/传递 helper 缺失只发生在独立缓存探针；后来改用 standalone。
首次读取该较大成员超过 Node 默认输出缓冲，改为固定 8MiB 上限后完整读取并验证
哈希。缺失候选 chunk、错误双引号脚本、序列化被压缩器修改的对象等诊断失败均
未改变生产内容；最终工具坚持归档 SRI、源码与输出字节、闭合依赖的同一检查。

## 工具、测试与许可边界

reconstruction.ts 管理有顺序的转换/环境/全局声明和 prelude；provenance.ts
验证包根、相对映射、完整覆盖以及命名/作用域子路径导入必须指向实际归属包。
reproduce.ts 同时读取三份来源记录，显式 --fetch 下载固定 35 个归档；离线使用
同一缓存。只执行固定历史编译器，未安装依赖、修改 Yarn 锁或执行被比对的库。

最终复现 100/100、Parcel prelude/invocation 和全部跨包依赖通过。单元13/13，
新增转换分阶段、显式环境/全局边界、错误加载器/入口、错误包归属反例；严格
docs-tools TS、相关 lint、build:console --check 通过。原日志位于
refactor/.cache/console-esm-{fetch-rebuild,offline,tests}.log。
最终联网复核两次 ECONNRESET；失败日志 final-fetch 与 final-fetch-second 保留。
补上具体 URL 后确认第二次来自补充许可的 raw 地址，第一次未记录具体请求。
改用同一固定 commit 的 GitHub Contents API 后，最终完整命令100/100通过，日志
为 final-fetch-api；解码内容与已有原文哈希一致，记录 API URL 和 Git blob ID。
下载错误保留具体 URL 与 cause，且保持现有 ES2021 类型检查范围。

新增 17 个归档的 LICENSE 原文及 Parcel LICENSE。styled-components 5.3.3 的
npm 归档缺 LICENSE；从对应 v5.3.3 的固定上游提交
9b3457036cfedf1d5336f654f3171657630a9fd8 取得原文，记录 URL、哈希和缺失原因。
这些不代替内嵌代码署名审查（例如 console-feed 内的 replicator）或实际 notices
分发，故 VENDOR-08 仍 open，SITE-07 仍 doing，任务完成数保持 199/265。

本批没有改站点 JS、公开接口、包入口、版本或锁文件，未重复实际页面测试；上一
任务的浏览器证据对应相同运行时。本检查点不代表远端 CI、手机或发布验收。
回退仅恢复 73 模块的溯源工具/台账并移除新增来源/许可/测试，不影响控制台修复。
维护说明见[模块文档](../../scripts/site-vendor/console/README.md)。独立本地提交，
无推送或发布。
