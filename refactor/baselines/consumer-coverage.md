# 发布入口、资源与类型消费基线

BASE-05 验证固定 npm core 5.4.0 / chapter 1.1.0。隔离目录只写入已校验 tarball 的 47 个成员，不链接 workspace 包，也不修改发布 manifest。运行依赖已经包含在这些 bundle 中；本探针没有执行 npm/Yarn 安装，因此不能代替安装脚本、peerDependencies 或候选 npm pack 验收。

## 入口与 SSR

[consumers.json](consumers.json) 使用 Node 24.21.0，18 项 runtime 断言实际重跑通过。

| 契约 / 固定 ID | 已验证行为 | 后续责任 |
| --- | --- | --- |
| API-09 / DIST.cjs、cjs-legacy | require 核心/插件根及 legacy 子路径，核心版本与插件工厂可调用 | ENG-06/07；CORE-12；PKG-CHAPTER-04 |
| API-09 / DIST.esm、esm-default-only、esm-legacy、direct-esm-file | 真实 Node import 的默认导出，核心/插件 root/legacy；绝对文件 URL 的核心 .mjs 可用 | ENG-06/07；CORE-12；PKG-CHAPTER-04 |
| API-09 / DIST.global-core/core-legacy/chapter/chapter-legacy | VM 中执行无 module/define 的 UMD，保留 Artplayer / artplayerPluginChapter 名称 | ENG-06；浏览器 UMD 挂载另由 BASE-02/04/本任务 SSR 验证 |
| API-09 / DIST.amd-core/core-legacy/chapter/chapter-legacy | 最小 define.amd loader 捕获工厂，调用一次；导出和对应全局变量为同一对象 | ENG-06；这是 AMD 分支验证，未运行完整 RequireJS 网站 |
| API-09 / DIST.i18n-cjs-esm-global | 已发布 11 个语言的 CJS/ESM/global 内容一致，名称/keys/Play 值留证 | CORE-12；不等于所有语言 UI 操作通过 |
| API-09 / DIST.exports-boundary | 三个未经 exports 暴露的深层包 specifier 返回 ERR_PACKAGE_PATH_NOT_EXPORTED | ENG-06/07：区分 package specifier 与 CDN/直接文件路径 |
| API-01/09 / SSR.import-template | 无 DOM 的 import/require 可读取 Artplayer.html/STYLE，不创建实例 | CORE-12 |
| API-01 / SSR.constructor-browser-only | CJS、ESM、legacy 在 useSSR=false/true 下构造均抛明确浏览器环境错误，共六次 | CORE-01/12：SSR import 不等于服务端可构造播放器 |
| API-01/08 / SSR.browser-reuses-player/video、browser-ready/plugin/cleanup | 内置浏览器两轮各五项检查，预置模板节点身份与标记保留，真实 MP4 metadata/ready、chapter 注册、销毁清理 | CORE-12 / ENG-05；[ssr.json](ssr.json) |

DIST 表中的同前缀短名均使用 DIST.。语言实际为 ar/cs/es/fa/fr/id/pl/ru/tr/vi/zh-tw；不虚构 en/zh-cn 的外部文件，它们属于核心内置语言。Node 隔离消费者会检查 require.resolve 指向隔离发布内容；TypeScript 也拒绝解析到 workspace 声明。

AMD 同时设置全局是发布构建的真实行为，不能直接换成只 define 的默认 UMD 模板。useSSR 浏览器探针是将 Artplayer.html 预先写入容器再初始化，不是 React/Vue SSR 框架集成，也不是服务端构造。两轮 videoWidth=640、duration=90.046009，保留 serverMarker，errors/unhandled 及浏览器 error/warn 日志为空。

## TypeScript 矩阵

固定 TypeScript 5.9.3，strict=true、skipLibCheck=false、noEmit=true、ES2020+DOM、types=[]、esModuleInterop=true。每个场景在独立发布声明上创建 compiler program，记录全部诊断及声明解析路径；临时目录路径规范化为 `<consumer>`，不修改诊断类别。尚未确定最低受支持 TS，不能据此把消费者下限提高到 5.9.3。

固定场景 ID 为 `TYPE.<mode>/<fixture>`，例如 `TYPE.bundler-esm/public.ts`。Node10 是 TypeScript 的旧模块解析模式名，**不是 Node.js 10 运行环境**。

| fixture | node10-commonjs | nodenext-cjs | nodenext-esm | bundler-esm |
| --- | --- | --- | --- | --- |
| public.ts：默认/命名类型、core legacy、ready this、插件、play、toggle、注册返回声明、两个错误参数检查 | 通过 | 通过 | 历史默认导出互操作错误及级联诊断 | 通过 |
| language.ts：fr 子路径及 i18n 配置 | 通过 | 通过 | core 不可构造 TS2351 | 通过 |
| optional-chapter.ts：chapter() | TS2554 | TS2554 | TS2349 | TS2554 |
| legacy-plugin.ts：chapter/legacy | TS2307 | 通过 | TS2349 | 通过 |

