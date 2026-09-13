# PKG-ASR-04：ASR 公共类型与隔离安装

本任务延续 ASR-03 的 8 个严格 TS 模块，处理公共类型与安装边界。保留根入口及
`/legacy` 的历史工厂形状，新增 `/runtime` 精确描述回调返回字幕、异步 stop。
不改运行时 JS、不新增依赖、不修改版本；大版本与发布仍按后续任务统一执行。

## 兼容决策

- 根入口仍是原来的可选参数、同步注册、void stop、void/Promise<void> callback；
  旧工厂和插件结果可双向赋值，Parameters/ReturnType 提取也保留。
- `/runtime` 加载同一 main/ESM 产物，只提供准确的类型入口：回调可同步或异步返回
  string/null/void，stop 返回 Promise<void>，工厂具有只读 self.default。
  不将 self.default 加到旧工厂类型，避免要求用户的替换函数提供额外属性。
- root 与 runtime 都导出 AudioChunk/RuntimeOption/RuntimeResult/RuntimeFactory。
  runtime 的 ESM 使用 `.d.mts`，CommonJS/Node10 使用 export assignment。
  子代理发现后者漏了命名类型，已补纯类型 namespace 并加入四类型等价回归。
- 旧根声明在 NodeNext ESM 下把 default import 描述成命名空间，合法的
  `asr.default()`、`namespace.default.default()` 和 `{default: factory}` 替换必须保留。
  原拟直接工厂 `.d.mts` 会破坏这些旧类型用法，已撤回；准确 ESM 默认导入用 `/runtime`。
  这是声明兼容测试，不能推断旧 JS 支持所有双层 default 调用。

包内 README 给出新入口用法，ARCHITECTURE 记录维护限制。实际打包发现 tsconfig
泄漏，已补 `.npmignore`，保留所有历史 dist/types 文件。源码 TS 与测试不进入包。

## 验证与证据

`yarn test:asr-types-package` 实际打包核心与 ASR，在工作区外逐个安装 frozen
2.0.0、2.1.0 及候选包。离线安装后用 frozen lockfile 再安装；检查锁文件不变、
无工作区符号链接、全部包文件与 archive 哈希相符。类型程序只能读取该临时消费者
及当前编译器标准库；strict、skipLibCheck:false、types:[]，不靠 ambient 类型兜底。

- 2 个旧发布包各 5 种配置；每包 4 种直接用法通过，NodeNext ESM 原有 15 条诊断
  按完整消息冻结。合法 ESM 命名空间 fixture 在两个旧包及候选包均通过。
- 候选 7 种配置：TS 5.9.3 Node10/NodeNext CJS/NodeNext ESM/Bundler，TS 4.3.5
  Node10，以及两编译器 Node10 关闭 interop。每种公共用法零诊断，12 项负例在
  各自语句行被拒绝；原 direct fixture 的 NodeNext ESM 诊断也与旧包一致。
- 实际 Node 24.21.0 import/require 验证三候选入口、root/runtime 实现身份、
  self.default 不可枚举、legacy 默认导入身份；旧包验证各自 CJS 和 ESM 导出。
- 根项目及 ASR 分包严格检查通过，source/public 类型边界加入持续检查。
  定向 ESLint 和台账测试通过，ASR 构建 JS 与 ASR-03 HEAD 逐字节相同。

类型反例中的 typed-array 与 ArrayBuffer 在旧 TS 标准库下结构可赋值，不能声称
TS 4.3.5 会拒绝。负例使用所有目标编译器都应拒绝的字符串 buffer，保持公开
ArrayBuffer 字段不变；没有通过缩窄字段或升级最低编译器绕过兼容性。

具体 archive、输入、日志哈希及矩阵摘要见
[验证记录](../baselines/asr-types-validation.json)，旧 direct 诊断见
[冻结声明诊断](../baselines/asr-type-diagnostics.json)。此前 ASR-03 的音频/浏览器
证据继续对应未变的 JS；本任务没有重复整仓 CI 或浏览器回归，也不声称完成真实
fallback、音量/静音、CORS、物理设备或全 Node 版本验收。这些仍归 ASR-05/06。

子代理独立提供公共/历史消费者与声明审查，主代理修复声明、运行实际隔离安装、
整合证据和提交。回退本任务移除新增类型入口与测试，不改变 ASR-03 运行时修复。
