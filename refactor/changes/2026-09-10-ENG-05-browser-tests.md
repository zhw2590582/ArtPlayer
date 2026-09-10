# ENG-05：可重复的真实浏览器入口

## 交付与结构

新增 [浏览器测试目录](../../test/browser/README.md) 和根 Playwright 配置。固定
`@playwright/test` 1.63.0（仅开发依赖；连同 playwright/playwright-core 更新 yarn.lock），
提供安装、执行和 HTML 报告脚本。原快速 Node 测试独立保留。

服务只绑定 loopback，独占 8084、拒绝复用已有服务；每次从当前 JS/TS 入口构建 core/chapter，
或明确读取指定候选文件。发布基线校验归档/member hash。候选文件缺失直接失败；不会偷偷
使用工作区或旧 docs 产物。docs 页面和样本沿用原路径，compiled/uncompiled 的核心和 chapter
别名映射到已记录 SHA-256 的候选文件。尚未映射的其他包资源拒绝加载。

媒体服务实现单段 Range/后缀 Range、HEAD、416、固定 503 和按用例隔离的请求记录。
新建两个自生成、无外部画面及音轨的短样本；播放用例还切换到既有 docs video.mp4。
没有改动核心/插件的生产源码、公开 API 或声明。

CI 新增 macOS 三浏览器 smoke 和 always 上传报告/失败截图/trace；所有操作使用既有固定
Action SHA。macOS 的选择用于更接近 Safari 的媒体栈；这不代表已经运行远端 CI 或真实 Safari。

## 实际验证

- Windows、Node 24.21.0、Yarn 1.22.22：冻结安装通过，21 个直接工具固定、1339 个依赖 selector。
- Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6：12 项全部通过，无跳过、无重试。
  同组用例覆盖发布 core 5.4.0 / 当前 core 与当前 chapter；解码画面像素、服务端媒体请求、
  时间推进、暂停、seek、切源、销毁、503 与 video:error 均有断言。
- 指定 ENG-06 隔离构建中的两个 UMD 文件后，Firefox 4 项通过；报告确认使用 artifact 来源。
  空候选映射负例在启动前以退出码 1 拒绝。该模式验证映射能力，不代表 ENG-07 tarball 消费完成。
- `yarn ci:check`：原 54 项检查通过；actionlint 与 Git 差异检查通过。
- [精简运行证据](../baselines/browser-validation.json) 保存版本、实际资源哈希、测试源指纹、
  各用例结果、事件与解码像素。完整本地报告/log 在忽略的 refactor/.cache 下。

首次 WebKit 用例用 videoWidth=320 和 page.waitForResponse 判定失败。隔离原生 video、
实际截图和解码像素后确认视频确实播放：该 Windows 构建的 videoWidth 随布局变化，媒体请求
不可靠地出现在 page 网络事件中。最终用解码像素、实际时长和服务端请求联合判定，未删掉
播放或失败断言。此尺寸差异保留为环境限制，不能据此宣称所有媒体元数据兼容均已验证。

首次 Chromium 把正常媒体 Range 取消当成错误。最终只允许当前用例两条已知媒体 URL、同源、
resourceType=media、精确 net::ERR_ABORTED；全部原始记录仍保存。其他错误与播放失败仍失败。

本机 Node 下载浏览器连接超时，curl 从 Playwright 官方 URL 下载相同归档，再经临时 loopback
镜像交给官方 installer 解包；未改依赖或浏览器文件、未关闭 TLS 检查。镜像和诊断服务均已停止。
Chromium 本机安装 headless shell，已验证 headless 项目；带界面模式需安装完整 Chromium。

## 剩余范围与回退

真实 Monaco Run/TS/存储与完整 docs 页面操作仍归 EX-03；本任务只验证 docs 路由可取及候选映射，
轻量页面不替代编辑器验收。WebM 尚未加入播放断言；音频、移动真机、SDK、全插件组合和其他
浏览器最低版本仍按原任务推进。CI-01/CI-04 负责更完整矩阵及远端运行证据；本地全绿不代表远端已绿。

API-01/04/05/07/09 的基础测试入口已经可供 chapter 迁移复用，完整契约覆盖继续随包任务补齐。
回退本任务提交可移除新增依赖、测试及 CI 作业，不影响生产运行代码。下一任务优先推进 chapter
契约与测试，再完成 ENG-07 候选消费并进入插件源码拆分/TS 迁移。