16 项中 8 项编译通过，8 项为明确捕获的历史失败。检查器通过表示结果与历史记录一致，不是将八项失败当作候选验收通过。NodeNext ESM 的失败不能用 skipLibCheck、any 或删除消费样例掩盖。public.ts 的 @ts-expect-error 仅用于 string URL 和 number chapter 边界反例；在编译通过模式中它们必须真正产生类型错误。

| 差异 ID | 证据与影响 | 责任 |
| --- | --- | --- |
| BASE-TYPE-01 | 发布 root ESM 的运行时默认类/函数正常，但其 .d.ts 在无 type:module 的包中被 NodeNext ESM 消费时呈现 namespace，不可构造/调用 | ENG-04、CORE-07、PKG-CHAPTER-04：协调 ESM/CJS 声明入口并保留旧解析模式 |
| BASE-TYPE-02 | 发布 chapter 的 Option 参数声明为必填，chapter() 报 TS2554；BASE-02 的真实浏览器已用无参数工厂成功注册 | PKG-CHAPTER-02：补兼容可选参数与正反例 |
| BASE-TYPE-03 | chapter/legacy 运行时 CJS/ESM 可用，Node10 解析下声明缺 typesVersions 回退，报 TS2307 | ENG-04、PKG-CHAPTER-04：补旧解析消费，不改变 legacy 文件路径 |
| BASE-TYPE-04 | public.ts 依旧能把 plugins.add 结果赋给 Promise、把 toggle 赋给 void；BASE-02/03 运行时证据与此不同 | BASE-07 / CORE-07：分别记录旧声明接受范围与真实返回，不能直接收紧旧样例 |

完整诊断见 consumers.json；候选修复需新增成功断言并解释旧新差异，保留本历史记录。

## 全包分发与资源清单

[distribution.json](distribution.json) 保存 22 包的完整 manifest、118 个当前 dist/types 文件的路径/大小/哈希、声明入口到文件的映射、源码资源路径和构建输出规则。它是工作区观察，现有 dist 可能陈旧，不能宣称这些哈希全部来自本轮构建或 npm。核心/chapter 发布成员仍以 releases.json 为准，其余包由各自 01 契约任务取真实发布基线。

- 21 个库由根 build.js 生成 .js / .legacy.js / .mjs 并复制 docs/compiled；核心 i18n 由 build-i18n.js 独立生成。
- artplayer-vitepress 当前没有 library main/module/exports，根 getProjects 排除它；实际 VitePress outDir 是 docs/document。这是站点分发。其 manifest 未设置 private:true，未来是否向 npm 分发须由 SITE/REL 明确，不能机械纳入库发布循环；用户要求的自身 next-major 版本仍保留。
- **BASE-DIST-01**：artplayer-tool-thumbnail 的 module/exports.import 指向 .esm.js，实际观察/构建规则为 .mjs；types 指向不存在的 .d.ts，且无 main。交 PKG-TOOL-THUMB-01/04 核实旧 npm 与 CDN 文件，保留历史路径兼容方案。它与 BASE-DEMO-01 的旧 thumbnail 插件是两个不同包，不能混为一谈。
- 源码资源表只列文件路径，不等于远端 SDK/worker/wasm 的完整闭包；外部模型/播放依赖由包契约和 EX-03 验证。npm 实际文件白名单、安装和打包由 ENG-07/REL 验收。

## 重跑与维护地图

使用固定 Node/Yarn 环境，先完成冻结安装；以下命令不需要新增依赖：

```sh
node refactor/scripts/consumers.mjs --check
node refactor/scripts/distribution.mjs --check
node --test refactor/scripts/consumers.test.mjs
```

consumers.mjs 校验固定归档、写入临时消费者、启动真实 Node 子进程并调用固定 TS compiler，结束时只清理已验证处于 .cache/consumers 下的本次目录。runtime.cjs 是分发/SSR Node 用例；public/language/optional-chapter/legacy-plugin.ts 各自代表类型场景。consumers.test.mjs 自动接入 test:baseline，包含来源、缺案例、静默跳过声明、原可用消费失败及媒体证据负例。distribution.mjs --check 只校验冻结清单，不重新构建或验证所有当前文件。

浏览器运行 `node refactor/scripts/browser-server.mjs`，打开 `http://127.0.0.1:8083/fixtures/ssr.html`，点击 Run SSR hydration baseline。须显示 5 checks / errors 0，再运行 `node refactor/scripts/ssr.mjs --compare refactor/.cache/reports/ssr.json`。ssr.mjs --check 只检查保存证据，不能替代浏览器重跑。

--capture 仅用于第一次采集且拒绝覆盖已有记录。发布基线变化必须独立记录；ENG-04/06/07 将这些样例扩为候选测试，不能改旧归档/声明制造通过。尚未完成全生态、所有历史 TS/Node、打包安装、框架 SSR、真机或发布验收。
