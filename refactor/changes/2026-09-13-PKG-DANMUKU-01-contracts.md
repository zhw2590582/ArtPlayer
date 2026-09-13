# PKG-DANMUKU-01 弹幕公共契约与发布来源

冻结起点：`b0cfbfe3a09a84a295a257e45e4577847588d1cb`。

本任务只增加不可变基线、校验器和契约测试。未改生产源码、公开声明、构建产物、
共享脚本或发布版本；整合代理维护任务状态并完成单独本地提交，不推送或发布。

## 交付与兼容范围

- [发布来源](../baselines/danmuku-release.json)：81 个真实稳定版目录，15 个实际 tarball，
  SHA512/SHA256、全部成员、manifest 入口、可用 Git 关联及 28 个冻结工作区输入。
- [契约](../baselines/danmuku-contract.md)：emit/load/config/hide/show/reset/mount、三个
  getter、icons、27 配置、事件、设置 UI、热力图、Bilibili 与 Worker 协议。
- [校验器](../scripts/danmuku-contract.mjs)：返回 `{baseline,archives,sources}` 供后续
  行为测试重用；下载只用冻结 npm URL，Git 内容只读取冻结完整 SHA。
- [44 项测试](../scripts/danmuku-contract.test.mjs) 与
  [实际验证记录](../baselines/danmuku-contract-validation.json)：运行真实历史模块字节；
  最新 main/legacy 和冻结源码比对方法、返回身份、事件、输入和 settings 发送路径。

API-02/03/04/06/08/09/11/12 都有明确契约记录；其中 UI/Worker 的视觉与浏览器行为
仍是待验收内容。3.5.31/4.4.11 是前代对照，不是自动承诺任意历史 major 的所有行为。

## 发现与处置

真实模块形态在 3.5.31、4.4.11–5.2.0、5.3.0 之间变化；后续保留已有合法 JS 入口。
多数关联 Git manifest 与发布号不同，5.1.7 无 gitHead，不据此推测最低核心版本。
5.1.7 的合法 tar 目录头使共享 archiveFiles 的旧假设不适用，专属读取器依据条目类型
识别目录，同时保留路径/重复/非普通成员检查，没有扩大共享脚本影响。

已复现 emit 异步却声明同步、链式返回内部对象、初始 Promise validator 拒绝、
mount 省略时报错、time:0 被替换、resize 解绑错误及设置 timer 未清。源码读码还观察到
id/icons、Slider 和 heatmap points 类型漂移。根类型后续遵循已经批准的统一类型政策，
不因修正异步描述破坏最新 npm 合法双向工厂赋值。缺陷正常/候选断言必须分离。

完整风险分类、责任任务与重放命令见契约，未验证问题没有伪装成已修复或已通过。
测试使用已存在 esbuild/Node runner，不安装依赖、不改 Yarn 锁文件。

## 实际验证与限制

44 tests passed / 0 failed / 0 skipped；专属 lint 和归档 verifier 通过。
Node 24.21.0，Windows；日志/命令/输入 SHA 见 validation JSON。
没有运行真实浏览器、网络 Bilibili 请求、设备、负载/内存或安装消费者矩阵。
编译测试只把冻结源码及受控依赖在内存打包，不能当作正式生产构建或重构完成。

## 下一步与回退

PKG-DANMUKU-02 从真实归档/冻结源码扩展浏览器、时钟、轨道、乱序/拒绝和销毁基线，
优先为已观察的异步输入、重复 start、Worker 相关问题建立受控复现。03/04/05 分别处理
输入、调度、渲染/设置/Worker，06 处理 TS 与旧根类型，07/08/09 做能力/组合/分发验收。

本批无消费者行为变更；如需回退，回退专属契约任务提交即可，保留旧 tarball 与日志
用于后续对照。缓存可重新下载，冻结 SHA 与元数据不能随当前源码变动而更新。
