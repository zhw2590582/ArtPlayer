# CORE-25 无 navigator 默认选项修复

CI-01 的 Node 20 安装测试发现 Artplayer.option 在没有 navigator 时抛出 ReferenceError，
旧 npm 5.4.0 和重构候选均复现。较新 Node 自带 navigator，原测试没有覆盖这个环境。
本任务修复安全读取默认值，不改变浏览器构造、语言配置或公开声明。

## 实现与类型边界

option/defaults.ts 用 typeof navigator 检查全局绑定是否存在，再沿用原来的可选访问和
小写转换。没有绑定或值为 null/undefined 时，返回的默认对象仍拥有 lang 字段，其值
是 undefined；浏览器每次读取实际语言，显式配置的 lang 仍覆盖默认值。没有新全局对象、
补丁或缓存，也没有引入旧浏览器不具备的 globalThis 依赖。

完整检查进一步指出，原 ResolvedOption 错把未校验的默认语言标为必定存在。现在
option/types.ts 增加私有 DefaultOption，只有 lang 可以为 undefined，其余嵌套默认值
仍完整；resolve.ts/runtime.ts 接受这种输入，校验成功后仍返回原 ResolvedOption。
原 validator 在缺失语言且未提供覆盖值时继续拒绝，不通过类型断言或弱化 I18nHost
掩盖问题。公开 Option 本来就允许 lang 缺省，public/types 文件及消费者调用无需变化。

## 验证

- 新源码回归在修复前 9 项通过、1 项按预期失败；修复后相关 16 项通过，覆盖缺少绑定、
  undefined/null、独立对象、实时语言读取、缺失语言校验失败与显式语言覆盖。
- 内部类型反例确认未校验 lang 不能直接 toLowerCase，校验后仍是 string；核心严格检查通过。
  首次完整检查发现的内部类型错误已修复并保留日志，随后完整 ci:check 2432 项通过
  （2033 单元、28 工程、371 基线），不是忽略类型错误换取成功。
- 同一干净 tarball 在 Node 20.19.0/22.12.0/24.21.0 各跑 36 项候选和 31 项发布观察，
  实际 CJS/ESM/legacy 默认读取成功；发布版的精确 ReferenceError 继续单独保留。
  严格 package:release 通过，五个旧类型与八个精确类型模式零诊断，当前夹具的 runtime blocker 为零。
- Chromium/Firefox/Windows WebKit，对源码、安装 main、安装 legacy 各跑 30 项，共 90 项。
  en-US/zh-CN 浏览器环境的默认值、实例语言、显式 fr 覆盖及后续默认读取保持原行为；
  既有正常选项、失败构造和实际媒体 ready 回归同时运行，没有未处理浏览器错误。

版本、逐项浏览器结果、实际 Node、产物与日志摘要见
[验证记录](../baselines/defaults-ssr-validation.json)。Windows WebKit 不代表物理 Safari/移动设备。

## 构建与关联修复

构建时另外发现 Vite 把声明 public 源码复制进 dist。已由独立 ENG-12 提交 4a299eb2d
修复，完整 21 库/文档构建通过；本任务在该提交后重新生成干净 tarball 并重跑三个 Node。
浏览器使用的 JS 与最终 tarball、正常生成的 dist 和 docs 副本逐字一致，因此独立的
源码复制清理没有使浏览器证据失效。正常 build artplayer 与 build:i18n 已重新通过。

没有版本或依赖变化，没有手改 dist 内容。JS 改进仅作用于原先抛错的无 navigator 路径，
旧浏览器语言与包入口保持兼容。CORE-DEFAULTS-SSR-01 关闭；三轮全项目复盘及其余
生态/设备/远端 CI 门槛仍未完成，不能据此发布 npm。

维护入口为包内 ARCHITECTURE.md。回退本提交会重新引入此 SSR 默认值缺陷；发布基线
反例应保留。独立提交主题：fix(core): [CORE-25] read defaults without navigator。
