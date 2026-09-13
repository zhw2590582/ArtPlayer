# ENG-LINT-01 恢复全仓 lint

起点 `e0d785662daac01d3c9c01f2dd2d2d2c16ab32d1`，在 EX-01 完成并通过提交审计
之后独立修复。此前全仓 `yarn lint` 在未改动的 Mask manifest 报
`jsonc/sort-keys`：`dependencies` 应在 `typesVersions` 后面。

只移动 `packages/artplayer-plugin-danmuku-mask/package.json` 的顶层
`typesVersions` 区块，不调整内部条件导出键顺序或任何值。将修复后的 JSON 与
起点 Git 内容解析后 `assert.deepEqual`，确认版本、依赖、入口、types、files
和全部其他字段内容不变。没有运行代码、声明、构建产物、根锁或包架构变化，
不增加仅验证格式的测试文件，也不重跑模型/设备测试。

Node 24.21.0、Yarn 1.22.22：全仓 `yarn lint` 返回 0，0 error、1 warning；
剩余 warning 为生成的 `docs/assets/ts/artplayer.d.ts` 中既有 unused-disable
注释，不在本次手改生成文件。严格工具链检查通过，仍是 22 workspace、
33 个固定开发工具。计划、差异和独立提交审计另行核验。

日志和文件哈希见 [证据](../baselines/manifest-lint-validation.json)。Mask
运行产物没有重建；未来打包的 package.json 字节会改变，因此 npm 候选冻结仍
须以重新打包后的 tarball 为准，不能复用旧 tarball 完整性值。

回退本任务提交仅恢复字段顺序及其 lint 错误。没有推送、版本升级或发布；
Mask 的真实模型/设备/分发任务状态不变。
