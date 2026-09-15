# SITE-ROUTES-01：新增 HTML 路径登记与完整本地 CI

基线 `876fa4c32882c8ae27ed15d1bc8507ae75d55eae`，本轮先在干净工作区运行完整
`yarn ci:check`，再修复真实失败并完整重跑。

## 失败与修复

首轮运行时单元2937项、工程/文档170项通过，最后的历史基线618项中617通过、
1失败。demos.test.mjs 检查发现当前45个HTML比BASE-04冻结的36个多了九个。
SITE-DANMUKU/HLS/DASH/AUDIO/VTT的指南工作更新了当前site-inventory，却没有
同步历史demo台账的增量；此前增量机制只支持JS示例。

保持demo-inventory.json的历史内容、指纹和36个路径完全不变，在demo-additions.json
增加pages数组，登记EN Danmuku一页及HLS/DASH/Audio/VTT各两页。每条包含实际路径、
路由、责任任务、EX-03最终责任和引入依据。逐一用Git核实九个introducedBy提交确实
新增对应HTML，且其父提交不存在该路径；没有随意填一个能读取文件的后续commit。

校验将历史与增量合并后对照实际HTML集合，继续拒绝漏项和删除，额外拒绝重复路径、
越界路径、错误route、未知task或最终责任、缺少/歧义的引入依据。不使用自动重拍
快照、忽略新页面、只检查历史集合子集等方式消除失败。

新页面同次提交无法包含自己的未来Git哈希，因此新增记录也可用introducedAfter
注明修改前HEAD，配合owner跟踪后续提交；与introducedBy二选一。该字段只是起点，
不冒充实际引入commit。两种引用均检查40位哈希格式；日常校验不自动核实Git语义，
登记时的人工/工具审查仍必要。本次九条全部使用已核实的introducedBy。

强化测试：已有增量负例先要求原数据验证通过，避免由于无关HTML漂移使全部
assert.throws假通过。新增HTML用例覆盖正例、introducedAfter及八类无效元数据。
改动前针对三个测试全失败，修改后三个测试全部通过。

维护方式写入docs-browser-testing.md与VitePress README；没有改播放器、插件、
公开类型、页面内容、媒体或已验证浏览器交互，也没有新增依赖或重建站点。

## 完整验证

Node24.21.0 / Yarn Classic1.22.22 / TypeScript5.9.3 / Windows。
最终完整ci:check退出0，用时476.52秒。

| 阶段 | 最终结果 |
| --- | --- |
| 运行时单元集合 | 2937 pass / 0 fail |
| 工程与文档集合 | 170 pass / 0 fail |
| 历史基线集合 | 619 pass / 0 fail |
| 全部上述集合 | 无skip、cancel或todo；这些是执行次数，不声明互不重复的契约数量 |
| 生产TS检查 | 416个文件；不把未迁移JS计入TS数量 |
| 消费者类型 | TS5.9.3的node10-commonjs、nodenext-cjs、bundler-esm、nodenext-esm及TS4.3.5的node10-commonjs通过 |
| React/Vue | 类型与lint通过 |
| 其余串联检查 | 工具链、提交、影响映射、CI规则、契约、计划、发布台账、回退清单、lint、生成声明/编辑器/文档/许可产物等通过 |
| 定向台账回归与lint | 3项通过、lint退出0 |

完整命令会在任一子命令失败时停止；保留首轮非零日志和最终日志，未删失败测试或
放宽超时。最终运行期间没有修改测试与校验实现。完成状态和本记录在通过后登记，
再执行最终计划/风险校验及提交审计。

另外从重构起点40fcda6到本轮基线做了明确Git范围的影响分析：3288路径、22包，
四个必需CI作业全部保留，650个未分类路径保守触发全包审查。此分析是在修复前
干净HEAD上取得；本地ci:check默认worktree报告为零变化，不能用它代表分支无影响。
通用隔离Node/类型消费者仍只覆盖core/chapter，影响模型明确列出19个库包缺口。
这些限制不因本地ci:check通过而消失。

本次不是新冻结安装，也没有执行ci:build、coverage、完整浏览器矩阵、实际新tarball
消费或远端GitHub Actions。CI-01继续doing；设备/SDK/原生像素问题及三轮发布复盘
仍按原任务处理，不能把本次检查当成完整CI/CD或npm发布准入完成。

完整输入哈希、阶段统计、Git引入核实及原/最终日志见
[site-routes-validation.json](../baselines/site-routes-validation.json)。

## 状态与回退

SITE-ROUTES-01完成，SITE-04保留原依赖并追加该子任务；关闭SITE-HTML-INVENTORY-01。
当前213 done / 21 doing / 43 todo，共277。没有改变版本、依赖或锁文件；没有push、
部署或发布。回退该独立提交将恢复原校验器和增量文件，但九条文档路径仍存在，
因此旧的HTML覆盖失败也会恢复；冻结的BASE-04快照始终不变。
