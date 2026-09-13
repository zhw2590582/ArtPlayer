# EX-01 React 消费者、异常清理与实际打包验收

起点 `3e39fc745f4dc98eba678ca081e86c1d3cc965cd`。本任务对应 React 示例，
不将其他插件的组合、设备和分发任务一并标为完成。

## 已复现问题和实现

1. `index.html` 仍引用不存在的 `/src/main.jsx`，实际入口为 `main.tsx`。
   改为实际入口，原 App 经 Vite 构建和三引擎实际加载媒体通过。
2. 原 Player effect 在调用 `getInstance` 后才返回清理函数。消费者回调抛错时，
   React 无法取得该清理函数，已创建实例残留。最终 `--before` 控制使用原始
   Player 源码及相同候选 tarball，在 Chromium 开发模式复现：错误边界已经
   显示，注册表仍有 1 个播放器。修复在重新抛出原错误前调用 `destroy(false)`；
   即使清理也抛错，保留最初的消费者异常。六组最终回归均无实例/DOM 残留。
3. 原 TSX 示例没有 tsconfig，局部 ESLint 配置仅覆盖 JS/JSX。补充严格 TSX
   配置，复用仓库的 TS lint 配置，修复实际源码中的类型导入和配置格式。

文件职责：`Player.tsx` 负责 React effect、引用交付和资源归属；
`player-options.ts` 隔离示例特定配置和插件工厂；`App.tsx` 保持调用样例；
`main.tsx` 保持 StrictMode；README 说明真实维护入口、行为和验证边界。
没有为简单包装增加通用生命周期框架。

## 兼容性

- 保留 `option: Partial<Option>`、可选 `getInstance(art)` 和 div 属性。
- 保留 `[option, getInstance]` 依赖：同一引用不重建，任一引用改变则先清理后重建。
- 保留 callback 在构造之后同步交付实例，不改为等待 ready，不新增 null 回调。
- 保留 `destroy(false)`、React 外层容器归属及现有法语/词典/两个插件覆盖规则。
  这些是示例原有行为；没有借通用化而静默改变用户传入 plugins/lang 的优先级。
- `url as string` 仅适配历史 Partial 输入，继续由核心验证无效/缺失 URL；
  不把可编译的 `option={{}}` 宣称为可成功运行。
- 新导出的 PlayerProps 是补充类型入口；核心/插件公开声明和运行产物未修改。

React 的 [effect 文档](https://react.dev/reference/react/useEffect) 说明开发
StrictMode 的额外 setup/cleanup。真实受测 React 19.1.1 的开发模式抛错路径
交付两个相同原始错误，生产模式一个，逐模式精确断言；每个创建实例只销毁一次。
初版测试错误地统一要求一个异常，已纠正且保留失败报告，未放松清理断言。

## 工具、测试与 CI

根 devDependencies 新增固定 React/React DOM 19.1.1、@types/react 19.1.10、
@types/react-dom 19.1.7、@vitejs/plugin-react 5.0.0；复用 Vite 7.3.6、TS 5.9.3。
用于 TSX 示例、React 模式行为和 Vite 构建，不增加 Artplayer 生产依赖。
只更新根 yarn.lock；示例 manifest 同步已验证版本和实际使用的开发工具。

新增根命令 `dev:react`、`typecheck:react`、`lint:react`、`build:react`、
`test:react-consumer`。后者由 `refactor/scripts/react-consumer.mjs` 编排：

1. Yarn pack 核心/Danmuku/Document PiP，记录 SHA256；仓库外安装，再 frozen、
   offline、force 安装并逐文件对照 tarball；缓存中的消费者锁是测试证据。
2. 复制真实示例及 `test/react/` 夹具，严格编译全部示例、真实浏览器 TSX 夹具和三个 @ts-expect-error
   反例。检查所有声明只来自隔离消费者和 TS 标准库，禁止工作区类型逃逸。
   初版 compiler host 使用仓库 cwd 导致 @types/react 逃逸，被验证器正确拒绝；
   已将 host 的 currentDirectory 设为隔离消费者，保留此隔离检查。
3. Vite 构建 development/production，实际使用安装后的包，不 alias 生产源码。
4. 三引擎串行执行，每组 12 类检查：StrictMode/插件注册、稳定引用、回调变化、
   option 变化、真实 play/pause/seek/非黑像素、兄弟实例身份保持、可选回调、
   卸载清理、重挂载、回调异常、清理次生异常、原 App 媒体加载。
5. `--before` 使用固定 Git 版本中的原 Player，预期在回调异常清理处失败。

在现有 GitHub 三操作系统 browser-smoke 中加入此命令和 always 上传的证据目录；
ci:check 加入 React 类型/lint。这里已验证本地配置和 47 项 CI 回归，未执行远端
GitHub jobs，不能称远端三操作系统已通过。

## 验证结果和限制

最终证据见 [react-consumer-validation.json](../baselines/react-consumer-validation.json)。
Windows、Node 24.21.0、Yarn 1.22.22；Chromium 153.0.8010.12、Firefox 155.0、
WebKit 26.6：六组全部通过，无 retry/skip。旧包装精确复现 1 个残留实例。
严格隔离 TS 5.9.3 无诊断，三个无效输入被拒绝；全仓 typecheck 的 406 个生产
TS 文件和历史/准确类型矩阵通过。示例构建、lint、frozen 安装、严格工具链通过。
开发 React bundle 的 >500kB Vite 提示保留，没有提高阈值；生产共享 chunk
约 477.53kB，整体包体复盘仍属 MOD-03/REVIEW-01。

前期失败报告保留：`react-consumer-2B2QCR` 是类型逃逸，`dmu7pS` 是开发异常
计数断言错误；最终候选 `x9KPB2`，最终旧源码对照 `cgxKhm`。

这是原包装 API 在实际候选包中的消费验收，不是所有旧核心/旧插件组合验收。
受控 MP4/XML 不证明公网 CDN；插件注册不证明 PiP 真窗口或完整弹幕调度。
Playwright Windows WebKit 不等于 macOS/iOS Safari，未声称连接 Chrome 或真机。
这些包专项和发布复盘门槛继续保留。

## 回退

回退 EX-01 提交可恢复包装/HTML/工具配置及根锁；也会恢复已复现的回调泄漏和
入口错误。无生产包版本/产物变更，无推送、发布。候选生产内容改变后重跑此消费
脚本；不要将本次 tarball 哈希当成未来 npm 候选的免检依据。

## 扩大检查发现的独立 lint 问题

本任务受影响的 TSX/脚本 lint 通过，但最后全仓 yarn lint 被未改动的
packages/artplayer-plugin-danmuku-mask/package.json 字段排序阻断；已逐字对照
HEAD 确认该 manifest 不属于本任务改动。另有旧编辑器声明的 unused-disable
警告。全仓 lint 未计为通过；新增 ENG-LINT-01 独立修复，仍接入最终完成门槛。
日志 refactor/.cache/react-root-lint.log。
