# PKG-DASH-04：DASH 严格 TS 与兼容公开类型

起点 `7de04573`。四个已拆分 JS 模块迁移为 TS，新增 `src/types.ts` 描述窄宿主、两代 SDK
方法、selector/menu、事件和资源类型。纳入 strict/noUncheckedIndexedAccess，未加入 any、
通配模块声明或 dash.js 依赖。源码工厂直接使用公开 Option/Result，并有双向可赋值夹具。

## 类型兼容

保留原 .d.ts 入口、工厂与字面量插件名、同步 update、单参数无接收者的 getName。
新增 QualityLevel/AudioTrack/Config/Option/Result 命名类型及自定义 SDK 泛型；旧 object
回调依然可用。可选重载允许运行时原本支持的省略/undefined，最后保留必填重载以保护
`Parameters<typeof factory>[0]['quality']`。不要求消费者改变现有调用。

增加 ESM/CommonJS 类型桥和 legacy 的旧解析路径，所有 JS 分发文件路径不变。
原始 npm 声明的 legacy 消费夹具在 TS 4.3.5/5.9.3 通过，候选运行同样夹具也通过。
五种 TS/模块模式的新消费者零诊断，移除 expect-error 后八条非法调用全部被拒绝。

有限断言位于外部 art.dash 宿主、选定 SDK 方法族、非空轨道回退、Auto 与数字键边界。
内部类型保留 SDK 字段缺失可能；断言不引入运行时修正，不把不完整 SDK 静默变成成功。
源码与前一步运行代码相比只有局部别名和类型擦除，已知行为修正仍由 03 的契约测试保护。
详情见 [包内架构](../../packages/artplayer-plugin-dash-control/ARCHITECTURE.md)。

## 编辑器与验证

build:ts 将 DASH 加入已存在的 AST 生成器，生成可独立编译的 callable/global 类型桥，
避免旧 default export 与 export= 混用。实际生成文件有可重复生成、TS 4.3/5.9 正反例验证。
新增 Monaco worker 用例，加载真实声明、检查回调/旧类型提取、拒绝错误返回并执行编译输出。
没有手改 docs/assets/ts，产物由标准脚本生成。实际 SDK 的类型/媒体组合仍由 05 核验。

新增 `yarn test:dash-types-package`，使用现有打包检查和隔离目录工具，在工作区外离线安装
核心与 DASH tarball，冻结锁重装，逐文件核对实际安装字节，编译时禁止回工作区解析类型。
首次打包发现新增 tsconfig.json 泄露，先保留失败再补 .npmignore；最终五种模式及每组八条
非法调用通过。此脚本只验收隔离类型，不替代 06 的完整运行时分发验收。

最终证据见 [冻结记录](../baselines/dash-types-validation.json)：

| 验证 | 结果 |
| --- | --- |
| 严格源码 | DASH 5 个自有 TS 模块，全仓 261 个生产 TS 文件通过 |
| 声明与隔离类型 | 新增 3 项类型基线通过；工作区与隔离 tarball 各 5 种模式，8 条非法用法均拒绝；旧实际 npm 声明对照通过 |
| 运行时 | 源码 116 项、带三格式的 Node 266 项通过 |
| 浏览器 | main 90 项（含核心/DASH Monaco 6 项）、legacy 84 项通过，无重试/跳过 |
| 完整 CI | 715 项：661 单元、14 工程、40 基线；隔离打包脚本随后独立执行并通过 |
| 构建 | 标准 build / build:ts 通过，三份 dist 与 docs/compiled 字节一致 |

DASH-TYPE-01 关闭；DASH-SDK-01/DASH-STATE-01、实际 SDK 类型/媒体及设备仍由 05 接续。
当前 217 项：74 done、3 doing、140 todo。没有增加依赖、改变版本或发布。
本地独立提交，回退同时恢复前一步 JS、声明和生成方式；保留 01～03 的基线与修复。
下一步 05 完成真实 dash.js 4.5.2/5.2.1 媒体、组合和示例验证，06 接续隔离安装/分发。
