# ENG-LINT-02 恢复零错误、零警告的全仓 lint

SITE-07 的扩大检查发现 VAST package.json 顶层 dependencies 排在 typesVersions
之前，违反既有排序规则；核心编辑器声明还保留一个不再需要的 no-namespace 禁用项。
起点 d2f4261aa719a21a8d0dbe042d4d22e307786093，工作区干净且提交审计通过后独立修复。

只移动 VAST 顶层 dependencies 区块；其解析值深度相等，逐字段序列化也相等，
包括条件导出中具有语义的嵌套键顺序。版本、依赖、JS/类型入口及旧路径均不变。
从 scripts/editor-declarations/core.ts 的生成模板删除无效禁用项，保留必要的
no-redeclare。通过 yarn build:ts 重新生成，未手改生成文件。生成声明除这一行
注释外逐字一致；其他生成输出没有实际 Git 差异。模块说明同步说明该注释边界。

Node 24.21.0 / Yarn 1.22.22 的实际检查：

- build:ts 退出 0，24 个声明/清单输出同时经 TS 5.9.3 和 4.3.5 验证；随后生成
  5 个站点浏览器资产、26 条英文路由，产物字节未改变。
- check:editor-types 退出 0，24 个输出无漂移。
- 全仓只读 lint 退出 0，零 error、零 warning，13.10 秒。
- VAST 元数据深度相等及全部嵌套顺序保留、核心生成声明仅注释变化均已实际断言。
- 严格 docs-tools 类型、工具链、计划/风险、Git diff 与提交审计按本批核验。

这是元数据排序和生成注释修复，不增加仅镜像格式的单元测试，不重复真实广告播放。
VAST 下一次 tarball 字节和完整性值会变化，必须重新冻结候选；不能复用此前 tarball
来证明新候选分发。没有新依赖、锁文件、运行时或公共类型变化，也没有推送或发布。
具体命令、日志和语义断言见[验证记录](../baselines/eng-lint02-validation.json)。

本任务单独完成并提交；SITE-07 及 VAST 的其他待验收步骤不因此标为完成。
回退此提交会恢复原格式错误和警告；运行时代码无需回退。
