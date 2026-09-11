# 已实现的类型检查与迁移入口

PKG-HLS-04 增加 HLS 的 5 个严格 TS 源模块，公开声明保留历史 .d.ts 并增加 CJS/ESM 条件桥。
test/types/hls-control.ts 覆盖配置省略、旧 Parameters 提取、默认字段和 SDK 泛型、同步返回，
hls-source.ts 检查源码工厂与公开工厂可相互赋值。hls-types.test.mjs 对五组编译模式检查正反例，
并消费实际 Hls.js 1.5.17 声明。TS 4.3 的两个 SDK 自有 DOM 缺失诊断有 SDK-only 对照，
不作插件通过的豁免；独立插件消费者仍要求零错误。
scripts/plugin-editor-types.mjs 与 build:ts 负责 HLS 全局声明生成和双编译器语义校验，
真实 Monaco 用例为 test/browser/hls-editor-types.spec.js；它验证类型和编译后工厂执行，
实际 HLS 播放由 hls-control.spec.js 验证。详见 changes/2026-09-12-PKG-HLS-04-types.md。
下方按原任务保留历史计数；当前执行统计以本次冻结证据和 typecheck 输出为准。

CORE-21 已完成声明与消费者验收。核心公开声明源已迁至 packages/artplayer/public/，
使用 yarn build:types 生成历史 types/ 路径；yarn check:types 只读检查漂移、
源错误和内部依赖，已接入 ci:check。public/ 与 src/ 分别纳入严格检查，
public/ 不打入 npm 包。当前生成 37 个声明，精确构造器及阶段回调宿主已接入。
核心编辑器从同一旧入口依赖图生成，并有独立 TS 4.3.5/5.9.3 语义检查和真实 Monaco 验证；
CI 449 项、229 个生产 TS 文件及最终安装包五组旧/八组精确类型通过，
UMD/legacy 各 1521 项三浏览器回归通过，见 core-public-types.md。

精确模块额外使用根开发 alias typescript-runtime-compat（npm:typescript@5.1.6）
验证当前/最低现代编译器的 Node10、NodeNext CJS/ESM 和 Bundler 四模式。
它不替换生成编译器或旧入口 4.3.5 回归。runtime-leaf-consumer.ts 直接消费
生成模块；runtime-public.ts/runtime-commonjs.cts 通过真实精确入口检查默认/CJS/legacy、
回调、返回值和新旧模块扩展。安装包检查在仓库外重复五组旧类型及八组精确类型，
并禁止解析逃回工作区。runtime-facade.ts 检查源成员覆盖和服务对应，
其余 runtime 类型夹具逐项对照实现，不使用整实例双重断言来制造对应证明。
runtime-construction.ts 同时在仓库和安装包检查 proxy/组件/插件的阶段宿主，
保留独立访问器写入，并区分延迟执行的完整 customType/setting 宿主。
scripts/editor-types.mjs 负责核心编辑器依赖打包、AST 全局桥和独立编译；
test/editor-types.test.js 检查漂移及损坏输出，test/browser/editor-types.spec.js 验证实际 worker。

PKG-CHAPTER-04 已修复核心/chapter 的条件类型入口、language 与 chapter legacy 回退。
当前五组编译模式均要求零诊断，覆盖默认/命名类型、legacy、语言与 CJS require 形式；
七条历史 NodeNext 诊断和打包额外四条诊断的候选豁免已移除，冻结发布基线不变。
旧编译器仍使用 TS 4.3.5 和原 .d.ts 文件。以下 ENG-04 说明保留初始建立时的历史背景，
当前实际入口以 scripts/typecheck.mjs、包内类型文档和任务变更记录为准。

ENG-04 使用开发编译器 TypeScript 5.9.3，并将 TypeScript 4.3.5 作为 npm alias typescript-compat 固定在根开发依赖。后者仅用于旧编译器消费回归，不进入播放器运行依赖或产物。Yarn 锁文件校验现在接受精确版本的 npm alias，仍拒绝范围和浮动版本。

## 命令及真实覆盖

```sh
yarn typecheck
yarn ci:check
```

typecheck 读取根及已建立配置的分包项目，以编译器 API 执行，不依赖两个 TS 安装可能影响的全局 tsc 命令。当前根配置检查两个消费/浏览器类型文件，核心检查 14 个声明及共享资源声明，chapter 检查自身声明及共享资源声明。配置实际编译经过的生产 TS 文件数另行输出；本任务完成时为零，不能把声明检查说成生产 JS 已严格检查。

