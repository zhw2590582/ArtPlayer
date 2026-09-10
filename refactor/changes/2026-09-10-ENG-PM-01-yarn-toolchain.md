# ENG-PM-01：按用户选择维护 Yarn

日期：2026-09-10；分支：codex/compatible-modernization；起点：9d1d5fda。

## 改动与兼容

用户明确要求 packageManager 使用 Yarn。根 manifest 改为 yarn@1.22.22，沿用 Yarn Classic v1 锁格式；提交唯一 yarn.lock，停止维护 package-lock.json。Node 24.21.0、原 16 个构建工具和各发布包的版本/依赖范围均保持。Lerna 原有 npmClient 已是 yarn，无需变更。

新增三个显式开发依赖：@yarnpkg/lockfile 1.1.0 用于官方锁解析；typescript 5.9.3 与 @vue/compiler-sfc 3.5.28 满足 ESLint 工具 peer 要求。三者均为先前已安装的版本，后两者不再依赖其他包偶然提升到根目录。没有迁移生产 TypeScript 或改变浏览器运行依赖。

旧本地锁的 p-map/esbuild 两个条目缺少完整下载信息，首次 Yarn 解析曾选取新版本。最终通过官方锁解析/序列化器保留原版本并补齐 registry tarball/integrity，然后重新从空 node_modules 冻结安装；未将试验升级带入交付。Yarn 自动清除旧锁里的机器绝对路径和非安装 peer 条目，补齐跨平台 optional 包。

check:toolchain 改为核对 Yarn 声明、根精确工具版本、全部 workspace 依赖及传递锁图、下载完整性字段和实际 Node/Yarn。新增集成测试验证遗漏根工具、workspace 依赖未锁、竞争 npm 锁、错误包管理器均被拒绝，恢复合法输入后通过。Yarn 的 peer 安装语义不等同 npm，锁检查不代替消费者测试。

## 验证

使用校验过的 Yarn 1.22.22 归档与 Node 24.21.0，在独立空依赖目录执行最终冻结安装，安装脚本正常运行，26.80 秒完成，锁文件字节不变。

- 严格工具检查：22 workspace、19 个直接工具、1335 个依赖选择器。
- 保留下来的旧锁选择器版本变化为零；9 个 workspace runtime 依赖解析版本与 ENG-01 一致。
- 独立环境原 19 项 Node 测试与新增工具检查集成测试共 20 项通过；工作区加发布归档与 HTTP 基线共 22 项通过。改动脚本/测试只读 lint 通过。
- 21 个库包构建通过，63 个输出与 ENG-01 npm 构建的 SHA-256 全部相同。
- VitePress 文档站构建通过；全部生成文件保留于忽略的隔离目录。
- 报告：[yarn-validation.json](../baselines/yarn-validation.json)。Windows 本地结果不代表其他系统、远端 CI 或发布已通过。

文档搜索仍有原 flexsearch peer 范围冲突及 Algolia/search-insights peer 警告，交由 SITE-05 核对实际搜索行为；本轮没有以降低/升级搜索依赖来隐藏问题。旧 npx/Lerna hook 的 npm 环境警告与 Yarn Classic url.parse 弃用提示交 MOD-02 评估，安装/构建退出成功。

## 文档与后续

AGENTS、toolchain-setup、工具链规范、路线、决策及任务依赖同步维护；Bun 仅作隔离比较，未经用户后续新决定不得替换 Yarn。ENG-01 npm 报告保留为历史事实。

本地独立提交主题包含 ENG-PM-01。原 Yarn 和 npm 锁都已备份于忽略缓存，历史 Git 提交亦保留 npm 锁；回退本提交可恢复 ENG-01 工具配置。未推送、未发布。下一步 ENG-02 将冻结 Yarn 安装和只读检查接入 PR/主线 CI；BASE-02 可使用已验证可连接的内置浏览器继续。
