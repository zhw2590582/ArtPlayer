# CI-TYPES-01：Audio/HLS 安装后类型消费者

基线 `210484c443077da389e048afb76a229f2b1e56bc`。此前通用 tarball 检查
只执行核心/Chapter 类型，Audio/HLS 的完整正反例仅在仓库内编译。本任务把
这两包实际安装的类型检查接入 `test:package --browser` 和相应 `--include`。

## 实现与兼容边界

`scripts/consumers/types.ts` 负责严格编译、真实路径隔离和逐行负例验证；
`packages.ts` 只选择已安装且明确登记的包，直接复用完整的 `test/types/`
用例并记录 SHA-256。拆分避免每包重复实现编译器循环，也不把其他包的
特殊历史声明用一个空导入 smoke 替代。其余专用 package-types 检查仍保留。

五模式为 TS 5.9.3 node10 CommonJS、NodeNext CommonJS、NodeNext ESM、
bundler ESM，加 TS 4.3.5 node10 CommonJS。旧编译器的一处类型适配仅覆盖
共享 compiler API，不传入新版 resolution 模式。未增加依赖或修改锁文件。

首先保留 `@ts-expect-error` 编译完整正反例；再中和指令、保留行号，要求
每条无效调用所在行实际出现诊断，并拒绝其他位置的诊断。夹具要求指令紧邻
单行无效调用。每个解析文件的 realpath 必须在隔离安装目录内，唯一例外是
选定编译器自身目录下的标准 lib 声明；禁止借用 workspace 链接或外部声明。

Audio 保留根/legacy 的历史参数提取、函数替换和必需 URL，`/runtime`
保留准确的局部 update、HTMLAudioElement 和同步 void；共 12 条无效调用。
HLS 保留根/legacy、历史 Option 提取、自定义轨道泛型和 formatter 的可选
index；共 8 条无效调用。本任务没有改任何生产源码、公开声明或运行时行为。

新模块纳入严格 docs-tools TS 和 lint，测试纳入 test:node。维护说明位于
scripts/consumers/README.md、两包 README、test/package/README.md；影响
说明保持十九包完整安装消费缺口，不把新增类型覆盖当成运行时/浏览器准入。

## 验证与报告

执行命令和最终安装报告摘要见
[机器证据](../baselines/installed-plugin-types-validation.json)。原有报告的
typeScope/runtimeScope 仍表示核心/Chapter，新增 additionalTypeScope 和
pluginTypes 单列两包、编译器、实际声明路径、夹具指纹及负例行号/错误码。

本次没有执行远端 Actions、完整浏览器矩阵、真实设备验收或发布。CI-01、
CI-04 与两包组合验收保持未完成；本任务只关闭安装后的类型检查接入缺口。
安装报告中的 source 是修改前 HEAD，报告与本提交一起解释工作树验证证据，
不宣称提交后精确 HEAD 的浏览器准入。浏览器运行仍须遵守候选新鲜度检查。

## 回退

回退本任务独立提交恢复原通用类型检查范围和脚本入口，生产 API 与依赖不变。
既有包内类型用例继续保留；不需要修改消费者代码或降级运行时包。
