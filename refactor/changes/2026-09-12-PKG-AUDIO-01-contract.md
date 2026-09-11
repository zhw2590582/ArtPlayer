# PKG-AUDIO-01：Audio Track 发布契约

状态：本步契约验收完成。起点为 HLS 诊断检查点 26b2983d；后者仍未完成，不构成依赖阻塞。

范围：固定 audio-track 1.1.0 的 npm 归档、声明、源码和 demo 差异，记录同步、
暴露 audio、update 和事件契约。本步不修改生产行为。后续 02 建行为测试，03 整理
同步与资源，04 迁移严格 TS 和兼容声明，05/06 完成组合、设备与分发验收。

## 来源和结果

真实 npm 1.1.0 归档 2205 字节、六文件，SHA-512 SRI、SHA-256、成员哈希及入口存在性通过。
manifest、README、声明与历史源码 LF 内容一致，完整工厂 AST 规范化比较一致。
registry gitHead 对应包版本 1.0.2，故没有把该字段当成 1.1.0 源码证明。
来源和范围见 [冻结输入](../baselines/audio-track-release.json)，
详细旧行为与映射见 [契约](../baselines/audio-track-contract.md)。

识别出 AUDIO-LIFE-01/SYNC-01/TYPE-01/DEMO-01，分别交由 02～06；都是源码事实或待取证，
没有声称已复现真实音频泄漏或已修复。包括公开 audio、严格同步阈值、无自动主视频静音、
update 部分配置、错误警告、源更新及销毁顺序，旧合法接口均维持原状。
修正文档环境矩阵对本包的能力描述：它同步独立外部 Audio，不负责 HLS 轨道拓扑选择。

## 验证与范围

- `node refactor/scripts/audio-contract.mjs`：六文件归档及历史源码检查通过。
- `node --test refactor/scripts/audio-contract.test.mjs`：两项通过；额外验证格式变化不误判，
  真实函数行为变化不能获得相同规范化指纹，缺失工厂明确失败。
- 定向 ESLint：首次报告对象换行三处，修正格式后复验通过。
- 计划与风险表生成/校验、Git diff 空白检查通过：216 任务、126 风险，没有豁免未解决项。

新增一个只读契约检查入口及其 Node 测试，复用已有 esbuild/TypeScript/tar 依赖，
无新安装依赖或 lock 变更。首次会下载已冻结归档至忽略缓存；不会安装/执行归档代码，
不会更新持久基线。`yarn test:baseline` 的既有文件模式自动纳入这两项。
生产源码、声明、demo、构建产物完全未改，因此本步不重建、不声称浏览器或类型消费者通过。

## 提交、回退与接续

独立完成提交主题：`docs(audio): [PKG-AUDIO-01] freeze released synchronization contract`。
仅回退本任务新增基线/检查及任务文档即可恢复先前状态；无生产行为回退需求。
基线本身长期不可覆盖，后续修改另建证据。下一步 PKG-AUDIO-02 建立可重跑的旧版行为、
边界与错误测试，03/04 按证据拆分、修复、迁移 TS；包内实际模块地图随实现交付。
剩余所有包、设备、CI/CD、major 及三轮复盘继续保留。未 push/tag/publish/merge。
