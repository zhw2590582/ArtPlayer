# 全包大版本升级策略

2026-09-10 用户明确要求：本次重构所有 workspace 包分别升级到自身下一个大版本，M.m.p → (M+1).0.0。无论内部整理是否造成 breaking change，本次都按此策略发布；旧 API、类型、事件、DOM/CSS 和分发入口的兼容要求仍然成立。

## 目标清单

以下来自源码提交 a9197f59 的 22 个 package.json，是本次规划快照，并非已核实的 npm 最新版本；package-inventory.json 历史基线保持不变。本任务不修改 manifest。

| 包 | 当前源码版本 | 重构正式目标 |
| --- | --- | --- |
| artplayer | 5.4.1 | 6.0.0 |
| artplayer-plugin-ads | 2.1.0 | 3.0.0 |
| artplayer-plugin-ambilight | 1.1.0 | 2.0.0 |
| artplayer-plugin-asr | 2.1.0 | 3.0.0 |
| artplayer-plugin-audio-track | 1.1.0 | 2.0.0 |
| artplayer-plugin-auto-thumbnail | 1.1.0 | 2.0.0 |
| artplayer-plugin-chapter | 1.1.0 | 2.0.0 |
| artplayer-plugin-chromecast | 1.1.0 | 2.0.0 |
| artplayer-plugin-danmuku | 5.3.0 | 6.0.0 |
| artplayer-plugin-danmuku-mask | 1.1.0 | 2.0.0 |
| artplayer-plugin-dash-control | 1.1.0 | 2.0.0 |
| artplayer-plugin-document-pip | 1.1.0 | 2.0.0 |
| artplayer-plugin-hls-control | 1.1.0 | 2.0.0 |
| artplayer-plugin-jassub | 1.1.0 | 2.0.0 |
| artplayer-plugin-multiple-subtitles | 1.2.0 | 2.0.0 |
| artplayer-plugin-vast | 1.2.0 | 2.0.0 |
| artplayer-plugin-vtt-thumbnail | 1.1.0 | 2.0.0 |
| artplayer-proxy-canvas | 1.1.0 | 2.0.0 |
| artplayer-proxy-mediabunny | 1.2.0 | 2.0.0 |
| artplayer-tool-iframe | 1.1.0 | 2.0.0 |
| artplayer-tool-thumbnail | 4.4.0 | 5.0.0 |
| artplayer-vitepress | 1.1.0 | 2.0.0 |

根 package.json 是 private 的 monorepo 管理包，当前 6.1.0，不作为 npm 发布包或核心版本依据。artplayer-vitepress 也按用户“所有包”要求列入版本升级；是否实际发布 npm 需按原分发范围和发布台账核实，不能因列入表中自动扩大公开发布范围。

## 规则与实施

1. 保持 Lerna independent：核心 6.0.0 不意味着全部插件也是 6.0.0。每个包 minor/patch 归零；本次只有一个 major 升级，不按任务或复盘轮次反复加 major。
2. 允许在目标版本下准备预发布版本，例如 6.0.0-rc.1；具体标识由 REL-01 固定，正式目标保持 6.0.0。预发布、正式 tag 和实际 publish 仍遵循发布流程。
3. REL-01 核实已发布历史及版本占用，再冻结分包目标、变更日志和依赖范围。若执行期间主线已经发布了目标 major 或存在目标版本，明确记录冲突并重新确定方案；不能覆盖已发布内容、悄悄改成 patch 或凭旧清单直接发布。
4. REL-01 冻结方案，REL-09 落实版本准备；必要时将 REL-09 拆为可验收的子任务，再同步 manifest、适用锁文件、内部 dependencies/peerDependencies、示例和变更日志，独立提交后由 REL-02 构建候选。更新 peer 范围需保留已验证的旧核心支持，不因 major 变化强制全生态同步升级。
5. 全包都纳入大版本目标，不以某包改动较少为由继续发原 minor/patch。允许按实际验证范围分批发布，未交付包保持待办，不伪造完成。
6. 候选版本必须在最终构建/pack/验证前确定，CI-03 校验逐包版本、包内容和发布 tag；不能测试旧版本包后临发布再改版本。版本或依赖变化使相关候选证据失效，必须重跑验证。
7. REVIEW-03 逐包核对目标、声明、入口、版本组合、旧调用及回退产物；release notes 说明本次工程重构采用新 major，但不能笼统声明所有旧 API 已兼容而缺少证据。

本次决定替代 toolchain-release.md 和 github-ci-cd.md 原先“不自动提升全部 major”的规则。兼容契约与三轮复盘门槛不变；这是版本策略记录，尚未实施升级或发布。
