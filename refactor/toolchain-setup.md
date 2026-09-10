# 可重跑的开发环境

ENG-01 固定开发工具，消费者 API 和各包版本尚未修改。规范运行时是根 .node-version 的 Node 24.21.0，配套 npm 11.19.0；官方二进制已核对 SHA-256。开发依赖版本固定为本机改造前已经解析的版本，package-lock.json 是唯一提交和维护的依赖锁文件。

## 使用

1. 安装/切换到 .node-version 指定版本，确认 `node --version` 和 `npm --version`。实施时采用的 [Node 官方发行索引](https://nodejs.org/dist/index.json) 给出 24.21.0 LTS 与 npm 11.19.0；固定后不能每次 CI 自动取 latest。
2. 从干净 checkout 运行 `npm ci`。它会删除当前 node_modules 并按锁文件安装，不更新锁；在本轮验证中使用独立目录，未删除用户原有依赖。规则参见 [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/)。
3. 执行 `npm run check:toolchain -- --strict`，核对实际 Node/npm、16 个根开发工具及 22 workspace 的锁定声明。无 --strict 时允许满足工具最低要求的 Node，并打印与标准版本的差异。
4. 现有 `npm run test:playback`、`npm run test:dash-control`、`npm run build -- all`、`npm --workspace artplayer-vitepress run build` 继续可用。CI 和只读 lint 的拆分由 ENG-02 接续；当前 lint 仍有 --fix，不当作只读验证。

私有根包的最低工具 Node 改为 ^20.19.0 || >=22.12.0，与已使用 Vite 7 的 engines 一致；这不是改变已发布播放器的 Node/browser 支持声明。本轮实际验证 Node 24.21.0，其他版本矩阵由 CI-01 执行，不能声称已经跑过全部最低环境。

## 安装与锁文件维护

- 原根 dependencies 全部是开发/构建工具，已移入 devDependencies 并固定精确版本；各发布包的 runtime dependencies/peer 范围保持原样。
- 初始锁从现有安装及锁信息生成，确认已有解析路径、直接工具和 workspace runtime 版本没有升级；补齐跨平台可选包供后续 CI 使用。
- 旧本地 yarn.lock 被忽略，留存以免删除用户文件；不作为维护锁或 CI 来源。不要混用 Yarn/Bun 改写依赖。MOD-01 另做 Bun 固定安装对比，结果通过再变更标准工具。
- 新依赖仍按任务需要自主添加，并固定开发依赖版本；将 manifest 和 package-lock.json 同次提交。更新 runtime 范围需独立兼容证据。
- 当前根 postinstall 执行已安装的 Lerna 8.2.4 run prepare；本轮 22 包无 prepare 脚本，输出 No packages found。是否删除空 hook 在 MOD-02 清理，不在初次固定锁时重写所有旧命令。
- npm 11.19.0 本轮报告 esbuild（两个版本）、less、nx 安装脚本尚未列入 allowScripts 策略；未用 ignore-scripts 绕过干净安装。实际安装、构建和 Node 测试成功；后续 CI/Bun 脚本策略需按真实包版本审查，不把警告写成运行失败或自动批准任意脚本。

## 已完成证据

[toolchain-validation.json](baselines/toolchain-validation.json) 保存官方运行时归档 SHA、依赖锁及输入标识、安装计数、测试与构建文件摘要。

- Windows 独立空依赖目录：npm ci 安装 1141 个包，锁文件字节不变；无已有解析版本升级。
- 独立 Node 24.21.0/npm 11.19.0 严格工具检查通过；原 19 项 Node 测试通过。
- 21 个库包的正常构建全部通过（63 个 UMD/legacy/ESM 输出），VitePress 文档站构建通过；输出均在忽略的隔离目录。
- 工具检查器能拒绝 manifest/lock 不一致。已有完整性/HTTP 服务测试加原测试共 21 项通过。
- 计划校验器跳过 .cache/node_modules/.git，不再误扫工具下载和干净安装副本里的第三方文档。

这些结果说明固定工具链能安装并构建原项目，不代表运行时、类型、真实浏览器或 npm 发布验收已完成。Chrome 连接阻塞继续由 BASE-02 登记。
