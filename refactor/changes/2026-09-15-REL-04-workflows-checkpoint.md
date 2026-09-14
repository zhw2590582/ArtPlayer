# REL-04 更名回退、全包清单和主线同步检查点

本次不修改生产运行时代码。新增三个有明确边界的工程入口，无新依赖：

- `test:rollback:iframe`：正常隔离构建 tool 包，旧 plugin→新 tool→恢复旧 plugin 的实际冻结安装、成员检查、应用导入恢复、旧包清理、strict TS 消费者及本地依赖键映射负例。
- `test:rollback:mainline`：独立临时 Git 仓库内实际执行 JS→TS modify/delete 冲突、abort 恢复、手动转移修复和带来源的 continue；保留命令输出、patch 与 bundle。
- `check:rollback-inventory`：验证 22 包生成清单，20 份完整历史 tarball 的 SHA-512/SHA-256、旧/新 manifest 依赖与目标版本。加入 `ci:check` 防止清单漂移。

实际命令均通过，具体记录/哈希见
[机器证据](../baselines/rollback-workflows-validation.json)。scoped lint、生成清单
检查、严格工具链和相关 Node 工程回归通过；没有将本地 CI 配置描述成远端运行通过。

## 兼容边界

旧 iframe 的 require 返回对象、新版返回构造函数；旧 helper 独立。负例确认只把
旧 tarball 映射到新依赖键不能透明回退。已测试方案同时恢复旧应用导入、manifest
和 lock；没有改生产 API，也没有引入未经授权的新包名兼容策略。

主线负数修复是合成 fixture，不是 ArtPlayer 生产缺陷。先验证旧/迁移实现的准确
断言失败，再验证主线和迁移后修复通过；不能用任意 Node 报错代替缺陷复现。
真实仓库 fetch 后无新增 master 修复，未修改其历史/分支/远端。

## 交接

维护职责和完整执行步骤在[回退维护](../rollback-rehearsal.md)；包内架构说明已
补更名导出差异和演练入口。恢复表从发布台账生成，不额外维护第二份版本来源。

REL-04 继续 doing：Thumbnail 原完整包缺失，完整替代回退产物和站点恢复证据仍
需处理。全部正式批次需重新绑定最终候选，不把早期核心/Chapter/iframe 演练推广
为其他包或物理设备的完成证据。撤销本工程检查点不会改变生产行为或远端设置。
