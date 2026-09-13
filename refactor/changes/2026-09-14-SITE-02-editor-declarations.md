# SITE-02 编辑器声明生成链

起点 `1a5440a67f50c8c1c5c695099bea5ee5d4b0cc77`。SITE-SMOKE-01 已完成示例
生成半项，本次完成声明生成半项，保留全部父任务范围。原 build:ts 命令、按包
参数、声明 URL、i18n 入口和工具 MJS 导入路径继续可用。生产包源码、公开声明、
运行时事件/DOM、分发入口与 yarn.lock 未修改。

## 结构与修复

- `scripts/editor-declarations/` 包含 TS 的 core/plugin AST 转换、语法检查、
  VAST SDK 类型闭包、虚拟编译器 host 和生成编排。旧 JS/MJS 文件仅转发，同属
 严格 checkJs 范围。新模块维护地图、依赖方向和修改命令见该目录 README。
- 原 Chapter 文本回退产生 TS2309（default 与 export assignment 混用）；
  VAST 同时产生 TS2304/2552（删除 import 后丢失 Player/PlayerOptions）。
  测试固定原转换表达式复现，不靠跳过声明检查或 any 替换解决。
- 所有 20 个生态库现在统一走语义转换；加 core/i18n 共 22 个加载声明。格式化
  后以主 TS 5.9.3、旧 TS 4.3.5 整组检查，同时验证命名空间冲突和未解析依赖。
  生成期间仅作 layout 格式修复；SDK 原方法与 type alias 形状保留，相关 lint
  豁免限定在自动生成的 SDK 命名空间块。其余 20 份声明内容与起点一致。
- VAST 通过单独 type-only 入口收集 @glomex/vast-ima-player 1.21.2 和
  @alugha/ima 2.1.0。直接 bundle VAST 根声明会因 workspace 链接一并内联核心，
  因此只 bundle SDK 闭包，再用 AST 放入模块内部 namespace，避免重复核心。
  原 Window 可选属性、必需回调、SDK 方法/私有成员约束保留；不新增 SDK 全局
  值或运行时加载。自动生成邻接 LICENSE.txt 保存上游 notices。
- 新增 `check:editor-types` 并加入 ci:check；所有选择、声明检查、格式化、
  notices 和 libUris 生成成功后才写结果。只读检查拒绝缺失/漂移，不写文件。
  libUris 用 AST 定位唯一数组声明，避免找不到旧正则时静默漏更新；按包构建
  保持不更新总列表的旧行为。多文件最终写盘本身不承诺事务性。
- 无新增依赖或锁变更；复用已固定 dts-bundle-generator 9.5.1、TS、ESLint、glob。
  两个真实编译器模块的名义类型不同，仅在工具边界适配，测试实际执行旧编译器。

## 验证与修正过程

- 4 项编辑器 Node 测试通过：core/ASR 原消费者；Chapter/VAST 旧红新绿、模块
  导入与全局消费；6 个类型误用分别被拒绝；全部 24 个输出与重生成一致；
  未知/重复选包及缺失/重复/非数组 libUris 拒绝。
- 完整 baseline 522 通过，0 失败/跳过，覆盖旧 MJS 路径上的包类型回归。
  CI 50 项回归通过；严格 docs-tools 检查、全仓 lint（0 error/1 既有生成
  声明 warning）、目标 lint 与严格工具链通过。
- 三浏览器实际 Monaco 各 1 项，共 3 通过，0 跳过/flaky：实际 common.js 中
  22 份加载声明一起检查，正例无诊断、三个坏参数各报 TS2322，并运行实际
  emit 的 Chapter 代码，真实受控媒体 ready 后销毁、实例归零。没有执行 VAST
  广告 SDK。完整 browser report 和版本/结果摘要见验证 JSON。
- 首次浏览器检查失败在 23 vs 22 文件数：目录遗留 artplayer-plugin-websr.d.ts
  未列入实际 libUris。测试改为按实际加载列表取文件，原资产保留，未通过删除
  声明消除失败。失败报告已归档。旧资产的整体处置仍属 SITE-07。
- 新虚拟 host 的模块正例最初失败，原因是 Windows 根路径尾部分隔符使目录
  比较不匹配；用 path.resolve 统一后相对导入和全部负例通过。SDK 声明初次
  layout lint 指出上游签名风格，采用限定范围保留原类型形状，未作语义格式替换。
- 一次直接 node 调严格工具链检查被 Yarn 身份检查拒绝；按规定使用 pinned
  Yarn 重新执行成功，未绕过该门槛。原失败日志保留。

## 兼容与后续

本次兼容修正针对编辑器生成声明，生产根类型和 /runtime 类型均保持原内容。
Chapter/VAST 编辑器从无效声明变成可严格消费声明，原合法回调和配置不需改写。
VAST 初始化默认行为、Auto Thumbnail 首帧、真实设备/SDK、完整文档交互与三轮
发布复盘仍开放。SITE-03/04/05 与 EX-03 接续文档产品流程和完整验收。

未重新执行全仓生产运行时套件或全局发布矩阵；本次变化没有生产源码/锁变更。
没有手动 Chrome/iab 会话、远端 CI、推送或发布。构建/验证只证明上述工具与
消费者范围。任务单独提交后审计；回退该提交会恢复旧生成链及 Chapter/VAST
声明错误，需重新 build:ts，优先对具体回归单独修复。
