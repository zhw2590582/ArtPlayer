# SITE-SMOKE-01 文档示例生成与就绪检查

起点 `d74ecc43ccee99dcd2e3090356a6fb761825e6af`。从 SITE-02 拆出示例生成和运行器，
保留原父任务负责编辑器声明生成。保留 `yarn build:test`、脚本路径、测试页面及
`docs/test/test.js` URL；没有修改生产包 API、公开声明、播放器 DOM、事件或入口。

## 实现与缺陷

- `scripts/docs-smoke/parser.ts` 用现有 MarkdownIt tokens 替换共享正则游标。
  原生成器在异常围栏中反复 continue 且不推进，测试对固定旧提交使用 VM 超时
  复现；新解析有限结束，并在语法检查阶段带文件/行号失败。未闭合、空示例和
  marker 后不是 JavaScript 围栏也明确报错。只支持现有 Run Code 标记约定。
- `generator.ts` 负责确定性枚举、语法编译、页面脚本依赖和 esbuild 打包；生成前
  验证全部输入。保留 11 个中文文件的 233 段旧代码（仅统一 CRLF 为 LF），新增
  examples.json 清单。重复生成一致，无时间戳；`--check` 只读拒绝漂移。
- `runtime.ts` 管理每例独立 iframe、顺序依赖、返回 Promise、当前实例 ready、
  error/unhandledrejection 和清理。移除固定 100ms 无条件成功；4500ms 是失败
  deadline，ready 后仅多一个事件循环任务用于接收未处理拒绝。销毁失败仍移除
  frame、恢复 storage，并将原错误和清理错误一起报告。拒绝并发案例。
- 原 JS CLI 是兼容入口，由严格 checkJs 覆盖；自有实现拆成 TS。维护地图和边界见
  `scripts/docs-smoke/README.md`，文档站、测试与 CI 说明同次更新。

## 工具链与 CI

根开发依赖新增精确 `@types/node` 24.10.0、`@types/markdown-it` 14.1.2，分别为
Node 工具和已有 MarkdownIt 14.1.0 提供严格类型；没有播放器运行依赖变化。只维护
根 yarn.lock，Node 24.21.0 原生类型擦除执行工具，Yarn Classic 1.22.22 frozen
安装成功。新增 typecheck:docs-tools/check:docs-smoke 加入 ci:check，build:test
加入 ci:build；没有把本地配置视为远端 CI 通过。

安装后发现共享 tsc bin 指向 `typescript-runtime-compat` 5.1.6，而主编译器是
5.9.3。旧别名检查 Node 24 类型因 esnext.disposable/Symbol.dispose 等退出 2；
新工具与根 React 检查改用显式 `node node_modules/typescript/bin/tsc`，保留旧
编译器用于历史消费测试。严格检查不使用 skipLibCheck 掩盖错误。工具配置的
ES2021 lib 用于 Node parser 的 replaceAll；浏览器产物 target 仍为 ES2020。

## 验证与限制

- 5 项生成器回归通过：固定旧代码比较、旧卡死复现、围栏反例、确定性与真实
  Mocha 注册、CLI 只读/失败不覆盖既有结果。完整 baseline 522 通过、0 跳过。
- 三浏览器各 11 项，共 33 通过、0 跳过/重试通过：真实核心/受控媒体就绪、
  超过旧 100ms 后仍等待、连续挂载清理、三段未改原示例、并发拒绝、同步/返回/
  未处理/ready 回调/销毁错误、脚本失败、永不 ready、跨案例定时器与全局隔离。
- 初次扩展测试有 31 通过/2 失败，均为 Windows WebKit 报告 640x360 而非媒体
  320x180。原报告保留。按既有 DPIP-MEDIA-01 记录精确两组尺寸，其他浏览器只
  接受 320x180；不扩大超时、不重试取绿，也未关闭原生尺寸问题或真实 Safari 门槛。
- 主编译器的工具/React 检查、CI 50 项测试、根 lint（0 error/1 既有生成声明
  warning）、严格工具链（22 workspace/38 固定工具/1470 依赖选择器）通过。
  完整生产与消费者类型检查结果及输入/输出/日志指纹见验证 JSON。

iframe 是同源归属隔离，不是安全沙箱。需独占测试 origin；storage 恢复会覆盖
其他同源并发写入，不为跨 tab 合并机制。案例交给其它窗口的资源不由本运行器
接管。就绪不等于播放/seek/点击/延迟回调功能验收；完整 233 例、外部 SDK、
所有语言/插件文档与真实设备仍由 EX-03、SITE-04 和包验收覆盖。本次没有手动
连接 Chrome/iab、远端 CI、推送或发布。没有声称全部示例已通过浏览器执行。

## 状态与回退

SITE-SMOKE-01 单独完成提交；SITE-02 的声明生成器尚未完成。生成器生成资产，
不得手改 test.js；解析/语法失败保证写入前退出，磁盘多文件写入不承诺事务性。
回退本任务提交并执行 frozen 安装可恢复旧生成器和依赖；旧无限循环与 100ms
假通过会随之恢复，因此优先修复具体回归。后续改动运行 README 对应命令并
更新当前 site-inventory，历史验证 JSON 保持原证据。