自动检查当前工作区的 TS 5.9.3 Node10+CJS、NodeNext+CJS、Bundler+ESM 及 TS 4.3.5 Node10+CJS。正例包括旧配置、ready 回调 this、插件、play 和 update；反例拒绝错误 URL/章节时间。没有 ts-expect-error 生效时编译也须报错，防止 any 或声明放宽使反例失效。

TS 5.9.3 的 NodeNext ESM 当前有 7 个准确诊断，单独保存在 test/types/known-diagnostics.json，并绑定 BASE-TYPE-01。它们来自原有默认导出声明互操作问题；检查输出明确是历史失败，不能作为候选验收通过。修复由 CORE-07、PKG-CHAPTER-04 和 ENG-07 接续，届时移除对应失败记录、增加成功消费断言，不能一键刷新以容忍新回归。

BASE-05 的四模式、16 场景、真实发布 tarball 隔离验证仍由 test:baseline 执行。本入口补上当前工作区的检查，不代替隔离发布消费；ENG-07 接入候选 tarball。BASE-TYPE-02/03/04 的可选参数、legacy 声明与返回值问题继续由原任务负责，没有在本任务偷偷修改生产声明。

## 配置与文件职责

| 文件 | 职责 |
| --- | --- |
| 根 tsconfig.base.json | 浏览器实现基线：ES2020+DOM/DOM.Iterable、strict、noUncheckedIndexedAccess、noImplicitOverride、noEmit、skipLibCheck=false、types=[] |
| 根 tsconfig.json | 当前公共消费与浏览器环境类型用例；不是无条件将全部遗留包标为已检查 |
| packages/artplayer/tsconfig.json | 核心自有 TS 及现有公开声明的入口 |
| packages/artplayer-plugin-chapter/tsconfig.json | 试点 TS 及现有公开声明的入口 |
| types/assets.d.ts | 当前 Less inline 和 SVG 的 string 导入类型；不提供泛化的任意模块声明 |
| scripts/typecheck.mjs | 固定编译器检查、分包发现、四种现代消费模式、兼容编译器与历史诊断核对 |
| test/types/ | 真实旧调用、无 Node 全局污染/数组越界反例、明确历史诊断；无运行时副作用，因为只编译不执行 |
| refactor/scripts/types.test.mjs | 验证非法旧调用、无效错误断言和生产 TS 错误确实被拒绝，检查不生成 JS |

实现由现有 bundler 构建，所以源码配置采用 Bundler 模块解析；发布声明仍须经过独立 Node 模式验证。[TypeScript 模块解析说明](https://www.typescriptlang.org/tsconfig/moduleResolution) 区分了这些模式，[官方编译器选项指南](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options) 也说明 bundler 成功不保证未打包声明能被 Node 消费。

allowJs=true、checkJs=false 允许渐进迁移时引用旧 JS；只将迁移的 TS 和声明纳入配置根文件，旧 JS 不因被引用就变成已迁移。迁移任务须缩小不明确的 JS 边界，vendored 独立列入第三方台账，不能用 ts-nocheck/any 把自有代码隐藏过去。新增生产 TS 的包若没有 tsconfig，入口会拒绝继续。

不默认启用 exactOptionalPropertyTypes 去收紧旧调用允许的显式 undefined；公开类型接受范围变化需要逐项消费者证据。内部数组/索引检查启用 [noUncheckedIndexedAccess](https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html)，防止将不存在的元素当作已存在。浏览器 types=[] 防止依赖树中的 @types/node 自动污染 DOM 代码；worker 和 Node 工具需要自身配置，不把 DOM 与 WebWorker 全局混在一起。

## 编译器版本边界

4.1.6 试探无法解析当前 artplayer.d.ts 的类型内 getter（首个错误在 template.html）；已改用实际通过公共消费样例的 4.3.5，并从最终依赖/锁文件移除 4.1.6。4.3.5 是当前核心/chapter 的已测旧编译器点，不是证明所有历史版本都以它为最低，也不是授权抬高用户已有支持窗口。其他包在自身契约任务核对声明语法和实际旧版本消费者；未查明时保持未知。

源码检查用 5.9.3 不要求用户也使用 5.9.3。生成声明时须保留旧编译器能理解的公开语法，并在版本落实和候选 tarball 后重跑。NodeNext/Bundler 的消费模式由当前编译器验证，不传给不具备这些模式的 4.3.5。

## 后续接入

新迁移包复制分包配置并按实际运行环境调整，加入特有正反例；编译器入口自动发现包配置。TS 构建入口与声明生成由 ENG-06/07 和各包迁移处理；不能只增加一个空 config 就宣布包迁移完成。所有生产变更仍按每任务独立提交和包内架构文档规则交付。
