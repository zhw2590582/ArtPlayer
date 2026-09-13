# PKG-JASSUB-04 自有 TS 与兼容类型

## 结构与运行时边界

自有 index/registration 迁为严格 TS，职责延续 03 的工厂与资源注册分离。
JassubHost 只需要 video/on/off，真实 Artplayer fixture 验证结构兼容；内部返回
RuntimeResult，不使用已知不准确的旧根声明来约束实现。私有 jassub.es.d.ts
桥接 vendor，只补 adapter 使用的 _destroyed 与最小样式写入契约，保留数值 20
经 DOM setter 转字符串的历史行为。allowJs=false，不用 any/ts-nocheck 隐藏自有实现。

vendor JS 是明确的第三方例外，本次完全不改字节和算法。Worker/WASM/font 来源
和 07 修复责任继续保留。两个自有模块经 esbuild 去类型后与 38e7b378 的 JS 完全
相同；正常构建 main/legacy/ESM 与该提交一致（仅归一化 LF），docs 副本逐字节一致。
因此不以这次类型迁移声称新增浏览器播放验收，03 的原生验证范围和限制仍适用。

## API-09/11 兼容策略

实际 npm 1.0.0/1.1.0 根声明相同，本次逐字保留（忽略换行）：资源 URL 必填、
force-first resize、三个 Promise 返回值和两个扩展索引都没有收窄。工厂完整
双向赋值、Parameters/ReturnType 和原有非法调用的错误位置继续验证。

新增可选 /runtime 与根入口复用同一 JavaScript，准确声明可选 options、同步
registration/resize/setVideo/destroy、width/height/top/left/force 顺序，以及
EventTarget、字幕/样式/字体方法。sendMessage 实际是 Promise<void>，完成仅代表
发出消息；不声称 Worker 已处理。ASS Style 是 libass 数值索引，Start/Duration
是毫秒，查询结果没有上游 npm 类型误写的 _index。旧入口消费者不需要迁移，
选择准确入口时的推导差异和调用示例写在包内 types/README.md。

精确 typesVersions 修复旧 Node10 下 /legacy 找不到声明；实际两旧包保留原 2307
证据，候选仅允许消除该 import 行的错误。NodeNext ESM 旧根 namespace 行为及
直接调用失败保持一致；/runtime 使用 conditional .d.mts/.d.cts 与旧编译器 .d.ts。
不添加不存在的 factory.default。在线编辑器旧生成方式同时包含 default/export=
而报 2309，两个编译器已复现；接入已有语义生成器并验证生成文件及正反例。

## 类型审查发现的真实缺陷

JASSUB-QUERY-01：getEvents/getStyles 的 timeout 和 Worker-error 路径缺少第二个
参数，公开 wrapper 先解构 undefined 抛 TypeError，用户回调为零次，两个请求
监听器保留；Worker-error 路径还保留定时器。冻结实现的四个失败测试保留此行为。
该问题纳入 PKG-JASSUB-07 的独立 vendor 修复，不在 04 中混改，不标为已修复。
准确回调类型允许 Error/ErrorEvent 与缺失数组，不能代表错误回调已经可靠送达。

## 验证、命令与限制

完整证据与最终安装报告摘要见 [类型验证](../baselines/jassub-types-validation.json)。
验证包括：严格 TS 自有项目及全仓流程，实际旧声明正反例、生成编辑器，源码和
main/legacy 注册回归，完整 vendor Worker JS/本地 WASM 的字幕查询及部分字段更新。
WASM 测试控制消息传输与 fetch，不声称浏览器 Worker、绘制或完整字体加载验收。

仓库外实际安装两个历史 npm 归档与 Yarn pack 候选，逐文件核对 hash 和非链接，
离线安装后强制 frozen 重装并检查锁文件。TS 5.9.3 Node10/NodeNext CJS/ESM/Bundler
及 TS 4.3.5 Node10 共 15 组；旧入口七项非法调用、准确入口十四项非法调用逐条
验证。CJS/ESM 根/legacy 工厂和 root/runtime 同一对象从实际安装包执行，不启动
vendor 或模拟一次浏览器播放。历史 raw 错误与正确 namespace 消费均单独记录。

复跑：yarn test:jassub、yarn test:jassub-types、yarn test:jassub-types-package、
yarn typecheck、yarn build:ts artplayer-plugin-jassub、yarn build artplayer-plugin-jassub。
新增脚本复用既有依赖，无新增依赖或锁变更；类型测试进入既有 baseline glob，
运行测试进入 test:unit/test:jassub。隔离安装脚本是可复跑的分包验证，尚不声称
全部生态安装矩阵已经接入远程 CI 或运行通过。

## 剩余任务与回退

07 继续 vendor 生命周期、时钟和查询错误清理；05 继续新旧核心/浏览器/真实设备
组合；06 继续完整分发和许可通知，VENDOR-04/05 保留。版本仍由各包独立 major
任务统一落地。本任务没有发布、推送或减少最终三轮复盘要求。
回退本任务并正常重建即可恢复旧 JS 入口/类型生成选择；03 修复仍是独立提交。
