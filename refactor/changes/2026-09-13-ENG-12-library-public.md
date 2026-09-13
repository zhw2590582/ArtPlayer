# ENG-12 隔离库构建的 public 声明源码

CORE-25 生成产物时 Vite 复制 public/artplayer.cts 到 dist 触发 Windows copyfile UNKNOWN。
进一步检查实际 tarball，确认声明源码目录此前被默认 publicDir 当静态资源复制。
这是重构新增声明源码目录后的分发污染；真实 npm 基线不包含这些错误复制路径。
不能只重试 Windows 错误而保留复制行为，也不能把偶发 copyfile 错误断言为确定的锁原因。

scripts/utils.js 的库配置显式设置 publicDir:false。它用于库 build/dev/i18n；文档站
使用独立 VitePress 构建。根下实际只有 core 的 public 目录，其他库没有依赖该目录
复制的资源。此选项行为见 [Vite 文档](https://vite.dev/config/shared-options#publicdir)。
scripts/package-check.mjs 同时拒绝任意路径中非 .d.ts/.d.cts/.d.mts 的 TS 文件，
防止将来换个目录仍泄漏声明源码；原路径、历史文件和声明存在性检查继续保留。

新增 test/library-build.test.js 实际执行三个格式构建，用 public 内的私有 TS 和无关
文本作反例。修复前稳定失败，修复后 dist 只包含三个 JS 文件，已接入 test:node。
test/package-check.test.js 覆盖 .ts/.cts/.mts 拒绝与三种声明后缀允许；真实旧候选
tarball 同样被拒绝。新 tarball 只移除误复制的文件，其他所有成员字节完全一致。

完整 yarn ci:build（21 库、i18n、编辑器、文档站、3 项导入）通过；声明生成零变化，
定向三项测试和只读 lint 通过。此时工作区还有 CORE-25 修复和测试，其运行时与浏览器
验收属于独立 CORE-25；本任务不宣称它已经完成。真实 package:release 也通过，但
该结果包含 CORE-25 工作区补丁，不代表仅检出 ENG-12 提交就消除了默认选项缺陷。
计数、成员与日志摘要见 [证据](../baselines/library-public-validation.json)。

完整构建生成的其他包/站点漂移已恢复，新增站点 hash 资源移至忽略缓存留存。
本提交只包含构建策略、包成员检查、测试/文档以及构建删除的 core 错误复制源码；
CORE-25 的三个 JS 产物与源码保留到其自己的提交。没有手改生成代码，也没有新依赖。

后续 AI 添加库静态资源时应显式设计资源入口和包成员检查，不重开隐式 public 复制。
回退需同时恢复配置和检查，但会重新引入已证明的分发污染，不能直接拿来发布。
独立提交主题：fix(build): [ENG-12] exclude declaration sources from library artifacts。
