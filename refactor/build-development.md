# 已实现的 JS/TS 构建与开发入口

MOD-PLUGIN-01 将 `yarn create:plugin` 的实现拆为严格 TS 渲染/文件写入/CLI，
保留旧 JS 命令入口。生成 TS 工厂、CJS/ESM 声明、分发消费测试与维护文档；
拒绝覆盖既有包/示例，失败时回退自己的写入并保留外部修改。
运行 `yarn typecheck:scaffold` 与 `yarn test:scaffold`，具体限制和模块地图见
[生成器维护指南](../scripts/plugin/README.md)。MOD-02 将剩余库构建/开发实现移到
scripts/library 的严格 TS 模块，保留旧命令/模块入口；其模块地图与生命周期限制见
[库工具维护指南](../scripts/library/README.md)。Servor 端口失败状态和关闭责任由
MOD-DEV-01 继续处理，不因 TS 迁移而豁免。

ENG-06 保留原来的 Vite 7.3.6、Terser、三种库产物及路径，增加选包参数和 TS 入口；未切换 bundler 或运行时依赖。固定工具链仍为 Node 24.21.0 / Yarn 1.22.22。

ENG-12 将库配置的 publicDir 设为 false，防止 core/public 的声明源码被复制到 dist。
库静态资源须通过已有显式 import/构建入口处理；文档站仍使用独立 VitePress 配置。
打包检查拒绝非声明形式的 .ts/.cts/.mts，保留 .d.ts/.d.cts/.d.mts；
实际三格式构建回归见 test/library-build.test.js 和
[修复记录](changes/2026-09-13-ENG-12-library-public.md)。

```sh
yarn build                              # TTY 中原交互选择
yarn build artplayer                    # 一个包，无交互
yarn build artplayer artplayer-plugin-chapter
yarn build all                          # 全部 21 库，文档站仍用自身 build
yarn dev artplayer --no-open             # 8082，方便内置浏览器/自动化
yarn dev                                # 原交互选择并打开浏览器
yarn build --help
yarn dev --help
```

JS 包使用 src/index.js，TS 包使用 src/index.ts；必须恰有一个入口，同时存在时明确报错，避免残留 JS 遮盖新 TS。没有 TTY 且没有包参数时退出失败，不在 CI 中等待选择。未知名称、路径字符串、错误 all 组合在清理产物或启动服务前拒绝。dev 只接受一个包；build 可按提供顺序构建多个包，重复名称去重。

## 实现地图

| 文件 | 职责与维护点 |
| --- | --- |
| scripts/projects.js | 兼容导出 library/projects.ts：库清单、CLI 选择和 JS/TS 唯一入口；保留原 prompts 交互 |
| scripts/build.js | 命令门面调用 library/production.ts；顺序构建、dist 清理、docs/compiled 复制和分析；banner 独立为 library/banner.ts |
| scripts/dev.js | 命令门面调用 library/development.ts；默认 8082、docs/uncompiled/包名/index.js、首次成功打开浏览器、源码监听和失败恢复 |
| scripts/rebuild.js | 兼容导出 library/rebuild.ts；合并通知、串行构建、失败后的下一次请求 |
| scripts/utils.js | 兼容导出 library/config.ts、names.ts 和 projects.ts；Vite/worker 配置与命名分离，AMD 补丁由 banner.ts 维护 |
| scripts/build-analysis.mjs | 兼容导出 library/analysis.ts；分析文件位于 cache，不进入 dist |
| types/assets.d.ts | Less inline、SVG URL 与 SVG raw 的字符串类型；特定 worker 类型边界随拥有该 worker 的包配置 |
| refactor/fixtures/build/ | 同时使用 TS、相邻 JS、Less、SVG raw、TS inline worker 的独立构建夹具；不属于发布包 |
| refactor/scripts/build.test.mjs | 真实 CLI 产物、错误不误清理、CJS/global/AMD/ESM、队列错误恢复；浏览器 worker/全库 AMD 使用 browser.html |

Vite 支持 TS 转译，但不替代类型检查，源码检查继续运行 yarn typecheck。[Vite 7 的 TS 说明](https://v7.vite.dev/guide/features#typescript) 对此有明确区分。此任务没有将生产 JS 改名为 TS，也没有生成新公开声明；ENG-07 与包迁移任务继续负责声明和 tarball 验收。

dev 仍监听所选包的 src 目录，包外共享文件/tsconfig/依赖变化需要重启；不宣称已做完整依赖图热更新。错误会打印并保留监听，修复后重建；--no-open 仅禁止自动启动外部浏览器，访问地址不变。实际验证中源码修改和错误恢复后手动刷新页面确认了新结果。

## 本次发现的 AMD 构建缺陷

BUILD-AMD-01：旧插件在压缩 UMD 中把参数 t 写死为全局对象。但构建夹具的包装为 function(e,t)，此时 t 是工厂；旧补丁生成 t.artplayerPluginBuildProbe=t()，AMD 返回虽可用，全局导出却不存在。补丁现在读取外层包装的第一个参数。只有实际 outputOptions.format=umd 时处理，避免将内联 worker 的 ES 输出当作 UMD。

不识别的 UMD/AMD 包装现在明确构建失败，避免升级打包工具后悄悄丢失全局接口。新夹具回归要求 AMD 工厂返回与对应全局为同一对象。两轮 21 库/63 产物比较：39 完全相同，24 个 UMD/legacy 只修正上述接收者，逆向替换该位置即可还原旧 SHA-256。全部 42 个 UMD/legacy 在内置浏览器中验证 AMD 工厂一次执行、返回与全局一致。

这修复的是构建路径。旧 npm 内容不变，根目录原有 dist 未手工改写；本次在隔离 checkout 中通过正常脚本生成候选，发布阶段必须用新工具重新生成并验证实际要发布的产物。AMD 入口通过不等于广告、模型、Cast、codec 等完整功能已验证。

## 重跑浏览器夹具

在用于验证的隔离 checkout 正常构建 21 库；复制 refactor/fixtures/build 下内容到临时包的 src，包名 artplayer-plugin-build-probe、版本 1.0.0。该包仅用于测试，不添加到真实 workspace 范围或发布列表。将 browser.html 复制到 docs/build-probes.html，将实际 21 库包名 JSON 数组写到 docs/build-packages.json。

运行 yarn dev artplayer-plugin-build-probe --no-open，打开 http://localhost:8082/build-probes.html。两个按钮分别验证真实 worker 往返及 42 个 AMD/global 入口，DOM 中的 JSON 是实际报告；每个 iframe 在加载后移除，worker 在结束后 terminate。Node 测试只能检查 worker 工厂存在，不能用它代替这次真实往返。

首页现有示例另用 `http://localhost:8082/?libs=./uncompiled/artplayer/index.js&example=index` 验证 JS 开发构建、Monaco 加载、媒体 metadata、播放和暂停；该首页包含既有广告脚本，本任务没有改变它们。完整编辑器功能、移动与 SDK 用例仍由 SITE/EX/包集成任务负责。

本次证据见 [构建与浏览器记录](baselines/build-validation.json) 和 [变更记录](changes/2026-09-10-ENG-06-build-development.md)。测试数量与入口通过不代表生产源码迁移完成。
