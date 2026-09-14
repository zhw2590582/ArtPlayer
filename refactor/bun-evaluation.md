# Bun 隔离安装评估

MOD-01 的结论是继续使用 Yarn Classic 1.22.22。Bun 1.4.2 的普通迁移可以安装、
执行现有 Node 单元测试和完整构建，但首次冻结迁移失败，传递依赖及部分资源与
Yarn 冻结基线不同。本评估不采用 Bun，不新增受维护的 bun.lock，也不替换运行时
或 bundler。未来重测版本时重新建立证据，不把这次结论外推到其他 Bun 版本。

## 环境与来源

- Windows x64，Node 24.21.0，Yarn 1.22.22，Bun 1.4.2+744846f84。
- 三份独立、仓库外的 Git detached checkout，同一提交
  `ddf3d6ccbc2fa7a3fa1a25c2b935b9d7045cee5c`，各有自己的 node_modules。
- Bun 官方 [1.4.2 发布归档](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.2)
  `bun-windows-x64.zip`：39,807,510 字节，SHA-256
  `ce4c17497b2f29712a99d3d53f028de28cd42e3bacb8589599e7f000e49b6405`。
  下载前记录 GitHub release asset digest，下载后比对，再解压到忽略的工具缓存。
  没有升级全局 Bun 1.3.14，也没有把二进制加入生产依赖。
- 安装钩子正常启用；只排除 Playwright 浏览器下载，并清空 NODE_PATH。
  历史契约测试使用复制的冻结 releases 夹具，不复制已有 node_modules。
- 初步在仓库内建的 checkout 可能借用祖先依赖，发现后保留日志，改用仓库外目录。
  正式 Yarn 安装复用初步运行的下载缓存；Bun 首次安装是冷缓存。因此耗时仅作
  执行记录，不能据此宣传安装速度差异。

## 结果

| 检查 | Yarn | Bun |
| --- | --- | --- |
| 从 yarn.lock 初次冻结安装 | 通过 | 失败：lockfile had changes, but lockfile is frozen |
| 另一干净目录普通迁移 | 不适用 | 通过，生成仅存于评估目录的 bun.lock |
| 生成 bun.lock 后冻结复装 | 不适用 | 通过，锁文件与完整审计依赖图未变 |
| Node 单元测试 | 2,906 通过，0 跳过 | 2,906 通过，0 跳过 |
| `yarn ci:build` | 通过 | 在 Bun 安装的依赖上通过，仍由 Yarn/Node 执行 |
| `yarn typecheck` | 415 个 TS 生产文件及类型消费者通过 | 同样通过，含 TS 5.9.3 / 4.3.5 / 5.1.6 矩阵 |
| 根工具依赖版本 | 与 manifest 固定版本一致 | 与 Yarn 一致 |
| 依赖实例 / 唯一 name@version | 1,229 / 1,125 | 1,439 / 1,135 |
| 审计的唯一原生/worker/WASM 资源 | 92 | 90 |
| 未解析必需的非 peer 依赖 | 0 | 0 |

物理提升方式不同不直接判为不兼容。比较脚本另外按父包版本、依赖字段、请求范围
和实际解析版本去重比较，保留未满足 peer/平台可选依赖。Bun 为旧搜索插件安装了
flexsearch 0.7.43 peer；Yarn 对应位置解析到 0.8.158。Algolia 从 5.48.0 变为
5.59.0；Vite 5.4.21 的 Rollup 从 4.57.1 变为 4.63.3。这些是实测解析差异，
不表示所有依赖升级都是缺陷，也不能以单元测试通过替代依赖等价。

`bun pm untrusted` 明确列出 less 4.5.1 与 nx 20.8.4 的 postinstall 未运行。
没有使用全量 trust 绕过差异。根 postinstall 中的 npx 被 Bun 执行为 bun x，
Lerna 8.2.4 报告无 workspace prepare 脚本。两者的默认脚本策略不相同，参见
[Bun lifecycle 文档](https://bun.com/docs/pm/lifecycle)。

完整构建包含 21 个库、核心声明/i18n、编辑器声明、站点资源、文档站及五项导入
测试。对各包 dist/types 与 docs 的 compiled/document/assets-ts/assets-js
核对精确字节：两边各 534 文件，448 文件相同；29 个同路径文件改变，另有两边
各 57 个独有文件名，全部在 docs/document。库、声明与其余被检查输出相同。
不做文本归一化，不把带不同哈希的站点文件名当作丢失；此对照也未单独排除所有
文档构建非确定性因素，因此不把每个差异都归因于某个具体依赖。

安装资源审计覆盖依赖目录内的 .node/.exe/.wasm 与 worker/worklet JS 文件，
不等于所有平台二进制或所有包资源。此任务没有进行 Bun 产物的浏览器、物理设备
或 npm 发布验收；既已决定不采用，不建立它作为第二套受支持 CI 环境。

## 复跑与维护

先使用 `.node-version` 的 Node 与固定 Yarn。准备阶段读取 HEAD，不包含未提交
代码；因此比较生产内容前应先提交对应任务。命令级固定 Git 换行设置，不改本机
或仓库 Git 配置。准备命令会输出评估目录，并写入 `.cache/bun-evaluation/latest.json`。

```text
yarn test:bun-install prepare
yarn test:bun-install yarn <run-directory>
yarn test:bun-install bun-frozen <run-directory> <bun-executable>
yarn test:bun-install bun-migrate <run-directory> <bun-executable>
node refactor/scripts/install-graph.mjs <yarn-checkout> <run-directory>/yarn-graph.json
node refactor/scripts/install-graph.mjs <bun-migrate-checkout> <run-directory>/bun-graph.json
node refactor/scripts/install-compare.mjs <run-directory>
```

每阶段日志使用独占创建，不能覆盖后重试。初次安装要求无 node_modules；失败的
冻结迁移和普通迁移使用不同 checkout。可通过 ARTPLAYER_EVAL_CACHE 显式复用
评估目录下的缓存，脚本记录实际冷/热状态。各 checkout 内依次运行同一组
`yarn test:unit`、`yarn ci:build`、`yarn typecheck`；需要历史归档时只复制
`refactor/.cache/releases`，不要复制 node_modules。类型检查要在构建完成后运行。

```text
node refactor/scripts/install-build-compare.mjs <run-directory>
yarn test:bun-install bun-repeat <run-directory> <bun-executable>
node refactor/scripts/install-graph.mjs <bun-migrate-checkout> <run-directory>/bun-repeat-graph.json
node --test refactor/scripts/install-graph.test.mjs
```

- bun-evaluation.mjs：固定版本、checkout/缓存边界、安装进程、锁文件保护与日志。
- install-graph.mjs：真实依赖解析、资源指纹；拒绝逃出 checkout 的依赖链接。
  包名为 buffer/punycode 等 Node 内置同名 npm 包也纳入审计。
- install-compare.mjs：语义依赖/peer/资源差异；不将提升路径不同当成版本变化。
- install-build-compare.mjs：相同命令构建后的产物清单与逐字节差异。
- install-graph.test.mjs：防止从父目录借依赖、同名内置模块漏报、嵌套解析与资源审计。

评估 checkout、缓存及原始失败报告保留在本机忽略目录，可能需要数 GB 空间。
清理时先核对 snapshot.json 的 checkoutRoot、Git worktree 列表和实际绝对路径，
使用 Git worktree 管理及原生文件操作；不能删除本仓库或其他任务的目录。
正式证据索引见 [机器记录](baselines/bun-install-validation.json)。
