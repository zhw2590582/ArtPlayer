# CI-NPM-03：只读 registry 检查与部分发布恢复判断

## 目的与边界

从 CI-03 拆出独立可实施的 registry 预检，保留 CI-03 原有依赖和发布流程验收。
没有进入 REVIEW-01/02/03，没有推送、发布、撤销版本或调整 tag。

新增 `yarn release:registry`，五个必填参数与 `release:verify-bundle` 相同：
`--directory`、`--packages`、`--tag`、`--source-commit`、`--manifest-sha256`。
命令先验证干净源码、独立摘要、下载包与登记候选及实时发布台账，再读公共 registry，
最后复核本地内容和门槛。当前真实候选仍有开放门槛，不能借此命令绕过。

## 实现与维护

- `scripts/release/registry.ts`：固定官方 origin 的无认证 GET、15 秒请求/响应期限、
  10 MiB 上限、禁重定向，以及只认自身字段的元数据解析与逐包判断。
- `scripts/release/registry-check.ts`：查询前后调用现有候选验证器；部分成功的包分别保留
  `not-observed`、`already-present`、`tag-change-required`、`conflict` 结果。
- `scripts/check-release-registry.mjs`：固定 Node/Yarn、独立输入和退出状态；冲突输出报告后
  exit 1，网络/格式/本地证据失败 exit 1，不生成成功报告。
- 没有新增依赖或更改锁文件。TS 配置和既有 CI 类型入口自动覆盖新模块；新增测试加入
  `test:release-bundle`，也由 `test:baseline` 自动发现。维护说明位于
  [scripts/release/README.md](../../scripts/release/README.md)。

查不到版本不证明可以使用该版本。可见的撤销历史直接阻断；没有历史也保留未知。
已有相同 SHA-512 时禁止重复发布；tag 不同只报告待调整，包括可能倒退到旧版本的情况，
不会自动更改。摘要匹配是元数据匹配，不是远端 tarball 下载或工作流来源验证。
未来 CI-03 必须在授权使用时重新检查状态，并负责远端信任、权限、精确文件发布及读回。

## 验证

Node 24.21.0 / Yarn 1.22.22，起点 `783d1e3fd49ba56ed0ea38c29d385de1ae1adde0`。

- 发布工具 47/47 测试通过，其中新增 11 个用例组覆盖混合部分发布、tag-only、缺失/冲突
  摘要、撤销历史、格式错误、HTTP/传输/响应体失败、大小限制、查询中本地变化、CLI 拒绝。
  成功路径注入的完整台账是合成测试数据，不代表真实包准入。
- 严格 release 类型检查、全仓只读 lint、测试文件定向 lint、严格工具链检查通过。
- 真实只读 GET 返回 200；冻结 `artplayer@5.4.0` 的 SHA-512 与 registry 相符，latest
  仍为 5.4.0；6.0.0 在本次响应中不存在。只测试底层传输与解析，不冒充通过真实候选
  bundle 端到端发布门槛。时间、响应及日志摘要见[证据](../baselines/npm-registry-validation.json)。
- 初次测试文件格式修正期间产生的多余右括号导致解析失败，修正后重跑 47/47；此前
  quote-props 格式报错也已修复，未删除或跳过失败用例。

共享工程源码和根脚本改变会使此前候选输入指纹失效；21 个库包必须在共享工程稳定后
重新生成候选并绑定证据。运行时与公开声明没有改动，本任务不宣称候选仍可准入。

## 回退与剩余工作

回退本任务提交会移除新命令/模块/测试及文档，现有 bundle 准备和内容验证保留。
CI-03 继续负责实际工作流、可信远端来源、OIDC/权限、授权执行和读回；未启用远端流程。
