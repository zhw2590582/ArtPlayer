# 可重跑的开发环境

用户指定 packageManager 使用 Yarn。标准组合为 Node 24.21.0（根 .node-version）和 Yarn Classic 1.22.22（根 package.json），唯一维护的安装锁文件为 yarn.lock。Yarn 版本沿用仓库原有 v1 锁格式；播放器消费者 API、包版本和浏览器构建目标不受该选择影响。

## 使用

1. 切换到 .node-version 指定的 Node，安装 Yarn 1.22.22；例如 `npm install --global yarn@1.22.22`，然后确认 `node --version` 和 `yarn --version`。npm 仅可用于安装 Yarn 工具及消费者兼容检查，不用于维护本仓库依赖锁。
2. 干净 checkout 执行 `yarn install --frozen-lockfile --non-interactive`，禁止 CI 自动更新锁或忽略安装脚本/engines。参见 [Yarn Classic install](https://classic.yarnpkg.com/en/docs/cli/install/)。
3. 执行 `yarn check:toolchain --strict`，核对实际 Node/Yarn、20 个固定开发工具和 22 个 workspace 的声明及传递依赖锁条目。普通检查允许满足最低工具要求的 Node，同时打印标准版本。
4. 执行 `yarn test:playback`、`yarn test:dash-control`、`yarn build all` 和 `yarn workspace artplayer-vitepress build`。ENG-02 已拆分只读 lint 与 lint:fix；PR/主线入口和独立 Pages 流程见 ci-setup.md。

私有根包最低 Node 为 ^20.19.0 || >=22.12.0，与原本使用的 Vite 7 一致。本轮验证 Node 24.21.0，其他版本矩阵由 CI-01 接续，不能宣称所有最低环境已经通过。

## 锁文件和依赖维护

- 根构建工具固定精确版本并放在 devDependencies；发布包的 dependencies/peer 范围保持原样。
- ENG-04 新增 typescript-compat（npm:typescript@4.3.5）作为旧编译器消费探针；源码继续使用 typescript 5.9.3。精确 npm alias 也由锁检查保护；实际覆盖与命令见 [类型检查说明](typechecking.md)。
- 添加根开发依赖使用 `yarn add --dev --exact --ignore-workspace-root-check <name>@<version>`，包级依赖使用 `yarn workspace <name> add ...`；运行依赖升级需要独立兼容证据。
- manifest 和 yarn.lock 同次提交；不提交 package-lock.json、bun.lock 或第二份安装锁。旧 npm 锁及验证报告保留于 ENG-01 Git 历史，原本地 Yarn 锁也已在忽略缓存中备份。
- 新增 @yarnpkg/lockfile 1.1.0 为显式开发依赖，供检查器使用 Yarn 官方锁解析器；不依赖 Lerna 偶然安装的传递依赖。只验证 registry 依赖图及完整性字段，实际下载完整性由 Yarn 安装验证；peer 兼容仍由消费者测试和安装报告验证。
- 另将原已解析的 TypeScript 5.9.3 和 @vue/compiler-sfc 3.5.28 显式声明为根开发依赖，满足 ESLint 工具链 peer 要求，防止依赖偶然提升到根目录；不在本任务迁移生产 TS 或更新公开声明。
- packageManager 字段只是声明，严格检查核对实际执行工具。Yarn 不像 npm lock 一样存储 workspace manifest 副本，workspace 名称/版本的发布基线仍由 refactor 清单和版本任务维护。
- 用户已选 Yarn；MOD-01 可在独立目录评估 Bun，但不能凭试点结果自行替换默认包管理器。
- 现有 npx/npm 脚本入口仍可用，脚本整理由 MOD-02 接续；新增脚本采用本地依赖。当前 postinstall 的 Lerna prepare 在 22 包均无 prepare 时为空操作。

## 验证记录

ENG-01 的 [npm 验证报告](baselines/toolchain-validation.json) 是切换前历史证据，不代表 Yarn 已验证。[Yarn 验证报告](baselines/yarn-validation.json) 记录最终干净冻结安装、20 项 Node 测试、21 库包 63 产物及文档站构建全部通过；63 产物 SHA-256 与 ENG-01 完全相同。保留的旧锁条目版本变化为零，9 个 workspace runtime 依赖解析与 npm 基线一致。搜索 peer 警告由 SITE-05 接续验证。

构建通过不代表运行时、类型、真实浏览器或 npm 发布验收已完成。Chrome 不可用时按 release-reviews.md 使用内置浏览器并注明实际环境。
