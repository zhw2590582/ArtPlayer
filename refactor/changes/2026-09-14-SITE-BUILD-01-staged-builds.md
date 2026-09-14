# SITE-BUILD-01 暂存构建与可复现文档

起点 `078cd9ef72d8b908ef178d650fe0b8c87f867f2a`。从 SITE-03 拆出 i18n/
VitePress 构建与错误恢复，父任务仍接续桌面 common.js UI 的 TS 迁移。
核心/插件源码、公开声明、语言字典、版本和 yarn.lock 未变。

## 实际修改

- `scripts/site-build/` 拆分严格 TS 语言编译、文档子进程与产物替换模块；旧
  build-i18n.js/build-docs.js 保留 checked JS 入口。stateless 路径/哈希函数
  复用 documentation/files.ts。模块 README 解释目录所有权、错误、恢复及限制。
- 固定旧 i18n 函数复现：删除原 dist/i18n 后才开始编译，首个编译失败即丢失
  完整旧语言包。新版本排序和去重 JS/TS 入口、先编译全部 11 语言 UMD/ESM，
  校验 22 文件集合，再复制到第二暂存目录，完整替换 dist/compiled 两处输出。
  排除 index/publish/zh-cn/声明和 es2020/minify/default/global 设置保持不变。
- 固定输出目录、按类型独占锁、编译前后指纹检查；编译/空产物失败不触碰旧
  输出。目录替换保留备份，后续 rename 失败逆序恢复。并发写入冲突拒绝覆盖，
  保留旧备份并给出恢复路径。清理只在校验过的 cache run 目录内执行。
- 文档构建使用本次 Yarn 的 npm_execpath，经 --version 核实 1.22.22 后，通过
  当前 Node 启动 Yarn，运行 workspace 的原 build 脚本并显式传 staged outDir。
  子进程 error/null exit 失败、原非零退出码透传，成功还必须存在 index.html。
  `yarn build:docs` 仍先生成站点浏览器资产；直接 node 且没有 Yarn 生命周期环境
  会提示正确命令，不再回退 npm。没有安装依赖、隐式远程翻译或发布行为。
- 连续构建发现 VitePress1.6.3 的代码分组选项卡随机 name/id，导致五组页面
  JS 哈希及引用 HTML 每次变化。保存差异清单并用已安装 renderer 独立复现。
  `packages/artplayer-vitepress/build/markdown.ts` 包装原 renderer，只将它生成的
  group 名和 input/label ID 换成页面相对路径、token 位置与序号。保留原代码
  HTML、CSS 类、标签关联和 active 行为，不修改 node_modules 或事后改产物哈希。
- docs/.vitepress/config.js 接入 hook；文档 workspace 明确 type:module，符合
  现有配置/主题 ES import/export，不影响播放器包模块制式。新模块与回归测试
  进入根 lint/docs-tools/test:node；新增 yarn test:site-build 独立入口。
- 实际重建 docs/document：替换旧哈希资产并生成当前 Markdown/主题和 main.js。
  11 语言的两处 22 文件均与起点 Git 内容一致，无语言产物变更需提交。

## 验证与范围

- 7 项目标 Node 测试：冻结旧删除缺陷、失败/空产物/第四次 rename 回退、竞争
  构建与编译期间编辑、回滚冲突保留备份、真实 Vite 编译全部 11 字典及四类
  导出/历史 window 别名、JS/TS 重复与真实语法失败、真实 Yarn fixture 退出码
  23/0、安装版 Markdown 随机 ID 与稳定/唯一/label 对应。故意语法失败会打印
  Vite 红色 build failed，由 assert.rejects 验证；不是被跳过的失败。
- 初次测试有两项测试入口问题：yarn node 不提供 npm_execpath；Node 无法直接
  导入源内无扩展名 publish。改为正式 Yarn script 和现有源码 loader 后验证。
  初次日志保留，没有改变播放器语义或放宽断言。
- 完整 VitePress 构建实际通过。最初重复构建指纹不等，定位并修复随机 ID 后
  连续两次完整构建文件树指纹相同。最终指纹、文件集与日志见验证 JSON。
- 最初三浏览器 6 项通过；修复稳定 ID 后补充选项卡真实点击，再次 6 项通过。
  加载中英文 option/event 深层页及实际生成 JS/CSS，点击 Run Code 并核对 URL，
  之后点击首页第二代码组选项卡、检查选中状态和代码块显隐。无重试或跳过。
  editor 的 8082 目标用受控空页接收，仅验证导航参数，不替代编辑器执行验收。
- 根 lint 0 error/1 既有 warning；严格工具类型、工具链、CI/完整 baseline 和
  最终任务/风险/清单检查结果见 [证据](../baselines/site-build-validation.json)。

广告请求在浏览器测试中用空响应，不修改生产广告。没有验证完整站点链接、
搜索结果、全部示例、真实设备、远端 CI/Pages/npm；这些仍归 SITE-03/04/05、
EX-03 和发布任务。目录替换存在短暂 rename 空档，两目录不是并发读者的原子
事务；断电/强杀可能残留锁和部分替换。必须核对进程与备份后恢复，不自动删
“过期锁”。清理异常可能发生在安装成功后，按真实目录状态处理。

## 交接

构建/恢复改动从 scripts/site-build 进入，Markdown hook 由文档包维护。新增语言
或升级 Vite/VitePress 时回归完整集合、别名、失败恢复、稳定性与真实选项卡。
只用源码生成 docs/document，不手改产物。每任务独立本地提交并审计，无推送。
回退提交恢复原入口/生成站点，同时会恢复 i18n 删除风险和随机 ID；优先做针对
性修复。下一步继续 SITE-03 桌面 UI，未改变其它包的开放验收状态。
