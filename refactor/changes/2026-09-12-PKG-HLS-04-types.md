# PKG-HLS-04：HLS 严格 TypeScript 与兼容声明

## 实现与兼容边界

上一任务建立的入口、映射、菜单、SDK 订阅模块迁移到 .ts，新增 types.ts 描述窄宿主、
SDK 可选能力和选择模型。五个自有模块均纳入 strict/noUncheckedIndexedAccess，
不引入 any、通配模块声明或 Hls 生产依赖。源码直接复用公开 Option/Result 类型，
独立消费夹具校验源码工厂与公开工厂相互可赋值。实际模块地图见包内 ARCHITECTURE.md。

公开工厂、字面量 name、同步 update、控件名/图标、DOM/CSS 和运行时根/legacy 路径不变。
getName 保留原 SDK 对象身份和普通函数调用，索引准确标为可选；默认质量/音轨字段可以推断，
调用方可用泛型或回调注解选择真实 SDK 类型。旧 object 参数 formatter 仍可赋值。
新增可选配置重载支持原来运行时就允许的省略/undefined；保留最后的必填重载，
以兼容旧 Parameters<typeof factory>[0]['quality'] 类型提取，不将其改成可能 undefined。
旧声明的 name 已是字面量，本次没有新增 name 写入限制。

.d.ts 继续为历史类型入口，.d.cts/.d.mts 提供 callable CommonJS/ESM 默认和命名类型桥，
legacy 的 typesVersions 支持 TS 4.3 Node10 查找。没有改变三个 JavaScript 文件的路径，
没有提前升级版本；逐包 next-major 与最终安装包检查继续由发布任务及 HLS-06 执行。

有限断言均有边界说明：入口承接外部附加的 art.hls，仍通过历史 errorHandle/media 检查；
SDK on/off 断言位于函数能力检查之后；选择项索引位于相等长度检查之后。它们不验证全部
外部 SDK 结构，不能替代运行时契约测试。新增的局部对象别名保持原方法接收者。

## 在线编辑器修复

旧生成方式保留 default/named exports 又附加 export=，严格编译生成结果会报告 TS2309。
新增 scripts/plugin-editor-types.mjs 使用 AST 为 HLS 生成私有定义和 callable/global 类型桥，
保留泛型默认和重载，拒绝未知 import/export，不静默删除依赖。build:ts 在写入该声明前
以 TS 4.3.5/5.9.3 对核心+插件独立语义检查，skipLibCheck=false。
生成器暂仅应用已验证的 HLS，其他插件按各自迁移任务接续；未手改 docs/assets/ts。

新测试检查输出可再生成、三条错误用法确实拒绝、损坏声明/未解析依赖不会被隐藏。
真实 Monaco worker 用例在三个浏览器中加载实际生成文件，验证默认字段、旧类型提取、
错误 formatter 诊断，并执行编译后的插件工厂。原核心 Monaco 示例也重跑并播放成功。
HLS 编辑器用例自身只执行工厂，不宣称播放；实际播放由独立 HLS SDK 矩阵验证。
首轮编辑器测试把重载错误预期写成 2322；实际 worker 正确返回 2769，无其他正例诊断。
按真实重载语义纠正断言后，最终六项全部通过，没有修改声明来容忍非法返回。

## 验收证据

冻结文件为 [hls-types-validation.json](../baselines/hls-types-validation.json)，保留源码/类型/
生成脚本及产物指纹、浏览器输入与各用例结果、CI 日志摘要；旧任务冻结证据不覆盖。

| 项目 | 本次结果 |
| --- | --- |
| 结构与类型 | HLS 五个 TS 模块；全仓实际已迁移生产 TS 254 个严格检查通过 |
| 旧/新类型消费者 | TS 5.9 Node10 CJS、NodeNext CJS/ESM、Bundler ESM 和 TS 4.3 Node10 CJS 正例零诊断，每组八条非法用法拒绝；另检查 CJS 命名空间与源码工厂 |
| 实际 SDK 类型 | 真实 Hls.js 1.5.17 的 Level/MediaPlaylist 泛型消费；TS 5.9 零错误，TS 4.3 与 SDK-only 对照均仅两个既有 DOM 类型错误，插件无新增 |
| Node 与产物 | 源码/发布专项 56 通过；加 main/legacy/ESM 构建共享契约累计 83 通过 |
| 实际播放 | modern/legacy 各 35 passed、16 skipped、0 failed/retry，输入 SHA 与最终构建一致；覆盖新旧核心和插件四组合、选择/切源/失败/销毁/SDK 事件同步 |
| 编辑器 | 核心+HLS 在 Chromium/Firefox/WebKit 共六项通过，无失败/重试/跳过 |
| 完整本地 CI | yarn ci:check：536 项通过，496 单元、11 工程、29 基线；现有生成核心 editor unused eslint-disable 警告未手改 |
| 构建 | yarn build artplayer-plugin-hls-control、yarn build:ts 通过；三份 dist 与 docs/compiled 字节一致 |

main 为 5266 raw / 2539 gzip9 字节，legacy 5322 / 2564，ESM 9649 / 3117。
与上一任务相比只有局部别名/类型擦除后的微小变化，类型依赖未进入运行包，不声称体积优化。

## 未覆盖范围与交接

TS 4.3 的 MediaDecodingConfiguration/MediaCapabilitiesDecodingInfo 缺失来自真实 SDK
声明与旧 lib.dom 组合；保留明确对照，不加虚假 DOM 定义，不以 skipLibCheck 隐藏。
独立插件的旧编译器验收仍严格零诊断。SDK-01 和 HLS-ENV-01 保持 open。
Windows WebKit 的 16 个播放跳过源于已确认缺少 MSE；能力/失败清理及 Monaco 测试照常运行。
Safari/native、SDK worker/版本/分组轨道、官方示例及隔离 tarball 为 HLS-05/06 和发布门槛。

本步没有新增依赖；改进现有 build:ts、typecheck，新增生成 helper 和专项测试，已纳入
现有 test:baseline/ci:check。包内文档、类型入口和生成产物随源码一起更新。
本任务独立提交主题：refactor(hls): [PKG-HLS-04] migrate modules and compatible types。
回退该 commit 可恢复上一任务四模块 JS 和旧类型/生成行为；保留 HLS-01～03 的基线与修复。
提交并核实 Git 状态后进入 PKG-HLS-05。全项目目标继续，没有 push/tag/publish/merge。
