# ENG-04：类型检查基础落地

日期 2026-09-10；起点 09902b8b；分支 codex/compatible-modernization。

新增根/核心/chapter tsconfig、浏览器资源声明、yarn typecheck 与 CI 接入。脚本自动发现分包配置，禁止严格检查退化为跳过声明或生成产物，并拒绝新 TS 包缺少配置。实现检查和消费者解析模式分开，当前核心/chapter 的生产 TS 文件数诚实输出为零；本任务没有改写生产源码或公开声明。

固定 TypeScript 5.9.3；新增根开发 alias typescript-compat=typescript 4.3.5，支持精确 alias 的 Yarn 工具检查与拒绝浮动 alias 的回归。4.1.6 试探无法解析现有类型内 getter，最终依赖已移除；4.3.5 是当前已测旧版本点，不是对全部历史消费者下限的新声明。

3 个严格配置通过；现代 TS 的 Node10+CJS、NodeNext+CJS、Bundler+ESM，以及 4.3.5 Node10+CJS 消费通过。NodeNext ESM 的 7 个既有诊断逐条保存并关联 BASE-TYPE-01，不当作候选通过。原发布包四模式/16 场景仍由基线测试执行；新增实际错误 URL、无效错误断言和源码类型错误的回归，不用跳过/any 消除历史差异。

验证：完整 ci:check 通过工具链、计划、只读 lint、类型入口、21 项 Node 和 19 项基线测试，共 40 项；特定类型文件 lint 通过。冻结安装核对新依赖；原 1335 个 lock selector 的版本/integrity 全同，只增加一个 alias。Yarn 合并了 esbuild/p-map 同版本 selector；esbuild 的已存在 selector resolved 合并到相同内容的 Yarn registry 地址，未升级生产依赖。

实际文件职责、运行命令、JS/TS 边界、旧编译器范围与后续工作见 [维护说明](../typechecking.md)。独立提交 ENG-04，撤销本提交可恢复原检查和依赖，不影响生产产物。下一项 ENG-06 让正常构建支持 TS 和非交互选包，随后接续单元/浏览器测试服务与 chapter 试点。
