# PKG-VTT-THUMB-04 历史模块形式与待决类型差异

## 已验证事实

在仓库外分别安装五个真实历史 npm 包和当前候选包，核心使用实际 packed candidate。
逐成员核对字节，并执行 offline/frozen 重装；验证脚本仍为
`yarn test:vtt-thumbnail-types-package`。本次从 17 格扩至 32 格默认导入矩阵，包含
TS 5.9.3 classic、NodeNext CJS/ESM、bundler，以及 TS 4.3.5 classic。
候选另含两个关闭 interop 的 classic 格。31 格编译通过，1 格准确复现历史错误：
1.1.0 NodeNext ESM 的声明被解释成不可调用的模块对象。候选成对声明已通过该格。

同一安装环境另验证 36 个 CommonJS 直接/default 类型提取与替换工厂形式，明确区分
历史声明和真实运行时。表中的直接调用指 `const value = require(package); value({})`；
default 调用指 `value.default({})`。类型侧使用 `import plugin = require(package)`，
同时检查 Parameters、ReturnType 和普通替换函数赋值。

| 版本 | 直接形式声明 | 直接调用运行时 | default 形式声明 | default 调用运行时 |
| --- | --- | --- | --- | --- |
| 1.0.1–1.0.3 | 通过 | TypeError，模块是对象 | TS2339，无 default 类型 | 可用 |
| 1.1.0 | 不可调用模块类型 | 可用 | 通过 | 无 default 函数 |
| 当前候选 | 保持 1.1.0 模块类型 | 可用 | 通过 | 可用 |

1.0.0 声明与其他 1.0.x 相同，但真实 bundle 加载即发生无效正则 SyntaxError，不能把其
声明通过算作运行时通过。历史复现断言与候选成功分开，不能把预期错误计作兼容批准。

## 需要保留为待决的边界

1.0.x 的 `Parameters<typeof plugin>`、`typeof plugin` 替换工厂可以只用于类型操作，
即使其声明描述的直接 JS 调用本来不可用，这些类型操作本身仍然成立。不能因此删掉它们
的兼容责任。1.1.0 已经改变这种形状，候选目前沿用 1.1.0；这不是本次新增的运行时回归，
但从 1.0.x 直接升级仍有类型迁移差异。

已验证两种简单合并方案的代价（TS 5.9 classic/NodeNext CJS、TS 4.3 classic）：

- `Factory & { default: Factory }` 让普通替换工厂缺少必需的 default 属性，TS2322。
- `Factory & { default?: Factory }` 保留该赋值，却让未经判空的 default 调用报 TS2722。

这些实验说明上述两种方案不能直接替换旧入口，不是对所有可能声明设计的数学证明。
没有修改全局 Function、引入 any 或关闭 strict 来掩盖冲突。

建议保留当前 1.1.0 默认导入/模块类型和实际运行时兼容别名，并明确记录较早类型消费者的
迁移方法：`import vtt from 'artplayer-plugin-vtt-thumbnail'` 后从 `typeof vtt` 提取，
或直接 `import type { Factory } from 'artplayer-plugin-vtt-thumbnail'`。需要准确异步结果时
使用 `/runtime`。这个建议尚需用户决定；未经确认不将 04 或 TYPE 风险标为完成。

## 本次交付与验证

新增可重跑的 CommonJS 消费者夹具，安装矩阵固定历史错误码；新增合并方案反例，固定
错误位置与错误码。默认/default 可用调用和候选所有正反例继续检查，不缩减前次范围。
结果见 [验证](../baselines/vtt-thumbnail-module-forms.json)。

生产源码、公开声明、manifest、dist 和 demo 均未改变，因此复用 db358a3a 的生产及
54 项浏览器证据；本次测试/文档检查不能替代后续设备与组合验收。包内架构和进度同步。
无新依赖，不推送或发布。回退本检查点只移除扩展矩阵/反例和记录，不改变生产行为。
