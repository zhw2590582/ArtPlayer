# 已发布基线

BASE-01 于 2026-09-10 固定核心与 chapter 的 npm 发布内容，数据在 [releases.json](releases.json)。这不是全生态兼容通过报告。

| 包 | 工作区版本 | 已固定发布基线 | 后续目标 |
| --- | --- | --- | --- |
| artplayer | 5.4.1 | 5.4.0 | 6.0.0 |
| artplayer-plugin-chapter | 1.1.0 | 1.1.0 | 2.0.0 |

查询 registry.npmjs.org 时 artplayer/5.4.1 返回 404，latest 为 5.4.0。工作区源码基线仍是 40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f；不能把两者混同，也不将 npm 观测永久视为最新状态。发布前重新检查目标版本占用。

两个发布版本的 registry gitHead 均为 daf133b22630b4a0eecfa3336bbddab0e9119d96，但该提交的核心/chapter manifest 是 5.3.1/1.0.3。Git tag 5.4.0 对应 65e51751cd0c0db0bd00b5d7deb925d52cfaf3ef，其 manifest 版本为 5.4.0/1.1.0。来源声明与版本匹配的 tag 分别登记，未证明任一源码可逐字重建发布 tarball；消费者行为的权威参照是冻结的 tarball。

## 已知支持边界

- 先以核心 5.4.0、chapter 1.1.0 建立首组发布对照，不等同把历史支持范围缩小到这两个版本。
- 两个发布 manifest 的 browserslist 都是 last 1 Chrome version；没有固定浏览器版本或 engines/peerDependencies 的最低核心声明。不能据此虚构 Chrome 最低版本或断言 chapter 支持任意核心。
- 当前构建脚本目标为现代 es2020、legacy es2015；它是源码构建目标，不是已验证的设备/codec 能力清单。BASE-08 将支持矩阵落实到版本和样本。
- 当前文档说明 5.1.0 起核心只内置简体中文/英文，其他语言通过资源导入；BASE-05 必须保留相关子路径消费。
- BASE-02/03/04/05 继续捕获运行时、事件、DOM、类型和旧消费契约。其余 20 包的发布基线在 JSON 中明确标为待核实，各包契约任务负责补齐。此阶段没有真实播放或旧核心/插件兼容结论。

## 重跑

运行 `node refactor/scripts/releases.mjs`。需要 Node 20+、PATH 中的 tar（本机 Windows bsdtar 3.8.8）；首次从固定 npm URL 下载，缓存于忽略目录 refactor/.cache/releases。已缓存时离线验证 SHA-512 SRI、SHA-256、逐文件哈希、manifest 名称/版本和声明的 main/module/types/legacy 文件存在性。核心 41 文件，chapter 6 文件。

运行 `node --test refactor/scripts/releases.test.mjs` 验证损坏内容和不一致哈希会失败。缺 tar、网络失败或内容不一致明确退出非零，不自动更新基线或降级忽略。

脚本不安装或执行发布包，不修改生成产物，不把整个 tarball 解压到工作区。归档成员通过 tar 读到内存；后续浏览器服务可复用 ensureArchive/readMember。仅缓存写入，JSON 与说明为持久来源记录；没有新增生产依赖。

修改冻结基线必须通过独立任务和变更记录；不能直接覆盖哈希来消除回归。真实样本或报告一旦生成，绑定包版本/完整性和测试 ID。

## 公共 API 报告

BASE-02 已在内置浏览器取得核心/chapter 的同步 API 和描述符快照，见 [覆盖与重跑](api-coverage.md) 和 [冻结报告](public-api.json)。事件/生命周期、DOM、类型、分发和其他包仍由各自任务补齐。

## 事件与生命周期报告

BASE-03 已在内置浏览器实测播放推进、暂停/seek/切源、事件及销毁；两次 27 项断言通过，并保存 6 项历史问题。见 [覆盖与复现](lifecycle-coverage.md) 和 [原始报告](lifecycle.json)。受控拒绝与真正媒体播放分别标注，不代替全环境验收。
