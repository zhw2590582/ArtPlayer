# ENG-07：安装实际 tarball 后验证

为核心和 chapter 建立 [打包消费者入口](../../test/package/README.md)。使用仓库构建脚本在
独立快照重建三格式和语言文件，Yarn pack 后在仓库外临时目录真实离线安装、frozen 重装。
逐文件核对 tarball 与安装内容 SHA；运行时与声明不能解析回 workspace 源码。
检查 main/module/legacy/types/exports、历史路径、默认导出、SSR、语言和 Emitter 契约。
包内新加的 tsconfig 是实现配置，已从这两个 npm 包中排除，不改变公开入口。

新增 `yarn test:package`、`yarn test:package:release`，不新增依赖。
CI 的 macOS 三引擎作业先构建并安装 tarball，再将安装后的候选文件交给浏览器；报告上传
排除带 node_modules 链接的构建快照。远端作业尚未执行，actionlint 本地通过。

## 验证

- 实际安装后的 23 项运行时检查通过，公开属性形状/描述符与默认配置对照通过。
- 五组 TS 组合中两组无诊断；其余精确匹配 11 条已知历史诊断。它们归 BASE-TYPE-01/03，
  不是发布豁免；`test:package:release` 如预期以 1 退出并保存报告，等待 chapter 04/core 类型任务修正。
- 缺文件、缺通配导出、内部配置泄漏、删旧路径及实际移除 default/入口的两个反向测试通过。
- `yarn ci:check`：57 项 Node/基线测试通过；严格类型、lint、工具链及计划检查通过。
- 安装产物三浏览器回归 39 项通过，无重试或跳过；Chromium 153.0.8010.12、Firefox 155.0、
  WebKit 26.6。包括发布核心配候选插件、真实解码/播放/seek/切源/销毁及章节交互。
- 指纹与诊断摘要见 [执行记录](../baselines/package-validation.json)。完整日志和 tarball 在
  refactor/.cache/packages，浏览器证据在 refactor/.cache/browser；缓存不作为长期发布凭据。

发现并修正测试 lint 自动将 node:test 改写到未安装 Vitest 的问题，按现有 Node 测试约定
保留局部规则说明，没有安装第二套 runner。

## 边界与接续

这一步提供可复用的工程入口，初始实际包覆盖只有 core/chapter，不宣称所有插件已验证。
其他包随迁移增加独立消费者。API 形状检查不能替代行为测试；docs 完整编辑器、真机/SDK 和
远端 CI 仍由原任务负责。没有改生产运行时或发布版本，没有推送/发布。

下一项 PKG-CHAPTER-03 直接使用 TS 拆分区间、DOM 与生命周期，04 再完成公开声明和消费者修正，
不先进行一轮重复的 JS 拆分。回退使用本任务独立提交的 revert，已冻结发布基线保持不变。
