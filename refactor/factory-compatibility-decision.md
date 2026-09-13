# Canvas / Ambilight 工厂类型兼容取舍（已确认并实施）

2026-09-13用户已接受统一规则，见[确认记录](type-compatibility-policy.md)。
PKG-FACTORY-01随后完成两包声明、/runtime、迁移文档及真实安装验证，见
[完成记录](changes/2026-09-13-PKG-FACTORY-01-compatible-types.md)和
[验证证据](baselines/factory-compatibility-validation.json)。以下矩阵保留决策时的
历史方案对照，不能将其中故意展示的失败方案视为当前生产实现。

## 问题与真实发布对照

两包 npm 1.0.0 声明均为 `export =`，npm 1.1.0 均改为 `export default`。
归档由各包 release 基线核验；测试读取真实 tarball 中的声明，不用工作区文件替代。

修复前为了兼容运行时 `require(package)` 和 `require(package).default`，公开 Factory
增加了必填 `.default`。这使 1.1.0 原本合法的 `const replacement: typeof factory = ...`
报 TS2741。Ambilight 另外增加的可选参数重载也使只接受必填参数的旧替代工厂报 TS2322；
保留最后一个必填重载只能保住 Parameters，无法保住整个函数的赋值关系。

在相同 strict、skipLibCheck=false、esModuleInterop=true、Node/CommonJS 配置下，
TypeScript 5.9.3 和 4.3.5 的结果一致：

| 声明方案 | 普通函数赋给 typeof 默认工厂 | import module = require 后直接调用 | import module = require 后调用 module.default |
| --- | --- | --- | --- |
| 实际发布 1.0.0 | 通过 | 通过 | TS2339 |
| 实际发布 1.1.0 | 通过 | TS2349 | 通过 |
| export = + 必填 self.default | TS2741 | 通过 | 通过 |
| export = + 可选 self.default | 通过 | 通过 | TS2722 |
| 纯函数 export default（推荐） | 通过 | TS2349 | 通过 |
| 纯函数 export = | 通过 | 通过 | TS2339 |

共 72 个精确编译场景，另有两编译器的 Ambilight 可选重载独立对照。
第一列针对各版本的 Parameters 生成替代工厂，不声称 1.0.0 与 1.1.0 的参数类型相同。
本测试不是所有模块解析方式或打包安装验收，不能替代后续安装矩阵。

这是同一路径类型表达的冲突：要让任意合法普通函数可以赋值，就不能要求该函数必须
拥有 `.default`；但把属性设为可选，又不能允许 strict 模式下无检查地调用它。
按 import/require 分配声明可以改善模块解析，却不能仅凭同一个 CommonJS 消费文件
区分默认导入与 `import = require`，因此不能把拆 `.d.mts` / `.d.cts` 当作全部兼容的证据。

## 推荐方案的具体影响

以两包已发布 1.1.0 的默认工厂类型为兼容基准：Canvas 回调可选；Ambilight 配置参数
必填、字段可选。恢复默认导出为无必填自属性的纯函数，完整保留普通替代工厂、Parameters、
ReturnType 和 Result 的赋值关系。可选参数、自 `.default` 等精确运行时形状使用独立
RuntimeFactory 类型；不把它强制附加到默认工厂类型上。

运行时保留当前可调用工厂、`.default` 自别名、global、main/legacy/ESM 的实际行为。
JS 使用者无需因为本方案修改调用。受影响的是仍使用 1.0.0 风格 TypeScript
`import factory = require('包名'); factory(...)` 的代码；它在实际 1.1.0 声明中已经失败，
当前重构中曾被恢复，采用推荐方案后不再由默认声明恢复该路径。

迁移示例（两包相同，示例采用 Ambilight）：

```ts
// 1.0.0 风格；推荐方案不再支持这条直接调用的类型路径。
import factory = require('artplayer-plugin-ambilight')
factory({})

// 推荐：默认导入，保留 1.1.0 的纯函数类型。
import ambilight from 'artplayer-plugin-ambilight'
ambilight({})

// 继续使用 import = require 的用户，可调用真实存在的 .default。
import module = require('artplayer-plugin-ambilight')
module.default({})
```

提案核心签名仍由 `scripts/factory-assignability.mjs` 的 declaration(pkg, 'latest-default')
生成用于历史对照。实际生产声明已加入命名类型与/runtime格式桥，并完成34个真实安装
配置验证。根NodeNext ESM保留1.1.0 namespace形状；准确默认导入应使用/runtime。

## 决策与后续

- 状态：用户已明确接受上述较早版本TypeScript导入迁移；不因批准而跳过验证。
- 已完成：两包声明、RuntimeFactory、全工厂赋值测试、编辑器与文档、真实安装消费矩阵。
  JS产物没有修改，现有实际分发身份测试通过，不声称新增浏览器设备证据。
- 仍不得把optional .default、any、skipLibCheck或删除历史消费者当作修复。
- PKG-CANVAS-05、PKG-AMBILIGHT-05、REL-01的此项依赖已满足，各自剩余验证继续实施。

证据：[编译矩阵](baselines/factory-compatibility-proposals.json)、
[原始回归](baselines/factory-assignment-gaps.json)。
