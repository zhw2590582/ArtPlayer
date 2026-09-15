# PKG-TOOL-THUMB-07 保留清理中的原始异常值

来源 HEAD：`2a380679117b02499ff3a131cb449e1eda007cb2`。
本任务修复迁移中的兼容回归，不改变待批准的 Thumbnail 默认行为方案。
对应 API-04 事件异常传播和 API-05 销毁/资源清理。

## 缺陷与修复

恢复的3.5.31 CDN文件及冻结工作区 main/legacy 在 destroy 监听器抛出 undefined、
null、false、0、-0、空字符串或NaN时，均同步向调用方传播原值。迁移后的
cleanupAll 使用异常值的 truthiness 判断是否失败，导致这些异常被吞掉；如果
后续清理再抛出 Error，后一个异常还会覆盖第一个值。

新增回归在未修复候选上1通过、2失败：历史契约通过，候选在首个undefined的
传播及后续异常覆盖检查失败。修复后的全部七种值都被实际检查，使用独立的
threw 标记和 Object.is，避免“没有抛出”和“抛出undefined”混淆，也区分-0与0。

实现仅调整 src/lifecycle.ts 的 cleanupAll：使用单独 failed 布尔值记录异常发生，
保存第一个原始值；继续执行所有后续资源清理，然后按原值抛出。没有改变正常
返回路径、清理顺序、事件名称、默认参数、同步/异步形状或类型声明。

销毁先将实例关闭，失败后再次 destroy 仍不重复执行。cleanupAll 的继续清理
不代表 emitter 改为继续派发：destroy 的一个监听器抛出后，当前派发中其余
监听器仍不执行。测试同时检查这两层边界。

## 验证

| 验证 | 结果与范围 |
| --- | --- |
| 新回归旧红/新绿 | 未修复1通过2失败；修复后3通过，包含七种 falsy 值、原始异常身份、继续清理和重复销毁 |
| 源码专项 | yarn test:thumbnail：123通过 |
| 正式 main/legacy | 各49项输入、抽帧、清理和 emitter 单测通过 |
| 源码真实浏览器 | 15通过：3份历史实现及候选的原始异常、真实DOM清理，以及现有事件注册回归 |
| 已安装 main/legacy 浏览器 | 各21报告通过；每轮5项Windows WebKit为Blob能力受限对照，不计抽帧成功 |
| 其余检查 | 严格包类型、定向lint、正常三格式构建、严格工具链通过 |

浏览器共57报告通过，其中47项实际执行对应正常场景，10项是明确标注的
WebKit能力对照；没有失败或重试，也没有把受限对照记作成功抽帧。main/legacy
还覆盖正常PNG像素/重复生成、拖放、损坏媒体后切源、迟到编码与销毁/替换取消。

Node24.21.0、YarnClassic1.22.22；隔离包由
`yarn test:thumbnail-types-package` 实际打包、在仓库外安装、冻结离线重装并核对
每个文件。安装后的7项候选正例通过、52项预期负例诊断成立；5项历史工作区
缺入口/声明的预期失败保持原样。编译器为TS5.9.3及4.3.5，不能称为12项旧声明
全部编译通过。历史工作区夹具也不是已找回完整npm3.5.31归档。

包内 ARCHITECTURE 已在打包前更新。三份dist、docs/compiled副本和已安装副本
字节一致；公共types未变。源浏览器检查后仅规范了等价的window全局访问及格式，
最终测试文件已用于main/legacy运行。root test:thumbnail 与 test:unit 均新增此
回归，无新增依赖、版本变更或锁文件修改。

机器证据：[thumbnail-cleanup-errors-validation.json](../baselines/thumbnail-cleanup-errors-validation.json)。
命令入口和职责随包内文档一起维护。此任务不关闭04的默认值冲突，也不代替
05/06的最终组合、设备或完整分发验收；本轮未推送、部署或发布。

## 回退与交付

回退本独立提交会恢复有缺陷的 truthiness 判断，撤销对应测试、文档和本轮
构建产物；不撤销此前的TS迁移、输入/抽帧资源归属和emitter修复。
本任务以PKG-TOOL-THUMB-07单独完成并提交，04继续doing。
