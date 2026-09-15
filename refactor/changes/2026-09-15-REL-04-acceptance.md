# REL-04 早期回退与主线同步验收

早期演练按原验收完成：隔离包能够回退，主线修复同步/中止流程可执行，正式每批
仍须核对实际回退产物。本次没有改包版本、运行源码或远端工作流。

## 本次核验

构建来源为 `8dcbe9441eb06971a34785857f9cf47451047bb5`，Node 24.21.0、
Yarn Classic 1.22.22，Windows。输入及报告哈希、各步检查、浏览器附件见
[机器证据](../baselines/rollback-acceptance-validation.json)。

| 验证 | 结果与范围 |
| --- | --- |
| `yarn test:package` | 隔离快照正常构建/pack，36 个运行时检查；旧类型 5/5、精确类型 8/8 |
| `yarn test:rollback` | 同一个仓库外消费者七步连续安装/回退，237 个检查；冻结锁、成员内容和新版残留校验通过 |
| `yarn test:rollback:browser --workers=1` | upgrade-core、upgrade-plugin、rollback-plugin、rollback-core、rollback-all 五种状态各三引擎，15/15，零跳过/重试 |
| `yarn test:rollback:iframe` | 旧包安装、新名升级、旧名/导入/锁恢复；实际 require/helper/legacy 和严格 TS 消费通过，别名不能替代应用迁移的负例通过 |
| `yarn test:rollback:mainline` | 独立 Git 仓库中真实 JS→TS modify/delete 冲突，中止恢复、迁移修复、回归和来源归属通过；Git bundle 可验证 |
| `yarn check:rollback-inventory` | 22 包清单同步；20 份完整历史 archive 的 integrity/manifest 通过，保留正式批次状态和缺口 |
| `yarn test:rollback:pages:browser` | 重新校验恢复目录全部 538 文件，12 条精确 HTTP 路径及 6 项 UMD/ESM 播放通过 |
| `node --test test/rollback-files.test.js refactor/scripts/release-ledger.test.mjs` | 34/34，含本次新增的三项最终候选回退证据负例 |

浏览器为 Playwright Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6，
不是实体 Safari/iOS 设备。用例实际验证解码像素、播放、暂停、seek、切源、
Chapter DOM 和销毁；不只检查页面加载。Pages 报告保留四次准确媒体路径的
`request.aborted=true` / `ERR_STREAM_PREMATURE_CLOSE` 取消，服务失败为零；
不宣称网络零中止。

Pages 本轮复用已恢复目录。原恢复报告的 source 是实施前 SHA，因此改用实际交付
提交 `ddf3d6ccb` 核对六个恢复实现/清单文件，`git diff --quiet` 通过。完整
破坏/恢复和首次失败证据仍在[原记录](2026-09-15-REL-04-pages-recovery.md)，
本次没有重复破坏/恢复。固定旧归档 SHA-256 为
`692e190df068d584f460a7c29e5b0a9e565a0a793579ade532f36788731f5faf`。

实际仓库 `git fetch origin master` 成功后，主线仍为
`40fcda6a37d0049d42e49c1e64e70d4fd9ba5f7f`，提交前差分为 299 ahead / 0 behind。
没有需要同步的真实上游修复，合成冲突不冒充真实修复。

## 阶段责任与发布门槛

前面检查点将 Thumbnail 完整归档等正式逐包缺口留在 REL-04 doing。本次按任务原有
“提前演练”与“正式每批再核对”两层验收明确责任，保留原验收文字：REL-04 早期
演练完成；REL-02 显式依赖 REL-04，并在最终版本 pack 后逐包验证回退产物、应用
导入及冻结锁。计划校验器保护这一依赖，REVIEW-03 仍须审查同一候选内容。

发布台账规则未放宽。新增负例在任务门槛全部完成的 fixture 下验证：没有 rollback
报告、报告候选 integrity 不同、报告版本不同，均仍然拒绝准入。已有“完整历史
归档缺失”负例继续通过。不能将这份早期报告登记为最终 next-major 候选报告。

- 20 份 archive 验证不等于 20 个包全部实际回退过；本次连续消费者演练覆盖核心/Chapter，另有 iframe 更名演练。
- Thumbnail 工具原 npm tarball/完整回退产物缺失继续阻止该包；不把旧站点脚本当作完整 npm 包。
- Pages 只证明本地恢复，真实远端恢复仍归 CI-04；其余实体设备/SDK 和三轮复盘未完成。
- 所有包独立 next-major 版本仍由 REL-09 落实，本次早期候选保留当前工作区版本。

维护入口在 [rollback-rehearsal.md](../rollback-rehearsal.md) 和
[release-ledger.md](../release-ledger.md)。不新增依赖或命令，不更改用户 API、
类型、DOM/CSS、分发入口。撤销本提交只撤销本次验收/依赖说明和三个负例，
已有回退实现及历史证据保留。未推送、部署、发布或修改 npm tag。

收尾检查：计划生成/只读检查、风险登记和 `git diff --check` 通过；内存中删除
REL-02→REL-04 依赖被实际计划校验器拒绝，没有改写工作区。`yarn lint` 通过，
34 项回退/台账测试再次通过。`yarn check:release-ledger` 正常退出，22 包仍全为
blocked、`publicationAuthorized=false`；结构检查成功没有被解释成发布通过。
一次误加 `--check` 的直接台账调用因未知参数退出 1，随后使用既有 Yarn 命令成功，
未为该调用修改接口或忽略校验错误。
