# PKG-MULTI-SUB-01 历史契约与 parser 来源

冻结三个真实 npm 包共 20 成员与 9 份 Git 输入，验证所有归档完整性、成员、声明入口及
历史核心版本关联。对照源码、声明、README、demo，建立可重跑的工厂、返回方法、轨序、
Blob 替换、配置及 converter 调用契约。1.0.0 按 cue 下标合并，1.1.0 起连接 cue 数组；
此差异单独保留，未通过修改旧夹具掩盖。详见 [契约](../baselines/multiple-subtitles-contract.md)。

公开声明缺失 Promise/tracks/reset、onParser 只有声明没有实际调用、旧 CJS/export= 的
形状差异均登记，待后续类型阶段处理。源码没有 destroy 请求/URL 所有权，记录为源码
观察，留给 02 复现和 03 修复。本任务没有擅自纠正公开类型或字幕显示产品行为。

VENDOR-03 固定 upstream `380cfcce34ba8b472d3a31474874eb72a0e5f460` 的 parser、完整 CC0
许可和 package.json。当前本地 parser 和旧随包 parser 在去除明确 IIFE/exportify 适配后
完整执行代码一致；真正历史取得时的修订无法直接证明，因此仅称固定比较源。
原始文件/许可存入基线，完整 notices 进入包内及三种独立产物，正常 build 再生 docs 副本。
来源目录通过 gitattributes 保持 LF 和原始许可尾空行，避免 Windows checkout 改变冻结字节。
新增源代码等价、解析/序列化对照和完整包内容检查；没有替换 parser 或给其加 TS 断言。

新增 `yarn test:multiple-subtitles` 作为本包回归入口，不增加依赖。测试结果和实际 tarball
成员检查见 [验证](../baselines/multiple-subtitles-contract-validation.json)。
历史契约与 vendor 验证不是全部包迁移完成；真实字幕、编码/失败/销毁和完整核心/设备、
安装消费者/demo 仍由 02–06 承担。对 banner 的构建不宣称浏览器行为修复。

本任务独立本地提交，不推送、不发布。回退可移除此任务的基线/验证/来源和 notices，
恢复前次构建产物；工厂源码和公开声明未改变。任务结束时以当前证据记录完成状态。
