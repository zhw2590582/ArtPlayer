# Pages 迁移、验收与恢复

CI-02交付本地配置与预检；CI-04负责实际远端运行和配置切换。当前没有部署、推送、
修改仓库变量或调整Pages source。完整站点内容、外部SDK和三轮发布复盘门槛仍适用。

## 2026-09-14只读快照

- Pages API：`build_type=legacy`，source为`gh-pages`、根目录，status=built。
- CNAME与html_url：`github.artplayer.org`、`https://github.artplayer.org/`。
  HTTPS enforced，证书state=approved；这些是API返回值，不是独立TLS/DNS审计。
- gh-pages提交：`a6d2b81d05c68c8c78cbe62ca0b06761c983f8b8`。本地对象已存在，
  已用git archive保存ZIP恢复副本，路径/内容哈希见CI-02机器记录。
- github-pages环境为custom branch policies，读取到master与gh-pages两个branch规则。
  protection_rules只有branch_policy；未据此新增或删除规则。
- PAGES_DEPLOY_ENABLED查询返回404：不能据此证明变量不存在或权限完整；启用状态未确认。
- 对根页、mobile.html、iframe.html、esm.html、document/、document/en/、
  compiled/artplayer.js的HTTPS HEAD均返回200。未执行线上播放器或广告交互。

以上是时间点快照。发布前再次只读查询，核对源码SHA、旧分支、域名、环境保护和变量，
不能把它们写成永久配置或实际Actions部署已成功。

## 本地与CI产物链

1. 使用.node-version与Yarn1.22.22，frozen安装，执行ci:check和ci:build。
2. prepare:pages检查compiled与dist一致，将docs复制到独立cache目录，然后正常构建
   21个旧uncompiled入口。保留CNAME/.nojekyll、旧HTML与两种语言的文档入口。
3. test:pages:browser检查暂存目录的demo/ESM入口。全部所需CI作业成功后，官方
   upload-pages-artifact只上传本次步骤输出的site，deploy-pages在github-pages环境执行。
4. 报告记录source、来源文件/锁/构建脚本、63个分发入口及完整暂存文件指纹；没有
   用工作区docs路径替代暂存目录，也没有从外部workflow run下载同名artifact。

脚本边界和命令见[scripts/pages](../scripts/pages/README.md)。GitHub对Pages artifact
要求无符号/硬链接，部署需要对应权限、environment及构建依赖，见
[官方自定义工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
当前固定Actions的SHA沿用已验证配置，未升级依赖。

## 获得实际部署授权后的切换顺序

先确认完整发布门槛和目标master源码，再重新保存当前gh-pages提交及完整旧目录。
核对github-pages只允许受信任分支及必要审批，把Pages source切换为GitHub Actions。
确认自定义域名/DNS/TLS保持原值后，设置PAGES_DEPLOY_ENABLED=true并手动运行Deploy Pages。
记录run ID/attempt/SHA、预检报告哈希、artifact与部署URL；不要只根据workflow名称信任产物。

部署后逐项GET验证contract.json的旧路径、MIME和关键文本，再在真实页面验证桌面/
移动编辑器、中文/英文文档、ESM、iframe及播放/章节。HEAD200只证明可访问，不能代替
这些交互。检查被重写或丢失的路径，以及compiled/uncompiled确实来自批准的候选。

## 恢复

发生故障先禁用启用变量，避免新部署进入队列；不要取消已经开始的写入或自动force push。
保存失败run/部署/请求证据，并重新读取当前source和分支SHA。

如果旧gh-pages仍指向已保存的提交，经授权将Pages source恢复为该分支根目录，保留
原域名/HTTPS并等待Pages完成构建，然后重复旧路径和交互验证。如果分支已被其他人
修改，不能直接移动它：先核对保存ZIP的哈希与Git提交内容，准备明确的恢复提交/操作
供批准。恢复本次仓库代码可以revert CI-02提交，但revert不会自行恢复远端设置。

旧自动force-push工作流不是默认恢复方案。任何再次构建、内容调整或候选替换都要重跑
适用检查；不能把之前的绿灯套用到新的站点字节。
