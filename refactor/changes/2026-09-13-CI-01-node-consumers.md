# CI-01 同一 tarball 的 Node 消费者矩阵

基于 585e11c53c03b4b12933b21dcfe8c4a117299b2b，标准构建 Node 为 24.21.0。
新增 Node 20.19.0、22.12.0、24.21.0 的实际安装运行，CI-01 保持 doing。
这些是私有根包 engines 的两个分支边界与标准环境，不是发布包声明的最低 Node；
目前各发布包没有 engines.node，不能据此抬高消费者门槛或宣称更早 Node 不受支持。

## 实现与维护

package-check 仍在标准 Node 完成构建、Yarn pack、隔离安装、五个旧类型模式和八个
精确类型模式。报告增加真实源码 SHA、Yarn 版本/执行路径与发布基线成员指纹，保留
已校验的 published-artifacts。候选输出保持原路径、内容与 browser-artifacts 格式。

scripts/package-runtime.mjs 只依赖 Node 内置模块，接管原 package-consumer 的运行时
夹具装配；原导出继续转发，类型编译器留在 package-consumer。新增入口在选择的精确
Node 中，读取同一 package-check 报告、校验 HEAD 和 tarball 摘要，使用记录的 Yarn
1.22.22 在仓库外临时目录 offline/frozen 安装同一 tarball，核对锁不变、逐文件字节、
非 workspace 链接，再执行 require/ESM、legacy/runtime/global/AMD、SSR、语言和
Emitter 契约。真实 child Node 版本写入结果；不会悄悄回退到构建 Node。

发布基线也在该 Node 执行。默认值和 API 形状在同一环境比较；历史行为与候选分别报告。
每次消费生成 runtime-node-<version>.json、安装日志，失败时记录错误及 stdout/stderr，
finally 删除经过根路径校验的临时目录。配置/来源预检的早期失败由 workflow tee 日志
保存；尚未创建运行报告时不会伪造成功报告。旧输出无新增来源字段需重新 test:package。

三个系统的 browser-smoke 在打包后依次切到固定 Node 20/22、运行消费者，最后恢复
.node-version 并重装消费；浏览器工具继续使用标准 Node。工作流校验保护版本、执行
顺序、无条件步骤和恢复动作。每个 Node 复用同一构建，不重新生成候选。
新入口 yarn test:package:runtime 在标准环境运行；其他版本显式执行
node scripts/package-runtime.mjs --expected-node <exact version>。需要先运行 yarn test:package。
新测试加入 test:node 与 test:ci；现有构建/类型/包消费入口保留。没有新增 npm 依赖或锁变化。

## 实际发现：CORE-25

Node 20.19.0 的首轮在实际发布 5.4.0 的静态 option getter 触发
ReferenceError: navigator is not defined。当前候选默认值中的 navigator?.language
同样不能保护未声明的全局变量。较新 Node 提供 navigator，原来的测试因此漏检。

现在夹具在每个 Node 明确删除 navigator，精确记录旧/候选都抛出这个错误；然后在
相同受控 en-US navigator 下比较默认值，并恢复原全局描述符。这仅是区分两个测试
场景，不是修复生产代码，也不代表真实浏览器语言验收。新增 CORE-DEFAULTS-SSR-01
风险和 CORE-25 修复任务，REVIEW-01 依赖该任务。候选 knownRuntimeBlockers=1，
严格 test:package:release 因该问题失败；常规兼容测试中的历史失败观察不等于发布就绪。

## 验证与后续

具体版本、二进制/产物摘要、三个运行结果、初始失败、严格发布反例和最终本地 CI
见 [证据](../baselines/node-consumer-validation.json)。新自动化反例覆盖文件篡改、
路径穿越、workspace 链接、错误 Node、过期源码、遗漏消费者与错误恢复运行时。

本批没有播放器生产代码或公开类型改动，不需要生成或提交库产物；真实打包在忽略
缓存的独立快照中执行。没有新浏览器播放或远端 Actions 执行。每个系统的实际运行、
更早消费者范围、最低工具链干净安装、全插件安装矩阵及类型/设备全组合仍需补证。
下一步独立修复 CORE-25，并重跑这三个 Node 和浏览器语言默认值；CI-01 不标完成。
回退本批恢复原消费者装配和 workflow，保留 CORE-25 的缺陷记录与待办。

Node 本地二进制仅下载到忽略缓存，执行前按官方发布摘要核验：
[20.19.0](https://nodejs.org/download/release/v20.19.0/SHASUMS256.txt)、
[22.12.0](https://nodejs.org/download/release/v22.12.0/SHASUMS256.txt)。旧版本用于隔离兼容测试，
没有替换标准 Node 或更改包管理器。提交主题包含 [CI-01]；没有推送、部署或发布。

最终本地验证：完整 ci:check 2429 项（2031 单元、27 工程、371 基线），
定向 test:ci 44 项、元数据 9 项、actionlint 1.7.12 与定向只读 ESLint 全部通过。
严格发布反例按预期 exit 1；并未清除 CORE-25。
