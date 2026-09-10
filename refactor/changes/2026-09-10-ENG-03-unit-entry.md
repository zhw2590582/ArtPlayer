# ENG-03：公共行为与单元入口

日期 2026-09-10；起点 b53461da；分支 codex/compatible-modernization。

新增 yarn test:unit 和 yarn test，保留 test:playback/test:dash-control/test:node/test:baseline/test:imports；ci:check 复用统一入口。播放与 DASH 的原 19 项断言保留，只提取源码加载和可控媒体夹具。新增的 JS/TS loader 会拒绝两个同名后缀同时存在，Vite 源包加载不写 dist，避免源码改名后测试仍加载旧 JS。

公共 Emitter 的五组行为由同一份 contracts/emitter.js 执行：链式返回/上下文/参数、once 重入、派发快照、按原函数删除 once/重复监听、异常传播。固定发布 core 5.4.0 与当前源码均通过；ARTPLAYER_TEST_CORE 可加入实际候选产物，同一夹具分别运行 ENG-06 生成的 .js/.legacy.js/.mjs，三次各 15 项通过。候选 SHA-256 仍对应 [构建证据](../baselines/build-validation.json) 的核心三产物。

新增的 loader 回归实际编译 TS/JS 并验证含糊入口被拒绝。完整 ci:check 通过只读 lint、类型、30 项单元/公共契约、2 项工具回归、22 项基线测试，共 54 项，无失败或跳过；不改生产源码、公开声明、依赖版本或产物，也未追加浏览器通过结论。已发布归档会先校验完整性，缺缓存时下载固定版本；候选事件检查不代替隔离安装/全部 API/真实媒体。

实现地图、命令与维护规则在仓库 test/README.md。本任务独立提交 ENG-03；撤销可回到原 Node 入口，原测试名称与断言一直保留。下一项 ENG-05 接入浏览器自动化，再推进 chapter 特有测试与源码迁移。
