# SITE-07 Monaco 注册贡献模块与完整入口装配

修改前 HEAD：0cfdf4a7e3292d6f2006c9d4e734b90afc771755。

## 实现与兼容边界

补齐此前 core 压缩核验留下的贡献模块装配缺口。六个 npm 归档及固定 Monaco
Git 归档提供构建工具、核心产物和源码；102 个 Git 成员逐项验证 blob/SHA-256，
其中 88 个 TS 模块分为 TypeScript 3、CSS 2、JSON 2、HTML 2、基础语言 79。
冻结原 metadata、gulp 装配配方、五组配置/打包配方和许可；原 lock 复用既有副本。

新增 `yarn verify:monaco-contributions [--fetch]`。使用 TypeScript 4.4.4 原
ES5/AMD/strict 配置发射源码，RequireJS 2.3.6 负责命名、排序及顶层 strict
处理，Terser 5.9.0 负责分组压缩。原锁中 Terser 的 source-map 是嵌套 0.7.3，
不是顶层 0.6.1；验证器按真实依赖位置核对。五个独立 filler 使用 program 发射，
避免 isolated transpilation 自动给已有 define 调用再包一层 AMD。

遵循原发布步骤：压缩后给 filler 加核心 API 依赖，核心入口改名，按固定顺序
追加五组模块和返回核心 API 的别名，然后恢复原 source-map 位置与换行。完整
开发版 7,070,291 字节和压缩版 2,792,306 字节均精确复现；压缩版同时匹配
站点现有文件。不手改运行资产，不改公开 API、worker/脚本 URL、锁文件或版本。

`contributions.ts` 用 AST 静态读取 metadata，检查重复/动态值、顺序和模块归属。
core 与贡献 bundle 不能套用同一 AMD 清单规则：core 含嵌套匿名 UMD，入口经
字符串表索引 719 注册；验证器确认唯一入口及真实 define 调用，保留完整字节
比较。每次构建使用新的忽略目录，缺少输入不能被旧缓存产物掩盖。

## 验证与问题处理

23/23 单元、严格 docs-tools 类型和 lint 通过。新增负例覆盖缺少/重排分组、
动态/重复 metadata、错误归属、缺失/重复/已注入依赖、伪入口字符串和错误表
索引。原脚本探针发现 strict 转换、filler 双层包装及 core 表索引差异，均修正
为上游实际流程，未把检查器问题记为运行时缺陷或通过忽略字节差异绕过。

三引擎浏览器回归 6/6：每个引擎运行全部 2,511 上游和 12 补充分词用例，
验证 76 个语言 URL，并执行真实 CSS/JSON/TS 诊断更新、HTML/JSON 格式化和
模型清理。联网和离线的完整源码/装配复验、执行环境、内容指纹与浏览器报告
见[验证记录](../baselines/monaco-contributions-validation.json)。

## 后续与回退

维护入口：[Monaco README](../../scripts/site-vendor/monaco/README.md)。这证明
注册模块源码发射和最终装配等价，不证明完整原始 VS Code TS 工程编译或上游
语义类型检查。CSS、其余内嵌来源及 SITE-07 其他交付边界继续开放；本批没有
改变站点 notice 内容，不重复声称设备、SDK 或远端 CI 验收。

SITE-07 doing / VENDOR-06 open，仍为 199/265；Thumbnail 默认策略待答。
可单独回退新增重现脚本、基线、单元用例与维护记录；独立本地提交，无推送、
部署或发布。
